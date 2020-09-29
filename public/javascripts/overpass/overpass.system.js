(function ($) {	
	
	/**
     * 화면찾기
     */
	fnScrMgmtListPop = function(pin) {

		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetScrForForm") };

		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form);
			var strScr_no = $("input[id=scr_no]", objForm).val();
			var strScr_nm = $("input[id=scr_nm]", objForm).val();

			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				scr_no : (strScr_no == "undefined") ? "" : strScr_no,
				scr_nm : (strScr_nm == "undefined") ? "" : strScr_nm,
				form : pin.form
			}); 

		}
	
		if (pin.param != undefined) {			
			$.extend(pinParam, pin.param );
		}
	
		var defaultParam = {
	            url : "/system/popup/forward.ScrMgmtListPop.action",
	            winname : "ScrMgmtPop",
	            title : "화면찾기",
	            params :pinParam,
	            width: "700",
	            height : "565",
	            scrollbars : true,
	            autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);		
    };	

    fnSetScrForForm = function(pin) {
		$("input[id=scr_no]", $("#" + pin.form)).val(pin.data[0]["SCR_NO"]);
		$("input[id=scr_nm]", $("#" + pin.form)).val(pin.data[0]["SCR_NM"]);
	};
	
	/**
     * 화면찾기 - 고객사조인X
     */
	fnScrMgmtNoClientListPop = function(pin) {

		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetScrNoClientForForm") };

		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form);
			var strScr_no = $("input[id=scr_no]", objForm).val();
			var strScr_nm = $("input[id=scr_nm]", objForm).val();

			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				scr_no : (strScr_no == "undefined") ? "" : strScr_no,
				scr_nm : (strScr_nm == "undefined") ? "" : strScr_nm,
				form : pin.form
			}); 

		}
	
		if (pin.param != undefined) {			
			$.extend(pinParam, pin.param );
		}
	
		var defaultParam = {
	            url : "/system/popup/forward.ScrMgmtNoClientListPop.action",
	            winname : "ScrMgmtNoClientPop",
	            title : "화면찾기",
	            params :pinParam,
	            width: "700",
	            height : "565",
	            scrollbars : true,
	            autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);		
    };	

    fnSetScrNoClientForForm = function(pin) {
		$("input[id=scr_no]", $("#" + pin.form)).val(pin.data[0]["SCR_NO"]);
		$("input[id=scr_nm]", $("#" + pin.form)).val(pin.data[0]["SCR_NM"]);
	};
	
    /**
     * 업무그룹찾기
     */
	fnWorkGrpListPop = function(pin) {

		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetWorkGrpForForm") };

		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form)
			var strWork_grp_no = $("input[id=work_grp_no]", objForm).val();
			var strWork_grp_nm = $("input[id=work_grp_nm]", objForm).val();

			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				work_grp_no : (strWork_grp_no == "undefined") ? "" : strWork_grp_no,
				work_grp_nm : (strWork_grp_nm == "undefined") ? "" : strWork_grp_nm,
				form : pin.form
			}); 

		}
	
		if (pin.param != undefined) {			
			$.extend(pinParam, pin.param );
		}
	
		var defaultParam = {
	            url : "/system/popup/forward.WorkGrpListPop.action",
	            winname : "WorkGrpListPop",
	            title : "업무그룹",
	            params :pinParam,
	            width: "600",
	            height : "455",
	            scrollbars : true,
	            autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);		
    };	

    fnSetWorkGrpForForm = function(pin) {
		$("input[id=work_grp_no]", $("#" + pin.form)).val(pin.data[0]["WORK_GRP_NO"]);
		$("input[id=work_grp_nm]", $("#" + pin.form)).val(pin.data[0]["WORK_GRP_NM"]);
	};
	
	/**
     * 메뉴찾기
     */
	fnMenuListPop = function(pin) {

		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetMenuForForm") };

		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form)
			var strMenu_no = $("input[id=menu_no]", objForm).val();
			var strMenu_nm = $("input[id=menu_nm]", objForm).val();
			var strSys_divi_cd = $("input[id=sys_divi_cd]", objForm).val();

			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				menu_no : (strMenu_no == "undefined") ? "" : strMenu_no,
				menu_nm : (strMenu_nm == "undefined") ? "" : strMenu_nm,
				sys_divi_cd : (strSys_divi_cd == "undefined") ? "" : strSys_divi_cd,
				form : pin.form
			}); 

		}
	
		if (pin.param != undefined) {			
			$.extend(pinParam, pin.param );
		}
	
		var defaultParam = {
	            url : "/system/popup/forward.MenuListPop.action",
	            winname : "MenuListPop",
	            title : "메뉴찾기",
	            params :pinParam,
	            width: "650",
	            height : "570",
	            scrollbars : true,
	            autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);		
    };	

    fnSetMenuForForm = function(pin) {
		$("input[id=menu_no]", $("#" + pin.form)).val(pin.data[0]["MENU_NO"]);
		$("input[id=menu_nm]", $("#" + pin.form)).val(pin.data[0]["MENU_NM"]);
		$("input[id=scr_nm]", $("#" + pin.form)).val(pin.data[0]["SCR_NM"]);
		$("input[id=sys_divi_cd]", $("#" + pin.form)).val(pin.data[0]["SYS_DIVI_CD"]);
	}; 
	
	
	/**
     * 사이트관리 
     * mode: insert, update
     * site_no
     */
	fnsiteMgmtPop = function(pin) {
        var strTitle = (pin.title == undefined) ? "사이트관리" : pin.title;

        popup({
            url : "/system/site/initSiteMgmtPop.action",
            winname : "사이트관리",
            title : strTitle,
            type : "xl",
            height : "750",
            params : pin,
            scrollbars : true,
            autoresize : false
        });
    };
    
    
    /**
     * 시스템공지
     * mode: insert, read
     */
    fnsysNoticePop = function(pin) {
    	var strTitle = (pin.title == undefined) ? "시스템공지" : pin.title;
    	
    	popup({
    		url : "/system/system/StSysNoticePop.action",
    		winname : "시스템공지",
    		title : strTitle,
    		type : "xl",
    		height : "750",
            params : pin,
            scrollbars : true,
            autoresize : false    		
    	});
    };
    
    
    /**
     * 프로퍼티관리
     * gubun/client_no or site_no
     */
	fnAttrMgmtPop = function(pin) {
        var strTitle = (pin.title == undefined) ? "프로퍼티관리" : pin.title;

        popup({
            url: "/system/site/initAttrMgmtPop.action",
            winname: "프로퍼티관리",
            title: strTitle,
            type: "xl",
            height: "750",
            params: pin,
            scrollbars: true,
            autoresize: false
        });
    };
    
    /**
     * B2E회원등록 
     */
    fnB2EMemBatchInsPop= function(pin) {
        var strTitle = (pin.title == undefined) ? "B2E회원등록" : pin.title;

        popup({
            url : "/system/popup/forward.B2EMemBatchInsPop.action",
            winname : "B2E회원등록",
            title : strTitle,
            type : "xl",
            height : "750",
            params : pin,
            scrollbars : true,
            autoresize : false
        });
    };
    
    /**
     * 패스워드 초기화
     */
    fnRestUserPwd = function (pin) {
		if(confirm("패스워드 초기화 하시겠습니까?")) {
			$.post('/system/user/updateUserPwdReset.action', 
					{user_id:$("input[id=user_id]", $("#" + pin.form)).val()},
					function(data){
						alert(data.resultMsg);
						$("input[id=pwd]", $("#" + pin.form)).val($("input[id=user_id]", $("#" + pin.form)).val());
						$("input[id=init_yn_chk]", $("#" + pin.form)).attr("checked",true);
					},
					"json");			
		}
    };
    
    /**
     * 패스워드 초기화
     */
    fnRestUserPwdPin = function (pin) {
		if(confirm("패스워드 초기화 하시겠습니까?")) {
			$.post('/system/user/updateUserPwdReset.action', 
					{user_id:pin.user_id},
					function(data){
						alert(data.resultMsg);
					},
					"json");			
		}
    };
    
    /**
     * 위젯추가
     */
	fnWidgetListPop = function(pin) {
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc : ((pin.rtnFunc)?pin.rtnFunc:"") };
		
		if (pin.param != undefined) {			
			$.extend(pinParam, pin.param );
		}
	
		var defaultParam = {
				url : "/system/popup/forward.WidgetListPop.action",
	            winname : "WidgetListPop",
	            title : "위젯추가",
	            params :pinParam,
	            width: "700",
	            height : "565",
	            scrollbars : true,
	            autoresize : false
		};
		
		pin = $.extend(defaultParam, pin||{});
		popup(pin);		
    };	
    
    /**
     * OPENAPI추가
     */
	fnOpenApiListPop = function(pin) {
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc : ((pin.rtnFunc)?pin.rtnFunc:"") };
		
		if (pin.param != undefined) {			
			$.extend(pinParam, pin.param );
		}
	
		var defaultParam = {
				url : "/system/popup/forward.OpenApiListPop.action",
	            winname : "OpenApiListPop",
	            title : "OPENAPI추가",
	            params :pinParam,
	            width: "700",
	            height : "565",
	            scrollbars : true,
	            autoresize : false
		};
		
		pin = $.extend(defaultParam, pin||{});
		popup(pin);		
    };
    
    /**
     * 출력관리화면 오픈
     */
	fnReqMgmtPop = function(pin) {
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"") };
		
		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form)
			var strPrt_no = $("input[id=prt_no]", objForm).val();
		
			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				prt_no : (strPrt_no == "undefined") ? "" : strPrt_no,
				form : pin.form
			}); 
		
		}
		
		if (pin.param != undefined) {			
			$.extend(pinParam, pin.param );
		}
		
		var defaultParam = {
		        url : "/system/print/getStPrtMgmtExt.action",
		        winname : "PrtMgmtPop",
		        title : "출력물승인관리",
		        params :pinParam,
		        width: "700",
		        height : "555",
		        scrollbars : true,
		        autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);	

    }; 
    
    /**
     * 업무연락관리
     * work_tel_no 존재 시
     *  1. 발송일자 존재시 - 상세보기 형식으로 팝업 오픈 (수정 기능 없음.)
     *  2. 발송일자 미 존재시 - 발송 가능 형식으로 팝업 오픈
     * work_tel_no 미 존재 시
     *  1. 업무연락 작성 가능 하도록 팝업 오픈
     * fnWorkTelInfoMgmtPop({work_tel_no:"<%=Const.ST_WORK_TEL_DIVI_CD_SEND%>"});
     */ 
    fnWorkTelInfoMgmtPop = function(param){
		popup({
            url : "/system/worktel/initWorkTelInfoMgmtPop.action",
            winname : "WorkTelInfoInsPop",
            params :param,
            title : "업무연락 등록",
            type : "l",
            width: "600px",
            height : "650px",
            scrollbars : true,
            autoresize : false
        });
    };
    
    /**
     * 업무연락  수신자찾기
     * fnWorkTelGrpRecvListPop({multi_yn:"<%=Const.BOOLEAN_TRUE%>",form:'schrForm'});
     */ 	  
    fnWorkTelGrpRecvListPop = function(param){
		popup({
        url : "/system/popup/forward.WorkTelGrpRecvListPop.action",
        winname : "WorkTelGrpRecvListPop",
        title : "업무연락수신자 찾기",
        params :param,
        type : "xl",
        height : "650px",
        scrollbars : true,
        autoresize : false
    });
  };
  
    
    /****
     * 공통 코드 옵션1의 코드값을 불러온다.
     * 
     * @param selector selectBox option을 추가할 아이디 지정
     */
    
    $.dispBatchCode = function(selector) {

    	var _obj = $(selector); 
    	
    	_obj.batchDiviList = function (p){
    		$.ajax({url:"/system/code/searchStCommCdDtlList.action", 
			    dataType: "json",
        	    data: {comm_cd:p.comm_cd, use_yn : p.use_yn, grp_cd1 : p.grp_cd1,method:"json"},
        	    async: false,
    	        success : function(data){

    	        	var key;
                    //데이타를 넣기 전에 삭제 한번 함 
                    $(selector+' option').remove();
                    
                    if( data == null || data == "" ){
                        // 검색결과가 존재하지 않음
                        return;
                    }
                    _obj.append("<option value='' >전체</option>");
                    
                    $.each(data , function (sub , optionData){
                    	_obj.append("<option value='" + optionData.comm_dtl_cd + "' >" + optionData.cd_nm + "</option>");                  
                    });

         
                },
            	error: function(jqXHR, textStatus, errorThrown) {
					alert("jqXHR1 : " + jqXHR.responseText  + "\n" + "textStatus : " + textStatus + "\n" + "errorThrown : " + errorThrown);					
				}
		      });
    	};
    	
    	return _obj;
    };
    
    
    /***
     * 네임 스페이스 생성 
     */
    
    if(!$.batchGrid){
    	$.batchGrid = {};
    };
    
    /***
     * 배치 그리드에서 발생하는 이벤트가 많아짐에 따라
     * 
     * @param cell 그리드 셀 정보
     * @param batchGrid 그리드 생성 객체.
     * @param objRow 각 로우(행)들의 정보
     * 
     */     
	$.batchGrid.eventfuncs = function (cell, batchGrid, objRow) {
		
		var _obj = this;
		
		/***
		 * 그리드에 배치종류에 따라 배치 구분 콤보를 생성한다. 
		 * @param comm_cd 공통 코드 
		 * @param grpCd1 공통코드 옵션1에 추가한 코드.
		 */
		_obj.createCodeCombo = function(comm_cd, grpCd1){
	   		 if(cell.Id == "BATCH_KIND_CD"){
	  		   batchGrid.CreateCombo({
	  			   row : cell.Row,
	  			   id  : "BATCH_DIVI_CD",
	  			   combo : { action:"/system/code/searchStCommCdDtlList.action", cd:"comm_dtl_cd", name:"cd_nm", params: {comm_cd:comm_cd, use_yn : "Y", grp_cd1 : grpCd1 ,method:"json"}}
	  		   });
	   		 };
		};

		/***
		 * 동일한 사이트에 동일 배치 구분 코드가 존재하는지 체크한다.
		 * @param comm_cd 공통 코드 
		 * @param grpCd1 공통코드 옵션1에 추가한 코드.
		 */
		_obj.checkBatchDiviCodeDuplicate = function(){
			
		    if(cell.Id == "BATCH_DIVI_CD"){
		    	
		    	var batchDivi = batchGrid.GetValue({row: cell.Row,id : "BATCH_DIVI_CD"});
				var siteNo = batchGrid.GetValue({row: cell.Row,id : "SITE_NO"});
				
				if (siteNo == "" ) return;
			    $.post(
				    "/system/batch/checkBatchList.action",
				    {
						batch_divi_cd : batchDivi,
						site_no : siteNo
				    },				        	  
				    function(data){				        		
				  
						if(batchDivi != "" && siteNo != "") {
					        if(cell.OrgValue != cell.Value && data == true ){
						        alert("해당사이트에 동일한 배치구분코드가 존재합니다");
								batchGrid.SetValue({
								    row : cell.Row,
									id  : "BATCH_DIVI_CD",
									value : ""
								});							        			  
								return;
							};
						};
				}, 
				"json");
			};
		};
		
		return _obj;
	};
	
	/**
     * SMS바이트 체크
     * smsCounter('msg_cont', 80, 'msg_cont_limit', 'ismms', 'Y');
     * 
     * textid:텍스트에어리어 필드
     * limit:제한할바이트
     * limitid:바이트수표시할html테그아이디
     * ismms:mms로전송될지여부를저장할 인풋히든필드
     * mmsuseyn:mms전송사용여부(Y/N) 값이없을경우 default 지원안함N
     */
	smsCounter = function(textid, limit, limitid, ismms, mmsuseyn){
		var text = $('#'+textid).val(); //텍스트 에어리어에 들어온값 	
        var strTemp        = "";
        var strByte = 0; //현재입력된 바이트
        var li_len  = 0; // substring하기 위해서 사용 

        for (var i = 0; i < text.length; i++){
            var strChar = text.substring(i, i + 1); //입력값
            var l = 0;
            if (strChar == '\n'){
                strTemp += strChar;
                strByte += 2;
            }else {
                strTemp += strChar;
                strByte += (strTemp.charCodeAt(i) > 128) ? 2 : 1;
            };
            
            if(strByte <= limit){
                li_len = i + 1;
            };
        };
        
        if(mmsuseyn == "Y"){
        	if(limit - strByte < 0){
            	$('#'+limitid).text("MMS전송 : ".concat(strByte.toString()));
            	$('#'+ismms).val("Y");
            } else {
            	 $('#'+limitid).text(strByte);
            	 $('#'+ismms).val("N");
            };
        } else {
        	if(limit - strByte < 0){
        		alert("글자를 초과 입력할수 없습니다. 초과된 내용은 자동으로 삭제 됩니다.");
        		$('#'+textid).val(strTemp.substr(0, li_len));
                $('#'+limitid).text(limit);
                $('#'+ismms).val("N");
        	} else {
        		$('#'+limitid).text(strByte);
        		$('#'+ismms).val("N");
        	};
        };
    };
	
    /*// 개인정보 화면 로그등록처리 - 삭제
    fnSavePrsnInfoScrLog = function(result){
        $.post("/system/system/registPrsnInfoScrLog.action", 
        		"&sel_cond="+result.sel_cond + "&header_info="+result.header_info + "&action_nm="+result.action_nm + "&prsn_scr_no=" + result.scr_no + "&result_cnt=" + result.result_cnt
        		+ "&prsn_srch_auth_cd=" + OVERPASS.prsn_srch_auth_cd); 	    	
    }*/
    
    
    /**
     * 개인정보화면로그 상세팝업오픈
     */
	fnPrsnInfoScrLogPop = function(pin) {
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"") };
		
		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form)
			var strPrsn_log_no = $("input[id=prsn_log_no]", objForm).val();
		
			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
			$.extend(pinParam ,{
				prsn_log_no : (strPrsn_log_no == "undefined") ? "" : strPrsn_log_no,
				form : pin.form
			}); 
		
		}
		
		if (pin.param != undefined) {			
			$.extend(pinParam, pin.param );
		}
		
		var defaultParam = {
		        url : "/system/system/initPrsnInfoScrLogPop.action",
		        winname : "PrsnInfoScrLogPop",
		        title : "개인정보화면로그 상세",
		        params :pinParam,
		        width: "700",
		        height : "555",
		        scrollbars : true,
		        autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);	
    };
    
	/**
	 * 개인정보사용자조회 팝업 
	 */
	fnPrsnUserListPop = function(pin) {
		
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetPrsnUserForForm") };

		var strTitle = (pin.title == undefined) ? "개인 정보 사용자 조회" : pin.title;

		if (pin.param != undefined) {
			$.extend(pinParam , pin.param);
		}

		var defaultParam = {
				url : "/system/popup/forward.PrsnUserListPop.action",
				winname : "UserListPop",
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
	
	fnSetPrsnUserForForm = function(pin) {
		$("input[id=user_id]", $("#" + pin.form)).val(pin.data[0]["USER_ID"]);
		$("input[id=user_nm]", $("#" + pin.form)).val(pin.data[0]["USER_NM"]);
	};
	
})(jQuery);