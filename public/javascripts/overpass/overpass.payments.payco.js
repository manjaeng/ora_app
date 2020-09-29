;(function ($) {
	ORDER.payments.payco = {
		call: function(pay) {
			var mers = pay.mers;
			var ord_pay = ORDER.pay.ord_pays[pay.pay_seq];
			var certEnd = false;
			this.popupCallback = function(data) {
				if (data.paymentCertifyToken != "null" && data.reserveOrderNo != "null" && data.sellerOrderReferenceKey != "null") {
					certEnd = true;
					$.extend(ord_pay["_payments_"], {
						paymentCertifyToken: data.paymentCertifyToken,
						reserveOrderNo: data.reserveOrderNo
					});
					ORDER.payments.payNext(pay.next);
				};
			};			
			if (overpass.global.chnl_cd != "30" && overpass.global.chnl_cd != "40") { //모바일웹, 모바일앱이 아닐 경우
				(function() {
					var closeCheck = function() {
						if (certEnd === false && paycoPopup) {
							if (paycoPopup.closed == true) {							
								ORDER.payments.throwError("페이코 인증을 취소하셨습니다.");	
							} else {
								setTimeout(closeCheck, 1000 * 1);						
							};						
						};
					};
					var paycoPopup = window.open(mers.orderSheetUrl, "popupPayco", "top=100, left=300, width=727px, height=512px, resizble=no, scrollbars=yes");
					closeCheck();							
				})();		
			} else {	//모바일은 페이지 이동
				$.extend(ord_pay["_payments_"], {
					orderSheetUrl: mers.orderSheetUrl
				});
				ORDER.payments.payNext(pay.next);
			};
		}
	};
})(jQuery);