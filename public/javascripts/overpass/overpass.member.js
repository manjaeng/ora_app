(function ($) {
    $(document).ready(function () {
        $("div[id=search_off]").bind({
            keypress : function(event){
                if ( event.which == 13 ) {
                    event.preventDefault();
                    $("#srchBtn").click();
                }
            }
        });
    });
    
    /**
    * 회원비밀번호초기화
    */
    fnRestPwd = function(pin) {
        if (confirm("임시 비밀번호로 초기화 됩니다. \n초기화 하시겠습니까?")) {
            $.post(
                "/member/member/updateMbrPwdReset.action", 
                {
                    login_id: $("input[id=login_id]", $("#" + pin.form)).val(),
                    mbr_no: $("input[id=mbr_no]", $("#" + pin.form)).val()
                },
                function(data){
                    alert(data.resultMsg);
                },
                "json"
            );			
        }
    };
    
    /**
    * 회원등급이력관리
    */
    fnMbrGradeHistPop = function(param) {
        var sUrl = "/member/popup/forward.MbrGradeHistMgmtPop.action";
        param = $.extend({mbr_no:""}, param||{});
        popup({
            url : sUrl,
            winname : "MbrGradeHistMgmt_pop",
            title : "회원등급이력관리",
            params : param,
            width : "700",
            height : "270",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * 친구추천내역
     */
     fnMbrRecommHistPop = function(param) {
         var sUrl = "/member/popup/forward.MbrRecommHistPop.action";
         param = $.extend({mbr_no:""}, param||{});
         popup({
             url : sUrl,
             winname : "MbrRecommHist_pop",
             title : "친구 추천 내역",
             params : param,
             width : "800",
             height : "450",
             scrollbars : true,
             resizable : false
         });
     };
    
    /**
    * 회원자산/자원관리
    */
    fnMbrAssetResouMgmtPop = function(param) {
        var sUrl = "/member/popup/forward.MbrAssetResouMgmtPop.action";
        param = $.extend({mbr_no: "", mbr_type_cd: ""}, param||{});
        popup({
            url : sUrl,
            winname : "MbrAssetResouMgmt_pop",
            title : "회원자산/자원관리",
            params : param,
            width : "850",
            height : "540",
            scrollbars : true,
            resizable : false
        });
    };
    
    
    /**
    * 회원계좌정보관리
    */
    fnMbrAcctInfoPop = function(param) {
        var sUrl = "/member/popup/forward.MbrAcctInfoMgmtPop.action";
        param = $.extend({mbr_no: "", mbr_nm: ""}, param||{})
        popup({
            url: sUrl,
            winname: "MbrAcctInfoMgmt_pop",
            title: "회원계좌정보관리",
            params: param,
            width: "630",
            height: "320",
            scrollbars: true,
            resizable: false
        });
    };
    
    /**
    * 회원탈퇴관리
    */
    fnMbrWithdrawPop = function(pin) {
        //해당 받는 펑션은 기본으로 셋팅해 준다. 
        var pinParam = { rtnFunc :((pin.rtnFunc)? pin.rtnFunc:(pin.callback)?"callback":"") };
        
        var strTitle = (pin.title == undefined) ? "회원 탈퇴  팝업" : pin.title;
        
        if (pin.param != undefined) {
            $.extend(pinParam, pin.param );
        }
        var defaultParam = {
            url : "/member/popup/forward.MbrWithdrawPop.action",
            winname : "MbrWithdrawPop",
            title : strTitle,
            width : "400",
            height : "250",
            params :  pinParam,
            scrollbars : true,
            autoresize : false
        };
        
        pin = $.extend(defaultParam, pin||{});
        
        popup(pin);
    };
    
    /**
    * 현금환불팝업
    */
    fnMbrRefundPop = function(param) {
        var sUrl = "/member/member/getRefundAccount.action";
        param = $.extend({mbr_no:"", mbr_nm:"", refund_amt:"", divi_cd:"", asset_no:""}, param||{});
        popup({
            url : sUrl,
            winname : "MbrRefundRequire_Pop",
            title : "현금환불",
            params : param,
            width : "600",
            height : "220",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
    * 회원혜택 조회
    */
    fnMbrBeneListPop = function(pin) {
        var sUrl = "/member/popup/forward.MbrBeneListPop.action";
        
        var pinParam = { rtnFunc :((pin.rtnFunc)? pin.rtnFunc:(pin.callback)?"callback":"") };
        
        if (pin.param != undefined) {
            $.extend(pinParam, pin.param );
        }
        
        var defaultParam = {
        		url : sUrl,
                winname : "MbrBeneListPop",
                title : "회원혜택 조회",
                width : "600",
                height : "530",
                params :  pinParam,
                scrollbars : true,
                autoresize : false
            };
            
            pin = $.extend(defaultParam, pin||{});
            
            popup(pin);
            
    };
    
    /**
	 * 상품권포인트전환신청팝업
	 */
	fnMbrPntChgViewPop = function(param) {
		var sUrl = "/member/member/initGiftPntChgReq.action";
		param = $.extend({mbr_no : "", convt_receipt_no : ""}, param || {});
		popup({
			url : sUrl,
			winname : "MbrGiftPntChgReq_pop",
			title : "상품권포인트전환신청팝업",
			params : param,
			width : "770",
			height : "580",
			scrollbars : true,
			resizable : false
		});
	};
	
	/**
	 * 상품권포인트전환확정팝업
	 */
	fnMbrPntChgConfirmPop = function(param) {
		var sUrl = "/member/member/initGiftPntChgConfirm.action";
		param = $.extend({mbr_no : "", convt_receipt_no : ""}, param || {});
		popup({
			url : sUrl,
			winname : "MbrGiftPntChgConfirm_pop",
			title : "상품권포인트전환확정팝업",
			params : param,
			width : "770",
			height : "580",
			scrollbars : true,
			resizable : false
		});
	};
	
	/**
	 * 적립유형그룹 일괄 등록 팝업
	 */
	fnMbrSaveTypeBatchInsPop = function(param) {
		var sUrl = "/member/popup/forward.MbrSaveTypeBatchInsPop.action";
		param = $.extend({mbr_no: ""}, param || {});
		popup({
	        url: sUrl,
	        winname: "MbrSaveTypeBatchIns_pop",
	        title: "적립유형그룹일괄등록",
	        params: param,
	        width: "720",
	        height: "670",
	        scrollbars: true,
	        resizable: false
		});
	};   
	
	/**
	 * 적립유형그룹관리
	 */
	fnMbrSaveTypeGrpPop = function(param) {
		var sUrl = "/member/popup/forward.MbrSaveTypeGrpPop.action";
		popup({
			url: sUrl,
			winname: "MbrSaveTypeGrp_pop",
			title: "적립유형그룹관리",
			params: param,
			width: "650",
			height: "500",
			scrollbars: true,
			resizable: false
		});
	}; 
	
	/**
	 * 임직원포인트 지급 팝업
	 */
	fnMbrStaffPointBatchInsPop = function(param) {
		var sUrl = "/member/popup/forward.MbrStaffPointBatchInsPop.action";
		param = $.extend({mbr_no: ""}, param || {});
		popup({
	        url: sUrl,
	        winname: "MbrStaffPointBatchIns_pop",
	        title: "임직원포인트지급",
	        params: param,
	        width: "820",
	        height: "600",
	        scrollbars: true,
	        resizable: false
		});
	};   
	
	/**
	 * 회계코드(회계단위코드) selectbox생성
	 */
	 fnSetAcntUnitCdList = function(text) {
		text = typeof text !== 'undefined' ? text : "선택";
		// 상담분류-대분류
	    $.ajax({
	        url: "/member/member/searchAcntList.action",
	        dataType: "json",
	        async: false,
	        success : function(data) {
	            $("#erp_acnt_dept_cd option").remove();
	            $("#erp_acnt_dept_cd").attr("style", "width:120px");
	            $("#erp_acnt_dept_cd").append("<option value=''>" + text + "</option>");
//	            
	            $("#erp_acnt_unit_cd option").remove();
	            $("#erp_acnt_unit_cd").append("<option value=''>" + text + "</option>");
	            for(var idx = 0; idx < data.length; idx++){
	                $("#erp_acnt_unit_cd").append("<option value='" + data[idx].ERP_ACNT_UNIT_CD + "'>" + data[idx].ERP_ACNT_UNIT_NM + "</option>");
	            }
	        }
	    }); 
	};
	
	/**
	 * 회계코드(회계부서코드) selectbox생성
	 */
	 fnSetAcntDeptCdList = function(varAcntUnitCd, text) {
		text = typeof text !== 'undefined' ? text : "선택";
		// 상담분류-대분류
	    $.ajax({
	        url: "/member/member/searchAcntList.action",
	        dataType: "json",
	        data:{erp_acnt_unit_cd:varAcntUnitCd},
	        async: false,
	        success : function(data) {
	            $("#erp_acnt_dept_cd option").remove();
	            $("#erp_acnt_dept_cd").attr("style", "width:120px");
	            $("#erp_acnt_dept_cd").append("<option value=''>" + text + "</option>");
	            for(var idx = 0; idx < data.length; idx++){
	            	$("#erp_acnt_dept_cd").append("<option value='" + data[idx].ERP_ACNT_DEPT_CD + "'>" + data[idx].ERP_ACNT_DEPT_NM + "</option>");
	            }
	        }
	    }); 
	};		
	
	/**
    * 임직원대우 업체상세팝업
    */
	fnMbrStaffGrpCompPop = function(param) {
		var sUrl = "/member/member/initMbrStaffGrpCompDetailPop.action";
		popup({
			url : sUrl,
			winname : "MbrStaffGrpComp_pop",
			title : "업체상세",
			params : param,
			width : "770",
			height : "580",
			scrollbars : true,
			resizable : false
		});
	};
	
	/**
    * 임직원대우 회원상세팝업
    */
	fnMbrStaffGrpMbrPop = function(param) {
		var sUrl = "/member/member/initMbrStaffGrpMbrDetailPop.action";
		popup({
			url : sUrl,
			winname : "MbrStaffGrpMbr_pop",
			title : "임직원상세",
			params : param,
			width : "600",
			height : "400",
			scrollbars : false,
			resizable : false
		});
	};
	
	/**
    * 임직원대우 회원등록팝업
    */
	fnMbrStaffGrpMbrRegistPop = function(param) {
		var sUrl = "/member/member/registStaffGrpMbrMgmtPO.action";
		popup({
			url : sUrl,
			winname : "MbrStaffGrpMbrRegist_pop",
			title : "임직원등록",
			params : param,
			width : "600",
			height : "300",
			scrollbars : false,
			resizable : false
		});
	};

})(jQuery);