;(function ($) {
	ORDER.payments.kakao = {
		call: function(pay) {
			var mers = pay.mers;
			var ord_pay = ORDER.pay.ord_pays[pay.pay_seq];
			var form = ORDER.payments.createForm({
				id: "_KAKAO_PAY_FORM_"
			});
			
			if ($("#kakaopay_layer").length == 0) {
				$("<div id='kakaopay_layer'></div>").hide().appendTo("body");
			};
			
			kakaopayDlp.setTxnId(mers.TXN_ID);
			kakaopayDlp.setChannelType('WPM', 'TMS'); // PC결제
			kakaopayDlp.callDlp('kakaopay_layer', form.form, function(data) {
				if (data.RESULT_CODE == "00") {
					$.extend(ORDER.pay.ord_pays[pay.pay_seq], {
						pay_no: pay.mers.pay_no,
						appr_van_cd: pay.mers.van_cd
					});
					$.extend(ord_pay["_payments_"], {
						spu: data.SPU,
						spu_sign_token: data.SPU_SIGN_TOKEN,
						mpay_pub: data.MPAY_PUB,
						non_rep_token: data.NON_REP_TOKEN
					});
					ORDER.payments.payNext(pay.next);
				} else {
					ORDER.payments.throwError(data.RESULT_MSG);
				};
			});
		}
	};
})(jQuery);