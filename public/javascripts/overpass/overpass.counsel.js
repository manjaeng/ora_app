(function ($) {
	
	/**
	 * 상담분류팝업  
     */
    fnCounselClssPop = function(pin) {
    	 
    	//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnCounselClssInfo") };
		
        var strTitle = (pin.title == undefined) ? "상담 분류 팝업" : pin.title;
        
		if (pin.form != undefined && pin.form != "") {
			
			var objForm = $("#" + pin.form);
			
			var strCounsel_clss_no = $("input[id=counsel_clss_no]", objForm).val();
			var strCounsel_clss_nm = $("input[id=counsel_clss_nm]", objForm).val();

			$.extend(pinParam ,{
				counsel_clss_no : (strCounsel_clss_no == "undefined") ? "": strCounsel_clss_no,
			    counsel_clss_nm : (strCounsel_clss_nm == "undefined") ? "": strCounsel_clss_nm,
			    form : pin.form
		    }); 
		}
		
		if (pin.param != undefined) {
			$.extend(pinParam, pin.param );
		}
		
		var defaultParam = {
				url : "/counsel/popup/forward.CounselClssPop.action",
				winname : "CounselClssPop",
				title : strTitle,
				type : "s",
				width : "590",
				height : "520",
	        	params :  pinParam,
				scrollbars : false,
				autoresize : false
	    };
		
	    pin = $.extend(defaultParam, pin||{});
	    
        popup(pin);
    }
    
    
	//상담분류팝업 폼인경우 셋팅
    fnCounselClssInfo = function(pin) {
    	
		$("input[id=counsel_clss_no]", $("#" + pin.form)).val(pin.data[0]["COUNSEL_CLSS_NO"]);
		$("input[id=counsel_clss_nm]", $("#" + pin.form)).val(pin.data[0]["COUNSEL_CLSS_NM"]);
	}

    /**
	 * 상담문구 팝업  
     */
    fnCounselPhrasePop = function(pin) {
    	 
    	//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = {};
		
        var strTitle = (pin.title == undefined) ? "상담 문구  팝업" : pin.title;
        
		if (pin.param != undefined) {
			$.extend(pinParam, pin.param );
		}
		
		
		var defaultParam = {
				url : "/counsel/counsel/initCounselPhrasePop.action",
				winname : "CounselPhrasePop",
				title : strTitle,
				width : "770",
				height : "730",
	        	params :  pinParam,
				scrollbars : true,
				autoresize : false
	    };
		
	    pin = $.extend(defaultParam, pin||{});
	    
        popup(pin);
    }
    
    
    /**
     * text area clear하기 
     * */
    clearTextArea = function(name , size){
 	   clearInput({name:name});
 	   limitText(name, 4000, size);
    }
    
    
    /**
	 * 상담원배분 팝업 
     */
    fnOutBoundAllocationPop = function(pin) {
    	 
    	//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = {};
		
        var strTitle = (pin.title == undefined) ? "아웃바운드 팝업" : pin.title;
        
		if (pin.param != undefined) {
			$.extend(pinParam, pin.param );
		}
		
		var defaultParam = {
				url : "/counsel/outbound/initOutBoundAllocationPop.action",
				winname : "OutBoundTypePop",
				title : strTitle,
				width : "700",
				height : "530",
	        	params :  pinParam,
				scrollbars : true,
				autoresize : false
	    };
		
	    pin = $.extend(defaultParam, pin||{});
	    
        popup(pin);
    }
    
    /**
	 * 아웃바운드 유형 팝업  
     */
    fnOutBoundTypePop = function(pin) {
    	 
    	//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = {};
		
        var strTitle = (pin.title == undefined) ? "아웃바운드 팝업" : pin.title;
        
		if (pin.param != undefined) {
			$.extend(pinParam, pin.param );
		}
		
		var defaultParam = {
				url : "/counsel/outbound/initOutBoundTypePop.action",
				winname : "OutBoundTypePop",
				title : strTitle,
				width : "700",
				height : "560",
	        	params :  pinParam,
				scrollbars : true,
				autoresize : false
	    };
		
	    pin = $.extend(defaultParam, pin||{});
	    
        popup(pin);
    }
    
    
    /**
	 * 아웃바운드 처리 상세 팝업
     */
    fnOutBoundProcDtlPop = function(pin) {
    	 
    	//해당 받는 펑션은 기본으로 셋팅해 준다. 
    	var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"") };
		
        var strTitle = (pin.title == undefined) ? "아웃바운드 처리 상세 팝업" : pin.title;
        
		if (pin.param != undefined) {
			$.extend(pinParam, pin.param );
		}
		
		var defaultParam = {
				url : "/counsel/outbound/initOutBoundProcDtlPop.action",
				winname : "OutBoundProcDtlPop",
				title : strTitle,
				width : "700",
				height : "600",
	        	params :  pinParam,
				scrollbars : true,
				autoresize : false
	    };
		
	    pin = $.extend(defaultParam, pin||{});
	    
        popup(pin);
    }

    
    /**
	 * 회원보상관리 팝업  
     */
    fnMbrAmendsMgmtPop = function(pin) {
    	 
    	//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"") };
		
        var strTitle = (pin.title == undefined) ? "회원보상관리 팝업" : pin.title;
        
		if (pin.param != undefined) {
			$.extend(pinParam, pin.param );
		}
		
		var defaultParam = {
				url : "/counsel/counsel/initMbrAmendsMgmtPop.action",
				winname : "MbrAmendsMgmtPop",
				title : strTitle,
				width : "700px",
				height : "620px",
	        	params :  pinParam,
				scrollbars : true,
				autoresize : false
	    };
		
	    pin = $.extend(defaultParam, pin||{});
	    
        popup(pin);
    }    
    
	/**
     * 회원선택 팝업
     */
	fnchoiceMbrPop = function(callNum, mbrObj){
		var schValues = "";
		var schGubun = "";
		var schNumber = "";
		
		if(callNum != ""){
			schValues = fnTelOrCellNumberAddHipen(callNum);
			schGubun = schValues[0];
			schNumber = schValues[1];
		}else if(typeof mbrObj == "object"){
			schNumber = mbrObj.mbrNo;
			schGubun = mbrObj.gubun;
		}
		
		popup({
			url : "/counsel/counsel/initChoiceMbrPop.action",
            winname : "choiceMbrPop",
            title : "회원선택",
            width : "950",
            height : "750",
            params : {"schVal":schNumber, "schGubun":schGubun},
            scrollbars : false,
            autoresize : false
        });	
	};
	
	
	/**
     * 아웃바운드 상세 팝업
     */
	fnOutBoundPop = function(pin){
		var strObNo = pin.ob_no;
		popup({
			url : "/counsel/outbound/initOutBoundPop.action",
            winname : "OutBoundPop",
            title : "아웃바운드 팝업",
            type : "l",
            height : "660px",
            params :pin,
            scrollbars : true,
            autoresize : false
        });	
	};
	
	//상담 이미지 팝업
	fnCounselImgPop = function(pin) {
		//해당 받는 펑션은 기본으로 셋팅해 준다. 
		var pinParam = {};
		
        var strTitle = (pin.title == undefined) ? "문의 이미지 팝업" : pin.title;
        
		if (pin.param != undefined) {
			$.extend(pinParam, pin.param );
		}
		
		var defaultParam = {
				url : "/counsel/counsel/initCounselImgPop.action",
				winname : "CounselImgPop",
				title : strTitle,
				width : "700",
				height : "560",
	        	params :  pinParam,
				scrollbars : true,
				autoresize : false
	    };
		
	    pin = $.extend(defaultParam, pin||{});
	    
        popup(pin);
    };
    
	/**
	 * 상담분류 selectbox생성
	 */
	 fnSetCounselClssList = function(varUpper_counsel_clss_no, text) {
		text = typeof text !== 'undefined' ? text : "전체";
		// 상담분류-대분류
	    $.ajax({
	        url: "/popup/searchCsCounselClssNoPagingList.action",
	        dataType: "json",
	        data:{upper_counsel_clss_no:varUpper_counsel_clss_no, counsel_clss_lev:1},
	        async: false,
	        success : function(data) {
	            data = data.counselClssList;
	            $("#counsel_clss_lev2 option").remove();
	            $("#counsel_clss_lev2").attr("style", "width:120px");
	            $("#counsel_clss_lev2").append("<option value=''>" + text + "</option>");
	            
	            $("#counsel_clss_lev3 option").remove();
	            $("#counsel_clss_lev3").attr("style", "width:120px");
	            $("#counsel_clss_lev3").append("<option value=''>" + text + "</option>");
	            
	            $("#counsel_clss_lev1 option").remove();
	            $("#counsel_clss_lev1").append("<option value=''>" + text + "</option>");
	            for(var idx = 0; idx < data.length; idx++){
	                $("#counsel_clss_lev1").append("<option value='" + data[idx].counsel_clss_no + "'>" + data[idx].counsel_clss_nm + "</option>");
	            }
	        }
	    }); 
	};
	
	/**
	 * 상담분류2레벨 selectbox생성
	 */
	 fnSetCounselClssListLev2 = function(varUpper_counsel_clss_no, text) {
		text = typeof text !== 'undefined' ? text : "전체";
		// 상담분류-대분류
	    $.ajax({
	        url: "/popup/searchCsCounselClssNoPagingList.action",
	        dataType: "json",
	        data:{upper_counsel_clss_no:varUpper_counsel_clss_no},
	        async: false,
	        success : function(data) {
	            data = data.counselClssList;
	            $("#counsel_clss_lev3 option").remove();
	            $("#counsel_clss_lev3").attr("style", "width:120px");
	            $("#counsel_clss_lev3").append("<option value=''>" + text + "</option>");
	            
	            $("#counsel_clss_lev2 option").remove();
	            $("#counsel_clss_lev2").attr("style", "width:120px");
	            $("#counsel_clss_lev2").append("<option value=''>" + text + "</option>");
	            for(var idx = 0; idx < data.length; idx++){
	            	$("#counsel_clss_lev2").append("<option value='" + data[idx].counsel_clss_no + "'>" + data[idx].counsel_clss_nm + "</option>");
	            }
	        }
	    }); 
	};		
	
	/**
	 * 상담분류3레벨 selectbox생성
	 */
	fnSetCounselClssListLev3 = function(varUpper_counsel_clss_no, text) {
		text = typeof text !== 'undefined' ? text : "전체";
		//상담분류-대분류
	    $.ajax({
	        url: "/popup/searchCsCounselClssLev2NoPagingList.action",
	        dataType: "json",
	        data:{upper_counsel_clss_no:varUpper_counsel_clss_no},
	        async: false,
	        success : function(data) {
	            data = data.counselClssLev2List;
	            $("#counsel_clss_lev3 option").remove();
	            $("#counsel_clss_lev3").attr("style", "width:120px");
	            $("#counsel_clss_lev3").append("<option value=''>" + text + "</option>");
	            for(var idx = 0; idx < data.length; idx++){
	            	$("#counsel_clss_lev3").append("<option value='" + data[idx].counsel_clss_no + "'>" + data[idx].counsel_clss_nm + "</option>");
	            }
	        }
	    }); 
	};
	
	
})(jQuery);