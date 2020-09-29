﻿﻿(function($){
	var VERSION = "1.1.0";
	
	var grid_skin = {
		blue: {
			_HeaderGridLinesBrush: 		"226|226|226",
            _FrozenLinesBrush: 				"0|0|0",
            _GroupRowBackground: 		"231|236|239",
            _UnderlinedText: 				"0|106|142",
            _TreeLine: 						"226|226|226",
            _HeaderGradientFrom: 			"244|251|255",
            _HeaderGradientTo: 			"208|234|247",
            _EditHeaderGradientFrom:	 	"219|242|250",
            _EditHeaderGradientTo: 		"152|217|250",
            _RowBackground: 				"255|255|255",
            _AlternatingRowBackground:	"249|249|249",
            _CursorBackground: 			"171|217|244",
            _SelectionBackground: 		"220|241|255",
            _GridLinesBrush: 				"226|226|226",
            _EditBorderBrush: 				"60|161|239",
            _ComboItemBrush:				"226|242|251"
		},
		green: {
			_HeaderGridLinesBrush: 		"226|226|226",
            _FrozenLinesBrush: 				"0|0|0",
            _GroupRowBackground: 		"231|236|239",
            _UnderlinedText: 				"66|162|1",
            _TreeLine: 						"226|226|226",
            _HeaderGradientFrom: 			"243|252|235",
            _HeaderGradientTo: 			"227|245|213",
            _EditHeaderGradientFrom:	 	"215|245|190",
            _EditHeaderGradientTo: 		"180|224|145",
            _RowBackground: 				"255|255|255",
            _AlternatingRowBackground:	"249|249|249",
            _CursorBackground: 			"179|208|123",
            _SelectionBackground: 		"232|249|203",
            _GridLinesBrush: 				"226|226|226",
            _EditBorderBrush: 				"85|181|52",
            _ComboItemBrush:				"237|252|225"
		},
		gray: {
			_HeaderGridLinesBrush: 		"226|226|226",
            _FrozenLinesBrush: 				"0|0|0",
            _GroupRowBackground: 		"231|236|239",
            _UnderlinedText: 				"41|76|230",
            _TreeLine: 						"226|226|226",
            _HeaderGradientFrom: 			"193|198|209",
            _HeaderGradientTo: 			"164|169|180",
            _EditHeaderGradientFrom:	 	"148|150|171",
            _EditHeaderGradientTo: 		"126|135|150",
            _RowBackground: 				"255|255|255",
            _AlternatingRowBackground:	"249|249|249",
            _CursorBackground: 			"182|186|196",
            _SelectionBackground: 		"228|231|235",
            _GridLinesBrush: 				"226|226|226",
            _EditBorderBrush: 				"151|153|173",
            _ComboItemBrush:				"218|220|224"
		},
		orange: {
			_HeaderGridLinesBrush: 		"226|226|226",
            _FrozenLinesBrush: 				"0|0|0",
            _GroupRowBackground: 		"231|236|239",
            _UnderlinedText: 				"204|102|3",
            _TreeLine: 						"226|226|226",
            _HeaderGradientFrom: 			"255|246|229",
            _HeaderGradientTo: 			"246|223|183",
            _EditHeaderGradientFrom:	 	"254|229|192",
            _EditHeaderGradientTo: 		"240|177|103",
            _RowBackground: 				"255|255|255",
            _AlternatingRowBackground:	"249|249|249",
            _CursorBackground: 			"246|209|156",
            _SelectionBackground: 		"255|241|217",
            _GridLinesBrush: 				"226|226|226",
            _EditBorderBrush: 				"235|116|19",
            _ComboItemBrush:				"254|245|227"
		}
	};

	OVERPASS.GRID.SILVERLIGHT.receivers = {};
	OVERPASS.GRID.SILVERLIGHT.createGrid = function (pin) {
		var div_id = pin.div_id;
		var div = document.getElementById(div_id);	// parent element(DIV or SPAN)
		var o = { id: pin.id, div_id: div_id };
		var skin = grid_skin["gray"];
		var initParams = "id=" + pin.id + ",div_id=" + pin.div_id + ",clipboard_copy=" + pin.properties.clipboard_copy + ",min_row_height=" + pin.properties.min_row_height;		//,로 구분
		$.each(skin, function(k, v) {
			initParams += ("," + k + "=" + v);
		});
		
		//멀티헤더일 경우 처리해 준다...
		$.each(pin.columnheaders, function(i, chs) {
			$.each(chs, function(j, ch) {
				pin.columnheaders[i][j] = ch.header;
			});
		});
		
		Silverlight.createObjectEx({
            source: "/common/xap/FlexGrid.xap#version=" + VERSION,
            parentElement: div,
            id: pin.id,
            properties: {
                width: pin.properties.width,
                height: pin.properties.height,
                background: "white",
                enableHtmlAccess:"true",
                //windowless:"true",
                //alt: "<!--not installed-->",	<--해당 버전의 실버라이트가 설치되어 있지 않을 경우 처리방법 기술...
                version: OVERPASS.SILVERLIGHT.VERSION
            },
            events: {
                onError: function (sender, args) {
                	if (args.ErrorCode != "4001" && args.ErrorType != "ImageError") {
                		alert("ErrorCode : " + args.ErrorCode + "\nErrorMessage : " + args.ErrorMessage + "\nErrorType : " + args.ErrorType);                		
                	};
                },
                onLoad: function (sender, args) {
                	var g = document.getElementById(pin.id);
                	
                	//이벤트 셋팅
                	$.each(pin.events, function(name, event) {
                		if (name == "BeforeExcelImport") {                			
                			g[name] = function() {
                				var o = $.extend({ action: "/common/uploadExcel.action", params: {} }, event());
                				$.each(o.params, function(k, v) {
                					o.params[k] = (v + "");
                				});
                				o.params = JSON.stringify(o.params);
                				return o;
                			};
                		} else {
                			g[name] = event;                			
                		};
                	});
                	
                	g.ShowColumnsButton = function() {	//ShowColumnsButton 함수는 그리드내에서 직접 호출되므로 이곳에 구현한다.
                    	$("#" + pin.div_id).parent().find("div.gd_btns").each(function() {
                    		if ($(this).find("button.button_hide").length == 0) {
                    			var button = $("<button />").attr({
                    				type: "button",
                    				title: "숨기기취소"
                    			}).append("<span>숨기기취소</span>").click(function() {
                    				o.ShowColumn({ id: "" });
                    				button.remove();
                    			}).addClass("button_hide");
                        		$(this).append(button);	
                    		};                        		
                    		$(this).show();
                    	});
                    };
                	
                	g.columns = pin.columns;
                	
                	var scriptable = sender.Content[sender.id]; 	//Silverlight Datagrid내 호출가능한 Object
                	g.parent = sender.parentElement;
                	
                	if (pin.properties.receiver) {	//receiver일 경우
                		OVERPASS.GRID.SILVERLIGHT.receivers[pin.id] = function(p, fn) {
                			fn(scriptable.GetSubmitData(JSON.stringify(p)));
                		};
                	};
                	
                	g.ShowCalendar = function(cell) {
                    	var position = $(this).parent().offset();
                    	var div = $("<div />");                        	
                    	var button1 = $("<button />");
                    	var button2 = $("<button />");
                    	var start_datetime = cell.StartDatetime.split("|");
                    	var end_datetime = cell.EndDatetime.split("|");
                    	
                    	div.append("<span><input value='" + start_datetime[0] + "'  /></span>");
                    	div.append(button1);
                    			
                    	if (cell.Minute1) {
                    		div.append("<span><input value='" + start_datetime[1] + "'  /></span>");
                    		div.append("<span><input value='" + start_datetime[2] + "'  /></span>");
                    	} else if (cell.Hour1) {
                    		div.append("<span><input value='" + start_datetime[1] + "'  /></span>");
                    	};
                    	
                    	if (cell.Sdate != null && cell.Edate != null) {
                    		div.append("<span />");
                    		div.append("<span><input value='" + end_datetime[0] + "'  /></span>");
                        	div.append(button2);
                        	if (cell.Minute2) {
                        		div.append("<span><input value='" + end_datetime[1] + "'  /></span>");
                        		div.append("<span><input value='" + end_datetime[2] + "'  /></span>");
                        	} else if (cell.Hour2) {
                        		div.append("<span><input value='" + end_datetime[1] + "'  /></span>");
                        	};                            		
                    	};
                    	
                    	var date_format = cell.DataType != 9 ? "yyyy-MM-dd HH:mm:ss" : "yyyyMMdd" ;
                    	
                    	$("button", div).showCalendar({
                    		grid:true,
                    		left: cell.Left + position.left,
                    		top: cell.Bottom + position.top,
                    		offx: cell.Right - cell.Left,
                    		offy: cell.Top - cell.Bottom,
                    		fn: function(sdate, edate) {
                    			var event_yn = false;
                    			var column;
                    			if (cell.Sdate == null && cell.Edate == null) {
                    				column = OVERPASS.GRID.COLUMNSID[cell.Id];
                    				if ( column != null && column.calendar != null ) {
                    					event_yn = column.calendar.event_yn;
                    				}
                    				o.SetValue({
                    					row: cell.Row, 
                    					id: cell.Id, 
                    					value: sdate.format(date_format),
                    					event_yn: event_yn
                    				});
                    			} else {
                    				if (sdate != null) {
                    					column = OVERPASS.GRID.COLUMNSID[cell.Sdate];
                    					if ( column != null && column.calendar != null ) {
                        					event_yn = column.calendar.event_yn;
                        				}
                    					o.SetValue({
                        					row: cell.Row, 
                        					id: cell.Sdate, 
                        					value: sdate.format(date_format),
                        					event_yn: event_yn
                        				});
                        			}; 
                        			if (edate != null) {
                        				column = OVERPASS.GRID.COLUMNSID[cell.Edate];
                        				if ( column != null && column.calendar != null ) {
                        					event_yn = column.calendar.event_yn;
                        				}
                        				o.SetValue({
                        					row: cell.Row, 
                        					id: cell.Edate, 
                        					value: edate.format(date_format),
                        					event_yn: event_yn
                        				});
                        			};	
                    			};                        			                        			
                    		}
                    	});                        	
                    };
                    
                    g.DownloadExcelSample = function(id, name) {
                    	var $form = null;
                    	if ($("#_ExcelSampleForm").length == 0) {
                    		$form = $("<form id='_ExcelSampleForm' />").append("<input type='hidden' name='sample_id'>").append("<input type='hidden' name='sample_name'>");
                    		$form.attr({
                    			action: "/common/downExcelSample.action",
                    			method: "post"
                    		});
                    		$form.appendTo('body');
                    	} else {
                    		$form = $("#_ExcelSampleForm");
                    	};
                    	$form.find("input[name=sample_id]").val(id);
                    	$form.find("input[name=sample_name]").val(name);
                    	$.form($form).submit({
                    		iframe: true                        		
                    	});
                    	$.form($form).run(false);
                    }; 
                	
                	var DoSubmit = function(p) {
                		if ($.type(p) != "object") {
                			return false;
                		};
                		//group 정보 셋팅
                		scriptable.ResetSubmitData();	//groups 데이타 초기화
                        $.each(p.group, function(idx, g) {
                        	if ("DoQuery" in g) {
                        		g = { grid:g };
                        	}
                        	g = $.extend(false, { cud:["C", "U", "D"] }, g || {});
                        	p.group[idx] = { id: g.grid.id, div_id: g.grid.div_id, cud: g.cud };
                        	
                        	OVERPASS.GRID.SILVERLIGHT.receivers[g.grid.id]({ cud: g.cud }, function(data) {
                        		scriptable.SetSubmitData(g.grid.id, data);                        		
                        	});                        	
                        });
                        
                		scriptable.run("DoSubmit", JSON.stringify(p));
                	};
                	
                	$.extend(o, $.fn.grid.functions, {
                        DoQuery: function (p) {	//조회
                    		DoSubmit(p);
                        },
                        DoSave: function(p) {
                        	DoSubmit(p);
                        },
                        GetValue: function (p) {
                        	return scriptable.run("GetValue", JSON.stringify(p));
                        },
                        SetValue: function(p) {
                        	scriptable.run("SetValue", JSON.stringify(p));
                        },
                        AddRow: function (p) {
                        	return scriptable.run("AddRow", JSON.stringify(p));
                        },
                        AddColumn: function(p) {
                        	scriptable.run("AddColumn", JSON.stringify(p));
                        },
                        RemoveColumn: function(p) {
                        	scriptable.run("RemoveColumn", JSON.stringify(p));	
                        },
                        MoveRow: function(p) {
                        	return scriptable.run("MoveRow", JSON.stringify(p));
                        },
                        GetRowCount: function(p) {
                        	return scriptable.run("GetRowCount", JSON.stringify(p));
                        },
                        DeleteCreateRows: function(p) {
                        	scriptable.run("DeleteCreateRows", JSON.stringify(p));
                        },
                        DeleteRows: function(p) {
                        	scriptable.run("DeleteRows", JSON.stringify(p));
                        },
                        DeleteRow: function(p) {
                        	scriptable.run("DeleteRow", JSON.stringify(p));
                        },
                        Restore: function(p) {
                        	scriptable.run("Restore", JSON.stringify(p));
                        },
                        GetRow: function(p) {
                        	return scriptable.run("GetRow", JSON.stringify(p));
                        },
                        GetRows: function(p) {
                        	return scriptable.run("GetRows", JSON.stringify(p));
                        },
                        GetCell: function(p) {
                        	return scriptable.run("GetCell", JSON.stringify(p));
                        },
                        HideColumn: function(p) {
                        	scriptable.run("HideColumn", JSON.stringify(p));
                        },
                        ShowColumn: function(p) {
                        	scriptable.run("ShowColumn", JSON.stringify(p));
                        },
                        SetColumnIndex: function(p) {
                        	scriptable.run("SetColumnIndex", JSON.stringify(p));
                        },
                        HideRow: function(p) {
                        	scriptable.run("HideRow", JSON.stringify(p));
                        },
                        ShowRow: function(p) {
                        	scriptable.run("ShowRow", JSON.stringify(p));
                        },
                        CreateCombo: function(p) {
                        	p.combo = getCombo(p.combo);
                        	scriptable.run("CreateCombo", JSON.stringify(p));
                        },
                        ClearRows: function(p) {
                        	scriptable.run("ClearRows", JSON.stringify(p));
                        },
                        CancelEdit: function(p) {
                        	o.SetEditable({
                        		row: p.row,
                        		id: p.id,
                        		editable: p.value
                        	});
                        },
                        SetEditable: function(p) {
                        	var def = { row: -1, id: "", editable: false, columns: []  };
                        	if ($.type(p) == "boolean") {	//전체 컬럼에 대해서 적용
                        		var columns = [];
                        		$.each(g.columns, function(idx, column) {
                        			columns.push({ id: column.id, editable: p });
                        		});
                        		p = def;
                        		p.columns = columns;
                        	} else if ($.isPlainObject(p)) {	//특정 row 또는 column 또는 cell에 적용
                        		p = $.extend(false, def, p || {});
                        	} else if ($.isArray(p)) {	//지정된 컬럼들에 대해서 적용
                        		var columns = p;
                        		p = $.extend(false, def, p || {});
                        		p.columns = columns;
                        	} else {
                        		return false;
                        	};                        	
                        	scriptable.run("SetEditable", JSON.stringify(p));
                        },
                        ChangeCellType: function(p) {
                        	scriptable.run("ChangeCellType", JSON.stringify(p));
                        },                        
                        CheckRequired: function(p) {
                        	var cell = scriptable.run("CheckRequired", JSON.stringify(p));
                        	var b = true;
                        	if (cell != null) {
                        		alert("컬럼 : " + cell.Header + "\n행번호 : " + (cell.Row + 1) + "\n셀값은 필수 입니다.");
                        		b = false;
                        	};
                        	return b; 
                        },
                        SelectRow: function(p) {
                        	scriptable.run("SelectRow", JSON.stringify(p));
                        },
                        SelectCell: function(p) {
                        	scriptable.run("SelectCell", JSON.stringify(p));
                        },
                        FilterRow: function(p) {
                        	scriptable.run("FilterRow", JSON.stringify(p));
                        },
                        ReplaceColumns: function(p) {
                        	scriptable.run("ReplaceColumns", JSON.stringify(p));
                        },
                        CheckRow: function(p) {
                        	scriptable.run("CheckRow", JSON.stringify(p));
                        },
                        ChangeCellProperties: function(p) {
                        	scriptable.run("ChangeCellProperties", JSON.stringify(p));
                        },
                        ChangeCRUD: function(p) {
                        	scriptable.run("ChangeCRUD", JSON.stringify(p));
                        },
                        SearchRow: function(p) {
                        	scriptable.run("SearchRow", JSON.stringify(p));
                        },
                        SetBackground: function(p) {
                        	scriptable.run("SetBackground", JSON.stringify(p));
                        },
                        SetForeground: function(p) {
                        	scriptable.run("SetForeground", JSON.stringify(p));
                        },
                        CollapseRow: function(p) {
                        	scriptable.run("CollapseRow", JSON.stringify(p));
                        }
                	});
                	scriptable.run("Initialize", JSON.stringify(pin)); //초기화(그리드 바디)
                }
            },
            initParams: initParams
        });
        return o;
    };
})(jQuery);