(function($){
	
    var PAY_MEAN_CDS = {
    	"11": "11",		// 신용카드
    	"12": "12",		// 실시간계좌이체
    	"13": "13",		// 가상계좌
    	"14": "14"		// 휴대폰
    };
    
	/**
	 * 이니시스 form fields
	 */
	var inicis_fields = {
		 _inicis_onoff: "",	
		 _inicis_idx: 0,
		 _inicis_gopaymethod: "",				//필수:결제수단 셋팅
		 _inicis_goodname: "",					//필수
		 _inicis_buyername: "",
		 _inicis_buyeremail: "",
		 _inicis_parentemail: "",
		 _inicis_buyertel: "",
		 _inicis_acceptmethod: "SKIN(ORIGINAL):HPP(2):no_receipt",
		 _inicis_currency: "WON",				//필수
		 _inicis_ini_logoimage_url: "",
		 _inicis_ini_menuarea_url: "",
		 _inicis_ini_encfield: "",
		 _inicis_ini_certid: "",
		 _inicis_uotainterest: "",
		 _inicis_paymethod: "",
		 _inicis_ini_onlycardcode: "",
		 _inicis_cardcode: "",
		 _inicis_cardquota: "", 
		 _inicis_rbankcode: "" ,
		 _inicis_reqsign: "DONE",
		 _inicis_encrypted: "", 
		 _inicis_sessionkey: "",
		 _inicis_uid: "",    
		 _inicis_sid: "",
		 _inicis_cardnumber: "",
		 _inicis_cardexpy: "",
		 _inicis_cardexpm: "",
		 _inicis_authfield1: "",
		 _inicis_authfield2: "",
		 _inicis_quotaInterest: "",
		 _inicis_cardcomp_no: "",
		 _inicis_noint_divi_cd: "",
		 _inicis_price: "",
		 _inicis_ssn: "",
		 _inicis_oid: "",	//상점 주문번호
		 _inicis_dtinput: "",	//입금예정일
		 _inicis_tminput: "2359",	//입금예정시간
		 _inicis_vcdbank: "",	//입금은행코드
		 _inicis_nminput: "",	//입금자이름
		 _inicis_cell_no: "",	//결제 휴대폰 번호
		 _inicis_hppauthnumber: "",	//휴대폰 인증번호
		 _inicis_hppcotype: "",
		 _inicis_hppsid: "",
		 _inicis_hppphoneid: "",
		 _inicis_hppauthserial: "",
		 _inicis_cmcm_divi_cd: "",
		 _inicis_version: "5000",
		 _inicis_promo_no: "",
		 _inicis_card_pnt_use_yn: "N"
	};
	
	var checkCommonValidation = function(f) {
		//공통 유효성 체크
		if (f.site_no.value == "") {
			alert("사이트번호를 입력하세요.");
			return false;
		};
		if (f.good_nm.value == "") {
			alert("상품명을 입력하세요.");
			return false;
		};
		if (f.orderer_nm == "") {
			alert("구매자명을 입력하세요.");
			return false;
		};
		
		var cell_no1 = f.cell_no1.value;
		var cell_no2 = f.cell_no2.value;
		var cell_no3 = f.cell_no3.value;
		var cell_no = "";
		
		var tel_no1 = f.tel_no1.value;
		var tel_no2 = f.tel_no2.value;
		var tel_no3 = f.tel_no3.value;
		var tel_no = "";
		
		if ( cell_no1 != "" && cell_no2 != "" && cell_no3 != "" ) {
			cell_no = cell_no1 + "-" + cell_no2 + "-" + cell_no3;
		};
		
		if ( tel_no1 != "" && tel_no2 != "" && tel_no3 != "" ) {
			tel_no = tel_no1 + "-" + tel_no2 + "-" + tel_no3;
		};
		
		if ( cell_no == "" && tel_no == "" ) {
			alert("전화번호를 입력하세요.");
			return false;
		};
		
		if (f.email.value == "") {
			alert("이메일을 입력하세요.");
			return false;
		};
		return true;
	};
	
	//이니시스 플러그인 호출
	var callPlugin = function(p) {
		
		if (p.pay_amt <= 0) {
			alert("금액이 0원 이하 입니다.");
			return false;
		};
		
		var result = false;
		
		$.ajax({
			url: "/ifs/init.action",
			type: "POST",
			dataType: "json",
			data: { 
				price: p.pay_amt,
				noint_divi_cd: p.noint_mon == 0 || p.noint_mon == "" ? "10" : p.noint_divi_cd , 
				quotabase: p.noint_mon == 0 || p.noint_mon == "" ? "일시불" : p.noint_mon + "개월",
				pay_mean_cd: p.pay_mean_cd,
				cardcomp_no: p.cardcomp_no,
				card_pnt_use_yn: p.card_pnt_use_yn,
				site_no: p.site_no,
				cell_no: p.cell_no,
				ssn: p.ssn,
				buyername: p.buyername,
				buyeremail: p.buyeremail,
				goodname: p.goodname,
				onoff: p.onoff,				
				pay_idx: p.pay_idx,
				card_pnt_use_yn: p.card_pnt_use_yn
			},
			async: false,
			success : function(data) {	//이니페이 플러그인의 암호값 전달
				p.ini_encfield = data.ini_encfield;
				p.ini_certid = data.ini_certid;
				p.oid = data.oid;				
				result = openPlugin(p);
			},
			error: function () {
				alert("죄송합니다. 결제모듈 실행시 오류가 발생하였습니다. 잠시후 다시 시도해 주세요.");
			}
		});
		return result;
	};
	
	var openPlugin = function(p) {
		var result = false;
		
		var fields = $.extend({}, inicis_fields, { 
			_inicis_goodname: p.goodname,
			_inicis_buyername: p.buyername,
			_inicis_buyeremail: p.buyeremail,
			_inicis_buyertel: p.buyertel,
			_inicis_onoff: p.onoff,
			_inicis_promo_no: p.promo_no,
			_inicis_card_pnt_use_yn: p.card_pnt_use_yn,
			_inicis_cardcomp_no: p.cardcomp_no,
			_inicis_noint_divi_cd: p.noint_divi_cd
		});
		
		if (p.onoff == "ON") {	//플러그인 방식
			var inipay_form = $("<form />").attr({ method: "POST" });
			$.each(fields, function(name) {	//기본값 셋팅
				var input = $("<input />").attr({
					type: "hidden",
					name: name.replace("_inicis_", ""),
					value: fields[name]
				});
				inipay_form.append(input);
			});
			
			inipay_form.each(function() {
				var f = this;
				f.ini_encfield.value = p.ini_encfield;
				f.ini_certid.value = p.ini_certid;
				f.gopaymethod.value = p.gopaymethod;
				f.ini_onlycardcode.value = p.cardcomp_no;
				
				if (MakePayMessage(f)) {
					$.each(fields, function(name) {
						$(":input[name=" + name + "]", p.form).eq(p.pay_idx).val(f.elements[name.replace("_inicis_", "")].value);												
					});
					result = true;
				} else {
					if (IsPluginModule()) {
						alert("결제를 취소하셨습니다.");
					};
				};
			});
		} else {	//폼페이 방식
			if (p.pay_mean_cd == "11") {	//신용카드
				fields["_inicis_paymethod"] = "Card";
				fields["_inicis_cardnumber"] = p.card_no;
				fields["_inicis_cardexpy"] = p.aval_term.substring(2, 4);
				fields["_inicis_cardexpm"] = p.aval_term.substring(4);
				fields["_inicis_authfield1"] = p.ssn2;
				fields["_inicis_authfield2"] = p.card_pw1;
				fields["_inicis_cardquota"] = p.noint_mon.zf(2);
				fields["_inicis_quotaInterest"] = p.noint_divi_cd == "30" ? "1" : "0" ;
				fields["_inicis_price"] = p.pay_amt ;
			} else if (p.pay_mean_cd == "13") {	//가상계좌
				fields["_inicis_ssn"] = p.ssn;
				fields["_inicis_oid"] = p.oid;
				fields["_inicis_price"] = p.pay_amt ;
				fields["_inicis_dtinput"] = p.expiry_date;
				fields["_inicis_vcdbank"] = p.bank_cd;
				fields["_inicis_nminput"] = p.morc_nm;	
			} else if (p.pay_mean_cd == "14") {	//휴대폰
				fields["_inicis_hppauthnumber"] = p.hppauthnumber;
				fields["_inicis_ssn"] = p.ssn;
				fields["_inicis_price"] = p.pay_amt ;				
				fields["_inicis_hppcotype"] = p.hppcotype;
				fields["_inicis_hppsid"] = p.hppsid;
				fields["_inicis_hppphoneid"] = p.hppphoneid;
				fields["_inicis_hppauthserial"] = p.hppauthserial;
				fields["_inicis_cell_no"] = p.cell_no;
				fields["_inicis_cmcm_divi_cd"] = p.cmcm_divi_cd;
			};
			
			$.each(fields, function(name, value) {
				$(":input[name=" + name + "]", p.form).eq(p.pay_idx).val(value);			
			});
			
			result = true;
		};
		return result;
	};
	
	preOrder = function(p) {
		p = $.extend({ form: null, pays: null }, p);
		if (p.form == null) {
			alert("form을 지정하세요!");
			return false;
		};
		
		if (p.form == "undefined" || p.form == null) {
			alert("올바른 form을 지정하세요!");
			return false;
		};
		if ($.type(p.pays) != "object") {
			alert("결제 정보가 올바르지 않습니다[0].");
			return false;
		}
		
		var f = p.form;
		
		var pay_mean_cds = $(":input[name=pay_mean_cd]", f);
		var pay_mean_cd_yns = $(":input[name=pay_mean_cd_yn]", f);
		var pay_mean_ids = $(":input[name=pay_mean_id]", f);
		var pay_amts = $(":input[name=pay_amt]", f);
		
		if (pay_mean_cds.length != pay_mean_cd_yns.length || pay_mean_cds.length != pay_mean_ids.length) {
			alert("결제 정보가 올바르지 않습니다[1].");
			return false;
		};
		
		//결제 공통 사항 검사
		if (!checkCommonValidation(f)) {
			return false;
		};
		
		var cell_no = f.cell_no1.value + "" + f.cell_no2.value + "" + f.cell_no3.value; 
		var tel_no = f.tel_no1.value + "" + f.tel_no2.value + "" + f.tel_no3.value;
		
		//form내의 모든 결제 수단에 대해서 이니시스 관련 field들을 생성
		var pays = [];
		for (var i = 0 ; i < pay_mean_cds.length ; i++ ) {
			
			var pay = $.extend({
				form: f,
				pay_mean_cd: pay_mean_cds[i].value,
				pay_mean_cd_yn: pay_mean_cd_yns[i].value,
				pay_amt: pay_amts[i].value,
				gopaymethod: "",
				goodname: f.good_nm.value,
				buyername: f.orderer_nm.value,
				buyeremail: f.email.value,
				buyertel: cell_no != "" ? cell_no : tel_no,
				noint_divi_cd: "", 
				noint_mon: "", 
				site_no: f.site_no.value, 
				pay_idx: i, 
				onoff: "ON",
				if_yn: "Y",
				promo_no: "",
				card_pnt_use_yn: "N"
			}, p.pays[pay_mean_ids[i].value]);
			
			if (pay.pay_mean_cd in PAY_MEAN_CDS && pay.pay_mean_cd_yn == "Y" && pay.if_yn == "Y") {	//유효성 검사 및 정보 셋팅
				if (pay.pay_mean_cd == "11") {	//신용카드
					pay.gopaymethod = "onlycard";
					
					if (pay.noint_mon == "") {
						alert("할부개월을 선택하세요[noint_mon]");
						return false;
					};						
					if (pay.noint_divi_cd == "") {
						alert("무이자 구분을 선택하세요[noint_divi_cd]");
						return false;
					};
					
					if (pay.onoff == "ON") {	//플러그인 방식
						if (pay.cardcomp_no == "") {
							alert("카드를 선택하세요[cardcomp_no]");
							return false;
						};						
					} else if (pay.onoff == "OFF") {	//Keyin방식
						if (pay.card_no == "") {
							alert("신용카드 번호를 입력하세요.");
							return false;
						};
						if (pay.aval_term == "") {
							alert("유효기간을 입력하세요.");
							return false;
						};
						if (pay.ssn2 == "") {
							alert("주민번호 뒷자리를 입력하세요.");
							return false;
						};
					};
				} else if (pay.pay_mean_cd == "12") {
					pay.gopaymethod = "onlydbank";	
				} else if (pay.pay_mean_cd == "13") {
					pay.gopaymethod = "onlyvbank";
					pay.onoff = "OFF";
					if (pay.ssn == "") {
						alert("주민등록번호를 입력하세요.");
						return false;
					};
					if (pay.bank_cd == "") {
						alert("입금은행코드를 입력하세요.");
						return false;
					};
					if (pay.expiry_date == "") {
						alert("입금예정일을 입력하세요.");
						return false;
					}; 
					if (pay.morc_nm == "") {
						alert("입금자이름을 입력하세요.");
						return false;
					};
				} else if (pay.pay_mean_cd == "14") {
					pay.gopaymethod = "onlyhpp";
					if (pay.onoff == "OFF") {
						if (pay.cmcm_divi_cd == "") {
							alert("이동통신사를 입력하세요.");
							return false;
						};
						if (pay.ssn == "") {
							alert("주민등록번호를 입력하세요.");
							return false;
						};
						if (pay.cell_no == "") {
							alert("핸드폰번호를 입력하세요.");
							return false;
						};
						if (pay.cell_cert_no == "") {
							alert("인증번호를 입력하세요.");
							return false;
						};
					};
				};
			};
			pays.push(pay);
		};
		
		var result = false;
		
		//이 시점에서 form내의 이니시스 관련 필드들을 초기화 한다.
		$.each(inicis_fields, function(name, value) {
			$(":input[name=" + name + "]", f).remove();
		});
		
		var $f = $(p.form);
		
		for (var i = 0 ; i < pays.length ; i++) {
			var pay = pays[i];
			
			//이니시스 관련 필드값 삽입
			$.each(inicis_fields, function(name) {
				var input = $("<input />").attr({
					type:"hidden",
					name:name
				});
				$f.append(input);
			});
			
			//인터페이스 여부 셋팅
			var input = $("<input />").attr({
				type:"hidden",
				name:"_if_yn",
				value: pay.if_yn
			});		
		
			$f.append(input);
			
			if (pay.pay_mean_cd_yn == "Y" && pay.if_yn == "Y" && $.type(PAY_MEAN_CDS[pay.pay_mean_cd]) == "string") {
				result = callPlugin(pay);
				if (!result) {
					return false;
				};
			} else {
				result = true;
			};
		};
		
		return result;
	};
	
	var _cert_hpp = false;
	
	requestCellCertNo = function(p) {
		
		var result = null;
		
		if (_cert_hpp) {
			alert("인증번호 요청중 입니다.");
			return false;
		};
		
		p = $.extend({ form: null, cmcm_divi_cd: "", ssn: "", cell_no: "", pay_amt: "" }, p);
		if (p.form == null) {
			alert("form을 지정하세요!");
			return false;
		};
		
		if (p.form == "undefined" || p.form == null) {
			alert("올바른 form을 지정하세요!");
			return false;
		};
		
		if (p.cmcm_divi_cd == "") {
			alert("이동통신사를 입력하세요.");
			return false;
		};
		if (p.ssn == "") {
			alert("주민등록번호를 입력하세요.");
			return false;
		};
		if (p.cell_no == "") {
			alert("핸드폰번호를 입력하세요.");
			return false;
		};
		if (p.pay_amt == "") {
			alert("결제금액을 입력하세요.");
			return false;
		};	
		
		var f = p.form;
		
		//결제 공통 사항 검사
		if (!checkCommonValidation(f)) {
			return false;
		};
		
		_cert_hpp = true;
		
		$.ajax({
			url: "/ifs/requestCellCertNo.action",
			type: "POST",
			dataType: "json",
			data: {
				client_no: f.client_no.value,
				site_no: f.site_no.value,
				pay_amt: p.pay_amt,
				cell_no: p.cell_no,
				cmcm_divi_cd:p.cmcm_divi_cd,
				ssn: p.ssn,
				buyername: f.orderer_nm.value,
				buyeremail: f.email.value,
				goodname: f.good_nm.value,
				mers_divi_cd: f.mers_divi_cd.value
			},
			async: false,
			success : function(data) {	//이니페이 플러그인의 암호값 전달
				alert("인증번호가 전송되었습니다. 2분 안에 인증번호를 입력하세요.");
				result = {
					hppcotype: data.hppcotype,
					hppsid: data.hppsid,
					hppphoneid: data.hppphoneid,
					hppauthserial: data.hppauthserial
				};				
				_cert_hpp = false;
			},
			error: function () {
				alert("죄송합니다. 핸드폰 인증번호 요청중 오류가 발생하였습니다.");
				_cert_hpp = false;
			}
		});
		
		return result;
	};
	
	
	queryAccount = function(obj,callback) {
		
		/** 아이프레임 아이디 */
		var _IFRM_ID = "CALL_OVERPASS_IFRM_QUERY_ACCOUNT";
		
		/** 아이프레임에 보낼 폼 아이디 */
		var _TFORM_ID = "CALL_OVERPASS_TFORM_QUERY_ACCOUNT";
		
		
		/** 옵션 */
		var config = {
			url : "/ifs/queryResult.action",
			method : "post",
			data : {}
		};
		
		
		var createIfrm = function ($o) {

			var proxyIfrmName = getElementRename(_IFRM_ID);

			var ifrmHtml  = '';
			ifrmHtml += '<iframe id="'+proxyIfrmName+'" name="'+proxyIfrmName+'" ';
			ifrmHtml += ' style="display:none"></iframe> ';
			$(ifrmHtml).prependTo("body");

			createTempForm($o,proxyIfrmName);

		};
		
		var createTempForm = function ($o,ifrmId) {
			
			var proxyFormName = getElementRename(_TFORM_ID);
			var tFormHtml  = "";
			tFormHtml += "<form id=\""+proxyFormName+"\" ";
			tFormHtml += " action=\""+$o.url+"\" ";
			tFormHtml += " method=\""+$o.method+"\" target=\""+ifrmId+"\" > ";

			for ( var key in $o.data) {
				tFormHtml += "<input type=\"hidden\" name=\""+key+"\" value=\""+($o.data[key])+"\" /> ";
			}
			
			tFormHtml += "</form> ";
			$(tFormHtml).prependTo("body");
			
			var proxyTform = $("#"+proxyFormName);
			proxyTform.submit();

			var tIfrm = $("#"+ifrmId);
			

			
			tIfrm.load(function(){
				
				if (!JSON) {
					window.alert("JSON라이브 러리가 존재 하지 않습니다.");
					return;
				}
				
				callback(JSON.parse($(this).contents().text()));
				proxyTform.remove();
				tIfrm.remove();
				
			});

			//iframe onload 일때.. 엘리먼트를 지워줘야 하는데 안먹힘.. 일단 임시로.. 
			
		};
		
		
		var getElementRename = function (name) {
			
			var cdate = new Date();
			var h=addZero(cdate.getHours(),2);
			var m=addZero(cdate.getMinutes(),2);
			var s=addZero(cdate.getSeconds(),2);
			var ms=addZero(cdate.getMilliseconds(),3);
			var rename = name+h+m+s+ms;
	
			return rename
		};
		
		
		var addZero = function (x,n) {
			if (x.toString().length<n) 
			{
				x="0" + x;
			}
			return x;
		};
		
		
		var fncEnCode = function (param)
		 
		{		 
		    var encode = '';
		 
		    for(i=0; i<param.length; i++)
		 
		    {		 
		        var len  = ''+param.charCodeAt(i);		 
		        var token = '' + len.length;		 
		        encode  += token + param.charCodeAt(i);		 
		    }		 

		    return encode;		 
		};
		
		
		var $o = $.extend(config,obj);
		
		$.ajax({
			url:"/ifs/queryResult.action",
			dataType: "json",
			data: $o.data,
			async: false,
			success : function(data) {
				
				$o.url = data.url;
				$o.data.mid = data.mid;
				$o.data.rltURL = data.rltURL;
				createIfrm($o);

			},
			error:function(request,status,error){
		        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		    }

		});
		
	}
	
})(jQuery);