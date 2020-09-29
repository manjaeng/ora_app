(function ($) {
	
    /********************************************************************************************/
    /**************************************** 전시 공통 select option 만들어주기 ***************/
    /********************************************************************************************/
    $.disp = function(selector) {

    	var _obj = $(selector); 

    	//사이트 가져오기 
    	/*
    	 *  user_yn ==> 사용자여부 (사용자적용 사이트만 노출 처리) 
    	 */
    	_obj.siteList = function(p) {
    		
    		$.ajax({url:"/system/site/searchDispSiteList.action", 
    			    dataType: "json",
    			    data:{user_yn:(p.user_yn)?'Y':'N'},
            	    async: false,
        	        success : function(data){
	        	
	                    //데이타를 넣기 전에 삭제 한번 함 
	                    $(selector+' option').remove();
	                    
	                    //사이트 공통
	                    if(typeof(p.commSiteNo) != "undefined" && p.commSiteNo != ""){
	                    	if (p.selectVal == p.commSiteNo) {
	                    		$(selector).append("<option value='"+p.commSiteNo+"' selected>공통</option>");
	                    	} else {
	                    		$(selector).append("<option value='"+p.commSiteNo+"'>공통</option>");
	                    	}
	                    }
	                    
	                    //option을 생성한다.
	                    $.each(data , function (sub , optionData){
	                    	
	                    	if (optionData.site_no == p.selectVal) {
	                    		$(selector).append("<option value='"+optionData.site_no+"'  disp_site_no='"+optionData.disp_site_no+"' selected>" + optionData.site_nm + "</option>");
	                    	}else {
	                    		$(selector).append("<option value='"+optionData.site_no+"'  disp_site_no='"+optionData.disp_site_no+"'>" + optionData.site_nm + "</option>");
	                    	}
	                    });
	                    
	                    //callback이 존재 한다면 실행 처리 한다. 
	                    if(typeof(p.callback) != "undefined"  && typeof(p.callback) == "function"){
	                    	p.callback();
	                    }
	                    
        	        }
    		});
        
    	};
    	
    	//템플릿 명 가져오기 
    	_obj.templList = function(p) {
    		
            $.ajax({
        	    url:"/disp/templ/searchTemplList.action", 
        	    data: {disp_temp_yn:(p.disp_temp_yn)?p.disp_temp_yn:"",
        	    	   site_no:(p.site_no)?p.site_no:""},
                dataType: "json",                 
                async: false,
                success : function(data){
                    //데이타를 넣기 전에 삭제 한번 함 
                	$(selector+' option').remove();
                      
                    $.each(data , function (sub , optionData){
                    	
                    	if (optionData.templ_no == p.selectVal) {
                    		$(selector).append("<option value='" + optionData.templ_no + "'" + " file_path='" + optionData.file_path +"'" +   + selected + ">" + optionData.templ_nm + "</option>");
                    	}else {
                    		$(selector).append("<option value='" + optionData.templ_no + "'" + " file_path='" + optionData.file_path +"'>" + optionData.templ_nm + "</option>");
                    	}
                    	
                    });
                    
                    //callback이 존재 한다면 실행 처리 한다. 
                    if(typeof(p.callback) != "undefined"  && typeof(p.callback) == "function"){
                    	p.callback();
                    }
                    
	            }
            });
    	};
    	
     	//매장유형명  가져오기 
    	_obj.shopTypeList = function(p) {
	        $.post("/disp/dispctg/searchShopTypeList.action", 
	        		{
	        	      templ_no:p.templ_no
	        	    },
	                function(data){
	                    //데이타를 넣기 전에 삭제 한번 함 
	                    $(selector+' option').remove();
	                   
	                    //option을 생성한다.
	                    $.each(data , function (sub , optionData){
	                    	$(selector).append("<option value='" + optionData.disp_ctg_no + "'>" + optionData.disp_ctg_nm + "</option>");
	                    });
	                    
	                }, 
	                "json");
    	};
    	
    	
    	//전시에 등록된 템플릿유형명  가져오기 
    	_obj.shopTypeDispCtgList = function(p) {
    		
	        $.post("/disp/dispctg/searchShopTypeCtgJsonList.action", 
	                {
	             	 disp_ctg_no:p.disp_ctg_no,
	             	 site_no:(p.site_no)?p.site_no:"",
		        	 disp_site_no:(p.disp_site_no)?p.disp_site_no:""
	        	    },
	                
	                function(data){
	                    data = data.shopTypeList;
	                    
	                    //데이타를 넣기 전에 삭제 한번 함 
	                    $(selector+' option').remove();
	                   
	                    //option을 생성한다.
	                    $.each(data , function (sub , optionData){
	                    	$(selector).append("<option value='" + optionData.disp_ctg_no  + "' page_url='" +optionData.page_url + "'>" + optionData.disp_ctg_nm + "</option>");
	                    });
	                }, 
	                "json");
        
    	};
    	
		//몰 가져오기 
		_obj.mallList = function(p) {
			
      		$.ajax({url:"/disp/dispctg/searchSiteMallList.action", 
            	dataType: "json",
            	data: {site_no:p.site_no, disp_site_no:p.disp_site_no},
            	async: false,
        	    success : function(data){
                    data = data.mallList;

                    //데이타를 넣기 전에 삭제 한번 함 
                    $(selector+' option').remove();
                    
                    if (typeof(p.default_yn) != "undefined" && p.default_yn == "Y") {
                	    $(selector).append("<option value='' >" + '전체' + "</option>");
                    }
                    
                    //option을 생성한다.
                    var selected = "";
                    $.each(data , function (sub , optionData){
                    	 selected = "";
                    	 if(typeof(p.selectVal) != "undefined" && p.selectVal != "" ){

                    		 if(optionData.disp_mall_no == p.selectVal){
                    			 selected = "selected=\"selected\"";	 
                    		 }
                    		 
                    	 }
                    	$(selector).append("<option value='" + optionData.disp_mall_no + "'"+ selected + ">" + optionData.disp_mall_nm + "</option>");
                    	
                    });
                    
                    //callback이 존재 한다면 실행 처리 한다. 
                    if(typeof(p.callback) != "undefined"  && typeof(p.callback) == "function"){
                    	p.callback();
                    }
        	    }    
                });
	    
			};
			
			//몰 번호에 따른 카테고리 분류 코드 가져오기
//			_obj.dispClssList = function(p){
//				$.ajax({
//					url: "/system/code/searchStCommCdDtlListJson.action",
//					dataType: "JSON",
//					data : { 
//						grp_cd1 : p.disp_mall_no,
//						comm_cd : p.comm_cd,
//						use_yn : p.use_yn
//					},
//					async: false,
//					success: function(data) {
//						$(selector+' option').remove();
//						var html = "<option value=''>없음</option>";		
//						
//						if(data!=null && data.length>0){
//							$.each(data, function(idx, val){
//								html += "<option value="+val.key+">"+val.value+"</option>";
//							});
//						}
//						
//						$(selector).append(html);
//						
//				     	//callback이 존재 한다면 실행 처리 한다. 
//	                    if(typeof(p.callback) != "undefined"  && typeof(p.callback) == "function"){
//	                    	p.callback();
//	                    }
//					},
//					error: function() {}
//				});
//    		};
			
			
	     	//해당 카테고리를  가져오기 
	    	_obj.dispCtgList = function(p) {
		        $.post("/disp/dispctg/searchDsLowCtgJsonList.action", 
		                {disp_mall_no:p.disp_mall_no,
		        	     depth_no:p.depth_no,
		        	     disp_clss_cd:p.disp_clss_cd,
		        	     disp_type_cd:p.disp_type_cd,
		        	     shop_type_cd:p.shop_type_cd,
		        	     site_no:(p.site_no)?p.site_no:"",
		        	     disp_site_no:(p.disp_site_no)?p.disp_site_no:""},
		                function(data){
		                    data = data.dispCtglList;
		         
		                    //데이타를 넣기 전에 삭제 한번 함 
		                    $(selector+' option').remove();

//                            if( data && data.length > 0){
		                        if (typeof(p.default_yn) != "undefined" && p.default_yn == "Y") {
		                    	    $(selector).append("<option value='' >" + '전체' + "</option>");
		                        }		            
//		                    }
		                    
		                    //option을 생성한다.
		                    var selected = "";
		                    
		                    $.each(data , function (sub , optionData){
		                    	 selected = "";
		                    	 if(typeof(p.selectVal) != "undefined" && p.selectVal != "" ){

		                    		 if(optionData.disp_ctg_no == p.selectVal){
		                    			 selected = "selected=\"selected\"";	 
		                    		 }
		                    	 }
		                    	 $(selector).append("<option value='" + optionData.disp_ctg_no + "'"+ selected + ">" + optionData.disp_ctg_nm + "</option>");
		                    });
		                }, 
		                "json");
	        
	    	};
	    	//make selectbox option
	    	_obj.makeSelectboxOption = function(p){
	    		callback = p.callback;
	    		p.callback = function(){};
	    		
	    		$.ajax({
					url: p.url,
					dataType: "JSON",
					data : p,
					async: false,
					success: function(data) {
						$(selector+' option').remove();
						var html = "";
						
						if(p.default_text != null && p.default_text != ""){
							html = "<option value=''>"+p.default_text+"</option>";	
						}

						var selected = "";
						if(data!=null && data.length>0){
							if(p.defaultYn == "Y"){
								html += "<option value=''>없음</option>";	
							}
							$.each(data, function(idx, val){
								selected = "";
								if(typeof(p.selectVal) != "undefined" && p.selectVal != "" ){
									if(val.key == p.selectVal){
										selected = "selected=\"selected\"";	 
									}
								}
								
								html += "<option value='"+val.key+"'"+ selected + ">"+val.value+"</option>";
							});
						}else{
							html = "<option value=''>없음</option>";	
						}
						
						$(selector).append(html);
						
						if(typeof(callback) != "undefined"  && typeof(callback) == "function")
							callback();
					},
					error: function() {}
				});
	    	};
	    	_obj.makeCommDtlCdOption = function(p) {
	    		p.url = "/system/code/searchStCommCdDtlListJson.action";
	    		$.disp(selector).makeSelectboxOption(p);
	    	};
	    		
    	
        return _obj;
        
    };
    
    /********************************************************************************************/
    /**************************************** 전시 공통 스크립트 ********************************/
    /********************************************************************************************/
    
    //체크박스로 선택한 그리드의 내용이 특정 그리드로 추가 
    fnMoveAdd = function (p){
    	var masterGrid = p.masterGrid; //마스터 그리드    
    	var subGrid    = p.subGrid;   //하위 그리드 
    	var arrKey     = p.keyList;   //키값 셋팅하기  (체크용도)
    	var arrGrid    = p.arrGrid;   //셋팅할 헤더 설정하기
    	var defData    = p.defData;   //디폴트 데이타 설정하기 
    	
    	for (var masterIdx = 0 ; masterIdx < masterGrid.GetRowCount(); masterIdx++) {

    		var masterRow = masterGrid.GetRow({row:masterIdx});
    	
    		if (masterRow.Checked) {
    			
        		
	            //중복 체크 하기 
	            var check = false;
	           
	            for (var sub=0 ; sub < subGrid.GetRowCount(); sub++) {
	            	
	            	var subRow = subGrid.GetRow({row:sub});
	            	
	                if(fnKeyCheck({masterRow:masterRow ,subRow:subRow , arrKey:arrKey })) {

	                	subGrid.ShowRow({row:sub});
	                	subGrid.SetValue({row:sub, id:"GUBUN",value:"R"});

                		masterGrid.HideRow({row:masterIdx});
                		masterGrid.SetValue({row:masterIdx, id:"GUBUN",value:"D"});

	                    check = true;
	                    break;
	                    
	                }
	            }
	            
	            if(!check){
	            	
                    var maxcnt = subGrid.GetRowCount();
                    
                    var gridData = {};
                    
                    //데이타 셋팅하기
                    $.each(arrGrid , function (idx , data){
                    	gridData[idx]  = masterRow[idx];                    	
                    });

                    //디폴트 데이타 설정하기 
                    if(defData){
	                    $.each(defData , function (idx , data){
	                    	gridData[idx]  = data;
	                    });
                    }
                 
                    subGrid.AddRow({
                        row: maxcnt,
                        data:gridData
                    });
                    masterGrid.HideRow({row:masterIdx});
                    masterGrid.SetValue({row:masterIdx, id:"GUBUN",value:"D"});
                    
	            }
    		}
    	}

    	
    };
    
    // 키체크 하기
    // masterRow:masterRow ,subRow:subRow , arrKey:arrKey
    fnKeyCheck = function (p){
    	var masterRow  = p.masterRow;
    	var subRow     = p.subRow;
    	var arrKey     = p.arrKey;
    	
    	var keyCheck = true;
    
    	//키값을 처리한다.
    	for (var idx = 0; idx < arrKey.length; idx++ ) {
    		
    		keyCheck   =  keyCheck && ( masterRow[arrKey[idx]] == subRow[arrKey[idx]] ) ;
    		
    	}
    	
    	return keyCheck;
    	
    };
    
    //숨김처리한 row에 대해 입력 되지 않도록 처리 하기 
    fnSetVisibleData = function (p){
    	
    	var masterGrid = p.grid;
    	var key        = p.key;
    	var value      = p.value ;
    	var upt_yn      = p.upt_yn ;   //기본수정여부
    	
        //유형저장시 무조건 넘어 갈 수 있도록 수정으로 처리 한다. 
        for (var idx=0 ; idx < masterGrid.GetRowCount(); idx++){
        	
        	var row = masterGrid.GetRow({row:idx}) ;
        	
        	if(upt_yn){
        		masterGrid.SetValue({row:idx, id:key, value:upt_yn});
        	}
        	
        	if (row.Visible){
        		masterGrid.SetValue({row:idx, id:key, value:value});
        	}
        }
    };
    
    
    /********************************************************************************************/
    /******************************************전시 팝업창***************************************/
    /********************************************************************************************/
    
	/**
	 * 디자인요청상세
	 */
    fnDesignWorkPop =  function (pin){
    	var pinParam = {rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"") };
        var strTitle = (pin.title == undefined) ? "디자인요청상세" : pin.title;
	
		if (pin.param != undefined) {
			$.extend(pinParam, pin.param);
		}
		
        var defaultParam = {
			
               url : "/disp/designwork/initDesignWorkPop.action",
               winname : "DesignWorkPop",
               title : strTitle,
               width: "750",
               height: "740",
               params : pinParam,
               scrollbars : true
        };
        
        pin = $.extend(defaultParam, pin||{});
        popup(pin);
    };
    
	/**
	 * 코너스탁 팝업 
     */
    fnConrStockListPop = function(pin) {

    	var pinParam = {rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"") };
        var strTitle = (pin.title == undefined) ? "코너 스탁 조회" : pin.title;

		if (pin.param != undefined) {
			$.extend(pinParam, pin.param);
		}
    
        var pinParam = pin.params||{};
		var defaultParam = {
				url : "/disp/popup/forward.ConrStockListPop.action",
				winname : "ConrStockListPop",
				title : strTitle,
	            type : "l",
	            height : "510",
	        	params : pinParam,
				scrollbars : false,
				autoresize : false
	    };
	    pin = $.extend(defaultParam, pin||{});
	    
        popup(pin);
    };
    
    
	/**
	 * 매장유형관리 팝업  
     */
    fnShopTypeMgmtPop = function(pin) {
    	
    	var pinParam = {rtnFunc:((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"") };
        var strTitle = (pin.title == undefined) ? "매장 유형 관리" : pin.title;
        
		if (pin.param != undefined) {
			$.extend(pinParam, pin.param);
		}
		
		var defaultParam = {
				url : "/disp/popup/forward.ShopTypeMgmtPop.action",
				winname : "ShopTypeMgmtPop",
				title : strTitle,
	            type : "l",
	            height : "530",
	        	params :  pinParam,
				scrollbars : false,
				autoresize : false
	    };
		
	    pin = $.extend(defaultParam, pin||{});
	    
        popup(pin);
    };
    
	/**
	 * 몰관리 팝업  
     */
    fnMallMgmtPop = function(pin) {

    	var pinParam = {};
    	
        var strTitle = (pin.title == undefined) ? "몰 관리" : pin.title;
        
		if (pin.param != undefined) {
			
			$.extend(pinParam, pin.param );
		}

		var defaultParam = {
				url : "/disp/popup/forward.MallMgmtPop.action",
				winname : "MallMgmtPop",
				title : strTitle,
	            type : "sl",
	            height : "425",
	        	params :  pinParam,
				scrollbars : false,
				autoresize : false
	    };
		
	    pin = $.extend(defaultParam, pin||{});
	    
        popup(pin);
    };
    
    
	//템플릿관리 페이지 이동 
    fnGoTemplConrMgmt = function(pin){
        var param = "?site_no="+ pin.site_no ;
        param += "&disp_mall_no="+ pin.disp_mall_no;
        param += "&disp_ctg_no="+ pin.disp_ctg_no ;
        param += "&shop_type_cd_grp="+ pin.shop_type_cd_grp;
        param += "&disp_clss_cd="+ pin.disp_clss_cd;
        location.href="/disp/templconr/initTemplConrMgmt.action" + param;
	};
	
	
	//전시카테고리 페이지 이동 
	fnGoDispctg = function(pin){
        var param = "?site_no="+ pin.site_no ;
        param += "&disp_mall_no="+ pin.disp_mall_no;
        param += "&disp_ctg_no="+ pin.disp_ctg_no ;
        param += "&shop_type_cd_grp="+ pin.shop_type_cd_grp;
        param += "&disp_clss_cd="+ pin.disp_clss_cd;
        location.href="/disp/dispctg/initDispCtg.action" + param;
	};
    
    
    
   
	
})(jQuery);