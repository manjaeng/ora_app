/****
 *	
 * 금지어 목록을 체크 한다.
 *
 *  사용방법  
 *			
 *		공통 금지어 체크일 경우 매개변수를 1개 넣는다.(검색 문자열) 	$.overpass.prwd.checkBanWord("18 아이폰 시발. 머이 성인용품? 개새끼");
 *		카테고리 금지어 체크일 경우 매개변수를 2개 넣는다.(카테고리 번호,검색 문자열) 	$.overpass.prwd.checkBanWord("1000002322","18 아이폰 시발. 머이 성인용품? 개새끼");
 *
 * @author 장진철 (zerocooldog@pionnet.co.kr)
 */

(function($){
	
	/** 네임 스페이스 생성*/
	if(!$.overpass){
		$.overpass = {};
	}

	$.overpass.prwd = {
	
		checkValue : function (obj,str) {
			
			var type1Length = obj.length;
			
			for(var i = 0; i < type1Length; i++ ){
				if(str.indexOf(obj[i]) != -1 ) {
				
					alert("금지어가 포함되어 있습니다. ["+obj[i]+"]");
					return true;
				}
			}
		},

		checkprwd : function (str){
					
			return $.overpass.prwd.checkValue(_PRWD_TYPE1["9999999999"],str);
		},


		checkprwdCategroy : function (disp_ctg_no,str){
			
			$.overpass.prwd.checkValue(_PRWD_TYPE3[disp_ctg_no],str);
		},

		checkBanWord : function (){
			
			if(!_PRWD_TYPE1){
				window.alert("금지어 배열 정보가 존재하지 않습니다.");
				return;
			}

			var argsLength = arguments.length;
			if(argsLength == 0 || argsLength > 2){
				window.alert("매개변수가 1개이상 2개 이하가 필요합니다. \n (str) or (disp_ctg_no,str) ")
			}else if(argsLength == 1){
				$.overpass.prwd.checkprwd(arguments[0]);
			}else if(argsLength == 2){
				
				if(!$.overpass.prwd.checkprwd(arguments[1])){
					$.overpass.prwd.checkprwdCategroy(arguments[0],arguments[1]);			
				}
			}
		}	
	};

})(jQuery);