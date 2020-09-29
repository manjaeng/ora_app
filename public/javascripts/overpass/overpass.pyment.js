(function ($) {
	
    
    /**
     * 가맹점관리 팝업
     * 
     */
    fnMersMgmtPop = function(param) {
		popup({
            url : "/payment/mers/initMersMgmtPop.action",
            winname : "MersMgmtPop",
            title : "가맹점 관리",
            params :param,
            type : "xl",
            height : "750px",
            scrollbars : true,
            autoresize : false
        });
    };
	
    
    /**
     * 가상계좌 일괄등록
     * 
     */
    fnVirAccountNoBatchInsPop = function() {
		popup({
            url : "/payment/bank/forward.VirAccountNoBatchInsPop.action",
            winname : "VirAccountNoBatchInsPop",
            title : "가상계좌일괄등록",
            type : "l",
            height : "650px",
            scrollbars : true,
            autoresize : false
        });
    };
    
    /**
     * 수수료등록팝업
     * 
     */
    fnRateInfoInsPop = function() {
		popup({
            url : "/payment/mers/forward.CmRateInfoInsPop.action",
            winname : "RateInfoInsPop",
            title : "수수료등록",
            width:"840px",
            height : "650px",
            scrollbars : true,
            autoresize : false
        });
    };
    
    /**
     * 수수료상세팝업
     * 
     */
    fnInItCmrateInfoMgmtPop = function(param) {
		popup({
            url : "/payment/mers/inItCmrateInfoMgmtPop.action",
            winname : "CmrateInfoMgmtPop",
            title : "수수료상세",
            params :param,
            width:"840px",
            height : "300px",
            scrollbars : true,
            autoresize : false
        });
    };
    
    
    
    /**
     * 자산상세현황 팝업
     * 
     */
    fnAssetStatDtlPop = function(param) {
		popup({
            url : "/pay/popup/forward.AssetStatDtlPop.action",
            winname : "AssetStatDtlPop",
            title : "자산상세현황",
            params : param,
            type : "xl",
            height : "650px",
            scrollbars : true,
            autoresize : false
        });
    };
    
    /**
     * 넘버체크
     * 
     */
	//숫자인지확인 실수 정수 모두가능
	isFloat = function(value){
		var reg = /^[+-]?\d*(\.?\d*)$/;
		return reg.test(value);
	};
	
	/**
	 * 계좌인증
	 * @param p : {"client_no":"100000", "bank_cd":"20", "morc_nm":"홍길동", "acct_no":"200010000100001"} 
	 */
	fnChkAccountConfirm = function(pin,booleanCallback) {
	
		if (pin.client_no == "") {
			alert("고객사 정보가 존재하지 않습니다.");
			return true;
		}
	    
		if (pin.bank_cd == "") {
			alert("은행 정보가 존재하지 않습니다.");
			return true;
		}
		
		if (pin.morc_nm == "") {
			alert("계좌 소유주 정보가 존재하지 않습니다.");
			return true;
		}
		
		if (pin.acct_no == "") {
			alert("계좌번호 정보가 존재하지 않습니다.");
			return true;
		}
		
		var p = {
	            "client_no"   : pin.client_no,
	            "mers_divi_cd": "30",
	            "pay_mean_cd" : pin.pay_mean_cd,
	            "banksett"    : pin.bank_cd,
	            "nmcomp"      : pin.morc_nm,
	            "noacct"      : pin.acct_no                      
	    };

	    queryAccount({data: p}, 
	    	function(callback){
		    	if (callback.strRet != "000"){
		            alert("오류코드 : "+ callback.strRet +"\n\r오류내용 : "+callback.strErrMsg);
		            booleanCallback(true);
		            
		    	} else {
		    		alert("인증 되었습니다.");
		            booleanCallback(false);
		    	}
	     	}
	    );
	    
	};
	
	/**
	 * 계좌인증
	 * @param p : {"client_no":"100000", "bank_cd":"20", "morc_nm":"홍길동", "account_no":"200010000100001"} 
	 */
	fnCertAccount = function(pin,booleanCallback) {
	
		if (pin.client_no == "") {
			alert("고객사 정보가 존재하지 않습니다.");
			return;
		}
	    
		if (pin.bank_cd == "") {
			alert("은행 정보가 존재하지 않습니다.");
			return;
		}
		
		if (pin.morc_nm == "") {
			alert("계좌 소유주 정보가 존재하지 않습니다.");
			return;
		}
		
		if (pin.account_no == "") {
			alert("계좌번호 정보가 존재하지 않습니다.");
			return;
		}
		
		var p = {
		        "client_no"   : pin.client_no,
		        "site_no"     : pin.site_no,
		        "bank_cd"     : pin.bank_cd,
		        "morc_nm"     : pin.morc_nm,
		        "account_no"  : pin.account_no
		};
		
	    /* 계좌 인증 성공 여부 setting */
		$.ajax({
			type : 'POST',
			url:"/pay/refund/certAccount.action",
			dataType: "json",
			data: p,
			async: false,
			success : function(data) {
				booleanCallback(data.certResult);
			},
			error:function(request,status,error){
		        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		    }

		});
	};
	
	
})(jQuery);