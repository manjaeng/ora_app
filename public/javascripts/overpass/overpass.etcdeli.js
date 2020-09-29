(function ($) {
	
    /**
     * 기타배송 상세 팝업
     * fnEtcDeliViewPop({etc_deli_no:etc_deli_no});
     */
    fnEtcDeliViewPop = function(param) {
		popup({
            url : "/etcdeli/etcdeli/initEtcDeliViewPop.action",
            winname : "EtcDeliViewPop",
            title : "기타배송상세",
            params :param,
            width : "940px",
            height : "700px",
            scrollbars : false,
            autoresize : false
        });
    };
    
    /**
     * 기타배송불만관리 팝업
     * fnEtcDeliClaimMgmtPop({etc_deli_no:etc_deli_no});
     */
    fnEtcDeliClaimMgmtPop = function(param) {
		popup({
            url : "/etcdeli/etcdeli/initEtcDeliClaimMgmtPop.action",
            winname : "EtcDeliClaimMgmtPop",
            title : "기타배송불만관리",
            params :param,
            width : "940px",
            height : "750px",
            scrollbars : false,
            autoresize : false
        });
    };
    
    /**
     * 기타배송취소처리 팝업
     * fnEtcDeliCancelProcPop({etc_deli_no:etc_deli_no});
     */
    fnEtcDeliCancelProcPop = function(param) {
		popup({
            url : "/etcdeli/etcdeli/initEtcDeliCancelProcPop.action",
            winname : "EtcDeliCancelProcPop",
            title : "기타배송취소처리",
            params :param,
            width : "940px",
            height : "600px",
            scrollbars : false,
            autoresize : false
        });
    };
    
    
    /**
     * 기타배송반품처리 팝업
     * fnEtcDeliRetProcPop({etc_deli_no:etc_deli_no});
     */
    fnEtcDeliRetProcPop = function(param) {
		popup({
            url : "/etcdeli/etcdeli/initEtcDeliRetProcPop.action",
            winname : "EtcDeliRetProcPop",
            title : "기타배송반품처리",
            params :param,
            width : "940px",
            height : "600px",
            scrollbars : false,
            autoresize : false
        });
    };
    
    /**
     * 기타배송교환처리 팝업
     * fnEtcDeliChangeProcPop({etc_deli_no:etc_deli_no});
     */
    fnEtcDeliChangeProcPop = function(param) {
		popup({
            url : "/etcdeli/etcdeli/initEtcDeliChangeProcPop.action",
            winname : "EtcDeliChangeProcPop",
            title : "기타배송교환처리",
            params :param,
            width : "940px",
            height : "600px",
            scrollbars : false,
            autoresize : false
        });
    };
    
    /**
     * 기타배송송장번호일괄등록 팝업
     *
     */
    fnInvoiceBatchInsPop = function() {
		popup({
            url : " /etcdeli/etcdeli/forward.InvoiceBatchInsPop.action",
            winname : "InvoiceBatchInsPop",
            title : "기타배송송장번호일괄등록",
            width : "800px",
            height : "600px",
            scrollbars : false,
            autoresize : false
        });
    };
   

})(jQuery);