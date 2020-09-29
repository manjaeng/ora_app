﻿﻿﻿﻿﻿﻿(function($) {
	grid_map = {};	//중복ID가 존재하는지 검사

	var GM = null;	//그리드 메세지
	OVERPASS.GRID.MESSAGE = null;
	OVERPASS.GRID.COLUMNSID = {};	//그리드 컬럼값
	$.ajax({	//공통메세지 파일 load
		url: "/common/js/base/i18n/locale.js",
		dataType: "script",
		async: false,
		complete: function() {
			if ($.type(OVERPASS.GRID.MESSAGE) == "object") {
				GM = OVERPASS.GRID.MESSAGE;
				OVERPASS.GRID.MESSAGE = null;
			};
		},
		error: function() {}
	});
	
	
	if(!OVERPASS.language){
		OVERPASS.language = "kr";
	}
	
	$.ajax({	//locale별 메세지 파일 load
		url: "/common/js/base/i18n/locale_" + OVERPASS.language + ".js",
		dataType: "script",
		async: false,
		complete: function() {
			if ($.type(OVERPASS.GRID.MESSAGE) == "object") {
				GM = $.extend(true, GM, OVERPASS.GRID.MESSAGE);
			};
		},
		error: function() {}
	});

	//상수정의
	DATATYPE = {
		TEXT: "T",
		NUMBER: "N",
		DATE: "D",
		COMBO: "C",
		CHECKBOX: "B",
		LEVEL: "L",
		FILE: "F",
		IMAGE: "I",
		HTML : "HT",
		HIDDEN: "H",
		TEXT_DATE: "TD"
	};

    //그리드 설정값에 대한 유효성 검사
    var checkGrid = function (pin) {
        var chk = {};
        for (var i = 0; i < pin.columns.length; i++) {
            var column = pin.columns[i];
            if (typeof (column["id"]) == "undefined" || column["id"] == null || $.trim(column["id"]) == "") {
                alert(GM.invalid_column_id);
                return false;
            };
            if (typeof (chk[column["id"]]) == "undefined" || chk[column["id"]] == null) {
                chk[column["id"]] = column["id"];
            } else {
            	alert(GM.dup_column_id.format(column["id"]));
                return false;
            };
        };
        return true;
    };

    setColumns = function(pin) {
    	var columns = pin.columns;
    	var level_yn = false;
    	var combos = {};    	
    	$.each(columns, function (i, column) {
        	columns[i] = setColumn(pin, column);
        	OVERPASS.GRID.COLUMNSID[column.id] = column;
        	if (column.type == "L") {
        		level_yn = true;
        	};
        	if (column.type == "C") {
        		combos[column.id] = { idx: i, column: column };        		
        	};
        });
    	if (level_yn) {	//레벨형 트리라면... sort 되게 하지 말자!!!
    		$.each(columns, function (i, column) {
            	column.sort = false;
            });
    	};
    	//콤보 컬럼 처리
    	(function() {
    		var comm_cds = [];
    		$.each(combos, function(id, info) {
    			var combo_column = info.column;
    			var p = combo_column.combo || [];
    			if ($.type(p) == "string") {	//공통코드 대분류로 조회(일괄로 조회될 수 있도록)
    				comm_cds.push(combo_column.combo);
    			} else if ($.type(p.action) == "string") {	//사용자 지정 action으로 조회
    				columns[info.idx].combo = [];
    				if ($.type(p.cd) == "undefined" || $.type(p.name) == "undefined") {
    					alert(GM.invalid_combo);    					
    				} else {
    					$.ajax({
    						url: (p.action == "undefined" ? "/system/code/searchStCommCdDtlList.action" : p.action),
    	    				dataType: "json",
    	    				data: $.extend({ method: "json" }, p.params || {}),
    	    				async: false,
    	    				success: function(data) {
    	    					$.each(data, function(idx, cd_dtl) {
    	    						columns[info.idx].combo.push({ key: cd_dtl[p.cd], value: cd_dtl[p.name] });
    	    					});
    	    				}
        				});    					
    				};
    			} else if ($.type(p) != "array") {
    				var arr_combo = [];
    				$.each(p, function(key, value) {
    					arr_combo.push({
    						key: key,
    						value: value
    					});
    				});
    				columns[info.idx].combo = arr_combo;
    			};
    		});
    		if (comm_cds.length > 0) {
    			$.ajax({
    				url: "/system/code/searchStCommCdDtlList.action",
    				dataType: "json",
    				data: { comm_cd: comm_cds, use_yn: "Y", method: "json" },
        			async: false,
        			success: function(data) {
        				var combo_pool = {};
        				$.each(data, function(idx, cd_dtl) {
        					var comm_cd = cd_dtl.comm_cd;
        					var cd_nm = cd_dtl.cd_nm;
        					var comm_dtl_cd = cd_dtl.comm_dtl_cd;
        					if ($.type(combo_pool[comm_cd]) != "array") {
        						combo_pool[comm_cd] = [];
        					};
        					combo_pool[comm_cd].push({ key: comm_dtl_cd, value: cd_nm });
        				});
        				$.each(combos, function(id, info) {
        					if ($.type(columns[info.idx].combo) == "string") {
        						columns[info.idx].combo = combo_pool[columns[info.idx].combo];
        					};
        				});
        			}
    			});
    		};
    	})();
    	return columns;
    };
    
    getCombo = function(p) {
    	var combo = [];
    	if ($.type(p) == "string") {	//공통코드 대분류로 조회
			var comm_cd = p;
			p = {};
			p.action = "/system/code/searchStCommCdDtlList.action";
			p.cd = "comm_dtl_cd";
			p.name = "cd_nm";
			p.params = { comm_cd: comm_cd, use_yn: "Y", method: "json" };
		} else if ($.type(p.action) == "string") {	//사용자 지정 action으로 조회
			if ($.type(p.cd) == "undefined" || $.type(p.name) == "undefined") {
				alert(GM.invalid_combo);
				return false;
			};
			p.params = $.extend({ method: "json" }, p.params || {});
		};		
		if ($.type(p.action) == "string") {
			p.params = $.extend({ gridYn: "Y" }, p.params || {});
			
			$.ajax({
    			url: p.action,
    			dataType: "json",
    			data: p.params,
    			async: false,
    			success : function(data) {
    				$.each(data, function(idx, cd_dtl) {
    					combo.push({
    						key: cd_dtl[p.cd],
    						value: cd_dtl[p.name]
    					});
    				});
    			}
    		});
		} else {
			combo = p;
		};
		if ($.type(combo) != "array") {
			var arr_combo = [];
			$.each(combo, function(key, value) {
				arr_combo.push({
					key: key,
					value: value
				});
			});
			combo = arr_combo;
		};
		return combo;
    };

    setColumn = function(pin, column) {
    	column = $.extend({
    		//컬럼 기본 속성
    		header: column.id,
    		binding: column.id,
    		editable: pin.properties.editable,
    		sort: pin.properties.sort,
    		index: -1,
    		width: 120,
    		type: "T",
    		prefix: "",
    		suffix: "",
    		combo: [],
    		visible: true,
    		system: false,
    		number: true,
    		merge: false,
    		checkbox: false,
    		underline : false,
    		required: false,
    		button: false,
    		domain: "",
    		default_value : "",
    		maxlength: 100,
    		frozen: false,
    		filter: ""
    	}, column);

    	if ($.type(column.default_value) != "string") {
    		column.default_value = column.default_value + "";
    	};

    	if ($.type(column.maxlength) != "number") {
    		column.maxlength = parseInt(column.maxlength, 10);
    	};

    	if (column.type == "N") {
    		column.align = column.align || "right" ;
    		column.format = column.format || "N0" ;
    	} else if (column.type == "D") {
    		column.align = column.align || "center" ;
    		column.format = column.format || "yyyy-MM-dd HH:mm:ss" ;
    		column.calendar = $.extend({
    			hour: false,
    			minute: false
        	}, column.calendar || {});
    	} else if (column.type == "TD") {
    		column.align = column.align || "center" ;
    		column.format = column.format || "####-##-##"; // wijmo grid에서 TD 타입일 경우에 format에따라 시분 까지 출력 할 수 있도록 한다. -- 2017-04-12 장진철
    		column.calendar = $.extend({
    			hour: false,
    			minute: false,
    			event_yn: false
        	}, column.calendar || {});
    	} else if (column.type == "B") {	//체크박스 컬럼
    		column.align = column.align || "center" ;
    	} else if (column.type == "L") {	//레벨 컬럼
    		column.editable = false;
    		pin.properties.level = true;
    		pin.properties.level_id = column.id;
    	} else if (column.type == "F") {
    		pin.properties.multipart = true;
    	};

    	//type별 기본값 셋팅
    	column.align = column.align || "left" ;
    	column.valign = column.valign || "center" ;
		column.format = column.format || "" ;

    	if (column.merge) {
    		pin.properties.merge = true;
    	};
    	if (pin.properties.merge || pin.calculations.length > 0 || pin.groupcolumns.length > 0  || $.type(pin.grouptotal) == "object") {	 //merge/group의 경우 sort 안됨...
    		column.sort = false;
    	};
    	if (column.editable) {
    		pin.properties.checkbox = true;
    	};
    	return column;
    };

    getPagedBox = function(div_id, name) {	//페이징 selectbox 찾기
    	var select = null;
    	$("#" + div_id).parent().each(function() {
    		var p = null;
        	if ($(this).attr("class") == "grid") {
        		p = $(this);
        	} else {
        		p = $(this).parent();
        	};
        	if (p != null) {
        		p.find("select[name=" + name + "]").each(function() {
        			select = this;
        		});
        	};
        });
    	return select;
    };

    setTotalCount = function(div_id, count) {	//조회 갯수 셋팅하기
    	$("#" + div_id).parent().each(function() {
    		var tot = null;
        	if ($(this).attr("class") == "grid") {
        		tot = $(this);
        	} else {
        		tot = $(this).parent();
        	};
        	if (tot != null) {
        		tot.find("h3 > em").each(function() {
        			this.innerHTML = "(" + GM.total + " " + toCurrency(count) + "" + GM.count + ")";
        		});
        	};
        });
    };

	$.fn.createGrid = function (pin) {
		if (this.length === 0) {
			return null;
		};
		var div = this[0];
		var o = {};	//실제 리턴될 객체
		var g = null;	//생성된 그리드 객체

		pin = $.extend({
			//그리드 기본속성
			GM : GM,
			grid_type: OVERPASS.GRID.type,
			id: "grid_" + div.id,
			div_id:div.id,
			events: {},
			columnheaders:[],
			grandtotal:false,
			calculations:[],
			groupcolumns:[],
			server_url: OVERPASS.server_port && OVERPASS.server_port != 80 ? window.location.protocol + "//" + window.location.hostname + ":" + OVERPASS.server_port : window.location.protocol + "//" + window.location.hostname 
		}, pin);

		var grid_type = pin.grid_type;

		if ($.type(pin.grouptotal) == "object") {
			pin.grouptotal = $.extend({ description: "", align: "left" }, pin.grouptotal);
		};

        pin.properties = $.extend({
        	//그리드 속성 기본값
        	form: [],
        	width: "100%",
			height: "100%",
        	headerlines: 1,
        	receiver: false,
        	editable: false,
        	sort: true,
        	checkbox: false,
        	hide_checkbox: false,	//이유야 어찌되었든 제1열의 checkbox를 무조건 숨긴다.
        	rows: [10, 20, 30],
        	page_range: 10,
        	min_row_height: 24,
        	level: false,
        	level_id: "",
        	multipart: false,
        	dupcheck: true,
        	endsave: true,
        	clipboard_copy: false,	//클립보드 복사 여부
        	excel_import_url : "", //엑셀 import를 서버에서 처리할 경우.
        	excel_import: false,
        	excel_header: null,
        	excel_export: (OVERPASS.prsn_srch_auth_cd == "90" ? true : false), // 개인정보 관리 화면인 경우 엑셀다운로드 금지
        	excel_export_name: null,
        	excel_sample: true,
        	sample_id : "",
        	sample_name: "",
        	page_change: null,
        	close_layer: true,
        	row_drag : false,         //row 드레그 여부
        	row_drag_target : "",      //row 드레그시 이동할 element id
        	before_group_row_add : false,	  // 사용자가 임의로 작성한 그룹 row 추가여부
        	dataAsync : false,          //데이터를 비동기로 가져오는 옵션.
        	selection_mode : "",         //그리드 컬럼 내용을 마우스로 드래그 하여 선택 할 수 있게 하는 옵션.
        	autoRowResize : false    // wijmo 그리드에서 text내용에 맞춰 row길이가 자동적으로 변하게 하는 옵션. 기본은 false이다.
        }, pin.properties||{});
        pin.properties.id = pin.id;

//        if (grid_type == OVERPASS.GRID.JQGRID.type) {		//모바일 기기에서는 데이타 조회건수를 줄여주자.. 성능에 지대한 영향을 생긴다.
//        	pin.properties.rows = [10, 20, 30];
//        };

        if (pin.properties.dupcheck && grid_map[div.id]) {
			alert(GM.dup_grid_id);
			return false;
		} else {
			grid_map[div.id] = div.id;
		};

        if (pin.properties.excel_import && pin.properties.excel_sample) {
        	if ($.trim(pin.properties.sample_id) == "") {
        		alert(GM.invalid_excel_sample_id);
        		return;
        	};
        	if ($.trim(pin.properties.sample_name) == "") {
        		alert(GM.invalid_excel_sample_name);
        		return;
        	};
        };

        pin.utilities = $.extend({

        }, pin.utilites || {});

        if (!checkGrid(pin)) {  //그리드 유효성 검사
            return false;
        };

        pin.columns = setColumns(pin);	//컬럼 셋팅

        //calculations
        $.each(pin.calculations, function(i, calculations) {	//group  기본값 셋팅
        	pin.calculations[i] = $.extend({ mode: "SUM", prefix: "", suffix: "", format: "N0" }, calculations);
        });

        //groupcolumns
        $.each(pin.groupcolumns, function(i, groupcolumn) {
        	pin.groupcolumns[i] = $.extend({ id: "", format: "", ids: [], align: "left" }, groupcolumn);
        });

       
        //멀티헤더속성
        if (pin.columnheaders.length > 0) {
        	pin.properties.headerlines = pin.columnheaders.length + 1;
        	var hp = {};	//헤더 정보를 담고 있는 객체pool
        	$.each(pin.columnheaders, function(i, chs) {
        		$.each(chs, function(j, ch) {
        			hp[i + "_" + ch.id] = ch;
        		});
        	});
        	var columnheaders = [];
        	var addheader = function(idx, hs) {
        		columnheaders.push(hs);
        		if (pin.columnheaders[idx]) {
        			var headers = [];
        			$.each(hs, function() {
        				if (this.parent) {
        					headers.push(hp[idx + "_" + this.parent]);
        				} else {
        					headers.push(this);
        				};
        			});
        			addheader(idx + 1, headers);
        		};
        	};
        	var headers = [];
        	$.each(pin.columns, function() {
        		headers.push({ header: this.header, id: this.id, parent: this.parent });
        	});
        	addheader(0, headers);
        	pin.columnheaders = columnheaders;
        };
        
        //멀티헤더속성(headerlines 적용시)
        if (pin.columnheaders.length == 0 && pin.properties.headerlines > 1) {

        	var columnheaders = [];
        	var addheader = function(idx, hs) {
        		columnheaders.push(hs);
        		if (pin.properties.headerlines > idx ) {
        			var headers = [];
        			$.each(hs, function() {
        				if (this.parent) {
        					headers.push(this.parent); // 객체로 넘기지 않고 컬럼명으로 넘긴다. Flexgrid에서 멀티헤더 설정시 객체가 안넘어오면 컬럼명으로 대입.
        				} else {
        					headers.push(this);
        				};
        			});
        			addheader(idx + 1, headers);
        		};
        	};
        	var headers = [];
        	$.each(pin.columns, function() {
        		headers.push({ header: this.header, id: this.id, parent: this.parent });
        	});
        	addheader(1, headers);
        	pin.columnheaders = columnheaders;

        };
        

        var def = {
        		action:pin.properties.action,
        		form:pin.properties.form,
        		params:{},
        		mode:"Q",
        		cud:["C", "U", "D"],
        		group:[],
        		save: false,
        		checked: false,	//CRUD에 상관없이 checked된 row만 넘김
        		check_binding: ""
        };

        //서버 전송전 필요한 값들을 셋팅한다.
        var make = function(p, grid) {
        	var parameters = [];	//서버로 전송될 form, 사용자 지정 값들... URI인코딩 하여 배열 형태로 전달한다.
        	var caller = arguments.callee.caller.caller.caller;

        	if (typeof p.action == "undefined" || p.action == null || p.action == "") {
        		alert(GM.invalid_action);
        		return false;
        	};
        	if ($.type(p.parameters) != "array") {
            	var addParameter = function(k, v) {
                	if ($.type(k) != "object" || k.serialize() != "") {
                    	if ($.type(k) == "string") {
                    		if ($.type(v) == "array") {
                    			$.each(v, function() {
                    				parameters[parameters.length] = k + "=" + encodeURI(this);
                    			});
                    		} else {
                    			parameters[parameters.length] = k + "=" + encodeURI(v);
                    		};
                    	} else if ($.type(k) == "object") {
                    		$.each(k.serializeArray(), function(idx, input) {
                    			parameters[parameters.length] = input.name + "=" + encodeURI(input.value);
                    		});
                    	};
                	};
                };

                $.each(p.params, function(k, v) {
                	addParameter(k, v);
            	});
                if (!$.isArray(p.form)) {
            		p.form = [p.form];
            	};
            	try {
            		$.each(p.form, function(i, form) {
                		if ($.type(form) ==  "string") {
                			addParameter($("#" + form));
                		} else if ($.type(form) ==  "object") {
                			form = $.extend({ exclusive: false }, form);
                			if (form.exclusive) {
                				var exclusive_yn = false;
                				//exclusive로 체크된 박스가 있는지 확인한다.
                				$("#" + form.id).find("input:checked").each(function() {
                					if ($.type($(this).attr("exclusive")) != "undefined") {
                						exclusive_yn = true;
                						$.each($(this).attr("exclusive").split("|"), function() {
                							$("#" + form.id).find("#" + this).each(function() {
                								if (this.value == "") {
                									this.focus();
                									throw GM.invalid_value;
                								};
                								addParameter(this.name, this.value);
                							});
        								});
                					};
        						});
                				if (!exclusive_yn) {
                					addParameter($("#" + form.id));
                				};
                			} else {
                				addParameter($("#" + form.id));
                			};
                		};
                	});
            	} catch (message) {
            		alert(message);
            		return false;
            	};
            	p.parameters = parameters;
            } else {
            	p.parameters = p.parameters;
            };
            if (caller != null && caller.arguments.length > 0) {	//클릭된 버튼 정보를 한번 알아보자.
        		if (caller.arguments[0] != "FlexGrid.Scriptable.ScriptableCell") {
        			var button = $(caller.arguments[0].target);	   //버튼 이라면.... 권한 확인하자...
        			if (button.attr("disabled") == "disabled") {	//김수희 요청(버튼이 disable 상태인 경우 keypress등으로 DoQuery를 호출하는 경우가 있음)
        				return false;
        	        };
        			var auth_cd = button.attr("auth_cd");
        			var auth_divi_cd = button.attr("auth_divi_cd");
        			var auth_dist = button.attr("auth_dist");
        			var prsn_auth_cd = button.attr("prsn_auth_cd");
        			var msg = button.attr("msg");
        			if ($.type(auth_dist) == "string") {
        				parameters[parameters.length] = "auth_dist=" + auth_dist;
        			};
        			if (auth_divi_cd == "30") {	  	//출력요청
        				alert(msg);
        				if (auth_cd == "10") {
        					var action_nm = p.action;
            				var header_info = JSON.stringify(pin.columns);
            				$.each(parameters, function(i, parameter) {
            					if (parameter.indexOf("rows_per_page=") == 0) {
            						parameters[i] = "rows_per_page=1000000";
            						return false;
            					};
            				});
                    		var sel_cond = JSON.stringify(parameters);
                    		fnPreReqForForm({
                    			method: "post",
                    			params: {
                    				action_nm: action_nm,
                    				auth_dist: auth_dist,
                    				header_info: header_info,
                    				sel_cond: sel_cond,
                    				request_uri: _request_uri
                    			}
                    		});
        				};
        				return false;
        			}

        			if(prsn_auth_cd != undefined && prsn_auth_cd != ""){
        				var action_nm = p.action;
        				var header_info = JSON.stringify(pin.columns);

        				var sel_cond = JSON.stringify(parameters);
        				
        				_prsnParam = { sel_cond : sel_cond, header_info : header_info, action_nm : action_nm };
        			}else{
        				_prsnParam = "";
        			}
        		};
        	};

        	if (p.action.indexOf("http") < 0) {
        		if (OVERPASS.server_port && OVERPASS.server_port != 80) {
        			p.action = window.location.protocol + "//" + window.location.hostname + ":" + OVERPASS.server_port + p.action;
        		}  else {
        			p.action = window.location.protocol + "//" + window.location.hostname + p.action;
        		};
            };
        	return p;
        };

        var runFunction = function(fn, p, def) {		//실버라이트의 경우 비동기적으로 생성되므로 오류 방지
        	if ($.type(fn) != "undefined") {
        		return fn(p);
        	} else {
        		return def;
        	};
        };

        var functions = {
        	DoQuery: function (p) {	//조회
        		var download_form;
            	p = $.extend({ download: false, download_type: "excel" }, def, p || {}, { o: o });	//실제 리턴된 o를 넘겨준다(jqGrid의 경우 columns 정보를 위해 필요함)
            	p.mode = "Q";
            	p.params.scr_prsn_auth_cd = OVERPASS.prsn_srch_auth_cd;	// 화면권한설정
            	$(g.RowsPerPage).each(function() {
            		p.params.rows_per_page = this.value;
            	});
            	p.params.page_idx = p.params.page_idx || 1;		//page_idx 미셋팅시 1로 셋팅(조회 버튼 눌렀을 경우 무조건 1페이지 조회되도록...)
            	
            	if (p.save) {
            		var save = {};
            		save.action = p.action;
            		save.header_info = JSON.stringify(pin.columns);
            		save.sel_cond = JSON.stringify(make(p).parameters);
            		return save;
            	} else if (p.download === true) {	//DoQuery
            		(function() {
            			var dnp = make(p);
                		download({
                			action: dnp.action,
                			download_type: dnp.download_type,
                			download_file_name: dnp.download_file_name,
                    		parameters: (function() {
                    			var parameters = [];
                    			$.each(dnp.parameters, function(p_i, parameter) {
                    				var split = parameter.split("=");
                    				parameters.push({ name: split[0], value: split[1] });
                    			});
                    			return parameters;
                    		})()
                		});	
            		})(); 
            	};
            	
            	if (typeof pin === "object") {
            		if (typeof pin.queryQueue === "undefined") {
            			pin.queryQueue = new Array();
            		}
            		pin.queryQueue.push(p);
            	}
            	runFunction(g.DoQuery, make(p), null);
            },
            DoSave: function(p) {		//INSERT/UPDATE/DELETE 대상 처리 (cud ("C", "U", "D") 지정 가능)
            	p = $.extend({}, def, p || {}, { o: o });		//실제 리턴된 o를 넘겨준다(jqGrid의 경우 columns 정보를 위해 필요함)
            	p.mode = "S";
            	g.DoSave(make(p));
            },
            AddRow: function(p) {
            	p = $.extend({ row: 0, data: {}, sibling: false }, p || {});
            	return g.AddRow(p);
            },
            AddColumn: function(column) {
            	column = $.extend({ index: 1 }, column || {});
            	pin.columns.push(column);
            	if (!checkGrid(pin)) {  //그리드 유효성 검사
                    return false;
                };
            	column = setColumn(pin, column);
            	g.AddColumn(column);
            },
            RemoveColumn: function(p) {
            	p = $.extend({ id: "" }, p || {});
            	var columns = [];
            	var column = null;
            	$.each(pin.columns, function(i, c) {	//제거할 컬럼을 찾는다.
            		if (p.id != c.id) {
            			columns.push(c);
            		} else {
            			column = c;
            		};
            	});
            	pin.columns = columns;
            	if (column != null) {
            		g.RemoveColumn(p);
            	};
            },
            MoveRow: function(p) {
            	p = p || {};
            	if ($.type(p.direction) == "undefined" || (p.direction != "U" && p.direction != "D") ) {
            		alert(GM.invalid_direction);
            		return false;
            	};
            	return g.MoveRow(p);
            },
            CreateCombo: function(p) {
            	g.CreateCombo(p);
            },
            GetRowCount: function(p) {
            	p = p || {};
            	return runFunction(g.GetRowCount, p, 0);
            },
            DeleteCreateRows: function(p) {
            	p = p || {};
            	g.DeleteCreateRows(p);
            },
            DeleteRows: function(p) {
            	p = p || {};
            	g.DeleteRows(p);
            },
            DeleteRow: function(p) {
            	p = p || {};
            	if ($.type(p.row) == "string") {
            		p.row = parseInt(p.row);
            	} else if ($.type(p.row) != "number") {
            		alert(GM.invalid_row_number);
            		return false;
            	};
            	g.DeleteRow(p);
            },
            Restore: function(p) {
            	p = p || {};
            	g.Restore(p);
            },
            GetValue: function(p) {
            	return g.GetValue(p || {});
            },
            GetRow: function(p) {
            	p = p || {};
            	return g.GetRow(p);
            },
            GetRows: function(p) {
            	p = $.extend({ checked: false }, p || {});
            	return g.GetRows(p);
            },
            GetCell: function(p) {
            	p = p || {};
            	return g.GetCell(p);
            },
            HideColumn: function(p) {
            	p = $.extend({ id: "" }, p || {});
            	if (p.id == "") {
            		alert(GM.invalid_column_id);
            		return false;
            	};
            	g.HideColumn(p);
            },
            ShowColumn: function(p) {
            	p = $.extend({ id: "" }, p || {});
            	if (p.id == "") {
            		alert(GM.invalid_column_id);
            		return false;
            	};
            	g.ShowColumn(p);
            },
            SetColumnIndex: function(p) {
            	p = $.extend({ id: "" }, p || {});
            	g.SetColumnIndex(p);
            },
            SetValue: function(p) {
            	if (typeof(p.value) == "undefined") {
            		alert(GM.invalid_set_value);
            		return false;
            	};
            	g.SetValue(p);
            },
            HideRow: function(p) {
            	p = p || {};
            	g.HideRow(p);
            },
            ShowRow: function(p) {
            	p = p || {};
            	g.ShowRow(p);
            },
            ClearRows: function(p) {
            	p = p || {};
            	
            	// 그리드 초기화시 조회 건수 초기화
            	$("#"+g.div_id).parents(".grid").find("em").text("(총 0건)");

            	runFunction(g.ClearRows, p, null);
            },
            CancelEdit: function(p) {
            	p = p || {};
            	g.CancelEdit(p);
            },
            SetEditable: function(p) {
            	g.SetEditable(p);
            },
            ChangeCellType: function(p) {
            	p = $.extend({ format: "" }, p);
            	g.ChangeCellType(p);
            },
            CheckRequired: function(p) {
            	p = p || {};
            	return g.CheckRequired(p);
            },
            SelectRow: function(p) {
            	p = p || {};
            	if ($.type(p.row) == "undefined") {
            		alert(GM.invalid_row_number);
            		return false;
            	};
            	g.SelectRow(p);
            },
            SelectCell: function(p) {
            	p = $.extend({ edit: false }, p);
            	if ($.type(p.row) == "undefined") {
            		alert(GM.invalid_row_number);
            		return false;
            	};
            	if ($.type(p.id) == "undefined") {
            		alert(GM.invalid_column_id);
            		return false;
            	};
            	g.SelectCell(p);
            },
            FilterRow: function(p) {
            	p = $.extend({ keyword: "", id: "" }, p || {});
            	if ($.trim(p.id) == "") {
            		alert(GM.invalid_column_id);
            		return false;
            	};
            	g.FilterRow(p);
            },
            ReplaceColumns: function(p) {
				var columns = [];
				$.each(p.columns, function(i, column) {
					columns.push(setColumn(pin, column));
				});
				p.columns = columns;
            	g.ReplaceColumns(p);
            },
            CheckRow: function(p) {
            	p = $.extend({ row: null, checked: null }, p || {});
            	if ($.type(p.row) != "number") {
            		alert(GM.invalid_row_number);
            		return false;
            	};
            	if ($.type(p.checked) != "boolean") {
            		alert(GM.invalid_checked_value);
            		return false;
            	};
            	g.CheckRow(p);
            },
            ChangeCellProperties: function(p) {
            	p = $.extend({ row: "", id: "" }, p || {});
            	if ($.trim(p.row) == "") {
            		alert(GM.invalid_row_number);
            		return false;
            	};
            	if ($.trim(p.id) == "") {
            		alert(GM.invalid_column_id);
            		return false;
            	};
            	g.ChangeCellProperties(p);
            },
            ChangeCRUD : function(p) {
            	p = $.extend({ row: null, crud: null }, p || {});
            	if ($.trim(p.row) == "") {
            		alert(GM.invalid_row_number);
            		return false;
            	};
            	if (p.crud == null) {
            		alert(GM.invalid_crud);
            		return false;
            	};
            	g.ChangeCRUD(p);
            },
            SearchRow : function(p) {
            	p = $.extend({ keyword: "", id: "" }, p || {});
            	if ($.trim(p.id) == "") {
            		alert(GM.invalid_column_id);
            		return false;
            	};
            	if ($.trim(p.keyword) == "") {
            		alert(GM.invalid_search_value);
            		return false;
            	};
            	g.SearchRow(p);
            },
            CreateSummary: function(p) {
            	p = p || {};
            	g.CreateSummary(p);
            },
            SetBackground: function(p) {
            	p = $.extend({ id: "" }, p || {});
            	if ($.type(p.row) != "number") {
            		alert(GM.invalid_row_number);
            		return false;
            	};
            	if ($.type(p.color) != "string" || $.trim(p.color) == "") {
            		alert(GM.invalid_color);
            		return false;
            	};
            	var rgb = p.color.split("|");
            	if (rgb.length != 3) {
            		alert(GM.invalid_color_info);
            		return false;
            	};
            	try {
            		$.each(rgb, function(i, c) {
                		if (!$.isNumeric(c) || parseInt(c, 10) < 0 || parseInt(c, 10) > 255) {
                			throw GM.invalid_color_info;
                		};
                	});
            	} catch (e) {
            		alert(e);
            		return false;
            	};
            	g.SetBackground(p);
            },
            SetForeground: function(p) {
            	p = $.extend({ id: "" }, p || {});
            	if ($.type(p.row) != "number") {
            		alert(GM.invalid_row_number);
            		return false;
            	};
            	if ($.type(p.color) != "string" || $.trim(p.color) == "") {
            		alert(GM.invalid_color);
            		return false;
            	};
            	var rgb = p.color.split("|");
            	if (rgb.length != 3) {
            		alert(GM.invalid_color_info);
            		return false;
            	};
            	try {
            		$.each(rgb, function(i, c) {
                		if (!$.isNumeric(c) || parseInt(c, 10) < 0 || parseInt(c, 10) > 255) {
                			throw GM.invalid_color_info;
                		};
                	});
            	} catch (e) {
            		alert(e);
            		return false;
            	};
            	g.SetForeground(p);
            },
            CollapseRow: function(p) {
            	p = p || {};
            	if ($.type(p.row) != "number") {
            		alert(GM.invalid_row_number);
            		return false;
            	};
            	g.CollapseRow(p);
            }
        };

        pin.events = $.extend({}, $.fn.grid.events, (function() {
        	var beforeExcelExport = pin.events.BeforeExcelExport;
        	pin.events.BeforeExcelExport = function() {
        		// 개인정보 로그 생성
        		if(_prsn_log_no != ""){
        			$.ajax({
        				url: "/system/system/registPrsnInfoScrLog.action",
        				dataType: "text",
        				data: {
        					prsn_log_no : _prsn_log_no
        				},
        				async: false,
        				success : function(data) {
        				}
        			}); 
        		}
        		
        		if ($.type(beforeExcelExport) == "function") {
        			beforeExcelExport();
        		}
        	};
        	return pin.events;
        })());
        
        var download = function(p) {
        	var columns = [];
        	var form = $("<form method='post'></form>").attr({ action: p.action });
        	p = $.extend({ download_type: "excel", download_file_name: "" }, p);
        	$.each(pin.columns, function(c_i, column) {
        		if (column.type == "H") {
        			return true;
        		};
        		columns.push({ id: column.id, header: column.header, type: column.type, index: c_i });
        	});
        	$("<input type='hidden' name='GRID_HEADERS'></input>").val(JSON.stringify(columns)).appendTo(form);
        	$("<input type='hidden' name='download_type'></input>").val(p.download_type).appendTo(form);
        	$("<input type='hidden' name='download_file_name'></input>").val(p.download_file_name).appendTo(form);
        	$.each(p.parameters, function(p_i, parameter) {
        		$("<input type='hidden' name='" + parameter.name + "'></input>").val(parameter.value).appendTo(form);
        	});
        	form.appendTo("body").submit().remove();
        };
        
        pin.events.DownloadExcel = function() {
        	download({
        		action: "/common/downloadGridExcel.action",
        		download_type: "excel",
    			download_file_name: "exel.xlsx",
        		parameters: [{
        			name: "rows",
        			value: (function() {
        				var rows = [];
        				$.each(o.GetRows(), function(r_i, row) {
        	        		var data = {};
        	        		$.each(pin.columns, function(c_i, column) {
        	        			if (column.type == "H") {
        	            			return true;
        	            		};
        	        			data[column.id] = row[column.id]; 
        	        		});
        	        		rows.push(data);
        	        	});
        				return JSON.stringify(rows);
        			})()
        		}]
        	});
    	};
        
        var Initialize = pin.events.Initialize;
        pin.events.Initialize = function() {
    		//HTML 요소
        	g.RowsPerPage = getPagedBox(pin.div_id, "cnt1");
        	g.PageIdx = getPagedBox(pin.div_id, "cnt2");
        	//유틸영역 처리
        	$("#" + pin.div_id).parent().find("div.gd_icons").each(function() {
        		//초기화
        		$(this).empty();
        	});
        	//페이징 영역 처리
            setTotalCount(pin.div_id, 0);	//조회 갯수 0으로 초기화
            $(g.RowsPerPage).each(function() {	//rows_per_page
            	var rows = pin.properties.rows;
            	var select = this;
            	select.length = rows.length;
            	$.each(rows, function(idx, row) {
            		select[idx].text = toCurrency(row) + GM.qty;
            		select[idx].value = row;
            	});
            	if (typeof(pin.properties.default_rows) != "undefined") {
            		select.value = pin.properties.default_rows;
            		if (select.value == "") {
            			select.value = pin.properties.rows[0];
            		}
            	};
            }).change(function() {
            	$(g.PageIdx).each(function() {
            		this.value = 1;
            	});
            	if (pin.properties.page_change != null && $.type(pin.properties.page_change) == "function") {
            		var b = pin.properties.page_change();
            		if ($.type(b) == "boolean" && b) {
            			o.DoQuery();
                	}
            	} else {
            		o.DoQuery();
            	};
            });
            $(g.PageIdx).each(function() {	//page_idx
            	var select = this;
            	select.length = 1;
            	select[0].text = "1/1";
            	select[0].value = 1;
            }).change(function() {
            	if (pin.properties.page_change != null && $.type(pin.properties.page_change) == "function") {
            		var b = pin.properties.page_change();
            		if ($.type(b) == "boolean" && b) {
            			o.DoQuery({
                    		params:{
                    			page_idx:this.value
                    		}
                    	});
                	}
            	} else {
            		o.DoQuery({
                		params:{
                			page_idx:this.value
                		}
                	});
            	};
            });
    		Initialize();
        };
        var EndQuery = pin.events.EndQuery;
        pin.events.EndQuery = function(message) {
        	if (typeof pin === "object" && typeof pin.queryQueue === "object") {
        		var queryObj = pin.queryQueue.shift();
        		if (typeof message === "object") {
        			message["caller"] = queryObj["caller"];
        		}
        	}
        	
			//그리드 결과 처리
			var total_count = 0;
			if (message.ROWS_PER_PAGE == null) {	//페이징 처리 안함
				total_count = o.GetRowCount();
				//cnt1, cnt2 숨기기
				$(g.RowsPerPage).hide();
				$(g.PageIdx).hide();
			} else {
				total_count = message.TOTAL_COUNT;
    			//page_idx 셋팅
    			$(g.PageIdx).each(function() {	//page_idx
    				var select = (function(s) {
    					s.length = 0;
    					return $(s);
    				})(this);
    				var page_range = pin.properties.page_range;
    				var total_count = parseInt(message.TOTAL_COUNT, 10);
    				var rows_per_page =  parseInt(message.ROWS_PER_PAGE, 10);
    				var page_idx =  parseInt(message.PAGE_IDX, 10);
    				var total_pages = total_count % rows_per_page != 0 ? parseInt(total_count / rows_per_page, 10) + 1 : parseInt(total_count / rows_per_page, 10);
					var start_page = parseInt((message.PAGE_IDX - 1) / page_range, 10) * page_range + 1;
					var page_no = start_page;
					if (total_pages > 0) {
						if (page_no > page_range) {
							select.append($("<option><<처음</option>").val("1"));
							select.append($("<option><이전</option>").val(start_page - 1));							
						};
						for (var i = 1 ; i <= page_range ; i++) {
							select.append((function() {
								var option = $("<option></option>").text(page_no + "/" + total_pages).val(page_no);
								return option;
							})());
							page_no++;
							if (page_no > total_pages) {
								break;
							};
						};
						if (total_pages > page_no) {
							select.append($("<option>>다음</option>").val(page_no));
							select.append($("<option>>>마지막</option>").val(total_pages));							
						};
					} else {
						select.append($("<option></option>").text("1/1").val("1"));
					};
					select.val(page_idx);
    			});
			};
			setTotalCount(pin.div_id, total_count);

			if (message.code != "S") {
				alert("\nerror_type : " + message.error_type + "\nerror_message : " + message.error_message);
			};

        	EndQuery(message);
        	
//        	if(_prsnParam != ""){
//	        	_prsnParam = $.extend({ result_cnt: total_count }, _prsnParam || {});
//	        	
//	        	$.post("/system/system/registPrsnInfoScrLog.action", _prsnParam, function(data){
//	        		var json = JSON.parse(data);
//
//	        		_prsn_log_no = json.prsn_log_no
//	        	});
//        	}
        };
        var EndSave = pin.events.EndSave;
        pin.events.EndSave = function(message) {
        	if (pin.properties.endsave) {
				if (message.code == "S") {
    				alert(GM.save_success);
    			}else if(message.code == "D") { 
    				alert(GM.save_other_fail.format(message.error_type, message.error_message));
    			}else{
    				alert(GM.save_fail.format(message.error_type, message.error_message));
    			};
			};
        	EndSave(message);
        };
        pin.events.EndLogin = function(message) {
        	var p = { message: message.error_message };
			goAlertIndex(p);
        };

        pin.GM = GM;


        if (grid_type == OVERPASS.GRID.SILVERLIGHT.type) {
        	g = OVERPASS.GRID.SILVERLIGHT.createGrid(pin);	//silverlight 그리드 생성
        } else if (grid_type == OVERPASS.GRID.JQGRID.type) {
        	g = OVERPASS.GRID.JQGRID.createGrid(pin);	//jqGrid 생성
        } else if (grid_type == OVERPASS.GRID.FLEXGRID.type) {
        	g = OVERPASS.GRID.FLEXGRID.createGrid(pin);	//위지모FlexGrid 생성
        };

        //function 셋팅
        $.each($.fn.grid.functions, function(name, fn) {
        	o[name] = function(p) {
        		g[name](p);
        	};
        });
        $.extend(o, functions);

        if (grid_type == OVERPASS.GRID.JQGRID.type) {		//jqgrid의 경우 Initialize 발생시켜줌
        	o["jq"] = g.jq;
        	setTimeout(function() { pin.events.Initialize(); }, 50);	//Initialize 발생시점 관련하여 g가 리턴된 후 호출되도록 시간 조정(비동기적으로 호출되도록...)
        };
        
        if (grid_type == OVERPASS.GRID.FLEXGRID.type) {		//FLEXGRID의 경우 Initialize 발생시켜줌
            o["cv"] = g.cv;
        	setTimeout(function() { pin.events.Initialize(); }, 50);	//Initialize 발생시점 관련하여 g가 리턴된 후 호출되도록 시간 조정(비동기적으로 호출되도록...)
        };

        //저장되어야 할 정보들...
        o["id"] = g.id;
        o["div_id"] = g.div_id;
        o["columns"] = pin.columns;
        o["properties"] = pin.properties;

		return o;
	};
})(jQuery);