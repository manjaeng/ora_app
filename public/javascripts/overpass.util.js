(function($){
	
	/**
	 * data : 주어진 데이타를 배열로 전환한다. 이미 배열이면 변화없고 배열이 아닐경우 length 1인 배열로 변환.
	 */
	makeArray = function(data) {
		return $.makeArray(data);
	};
	
	toCurrency = function(amount) {
		amount = String(amount);
		var data = amount.split('.');
		var sign = "";
		var firstChar = data[0].substr(0,1);
		if(firstChar == "-"){
			sign = firstChar;
			data[0] = data[0].substring(1, data[0].length);
		};
		data[0] = data[0].replace(/\D/g,"");
		if(data.length > 1){
			data[1] = data[1].replace(/\D/g,"");
		};
		firstChar = data[0].substr(0,1);
		//0으로 시작하는 숫자들 처리
		if(firstChar == "0"){
			if(data.length == 1){
				return sign + parseFloat(data[0]);
			};
		};
		var comma = new RegExp('([0-9])([0-9][0-9][0-9][,.])');
		data[0] += '.';
		do {
			data[0] = data[0].replace(comma, '$1,$2');
		} while (comma.test(data[0]));

		if (data.length > 1) {
			return sign + data.join('');
		} else {
			return sign + data[0].split('.')[0];
		};
	};
	
	/**
	 * Cookie값 가져오기
	 */
	getCookie = function(name){
		var nameOfCookie = name + "=";
		var x = 0;
		while ( x <= document.cookie.length ){
			var y = (x+nameOfCookie.length);
			if ( document.cookie.substring( x, y ) == nameOfCookie ) {
				if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 )
					endOfCookie = document.cookie.length;
				return unescape( document.cookie.substring( y, endOfCookie ) );
			}
			x = document.cookie.indexOf( " ", x ) + 1;
			if ( x == 0 )
				break;
		}
		return "";
	};
	
	/**
	 * Cookie값 저장하기
	 */
	setCookie = function(p) {
		
		p = $.extend(false, {
			age: null,
			path: "/",
			domain: null,
			secure: false
		}, p);
		
		var date = new Date();
		date.setDate( date.getDate() + p.age );
			
		document.cookie = 
				p.name + "=" + escape (p.value) + 
				((p.age == null) ? "" : ("; expires=" + date.toGMTString())) + 
				((p.path == null) ? "" : ("; path=" + p.path)) + 
				((p.domain == null) ? "" : ("; domain=" + p.domain)) + 
				((p.secure == true) ? "; secure" : "");
	};
	
	/**
	 * 앞뒤 빈공간 삭제
	 * @param str stirng
	 * @return string
	 */
	String.prototype.trim = function() { 
		return this.replace(/^\s+/g,'').replace(/\s+$/g,''); 
	};
	
	trim = function(str) {
		if(typeof(str) == "undefined") return "";
		return str.replace(/(^\s*)|(\s*$)/gi, "");
	};
	
	String.prototype.replaceAll = function(from, to) {
	    return this.replace(new RegExp(from, "g"), to);
	};
	
	String.prototype.format = function() {
		  var s = this;
		  for (var i = 0; i < arguments.length; i++) {       
		    var reg = new RegExp("\\{" + i + "\\}", "gm");             
		    s = s.replace(reg, arguments[i]);
		  }
		  return s;
	};
	
	/**
	 * input element의 hidden type object를 생성하여 해당 parent_obj에 넣는다.
	 *
	 * @param parent_obj 생성되는 object를 넣을 부모 object object타입으로 넘겨준다.
	 * @param elemName element의 이름
	 * @param elemValue element의 값
	 */
	 putDomInput = function(parent_obj, elemName, elemValue){
		var input = document.createElement("input");
		input.setAttribute("type", "hidden");
		input.setAttribute("name", elemName);
		input.setAttribute("id", elemName);
		input.setAttribute("value", elemValue);
		parent_obj.appendChild(input);
	}
	 
	/**
	 * Date format 지원
	 */ 
	Date.prototype.format = function(f) {    
		if (!this.valueOf()) {
			return " ";     
		};
		
		var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];    
		var d = this;         
		return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {        
			switch ($1) {            
				case "yyyy": 
					return d.getFullYear();            
				case "yy": 
					return (d.getFullYear() % 1000).zf(2);            
				case "MM": 
					return (d.getMonth() + 1).zf(2);            
				case "dd": 
					return d.getDate().zf(2);            
				case "E": 
					return weekName[d.getDay()];            
				case "HH": 
					return d.getHours().zf(2);            
				case "hh": 
					return ((h = d.getHours() % 12) ? h : 12).zf(2);            
				case "mm": 
					return d.getMinutes().zf(2);            
				case "ss": 
					return d.getSeconds().zf(2);            
				case "a/p": 
					return d.getHours() < 12 ? "오전" : "오후";            
				default: 
					return $1;        
			}    
		});
	};
	
	String.prototype.string = function(len) {
		var s = '', i = 0; 
		while (i++ < len) { 
			s += this; 
		} 
		return s;
	};
	String.prototype.zf = function(len) {
		return "0".string(len - this.length) + this;
	};
	
	Number.prototype.zf = function(len) {
		return this.toString().zf(len);
	};
	
	encodeURI = function(value) {
		return encodeURIComponent(value).replace(/%20/g, "+");
	};
	
    /**
	 * 패스워드 유효성 검사
	 * 1.6자 이상 ~ 15자 이하
	 * 2.영대문자, 영소문자, 숫자, 특수기호중 2가지 이상이ㅡ 조합
	 * 3.동일문자 3회이상 반복 불가
	 * 4.키보드상 연속문자열 4자 이상 사용불가
	 * 5.사용자ID와 연속 3문자 이상 중복 불가
	 * 6.연속된 숫자/문자 3자 이상 사용불가
	 *
	 * 패스워드가 부적합하면 true 리턴
	 */
	checkPassword = function(passwd, usr_id) {

		//숫자/문자의 순서대로 3자 이상 사용금지
		var strights = ['012345678901', '987654321098', 'abcdefghijklmnopqrstuvwxyzab', 'zyxwvutsrqponmlkjihgfedcbazy'];

		//연속된 키보드 조합
		var keypads = [
			       		'`1234567890-=', 	'=-0987654321`', 	'~!@#$%^&*()_+', 	'+_)(*&^%$#@!~',
			       		'qwertyuiop[]\\', 	'\\][poiuytrewq', 	'QWERTYUIOP{}|',	'|}{POIUYTREWQ',
			       		'asdfghjkl;\'', 	'\';lkjhgfdsa', 	'ASDFGHJKL:"', 		'":LKJHGFDSA',
			       		'zxcvbnm,./', 		'/.,mnbvcxz', 		'ZXCVBNM<>?', 		'?><MNBVCXZ'
			       		];

		var getPattern = function(str, casesensitive) {

			//정규식 생성전에 예약어를 escape 시킨다.
			var reserves = ['\\', '^', '$', '.', '[', ']', '{', '}', '*', '+', '?', '(', ')', '|'];

			$.each(reserves, function(index, reserve){
				var pattern = new RegExp('\\' + reserve, 'g');
				if (pattern.test(str)) {
					str = str.replace(pattern, '\\' + reserve);
				}
			});
			var pattern = null;
			if (casesensitive == false) {
				pattern = new RegExp(str, 'i');
			} else {
				pattern = new RegExp(str);
			}

			return pattern;
		}

		if (passwd.match(/^.{10,20}$/g) == null) {
			alert('패스워드는 10자리 이상 20자리 미만으로 입력하세요.');
			return true;
		}

		var valid_count = 0;
		if (passwd.match(/[a-z]/) != null) {
			valid_count++;
		}
		if (passwd.match(/[A-Z]/) != null) {
			valid_count++;
		}
		if (passwd.match(/[0-9]/) != null) {
			valid_count++;
		}
		if (passwd.match(/\W/) != null) {
			valid_count++;
		}

		if(valid_count < 2) {
			alert('패스워드는 영문대문자/영문소문자/숫자/특수기호중 2가지 이상을 혼합하여 입력하세요.');
			return true;
		}

		for (var i = 0 ; i < passwd.length ; i++) {
			if (passwd.charAt(i+1) != '' && passwd.charAt(i+2) != '') {
				if (passwd.charCodeAt(i) == passwd.charCodeAt(i+1) && passwd.charCodeAt(i+1) == passwd.charCodeAt(i+2)) {	//동일문자 3회 반복
					alert('패스워드는 동일문자를 연속3회이상 반복 하실 수 없습니다.');
					return true;
				}
				var str = passwd.charAt(i)+''+passwd.charAt(i+1)+''+passwd.charAt(i+2);

				var pattern = getPattern(str, false);

				for (var j = 0 ; j < strights.length ; j++) {
					if (pattern.exec(strights[j]) != null) {
						alert('패스워드는 연속된 알파벳/숫자 조합을 사용할 수 없습니다.');
						return true;
					}
				}

				//아이디와 3자 이상 중복 불가
				if (pattern.exec(usr_id) != null) {
					alert('패스워드는 아이디와 3자 이상 중복될 수 없습니다.');
					return true;
				}
			}
		}

		for (var i = 0 ; i < passwd.length ; i++) {
			if (passwd.charAt(i+1) != '' && passwd.charAt(i+2) != '' && passwd.charAt(i+3) != '') {
				var str = passwd.charAt(i)+''+passwd.charAt(i+1)+''+passwd.charAt(i+2) +''+ passwd.charAt(i+3);

				var pattern = getPattern(str);

				for (var j = 0 ; j < keypads.length ; j++) {
					if (pattern.exec(keypads[j]) != null) {
						alert('연속된 키보드 조합을 사용할 수 없습니다.');
						return true;
					}
				}
			}
		}
		return false;
	};
	
	checkByte = function(p) {
		p = $.extend({ id: null, max: null, display_id: null }, p || {});
		if (p.id == null) {
			alert("텍스트필드ID를 입력하세요!");
			return;
		};
		if (p.max == null || p.max <= 0) {
			alert("max값을 입력하세요!");
			return;
		};
		
		var input = $("#" + p.id);
		var str = input.val();
		
		var bytes = 0;
		var total_bytes = 0;
		var length = 0;
		for(var i = 0 ; i < str.length ; i ++) {
			var c = escape(str.charAt(i));
			if ( c.length == 1 ) {
				bytes ++;
			} else if ( c.indexOf("%u") != -1 ) {
				bytes += 2;
			} else if ( c.indexOf("%") != -1 ) {
				bytes += c.length/3;
			}
			
			if (bytes > p.max) {
				alert("글자를 초과 입력할수 없습니다. 초과된 내용은 자동으로 삭제 됩니다.");
				input.val(str.substr(0, length));
				break;
			};
			
			if ( c.length == 1 ) {
				total_bytes ++;
			} else if ( c.indexOf("%u") != -1 ) {
				total_bytes += 2;
			} else if ( c.indexOf("%") != -1 ) {
				total_bytes += c.length/3;
			};
			
			length++;
		};
		if (p.display_id != null) {
			$("#" + p.display_id).val(total_bytes);
		};
	};
	
	/*
	 * SELECT *
	 *   FROM NLS_DATABASE_PARAMETERS
	 *  WHERE PARAMETER = 'NLS_CHARACTERSET'
	 *     OR PARAMETER = 'NLS_NCHAR_CHARACTERSET'
	 *  DB 설정에 따라 한글의 바이트 수 계산 변경
	 *  AL32UTF8 3 AL16UTF16 2 DEFAULT 2   
	 */
	checkByteDBNLS = function(p) {
		p = $.extend({ id: null, max: null, display_id: null }, p || {});
		
		var korbyte = 2;
		var dbNLS = "AL32UTF8";
		
		if (dbNLS == "AL32UTF8") {
			korbyte = 3;
		}else if (dbNLS == "AL16UTF16"){
			korbyte = 2;
		}else {
			korbyte = 2;
		}
		
		if (p.id == null) {
			alert("텍스트필드ID를 입력하세요!");
			return;
		};
		if (p.max == null || p.max <= 0) {
			alert("max값을 입력하세요!");
			return;
		};
		
		var input = $("#" + p.id);
		var str = input.val();
		
		var bytes = 0;
		var total_bytes = 0;
		var length = 0;
		for(var i = 0 ; i < str.length ; i ++) {
			var c = escape(str.charAt(i));
			if ( c.length == 1 ) {
				bytes ++;
			} else if ( c.indexOf("%u") != -1 ) {
				bytes += korbyte;
			} else if ( c.indexOf("%") != -1 ) {
				bytes += c.length/3;
			}
			
			if (bytes > p.max) {
				alert("글자를 초과 입력할수 없습니다. 초과된 내용은 자동으로 삭제 됩니다.");
				input.val(str.substr(0, length));
				break;
			};
			
			if ( c.length == 1 ) {
				total_bytes ++;
			} else if ( c.indexOf("%u") != -1 ) {
				total_bytes += korbyte;
			} else if ( c.indexOf("%") != -1 ) {
				total_bytes += c.length/3;
			};
			
			length++;
		};
		if (p.display_id != null) {
			$("#" + p.display_id).val(total_bytes);
		};
	};
	
	getByte = function(str){
		var bytes = 0;
		var total_bytes = 0;
		for(var i = 0 ; i < str.length ; i ++) {
			var c = escape(str.charAt(i));
			if ( c.length == 1 ) {
				bytes ++;
			} else if ( c.indexOf("%u") != -1 ) {
				bytes += 2;
			} else if ( c.indexOf("%") != -1 ) {
				bytes += c.length/3;
			}
			
			if ( c.length == 1 ) {
				total_bytes ++;
			} else if ( c.indexOf("%u") != -1 ) {
				total_bytes += 2;
			} else if ( c.indexOf("%") != -1 ) {
				total_bytes += c.length/3;
			};
		};

		return total_bytes;
	};
	
	// 2020.04.06 추가
	getBytesUTF8 = function(str) {
		var bytes = 0;
		var korbyte = 3;
		var total_bytes = 0;
		for(var i = 0 ; i < str.length ; i ++) {
			var c = escape(str.charAt(i));
			if ( c.length == 1 ) {
				bytes ++;
			} else if ( c.indexOf("%u") != -1 ) {
				bytes += korbyte;
			} else if ( c.indexOf("%") != -1 ) {
				bytes += c.length/3;
			}
			
			if ( c.length == 1 ) {
				total_bytes ++;
			} else if ( c.indexOf("%u") != -1 ) {
				total_bytes += korbyte;
			} else if ( c.indexOf("%") != -1 ) {
				total_bytes += c.length/3;
			};
		};
		return total_bytes;
	};
	
	// 2020.04.06 추가
	isMobile = function(str) {
		var regExp = /(01[016789])-([0-9]{3,4})-([0-9]{4})$/g;
		if(regExp.test(str)) {
			return true;
		} else {
			return false;
		}
	};
	
	// 2020.04.06 추가
	isPhone = function(str) {
		var regExp = /(050[0-9]{1}|02|0[1-9]{2})-([0-9]{3,4})-([0-9]{4})$/g;
		if(regExp.test(str)) {
			return true;
		} else {
			return false;
		}
	};
	
	// 2020.04.06 추가
	isPhoneOrMobile = function(str) {
		var regExp = /(01[016789]|050[0-9]{1}|02|0[1-9]{2})-([0-9]{3,4})-([0-9]{4})$/g;  
		if(regExp.test(str)) {
			return true;
		} else {
			return false;
		}		
	};
	
	// 2020.04.06 추가
	isDigit = function(str) {
		var regExp = /^[0-9]+$/;
		if (regExp.test(str)) {
			return true;
		} else {
			return false;
		}
		
	}
	
	//2020.06.10 추가
	isEmail = function(str) {
		var rgEx = /^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{1,5}/g;
		if(rgEx.test(str)) {
			return true;
		} else {
			return false;
		}
	}
	
	//주어진 input 필드의 값을 기준으로 checkbox를 만들고 값을 동기화 시킨다.
	$.fn.createCheckbox = function(p) {
		p = $.extend({ id : null,name : null,disabled: false }, p || {});
		var input = this;
		input.hide();
		var checkbox = $("<input "+((p.id) ? "id=\""+p.id+"\"" : "")+" "+((p.name) ? "name=\""+p.name+"\"" : "")+" type=\"checkbox\"></input>").addClass("checkbox").change(function() {
			if (this.checked) {
				input.val("Y");
			} else {
				input.val("N");
			};
		}).attr({
			checked: input.val() == "Y",
			disabled: p.disabled
		});
		input.before(checkbox);
		return {
			val: function(v) {
				input.val(v);
				checkbox.attr({
					checked: v == "Y"
				});
			}
		};
	};
	
	/**
	 * Util.text.lpad
	 */
	lpad = function(originalString, totalLength, padString) {
		
		var len = originalString.length;
		var returnString = originalString;
		
		while(len < totalLength) {
			returnString += padString;
			len++;
		}

		return returnString;
	};
	
	/**
	 * MD 콤보박스 생성 리스트
	 * user_id : 해당 사용자의 MD를 보여줄 경우 - 미 지정시 사용자ID가 있는 전체 MD 조회
	 * default_val : 콤보박스 default 값 지정 - 미 지정시 전체로 default
	 * md_divi_cd : MD - 10 / AMD - 20 / 미 지정시 전체
	 * display_id : input에 뿌려줄 id 값
	 */
	fnGetMdListCombo = function(p) {
		p = $.extend({ user_id: null, default_val: null, md_divi_cd: null, display_id: null }, p || {});
		$.ajax({
            url: "/system/user/searchMdidListCombo.action",
            dataType: "json",
            data: {user_id : p.user_id, md_divi_cd : p.md_divi_cd},
            async: false,
            success : function(data) { 
        		if (p.display_id != null) {
        			$("#"+p.display_id).empty();
        			$("#"+p.display_id).append("<option value=''>"+((p.default_val != null && p.default_val != "") ? p.default_val : "전체")+"</option>");
                    for(var idx = 0; idx < data.length; idx++){
                        $("#"+p.display_id).append("<option value='" + data[idx].md_id + "'>" + data[idx].md_nm + "</option>");
                    }
        		};
            }
        });
	};
	
	/**			
	 * 시스템프로퍼티로 셀랙트 박스 생성		
	 * rel_no : 관련번호		
	 * prop_no : 프로퍼티 번호		
	 * use_yn : 사용여부지정 - 미 지정시 관계없지 전부
	 * display_id : input에 뿌려줄 id 값		
     * default_text : 콤보박스 default 값 지정 - 미 지정시 전체로 default			
	 * apply_cont : option에 보여줄 컬럼명 지정 - 미 지정시 prop_dtl_nm 프로퍼티 상세명		
	 */		
	fnGetSysPropListSelect = function(p) {		
		p = $.extend({ rel_no: null, prop_no: null, use_yn: null, display_id: null, default_text: null, apply_cont: "prop_dtl_nm"}, p || {});	
		$.ajax({	
            url: "/system/code/searchStSysPropDtlList.action",			
            dataType: "json",			
            data: {rel_no : p.rel_no, prop_no : p.prop_no, use_yn: p.use_yn, method:"json"},			
            async: false,			
            success : function(data) {			
            	var text = "data[idx]." + p.apply_cont;		
        		if (p.display_id != null) {	
        			$("#"+p.display_id).empty();
        			$("#"+p.display_id).append("<option value=''>"+((p.default_val != null && p.default_val != "") ? p.default_text : "전체")+"</option>");
                    for(var idx = 0; idx < data.length; idx++){			
                        $("#"+p.display_id).append("<option value='" + data[idx].prop_dtl_no + "'>" + eval(text) + "</option>");			
                    }			
        		};	
            }			
        });			
	};		
	
	/**
	 * 고객사 그룹별 고객사번호 콤보박스 생성
	 * user_id : 로그인한 사용자 ID
	 * display_id : 설정할 콤보박스 아이디
	 * default_val : 초기적용값
	 */
	fnCreateClientNoCombo = function(p) {
		p = $.extend({ user_id: null, display_id: null, default_val: null }, p || {});

		if(p.display_id == null){
			alert("콤보박스 ID가 없습니다.");
			return;
		}

		$.ajax({
            url: "/system/user/searchUserClientGrpList.action",
            dataType: "json",
            data: {user_id : p.user_id},
            async: false,
            success : function(data) { 
        		if (p.display_id != null) {
        			$("#"+p.display_id).empty();
                    for(var idx = 0; idx < data.length; idx++){
                        $("#"+p.display_id).append("<option value='" + data[idx].CLIENT_NO + "'>" + data[idx].CLIENT_NM + "</option>");
                    }
        		};
        		
        		if(p.default_val != null){
        			$("#" + p.display_id).val(p.default_val);
        		}
        		
        		if(data.length > 1){
        			$("#" + p.display_id).show();
        		}else{
        			$("#" + p.display_id).hide();
        		}
            }
        });
	};
	
	/**			
	 * 그리드 해더 정보를 넘기면 excel_header 를 생성
	 * columns : 그리드 컬럼 정보 [{}]
	 */		
	fnCreateExcelHeader= function(columns){
		var return_header = {};
		if(columns == undefined || columns == ""){
			return return_header;
		};
		$.each(columns, function(idx,  column){
			return_header[column.header] = column.id;
		});
		return return_header;
	};
	
	/**			
	 * 상품상세 프론트 미리보기
	 * url : 프론트URL
	 * goodsNo : 상품번호 
	 * tempYn : 임시상품여부
	 * virVendNo : 가상업체번호
	 */		
	fnGoodsDetailView= function(url,goodsNo,tempYn,virVendNo){
		
		var popupName = Math.floor(Math.random() * 10000).toString();
	
		var form = $("<form/>").attr({
			id: "frontForm",
			name: "frontForm",
			method: "post"
		});
		$("#frontForm").remove();
		form.appendTo("body");
		if(tempYn != "Y"){
			form.append($("<input type='hidden' id='goods_no' name='goods_no'/>"));
			form.append($("<input type='hidden' id='previewYn' name='previewYn' value='Y'/>"));
		}else{
			form.append($("<input type='hidden' id='temp_goods_no' name='temp_goods_no'/>"));
			form.append($("<input type='hidden' id='vir_vend_no' name='vir_vend_no'/>"));
			form.append($("<input type='hidden' id='previewYn' name='previewYn' value='Y'/>"));
		}
		
	    var frontForm = document.frontForm;
	    window.open('',popupName);
	    frontForm.action = url;
	    frontForm.method="post";
	    frontForm.target = popupName; //window,open()의 두번째 인수와 같아야 하며 필수다.
	    if(tempYn!="Y"){
	    	frontForm.goods_no.value = goodsNo;	
	    }else{
	    	frontForm.temp_goods_no.value = goodsNo;
	    	frontForm.vir_vend_no.value = virVendNo;
	    }
	    
	    frontForm.submit();
	}; 
	
	/**			
	 * 전화번호,휴대폰번호 하이픈 붙여서 리턴
	 * 리턴값 : 구분값, 번호
	 */
	fnTelOrCellNumberAddHipen = function(str){
		var rtnStr = "";
		var schGubun = "";
		var strGubunNum1 = str.substring(0,3);
		var strGubunNum2 = "";
		var strGubunNum3 = str.substring(str.length-4,str.length);
		
		if(strGubunNum1.indexOf("02") != -1){
			schGubun = "tel_no";
			if(str.indexOf("-") != -1){
				rtnStr = str;
			}else {
				strGubunNum1 = str.substring(0,2);
				strGubunNum2 = str.substring(2);
				strGubunNum2 = strGubunNum2.substring(0,strGubunNum2.length-4);
				rtnStr = strGubunNum1+"-"+strGubunNum2+"-"+strGubunNum3;
			}
		}else {
			schGubun = "cell_no";
			if(str.indexOf("-") != -1){
				rtnStr = str;
			}else {
				strGubunNum2 = str.substring(3);
				strGubunNum2 = strGubunNum2.substring(0,strGubunNum2.length-4);
				rtnStr = strGubunNum1+"-"+strGubunNum2+"-"+strGubunNum3;
			}
		}
		return [schGubun, rtnStr];
	};

})(jQuery);