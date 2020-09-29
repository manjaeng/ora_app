﻿;(function (window, $, undefined) { ;(function () {
    var VERSION = '2.2.3',
        pluginName = 'datepicker',
        autoInitSelector = '.datepicker-here',
        $body, $datepickersContainer,
        containerBuilt = false,
        baseTemplate = '' +
            '<div class="datepicker">' +
            '<i class="datepicker--pointer"></i>' +
            '<nav class="datepicker--nav"></nav>' +
            '<div class="datepicker--content"></div>' +
            '</div>',
        defaults = {
            classes: '',
            inline: false,
            language: 'kr',
            startDate: new Date(),
            firstDay: '',
            weekends: [6, 0],
            dateFormat: '',
            altField: '',
            altFieldDateFormat: '@',
            toggleSelected: true,
            keyboardNav: true,

            position: 'bottom left',
            offset: 12,

            view: 'days',
            minView: 'days',

            showOtherMonths: true,
            selectOtherMonths: true,
            moveToOtherMonthsOnSelect: true,

            showOtherYears: true,
            selectOtherYears: true,
            moveToOtherYearsOnSelect: true,

            minDate: '',
            maxDate: '',
            disableNavWhenOutOfRange: true,

            multipleDates: false, // Boolean or Number
            multipleDatesSeparator: ',',
            range: false,

            todayButton: false,
            clearButton: false,

            showEvent: 'focus',
            autoClose: false,

            // navigation
            monthsField: 'monthsShort',
            prevHtml: '<svg><path d="M 17,12 l -5,5 l 5,5"></path></svg>',
            nextHtml: '<svg><path d="M 14,12 l 5,5 l -5,5"></path></svg>',
            navTitles: {
                days: 'MM, <i>yyyy</i>',
                months: 'yyyy',
                years: 'yyyy1 - yyyy2'
            },

            // timepicker
            timepicker: false,
            onlyTimepicker: false,
            dateTimeSeparator: ' ',
            timeFormat: '',
            minHours: 0,
            maxHours: 24,
            minMinutes: 0,
            maxMinutes: 59,
            hoursStep: 1,
            minutesStep: 1,

            // events
            onSelect: '',
            onShow: '',
            onHide: '',
            onChangeMonth: '',
            onChangeYear: '',
            onChangeDecade: '',
            onChangeView: '',
            onRenderCell: ''
        },
        hotKeys = {
            'ctrlRight': [17, 39],
            'ctrlUp': [17, 38],
            'ctrlLeft': [17, 37],
            'ctrlDown': [17, 40],
            'shiftRight': [16, 39],
            'shiftUp': [16, 38],
            'shiftLeft': [16, 37],
            'shiftDown': [16, 40],
            'altUp': [18, 38],
            'altRight': [18, 39],
            'altLeft': [18, 37],
            'altDown': [18, 40],
            'ctrlShiftUp': [16, 17, 38]
        },
        datepicker;

    var Datepicker  = function (el, options) {
        this.el = el;
        this.$el = $(el);

        this.opts = $.extend(true, {}, defaults, options, this.$el.data());

        if ($body == undefined) {
            $body = $('body');
        }

        if (!this.opts.startDate) {
            this.opts.startDate = new Date();
        }

        if (this.el.nodeName == 'INPUT') {
            this.elIsInput = true;
        }

        if (this.opts.altField) {
            this.$altField = typeof this.opts.altField == 'string' ? $(this.opts.altField) : this.opts.altField;
        }

        this.inited = false;
        this.visible = false;
        this.silent = false; // Need to prevent unnecessary rendering

        this.currentDate = this.opts.startDate;
        this.currentView = this.opts.view;
        this._createShortCuts();
        this.selectedDates = [];
        this.views = {};
        this.keys = [];
        this.minRange = '';
        this.maxRange = '';
        this._prevOnSelectValue = '';

        this.init()
    };

    datepicker = Datepicker;

    datepicker.prototype = {
        VERSION: VERSION,
        viewIndexes: ['days', 'months', 'years'],

        init: function () {
            if (!containerBuilt && !this.opts.inline && this.elIsInput) {
                this._buildDatepickersContainer();
            }
            this._buildBaseHtml();
            this._defineLocale(this.opts.language);
            this._syncWithMinMaxDates();

            if (this.elIsInput) {
                if (!this.opts.inline) {
                    // Set extra classes for proper transitions
                    this._setPositionClasses(this.opts.position);
                    this._bindEvents()
                }
                if (this.opts.keyboardNav && !this.opts.onlyTimepicker) {
                    this._bindKeyboardEvents();
                }
                this.$datepicker.on('mousedown', this._onMouseDownDatepicker.bind(this));
                this.$datepicker.on('mouseup', this._onMouseUpDatepicker.bind(this));
            }

            if (this.opts.classes) {
                this.$datepicker.addClass(this.opts.classes)
            }

            if (this.opts.timepicker) {
                this.timepicker = new $.fn.datepicker.Timepicker(this, this.opts);
                this._bindTimepickerEvents();
            }

            if (this.opts.onlyTimepicker) {
                this.$datepicker.addClass('-only-timepicker-');
            }

            this.views[this.currentView] = new $.fn.datepicker.Body(this, this.currentView, this.opts);
            this.views[this.currentView].show();
            this.nav = new $.fn.datepicker.Navigation(this, this.opts);
            this.view = this.currentView;

            this.$el.on('clickCell.adp', this._onClickCell.bind(this));
            this.$datepicker.on('mouseenter', '.datepicker--cell', this._onMouseEnterCell.bind(this));
            this.$datepicker.on('mouseleave', '.datepicker--cell', this._onMouseLeaveCell.bind(this));

            this.inited = true;
        },

        _createShortCuts: function () {
            this.minDate = this.opts.minDate ? this.opts.minDate : new Date(-8639999913600000);
            this.maxDate = this.opts.maxDate ? this.opts.maxDate : new Date(8639999913600000);
        },

        _bindEvents : function () {
            this.$el.on(this.opts.showEvent + '.adp', this._onShowEvent.bind(this));
            this.$el.on('mouseup.adp', this._onMouseUpEl.bind(this));
            this.$el.on('blur.adp', this._onBlur.bind(this));
            this.$el.on('keyup.adp', this._onKeyUpGeneral.bind(this));
            $(window).on('resize.adp', this._onResize.bind(this));
            $('body').on('mouseup.adp', this._onMouseUpBody.bind(this));
        },

        _bindKeyboardEvents: function () {
            this.$el.on('keydown.adp', this._onKeyDown.bind(this));
            this.$el.on('keyup.adp', this._onKeyUp.bind(this));
            this.$el.on('hotKey.adp', this._onHotKey.bind(this));
        },

        _bindTimepickerEvents: function () {
            this.$el.on('timeChange.adp', this._onTimeChange.bind(this));
        },

        isWeekend: function (day) {
            return this.opts.weekends.indexOf(day) !== -1;
        },

        _defineLocale: function (lang) {
            if (typeof lang == 'string') {
                this.loc = $.fn.datepicker.language[lang];
                if (!this.loc) {
                    console.warn('Can\'t find language "' + lang + '" in Datepicker.language, will use "kr" instead');
                    this.loc = $.extend(true, {}, $.fn.datepicker.language.kr)
                }

                this.loc = $.extend(true, {}, $.fn.datepicker.language.kr, $.fn.datepicker.language[lang])
            } else {
                this.loc = $.extend(true, {}, $.fn.datepicker.language.kr, lang)
            }

            if (this.opts.dateFormat) {
                this.loc.dateFormat = this.opts.dateFormat
            }

            if (this.opts.timeFormat) {
                this.loc.timeFormat = this.opts.timeFormat
            }

            if (this.opts.firstDay !== '') {
                this.loc.firstDay = this.opts.firstDay
            }

            if (this.opts.timepicker) {
                this.loc.dateFormat = [this.loc.dateFormat, this.loc.timeFormat].join(this.opts.dateTimeSeparator);
            }

            if (this.opts.onlyTimepicker) {
                this.loc.dateFormat = this.loc.timeFormat;
            }

            var boundary = this._getWordBoundaryRegExp;
            if (this.loc.timeFormat.match(boundary('aa')) ||
                this.loc.timeFormat.match(boundary('AA'))
            ) {
               this.ampm = true;
            }
        },

        _buildDatepickersContainer: function () {
            containerBuilt = true;
            $body.append('<div class="datepickers-container" id="datepickers-container"></div>');
            $datepickersContainer = $('#datepickers-container');
        },

        _buildBaseHtml: function () {
            var $appendTarget,
                $inline = $('<div class="datepicker-inline">');

            if(this.el.nodeName == 'INPUT') {
                if (!this.opts.inline) {
                    $appendTarget = $datepickersContainer;
                } else {
                    $appendTarget = $inline.insertAfter(this.$el)
                }
            } else {
                $appendTarget = $inline.appendTo(this.$el)
            }

            this.$datepicker = $(baseTemplate).appendTo($appendTarget);
            this.$content = $('.datepicker--content', this.$datepicker);
            this.$nav = $('.datepicker--nav', this.$datepicker);
        },

        _triggerOnChange: function () {
            if (!this.selectedDates.length) {
                // Prevent from triggering multiple onSelect callback with same argument (empty string) in IE10-11
                if (this._prevOnSelectValue === '') return;
                this._prevOnSelectValue = '';
                return this.opts.onSelect('', '', this);
            }

            var selectedDates = this.selectedDates,
                parsedSelected = datepicker.getParsedDate(selectedDates[0]),
                formattedDates,
                _this = this,
                dates = new Date(
                    parsedSelected.year,
                    parsedSelected.month,
                    parsedSelected.date,
                    parsedSelected.hours,
                    parsedSelected.minutes
                );

                formattedDates = selectedDates.map(function (date) {
                    return _this.formatDate(_this.loc.dateFormat, date)
                }).join(this.opts.multipleDatesSeparator);

            // Create new dates array, to separate it from original selectedDates
            if (this.opts.multipleDates || this.opts.range) {
                dates = selectedDates.map(function(date) {
                    var parsedDate = datepicker.getParsedDate(date);
                    return new Date(
                        parsedDate.year,
                        parsedDate.month,
                        parsedDate.date,
                        parsedDate.hours,
                        parsedDate.minutes
                    );
                })
            }

            this._prevOnSelectValue = formattedDates;
            this.opts.onSelect(formattedDates, dates, this);
        },

        next: function () {
            var d = this.parsedDate,
                o = this.opts;
            switch (this.view) {
                case 'days':
                    this.date = new Date(d.year, d.month + 1, 1);
                    if (o.onChangeMonth) o.onChangeMonth(this.parsedDate.month, this.parsedDate.year);
                    break;
                case 'months':
                    this.date = new Date(d.year + 1, d.month, 1);
                    if (o.onChangeYear) o.onChangeYear(this.parsedDate.year);
                    break;
                case 'years':
                    this.date = new Date(d.year + 10, 0, 1);
                    if (o.onChangeDecade) o.onChangeDecade(this.curDecade);
                    break;
            }
        },

        prev: function () {
            var d = this.parsedDate,
                o = this.opts;
            switch (this.view) {
                case 'days':
                    this.date = new Date(d.year, d.month - 1, 1);
                    if (o.onChangeMonth) o.onChangeMonth(this.parsedDate.month, this.parsedDate.year);
                    break;
                case 'months':
                    this.date = new Date(d.year - 1, d.month, 1);
                    if (o.onChangeYear) o.onChangeYear(this.parsedDate.year);
                    break;
                case 'years':
                    this.date = new Date(d.year - 10, 0, 1);
                    if (o.onChangeDecade) o.onChangeDecade(this.curDecade);
                    break;
            }
        },

        formatDate: function (string, date) {
            date = date || this.date;
            var result = string,
                boundary = this._getWordBoundaryRegExp,
                locale = this.loc,
                leadingZero = datepicker.getLeadingZeroNum,
                decade = datepicker.getDecade(date),
                d = datepicker.getParsedDate(date),
                fullHours = d.fullHours,
                hours = d.hours,
                ampm = string.match(boundary('aa')) || string.match(boundary('AA')),
                dayPeriod = 'am',
                replacer = this._replacer,
                validHours;

            if (this.opts.timepicker && this.timepicker && ampm) {
                validHours = this.timepicker._getValidHoursFromDate(date, ampm);
                fullHours = leadingZero(validHours.hours);
                hours = validHours.hours;
                dayPeriod = validHours.dayPeriod;
            }


            switch (true) {
                case /@/.test(result):
                    result = result.replace(/@/, date.getTime());
                case /aa/.test(result):
                    result = replacer(result, boundary('aa'), dayPeriod);
                case /AA/.test(result):
                    result = replacer(result, boundary('AA'), dayPeriod.toUpperCase());
                case /dd/.test(result):
                    result = replacer(result, boundary('dd'), d.fullDate);
                case /d/.test(result):
                    result = replacer(result, boundary('d'), d.date);
                case /DD/.test(result):
                    result = replacer(result, boundary('DD'), locale.days[d.day]);
                case /D/.test(result):
                    result = replacer(result, boundary('D'), locale.daysShort[d.day]);
                case /mm/.test(result):
                    result = replacer(result, boundary('mm'), d.fullMonth);
                case /m/.test(result):
                    result = replacer(result, boundary('m'), d.month + 1);
                case /MM/.test(result):
                    result = replacer(result, boundary('MM'), this.loc.months[d.month]);
                case /M/.test(result):
                    result = replacer(result, boundary('M'), locale.monthsShort[d.month]);
                case /ii/.test(result):
                    result = replacer(result, boundary('ii'), d.fullMinutes);
                case /i/.test(result):
                    result = replacer(result, boundary('i'), d.minutes);
                case /hh/.test(result):
                    result = replacer(result, boundary('hh'), fullHours);
                case /h/.test(result):
                    result = replacer(result, boundary('h'), hours);
                case /yyyy/.test(result):
                    result = replacer(result, boundary('yyyy'), d.year);
                case /yyyy1/.test(result):
                    result = replacer(result, boundary('yyyy1'), decade[0]);
                case /yyyy2/.test(result):
                    result = replacer(result, boundary('yyyy2'), decade[1]);
                case /yy/.test(result):
                    result = replacer(result, boundary('yy'), d.year.toString().slice(-2));
            }

            return result;
        },

        _replacer: function (str, reg, data) {
            return str.replace(reg, function (match, p1,p2,p3) {
                return p1 + data + p3;
            })
        },

        _getWordBoundaryRegExp: function (sign) {
            var symbols = '\\s|\\.|-|/|\\\\|,|\\$|\\!|\\?|:|;';

            return new RegExp('(^|>|' + symbols + ')(' + sign + ')($|<|' + symbols + ')', 'g');
        },


        selectDate: function (date,noEvent) {
            var _this = this,
                opts = _this.opts,
                d = _this.parsedDate,
                selectedDates = _this.selectedDates,
                len = selectedDates.length,
                newDate = '';

            if (Array.isArray(date)) {
                date.forEach(function (d) {
                    _this.selectDate(d)
                });
                return;
            }

            if (!(date instanceof Date)) return;

            this.lastSelectedDate = date;

            // Set new time values from Date
            if (this.timepicker) {
                this.timepicker._setTime(date);
            }

            // On this step timepicker will set valid values in it's instance
            _this._trigger('selectDate', date);

            // Set correct time values after timepicker's validation
            // Prevent from setting hours or minutes which values are lesser then `min` value or
            // greater then `max` value
            if (this.timepicker) {
                date.setHours(this.timepicker.hours);
                date.setMinutes(this.timepicker.minutes)

            }
            

            if (_this.view == 'days') {
                if (date.getMonth() != d.month && opts.moveToOtherMonthsOnSelect) {
                    newDate = new Date(date.getFullYear(), date.getMonth(), 1);
                }
            }

            if (_this.view == 'years') {
                if (date.getFullYear() != d.year && opts.moveToOtherYearsOnSelect) {
                    newDate = new Date(date.getFullYear(), 0, 1);
                }
            }

            if (newDate) {
                _this.silent = true;
                _this.date = newDate;
                _this.silent = false;
                _this.nav._render()
            }

            if (opts.multipleDates && !opts.range) { // Set priority to range functionality
                if (len === opts.multipleDates) return;
                if (!_this._isSelected(date)) {
                    _this.selectedDates.push(date);
                }
            } else if (opts.range) {
                if (len == 2) {
                    _this.selectedDates = [date];
                    _this.minRange = date;
                    _this.maxRange = '';
                } else if (len == 1) {
                    _this.selectedDates.push(date);
                    if (!_this.maxRange){
                        _this.maxRange = date;
                    } else {
                        _this.minRange = date;
                    }
                    // Swap dates if they were selected via dp.selectDate() and second date was smaller then first
                    if (datepicker.bigger(_this.maxRange, _this.minRange)) {
                        _this.maxRange = _this.minRange;
                        _this.minRange = date;
                    }
                    _this.selectedDates = [_this.minRange, _this.maxRange]

                } else {
                    _this.selectedDates = [date];
                    _this.minRange = date;
                }
            } else {
                _this.selectedDates = [date];
            }

            _this._setInputValue();

            if (opts.onSelect) {
            	
            	if(!noEvent){
            		_this._triggerOnChange();
            	}
            }

            if (opts.autoClose && !this.timepickerIsActive) {
                if (!opts.multipleDates && !opts.range) {
                    _this.hide();
                } else if (opts.range && _this.selectedDates.length == 2) {
                    _this.hide();
                }
            }

            _this.views[this.currentView]._render()
        },

        removeDate: function (date) {
            var selected = this.selectedDates,
                _this = this;

            if (!(date instanceof Date)) return;

            return selected.some(function (curDate, i) {
                if (datepicker.isSame(curDate, date)) {
                    selected.splice(i, 1);

                    if (!_this.selectedDates.length) {
                        _this.minRange = '';
                        _this.maxRange = '';
                        _this.lastSelectedDate = '';
                    } else {
                        _this.lastSelectedDate = _this.selectedDates[_this.selectedDates.length - 1];
                    }

                    _this.views[_this.currentView]._render();
                    _this._setInputValue();

                    if (_this.opts.onSelect) {
                        _this._triggerOnChange();
                    }

                    return true
                }
            })
        },

        today: function () {
            this.silent = true;
            this.view = this.opts.minView;
            this.silent = false;
            this.date = new Date();

            if (this.opts.todayButton instanceof Date) {
                this.selectDate(this.opts.todayButton)
            }
        },

        clear: function () {
            this.selectedDates = [];
            this.minRange = '';
            this.maxRange = '';
            this.views[this.currentView]._render();
            this._setInputValue();
            if (this.opts.onSelect) {
                this._triggerOnChange()
            }
        },

        /**
         * Updates datepicker options
         * @param {String|Object} param - parameter's name to update. If object then it will extend current options
         * @param {String|Number|Object} [value] - new param value
         */
        update: function (param, value) {
            var len = arguments.length,
                lastSelectedDate = this.lastSelectedDate;

            if (len == 2) {
                this.opts[param] = value;
            } else if (len == 1 && typeof param == 'object') {
                this.opts = $.extend(true, this.opts, param)
            }

            this._createShortCuts();
            this._syncWithMinMaxDates();
            this._defineLocale(this.opts.language);
            this.nav._addButtonsIfNeed();
            if (!this.opts.onlyTimepicker) this.nav._render();
            this.views[this.currentView]._render();

            if (this.elIsInput && !this.opts.inline) {
                this._setPositionClasses(this.opts.position);
                if (this.visible) {
                    this.setPosition(this.opts.position)
                }
            }

            if (this.opts.classes) {
                this.$datepicker.addClass(this.opts.classes)
            }

            if (this.opts.onlyTimepicker) {
                this.$datepicker.addClass('-only-timepicker-');
            }

            if (this.opts.timepicker) {
                if (lastSelectedDate) this.timepicker._handleDate(lastSelectedDate);
                this.timepicker._updateRanges();
                this.timepicker._updateCurrentTime();
                // Change hours and minutes if it's values have been changed through min/max hours/minutes
                if (lastSelectedDate) {
                    lastSelectedDate.setHours(this.timepicker.hours);
                    lastSelectedDate.setMinutes(this.timepicker.minutes);
                }
            }

            this._setInputValue();

            return this;
        },

        _syncWithMinMaxDates: function () {
            var curTime = this.date.getTime();
            this.silent = true;
            if (this.minTime > curTime) {
                this.date = this.minDate;
            }

            if (this.maxTime < curTime) {
                this.date = this.maxDate;
            }
            this.silent = false;
        },

        _isSelected: function (checkDate, cellType) {
            var res = false;
            this.selectedDates.some(function (date) {
                if (datepicker.isSame(date, checkDate, cellType)) {
                    res = date;
                    return true;
                }
            });
            return res;
        },

        _setInputValue: function () {
            var _this = this,
                opts = _this.opts,
                format = _this.loc.dateFormat,
                altFormat = opts.altFieldDateFormat,
                value = _this.selectedDates.map(function (date) {
                    return _this.formatDate(format, date)
                }),
                altValues;

            if (opts.altField && _this.$altField.length) {
                altValues = this.selectedDates.map(function (date) {
                    return _this.formatDate(altFormat, date)
                });
                altValues = altValues.join(this.opts.multipleDatesSeparator);
                this.$altField.val(altValues);
            }

            value = value.join(this.opts.multipleDatesSeparator);
            this.$el.val(value)
        },

        /**
         * Check if date is between minDate and maxDate
         * @param date {object} - date object
         * @param type {string} - cell type
         * @returns {boolean}
         * @private
         */
        _isInRange: function (date, type) {
            var time = date.getTime(),
                d = datepicker.getParsedDate(date),
                min = datepicker.getParsedDate(this.minDate),
                max = datepicker.getParsedDate(this.maxDate),
                dMinTime = new Date(d.year, d.month, min.date).getTime(),
                dMaxTime = new Date(d.year, d.month, max.date).getTime(),
                types = {
                    day: time >= this.minTime && time <= this.maxTime,
                    month: dMinTime >= this.minTime && dMaxTime <= this.maxTime,
                    year: d.year >= min.year && d.year <= max.year
                };
            return type ? types[type] : types.day
        },

        _getDimensions: function ($el) {
            var offset = $el.offset();

            return {
                width: $el.outerWidth(),
                height: $el.outerHeight(),
                left: offset.left,
                top: offset.top
            }
        },

        _getDateFromCell: function (cell) {
            var curDate = this.parsedDate,
                year = cell.data('year') || curDate.year,
                month = cell.data('month') == undefined ? curDate.month : cell.data('month'),
                date = cell.data('date') || 1;

            return new Date(year, month, date);
        },

        _setPositionClasses: function (pos) {
            pos = pos.split(' ');
            var main = pos[0],
                sec = pos[1],
                classes = 'datepicker -' + main + '-' + sec + '- -from-' + main + '-';

            if (this.visible) classes += ' active';

            this.$datepicker
                .removeAttr('class')
                .addClass(classes);
        },

        setPosition: function (position) {
            position = position || this.opts.position;

            var dims = this._getDimensions(this.$el),
                selfDims = this._getDimensions(this.$datepicker),
                pos = position.split(' '),
                top, left,
                offset = this.opts.offset,
                main = pos[0],
                secondary = pos[1];

            switch (main) {
                case 'top':
                    top = dims.top - selfDims.height - offset;
                    break;
                case 'right':
                    left = dims.left + dims.width + offset;
                    break;
                case 'bottom':
                    top = dims.top + dims.height + offset;
                    break;
                case 'left':
                    left = dims.left - selfDims.width - offset;
                    break;
            }

            switch(secondary) {
                case 'top':
                    top = dims.top;
                    break;
                case 'right':
                    left = dims.left + dims.width - selfDims.width;
                    break;
                case 'bottom':
                    top = dims.top + dims.height - selfDims.height;
                    break;
                case 'left':
                    left = dims.left;
                    break;
                case 'center':
                    if (/left|right/.test(main)) {
                        top = dims.top + dims.height/2 - selfDims.height/2;
                    } else {
                        left = dims.left + dims.width/2 - selfDims.width/2;
                    }
            }

            this.$datepicker
                .css({
                    left: left,
                    top: top
                })
        },

        show: function () {
            var onShow = this.opts.onShow;

            this.setPosition(this.opts.position);
            this.$datepicker.addClass('active');
            this.visible = true;

            if (onShow) {
                this._bindVisionEvents(onShow)
            }
        },

        hide: function () {
            var onHide = this.opts.onHide;

            this.$datepicker
                .removeClass('active')
                .css({
                    left: '-100000px'
                });

            this.focused = '';
            this.keys = [];

            this.inFocus = false;
            this.visible = false;
            this.$el.blur();

            if (onHide) {
                this._bindVisionEvents(onHide)
            }
        },

        down: function (date) {
            this._changeView(date, 'down');
        },

        up: function (date) {
            this._changeView(date, 'up');
        },

        _bindVisionEvents: function (event) {
            this.$datepicker.off('transitionend.dp');
            event(this, false);
            this.$datepicker.one('transitionend.dp', event.bind(this, this, true))
        },

        _changeView: function (date, dir) {
            date = date || this.focused || this.date;

            var nextView = dir == 'up' ? this.viewIndex + 1 : this.viewIndex - 1;
            if (nextView > 2) nextView = 2;
            if (nextView < 0) nextView = 0;

            this.silent = true;
            this.date = new Date(date.getFullYear(), date.getMonth(), 1);
            this.silent = false;
            this.view = this.viewIndexes[nextView];

        },

        _handleHotKey: function (key) {
            var date = datepicker.getParsedDate(this._getFocusedDate()),
                focusedParsed,
                o = this.opts,
                newDate,
                totalDaysInNextMonth,
                monthChanged = false,
                yearChanged = false,
                decadeChanged = false,
                y = date.year,
                m = date.month,
                d = date.date;

            switch (key) {
                case 'ctrlRight':
                case 'ctrlUp':
                    m += 1;
                    monthChanged = true;
                    break;
                case 'ctrlLeft':
                case 'ctrlDown':
                    m -= 1;
                    monthChanged = true;
                    break;
                case 'shiftRight':
                case 'shiftUp':
                    yearChanged = true;
                    y += 1;
                    break;
                case 'shiftLeft':
                case 'shiftDown':
                    yearChanged = true;
                    y -= 1;
                    break;
                case 'altRight':
                case 'altUp':
                    decadeChanged = true;
                    y += 10;
                    break;
                case 'altLeft':
                case 'altDown':
                    decadeChanged = true;
                    y -= 10;
                    break;
                case 'ctrlShiftUp':
                    this.up();
                    break;
            }

            totalDaysInNextMonth = datepicker.getDaysCount(new Date(y,m));
            newDate = new Date(y,m,d);

            // If next month has less days than current, set date to total days in that month
            if (totalDaysInNextMonth < d) d = totalDaysInNextMonth;

            // Check if newDate is in valid range
            if (newDate.getTime() < this.minTime) {
                newDate = this.minDate;
            } else if (newDate.getTime() > this.maxTime) {
                newDate = this.maxDate;
            }

            this.focused = newDate;

            focusedParsed = datepicker.getParsedDate(newDate);
            if (monthChanged && o.onChangeMonth) {
                o.onChangeMonth(focusedParsed.month, focusedParsed.year)
            }
            if (yearChanged && o.onChangeYear) {
                o.onChangeYear(focusedParsed.year)
            }
            if (decadeChanged && o.onChangeDecade) {
                o.onChangeDecade(this.curDecade)
            }
        },

        _registerKey: function (key) {
            var exists = this.keys.some(function (curKey) {
                return curKey == key;
            });

            if (!exists) {
                this.keys.push(key)
            }
        },

        _unRegisterKey: function (key) {
            var index = this.keys.indexOf(key);

            this.keys.splice(index, 1);
        },

        _isHotKeyPressed: function () {
            var currentHotKey,
                found = false,
                _this = this,
                pressedKeys = this.keys.sort();

            for (var hotKey in hotKeys) {
                currentHotKey = hotKeys[hotKey];
                if (pressedKeys.length != currentHotKey.length) continue;

                if (currentHotKey.every(function (key, i) { return key == pressedKeys[i]})) {
                    _this._trigger('hotKey', hotKey);
                    found = true;
                }
            }

            return found;
        },

        _trigger: function (event, args) {
            this.$el.trigger(event, args)
        },

        _focusNextCell: function (keyCode, type) {
            type = type || this.cellType;

            var date = datepicker.getParsedDate(this._getFocusedDate()),
                y = date.year,
                m = date.month,
                d = date.date;

            if (this._isHotKeyPressed()){
                return;
            }

            switch(keyCode) {
                case 37: // left
                    type == 'day' ? (d -= 1) : '';
                    type == 'month' ? (m -= 1) : '';
                    type == 'year' ? (y -= 1) : '';
                    break;
                case 38: // up
                    type == 'day' ? (d -= 7) : '';
                    type == 'month' ? (m -= 3) : '';
                    type == 'year' ? (y -= 4) : '';
                    break;
                case 39: // right
                    type == 'day' ? (d += 1) : '';
                    type == 'month' ? (m += 1) : '';
                    type == 'year' ? (y += 1) : '';
                    break;
                case 40: // down
                    type == 'day' ? (d += 7) : '';
                    type == 'month' ? (m += 3) : '';
                    type == 'year' ? (y += 4) : '';
                    break;
            }

            var nd = new Date(y,m,d);
            if (nd.getTime() < this.minTime) {
                nd = this.minDate;
            } else if (nd.getTime() > this.maxTime) {
                nd = this.maxDate;
            }

            this.focused = nd;

        },

        _getFocusedDate: function () {
            var focused  = this.focused || this.selectedDates[this.selectedDates.length - 1],
                d = this.parsedDate;

            if (!focused) {
                switch (this.view) {
                    case 'days':
                        focused = new Date(d.year, d.month, new Date().getDate());
                        break;
                    case 'months':
                        focused = new Date(d.year, d.month, 1);
                        break;
                    case 'years':
                        focused = new Date(d.year, 0, 1);
                        break;
                }
            }

            return focused;
        },

        _getCell: function (date, type) {
            type = type || this.cellType;

            var d = datepicker.getParsedDate(date),
                selector = '.datepicker--cell[data-year="' + d.year + '"]',
                $cell;

            switch (type) {
                case 'month':
                    selector = '[data-month="' + d.month + '"]';
                    break;
                case 'day':
                    selector += '[data-month="' + d.month + '"][data-date="' + d.date + '"]';
                    break;
            }
            $cell = this.views[this.currentView].$el.find(selector);

            return $cell.length ? $cell : $('');
        },

        destroy: function () {
            var _this = this;
            _this.$el
                .off('.adp')
                .data('datepicker', '');

            _this.selectedDates = [];
            _this.focused = '';
            _this.views = {};
            _this.keys = [];
            _this.minRange = '';
            _this.maxRange = '';

            if (_this.opts.inline || !_this.elIsInput) {
                _this.$datepicker.closest('.datepicker-inline').remove();
            } else {
                _this.$datepicker.remove();
            }
        },

        _handleAlreadySelectedDates: function (alreadySelected, selectedDate) {
            if (this.opts.range) {
                if (!this.opts.toggleSelected) {
                    // Add possibility to select same date when range is true
                    if (this.selectedDates.length != 2) {
                        this._trigger('clickCell', selectedDate);
                    }
                } else {
                    this.removeDate(selectedDate);
                }
            } else if (this.opts.toggleSelected){
                this.removeDate(selectedDate);
            }

            // Change last selected date to be able to change time when clicking on this cell
            if (!this.opts.toggleSelected) {
                this.lastSelectedDate = alreadySelected;
                if (this.opts.timepicker) {
                    this.timepicker._setTime(alreadySelected);
                    this.timepicker.update();
                }
            }
        },

        _onShowEvent: function (e) {
            if (!this.visible) {
                this.show();
            }
        },

        _onBlur: function () {
            if (!this.inFocus && this.visible) {
                this.hide();
            }
        },

        _onMouseDownDatepicker: function (e) {
            this.inFocus = true;
        },

        _onMouseUpDatepicker: function (e) {
            this.inFocus = false;
            e.originalEvent.inFocus = true;
            if (!e.originalEvent.timepickerFocus) this.$el.focus();
        },

        _onKeyUpGeneral: function (e) {
            var val = this.$el.val();

            if (!val) {
                this.clear();
            }
        },

        _onResize: function () {
            if (this.visible) {
                this.setPosition();
            }
        },

        _onMouseUpBody: function (e) {
            if (e.originalEvent.inFocus) return;

            if (this.visible && !this.inFocus) {
                this.hide();
            }
        },

        _onMouseUpEl: function (e) {
            e.originalEvent.inFocus = true;
            setTimeout(this._onKeyUpGeneral.bind(this),4);
        },

        _onKeyDown: function (e) {
            var code = e.which;
            this._registerKey(code);

            // Arrows
            if (code >= 37 && code <= 40) {
                e.preventDefault();
                this._focusNextCell(code);
            }

            // Enter
            if (code == 13) {
                if (this.focused) {
                    if (this._getCell(this.focused).hasClass('-disabled-')) return;
                    if (this.view != this.opts.minView) {
                        this.down()
                    } else {
                        var alreadySelected = this._isSelected(this.focused, this.cellType);

                        if (!alreadySelected) {
                            if (this.timepicker) {
                                this.focused.setHours(this.timepicker.hours);
                                this.focused.setMinutes(this.timepicker.minutes);
                            }
                            this.selectDate(this.focused);
                            return;
                        }
                        this._handleAlreadySelectedDates(alreadySelected, this.focused)
                    }
                }
            }

            // Esc
            if (code == 27) {
                this.hide();
            }
        },

        _onKeyUp: function (e) {
            var code = e.which;
            this._unRegisterKey(code);
        },

        _onHotKey: function (e, hotKey) {
            this._handleHotKey(hotKey);
        },

        _onMouseEnterCell: function (e) {
            var $cell = $(e.target).closest('.datepicker--cell'),
                date = this._getDateFromCell($cell);

            // Prevent from unnecessary rendering and setting new currentDate
            this.silent = true;

            if (this.focused) {
                this.focused = ''
            }

            $cell.addClass('-focus-');

            this.focused = date;
            this.silent = false;

            if (this.opts.range && this.selectedDates.length == 1) {
                this.minRange = this.selectedDates[0];
                this.maxRange = '';
                if (datepicker.less(this.minRange, this.focused)) {
                    this.maxRange = this.minRange;
                    this.minRange = '';
                }
                this.views[this.currentView]._update();
            }
        },

        _onMouseLeaveCell: function (e) {
            var $cell = $(e.target).closest('.datepicker--cell');

            $cell.removeClass('-focus-');

            this.silent = true;
            this.focused = '';
            this.silent = false;
        },

        _onTimeChange: function (e, h, m) {
            var date = new Date(),
                selectedDates = this.selectedDates,
                selected = false;

            if (selectedDates.length) {
                selected = true;
                date = this.lastSelectedDate;
            }

            date.setHours(h);
            date.setMinutes(m);

            if (!selected && !this._getCell(date).hasClass('-disabled-')) {
                this.selectDate(date);
            } else {
                this._setInputValue();
                if (this.opts.onSelect) {
                    this._triggerOnChange();
                }
            }
        },

        _onClickCell: function (e, date) {
            if (this.timepicker) {
                date.setHours(this.timepicker.hours);
                date.setMinutes(this.timepicker.minutes);
            }
            this.selectDate(date);
        },

        set focused(val) {
            if (!val && this.focused) {
                var $cell = this._getCell(this.focused);

                if ($cell.length) {
                    $cell.removeClass('-focus-')
                }
            }
            this._focused = val;
            if (this.opts.range && this.selectedDates.length == 1) {
                this.minRange = this.selectedDates[0];
                this.maxRange = '';
                if (datepicker.less(this.minRange, this._focused)) {
                    this.maxRange = this.minRange;
                    this.minRange = '';
                }
            }
            if (this.silent) return;
            this.date = val;
        },

        get focused() {
            return this._focused;
        },

        get parsedDate() {
            return datepicker.getParsedDate(this.date);
        },

        set date (val) {
            if (!(val instanceof Date)) return;

            this.currentDate = val;

            if (this.inited && !this.silent) {
                this.views[this.view]._render();
                this.nav._render();
                if (this.visible && this.elIsInput) {
                    this.setPosition();
                }
            }
            return val;
        },

        get date () {
            return this.currentDate
        },

        set view (val) {
            this.viewIndex = this.viewIndexes.indexOf(val);

            if (this.viewIndex < 0) {
                return;
            }

            this.prevView = this.currentView;
            this.currentView = val;

            if (this.inited) {
                if (!this.views[val]) {
                    this.views[val] = new  $.fn.datepicker.Body(this, val, this.opts)
                } else {
                    this.views[val]._render();
                }

                this.views[this.prevView].hide();
                this.views[val].show();
                this.nav._render();

                if (this.opts.onChangeView) {
                    this.opts.onChangeView(val)
                }
                if (this.elIsInput && this.visible) this.setPosition();
            }

            return val
        },

        get view() {
            return this.currentView;
        },

        get cellType() {
            return this.view.substring(0, this.view.length - 1)
        },

        get minTime() {
            var min = datepicker.getParsedDate(this.minDate);
            return new Date(min.year, min.month, min.date).getTime()
        },

        get maxTime() {
            var max = datepicker.getParsedDate(this.maxDate);
            return new Date(max.year, max.month, max.date).getTime()
        },

        get curDecade() {
            return datepicker.getDecade(this.date)
        }
    };

    //  Utils
    // -------------------------------------------------

    datepicker.getDaysCount = function (date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    datepicker.getParsedDate = function (date) {
        return {
            year: date.getFullYear(),
            month: date.getMonth(),
            fullMonth: (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1, // One based
            date: date.getDate(),
            fullDate: date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
            day: date.getDay(),
            hours: date.getHours(),
            fullHours:  date.getHours() < 10 ? '0' + date.getHours() :  date.getHours() ,
            minutes: date.getMinutes(),
            fullMinutes:  date.getMinutes() < 10 ? '0' + date.getMinutes() :  date.getMinutes()
        }
    };

    datepicker.getDecade = function (date) {
        var firstYear = Math.floor(date.getFullYear() / 10) * 10;

        return [firstYear, firstYear + 9];
    };

    datepicker.template = function (str, data) {
        return str.replace(/#\{([\w]+)\}/g, function (source, match) {
            if (data[match] || data[match] === 0) {
                return data[match]
            }
        });
    };

    datepicker.isSame = function (date1, date2, type) {
        if (!date1 || !date2) return false;
        var d1 = datepicker.getParsedDate(date1),
            d2 = datepicker.getParsedDate(date2),
            _type = type ? type : 'day',

            conditions = {
                day: d1.date == d2.date && d1.month == d2.month && d1.year == d2.year,
                month: d1.month == d2.month && d1.year == d2.year,
                year: d1.year == d2.year
            };

        return conditions[_type];
    };

    datepicker.less = function (dateCompareTo, date, type) {
        if (!dateCompareTo || !date) return false;
        return date.getTime() < dateCompareTo.getTime();
    };

    datepicker.bigger = function (dateCompareTo, date, type) {
        if (!dateCompareTo || !date) return false;
        return date.getTime() > dateCompareTo.getTime();
    };

    datepicker.getLeadingZeroNum = function (num) {
        return parseInt(num) < 10 ? '0' + num : num;
    };

    /**
     * Returns copy of date with hours and minutes equals to 0
     * @param date {Date}
     */
    datepicker.resetTime = function (date) {
        if (typeof date != 'object') return;
        date = datepicker.getParsedDate(date);
        return new Date(date.year, date.month, date.date)
    };

    $.fn.datepicker = function ( options ) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this,  pluginName,
                    new Datepicker( this, options ));
            } else {
                var _this = $.data(this, pluginName);

                _this.opts = $.extend(true, _this.opts, options);
                _this.update();
            }
        });
    };

    $.fn.datepicker.Constructor = Datepicker;

    $.fn.datepicker.language = {
        kr: {
    		days: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"],
    		daysShort: ["일", "월", "화", "수", "목", "금", "토", "일"],
    		daysMin: ["일", "월", "화", "수", "목", "금", "토", "일"],
    		months: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    		monthsShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
            today: '오늘',
            clear: '빈값',
            confirm: '확인',
            close: '닫기',
            noEndDate : '종료일 미지정',
            dateFormat: 'dd.mm.yyyy',
            timeFormat: 'hh:ii',
            datetimeMessage : "시작일시가 종료일시 보다 크거나 같습니다.",
            dateMessage : "시작일이 종료일 보다 큽니다.",
            firstDay: 1
        },
        en: {
            days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            months: ['January','February','March','April','May','June', 'July','August','September','October','November','December'],
            monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            today: 'Today',
            clear: 'Clear',
            confirm: 'Confirm',
            close: 'Close',
            noEndDate : 'No end date',
            dateFormat: 'mm/dd/yyyy',
            timeFormat: 'hh:ii aa',
            datetimeMessage : "Start date is greater than or equal to the end date and time.",
            dateMessage : "Start date is greater than end date.",
            firstDay: 0
        }
    };
    
    $.fn.datepicker.language["ko"]    = $.fn.datepicker.language.kr;
    $.fn.datepicker.language["en_US"] = $.fn.datepicker.language.en;

    $(function () {
        $(autoInitSelector).datepicker();
    })

})();

