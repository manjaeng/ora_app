(function ($) {
	var message = "사용할 수 없는 기능 입니다.";
	$.fn.imageuploader.functions = {
		/**
		 * 이미지 추가(조회된 이미지정보를 패널에 노출 시킨다)
		 * {
		 * 		opt_val_nm: string,		//B타입일 경우 셋팅
		 * 		images: [
		 * 			{	//사용자가 이미지 정보를 셋팅할 경우
		 * 				goods_no: string,
		 * 				img_seq: string,
		 * 				img_divi_cd: string,
		 * 				img_url: string,	//이미지의 full url 주소 (ex: http://image.overpass.co.kr/goods/96/69/68/49/1/149686996_1_550.jpg)
		 * 				color_no: string,
		 * 				disp_seq: number,
		 * 				upper_item_no: string,
		 * 				chip_yn: string 	//B타입의 경우 chip 이미지 여부(default: N)
		 * 			},
		 * 			...
		 * 		]
		 * }
		 */
		AddImages: function() {
			alert(message);
		},
        DoSave: function (p) {
        	alert(message);
        },
        Clear: function (p) {
        	alert(message);
        },
        GetImages: function(p) {
			alert(message);
		},
		ChangeColorCombo: function(p) {
        	alert(message);
        },
        /**
         * {
         * 		opt_val_nm: string,		//대상 이미지의 opt_val_nm(GetImages의 조회값)
         * 		col: number,				//대상 이미지의 순번(GetImages의 조회값)
         * 		img_divi_cd: string,		//변경 대상값
         * 		color_no: string			//변경 대상값
         * } 	
         */
		SetImage: function(p) {
			alert(message);
		}        
    };

})(jQuery);