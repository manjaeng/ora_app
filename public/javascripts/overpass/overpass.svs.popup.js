/**
 * SVS 공통 팝업
 */
(function($) {

	/**
     * 상위 상품 공급 업체 관리 팝업
     */
	fnSvsGoodSupplyVendMgmtPop = function(param) {
    	popup({
            url : "/vend/vend/initSvsGoodSupplyVendMgmtPop.action",
            winname : "SvsGoodSupplyVendMgmt_pop",
            title : "상품공급업체 관리",
            params :param,
            type : "xl",
            height : "800",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * 하위 상품 공급 업체 관리 팝업
     */
    fnSvsGoodSupplyLowVendMgmtPop = function(param) {
        popup({
        	url : "/vend/vend/initGoodsSupplyLowVendMgmtPop.action",
            winname : "SvsGoodSupplyLowVendMgmt_pop",
            title : "하위업체관리",
            params :param,
            type : "xl",
            height : "800",
            scrollbars : true,
            resizable : false
        });
    };
	
})(jQuery);