;(function () {
    var templates = {
        days:'' +
        '<div class="datepicker--days datepicker--body">' +
        '<div class="datepicker--days-names"></div>' +
        '<div class="datepicker--cells datepicker--cells-days"></div>' +
        '</div>',
        months: '' +
        '<div class="datepicker--months datepicker--body">' +
        '<div class="datepicker--cells datepicker--cells-months"></div>' +
        '</div>',
        years: '' +
        '<div class="datepicker--years datepicker--body">' +
        '<div class="datepicker--cells datepicker--cells-years"></div>' +
        '</div>'
        },
        datepicker = $.fn.datepicker,
        dp = datepicker.Constructor;

    datepicker.Body = function (d, type, opts) {
        this.d = d;
        this.type = type;
        this.opts = opts;
        this.$el = $('');

        if (this.opts.onlyTimepicker) return;
        this.init();
    };

    datepicker.Body.prototype = {
        init: function () {
            this._buildBaseHtml();
            this._render();

            this._bindEvents();
        },

        _bindEvents: function () {
            this.$el.on('click', '.datepicker--cell', $.proxy(this._onClickCell, this));
        },

        _buildBaseHtml: function () {
            this.$el = $(templates[this.type]).appendTo(this.d.$content);
            this.$names = $('.datepicker--days-names', this.$el);
            this.$cells = $('.datepicker--cells', this.$el);
        },

        _getDayNamesHtml: function (firstDay, curDay, html, i) {
            curDay = curDay != undefined ? curDay : firstDay;
            html = html ? html : '';
            i = i != undefined ? i : 0;

            if (i > 7) return html;
            if (curDay == 7) return this._getDayNamesHtml(firstDay, 0, html, ++i);

            html += '<div class="datepicker--day-name' + (this.d.isWeekend(curDay) ? " -weekend-" : "") + '">' + this.d.loc.daysMin[curDay] + '</div>';

            return this._getDayNamesHtml(firstDay, ++curDay, html, ++i);
        },

        _getCellContents: function (date, type) {
            var classes = "datepicker--cell datepicker--cell-" + type,
                currentDate = new Date(),
                parent = this.d,
                minRange = dp.resetTime(parent.minRange),
                maxRange = dp.resetTime(parent.maxRange),
                opts = parent.opts,
                d = dp.getParsedDate(date),
                render = {},
                html = d.date;

            switch (type) {
                case 'day':
                    if (parent.isWeekend(d.day)) classes += " -weekend-";
                    if (d.month != this.d.parsedDate.month) {
                        classes += " -other-month-";
                        if (!opts.selectOtherMonths) {
                            classes += " -disabled-";
                        }
                        if (!opts.showOtherMonths) html = '';
                    }
                    break;
                case 'month':
                    html = parent.loc[parent.opts.monthsField][d.month];
                    break;
                case 'year':
                    var decade = parent.curDecade;
                    html = d.year;
                    if (d.year < decade[0] || d.year > decade[1]) {
                        classes += ' -other-decade-';
                        if (!opts.selectOtherYears) {
                            classes += " -disabled-";
                        }
                        if (!opts.showOtherYears) html = '';
                    }
                    break;
            }

            if (opts.onRenderCell) {
                render = opts.onRenderCell(date, type) || {};
                html = render.html ? render.html : html;
                classes += render.classes ? ' ' + render.classes : '';
            }

            if (opts.range) {
                if (dp.isSame(minRange, date, type)) classes += ' -range-from-';
                if (dp.isSame(maxRange, date, type)) classes += ' -range-to-';

                if (parent.selectedDates.length == 1 && parent.focused) {
                    if (
                        (dp.bigger(minRange, date) && dp.less(parent.focused, date)) ||
                        (dp.less(maxRange, date) && dp.bigger(parent.focused, date)))
                    {
                        classes += ' -in-range-'
                    }

                    if (dp.less(maxRange, date) && dp.isSame(parent.focused, date)) {
                        classes += ' -range-from-'
                    }
                    if (dp.bigger(minRange, date) && dp.isSame(parent.focused, date)) {
                        classes += ' -range-to-'
                    }

                } else if (parent.selectedDates.length == 2) {
                    if (dp.bigger(minRange, date) && dp.less(maxRange, date)) {
                        classes += ' -in-range-'
                    }
                }
            }


            if (dp.isSame(currentDate, date, type)) classes += ' -current-';
            if (parent.focused && dp.isSame(date, parent.focused, type)) classes += ' -focus-';
            if (parent._isSelected(date, type)) classes += ' -selected-';
            if (!parent._isInRange(date, type) || render.disabled) classes += ' -disabled-';

            return {
                html: html,
                classes: classes
            }
        },

        /**
         * Calculates days number to render. Generates days html and returns it.
         * @param {object} date - Date object
         * @returns {string}
         * @private
         */
        _getDaysHtml: function (date) {
            var totalMonthDays = dp.getDaysCount(date),
                firstMonthDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
                lastMonthDay = new Date(date.getFullYear(), date.getMonth(), totalMonthDays).getDay(),
                daysFromPevMonth = firstMonthDay - this.d.loc.firstDay,
                daysFromNextMonth = 6 - lastMonthDay + this.d.loc.firstDay;

            daysFromPevMonth = daysFromPevMonth < 0 ? daysFromPevMonth + 7 : daysFromPevMonth;
            daysFromNextMonth = daysFromNextMonth > 6 ? daysFromNextMonth - 7 : daysFromNextMonth;

            var startDayIndex = -daysFromPevMonth + 1,
                m, y,
                html = '';

            for (var i = startDayIndex, max = totalMonthDays + daysFromNextMonth; i <= max; i++) {
                y = date.getFullYear();
                m = date.getMonth();

                html += this._getDayHtml(new Date(y, m, i))
            }

            return html;
        },

        _getDayHtml: function (date) {
           var content = this._getCellContents(date, 'day');

            return '<div class="' + content.classes + '" ' +
                'data-date="' + date.getDate() + '" ' +
                'data-month="' + date.getMonth() + '" ' +
                'data-year="' + date.getFullYear() + '">' + content.html + '</div>';
        },

        /**
         * Generates months html
         * @param {object} date - date instance
         * @returns {string}
         * @private
         */
        _getMonthsHtml: function (date) {
            var html = '',
                d = dp.getParsedDate(date),
                i = 0;

            while(i < 12) {
                html += this._getMonthHtml(new Date(d.year, i));
                i++
            }

            return html;
        },

        _getMonthHtml: function (date) {
            var content = this._getCellContents(date, 'month');

            return '<div class="' + content.classes + '" data-month="' + date.getMonth() + '">' + content.html + '</div>'
        },

        _getYearsHtml: function (date) {
            var d = dp.getParsedDate(date),
                decade = dp.getDecade(date),
                firstYear = decade[0] - 1,
                html = '',
                i = firstYear;

            for (i; i <= decade[1] + 1; i++) {
                html += this._getYearHtml(new Date(i , 0));
            }

            return html;
        },

        _getYearHtml: function (date) {
            var content = this._getCellContents(date, 'year');

            return '<div class="' + content.classes + '" data-year="' + date.getFullYear() + '">' + content.html + '</div>'
        },

        _renderTypes: {
            days: function () {
                var dayNames = this._getDayNamesHtml(this.d.loc.firstDay),
                    days = this._getDaysHtml(this.d.currentDate);

                this.$cells.html(days);
                this.$names.html(dayNames)
            },
            months: function () {
                var html = this._getMonthsHtml(this.d.currentDate);

                this.$cells.html(html)
            },
            years: function () {
                var html = this._getYearsHtml(this.d.currentDate);

                this.$cells.html(html)
            }
        },

        _render: function () {
            if (this.opts.onlyTimepicker) return;
            this._renderTypes[this.type].bind(this)();
        },

        _update: function () {
            var $cells = $('.datepicker--cell', this.$cells),
                _this = this,
                classes,
                $cell,
                date;
            $cells.each(function (cell, i) {
                $cell = $(this);
                date = _this.d._getDateFromCell($(this));
                classes = _this._getCellContents(date, _this.d.cellType);
                $cell.attr('class',classes.classes)
            });
        },

        show: function () {
            if (this.opts.onlyTimepicker) return;
            this.$el.addClass('active');
            this.acitve = true;
        },

        hide: function () {
            this.$el.removeClass('active');
            this.active = false;
        },

        //  Events
        // -------------------------------------------------

        _handleClick: function (el) {
            var date = el.data('date') || 1,
                month = el.data('month') || 0,
                year = el.data('year') || this.d.parsedDate.year,
                dp = this.d;
            // Change view if min view does not reach yet
            if (dp.view != this.opts.minView) {
                dp.down(new Date(year, month, date));
                return;
            }
            // Select date if min view is reached
            var selectedDate = new Date(year, month, date),
                alreadySelected = this.d._isSelected(selectedDate, this.d.cellType);

            if (!alreadySelected) {
                dp._trigger('clickCell', selectedDate);
                return;
            }

            dp._handleAlreadySelectedDates.bind(dp, alreadySelected, selectedDate)();

        },

        _onClickCell: function (e) {
            var $el = $(e.target).closest('.datepicker--cell');

            if ($el.hasClass('-disabled-')) return;

            this._handleClick.bind(this)($el);
        }
    };
})();

;(function () {
    var template = '' +
        '<div class="datepicker--nav-action" data-action="prev">#{prevHtml}</div>' +
        '<div class="datepicker--nav-title">#{title}</div>' +
        '<div class="datepicker--nav-action" data-action="next">#{nextHtml}</div>',
        buttonsContainerTemplate = '<div class="datepicker--buttons"></div>',
        button = '<span class="datepicker--button" data-action="#{action}">#{label}</span>',
        datepicker = $.fn.datepicker,
        dp = datepicker.Constructor;

    datepicker.Navigation = function (d, opts) {
        this.d = d;
        this.opts = opts;

        this.$buttonsContainer = '';

        this.init();
    };

    datepicker.Navigation.prototype = {
        init: function () {
            this._buildBaseHtml();
            this._bindEvents();
        },

        _bindEvents: function () {
            this.d.$nav.on('click', '.datepicker--nav-action', $.proxy(this._onClickNavButton, this));
            this.d.$nav.on('click', '.datepicker--nav-title', $.proxy(this._onClickNavTitle, this));
            this.d.$datepicker.on('click', '.datepicker--button', $.proxy(this._onClickNavButton, this));
        },

        _buildBaseHtml: function () {
            if (!this.opts.onlyTimepicker) {
                this._render();
            }
            this._addButtonsIfNeed();
        },

        _addButtonsIfNeed: function () {
            if (this.opts.todayButton) {
                this._addButton('today')
            }
            if (this.opts.clearButton) {
                this._addButton('clear')
            }
        },

        _render: function () {
            var title = this._getTitle(this.d.currentDate),
                html = dp.template(template, $.extend({title: title}, this.opts));
            this.d.$nav.html(html);
            if (this.d.view == 'years') {
                $('.datepicker--nav-title', this.d.$nav).addClass('-disabled-');
            }
            this.setNavStatus();
        },

        _getTitle: function (date) {
            return this.d.formatDate(this.opts.navTitles[this.d.view], date)
        },

        _addButton: function (type) {
            if (!this.$buttonsContainer.length) {
                this._addButtonsContainer();
            }

            var data = {
                    action: type,
                    label: this.d.loc[type]
                },
                html = dp.template(button, data);

            if ($('[data-action=' + type + ']', this.$buttonsContainer).length) return;
            this.$buttonsContainer.append(html);
        },

        _addButtonsContainer: function () {
            this.d.$datepicker.append(buttonsContainerTemplate);
            this.$buttonsContainer = $('.datepicker--buttons', this.d.$datepicker);
        },

        setNavStatus: function () {
            if (!(this.opts.minDate || this.opts.maxDate) || !this.opts.disableNavWhenOutOfRange) return;

            var date = this.d.parsedDate,
                m = date.month,
                y = date.year,
                d = date.date;

            switch (this.d.view) {
                case 'days':
                    if (!this.d._isInRange(new Date(y, m-1, 1), 'month')) {
                        this._disableNav('prev')
                    }
                    if (!this.d._isInRange(new Date(y, m+1, 1), 'month')) {
                        this._disableNav('next')
                    }
                    break;
                case 'months':
                    if (!this.d._isInRange(new Date(y-1, m, d), 'year')) {
                        this._disableNav('prev')
                    }
                    if (!this.d._isInRange(new Date(y+1, m, d), 'year')) {
                        this._disableNav('next')
                    }
                    break;
                case 'years':
                    var decade = dp.getDecade(this.d.date);
                    if (!this.d._isInRange(new Date(decade[0] - 1, 0, 1), 'year')) {
                        this._disableNav('prev')
                    }
                    if (!this.d._isInRange(new Date(decade[1] + 1, 0, 1), 'year')) {
                        this._disableNav('next')
                    }
                    break;
            }
        },

        _disableNav: function (nav) {
            $('[data-action="' + nav + '"]', this.d.$nav).addClass('-disabled-')
        },

        _activateNav: function (nav) {
            $('[data-action="' + nav + '"]', this.d.$nav).removeClass('-disabled-')
        },

        _onClickNavButton: function (e) {
            var $el = $(e.target).closest('[data-action]'),
                action = $el.data('action');

            this.d[action]();
        },

        _onClickNavTitle: function (e) {
            if ($(e.target).hasClass('-disabled-')) return;

            if (this.d.view == 'days') {
                return this.d.view = 'months'
            }

            this.d.view = 'years';
        }
    }

})();

