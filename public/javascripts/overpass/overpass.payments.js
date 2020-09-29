;(function ($) {
	var VAN_INICIS = "00";
	var VAN_KSNET = "10";
	var VAN_KAKAO = "20";	
	var VAN_PAYCO = "30";
	var PAY_MEAN_CD_CARD = "11";
	var PAY_MEAN_CD_RBANK = "12";
	var PAY_MEAN_CD_VBANK = "13";
	var van_pays = (function() {
		var pays = {};
		pays[PAY_MEAN_CD_CARD] = PAY_MEAN_CD_CARD;
		pays[PAY_MEAN_CD_RBANK] = PAY_MEAN_CD_RBANK;
		pays[PAY_MEAN_CD_VBANK] = PAY_MEAN_CD_VBANK;
		return pays;
	})();
			
	ORDER.payments = {
		callback: null,
		throwError: null,
		callPlugin: function(p) {
			var ord_pays = [];	//실결제 수단 정보
			var ord_mst = ORDER.mst.ord_mst;
			var orderer_nm = $.type(ord_mst.orderer_nm) == "string" ? ord_mst.orderer_nm : "" ;
			var email = $.type(ord_mst.email) == "string" ? ord_mst.email : "" ;
			var cell_no = ($.type(ord_mst.cell_no1) == "string" && $.type(ord_mst.cell_no2) == "string" && $.type(ord_mst.cell_no3) == "string") ? ord_mst.cell_no1 + ord_mst.cell_no2 + ord_mst.cell_no3 : "" ;
			var cell_no1 = ($.type(ord_mst.cell_no1) == "string") ? ord_mst.cell_no1 : "";
			var cell_no2 = ($.type(ord_mst.cell_no2) == "string") ? ord_mst.cell_no2 : "";
			var cell_no3 = ($.type(ord_mst.cell_no3) == "string") ? ord_mst.cell_no3 : "";
			var disp_goods_nm = "";
			var disp_goods_count = 0;			
			$.each(ORDER.goods.ord_goods, function() {
				if (disp_goods_nm == "") {
					disp_goods_nm = this.disp_goods_nm;
				};
				disp_goods_count++;
			});
			if (disp_goods_count > 1) {
				disp_goods_nm += " 외" + (disp_goods_count - 1) + "건";
			};
			
			if ($.type(p.callback) != "function") {
				throw "callback이 존재하지 않습니다!";
			};
			if ($.type(p.throwError) != "function") {
				throw "callback이 존재하지 않습니다[THROW]!";
			};
			this.callback = function() {
				p.callback({
					order_data: ORDER.createOrderData()
				});
			};
			this.throwError = p.throwError;
			
			ORDER.pay.ord_pays = {};	//결제 정보 초기화
			$.each(ORDER.pay.pays, function(pay_seq) {
				var pay = this;
				if (pay.getPayYn()) {
					var ord_pay = {						
						pay_seq: pay_seq,
						pay_mean_cd: pay.pay_mean_cd,
						pay_amt: pay.pay_amt,
						orderer_nm: orderer_nm,
						email: email,
						cell_no: cell_no,
						cell_no1: cell_no1,
						cell_no2: cell_no2,
						cell_no3: cell_no3,
						disp_goods_nm: disp_goods_nm
					};
					if (pay.pay_mean_cd == PAY_MEAN_CD_CARD) {
						var cardcomp;					
						if ($.type(pay.getCardcomp) != "function") {
							throw "신용카드 정보를 조회할 수 없습니다[CARDCOMP].";
						};
						cardcomp = $.extend({}, pay.getCardcomp());
						if (cardcomp.kakao !==  true && cardcomp.payco !== true) {
							if (cardcomp.isp_yn != "Y" && cardcomp.isp_yn != "N") {
								throw "신용카드 정보가 올바르지 않습니다[ISP여부]";
							};
							if (cardcomp.isp_yn != "Y" && $.type(cardcomp.card_code) != "string" && cardcomp.card_code == "") {
								throw "신용카드 정보가 올바르지 않습니다[카드구분]";
							};
							if ($.type(cardcomp.noint_mon) != "string") {
								throw "신용카드 정보가 올바르지 않습니다[할부구분]";
							};
							if ((+pay.pay_amt) < 50000 && cardcomp.noint_mon != "") {
								throw "5만원 이상 결제시 할부 가능 합니다.";	
							};
							if (cardcomp.noint_mon != "") {
								cardcomp.noint_mon = (+cardcomp.noint_mon);
							} else {
								cardcomp.noint_mon = 0;
							};							
						};
						ord_pay.cardcomp = cardcomp;
					} else if (pay.pay_mean_cd == PAY_MEAN_CD_VBANK) {
						var bank;
						if ($.type(pay.getBank) != "function") {
							throw "입금은행 정보를 조회할 수 없습니다[BANK].";
						};
						bank = $.extend({}, pay.getBank());
						if ($.type(bank.bank_cd) != "string" || bank.bank_cd == "") {
							throw "입금은행 정보가 올바르지 않습니다";
						};
						if ($.type(bank.morc_nm) != "string" || bank.morc_nm == "") {
							throw "입금자 정보가 올바르지 않습니다";
						};
						if ($.type(bank.expiry_date) != "string" || bank.expiry_date == "") {
							throw "입금일자 정보가 올바르지 않습니다";
						};
						ord_pay.bank = bank;
					};
					ORDER.pay.ord_pays[pay_seq] = {};
					ord_pays.push(ord_pay);
				};
			});
			$.each(ord_pays, function(i) {
				this["next"] = ord_pays[i + 1];
			});
			if (ord_pays.length > 0) {
				this.payNext(ord_pays[0]);
			} else {
				this.callback();
			};	
		},
		payNext: function(pay) {
			var invalidMers = function() {
				ORDER.payments.throwError("가맹점 정보를 찾을 수 없습니다");	
			};
			if ($.type(pay) == "object") {
				pay = $.extend({ cardcomp: {} }, pay);
				if (van_pays[pay.pay_mean_cd]) {	//VAN 결제의 경우 가맹점번호 및 VAN_CD 조회
					$.ajax({
						url: location.protocol +"//" + location.host + "/overpass-payments/getMers.action",
						type: "POST",
						dataType: "json",
						data: (function() {
							var param = {
								site_no: ORDER.mst.ord_mst.site_no,
								client_no: ORDER.mst.ord_mst.client_no,
								chnl_cd: overpass.global.chnl_cd, 
								pay_mean_cd: pay.pay_mean_cd,
								pay_amt: pay.pay_amt,
								kakao: pay.cardcomp.kakao || false,
								payco: pay.cardcomp.payco || false,
								cardcomp_no: pay.cardcomp.cardcomp_no || "",
								orderer_nm: pay.orderer_nm,
								email: pay.email,
								cell_no1: pay.cell_no1,
								cell_no2: pay.cell_no2,
								cell_no3: pay.cell_no3,
								disp_goods_nm: pay.disp_goods_nm
							};
							if (pay.cardcomp.kakao === true) {	//KAKAO추가 정보
								//결제요청타입(MPM : 모바일결제, WPM : PC결제)
								//채널타입(2: 모바일결제, 4: PC결제)
								$.extend(param, (function() {
									if (overpass.global.chnl_cd == "30" || overpass.global.chnl_cd == "40") {	//모바일웹, 모바일앱
										return { channelType: "2", prType: "MPM" };
									} else {
										return { channelType: "4", prType: "WPM" };
									};								
								})());
							} else if (pay.cardcomp.payco === true) {	//PAYCO추가 정보
								$.extend(param, (function() {
									var p = {
										ord_qty_sum: (function() {
											var ord_qty_sum = 0;
											$.each(ORDER.goods.ord_goods, function(i, goods) {
												ord_qty_sum += goods.ord_qty;
											});
											return ord_qty_sum;
										})()
									};
									if (overpass.global.chnl_cd == "30" || overpass.global.chnl_cd == "40") {		//모바일웹, 모바일앱
										$.extend(p, {
											payco_return_url: pay.cardcomp.payco_return_url ? pay.cardcomp.payco_return_url : "https://" + location.host + "/order/registOrder.action",
											payco_cancel_mobile_url: "https://" + location.host + "/order/cancelPayco.action",
											payco_in_app_yn: overpass.global.chnl_cd == "40" ? "Y" : "N",
											payco_order_channel: "MOBILE",
											payco_app_url: overpass.global.app_cd == "iOS" ? overpass.global.app_mall + "://" : ""
										});	
									} else {
										$.extend(p, {
											payco_return_url: location.protocol +"//" + location.host + "/overpass-payments/payco/paycoCertPopup.action",
											payco_cancel_mobile_url: "",
											payco_in_app_yn: "N",
											payco_order_channel: "PC",
											payco_app_url: ""
										});	
									};
									return p;
								})());
							};
							return param;
						})(),
						success: function(data) {
							if (data.code == "0000") {
								pay.mers = data;
								$.extend(ORDER.pay.ord_pays[pay.pay_seq], {
									pay_no: pay.mers.pay_no,
									appr_van_cd: pay.mers.van_cd,
									_payments_: {
										orderer_nm: pay.orderer_nm,
										email: pay.email,
										disp_goods_nm: pay.disp_goods_nm,
										cell_no1: pay.cell_no1,
										cell_no2: pay.cell_no2,
										cell_no3: pay.cell_no3						
									}
								});
								switch (pay.mers.van_cd) {
									case VAN_INICIS:
										ORDER.payments.inicis.call(pay);
										break;
									case VAN_KSNET:
										ORDER.payments.ksnet.call(pay);
										break;
									case VAN_KAKAO:
										ORDER.payments.kakao.call(pay);
										break;
									case VAN_PAYCO:
										ORDER.payments.payco.call(pay);
										break;
									default:
										invalidMers();
										break;
								};	
							} else {
								invalidMers();							
							}
						},
						error: function(data) {
							invalidMers();
						}
					});
				} else {
					this.payNext(pay.next);
				};
			} else {
				this.callback();
			};
		},
		createForm: function(p) {
			var form = $("<form/>").attr({
				id: p.id,
				name: p.name,
				method: p.method
			});
			$("#" + p.id).remove();
			form.appendTo("body");			
			if (p.target) {
				form.attr({ target: p.target });
			};
			if (p.action) {
				form.attr({ action: p.action });
			};
			if (p.accept_charset) {
				form.attr({ "accept-charset": p.accept_charset });
			};
			return { 
				form: form[0],
				addInput: function(p) {
					form.append($("<input type='hidden'>").attr(p));
				}
			};
		},
		certingAccount: false,
		certAccaountCache: {},
		certAccount: function(p) {
			var hashcode = "";
			var certCallback = function(data) {
				if (data.result === true) {
					if ($.type(p.callback) == "function") {
						p.callback();
					}
				} else {
					alert("올바른 계좌가 아닙니다.");
				};
			};
			if (this.certingAccount === true) {
				return false;
			};
			this.certingAccount = true;
			hashcode = p.morc_nm + "|" + p.account_no + "|" + p.bank_cd;
			if (this.certAccaountCache[hashcode]) {		//기 조회된 정보가 있음.
				certCallback(this.certAccaountCache[hashcode]);
				ORDER.payments.certingAccount = false;
			} else {
				$.ajax({
					url: location.protocol +"//" + location.host + "/order/certAccount.action",
					type: "POST",
					dataType: "json",
					data: { bank_cd: p.bank_cd, morc_nm: p.morc_nm, account_no: p.account_no },
					success: function(data) {
						ORDER.payments.certAccaountCache[hashcode] = data;
						certCallback(data);
					},
					error: function() {
						alert("계좌인증에 실패하였습니다.");
					},
					complete: function() {
						ORDER.payments.certingAccount = false;
					}
				});
			};
		}
	};
})(jQuery);