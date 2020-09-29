;(function ($) {
	var PAY_MEAN_CD_CARD = "11";
	var PAY_MEAN_CD_RBANK = "12";
	var PAY_MEAN_CD_VBANK = "13";	
	var KSNET = {	//KSNET 제공 함수
		check_param: function(xid, eci, cavv, cardno) {
			var ck_mpi = this.get_cookie("xid_eci_cavv_cardno");
		
			if (ck_mpi == xid + eci + cavv + cardno) {
				return false;
			};
			this.set_cookie("xid_eci_cavv_cardno", xid + eci + cavv + cardno);
			ck_mpi = this.get_cookie("xid_eci_cavv_cardno");
			return true;
		},
		get_cookie: function(strName) {
			var strSearch = strName + "=";
			if ( document.cookie.length > 0 ) {
				iOffset = document.cookie.indexOf( strSearch );
				if ( iOffset != -1 ) {
					iOffset += strSearch.length;
					iEnd = document.cookie.indexOf( ";", iOffset );
					if ( iEnd == -1 ) {
						iEnd = document.cookie.length;
					};
					return unescape(document.cookie.substring( iOffset, iEnd ));
				};
			};
			return "";
		},
		set_cookie: function(strName, strValue) { 
			var strCookie = strName + "=" + escape(strValue);
			document.cookie = strCookie;
		},
		getLocalUrl: function(mypage) {
			var myloc = location.href; 
			return myloc.substring(0, myloc.lastIndexOf('/')) + '/' + mypage;
		}
	};	
	ORDER.payments.ksnet = {
		call: function(pay) {
			var pay_seq = pay.pay_seq;
			if (pay.pay_mean_cd == PAY_MEAN_CD_CARD || pay.pay_mean_cd == PAY_MEAN_CD_RBANK) {
				if (overpass.global.chnl_cd != "30" && overpass.global.chnl_cd != "40") { //모바일웹, 모바일앱이 아닐 경우
					if (pay.pay_mean_cd == PAY_MEAN_CD_CARD) {
						ORDER.payments.ksnet.payCard(pay);
					} else if (pay.pay_mean_cd == PAY_MEAN_CD_RBANK) {	//실시간 계좌이체
						ORDER.payments.ksnet.payRbank(pay);
					};
				} else {
					ORDER.payments.ksnet.paySmart(pay);										
				};
			} else if (pay.pay_mean_cd == PAY_MEAN_CD_VBANK) {	//가상계좌(모듈 없음)
				var bank = pay.bank;
				$.extend(ORDER.pay.ord_pays[pay_seq]["_payments_"], {
					bank_cd: bank.bank_cd,
					expiry_date: bank.expiry_date,
					morc_nm: bank.morc_nm
				});
				ORDER.payments.payNext(pay.next);
			};
		},
		payCard: function(pay) {
			var cardcomp = pay.cardcomp;
			var mers = pay.mers;
			var noint_mon = cardcomp.noint_mon;	//할부개월
			if (($("#_KSNET_CARD_FORM_").length > 0)) {
				$("#_KSNET_CARD_FORM_").remove();
			};
			var ord_pay = ORDER.pay.ord_pays[pay.pay_seq];
			if (cardcomp.isp_yn != "Y") {	//MPI
				var ksnet_card = mers.van_if_cardcomp_no;
				var form = ORDER.payments.createForm({
					id: "_KSNET_CARD_FORM_",
					name: "Visa3d",
					method: "post"
				});
				var certEnd = false;
				
				form.addInput({ name: "pan", value: "" });
				form.addInput({ name: "expiry", value: "4912" });
				form.addInput({ name: "purchase_amount", value: pay.pay_amt });
				form.addInput({ name: "amount", value: pay.pay_amt });
				form.addInput({ name: "description", value: "none" });
				form.addInput({ name: "currency", value: "410" });
				form.addInput({ name: "recur_frequency", value: "" });
				form.addInput({ name: "recur_expiry", value: "" });
				form.addInput({ name: "installments", value: "" });
				form.addInput({ name: "device_category", value: "0" });
				form.addInput({ name: "name", value: mers.companyname });		//회사명을 영어로 넣어주세요(최대20byte)
				form.addInput({ name: "url", value: mers.site_url });	//회사 도메인을 http://를 포함해서 넣어주세요
				form.addInput({ name: "country", value: "410" });
				form.addInput({ name: "returnUrl", value: location.protocol +"//" + location.host + "/overpass-payments/ksnet/ksnetCert.action" });
				form.addInput({ name: "cardcode", value: ksnet_card });
				form.addInput({ name: "merInfo", value: mers.mers_no });
				form.addInput({ name: "bizNo", value: mers.bizno });
				form.addInput({ name: "instType", value: "1" });		//1: 일반, 2: 무이자
				
				(function() {
					var mpi_result = _KSP_CALL_MPI(form.form, function() {
						var result = arguments[0].split('|');
						var proceed = result[0];
						var xid = result[1];
						var eci = result[2];
						var cavv = result[3];
						var cardno = result[4];
						if ((proceed == "TRUE"||proceed == "true"||proceed == true) && KSNET.check_param(xid, eci, cavv, cardno)) {		//인증성공
							$.extend(ord_pay["_payments_"], {
								certitype: "M",
								xid: result[1],
								eci: result[2],
								cavv: result[3],
								cardno: result[4],
								noint_mon: noint_mon
							});
							certEnd = true;
							ORDER.payments.payNext(pay.next);
						} else {	//인증실패
							ORDER.payments.throwError("죄송합니다. 결제수단 인증에 실패하였습니다.");
						};
					});
					if (mpi_result == false) {	//팝업 차단등으로 인증이 진행 되지 못하는 경우
						ORDER.payments.throwError(undefined);
					};					
				})();
				
				//_ksmpi_pop_obj KSNET에서 오픈한 팝업객체. 이넘을 체크해서 창이 close 됐는지 확인한다.
				var closeCheck = function() {
					if (certEnd === false && _ksmpi_pop_obj) {
						if (_ksmpi_pop_obj.closed == true) {							
							ORDER.payments.throwError("신용카드 인증을 취소하셨습니다.");	
						} else {
							setTimeout(closeCheck, 1000 * 1);						
						};						
					};
				};
				closeCheck();
			} else {	//ISP
				var form = ORDER.payments.createForm({
					id: "_KSNET_CARD_FORM_",
					name: "KSPayISPForm",
					method: "post"
				});
				var kvp_quota_inf = "0";
				if (noint_mon > 0) {
					kvp_quota_inf = "" + noint_mon;
				};
				
				//[START] 기본
				form.addInput({ name: "storeid", value: mers.mers_no });							
				form.addInput({ name: "authty", value: "I000" });
				form.addInput({ name: "certitype", value: "I" });
				//[END] 기본
				//[START] 일반신용카드
				form.addInput({ name: "email", value: pay.email });
				form.addInput({ name: "phoneno", value: pay.cell_no });
				form.addInput({ name: "ordernumber", value: mers.pay_no });
				form.addInput({ name: "ordername", value: pay.orderer_nm });
				form.addInput({ name: "goodname", value: pay.disp_goods_nm });
				form.addInput({ name: "amount", value: pay.pay_amt });
				form.addInput({ name: "currencytype", value: "WON" });
				form.addInput({ name: "expdt", value: "" });
				form.addInput({ name: "cardno", value: "" });	//카드번호
				form.addInput({ name: "expyear", value: "" });	//유효년
				form.addInput({ name: "expmon", value: "" });	//유효월
				form.addInput({ name: "installment", value: "" });	//할부
				form.addInput({ name: "lastidnum", value: "" });	//생년월일
				form.addInput({ name: "passwd", value: "" });	//비밀번호
				//[END] 일반신용카드
				//[START] ISP
				form.addInput({ name: "KVP_PGID", value: mers.pg_id });		//PG
				form.addInput({ name: "KVP_SESSIONKEY", value: "" });	//세션키
				form.addInput({ name: "KVP_ENCDATA", value: "" });	//암호된데이터
				form.addInput({ name: "KVP_CURRENCY", value: "WON" });	//지불 화폐 단위 (WON/USD) : 한화 - WON, 미화 - USD
				form.addInput({ name: "KVP_NOINT", value: "" });	//무이자구분(1:무이자,0:일반) 
				form.addInput({ name: "KVP_QUOTA", value: "" });	//할부
				form.addInput({ name: "KVP_CARDCODE", value: "" });	//카드코드
				form.addInput({ name: "KVP_CONAME", value: "" });	//카드명
				form.addInput({ name: "KVP_RESERVED1", value: "" });	//예비1
				form.addInput({ name: "KVP_RESERVED2", value: "" });	//예비2
				form.addInput({ name: "KVP_RESERVED3", value: "" });	//예비3
				form.addInput({ name: "KVP_IMGURL", value: "" });
				form.addInput({ name: "KVP_QUOTA_INF", value: kvp_quota_inf });	//ISP용 할부개월수지정
				form.addInput({ name: "KVP_GOODNAME", value: pay.disp_goods_nm });	//상품명
				form.addInput({ name: "KVP_PRICE", value: pay.pay_amt });	//금액
				form.addInput({ name: "KVP_NOINT_INF", value: "NONE" });	//"ALL" - 모든개월수에 대하여 무이자처리함./ "NONE" - 모든개월수에 대하여 무이자처리하지않음.
				form.addInput({ name: "KVP_CARDCOMPANY", value: mers.van_if_cardcomp_no });
				//[END] ISP
				
				window.VP_Ret_Pay = function(ret) {	//ISP 모듈 콜백함수
					if (ret == true) {
						$.extend(ord_pay["_payments_"], {
							certitype: "I",
							kvp_noint: form.form.KVP_NOINT.value,
							kvp_quota: form.form.KVP_QUOTA.value,
							kvp_pgid: form.form.KVP_PGID.value,
							kvp_cardcode: form.form.KVP_CARDCODE.value,
							kvp_sessionkey: form.form.KVP_SESSIONKEY.value,
							kvp_encdata: form.form.KVP_ENCDATA.value,
							noint_mon: noint_mon
						});
						ORDER.payments.payNext(pay.next);
					} else {
						ORDER.payments.throwError("신용카드 인증을 취소하셨습니다.");
					};
				};
				MakePayMessage(form.form);	//ISP모듈 호출
			};
		},
		payRbank: function(pay) {
			var mers = pay.mers;
			if (CheckCtrl() === true) {	//실시간 계좌이체 모듈 확인
				var hd_serial_no = mers.hd_serial_no;
				var trno = mers.trno;
				var tx_user_define = mers.tx_user_define;
				
				if (($("#_KSNET_RBANK_FORM_").length > 0)) {
					$("#_KSNET_RBANK_FORM_").remove();
				};
				
				if (($("#_KSNET_RBANK_TARGET_").length == 0)) {
					$("<iframe />").attr({
						id: "_KSNET_RBANK_TARGET_",
						name: "_KSNET_RBANK_TARGET_"
					}).hide().appendTo("body");
				};
				
				var form = ORDER.payments.createForm({
					id: "_KSNET_RBANK_FORM_",
					method: "post",
					target: "_KSNET_RBANK_TARGET_"						
				});
				
				var ord_pay = ORDER.pay.ord_pays[pay.pay_seq];
				
				form.addInput({ name: "storeid", value: mers.mers_no });
				form.addInput({ name: "acct_type", value: "5" });
				form.addInput({ name: "email", value: pay.email });
				form.addInput({ name: "phoneno", value: pay.cell_no });
				form.addInput({ name: "ordernumber", value: mers.pay_no });
				form.addInput({ name: "ordername", value: pay.orderer_nm });
				form.addInput({ name: "idnum", value: "" });
				form.addInput({ name: "goodname", value: pay.disp_goods_nm });
				form.addInput({ name: "amount", value: pay.pay_amt });
				form.addInput({ name: "injanm", value: mers.companyname });
				form.addInput({ name: "trno", value: trno });
				form.addInput({ name: "banktrno", value: hd_serial_no });
				//금결원기본정보
				form.addInput({ name: "hd_pre_msg_type", value: "EFT" });	//전자 지갑의 결제 유형을 설정한다. EFT로 고정
				form.addInput({ name: "hd_msg_code", value: "0200" });	//결제 요청 페이지에서는 0200 으로 고정
				form.addInput({ name: "hd_msg_type", value: "EFT" });	//계좌이체는 EFT로 입력
				form.addInput({ name: "hd_ep_type", value: "SECUCERT" });	//계좌이체는 SECUCERT
				form.addInput({ name: "hd_pi", value: "" });	//공백으로 고정
				form.addInput({ name: "hd_approve_no", value: mers.hd_approve_no });	//업체의 승인 번호 : 금융결제원으로부터 부여받은 승인번호 8 자리를 기입한다.
				form.addInput({ name: "hd_serial_no", value: hd_serial_no });	//결제 요청 전문의 대한 일련번호 7자리 : 이 페이지가 호출될 경우마다 새로운 번호를 기입한다. 중복거래를 방지 하기위함
				form.addInput({ name: "hd_firm_name", value: mers.companyname });	//전자지갑에 표시될 기관명을 세팅한다.
				form.addInput({ name: "tx_amount", value: pay.pay_amt });	//실제로 결제할 금액을 기입한다
				form.addInput({ name: "tx_user_define", value: tx_user_define });	//예비 필드 80바이트(통장인자용업체명약칭^사업자등록번호^업체명^대표전화번호)
				form.addInput({ name: "hd_timeout_yn", value: "Y" });	//전자지갑 타임아웃 설정: 거래 없이 일정시간 지나면 종료되도록 하는 옵션임
				form.addInput({ name: "hd_timeout", value: "300000" });	//전자지갑 타임아웃 시간 설정: 단위는 ms임(디폴트 300000(5분))
				form.addInput({ name: "tx_email_addr", value: pay.email });	//결제내역이 전송될 이메일주소 : DB에서 고객의 이메일주소를 불러와서 쓸 경우에만 입력, 기본적으로는 사용자가 전자지갑에서 입력하도록 되어있음
				form.addInput({ name: "tx_receipt_acnt", value: mers.receipt_acnt });	//입금계좌번호
				form.addInput({ name: "hd_input_option", value: "22" });	//입력옵션 : 결제정보 입력 시 화면에 표시되는 방법에 대한 옵션
				form.addInput({ name: "hd_ep_option", value: "222" });	//출력옵션 : 결제결과가 표시되는 방법에 대한 옵션
				
				if (payRequest(form.form)) {
					$.extend(ord_pay["_payments_"], {
						trno: trno,
						banktrno: hd_serial_no,
						tx_user_define: tx_user_define,
						hd_ep_type: form.form.hd_ep_type.value,
						hd_pi: form.form.hd_pi.value,
						hd_approve_no: form.form.hd_approve_no.value
					});
					ORDER.payments.payNext(pay.next);
				} else {
					ORDER.payments.throwError("실시간 계좌이체 인증을 취소하였습니다.");
				};
			} else {
				ORDER.payments.throwError(undefined);
			};
		},
		paySmart: function(pay) {
			var ord_pay = ORDER.pay.ord_pays[pay.pay_seq];
			var KSNET_PAYMETHOD = { "11": "1000000000", "12": "0010000000" };
			var mers = pay.mers;
			var cardcomp = pay.cardcomp;
			var sndShowcard = (function() {
				console.dir(cardcomp);
				if (pay.pay_mean_cd == PAY_MEAN_CD_CARD) {
					return (cardcomp.isp_yn == "Y" ? "I" : "M") + "(" + (cardcomp.cardcomp_no == "14" ? "01" : cardcomp.cardcomp_no) + ")";	//우리(14)는 BC로 넘김
				} else {
					return "";
				};
			})();	//카드정보
			var sndInstallmenttype = pay.pay_mean_cd == "11" ? cardcomp.noint_mon : "" ;	//할부정보
			var sndInteresttype = "";	//무이자정보
			var form_data = {
				sndPaymethod: KSNET_PAYMETHOD[pay.pay_mean_cd],
				sndStoreid: mers.mers_no,
				sndCurrencytype: "WON",
				sndOrdernumber: mers.pay_no,
				sndAllregid: "",		//주민번호(선택)
				sndShowcard: sndShowcard,
				sndInstallmenttype: sndInstallmenttype,
				sndInteresttype: sndInteresttype,
				sndGoodname: pay.disp_goods_nm,
				sndAmount: pay.pay_amt,
				sndOrdername: pay.orderer_nm,
				sndEmail: pay.email,
				sndMobile: pay.cell_no,
				sndReply: ORDER.payments.ksnet.sndReply ? ORDER.payments.ksnet.sndReply : KSNET.getLocalUrl("registOrder.action"),
				sndEscrow: "0",
				sndVirExpDt: "",
				sndVirExpTm: "",
				sndStoreName: mers.companyname,
				sndStoreNameEng: mers.companyname,
				sndStoreDomain: mers.site_url,
				sndGoodType: "1",
				sndUseBonusPoint: "",
				sndRtApp: (function() {
					var app = "";
					if (overpass.global.app_cd == "iOS") {
						app = overpass.global.app_mall + "://";
					} else if (overpass.global.app_cd == "Android") {
						app = "Android";						
					};
					return app;
				})(),
				action: mers.kspay_url
			};
			$.extend(ord_pay["_payments_"], {
				form_data: form_data
			});
			ORDER.payments.payNext(pay.next);			
		}
	};
})(jQuery);