;(function () {
    var template = '<div class="datepicker--time">' +
        '<div class="datepicker--time-current">' +
        '   <span class="datepicker--time-current-hours">#{hourVisible}</span>' +
        '   <span class="datepicker--time-current-colon">:</span>' +
        '   <span class="datepicker--time-current-minutes">#{minValue}</span>' +
        '</div>' +
        '<div class="datepicker--time-sliders">' +
        '   <div class="datepicker--time-row">' +
        '      <input type="range" name="hours" value="#{hourValue}" min="#{hourMin}" max="#{hourMax}" step="#{hourStep}"/>' +
        '   </div>' +
        '   <div class="datepicker--time-row">' +
        '      <input type="range" name="minutes" value="#{minValue}" min="#{minMin}" max="#{minMax}" step="#{minStep}"/>' +
        '   </div>' +
        '</div>' +
        '</div>',
        datepicker = $.fn.datepicker,
        dp = datepicker.Constructor;

    datepicker.Timepicker = function (inst, opts) {
        this.d = inst;
        this.opts = opts;

        this.init();
    };

    datepicker.Timepicker.prototype = {
        init: function () {
            var input = 'input';
            this._setTime(this.d.date);
            this._buildHTML();

            if (navigator.userAgent.match(/trident/gi)) {
                input = 'change';
            }

            this.d.$el.on('selectDate', this._onSelectDate.bind(this));
            this.$ranges.on(input, this._onChangeRange.bind(this));
            this.$ranges.on('mouseup', this._onMouseUpRange.bind(this));
            this.$ranges.on('mousemove focus ', this._onMouseEnterRange.bind(this));
            this.$ranges.on('mouseout blur', this._onMouseOutRange.bind(this));
        },

        _setTime: function (date) {
            var _date = dp.getParsedDate(date);

            this._handleDate(date);
            this.hours = _date.hours < this.minHours ? this.minHours : _date.hours;
            this.minutes = _date.minutes < this.minMinutes ? this.minMinutes : _date.minutes;
        },

        /**
         * Sets minHours and minMinutes from date (usually it's a minDate)
         * Also changes minMinutes if current hours are bigger then @date hours
         * @param date {Date}
         * @private
         */
        _setMinTimeFromDate: function (date) {
            this.minHours = date.getHours();
            this.minMinutes = date.getMinutes();

            // If, for example, min hours are 10, and current hours are 12,
            // update minMinutes to default value, to be able to choose whole range of values
            if (this.d.lastSelectedDate) {
                if (this.d.lastSelectedDate.getHours() > date.getHours()) {
                    this.minMinutes = this.opts.minMinutes;
                }
            }
        },

        _setMaxTimeFromDate: function (date) {
            this.maxHours = date.getHours();
            this.maxMinutes = date.getMinutes();

            if (this.d.lastSelectedDate) {
                if (this.d.lastSelectedDate.getHours() < date.getHours()) {
                    this.maxMinutes = this.opts.maxMinutes;
                }
            }
        },

        _setDefaultMinMaxTime: function () {
            var maxHours = 23,
                maxMinutes = 59,
                opts = this.opts;

            this.minHours = opts.minHours < 0 || opts.minHours > maxHours ? 0 : opts.minHours;
            this.minMinutes = opts.minMinutes < 0 || opts.minMinutes > maxMinutes ? 0 : opts.minMinutes;
            this.maxHours = opts.maxHours < 0 || opts.maxHours > maxHours ? maxHours : opts.maxHours;
            this.maxMinutes = opts.maxMinutes < 0 || opts.maxMinutes > maxMinutes ? maxMinutes : opts.maxMinutes;
        },

        /**
         * Looks for min/max hours/minutes and if current values
         * are out of range sets valid values.
         * @private
         */
        _validateHoursMinutes: function (date) {
            if (this.hours < this.minHours) {
                this.hours = this.minHours;
            } else if (this.hours > this.maxHours) {
                this.hours = this.maxHours;
            }

            if (this.minutes < this.minMinutes) {
                this.minutes = this.minMinutes;
            } else if (this.minutes > this.maxMinutes) {
                this.minutes = this.maxMinutes;
            }
        },

        _buildHTML: function () {
            var lz = dp.getLeadingZeroNum,
                data = {
                    hourMin: this.minHours,
                    hourMax: lz(this.maxHours),
                    hourStep: this.opts.hoursStep,
                    hourValue: this.hours,
                    hourVisible: lz(this.displayHours),
                    minMin: this.minMinutes,
                    minMax: lz(this.maxMinutes),
                    minStep: this.opts.minutesStep,
                    minValue: lz(this.minutes)
                },
                _template = dp.template(template, data);

            this.$timepicker = $(_template).appendTo(this.d.$datepicker);
            this.$ranges = $('[type="range"]', this.$timepicker);
            this.$hours = $('[name="hours"]', this.$timepicker);
            this.$minutes = $('[name="minutes"]', this.$timepicker);
            this.$hoursText = $('.datepicker--time-current-hours', this.$timepicker);
            this.$minutesText = $('.datepicker--time-current-minutes', this.$timepicker);

            if (this.d.ampm) {
                this.$ampm = $('<span class="datepicker--time-current-ampm">')
                    .appendTo($('.datepicker--time-current', this.$timepicker))
                    .html(this.dayPeriod);

                this.$timepicker.addClass('-am-pm-');
            }
        },

        _updateCurrentTime: function () {
            var h =  dp.getLeadingZeroNum(this.displayHours),
                m = dp.getLeadingZeroNum(this.minutes);

            this.$hoursText.html(h);
            this.$minutesText.html(m);

            if (this.d.ampm) {
                this.$ampm.html(this.dayPeriod);
            }
        },

        _updateRanges: function () {
            this.$hours.attr({
                min: this.minHours,
                max: this.maxHours
            }).val(this.hours);

            this.$minutes.attr({
                min: this.minMinutes,
                max: this.maxMinutes
            }).val(this.minutes)
        },

        /**
         * Sets minHours, minMinutes etc. from date. If date is not passed, than sets
         * values from options
         * @param [date] {object} - Date object, to get values from
         * @private
         */
        _handleDate: function (date) {
            this._setDefaultMinMaxTime();
            if (date) {
                if (dp.isSame(date, this.d.opts.minDate)) {
                    this._setMinTimeFromDate(this.d.opts.minDate);
                } else if (dp.isSame(date, this.d.opts.maxDate)) {
                    this._setMaxTimeFromDate(this.d.opts.maxDate);
                }
            }

            this._validateHoursMinutes(date);
        },

        update: function () {
            this._updateRanges();
            this._updateCurrentTime();
        },

        /**
         * Calculates valid hour value to display in text input and datepicker's body.
         * @param date {Date|Number} - date or hours
         * @param [ampm] {Boolean} - 12 hours mode
         * @returns {{hours: *, dayPeriod: string}}
         * @private
         */
        _getValidHoursFromDate: function (date, ampm) {
            var d = date,
                hours = date;

            if (date instanceof Date) {
                d = dp.getParsedDate(date);
                hours = d.hours;
            }

            var _ampm = ampm || this.d.ampm,
                dayPeriod = 'am';

            if (_ampm) {
                switch(true) {
                    case hours == 0:
                        hours = 0;
                        break;
                    case hours == 12:
                        dayPeriod = 'pm';
                        break;
                    case hours > 11:
                        hours = hours;
                        dayPeriod = 'pm';
                        break;
                    default:
                        break;
                }
            }

            return {
                hours: hours,
                dayPeriod: dayPeriod
            }
        },

        set hours (val) {
            this._hours = val;

            var displayHours = this._getValidHoursFromDate(val);

            this.displayHours = displayHours.hours;
            this.dayPeriod = displayHours.dayPeriod;
        },

        get hours() {
            return this._hours;
        },

        //  Events
        // -------------------------------------------------

        _onChangeRange: function (e) {
            var $target = $(e.target),
                name = $target.attr('name');
            
            this.d.timepickerIsActive = true;

            this[name] = $target.val();
            this._updateCurrentTime();
            this.d._trigger('timeChange', [this.hours, this.minutes]);

            this._handleDate(this.d.lastSelectedDate);
            this.update()
        },

        _onSelectDate: function (e, data) {
            this._handleDate(data);
            this.update();
        },

        _onMouseEnterRange: function (e) {
            var name = $(e.target).attr('name');
            $('.datepicker--time-current-' + name, this.$timepicker).addClass('-focus-');
        },

        _onMouseOutRange: function (e) {
            var name = $(e.target).attr('name');
            if (this.d.inFocus) return; // Prevent removing focus when mouse out of range slider
            $('.datepicker--time-current-' + name, this.$timepicker).removeClass('-focus-');
        },

        _onMouseUpRange: function (e) {
            this.d.timepickerIsActive = false;
        }
    };
})();
 })(window, jQuery);
var Browser = (function(){
	
	var returnObj = {};
    returnObj.type ="";
    returnObj.version= "";

	var browerAgent = navigator.userAgent;

	
	var browerType = ""; // 브라우져 종류
	// 브라우져 종류 설정.
	if (browerAgent.indexOf("Edge") != -1) {
	    browerType = "Edge";
	} else if (browerAgent.indexOf("MSIE") != -1 || browerAgent.indexOf("rv:") != -1) {
	    browerType = "MSIE";
	}else if (browerAgent.indexOf("Edge") != -1) {
	    browerType = "Edge";
	} else if (browerAgent.indexOf("Chrome") != -1) {
	    browerType = "Chrome";
	} else if (browerAgent.indexOf("Firefox") != -1) {
	    browerType = "Firefox";
	} else if (browerAgent.indexOf("Safari") != -1) {
	    browerType = "Safari";
	}else{
	    browerType = "Opera";       
	}
	
	returnObj.type = browerType;        
        
	var rv = -1; // Return value assumes failure.      
	var ua = navigator.userAgent;
	var re = null;
	
	if (browerType == "MSIE") {
		
		if (browerAgent.indexOf("rv:") != -1) {
		    re = new RegExp("rv:([0-9]{1,}[\.0-9]{0,})");			
		}else{
		    re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");			
		}
		
	} else {
	    re = new RegExp(browerType + "/([0-9]{1,}[\.0-9]{0,})");
	}
	if (re.exec(ua) != null) {
	    rv = parseFloat(RegExp.$1);
	}
	
	
	returnObj.version = rv;
	
	return returnObj;

        
})();

