(function ($) {	
	$.fn.imageuploader.events = {
        Initialize: function () { //Grid 초기화시 발생이벤트        	
            //alert("Initialize");
        },
        ImageAdded: function (image) {         	
            //alert("Initialize");
        },
        EndSave: function (result) {   	//EndSave 종료시 발생 이벤트
            //alert("EndSave \n" + result.TotalCount);
        },
        EndLogin: function (result) {	//서버쪽 로그인 정보 없을 경우 발생
        	//alert("EndLogin \n");
        }
	};
})(jQuery);