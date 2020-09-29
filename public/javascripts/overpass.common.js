(function ($) {
	
	if (typeof console != "object") {
		window.console = {
			log: function() {},
			dir: function() {}
		};
	};
	
	//바닥 페이지를 찾아간다.
	var findBottom = function(win) {
		var w = win || window ;
		if (w.top.opener) {	//팝업이다??
			w.top.close();
			return findBottom(w.top.opener);
		} else {
			return w.top;
		};
	};
	
	//ajax 셋팅
	$.ajaxSettings.cache = false;
	$.ajaxSettings.traditional = true;
	
	var _ajax = $.ajax;
	$.ajax = function(p) {
		var _error = null;
		if ($.type(p.error) == "function") {	//error 함수 처리
			_error = p.error;
		};
		
		p.error = function(jqXHR, textStatus, errorThrown) {
			var m = null;
			try {
				m = $.parseJSON(jqXHR.responseText);
				if (m.error_type == "kr.co.overpass.frm.exception.AuthorityException") {
					//로그아웃된 경우...
					alert(m.error_message);
					var w = findBottom();
					w.top.location.href = "/index.action";
					return false;
				};
			} catch (e) {
				m = {};
			};
			
			if (_error == null) {
				if ($.type(m.error_message) == "string") {
					alert(m.error_message);
				};
			} else {
				_error(m);
			};
		};
		
		if(p.isGridFile){
			p.data.append("_AJAX_","Y");
		}else{

			p = $.extend({ data: null }, p || {});
			//이곳에서 공통으로 ajax여부를 셋팅하자...
			if ($.type(p.data) == "string") {
				p.data += "&_AJAX_=Y";
			} else if ($.type(p.data) == "object") {
				p.data["_AJAX_"] = "Y";
			} else {
				p.data = { _AJAX_: "Y" };
			};
			
		}

		return _ajax(p);
	};
	
	//패키지 생성
	$.fn.grid = {};
	$.fn.tree = {};
	$.fn.imageuploader = {};
	$.fn.tree.node = {};
	
	callback = null;
	
	goAlertIndex = function(p) {
		alert(p.message);
		top.location.href = "/";
	};
	
	_clicked = true;
	_layer = null;
	
	/**
	 * 레이어 생성(본 레이어는 동일 페이지에 한개씩만 생성 가능하며 실버라이트 위에도 표시된다.)
	 * IE의 경우 focusout일 경우 제거되며, 그외의 브라우저에서는 닫기 버튼을 클릭하여야한 한다.
	 * {
	 *  content: $	-> 레이어의 내용, html 또는 $객체, load 함수 등등 모두 사용 가능...
	 * 	event: Event,	-> click같은 이벤트의 경우 해당 이벤트 객체
	 *  cell: Cell		-> 그리드 셀클릭 이벤트를 발생시킨 셀 정보(해당 셀에 레이어의 위치가 맞춰짐)
	 *  top: String,
	 *  left: String,
	 *  offy: String,	-> 레이어 위치 조정시 top 보정값
	 *  offx: String,	-> 레이어 위치 조정시 left 보정값
	 *  width: String,
	 *  height: String,
	 *  display: boolean	-> 표시여부
	 * }
	 */
	createLayer = function(p) {
		//$(document).unbind("click");
		p = $.extend(false, {
			event: null, 
			cell: null,
			top: null, 
			left: null,
			offy: 0, 
			offx: 0,
			width: "200px",
			height: "200px",
			display: true,
			fixed: false
		}, p || {});
		
		var top = (document.documentElement.clientHeight)/2 - p.height.replace(/px/g, '')/2;
		var left = (document.body.scrollWidth)/2 - p.width.replace(/px/g, '')/2;
		
		if (p.cell != null) {
			var position = $("#" + p.cell.DivId).offset();
			p.left = p.cell.Left + (position ? position.left : 0) ;
			p.top = p.cell.Bottom + (position ? position.top : 0) ;
			p.offx = p.cell.Right - p.cell.Left;
			p.offy = p.cell.Top - p.cell.Bottom;
		} else if (p.event != null) {
			p.top = p.event.pageY ;
			p.left = p.event.pageX ;
		} else if (p.top == null && p.left == null) {
			p.top = top;
			p.left = left ;			
		};
		
		var id = "_LAYER_";
		
		//동일 레이어가 이미 보여지고 있는지 확인		
		$("#" +id).remove();
		
		if (!p.fixed) {
			if (parseInt(p.width.replace(/px/g, ""), 10) + p.left >= $(window).width()) {
				p.left = p.left - parseInt(p.width.replace(/px/g, ""), 10) + p.offx ;
			};
			
			if (parseInt(p.height.replace(/px/g, ""), 10) + p.top >= $(window).height()) {
				p.top = p.top - parseInt(p.height.replace(/px/g, ''), 10) + p.offy ;
			};
		};
		
		_layer = $("<div class=\"layer_wrap\" id=\"" + id + "\" >").css({
			display: "block",
			position: "absolute",
			width: p.width,
			height: p.height,
			top: p.top,
			left: p.left
		});
		
		_layer.click(function(e) {
			e.stopPropagation();
		});
		
		$(":input", p.content).click(function(e) {
			e.stopPropagation();
		});
		
		var close = $("<p class=\"close\"><button type=\"button\">" + fnGetI18nMessge("M.common.btn.닫기") +"</button></p>");
				
		close.find("button").click(function() {
			if(p.callback && typeof(p.callback) == "function"){
				p.callback();
			}
			$("#" +id).hide();		//일부 페이지에서 닫기 버튼 클릭시 실버라이트 오류발생하기 때문에 hide 한다음에 remove한다?????
			$("#" +id).remove();
		});
		
		_layer.append(close);
		
		_layer.append(p.content);
		
		_layer.append("<iframe title=\""+ fnGetI18nMessge("M.common.실버라이트용") +"\"></iframe>");
		
		if (!p.display) {
			_layer.hide();
		};

		_layer.appendTo("body");
		
		_layer.focus();
		
		if(!p.nonHideYn){ //클릭시 레이어 안닫히게
			$(document).click(function() {
				_layer.hide();
				_layer.remove();
			});
		}
		
		return _layer;
	};
	
	closeLayer = function(layer) {
		layer.hide();
		layer.remove();
	};
	
	var isDownload = false;
	
	$.fn.download = function(p) {
		
		p = $.extend(false, {
			action: null,
			headers: null,
			form: null,
			grid: null,
			file_name: null
		}, p || {});
		
		this.each(function() {
			
			$(this).click(function() {

				var action = null;
				var headers = null;		//헤더정보
				var conds = null;		//조회조건
				
				if (p.grid != null) {
					var grid = p.grid;					
					var data = grid.DoQuery({
						save: true
					});
					
					action = data.action;
					headers = JSON.parse(data.header_info);					
					conds = JSON.parse(data.sel_cond);
				};
				
				if (p.headers != null) {					
					headers = p.headers;
				};
				
				if (p.form != null) {
					conds = [];
					$.each(p.form.serializeArray(), function(i, input) {
						conds.push(input.name + "=" + input.value);
					});
				};
				
				if (p.action != null) {	// action을 직접 셋팅하였다면 이걸로..
					action = p.action;
				};
				
				if ($.type(headers) != "array") {
					alert(fnGetI18nMessge("M.common.message.헤더정보가올바르지않습니다"));
					return false;
				};
				
				//헤더정보
				var hs = [];
				$.each(headers, function(i, header) {					
					hs.push({
						"header": header.header,
						"binding": header.binding,
						"type": header.type
					});					
				});
				
				var iframe = null;
				if ($("#_DOWNLOAD_FORM_SUBMIT_TARGET").length == 0) {
					iframe = $("<iframe name=\"_DOWNLOAD_FORM_SUBMIT_TARGET\" id=\"_DOWNLOAD_FORM_SUBMIT_TARGET\" />");
					iframe.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
					iframe.appendTo("body");
				} else {
					iframe = $("#_DOWNLOAD_FORM_SUBMIT_TARGET");
				};
				
				var f = null;
				
				if ($("#_DOWNLOAD_FORM").length == 0) {
					f = $("<form id=\"_DOWNLOAD_FORM\" name=\"_DOWNLOAD_FORM\" method=\"post\"></form>").attr({
						action: action,
						target: "_DOWNLOAD_FORM_SUBMIT_TARGET"
					});
					f.appendTo("body");
				} else {
					f = $("#_DOWNLOAD_FORM");
				};
				
				f.find(":input").remove();   // form 초기화
				
				if (conds != null) {
					$.each(conds, function(i, cond) {
						var kv = cond.split("=");
						var input = $("<input type=\"hidden\"></input>").attr({
							name: kv[0],
							value: kv[1]
						});
						input.appendTo(f);
					});	
				};
				
				f.find(":input[name=rows_per_page]").val(10000000);
				
				$("<input type=\"hidden\"></input>").attr({
					name: "download",
					value: "Y"
				}).appendTo(f);
				
				$("<input type=\"hidden\"></input>").attr({
					name: "headers",
					value: JSON.stringify(hs)
				}).appendTo(f);			
				
				if (p.file_name == null || p.file_name == "") {  //파일명이 없다면 화면명으로 만들어 주자.
					$.ajax({
						url: "/system/getStScrMgmt.action",
            			dataType: "json",
            			data: {
            				"scr_no" : _scr_no
            			},
            			async: false,
            			success : function(data) {
            				p.file_name = data.scr_nm + "_" + new Date().format("yyyy-MM-dd") + ".csv";
            			},
            			error: function() {
            				p.file_name = new Date().format("yyyy-MM-dd") + ".csv";
            			}
					});
				};
				
				$("<input type=\"hidden\"></input>").attr({
					name: "file_name",
					value: p.file_name
				}).appendTo(f);
				
				f.submit();
			});			
		});
	};
	
	/**
	 * CSV 다운로드
	 * @param pin - {form:"전송할폼", file:"파일이름.csv", url: "조회결과를얻을url", result:결과를저장할변수}
	 * @param grid - 엑셀출력용헤더
	 */
	fnCommonCsvDown = function(pin ,grid) {
    	var headers = "";
    	var columns = "";
    	var first = true;
    	
    	$.each(grid, function(idx, obj){
    		
    		if (obj.type != "H") {
	    		if (!first) {
	    			headers += "^&^";
	    			columns += "^&^";
	    		}
	    		headers += obj.header;
	    		columns += obj.id;
	    		
	    		first = false;
    		}
    	});

    	fnCommonRemoveCsv(pin);
    	
    	$("#"+ pin.form).append("<input type=\"hidden\" name=\"csv_header\" value=\"" + headers +  "\">");
    	$("#"+ pin.form).append("<input type=\"hidden\" name=\"csv_columns\" value=\"" + columns +  "\">");
    	$("#"+ pin.form).append("<input type=\"hidden\" name=\"file_name\" value=\"" + pin.file +  "\">");
    	
    	if(typeof(pin.result) != "undefined") {
    		$("#"+ pin.form).append("<input type=\"hidden\" name=\"sel_cond\" />");
        	$("#"+ pin.form).append("<input type=\"hidden\" name=\"header_info\" />");
        	$("#"+ pin.form).append("<input type=\"hidden\" name=\"action_nm\" />");    	
        	$("#"+ pin.form).append("<input type=\"hidden\" name=\"prsn_scr_no\" />");
        	$("#"+ pin.form).append("<input type=\"hidden\" name=\"prsn_auth_cd\" />");
        	
        	// sel_cond는 encode해서 만들어졋기 때문에.. decode해준값으로 다시 만들어준다.
        	var parameters = JSON.parse(pin.result.sel_cond);
        	var afterParameters = [];
        	var name = "";
        	var value = "";
        	$.each(parameters, function(idx, param) {
        		name = param.split("=")[0];
        		value = param.split("=")[1];
        		afterParameters[afterParameters.length] = name + "=" + decodeURI(value);
        	});
        	
        	$("input[name=sel_cond]","#"+ pin.form).val(JSON.stringify(afterParameters));
        	$("input[name=header_info]","#"+ pin.form).val(pin.result.header_info);
        	$("input[name=action_nm]","#"+ pin.form).val(pin.result.action_nm);
        	$("input[name=prsn_scr_no]","#"+ pin.form).val(pin.result.scr_no);
        	$("input[name=prsn_auth_cd]","#"+ pin.form).val(OVERPASS.prsn_srch_auth_cd);
    	}

    	$.form("#"+ pin.form).submit({
            action:pin.url,
            //iframe:true,
            success: function(p) {  
                $.form("#"+ pin.form).run(false);
                return;
            },
            error:function(e){
            	alert(e);
            },
            confirm: function() {  
                return msgConfirm("DW");
            }
        });
    	
        if(pin.callback && typeof(pin.callback) == "function"){
        	pin.callback();
        }
        
        //엑셀 로그에 남기는 것은 헤더 값은 제외하고 남겨야 하기에 클린 처리
        fnCommonRemoveCsv(pin);
        $.form("#"+ pin.form).run(false);

        if(_prsnParam != ""){
        	_prsnParam = $.extend({ result_cnt: 0 }, _prsnParam || {});
        	
        	$.post("/system/system/registPrsnInfoScrLog.action", _prsnParam );
    	}
    }
	
	fnCommonRemoveCsv = function(pin){
	    $("input[name=csv_header]", "#"+ pin.form).remove();
		$("input[name=csv_columns]", "#"+ pin.form).remove();
		$("input[name=file_name]", "#"+ pin.form).remove();
		
		if(typeof(pin.result) != "undefined") {
	    	$("input[name=sel_cond]", "#"+ pin.form).remove();
	    	$("input[name=header_info]", "#"+ pin.form).remove();
	    	$("input[name=action_nm]", "#"+ pin.form).remove();
	    	$("input[name=prsn_scr_no]", "#"+ pin.form).remove();    		
	    	$("input[name=prsn_auth_yn]", "#"+ pin.form).remove();
		}
		
	}

	/* 그리드 엑셀 다운로드 개인정보 로그 등록 - 삭제 */
	/*var registPrsnGridExcelDownloadLog = function(){
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
	};*/
})(jQuery);