(function($) {

	//grid를 div테그로 감싸서 display:none 에서 block할 경우 제대로 출력 안되는 현상 발생
	//block시에 해당 함수 호출 해줘야 그려짐.
	displayBlockGrid = function(){
		
		if(wijmo && wijmo.Control){
			wijmo.Control.invalidateAll();			
		}
	}
	
	Array.prototype.move = function (old_index, new_index) {
	    while (old_index < 0) {
	        old_index += this.length;
	    }
	    while (new_index < 0) {
	        new_index += this.length;
	    }
	    if (new_index >= this.length) {
	        var k = new_index - this.length;
	        while ((k--) + 1) {
	            this.push(undefined);
	        }
	    }
	    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
	    return this; // for testing purposes
	};
	
	//String 형식의 url 파라메터를 json객체로 변환.
	String.prototype.parseUrlParameter = function () {
		var regex = /[?&]?([^=#]+)=([^&#]*)/g,
        url = this,
        params = {},
        match;
	    while(match = regex.exec(url)) {
	        params[match[1]] = match[2];
	    }
	    return params;
	};
	
	var VERSION = "1.0.1";

	var CRUD = {
		C : "C",
		R : "R",
		U : "U",
		D : "D"
	};

	var CONTROL_CHECKBOX = "Checked";
	var CLASSNAME_CUSTOM_CHECKBOX="my-custom-checkbox"; //사용자 정의 체크박스를 구분하기 위한 클래스명.
	
	var isLoading = false; 
	
	var isProperty = function(property, key) {

		var isBoolean = false;

		if (!property) {
			return isBoolean;
		}

		if (property.hasOwnProperty(key)) {
			isBoolean = true;
		}

		return isBoolean;

	};

	var string_format = function(s, args) {
		if ($.type(args) == "array") {
			for (var i = 0; i < args.length; i++) {       
				var reg = new RegExp("\\{" + i + "\\}", "gm");             
				s = s.replace(reg, args[i]);
			}
			return s;				
		} else {
			return s;
		};
	};
	
	var formatter = function(value, format) {
		var fs = format.split("");
		var r = "";
		var i = 0;
		$.each(fs, function(x, c) {
			if (fs[x] == "#") {
				if ($.type(value[i]) != "undefined") {
					r += value[i];
				}
				;
				i++;
			} else {
				r += fs[x];
			}
			;
		});
		if (i != value.length) {
			r += value.substring(i);
		}
		;
		return r;
	};

	var makeNumberformat = function(format) {
		var length = 0;
		var decimal = "";
		if (format.length == 2) {
			length = format.substring(1);
			if (length > 0) {
				decimal = ".";
			};
		};
		for (var i = 0; i < length; i++) {
			decimal += "0";
		};
		return "#,###" + decimal;
	};

	var formatNumber = function(value, format) {
		if (value == 0) {		//0을 포맷하면 ""이 나옴...
			return value;
		};
		
		value = $.formatNumber(value, { format: format });
		
		if(value.indexOf(".") == 0){
			value = "0"+value;
		}
		
		return value;
	};
	
	
	var ajaxQueue = $({});
	var currentRequest = null;
	$.ajaxQueue = function( ajaxOpts ) {
	    // Hold the original complete function.
	    var oldComplete = ajaxOpts.complete;
	    // Queue our ajax request.
	    ajaxQueue.queue(function( next ) {
	        // Create a complete callback to fire the next event in the queue.
	        ajaxOpts.complete = function() {
	            // Fire the original complete if it was there.
	            if ( oldComplete ) {
	                oldComplete.apply( this, arguments );
	            }
	            // Run the next query in the queue.
	            next();
	        };
	        // Run the query.
	        currentRequest = $.ajax( ajaxOpts );
	    });
	};



	// Abort method
	var abortAjaxQueue = function() {
	    ajaxQueue.clearQueue();
	    if (currentRequest) {
	        currentRequest.abort();
	    }
	}	
	
	
	var crossAjax  = function(p,callback){
		
		
		var isUpload = false;
		
		//업로드 여부 체크.
		for ( var key in p.celluploadfiles) {
			isUpload = true;
			break;
		}
		
		//formdata 없을 경우
		if(Browser.type == "MSIE" && Browser.version < 10 && isUpload){

			var formParams = p.querystring.parseUrlParameter();
			
			var form = "";
			form += "<form id=\"flexgrid-upload-form\" content-type='multipart/form-data' method='POST' action=\""+p.action+"\" enctype='multipart/form-data'  target=\"flexgrid-upload-iframe\">																							\n";
			for ( var fp in formParams) {
				form += "<input type='hidden' name='"+fp+"' value='"+formParams[fp]+"' />						\n";
			}
			form += "<input type='hidden' name='_AJAX_' value='Y' />														\n";
			form += "</form>																								\n";
			
			var iframe = "";

			iframe += "<iframe id=\"flexgrid-upload-iframe\" src=\"about:blank\" name=\"flexgrid-upload-iframe\" style=\"display:none;visibility:hidden\"></iframe>\n";
			
			var $form = $(form);			
			var $iframe = $(iframe);

            
            $iframe.bind("load",function(e){
            	
            	var resultStr = $(this).contents().find("body").html();
            	var tmpjsonRtn = null;
            	if(resultStr != ""){
            		
            		try {
                    	tmpjsonRtn = JSON.parse($(this).contents().find("body").html());
					} catch (e) {
						alert("JSON 객체로 변환 중  에러 발생 - JSON 형식의 문자열이 아닙니다.  [ grid id : "+p.div_id+" ] ");						
						console.log("error crossAjax(iframe) function [ grid id : "+p.div_id+" ] ");						
						console.log(e);	
						
                		$iframe.remove();
                    	$form.remove();
						return;
					}
                	
                   	jsonRtn = tmpjsonRtn;

                	try {

                    	if(callback && typeof(callback) == "function"){
                    		callback(jsonRtn);
                    		$iframe.unbind("load");
                    		$iframe.remove();
                    		$form.remove();
                    	}									
    				
                    } catch (e) {
						
						if(jqXHR.responseText === undefined){
							alert("데이터 처리 중  에러 발생  [ grid id : "+p.div_id+" ] ");						
						}
						console.log("error crossAjax(iframe) function [ grid id : "+p.div_id+" ] ");						
						console.log(e);	
						
                		$iframe.remove();
                    	$form.remove();
    				}	
            	}

					
            });
            
            $iframe.bind("error",function(){                 		
				alert("서버와 연결이 제대로 이루어지지 않습니다.");
        		$iframe.unbind("error");
           		$iframe.remove();

        		$form.remove();
            });
			
			$form.appendTo("body");
			$iframe.appendTo("body");
			
			for ( var file in p.celluploadfiles) {
				$form.append(p.celluploadfiles[file]);	
				delete p.celluploadfiles[file]; //업로드를 제외한 조회할 경우에는 $.ajax를 실행하기 위하여 첨부파일 객체를 날려준다.
			}
		
			$form[0].submit();

		}else{
			
	    	$.ajaxQueue({
				url : p.action,
				type : "POST",
				data : (p.isFormData) ? p.formData : p.querystring,
				isGridFile : (p.isFormData) ? true : false,  //그리드 파일 업로드 호출할 경우 셋팅
				async : true,
				timeout: 30000,
				processData : false,
				dataType : "jsonp",
				jsonpCallback : "ovpcallback",
				contentType: (p.isFormData) ? false : "application/x-www-form-urlencoded;charset=utf-8",
				beforeSend : function(xhr){					
					if(p.appendLoading && typeof(p.appendLoading) == "function"){
						p.appendLoading(p);						
					}
				},
				success : function(data) {
					
					if(p.removeLoading && typeof(p.removeLoading) == "function"){
						p.removeLoading(p);						
					}
					callback(data);								
				},
				error : function(jqXHR, textStatus, errorThrown) {
					if(jqXHR.responseText === undefined){
						alert("서버와 통신 중 에러 발생  [ grid id : "+p.div_id+" ] ");						
					}
					console.log("error crossAjax function [ grid id : "+p.div_id+" ] ");						
					console.log(errorThrown);		
				}
			});	
		    			
		}
	}				

	
	OVERPASS.GRID.FLEXGRID.calendar = function(config){
		
		
		var p = $.extend(true, {
			top : 0,
			left  : 0,
			width : 222,
			position  : null,
			language : "kr",
			option : {
				hour : false,
				minute : false
			},
			format : "####/##/## ##:##" ,
			dates  : null,
			types : null,
			calendars : {},
			pickers : {},
			data : null,
			onSelect : function(d,p,picker,self){
				
			},
			onConfirm : function(p,self){
				
			},
			onCheckboxEndDate : function(p,self){
				
			},
		},config);
		
		var width = 222;
		
		if(p.dates.length == 2){
			p.width = 454;
		}
		
		
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();
		
		var padding = 15;
		
		//left 위치 설정
		if( (p.left + p.width+padding) >= windowWidth ){
			p.left = p.left-$(p.cell).width() - p.width - padding ;
		}
		
		var wrap = this._layout(p);
		this._setCalendar(p);

		
		var height = wrap.height();

		//top 위치 설정
		if( (p.top + height + padding) >= windowHeight ){
			p.top = p.top+$(p.cell).height() - height-(padding+1) ;
		}
		
		wrap.css({
			top : p.top,
			left : p.left
		});
		
		if((config.option && config.option.minute === true)){
			config.option.hour = true;
		}
		
		this._getPin = function(){
			return p;
		};
		
	};
	
	OVERPASS.GRID.FLEXGRID.calendar.prototype = {
			
			_layout : function(p){
				
				var self = this;

				var div = $("<div class=\"wj-flexgrid-pionnet-calendar\" />");
				
				var html = "<div class=\"pionnet-calendar-body\">";
				
				for (var i = 0; i < p.dates.length; i++) {
					html +="<div id=\""+p.dates[i]+"\" />";
				}
				
				html +="</div>";
				html +="<div>";

				var confirmid = p.gridId+"datepicker-confirm-pionnet";
				var closeid = p.gridId+"datepicker-close-pionnet";
				
				//dates 배열이 2개면 달력을 2개 출력.
				if(p.dates != null && p.dates.length == 2){
					var checkboxid = p.gridId+"datepicker-checkbox-pionnet";
					
					html +="	<div class=\"datepicker--buttons\">";
					html +="		<span class=\"datepicker--button datepicker-button-confirm\" id='"+confirmid+"'>"+$.fn.datepicker.language[p.language].confirm+"</span>";
					html +="		<span class=\"datepicker--button datepicker-button-cancel\" id='"+closeid+"'>"+$.fn.datepicker.language[p.language].close+"</span>";
					html +="		<span style=\"margin:0;padding:0;margin-top: 20px; padding-left: 15px;width: 140px;\"><input style='margin: 0;padding: 0;position: absolute;' type=\"checkbox\" id='"+checkboxid+"' /><label for='"+checkboxid+"' style='margin: 0;padding: 0;display: inline-block;margin-left: 15px;font-weight:normal;line-height: 1;vertical-align: top;color: black;'>"+$.fn.datepicker.language[p.language].noEndDate+"</label></span>";
					html +="	</div>";					
				}else{
					html +="	<div class=\"datepicker--buttons\">";
					html +="		<span class=\"datepicker--button datepicker-button-confirm\" id='"+confirmid+"'>"+$.fn.datepicker.language[p.language].confirm+"</span>";
					html +="		<span class=\"datepicker--button datepicker-button-cancel\" id='"+closeid+"'>"+$.fn.datepicker.language[p.language].close+"</span>";
					html +="	</div>";							
				}

				html +="</div>";
				
				div.html(html);
				div.css({
					"top" 						: p.top,
					"left"		 				: p.left
				});
				
				$(div).appendTo("body");
				
				return div;
			},
			
			_setCalendar : function(p){
				
				var self = this;
				
				for (var i = 0; i < p.dates.length; i++) {

					p.calendars[p.dates[i]] = $('#'+p.dates[i]).datepicker({
					    timepicker: (p.option.hour === true || p.option.minute === true) ? true : false,
						timeFormat: "hh:ii",
						inline: true,
						dateFormat : "yyyy-mm-dd",
					    language: p.language,
						todayButton: new Date(),
						clearButton: false,
						showOtherYears : false,
					    minHours: 0,
					    maxHours: 23,
					    minutesStep : 5,
					    onSelect: function (fd, d, picker) {
					        // Do nothing if selection was cleared
					        if (!d) return;
					        p.pickers[picker.el.id] = picker; 
					        p.onSelect(d,p,picker,self);
					    }
					})
					
					//p.calendars[p.dates[i]].selectDate(new Date(formatter(p.data[p.dates[i]],"####-##-## ##:##:##")))
				}

				//p.calendars[p.dates[i]]
				for (var i = 0; i < p.dates.length; i++) {

					var colId = p.dates[i];
					var noEvent = false;
					
					if((p.data[colId]  && p.data[colId] !="" )){
						if(p.types != null && p.types[colId] != "" && p.types[colId] == DATATYPE.DATE){
							p.calendars[colId].data('datepicker').selectDate(new Date(p.data[colId]),noEvent);
						}else if(p.types != null && p.types[colId] != "" && p.types[colId] == DATATYPE.TEXT_DATE){
							
							var date = new Date(formatter(p.data[p.dates[i]],"####/##/## ##:##"));
							if(isNaN(date)){
								date = new Date(formatter(p.data[p.dates[i]],p.format));
							}
							p.calendars[colId].data('datepicker').selectDate(date,noEvent);														
						}
												
					}else{

						if(p.calendars[p.dates[i]].data('datepicker').selectDate){
							p.calendars[p.dates[i]].data('datepicker').selectDate(new Date(),noEvent);									
						}
					}		
					
					if(p.pickers[p.dates[i]] && p.pickers[p.dates[i]].lastSelectDate){

						var lastSelectDate = p.pickers[p.dates[i]].lastSelectedDate;

						lastSelectDate.setHours(lastSelectDate.getHours());
						lastSelectDate.setMinutes(lastSelectDate.getMinutes());						
					}

				}
										

				var confirmid = p.gridId+"datepicker-confirm-pionnet";

				$("#"+confirmid).on("click",function(){
					p.onConfirm(p,self);
				});
				
				var closeid = p.gridId+"datepicker-close-pionnet";

				$("#"+closeid).on("click",function(){
					
					$(".datepicker-button-confirm").off("click");
					$(".datepicker-button-close").off("click");
					
					var calendars = p.calendars;
					
					for (var key in calendars) {
						if(calendars[key].data('datepicker')){
							calendars[key].data('datepicker').destroy();						
						}
					}
					
					$(".wj-flexgrid-pionnet-calendar").remove();
					
				});
				
				var checkboxid = p.gridId+"datepicker-checkbox-pionnet";

				$("#"+checkboxid).on("click",function(){
					var isCheck = this.checked;
					p.onCheckboxEndDate(isCheck,p,self);
				});
			},
			
			show : function(){
				$(".wj-flexgrid-pionnet-calendar").show();
			},
			
			hide : function(){
				$(".wj-flexgrid-pionnet-calendar").hide();
			},
			
			destory : function(){
				
				$(".datepicker-button-confirm").off("click");
				var calendars = this._getPin().calendars;
				for (var key in calendars) {
					if(calendars[key].data('datepicker')){
						calendars[key].data('datepicker').destroy();						
					}
				}
				
				$(".wj-flexgrid-pionnet-calendar").remove();
			},
	};


	

	OVERPASS.GRID.FLEXGRID.receivers = {};
	OVERPASS.GRID.FLEXGRID.instances = {}
	OVERPASS.GRID.FLEXGRID.excel = {

		/**
		 * 엑셀파일에 담긴 내용을 Flexgrid에 입력한다.
		 */
		importExcel : function(fg, pin, $contextLayer, files) {
			
			var X = XLSX;
			var rABS = typeof FileReader !== "undefined" && typeof FileReader.prototype !== "undefined" && typeof FileReader.prototype.readAsBinaryString !== "undefined";
			
			var fixdata = function(data) {
				var o = "", l = 0, w = 10240;
				for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
				o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
				return o;
			}
			
			var to_json = function(workbook) {
				var result = {};
				workbook.SheetNames.forEach(function(sheetName) {
					var roa = X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
					if(roa.length > 0){
						result[sheetName] = roa;
					}
				});
				return result;
			}
			
			var to_csv = function(workbook) {
				var result = [];
				workbook.SheetNames.forEach(function(sheetName) {
					var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
					if(csv.length > 0){
						result.push(csv);
					}
				});
				return result.join("\n");
			}
			var process_wb = function(wb) {
				var output = to_json(wb);

				var first = false;
				for ( var sheetKey in output) {
					
					if(!first){
						first = true;
					}else{
						break;
					}
					
					var sheetLength = output[sheetKey].length;	
					var isColumn = true; //추후에 엑셀 첫번째 row에 컬럼명이 하나도 일치 하는지 하지 않는지 체크 할 때에는 false로 기본값으로 변경 해줘야 함.
					
					
					if(sheetLength > 0 ){
						var excelFirstRow = output[sheetKey][0];
						//엑셀 첫번째 row에 컬럼명이 하나도 일치 하는지 하지 않는지 체크.
//						for ( var key in excelFirstRow) {
//
//							if(Util.getColumnId(fg,key) != ""){
//								isColumn = true;
//							}
//						}
						
						if(!isColumn){
							//엑셀 첫번째 row에 컬럼명이 하나도 일치 하지 않는다면 text로 받아서 처리함.							
							process_wb_csv(wb);
							
						}else{
							for (var i = 0; i < sheetLength; i++) {
								
								var excel_org = output[sheetKey][i];
								var addRow = {};
								
								for ( var key in excel_org) {
									addRow[Util.getColumnId(fg,key)] = excel_org[key];							
								}
								
								fg.o.AddRow({
									data : addRow
								});
							}//end for (var i = 0; i < sheetLength; i++) {	
						} //end }else{							
					}//end 	if(sheetLength > 0 ){				
				}
			}
			//해결방안 찾을 때 까지 일단 나둔다.
//			var process_wb_csv = function(wb) {
//				var output = to_csv(wb);
//
//				if(output && output != ""){
//					
//					var excelRows = output.split("\n");
//					var excelRowsLength = excelRows.length;
//					
//					for (var i = 0; i < excelRowsLength; i++) {
//						var excelRow = (function(row){return row;})(excelRows[i]);
//						var excelRowData = excelRow.split(",");
//						
//						console.log(excelRowData)
//					}
//					
//					
//				}
//			}
			
//			
			if (fg) {
				
				//컬렉션 뷰 items와 fg.rows 데이터는 다르게 처리되는 것 같다. 클리어 할때 따로 처리해줌.
				while ((length = fg.rows.length) != 0) {
					fg.rows.removeAt(length - 1);
				}
				
				while ((length = fg.o.cv().items.length) > 0) {
					fg.o.cv().items.pop(length - 1);
				}
				
				var isExcelImportUrl = false;
				var excelImportUrl = "";
				var gridGlobal = OVERPASS.GRID.FLEXGRID.global;
				
				if(gridGlobal && gridGlobal.excel_import_url && gridGlobal.excel_import_url != ""){
					isExcelImportUrl = true;
					excelImportUrl = gridGlobal.excel_import_url;
				}
				
				if(pin.properties.excel_import_url && pin.properties.excel_import_url != "" ){
					isExcelImportUrl = true;
					excelImportUrl = pin.properties.excel_import_url;
				}
				
				if(isExcelImportUrl){

					//DATA_BINDINGS
					var DATA_BINDINGS = [];
					$.each(pin.columns, function(i, column) {
						DATA_BINDINGS.push({
							ID: column.binding,
							TYPE: column.type
						});
					});
					
					var querystring = null;
	
					
	                var isFormData = false;
	                var formData = null;
	                var celluploadfiles = {};
	                
                    var file_id = Math.round(Math.random() * 100000);
                    files.name = file_id;
                    celluploadfiles[file_id] = files;

	                if((Browser.type == "MSIE" && Browser.version >= 10) || Browser.type != "MSIE"){

	                	isFormData = true;
	                    
	                    formData = new FormData();
	                    formData.append(file_id,files.files[0]);  
	                    formData.append("file_id",file_id);  
	                }
	
	                if(isFormData){                       
	    				formData.append("DATA_BINDINGS",JSON.stringify(DATA_BINDINGS));
	    				formData.append("MOBILE_YN","Y");
	    				//formData.append("GRID_DATA","{}"); //해당 파라메터 명을 넘기면 grid data 로 인식 하여 해당 값({"MESSAGE":{"login":"Y","code":"S"}})이 붙어 나온다. 필요없으니 제거. 
	    				formData.append("_AJAX_","Y");
	                }else{
	                	querystring = "DATA_BINDINGS=" + JSON.stringify(DATA_BINDINGS) + "&MOBILE_YN=Y&_AJAX_=Y&file_id="+file_id;
	                }
					
	
	                var crosssAjaxPin = {
	                        div_id : pin.div_id,
	                        action : excelImportUrl, 
	                        querystring : querystring,
	                        formData : formData,
	                        isFormData : isFormData,
	                        celluploadfiles : celluploadfiles,
	                        dataAsync : false
	                 }
	                 
	                 crossAjax(crosssAjaxPin,function(data) {
	                	
	                	if(data != null){
	                    	
	                    	if((data instanceof Array) && data.length > 0){
	                    		var length = data.length;
	                    		for (var i = 0; i < length; i++) {
		
	            					g.o.AddRow({
	            						position : "last",
	            						data : data[i]
	            					});
								}
	                    		
	                    	}
		
	                	}
							
	                 });
				
				}else{			
				
					//chrome,firefox,ie10 이상
					var reader = new FileReader();
					var f = files.files[0];
					var name = f.name;
					reader.onload = function(e) {
	
						var data = e.target.result;
						var wb;
						if(rABS) {
							wb = X.read(data, {type: 'binary'});
						} else {
							var arr = fixdata(data);
							wb = X.read(btoa(arr), {type: 'base64'});
						}
						process_wb(wb);
					};
					
					if(rABS) reader.readAsBinaryString(f);
					else reader.readAsArrayBuffer(f);	
				}

				$contextLayer.remove();
			}

		},

		/**
		 * FlexGrid내용을 엑셀 파일로 출력한다.
		 */
		exportExcel : function(fg, pin, $contextLayer, anchor) {
			

			
			var isVisible = fg.columns[0].visible? true : false;
			var oval = "";
			// control checkbox
			fg.columns[0].visible = false;
			
			
			if(fg.rows.length == 0){						
				var result = wijmo.grid.ExcelConverter.export(fg, {
					includeColumnHeader : true
				});			

			}else{

				oval = fg.rows[0].dataItem[CONTROL_CHECKBOX];
				fg.rows[0].dataItem[CONTROL_CHECKBOX] = "";
				fg.refresh();

				var result = wijmo.grid.ExcelConverter.export(fg, {
					includeColumnHeader : true
				});
				
			}

			if (navigator.msSaveBlob) {
				var blob = new Blob([ result.base64Array ]);
				navigator.msSaveBlob(blob, pin.properties.excel_export_name || fg.o.id+".xlsx");
			} else {
				anchor.href = result.href();
			}

			if(isVisible){
				fg.columns[0].visible = true;				
			}
			
			if(fg.rows.length > 0){		
				fg.rows[0].dataItem[CONTROL_CHECKBOX] = oval;
			}
			
			fg.refresh();

			$contextLayer.remove();
		}
	};

	// 엑셀 변수 지정.
	var Excel = OVERPASS.GRID.FLEXGRID.excel;
	var Instances = OVERPASS.GRID.FLEXGRID.instances;
	// 그리드 생성시 필요한 메소드 모음
	OVERPASS.GRID.FLEXGRID.util = {

		isEditable : function(fg, row, col, columnId) {

			var rowEditable = true;
			var colEditable = true;
			var cellEditable = fg.editablecells[row + "_" + columnId] === undefined ? true : fg.editablecells[row + "_" + columnId];

			$.each(fg.rows, function(z, row) {

				// 컨트롤 체크박스는 넘어간다.
				if (row == row.index) {
					rowEditable = !row.isReadOnly;

					return false;
				}
			});

			$.each(fg.cells.columns, function(z, cellcolumn) {

				// 컨트롤 체크박스는 넘어간다.
				if (col == cellcolumn.index) {

					$.each(fg.usercolumns, function(z, column) {

						if (cellcolumn.name == column.id) {

							colEditable = column.editable;

							return false;
						}
					});

					return false;
				}
			});

			return rowEditable && colEditable && cellEditable;

		},

		/***********************************************************************
		 * 컬럼 셋팅시 FlexGrid 데이터타입에 맞게 변경
		 * 
		 * @param dataType
		 *            String,Number,Date,Array,Object 등 타입으로 넘어옴.
		 * @return String
		 */
		changefgDataType : function(columnType) {

			var returnValue = "";

			if (columnType == "T") {
				returnValue = "String";
			} else if (columnType == CONTROL_CHECKBOX) {
				// 기본 값을 T(Text)로 셋팅
				returnValue = "Boolean";
			} else {
				// 기본 값을 T(Text)로 셋팅
				returnValue = "String";
			}

			return returnValue;

		},

		/***********************************************************************
		 * 컬럼 dataType을 오버패스 그리드 데이터타입으로 변경.
		 * 
		 * @param dataType
		 *            String,Number,Date,Array,Object 등 타입으로 넘어옴.
		 * @return String
		 */
		getDataType : function(dataType) {

			var returnValue = "";

			if (dataType == "String") {
				returnValue = "T";
			} else {
				// 기본 값을 T(Text)로 셋팅
				returnValue = "T";
			}

			return returnValue;

		},

		/***********************************************************************
		 * 현재 선택된 셀 데이타를 가져온다.
		 * 
		 * @param fg
		 *            flexGrid 객체
		 * @param cr
		 *            현재 선택된 셀 범위
		 * @return JSONObject
		 */
		getCurrCellData : function(fg, cr,e,id) {

			// 로우 추가 후 index 변경시에 -1값으로 출력됌.데이터 아이템 에러나서 0번째로 강제 변경
			var row = (cr.row < 0) ? 0 : cr.row;
			
			var id = (id) ? id : fg.cells.columns[cr.col].name;

			//현재 컬럼이 merge 컬럼이라면 mergerow에 해당되는 첫번째 row 정보 리턴.
			if(fg.cells.columns[cr.col].allowMerging){
				
				var currRow = fg.rows[row]._data;
				var mergeFirstRow = -1;
				for (var i = row ; i > -1; i--) {

					if(currRow[id] != fg.rows[i]._data[id]){
						
						row = mergeFirstRow;
						break;
					}else if( i == 0){
						row = 0;
						break;
					}
					mergeFirstRow = i;
				}
				
			}
			
			var rdata = fg.rows[row]._data;
			
			var position = $(e.target).offset();
			var type = fg.celltypes[row + "_" + id] || ((isProperty(fg.usercolumns[id], "type")) ? fg.usercolumns[id].type: "");

			
			var data =  {
					Id : id,
					Row : row,
					Text: $(e.target).text(),
					Left: position.left,
					Top: position.top,
					Right: (position.left + e.target.clientWidth),
					Bottom: (position.top + e.target.clientHeight),
					isGroup : isProperty(rdata, "isGroup") && rdata["isGroup"] ? true :false,
					isTotal : isProperty(rdata, "isTotal") && rdata["isTotal"] ? true :false

				};
			
			if(type == DATATYPE.FILE){			
				data.Value = rdata[id] || "";
				data.PreValue = (rdata.hasOwnProperty("_F_PRE_" + id)) ? rdata["_F_PRE_"+ id] : rdata["_F_"+id] || "";
				data.OrgValue = (rdata.hasOwnProperty("_F_ORG_" + id)) ? rdata["_F_ORG_"+ id] : rdata["_F_"+id] || "";
			}else{
				if(!rdata){
					rdata = {};
				}
				data.Value = rdata.hasOwnProperty(id) ? (rdata[id] || "") : "";
				data.PreValue = (rdata.hasOwnProperty("_PRE_" + id)) ? rdata["_PRE_"+ id] : rdata[id];
				data.OrgValue = (rdata.hasOwnProperty("_ORG_" + id)) ? rdata["_ORG_"+ id] : rdata[id];
			}
			
			
			return data;
		},

		getRow : function(cv, row) {
			var item = cv.items[row];

			if (item == null) {
				return;
			}

			if (!item.hasOwnProperty("CRUD")) {
				item["CRUD"] = CRUD.R;
			}

			if (!item.hasOwnProperty("Visible")) {
				item["Visible"] = "Y";
			}

			return item;
		},

		updateData : function(cv, row) {
			cv.editItem(row);
			cv.commitEdit();
		},

		getRowNum : function(p) {

			var row = null;

			// row 값이 넘어오지 않으면 최종 선택된 row 출력
			if (typeof (p) == "object" && !p.hasOwnProperty("row")) {
				row = p.selectLastRow;
			} else {
				row = p.row;
			}

			if (row && $.type(row) == "string") {
				row = Number(row);
			}

			return row;

		},
		
		reDefineColumn : function(column, pin) {

			var fgColumn = {
				header : null,
				binding : null,
				width : 120,
				dataType : "String", //Flexgrid에서 NumberString 과같은 여러 타입이 존재하나.. 기본적으로 전부 String으로만 처리한다. 
				isRequired : false, // FLEXGRID 자체 내에서 필수 검증 처리 한다. 별도 처리 하기위하여 해당 옵션을
				isReadOnly : false,
				// align :"center",
				name : "",
				cssClass : "",
				allowMerging : false
				
			}

			var setcolumn = $.extend(fgColumn,{
				header : column.header,
				binding : column.binding != column.id && pin.calculations.length == 0 ? column.binding: column.id,
				width : column.width,
				visible : column.type == DATATYPE.HIDDEN ? false : column.visible,
				isReadOnly : (column.button || column.type == DATATYPE.TEXT_DATE	|| column.type == DATATYPE.DATE	|| column.type == DATATYPE.LEVEL|| column.type == DATATYPE.FILE) ? true : !column.editable || false,
				allowSorting : (column.type == DATATYPE.CHECKBOX) ? false : column.sort,
				dataType : Util.changefgDataType(column.type),
				name : column.id,
				cssClass : column.id,
				allowMerging : column.merge,
				showDropDown : true

			});

			return setcolumn;
		},

		getColumnIndex : function(fg, columnName) {

			var index = -1;

			var length = fg.cells.columns.length;

			for (var i = 0; i < length; i++) {

				if (columnName == fg.cells.columns[i].name) {
					index = fg.cells.columns[i].index;
					break;
				}
			}

			return index;

		},
		
		getColumnId : function(fg, columnName) {

			var name = "";

			var length = fg.cells.columns.length;
			for (var i = 1; i < length; i++) {

				if (columnName == fg.cells.columns[i].name) {
					name = columnName;
					break;
				}else if(fg.usercolumns.hasOwnProperty(fg.cells.columns[i].name) && (columnName == fg.usercolumns[fg.cells.columns[i].name].header)){
					name = fg.cells.columns[i].name;
				}
			}

			return name;

		},
		getColumnIdFirstByDataType : function(columns, datatype) {

			var colId = "";

			for ( var id in columns) {
				if (columns[id].type == datatype) {
					colId = id;
					break;
				}
			}

			return colId;

		},
		getFileName : function(val){
		    var tmpStr = val;
		    
		    var cnt = 0;
		    while(true){
		        cnt = tmpStr.indexOf("/");
		        if(cnt == -1) break;
		        tmpStr = tmpStr.substring(cnt+1);
		    }
		    while(true){
		        cnt = tmpStr.indexOf("\\");
		        if(cnt == -1) break;
		        tmpStr = tmpStr.substring(cnt+1);
		    }
		    
		    return tmpStr;
		}

	};

	// alias 모음. grid 네임스페이스를 약어로 축약 한다.
	var Util = OVERPASS.GRID.FLEXGRID.util;

	OVERPASS.GRID.FLEXGRID.createGrid = function(pin) {
		var div_id = pin.div_id;
		var div = document.getElementById(div_id); // parent element(DIV or
													// SPAN)

		// 그리드 가로 세로 크기 설정
		var width = pin.properties.width && pin.properties.width != "" ? pin.properties.width+""	: "100%";
		var height = pin.properties.height && pin.properties.height != "" ? pin.properties.height+""	: "200px";
		
		if(width.indexOf("px") == -1 && width.indexOf("%")  == -1 ){
			width = width +"px";
		}
		
		if(height.indexOf("px") == -1 && height.indexOf("%")  == -1 ){
			height = height +"px";
		}
		div.style.cssText = "width : "+width+";height : "+height+";"+div.style.cssText;
		
		var o = {
			id : pin.id,
			div_id : div_id,
			events : pin.events
		};
		// var skin = grid_skin[_site_skin] || grid_skin["blue"];
		var initParams = "id=" + pin.id + ",div_id=" + pin.div_id+ ",clipboard_copy=" + pin.properties.clipboard_copy; // ,로 구분
		// $.each(skin, function(k, v) {
		// initParams += ("," + k + "=" + v);
		// });

		var selectLastRow = 0;
		var selectLastCell = null;
		var beginEditCellId = null;
		var calendar = null;  //달력

		// boolean flag값 모음
		var isValid = {
			isFirstLoad : false, // 그리드 data 첫 로드 여부
			isCalendar : false, // 달력 실행 여부
			isAdded : false, // row 추가 여부
			isEditColumnExist : false, // 컬럼 편집 가능 여부
			isTopLeft : false, // topleft contextemenu 설정 여부
			frozenYn : false
		}

		var colModel = new Array();
		var columns = {}; // column정보를 맵형태로 저장해 준다.
		var cv = new wijmo.collections.CollectionView([]), // 데이터가 모여있는collection view
		cr = null, // 현재 선택된 셀 범위
		cp = null; // 현재 석택된 grid 패널
		cv.trackChanges = true;
		// 멀티헤더일 경우 처리해 준다...
		$.each(pin.columnheaders, function(i, chs) {
			$.each(chs, function(j, ch) {
				pin.columnheaders[i][j] = (typeof(ch) != "object") ? ch : ch.header; //컬럼 헤더가 객채정보로 넘오오지 않으면 headerlines로 설정한 것임으로 컬럼명이 넘어온다.
			});
		});

		var combos = {};
		var editablerows = {}; // row별 편집여부 저장
		var editablecells = {}; // cell별 편집여부 저장
		var celltypes = {}; // cell별 데이타타입 저장
		var cellformats = {}; // cell별 format 저장
		var cellbuttons = {}; // cell별 button사용 여부
		var cellupload= {};  //셀별 파일 업로드 정보.
		var celluploadfiles= {};  //셀별 파일 업로드 정보.
		var cellbolds = {}; // cell별 데이타타입 저장
		var forecolor = {}; // row 폰트색 저장
		var backcolor = {}; // row 배경색 저장
		var formatterCol = null; // 버튼 컬럼 편집 시작 인지 아닌지 체크
		var formatterRow = null; // 버튼 컬럼 편집 row 번호
		var frozenColumns = null
		var groupcolumns = {};
		var calculations= {};
		var sort = {};
		
		
		var clearGridData = function() {

			while ((length = fg.rows.length) != 0) {
				fg.rows.removeAt(length - 1);
				editablerows = {}; // row별 편집여부 저장
				editablecells = {}; // cell별 편집여부 저장
				forecolor = {}; // row 폰트색 저장
				backcolor = {}; // row 배경색 저장
				formatterCol = null; // 버튼 컬럼 편집 시작 인지 아닌지 체크
				formatterRow = null; // 버튼 컬럼 편집 row 번호
				celltypes = {};
				cellformats = {};
				cellbuttons = {};
				cellupload = {};
				celluploadfiles = {};
				cellbolds = {};
			}
			
			//컬렉션 뷰 items와 fg.rows 데이터는 다르게 처리되는 것 같다. 클리어 할때 따로 처리해줌.
			while ((length = cv.items.length) > 0) {
				cv.items.pop(length - 1);
			}
		}
		
        var createCombo = function(editColumn,combolist,isNone) {
            var grid = editColumn.grid;


            var comboFormatItem  = function(s,e){
                var editRange = grid.editRange,
                column = e.panel.columns[e.col];
	            // check whether this is an editing cell of the wanted column
	            if (!(e.panel.cellType === wijmo.grid.CellType.Cell && column === editColumn && editRange && editRange.row === e.row && editRange.col === e.col)) {
	                return;
	            }
	            
	            e.cell.innerHTML="";
	            // add custom editor
	            var html = "<select id='_FLEX_COMBO' style='width:100%;height:100%;z-index:99999'>";
	            if(combolist != null && combolist.length > 0){
	            	for ( var i = 0 ;i < combolist.length ; i++) {
	            		
	            		if(!isNone && i==0 && combolist[i].value.indexOf("선택") == -1 ){
	                        html += "<option value='-999'>선택</option>";                			
	            		}
	            		
	            		
	                    html += "<option value='"+combolist[i].key+"' >"+combolist[i].value+"</option>";
					}                	
	            }
	
	            html += "</select>";
	           
	            $(html).appendTo(e.cell);
	            
				if(Browser.type == "MSIE" && Browser.version < 10 ){
					
					$("#_FLEX_COMBO option").each(function(){

						if(this.value == cv.items[e.row][column.name]){
							$(this).attr("selected","selected");
							return false;
						}
						
					});
				
					var dataRow = e.row; // 버전업 하면서 생긴 버그인듯 기존 row index가 +1 되면서 출력됨... 또 버전업 되었을때 문제 생길 요지 있으니 확이
					$("#_FLEX_COMBO").change(function(){
						
						var row = o.GetRow({row : dataRow});
		            	o.SetValue({
							row : dataRow,
							id : column.name,
							value : (this.value == "-999") ? row["_ORG_" + column.name] : this.value
						});
						
						pin.events.ChangeCombo({
							Id : column.name,
							Row : dataRow,
							Value : (this.value == "-999") ? row["_ORG_" + column.name] : this.value,
							PreValue : row["_PRE_" + column.name],
							OrgValue : row["_ORG_" + column.name]
						});
					});

				}else{

					var dataRow = e.row;
		            var cmb = new wijmo.input.ComboBox("#_FLEX_COMBO", {
		                selectedValue: grid.getCellData(e.row, e.col, false),
		                isEditable: false
		            });
		            
		            cmb.focus();               
		            cmb.selectedIndexChanged.addHandler(function(selectbox) {

		            	var row = o.GetRow({row : dataRow});
		            	o.SetValue({
							row : dataRow,
							id : column.name,
							value : (selectbox.selectedValue == "-999") ? row["_ORG_" + column.name] : selectbox.selectedValue
						});
						
						pin.events.ChangeCombo({
							Id : column.name,
							Row : dataRow,
							Value : (selectbox.selectedValue == "-999") ? row["_ORG_" + column.name] : selectbox.selectedValue,
							PreValue : row["_PRE_" + column.name],
							OrgValue : row["_ORG_" + column.name]
						});
		
					});
		
				}
	    
	            // cellEditEnding that updates cell with user's input
	            var editEndingEH = function (s, args) {
	                grid.cellEditEnding.removeHandler(editEndingEH);
	                if (!args.cancel) {
	                	args.cancel = true;
	                }
	                
		            grid.formatItem.removeHandler(comboFormatItem);

	            };
	            	
	
//	             subscribe the handler to the cellEditEnding event
	            grid.cellEditEnding.addHandler(editEndingEH);
	            

            }
            grid.formatItem.addHandler(comboFormatItem);
        }
        
        var setMergeCell = function(p){
        	
         	var isAddMerge = false;
	        var mm = new wijmo.grid.MergeManager(fg);
	        
	        var pRng = (p) ? new wijmo.grid.CellRange(p.startRow, p.startCol , p.lastRow, p.lastCol) : null;
	        
	        mm.getMergedRange = function(panel, r, c,e) {
	        	 
	            var rg = new wijmo.grid.CellRange(r, c);
	
	            if(c < 1){
	            	return rg;
	            }
	            //컬럼 헤더 그룹핑.
             	if (panel.cellType == wijmo.grid.CellType.ColumnHeader) {
     	            for (var i = rg.col; i < panel.columns.length - 1; i++) {
     	            	if (panel.getCellData(rg.row, i, true) != panel.getCellData(rg.row, i + 1, true))
     						break;
     					rg.col2 = i + 1;
     				}
     	            for (var i = rg.col; i > 0; i--) {
     	            	if (panel.getCellData(rg.row, i, true) != panel.getCellData(rg.row, i - 1, true))
     	                	break;
     					rg.col = i - 1;
     				}
     				for (var i = rg.row; i < panel.rows.length - 1; i++) {
     					if (panel.getCellData(i, rg.col, true) != panel.getCellData(i + 1, rg.col, true))
     						break;
     					rg.row2 = i + 1;
     				}
     				for (var i = rg.row; i > 0; i--) {
     	            	if (panel.getCellData(i, rg.col, true) != panel.getCellData(i - 1, rg.col, true))
     						break;
     					rg.row = i - 1;
     				}

     	            // done
     	            return rg;
     	            
     	         //내용이 들어가는 cell 처리.
                 }else{
                	 
                	//컬럼헤더 그룹핑이 아니면 기존에 설정되어있는 mergeRange 값을 가져와서 적용한다.
                 	rg = mm.__proto__.getMergedRange.call(this, panel, r, c,e);		                		

                 	//MergeGroupAddRow 함수를 이용하여 셀 내용을 따로 병합할때 처리.
                 	if(p && pRng != null){
 		                if (r >= p.startRow  && r <= p.lastRow ) {
 		                	if (r >= p.startRow && pRng.contains(r, c)) {
 		                		return pRng;
 		                    }	
 		                }
                 	}
                 }
                 return rg;
             };

             fg.mergeManager = mm;
         }
         
        var removeNoResult = function(){
			//데이터가 없을때 no_result 이미지를 뿌려주기 위함.
			var $no_result = $("#"+div_id +" div:eq(0)");
			var $flexgrid_no_result = $no_result.find("#flexgrid_no_result");
			if($flexgrid_no_result.length >0){
				$flexgrid_no_result.remove();
			}
			
        }
        
        var removeLoading = function(p){
			//데이터가 없을때 no_result 이미지를 뿌려주기 위함.
			var $loading_spinner = $("#"+p.div_id +" div:eq(0)");
			var $flexgrid_loading_spinner = $loading_spinner.find("#flexgrid_loading_spinner");
			if($flexgrid_loading_spinner.length >0){
				$flexgrid_loading_spinner.remove();
			}
			
        }

        var appendNoResult = function(){
			//데이터가 없을때 no_result 이미지를 뿌려주기 위함.
			var $no_result = $("#"+div_id +" div:eq(0)");
			var headerHeight = ($no_result.find("div[wj-part=tl]").height()/2);
			var left = ($no_result.find("div[wj-part=root]").width()/2)-49;
			var no_result_html = "";
			no_result_html += "<div id='flexgrid_no_result'";
			no_result_html += "     style=\"position:absolute;margin-top : "+headerHeight+"px;left:"+left+"px;top:50%;transform:translateY(-50%);background:url('/images/grid/no_result.png') no-repeat ;width:99px;height:16px\">";
			no_result_html += "</div>";

			$(no_result_html).appendTo($no_result);
        }
        
        var appendLoading = function(p){
			//데이터가 없을때 no_result 이미지를 뿌려주기 위함.
			var $loading_spinner = $("#"+p.div_id +" div:eq(0)");
			var headerHeight = 0;
			var left = ($loading_spinner.find("div[wj-part=root]").width()/2)-49;
			var loading_html = "";
			loading_html += "<div id='flexgrid_loading_spinner'";
			loading_html += "     style=\"position:absolute;margin-top : "+headerHeight+"px;left:"+left+"px;top:50%;transform:translateY(-50%);background:url('/images/grid/ajax-loader.gif') no-repeat ;width:32px;height:32px\">";
			loading_html += "</div>";

			$(loading_html).appendTo($loading_spinner.find("div[wj-part=root]"));
        }
		
		//그룹 컬럼에 대한 처리....
		var group_yn = false;
		$.each(pin.groupcolumns, function(i, groupcolumn) {	//처리하기 쉽도록 배열을 객체로 변환
			group_yn = true;
			groupcolumns[groupcolumn.id] = groupcolumn;
		});
		
		//계산 컬럼에 대한 처리...
		var calculation_yn = false;
		$.each(pin.calculations, function(i, calculation) {	//처리하기 쉽도록 배열을 객체로 변환
			calculation_yn = true;
			calculation.format = makeNumberformat(calculation.format);
			calculations[calculation.id] = calculation;
		});
		
		//총계
		var total_yn = $.type(pin.grouptotal) == "object" ? true : false ;
		var merge_yn = false;
		// 그리드 row를 컨트롤할 checkbox를 등록한다.
		colModel.push({
			header : "",
			name : CONTROL_CHECKBOX,
			binding : CONTROL_CHECKBOX,
			dataType : "Boolean",
			allowSorting : false,
			width : 50,
			visible : (pin.properties.hide_checkbox) ? false : true

		});

		$.each(pin.columns, function(i, column) {
			if (column.editable) {
				isValid.isEditColumnExist = true;
			};
			if (column.frozen) { // 컬럼 고정 여부
				isValid.frozenYn = true;
				frozenColumns = column.id;
			};
			if (column.type == DATATYPE.NUMBER && column.format != "") {
				column.format = makeNumberformat(column.format); // format 변환 (N1 -> #,###.0 형태로...)
			};
			if (column.type == "N1") {
				column.type = DATATYPE.NUMBER;
				column.format = makeNumberformat("N1"); // format 변환 (N1 -> #,###.0 형태로...)
			};
			if (column.type == "N2") {
				column.type = DATATYPE.NUMBER;
				column.format = makeNumberformat("N2"); // format 변환 (N1 -> #,###.0 형태로...)
			};
			 if (group_yn && groupcolumns[column.id]) { //그룹 컬럼이 있다면....
				 column.merge = true;
				 column.group = true;
				 column.group_align = groupcolumns[column.id].align;
				 column.group_format = groupcolumns[column.id].format;
				 column.group_ids = groupcolumns[column.id].ids;
			 };
						
			 if (calculation_yn && calculations[column.id]) { //계산식 컬럼이 있다면....
				 column.calculation = true;
			 };
			 if (column.merge) { //머지 컬럼
				 merge_yn = true;
			// column["_MIDX_"] = 0;
			// mergecolumns.push(column);
			 };

			var setcolumn = Util.reDefineColumn(column, pin);

			colModel.push(setcolumn);

			// ColModel 에 required 옵션을 넣으면 flexgrid자체에서 빈 값으 들어갈 때 원래 있던 값으로
			// 돌아가는 현상 때문에 따로 지정한다.
			columns[column.id] = $.extend({}, column);

			// 콤보박스 출력을 위해 따로 key,value 값으로 셋팅한다.
			var comboFlag = false;

			for ( var key in column.combo) {
				comboFlag = true;
				break;
			}

			if (comboFlag && DATATYPE.COMBO == column.type) {

				combos[column.id] = (function() {

					var arrDataMap = [];
					var i = 0;

					$.each(column.combo, function(k, v) {

						var dataMap = v;
						arrDataMap[i] = dataMap;
						i++;

					});

					return arrDataMap;
				})();

			}

		});
		
		if(Instances[pin.div_id] && Instances[pin.div_id] != null){
			Instances[pin.div_id].dispose();
			Instances[pin.div_id] = null;
			delete Instances[pin.div_id];
		}
		
		var fg = new wijmo.grid.FlexGrid('#' + pin.div_id);
		Instances[pin.div_id] = fg;
		
		if(pin.properties.hideRowHeader){
			fg.headersVisibility = wijmo.grid.HeadersVisibility.Column;			
		};
		fg.o = o;
		fg.cv = cv;
		fg.combos = combos;
		fg.celltypes = celltypes;

		var fgInitializeParam = {
			autoGenerateColumns : false,
			columns : colModel,
			selectionMode :(pin.properties.selection_mode) ? pin.properties.selection_mode :  wijmo.grid.SelectionMode.Row,
			allowMerging : (group_yn||merge_yn) ? wijmo.grid.AllowMerging.All : wijmo.grid.AllowMerging.AllHeaders //헤더컬럼만 머지 , wijmo.grid.AllowMerging.All => 헤더컬럼과 셀내용 전체 머지 적용.
		}
		
		if(pin.properties.autoRowResize){
			fgInitializeParam.allowResizing = "Both";
		}

		var scrollChangedCnt = 0;

		// frozen 할때 cell background 및 폰트 글씨가 번지는 현상 발생... 스크롤 할때마다 새로고침... 추후에
		// 성능문제??? 1000개기준으로 일단은..없는걸로..
		fg.scrollPositionChanged.addHandler(function(panel, range) {
			fg.refresh();
		});

		// 조회 로우 추가시 이벤트
		fg.sortingColumn.addHandler(function(sender,args) {

			
			if(!sort[args.col]){
				sort[args.col] = {
			        col: null,
			        dir: null
			    };
			}

			var arr = [];
			
			var rowsLength = sender.rows.length;
			if(rowsLength > 0){
				
				for (var i = 0; i < rowsLength; i++) {
					arr.push(sender.rows[i]["_data"]);
				}
			}

	        args.cancel = true;
	        // determine new sort
	        if (sort[args.col].col == sender.columns[args.col].binding) {        	
	        	sort[args.col].dir = (sort[args.col].dir == 'a') ? 'd' : 'a';
	        } else {
	        	sort[args.col].col = sender.columns[args.col].binding;
	        	sort[args.col].dir = 'a';
	        };
	        
	        var sCol = sort[args.col].col;
	        var sDir = sort[args.col].dir;
	        
			var column = columns[sCol];

			
	        var rtnArr = null;
	        if (sCol) {
	        	rtnArr = arr.sort(function (o1, o2) {

	            	if(column.type == DATATYPE.NUMBER){
	   		            cmp = Number(o1[sCol]) < Number(o2[sCol]) ? -1 : Number(o1[sCol]) > Number(o2[sCol]) ? +1 : 0;
	            	}else{
		                cmp = o1[sCol] < o2[sCol] ? -1 : o1[sCol] > o2[sCol] ? +1 : 0;
	            	}
	                return sDir == 'a' ? cmp : -cmp;
	            });
	        }

			cv = new wijmo.collections.CollectionView(rtnArr);
			sender.itemsSource = cv;
		});


        // handle click events on custom checkboxes
		fg.addEventListener(fg.hostElement, 'click', function (e) {
            if (wijmo.hasClass(e.target, CLASSNAME_CUSTOM_CHECKBOX)) {

            	//e.stopPropagation ? e.stopPropagation(): e.cancelBubble = true;
            	
            	var ht = fg.hitTest(e);
   	            var row = ht.row;
				var column = fg.columns[ht.col];
				var colId = column.name;

				o.SetValue({
					rowid : row,
					id : colId,
					value : e.target.checked ? "Y" : "N"
				})
								
				pin.events.CellClick(Util.getCurrCellData(fg, cr,e,colId));     
             	
            }
        }, true);
//         handle keypress events on custom checkboxes (toggle on space)
		fg.addEventListener(fg.hostElement, 'keypress', function (e) {
			
            var chk = e.target.querySelector('.' + CLASSNAME_CUSTOM_CHECKBOX);
            if (chk && e.charCode == 32) {
   	            var row = cr.row;
				var column = fg.columns[cr.col];
				var colId = column.name;
				if(!chk.checked){
   	            	chk.checked = true;
   	            }else{
   	            	chk.checked = false;
   	            }   	      
				o.SetValue({
					rowid : row,
					id : colId,
					value : chk.checked ? "Y" : "N"
				});
				pin.events.CellClick(Util.getCurrCellData(fg, cr,e,colId));     
                e.preventDefault();
            }
        }, true);

		fg.initialize(fgInitializeParam);
		fg.itemsSource = cv;

		fg.editablecells = editablecells;
		fg.usercolumns = columns;
		fg.celltypes = celltypes;
		
		//로우 높이 설정 기본값.
		fg.rows.defaultSize = 25;
		fg.columnHeaders.rows.defaultSize = 28; //헤더
		fg.allowMerging = 'Cells';
		//로우 높이 설정
		if(pin.properties.rowHeight){
			fg.rows.defaultSize = pin.properties.rowHeight;
		}
		
		//헤더 로우 높이 설정		
		if(pin.properties.headerRowHeight){			
			fg.columnHeaders.rows.defaultSize = pin.properties.headerRowHeight;
		}
	

		if (pin.columnheaders.length > 0) {

			pin.columnheaders.reverse();

			// 컬럼 멀티헤더
			for (var i = 1; i < pin.columnheaders.length; i++) {
				var hr = new wijmo.grid.Row();
				fg.columnHeaders.rows.push(hr);
			}

			for (var r = 0; r < fg.columnHeaders.rows.length; r++) {

				for (var c = 0; c < fg.columns.length; c++) {
					if (fg.columns[c].name != CONTROL_CHECKBOX) {
						fg.columnHeaders.setCellData(r, c,pin.columnheaders[r][c - 1]);
					} else {
						fg.columnHeaders.setCellData(r, c, CONTROL_CHECKBOX);
					}
				}
			}
			setMergeCell();
		}else{
			var row = fg.columnHeaders.rows[0];
		}
		
		
		
		// end 컬럼 멀티헤더

		// frozen
		if (isValid.frozenYn) { // 컬럼고정 처리
			fg.frozenColumns = Util.getColumnIndex(fg, frozenColumns)+1;
		}



		// 편집 여부 컬럼이 하나도 없다면 컨트롤 체크박스 안보여
		if (!isValid.isEditColumnExist && !pin.properties.checkbox) {

			var length = fg.cells.columns.length;

			for (var i = 0; i < length; i++) {
				if (fg.cells.columns[i].binding == CONTROL_CHECKBOX) {
					fg.cells.columns[i].visible = false;
				}
			}

			// o.events.HideColumn({id :CONTROL_CHECKBOX });
		}
		
		
		//Row 드레그 설정
		if(pin.properties.row_drag){
			
			var type  =  typeof(pin.properties.row_drag_target) ;
			
			//row_drag가 true 일경우 row_drag_target 프로퍼티가 무조건 설정되게 셋팅한다.
			if(
				(type == "string" && pin.properties.row_drag_target == "") ||
				(type == "array" && pin.properties.row_drag_target.length == 0)
			){
				alert(pin.GM.invalid_row_drag_target);
			}

			var arrDragTarget = (type == "string") ? new Array().push(pin.properties.row_drag_target) : pin.properties.row_drag_target;
			
	        // prevent grid from selecting when dragging rows
	        fg.hostElement.addEventListener('mousedown', function (e) {
	            if (fg.hitTest(e).cellType == wijmo.grid.CellType.RowHeader) {
	                e.stopPropagation();
	            };
	        }, true);
	        
	        // drag start
	        var dragRow = null;
	        
	        fg.hostElement.addEventListener('dragstart', function (e) {
	            dragRow = null;
	            var ht = fg.hitTest(e);
	            if (ht.cellType == wijmo.grid.CellType.RowHeader) {
	                dragRow = ht.row;
	                fg.select(dragRow,1);
	                e.dataTransfer.effectAllowed = 'copy';
	                e.dataTransfer.setData('text', ''); // required in FireFox (note: text/html will throw in IE!)
	            };
	        });
	        
	        
	        for (var p = 0; p < arrDragTarget.length; p++) {
	            // perform drop operation
	            var $dropTarget = $("#"+arrDragTarget[p]);
	            $dropTarget.on("dragover",function(e){

	            	if (dragRow != null) {
	                    e.originalEvent.dataTransfer.dropEffect = 'copy';
	                    e.preventDefault();
	                }
	            });	                	

	            $dropTarget.on("drop",function(e){
	                if (dragRow != null) {
	                    pin.events.RowDragged({
	                    	Target : this.id,
	                    	Row : dragRow,
	                    	Data : o.GetRow({row : dragRow})
	                    });       
                    }
	            });
			}
		}

		/*
		 * 셀 및 그리드 데이터 편집 할때 알아야 할 항수.
		 * 
		 * wijmo.grid.CellType.Cell == 1 일반 셀 컬럼,
		 * wijmo.grid.CellType.ColumnHeader == 2 컬럼 헤더일 경우 2값을 이용하여 컨트롤.,
		 * wijmo.grid.CellType.None == 0, 셀타입이 없음. wijmo.grid.CellType.RowHeader ==
		 * 3, wijmo.grid.CellType.TopLeft == 4
		 *  @ 컬럼 정보에 넘기는 dataType 은 grid.columns[i] 정보로 col.dataType 값으로 받을때 아래
		 * 상수 정보로 리턴 해준다. wijmo.DataType.String == 1, wijmo.DataType.Number ==
		 * 2, wijmo.DataType.Boolean == 3 wijmo.DataType.Date == 4,
		 * wijmo.DataType.Array == 5, wijmo.DataType.Object == 0
		 */

		fg.itemFormatter = function(panel, row, col, cell) {
			// 0번째 컬럼 control checkbox 를 제어 한다.
			// 셀 편집에 필요한 정보들 넘김.
			var flex = panel.grid;
			var column = flex.columns[col];

			var colId = column.name; // id == name 하고 같다.
			var binding = (columns[column.name] && columns[column.name].binding && columns[column.name].binding !="") ? columns[column.name].binding : column.name;
			var isControlCheckbox = (((panel.cellType == wijmo.grid.CellType.ColumnHeader) || (panel.cellType == wijmo.grid.CellType.Cell)) && colId == CONTROL_CHECKBOX) ? true: false

			var isColumnHeader = (panel.cellType == wijmo.grid.CellType.ColumnHeader) ? true: false;
			var isCell = (panel.cellType == wijmo.grid.CellType.Cell) ? true: false;
			var isEditable = Util.isEditable(fg, row, col, colId);

			// checkbox indeterminate 옵션을 해제한다.
			try {
				cell.firstChild.indeterminate = false;
			} catch (e) {
			}

			// 헤더 컬럼은 무조건 주앙 정렬 셀 컬럼은 옵션에 따라 다르게 변화한다.
			if (columns[colId] != null && columns[colId].hasOwnProperty("align") && columns[colId].align != "") {
				cell.style.cssText = "text-align:"+ ((isColumnHeader) ? "center" : columns[colId].align)+ ";" + cell.style.cssText;
			}

			// line number
			if (panel.cellType == wijmo.grid.CellType.RowHeader) {
				cell.textContent = (row + 1).toString();
				//드레그 사용시 설정.
				if(pin.properties.row_drag){
					cell.draggable = true;
				}

			}

			if (panel.cellType == wijmo.grid.CellType.TopLeft) {
				cell.innerHTML = "<img src='/images/grid/icon_header_left.gif' style='margin-top:5px'></img>";

				var $topLeft = $(cell).parent();
				$topLeft.off("mousedown");
				$topLeft.mousedown(function(e) {
					
					var isShow = ((Browser.type == "MSIE" && Browser.version >= 10) || Browser.type != "MSIE" );

					if(pin.properties.excel_export){
						pin.properties.excel_export = isShow;
					}

					e = e || event;
					e.stopPropagation ? e.stopPropagation(): e.cancelBubble = true;
				 	e.preventDefault();
	
					if (e.which == 3) {
	
						if ($(".g_lyr").length > 0) {
							$(".g_lyr").remove();
						}
	
						// 현재cell의 위치
						var position = $topLeft.offset();
	
						var html = "<div class=\"g_lyr\" style=\"left : "+ e.pageX+ "px;top : "+ e.pageY+ "px;position:absolute;display:inline;z-index:10000\" oncontextmenu='return false'> 					\n";
						html += "<ul>									\n";
	
						if (pin.properties.excel_import) {
							html += "	<li id=\"wijmo_overpass_excel_import\" class=\"wj-topleftcontextmenu-li\"><div class=\"wj-topleftcontextmenu\"><span class=\"btn btn-default btn-file\"><img alt=\"\" src=\"/images/grid/ico_import.gif\" style=\"vertical-align:middle\">엑셀 가져오기  <input type=\"file\"></span></div></li>";
						}
						if (pin.properties.excel_sample) {
							html += "	<li id=\"wijmo_overpass_excel_sample\" class=\"wj-topleftcontextmenu-li\"><div class=\"wj-topleftcontextmenu\"><span><img alt=\"\" src=\"/images/grid/ico_sample.gif\">엑셀 샘플받기 </span></div></li>";
						}
						if (pin.properties.excel_export) {
							html += "	<li id=\"wijmo_overpass_excel_export\" class=\"wj-topleftcontextmenu-li\"><a download=\""+(pin.properties.excel_export_name || fg.o.id+".xlsx")+"\"><div class=\"wj-topleftcontextmenu\"><span><img alt=\"\" src=\"/images/grid/ico_export.gif\"> 엑셀 내보내기 </span></div></a></li>";
						}
						
						if(pin.properties.editable){
							html += "	<li id=\"wijmo_overpass_excel_restore\" class=\"wj-topleftcontextmenu-li\"><div class=\"wj-topleftcontextmenu\"><span><img alt=\"\" src=\"/images/grid/ico_restore.gif\"> 변경 취소하기</span></div></li>";									
						}
						html += "</ul>									\n";
						html += "</div> 					\n";
	
						var $contextTopLeft = $(html);
	
						// li 루프 돌며 이벤트 구현.
						$contextTopLeft.find("li").each(function(i, el) {
							switch (el.id) {
							case "wijmo_overpass_excel_import":

								$(this).find("input[type=file]").change(function(e) {
									Excel.importExcel(fg,pin,$contextTopLeft,this);
								});
	
								break;
							case "wijmo_overpass_excel_sample":
	
								$(this).click(function(e) {
									o.DownloadExcelSample(pin.properties.sample_id,pin.properties.sample_name);
									$contextTopLeft.remove();
								});
	
								break;
							case "wijmo_overpass_excel_export":
	
								$(this).find("a").click(function(e) {
									Excel.exportExcel(fg,pin,$contextTopLeft,this);
								});
	
								break;
							case "wijmo_overpass_excel_restore":
								
								$(this).click(function(e) {
									o.Restore();
									$contextTopLeft.remove();
								});
	
								break;
							default:
								break;
							}
						});
	
						$contextTopLeft.appendTo("body");
	
					}
				});
			}

			if (isControlCheckbox) {

				// checkbox 는 정렬을 허용하지 않는다.
				column.allowSorting = false;

				if (isColumnHeader) {

					var cnt = 0;
					var rowsLength = flex.rows.length;
					for (var i = 0; i < rowsLength; i++) {
						if (flex.getCellData(i, col) == true) cnt++;
					}

					// create and initialize checkbox
					cell.innerHTML = '<p style=\"position:relative;top:50%;transform:translateY(-50%);\"><input type="checkbox"></p> ';

					var $cell = $(cell);
					$cell.find("p").css("margin-top", "2px"); // cell merge 할 경우 중앙정렬

					var cb = cell.firstChild.firstChild;
					cb.checked = cnt > 0;
					cb.indeterminate = cnt > 0 && cnt < flex.rows.length;

					// apply checkbox value to cells
					cb.addEventListener('click', function(e) {
						flex.beginUpdate();
						var length = flex.rows.length;
						for (var i = 0; i < length; i++) {
							flex.setCellData(i, col, cb.checked);

						}
						flex.endUpdate();
					});

				} else if (isCell) {

					var crud = null;
					var rdata = Util.getRow(cv, row);

					if (rdata) {
						crud = rdata["CRUD"];
						// 값이 셋팅되어 있지 않으면 Read 데이터 이므로 R로 셋팅.
						if (!crud) {
							crud = CRUD.R;
						}

					}

					var img = "";
					if (crud == CRUD.R) {
						img = "/images/grid/icon_read.png";
					} else if (crud == CRUD.C) {
						img = "/images/grid/icon_create.png";
					} else if (crud == CRUD.U) {
						img = "/images/grid/icon_update.png";
					} else if (crud == CRUD.D) {
						img = "/images/grid/icon_delete.png";
					} else {
						img = "/images/grid/icon_read.png";
					};

					var $cell = $(cell);
					var cb = $cell.find("input[type=checkbox]")[0];
					if(fg.rows[row].isReadOnly){
						cb.disabled="";			
						$cell.click(function(e){
							flex.setCellData(row, col, !cb.checked ? false : true);
						});
					}
					var $cellImg = $cell.find("img");

					if ($cellImg.length == 0) {
						$("<img src=\""+ img+ "\" style=\"vertical-align: middle;\" />").appendTo($cell);
					} else {
						$cellImg.attr("src", img);
					}

				}

			} else {

				var rdata = Util.getRow(cv, row);
				var colProperty = columns[colId];
				var isFormatterCol = (formatterCol == null|| formatterCol != colId || (formatterCol == colId && row != cr.row));
				var type = celltypes[row + "_" + colId]	|| ((isProperty(colProperty, "type")) ? colProperty.type: "");
				var format = cellformats[row + "_" + colId]	|| ((isProperty(colProperty, "format")) ? colProperty.format: "");
				var button = (cellbuttons[row + "_" + colId] === undefined) ? ((isProperty(colProperty, "button")) ? colProperty.button : ""): cellbuttons[row + "_" + colId];
				var $cell = $(cell);

				if (isColumnHeader) {

					var requiredTag = "<img src='/images/grid/icon_required.png' style='margin-left: 1px'></img>";

					$cell.css("line-height", ($cell.height()+((Browser.type=="MSIE") ? 2 : 0)) + "px"); // cell merge 할 경우중앙정렬
					$cell.off("mousedown");
					
					if(!isEditable){
						$cell.addClass("editable");
					}
					
					
					$cell.mousedown(function(e) {

						e = e || event;

						if (e.which == 3) {

							if ($(".g_lyr").length > 0) {
								$(".g_lyr").remove();
							}

							// 현재cell의 위치
							var position = $cell.offset();

							var html = "<div class=\"g_lyr\" style=\"left : "+ e.pageX+ "px;top : "+ e.pageY+ "px;position:absolute;display:inline;z-index:10000\" oncontextmenu='return false'> 					\n";
							html += "<ul>									\n";
							var applyFrozen = false;
							if (frozenColumns == colId) {
								applyFrozen = true;
							}
							html += "	<li id=\"wijmo_overpass_col_frozen\"><button class=\"button\" type=\"button\"><span class=\"btn btn-default btn-file\"><img alt=\"\" src=\"/images/grid/ico_frozen"+ ((applyFrozen) ? "_cancel" : "")+ ".gif\"> 열고정 "+ ((applyFrozen) ? "취소" : "")+ " </span></button></li>";
							html += "	<li id=\"wijmo_overpass_col_hide\"><button class=\"button\" type=\"button\"><span><img alt=\"\" src=\"/images/grid/ico_colhide.gif\"> 숨기기 </span></button></li>";
							if (pin.properties.excel_export) {
								html += "	<li id=\"wijmo_overpass_excel_export\"><a><button class=\"button\" type=\"button\"><span><img alt=\"\" src=\"/images/grid/ico_export.gif\"> 엑셀 내보내기 </span></button></a></li>";
							}
							html += "</ul>									\n";
							html += "</div> 					\n";

							var $contextColumn = $(html);

							// li 루프 돌며 이벤트 구현.
							$contextColumn.find("li").each(function(i, el) {

								switch (el.id) {
									case "wijmo_overpass_col_frozen":

										$(this).click(function(e) {
											// frozen
											frozenColumns = colId;
											if (!applyFrozen) {
												fg.frozenColumns = Util.getColumnIndex(fg,colId)+1;
											} else {
												fg.frozenColumns = 0;
											}
											$contextColumn.remove();
										});

										break;
									case "wijmo_overpass_col_hide":

										$(this).click(function(e) {

											o.HideColumn({
												id : colId
											});
											$contextColumn.remove();
											o.ShowColumnsButton();
										});

										break;
									case "wijmo_overpass_excel_export":

										$(this).find("a").click(function(e) {
											Excel.exportExcel(fg,pin,$contextColumn,this);
										});
										break;
									default:
										break;
									}
								});

							$contextColumn.appendTo("body");

						}
					});

					if (type == DATATYPE.CHECKBOX && isProperty(colProperty, "checkbox") && colProperty.checkbox) {

						var cnt = 0;
						var rowsLength = flex.rows.length;
						for (var i = 0; i < rowsLength; i++) {
							if (Util.getRow(cv, i)[colId] == "Y")
								cnt++;
						}

						if (!isProperty(colProperty, "required")|| (isProperty(colProperty, "required") && !colProperty.required)) {
							requiredTag = "";
						}

						if (isEditable) {
							cell.innerHTML = $cell.text() + requiredTag+ ' <input type="checkbox"> ';
						} else {
							cell.innerHTML = $cell.text()+ requiredTag	+ ' <input type="checkbox" disabled=\"disabled\"> ';

						}
						// create and initialize checkbox
						var cb = cell.childNodes[1];
						cb.checked = cnt > 0;
						cb.indeterminate = cnt > 0 && cnt < rowsLength;

						$(cell).find("input[type=checkbox]").click(function(e) {
							var length = flex.rows.length;
							for (var i = 0; i < length; i++) {
								o.SetValue({
									rowid : i,
									id : colId,
									value : this.checked ? "Y" : "N"
								});
							}
						});

					}

					if (isProperty(colProperty, "required") && colProperty.required) {
						cell.innerHTML = $cell.text() + requiredTag;
					}

				} else if (isCell) {
					if(!rdata){
						return;
					}
					
					if (isValid.isFirstLoad) {
						rdata.Index = row;
						Util.updateData(cv, row);
					}
					
					if (isProperty(colProperty, "merge") && colProperty.merge) {
						
						$(cell).css({
							"line-height" : $(cell).height()+"px"
						});
					};

					var cellColorId = ((isProperty(rdata, "Index")) ? rdata.Index : row) + colId;
					var colValue = rdata[colId];
					
					// {header : "바인딩데이터", id: "TEXT_DATE1", binding: "TEXT_DATE" }
					// column 속성에 binding 값이 있을 경우 binding 대상 컬럼의 데이터를 출력 하나.
					// 데이터가 변경 되어 값이 있을 경우에는 TEXT_DATE1 컬럼 아이디로 데이터가 저장 된다.
					// binding속성으로 다른 컬럼에 열결되어 있으나 데이터 변경이 이루어질 경우에는 binding 컬럼 데이터가 아닌 변경 된 데이터를 출력한다.

					if(!rdata[colId]){
						colValue = rdata[colId] = rdata[binding]||"";
					}
					

					if (isProperty(colProperty, "default_value") && colProperty.default_value != "") {
						cell.innerHTML = columns[colId].default_value;
					};

					if (isProperty(forecolor, rdata.Index + "")) {
						$(cell).css({
							"color" : forecolor[rdata.Index].color
						});
					};

					if (isProperty(forecolor, cellColorId)) {

						if (isProperty(forecolor[cellColorId], "id") && forecolor[cellColorId].id != "") {
							$(cell).css({
								"color" : forecolor[cellColorId].color
							});
						}
					};

					if (isProperty(backcolor, rdata.Index + "") && backcolor != "") {
						$(cell).css({
							"background-color" : backcolor[rdata.Index].color
						});
					};

					if (isProperty(backcolor, cellColorId)) {

						if (isProperty(backcolor[cellColorId], "id") && backcolor[cellColorId].id != "") {
							$(cell).css({
								"background-color" : backcolor[cellColorId].color
							});
						}
					};

					if (isProperty(colProperty, "underline") && colProperty.underline == true) {
						cell.style.cssText = "text-decoration:underline;"+ cell.style.cssText;
					}

					if (button) {

						if (isFormatterCol) {

							cell.innerHTML = "<div style=\"position:relative; height:19px; padding:0px 0px 0 0;text-overflow:ellipsis;\">"+ $(cell).text()+ "<a href=\"javascript:void(0);\" style=\"position:absolute;top:0px;right:0;\"><img src=\"/images/grid/icon_search.png\"></a></div>";

							$(cell).find("a").click(function(e) {

									e = e || event;
									e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;

									o.events.ButtonClick(o.GetCell({
										id : colId,
										row : row
									}));

							});
						}
					};


					if (type == DATATYPE.HTML) {
						cell.innerHTML = colValue;
					}else if (type == DATATYPE.TEXT) {

			
						if (isFormatterCol) {
							$(cell).find("div[wj-dropdown]").remove();
							if ($(cell).find("input[type=text]").length == 0 && colValue && colValue != "" && format != "") {
								cell.innerHTML = formatter(colValue, format);
							}else{
								
								if(colValue != null && !button && pin.properties.autoRowResize){
									colValue = colValue.replace(/\n/g,"<br>");
									colValue = colValue.replace(/\s/g,"&nbsp;");									
									cell.innerHTML = colValue;
								}
							}
						}

					} else if (type == DATATYPE.NUMBER) {

						if (isFormatterCol) {
							$(cell).find("div[wj-dropdown]").remove();
							if ($(cell).find("input[type=text]").length == 0 && colValue && colValue != "" && format != "") {
								cell.innerHTML = formatNumber(colValue, format);
							}else if($.trim(cell.innerHTML)==""){
								cell.innerHTML = "0";
							}
						}
					} else if (type == DATATYPE.TEXT_DATE) {

						if (colValue && colValue != "") {
							cell.innerHTML = formatter(colValue, format);
						}

					} else if (type == DATATYPE.DATE) {
						
						
						if (colValue && colValue != "") {
							cell.innerHTML = new Date((colProperty.milisecond) ? Number(colValue) : colValue.replace(/-/g,"/")).format(format);
						}

					}else if(type == DATATYPE.COMBO){
						
						var comboId = null;
						var isCombo = true;
						if(combos[row+"_"+colId]){
							comboId = row+"_"+colId;
						}else if(combos[colId]){
							comboId = colId;
						}else{
							
							if(colProperty.combo){
								combos[colId] = (function() {

									var arrDataMap = [];
									var i = 0;

									$.each(colProperty.combo, function(k, v) {

										var dataMap = v;
										arrDataMap[i] = dataMap;
										i++;

									});

									return arrDataMap;
								})();
								
								comboId = colId;

							}else{
								isCombo = false;								
							}
						}
						
						if(isCombo){
							
							$.each(combos[comboId], function(k, v) {								
								if (colValue == v.key ) {
									cell.innerHTML = v.value;
									return false;
								}
							});
						}
						
					} else if (type == DATATYPE.CHECKBOX) {

						if (isEditable) {
							cell.innerHTML = "";
							cell.innerHTML = "<input class=\""+CLASSNAME_CUSTOM_CHECKBOX+"\" type=\"checkbox\"  "+ (rdata[colId] == "Y" ? "checked=\"checked\"": "") + " style=\"position:relative;top:-1px;\"></input>";
						} else {
							cell.innerHTML = "<input type=\"checkbox\"  "+ (rdata[colId] == "Y" ? "checked=\"checked\"": "")+ " disabled=\"disabled\" style=\"position:relative;top:-1px;\"></input>";
						}

					} else if (type == DATATYPE.IMAGE) {
						if (rdata[colId] && rdata[colId] != "") {
							cell.innerHTML = "<img src=\"" + colProperty.domain+ rdata[colId]+ "\" width=\"20px\" height=\"20px\" onerror=\"this.src='/images/grid/no_image.png'\"/>";
						};
					} else if (type == DATATYPE.LEVEL) {

						if (rdata[colId] && rdata[colId] != "") {

							var nextData = Util.getRow(cv, row + 1);
							var isLeaf = false;
							var isTreeVisible = false;
							if (nextData != null
									&& nextData.hasOwnProperty(colId)) {

								if (Number(nextData[colId]) > Number(rdata[colId])) {
									isLeaf = true;
								}
								if (fg.rows[row + 1].visible) {
									isTreeVisible = true;
								}
							}

							if (isLeaf && isTreeVisible) {
								rdata["Collapse"] = "N";
							} else if (isLeaf && !isTreeVisible) {
								rdata["Collapse"] = "Y";
							}

							var treeMargin = 16 * Number(rdata[colId]) - 16;

							var dataText = "";
							
							if(colProperty.suffixColumn instanceof Array){								
								for (var a = 0; a < colProperty.suffixColumn.length; a++) {
									dataText += rdata[colProperty.suffixColumn[a]]||"";
								}
							}else{
								dataText = rdata[colProperty.suffixColumn] || "";
							}
							
							if (isProperty(colProperty, "combo") && colProperty.combo.data) {

								if(colProperty.combo.data[rdata[colProperty.combo.key]]){
									dataText = colProperty.combo.data[rdata[colProperty.combo.key]]+" "+dataText;
								}
							}
							
							var levelImg = "";						
							levelImg += "<div style=\"position:relative;top:50%;transform:translateY(-50%);margin-left : "+ treeMargin+"px\">" ;						
							levelImg += "<img src=\"/images/grid/ico_tree_"+ ((!isLeaf) ? "none": (isTreeVisible) ? "minus": "plus") + ".gif\" />";
							if (isProperty(colProperty, "suffixColumn") && colProperty.suffixColumn != "") {
								levelImg += "	"+dataText;
							}
							levelImg += "</div>";						
							cell.innerHTML = levelImg;
							
							$cell.click(function(e) {

								var $img = $(this).find("img");
								var src = $img.attr("src");

								if (src.indexOf("plus") > -1) {

									var nextData = Util.getRow(cv,row + 1);
									var isLeaf = false;
									var isTreeVisible = false;
									var currLevel = Number(rdata[colId]);

									// 펴면 N
									rdata["Collapse"] = "N";

									var nextRow = row + 1;
									var prevCollapse = false;
									var hideLevel = -1;

									while (true) {

										var sibilingData = Util.getRow(cv, nextRow);

										if ((sibilingData != null && sibilingData[colId]&& Number(sibilingData[colId]) <= currLevel) || sibilingData == null) {
											break;
										}

										fg.rows[nextRow].visible = true;

										if (sibilingData.hasOwnProperty("Collapse")) {

											if (sibilingData["Collapse"] == "Y") {
												hideLevel = Number(sibilingData[colId]) + 1;
											} else {
												hideLevel = -1;
											}
										}

										if (hideLevel == Number(sibilingData[colId])) {
											fg.rows[nextRow].visible = false;
										}

										nextRow++;
									}

									Util.updateData(cv, rdata);

								} else if (src.indexOf("minus") > -1) {
									o.CollapseRow({
										row : row
									});
								}

							});
						};
						
					}else if(type == DATATYPE.FILE){


						var uploaddata = cellupload[rdata.Index+"_"+colId];

						var uploadHtml = "";
							uploadHtml +="<div style=\"position:absolute; height:19px; width:100%;padding:0px 0px 0 0;text-overflow:ellipsis;\">			\n";
						if(uploaddata){
							uploadHtml +="	<span>"+Util.getFileName(uploaddata.value)+"</span>																																							\n";
						}else{
							uploadHtml +="	<span>"+(colValue||"")+"</span>																																							\n";	
						}
						
						if(isEditable){
						
						
							uploadHtml +="	<div style=\"cursor:pointer ;position:absolute; height:19px; width:35px;right:0;padding:0px 0px 0 0;display:inline-block\" class=\"btn btn-default btn-file\">																																						\n";
							uploadHtml +="	<img style='z-index:10000;position:absolute;right:22px;' alt=\"\" src=\"/images/grid/ico_x.gif\" />																																						\n";
							uploadHtml +="	<img style='position:absolute;right:6px;' alt=\"\" src=\"/images/grid/ico_upload.gif\" />																																						\n";
							
							var filterFileExtention = "";

							if(colProperty.hasOwnProperty("filter") && colProperty.filter !== ""){
								filterFileExtention = colProperty.filter.split("|")[1];								
							}
							
							try {
							
								if(filterFileExtention !== ""){
									
									filterFileExtention = filterFileExtention.replace(/(\*.([a-z]*);*)/ig,function (a, b, extention,d) {
										return "."+extention+",";
									});
								}
							} catch (e) {
								console.log("filter properties error...   ex) EXTENTION DESC|.gif,.jpeg");
							}				
							
							uploadHtml +="	<input type=\"file\" accept=\""+filterFileExtention+"\"  />																																						\n";
							uploadHtml +="</div>																																							\n";	
						}
							uploadHtml +="</div>																																							\n";

							cell.innerHTML = uploadHtml;
						
						$(cell).find("img").click(function(e) {
							e = e || event;
							e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;	
							
							//x버튼 누르면 초기화 한다.
							if(this.src.indexOf("_x") > -1){
								
								delete cellupload[rdata.Index+"_"+colId];
								delete celluploadfiles[rdata.Index+"_"+colId];

								var fileRow = o.GetRow({row : row});
								
								o.SetValue({
									row : row,
									id : colId,
									value : fileRow["_ORG_"+colId] || "",
									filename : fileRow["_F_ORG_"+colId]
								});
							}
						});
						
						$(cell).find("input[type=file]").change(function(e) {

							e = e || event;
							e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
							
							var name = new Date().getTime() +"";

							this.name = name;
															
							cellupload[rdata.Index+"_"+colId] = {
								value : this.value,
								name : name
							};
							
							celluploadfiles[rdata.Index+"_"+colId] = this;
							o.SetValue({
								row : row,
								id : colId,
								value : name,
								filename : Util.getFileName(this.value)
							});
							
						});
					
					}
					

					
					if (isProperty(rdata, "isGroup") && rdata.isGroup == true && calculations[colId] && isProperty(calculations[colId], "format")) {
						cell.innerHTML = (calculations[colId].format == "#,###" ) ? formatNumber(Math.floor(rdata[colId]),calculations[colId].format) : formatNumber(rdata[colId],calculations[colId].format);
					};
					
					
					if (isProperty(colProperty, "prefix") && colProperty.prefix != "") {
						if (isFormatterCol && !rdata.isGroup) {
							cell.innerHTML = (columns[colId].prefix != "" ? columns[colId].prefix+ " ": "")	+ $(cell).text();
						}
					};

					if (isProperty(colProperty, "suffix") && colProperty.suffix != "") {
						if (isFormatterCol && !rdata.isGroup) {
							cell.innerHTML = $(cell).text() + (colProperty.suffix != "" ? colProperty.suffix+ " " : "");
						}
					};
					
					if(isProperty(rdata, "isGroup") && rdata.isGroup){
						$(cell).css({
							"text-decoration" : "none"
						});
						
						if(!fg.rows[row].allowMerging){
							fg.rows[row].allowMerging = true;	
						}
						if (isProperty(calculations[colId], "prefix") && calculations[colId].prefix != "") {
							cell.innerHTML = (calculations[colId].prefix != "" ? calculations[colId].prefix+ " ": "")	+ $(cell).text();
						}else{
							if (isProperty(colProperty, "prefix") && colProperty.prefix != "") {
								if (isFormatterCol) {
									cell.innerHTML = (columns[colId].prefix != "" ? columns[colId].prefix+ " ": "")	+ $(cell).text();
								}
							};
						};
						
						if (isProperty(calculations[colId], "suffix") && calculations[colId].suffix != "") {
							cell.innerHTML = $(cell).text() + (calculations[colId].suffix != "" ? calculations[colId].suffix+ " " : "");
						}else{
							if (isFormatterCol) {
								cell.innerHTML = $(cell).text() + (colProperty.suffix != "" ? colProperty.suffix+ " " : "");
							}
						};
						
						if (isProperty(colProperty, "group_align") && colProperty.group_align != "") {
							cell.style.textAlign = colProperty.group_align;
							cell.style.fontWeight = "bold";
						};
					}
					
					//셀별 bold 지정.
					if (isProperty(cellbolds, rdata.Index + "_"+colId)) {
						$(cell).css({
							"font-weight" : "bold"
						});
					};

				}// end cell

			}

		};

		var $hostElement = $(fg.hostElement);

		var layerClose = function(isWrap) {

			if(calendar != null){
				calendar.destory();	
				calendar= null;
			}
			
		};
		
		$hostElement.parent().parent().on("click", function(e) {
			e.stopPropagation();
			layerClose();
		});

		$hostElement.on("click", "div[wj-part=cells] .wj-cell", function(e) {
			e.stopPropagation();

			layerClose();

			if(cr){
				var columnId = fg.cells.columns[cr.col].name;

				// control checkbox 일 경우에는 셀 편집 이벤트 안먹히게 한다. 대신 checkboxClick 이벤트 실행
				if (columnId != CONTROL_CHECKBOX) {
					// CellClick 이벤트 호출
					pin.events.CellClick(Util.getCurrCellData(fg, cr,e));					
					setCalendar(cr.row, cr.col);

				}				
			}

		});
		
		
		
		function setCalendar (row,col){
			
			var tmpCell = $(fg.hostElement).find("div[wj-part=cells] .wj-cell.wj-state-selected");
			selectLastCell = tmpCell.length > 0 ? tmpCell : selectLastCell;

			if (row == null || row == -1) {
				isValid.isCalendar = false;
			} else {
				isValid.isCalendar = true;
			}

			var columnId = fg.cells.columns[cr.col].name;
			var column = columns[columnId];
			var rdata = Util.getRow(cv, row < 0 ? selectLastRow: row);
			var isEditable = Util.isEditable(fg, row, col,columnId);
			var type = celltypes[row + "_" + columnId]|| ((isProperty(column, "type")) ? column.type : "");

			var types = {};
			
			
			if (isEditable && isValid.isCalendar && (type == DATATYPE.DATE || type == DATATYPE.TEXT_DATE) && column.editable) {

				var div = $("<div class=\"wj-flexgrid-pionnet-calendar\" />");
				var dates = [];
				if ($.type(column.calendar) == "object"&& column.calendar.sdate&& column.calendar.edate) { // B타입(2단)
					dates = [ column.calendar.sdate,column.calendar.edate ];
				} else {
					dates = [ columnId ];
				};

				
				for ( var i = 0; i < dates.length; i++) {
					var colId = dates[i];
					types[colId] = celltypes[row + "_" + colId]|| ((isProperty(columns[colId], "type")) ? columns[colId].type : "");
				}
				
				
				// 현재cell의 위치
				var $currCell = $(selectLastCell[0]);
				var position = $currCell.offset();
				var left = position.left+$currCell.width() ;
				var top = position.top-1;
				
				var calendarFormat  = function(p,i){
				
					var format = "";
					if(p.types[p.dates[i]] == DATATYPE.DATE){
						if(p.option.hour === true){
							format = "yyyy-MM-dd HH:mm:ss";										
						}else{
							format = "yyyy-MM-dd";											
						}
					}else if(p.types[p.dates[i]] == DATATYPE.TEXT_DATE){
						if(p.option.hour === true){
							format = "yyyyMMddHHmm";										
						}else{
							format = "yyyyMMdd";										
						}
					}
					return format;
				}
				

				var c = function(){
					return new OVERPASS.GRID.FLEXGRID.calendar({
						gridId : o.id,
						top : top, 
						left : left,
						language : OVERPASS.language,
						format : column.format,
						position : position,
						dates : dates,
						option : column.calendar,
						types : types,
						cell : selectLastCell[0],
						data : rdata,
						onSelect : function(d,p,picker,calendar){
//							if( (p.option.hour !== true) && p.dates.length == 1){
//								var format = calendarFormat(p,0);								
//								o.SetValue({
//									rowid : selectLastRow,
//									id : picker.el.id,
//									value : d.format(format),
//									event_yn : true
//								});
//								calendar.hide();
//							}						
						},
						onConfirm : function(p,calendar){
							
							if(p.dates.length > 1){
								
								if (p.option.hour || p.option.minute) {
									if (p.pickers[p.dates[0]].lastSelectedDate.format("yyyyMMddHHmm") >= p.pickers[p.dates[1]].lastSelectedDate.format("yyyyMMddHHmm")) {
										alert($.fn.datepicker.language[p.language].datetimeMessage);
										return;
									};
								} else {
									if(p.pickers[p.dates[0]].lastSelectedDate.format("yyyyMMddHHmm") > p.pickers[p.dates[1]].lastSelectedDate.format("yyyyMMddHHmm")) {
										alert($.fn.datepicker.language[p.language].dateMessage);
										return;
									};
								};		
							}
							
							for (var i = 0; i < p.dates.length; i++) {
								
								var format = calendarFormat(p,i);								
			
								o.SetValue({
									rowid : selectLastRow,
									id : p.dates[i],
									value : p.pickers[p.dates[i]].lastSelectedDate.format(format),
									event_yn : true
								});
							}
							
							layerClose();
						},
						onCheckboxEndDate : function(isCheck,p,calendar){							
							
							if(isCheck){
								if( p.dates.length > 1){
									p.calendars[p.dates[1]].data('datepicker').selectDate(new Date(2999,11,"31","23","59","59"));	
								}								
							}	
						}
						
					});
				}
				
				if(calendar == null){
					calendar = c();					
				}else{					
					calendar.destory();
					calendar = c();
				}
				
			}
		}
		
		

		
//		// 그리드 여백 클릭 시 편집중인 셀 편집완료로 변경 
//		$hostElement.on("click", "div[wj-part=root]", function(e) {
//			e.stopPropagation();
//			fg.finishEditing(true);
//		});

		// Cell dblclick 이벤트 등록.
		$hostElement.on("dblclick", "div[wj-part=cells] .wj-cell", function(e) {
			e.stopPropagation();
			pin.events.CellDblClick(Util.getCurrCellData(fg, cr,e));
		});

		// Cell dblclick 이벤트 등록.
		$hostElement.on("keydown", "div[wj-part=cells] .wj-cell", function(e) {

			if(!pin.properties.clipboard_copy && beginEditCellId == null){
				if (e.ctrlKey && e.keyCode==86) {//CTRL+V
					window.event.returnValue = false;
					return false;

				} else if (e.ctrlKey && e.keyCode==67) { //CTRL+C (Copy)
					window.event.returnValue = false;
					return false;
				}	
				
			}
		});

		
		// 그리드에서 포커스를 잃어버릴때 발생 
		fg.lostFocus.addHandler(function( e) {
			//편집중인 셀을 편집 완료로 변경.
			fg.finishEditing(true);
		});
		
		// Cell click 이벤트 등록. 각 셀에 click 이벤트를 등록하면 dblclick랑 동시에 이벤트 실행이 됨.
		// 때문에 필드 선택이 변하면 click이벤트 인것 처럼 호출 함.
		fg.selectionChanging.addHandler(function(panel, range) {

			cp = panel;
			cr = range;

		});

		// Row가 변경 되었을 경우 이벤트 처리
		fg.selectionChanged.addHandler(function(panel, range) {

			var tmpCell = $(fg.hostElement).find("div[wj-part=cells] .wj-cell.wj-state-selected");
			selectLastCell = tmpCell.length > 0 ? tmpCell : selectLastCell;

			var columnId = fg.cells.columns[cr.col].name;
			var column = columns[columnId];
			var rdata = Util.getRow(cv, range.row < 0 ? selectLastRow: range.row);
			var isEditable = Util.isEditable(fg, range.row, range.col,columnId);
			var type = celltypes[range.row + "_" + columnId]|| ((isProperty(column, "type")) ? column.type : "");

			//rowChange 이벤트 발생할때 이전에 마지막으로 선택된 row 세팅
			var bakSelectLastRow = (function(lastRow){ return lastRow;})(selectLastRow)
						
			if (range.row != bakSelectLastRow && !isValid.isAdded) {

				var row1 = o.GetRow({
					row : (isValid.isFirstLoad && range.row ==-1) ? 0 :range.row
				});
				var row2 = o.GetRow({
					row : bakSelectLastRow
				});
				if (row2 == undefined) {
					row2 = row1;
				}
				pin.events.RowChanged(row1, row2);
			}

			// row가 변경 되면 셋팅.
			if (range.row > -1 && range.row != selectLastRow) {
				selectLastRow = range.row;
			}



		});

		// 셀 내용이 변경된 후 발생하는 이벤트
		fg.cellEditEnded.addHandler(function(panel, range) {
			beginEditCellId = null
			cp = panel;
			cr = range;

			// row가 변경 되면 셋팅.
			if (cr.row > -1 && cr.row != selectLastRow) {
				selectLastRow = cr.row;
			}

			var columnId = fg.cells.columns[cr.col].binding;

			// control checkbox 일 경우에는 셀 편집 이벤트 안먹히게 한다. 대신 checkboxClick 이벤트 실행
			if (columnId == CONTROL_CHECKBOX) {
				pin.events.CheckboxClick({
					Checked : Util.getRow(cv, cr.row)[CONTROL_CHECKBOX],
					Row : cr.row
				});

			}
			
			//콤보박스 드롭다운 이미지 제거
			$(fg.hostElement).find("div[wj-part=cells] .wj-cell.wj-state-selected div[wj-dropdown]").remove();

		});

		// 셀 내용 편집시 내용 등록.
		fg.cellEditEnding.addHandler(function(sender, e) {

			formatterCol = null;

			var columnId = fg.cells.columns[e.col].name;
			var type = celltypes[e.row + "_" + columnId] || ((isProperty(columns[columnId], "type")) ? columns[columnId].type: "");
			// control checkbox 일 경우에는 셀 편집 이벤트 안먹히게 한다. 대신
			// checkboxClick 이벤트를 셀편집 이후에 처리하가 위함.
			// //fg.cellEditEnded.addHandler 참조.
			if (columnId == CONTROL_CHECKBOX) {
            
				return;
			}

			var flex = sender, 
			oldVal = flex.getCellData(e.row, e.col),
			newVal = flex.activeEditor.value,
			row = Util.getRow(cv, e.row), 
			orgId = "_ORG_" + fg.cells.columns[e.col].name, 
			preId = "_PRE_"+ fg.cells.columns[e.col].name;


			// ORG가 존재하지 않으면 등록해준다.
			if (!row.hasOwnProperty(orgId)) {
				row[orgId] = oldVal;
			}
			row[preId] = oldVal;
			
			
			// 현재 row의 상태값 셋팅(CUD)
			var changed = false;
			var checkValue  = "";
			for ( var key in row) {
				
				checkValue = (fg.cells.columns[e.col].name == key) ? newVal : row[key];
				if (row.hasOwnProperty("_ORG_"+key)	&& (checkValue||"") != row["_ORG_"+key]) {
					changed = true;							
				}
			}

			if (row["CRUD"] != CRUD.C && row["CRUD"] != CRUD.D) {

				if (!changed && row[orgId] == newVal) {
					row["CRUD"] = CRUD.R;
					row[CONTROL_CHECKBOX] = false;

				} else {
					row["CRUD"] = CRUD.U;
					row[CONTROL_CHECKBOX] = true;

					if (type == DATATYPE.NUMBER && typeof (row[columnId]) == "string") {
						newVal = newVal.replace(/,/ig, "");
					}
					row[columnId] = newVal;
				}
			}else if (row["CRUD"] == CRUD.C && changed) {
				
				if (type == DATATYPE.NUMBER && typeof (row[columnId]) == "string") {
					newVal = newVal.replace(/,/ig, "");
				}
				row[columnId] = newVal;
			}

			Util.updateData(cv, row);

			if (newVal != (oldVal == null ? "" : oldVal)) { // cell이 내용이 변경되었다면 이벤트를 발생시켜주자.. ""으로 셋팅한 값은 null이 리턴되므로  주의하자...

				setTimeout(function(){
					pin.events.ChangeCell({
						Id : fg.cells.columns[e.col].binding,
						Row : e.row,
						Value : newVal,
						PreValue : oldVal || "",
						OrgValue : row[orgId] || ""
					});
					
				})

			};

		});

		// 셀 내용 편집 전 내용 등록.
		fg.beginningEdit.addHandler(function(sender, e) {

			var column = fg.cells.columns[e.col];
			var columnId = column.name;
			beginEditCellId = columnId;
			
			var cellId = e.row + "_" + columnId;
			var isCellEditable = editablecells[cellId] === undefined ? true : editablecells[cellId];
			var cellType = celltypes[cellId] || ((isProperty(columns[columnId], "type")) ? columns[columnId].type: "");
			var cellFormat = cellformats[cellId];
			
			// 특정 셀의 editable이 false 이면 편집모드 취소. 
			//(wijmo.hasClass(e.target, CLASSNAME_CUSTOM_CHECKBOX)) 사용자 정의 체크박스 인경우 취소시킴.
			if (!isCellEditable || cellType == DATATYPE.DATE|| cellType == DATATYPE.TEXT_DATE || (cellId != CONTROL_CHECKBOX &&cellType == DATATYPE.CHECKBOX )) {
				e.cancel = true;
				return;
			}

			// control checkbox 일 경우에는 셀 편집 이벤트 안먹히게 한다. 대신
			// checkboxClick 이벤트를 셀편집 이후에 처리하가 위함.
			// //fg.cellEditEnded.addHandler 참조.
			if (columnId == CONTROL_CHECKBOX) {
				return;
			}

			var flex = sender,
			id = fg.cells.columns[e.col].name,
			oldVal = flex.getCellData(e.row, e.col),
			row = Util.getRow(cv,e.row),
			orgId = "_ORG_" + id, 
			preId = "_PRE_" + id;

			var $cellSelect = $(fg.hostElement).find("div[wj-part=cells] .wj-cell.wj-state-selected");

			var isButtonCol = isProperty(columns[columnId], "button") && columns[columnId].button;
			var isFormatCol = isProperty(columns[columnId], "format") && columns[columnId].format != "";
			var isPrefixCol = isProperty(columns[columnId], "prefix") && columns[columnId].prefix != "";
			var isSuffixCol = isProperty(columns[columnId], "suffix") && columns[columnId].suffix != "";

			if (isButtonCol || isFormatCol || isPrefixCol || isSuffixCol) {
				formatterCol = columnId;
				var setText = flex.getCellData(e.row, e.col);
				$cellSelect.find("div").html("");

				o.SetValue({
					id : columnId,
					row : e.row,
					value : setText
				});
			}

			// ORG가 존재하지 않으면 등록해준다.
			if (!row.hasOwnProperty(orgId)) {
				row[orgId] = oldVal;
			}

			// ORG가 존재하지 않으면 등록해준다.DsArea
			if (!row.hasOwnProperty(preId)) {
				row[preId] = oldVal;
			}

			Util.updateData(cv, row);

			var p = {
				Id : fg.cells.columns[e.col].binding,
				Row : e.row,
				Value : oldVal,
				PreValue : row[preId],
				OrgValue : row[orgId],
				Text : $cellSelect.html()
			};

			// ChangeCellType으로 변경 하였을 경우 편집 모드로 변경하지 못하는 현상 발생.. 타입을
			// 변경하여 itemformatter를 다시 잃게 해준다.
			var col = fg.columns[Util.getColumnIndex(fg, id)];
			//컴보박스 편집시 기본값 선택


			pin.events.BeginEdit(p);


			if(cellType == DATATYPE.COMBO ){
				var comboId = null;
				var beginCombo = null;
				if(combos[cellId]){

					comboId = cellId;
					beginCombo = combos[comboId];
				}else if (combos[columnId]) {
					comboId = columnId;
					beginCombo = combos[comboId];
				}
				
				
				if(beginCombo && beginCombo.length > 0){		
					createCombo(col,beginCombo);

				}else{
					createCombo(col,[{key : "-999" ,value: "없음"}],true);
				}
			}

		})

		// 조회 로우 추가시 이벤트
		fg.loadedRows.addHandler(function(sender, e) {

			var rowLength = sender.rows.length;
			for (var i = 0; i < rowLength; i++) {
				pin.events.RowAdded(o.GetRow({
					row : i
				}));
			}

			fg.refresh();

		});

		//		
		var DoSubmit = function(p) {
			//달력이 열려 있으면 닫는다.
			layerClose();

			if ($.type(p) != "object") {
				return false;
			};

			//데이터가 없을때 no_result 이미지를 뿌려주기 위함.
			removeNoResult();
			
			// DATA_BINDINGS
			var DATA_BINDINGS = [];
			$.each(pin.columns, function(i, column) {
				DATA_BINDINGS.push({
					BINDING : column.binding,
					TYPE : column.type
				});
			});

			var querystring = "DATA_BINDINGS=" + JSON.stringify(DATA_BINDINGS) + "&MOBILE_YN=Y";
			if (p.mode == "S") { // 저장시...
				var groups = [ {
					grid : p.o,
					cud : p.cud
				} ];
				var data = {
					"IDS" : []
				};

				// group 정보 셋팅
				$.each(p.group, function(idx, g) {
					if ("DoQuery" in g) {
						g = {
							grid : g
						};
					}
					;
					g = $.extend(false, {
						cud : [ "C", "U", "D" ]
					}, g || {});
					groups.push({
						grid : g.grid,
						cud : g.cud
					});
				});
				$.each(groups,function(i, g) {
						var C = false;
						var R = false;
						var U = false;
						var D = false;
						$.each(g.cud, function(i, crud) {
							if (crud == CRUD.C) {
								C = true;
							} else if (crud == CRUD.R) {
								R = true;
							} else if (crud == CRUD.U) {
								U = true;
							} else if (crud == CRUD.D) {
								D = true;
							}
							;
						});
						data.IDS.push(g.grid.div_id);
						data[g.grid.div_id] = {
							CREATE : [],
							UPDATE : [],
							DELETE : [],
							READ : []
						};
	
						var items = g.grid.cv().items;
						var length = items.length;
	
						for (var i = 0; i < length; i++) {
							var row = {};
							var rdata = items[i];
							var crud = (rdata["CRUD"]) ? rdata["CRUD"] : CRUD.R;
							var checked = rdata[CONTROL_CHECKBOX];
							if (!R && !checked) {
								continue;
							} else if (R && p.checked && !checked) {
								continue;
							};
	
							$.each(g.grid.columns,function(i, column) {
								row[column.id] = rdata[column.id] != null ? rdata[column.id]: ""; // 
								if (column.type == DATATYPE.NUMBER && row[column.id] == "") {
									row[column.id] = "0";
								} else if (typeof (row[column.id]) == "string") {
									row[column.id] = row[column.id].replace(/"/gi,"\\\"");
								};
								
//								var encodingRegx = /[?|&|=]/gi;
//								if(encodingRegx.test(row[column.id])){
//									row[column.id] = encodeURI(row[column.id]);									
//								}


							});
							if (typeof (p.check_binding) == "string"&& p.check_binding != "") {
								row[p.check_binding.toUpperCase()] = (checked) ? "Y": "N";
							};
	
							if (crud == "C") {
								data[g.grid.div_id].CREATE.push(row);
							} else if (crud == "U") {
								data[g.grid.div_id].UPDATE.push(row);
							} else if (crud == "D") {
								data[g.grid.div_id].DELETE.push(row);
							} else if (crud == "R") {
								data[g.grid.div_id].READ.push(row);
							};
						};
					});
				querystring += "&GRID_DATA=" + encodeURI(JSON.stringify(data));
			} else {
				querystring += "&GRID_DATA={}";
			};

			$.each(p.parameters, function(i, q) {
				querystring += "&" + q;
			});

			var isFormData = false;
			var formData = null;
			
			if(Browser.type == "MSIE" && Browser.version >= 10 || Browser.type != "MSIE"){
				for ( var cuf in celluploadfiles) {
					isFormData = true;
					formData = new FormData();
					formData.append(celluploadfiles[cuf].name,celluploadfiles[cuf].files[0]);
				}
			}

			if(isFormData){
				
				var formParams = querystring.parseUrlParameter();
				for ( var fp in formParams) {
					formData.append(fp,(fp == "GRID_DATA") ? JSON.stringify(data) : formParams[fp]);
				}
			}
			
			
			var crosssAjaxPin = {
				div_id : div_id,
				action : p.action, 
				querystring : querystring,
				formData : formData,
				isFormData : isFormData,
				celluploadfiles : celluploadfiles,
				dataAsync : pin.properties.dataAsync, 
				appendLoading : appendLoading,
				removeLoading : removeLoading
			}
			
			crossAjax(crosssAjaxPin,function(data) {

				var message = {};
				if ($.type(data.MESSAGE) != "undefined") {
					$.each(data.MESSAGE, function(key, value) {
						message[key] = value;
					});
				};

				if (message.code == "F"	&& data.MESSAGE.login == "N") {
					pin.events.EndLogin(message);
					return false;
				};
				if (message.code == "S" && p.mode == "Q") {
					clearGridData(); // 데이타 초기화
				};

				if ($.type(data.RECORDS) != "undefined" && data.RECORDS.length > 0) {

					var records = data.RECORDS;
					var recordsLength = records.length;
					var caculateRecords = new Array();
					var groupValue = {};
					var isGroup = false;
					var groupRow = new Array();
					var caculateRow = {};
					var caculateRowTemp = {};
					
					
					if(group_yn || total_yn){
						var fgCol  = fg.columns.slice(1,fg.columns.length);
						
						var getLastColMergeIndex = function(fgCol){
							
							var numList = new Array();
							for (var m = 0; m < fgCol.length; m++) {
								for ( var id in calculations) {
								
									if( id == fgCol[m].name ){
										numList.push(fgCol[m].index);
									}
								}
							}
							
							numList.sort(function(a, b){ return a-b; });
							return numList[0];
						}  
						
						
						var isRecordFinal = false;
						
						for (var k = 0; k <= recordsLength ; k++) {
							
						
							//마지막 행인지 체크한다.
							if(k==recordsLength){
								isRecordFinal = true;
							}
							
							//마지막 행일 경우 데이터가 없어서 에러가 나기 때문에 이전 행의 데이터를 가져온다.
							var record = records[(isRecordFinal) ?  k -1 : k];

							
							var caculateVo = null;			
							for ( var key in groupcolumns) {
																
								//값이 다르거나 마지막 레코드이면 그룹 여부및 관련 정보 등록
								if(isRecordFinal || groupValue[key] && groupValue[key] != record[key]){
									isGroup = true;
									groupRow.push(key);	
									caculateRow[key] = $.extend({},caculateRowTemp[key]);
									delete caculateRowTemp[key];
								}
								
								caculateVo = caculateRowTemp[key];
								
								if(isGroup || !caculateVo){
									//계산 컬럼을 담을 객체를 담는다.
									caculateVo = caculateRowTemp[key] = {};

									//계산..
									for ( var id in calculations) {
		
										if(!caculateVo.hasOwnProperty(id)){
											caculateVo[id]={
												sum : 0 + Number(record[columns[id].binding]),
												cnt : 1
											};
										}
									}		
									
								}else{
									
									for ( var id in calculations) {
										
										caculateVo[id].sum = caculateVo[id].sum + Number(record[columns[id].binding]);
										caculateVo[id].cnt++;
									}	
								}
							}
							
							if(isGroup){
							
								//하위 그룹먼저 체크하기위해 역순으로 정렬.
								groupRow.reverse();
								var groupRowLength = groupRow.length;
								
								for (var gr = 0; gr < groupRowLength ; gr++) {
									//신규로우는 이전 데이터를 참조하여 작성한다.
									var newRecord = $.extend({},records[k-1]);
									
	
									//병합할 컬럼 index정보를 구함.
									var mergetStartIndex = -1;
									var mergeLastIndex = getLastColMergeIndex(fgCol)-1;
									
									for (var m = 0; m < fgCol.length; m++) {
										
										var groupColName = fgCol[m].name;
										
										if(groupColName == groupRow[gr]){
											mergetStartIndex = fgCol[m].index-1;
										}

										//병합할 컬럼 데이터들은 format데이터로 동일하게 입력한다(자동 merge됌)
										if(mergetStartIndex != -1 && m >= mergetStartIndex && m < mergeLastIndex){
											
											var formats = [];
											$.each(groupcolumns[groupRow[gr]].ids, function() {
												formats.push(this);
											});											
											newRecord[groupColName] = string_format(groupcolumns[groupRow[gr]].format, formats);
											
										}
									}
									
									
									$.each(caculateRow[groupRow[gr]],function(key,obj){
	
										if(calculations[key].mode == "SUM"){
											newRecord[key] = obj.sum;
										}else if(calculations[key].mode == "COUNT"){
											newRecord[key] = obj.cnt;											
										}else if(calculations[key].mode == "AVERAGE"){
											newRecord[key] = obj.sum/obj.cnt;
										}
									});

									newRecord.isGroup = true;
									caculateRecords.push(newRecord);
									
									delete caculateRow[groupRow[gr]];
								}

								//그룹 항목처리가 끝냈으면 초기화.
								isGroup = false;
								groupRow = new Array();
							}
							
							
							//전체 합계일 경우
							if(total_yn && k < recordsLength){
	
								//계산..
								for ( var id in calculations) {
	
									var groupTotalKey = "grouptotal";
									var totalVo = caculateRow[groupTotalKey]; 
									
									if(!totalVo){
										totalVo = caculateRow[groupTotalKey] = {};
									}

									if(!totalVo.hasOwnProperty(id)){
										totalVo[id]={
											sum : 0 + Number(record[columns[id].binding]),
											cnt : 1
										};
									}else{
										totalVo[id].sum = totalVo[id].sum + Number(record[columns[id].binding]);
										totalVo[id].cnt++;
									}
								}	
	
							}

							//전체 합계일 경우
							if(total_yn && isRecordFinal){
							
								var totalRecord = {};
								var totalMergeStartIndex = 0;
								var totalMergeLastIndex = getLastColMergeIndex(fgCol)-1;
								
								for (var m = 0; m < fgCol.length; m++) {
									
									var groupColName = fgCol[m].name;
									
									//병합할 컬럼 데이터들은 format데이터로 동일하게 입력한다(자동 merge됌)
									if(totalMergeStartIndex != -1 && m >= totalMergeStartIndex && m < totalMergeLastIndex){								
										totalRecord[groupColName] = pin.grouptotal.description;	
									}
								}
								
								$.each(caculateRow["grouptotal"],function(key,obj){
									
									if(calculations[key].mode == "SUM"){
										totalRecord[key] = obj.sum;
									}else if(calculations[key].mode == "COUNT"){
										totalRecord[key] = obj.cnt;											
									}else if(calculations[key].mode == "AVERAGE"){
										totalRecord[key] = obj.sum/obj.cnt;
									}
								});
								
								totalRecord.isGroup = true;
								caculateRecords.push(totalRecord);
							}
							
							//마지막 레코가 아닐 경우만 추가한다.
							if(!isRecordFinal){
								
								//계산컬럼에 바인드된 데이터가 있다면 따로 복사해준다.
								for ( var rc in record) {									
									for ( var cc in columns) {
										if(rc == columns[cc].binding){
											record[cc] = record[rc];
										}									
									}
								}
								caculateRecords.push(record);
							}

							//로우가 추가될때마다 이전데이터 값을 비교하기 위하여 설정.
							for ( var key in groupcolumns) {
								groupValue[key] = record[key];
							}		
							
						}
					}
					
					if((group_yn || total_yn) && pin.properties.before_group_row_add && pin.events.BeforeGroupRowAdd && typeof(pin.events.BeforeGroupRowAdd) == "function"){
						
						if(caculateRecords.length > 0){
							caculateRecords = caculateRecords.concat(pin.events.BeforeGroupRowAdd(caculateRecords));		
						}
					}
					
					cv = new wijmo.collections.CollectionView((group_yn || total_yn) ? caculateRecords : records);
					fg.itemsSource = cv;
					cv.trackChanges = true;

					// selectionChanging 이벤트 감지위해 로딩시 2번 이동.
					if (cv.itemCount > 1) {
						removeNoResult();
						isValid.isFirstLoad = true;
						setTimeout(function(){
				            
							fg.select(0, 0);
							//1개만 나올 때도 rowchange 이벤트 발생해야한다.
							var row1 = o.GetRow({
								row : 0
							});
							pin.events.RowChanged(row1, row1);
							isValid.isFirstLoad = false;	
						},50);
					}else{
						if(cv.itemCount == 0){
							setTimeout(function(){
								appendNoResult();						
							},10)
						}else if(cv.itemCount == 1){
							//1개만 나올 때도 rowchange 이벤트 발생해야한다.
							var row1 = o.GetRow({
								row : 0
							});
							pin.events.RowChanged(row1, row1);
							removeNoResult();
						}
					}

				}else{
					if(!p.mode == "S"){
						setTimeout(function(){
							appendNoResult();						
						},10);
					}
				}
				
				if ($.type(data.PAGED_INFO) != "undefined") {
					$.each(data.PAGED_INFO, function(key, value) {
						message[key] = value;
					});
				};
				if (p.mode == "Q") {
					pin.events.EndQuery(message);
				} else if (p.mode == "S") {
					pin.events.EndSave(message);
				};
			});

		};

		// functions 셋팅
		$.extend(o,	$.fn.grid.functions,{
			DoQuery : function(p) { // 조회
				return DoSubmit(p, this);
			},
			DoSave : function(p) {
				return DoSubmit(p, this);
			},
			GetValue : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				if(beginEditCellId == null){
					fg.finishEditing(true);	
				}
				
				p.selectLastRow = selectLastRow;
				var row = Util.getRowNum(p);

				var rdata = Util.getRow(cv, row);

				return rdata[p.id];
			},
			SetValue : function(p) {

				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);

				p.selectLastRow = selectLastRow;

				var rowid = "";
				var row = null;

				if ($.type(p.row) != "undefined"&& p.row != null) {
					row = p.row;
				} else {
					row = p.rowid;
				}

				var type = celltypes[row + "_" + p.id] || ((isProperty(columns[p.id], "type")) ? columns[p.id].type: "");
				var rdata = Util.getRow(cv, row);

				if (!rdata) {
					console.log("해당 컬럼 row 데이터가 존재 하지 않습니다. [row : "+row+"]");
					return;
				}

				var isEventYn = (p.hasOwnProperty("event_yn") && p.event_yn === true) ? true : false;
				var id = p.id;
				var value = p.value; // 셋팅할 값
				var binding = "";
				var columnLength = fg.columns;

				for (var z = 0; z < columnLength.length; z++) {

					var properties = fg.columns[z];
					if(properties.binding == id){
						binding = properties.binding;
					}

				}

				// 입력된 값에 대한 validation
				if (columns[id].type == DATATYPE.NUMBER) {
					if ($.isNumeric(value)) {
						value = value+"";
					};
				};
				if (value == "") { // empty를 셋팅하기 위해서는 null을 넘겨줘야 함???
					value = null;
				};

				if (p.readonly) { // readonly:true 일 경우 값만
									// 셋팅하고 빠져나오자...
					rdata[id] = value;
					Util.updateData(cv, rdata[id]);

					return false;
				};

				var curdata = rdata[((binding != "") ? binding: id)]; // 현재 셀의 실제값
				var curdataFile = rdata[((binding != "") ? "_F_"+binding: "_F_"+id)] || curdata; // 타입이 파일일 경우 현재 셀의 실제값
				var orgId = "_ORG_" + id;
				var preId = "_PRE_" + id;
				var orgIdFile = "_F_ORG_" + id;
				var preIdFile = "_F_PRE_" + id;
				// ORG가 존재하지 않으면 등록해준다.
				if (!rdata.hasOwnProperty(orgId)) {
					rdata[orgId] = binding != "" ? rdata[binding]: curdata;
				}


				if(type == DATATYPE.FILE && !rdata.hasOwnProperty(orgIdFile)){
					rdata[orgIdFile] = binding != "" ? rdata["_F_"+binding] || "" : curdataFile;
				}
				
				// pre가 존재하지 않으면 등록해준다.
				if (!rdata.hasOwnProperty(preId)) {					
					rdata[preId] = binding != "" ? rdata[binding]: curdata;
				}
				
				if(type == DATATYPE.FILE && !rdata.hasOwnProperty(preIdFile)){
					rdata[preIdFile] = binding != "" ? rdata["_F_"+binding] || "" : curdataFile;
				}

				var orgValue = rdata[orgId]; // 현재 셀의 원값
				var orgFileValue = rdata[orgIdFile]; // 파일 셀의 원값
				

				var crud = rdata["CRUD"];
				rdata[id] = value;
				rdata["_F_"+id] = p.filename;

				// 현재 row의 상태값 셋팅(CUD)
				var changed = false;

				for ( var key in rdata) {

					if (rdata.hasOwnProperty("_ORG_" + key)	&& rdata[key] != rdata["_ORG_"+ key]) {
						
						if(!changed && rdata[key] == null && rdata["_ORG_"+ key] == ""){							
							changed = false;
						}else{
							changed = true;	
							//break;
						}
					}
				}
				
				if(type == DATATYPE.FILE){
					
					for ( var key in rdata) {

						if (rdata.hasOwnProperty("_F_ORG_" + key)	&& rdata[key] != rdata["_F_ORG_"+ key]) {
							
							if(rdata["_F_"+id] == null && rdata["_F_ORG_"+ key] == ""){
								changed = false;
							}else{
								changed = true;							
							}
						}
					}
					
					
				}
				
				if (crud == CRUD.C || crud == CRUD.D) { // 상태가 바뀔 이유가 없음...
					// do nothing...
				} else if (changed) {
					rdata[CONTROL_CHECKBOX] = true;
					rdata["CRUD"] = CRUD.U;
				} else {
					rdata[CONTROL_CHECKBOX] = false;
					rdata["CRUD"] = CRUD.R;
				};

				rdata[preId] = curdata;
				if(type == DATATYPE.FILE){
					rdata[preIdFile] = curdataFile;
				}
				
				//셀 스타일 bold 셋팅
				if (p.bold) {
					cellbolds[row+"_"+p.id] = p.bold;
				};
									
				// 편집상태 업데이트
				Util.updateData(cv, rdata);
				
				if(pin.properties.autoRowResize){
					fg.rows[row].wordWrap = true;
		            fg.autoSizeRow(row, false);
				}
				
				//이벤트 진행 여부가 false이면 더이상 진행 되지 않게한다.
				if(!isEventYn){
					return;
				}

				if (type != DATATYPE.FILE && (curdata || "") != (value == null ? "" : value)) { // cell이 내용이 변경되었다면 이벤트를 발생시켜주자.. ""으로 셋팅한 값은 null이 리턴되므로 주의하자...
					pin.events.ChangeCell({
						Id : id,
						Row : row,
						Value : p.value,
						PreValue : curdata || "",
						OrgValue : orgValue || ""
					});
				}else if (type == DATATYPE.FILE && curdataFile != (p.filename == null ? "" : p.filename)) { // cell이 내용이 변경되었다면 이벤트를 발생시켜주자.. ""으로 셋팅한 값은 null이 리턴되므로 주의하자...
					pin.events.ChangeCell({
						Id : id,
						Row : row,
						Value : p.filename,
						PreValue : curdataFile || "",
						OrgValue : orgFileValue || ""
					});
				};

			},
			AddRow : function(p) {

				removeNoResult();

				var tmpSelectLast = selectLastRow+"";

				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);

				// 로우 추가할 때 데이터가 셋팅되기 이전에 rowchage 이벤트 발생하여 잘못된
				// 데이터가 넘어옴
				// 로추 추가가 모두 끝나면 그 이후에 rowchange 이벤트 호출 한다.
				isValid.isAdded = true;
				
				var isTreeRow = (p.hasOwnProperty("tree_row") && p.tree_row !== undefined && p.tree_row !== null);
				var siblingrow = (function(r){ return r;})(cr ?cr.row : -1);
			
				var newData = cv.addNew();

				//팝업창에서 addRow할경우 포커스를 잃어버리는 현상 발생 null 값으로 추가된 row 제거하고 신규 로우 생성.
				if(newData == null){
					fg.rows.removeAt(fg.rows.length-1);
					newData = cv.addNew();
					selectLastRow = 0;
				}
				
				$.each(pin.columns, function(j, column) {

					var value = p.data[column.id];

					if (!value) {
						value = "";
					};
					newData[column.id] = value+""; //그리드에 데이터 넘길때는 number 데이터타입 상관없이 문자열로 데이터 입력.
				});

				// 시스템 체크박스에서 사용할 수 있도록...
				$.extend(p.data, {
					CRUD : p.crud || CRUD.C
				});

				newData[CONTROL_CHECKBOX] = true; // 맨처음 등록 될때 체크박스 체크 된걸로 표시
				newData["CRUD"] = p.data["CRUD"];

				$.each(pin.columns, function(j, column) { // 그리드 기능을 위한 추가적인 값들...
					var value = p.data[column.id];
					if (!value) {
						value = "";
					}
					newData["_ORG_" + column.id] = value; // 해당 cell의최초값
					newData["_PRE_" + column.id] = value; // 해당cell 변경 이전의 값
				});
				
				
				
				var treeAddIndex = -1;								
				var colId = Util.getColumnIdFirstByDataType(columns, DATATYPE.LEVEL);

				if(!p.sibling){
					var currData = o.GetRow({row : siblingrow});

					newData[colId] = currData[colId];
					
					var nextRow = siblingrow + 1;

					while (true) {
						
						//level 컬럼이 존재 하지 않으면 LEVEL을 1로 설정하고 빠져나간ㄷ.
						if(currData[colId] === undefined){
							treeAddIndex = 0;
							newData[colId] = "1";
							break;
						}

						//sibling 이 false 이고 tree_row가 있다면 tree_row 데이터를 가져온다. 없다면 다음 row 검색.
						var sibilingData = Util.getRow(cv,(isTreeRow) ? p.tree_row : nextRow);		

						if(sibilingData != null ){
							treeAddIndex = fg.rows[nextRow].index;
							newData[colId] = (Number(sibilingData[colId])+1)+"";	
							break;
						}

						nextRow++;
						
					}

				}else if(p.sibling){
					var colId = Util.getColumnIdFirstByDataType(columns, DATATYPE.LEVEL);
					var currData = o.GetRow({row : siblingrow});
					var isRoot = (p.row && p.row ==-1) ? true : false;
					newData[colId] = (isRoot) ? "1" : currData[colId];	
					treeAddIndex = cv.itemCount-1;
					var nextRow = siblingrow + 1;

					if(!isRoot){
						while (true) {
							var sibilingData = Util.getRow(cv,nextRow);						
							if(sibilingData != null && Number(currData[colId]) >= sibilingData[colId] ){
								treeAddIndex = fg.rows[nextRow].index;
								break;
							}
							nextRow++;
						}						
					}

				}	
				
				cv.commitNew();
				
				if(p.isAddGroup == true){
					fg.rows[fg.rows.length-1].allowMerging = true;						
				}

				//DATATYPE.LEVEL 이 있다면 COLID에 레벨 컬럼명 존재함.
				if(colId != ""){
					setTimeout(function(){
						cv.items.move(cv.itemCount-1,treeAddIndex)
						fg.rows.move(cv.itemCount-1,treeAddIndex)		
						fg.select(treeAddIndex, 1);
					},100);				
				}else{
					setTimeout(function(){
						fg.scrollIntoView(p.hasOwnProperty("row") ? p.row : cv.itemCount-1, 1);
					},50)
				}

				// row 위치에 따라 add row한다. row가 없는 상태에서 지정시에는 순서대로 추가 되다가 해당 되는 위치에 row데이터가 존재하면 그곳부터 삽입.
//				cv.sourceCollection.splice(p.hasOwnProperty("row") ? p.row : cv.itemCount, 0, newData);
//			    cv.refresh();
//			    
				newData.Index = cv.itemCount - 1;
				pin.events.RowAdded(newData);
				var row2 = o.GetRow({
					row : selectLastRow
				});
				if (row2 == undefined) {
					row2 == newData;
				}
				pin.events.RowChanged(newData, row2);

				isValid.isAdded = false;
			},
			GetRowCount : function(p) {
				return cv.itemCount;
			},
			DeleteCreateRows : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				
				var delRow = [];

				// tracking 된 데이터를 따로 delrow 변수에 저장한다.
				$.each(cv.itemsAdded, function(i, data) {
					delRow[i] = data;
				});

				// delrow에 저장된 신규 데이터를 삭제.
				$.each(delRow, function(i, data) {

					// 체크박스 여부 체크
					if (data[CONTROL_CHECKBOX]) {
						cv.remove(data);
						fg.select(cv.itemCount - 1, 0);
					}
				});

			},

			DeleteRows : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);

				$.each(cv.items,function(i, data) {

					if (data[CONTROL_CHECKBOX] && (!data["CRUD"] || data["CRUD"] == "R" || data["CRUD"] == "U")) {
						cv.items[i]["CRUD"] = CRUD.D;
						Util.updateData(cv,	cv.items[i]);
					}
					;
				});

			},
			DeleteRow : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				
				var row = p.row;

				if (p.row && $.type(p.row) == "string") {
					row = Number(p.row);
				}
				var rdata = Util.getRow(cv, row);
				if(rdata["CRUD"] == CRUD.C){
					cv.remove(rdata);
				}else{
					rdata["CRUD"] = CRUD.D;
					rdata[CONTROL_CHECKBOX] = true;

					Util.updateData(cv,rdata);					
				}
			},
			Restore : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				
				// 신규 추가된 컬럼은 모두 제거
				o.DeleteCreateRows();
				$.each(cv.items,function(i, data) {

					if ((data["CRUD"] != CRUD.R)) {
						cv.items[i]["CRUD"] = CRUD.R;
						cv.items[i][CONTROL_CHECKBOX] = false;

						for ( var key in cv.items[i]) {

							if (key.indexOf("_ORG_") > -1) {
								var org_value = cv.items[i][key];
								cv.items[i][key.replace("_ORG_","_PRE_")] = org_value;
								cv.items[i][key.replace("_ORG_","")] = org_value;
							}
						}

						Util.updateData(cv,cv.items[i]);
					}
					;
				});
				
				cellbolds = {};
				forecolor = {}; // row 폰트색 저장
				backcolor = {}; // row 배경색 저장
				fg.refresh();

			},
			GetRow : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
			//	fg.finishEditing(true);
				
				p.selectLastRow = (cr) ? cr.row : selectLastRow;

				var row = Util.getRowNum(p);
				
				var data = null;
				if (row != null) {

					var rdata = Util.getRow(cv, row);

					if (rdata == null) {
						return {};
					}

					data = {
						Visible : (rdata != null && rdata.Visible == "Y") ? true: false,
						Index : rdata.Index,
						CRUD : (rdata != null && !rdata.hasOwnProperty("CRUD")) ? CRUD.R: rdata["CRUD"],
						isGroup : (rdata != null && !rdata.hasOwnProperty("isGroup")) ? false: rdata["isGroup"]
					};
								// 체크박스 선택 여부
					data[CONTROL_CHECKBOX] = (!rdata[CONTROL_CHECKBOX]) ? false: rdata[CONTROL_CHECKBOX];

					$.each(pin.columns, function(i, column) {
						
						
						if(column.type == DATATYPE.NUMBER && !rdata[column.id]){
							data[column.id] = 0;
						}else if (column.type == DATATYPE.NUMBER && rdata[column.id] == "") {
							data[column.id] = 0;
						}else{
							data[column.id] = rdata[column.id] || "";
						}
						
						data["_PRE_" + column.id] = (rdata.hasOwnProperty("_PRE_" + column.id)) ? rdata["_PRE_"+ column.id] : rdata[column.id] || ((column.type == DATATYPE.NUMBER) ? 0 :"")
						data["_ORG_" + column.id] = (rdata.hasOwnProperty("_ORG_" + column.id)) ? rdata["_ORG_"+ column.id] : rdata[column.id] || ((column.type == DATATYPE.NUMBER) ? 0 :"")
					});
					data.Index = row;
				};

				return data;

			},

			GetRows : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				var rows = [];
				var orgRows = cv.items;
				var length = orgRows.length;
				for (var i = 0; i < length; i++) {
					var rdata = o.GetRow({
						row : i
					});

					if (p.checked && !rdata[CONTROL_CHECKBOX]) {
						continue;
					};
					rows.push(rdata);
				};
				return rows;

			},
			GetCell : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				
				var id = p.id;
				var cell = null;

				p.selectLastRow = selectLastRow;

				var row = Util.getRowNum(p);
				var type = celltypes[row + "_" + id]|| ((isProperty(columns[id], "type")) ? columns[id].type : "");

				if (row != null) {
					var rdata = Util.getRow(cv, row);
					var $cellSelect = $(fg.hostElement).find("div[wj-part=cells] .wj-cell.wj-state-selected");
					var text ="";
					var colIndex = Util.getColumnIndex(fg, id);
					
					if(type == DATATYPE.COMBO){

						var dataSet = [];
						if(celltypes[row+"_"+id] && celltypes[row+"_"+id] == DATATYPE.COMBO && combos[row+"_"+id]) {	
							dataSet = combos[row+"_"+id];
						}else if(combos[id]){
							dataSet = combos[id];
						}
						
						for (var c = 0; c < dataSet.length; c++) {

							if(dataSet[c].key ==rdata[id] ){
								text = dataSet[c].value;
								break;
							}
						}
						
					}else{
						text = $cellSelect.html();
					}

					cell = {
						Id : id,
						Row : p.row,
						Value : rdata[id],
						PreValue : (rdata.hasOwnProperty("_PRE_" + id)) ? rdata["_PRE_"+ id]: rdata[id],
						OrgValue : (rdata.hasOwnProperty("_ORG_" + id)) ? rdata["_ORG_"+ id]: rdata[id],
						Text : text  ,
						DataType : type,
						isGroup: rdata.isGroup ? true : false,
						isTotal: rdata.isTotal ? true : false
					};
				}
				;
				return cell;

			},
			AddColumn : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				
				if (!p.binding) {
					p.binding = p.id;
				}

				var reDefine = Util.reDefineColumn(p);
				columns[p.id] = p;

				fg.columns.insert(1 + p.index,new wijmo.grid.Column(reDefine));
				// fg.columns.push(new wijmo.grid.Column());
				fg.refresh();

			},
			RemoveColumn : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				
				var length = fg.columns.length;

				for (var i = 0; i < length; i++) {

					if (fg.columns[i].name == p.id) {
						fg.columns.removeAt(i);
						fg.refresh();
					}
				}

			},
			HideColumn : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				
				var length = fg.cells.columns.length;

				for (var i = 0; i < length; i++) {
					if (fg.cells.columns[i].name == p.id) {
						fg.cells.columns[i].visible = false;
					}
				}

			},
			ShowColumn : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				
				var length = fg.cells.columns.length;

				if (p.id && p.id != "") {

					for (var i = 0; i < length; i++) {
						if (fg.cells.columns[i].name == p.id) {
							fg.cells.columns[i].visible = true;
						}
					}
				} else {
					for (var i = 0; i < length; i++) {

						for ( var key in columns) {
							if (fg.cells.columns[i].name == columns[key].id
									&& columns[key].type != DATATYPE.HIDDEN) {
								fg.cells.columns[i].visible = true;
							}
						}
					}
				}

			},
			HideRow : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				
				var length = fg.rows.length;

				for (var i = 0; i < length; i++) {
					if (fg.rows[i].index == p.row) {
						fg.rows[i].visible = false;
					}
				}

			},
			ShowRow : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				
				var length = fg.rows.length;

				for (var i = 0; i < length; i++) {
					if (fg.rows[i].index == p.row) {
						fg.rows[i].visible = true;
					}
				}
			},
			CreateCombo : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				var id = p.id;
				var combo = null;

				if ((p.row != undefined && typeof(p.row) == "number")) {
					combo = getCombo(p.combo);
				};
				if (combo != null) {
					combos[p.row + "_" + id] = (function() {

						var arrDataMap = [];
						var i = 0;

						$.each(combo, function(k, v) {

							var dataMap = v;
							arrDataMap[i] = dataMap;
							i++;

						});

						return arrDataMap;
					})();
				};
				
				
				var cellId = p.row + "_" + id;
				celltypes[cellId] = DATATYPE.COMBO;

			},
			ClearRows : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				
				clearGridData();
			},
			SelectRow : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				
				fg.select(p.row, 0);
			},
			SelectCell : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				
				var cellNum = 0;

				$.each(fg.cells.columns,
						function(z, cellcolumn) {

							// 컨트롤 체크박스는 넘어간다.
							if (p.id == cellcolumn.name) {
								cellNum = cellcolumn.index;
								return false;
							}
						});

				fg.select(p.row, cellNum);

			},
			SetEditable : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				
				if ($.type(p) == "boolean") { // 전체 컬럼에 대해서 적용

					// 초기화시에셋팅해놓은 columns정보 값 변경
					$.each(columns, function(i, column) {
						column.editable = p;
					});

					// 그리드 내의 컬럼 정보 값 변경
					$.each(fg.cells.columns,function(i, column) {
	
						// 컨트롤 체크박스는 넘어간다.
						if (i == 0) {
							return;
						}
						fg.cells.columns[i].isReadOnly = !p;
					});

				} else if ($.isArray(p)) { // 지정된 컬럼들에 대해서 적용

					$.each(p,function(i, column) {

						columns[column.id].editable = column.editable;
						// 그리드 내의 컬럼 정보 값 변경
						$.each(fg.cells.columns,function(z,cellcolumn) {

							// 컨트롤 체크박스는 넘어간다.
							if (column.id == cellcolumn.name) {
								fg.cells.columns[z].isReadOnly = !column.editable;
							}
						});
					});

				} else if ($.isPlainObject(p)) { // 특정 row 또는column 또는 cell에 적용

					var row = $.type(p.row) == "number" ? p.row	: -1;
					var id = $.type(p.id) == "string" ? p.id: "";

					if (row > -1 && id != "") { // cell 지정
						editablecells[row + "_" + id] = p.editable;
						fg.refresh();

					} else if (row > -1 && id == "") { // row 지정
						fg.rows[row].isReadOnly = !p.editable;
					} else if (row == -1 && id != "") { // column
														// 지정

						// 그리드 내의 컬럼 정보 값 변경
						$.each(fg.cells.columns,function(z, cellcolumn) {

							// 컨트롤 체크박스는 넘어간다.
							if (id == cellcolumn.name) {
								fg.cells.columns[z].isReadOnly = !p.editable;
							}
						});

						columns[id].editable = p.editable;
					};
				};

			},
			CancelEdit : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				
				o.SetEditable({
					row : p.row,
					id : p.id,
					editable : p.value
				});
			},

			SetColumnIndex : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				
				var id = p.id;
				var length = fg.cells.columns.length;

				for (var i = 0; i < length; i++) {
					if (fg.cells.columns[i].name == id) {
						fg.cells.columns.moveElement(fg.cells.columns[i].index,	p.index + 1);
					}
				}

			},

			CheckRequired : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				
				var result = true;
				
				var items = cv.items;
				var length = items.length;

				$.each(cv.items,function(i, data) {
					// 빈값 검사
					$.each(columns,function(j,column) {

						if (column.required&& $.trim(data[column.binding]) == "") {
							cv.editItem(data);
							alert("컬럼 : "+ column.header+ "\n행번호 : "+ (i+1)+ "\n셀값은 필수 입니다.");
							result = false;
							return false;
						};
					});
				});
				


				return result;

			},
			ChangeCellType : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				
				p = $.extend({
					type : ""
				}, p || {});
				var row = p.row;
				var rdata = o.GetRow({
					row : row
				});
				var id = p.id;
				var type = p.type;
				if (type != "") {
					celltypes[row + "_" + id] = type;
				}
				;
				var format = p.format;
				if (format != "") {
					if (type == DATATYPE.NUMBER) {
						format = makeNumberformat(p.format);
					}
					cellformats[row + "_" + id] = format;
				};

				var col = null;
				var colLength = fg.cells.columns.length;

				for (var i = 0; i < colLength; i++) {
					if (fg.cells.columns[i].name == id) {
						col = fg.cells.columns[i].index;
					}
				}

				o.SetValue({
					row : row,
					id : id,
					value : rdata[id]
				});

			},
			CheckRow : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				
				var row = Util.getRow(cv, p.row);

				if (row.hasOwnProperty(CONTROL_CHECKBOX)) {
					row[CONTROL_CHECKBOX] = p.checked;
				} else {
					row.Checked = p.checked;
				}

				Util.updateData(cv, row);
			},
			ChangeCRUD : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				
				var row = Util.getRow(cv, p.row);

				if (row.hasOwnProperty("CRUD")) {
					row["CRUD"] = p.crud;
				} else {
					row.CRUD = p.crud;
				}

				row.Checked = (p.crud == "R") ? false : true;

				Util.updateData(cv, row);

			},
			SetBackground : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				
				var color = "#";
				$.each(p.color.split("|"), function() {
					color += (+this).toString(16);
				});

				var backColorId = p.row + (p.id || "");
				var id = (p.id || "");

				backcolor[backColorId] = {
					id : id,
					color : color
				};

				fg.refresh();

			},
			SetForeground : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				
				var color = "rgb(";

				$.each(p.color.split("|"), function() {

					color += this+","
				});
				
				color = color.substring(0,color.length-1)+")";

				var foreColorId = p.row + (p.id || "");
				var id = (p.id || "");

				forecolor[foreColorId] = {
					id : id,
					color : color
				};
				fg.refresh();
			},
			CollapseRow : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				
				var currData = Util.getRow(cv, p.row);
				var nextData = Util.getRow(cv, p.row + 1);
				var isLeaf = false;
				var isTreeVisible = false;
				var colId = Util.getColumnIdFirstByDataType(columns, DATATYPE.LEVEL);
				var leafLevel = -1;

				if (nextData != null
						&& nextData.hasOwnProperty(colId)) {

					if (Number(nextData[colId]) > Number(currData[colId])) {
						isLeaf = true;
						leafLevel = Number(nextData[colId]);

					}
					if (fg.rows[p.row + 1].visible) {

						isTreeVisible = true;
					}
				}

				// 하위 노드가 없으면 접지않는다.
				if (!isLeaf) {
					return;
				}

				// 접으면 Y
				currData["Collapse"] = "Y";

				if (isLeaf && isTreeVisible) {

					var nextRow = p.row + 1;

					while (true) {

						var sibilingData = Util.getRow(cv,nextRow);

						if ((sibilingData != null && sibilingData[colId]&& Number(sibilingData[colId]) < leafLevel) || sibilingData == null ) {
							break;
						}

						if (fg.rows[nextRow].visible) {
							fg.rows[nextRow].visible = false;
						}

						nextRow++;
					}

					Util.updateData(cv, currData);
				}

			},
			FilterRow : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				
				if (cv.itemCount > 0) {

					isFliter = true;
					var firstData = null;

					// CollectionView filter
					cv.filter = function(item) {

						var result = item[p.id]
								.indexOf(p.keyword) > -1;

						if (result && firstData == null) {
							firstData = item;
						}

						return result;

					};

					pin.events.EndFilter(firstData);
					cv.refresh();

				}

			},
			SearchRow : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				
				isFliter = true;
				var firstData = null;

				// CollectionView filter
				cv.filter = function(item) {

					var result = item[p.id].indexOf(p.keyword) > -1;

					if (result && firstData == null) {
						firstData = item;
					}

					result = true;

					return result;

				};

				cv.moveCurrentTo(firstData);

				var length = fg.cells.columns.length;
				var colIndex = -1;

				for (var i = 0; i < length; i++) {
					if (fg.cells.columns[i].name == p.id) {
						colIndex = fg.cells.columns[i].index;
					}
				}

				fg.select(cr.row, colIndex);

			},
			ReplaceColumns : function(p) {
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				
				clearGridData();
				columns = {};
				pin.columns = p.columns;

				var length = p.columns.length;
				var colModel = new Array();

				for (var i = 0; i < length; i++) {
					colModel.push(Util.reDefineColumn(p.columns[i]));
					columns[p.columns[i].id] = $.extend({},	p.columns[i]);
				}

				var leng =  fg.columns.length;
				for (var i = 1; i < leng; i++) {
						fg.columns.removeAt(i);
				}
							
				while (true) {
					
					if(1 == fg.columns.length){
						break;
					}
					
					fg.columns.removeAt(count);
				}

				fg.refresh();

				fgInitializeParam.columns = colModel;
				fg.initialize(fgInitializeParam);

				fg.autoGenerateColumns = false;
				fg.editablecells = editablecells;
				fg.usercolumns = columns;

			}, //
			ShowColumnsButton : function() {

				$("#" + pin.div_id).parent().find("div.gd_btns").each(function() {
					if ($(this).find("button.button_hide").length == 0) {
						var button = $("<button />").attr({
							type : "button",
							title : "숨기기취소"
						})
						.append("<span>숨기기취소</span>").click(function() {
							o.ShowColumn({id : ""});
							button.remove();
						})
						.addClass("button_hide");
						$(this).append(button);
					};
					$(this).show();
				});

			},
			MoveRow : function(p) { // tree형 그리드에서 사용
				
				//편집중에 그리드 밖에 있는 엘리먼트 조작시 포커스를 잃어버려 데이터 조작 에러발생. 그럴경우 반드시 편집 마무리 해준다음 처리
				fg.finishEditing(true);
				
				var getDirection = function(row,colId,rows,type){

					var rdata = o.GetRow({row:row});
					var currLevel = rdata[colId];
					
					var isStop = false,
						rowIndex = -1;
					
					if(type && type == "U"){		
						
						if(row-1 == -1){
							isStop = true;												
						}else{										
							for (var i = row-1; i >= 0; i--) {
								
								var stopLevel = Number(currLevel) > Number(rows[i][colId]);
								
								if(Number(currLevel) == Number(rows[i][colId]) || stopLevel ){
									rowIndex = i;													
									if(stopLevel){
										isStop = true;												
									}
									
									break;
								}
							}
							
						}
					}else{
						
						for (var i = row+1; i < length+1; i++) {
							
							var stopLevel = null;
							var isLast = (i == length);
							var isLevel = 0;
							
							if(!isLast){
								stopLevel = Number(currLevel) > Number(rows[i][colId]);
								isLevel = (Number(currLevel) == Number(rows[i][colId]));

							}
							if(isLevel || stopLevel || isLast ){
								rowIndex =i;
								
								if(stopLevel){
									isStop = true;												
								}
								
								break;
							}
						}
					}
				
					
					return{
						rowIndex : rowIndex,
						isStop : isStop
					};								
				}
				
				var colId = Util.getColumnIdFirstByDataType(columns,DATATYPE.LEVEL);
				var length = cv.items.length;
				var currRow = cr.row;
				var rdata = o.GetRow({row:currRow});
				var currLevel = rdata[colId];
				var rowIndex  = -1;
				var srcIndex  = -1;
				var tgtIndex  = -1;


				
				if(p.direction == "U"){
					
					try {
						
						var currData  = getDirection(currRow,colId,cv.items);
						var destData  = getDirection(currRow,colId,cv.items,"U");

						//같은 레벨의 범위가 넘어갈 경우 멈춘다.
						if(destData.isStop){
							return null;
						}
						
						moveIndex = (function(i){return i;})(destData.rowIndex);
						srcIndex = currRow;
						tgtIndex = moveIndex;
						for (var i = currRow ; i < currData.rowIndex; i++) {
					
							cv.items.move(i,moveIndex)
							fg.rows.move(i,moveIndex)										
							moveIndex++;
						}
					
					} catch (e) {
						console.log("더이상  위로 올라갈게 없을때 애러남");
					}

				}else if(p.direction == "D"){
					
					try {
					
						var currData  = getDirection(currRow,colId,cv.items);
						
						//같은 레벨의 범위가 넘어갈 경우 멈춘다.
						if(currData.isStop){
							return null;
						}
						
						var destData  = getDirection(currData.rowIndex,colId,cv.items);
						
						moveIndex = (function(i){return i;})(destData.rowIndex-1);
						srcIndex = currRow;
						tgtIndex = moveIndex+1;
						
						for (var i = currRow; i < currData.rowIndex; i++) {
					
							if(currRow<=currData.rowIndex){
								cv.items.move(currRow,moveIndex);
								fg.rows.move(currRow,moveIndex);									
							}		
							tgtIndex--;
						}
					
						if(tgtIndex< 0){
							throw "더이상  아래로 내려갈게 없을때 애러남";
						}
					} catch (e) {
						console.log("더이상  아래로 내려갈게 없을때 애러남");
						return null;
					}

				}
				
				fg.refresh();	
				fg.select(tgtIndex, 1);								

				return [tgtIndex,srcIndex];

			},
			DownloadExcelSample : function(id, name) {

				var $form = null;
				if ($("#_ExcelSampleForm").length == 0) {
					$form = $("<form id='_ExcelSampleForm' />")
					.append("<input type='hidden' name='sample_id'>")
					.append("<input type='hidden' name='sample_name'>");
					$form.attr({
								action : "/common/downExcelSample.action",
								method : "post"
							});
					$form.appendTo('body');
				} else {
					$form = $("#_ExcelSampleForm");
				}
				;
				$form.find("input[name=sample_id]").val(id);
				$form.find("input[name=sample_name]").val(name);
				$.form($form).submit({
					iframe : true
				});
				$.form($form).run(false);

			},
			ChangeCellProperties : function(p) {

				var row = p.row;
				cellbuttons[row + "_" + p.id] = p.button;
				// cell의 컨텐츠를 변경해주도록 하자...
				fg.refresh();

			},
			MergeGroupAddRow : function(p){
				setMergeCell(p);
			}
		// ShowCalendar: function(cell) {},
		/*
		 * End: function(message) { alert(message); },
		 */
		});

		o["cv"] = function(){
			return cv;
		};
		return o;
	};
})(jQuery);