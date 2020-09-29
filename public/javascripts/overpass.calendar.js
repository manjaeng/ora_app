(function ($) {
	$.fn.showCalendar = function(p) {
		p = $.extend({ fn: null, grid: false, left: -1, top: -1, offy: 0, offx: 0, center: false, fixed: false, clickcheck: true, callback:function(){}, hour:null }, p || {});
		
		var layer = null;
		var buttons = [];
		var calendars = [];
		
		//A:한개, B:두개(시작 ~ 종료)
		var type = this.length == 1 ? "A" : "B"  ;
		p.type = type;
		
		var div = null;
		var hour = p.hour;
		var minute = null;
		
		this.each(function(i, button) {
			buttons.push(button);
			if (hour == null) {
				if ($(button).next("span").find("input").eq(0).length > 0) {
					hour = true;
				} else {
					hour = false;
				};
				if (hour) {
					if ($(button).next("span").next("span").find("input").eq(0).length > 0) {
						minute = true;
					} else {
						minute = false;
					};
				};
			};
		});
		
		var createCalendar = function(button) {
			calendars = [];	//초기화
			var id = "_CALENDAR_";
			$("#" + id).remove();
			var position = button.offset();
			var left = p.left >= 0 ? p.left : position.left ;
			var top = p.top >= 0 ? p.top : position.top + button.height() ;
			div = $("#" + id);
			div = $("<div id=\"" + id + "\"></div>").addClass( type == "B" ? "calendar2_wrap" : "calendar_wrap" ).append("<div class=\"" + (type == "B" ? "calendar_col" : "calendar") + "\"></div>").css({
				display: "none"
			});
			if (type == "B") {
				div.find("div.calendar_col").append(
					"<div class=\"btn\"><button type=\"button\" class=\"close\" >" + fnGetI18nMessge("M.common.btn.닫기") +"</button></div>" + 
					"<div class=\"calendar\"></div><div class=\"calendar\"></div>" +
					"<div class=\"pop_btns\"><button type=\"button\" class=\"button_chk\" >" +
					"<span>"+ fnGetI18nMessge("M.common.btn.확인") +"</span></button>&nbsp;&nbsp;&nbsp;&nbsp;" +
					"<input type=\"checkbox\" id=\"end_date_checkbox\">&nbsp;"+ fnGetI18nMessge("M.common.calendar.종료일지정안함") +"&nbsp;&nbsp;&nbsp;&nbsp;"+
					"<input type=\"checkbox\" id=\"today_checkbox\">&nbsp;"+ fnGetI18nMessge("M.common.calendar.오늘") +"</div>"
				);
			};
			div.find("div.calendar").each(function(id) {
				var button = $(buttons[id]);
				var yyyymmdd = button.prev("span").find("input").eq(0).val();
				var date = new Date(yyyymmdd.replace(/-/g, "/"));
				if (isNaN(date)) {						
					date = new Date();
				};				
				var calendar = $(this);
				calendar["date"] = date;
				calendars.push(calendar);
				
				if (type == "A") {
					calendar.append("<div class=\"btn\"><button type=\"button\" class=\"close\" >" + fnGetI18nMessge("M.common.btn.닫기") +"</button></div>");
				};
				var div = $("<div class=\"date\"></div>");
				div.append("<button type=\"button\" class=\"prev\">" + fnGetI18nMessge("M.common.calendar.이전달") +"</button>");
				div.append("<input maxlength=\"4\" style=\"display: none; width: 51px; height: 16px;\" >");
				div.append("<select id=\"years" + id + "\" name=\"years" + id + "\"></select><label for=\"years" + id + "\">" + fnGetI18nMessge("M.common.calendar.년") +"</label>");
				div.append("<select id=\"months" +  id+ "\" name=\"months" + id + "\"></select><label for=\"months" + id + "\">" + fnGetI18nMessge("M.common.calendar.월") +"</label>");
				div.append("<button type=\"button\" class=\"next\">" + fnGetI18nMessge("M.common.calendar.다음달") +"</button>");
				div.find("select").eq(1).each(function() {
					for (var i = 1 ; i <= 12 ; i++) {
						$(this).append("<option value=\"" + i.zf(2) + "\" >" + i.zf(2) + "</option>");	
					};
				});
				calendar.append(div);
				var table = $("<table cellspacing=\"0\"  class=\"tbl\" summary=\"" + fnGetI18nMessge("M.common.calendar.달력요일일") +"\"></table>");
				table.append("<caption>달력</caption>");
				table.append("<thead><tr><th>" + fnGetI18nMessge("M.common.calendar.일요일") +"</th><th>" + fnGetI18nMessge("M.common.calendar.월요일") +"</th><th>" + fnGetI18nMessge("M.common.calendar.화요일") +"</th><th>" + fnGetI18nMessge("M.common.calendar.수요일") +"</th><th>" + fnGetI18nMessge("M.common.calendar.목요일") +"</th><th>" + fnGetI18nMessge("M.common.calendar.금요일") +"</th><th>" + fnGetI18nMessge("M.common.calendar.토요일") +"</th></tr></thead>");
				table.append("<tbody></tbody>");
				table.find("tbody").each(function() {
					var tbody = $(this);
					for (var i = 0 ; i < 6 ; i++) {
						tbody.append("<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");
					};
				});
				calendar.append(table);
				if (hour) {
					calendar.append("<div class=\"time\"><select id=\"hours" + id + "\" name=\"hours" + id + "\"></select><label for=\"hours" + id + "\">"+ fnGetI18nMessge("M.common.calendar.시") +"</label><select id=\"minutes" + id + "\" name=\"minutes" + id + "\"></select><label for=\"minutes" + id + "\">"+ fnGetI18nMessge("M.common.calendar.분") +"</label></div>");	
				};
				if (type == "A" && hour) {
					calendar.append("<button type=\"button\" class=\"button_gray\"><span>" + fnGetI18nMessge("M.common.btn.확인") +"</span></button>");
				};
				calendar.find("select").eq(2).each(function() {
					var hours = $(this);
					for (var i = 0 ; i < 24 ; i++) {
						hours.append("<option value=\"" + i.zf(2) + "\" >" + i.zf(2) + "</option>");
					};
				});
				calendar.find("select").eq(3).each(function() {
					var minutes = $(this);
					for (var i = 0 ; i <= 5 ; i++) {
						minutes.append("<option value=\"" + (i * 10).zf(2) + "\">" + (i * 10).zf(2) + "</option>");
						if (i == 4) {
							minutes.append("<option value=\"49\">49</option>");
						}
					};
					minutes.append("<option value=\"59\">59</option>");
				});
				var years = calendar.find("select").eq(0);
				var months = calendar.find("select").eq(1);
				var input = years.prev().keyup(function() {
					this.value = $.trim(this.value);
					if ($.isNumeric(this.value) !== true) {
						this.value = "";
					};
					if (this.value.length == 4 && (this.value < 2000 || this.value > 2999)) {
						alert("2000년에서 2999년 사이를 입력하세요");
						this.value = "";
						return false;
					};					
					if (this.value.length == 4) {
						load(calendar, new Date(this.value + "/" + months.val() + "/1"));
					};
				});
				years.change(function() {
					if (this.value != "") {
						load(calendar, new Date(years.val() + "/" + months.val() + "/1"));						
					} else {	//직접입력
						input.show().focus();
						years.hide();
					};
				});
				months.change(function() {
					load(calendar, new Date(years.val() + "/" + months.val() + "/1"));						
				});
				calendar.find("button.prev").click(function() {
					load(calendar, new Date(years.val() + "/" + months.val() + "/1"), -1);	
				});
				calendar.find("button.next").click(function() {
					load(calendar, new Date(years.val() + "/" + months.val() + "/1"), 1);	
				});
				var hour_val = button.next("span").find("input").eq(0).val();
				var minute_val = button.next("span").next("span").find("input").eq(0).val();
				if (id == 1) {
					if (hour &&  hour_val == "undefined" || hour_val == "") {
						hour_val = "23";
					};
					if (minute && minute_val == "undefined" || minute_val == "") {
						minute_val = "59";
					};
				};
				calendar.find("select").eq(2).val(hour_val);
				calendar.find("select").eq(3).val(minute_val);
				calendar.find();
				load(calendar, date);
			});
			div.find("button.close").click(function() {	  //닫기 버튼 클릭시 캘린더 제거
				div.remove();
			});
			div.find("button.button_gray, button.button_chk").click(function() {
				confirm();
			});
			div.find("#end_date_checkbox, #today_checkbox").click(function() {
				if (this.id == "end_date_checkbox") {
					div.find("#today_checkbox").attr({
						checked: false
					});
				} else if (this.id == "today_checkbox") {
					div.find("#end_date_checkbox").attr({
						checked: false
					});
				};
			});
			div.append("<iframe title=\""+ fnGetI18nMessge("M.common.실버라이트용") +"\"></iframe>");
			div.appendTo("body");
			
			if (p.center) {
				left = (document.body.scrollWidth)/2 - div.width()/2;
				top = (document.documentElement.clientHeight)/2 - div.height()/2;
			} else if (!p.fixed) {
				if (div.width() + left >= $(window).width()) {
					left = left - div.width() + p.offx ;
				};
				
				if (div.height() + top >= $(window).height()) {
					top = top - div.height() + p.offy ;
				};
			};
			div.css({
				display: "block",
				position: "absolute",
				top: top,
				left: left
			});
			div.click(function(e) {
				e.stopPropagation();
			});
			$(":input", div).click(function(e) {
				e.stopPropagation();
			});
			if (p.clickcheck) {
				$(document).click(function() {
					div.hide();
					div.remove();
				});								
			};
			div.show();
		};
		
		var load = function(calendar, date, amount) {		//날짜 정보를 달력에 load 한다.
			var amount = amount || 0 ;
			var years = calendar.find("select").eq(0);
			var months = calendar.find("select").eq(1);
			var input = years.prev();
			$.ajax({
				url: "/calendar.action",
				dataType: "json",
				data: { yyyymm: date.format("yyyyMM"), amount: amount },
				async: false,
				success: function(data) {
					calendar.find(".today").removeClass("today");
					years.each(function() {
						this.options.length = 0;	//이것을 안해주면 정확히 셋팅이 안됨?
					});
					$.each(data.YEARS, function(i, year) {
						years.append("<option value=\"" + year + "\">" + year + "</option>");
					});
					years.append("<option value=\"\">입력</option>");
					years.val(data.YYYY);
					months.val(data.MM);
					if (years.is(":visible") !== true) {
						years.show();
						input.hide().val("");
					};
					var days = data.DAYS;
					calendar.find("tbody > tr > td").each(function(i) {
						var td = $(this);
						td.empty();
						if (days[i] != "") {
							var ymd = new Date(data.YYYY + "/" + data.MM + "/" + days[i]);
							if (calendar.date.format("yyyyMMdd") == ymd.format("yyyyMMdd")) {
								td.addClass("today");
							};
							var a = $("<a href=\"#\" onclick=\"return false;\" >" + days[i] + "</a>").click(function() {
								calendar.date = ymd;
								calendar.find(".today").removeClass("today");
								td.addClass("today");
								if (type == "A" && !hour) {
									confirm();
								};
							});
							td.append(a);
						};
					});
				}
			});
		};
		
		var confirm = function() {
			$.each(calendars, function(i, calendar) {
				var hour_val = calendar.find("select").eq(2).val();
				var minute_val = calendar.find("select").eq(3).val();
				var second_val = "00" ;
				if (i == 1 && hour) {
					second_val = "59";
				};
				if ($.type(hour_val) == "undefined") {
					hour_val = "00";
				};
				if ($.type(minute_val) == "undefined") {
					minute_val = "00";
				};
				calendar.date.setHours(hour_val);
				calendar.date.setMinutes(minute_val);
				calendar.date.setSeconds(second_val);				
			});
			
			if (calendars.length == 2) {
				div.find("#end_date_checkbox").each(function() {
					if (this.checked) {
						calendars[1].date = new Date("2999/12/31");
						if (hour || minute) {
							calendars[1].date.setHours("23");
							calendars[1].date.setMinutes("59");
							calendars[1].date.setSeconds("59");
						};
					};
				});
				div.find("#today_checkbox").each(function() {
					if (this.checked) {
						calendars[1].date = new Date();
						if (hour || minute) {
							calendars[1].date.setHours("23");
							calendars[1].date.setMinutes("59");
							calendars[1].date.setSeconds("59");
						};
					};
				});
				
				if (hour || minute) {
					if (calendars[0].date.format("yyyyMMddHHmm") >= calendars[1].date.format("yyyyMMddHHmm")) {
						alert(fnGetI18nMessge("M.common.message.시작일시가종료일시보다크거나같습니다"));
						return;
					};
				} else {
					if(calendars[0].date.format("yyyyMMddHHmm") > calendars[1].date.format("yyyyMMddHHmm")) {
						alert(fnGetI18nMessge("M.common.message.시작일이종료일보다큽니다"));
						return;
					};
				};			
			};
			
			if (p.fn != null) {
				if (calendars.length == 2) {
					p.fn(calendars[0].date, calendars[1].date);	
				} else {
					p.fn(calendars[0].date);
				};
			} else {
				$(buttons).each(function(i, button) {
					$button = $(button);
					$button.prev("span").find("input").eq(0).val(calendars[i].date.format("yyyy-MM-dd"));					
					$button.next("span").find("input").eq(0).val(calendars[i].date.format("HH"));
					$button.next("span").next("span").find("input").eq(0).val(calendars[i].date.format("mm"));
					
					if ($.type($button.attr("field_id")) == "string") {
						var hidden = null;	
						var format = $.type($button.attr("format")) == "string" ? $button.attr("format") : "yyyy-MM-dd HH:mm:ss";
						
						if ($("#" + $button.attr("field_id")).length == 0) {
							hidden = $("<input type='hidden' id='" + $button.attr("field_id") + "' name='" + $button.attr("field_id") + "' />");
							$button.append(hidden);
						} else {
							hidden = $("#" + $button.attr("field_id"));
						};
						hidden.val(calendars[i].date.format(format));								
					};
				});
			};
			div.remove();
			p.callback();
		};
		
		$(buttons).each(function() {
			var button = $(this);	//달력버튼
			if (p.grid) {	//그리드 요청
				if (layer == null) {
					createCalendar(button);
				};
			} else {
				button.click(function(e) {
					e.stopPropagation();	//지우지 말아라...
					createCalendar(button);
				});				
			};
		});
	};
})(jQuery);