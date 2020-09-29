(function(root, siv, $){
	'use strict';
	
	const _PV_BRAND_JAJU = [ "J1", "J2", "J3", "J4", "J5", "J6", "J7", "J8" ];
	
	/** 자주 브랜드 확인 */
	siv.isBrandJaju = function(brand_no) {	
		brand_no = $.trim(brand_no).toUpperCase();
		if (brand_no.length > 0 && $.inArray(brand_no, _PV_BRAND_JAJU) > -1) {
			return true;
		}
		return false;
	};
	
})(window, window.siv = window.siv || {}, window.jQuery);