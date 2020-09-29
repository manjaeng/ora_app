/**
 * js 에서 공통으로 사용하는 상수 지정.
 */
(function($) {
	
	//상수정의
	OVERPASS = {};
	OVERPASS.SILVERLIGHT = {
		VERSION:  "5.0"
	};
	
	OVERPASS.SILVERLIGHT = {
			VERSION:  "5.0"
	};
	
	OVERPASS.GRID = {
		type: "S",
		SILVERLIGHT: { type: "S" },
		JQGRID: { 
			type: "J"
//            global : {
//                excel_import_url : "/common/uploadExcel.action"
//            }
		},
		FLEXGRID: { 
			type: "F"
//			global : {
//				excel_import_url : "/common/uploadExcel.action"
//			}			
		}
	};
	
	OVERPASS.UPLOADER = {
		type: "S",
		SILVERLIGHT: { type: "S" },
		JS: { type: "J" }
	};
	
	
})(jQuery);