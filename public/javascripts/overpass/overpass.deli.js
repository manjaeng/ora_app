(function($){
	
		
		////////////////////////////////////////////////// 배송관련 스크립트 start ///////////////////////////////////////////////////////////////////	
        
		/**
	     * 송장조회
	     * 
	     * @param pin :
	     *            var pin = {deli_no:"201205080000244"};
	     */
        fnInvoiceViewPop = function(pin){
    		if (pin.invoice == "" || pin.parcel_comp_cd == "") {
    			alert("배송 송장 추적을 위한 정보가 부족합니다. \n\송장번호, 택배사 정보 확인");
    			return;
    		};
    		
    		popup({
    			url : "/deli/deli/initDeliInvoiceTrace.action",
    			winname : "InvoiceTrace_pop",
                params : pin,
                height : "650px",
                width : "550px",
                scrollbars : true,
                autoresize : false
    		});
        };
        
		/**
	     * 추가송장조회
	     * 
	     * @param pin :
	     *            var pin = {deli_no:"201205080000206", deli_seq:"0001"};
	     */
        fnAddInvoiceViewPop = function(pin) {
	        var strTitle = (pin.title == undefined) ? "배송지연이력조회" : pin.title;
	        
            popup({
                url : "/deli/popup/forward.DeliAddInvoicePop.action",
                winname : "DeliAddInvoicePop",
                title : strTitle,
                params : pin,
                type : "xml",
                height : "347px",
                width : "400px",
                scrollbars : true,
                autoresize : false
            }); 
        };
        
		/**
	     * 배송지연이력조회
	     * 
	     * @param pin :
	     *            var pin = {deli_no:"201205080000206", deli_seq:"0001"};
	     */
        fnDeliDelayHistPop = function(pin){
	        var strTitle = (pin.title == undefined) ? "배송지연이력조회" : pin.title;
	        
            popup({
                url : "/deli/popup/forward.DeliDelayHistPop.action",
                winname : "DeliDelayHistPop",
                title : strTitle,
                params : pin,
                type : "xml",
                height : "347px",
                width : "900px",
                scrollbars : true,
                autoresize : false
            }); 
        };
        
        /**
         * 배송지연현황상세 팝업
         * 
         * @param pin :
         *            var pin = {low_vend_no:"1201000866", st_deli_prgs_stat_cd:"1050", type:"N"};
         */
        fnDeliDelayStatDtlPop = function(pin) {
            var strTitle = (pin.title == undefined) ? "배송지연현황상세" : pin.title;
            
            popup({
                url : "/deli/popup/forward.DeliDelayStatDtlPop.action",
                winname : "DeliDelayStatDtlPop",
                title : strTitle,
                params : pin,
                type : "xml",
                height : "700px",
                width : "900px",
                scrollbars : true,
                autoresize : false
            }); 
        };
        
        /**
         * 기타배송송장번호일괄등록 팝업
         * 
         */
        fnDeliInvoiceBatchInsPop = function(pin) {
    		popup({
                url : "/deli/popup/forward.DeliInvoiceBatchInsPop.action",
                winname : "DeliInvoiceBatchInsPop",
                title : "기타배송송장번호일괄등록",
                width : "800px",
                height : "600px",
                params : pin,
                scrollbars : false,
                autoresize : false
            });
        };
        
        /**
         * 굿스플로 주문등록
         */
        fnRegistGoodsflowOrder = function(pin, diviCd, status){
           	var jsonPin = JSON.stringify(pin);
		    $.ajax({
		    	type : "POST",
		        url: "/deli/deli/registGoodsflowOrder.action",
		        dataType: "json",
		        data: {deliList :  jsonPin , diviCd : diviCd, status : status},		       
		        async: false,
		        success : function(data) {
		            if(data.success){
		            	var $form = $("#gfForm");

		            	if($form.length < 1) {
		            		$form = $("<form/>").attr({id:"gfForm", method:'POST'});
		            		
		            		$(document.body).append($form);
		            	}

		            	var id = $("<input type=\"hidden\" value=\""+data.id+"\" name=\"id\">");
	            		var otp = $("<input type=\"hidden\" value=\""+data.otp+"\" name=\"otp\">");
	            		var responseURL = $("<input type=\"hidden\" value=\""+data.retUrl+"\" name=\"responseURL\">");
	            		
	            		$form.append(id).append(otp).append(responseURL);

		            	$("#gfForm").one("submit", function() {
		                    window.open('','Goodsflow','width=1024, height=768, top=0, left=0, resizable=no, status=no, menubar=no, toolbar=no, scrollbars=yes, location=no');
		                    this.action = data.printUrl;
		                    this.method = 'POST';
		                    this.target = 'Goodsflow';
		                }).trigger("submit");
		        	
		            	$form.empty();
		            }else{
		            	alert("[" + data.error.status + "] " + data.error.message);
		            }
		        }
		    });
		};
		
		/**
         * 강제반품완료처리 
         * 
         * @param pin :
         * var pin = {low_vend_no:"1201000866", st_deli_prgs_stat_cd:"1050", type:"N"};
         */
        fnDeliForceReturnComplPop = function(pin) {
            var strTitle = (pin.title == undefined) ? "강제반품완료처리" : pin.title;
            popup({
                url : "/deli/ret/initDeliForceReturnCompletePop.action",
                winname : "initDeliForceReturnCompletePop",
                title : strTitle,
                params : pin,
                method : "post",
                type : "xml",
                height : "400px",
                width : "1300px",
                scrollbars : true,
                autoresize : false
            }); 
        };
        
        /**
         * 미검수팝업 
         * 
         * @param pin :
         * var pin = {low_vend_no:"1201000866", st_deli_prgs_stat_cd:"1050", type:"N"};
         */
        
        fnDeliWmsReturnPop = function(pin) {
    		//해당 받는 펑션은 기본으로 셋팅해 준다. 
    		var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetDeliWmsReturnForm") };
    		var strTitle = (pin.title == undefined) ? "반품미검수리스트" : pin.title;
    		if (pin.form != undefined && pin.form != "") {
    			var objForm = $("#" + pin.form);
    			var strBrandNo = $("input[id=brand_no]", objForm).val();
    		
    			//널처리
    			if (strBrandNo == null){
    				strBrandNo ="";
    			}
    			//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
    			$.extend(pinParam ,{
    				brand_no : (strBrandNo == "undefined") ? "" : strBrandNo,
    			  	 form : pin.form
    		    }); 
    		}
    		if (pin.param != undefined) {
    			$.extend(pinParam , pin.param);
    		}
    		var defaultParam = {
    			url : "/deli/ret/initDeliWmsReturnPop.action",
                winname : "DeliWmsReturnPop",
                title : strTitle,
                width: "1300px",
                height: "700px",
                params : pinParam,
                scrollbars : true
    		};
    		pin = $.extend(defaultParam, pin||{});
    		popup(pin);
    	};
    	
    	fnSetDeliWmsReturnForm = function(pin) {
    		$("input[id=cs_reg_no]", $("#" + pin.form)).val(pin.data[0]["CS_REG_NO"]);
    		$("input[id=cs_reg_seq]", $("#" + pin.form)).val(pin.data[0]["CS_REG_SEQ"]);
    	};
        
})(jQuery);