(function($){

	M.use("common");
    
	/**
	 * <pre>
	 * 날짜 검사 (yyyy-mm-dd)검사
	 * </pre>
	 */
	isDate = function (field) {
		
		if ($.type(field) == "undefined") {
			alert(fnGetI18nMessge("M.common.message.날짜필드가아닙니다"));
			return false;
		};		
		
		var val = "";
		
		if ($.type(field.val) == "function") {
			val = field.val();
		} else {
			val = field.value;
		};
		
		var matches;
		/**
		 * 9999-12-31 날짜형식이 맞지 않다는 오류가 발생하여 처리
		 */ 
		if(matches = val.match(/^(\d{4})-(\d{2})-(\d{2})$/)) {
			if(!checkDate(matches[1], matches[2], matches[3])) {
				field.focus();
				return false;
			};
			return true;
		} else {
			alert(fnGetI18nMessge("M.common.message.날짜형식이올바르지않습니다") + "2010-01-01" + fnGetI18nMessge("M.common.message.형식으로입력해주십시요"));
			field.focus();
			return false;
		};
	};
	
	/**
	 * 날짜 형식 검사
	 */
	checkDate = function(yyyy, mm, dd) {
		if (typeof(yyyy) == "undefined" || yyyy == null || yyyy == "" || yyyy.length != 4) {
			alert(fnGetI18nMessge("M.common.message.날짜형식이올바르지않습니다"));
			return false;
		};
		if (typeof(mm) == "undefined" || mm == null || mm == "" || mm.length > 2) {
			alert(fnGetI18nMessge("M.common.message.날짜형식이올바르지않습니다"));
			return false;
		};
		if (typeof(dd) == "undefined" || dd == null || dd == "" || dd.length > 2) {
			alert(fnGetI18nMessge("M.common.message.날짜형식이올바르지않습니다"));
			return false;
		};
		mm =  mm.length == 1 ? "0" + mm : mm;
		dd =  dd.length == 1 ? "0" + dd : dd;
		var date = new Date(yyyy +"/"+ mm +"/"+ dd);
		if (yyyy - date.getFullYear() != 0) {
			alert(fnGetI18nMessge("M.common.message.날짜형식이올바르지않습니다"));
			return false;
		};
		if (mm - date.getMonth() - 1 != 0) {
			alert(fnGetI18nMessge("M.common.message.날짜형식이올바르지않습니다"));
			return false;
		};
		if (dd - date.getDate() != 0) {
			alert(fnGetI18nMessge("M.common.message.날짜형식이올바르지않습니다"));
			return false;
		};
		return true;
	};
	
	/**
	 * 필드값의 공백여부 체크(스페이스 포함) 필드가 empty이면 true 리턴
	 * msg : 값이 있으면 alert
	 * @return boolean : true - 실패 / false - 성공
	 */
	isEmpty = function(field, msg) {
		
		var val = "";
		
		if ($.type(field.val) == "function") {
			val = field.val();
		} else {
			val = field.value;
		};
		
		if (val.trim() == "") {
			if ($.type(msg) != "undefined" && msg.trim() != "") {
				alert(msg);
			};
			
			field.focus();
			return true;
		} else {
			return false;
		};
	};
	
	/**
	 * 필드가 숫자인지 체크한다.
	 * msg : 값이 있으면 alert
	 * blnk : 공백 허용 여부
	 * @return boolean : true - 성공 / false - 실패
	 */
	isNumber = function(field, msg, blnk) {
		var val = "";
		if ($.type(field.val) == "function") {
			val = field.val();
		} else {
			val = field.value;
		};
		
		if ($.type(blnk) == "boolean" && !blnk) {
			if (val.trim() == "") {
				if ($.type(msg) != "undefined" && msg.trim() != "") {
					alert(msg);
				};
				
				return false;
			}
		}
		
		return isNumberVal(val, msg);
		
	};
	
	isNumberVal = function(val, msg, blnk) {
		var chk = true;
		
		if ($.type(blnk) == "boolean" && !blnk) {
			if (val.trim() == "") {
				if ($.type(msg) != "undefined" && msg.trim() != "") {
					alert(msg);
				};
				
				return false;
			}
		}
		
		$.each(val, function(i, chr){
			var c = chr.charCodeAt(0);
			if (!(0x30 <= c && c <= 0x39)) {
				chk = false;
	       		return false;
	       	};
		});
		
		if (!chk) {
			if ($.type(msg) != "undefined" && msg.trim() != "") {
				alert(msg);
			};
		}
		
    	return chk;
	};
	
	/**
	 * 필드가 숫자인지 체크한다.
	 * msg : 값이 있으면 alert
	 * blnk : 공백 허용 여부
	 * @return boolean : true - 성공 / false - 실패
	 */
	isDecimal  = function(field, msg, blnk) {
		var val = "";
		if ($.type(blnk) == "boolean" && !blnk) {
			if (isEmpty(field)) {
				if ($.type(msg) != "undefined" && msg.trim() != "") {
					alert(msg);
				};
				
				return false;
			}
		}
		
		if ($.type(field.val) == "function") {
			val = field.val();
		} else {
			val = field.value;
		};
		
		return isDecimalVal(val, msg);
		
	};
	
	isDecimalVal = function(val, msg) {
		var chk = true;
		
		
		if (!Number(val)) {
			chk = false;
		};
		
		if (!chk) {
			if ($.type(msg) != "undefined" && msg.trim() != "") {
				alert(msg);
			};
		};
		
    	return chk;
	};
	
	
	/**
	 * 필드의 값이 숫자인지를 체크하고 숫자인 값만 리턴한다.
	 * @param field  : form.element or $("form.element")
	 * @param replaceChr : replace 처리 후 check 할 문자.
	 * @return retChr : 숫자에 해당 하는 값
	 */
	checkNumber = function(field, replace_chr) {
		var val = "";
		
		if ($.type(field.val) == "function") {
			val = field.val();
		} else {
			val = field.value;
		};
		
		if ($.type(replace_chr) != "undefined") {
			val = val.replaceAll(replace_chr, "");
		};
		
		
		return checkNumberVal(val);
	};
	
	checkNumberVal = function(val) {
		var retChr = "";
		$.each(val, function(i, chr){
			var c = chr.charCodeAt(0);
			
			if (!(0x30 <= c && c <= 0x39)) {
	       		alert(fnGetI18nMessge("M.common.message.숫자만입력가능합니다"));
	       		return false;
	       	};
	       	retChr += chr;
		});
    	return retChr;
	};
	
	/**
	 * E-Mail Check
	 * field1 : 이메일 id
	 * msg : alert 메세지
	 * field2 : 이메일 도메인
	 * @return boolean : true - 성공 / false - 실패
	 */
	checkEmail = function(field1, msg, field2) {
		var checkflag = true;
		var retflag;
		var val = "";
		
		
		if ($.type(field1.val) == "function") {
			val = field1.val();
		} else {
			val = field1.value;
		};
		
		if ($.type(field2) != "undefined") {
			var domain = "";
			if ($.type(field2.val) == "function") {
				domain = field2.val();
			} else {
				domain = field2.value;
			};

			if (isEmpty(field1) && isEmpty(field2)) {
				val = "";
			} else {
				val = val + "@" + domain;
			};
		}
	
		if (val != "") {
			if (window.RegExp) {
				var tempstring = "a";
				var exam = new RegExp(tempstring);
				if (tempstring.match(exam)) {
					var ret1 = new RegExp("(@.*@)|(\\.\\.)|(@\\.)|(^\\.)");
					var ret2 = new RegExp("^.+\\@(\\[?)[a-zA-Z0-9\\-\\.]+\\.([a-zA-Z]{2,3}|[0-9]{1,3})(\\]?)$");
					retflag = (!ret1.test(val) && ret2.test(val));
				} else {
					checkflag = false;
				};
				
			} else {
				checkflag = false;
			};
			
			if (!checkflag) {
				retflag = ( (val != "") && (val.indexOf("@")) > 0 && (val.index.Of(".") > 0) );
			};
			;
		} else {
			retflag = true;
		};
		
		if(retflag) {
			return false;
		} else {
			if (msg) {
				alert(msg);
			} else {
				alert(fnGetI18nMessge("M.common.message.이메일주소를입력해주십시오"));
			};
			
			try {
				field.focus();
				field.select();
			} catch(e) {}
			return true;
		};
	};
	
	/** 
     * 메세지 공통처리 하기 
     * @param Gubun : C , U , D , S  
     * @return true : 확인 , false : 취소
     */
   msgConfirm = function(gubun) {
       var msg  = fnGetI18nMessge("M.common.message.처리하시겠습니까");
       var pin = {};
       pin["C"] = fnGetI18nMessge("M.common.message.등록하시겠습니까");
       pin["U"] = fnGetI18nMessge("M.common.message.수정하시겠습니까");
       pin["D"] = fnGetI18nMessge("M.common.message.삭제하시겠습니까");
       pin["S"] = fnGetI18nMessge("M.common.message.저장하시겠습니까");
       pin["A"] = fnGetI18nMessge("M.common.message.승인하시겠습니까");
       pin["AQ"] = fnGetI18nMessge("M.common.message.승인요청하시겠습니까");
       pin["DW"] = fnGetI18nMessge("M.common.message.다운로드하시겠습니까");
       pin["RT"] = fnGetI18nMessge("M.common.message.반려하시겠습니까");
       if (typeof(gubun) != "undefined" && gubun != "") {
    	   if (typeof(pin[gubun]) != "undefined") {
    		   msg =  pin[gubun];
    	   };
       };
       
       //메세지 알림창 노출
       if (confirm(msg)) {
    	   return true;
       };
       return false;
	};
	
	/** 
     * 그리드의 처리후 성공 되면 알림창 띄어주기
     * @param Gubun : C , U , D , S  
     */
   msgSuccess = function(gubun) {
       var msg  = fnGetI18nMessge("M.common.message.처리되었습니다");
       var pin = {};
       pin["C"] = fnGetI18nMessge("M.common.message.등록되었습니다");
       pin["U"] = fnGetI18nMessge("M.common.message.수정되었습니다");
       pin["D"] = fnGetI18nMessge("M.common.message.삭제되었습니다");
       pin["S"] = fnGetI18nMessge("M.common.message.저장되었습니다");
       pin["A"] = fnGetI18nMessge("M.common.message.승인되었습니다");
       pin["AQ"] = fnGetI18nMessge("M.common.message.승인요청되었습니다");
       if (typeof(gubun) != "undefined" && gubun != "") {
    	   if (typeof(pin[gubun]) != "undefined") {
    		   msg =  pin[gubun];
    	   };
       };
       //메세지 알림창 노출
       alert(msg);
   };
   
	/**
	 *  E-Mail Check
	 * @param field form.element
	 * @return boolean
	 */
	isNotValidEmail = function(field, message) {
		var checkflag = true;
		var retvalue;
		var val = "";
		
		if ($.type(field.val) == "function") {
			val = field.val();
		} else {
			val = field.value;
		};
		

		if(val == "") {
			retvalue = false;
		} else {
			if (window.RegExp) {
				var tempstring = "a";
				var exam = new RegExp(tempstring);
				if (tempstring.match(exam)) {
					var ret1 = new RegExp("(@.*@)|(\\.\\.)|(@\\.)|(^\\.)");
					var ret2 = new RegExp("^.+\\@(\\[?)[a-zA-Z0-9\\-\\.]+\\.([a-zA-Z]{2,3}|[0-9]{1,3})(\\]?)$");
					retvalue = (!ret1.test(val) && ret2.test(val));
				} else {
					checkflag = false;
				};
				
			} else {
				checkflag = false;
			};
			
			if (!checkflag) {
				retvalue = ( (val != "") && (val.indexOf("@")) > 0 && (val.index.Of(".") > 0) );
			};
		}
		if(retvalue) {
			return false;
		} else {
			if (message) {
				alert(message);
			} else {
				alert(fnGetI18nMessge("M.common.message.이메일주소를입력해주십시오"));
			};
			
			try {
				field.focus();
				field.select();
			} catch(e) {}
			return true;
		};
	};
   
})(jQuery);