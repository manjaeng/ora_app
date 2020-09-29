(function($){
	
	M.common = {
		실버라이트용: "For Silverlight"
	};
	
	M.common.btn = {
		조회: "SEARCH",
		초기화: "RESET",
		닫기: "CLOSE",
		확인: "CONFIRM"
	};
	
	M.common.calendar = {
		달력: "Calendar",
		년: "Year",
		월: "Month",
		일: "Day",
		시: "hours",
		분: "minutes",
		이전달: "Previous Month",
		다음달: "Next Month",
		일요일: "SUN",
		월요일: "MON",
		화요일: "TUE",
		수요일: "WED",
		목요일: "THU",
		금요일: "FRI",
		토요일: "SAT",
		종료일지정안함: "Not specify the end",
		오늘 : "Today",
		요일 : "Day of the week",
		달력요일일 :"Calendar-Day of the week, Day"
		
	};
	
	M.common.message = {
		//처리 확인 메시지
	    처리하시겠습니까: "Are you sure you want to handle?",
		등록하시겠습니까: "Would you like to register?",
		수정하시겠습니까: "Do you want to modify?",
		삭제하시겠습니까: "Are you sure you want to delete?",
		저장하시겠습니까: "저장하시겠습니까?",
		승인하시겠습니까: "Do you want to save?",
		승인요청하시겠습니까: "Would you like to request approval?",
		다운로드하시겠습니까: "Do you want to download?",
		
		//처리 결과 메시지
		처리되었습니다: "Been processed..",
	    등록되었습니다: "Has been registered.",
	    수정되었습니다: "Fixed.",
	    삭제되었습니다: "Has been deleted.",
	    저장되었습니다: "Been saved.",
	    승인되었습니다: "Has been approved.",
	    승인요청되었습니다: "Approval has been requested.",
	    
	    //각종 공통메시지
		날짜필드가아닙니다: "It is not a date field.",
		날짜형식이올바르지않습니다:"Date format is invalid.",
		형식으로입력해주십시요:"Please input format.",
		숫자만입력가능합니다:"The numeric only.",
	    이메일주소를입력해주십시오:"Please enter your e-mail address.",
	    
	    시작일시가종료일시보다크거나같습니다:"Start date is greater than or equal to the end date.",
	    시작일이종료일보다큽니다:"The Start date is greater then end date.",
	    잘못된호출로인하여xhr을실행할수없습니다: "Wrong calls can not be run due to xhr. Please return to the Array function format.",
	    헤더정보가올바르지않습니다: "The header information is invalid."
	};
})(jQuery);