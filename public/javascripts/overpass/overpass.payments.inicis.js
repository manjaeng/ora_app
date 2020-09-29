;(function ($) {
	var PAY_MEAN_CD_CARD = "11";
	var PAY_MEAN_CD_RBANK = "12";
	var PAY_MEAN_CD_VBANK = "13";
	var INICIS_PAY_METHOD = (function() {
		var m = {};
		m[PAY_MEAN_CD_CARD] = "Card";
		m[PAY_MEAN_CD_RBANK] = "DirectBank";
		m[PAY_MEAN_CD_VBANK] = "Vbank";
		return m;
	})();
	var INICIS_PAY_URL = (function() {
		var m = {};
		m[PAY_MEAN_CD_CARD] = "https://mobile.inicis.com/smart/wcard/";
		m[PAY_MEAN_CD_RBANK] = "https://mobile.inicis.com/smart/bank/";
		m[PAY_MEAN_CD_VBANK] = "https://mobile.inicis.com/smart/vbank/";
		return m;
	})();
	var isCreate = false;	//이니시스 팝업 처리 여부(중복 방지)

	ORDER.payments.inicis = {
		cancelCert: function(message) {		//인증전에 플러그인창 close했을 경우 처리
			INIStdPay.viewOff();
			ORDER.payments.throwError("결제를 취소 하였습니다.");
		},
		call: function(pay) {
			if (overpass.global.chnl_cd != "30" && overpass.global.chnl_cd != "40") { //모바일웹, 모바일앱이 아닐 경우
				ORDER.payments.inicis.payWebStandard(pay);
			} else {
				ORDER.payments.inicis.payMobile(pay);
			};
		},
		payWebStandard: function(pay) {
			var mers = pay.mers;
			var ord_pay = ORDER.pay.ord_pays[pay.pay_seq];
			var form = ORDER.payments.createForm({
				id: "_INICIS_FORM_",
				method: "post",
			});			
			form.addInput({ name: "version", value: "1.0" });
			form.addInput({ name: "payViewType", value: "popup" });
			form.addInput({ name: "mid", value: mers.mers_no });					
			form.addInput({ name: "goodname", value: pay.disp_goods_nm });
			form.addInput({ name: "oid", value: mers.pay_no });
			form.addInput({ name: "price", value: pay.pay_amt });
			form.addInput({ name: "currency", value: "WON" });
			form.addInput({ name: "buyername", value: pay.orderer_nm });
			form.addInput({ name: "buyertel", value: pay.cell_no1 + "-" + pay.cell_no2 + "-" + pay.cell_no3 });
			form.addInput({ name: "buyeremail", value: pay.email });
			form.addInput({ name: "timestamp", value: mers.timestamp });
			form.addInput({ name: "signature", value: mers.signature });
			form.addInput({ name: "mKey", value: mers.mKey });
			form.addInput({ name: "gopaymethod", value: INICIS_PAY_METHOD[pay.pay_mean_cd] });
			form.addInput({ name: "acceptmethod", value: (function() {		//결제수단 추가옵션
				if (pay.pay_mean_cd == PAY_MEAN_CD_CARD) {
					return "ini_onlycardcode(" + mers.van_if_cardcomp_no + ")";
				} else if (pay.pay_mean_cd == PAY_MEAN_CD_RBANK) {
					return "no_receipt";
				} else if (pay.pay_mean_cd == PAY_MEAN_CD_VBANK) {
					return "no_receipt:vbank(" + pay.bank.expiry_date + ")";
				};
			})() });
			form.addInput({ name: "returnUrl", value: location.protocol +"//" + location.host + "/overpass-payments/inicis/inicisCert.action" });
			form.addInput({ name: "popupUrl", value: location.protocol +"//" + location.host + "/overpass-payments/inicis/inicisPopup.action" });			
			
			(function() {
				var popupClose = INIStdPay.popupClose;
				var cert = false;
				if (isCreate === false) {
					INIStdPay.popupClose = function() {
						if (cert === false) {
							ORDER.payments.inicis.cancelCert();								
						};
						popupClose();
					};					
				};
				isCreate = true;
				
				ORDER.payments.inicis.popupCallback = function(data) {
					var ord_pay = ORDER.pay.ord_pays[pay.pay_seq];
					if (data.resultCode == "0000") {
						cert = true;
						popupClose();
						$.extend(ord_pay["_payments_"], {
							authToken: data.authToken, authUrl: data.authUrl
						});
						ORDER.payments.payNext(pay.next);
					} else {
						ORDER.payments.throwError("죄송합니다. 결제수단 인증에 실패하였습니다[이니시스1].");
						popupClose();
					};
				};
				INIStdPay.pay(form.form);
			})();
		},
		payMobile: function(pay) {
			var mers = pay.mers;
			var ord_pay = ORDER.pay.ord_pays[pay.pay_seq];
			var form_data = {
				P_CHARSET: "utf8",
				P_MID: mers.mers_no,
				P_OID: mers.pay_no,
				P_AMT: pay.pay_amt, 
				P_UNAME: pay.orderer_nm,
				P_GOODS: pay.disp_goods_nm,
				P_RESERVED: (function() {
					if (pay.pay_mean_cd == PAY_MEAN_CD_CARD) {
						var quota = (pay.cardcomp.noint_mon > 9 ? "" : "0") + pay.cardcomp.noint_mon;
						return "twotrs_isp=Y&block_isp=Y&twotrs_isp_noti=N&d_card=" + mers.van_if_cardcomp_no + "&d_quota=" + quota;
					} else if (pay.pay_mean_cd == PAY_MEAN_CD_RBANK) {
						return "bank_receipt=N";					
					} else {
						return "";
					};
				})(),				
				action: INICIS_PAY_URL[pay.pay_mean_cd],
				accept_charset: "euc-kr"
			};
			if (pay.pay_mean_cd == PAY_MEAN_CD_RBANK) {
				form_data.P_RETURN_URL = "https://molocal.overpass.co.kr/sample/registOrder.action";
				form_data.P_NOTI_URL = "http://dev.overpass.co.kr/inicis/notiInicis.action";				
			} else {
				form_data.P_NEXT_URL = "https://molocal.overpass.co.kr/sample/registOrder.action";
			};			
			
			$.extend(ord_pay["_payments_"], {
				form_data: form_data
			});
			ORDER.payments.payNext(pay.next);
		}
	};
})(jQuery);