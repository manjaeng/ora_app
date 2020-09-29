/**
 * 메인 화면 공지사항 팝업 처리
 */
(function ($) {
	$(document).ready(function() {
		$.ajax({
			url: "/content/noti/getCountPopUpNoti.action",
			dataType: "json",
			async: false,
			success : function(data) {
				var count = data.countPopUpNoti;
				if(count > 0){
					popup({
			            url : "/popup/initNotiListPop.action",
			            winname : "NotiList_pop",
			            title : "공지사항",
			            params :{popup_yn:"Y"},
		                type : "xl",
		                width : "800px",
		                height : "700x",
			            autoresize : false
			        });
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {alert("죄송합니다. 공지사항 리스트를 가져오지 못했습니다.");}
		});	
	});
})(jQuery);