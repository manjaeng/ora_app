/**
 * 공통 팝업
 */
(function(window) {

	/**
	 * pin:{ url:string, winname:string, title:string, _title:string, 팝업브라우저의
	 * 타이틀 변경시 params:map, autoresize:boolean }
	 * 
	 * parameter를 배열 형식으로 넘기면 갯수에 맞게 처리됨 (ex) params:{..., name:[a:'name',
	 * b:'name', c:'name'], ...} name=a&name=b&name=c type -> deprecated type을
	 * 사용하지 않습니다. width와 height는 직접 셋팅하셔야 합니다. s->small(350*400),
	 * m->middle(550*400), l->large(750*400) height는 변동가능
	 */
	var win = null;
	popup = function(pin) {
		var defaultProps = {
			winname : "_POPUP_",
			title : "",
			params : {},
			method: "get",
			scrollbars : false,
			resizable : false,
			action : false
		};
		if (!pin.width) {
			switch (pin.type) {
				case "s":
					pin.width = "390px";
					break;
				case "sl":
					pin.width = "440px";
					break;
				case "m":
					pin.width = "590px";
					break;
				case "l":
					pin.width = "790px";
					break;
				case "xl":
					pin.width = "840px";
					break;
				case "xml":
					pin.width = "940px";
					break;
				case "xxl":
					pin.width = "100%";
					break;
			};
		};
		
		if (!pin.height) {
			pin.height = "400";
		};

		pin = $.extend(defaultProps, pin || {});

		var intLeft = (screen.width) / 2 - (pin.width + "").replace(/px/, '') / 2;
		var intTop = (screen.height) / 2 - (pin.height + "").replace(/px/, '') / 2;
		
		/* 
		 * 1. 팝업 윈도우가 열리지 않는 현상이 발생하여 강제로 닫음.
		 * 2. 다른 윈도우 네임의 창을 오픈 시 이전 창이 닫힘으로 아래 스크립트를 수행 하면 안됨...
		 * 3. 1의 문제의 다른 해결 방안을 찾아야 함.
		 */
		if (!_mobile_yn && win != undefined && win != null) {	//갤럭시노트의 경우 기존 팝업을 close 했을경우 오류가 발생함...
			try {
				if (win.name == pin.winname) {
					win.close();
				}
			} catch(e){
				win.close();
			}
		};
		
		win = null;
		
		if(OVERPASS.prsn_srch_auth_cd != null && OVERPASS.prsn_srch_auth_cd != undefined){
			pin.params.scr_prsn_auth_cd = OVERPASS.prsn_srch_auth_cd;
		}
		
		if (pin.method == "get") {
			var openUrl = pin.url;
			var params = "";
			$.each(pin.params, function(name, value) {
				
				if ($.isArray(value)) {
					$.each(value, function(index, value) {
						params += ("&" + name + "=" + encodeURI(value));
					});

				} else if (typeof (value) == "object") {
					if(value != null ){
						$.each(value, function(name, value) {
							params += ("&" + name + "=" + encodeURI(value));
						});
					}
				} else {
					params += ("&" + escape(name) + "=" + encodeURI(value));
				};
			});
			
			openUrl += ("?title=" + encodeURI(pin.title) + params);

			win = window.open(openUrl, pin.winname, "menubar=no, scrollbars="
					+ (pin.scrollbars ? "yes" : "no") + ", resizable="
					+ (pin.resizable ? "yes" : "no") + ", status=yes, width="
					+ pin.width + ", height=" + pin.height + ",top=" + intTop
					+ ",left=" + intLeft + "");	
		} else if (pin.method == "post") { 
			var openUrl = "";
			
			win = window.open(openUrl, pin.winname, "menubar=no, scrollbars="
					+ (pin.scrollbars ? "yes" : "no") + ", resizable="
					+ (pin.resizable ? "yes" : "no") + ", status=yes, width="
					+ pin.width + ", height=" + pin.height + ",top=" + intTop
					+ ",left=" + intLeft + "");
			
			if (win != null) {
				//form을 만들자.
				$("#_POPUP_FORM_").remove();	//기존에 만들어진 폼이 있다면 일단 삭제....
				pin.params.title = pin.title;
				var form = $("<form id=\"_POPUP_FORM_\" method=\"post\" action=\"" + pin.url + "\" target=\"" + pin.winname + "\"></form>");
				$.each(pin.params, function(name, value) {
					var input = $("<input type=\"hidden\" />").attr("name", name).val(value);					
					form.append(input);
				});
				
				$("body").append(form);
				
				form.each(function() {
					this.submit();
				});				
			};
		} else {
			alert("죄송합니다. 팝업 정보가 올바르지 않습니다.");
			return false;
		};

		// 포커스
		if (win != undefined && win != null) {
			win.focus();
		};
		
		if ($.isFunction(pin.callback)) {
			callback = pin.callback;
		} else {
			callback = "";
		};
		
		if(OVERPASS.prsn_srch_auth_cd != "90" && OVERPASS.prsn_srch_auth_cd != ""){
			/* SVG-1459
			$.ajax({
				url: "/system/system/registPrsnInfoScrLog.action",
				dataType: "text",
				data: {
					sel_cond : JSON.stringify(pin)
				},
				async: false,
				success : function(data) {
					_prsn_log_no = data.prsn_log_no;
				}
			});*/ 
		}
		
		return win;
	};
	
	/**
	 * form이 id가 존재하는지 체크하는 함수
	 */
	fnChkForm = function(pin) {

		if (pin.form == undefined || pin.form == "") {
			return true;
		}

		return false;
	};
	
	/**
	 * grid의 id가 존재하는지 체크하는 함수
	 */
	fnChkGrid = function(pin) {

		if (pin.grid == undefined || pin.grid == "") {
			return true;
		}

		return false;
	};
	
	/**
     * 메인 header 사용자 정보설정
     */
	fnCheckUserPwPop = function() {
    	
    	popup({
            url : "/system/auth/initCheckUserPwPop.action",
            winname : "CheckUserPwPop",
            title : "비밀번호 확인",
            width : "400",
            height : "250",
            scrollbars : false,
            resizable : false
        });
    };
	
    fnModifyUserInfoPop = function() {
    	
    	popup({
            url : "/system/auth/initModifyUserInfoPop.action",
            winname : "ModifyUserInfoPop",
            title : "정보설정",
            width : "400",
            height : "250",
            scrollbars : false,
            resizable : false
        });
    };
    
	/**
     * 사이트 찾기
     */
	/**
	 * 사이트 찾기 팝업
	 *
     * 사용자 아이디가 있을 경우 사용자 사이트 검색.
	 * @param pin :
	 *            var pin = {form:"schrForm",
	 *            param:"&site_no=1111&site_nm=test",
	 *            rtnFunc:"fnSetSiteForForm"};
	 */	
	fnSiteListPop = function(pin) {

		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetSiteForForm") };

		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form);
			var strSite_no = $("input[id=site_no]", objForm).val();
			var strSite_nm = $("input[id=site_nm]", objForm).val();
			var strUser_id = $("input[id=user_id]", objForm).val();

			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				site_no : (strSite_no == "undefined") ? "" : strSite_no,
				site_nm : (strSite_nm == "undefined") ? "" : strSite_nm,
				user_id : (strUser_id == "undefined") ? "" : strUser_id,
				form : pin.form
			}); 

		}
	
		if (pin.param != undefined) {			
			$.extend(pinParam, pin.param );
		}
	
		var defaultParam = {
	            url : "/popup/forward.SiteListPop.action",
	            winname : "SiteListPop",
	            title : "사이트찾기",
	            params :pinParam,
	            width: "700",
	            height : "400",
	            scrollbars : true,
	            autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);		
    };	

    fnSetSiteForForm = function(pin) {
		$("input[id=site_no]", $("#" + pin.form)).val(pin.data[0]["SITE_NO"]);
		$("input[id=site_nm]", $("#" + pin.form)).val(pin.data[0]["SITE_NM"]);
		$("input[id=sso_grp_no]", $("#" + pin.form)).val(pin.data[0]["SSO_GRP_NO"]);		
	};
	
	/**
	 * 사용자조회 팝업 오픈 form에서 오픈할 경우
	 * 
	 * @param pin :
	 *            var pin = {form:"schrForm", param:{user_id:"test",
	 *            user_nm:"test"}, rtnFunc:"fnSetUserForForm"};
	 * @param pin :
	 *            var pin = {form:"schrForm",
	 *            param:"&user_id=test&user_nm=test"&md_id=md_id,
	 *            rtnFunc:"fnSetUserForForm"};
	 */
	fnUserListPopForForm = function(pin) {
		
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetUserForForm") };

		var strTitle = (pin.title == undefined) ? "사용자 조회" : pin.title;
		//form이 존재 하는 경우 
	
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form);
			var strUser_id = $("input[id=user_id]", objForm).val();
			var strUser_nm = $("input[id=user_nm]", objForm).val();
			var strMd_id = $("input[id=md_id]", objForm).val();
			//널처리
			if (strUser_id == null){
				strUser_id ="";
			}
			if (strUser_nm == null){
				strUser_nm ="";
			}
			if (strMd_id == null){
				strMd_id ="";
			}

			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				user_id : (strUser_id == "undefined") ? "" : strUser_id,
				user_nm : (strUser_nm == "undefined") ? "" : strUser_nm,
				md_id : (strMd_id == "undefined") ? "" : strMd_id,
			  	   form : pin.form
		    }); 
		}

		if (pin.param != undefined) {
			$.extend(pinParam , pin.param);
		}

		var defaultParam = {
				url : "/popup/forward.UserListPop.action",
				winname : "BrandList_pop",
				title : strTitle,
				type : "m",
				height : "520",
				params : pinParam,
				scrollbars : false,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
		
	};
	
	fnSetUserForForm = function(pin) {
		$("input[id=user_id]", $("#" + pin.form)).val(pin.data[0]["USER_ID"]);
		$("input[id=user_nm]", $("#" + pin.form)).val(pin.data[0]["USER_NM"]);
		$("input[id=md_id]", $("#" + pin.form)).val(pin.data[0]["MD_ID"]);
		$("input[id=md_nm]", $("#" + pin.form)).val(pin.data[0]["USER_NM"]);
		$("input[id=reg_id]", $("#" + pin.form)).val(pin.data[0]["USER_ID"]);
		$("input[id=reg_nm]", $("#" + pin.form)).val(pin.data[0]["USER_NM"]);
		$("input[id=charge_id]", $("#" + pin.form)).val(pin.data[0]["USER_ID"]);
		$("input[id=charge_nm]", $("#" + pin.form)).val(pin.data[0]["USER_NM"]);
	};
	
	/**
	 * 우편검색 팝업
	 * 
	 * @param pin :
	 *            var pin = {form:"schrForm", param:{"schVal":"목동"}, rtnFunc:"fnPostListPop"};
	 *            파라미터로 same_check_yn:"Y" 를 보네면 체크선택시 같은 우편번호는 같이 선택됨
	 */
	fnPostListPop = function(pin) {
		
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetPostListPop") };

		var strTitle = (pin.title == undefined) ? "우편 조회" : pin.title;
		
		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form);
			
			var strPostVal = $("input[id=postNo]", objForm).val();
			var strAddrVal = $("input[id=addrVal]", objForm).val();

			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				
				postVal : (strPostVal == "undefined") ? "" : strPostVal,
				addrVal : (strAddrVal == "undefined") ? "" : strAddrVal,
				form : pin.form
		    }); 
		}

		if (pin.param != undefined) {
			$.extend(pinParam , pin.param);
		}

		var defaultParam = {
				url : "/popup/forward.PostListPop.action",
				winname : "PostList_pop",
				title : strTitle,
				width : "700",
				height : "484",
				params : pinParam,
				scrollbars : false,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
		
	};
	
	fnSetPostListPop = function(pin) {		
		$("input[id=postNo]", $("#" + pin.form)).val(pin.data[0]["POST_NO"]);
		$("input[id=addr]", $("#" + pin.form)).val(pin.data[0]["ADDR"]);		
	};
    
	/**
	 * 신우편검색 팝업
	 * 
	 * @param pin :
	 *            var pin = {form:"schrForm", param:{"schVal":"목동"}, rtnFunc:"fnPostListPop"};
	 *            파라미터로 same_check_yn:"Y" 를 보네면 체크선택시 같은 우편번호는 같이 선택됨
	 */
	fnNewPostListPop = function(pin) {
		
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetNewPostListPop") };

		var strTitle = (pin.title == undefined) ? "우편 조회" : pin.title;
		
		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {
		}

		if (pin.param != undefined) {
			$.extend(pinParam , pin.param);
		}

		var defaultParam = {
			url : "/popup/forward.NewPostListPop.action",
			winname : "PostList_pop",
			title : strTitle,
			width : "700",
			height : "580",
			params : pinParam,
			scrollbars : true,
			autoresize : false
		};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
		
	};
	
    //우편번호 조회 팝업 리턴
	fnSetNewPostListPop = function(pin) {
    	$("input[id=post_no]").val(pin.data[0].post_no);
    	$("input[id=base_addr]").val(pin.data[0].base_addr);
    	$("input[id=dtl_addr]").val(pin.data[0].dtl_addr);
    	$("input[id=new_post_no]").val(pin.data[0].post_no1);
    	$("input[id=new_base_addr]").val(pin.data[0].base_addr1);
    	$("input[id=new_dtl_addr]").val(pin.data[0].dtl_addr1);
    	$("input[id=addr_divi_cd]").val(pin.data[0].addr_divi_cd);
    };
	
	/**
	 * 상위업체조회 팝업.
	 */
	fnUpperVendListPop = function(pin) {
		
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetVendForForm") };
		
		var strTitle = (pin.title == undefined) ? "업체조회" : pin.title;
		
		if (pin.form != undefined && pin.form != "") {

			var objForm = $("#" + pin.form);
			var strVir_vend_no = $("input[id=vend_no]", objForm).val();
			var strLow_vend_nm = $("input[id=vend_nm]", objForm).val();

			$.extend(pinParam ,{
				vir_vend_no : (strVir_vend_no == "undefined") ? "" : strVir_vend_no,
				low_vend_nm : (strLow_vend_nm == "undefined") ? "" : strLow_vend_nm,
				form : pin.form
			}); 
			
		}
		
		if (pin.param != undefined) {
			
			$.extend(pinParam, pin.param );
		}

		var defaultParam = {
				url : "/popup/forward.UpperVendListPop.action",
				winname : "UpperVendList_pop",
				title : strTitle,
				type : "l",
				height : "480",
				params : pinParam,
				scrollbars : false,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
	};

	fnSetVendForForm = function(pin) {
		
		$("input[id=low_vend_nm]"	, $("#" + pin.form)).val(pin.data[0]["LOW_VEND_NM"]);
		$("input[id=vir_vend_no]"	, $("#" + pin.form)).val(pin.data[0]["VIR_VEND_NO"]);
		$("input[id=vend_no]"		, $("#" + pin.form)).val(pin.data[0]["VEND_NO"]);
		$("input[id=vend_nm]"		, $("#" + pin.form)).val(pin.data[0]["VEND_NM"]);
		$("input[id=purch_form_cd]"	, $("#" + pin.form)).val(pin.data[0]["PURCH_FORM_CD"]);		
		$("input[id=tax_use_yn]"	, $("#" + pin.form)).val(pin.data[0]["TAX_USE_YN"]);
		$("input[id=petty_use_yn]"	, $("#" + pin.form)).val(pin.data[0]["PETTY_USE_YN"]);
		$("input[id=detax_use_yn]"	, $("#" + pin.form)).val(pin.data[0]["DETAX_USE_YN"]);
		
		$("input[id=card_msg_yn]"				, $("#" + pin.form)).val(pin.data[0]["CARD_MSG_YN"]);
		$("input[id=present_pkg_yn]"			, $("#" + pin.form)).val(pin.data[0]["PRESENT_PKG_YN"]);
		$("input[id=read_time]"					, $("#" + pin.form)).val(pin.data[0]["READ_TIME"]);
		$("input[id=quest_resp_yn]"				, $("#" + pin.form)).val(pin.data[0]["QUEST_RESP_YN"]);
		$("input[id=margin_divi_cd]"			, $("#" + pin.form)).val(pin.data[0]["MARGIN_DIVI_CD"]);
		$("input[id=margin_normal_start_rate]"	, $("#" + pin.form)).val(pin.data[0]["MARGIN_NORMAL_START_RATE"]);
		$("input[id=margin_normal_end_rate]"	, $("#" + pin.form)).val(pin.data[0]["MARGIN_NORMAL_END_RATE"]);
		$("input[id=margin_dscnt_start_rate]"	, $("#" + pin.form)).val(pin.data[0]["MARGIN_DSCNT_START_RATE"]);
		$("input[id=margin_dscnt_end_rate]"		, $("#" + pin.form)).val(pin.data[0]["MARGIN_DSCNT_END_RATE"]);
	};
	
	/**
	 * 출고지조회 팝업.
	 * vend_no가 있을 경우 해당 업체의 출고지정보를 조회한다.
	 */
	fnLowVendListPop = function(pin) {
		
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetVendForForm") };
		
		var strTitle = (pin.title == undefined) ? "출고지조회" : pin.title;
		
		if (pin.form != undefined && pin.form != "") {

			var objForm = $("#" + pin.form);
			var strVir_vend_no = $("input[id=vir_vend_no]", objForm).val();
			var strLow_vend_nm = $("input[id=low_vend_nm]", objForm).val();

			$.extend(pinParam ,{
				vir_vend_no : (strVir_vend_no == "undefined") ? "" : strVir_vend_no,
				low_vend_nm : (strLow_vend_nm == "undefined") ? "" : strLow_vend_nm,			    
				form : pin.form
			}); 
			
		}
		
		if (pin.param != undefined) {
			
			$.extend(pinParam, pin.param );
		}

		var defaultParam = {
				url : "/popup/forward.LowVendListPop.action",
				winname : "LowVendList_pop",
				title : strTitle,
				type : "l",
				height : "480",
				params : pinParam,
				scrollbars : false,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
	};

	
	/**
	 * 업체조회 팝업 오픈 form에서 오픈할 경우
	 * 상/하위 업체 모두 조회
	 */
	fnVendListPop = function(pin) {
		
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetVendForForm") };
		
		var strTitle = (pin.title == undefined) ? "업체 조회" : pin.title;
		
		if (pin.form != undefined && pin.form != "") {

			var objForm = $("#" + pin.form);
			var strVir_vend_no = $("input[id=vir_vend_no]", objForm).val();
			var strLow_vend_nm = $("input[id=low_vend_nm]", objForm).val();

			$.extend(pinParam ,{
				vir_vend_no : (strVir_vend_no == "undefined") ? "" : strVir_vend_no,
				low_vend_nm : (strLow_vend_nm == "undefined") ? "" : strLow_vend_nm,
				form : pin.form
			}); 
			
		}
		
		if (pin.param != undefined) {
			
			$.extend(pinParam, pin.param );
		}

		var defaultParam = {
				url : "/popup/forward.VendListPop.action",
				winname : "VendList_pop",
				title : strTitle,
				type : "l",
				height : "480",
				params : pinParam,
				scrollbars : false,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
	};
	
	/**
	 * B2E거래처조회 팝업
	 * b2e_use_yn:N 일경우 사이트에 미등록된 B2E거래처 조회.
	 */
	fnB2EVendListPop = function(pin) {
		
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetVendForForm") };
		
		var strTitle = (pin.title == undefined) ? "업체 조회" : pin.title;
		
		if (pin.form != undefined && pin.form != "") {

			var objForm = $("#" + pin.form);
			var strLow_vend_no = $("input[id=low_vend_no]", objForm).val();
			var strLow_vend_nm = $("input[id=low_vend_nm]", objForm).val();

			$.extend(pinParam ,{
				low_vend_no : (strLow_vend_no == "undefined") ? "" : strLow_vend_no,
				low_vend_nm : (strLow_vend_nm == "undefined") ? "" : strLow_vend_nm,
				form : pin.form
			}); 
			
		}
		
		if (pin.param != undefined) {
			
			$.extend(pinParam, pin.param );
		}

		var defaultParam = {
				url : "/popup/forward.B2EVendListPop.action",
				winname : "B2EVendList_pop",
				title : strTitle,
				type : "l",
				height : "480",
				params : pinParam,
				scrollbars : false,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
	};	
	
    /**
	 * 센터조회 팝업 오픈 form에서 오픈할 경우
	 * 
	 * @param pin :
	 *            var pin = {form:"schrForm", param:{center_no:"1111",
	 *            center_nm:"test"}, rtnFunc:"fnSetCenterForForm"};
	 * @param pin :
	 *            var pin = {form:"schrForm",
	 *            param:"&center_no=1111&center_nm=test",
	 *            rtnFunc:"fnSetCenterForForm"};
	 */
	fnCenterListPopForForm = function(pin) {
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)? pin.rtnFunc:(pin.callback)?"":"fnSetCenterForForm") };

		var strTitle = (pin.title == undefined) ? "센터 검색" : pin.title;
		
		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form);
			var strCenter_no = $("input[id=center_no]", objForm).val();
			var strCenter_nm = $("input[id=center_nm]", objForm).val();

			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				center_no : (strCenter_no == "undefined") ? "" : strCenter_no,
				center_nm : (strCenter_nm == "undefined") ? "" : strCenter_nm,
				form : pin.form
			}); 
		}
		
		if (pin.param != undefined) {
			
			$.extend(pinParam, pin.param );
		}

		var defaultParam = {
				url : "/popup/forward.CenterListPop.action",
				winname : "CenterList_pop",
				title : strTitle,
				type : "m",
				height : "480",
				params : pinParam,
				scrollbars : false,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
	};

	fnSetCenterForForm = function(pin) {
		$("input[id=center_no]", $("#" + pin.form)).val(pin.data[0]["CENTER_NO"]);
		$("input[id=center_nm]", $("#" + pin.form)).val(pin.data[0]["CENTER_NM"]);
		$("input[id=rel_no]", $("#" + pin.form)).val(pin.data[0]["CENTER_NO"]);
		$("input[id=rel_nm]", $("#" + pin.form)).val(pin.data[0]["CENTER_NM"]);		
	};	
 
	/**
	 * 채널조회 팝업 오픈 form에서 오픈할 경우
	 * 
	 * @param pin :
	 *            var pin = {form:"schrForm", param:{chnl_no:"1111",
	 *            chnl_nm:"test"}, rtnFunc:"fnSetChnlForForm"};
	 * @param pin :
	 *            var pin = {form:"schrForm",
	 *            param:"&chnl_no=1111&chnl_nm=test",
	 *            rtnFunc:"fnSetChnlForForm"};
	 */
	fnChnlListPopForForm = function(pin) {
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetChnlForForm") };

		var strTitle = (pin.title == undefined) ? "채널 검색" : pin.title;
		
		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form);
			var strChnl_no = $("input[id=chnl_no]", objForm).val();
			var strChnl_nm = $("input[id=chnl_nm]", objForm).val();

			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				chnl_no : (strChnl_no == "undefined") ? "" : strChnl_no,
				chnl_nm : (strChnl_nm == "undefined") ? "" : strChnl_nm,
				form : pin.form
			}); 
		}
		
		if (pin.param != undefined) {
			
			$.extend(pinParam, pin.param );
		}

		var defaultParam = {
				url : "/popup/forward.ChnlListPop.action",
				winname : "ChnlList_pop",
				title : strTitle,
				type : "m",
				height : "480",
				params : pinParam,
				scrollbars : false,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
	};

	fnSetChnlForForm = function(pin) {
		$("input[id=chnl_no]", $("#" + pin.form)).val(pin.data[0]["CHNL_NO"]);
		$("input[id=chnl_divi_cd]", $("#" + pin.form)).val(pin.data[0]["CHNL_DIVI_CD"]);
		$("input[id=chnl_clss_cd]", $("#" + pin.form)).val(pin.data[0]["CHNL_CLSS_CD"]);
		$("input[id=chnl_type_cd]", $("#" + pin.form)).val(pin.data[0]["CHNL_TYPE_CD"]);
		$("input[id=chnl_dtl_type_cd]", $("#" + pin.form)).val(pin.data[0]["CHNL_DTL_TYPE_CD"]);
		$("input[id=use_yn]", $("#" + pin.form)).val(pin.data[0]["USE_YN"]);
		$("input[id=chnl_dtl_type_nm]", $("#" + pin.form)).val(pin.data[0]["CHNL_DTL_TYPE_NM"]);
	};
	
	/**
	 * 배너목록팝업
	 * 
	 * @param pin :
	 *            var pin = {form:"schrForm", param:{banner_no:"",
	 *            banner_nm:"",banner_type_cd:'', banner_kind_cd:''}, rtnFunc:"fnSetBannerInfo"};
	 *            
	 *            banner_type_cd : 배너유형
	 *            banner_kind_cd : 배너종류
	 */
	fnBannerListPop = function(pin) {

		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetBannerInfo") };
		
		var strTitle = (pin.title == undefined) ? "배너 검색" : pin.title;

		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form);
			var strBanner_no = $("input[id=banner_no]", objForm).val();
			var strBanner_nm = $("input[id=banner_nm]", objForm).val();

			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
							banner_no : (strBanner_no == "undefined") ? "": strBanner_no,
							banner_nm : (strBanner_nm == "undefined") ? "": strBanner_nm,
						    form : pin.form
					    }); 
		}

		if (pin.param != undefined) {
			$.extend(pinParam , pin.param);
		}

		var defaultParam = {
				url : "/popup/forward.BannerListPop.action",
				winname : "BannerList_pop",
				title : strTitle,
				type : "l",
				width : "790",
				height : "525",
				params : pinParam,
				scrollbars : false,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
		
	};
	
	//폼인경우 셋팅
	fnSetBannerInfo = function(pin) {
		$("input[id=banner_no]", $("#" + pin.form)).val(pin.data[0]["BANNER_NO"]);
		$("input[id=banner_nm]", $("#" + pin.form)).val(pin.data[0]["BANNER_NM"]);
	};
	
	/**
	 * 회원상세팝업
	 */
	fnMbrViewPop = function(param) {
		var sUrl = "/member/member/initMbrDtlViewPop.action";
		param = $.extend({mbr_no:""}, param||{});
		popup({
            url : sUrl,
            winname : "MbrView_pop",
            title : "회원상세",
            params : param,
            width : "1185",
            height : "680",
            scrollbars : true,
            resizable : "yes"
        });
    };
    
	/**
	 * 상품조회 팝업 오픈 form에서 오픈할 경우
	 * 
	 * @param pin :
	 *            var pin = {form:"schrForm", param:{goods_no:"1111"}, rtnFunc:"fnSetGoodsForForm"};
	 * @param pin :
	 *            var pin = {form:"schrForm", param:"&goods_no=1111, rtnFunc:"fnSetGoodsForForm"};
	 * @param pin :
	 *            var pin = {form:"schrForm", param:"&goods_no=1111};            
	 */
	fnGoodsListPop = function(pin) {
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetGoodsForForm") };

		var strTitle = (pin.title == undefined) ? "상품조회" : pin.title;
		var strHeight = "700";
		
		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form);
			var strGoods_no = $("input[id=goods_no]", objForm).val();
			var strGoods_copy_yn = $("input[id=goods_copy_yn]", objForm).val();

			strHeight = "630";
			
			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				goods_no : (strGoods_no == "undefined") ? "" : strGoods_no,
				form : pin.form
			}); 
		}
		
		if (pin.param != undefined) {
			
			$.extend(pinParam, pin.param);
		}

		var defaultParam = {
				url : "/popup/forward.GoodsListPop.action",
				winname : "GoodsList_pop",
				title : strTitle,
				type : "xl",
				height : strHeight,
				params : pinParam,
				scrollbars : true,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		
		popup(pin);
	};

	fnSetGoodsForForm = function(pin) {
		$("input[id=goods_no]", $("#" + pin.form)).val(pin.data[0]["GOODS_NO"]);
		$("input[id=goods_nm]", $("#" + pin.form)).val(pin.data[0]["GOODS_NM"]);
	};
	
	
	/**
	 * 전시카테고리 검색 팝업 오픈 form에서 오픈할 경우
	 * 
	 * @param pin :
	 *            var pin = {form:"schrForm", param:{disp_ctg_no:"1111",
	 *            disp_ctg_nm:"test"}, rtnFunc:"fnSetDispCtgInfo"};
	 * @param pin :
	 *            var pin = {form:"schrForm",
	 *            param:"&chnl_no=1111&chnl_nm=test", rtnFunc:"fnSetChnlInfo"};
	 */
	fnDispListPop = function(pin) {

		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetDispCtgInfo") };
		
		var strTitle = (pin.title == undefined) ? "전시카테고리 검색" : pin.title;

		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form);
			var strDisp_ctg_no = $("input[id=disp_ctg_no]", objForm).val();
			var strDisp_ctg_nm = $("input[id=disp_ctg_nm]", objForm).val();

			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
							disp_ctg_no : (strDisp_ctg_no == "undefined") ? "": strDisp_ctg_no,
							disp_ctg_nm : (strDisp_ctg_nm == "undefined") ? "": strDisp_ctg_nm,
						    form : pin.form
					    }); 
		}

		if (pin.param != undefined) {
			$.extend(pinParam , pin.param);
		}

		var defaultParam = {
				url : "/popup/forward.DispListPop.action",
				winname : "DispList_pop",
				title : strTitle,
				type : "l",
				width : "623",
				height : "610",
				params : pinParam,
				scrollbars : false,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
		
	};
	
	//폼인경우 셋팅
	fnSetDispCtgInfo = function(pin) {
		$("input[id=disp_ctg_no]", $("#" + pin.form)).val(pin.data[0]["DISP_CTG_NO"]);
		$("input[id=disp_ctg_nm]", $("#" + pin.form)).val(pin.data[0]["DISP_CTG_NM"]);
		$("input[id=depth_no]", $("#" + pin.form)).val(pin.data[0]["DEPTH_NO"]);
		$("input[id=leaf_yn]", $("#" + pin.form)).val(pin.data[0]["LEAF_YN"]);
	};
	
	/**
	 * 브랜드 조회 팝업 오픈 form에서 오픈할 경우
	 * 
	 * @param pin :
	 *            var pin = {form:"schrForm", param:{brand_no:"test",
	 *            searchGubn:"low",inputGubn:"brand_nm"}, rtnFunc:"fnSetBrandForForm"};
	 * @param pin :
	 *            var pin = {form:"schrForm",
	 *            param:"&inputVal=test&searchGubn=low&inputGubn=brand_nm", rtnFunc:"fnSetChnlInfo"};
	 */
	fnBrandListPopForForm = function(pin) {
		
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetBrandForForm") };

		var strTitle = (pin.title == undefined) ? "브랜드 조회" : pin.title;
		
		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form);
			var strBrand_no = $("input[id=brand_no]", objForm).val();
			var strBrand_nm = $("input[id=brand_nm]", objForm).val();
			var strOrnz_cd_1 = $("input[id=ornz_cd_1]", objForm).val();
			var strOrnz_cd_2 = $("input[id=ornz_cd_2]", objForm).val();
			//널처리
			if(strBrand_no == null){
				strBrand_no = "";
			}
			
			if(strBrand_nm == null){
				strBrand_nm = "";
			}

			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				brand_no : (strBrand_no == "undefined") ? "" : strBrand_no,
				brand_nm : (strBrand_nm == "undefined") ? "" : strBrand_nm,					
				ornz_cd_1 : (strOrnz_cd_1 == "undefined") ? "" : strOrnz_cd_1,					
				ornz_cd_2 : (strOrnz_cd_2 == "undefined") ? "" : strOrnz_cd_2,					
				form : pin.form
		    }); 
		}

		if (pin.param != undefined) {
			$.extend(pinParam , pin.param);
		}

		var defaultParam = {
				url : "/popup/forward.BrandListPop.action",
				winname : "BrandList_pop",
				title : strTitle,
				type : "xl",
				height : "450",
				params : pinParam,
				scrollbars : false,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
		
	};
	fnSetBrandForForm = function(pin) {
		$("input[id=brand_no]", $("#" + pin.form)).val(pin.data[0]["BRAND_NO"]);
		$("input[id=brand_nm]", $("#" + pin.form)).val(pin.data[0]["BRAND_NM"]);
	};
	
	
	/**
	 * 정산_본부 조회 팝업 오픈 form에서 오픈할 경우
	 * 
	 * @param pin :
	 *            var pin = {form:"schrForm", param:{brand_no:"test",
	 *            searchGubn:"low",inputGubn:"brand_nm"}, rtnFunc:"fnSetBrandForForm"};
	 * @param pin :
	 *            var pin = {form:"schrForm",
	 *            param:"&inputVal=test&searchGubn=low&inputGubn=brand_nm", rtnFunc:"fnSetChnlInfo"};
	 */
	fnHeaderOfficePopForForm = function(pin) {
		
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetHeaderOfficeForForm") };
		
		var strTitle = (pin.title == undefined) ? "본부 조회" : pin.title;
		
		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form);
			var strOrnz_cd_1 = $("input[id=ornz_cd_1]", objForm).val();
			var strOrnz_nm_1 = $("input[id=ornz_nm_1]", objForm).val();
			//널처리
			if(strOrnz_cd_1 == null){
				strOrnz_cd_1 = "";
			}
			
			if(strOrnz_nm_1 == null){
				strOrnz_nm_1 = "";
			}
			
			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				ornz_cd_1 : (strOrnz_cd_1 == "undefined") ? "" : strOrnz_cd_1,
				ornz_nm_1 : (strOrnz_nm_1 == "undefined") ? "" : strOrnz_nm_1,					
				form : pin.form
			}); 
		}
		
		if (pin.param != undefined) {
			$.extend(pinParam , pin.param);
		}
		
		var defaultParam = {
				url : "/popup/forward.HeadOfficePop.action",
				winname : "HeadOfficePopList_pop",
				title : strTitle,
				type : "xl",
				height : "450",
				params : pinParam,
				scrollbars : false,
				autoresize : false
		};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
		
	};
	
	fnSetHeaderOfficeForForm = function(pin) {
		$("input[id=ornz_cd_1]", $("#" + pin.form)).val(pin.data[0]["ORNZ_CD_1"]);
		$("input[id=ornz_nm_1]", $("#" + pin.form)).val(pin.data[0]["ORNZ_NM_1"]);
	};
	
	
	/**
	 * 정산_사업부 조회 팝업 오픈 form에서 오픈할 경우
	 * 
	 * @param pin :
	 *            var pin = {form:"schrForm", param:{brand_no:"test",
	 *            searchGubn:"low",inputGubn:"brand_nm"}, rtnFunc:"fnSetBrandForForm"};
	 * @param pin :
	 *            var pin = {form:"schrForm",
	 *            param:"&inputVal=test&searchGubn=low&inputGubn=brand_nm", rtnFunc:"fnSetChnlInfo"};
	 */
	fnOfficePopForForm = function(pin) {
		
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetOfficePopForForm") };
		
		var strTitle = (pin.title == undefined) ? "사업부 조회" : pin.title;
		
		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form);
			var strOrnz_cd_1 = $("input[id=ornz_cd_1]", objForm).val();
			var strOrnz_cd_2 = $("input[id=ornz_cd_2]", objForm).val();
			var strOrnz_nm_2 = $("input[id=ornz_nm_2]", objForm).val();
			//널처리
			if(strOrnz_cd_1 == null){
				strOrnz_cd_1 = "";
			}

			if(strOrnz_cd_2 == null){
				strOrnz_cd_2 = "";
			}
			
			if(strOrnz_nm_2 == null){
				strOrnz_nm_2 = "";
			}
			
			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				ornz_cd_1 : (strOrnz_cd_1 == "undefined") ? "" : strOrnz_cd_1,
				ornz_cd_2 : (strOrnz_cd_2 == "undefined") ? "" : strOrnz_cd_2,
				ornz_nm_2 : (strOrnz_nm_2 == "undefined") ? "" : strOrnz_nm_2,					
				form : pin.form
			}); 
		}
		
		if (pin.param != undefined) {
			$.extend(pinParam , pin.param);
		}
		
		var defaultParam = {
				url : "/popup/forward.OfficePop.action",
				winname : "OfficePopList_pop",
				title : strTitle,
				type : "xl",
				height : "450",
				params : pinParam,
				scrollbars : false,
				autoresize : false
		};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
		
	};
	
	fnSetOfficePopForForm = function(pin) {
		$("input[id=ornz_cd_2]", $("#" + pin.form)).val(pin.data[0]["ORNZ_CD_2"]);
		$("input[id=ornz_nm_2]", $("#" + pin.form)).val(pin.data[0]["ORNZ_NM_2"]);
	};
	
	
	/**
	 * 전시카테고리 트리 팝업 오픈 form에서 오픈할 경우
	 * 
	 * @param pin :
	 *            var pin = {form:"schrForm", param:{disp_ctg_no:"1111",
	 *            disp_ctg_nm:"test"}, rtnFunc:"fnSetDispCtgInfo"};
	 * @param pin :
	 *            var pin = {form:"schrForm",
	 *            param:"&chnl_no=1111&chnl_nm=test", rtnFunc:"fnSetChnlInfo"};
	 */
	fnDispTreePop = function(pin) {
		
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetDispCtgTreeInfo") };

		var strTitle = (pin.title == undefined) ? "전시카테고리 트리 검색" : pin.title;
	
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form);
			
			var strDisp_ctg_no = $("input[id=disp_ctg_no]", objForm).val();
			var strDisp_ctg_nm = $("input[id=disp_ctg_nm]", objForm).val();

			$.extend(pinParam ,{
				disp_ctg_no : (strDisp_ctg_no == "undefined") ? "": strDisp_ctg_no,
				disp_ctg_nm : (strDisp_ctg_nm == "undefined") ? "": strDisp_ctg_nm,
			    form : pin.form
		    }); 
		}
		
		if (pin.param != undefined) {
			$.extend(pinParam , pin.param);
		}

		var defaultParam = {
				url : "/popup/initDispTreeViewPop.action",
				winname : "DispTreeView_POP",
				title : strTitle,
				type : "s",
				height : "530",
				params : pinParam,
				scrollbars : false,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
	};
	
	
	fnSetDispCtgTreeInfo = function(pin) {
		$("input[id=disp_ctg_no]", $("#" + pin.form)).val(pin.data[0]["DISP_CTG_NO"]);
		$("input[id=disp_ctg_nm]", $("#" + pin.form)).val(pin.data[0]["DISP_CTG_NM"]);
	};
	
	/**
	 * 표준상품군 팝업 오픈 form에서 오픈할 경우
	 * 
	 * @param pin :
	 *            var pin = {form:"schrForm", param:{md_id:"1111"}, rtnFunc:"fnSetMdGsgrForForm"};
	 * @param pin :
	 *            var pin = {form:"schrForm",
	 *            param:"&md_id=1111",
	 *            rtnFunc:"fnSetMdGsgrForForm"};
	 */
	fnStdGsgrListPop = function(pin) {
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetStdGsgrForForm") };

		var strTitle = (pin.title == undefined) ? "표준상품군 조회" : pin.title;
		
		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form);
			var strMd_id = $("input[id=md_id]", objForm).val();

			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				md_id : (strMd_id == "undefined") ? "" : strMd_id,
				form : pin.form
			}); 
		}
		
		if (pin.param != undefined) {
			
			$.extend(pinParam, pin.param);
		}

		var defaultParam = {
				url : "/popup/forward.StdGsgrListPop.action",
				winname : "StdGsgrList_pop",
				title : strTitle,
				width : "660",
				height : "400",
				params : pinParam,
				scrollbars : false,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
	};
	
	fnSetStdGsgrForForm = function(pin) {
		$("input[id=std_gsgr_no]", $("#" + pin.form)).val(pin.data[0]["STD_GSGR_NO"]);
		$("input[id=std_gsgr_nm]", $("#" + pin.form)).val(pin.data[0]["STD_GSGR_NM"]);
		$("input[id=appr_yn]"	 , $("#" + pin.form)).val(pin.data[0]["APPR_YN"]);
	};
	
	/**
	 * 프로모션 팝업 오픈 form에서 오픈할 경우
	 * 
	 * @param pin :
	 *            var pin = {form:"schrForm", param:{promo_no:"1111",
	 *            promo_nm:"test"}, rtnFunc:"fnSetPromoForForm"};
	 * @param pin :
	 *            var pin = {form:"schrForm",
	 *            param:"&promo_no=1111&promo_nm=test",
	 *            rtnFunc:"fnSetPromoForForm"};
	 */
	fnPromoListPop = function(pin) {
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetPromoForForm")};

		var strTitle = (pin.title == undefined) ? "프로모션 조회" : pin.title;
		
		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form);
			var strPromo_no = $("input[id=promo_no]", objForm).val();
			var strPromo_nm = $("input[id=promo_nm]", objForm).val();

			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				promo_no : (strPromo_no == "undefined") ? "" : strPromo_no,
				promo_nm : (strPromo_nm == "undefined") ? "" : strPromo_nm,
				form : pin.form
			}); 
		}
		
		// 프로모션 조회, 조회팝업이 동일한 action 을 사용하기 때문에 forward 할 url 을 던져준다.
		$.extend(pinParam, {forward_url : "/popup/forward.PromoListPop.action"});
		
		if (pin.param != undefined) {
			
			$.extend(pinParam , pin.param);
		}
		
		var defaultParam = {
				url : "/promo/promomgmt/initPromoListComm.action",
				winname : "PromoList_pop",
				title : strTitle,
				width : "800",
				height : "550",
				params : pinParam,
				scrollbars : false,
				autoresize : false
			};
		pin = $.extend(true, defaultParam, pin||{});
		popup(pin);
	};
	
	/**
	 * 회원조회 팝업
	 * 
	 * @param pin :
	 *            var pin = {form:"schrForm", param:{login_id:"1111"}, rtnFunc:"fnSetMbrForForm"};
	 * @param pin :
	 *            var pin = {form:"schrForm", param:"&login_id=1111, rtnFunc:"fnSetMbrForForm"};
	 * @param pin :
	 *            var pin = {form:"schrForm", param:"&login_id=1111};            
	 */
	fnMbrListPop = function(pin) {
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetMbrForForm") };
		var strTitle = (pin.title == undefined) ? "회원조회" : pin.title;

		if (pin.form != undefined && pin.form != "") {

			var objForm = $("#" + pin.form);
			var strMbr_no = $("input[id=mbr_no]", objForm).val();
			var strMbr_nm = $("input[id=mbr_nm]", objForm).val();
			var strLogin_id = $("input[id=login_id]", objForm).val();
			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				mbr_no : (strMbr_no == "undefined") ? "" : strMbr_no,
				mbr_nm : (strMbr_nm == "undefined") ? "" : strMbr_nm,
				login_id : (strLogin_id == "undefined") ? "" : strLogin_id,
				form : pin.form
			});			
		}
		
		if (pin.param != undefined) {			
			$.extend(pinParam, pin.param );
			
		}
		var defaultParam = {
				url : "/popup/forward.MbrListPop.action",
				winname : "MbrList_pop",
				title : strTitle,
				type : "m",
				height : "520",
				params : pinParam,
				scrollbars : false,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
	};

	fnSetMbrForForm = function(pin) {
		$("input[id=site_no]", $("#" + pin.form)).val(pin.data[0]["SITE_NO"]);
		$("input[id=site_nm]", $("#" + pin.form)).val(pin.data[0]["SITE_NM"]);
		$("input[id=mbr_no]", $("#" + pin.form)).val(pin.data[0]["MBR_NO"]);
		$("input[id=mbr_nm]", $("#" + pin.form)).val(pin.data[0]["MBR_NM"]);
		$("input[id=mbr_nm_msk]", $("#" + pin.form)).val(pin.data[0]["MBR_NM_MSK"]);
		$("input[id=login_id]", $("#" + pin.form)).val(pin.data[0]["LOGIN_ID"]);
		$("input[id=email]", $("#" + pin.form)).val(pin.data[0]["EMAIL"]);
		$("input[id=tel_no]", $("#" + pin.form)).val(pin.data[0]["TEL_NO"]);
		$("input[id=cell_no]", $("#" + pin.form)).val(pin.data[0]["CELL_NO"]);
		$("input[id=post_no]", $("#" + pin.form)).val(pin.data[0]["POST_NO"]);
		$("input[id=addr]", $("#" + pin.form)).val(pin.data[0]["ADDR"]);
		$("input[id=entry_site_no]", $("#" + pin.form)).val(pin.data[0]["ENTRY_SITE_NO"]);		
		$("input[id=grade_nm]", $("#" + pin.form)).val(pin.data[0]["GRADE_NM"]);
	};
	
	/**
	 * 주문검색 팝업 오픈 form에서 오픈할 경우
	 * 
	 * @param pin :
	 *            var pin = {form:"schrForm", param:{ord_no:"1111"}, rtnFunc:"fnSetOrdForForm"};
	 * @param pin :
	 *            var pin = {form:"schrForm",
	 *            param:"&ord_no=1111,
	 *            rtnFunc:"fnSetOrdForForm"};
	 */
	fnOrderListPopForForm = function(pin) {
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)? pin.rtnFunc:(pin.callback)?"":"fnSetOrdForForm") };

		var strTitle = (pin.title == undefined) ? "주문 검색" : pin.title;
		
		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form);
			var strOrd_no = $("input[id=ord_no]", objForm).val();

			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				ord_no : (strOrd_no == "undefined") ? "" : strOrd_no,
				form : pin.form
			}); 
		}
		
		if (pin.param != undefined) {
			
			$.extend(pinParam, pin.param );
		}

		var defaultParam = {
				url : "/popup/forward.OrderListPop.action",
				winname : "OrderList_pop",
				title : strTitle,
				type : "xl",
				height : "540",
				params : pinParam,
				scrollbars : false,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
	};

	fnSetOrdForForm = function(pin) {
		$("input[id=ord_no]", $("#" + pin.form)).val(pin.data[0]["ORD_NO"]);
	};
	
	
	/**
     * 주문 상세 보기 팝업
     */
	fnOrderDtlViewPop = function(param) {

		if (param != undefined ){
			if (param.ord_no == null || param.ord_no == undefined || param.ord_no == "" ){
				return;
			}
		} else {
			return;
		}
    	popup({
    		url : "/order/orderinfo/initOrderDtlViewPop.action",
            winname : "OrdDtlView_pop",
            title : "주문상세조회",
            params :param,
            width : "1130",
            height : "570",
            scrollbars : true,
            resizable : false,
            resizable : "yes"
        });
    };
    
    /**
     * 대출입 상태 이력 보기 팝업
     */
	fnDeliStoreInoutPop = function(param) {
		popup({
            url : "/deli/deli/initDeliStoreInoutPop.action",
            winname : "DeliStoreInoutPop",
            title : "대출입 상태 이력",
            params : param,
            height : "350px",
            width : "1000px",
            autoresize : true
        }); 
    };
    
    /**
	 * 고객특이사항 레이어 
	 * 
	 * fnMbMbrUnusLayer({form:"schrForm",  mode:"INS", rtnFunc:"fnSetForm"});
	 * 
	 */
	fnMbMbrUnusLayer = function(pin){
		var layer = pin.layer;
		var mbr_no = pin.mbr_no;
		if(layer != ""){
		     closeLayer(layer);
		     layer = "";
		}
		
		_clicked = false;    //그리드 클릭시 레이어 사라짐 방지 = false;     //그리드 클릭시 레이어 사라짐 방지
		
		var $content = $("<div />");
		layer = createLayer({
		    width:"400px",
		    height:"180px",
		    content: 
		    	$content.load(
			    			'/member/member/initMbMbrUnusLayer.action', 
			    			{mbr_no:mbr_no},  
			    			function() {
			    				$content.find("button.close").click(function() {
			    					closeLayer(layer);
			    				}
		    			);
		    })
		});
	};
	
	/**
     * 배송상세조회 팝업
     */
	fnDeliDtlPop = function(pin) {
        var strTitle = (pin.title == undefined) ? "배송상세조회" : pin.title;
        
        popup({
            url : "/deli/deli/initDeliDtlPop.action",
            winname : "DeliDtlPop",
            title : strTitle,
            params : pin,
            type : "xml",
            height : "650px",
            width : "1200px",
            scrollbars : true,
            autoresize : false,
            resizable : "yes"
        }); 
    };
    
    
	/**
	 *  배너 등록
	 *  
	 *        fnBannerPop({
        		
       		        callback : function(){
                        bannerGrid.DoQuery({
                            action : "/disp/banner/searchBannerMgmtList.action",
                            form   : "srchForm"
                        });
                    },
                    params:{                                                    
                        mode:"INS",  -- 등록 화면
                        banner_kind_cd:'',  -- 배너 종류 코드
                        banner_type_cd:'',  -- 배너 유형코드
                        rel_conts_no:'',   -- 컨텐츠번호
                        rel_conts_nm:'',   -- 컨텐츠 명
                    }
            });
            
	 */
    fnBannerPop =  function (pin) {
		
    	var pinParam = {rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"") };
        var strTitle = (pin.title == undefined) ? "배너등록" : pin.title;
	
		if (pin.params != undefined) {
			$.extend(pinParam, pin.params);
		}
		
        var defaultParam = {
			
               url : "/disp/banner/initBannerPop.action",
               winname : "BannerPop",
               title : strTitle,
               width: "750",
               height: "740",
               params : pinParam,
               scrollbars : true
        };
     	
     	
        pin = $.extend(defaultParam, pin||{});
        popup(pin);
    };
    
    /**
	 *  이벤트등록팝업
	 */
	fnEventInsPop = function(pin) {
		var varUrl = "/event/event/initEventInsPop.action";
		
		if(pin != undefined && pin.move != undefined){
			var varParam = "";
			
			$.each(pin, function(name, value) {
				if(name == "move"){
					return;
				}
				varParam += ((varParam != "")?"&":"?") + escape(name) + "=" + encodeURI(value);
			});
			
			window.location.href = varUrl + varParam;
		}else{
			pin = $.extend({upper_event_resd_no:""}, pin||{});
			popup({
	            url : varUrl,
	            winname : "EventInsPop",
	            title : "이벤트등록",
	            params : pin,
	            type : "xl",
	            width : "1200",
	            height : "800",
	            scrollbars : true,
	            resizable : false
	        });
		}
    };
    /*임시 이벤트 팝업 추후 삭제*/
    fnEventInsPop2 = function(pin) {
		var varUrl = "/event/event/initEventInsPop2.action";
		
		if(pin != undefined && pin.move != undefined){
			var varParam = "";
			
			$.each(pin, function(name, value) {
				if(name == "move"){
					return;
				}
				varParam += ((varParam != "")?"&":"?") + escape(name) + "=" + encodeURI(value);
			});
			
			window.location.href = varUrl + varParam;
		}else{
			pin = $.extend({upper_event_resd_no:""}, pin||{});
			popup({
	            url : varUrl,
	            winname : "EventInsPop",
	            title : "이벤트등록",
	            params : pin,
	            type : "xl",
	            width : "860",
	            height : "800",
	            scrollbars : true,
	            resizable : false
	        });
		}
    };
    
	/**
	 * 이벤트 조회 팝업
	 * 
	 * @param pin :
	 *            var pin = {form:"schrForm", param:{event_no:"1111"}, rtnFunc:"fnSetEventForForm"};
	 * @param pin :
	 *            var pin = {form:"schrForm", param:"&event_no=1111, rtnFunc:"fnSetEventForForm"};
	 * @param pin :
	 *            var pin = {form:"schrForm", param:"&event_no=1111};            
	 */
    fnEventSearchPop = function(pin) {

    	//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetEventForForm") };
		var strTitle = (pin.title == undefined) ? "이벤트조회" : pin.title;

		if (pin.form != undefined && pin.form != "") {

			var objForm = $("#" + pin.form);
			var strEvent_no = $("input[id=event_no]", objForm).val();
			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				event_no : (strEvent_no == "undefined") ? "" : strEvent_no,
				form : pin.form
			});			
		}
		
		if (pin.param != undefined) {			
			$.extend(pinParam, pin.param );
		}

		var defaultParam = {
				url : "/event/event/initEventSearchPop.action",
				winname : "EventSearchPop",
				title : strTitle,
				width: "850",
				height : "600",
				params : pinParam,
				scrollbars : true,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
	};

	fnSetEventForForm = function(pin) {
		$("input[id=event_no]", $("#" + pin.form)).val(pin.data[0]["EVENT_NO"]);
		$("input[id=event_nm]", $("#" + pin.form)).val(pin.data[0]["EVENT_NM"]);
		$("input[id=upper_event_resd_no]", $("#" + pin.form)).val(pin.data[0]["UPPER_EVENT_RESD_NO"]);
		$("input[id=prgs_stat_cd]", $("#" + pin.form)).val(pin.data[0]["PRGS_STAT_CD"]);
		$("input[id=event_start_dtime]", $("#" + pin.form)).val(pin.data[0]["EVENT_START_DTIME"]);
		$("input[id=event_end_dtime]", $("#" + pin.form)).val(pin.data[0]["EVENT_END_DTIME"]);
		$("input[id=entry_start_dtime]", $("#" + pin.form)).val(pin.data[0]["ENTRY_START_DTIME"]);
		$("input[id=entry_end_dtime]", $("#" + pin.form)).val(pin.data[0]["ENTRY_END_DTIME"]);
		$("input[id=event_kind_cd]", $("#" + pin.form)).val(pin.data[0]["EVEVENT_KIND_CDENT_NO"]);
		$("input[id=draw_mean_cd]", $("#" + pin.form)).val(pin.data[0]["DRAW_MEAN_CD"]);
		$("input[id=win_type_cd]", $("#" + pin.form)).val(pin.data[0]["WIN_TYPE_CD"]);
	};
    
	
	/**
	 * 상위이벤트상세페이지 호출
	 * fnEventDetailPop({UPPER_EVENT_RESD_NO : 상위이벤트번호})
	 */
    fnUpperEventPop = function(param){
		popup({
			url : "/event/event/initUpperEventPop.action",
			winname : "UpperEventDetail_Pop",
			title : "상위이벤트 상세",
			width:"860",
			height:"130",
			scrollbars : true,
			autoresize : false,
			form:"schrForm",
			params:param
		});
    };
    
    
	/**
	 * 이벤트상세페이지 호출
	 * fnEventDetailPop({event_no : 이벤트번호 , isBtn : true/버튼노출 , false,버튼숨김(상세)})
	 */
    fnEventDetailPop = function(param){
		popup({
			url : "/event/event/initEventDetailPop.action",
			winname : "EventDetail_Pop",
			title : "이벤트 상세",
			width:"1200",
			height:"800",
			scrollbars : true,
			autoresize : false,
			form:"schrForm",
			params:param
		});
    };
    
    
	/**
	 * 브랜드 조회 팝업 오픈 form에서 오픈할 경우
	 * 
	 * @param pin :
	 *            var pin = {form:"schrForm", param:{bbs_no:"test",
	 *            bbs_nm:"test", bbs_type_no:"10"}, rtnFunc:"fnSetBrandForForm"};
	 *            검색 시, bbs_no, bbs_nm 둘 중에 하나 선택 입력.
	 * @param pin :
	 *            var pin = {form:"schrForm",
	 *            param:"&inputVal=test&searchGubn=low&inputGubn=brand_nm", rtnFunc:"fnSetChnlInfo"};
	 */
	fnBbsListPop = function(pin) {
		
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetBbsForForm") };

		var strTitle = (pin.title == undefined) ? "게시판마스터 조회" : pin.title;
		
		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form);
			var strBbs_no = $("input[id=bbs_no]", objForm).val();
			var strBbs_nm = $("input[id=bbs_nm]", objForm).val();
			var strBbs_type_cd = $("input[id=bbs_type_cd]", objForm).val();
			//널처리
			if(strBbs_no == null){
				strBbs_no = "";
			}
			
			if(strBbs_nm == null){
				strBbs_nm = "";
			}

			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				bbs_no : (strBbs_no == "undefined") ? "" : strBbs_no,
				bbs_nm : (strBbs_nm == "undefined") ? "" : strBbs_nm,
				bbs_type_no : (strBbs_type_cd == "undefined") ? "" : strBbs_type_cd,
				form : pin.form
		    }); 
		}

		if (pin.param != undefined) {
			$.extend(pinParam , pin.param);
		}

		var defaultParam = {
				url : "/popup/forward.BbsMstPop.action",
				winname : "BbsMst_pop",
				title : strTitle,
				type : "xl",
				height : "750",
				params : pinParam,
				scrollbars : false,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});

		popup(pin);
		
	};
	
	fnSetBbsForForm = function(pin) {
		$("input[id=bbs_no]", $("#" + pin.form)).val(pin.data[0]["BBS_NO"]);
		$("input[id=bbs_nm]", $("#" + pin.form)).val(pin.data[0]["BBS_NM"]);
		$("input[id=clss_type_no]", $("#" + pin.form)).val(pin.data[0]["CLSS_TYPE_NO"]);
		$("input[id=clss_nm]", $("#" + pin.form)).val(pin.data[0]["CLSS_NM"]);
		$("input[id=bbs_kind_cd]", $("#" + pin.form)).val(pin.data[0]["BBS_KIND_CD"]);
	};
	
	/**
     * 상품상세조회 팝업
     * @param pin :
     *            var pin = {goods_no:"11111111111111"};
     */
    fnGoodsViewPop = function(pin) {
    	var strTitle = (pin.title == undefined) ? "상품상세" : pin.title;
    	if(pin.goods_no == null || pin.goods_no == ""){
    		alert("상품번호 정보가 누락되었습니다.");
    		return;
    	}
    	popup({
            url : "/goods/goods/initGoodsDetailPop.action",
            winname : "GoodsDetailPop",
            params :pin,
            width : "880",
            height : "650",
            scrollbars : false,
            resizable : false
        });
    };
    
    /**
     * 쿠폰조회 팝업
     * @param pin :
     *            var pin = {mbr_no:"201801251201230"};
     */
    fnResouViewPop = function(pin) {
    	var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnResouViewPop") };

    	var strTitle = (pin.title == undefined) ? "쿠폰조회" : pin.title;
    	
    	if (pin.param != undefined) {
			$.extend(pinParam, pin.param );
		}
    	
    	var defaultParam = {
			url : "/member/popup/forward.MbrResouViewPop.action",
			winname : "ResouDtlPop",
			title : strTitle,
			width : "500",
            height : "260",
			params : pinParam,
			scrollbars : false,
			autoresize : false
		};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
    };
    
	/**
	 *사은품관리조회 팝업 
	 * 
	 * @param pin :
	 *            var pin = {form:"schrForm", param:{gift_mgmt_nm:"test"}, rtnFunc:"fnSetGiftMgmtForForm"};
	 * @param pin :
	 *            var pin = {form:"schrForm", param:"&gift_mgmt_nm=1111, rtnFunc:"fnSetGiftMgmtForForm"};
	 */
	fnGiftListPop = function(pin) {
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetGiftMgmtForForm") };

		var strTitle = (pin.title == undefined) ? "사은품 관리조회" : pin.title;
		
		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form);
			var strGiftMgmtNm = $("input[id=gift_mgmt_nm]", objForm).val();
			var strGiftMgmtNo = $("input[id=gift_mgmt_no]", objForm).val();

			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				gift_mgmt_nm : (strGiftMgmtNm == "undefined") ? "" : strGiftMgmtNm,
				gift_mgmt_no : (strGiftMgmtNo == "undefined") ? "" : strGiftMgmtNo,
				form : pin.form
			}); 
		}
		
		if (pin.param != undefined) {
			
			$.extend(pinParam, pin.param);
		}

		var defaultParam = {
				url : "/goods/popup/forward.GiftListPop.action",
				winname : "GiftListPop",
				title : strTitle,
				type : "l",
				height : "500px",
				params : pinParam,
				scrollbars : false,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
	};
	
    /**
     * 게시글 조회팝업
     */
	fnBbsDetailListPop = function(pin){
		
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetBbsDtlForForm") };

		var strTitle = (pin.title == undefined) ? "게시글 조회" : pin.title;
		
		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form);
			
			var strBbsTypeCd = $("input[id=bbs_type_cd]", objForm).val();
			
			
	

			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				
				bbs_type_cd : (strBbsTypeCd == "undefined") ? "" : strBbsTypeCd,
				
				form : pin.form
		    }); 
		}

		if (pin.param != undefined) {
			$.extend(pinParam , pin.param);
		}

		var defaultParam = {
				url : "/popup/forward.BbsDetailListPop.action",
				winname : "BbsDetailList_pop",
				title : strTitle,
				width : "700",
				height : "484",
				params : pinParam,
				scrollbars : false,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
		
	};
	
	fnSetBbsDtlForForm = function(pin) {
		$("input[id=bbs_no]", $("#" + pin.form)).val(pin.data[0]["BBS_NO"]);
		$("input[id=bbs_dtl_no]", $("#" + pin.form)).val(pin.data[0]["BBS_DTL_NO"]);
		$("input[id=bbs_nm]", $("#" + pin.form)).val(pin.data[0]["BBS_NM"]);
		$("input[id=bbs_type_cd]", $("#" + pin.form)).val(pin.data[0]["BBS_TYPE_CD"]);
		$("input[id=title]", $("#" + pin.form)).val(pin.data[0]["TITLE"]);
		$("input[id=clss_nm]", $("#" + pin.form)).val(pin.data[0]["CLSS_NM"]);
		$("input[id=mbr_nm]", $("#" + pin.form)).val(pin.data[0]["MBR_NM"]);
	};
	
	/**
	 * 출력물 요청 팝업
	 */
	fnPreReqForForm = function(pin) {
		pin = $.extend(false, {
			url : "/system/auth/getStBtnMgmt.action",
			winname : "PrtReq_pop",
			title : "출력물요청",
			width : "600",
			height : "300",
			params : {},
			scrollbars : false,
			autoresize : false
		}, pin || {});
		popup(pin);
	};
	
	/**
     * sms발송팝업
     * pin : {rtnFunc : "callback function name", // 콜백
     * 		  reSearch : "Y/N" // 재조회 여부(defualt Y)
     * 		} 
     */
    fnInitSmsSendPop= function(pin) {

        var strTitle = (pin.title == undefined) ? "Sms발송" : pin.title;
        pin = $.extend({reSearch : "Y"}, pin);
        
        popup({
            url : "/system/sms/initSmsSendPop.action",
            method : "post",
            winname : "SmsSendPop",
            title : strTitle,
            width : "380px",
            height : "265px",
            params : pin,
            scrollbars : false,
            autoresize : false
        });
    };
    
    /**
     * email발송팝업
     * pin : {rtnFunc : "callback function name", // 콜백
     * 		  reSearch : "Y/N" // 재조회 여부(defualt Y)
     * 		} 
     */
    fnInitEmailSendPop= function(pin) {

        var strTitle = (pin.title == undefined) ? "Email발송" : pin.title;
        pin = $.extend({reSearch : "Y"}, pin);
        popup({
            url : "/system/popup/forward.EmailSendPop.action",
            method : "post",
            winname : "SmsSendPop",
            title : strTitle,
            width : "500px",
            height : "400px",
            params : pin,
            scrollbars : false,
            autoresize : false
        });
    };
    
	/**
     * 공지사항 상세
     * fnNotiViewPop({noti_no:strNotiNo, mode:'view'});
     * mode :  String형, 필수 X, 'view'로 넘길시 모든 수정이 불가한 상태로 창이 열린다.
     */ 	  		
	fnNotiViewPop = function(param){
		popup({
            url : "/content/noti/initNotiMgmtPop.action",
            winname : "notiViewPop",
            title : "공지사항 관리",
            params :param,
            type : "xl",
            width : "950",
            height : "750",
            scrollbars : true,
            autoresize : false
        });
	};
	
	/**
	 * 표준상품군1레벨 팝업 오픈 form에서 오픈할 경우
	 * 
	 * @param pin :
	 *            var pin = {form:"schrForm", param:{md_id:"1111"}, rtnFunc:"fnSetMdGsgrForForm"};
	 * @param pin :
	 *            var pin = {form:"schrForm",
	 *            param:"&md_id=1111",
	 *            rtnFunc:"fnSetMdGsgrForForm"};
	 */
	fnStdGsgr1lvlListPop = function(pin) {
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetStdGsgrForForm") };

		var strTitle = (pin.title == undefined) ? "표준상품군 조회" : pin.title;
		
		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form);
			var strMd_id = $("input[id=md_id]", objForm).val();

			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				md_id : (strMd_id == "undefined") ? "" : strMd_id,
				form : pin.form
			}); 
		}
		
		if (pin.param != undefined) {
			
			$.extend(pinParam, pin.param);
		}

		var defaultParam = {
				url : "/popup/forward.StdGsgr1LvlListPop.action",
				winname : "StdGsgr1lvlList_pop",
				title : strTitle,
				width : "660",
				height : "400",
				params : pinParam,
				scrollbars : false,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
	};
	
	
	/**
     * 상품평 조회팝업
     */
	fnGoodsEvalListPop = function(pin){
		
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetGoodsEvalForForm") };

		var strTitle = (pin.title == undefined) ? "상품평 조회" : pin.title;
		
		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {			

			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				
				form : pin.form
		    }); 
		}

		if (pin.param != undefined) {
			$.extend(pinParam , pin.param);
		}

		var defaultParam = {
				url : "/popup/forward.GoodsEvalListPop.action",
				winname : "GoodsEvalList_Pop",
				title : strTitle,
				width : "700",
				height : "600",
				params : pinParam,
				scrollbars : false,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
		
	};
	
	fnSetGoodsEvalForForm = function(pin) {
		$("input[id=goods_eval_no]", $("#" + pin.form)).val(pin.data[0]["GOODS_EVAL_NO"]);
		$("input[id=mbr_no]", $("#" + pin.form)).val(pin.data[0]["MBR_NO"]);
		$("input[id=mbr_nm]", $("#" + pin.form)).val(pin.data[0]["MBR_NM"]);
		$("input[id=title]", $("#" + pin.form)).val(pin.data[0]["TITLE"]);

	};
	
	
	/**
     * 상품등록팝업
     * 
     */
    fnGoodsInsPop = function(pin) {

        var strTitle = (pin.title == undefined) ? "상품등록" : pin.title;

        popup({
            url : "/goods/temporarygoods/initGoodsIns.action",
            winname : "GoodsIns_pop",
            title : strTitle,
            width : "1000",
            height : "800",
            params : pin,
            scrollbars : true,
            autoresize : false
        });
    };
    
    /**
     * 묶음상품등록팝업
     * 
     */
    fnSetGoodsMgmtPop = function(pin) {

        var strTitle = (pin.title == undefined) ? "세트상품등록" : pin.title;

        popup({
            url : "/goods/temporarygoods/initSetCmpsGoodsMgmt.action",
            winname : "SetGoodsMgmt_pop",
            title : strTitle,
            width : "1100",
            height : "800",
            params : pin,
            scrollbars : true,
            autoresize : false
        });
    };
    
	/**
     * 콜렉션상품팝업
     * 
     */
    fnCollGoodsMgmtPop = function(pin) {

        var strTitle = (pin.title == undefined) ? "콜렉션상품관리" : pin.title;

        popup({
            url : "/goods/temporarygoods/initCollEctionGoodsMgmtPop.action",
            winname : "SetGoodsMgmt_pop",
            title : strTitle,
            width : "1000",
            height : "650",
            params : pin,
            scrollbars : true,
            autoresize : false
        });
    };
    
    /**
     * 사은품상품등록팝업
     * 
     */
    fnGiftGoodsInsPop = function(pin) {

        var strTitle = (pin.title == undefined) ? "사은품상품등록" : pin.title;

        popup({
            url : "/goods/temporarygoods/initGiftGoodsMgmtPop.action",
            winname : "GiftGoodsIns_pop",
            title : strTitle,
            width : "1000",
            height : "800",
            params : pin,
            scrollbars : true,
            autoresize : false
        });
    };
    
    /**
	 * 접수 등록 팝업  (등록만 존재함 )
	 * 회원: fnCounselInsPop({param:{mbr_no:mbr_no}});
	 * 주문: fnCounselInsPop({param:{ord_no:ord_no}});
	 * 재접수: fnCounselInsPop({param:{counsel_no:counsel_no}});
	 * 상품문의: fnCounselInsPop({param:{good_quest_no:good_quest_no}});
	 * 신규접수 :fnCounselInsPop({param:{mode:'INS'}});
     */
    fnCounselInsPop = function(pin) {
    	//해당 받는 펑션은 기본으로 셋팅해 준다. 
    	var pinParam = {rtnFunc:((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"callback":"")};
		
        var strTitle = (pin.title == undefined) ? "상담 접수 팝업" : pin.title;
       
		if (pin.param != undefined) {
			$.extend(pinParam, pin.param );
		};

		var defaultParam = {
				url: "/counsel/counsel/initCounselInsPop.action",
				winname: "CounselInsPop",
				title: strTitle,
				width: "1000",
				height: "800",
	        	params:  pinParam,
				scrollbars: true,
				autoresize: false
	    };
		
	    pin = $.extend(defaultParam, pin||{});
	    
        popup(pin);
    };
    
    /**
	 * 상담 상세 화면 (상세만 존재함)
     */
    fnCounselDtlPop = function(pin) {
    	//해당 받는 펑션은 기본으로 셋팅해 준다. 
    	var pinParam = {popup_yn:"Y"};
		
        var strTitle = (pin.title == undefined) ? "상담 상세  팝업" : pin.title;
       
		if (pin.param != undefined) {
			$.extend(pinParam, pin.param );
		};

		var defaultParam = {
				url: "/counsel/counsel/initCounselDtlPop.action",
				winname: "CounselDtlPop",
				title: strTitle,
				width: "1200",
				height: "785",
	        	params:  pinParam,
				scrollbars: true,
				autoresize: false,
	            resizable : "yes"
	    };
		
	    pin = $.extend(defaultParam, pin||{});
	    
        popup(pin);
    };
    
    /**
	 * 상품문의 상세 화면  (상세만 존재함)
     */
    fnGoodsQuestDtlPop = function(pin) {
    	//해당 받는 펑션은 기본으로 셋팅해 준다. 
    	var pinParam = {rtnFunc:((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"callback":"")};
		
        var strTitle = (pin.title == undefined) ? "상품문의 상세 팝업" : pin.title;
       
		if (pin.param != undefined) {
			$.extend(pinParam, pin.param);
		};

		var defaultParam = {
				url: "/counsel/goodsquest/initGoodsQuestDtlPop.action",
				winname: "GoodsQuestDtlPop",
				title: strTitle,
				width: "1200",
				height: "700",
	        	params:  pinParam,
				scrollbars: true,
				autoresize: false,
            	resizable : "yes"
	    };
		
	    pin = $.extend(defaultParam, pin||{});
	    
        popup(pin);
    };
    
    /**
     * 송장조회
     * 
     * @param pin :
     *            var pin = {deli_no:"201205080000244", deli_seq:"1", invoice_no:"123456", parcel_comp_cd:"30"};
     */
    fnInvoiceViewPop = function(pin){
    	if (pin.invoice == "" || pin.parcel_comp_cd == "") {
			alert("배송 송장 추적을 위한 정보가 부족합니다. \n\송장번호, 택배사 정보 확인");
			return;
		};
		
		popup({
			url : "/deli/deli/initDeliInvoiceTrace.action",
			winname : "InvoiceTrace_pop",
            params : pin,
            height : "700px",
            width : "540px",
            scrollbars : true,
            autoresize : false
		});
    };
    
    
	/*
	 * 설문 관리
	 * fnPollDetailPop({mode:"INS"});
	 * fnPollDetailPop({mode:"UPT",poll_no:poll_no});
	*/
	fnPollDetailPop = function(param){
		popup({
			url : "/content/poll/initPollDetailPop.action",
			winname : "PollDetailPop",
			params : param,
			width : "800px",
			height : "680px",
			scrollbars : true,
			autoresize : false
		});
	}
	
	/**
	 * MD조회 팝업 오픈 form에서 오픈할 경우
	 * 
	 * @param pin :
	 *            var pin = {form:"schrForm", param:{user_id:"test",
	 *            user_nm:"test"}, rtnFunc:"fnSetUserForForm"};
	 * @param pin :
	 *            var pin = {form:"schrForm",
	 *            param:"&user_id=test&user_nm=test"&md_id=md_id,
	 *            rtnFunc:"fnSetUserForForm"};
	 */
	fnMDListPopForForm = function(pin) {
		
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetUserForForm") };

		var strTitle = (pin.title == undefined) ? "사용자 조회" : pin.title;
		//form이 존재 하는 경우 
	
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form);
			var strUser_id = $("input[id=user_id]", objForm).val();
			var strUser_nm = $("input[id=user_nm]", objForm).val();
			var strMd_id = $("input[id=md_id]", objForm).val();
			//널처리
			if (strUser_id == null){
				strUser_id ="";
			}
			if (strUser_nm == null){
				strUser_nm ="";
			}
			if (strMd_id == null){
				strMd_id ="";
			}

			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				user_id : (strUser_id == "undefined") ? "" : strUser_id,
				user_nm : (strUser_nm == "undefined") ? "" : strUser_nm,
				md_id : (strMd_id == "undefined") ? "" : strMd_id,
			  	   form : pin.form
		    }); 
		}

		if (pin.param != undefined) {
			$.extend(pinParam , pin.param);
		}

		var defaultParam = {
				url : "/popup/forward.MDListPop.action",
				winname : "MDList_pop",
				title : strTitle,
				type : "m",
				height : "520",
				params : pinParam,
				scrollbars : false,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
		
	};
	
	/**
	 * 설문 조회 팝업
	 * @param pin :
	 *		var pin = {	
	 *  		form:"schrForm",
	 *         	rtnFunc:"fnSetPollListPop"
	 *     	};
	 */
	fnPollListPop = function(pin) {

		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetPollListPop") };

		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form);
			var strPoll_no = $("input[id=poll_no]", objForm).val();
			var strPoll_nm = $("input[id=poll_nm]", objForm).val();
			

			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				poll_no : (strPoll_no == "undefined") ? "" : strPoll_no,
				poll_nm : (strPoll_nm == "undefined") ? "" : strPoll_nm,
				form : pin.form
			}); 
		}
	
		if (pin.param != undefined) {			
			$.extend(pinParam, pin.param );
		}
	
		var defaultParam = {
	            url : "/popup/forward.PollListPop.action",
	            winname : "PollListPop",
	            title : "설문 조회 팝업",
	            params :pinParam,
	            width: "800",
	            height : "550",
	            scrollbars : true,
	            autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);		
    };	
    
    fnSetPollListPop = function(pin) {
		$("input[id=poll_no]", $("#" + pin.form)).val(pin.data[0]["POLL_NO"]);
		$("input[id=poll_nm]", $("#" + pin.form)).val(pin.data[0]["POLL_NM"]);
	};
	
	
	
	/**
	 * 자산수동지급 팝업
	 * @param pin :
	 *		var pin = {	
	 *  		asset_manl_save_no : "asset_manl_save_no",
	 *     	};
	 */
	fnMbrAssetManualGivePop = function(pin) {
//		var strTitle = (pin.title == undefined) ? "자산수동지급 상세조회" : pin.title;
//		if(pin.rel_no == null || pin.rel_no == ""){
//			alert("관련 번호가 누락되었습니다.");
//			return;
//		} 
		popup({
			url : "/member/popup/forward.AssetManlGive.action",
			winname : "AssetManlGive_pop",
			params :pin,
			width : "880",
			height : "650",
			scrollbars : false,
			resizable : false
		});
	};
	
	/**
	 * 자산수동지급 상세조회 팝업
	 * @param pin :
	 *		var pin = {	
	 *  		asset_manl_save_no : "asset_manl_save_no",
	 *     	};
	 */
	fnsearchAssetManlDtlPop = function(pin) {
		var strTitle = (pin.title == undefined) ? "자산수동지급 상세조회" : pin.title;
    	if(pin.rel_no == null || pin.rel_no == ""){
    		alert("관련 번호가 누락되었습니다.");
    		return;
    	}
    	popup({
    		url : "/member/popup/forward.AssetManlDtl.action",
            winname : "AssetManlDtl_pop",
            params :pin,
            width : "880",
            height : "650",
            scrollbars : false,
            resizable : false
        });
	};

	//상담원 조회
    fnSearchCounselorPop = function(pin) {
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"") };

		var strTitle = (pin.title == undefined) ? "상담원 조회" : pin.title;
		
		if (pin.param != undefined) {
			$.extend(pinParam , pin.param);
		}

		var defaultParam = {
				url : "/counsel/popup/forward.CounselorPop.action",
				winname : "SearchCounselor_pop",
				title : strTitle,
				type : "m",
				height : "520",
				params : pinParam,
				scrollbars : false,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
	};
	
	//제휴몰 조회
	fnOutMallListPop = function(pin) {
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"") };

		var strTitle = (pin.title == undefined) ? "제휴몰 조회" : pin.title;
		
		if (pin.param != undefined) {
			$.extend(pinParam , pin.param);
		}

		var defaultParam = {
				url : "/vend/popup/forward.OutMallListPop.action",
				winname : "OutMallList_pop",
				title : strTitle,
				type : "m",
				height : "500",
				params : pinParam,
				scrollbars : false,
				autoresize : false
			};
		
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
	};
	/**
	 * pin = { param : { club_cd : "C"}}
	 * C = 클럽만 / D = 기본만 / 파라메터 없음 = 전체 조회
	 */
	//회원등급 조회
	fnMbrGradeListPop = function(pin){
		var pinParam = { rtnFunc : ((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetMbrGradeForForm")};
		
		var strTitle = (pin.title == undefined) ? "회원등급조회" : pin.title;
		
		if (pin.form != undefined && pin.form != ""){
			var objForm = $("#" + pin.form);
			var strClubNm = $("input[id=club_nm]", objForm).val();
			var strClubNo = $("input[id=club_no]", objForm).val();
			var strMbrGradeNm = $("input[id=mbr_grade_nm]", objForm).val();
			var strMbrGradeNo = $("input[id=mbr_grade_no]", objForm).val();
			//널처리
			if (strClubNm == null) strClubNm = "";
			if (strClubNo == null) strClubNo = "";
			if (strMbrGradeNm == null) strMbrGradeNm = "";
			if (strMbrGradeNo == null) strMbrGradeNo = "";
			
			$.extend(pinParam ,{
				club_nm : (strClubNm == "undefined") ? "" : strClubNm,
				club_no : (strClubNo == "undefined") ? "" : strClubNo,
				mbr_grade_nm : (strMbrGradeNm == "undefined") ? "" : strMbrGradeNm,
				mbr_grade_no : (strMbrGradeNo == "undefined") ? "" : strMbrGradeNo,
				form : pin.form
			});
		}
		
		if (pin.param != undefined) {
			$.extend(pinParam, pin.param);
		}
		
		var defaultParam = {
				url : "/popup/forward.MbrGradeListPop.action",
				winname : "MbrGradeList_pop",
				title : strTitle,
				type : "m",
				height : "450",
				params : pinParam,
				scrollbars : false,
				autoresize : false
		};
		
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
	};
	
	fnSetMbrGradeForForm = function(pin) {
		$("input[id=club_nm]", $("#" + pin.form)).val(pin.data[0]["CLUB_NM"]);
		$("input[id=club_no]", $("#" + pin.form)).val(pin.data[0]["CLUB_NO"]);
		$("input[id=mbr_grade_nm]", $("#" + pin.form)).val(pin.data[0]["MBR_GRADE_NM"]);
		$("input[id=mbr_grade_no]", $("#" + pin.form)).val(pin.data[0]["MBR_GRADE_NO"]);
	};
	
	/**
	 * 회사코드 조회 팝업 오픈
	 */
	fnCompListPopForForm = function(pin) {
		
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnCompListPopForForm") };

		var strTitle = (pin.title == undefined) ? "회사코드 조회" : pin.title;
		
		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form);
			var strComp_cd = $("input[id=comp_cd]", objForm).val();
			var strComp_nm = $("input[id=comp_nm]", objForm).val();
			var strComp_divd_cd = $("input[id=comp_divi_cd]", objForm).val();
			//널처리
			if(strComp_cd == null){
				strComp_cd = "";
			}
			
			if(strComp_nm == null){
				strComp_nm = "";
			}
			
			if(strComp_divd_cd == null){
				strComp_divd_cd = "";
			}

			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				comp_cd : (strComp_cd == "undefined") ? "" : strComp_cd,
				comp_nm : (strComp_nm == "undefined") ? "" : strComp_nm,					
				comp_divd_cd : (strComp_divd_cd == "undefined") ? "" : strComp_divd_cd,					
				form : pin.form
		    }); 
		}

		if (pin.param != undefined) {
			$.extend(pinParam , pin.param);
		}

		var defaultParam = {
				url : "/popup/forward.CompListPop.action",
				winname : "CompList_pop",
				title : strTitle,
				type : "xl",
				height : "450",
				params : pinParam,
				scrollbars : false,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
		
	};
	
	fnSetCompForForm = function(pin) {
		$("input[id=comp_cd]", $("#" + pin.form)).val(pin.data[0]["COMP_CD"]);
		$("input[id=comp_nm]", $("#" + pin.form)).val(pin.data[0]["COMP_NM"]);
		$("input[id=comp_divd_cd]", $("#" + pin.form)).val(pin.data[0]["COMP_DIVD_CD"]);
	};
	
	/**
	 * 매장조회
	 */
	fnStoreListPop = function(pin) {
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetStoreForForm") };
		var strTitle = (pin.title == undefined) ? "매장조회" : pin.title;
		if (pin.form != undefined && pin.form != "") {
			var objForm = $("#" + pin.form);
			var strBrandNo = $("input[id=brand_no]", objForm).val();
		
			//널처리
			if (strBrandNo == null){
				strBrandNo ="";
			}
			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				brand_no : (strBrandNo == "undefined") ? "" : strBrandNo,
			  	 form : pin.form
		    }); 
		}
		if (pin.param != undefined) {
			$.extend(pinParam , pin.param);
		}
		var defaultParam = {
			url : "/popup/forward.StoreListPop.action",
            winname : "StoreList_pop",
            title : strTitle,
            width: "900",
            height: "500",
            params : pinParam,
            scrollbars : true
		};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
	};
	fnSetStoreForForm = function(pin) {
		$("input[id=store_no]", $("#" + pin.form)).val(pin.data[0]["STORE_NO"]);
		$("input[id=store_nm]", $("#" + pin.form)).val(pin.data[0]["STORE_NM"]);
		$("input[id=erp_shop_cd]", $("#" + pin.form)).val(pin.data[0]["ERP_SHOP_CD"]);
	};
	
	fnMultiPostPopForForm = function(pin) {
		
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetMultiPostForForm") };

		var strTitle = (pin.title == undefined) ? "우편조회" : pin.title;
		
		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {

			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				form : pin.form
		    }); 
		}

		if (pin.param != undefined) {
			$.extend(pinParam , pin.param);
		}

		var defaultParam = {
				url : "/popup/forward.MultiPostListPop.action",
				winname : "MultiPostList_Pop",
				title : strTitle,
				width : "700",
				height : "580",
				params : pinParam,
				scrollbars : false,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
		
	};
	
	fnSetMultiPostForForm = function(pin) {
		$("input[id=post_no]", $("#" + pin.form)).val(pin.data[0]["POST_NO"]);
		$("input[id=road_base_addr]", $("#" + pin.form)).val(pin.data[0]["ROAD_BASE_ADDR"]);
		$("input[id=base_addr]", $("#" + pin.form)).val(pin.data[0]["BASE_ADDR"]);
		$("input[id=addr_divi_cd]", $("#" + pin.form)).val(pin.data[0]["ADDR_DIVI_CD"]);
	};
	
	fnGiftGoodsListPop = function(pin) {
    	if (!pin || pin.gift_mgmt_no == "") {
			alert("사은품 관리번호를 확인해주세요.");
			return;
		};
		
		popup({
			url : "/popup/forward.GiftGoodsListPop.action",
			winname: "GiftGoodsList_Pop",
            params: pin,
            width: "700",
            height: "350",
            scrollbars: true,
            autoresize: false
		});
	};
	
	/**
	 * 샘플링이벤트상세페이지 호출
	 */
    fnSampleEventDetailPop = function(param){
		popup({
			url : "/event/sample/initSampleEventDetailPop.action",
			winname : "SampleEventDetail_Pop",
			title : "이벤트 상세",
			width:"1200",
			height:"800",
			scrollbars : true,
			autoresize : false,
			form:"schrForm",
			params:param
		});
    };
    
    /**
	 * 임직원대우 업체조회팝업
	 * 
	 */
	fnStaffGrpCompPop = function(pin) {

		var defaultParam = {
				url : "/popup/forward.StaffGrpCompPop.action",
				winname : "StaffGrpCompPop_pop",
				title : "업체조회",
				width : "700",
				height : "500",
				params : pin,
				scrollbars : false,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
		
	};
	
	/**
     * 정기배송 세트상품 등록팝업
     * 
     */
    fnSetSubscGoodsMgmtPop = function(pin) {

        var strTitle = (pin.title == undefined) ? "정기배송세트상품등록" : pin.title;

        popup({
            url : "/goods/temporarygoods/initSetCmpsSubscGoodsMgmt.action",
            winname : "SetGoodsMgmt_pop",
            title : strTitle,
            width : "1100",
            height : "800",
            params : pin,
            scrollbars : true,
            autoresize : false
        });
    };
	
	
})(window);