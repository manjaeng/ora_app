(function ($) {
	$(document).ready(function () {
		$("div[id=search_off]").bind({
	        keypress : function(event){
	        	if (document.activeElement.type == "textarea"){
	        		return;
	        	}
	        	if ( event.which == 27 ) {
            		event.preventDefault();
            		$("#cnclBtn").click();
            	}
	        	if ( event.which == 13 ) {
		        	event.preventDefault();
		        	$("#srchBtn").click();
	        	}
			}
	    });
	});
	
	fnCsvDown = function(pin ,grid) {
    	var headers = "";
    	var columns = "";
    	var first = true;
    	$.each(grid, function(idx, obj){
    		
    		if (obj.type != "H") {
	    		if (!first) {
	    			headers += "^&^";
	    			columns += "^&^";
	    		}
	    		headers += obj.header;
	    		columns += obj.id;
	    		
	    		first = false;
    		}
    	});

    	$("input[name=csv_header]", "#"+ pin.form).remove();
    	$("input[name=csv_columns]", "#"+ pin.form).remove();
    	$("input[name=csv_divi]", "#"+ pin.form).remove();
    	$("input[name=file_name]", "#"+ pin.form).remove();
    	
    	$("#"+ pin.form).append("<input type=\"hidden\" name=\"csv_header\" value=\"" + headers +  "\">");
    	$("#"+ pin.form).append("<input type=\"hidden\" name=\"csv_columns\" value=\"" + columns +  "\">");
    	$("#"+ pin.form).append("<input type=\"hidden\" name=\"csv_divi\" value=\"" + pin.divi +  "\">");
    	$("#"+ pin.form).append("<input type=\"hidden\" name=\"file_name\" value=\"" + pin.file +  "\">");
    	
    	$.form("#"+ pin.form).submit({
            action:"/settle/settle/downLoadCsv.action",
            success: function(p) {  
                $.form("#"+ pin.form).run(false);
                return;
            },
            confirm: function() {  
                return msgConfirm("DW");
            }
        });
        
        $.form("#"+ pin.form).run(false);
    }
	
    /**
     * 주문정산비교 상세내역조회
     */
    fnSettleListPop = function(param) {
        popup({
        	url : "/settle/settle/initSettleDtlListPop.action",
            winname : "SettleDtlList_pop",
            title : "주문정산비교 상세내역조회",
            params : param,
            type : "xl",
            height : "600",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * 공급업체정산 상세내역조회
     */
    fnSupplyVendSettlePop = function(param) {
        popup({
        	url : "/settle/settle/initSupplyVendSettlePop.action",
            winname : "SettleSupplyVendDtlList_pop",
            title : "공급업체정산 상세내역",
            params : param,
            type : "xl",
            height : "600",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * 공급업체별 배송비 정산내역상세조회
     */
    fnCostSettleListPop = function(param) {
        popup({
        	url : "/settle/settle/initCostSupplyVendSettlePop.action",
            winname : "CostSettleSupplyVendDtlList_pop",
            title : "공급업체정산 상세내역",
            params : param,
            type : "xl",
            height : "600",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * 채널별 정산내역 상세 조회 팝업
     */
    fnChnlSettleListPop = function(param) {
        popup({
        	url : "/settle/settle/initChnlSettleListPop.action",
            winname : "ChnlSettleList_pop",
            title : "채널별 정산내역 상세조회",
            params : param,
            type : "xl",
            height : "600",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * 자산정산 상세 조회 팝업
     */
    fnAssetSettleListPop = function(param) {
        popup({
        	url : "/settle/settle/initAssetSettleListPop.action",
            winname : "ChnlSettleList_pop",
            title : "자산정산 상세조회",
            params : param,
            type : "l",
            height : "600",
            scrollbars : true,
            resizable : false
        });
    };
    
	/**
	 * SIV 분개
	 */
	fnMakeSpasData = function(param){
		 $.ajax({
			type: "POST",
			url: "/settle/settle/makeSpasData.action",
			dataType: "json",
			data : param,
			success : function(data) {
				
			},
			complete : function(data){
				param = $.extend({callback : function(data){}}, param);
				console.log(JSON.parse(data.responseText));
				param.callback(JSON.parse(data.responseText));			
			}
		});
	};
    
    /**
     * SIV 분개 후 연동화면팝업(임시)
     */
    fnSivJournalPop = function(param) {
    	param = $.extend({ winname:"sivJournal_pop", title:"연동화면", callback:function(){} }, param);
        popup({
        	url : "/settle/settle/initSivJournalPop.action",
            winname : param.winname,
            title : param.title,
            params : param,
            height : "600",
            scrollbars : true,
            resizable : false
        });
    };
    
    
	/**
     * 전도금 전표 팝업 보기 팝업
     */
	fnAcountViewPop = function(pin) {
		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnAcntListForm") };
		//form이 존재 하는 경우 
		if (pin.form != undefined && pin.form != "") {			
			var objForm = $("#" + pin.form);
		}
		
		$.extend(pinParam ,{					
		  	form : pin.form
	    }); 
		
    	popup({
    		url : "/settle/settle/searchSpasAccuntDtlList.action",
            winname : "Acount List",
            title : "전도금 조회",
            params :pinParam,
            width : "1200",
            height : "600",
            scrollbars : true,
            resizable : false
        });
	};	
	
})(jQuery);