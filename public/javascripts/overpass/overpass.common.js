/**
 * 공통 팝업
 */
(function(window) {

	/**
	 * site정보 selectbox로 생성
	 * 
	 * @param pin :
	 *            var pin = {objId:"site_no_slct", param:{user_id:$("#site_user_id").val()}};
	 */
	fnCreateSelectSite = function(pin){
		$("#" + pin.objId + " option").remove();
        $.ajax({
            url: "/system/site/searchSiteList.action",
            dataType: "json",
            data: pin.param,
            async: false,
            success : function(data) { 
            	$("#" + pin.objId).append("<option value=''>선택</option>");
                for(var idx = 0; idx < data.length; idx++){
                    $("#" + pin.objId).append("<option value='" + data[idx].site_no + "'>" + data[idx].site_nm + "</option>");
                }
            }
        });
	}
})(window);