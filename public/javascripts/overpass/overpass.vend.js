(function ($) {
	$(document).ready(function () {
		$("div[id=search_off]").bind({
	        keypress : function(event){
	        	if ( event.which == 27 ) {
            		event.preventDefault();
            		$("#cnclBtn").click();
            	}
	        	if ( event.which == 13 && event.srcElement.tagName != "TEXTAREA" ) {
		        	event.preventDefault();
		        	$("#srchBtn").click();
	        	}
			}
	    });
	});
	
    /**
	 * 사업자 관리 팝업
     */
	fnBizMgmtPop = function(param) {
		var sUrl = "/vend/biz/forward.BizMgmtPop.action";
		var sHeight = "420";
		if (param != undefined && (param.mgmtGbn == "update" || param.mgmtGbn == "view")) {
			
			if (param.biz_mgmt_no == null || param.biz_mgmt_no == undefined || param.biz_mgmt_no == ""){
				alert("상세보기위한 정보가 충분하지 않습니다.");
				return;
			}
			
			sUrl = "/vend/biz/getBizView.action";
			sHeight = "440";
		}
		param = $.extend({biz_no:""}, param||{})
		popup({
            url : sUrl,
            winname : "BizMgmt_pop",
            title : "사업자관리",
            params : param,
            width:"580",
            height : sHeight,
            scrollbars : false,
            resizable : true
        });
    };
	
    /**
     * 상위 상품 공급 업체 관리 팝업
     */
	fnGoodSupplyVendMgmtPop = function(param) {
		
		if (param != undefined ){
			if (param.vend_no == null || param.vend_no == undefined || param.vend_no == "" ){
				alert("상세보기위한 정보가 충분하지 않습니다.");
				return;
			}
		}
		
    	param = $.extend({vend_no:""}, param||{})
    	popup({
            url : "/vend/vend/initGoodSupplyVendMgmtPop.action",
            winname : "GoodSupplyVendMgmt_pop",
            title : "상품공급업체 관리",
            params :param,
            type : "xl",
            height : "700",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * 출고지 관리 팝업
     */
    fnGoodsSupplyLowVendMgmtPop = function(param) {
    	param = $.extend({vend_no:"", vir_vend_no:""}, param||{})
        popup({
        	url : "/vend/vend/initGoodsSupplyLowVendMgmtPop.action",
            winname : "GoodSupplyLowVendMgmt_pop",
            title : "출고지관리",
            params :param,
            type : "xl",
            height : "650",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * 파트너 출고지관리 팝업
     */
    fnSvsGoodsSupplyLowVendMgmtPop = function(param) {
    	param = $.extend({vend_no:"", vir_vend_no:""}, param||{})
        popup({
        	url : "/vend/vend/initSvsGoodSupplyVendMgmtPop.action",
            winname : "GoodSupplyLowVendMgmt_pop",
            title : "출고지관리 팝업",
            params :param,
            type : "xl",
            height : "600",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * 주소등록 팝업
     */
    fnAddrMgmtPop = function(pin) {
    	var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetAddr") };
    	
    	if (pin.param != undefined) {
			$.extend(pinParam, pin.param );
		}
    	
        popup({
        	url : "/vend/popup/forward.AddrMgmtPop.action",
            winname : "AddrMgmt_pop",
            title : "주소등록",
            params :pinParam,
            width : "455",
            height : "255",
            scrollbars : true,
            resizable : false
        });
    };
    
    
    /**
     * 담당자등록 팝업
     */
    fnChargeMgmtPop = function(pin) {
    	var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetCharge") };
    	
    	if (pin.param != undefined) {
			$.extend(pinParam, pin.param );
		}
        popup({
        	url : "/vend/popup/forward.ChargeMgmtPop.action",
            winname : "ChargeMgmt_pop",
            title : "담당자등록",
            params :pinParam,
            width : "355",
            height : "290",
            scrollbars : true,
            resizable : false
        });
    };
    
    
    /**
     * 사업자 번호 확인
     */
    fnBizInfoChck = function (field, divi) {
    	if (field.val() == "") {
    		alert("사업자 번호를 입력하세요");
    		return;
    	}
        $.post("/vend/biz/getChkBizNo.action", 
                {biz_no : field.val().replaceAll("-", "")}, 
                function(data){
                    if (data == null || data == "") {
                        alert("오류");
                    }
                    if (data.chk_yn == "Y") {
                    	fnBizMgmtPop({rtnFunc:"fnGetBizInfo", chk_biz_no:field.val().replaceAll("-", "")});
                        return;
                    } else if (data.chk_yn == "out" ) { 
                    	alert("휴폐업된 사업자입니다. \n\r확인후 다시 진행하세요");
                    	return;
                    } else{
                    	var pin = {biz_no:field.val(), biz_divi_cd:divi};
                        fnGetBizInfo(pin);
                    }
                    return;
                }, 
                "json");
    };
    
    /**
	 * 사업자등록번호 값 검사
	 * @param  field     $()
	 * @param  isNeedMsg 메세지 노출여부
	 * @return boolean
	 */
	isNotValidBIDVal = function(field, isNeedMsg) {
		var bid = field.val().replaceAll("-", "");
		// 입력값 검사
		if(isEmpty(field)) {
			if(isNeedMsg) {
				alert('사업자 등록번호를 입력해 주십시요.');
			}
			return true;
		}

    	for (var i = 0 ; i < bid.length ; i++){
	    	var c = bid.charCodeAt(i);
	       	if ( !(0x30 <= c && c <= 0x39)) {
	       		alert("사업자등록번호는 숫자로만 기입해 주세요!");
	       		return true;
	       	};
    	};
    	
		if(bid.length != 10) {
			if(isNeedMsg) {
				alert('사업자 등록번호는 하이픈을 제외하고 10자를 입력하셔야 합니다.');
			}
			return true;
		}
		
		var checkID = new Array(1, 3, 7, 1, 3, 7, 1, 3, 5, 1);
		var chkSum = 0;

		for (var i = 0; i <= 7; i++ ) {
			chkSum += checkID[i] * bid.charAt(i);
		}

		var c2 = "0" + (checkID[8] * bid.charAt(8));
		c2 = c2.substring(c2.length - 2, c2.length);

		chkSum += Math.floor(c2.charAt(0)) + Math.floor(c2.charAt(1));

		var remander = (10 - (chkSum % 10)) % 10 ;

		if (Math.floor(bid.charAt(9)) != remander) {
			if(isNeedMsg) {
				alert('사업자등록번호가 정확하지 않습니다.');
			}
			return true;
		}
		return false;
		
	};
	
	/**
	 * 주민등록번호 Check
	 * @param pid1 주민번호
	 * @return boolean
	 */
	isNotValidPIDVal = function(field, isNeedMsg) {

		var pid = field.val().replaceAll("-", "");
		// 입력값 검사
		if(isEmpty(field)) {
			if(isNeedMsg) {
				alert('주민등록번호를 입력해 주십시요.');
			}
			return true;
		}
		
    	for (var i = 0 ; i < pid.length ; i++){
	    	var c = pid.charCodeAt(i);
	       	if ( !(0x30 <= c && c <= 0x39)) {
	       		alert("주민등록번호는 숫자로만 기입해 주세요!");
	       		return true;
	       	};
    	};
    	
    	if(pid.length != 13) {
			if(isNeedMsg) {
				alert('주민등록번호는 하이픈을 제외하고 13자를 입력하셔야 합니다.');
			}
			return true;
		}

		nlength = pid.length;
		num1 = pid.charAt(0);
		num2 = pid.charAt(1);
		num3 = pid.charAt(2);
		num4 = pid.charAt(3);
		num5 = pid.charAt(4);
		num6 = pid.charAt(5);
		num7 = pid.charAt(6);
		num8 = pid.charAt(7);
		num9 = pid.charAt(8);
		num10 = pid.charAt(9);
		num11 = pid.charAt(10);
		num12 = pid.charAt(11);

		var total = (num1 * 2) + (num2 * 3) + (num3 * 4) + (num4 * 5)  + (num5 * 6) + (num6 * 7) +
					(num7 * 8) + (num8 * 9) + (num9 * 2) + (num10 * 3) + (num11*4)  + (num12 * 5);
		total = (11 - (total % 11)) % 10;

		if(total != pid.charAt(12)) {
			if(isNeedMsg) {
				alert("주민등록번호가 올바르지 않습니다. \n다시 입력해 주세요!");
			}
			return true;
		}
		return false;
	};
	
	/*
	 *
	 */
	
	 /**
	 * 센터 관리 팝업
     */
	fnCenterMgmtPop = function(param) {
		var sUrl = "/vend/center/initCenterMgmtPop.action";
		param = $.extend({center_no:""}, param||{})
		var iHeight;
		if(param.diviHeight !=null && param.diviHeight !="" && param.diviHeight !=undefined){
			iHeight =param.diviHeight;
		}else{
			iHeight = "780";
		}
		
		popup({
            url : sUrl,
            winname : "CenterMgmt_pop",
            title : "센터관리",
            params : param,
            type : "xl",
            height : iHeight,
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * 채널 관리 팝업
     */
    fnChnlMgmtPop = function(param) {
		if (param != undefined ){
			if (param.chnl_no == null || param.chnl_no == ""){
				alert("상세보기위한 정보가 충분하지 않습니다.");
				return;
			}
		}
		
    	param = $.extend({chnl_no:""}, param||{})
    	popup({
            url : "/vend/chnl/initChnlMgmtPop.action",
            winname : "chnlMgmt_pop",
            title : "채널 관리",
            params :{chnl_no:param.chnl_no},
            type : "xl",
            height : "700",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * B2E거래처 관리 팝업
     */
	fnB2EVendMgmtPop = function(param) {
		if (param != undefined ){
			if (param.vend_no == null || param.vend_no == undefined || param.vend_no == "" ||
	    		param.biz_no == null || param.biz_mgmt_no == undefined || param.biz_no == "" ){
				alert("상세보기위한 정보가 충분하지 않습니다.");
				return;
			}
		}
		
    	param = $.extend({vend_no:""}, param||{})
    	popup({
            url : "/vend/b2e/initB2EVendMgmtPop.action",
            winname : "B2EVendMgmt_pop",
            title : "B2E거래처 관리",
            params :{vend_no:param.vend_no},
            type : "xl",
            height : "670",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * B2E하위거래처 관리 팝업 
     */
    fnB2ELowVendMgmtPop = function(param) {
    	
    	param = $.extend({vend_no:"", vir_vend_no:""}, param||{})
        popup({
        	url : "/vend/b2e/initB2ELowVendMgmtPop.action",
            winname : "B2ELowVendMgmt_pop",
            title : "B2E하위거래처 관리",
            params :{vend_no:param.vend_no, vir_vend_no:param.vir_vend_no},
            type : "xl",
            height : "570",
            scrollbars : true,
            resizable : false
        });
    };
    
	/**
	 * <pre>
	 * NumberCheck 후 숫자 값만 리턴
	 * 빈공간을 허용한다.
	 * </pre>
	 * @param field $(), form String
	 * @return val
	 * 0x2D ==> -
	 */
	isNumberForVendValSet = function(field, form){
		var val = field.val();
		for (var i = 0 ; i < val.length ; i++){
	    	var c = val.charCodeAt(i);
	       	if (!(0x30 <= c && c <= 0x39)) {
	       		alert("숫자만 입력 가능합니다.");
	       		return val.substring(0, i);
	       	};
    	};
    	
    	return val;
	};
	
	/**
	 * <pre>
	 * field Empty 및 공백 처리
	 * error_msg가 ""이면 alert와 focusing을 하지 않는다
	 * </pre>
	 * @param field $()
	 * @param error_msg 에러 Message
	 * @return boolean
	 */
	isEmptyForVend = function(field, error_msg) {
		if (isEmpty(field)) {
			alert(error_msg);
			field.focus() ;
			field.select();
			return true;
		}
		return false;
	};	
	
	/**
	 * <pre>
	 * NumberCheck
	 * 빈공간을 허용한다.
	 * </pre>
	 * @param field $()
	 * @param error_msg 에러 message
	 * @return boolean
	 */
	isNumberForVend = function(field, error_msg, blank_yn){
		
		if (isEmpty(field)) {
			if ($.type(blank_yn) == "boolean" && !blank_yn) {
				alert(error_msg);
				field.focus();
				field.select();
				return true;
			} else {
				return false;
			}
		}
		
		if (!isNumber(field)) {
			alert(error_msg);
			field.focus();
			field.select();
			return true;
		}
		return false;
	};
	/**
     * 매장 정보 관리 팝업
     */
    fnStoreMgmtPop = function(param) {
    	param = $.extend({store_no:""}, param||{})
        popup({
        	url : "/vend/store/initStoreMgmtPop.action",
            winname : "StoreMgmt_pop",
            title : "매장 정보 관리",
            params :param,
            type : "xl",
            height : "600",
            scrollbars : true,
            resizable : false
        });
    };
	
})(jQuery);