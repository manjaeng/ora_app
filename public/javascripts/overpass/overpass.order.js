(function ($) {
	 
    var chkDCCardcomp_no = "";
    var chkNointCardcomp_no = "";     
    var chkCartCardcomp_no = "";

	$(document).ready(function () {
		$("div[id=search_off]").bind({
	        keypress : function(event){
	        	if ( event.which == 27 ) {
            		event.preventDefault();
            		$("#cnclBtn").click();
            	}
	        	if ( event.which == 13 && event.srcElement.tagName != "TEXTAREA") {
		        	event.preventDefault();
		        	$("#srchBtn").click();
	        	}
			}
	    });
	});
	
    /**
     * 주문상품선택
     */
    fnOrdGoodsChoicePop = function(pin) {
    	popup({
            url : "/order/ordermgmt/initOrderGoodsChoicePop.action",
            winname : "OrdGoodsChoice_pop",
            params :pin,
            title : "주문상품선택",
            width : "800",
            height : "610",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * 클레임 주문상품선택
     */
    fnOrdClaimGoodsChoicePop = function(pin) {
    	popup({
            url : "/order/ordermgmt/initOrderClaimGoodsChoicePop.action",
            winname : "OrderClaimGoodsChoice_pop",
            params :pin,
            title : "주문처리상품선택",
            width : "800",
            height : "455",
            scrollbars : true,
            resizable : false
        });
    };
    
    
    /**
     * 주문 상품이력 보기 팝업
     */
    fnOrdGoodHistPop = function(param) {
    	popup({
            url : "/order/commpopup/forward.OrderGoodHistViewPop.action",
            winname : "OrderGoodHistView_pop",
            title : "주문상품이력",
            params :param,
            width : "800",
            height : "550",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * 주문불만처리 팝업
     */
    fnOrdClaimMgmtPop = function(param) {
    	popup({
            url : "/order/ordermgmt/initOrderClaimMgmtPop.action",
            winname : "OrderClaimMgmt_pop",
            params :param,
            title : "주문불만처리",
            width : "950",
            height : "750",
            scrollbars : true,
            resizable : "yes"
        });
    };
    
    /**
     * 주문취소처리 팝업
     */
    
    fnOrderCnclProcPop = function(param) {
    	popup({
            url : "/order/ordermgmt/initOrderCnclProcPop.action",
            winname : "OrderCnclProc_pop",
            params :param,
            title : "주문취소처리",
            width : "950",
            height : "700",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * 옵션변경
     */
    fnOrdOptChngPop = function(param) {
    	popup({
            url : "/order/ordermgmt/initOrdOptChngProc.action",
            winname : "OrdOptChngProc_pop",
            params :param,
            title : "옵션변경",
            width : "800",
            height : "650",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * 반품처리
     */
    fnOrdReturnProcPop = function(param) {
    	
    	popup({
            url : "/order/ordermgmt/initOrdReturnProcPop.action",
            winname : "OrdReturnProc_pop",
            params :param,
            title : "반품처리",
            width : "1050",
            height : "700",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * 디지털 이용권 반품처리
     */
    fnOrdReturnDigitProcPop = function(param) {
    	
    	popup({
            url : "/order/ordermgmt/initOrdReturnDigitProcPop.action",
            winname : "OrdReturnProc_pop",
            params :param,
            title : "반품처리",
            width : "950",
            height : "700",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * 배송지 선택 팝업
     */
    fnDlvpChoicePop = function(pin) {
    	var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetDlvp") };

		if (pin.param != undefined) {
			$.extend(pinParam, pin.param );
		}

		var defaultParam = {
				url : "/order/commpopup/forward.OrderDlvpChoicePop.action",
				winname : "OrderDlvpChoice_pop",
				title : "배송지 선택 팝업",
				width : "800",
	            height : "490",
				params : pinParam,
				scrollbars : false,
				autoresize : false
			};
		pin = $.extend(defaultParam, pin||{});
		popup(pin);
    };
    
    /**
     * 교환처리
     */
    fnExchngProcPop = function(param) {
    	
    	popup({
            url : "/order/ordermgmt/initOrderExchngProc.action",
            winname : "OrderExchngProc_pop",
            params :param,
            title : "교환처리",
            width : "1100",
            height : "650",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * 철회처리
     */
    fnRecantProc = function(param) {
    	popup({
            url : "/order/ordermgmt/initOrderRecantProcPop.action",
            winname : "OrderRecantProc_pop",
            params :param,
            title : "철회처리",
            width : "900",
            height : "610",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * 주문정보변경 - 배송지 변경
     */
    fnOrderChngDlvpPop = function(param) {
    	var ord_no = {ord_no:param.ord_no};
    	popup({
            url : "/order/orderchng/forward.OrderChngDlvpPop.action",
            winname : "OrderChngDlvpPop",
            params :ord_no,
            title : "배송지 변경",
            width : "800",
            height : "550",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * 주문정보변경 - 배송 메시지변경
     */
    fnOrderChngDeliMemoPop = function(param) {
    	var ord_no = {ord_no:param.ord_no};
    	popup({
            url : "/order/orderchng/forward.OrderChngDeliMemoPop.action",
            winname : "OrdChngDeliMemoPop",
            params :ord_no,
            title : "배송 메시지변경",
            width : "800",
            height : "520",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * 주문정보변경 - 주문 메시지 변경
     */
    fnOrderChngOrderMemoPop = function(param) {
    	var ord_no = {ord_no:param.ord_no};
    	popup({
            url : "/order/orderchng/forward.OrderChngOrderMemoPop.action",
            winname : "OrdChngOrdMemoPop",
            params :ord_no,
            title : "주문 메시지변경",
            width : "800",
            height : "520",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * 주문정보변경 - 추가 주문선택정보 변경
     */
    fnOrderChngAddInfoPop = function(param) {
    	var ord_no = {ord_no:param.ord_no};
    	popup({
            url : "/order/orderchng/forward.OrderChngAddInfoPop.action",
            winname : "OrderChngAddInfoPop",
            params :ord_no,
            title : "추가 주문선택정보 변경",
            width : "800",
            height : "570",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * 주문정보변경- 배송지 분리
     */
    fnOrderDlvpDivProcPop = function(param) {
    	
    	popup({
            url : "/order/ordermgmt/initOrderDlvpDivProcPop.action",
            winname : "OrderDlvpDivProc_pop",
            params :param,
            title : "배송지 분리",
            width : "950",
            height : "650",
            scrollbars : true,
            resizable : false
        });
    };
    
    
    /**
     * 결제/환불처리 팝업
     */
    fnRefundMgmtPop = function(param) {
    	popup({
            url : "/order/ordermgmt/initOrderPayRefundProcPop.action",
            winname : "OrderPayRefundProc_pop",
            params :param,
            title : "환불처리",
            width : "950",
            height : "650",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * 임의배송/반품
     */
    fnArbitrarilyProcPop = function(param) {
    	
    	popup({
            url : "/order/ordermgmt/forward.OrderFreeProcPop.action",
            winname : "OrderFreeProc_pop",
            params :param,
            title : "임의배송/반품",
            width : "810",
            height : "650",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * 비용처리
     */
    fnCostPayProcPop = function(param) {

    	popup({
            url : "/order/ordermgmt/initOrdCostPayProcPop.action",
            winname : "OrderCostPayProc_pop",
            params :param,
            title : "비용처리",
            width : "810",
            height : "650",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * 수기주문 팝업
     * 
     */
    fnNewOrdPop = function(pin) {
    	$.extend(pin, {new_ord: "Y"});    	
    	popup({
            url : "/order/ordermgmt/initOrdSheet.action",
            winname : "OrdSheet_pop",
            params :pin,
            title : "수기주문",
            width : "850",
            height : "800",
            scrollbars : true,
            resizable : false
        });
    };
    
    /**
     * 송장변경
     * 
     * @param pin :
     *            var pin = {deli_no:"201205080000244"};
     */
    fnInvoiceChngPop = function(pin){
        var strTitle = (pin.title == undefined) ? "송장변경" : pin.title;
        popup({
            url : "/order/commpopup/forward.DeliInvoiceChngPop.action",
            winname : "DeliInvoiceChng_Pop",
            title : strTitle,
            params : pin,
            height : "347px",
            width : "650px",
            scrollbars : true,
            autoresize : false
        }); 
    };
    
    /**
     * 기타배송처리 팝업
     */
    fnOrderEtcDeliProcPop = function(param) {
    	popup({
            url : "/order/ordermgmt/initOrderEtcDeliProcPop.action",
            winname : "OrderEtcDeliProc_pop",
            params :param,
            title : "기타배송처리",
            width : "950",
            height : "450",
            scrollbars : true,
            resizable : false
        });
    };
    
    
    /**
     * 클레임 상담 등록 레이어 호출
     * e : 이벤트
     * form : form object
     * proc : 상담 등록 여부
     * 
     */
    var counselLayer = "";
    fnCounselInput = function(e, form, proc){
    	
    	if (proc != "Y") {
    		fnRegist();
    		return;
    	};
    	
        if(counselLayer != ""){
            closeLayer(counselLayer);
            counselLayer = "";
        };
          
        var $content = $("<div />");
        e.stopPropagation();      
        counselLayer =  createLayer({
	        event:e,    //이벤트 e를 넘기면 마우스의 위치에 레이어 생성
	        width:"343px",
	        height:"280px",
	        content:$content.load(
		        '/order/commlayer/forward.CounselMemoLayer.action', 
		        function() {
			        $content.find("#counselMemoCont").val($("#counsel_memo", form).val());
			        checkByte({id: "counselMemoCont", max: 400, display_id: "counselMemo"});
			        $content.find("button.close").click(function() {
				        closeLayer(counselLayer);
			        });
			        $content.find("button.button_chk").click(function() {
				        closeLayer(counselLayer);
				        var cont = $content.find("#counselMemoCont").val();
				        $("#counsel_memo", form).val(cont);
				        $("#counsel_memo", "#ordForm").val(cont);	// CTI에서 counsel_memo 저장 시 orderForm에 복사
				        fnRegist();
			        });
			        $content.find("button.button_cls").click(function() {
				        closeLayer(counselLayer);
			        });
		        }
	        )
        });
    };
    
    /**
     * 주문사은품 팝업
     */
    fnGiftGoodsPop = function(param) {
    	popup({
            url : "/order/ordermgmt/forward.OrderGiftGoodsChoicePop.action",
            winname : "GiftGoodsPop_pop",
            params :param,
            title : "주문사은품변경",
            width : "860",
            height : "350",
            scrollbars : true,
            resizable : false
        });
    };
    
    /* 주문사은품레이어 */
    var giftLayer = "";
    fnGiftLayer = function(e, pin){
    	
        if(giftLayer != ""){
            closeLayer(giftLayer);
            giftLayer = "";
        };
          
        var $content = $("<div />");
        e.stopPropagation();      
        giftLayer =  createLayer({
	        //event:e,    //이벤트 e를 넘기면 마우스의 위치에 레이어 생성
	        top: "40px", 
			left: "230px",
			width:"500px",
			height:"300px",
	        content:$content.load(
		        '/order/commlayer/forward.OrderGiftInfoLayer.action', 
		        {ord_no : pin.ord_no, work_info : pin.work_info},
		        function() {
		        }
	        )
        });
    };
    
	var wholeLayer = "";
    fnWholeInput = function(e, grid, proc) {
    	
    	var height = "190px";
    	
    	if (proc == "30"){
    		height = "250px";
    	};
	    //레이어 생성
	    if(wholeLayer != ""){
	        closeLayer(wholeLayer);
	        wholeLayer = "";
	    }
	    var $content = $("<div />");
	    e.stopPropagation(); 
	    wholeLayer = createLayer({
	        event:e,
	        width:"310px",
	        height:height,
	        content:$content.load(
	            "/order/commlayer/forward.OrderWholeApplyLayer.action",
	            {ord_crt_divi_cd : proc},
	            function() {
	                //레이어 닫기버튼 클릭시
	                $content.find("button.button_cls").click(function() {
	                    closeLayer(wholeLayer);
	                });
	                
	                $content.find("button.button_chk").click(function() {
	                	var workQty = $content.find("#work_qty").val();
	                	
	                	if (!isNumberVal(workQty)) {
	                		alert("접수수량은 숫자만 입력하세요");
	                		return;
	                	};
	                	
	                    var compReasonCd = $content.find("#compl_reason_cd").val();
	                    var complEtcReason = $content.find("#compl_etc_reason").val();
	                    
	                    //반품일 경우에만 적용 되는 부분
	                    var deliCostChargeMainCd = "";
	                    var retMethodCd = "";
	                    if (proc == "30") {
	                    	deliCostChargeMainCd = $content.find("#deli_cost_charge_main_cd").val();
	                        retMethodCd = $content.find("#ret_method_cd").val();	
	                    };
	                    
	                    var rows = grid.GetRows();
	                    var chkVal = true;
	                    $.each(rows, function(idx, row){
	                    	if (row["REAL_ORD_QTY"] < Number(workQty)) {
	                    		chkVal = false;
	                    		alert("접수수량이 가능 수량보다 큽니다.");
	                    		return false;
	                    	};
	                    	
	                    	if (Number(workQty) > 0) {
	                    		grid.SetValue({row:row.Index,id: "WORK_QTY",          value: workQty});
	                    	};
	                    	
	                    	grid.SetValue({row:row.Index,id: "COMPL_REASON_CD",   value: compReasonCd});
	                    	grid.SetValue({row:row.Index,id: "COMPL_ETC_REASON",  value: complEtcReason});
	                    	
	                    	//반품일 경우에만 적용 되는 부분
	                    	if (proc == "30") {
	                    		grid.SetValue({row:row.Index,id: "DELI_COST_CHARGE_MAIN_CD", value: deliCostChargeMainCd});
	                    		grid.SetValue({row:row.Index,id: "RET_METHOD_CD",            value: retMethodCd});
	                    	};
                        	
	                    });
	                    
	                    if (!chkVal) {
	                    	return;
	                    };
	                    
	                    closeLayer(wholeLayer);
	                });
	            }
	        )
	    });
    };
    
    /**
     * 무이자할부정보 보기 팝업
     */
    fnNointInfoPop = function(param) {
    	popup({
            url : "/order/popup/forward.NointInfoPop.action",
            winname : "NointInfo_pop",
            params :param,
            title : "무이자할부정보",
            width : "500",
            height : "450",
            scrollbars : true,
            resizable : false
        });
    };
    
    var addInfoLayer = "";
    fnOrderAddInfoLayer = function(row, cell) {
    	
    	//레이어 생성
        if(addInfoLayer != ""){
            closeLayer(addInfoLayer);
            addInfoLayer = "";
        }
        var $content = $("<div />");
        _clicked = false; 
        addInfoLayer = createLayer({
            cell : cell,
            width:"510px",
            height:"270px",
            content:$content.load(
                "/order/commlayer/forward.OrderAddInfoLayer.action",
                {add_ord_sel_info : row["ADD_ORD_SEL_INFO"]},
                function() {
                    //레이어 닫기버튼 클릭시
                    $content.find("button.button_cls").click(function() {
                        closeLayer(addInfoLayer);
                    });
                }
            )
        });
    };
    
    var giftDtlLayer = "";
    fnOrderGiftDtlLayer = function(row, cell) {
    	
    	//레이어 생성
        if(giftDtlLayer != ""){
            closeLayer(giftDtlLayer);
            giftDtlLayer = "";
        }
        var $content = $("<div />");
        _clicked = false; 
        giftDtlLayer = createLayer({
            cell : cell,
            width:"510px",
            height:"200px",
            content:$content.load(
                "/order/commlayer/forward.OrderGiftDtlViewLayer.action",
                {ord_no : row["ORD_NO"], ord_goods_seq : row["ORD_GOODS_SEQ"]},
                function() {
                    //레이어 닫기버튼 클릭시
                    $content.find("button.button_cls").click(function() {
                        closeLayer(giftDtlLayer);
                    });
                }
            )
        });
    };
    
    /**
     * 복합결제 결제취소 실패 예치금 환불 처리 팝업
     */
    fnMultiPayRefundMgmtPop = function(param) {
    	popup({
            url : "/order/ordermgmt/forward.MultiPayRefundProcPop.action",
            winname : "MultiPayRefundProc_pop",
            params :param,
            title : "복합결제 결제취소 실패 환불처리",
            width : "700",
            height : "300",
            scrollbars : true,
            resizable : false
        });
    };
	
})(jQuery);