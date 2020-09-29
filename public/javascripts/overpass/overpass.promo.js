(function($){
	
	$(document).ready(function() {
		save_flag = false;//중복등록방지...
		
		// Enter Key
		$("div[id=search_off]").bind({
	        keypress : function(event){
	        	if ( event.which == 13 && event.srcElement.tagName != "TEXTAREA" ) {
		        	event.preventDefault();
		        	$("#srchBtn").click();
	        	}
			}
	    });
		
		/******************************************************* 프로모션 컨트롤 *********************************************************/
		$(document).on("change", "#deli_cost_apply_divi_cd_sel", function() {
			// 반품비/교환비시 제한금액 비활성화
			if ( $(this).val()==_PR_DELI_COST_APPLY_DIVI_CD_DELI){
				$("#apply_limit_amt").removeClass("readonly").removeAttr("readonly");
			}else{
				$("#apply_limit_amt").val("0");
				$("#apply_limit_amt").attr("readonly","readonly").addClass("readonly");
				$("#deli_cost_limit_amt").val("0");
			}
			// 배송비 선택 시, 쿠폰발급방식이 자동발급이면 초기화
			if ($(this).val() == _PR_DELI_COST_APPLY_DIVI_CD_DELI && $("#coupon_issue_mean_cd_sel").val() === _PR_COUPON_ISSUE_MEAN_CD_AUTO) {
				$("#coupon_issue_mean_cd_sel > option:first").prop("selected", true);
				$("#coupon_issue_mean_cd_sel").trigger("change");
			}
	    });
	    
	    // 발급수량 기준
		$(document).on("change", "#issue_limit_qty_st_cd", function() {
			fnIssueLimitQtyStCd();
		});
		
		// 혜택값은 혜택값 구문이 율일 경우 0 - 100 사이의 값만 입력 될 수 있도록 체크
		$(document).on("blur", "[name=bene_val]", function() {
        	var promo_kind_cd = $("#promo_kind_cd").val();
        	var apply_limit_amt = +$("#apply_limit_amt").val();
        	
    		if($("#bene_val_divi_cd_sel").val() == _PR_BENE_VAL_DIVI_CD_RATE){
            	fnChkNumberVal(this, 100);
    		}else if ( $("#bene_val_divi_cd_sel").val() == _PR_BENE_VAL_DIVI_CD_AMT ) {
    			fnBeneValRound(this);
    			if ( fnChkPromoCoupon(promo_kind_cd) && (apply_limit_amt == 0 || apply_limit_amt == "" || +$(this).val() > apply_limit_amt) ){
    				$("#apply_limit_amt").val($(this).val());
    			}
    		}
    		
    		// 쿠폰이며 업체 등록시 업체가 부담률이 100%
    		if ( sys_divi_cd == _ST_SYS_DIVI_CD_PO ){
    			if ( promo_kind_cd== _PR_PROMO_KIND_CD_CUPN || promo_kind_cd == _PR_PROMO_KIND_CD_CART_CUPN ){
    				$("#vend_charge_rate").val( $(this).val());
    			}
    		}else{
    			if ( promo_kind_cd == _PR_PROMO_KIND_CD_CART_CUPN || promo_kind_cd == _PR_PROMO_KIND_CD_SAVE || _PR_PROMO_KIND_CD_OFFLINE[promo_kind_cd]){
    				$("#our_comp_charge_rate").val( $(this).val());
    			}else if (promo_kind_cd == _PR_PROMO_KIND_CD_CUPN && fnCsCouponChk()){
    				$("#our_comp_charge_rate").val( $(this).val());
    				$("#vend_charge_rate").val(0);
    			}else {
    				var totVal = (+$("#our_comp_charge_rate").val()) + (+$("#vend_charge_rate").val());
    				var beneVal = +$(this).val();
    				if (totVal != beneVal) {
    					$("#our_comp_charge_rate").val(beneVal);
        				$("#vend_charge_rate").val(0);
    				}
    			}
    		}
	    });
		
		$(document).on("blur", "[name='apply_limit_amt']", function(){
			var apply_limit_amt = $(this);
			var promo_kind_cd = $("#promo_kind_cd").val();
			if (fnChkPromoCoupon(promo_kind_cd) && $("#bene_val_divi_cd_sel").val() == _PR_BENE_VAL_DIVI_CD_AMT ) {
				var bene_val = $("[name=bene_val]");
				if(Number(bene_val.val()) >= Number(apply_limit_amt.val())){
					alert("최소구매금액이 혜택값과 같거나 작을 수 없습니다.\n(예: 혜택값 10,000원 일경우 최소구매금액이 10,000원을 초과해야함)");
					apply_limit_amt.val(bene_val.val());
				}
    		}
		});
		
		$(document).on("blur", "[name=use_start_time], [name=use_end_time]", function() {
			var o = $(this);
			var name = o.attr("name");
			var val = o.val();
			
			if(val > 0){
				if(name == "use_start_time"){
					if(val > 23){
						val = 23;
					}
				}else if(name == "use_end_time"){
					if(val > 24){
						val = 24;
					}
				}	
			}else{
				val = 0;
			}
			o.val(val);
	    });
		
		// 부담률 입력에 따른 업체부담률 자동계산
		$(document).on("blur", "#our_comp_charge_rate", function() {
			fnSetChargeRate( $(this) );
		});
		
		// 쿠폰발급방식 change
		$(document).on("change", "#coupon_issue_mean_cd_sel", function() {
			fnSetCouponIssueMeanCd(true);
		});
		
		// 사용일수 입력 시 숫자만 입력 가능
		$(document).on("blur", "#use_poss_aval_day", function(){
			fnChkNumberVal(this);
		});
		
		// 사용일수 입력 시 숫자만 입력 가능
		$(document).on("blur", "#aval_day_cnt", function(){
			fnChkNumberVal(this);
		});
		
		// 총 발급수량
		$(document).on("blur", "#tot_issue_qty", function(){
			fnChkNumberVal(this);
		});
		
		// 발급제한수량
		$(document).on("blur", "#tot_issue_limit_cnt", function(){
			fnChkNumberVal(this);
		});
		
		// 인증번호발급
		$(document).on("blur", "#cert_no_cnt", function(){
			fnChkNumberVal(this);
		});
		//자사주관여부
		$(document).on("click", "#own_spv_yn_chk", function(){
			if($(this).is(":checked")){
				$(this).val(_BOOLEAN_TRUE);
			}else{
				$(this).val(_BOOLEAN_FALSE);
			}
		});
		//CS전용쿠폰 여부
		$(document).on("click", "#cs_use_poss_yn_chk", function(){
			if($(this).is(":checked")){
				$(this).val(_BOOLEAN_TRUE);
				if($("#promo_kind_cd").val() == _PR_PROMO_KIND_CD_CUPN){
					$("[name=bene_val]").blur();
				}
			}else{
				$(this).val(_BOOLEAN_FALSE);
			}
		});
		
		$(document).on("blur","#promocode", function(){
			var promocode = $(this);
			if(promocode.val() == $("#promocode_bak").val()){
				$("#promocode_chk").val(_BOOLEAN_TRUE);
			}else{
				$("#promocode_msg").hide();
				$("#promocode_chk").val(_BOOLEAN_FALSE);
			}
		});
		
		$(document).on("click","#promocode_btn", function(){
			var promocode = $("#promocode");
			$("#promocode_msg").hide();
			if($("#coupon_issue_mean_cd_sel").val() == _PR_COUPON_ISSUE_MEAN_CD_PROMOCODE && promocode.val() == ""){
				window.alert("프로모션코드를 입력해주세요.");
				return false;
			}
			if(promocode.val() == $("#promocode_bak").val()){
				$("#promocode_msg").text("인증완료");
				$("#promocode_msg").show();
				return false;
			}
			
			$.ajax({
                url: "/promo/promomgmt/getCertNo.action",
                dataType: "json",
                data: {cert_no : promocode.val()},
                success : function(data) {
                	$("#promocode_msg").show();
                	if(data.ret_code == "S"){
                		$("#promocode_msg").text("인증완료");
                		$("#promocode_chk").val(_BOOLEAN_TRUE);
                	}else{
                		$("#promocode_msg").text("이미 등록된 인증번호");
                		$("#promocode_chk").val(_BOOLEAN_FALSE);
                	}
                },error: function(e){
                	window.alert("오류가 발생하여 인증에 실패하였습니다.");
                	$("#promocode_chk").val(_BOOLEAN_FALSE);
                }
            });
			
		});
		
		$(document).on("click", "input[name='gift_mgmt_no'], input[name='gift_mgmt_nm']", function(){
			var input = $(this);
			var name = input.attr("name");
			var gift_mgmt_no = input;
			if(name == "gift_mgmt_nm"){
				var td = input.parents("td");
				gift_mgmt_no = td.find("#gift_mgmt_no");	
			}
			
			fnGiftGoodsListPop({gift_mgmt_no : gift_mgmt_no.val()});
		});
		/******************************************************** 프로모션 필드/버튼 셋팅 **********************************************************/
		
		fnAcntUnitCdSelectBox = function(val1, val2){
			var erp_acnt_unit_cd = $("#erp_acnt_unit_cd");
			var searchAcntUnitCd = function(object, erp_acnt_unit_cd_val, acnt_no_val){
				var acnt_no = $("#acnt_no");
				var pin = {};
				var selectbox;
				
				if (object == undefined){
					selectbox = erp_acnt_unit_cd;
					selectbox.empty();
				}else if(object.attr("id") == "erp_acnt_unit_cd"){
					var val = object.find("option:selected").attr("data-erp-acnt-unit-cd");
					pin = {erp_acnt_unit_cd: val};
					selectbox = acnt_no;
					selectbox.empty();
				}
				if(selectbox){
					selectbox.append($("<option></option>").text("선택"));
					if(selectbox.attr("id") == "acnt_no"){
						if(val == undefined) return;						
					}
				}else{
					return;
				}
				$.ajax({
	                url: "/member/member/searchAcntList.action",
	                dataType: "json",
	                data: pin,
	                success : function(data) {
	                	if(object == undefined){
	                		$.each(data, function(idx, acnt_no){
		                		var option = $("<option></option>").attr({
					    							"data-erp-acnt-unit-cd": acnt_no.ERP_ACNT_UNIT_CD,
						                			"value": acnt_no.ACNT_NO
						                		}).text(acnt_no.ERP_ACNT_UNIT_NM);
		                		selectbox.append(option);
		                	});	
	                	}else{
	                		$.each(data, function(idx, acnt_no){
	                			var option = $("<option></option>").attr({
	                				"data-erp-acnt-dept-cd": acnt_no.ERP_ACNT_DEPT_CD,
	                				"value": acnt_no.ACNT_NO
	                			}).text(acnt_no.ERP_ACNT_DEPT_NM);
	                			selectbox.append(option);
	                		});
	                	}
	                	
	                	if(erp_acnt_unit_cd_val != undefined && erp_acnt_unit_cd_val != ""){
	                		selectbox.find("option[data-erp-acnt-unit-cd='"+erp_acnt_unit_cd_val+"']").prop("selected", true);
	                		searchAcntUnitCd(selectbox, null, val2);
	                	}
	                	if(acnt_no_val != undefined && acnt_no_val != ""){
	                		selectbox.find("option[value='"+acnt_no_val+"']").prop("selected", true);
	                	}
	                }
	            });
			}
			
			erp_acnt_unit_cd.on("change", function(){
				searchAcntUnitCd($(this));
			});
			searchAcntUnitCd(null, val1);
		}
		
		// 승인자 권한 버튼처리 
		fnTypeApprChk = function(regId){
			$.ajax({
	       	 	type: "POST",
	            url: "/promo/promomgmt/getPromoTypeAppr.action",
	            dataType: "json",
	            data: {promo_type_no : $("#promo_type_no").val(), promo_no : $("#promo_no").val()},
	            async: false,
	            success : function(data) {
	            	data = data.promo_type_appr;
					
					if(data[0].appr_yn == "Y"){
						// 프로모션 등록시
						$("#apprBtn").show();
						$("#apprCallBtn").hide();
					} else if (data[0].appr_yn == "N") {
						// 프로모션 등록시
						$("#apprBtn").hide();
						$("#apprCallBtn").show();
					}
					
					if (_totAuthYn == "Y") {
						// 프로모션 등록시
						$("#apprBtn").show();
						$("#apprCallBtn").hide();
					} 
					
					if($("#promo_type_no").val() == "") {
						// 프로모션 등록시
						$("#apprBtn").hide();
						$("#apprCallBtn").hide();
					}
					
					// 등록자Id가 파라미터로 온 경우 등록자&승인자여야만 버튼노출이 가능한 경우임.
					if(regId != undefined){
						// 적용조건변경
						$("#changeBtn").hide();
						$("#changeCallBtn").hide();
						
						if(data[0].appr_yn == "Y" || _totAuthYn == "Y"){
							$("#changeBtn").show();
						}else if(_userId == regId){
							$("#changeCallBtn").show();
						}
					}
					
					try{
						fnEndLoadPromoKind();
					}catch(e){}
					
					return data[0].appr_yn;
	            }
	       });
		};
		
		//프로모션 종류 조회
	    fnSearchPromoKindCd = function(gb) {
	    	$("#promo_kind_cd").empty();
	    	
	    	var pin = {rel_no : _clientNo, work_grp_clss_cd : _workGrpClssCd}
	    	if ( gb == "coupon"){
	    		pin.coupon_yn = "Y"; 
	    	}else if (gb == "NoWorkGrp" || gb =="totAuth"){
	    		pin.work_grp_clss_cd = "";
	    	}

	    	$.ajax({
	       	 	type: "POST",
	            url: "/promo/promomgmt/searchPrPromoKindCdList.action",
	            dataType: "json",
	            data: pin,
	            async: false,
	            success : function(data) {
	            	var promoKindList = data.promoKindList;
	            	
	            	if(gb == undefined || gb =="totAuth"){
	            		$("#promo_kind_cd").append("<option value=''>선택</option>");
	            	}else{
	            		$("#promo_kind_cd").append("<option value=''>전체</option>");
	            	}
	            	
	                for(var idx = 0; idx < promoKindList.length; idx++){
	                	$("#promo_kind_cd").append("<option value='" + promoKindList[idx].COMM_DTL_CD + "' asset_resou_divi_cd='" + promoKindList[idx].ASSET_RESOU_DIVI_CD + "'>" + promoKindList[idx].SHOW_NM +"</option>");
	                }
	            }
	       });
	    };
		
		//프로모션 종류에 따른 프로모션 유형 셋팅
	    fnSearchPromoTypeCd = function(gb) {
	    	$("#promo_type_no").empty();
	    	
	    	if(gb == undefined || gb != "srch"){
	    		$("[id^=promoType]").hide();
				$("#promoKindTd").attr("colspan", "3");
	    	}
	    	var promo_kind_cd = $("#promo_kind_cd").val();
		    	
	    	if(promo_kind_cd == ""){
	    		return;
	    	}
	    
	    	$.ajax({
	       	 	type: "POST",
	            url: "/promo/promomgmt/searchPrPromoTypeMgmtList.action",
	            dataType: "json",
	            data: {promo_kind_cd : promo_kind_cd, work_grp_clss_cd : _workGrpClssCd},
	            async: false,
	            success : function(data) {
	            	var promoTypeList = data.lPromoTypeList;
	            	
	            	if(gb != undefined && gb == "srch"){
	            		$("#promo_type_no").append("<option value=''>전체</option>");
	            	}
	            	
	                for(var idx = 0; idx < promoTypeList.length; idx++){
	                	$("#promo_type_no").append("<option value='" + promoTypeList[idx].promo_type_no + "' adjust='"+ promoTypeList[idx].adjust_margin_rate_yn +"' imme='"+ promoTypeList[idx].imme_apply_yn +"' apply_qty='"+ promoTypeList[idx].apply_qty_one_yn +"'>" + promoTypeList[idx].promo_type_nm +"</option>");
	                }
	                
	                if(gb == undefined || gb != "srch"){
	                	// 프로모션 유형이 1개인 경우 노출 안함. 1개 이상인 경우만 선택을 위해 노출함.
		                if(promoTypeList.length > 1){
		                	$("#promoTypeTh").show();
		        			$("#promoTypeTd").show();
		        			$("#promoKindTd").removeAttr("colspan");
		                }
	                }
	            }
	       });
	    };
	    
	    // 프로모션 종류에 따른 혜택정책 셋팅(등록,상세 공통사용)
	    fnSetPromoBenePoli = function(varOrgBenePoliCdSel) {
	    	
	    	var varPromoKindCd = $("#promo_kind_cd").val();
	    	var bene_poli_cd_sel = $("#bene_poli_cd_sel");
	    	var save_asset_resou_divi_cd_sel = $("[name=save_asset_resou_divi_cd_sel]");
	    	var benePoliCd = {};
	    	
	    	bene_poli_cd_sel.empty();
	    	bene_poli_cd_sel.removeAttr("disabled");
	    	bene_poli_cd_sel.append(varOrgBenePoliCdSel);
	    	bene_poli_cd_sel.val("");
	    	bene_poli_cd_sel.find("option:eq(0)").attr("selected", "selected");
	    	
	    	save_asset_resou_divi_cd_sel.hide();	    
	    	save_asset_resou_divi_cd_sel.val("");
	    	save_asset_resou_divi_cd_sel.removeAttr("validate");
	    	
	    	if(wMode == "V"){	//상세인경우
	    		save_asset_resou_divi_cd_sel.attr("message","적립자산자원을 선택해주세요!");
	    	}
	    	
	    	// 쿠폰 - 할인/적립만 가능
	        benePoliCd[_PR_PROMO_KIND_CD_CUPN] = _PR_BENE_POLI_CD_DC;
	        // 적립금/배수적립 - 적립만 가능
	        benePoliCd[_PR_PROMO_KIND_CD_SAVE] = _PR_BENE_POLI_CD_SAVE;
	        benePoliCd[_PR_PROMO_KIND_CD_MULTI_SAVE] = _PR_BENE_POLI_CD_SAVE;
	        // 배송비 쿠폰/가격할인/카드할인/직원할인/다수량/쇼핑백/오프라인 - 할인만 가능
	        benePoliCd[_PR_PROMO_KIND_CD_DELI_CUPN] = _PR_BENE_POLI_CD_DC;
	        benePoliCd[_PR_PROMO_KIND_CD_PRICE_SALE] = _PR_BENE_POLI_CD_DC;
	        benePoliCd[_PR_PROMO_KIND_CD_CARD_SALE] = _PR_BENE_POLI_CD_DC;
	        benePoliCd[_PR_PROMO_KIND_CD_EMP_SALE] = _PR_BENE_POLI_CD_DC;
	        benePoliCd[_PR_PROMO_KIND_CD_MULTI_SALE] = _PR_BENE_POLI_CD_DC;
	        benePoliCd[_PR_PROMO_KIND_CD_CART_CUPN] = _PR_BENE_POLI_CD_DC;
	        benePoliCd[_PR_PROMO_KIND_CD_OFFLINE_CART_CUPN] = _PR_BENE_POLI_CD_DC;
	        benePoliCd[_PR_PROMO_KIND_CD_OFFLINE_CUPN] = _PR_BENE_POLI_CD_DC;
	        benePoliCd[_PR_PROMO_KIND_CD_OFFLINE_FREE] = _PR_BENE_POLI_CD_DC;
	        
	        // 무이자/청구할인/캐시백 - 무관만 가능
	        benePoliCd[_PR_PROMO_KIND_CD_FREE_INTERS] = _PR_BENE_POLI_CD_NONE;
	        benePoliCd[_PR_PROMO_KIND_CD_CHARGE_SALE] = _PR_BENE_POLI_CD_NONE;
	        benePoliCd[_PR_PROMO_KIND_CD_CASHBAG] = _PR_BENE_POLI_CD_NONE;
	        // 사은품 - 사은만 가능
	        benePoliCd[_PR_PROMO_KIND_CD_GIFT] = _PR_BENE_POLI_CD_GIFT;
	        benePoliCd[_PR_PROMO_KIND_CD_ORDER_GIFT] = _PR_BENE_POLI_CD_GIFT;
	        
	    	// 혜택정책
	        if (benePoliCd[varPromoKindCd]) {
	        	bene_poli_cd_sel.val(benePoliCd[varPromoKindCd]);
	        	bene_poli_cd_sel.attr("disabled", true).addClass("readonly");
	        	
	        	if ( benePoliCd[varPromoKindCd] == _PR_BENE_POLI_CD_SAVE ){
	        		var save_saset_resou_divi_cd_list = save_asset_resou_divi_cd_sel.find("option").not("[value='']");
		            if ( save_saset_resou_divi_cd_list.length > 1 ) {
		            	save_asset_resou_divi_cd_sel.show();
		            	save_asset_resou_divi_cd_sel.attr("validate", "empty");
		            	save_asset_resou_divi_cd_sel.attr("message","적립자산자원을 선택해주세요!");
		            }
	        	}
	        } else {
	        	bene_poli_cd_sel.find("option:eq(0)").attr("selected", "selected");
	    		bene_poli_cd_sel.removeAttr("disabled").removeClass("readonly");;
	    	}
	    };
	    
	    // 용도구분 값 셋팅(등록/상세 공통사용)
	    fnSetExpdDiviCd = function(varOrgExpdDiviCdSel) {
	    	var varPromoKindCd = $("#promo_kind_cd").val();
	    	var expd_divi_cd_sel = $("#expd_divi_cd_sel");
	    	var expdDivdCd = {};
	    	
	    	expd_divi_cd_sel.removeAttr("disabled").removeClass("readonly");;
	    	expd_divi_cd_sel.empty();
            expd_divi_cd_sel.append(varOrgExpdDiviCdSel);
            expd_divi_cd_sel.find("option").removeAttr("selected");
            expd_divi_cd_sel.find("option:eq(0)").attr("selected", "selected");
            
            var cs_use_poss_yn_area = $("#cs_use_poss_yn_area");
            var cs_use_poss_yn_chk = cs_use_poss_yn_area.find("#cs_use_poss_yn_chk");
        	cs_use_poss_yn_chk.removeAttr("disabled").removeAttr("checked").prop("checked", false).val(_BOOLEAN_FALSE);
            cs_use_poss_yn_area.hide();
            
            // 쿠폰, 쇼핑백, 배송비
            expdDivdCd[_PR_PROMO_KIND_CD_CUPN] = _PR_PROMO_KIND_CD_CUPN;
            expdDivdCd[_PR_PROMO_KIND_CD_CART_CUPN] = _PR_PROMO_KIND_CD_CART_CUPN;
            expdDivdCd[_PR_PROMO_KIND_CD_DELI_CUPN] = _PR_PROMO_KIND_CD_DELI_CUPN;
            
            expdDivdCd[_PR_PROMO_KIND_CD_OFFLINE_CART_CUPN] = _PR_PROMO_KIND_CD_OFFLINE_CART_CUPN;
            expdDivdCd[_PR_PROMO_KIND_CD_OFFLINE_CUPN] = _PR_PROMO_KIND_CD_OFFLINE_CUPN;
            expdDivdCd[_PR_PROMO_KIND_CD_OFFLINE_FREE] = _PR_PROMO_KIND_CD_OFFLINE_FREE;
            
	    	if (expdDivdCd[varPromoKindCd]) {
	    		if (sys_divi_cd == _ST_SYS_DIVI_CD_PO){
	    			if(varPromoKindCd == _PR_PROMO_KIND_CD_DELI_CUPN){
	    				expd_divi_cd_sel.children("[value=" + _PR_EXPD_DIVI_CD_GEN + "]").remove();
	    			}
	    			expd_divi_cd_sel.children("[value=" + _PR_EXPD_DIVI_CD_CS + "]").remove();
	    		}
	    		//오프라인 쿠폰 - 무료수선 추가
	    		switch(varPromoKindCd){
		    		case _PR_PROMO_KIND_CD_CUPN:
		    			if (sys_divi_cd == _ST_SYS_DIVI_CD_PO){
		    				expd_divi_cd_sel.children("[value=" + _PR_EXPD_DIVI_CD_MARKETING + "]").remove();	
		    			}
		    		case _PR_PROMO_KIND_CD_CART_CUPN:
		    		case _PR_PROMO_KIND_CD_DELI_CUPN:
		    			expd_divi_cd_sel.children("[value=" + _PR_EXPD_DIVI_CD_OFFLINE_ADD + "]").remove();
		    			break;
		    		case _PR_PROMO_KIND_CD_OFFLINE_CUPN:
		    			expd_divi_cd_sel.children("[value=" + _PR_EXPD_DIVI_CD_MARKETING + "]").remove();
		    			expd_divi_cd_sel.children("[value=" + _PR_EXPD_DIVI_CD_MYPAGE + "]").remove();
		    			expd_divi_cd_sel.children("[value=" + _PR_EXPD_DIVI_CD_CAMPAIGN_GEN + "]").remove();
		    			expd_divi_cd_sel.children("[value=" + _PR_EXPD_DIVI_CD_CAMPAIGN_MKT + "]").remove();
		    			expd_divi_cd_sel.children("[value=" + _PR_EXPD_DIVI_CD_CAMPAIGN_CRM + "]").remove();
		    			break;
		    		case _PR_PROMO_KIND_CD_OFFLINE_CART_CUPN:
		    		case _PR_PROMO_KIND_CD_OFFLINE_FREE:
		    			expd_divi_cd_sel.children("[value=" + _PR_EXPD_DIVI_CD_MARKETING + "]").remove();
		    			expd_divi_cd_sel.children("[value=" + _PR_EXPD_DIVI_CD_MYPAGE + "]").remove();
		    			expd_divi_cd_sel.children("[value=" + _PR_EXPD_DIVI_CD_OFFLINE_ADD + "]").remove();
		    			expd_divi_cd_sel.children("[value=" + _PR_EXPD_DIVI_CD_CAMPAIGN_GEN + "]").remove();
		    			expd_divi_cd_sel.children("[value=" + _PR_EXPD_DIVI_CD_CAMPAIGN_MKT + "]").remove();
		    			expd_divi_cd_sel.children("[value=" + _PR_EXPD_DIVI_CD_CAMPAIGN_CRM + "]").remove();
		    			break;
	    		}
	    		if (sys_divi_cd != _ST_SYS_DIVI_CD_PO){
	    			cs_use_poss_yn_area.show();
	    		}
	    	}// 적립, 기타 - 포인트/CS/마켓팅 불가 = 일반만 가능
	    	else if(varPromoKindCd != ""){
	    		var options = expd_divi_cd_sel.find("option");
	        	var option_not = options.not("[value="+_PR_EXPD_DIVI_CD_GEN+"]"); //일반
	        	
	        	option_not.each(function(){
	        		var option = $(this);
        			option.remove();
	        	});
	    		
	            expd_divi_cd_sel.attr("disabled", true).addClass("readonly");;
	    	}
	    };
	    
	    // 프로모션 종류에 따른 혜택값구분 셋팅(등록/상세 공통사용)
	    fnSetPromoBeneValDiviCd = function(varOrgBeneValDiviCdSel) {
	    	var varPromoKindCd = $("#promo_kind_cd").val();
	    	var bene_val_divi_cd_sel = $("#bene_val_divi_cd_sel");
	    	var beneValDiviCd = {};
	    	
	    	bene_val_divi_cd_sel.empty();
	        bene_val_divi_cd_sel.append(varOrgBeneValDiviCdSel);
	        bene_val_divi_cd_sel.find("option:eq(0)").attr("selected", "selected");		// 혜택값구분 초기화
	        
	        //배수적립 - 적립배수
	        beneValDiviCd[_PR_PROMO_KIND_CD_MULTI_SAVE] = _PR_BENE_VAL_DIVI_CD_SAVE_MULTI;
	        //무이자 - 무이자개월
	        beneValDiviCd[_PR_PROMO_KIND_CD_FREE_INTERS] = _PR_BENE_VAL_DIVI_CD_INTERS;
	        //사은품/주문사은품/N+1 - 지급수량
	        beneValDiviCd[_PR_PROMO_KIND_CD_GIFT] = _PR_BENE_VAL_DIVI_CD_CNT;
	        beneValDiviCd[_PR_PROMO_KIND_CD_ORDER_GIFT] = _PR_BENE_VAL_DIVI_CD_CNT;
	        beneValDiviCd[_PR_PROMO_KIND_CD_NP_ONE] = _PR_BENE_VAL_DIVI_CD_CNT;
	        //배송비쿠폰/다수량할인 - 율
	        beneValDiviCd[_PR_PROMO_KIND_CD_DELI_CUPN] = _PR_BENE_VAL_DIVI_CD_RATE;
	        beneValDiviCd[_PR_PROMO_KIND_CD_MULTI_SALE] = _PR_BENE_VAL_DIVI_CD_RATE;
	        
	        if (beneValDiviCd[varPromoKindCd]) {
        		bene_val_divi_cd_sel.val(beneValDiviCd[varPromoKindCd]);
        		bene_val_divi_cd_sel.attr("disabled", true).addClass("readonly");
        	}// 기타 - 율/금액
	        else{
	        	var options = bene_val_divi_cd_sel.find("option");
	        	var option_not = options.not("[value="+_PR_BENE_VAL_DIVI_CD_RATE+"],[value="+_PR_BENE_VAL_DIVI_CD_AMT+"]"); //율/금액
	        	
	        	option_not.each(function(){
	        		var option = $(this);
        			option.remove();
	        	});
	    		bene_val_divi_cd_sel.removeAttr("disabled").removeClass("readonly");
	    	}
	        
	        var varExpdDiviCd = $("#expd_divi_cd_sel").val();
			if (varExpdDiviCd == _PR_EXPD_DIVI_CD_CS) {					// CS전용일 경우 금액만 가능
				bene_val_divi_cd_sel.val(_PR_BENE_VAL_DIVI_CD_AMT);				
				
				if( varPromoKindCd == _PR_PROMO_KIND_CD_DELI_CUPN ) {         // 배송비쿠폰 - 율만 가능
	                bene_val_divi_cd_sel.val(_PR_BENE_VAL_DIVI_CD_RATE);
				}
				
				bene_val_divi_cd_sel.attr("disabled", true);
				
				if(bene_val_divi_cd_sel.val() == _PR_BENE_VAL_DIVI_CD_AMT){
				    $("[name=max_dscnt_amt]").each(function(){
				    	$(this).val("0");
		                $(this).attr("disabled", true).addClass("readonly");
				    });
				}else{
					$("[name=max_dscnt_amt]").each(function(){
	                    $(this).removeAttr("disabled").removeClass("readonly");
	                });
				}
				$("#coupon_issue_mean_cd_sel").val(_PR_COUPON_ISSUE_MEAN_CD_MANUAL);
				$("#coupon_issue_mean_cd_sel").attr("disabled", true);
				
			}else if(varExpdDiviCd == _PR_EXPD_DIVI_CD_GEN ||
					varExpdDiviCd == _PR_EXPD_DIVI_CD_MARKETING){		// 일반/마켓팅				
				fnSetCouponMeanCd();
	        }else if(varExpdDiviCd == _PR_EXPD_DIVI_CD_MYPAGE){ //마이페이지
	        	$("#coupon_issue_mean_cd_sel").val(_PR_COUPON_ISSUE_MEAN_CD_DOWN);
	    		$("#coupon_issue_mean_cd_sel").attr("disabled", true);	
	        }else if(varExpdDiviCd == _PR_EXPD_DIVI_CD_CAMPAIGN_GEN ||
					varExpdDiviCd == _PR_EXPD_DIVI_CD_CAMPAIGN_MKT ||
					varExpdDiviCd == _PR_EXPD_DIVI_CD_CAMPAIGN_CRM ) {	// 캠페인 일반/마케팅/CRM
	        	$("#coupon_issue_mean_cd_sel").val(_PR_COUPON_ISSUE_MEAN_CD_MANUAL);
				$("#coupon_issue_mean_cd_sel").attr("disabled", true);
	        }else{
	        	if (sys_divi_cd != _ST_SYS_DIVI_CD_PO){
	        		$("#coupon_issue_mean_cd_sel").find("option:eq(0)").attr("selected", "selected");
	        		$("#coupon_issue_mean_cd_sel").attr("disabled", false);
	        	}
	        }
			
			// 용도구분이 포인트전환일 경우
			if(varExpdDiviCd == _PR_EXPD_DIVI_CD_POINT) {
				$("#st_active_pnt").removeAttr("readonly");   
	            $("#st_active_pnt").attr("class", "input rt");
	            $("#expd_point").show();
			} else {
				$("#st_active_pnt").val("");
				$("#st_active_pnt").attr("readonly", "readonly");   
	            $("#st_active_pnt").attr("class", "input readonly");
	            $("#expd_point").hide();
			}
			
			fnSetMaxDscntViewChange();	//율/금액 표기 변경
	    };
	    
	    // 프로모션 종류에 따른 혜택처리 방식 셋팅(등록,상세 공통사용)
	    fnSetPromoDealMethod = function() {
	    	$("[name=bene_proc_mean_cd_chk]").removeAttr("checked");
	    	var varPromoKindCd = $("#promo_kind_cd").val();
	    	
	    	if(fnChkPromoCoupon(varPromoKindCd)){	    	
	    		$("[name=bene_proc_mean_cd_chk]").each(function(){
    				if (varPromoKindCd == _PR_PROMO_KIND_CD_NP_ONE &&
    						$("#bene_poli_cd_sel").val() == _PR_BENE_POLI_CD_GIFT){		// N+1(사은) - 조정마진율만
    					if($(this).val() == _PR_BENE_PROC_MEAN_CD_MARGIN_RATE){
                            $(this).attr("checked", true);
                        }	
    					
    					$(this).attr("disabled", true);
    				}else{																// 쿠폰/가격할인 - 둘다 설정가능
    					if($(this).val() == _PR_BENE_PROC_MEAN_CD_BURDEN_RATE){
                            $(this).attr("checked", true);
                        }
    				}
                });	
	    	}else{		// 기타 - 분담율만 설정가능
	    		$("[name=bene_proc_mean_cd_chk]").each(function(){
	    			if($(this).val() == _PR_BENE_PROC_MEAN_CD_BURDEN_RATE){
                        $(this).attr("checked", true);
                    }
	    			$(this).attr("disabled", true);
                });	
	    	}
	    };
	    
	    // 혜택정책에 따른 처리방식 셋팅
	    fnSetBenePoliMethod = function() {
	    	if ($("#bene_poli_cd_sel").val() == _PR_BENE_POLI_CD_SAVE) {			// 적립인 경우
	        	$("[name=bene_proc_mean_cd_chk]").each(function(){
	                if ($(this).val() == _PR_BENE_PROC_MEAN_CD_BURDEN_RATE) {		// 부담률로 설정
	                    $(this).attr("checked", true);
	                }
	                $(this).attr("disabled", true);
	            }); 
	    	}
	    };
	    
		// 발급수량 기준
		fnIssueLimitQtyStCd = function(gb){
			var issue_limit_qty_st_cd = $("#issue_limit_qty_st_cd")
			, input_issue_limit_cnt = $("#input_issue_limit_cnt");
			var cnt_input = input_issue_limit_cnt.find("input");
		
			// 무제한이 아닐경우 보임
			if (issue_limit_qty_st_cd.val() == _PR_ISSUE_LIMIT_QTY_ST_CD_ONE){
				input_issue_limit_cnt.hide();
				if ( gb != "view" ){
					cnt_input.val(1);
				}
			}else if ( issue_limit_qty_st_cd.val() != "" ){
				input_issue_limit_cnt.show();
				if ( gb != "view" && (cnt_input.val() == "" || cnt_input.val() < 1) ){
					cnt_input.val(1);
				}
			}else{
				input_issue_limit_cnt.hide();
				if ( gb != "view"){
					input_issue_limit_cnt.find("input").val("");
				}
			}
		}
	    
	    /*********************************************** 프로모션 필드별 이벤트 처리 **********************************************************/
	    
	    // 부담률 입력에 따른 업체부담률 자동계산
	    fnSetChargeRate = function( obj ) {
	    	var varPromoKindCd = $("#promo_kind_cd").val();
	    	var bene_val_divi_cd_sel = $("#bene_val_divi_cd_sel");
	    	var beneVal = $("#bene_val").val();
	    	var our_comp_charge_rate = $("#our_comp_charge_rate");
	    	var vend_charge_rate = $("#vend_charge_rate");
	    	var cardcomp_charge_rate = +$("#cardcomp_charge_rate").val();
	    	var calc = 0;
	    	
	    	if ( bene_val_divi_cd_sel.val() == _PR_BENE_VAL_DIVI_CD_RATE){
	    		var val = $(obj).val();
	    		var reExp = "/[^-\.0-9]/g";
	    		var expResult = +val.replace(reExp);
	    		$(obj).val( expResult.toFixed(1) );
	    	}
			
	    	if (+our_comp_charge_rate.val() < 0 || +our_comp_charge_rate.val() > beneVal 	||	isNaN(+our_comp_charge_rate.val()) ) {
    			our_comp_charge_rate.val(beneVal);
    			vend_charge_rate.val("0");
    			our_comp_charge_rate.focus();
    			return true;
    		}
			if (varPromoKindCd == _PR_PROMO_KIND_CD_CART_CUPN) {		// 장바구니
				if (beneVal - +our_comp_charge_rate.val() - cardcomp_charge_rate < 0) {
					vend_charge_rate.val("0");
					calc = beneVal - cardcomp_charge_rate;
					if ( bene_val_divi_cd_sel.val() == _PR_BENE_VAL_DIVI_CD_RATE){
						calc = calc.toFixed(1);
					}
					our_comp_charge_rate.val(calc);
				} else {
					calc = beneVal - +our_comp_charge_rate.val() - cardcomp_charge_rate;
					if ( bene_val_divi_cd_sel.val() == _PR_BENE_VAL_DIVI_CD_RATE){
						calc = calc.toFixed(1);
					}
					vend_charge_rate.val(calc);
				}
			}else if(varPromoKindCd  != _PR_PROMO_KIND_CD_CHARGE_SALE){
				if(fnCsCouponChk()){
					our_comp_charge_rate.val(beneVal);
	    			vend_charge_rate.val("0");
		    	}else{
		    		calc = beneVal - +our_comp_charge_rate.val();
					if ( bene_val_divi_cd_sel.val() == _PR_BENE_VAL_DIVI_CD_RATE){
						calc = calc.toFixed(1);
					}
		    		vend_charge_rate.val(calc);	
		    	}
			}
	    };
	    
	    var adjust;
	    var imme;		// 즉시적용여부
	    var apply_qty;	// 적용수량1개여부
	    // 프로모션 유형에 따른 값 변경
	    fnSetManyByPromoTypeNo = function() {
	    	adjust = $("#promo_type_no option:selected").attr("adjust");
	    	imme = $("#promo_type_no option:selected").attr("imme");
	    	
	    	fnSetPromoBenePoli(varOrgBenePoliCdSel);
	    	
	    	if(adjust == "Y"){
	    		// 혜택정책 - 적립제외
	    		$("#bene_poli_cd_sel").children("[value=" + _PR_BENE_POLI_CD_SAVE + "]").remove();
        	}
            
	    	fnSetBeneProcMean();
	    	
	    	if (imme == "Y") {		// 즉시적용 가능 유형 선택
	    		// 혜택정책 - 적립 제외
	            $("#bene_poli_cd_sel").children("[value=" + _PR_BENE_POLI_CD_SAVE + "]").remove();
	            
	            // 용도구분 - 일반
	            $("#expd_divi_cd_sel").empty();
                $("#expd_divi_cd_sel").append(varOrgExpdDiviCdSel);
	            $("#expd_divi_cd_sel").val(_PR_EXPD_DIVI_CD_GEN);
	            $("#expd_divi_cd_sel").attr("disabled", true);
	            
	            // 총발급수량/발급제한수량기준 입력불가
	            $("#tot_issue_qty").val("");
	            $("#tot_issue_qty").attr("readonly", "readonly");   
	    		$("#tot_issue_qty").attr("class", "input readonly");
	    		
	    		$("#issue_limit_qty_st_cd").val("");
	            $("#issue_limit_qty_st_cd").attr("disabled", true);
	        } else {				// 즉시적용 불가 유형 선택
	    		fnSetExpdDiviCd(varOrgExpdDiviCdSel);
	    		
                // 총발급수량/발급제한수량기준 입력가능
	    		$("#tot_issue_qty").val("0");
	            $("#tot_issue_qty").removeAttr("disabled");
	            $("#tot_issue_qty").attr("class", "input rt");
	            
	            $("#issue_limit_qty_st_cd").removeAttr("disabled");
	    	}
	    	
	    	var promo_kind_cd = $("#promo_kind_cd").val();
	    	
	    	fnSetChnlCd(promo_kind_cd);
	    	fnSetCouponMeanCd();
	    	fnIssueMainCdSel();
	    	fnCouponControll();
	    	fnTypeApprChk();
	    	fnApplyExpRemark();
	    	fnSetGridByPromoKindCd(promo_kind_cd);
	    };
	    
	    // 프로모션 종류선택에 따른 매체구분 제어(온라인/오프라인구분)
	    fnSetChnlCd = function(promo_kind_cd){
	    	var chnl_cd = $("#chnl_cd");
	    	var offline_text = $("#offline_text");
	    	var onoff_divi_cd = $("#onoff_divi_cd");
	        
	    	if(_PR_PROMO_KIND_CD_OFFLINE[promo_kind_cd]){
	    		chnl_cd.hide();
	    		if ( wMode == "I" ){
	    			chnl_cd.val(_ST_CHNL_CD_COMM);
	    		}
	    		offline_text.show();
	    		onoff_divi_cd.val(_PY_ONOFF_DIVI_CD_OFF);
	    	}else{
	    		chnl_cd.show();
	    		if ( wMode == "I" ){
	    			chnl_cd.val("");
	    		}
	    		offline_text.hide();
	    		onoff_divi_cd.val(_PY_ONOFF_DIVI_CD_ON);
	    	}
	    }
	    
	    // 프로모션 종류선택에 따른 그리드 제어
	    fnSetGridByPromoKindCd = function(promo_kind_cd){
	    	var div_comm_apply = $("#div_comm_apply");
	    	var div_apply = $("#div_apply");
	    	var div_apply_shop = $("#div_apply_shop");
	    	
	    	div_comm_apply.hide();
	    	div_apply.hide();
	    	div_apply_shop.hide();
	    		
	    	if ( promo_kind_cd == _PR_PROMO_KIND_CD_FREE_INTERS 	||
			 	 promo_kind_cd == _PR_PROMO_KIND_CD_CASHBAG	){		//무이자/캐시백
	    		div_comm_apply.show();
	    	}else if(_PR_PROMO_KIND_CD_OFFLINE[promo_kind_cd]){//오프라인
	    		div_apply.show();
	    		div_apply_shop.show();
			}else if (promo_kind_cd != ""){
				div_comm_apply.show();
				div_apply.show();
				
				if ( wMode == "I" ){
					if (commApplyGrid.GetRowCount() > 0){
						commApplyGrid.DeleteCreateRows();	
					}
					if (applyGrid.GetRowCount() > 0){
						applyGrid.DeleteCreateRows();
					}
					if (applyShopGrid.GetRowCount() > 0){
						applyShopGrid.DeleteCreateRows();
					}
				}
			}
	    }
	    
	    
	    // 발급주체 제어
	    fnIssueMainCdSel = function(){
	    	var promo_kind_cd = $("#promo_kind_cd").val();
	    	if ( sys_divi_cd == _ST_SYS_DIVI_CD_PO ){
	    		$("#issue_main_cd_sel").val(_PR_ISSUE_MEAN_CD_VEND);
	    		$("#issue_main_cd_sel").attr("disabled", true);
	    	}else if(promo_kind_cd == _PR_PROMO_KIND_CD_DELI_CUPN){
	    		if ( wMode == "I" ){
	    			$("#issue_main_cd_sel").val(_PR_ISSUE_MEAN_CD_MARKETER);	
	    		}
	    		$("#issue_main_cd_sel").attr("disabled", true);
	    	}else if( promo_kind_cd == _PR_PROMO_KIND_CD_SAVE){
	    		$("#issue_main_cd_sel").children("[value!=''][value!=50]").remove(); //선택/페이백 빼고 제거
	    		
	    		// << 구매적립 프로모션 >> 페이백 선택 시, 안내문구 노출
	        	if ($("#promo_kind_cd").val() === _PR_PROMO_KIND_CD_SAVE && $("#issue_main_cd_sel").val() === _PR_ISSUE_MEAN_CD_PAYBACK) {
	        		$("#issue_main_payback_msg").show();
	        	} else {
	        		$("#issue_main_payback_msg").hide();
	        	}
	    	}
	    }
	    
	    //쿠폰 화면 제어(즉시, 더블)
	    fnCouponControll = function(gb){
	    	var promo_kind_cd = $("#promo_kind_cd").val();
	    	var promo_type_no = $("#promo_type_no").val();
	    	var apply_qty_sel = $("#apply_qty_sel");
	    	var apply_display_yn = apply_qty_sel.find("option").length > 1 ? true : false;
	    	
	    	//쿠폰일때만
	    	if ( promo_kind_cd == _PR_PROMO_KIND_CD_CUPN ){
	    		if ( apply_display_yn ) {
		    		fnSetApplyQtyByPromoTypeNo();
		    	}
		    	if ( promo_type_no == _PR_PROMO_KIND_NO_DOUBLE ){ 	//더블쿠폰
		    		if ( !apply_display_yn ) {
			    		$("#redu_yn_td").attr("colspan", "5");
			    	}
		    	}
		    	$("#emp_coupon_yn").val("");
	    	}
	    }
	    
	    // 프로모션 유형선택에 따른 적용수량 변경
	    fnSetApplyQtyByPromoTypeNo = function(gb) {
	    	var apply_qty = $("#promo_type_no option:selected").attr("apply_qty");
	    	if ("Y" == apply_qty){	// 적용수량 1
	    		$("[role=apply_qty]").show();
	    	} else {						// 적용수량 설정없음
	    		$("[role=apply_qty]").hide();
	    		$("#apply_qty_sel").find("option:eq(0)").attr("selected", "selected");
	    	}
	    };
	    
	    // 쿠폰발급방식 설정
	    fnSetCouponMeanCd = function(){
	    	imme = $("#promo_type_no option:selected").attr("imme");
	    	var promo_type_no = $("#promo_type_no").val();
	    	var promo_kind_cd = $("#promo_kind_cd").val();

	    	$("#coupon_issue_mean_cd_sel").empty();
            $("#coupon_issue_mean_cd_sel").append(varOrgCouponIssueMeanCdSel);
            $('#coupon_issue_mean_cd_sel option:eq(0)').attr("selected", "selected");
            $("#coupon_issue_mean_cd_sel").removeAttr("disabled");

            if ( sys_divi_cd == _ST_SYS_DIVI_CD_PO ){		//업체접속인경우
            	if ( promo_kind_cd == _PR_PROMO_KIND_CD_CUPN ||
            		 promo_kind_cd == _PR_PROMO_KIND_CD_DELI_CUPN ||
        			 promo_kind_cd == _PR_PROMO_KIND_CD_CART_CUPN){
            		$("#coupon_issue_mean_cd_sel").val(_PR_COUPON_ISSUE_MEAN_CD_DOWN);
            		$("#coupon_issue_mean_cd_sel").attr("disabled", true);
            	}
    		}else {
    			// 프로모션 유형이 즉시적용유형일 경우 
    			if (imme == "Y") {		// 즉시적용 가능 유형 선택
    				// 쿠폰발급방식
    				$("#coupon_issue_mean_cd_sel").val(_PR_COUPON_ISSUE_MEAN_CD_IMMED);
    				$("#coupon_issue_mean_cd_sel").attr("disabled", true);
    			} else {				// 즉시적용 불가 유형 선택
					$("#coupon_issue_mean_cd_sel").children("[value=" + _PR_COUPON_ISSUE_MEAN_CD_IMMED + "]").remove();
    			}
    		}
            
            if (promo_kind_cd !== _PR_PROMO_KIND_CD_DELI_CUPN) {
            	$("#coupon_issue_mean_cd_sel > option[value='" + _PR_COUPON_ISSUE_MEAN_CD_AUTO + "']").remove();
            }
	    }
	    
	    // 혜택처리 방식에 따른 부담률 필드 변경
        fnSetBeneProcMean = function(){
            var varPromoKindCd = $("#promo_kind_cd").val();
            var varBeneProcMeanCd = $("#bene_proc_mean_cd").val();
            var varBeneVal = $("#bene_val").val();
            var our_comp_charge_rate = $("#our_comp_charge_rate");
            var vend_charge_rate = $("#vend_charge_rate");
            var cardcomp_charge_rate = $("#cardcomp_charge_rate");
            var fnReadonlyProc = function(obj, flag){
            	if (flag){
            		obj.attr("readonly", true).addClass("readonly");
            	}else{
            		obj.removeAttr("readonly").removeClass("readonly");
            	}
            }
            
            our_comp_charge_rate.val(varBeneVal);
            fnReadonlyProc(our_comp_charge_rate, true);
            
            vend_charge_rate.val("0");
            fnReadonlyProc(vend_charge_rate, true);
            
            cardcomp_charge_rate.val("0");
            fnReadonlyProc(cardcomp_charge_rate, true);
            
            if ($("#expd_divi_cd").val() == _PR_EXPD_DIVI_CD_CS) {
            	our_comp_charge_rate.val(varBeneVal);
            	fnReadonlyProc(our_comp_charge_rate, true);
            }
            
            switch(varPromoKindCd){
            	//쿠폰
            	case _PR_PROMO_KIND_CD_SAVE:
	            case _PR_PROMO_KIND_CD_CUPN:
	            	if(sys_divi_cd != _ST_SYS_DIVI_CD_PO){
	            		fnReadonlyProc(our_comp_charge_rate, false);
	            	}
	            	break;
	            //사은품/주문사은품/배송비쿠폰
	            case _PR_PROMO_KIND_CD_GIFT:
	            case _PR_PROMO_KIND_CD_ORDER_GIFT:
	            case _PR_PROMO_KIND_CD_MULTI_SALE:
	            	our_comp_charge_rate.val("100");
	            case _PR_PROMO_KIND_CD_DELI_CUPN:
	            	if(sys_divi_cd == _ST_SYS_DIVI_CD_PO){
	            		our_comp_charge_rate.val("0");
	                	vend_charge_rate.val("100");
	            	}
	            	break;
	            //청구할인
	            case _PR_PROMO_KIND_CD_CHARGE_SALE:
	            	our_comp_charge_rate.val("0");
	                cardcomp_charge_rate.val(varBeneVal);
	                break;
	            //카드할인
	            case _PR_PROMO_KIND_CD_CARD_SALE:
	            	our_comp_charge_rate.val(varBeneVal);
	            	cardcomp_charge_rate.val("0");
	            	fnReadonlyProc(cardcomp_charge_rate, false);
	            	break;
	            default:
	            	//상위 if문에서 처리하기 때문에 로딩시만 처리하도록함. hslee 2014.05.08
	            	if(varBeneProcMeanCd == ""){
		               	our_comp_charge_rate.val(varBeneVal);	 
		               	fnReadonlyProc(our_comp_charge_rate, false);
	                    vend_charge_rate.val("0");
	                }
	            	cardcomp_charge_rate.val("0");
	            	break;
            }
        };
        
        // 부담률 기본값으로 셋팅
        fnSetBeneDefault = function() {
        	$("#our_comp_charge_rate").val("100");
            $("#our_comp_charge_rate").attr("readonly", "readonly");
            $("#our_comp_charge_rate").attr("class", "input readonly rt");
            
            $("#vend_charge_rate").val("0");
            $("#vend_charge_rate").attr("readonly", "readonly");
            $("#vend_charge_rate").attr("class", "input readonly rt");
        };
	    
	    // 혜택값구분이 금액이면 최대할인(적립)금액 입력 불가
	    fnSetMaxDscntAmt = function(){
	    	$("[name=bene_val]").each(function(i){
				$("[name=bene_val]").eq(i).val("0");
			});
	    	var bene_val_divi_cd_sel = $("#bene_val_divi_cd_sel").val();
	    	
	    	// 금액
	    	if(bene_val_divi_cd_sel == _PR_BENE_VAL_DIVI_CD_AMT){
			    $("[name=max_dscnt_amt]").each(function(){
			    	$(this).val("0");
	                $(this).attr("disabled", "disabled");
	                $(this).addClass("readonly");
			    });
			}else if ( bene_val_divi_cd_sel == _PR_BENE_VAL_DIVI_CD_RATE){ // 율
				$("[name=max_dscnt_amt]").each(function(){
					$(this).val("0");
	                $(this).removeAttr("disabled");   
	                $(this).removeClass("readonly");
	            });
			}
	    	//캐시백일경우 그리드 초기화
	    	if( $("#promo_kind_cd").val() == _PR_PROMO_KIND_CD_CASHBAG){
				var rows = cashBagGrid.GetRows();
				$.each(rows,function(idx, cell){
					cashBagGrid.SetValue({
						row:idx,
						id:"BENE_VAL",
						value:0
					});
				})
	    	}
			$("#our_comp_charge_rate").val("0");
			$("#vend_charge_rate").val("0");
			$("#cardcomp_charge_rate").val("0");
	    };
	    
	    // 프로모션 저장
	    fnSavePromo = function(state_cd, appr_yn ){
	    	if(save_flag) return;
	    	
	    	$("#pay_appr_cd").val(state_cd);
	    	
	    	if ( $("#pay_appr_cd").val() == _PR_PAY_APPR_CD_SAVE ){
	        	if ( isEmpty($("#promo_kind_cd"))){
		    		alert("프로모션 종류를 선택해주세요!");
		    		return;
		    	}
		    	
		    	if ( isEmpty($("#promo_nm"))){
		    		alert("프로모션명을 입력하세요!");
		    		return;
		    	}
		    	
		    	if ( $("#disp_apply_start_dtime").val() == "" || $("#disp_apply_end_dtime").val() == ""){
		    		alert("프로모션 기간을 입력하세요!");
		    		return;
		    	}
	        }
	    	
	    	// 값 setting
	        $("[id$=_sel]").each(function(){
	            $("#" + $(this).attr("name").substring(0, $(this).attr("name").length-4)).val($(this).val());
	        });
	        
	        $("[id$=_chk]").each(function(){
	        	if($(this).attr("type") == "radio"){
	        		if($(this).is(":checked")){
		                $("#" + $(this).attr("name").substring(0, $(this).attr("name").length-4)).val($(this).val());
		            }
	        	}else if($(this).attr("type") == "checkbox"){
	        		$("#" + $(this).attr("name").substring(0, $(this).attr("name").length-4)).val($(this).val());
	        	}
	        });
	        
	        if ($("#pay_appr_cd").val() != _PR_PAY_APPR_CD_SAVE){
	        	var promo_kind_cd = $("#promo_kind_cd").val();
	        	var promo_type_no = $("#promo_type_no").val();
	        	var coupon_issue_mean_cd_sel = $("#coupon_issue_mean_cd_sel").val();
		    	if (promo_kind_cd == _PR_PROMO_KIND_CD_CUPN && promo_type_no == _PR_PROMO_KIND_NO_COUPON && coupon_issue_mean_cd_sel == _PR_COUPON_ISSUE_MEAN_CD_IMMED){
		    		$("#use_poss_start_date").val($("#disp_apply_start_date").val());
		    		$("#use_poss_end_date").val($("#disp_apply_end_date").val());
		    	}
	    		
		    	// IE8 일때는 적립금 적용 여부를 체크한다. IE8 이하 hidden 값 체크시 에러발생
		    	if (navigator.userAgent.indexOf('8.0') != -1 && promo_kind_cd == _PR_PROMO_KIND_CD_CUPN){
		    		if ( $("#save_apply_yn").val() == "" ){
		    			alert("적립금적용여부를 선택해주세요.");
		    			return false;
		    		}
		    	}
		    			
	        	// 유효성 체크 - 프로모션 기본
		        if(!$.form("#promoForm").check({})){
		            return;
		        }
		        
		        // 유효성 체크 - 프로모션 종류별
		        if(fnCheckPromoKind()){
		            return;
		        }
		        
		        // 포인트 전환의 경우 기준포인트를 입력받아야 한다.
		        if($("#expd_divi_cd_sel").val() == _PR_EXPD_DIVI_CD_POINT){  
		            if(!isNumber($("#st_active_pnt"))){
		                alert("포인트 전환가능한 기준포인트를 입력해주세요.");
		                $("#st_active_pnt").focus();
		                return;
		            }
		        }
	        }
	        
	        // [SIV-3480] 쿠폰(상품/더블), 장바구니쿠폰을 대상으로 기본적용조건 혜택값 30% 초과 입력제한
	        if (fnCheckBeneVal()) {
                $("#bene_val").focus();
	        	return true;
	        }
	        
	        // [SIV-3690] 입점업체 쿠폰 비용분담 전가 금지 - 공정위 대응(1차)
	        // 승인/승인요청일 경우에만 체크
        	if(state_cd ==_PR_PAY_APPR_CD_REQ_APPROVAL || state_cd ==_PR_PAY_APPR_CD_REQ){
				if (fnCheckVendChargeRate()) {
					return;
				}	
			}	

			// [2019.05.29]프로모션 적용대상 미등록 시, 알럿 노출
	    	if (!fnHasApplyGridItem("I")) {
	    		return;
	    	}
	    	
	    	// [SVG-2787] 프로모션 적용대상의 시작일시가 프로모션 기간 시작일시보다 앞서 있을 경우 승인 불가
	        if (state_cd === _PR_PAY_APPR_CD_REQ && appr_yn === "Y" && fnCheckEarlyApplyDtime()) {
       			return;
        	}
	        
	        $("#vend_charge_rate").removeAttr("disabled");
	        
	        // 적용조건그리드 유효성 체크
	        if( fnCheckApplyGrid() ){
	        	 $("#vend_charge_rate").attr("disabled", true);
	        	return;
	        }
	        
	        // 요일 체크
			if ( !fnDayCheck($("#promo_kind_cd").val()) ){
				return false;
			}
			
			if ( appr_yn == 'Y' ){
				$("#req_pay_appr_cd").val(_PR_PAY_APPR_CD_REQ_APPROVAL);
			}else{
				$("#req_pay_appr_cd").val(state_cd);
			}
			
			$("#issue_targ_yn").val( fnCommonApplyMemberChk() ? _BOOLEAN_TRUE : _BOOLEAN_FALSE);	//발급대상여부 체크
			
			save_flag = true;	//중복등록방지
			
			
	    	if($("#promo_kind_cd").val() == _PR_PROMO_KIND_CD_FREE_INTERS){
	    		commApplyGrid.DoSave({
	                action:"/promo/promomgmt/registPromo.action",
	                group:[applyGrid, intersGrid],
	                form:["promoForm"]
	            });
	        }else if($("#promo_kind_cd").val() == _PR_PROMO_KIND_CD_CASHBAG){
	    		commApplyGrid.DoSave({
	                action:"/promo/promomgmt/registPromo.action",
	                group:[applyGrid, cashBagGrid],
	                form:["promoForm"]
	            });
	        }else{
	        	commApplyGrid.DoSave({
	                action:"/promo/promomgmt/registPromo.action",
	                group:[applyShopGrid, applyGrid],
	                form:["promoForm"]
	            }); 
	        }
	    };
	    
		// [SIV-3480] 쿠폰(상품/더블), 장바구니쿠폰을 대상으로 기본적용조건 혜택값 30% 초과 입력제한
		fnCheckBeneVal = function() {
			var beneValDiviCd = $("#bene_val_divi_cd_sel").val(),
		        beneVal = Number($("#bene_val").val()),
		        promoKindCd = $("#promo_kind_cd").val();
			
			if ($.inArray(promoKindCd, [ _PR_PROMO_KIND_CD_CUPN, _PR_PROMO_KIND_CD_CART_CUPN ]) == -1) {
				return false;
			}
			
			// [SIV-3560] 기본적용 조건 혜택 값 30% 초과 등록 권한(예외적용 계정 -> PR0029 참조)
			if (promoKindCd === _PR_PROMO_KIND_CD_CUPN && $.inArray(_userId, _PR_PROMO_EXP_APPR_USER_GRP2) > -1) { // 상품쿠폰(더블포함)
				return false;
			}
			else if (promoKindCd === _PR_PROMO_KIND_CD_CART_CUPN && $.inArray(_userId, _PR_PROMO_EXP_APPR_USER_GRP3) > -1) { // 장바구니 쿠폰
				return false;
			}
			
            if (beneValDiviCd == _PR_BENE_VAL_DIVI_CD_RATE && beneVal > 30) {
            	alert("기본적용조건 혜택값에 30% 초과 입력은 불가합니다.");
            	return true;
            }
            return false;
		};
		
		// [SIV-3690] 입점업체 쿠폰 비용분담 전가 금지 - 공정위 대응(1차)
		fnCheckVendChargeRate = function() {
	    	if ($.inArray($("#promo_kind_cd").val(), [ _PR_PROMO_KIND_CD_CUPN ]) == -1) return false;
			
			var beneVal = Number($("#bene_val").val()),
			    vendChargeRate = Number($("#vend_charge_rate").val());
			let olInfos = $("#ol_no").val();
			
			// 혜택값 또는 업체 부담율(금)이 없으면 확인 불가
			if (isNaN(beneVal) || isNaN(vendChargeRate)) return false;
			
			if (vendChargeRate > beneVal * 0.5 && (olInfos=="")) {
				if ( sys_divi_cd == _ST_SYS_DIVI_CD_BO ){
					alert('업체 분담율이 50% 초과시 공문을 반드시 등록 해야합니다.');
					return true;
				}
//				alert("업체 부담률은 50%를 초과할 수 없습니다.");
//				return true;
			}
			return false;
		};
	    
	    //상품쿠폰 발행 시, 프로모션 적용대상이 없이, 저장(승인) 클릭 > 아래 알럿 노출
	    //적용대상: 쿠폰, 장바구니쿠폰, 오프라인상품쿠폰, 오프라인장바구니 쿠폰 
	    fnHasApplyGridItem = function(incommingType, payApprCd) {
	    	//적용대상외 프로모션 종류는 true 반환
	    	if ($.inArray($("#promo_kind_cd").val(), [_PR_PROMO_KIND_CD_CUPN,				// 쿠폰
	    	                                          _PR_PROMO_KIND_CD_CART_CUPN,			// 장바구니쿠폰
	    	                                          _PR_PROMO_KIND_CD_OFFLINE_CUPN,		// 오프라인상품쿠폰
	    	                                          _PR_PROMO_KIND_CD_OFFLINE_CART_CUPN	// 오프라인장바구니 쿠폰
	    	]) == -1) return true;

	    	// [SIV-3480] 프로모션 적용대상이 없으면 저장/승인 불가(예외적용 계정 -> PR0029 참조)
	    	if ($.inArray(_userId, _PR_PROMO_EXP_APPR_USER_GRP1) > -1) {
	    		return true;
	    	}
	    	
	    	if (typeof applyGrid !== "object") return true;
	    	
	    	/**
	    	 * 프로모션등록 팝업
	    	 */
	    	if (incommingType === "I" && (applyGrid.GetRowCount() == 0 || applyGrid.GetRows({checked:true}).length == 0)) { // 최초등록하는 시점의 적용대상 수 확인
    			alert("프로모션 적용대상이 없을 경우 저장/승인이 불가합니다.");
	    		return false;	
	    	}
	    	
	    	/**
	    	 * 프로모션상세 팝업
	    	 */
	    	if (incommingType === "U" && $("#pay_appr_cd").val() == _PR_PAY_APPR_CD_SAVE) { // 저장상태의 프로모션에서 적용대상의 변동 확인
	    		
	    		var applyRowCnt = applyGrid.GetRowCount();
	    		if (applyRowCnt == 0) {
	    			alert("프로모션 적용대상이 없을 경우 저장/승인이 불가합니다.");
		    		return false;
	    		}

	    		if ($("#div_apply").find("select[name='cnt2'] option").length > 1) { // 적용대상이 그리드 2페이지 이상인 경우 PASS
	    			return true;
	    		}

	    		// 적용대상 전체 삭제 여부
		    	var hasApplyTarg = false;
		    	var delCnt = 0;
	    		$.each(applyGrid.GetRows(), function(i, row) {
	    			if (row.Checked) {
	    				
	    				// ROW 승인요청(CREATE)
	    				if (row["PAY_APPR_CD"] === _PR_PAY_APPR_CD_REQ && (row.CRUD === "C")) {
    						hasApplyTarg = true;
		    				return false; // -- break --	    					
	    				}
	    				
	    				// ROW 승인완료(READ, UPDATE)
	    				if (row["PAY_APPR_CD"] === _PR_PAY_APPR_CD_REQ_APPROVAL && (row.CRUD === "R" || row.CRUD === "U")) {
    						hasApplyTarg = true;
		    				return false; // -- break --
    					}
	    				
	    				if (row.CRUD === "D") {
		    				delCnt++;
		    			}
	    				
	    			} else {
	    				
	    				// ROW 승인완료(READ, UPDATE)
	    				if (row["PAY_APPR_CD"] === _PR_PAY_APPR_CD_REQ_APPROVAL) {
	    					hasApplyTarg = true;
		    				return false; // -- break --
	    				}
	    				
	    			}
	            });
	    		
	    		if (!hasApplyTarg || applyRowCnt == delCnt) {
	    			alert("프로모션 적용대상이 없을 경우 저장/승인이 불가합니다.");
	    			return false;
	    		}
	    	}
	    	return true;
	    }
	    
	    // 프로모션 기간보다 적용대상 기간이 먼저 시작되는지 확인  
	    fnCheckEarlyApplyDtime = function() {
	    	var flag = false;
    		if (applyGrid.GetRowCount() > 0) {
    			var pStartDtime = $("#disp_apply_start_dtime").val();
    			$.each(applyGrid.GetRows(), function(i, row) {
    				if (row["APPLY_START_DTIME"] < pStartDtime) {
    					flag = confirm("프로모션 기간과 상품 적용기간이 상이한것이 있습니다. 그래도 승인하시겠습니까?") ? false : true;
    					return false;
    				}
    			});
    		}
    		return flag;
	    }
	    
	    //공통적용대상 회원관련 여부
	    fnCommonApplyMemberChk = function(){
	    	var flag = false;
            $.each(commApplyGrid.GetRows(), function(idx, row) {
                //회원등급/회원그룹/임직원구분 일 경우 return true;
                if( row["APPLY_TYPE_CD"] == _PR_APPLY_TYPE_CD_MEMBERGRADE || row["APPLY_TYPE_CD"] == _PR_APPLY_TYPE_CD_MEMBERGROUP || row["APPLY_TYPE_CD"] == _PR_APPLY_TYPE_CD_STAFF){
                	if(row["APPLY_SEQ"] == "" || row["USE_YN"] == _BOOLEAN_TRUE){
                		flag = true;
                	}
                }
            });
	    	return flag;
	    }
	    
	    // 프로모션 유효성 체크
		fnCheckPromoKind = function(){
			var varBeneVal = $("#bene_val").val();
			var chk = false;
			
			//번들할인은 예외처리
			if($("#promo_kind_cd").val() != _PR_PROMO_KIND_CD_MULTI_SALE){
				if ($("#our_comp_charge_rate").val() != undefined ){
					if(isEmpty($("#our_comp_charge_rate")) || isEmpty($("#vend_charge_rate"))){
						alert("부담률을 입력해주세요.");
						return true;
					}
					if(+$("#our_comp_charge_rate").val() + +$("#vend_charge_rate").val() > varBeneVal){
						alert("부담률은 혜택값을 넘지 않아야 합니다.");
						$("#our_comp_charge_rate").focus();
						return true;
					}
				}
				
				if( varBeneVal != undefined ){
					if ( $("#cardcomp_charge_rate").val() != undefined ){
						if ( +$("#our_comp_charge_rate").val() + +$("#vend_charge_rate").val() + +$("#cardcomp_charge_rate").val() != varBeneVal ){
							chk = true;
						}
					}else if ( $("#our_comp_charge_rate").val() != undefined ){
						if ( +$("#our_comp_charge_rate").val() + +$("#vend_charge_rate").val() != varBeneVal ){
							chk = true;
						}
					}
				}
				if ( chk ){
					alert("부담률은 혜택값과 같아야 합니다.");
					$("#our_comp_charge_rate").focus();
					return true;
				}
			}
			
			chk = false;
			if($("#bene_val_divi_cd_sel").val() == _PR_BENE_VAL_DIVI_CD_RATE){
				$("[name=bene_val]").each(function(){
					if(+$(this).val() > 100){
						chk = true;
					}
				});
			}
			
			if(chk){
				alert("혜택정책구분이 율인 경우 혜택값은 100을 넘지 않아야 합니다.");
				return true;
			}
			
			if ($("#promo_kind_cd").val() == _PR_PROMO_KIND_CD_SAVE) {					// 적립프로모션
	            if ( Number($("#bene_val").val()) <= 0 ) {
	                alert("혜택값이 0보다 커야합니다.");
	                return true;
	            }
			}else if(fnChkPromoCoupon($("#promo_kind_cd").val())){        // 쿠폰/쇼핑백 쿠폰/배송비/오프라인 쿠폰
				if($("#promo_kind_cd").val() == _PR_PROMO_KIND_CD_CART_CUPN && $("#cardcomp_no").val() != ""){			// 쇼핑백 - 카드 선택시
					if ( $("#cardcomp_charge_rate").val() != undefined ){
						if( Number($("#cardcomp_charge_rate").val()) + Number($("#our_comp_charge_rate").val()) + Number($("#vend_charge_rate").val()) != varBeneVal ){
							alert("부담률의 합이 혜택값과 같지 않습니다.");
							return true;
						}
						
						if(+$("#cardcomp_charge_rate").val() > varBeneVal){
							alert("부담률은 혜택값을 넘지 않아야 합니다.");
							$("#cardcomp_charge_rate").focus();
							return true;
						}
					}
				}
				
				if ($("#issue_limit_qty_st_cd").val() != "" && $("#issue_limit_qty_st_cd").val() == "00") {
					var issueLimitCnt =  $("#tot_issue_limit_cnt").val();
					if(issueLimitCnt == "" || isNaN(issueLimitCnt) || Number(issueLimitCnt) < 1){
						alert("발급 제한수량을 입력해주세요.");
						return true;
					}
				}
				
				if($("#coupon_issue_mean_cd_sel").val() == _PR_COUPON_ISSUE_MEAN_CD_PROMOCODE){
					if($.trim($("#promocode").val()) == ""){
						alert("프로모션 코드를 입력해주세요.");
						return true;
					}
					if($("#promocode_chk").val() != _BOOLEAN_TRUE){
						alert("프로모션 코드를 인증해주세요.");
						return true;
					}
				}
				
				if($("#use_start_time").val() == ""){
					$("#use_start_time").val("0");
				}
				
				if($("#use_end_time").val() == ""){
					$("#use_end_time").val("24");
				}
	    
	    		var valChk = true;
				$("[name=aval_val1]").each(function(i){
					if(Number($("[name=aval_val1]").eq(i).val()) > Number($("[name=aval_val2]").eq(i).val()) ){
						$("[name=aval_val1]").eq(i).focus();
						valChk = false;
					}
				});
				
				if(!valChk){
					alert("적용구간 값을 확인해주세요.");
					return true;
				}
				
				if($("#use_term_divi_cd").val() == "" ){
	    			alert("사용기간 구분을 선택해주세요.");
	    			return true;
	    		} else if ($("#use_term_divi_cd").val() == _PR_USE_TERM_DIVI_CD_DAY) { // 사용일수
				    if(isEmpty($("#use_poss_aval_day")) ){
				        alert("사용일수를 입력해주세요.");
				        return true;
				    }
				} else if ($("#use_term_divi_cd").val() == _PR_USE_TERM_DIVI_CD_TERM) { // 일자 지정
				    if(isEmpty($("#use_poss_start_date")) || isEmpty($("#use_poss_end_date"))){
				        alert("사용기간을 선택해주세요.");
				        return true;
				    }
				}  
				
				if($("#bene_poli_cd").val() == _PR_BENE_POLI_CD_SAVE){
					if($("#aval_term_divi_cd").val() == "" ){
		    			alert("유효기간 구분을 선택해주세요.");
		    			return true;
		    		} else if($("#aval_term_divi_cd").val() == _PR_USE_TERM_DIVI_CD_DAY) { // 유효일수
						if(isEmpty($("#aval_day_cnt")) || +$("#aval_day_cnt").val() == 0){
		                    alert("유효일수를 입력해주세요.");
		                    return true;
		                }
					}else{
						if(isEmpty($("#aval_start_date")) || isEmpty($("#aval_end_date"))){
		                    alert("유효기간을 선택해주세요.");
		                    return true;
		                }
					}
				}
				
				$("#use_day_cd_list").val("");
				$("[name=use_day_cd_chk]").each(function(){
					if($(this).is(":checked")){
						if($("#use_day_cd_list").val()  != ""){
							$("#use_day_cd_list").val($("#use_day_cd_list").val() + ":");
						}
						$("#use_day_cd_list").val($("#use_day_cd_list").val() + $(this).val());
	                }
				});
				
				if($("#use_day_cd_list").val() == ""){
					alert("사용 요일을 선택해주세요.");
					return true;
				}
				
				if ( Number($("#bene_val").val()) <= 0 ) {
		            alert("혜택값이 0보다 커야합니다.");
		            return true;
		        }
				
				if ($("#bene_val_divi_cd_sel").val() == _PR_BENE_VAL_DIVI_CD_AMT ) {
					if(Number($("#bene_val").val()) >= Number($("#apply_limit_amt").val())){
						alert("최소구매금액이 혜택값과 같거나 작을 수 없습니다.\n(예: 혜택값 10,000원 일경우 최소구매금액이 10,000원을 초과해야함)");
						return true;
					}
	    		}
				
			}else if ($("#promo_kind_cd").val() == _PR_PROMO_KIND_CD_FREE_INTERS) {		// 무이자
	    
	            if(intersGrid.GetRowCount() == 0){
	            	alert("무이자 정보를 등록해주세요.");
	            	return true;
	            }

	            // 무이자 체크
	            if ( fnNointGridCheck("BENE_VAL_LIST") ){
	            	return false;	
	            }
	            
	            // 저장 시 일시불 미사용일 경우 할인율 0 으로 초기화 
	            if( $("#lump_dscnt_yn").val() == "N" ) {
	            	var arrObj = intersGrid.GetRows({checked:true});
	                for(var idx = 0; idx < arrObj.length; idx++){
	                    intersGrid.SetValue({row:idx, id:"LUMP_DSCNT_RATE", value:"0"});
	                }
	            }
			}else if ($("#promo_kind_cd").val() == _PR_PROMO_KIND_CD_CARD_SALE) {		// 카드할인
				var valChk = true;
				$("[name=aval_val1]").each(function(i){
					if(Number($("[name=aval_val1]").eq(i).val()) > Number($("[name=aval_val2]").eq(i).val()) ){
						$("[name=aval_val1]").eq(i).focus();
						valChk = false;
					}
				});
				
				if(!valChk){
					alert("적용구간 값을 확인해주세요.");
					return true;
				}
				if ( $("#cardcomp_charge_rate").val() != undefined ){
					if( Number($("#cardcomp_charge_rate").val()) + Number($("#our_comp_charge_rate").val()) + Number($("#vend_charge_rate").val()) != varBeneVal ){
						alert("부담률의 합이 혜택값과 같지 않습니다.");
						return true;
					}
					
					if(+$("#cardcomp_charge_rate").val() > varBeneVal){
						alert("부담률은 혜택값을 넘지 않아야 합니다.");
						$("#cardcomp_charge_rate").focus();
						return true;
					}
				}
				
				if ( Number($("#bene_val").val()) <= 0 ) {
		            alert("혜택값이 0보다 커야합니다.");
		            return true;
		        }
			}else if($("#promo_kind_cd").val() == _PR_PROMO_KIND_CD_NP_ONE){			// N+1
				var regex = /[^0-9]/;
				var nAvalVal = Number($("#aval_val1").val());
				var nBeneVal = Number($("#bene_val").val());
				if(regex.test(nAvalVal)) {
					alert("수량만 입력하셔야 합니다.");
		        	$("#aval_val1").focus();
		        	return true;
				}

				if(regex.test(nBeneVal)) {
					alert("수량만 입력하셔야 합니다.");
		        	$("#bene_val").focus();
		        	return true;
				}
				
				if(Number(nAvalVal) < Number(nBeneVal)) {
		        	alert("지급수량이 기준수량보다 많습니다.");
		        	$("#bene_val").focus();
		        	return true;
		        }
		        
		        if ( Number(nBeneVal) <= 0 ) {
		            alert("지급수량의 값이 0보다 커야합니다.");
		            return true;
		        }   
			}else if($("#promo_kind_cd").val() == _PR_PROMO_KIND_CD_EMP_SALE ||
					$("#promo_kind_cd").val() == _PR_PROMO_KIND_CD_PRICE_SALE ||
					$("#promo_kind_cd").val() == _PR_PROMO_KIND_CD_MULTI_SALE ){			// 직원할인/가격할인/다수량할인
				var valChk = true;
				//혜택값 체크
				if ( Number($("#bene_val").val()) <= 0 ) {
				    alert("혜택값이 0보다 커야합니다.");
				    return true;
				}
				
				$("[name=aval_val1]").each(function(i){
					if(Number($("[name=aval_val1]").eq(i).val()) > Number($("[name=aval_val2]").eq(i).val()) ){
						$("[name=aval_val1]").eq(i).focus();
						valChk = false;
					}
				});
				
				if(!valChk){
					alert("적용구간 값을 확인해주세요.");
					return true;
				}
			}
			
			// 할인이고 적율인 경우 - 최대할인금액은 필수
			var isMaxDscntAmtEmpty = false;
			if($("#bene_poli_cd_sel").val() == _PR_BENE_POLI_CD_DC && $("#bene_val_divi_cd_sel").val() == _PR_BENE_VAL_DIVI_CD_RATE){
				$("[name=max_dscnt_amt]").each(function(){
            		if(isEmpty($(this)) || !isNumber($(this))){
            			$(this).focus();
            			isMaxDscntAmtEmpty = true;
            		}
	            });
			}
			
			if(isMaxDscntAmtEmpty){
				alert("최대할인금액을 입력해주세요.");
            	return true;
			}
		
			var isApplyCond = true;
			var isAddApplyCond = false;
            var iApply = 0;
            $("[name=bene_val]").each(function(idx){
            	if(isApplyCond){
            		var parentBaseObj = $(this).closest("#div_promo_bene");
            		var parentAddBeneObj = $(this).closest("#tr_apply_cond");
            		
            		// 기본조건 or 마진율 조건이 존재할 경우만
            		if((parentBaseObj != undefined && parentBaseObj.css("display") == "block") || 
            				(parentAddBeneObj != undefined && parentAddBeneObj.css("display") == "block")){
            			if(!isDecimal($(this)) || ($("[name=apply_limit_amt]").length > 0 && !isNumber($("[name=apply_limit_amt]").eq(idx))) || 
                				($("[name=max_dscnt_amt]").length > 0 && !isNumber($("[name=max_dscnt_amt]").eq(idx)))){
             			    isApplyCond = false;
                		}
            		}
            		
            		if(!isAddApplyCond && parentAddBeneObj != undefined && parentAddBeneObj.css("display") == "block"){
            			isAddApplyCond = true;
            		}
            	}
            	
            	iApply++;
            });
            
            // 마진율 조건이 존재하지 않는다면 display를 위한 영역은 삭제한다.
            if(!isAddApplyCond){
            	$("#div_add_apply_bene").html("");
            }
            
            $("[name=aval_val]").each(function(){
            	var parentAddGsgrObj = $(this).closest("#div_md_gsgr_area");
                if(isApplyCond && parentAddGsgrObj != undefined && parentAddGsgrObj.css("display") == "block"){
                    if(isEmpty($(this))){
                        isApplyCond = false;
                    }
                }
            });
            
            if(!isApplyCond){
            	alert("적용요건을 등록해주세요.");
            	return true;
            }
			
		    return false;
		};
		
		// 적용조건 유효성 체크
		fnCheckApplyGrid = function(flag){
			var promo_kind_cd = $("#promo_kind_cd");
	        var isExists = false;
	        var isDup = false;
	        var commRows = commApplyGrid.GetRows();
	        var applyRows = applyGrid.GetRows();
	        var applyRowsTrue = applyGrid.GetRows({checked:true});
	        var chkExp = new Array();
	        flag = (flag == undefined) ? true : false
	        
	        if (!commApplyGrid.CheckRequired()) {
	            return true;
	        }
	        
	    	if (!applyGrid.CheckRequired()) {
	            return true;
	        }
	    	
	    	if (!applyShopGrid.CheckRequired()) {
	            return true;
	        }
	        
	    	if(!_PR_PROMO_KIND_CD_OFFLINE[promo_kind_cd.val()]){
		        if(commRows.length > 0){
		            $.each(commRows, function(idx, row) {
		            	if(row["APPLY_TYPE_CD"] == _PR_APPLY_TYPE_CD_SITE){
		                    isExists = true;
		            	}
		            	 
		            	// 신규 프로모션 등록시 or 적용조건 변경시 삭제건은 제외하고 체크
		            	if(row["APPLY_SEQ"] != null && (row["APPLY_SEQ"] == "" || row.CRUD == "D")){
		            		return;
		            	}
		                
		                commApplyGrid.SetForeground({row:row.Index, color:"0|0|0"});
		            });
		            
		            // 적용유형 중복체크
		            for(var outIdx = 0; outIdx < commRows.length ; outIdx ++){
		            	if(commRows[outIdx]["APPLY_SEQ"] != null && (commRows[outIdx]["APPLY_SEQ"] == "" || commRows[outIdx]["CRUD"] == "D" || commRows[outIdx]["USE_YN"] == "N")){
		            		continue;
		            	}
		            	
		            	for(var inIdx =0; inIdx < commRows.length ; inIdx ++){
		            		// 기존 승인요청건은 제외하고 체크
		            		if((commRows[outIdx]["UPT_REQ_NO"] != null && commRows[outIdx]["UPT_REQ_NO"] != "") ||
		            				commRows[inIdx]["UPT_REQ_NO"] != null && commRows[inIdx]["UPT_REQ_NO"] != ""){
		            			continue;
		            		}
		            		
		            		if(commRows[inIdx]["APPLY_SEQ"] != null && (commRows[inIdx]["APPLY_SEQ"] == "" || commRows[inIdx]["CRUD"] == "D")){
		            			continue;
			            	}
		            		
		            		// 중복 체크
		            		if(outIdx != inIdx && 
		            			(commRows[outIdx]["APPLY_TYPE_CD"] == commRows[inIdx]["APPLY_TYPE_CD"] && 
		            			commRows[outIdx]["APPLY_VAL"] == commRows[inIdx]["APPLY_VAL"] ) ||
		            			// 사이트일 경우 0은 전체사이트 이므로 같은 사이트가 존재할 경우 0 이 있으면 안된다
		            			(commRows[outIdx]["APPLY_TYPE_CD"] == _PR_APPLY_TYPE_CD_SITE && 
	            				commRows[outIdx]["APPLY_TYPE_CD"] == commRows[inIdx]["APPLY_TYPE_CD"] && 
	            				commRows[outIdx]["APPLY_VAL"] == "0")){
		            			
		            			// 기간내에 같은 유형이 있는지 체크
		            			if(outIdx != inIdx){
		            				isDup = true;
		            				commApplyGrid.SetForeground({row:outIdx, color:"255|0|0"});
		            			}
		            		}
		            	}
		            }
		        }
		        if(!isExists){
		            alert("적용대상을 추가해주세요.(사이트는 필수입니다.)");
		            return true;
		        }
		        
		        if(isDup){
		            alert("중복된 적용대상이 추가되어 있습니다.");
		            return true;
		        }
	    	}
	        
	        var apply_chk_yn = false;
	        var fnApplyChk = function(){
	        	var pay_appr_cd = $("#pay_appr_cd").val();
	        	var read_count = 0;
    			var delete_count = 0;
    			var create_count = 0;
    			var create_chk_count = 0;
    			var exist_yn = true;
    			$.each(applyRows, function(i, row){
    				switch(row.CRUD){
        				case "C":
        					create_count++;
        					if(row.Checked){
        						create_chk_count++;
	        				}
        					break;
        				case "R":
        					read_count++;
        					break;
        				case "D":
        					delete_count++;
        					break;
        			}
        		});
    			
    			//승인완료된 프로모션/등록된건이 있는경우/등록+체크된경우/현재 그리드 개수-등록된개수 != 삭제개수(삭제되는거체크)
    			if(pay_appr_cd == _PR_PAY_APPR_CD_REQ_APPROVAL || read_count > 0 || create_chk_count > 0 || applyRows.length - create_count != delete_count){
    				exist_yn = false;
    			}
    			
    			return exist_yn;
	        }
	        //프로모션별 적용대상 등록 체크
	        if(flag){
	        	switch(promo_kind_cd.val()){
	        	//사은품/번들
	        	case _PR_PROMO_KIND_CD_GIFT:
	        	case _PR_PROMO_KIND_CD_MULTI_SALE:
	        		if(applyRows.length == 0){
	        			apply_chk_yn = true;
	        		}else{
	        			apply_chk_yn = fnApplyChk();
	        		}
	        		
	        		break;
	        		//쿠폰/배송비/주문사은품
	        	case _PR_PROMO_KIND_CD_CUPN:
	        	case _PR_PROMO_KIND_CD_DELI_CUPN:
	        	case _PR_PROMO_KIND_CD_ORDER_GIFT:
	        		if ( sys_divi_cd == _ST_SYS_DIVI_CD_PO ){
	        			if(applyRows.length == 0){
	        				apply_chk_yn = true;
	        			}else{
	        				apply_chk_yn = fnApplyChk();
	        			}
	        		}
	        		break;
	        	}
	        }
	        
	        if ( apply_chk_yn ){
	        	alert("프로모션 적용대상을 추가 해주세요.");
        		return true;
	        }
	        
	        if(promo_kind_cd.val() == _PR_PROMO_KIND_CD_GIFT ||
            	promo_kind_cd.val() == _PR_PROMO_KIND_CD_NP_ONE ||
            	(sys_divi_cd == _ST_SYS_DIVI_CD_PO && promo_kind_cd.val() == _PR_PROMO_KIND_CD_ORDER_GIFT) ||	/*업체 주문사은품 경우*/
            	(sys_divi_cd == _ST_SYS_DIVI_CD_PO && promo_kind_cd.val() == _PR_PROMO_KIND_CD_DELI_CUPN) ||	/*업체 배송비일 경우*/
            	promo_kind_cd.val() == _PR_PROMO_KIND_CD_MULTI_SALE){
        		var isGift = false;
        		
        		$.each(applyRows, function(idx, row) {
                	if(row["APPLY_EXP_DIVI_CD"] == _PR_APPLY_EXP_DIVI_CD_APPLY &&
                		(row["APPLY_TYPE_CD"] == _PR_APPLY_TYPE_CD_GOODS || row["APPLY_TYPE_CD"] == _PR_APPLY_TYPE_CD_BRAND || row["APPLY_TYPE_CD"] == _PR_APPLY_TYPE_CD_VEND) ){
            			isGift = true;
                	}
	                applyGrid.SetForeground({row:row.Index, color:"0|0|0"});
	            });
        		if(!isGift){
	            	var msg = "적용대상을 추가해주세요.(상품/브랜드는 필수입니다.)";
	            	if ( promo_kind_cd.val() == _PR_PROMO_KIND_CD_MULTI_SALE ){
	            		msg = "적용대상을 추가해주세요.(상품은 필수입니다.)";
	            	}else if ( promo_kind_cd.val() == _PR_PROMO_KIND_CD_DELI_CUPN ){
	            		msg = "적용대상을 추가해주세요.(업체는 필수입니다.)";
	            	}
	            	alert(msg);
	            	return true;
		        }
        	}
	       
	        if(applyRows.length > 0){
	        	//연도 시즌 체크
	        	var isYearSeason = false;
	        	$.each(applyRows, function(idx, row) {
	        		if(row["APPLY_TYPE_CD"] == _PR_APPLY_TYPE_CD_YEARSEASON &&
	        			(row["APPLY_VAL1"] == "" || row["APPLY_VAL2"] == "" || row["APPLY_VAL2"] == "0" || row["APPLY_VAL3"] == "" || row["APPLY_VAL3"] == "0")){
	        			isYearSeason = true;
	        		}
	            });
	        	if(isYearSeason){
	        		alert("적용대상 연도-시즌을 확인 해주세요.");
	        		return true;
	        	}
	        	 
	            // 적용유형 중복체크 중복체크 하지않음. 20190322 속도저하문제
/*	            for(var outIdx = 0; outIdx < applyRows.length ; outIdx++){
	            	// 추가, 삭제된건 제외
	            	if( applyRows[outIdx]["USE_YN"] != null && applyRows[outIdx]["USE_YN"] == "N"	||
	            		applyRows[outIdx]["UPT_PROC_DIVI_CD"] != null && applyRows[outIdx]["UPT_PROC_DIVI_CD"] == _PR_UPT_PROC_DIVI_CD_DEL){
	            		continue;
	            	}
	                for(var inIdx = 0; inIdx < applyRows.length ; inIdx++){
	                	// 기존 승인요청건은 제외하고 체크
	            		if((applyRows[outIdx]["UPT_REQ_NO"] != null && applyRows[outIdx]["UPT_REQ_NO"] != "") 	||
            				applyRows[inIdx]["UPT_REQ_NO"] != null && applyRows[inIdx]["UPT_REQ_NO"] != "" 		||
            				applyRows[inIdx]["USE_YN"] != null && applyRows[inIdx]["USE_YN"] == "N"				||
            				applyRows[inIdx]["UPT_PROC_DIVI_CD"] != null && applyRows[inIdx]["UPT_PROC_DIVI_CD"] == _PR_UPT_PROC_DIVI_CD_DEL ||
            				outIdx == inIdx){
	            			continue;
	            		}
	            		
	                    // 중복 체크
	            		if(applyRows[outIdx]["APPLY_TYPE_CD"] == applyRows[inIdx]["APPLY_TYPE_CD"] && 
	            			applyRows[outIdx]["APPLY_VAL1"] == applyRows[inIdx]["APPLY_VAL1"] && 
	            			applyRows[outIdx]["APPLY_VAL2"] == applyRows[inIdx]["APPLY_VAL2"] && 
	            			applyRows[outIdx]["APPLY_VAL3"] == applyRows[inIdx]["APPLY_VAL3"]){
	            			
	            			// 기간내에 같은 유형이 있는지 체크
	            			if(applyRows[outIdx]["APPLY_START_DTIME"] < applyRows[inIdx]["APPLY_END_DTIME"] && 
	            				applyRows[outIdx]["APPLY_END_DTIME"] > applyRows[inIdx]["APPLY_START_DTIME"]){
	            				
	            				isDup = true;
	            				applyGrid.SetForeground({row:outIdx, color:"255|0|0"});
	            			}
	            		}
	            	}
	            }*/
	        }
            
            if(isDup){
	            alert("중복된 적용대상이 추가되어 있습니다.");
	            return true;
	        }

	        return false;
		};
		
		// 무이자 체크
		fnNointGridCheck = function( row_id ){
			// 일시불 할인율이 숫자가 아니거나 0 ~ 100 사이의 숫자가 아닐 경우 체크
            var rows = intersGrid.GetRows();
            var isDscntRate = false;
            if(rows.length > 0) {
            	$.each(rows , function (idx, row) {
            		if(row["LUMP_DSCNT_RATE"] < 0 || row["LUMP_DSCNT_RATE"] > 100 || isNaN(row["LUMP_DSCNT_RATE"])){
            			isDscntRate = true;
            		}
            	});
            }
            
            var isNum = true;
            var valueChk = true;
            
            if(rows.length > 0){
            	$.each(rows, function(idx, row) {
            		var cell_val = row["BENE_VAL_LIST"].split(",");
            		
            		if(cell_val.length > 1){
	            		for(var idx = 0; idx < cell_val.length ; idx++){
	            			if(isNaN(cell_val[idx]) || cell_val[idx] == ""){
	            				isNum = false;
	            				intersGrid.SelectCell({
	            					row: idx,
	            					id: row_id
	            				});
	            				
	            			} else if (Number(cell_val[idx]) < 2 || cell_val[idx].length > 2){
	            				valueChk = false;
	            				intersGrid.SelectCell({
	            					row: idx,
	            					id: row_id
	            				});
	            			}
	            		}
            		} else if(cell_val.length == 1) {
            			if(isNaN(row["BENE_VAL_LIST"])){
            				isNum = false;
            				intersGrid.SelectCell({
            					row: idx,
            					id: row_id
            				});
            			} else if ((Number(row["BENE_VAL_LIST"]) < 2 && row["BENE_VAL_LIST"] != "") || (row["BENE_VAL_LIST"].length > 2 && row["BENE_VAL_LIST"] != "")){
            				valueChk = false;
            				intersGrid.SelectCell({
            					row: idx,
            					id: row_id
            				});
            			}
            		}
            	});
            }
            
            if(!isNum){
            	alert("숫자가 아닌 값이 입력되었습니다.");
				return true;
            }
            
            if(!valueChk){
            	alert("무이자개월을 2 이상의 두자리 값으로 입력해주세요.");
				return true;
            }
            
            if(isDscntRate){
            	alert("일시불 할인율이 잘못입력되었습니다.");
            	return true;
            }
            return false;
		}
		
		//요일체크
		fnDayCheck = function(promoKindCd){
			if(fnChkPromoCoupon(promoKindCd)){
				var $use_day_chk = $("[name=use_day_cd_chk]");
				var day_chk_cnt = 0;
	            $("#use_day_cd_list").val("");
	            $use_day_chk.each(function(){
 	                if($(this).is(":checked")){
 	                	day_chk_cnt++;
 	                    if($("#use_day_cd_list").val()  != ""){
 	                        $("#use_day_cd_list").val($("#use_day_cd_list").val() + ":");
 	                    }
 	                    $("#use_day_cd_list").val($("#use_day_cd_list").val() + $(this).val());
 	                }
 	            });
	            
	            if ( $use_day_chk.length == day_chk_cnt ){
	            	$("#use_day_cd_list").val("ALL");
	            }
	            	
	            if($("#use_day_cd_list").val() == ""){
					alert("사용 요일을 선택해주세요.");
					return false;
				}
	            if($("#use_start_time").val() == ""){
					$("#use_start_time").val("0");
				}
				if($("#use_end_time").val() == ""){
					$("#use_end_time").val("24");
				}
				
				if ($("#issue_limit_qty_st_cd").val() != "" && $("#issue_limit_qty_st_cd").val() == "00") {
					var issueLimitCnt =  $("#tot_issue_limit_cnt").val();
					if(issueLimitCnt == "" || isNaN(issueLimitCnt) || Number(issueLimitCnt) < 1){
						alert("개인별 발급 제한수량을 입력해주세요.");
						return false;
					}
				}
	        }
			return true;
		}
		
		// 적용조건 변경사항 저장
		fnSavePromoApplyChange = function(){
			if(save_flag) return;
			
			// [2019.05.29]프로모션 적용대상 미등록 시, 알럿 노출
	    	if (!fnHasApplyGridItem("U")) {
	    		return;
	    	}
	    	
            // 적용조건그리드 유효성 체크
	        if( fnCheckApplyGrid(false) ){
	        	return;
	        }
	        
	        var commApplyGridChk = commApplyGrid.GetRows({checked:true});
	        var applyGridChk = applyGrid.GetRows({checked:true});
	        var applyShopGridChk = applyShopGrid.GetRows({checked:true});
	        var isDup = false;
	        
	        $.each(commApplyGridChk, function(idx, row) {
	        	if (row["APPLY_SEQ"] == "" &&
	        			row["APPLY_TYPE_CD"] != "" &&
	        			row["APPLY_VAL"] != "") {
	    			var param = {promo_no 	: $("#promo_no").val(),
	       						 promo_kind_cd 	: $("#promo_kind_cd").val(),
	       						 apply_type_cd		: row["APPLY_TYPE_CD"],
	       						 apply_val			: row["APPLY_VAL"]
	       						};
				
	       			var applyCnt = fnCheckDupApply(param);
	       			if(applyCnt > 0){
	       				isDup = true;
	       		      	commApplyGrid.SetForeground({row:row.Index, color:"255|0|0"});
	       			}else{
	       				commApplyGrid.SetForeground({row:row.Index, color:"0|0|0"});
	       			}
	    		}
            });
	        
	        if(isDup){
	        	alert("승인완료건과 중복된 적용건이 존재합니다.(적용유형/대상)");
	        	return;
	        }
	        
	        var goods_cnt = 0;
	        var goods_dupchk = false;
	        $.each(applyGridChk, function(idx, row) {
	        	if ( row["APPLY_TYPE_CD"] ==  _PR_APPLY_TYPE_CD_GOODS){
	        		goods_cnt++;
	        	}
	        });
	        
	        if ( goods_cnt > 30 ){
	        	goods_dupchk = true;
	        }
	        
	        $.each(applyGridChk, function(idx, row) {
	        	if ( row["UPT_PROC_DIVI_CD"] != _PR_UPT_PROC_DIVI_CD_DEL && ( ! goods_dupchk ||  row["APPLY_TYPE_CD"] != _PR_APPLY_TYPE_CD_GOODS) ){
		        	if (row["APPLY_SEQ"] == "" &&
		        			row["APPLY_TYPE_CD"] != "" &&
		        			row["APPLY_VAL"] != "" &&
		        			row["APPLY_START_DTIME"] != "" &&
		        			row["APPLY_END_DTIME"] != "") {
		    			var param = {promo_no 			: $("#promo_no").val(),
		       						 promo_kind_cd 		: $("#promo_kind_cd").val(),
		       						 apply_type_cd		: row["APPLY_TYPE_CD"],
		       						 apply_val1			: row["APPLY_VAL1"],
		       						 apply_val2			: (row["APPLY_VAL2"] == "")?"0":row["APPLY_VAL2"],
		       						 apply_val3			: (row["APPLY_VAL3"] == "")?"0":row["APPLY_VAL3"],
		       						 apply_start_dtime	: row["APPLY_START_DTIME"],
		       						 apply_end_dtime	: row["APPLY_END_DTIME"]
		       						};
					
		       			var applyCnt = fnCheckDupApply(param);
		       			if(applyCnt > 0){
		       				isDup = true;
		       				applyGrid.SetForeground({row:row.Index, color:"255|0|0"});
		       				return false;
		       			}else{
		       				applyGrid.SetForeground({row:row.Index, color:"0|0|0"});
		       			}
		    		}
	        	}
            });
	        
	        if(isDup){
	        	alert("승인완료건과 중복된 적용건이 존재합니다.(적용유형/대상/기간)");
	        	return;
	        }
	        
	        $("#issue_targ_yn").val( fnCommonApplyMemberChk() ? _BOOLEAN_TRUE : _BOOLEAN_FALSE);	//발급대상여부 체크
	        
            if(commApplyGrid.GetRows({checked : true}).length > 0 || applyGrid.GetRows({checked : true}).length > 0 || applyShopGrid.GetRows({checked : true}).length > 0){
                commApplyGrid.DoSave({
                    action : "/promo/promomgmt/registPromoApplyList.action",
                    form:["applyForm"],
                    group:[applyShopGrid, applyGrid],
                    cud:["C","U","D"],
                    params:{goods_dupchk : goods_dupchk? _BOOLEAN_TRUE:_BOOLEAN_FALSE, issue_targ_yn: $("#issue_targ_yn").val()}
                });
                save_flag = true;
            }
		};
		
		// 적용조건 중복체크
		fnCheckDupApply = function(pin){
			var applyCnt = 0;
			$.ajax({ 
                async   : false,
                dataType: "json",
                url     : "/promo/promomgmt/checkDupPromoApplyCnt.action", 
                data	: pin,
                success : function(data){
                	applyCnt = data.applyCnt;
                }
            });
			return applyCnt;
		};
		
		// 카드사 조회(등록/상세 공통사용)
		fnSearchCard = function(obj, charge_sale_yn){
			var data = {};
			if(charge_sale_yn != undefined && charge_sale_yn != null){
				data.charge_sale_yn = charge_sale_yn;
			}
			$.ajax({ 
                async   : false,
                dataType: "json",
                data 	: data,
                url     : "/promo/promomgmt/searchPyCardMgmtList.action", 
                success : function(data){
                    var cardList = data;
                    if( cardList == null || cardList == "" ){
                          return;
                    }
                    var select = (obj == undefined || obj == null) ? $("#cardcomp_no") : obj;

                    select.empty();
                    select.append("<option value=''>선택</option>");
                    for(var idx = 0; idx < cardList.length; idx++){
                    	select.append("<option value='" + cardList[idx].CARDCOMP_NO + "'>" + cardList[idx].CARDCOMP_NM + "</option>");
                    }
                }
            });
		};
		
		// input 에 숫자를 입력 하도록 체크
		fnChkNumberVal = function(chkVal, max){
	       	if(isNaN($(chkVal).val()) || $(chkVal).val() < 0 || (max != undefined && $(chkVal).val() > max)) {
	       		$(chkVal).val("0");
	       		$(chkVal).focus();
	       	}
		};
		
		// 적용제한메세지
	    fnApplyExpRemark = function(){
	    	var promo_kind_cd = $("#promo_kind_cd").val();
	    	var ar_promo_kind_cd = [];//프로모션 종류
	    	var flag = false;
	    	$.each(ar_promo_kind_cd, function(i, kind_cd){
	    		if ( promo_kind_cd == kind_cd ){
	    			flag = true;
	    		}
	    	});
	    	if ( flag ){
	    		$("#applyExpRemarkTr").show();
	    	}else{
	    		$("#applyExpRemarkTr").hide();
	    		$("#apply_exp_remark").val("");
	    	}
	    }
	    
	    // 쿠폰 발급 방식에 따른 컨트롤
		fnSetCouponIssueMeanCd = function(isInit){
			var _coupon_issue_mean_cd = $("#coupon_issue_mean_cd_sel").val();
			var cert_no_cnt = $("#cert_no_cnt");
			var promocode = $("#promocode");
			var tot_issue_qty = $("#tot_issue_qty");
			var issue_limit_qty_st_cd = $("#issue_limit_qty_st_cd");
			
			var cert_span = $("#cert_span");
			var cert_no_area = $("[name='cert_no_area']");
			var promocode_area = $("[name='promocode_area']");
			var issue_tr = $("tr#issue_tr");
			
			tot_issue_qty.attr("disabled", false);
			issue_limit_qty_st_cd.attr("disabled", false);
			cert_no_cnt.attr("class", "input readonly").attr("disabled", true).val("");
			promocode.attr("class", "input readonly").attr("disabled", true).val("");
			
			cert_span.hide();
			issue_tr.find("[name='issue_limit_qty_st_cd_td']").attr("colspan", 3);
			cert_no_area.hide();
			promocode_area.hide();
			
			if(_coupon_issue_mean_cd == _PR_COUPON_ISSUE_MEAN_CD_OFFLINE) { //오프라인
				cert_no_cnt.attr("disabled", false).attr("class", "input rt");
				cert_span.show();	//상세에서 사용
				
				issue_tr.find("[name='issue_limit_qty_st_cd_td']").removeAttr("colspan");
				cert_no_area.show();
			}
			else if(_coupon_issue_mean_cd == _PR_COUPON_ISSUE_MEAN_CD_PROMOCODE){ //프로모션코드
				promocode.attr("disabled", false).attr("class", "input").attr("readonly", false);
				issue_tr.find("[name='issue_limit_qty_st_cd_td']").removeAttr("colspan");
				$("#promocode").blur();
				if($("#promocode_bak").length > 0){
					$("#promocode").val($("#promocode_bak").val())
					$("#promocode_chk").val(_BOOLEAN_TRUE)
				}else{
					$("#promocode_chk").val(_BOOLEAN_FALSE)
				}
				promocode_area.show();
			}
			else if ( _coupon_issue_mean_cd == _PR_COUPON_ISSUE_MEAN_CD_IMMED ){ //즉시발급
				tot_issue_qty.val("").attr("disabled", true); //총발급량
				issue_limit_qty_st_cd.val("").attr("disabled", "disabled");
				fnIssueLimitQtyStCd();	// 발급수량기준
				tot_issue_limit_cnt.val("");
			}
			
	        // 쿠폰발급방식 기준 - 자동발급의 발급수량기준은 무제한/1회만 설정 가능
			var prevIssueLimitQtyStCd = $("#issue_limit_qty_st_cd").val();
        	$("#issue_limit_qty_st_cd").empty().append(varOrgIssueLimitQtyStCdSel).val(prevIssueLimitQtyStCd);
            if (_coupon_issue_mean_cd === _PR_COUPON_ISSUE_MEAN_CD_AUTO) { //자동발급
                // 쿠폰발급방식에 따른 발급수량기준 결정
                $.each($("#issue_limit_qty_st_cd").children(), function(i) {
                	if ($.inArray($(this).val(), [ "" /*무제한*/, _PR_ISSUE_LIMIT_QTY_ST_CD_ONE /*1회*/ ]) > -1) {
                		return true;
                	}
                	if ($(this).prop("selected")) {
                        $("#issue_limit_qty_st_cd > option:first").prop("selected", true);
                    }
                	$(this).remove();
                });
                // 배송비적용구분
                $.each($("#deli_cost_apply_divi_cd_sel").children(), function(i) {
                	if ($.inArray($(this).val(), [ _PR_DELI_COST_APPLY_DIVI_CD_RETURN /*반품비*/
                		                         , _PR_DELI_COST_APPLY_DIVI_CD_EXCHNG /*교환비*/ ]) > -1) {
                		return true;
                	}
                	$(this).remove();
                	if ($(this).prop("selected")) {
                        $("#deli_cost_apply_divi_cd_sel > option:first").prop("selected", true);
                        $("#deli_cost_apply_divi_cd_sel > option:first").trigger("change");
                    }
                });
            } else {
            	var prevDeliCostApplyDiviCd = $("#deli_cost_apply_divi_cd_sel").val();
            	$("#deli_cost_apply_divi_cd_sel").empty().append(varOrgDeliCostApplyDiviCdSel).val(prevDeliCostApplyDiviCd);
            }
            $("#issue_limit_qty_st_cd").trigger("change");
		};
		
		// 용도구분변경시 CS전용일때 처리
		fnExpdDiviCdSel = function(){
			// 배송비 쿠폰이 아니고 CS전용일 경우
			if ( $("#promo_kind_cd").val() != _PR_PROMO_KIND_CD_DELI_CUPN && $("#expd_divi_cd_sel").val() == _PR_EXPD_DIVI_CD_CS ){
				$("[name=bene_val]").each(function(){
			    	$(this).val("0");
			    });
				$("#cs_use_poss_yn_chk").attr("disabled", true).attr("checked", true).prop("checked", true).val(_BOOLEAN_TRUE);
			}else{
				$("#cs_use_poss_yn_chk").removeAttr("disabled").removeAttr("checked").prop("checked", false).val(_BOOLEAN_FALSE);
			}
		}
		
		// 용도구분변경시 캠페인용일때 처리
		fnCampaignSel = function(){
			if ( $("#expd_divi_cd_sel").val() == _PR_EXPD_DIVI_CD_CAMPAIGN_GEN || $("#expd_divi_cd_sel").val() == _PR_EXPD_DIVI_CD_CAMPAIGN_MKT 
					|| $("#expd_divi_cd_sel").val() == _PR_EXPD_DIVI_CD_CAMPAIGN_CRM ){
		       	var curr_row = commApplyGrid.GetRowCount();
		       	fnSetCommApplyGrid(curr_row, "", "", "");
		      	fnCommonApplyTypeVal(_PR_APPLY_TYPE_CD_SITE, curr_row);
		      	
		      	commApplyGrid.SetValue({row: curr_row, id:"APPLY_TYPE_CD", 	value: _PR_APPLY_TYPE_CD_SITE});
		      	commApplyGrid.SetEditable({row: curr_row, id: "APPLY_TYPE_CD", editable: false});
			}
		}

		//쿠폰관련 프로모션여부 확인
		fnChkPromoCoupon = function(promoKindCd){
			if(	_PR_PROMO_KIND_CD_CUPN == promoKindCd 		|| 
				_PR_PROMO_KIND_CD_CART_CUPN == promoKindCd 	|| 
				_PR_PROMO_KIND_CD_DELI_CUPN == promoKindCd 	||
				_PR_PROMO_KIND_CD_OFFLINE[promoKindCd]){
				return true;
			}else{
				return false;
			}
		};
		
		fnBeneProcMeanCardChk = function(){
			var varPromoKindCd = $("#promo_kind_cd").val();
			var varBeneProcMeanCd = $("#bene_proc_mean_cd").val();
	        //카드할인, 청구할인, 무이자, 쇼핑백쿠폰
	        if (varPromoKindCd  == _PR_PROMO_KIND_CD_CARD_SALE ||
	            varPromoKindCd  == _PR_PROMO_KIND_CD_CHARGE_SALE || 
	    		varPromoKindCd == _PR_PROMO_KIND_CD_FREE_INTERS) {
	            $("#vend_charge_rate").val("0");
	            
	            if (varPromoKindCd  == _PR_PROMO_KIND_CD_CHARGE_SALE) {
	            	
	            	$("#our_comp_charge_rate").val("0");
	            	$("#vend_charge_rate").val("0");
	            	$("#cardcomp_charge_rate").val("100");
	            	
	            	$("#our_comp_charge_rate").attr("readonly", true);
	                $("#our_comp_charge_rate").attr("class", "input readonly rt");
	            	
	            	$("#cardRateSpan").hide();
	            }else{
	            	$("#our_comp_charge_rate").val("100");
	            	$("#vend_charge_rate").val("0");
	            	$("#cardcomp_charge_rate").val("0");
	            	
	                $("#cardcomp_charge_rate").removeAttr("readonly");
	                $("#cardcomp_charge_rate").attr("class", "input rt");
	                
	            	$("#cardRateSpan").show();
	            }
	        }else{
	        	//상위 if문에서 처리하기 때문에 로딩시만 처리하도록함. hslee 2014.05.08
	        	if(varBeneProcMeanCd == ""){ 
	               	$("#our_comp_charge_rate").val("100");	 
	            	$("#vend_charge_rate").val("0");                	
	            	$("#our_comp_charge_rate").removeAttr("readonly");
	                $("#our_comp_charge_rate").attr("class", "input rt");
	            }
	            
	        	$("#cardcomp_charge_rate").val("0");
	        	
	        	$("#cardRateSpan").hide();
	        }
		}
		

	    
	    // 혜택값에 따른 율 / 금액 변환
	    fnSetMaxDscntViewChange = function(){
	    	// 금액
	    	if($("#bene_val_divi_cd_sel").val() == _PR_BENE_VAL_DIVI_CD_AMT){
			    $("[name=span_percent]").hide();
			    $("[name=span_won]").show();
			}else{ // 율
				$("[name=span_percent]").show();
				$("[name=span_won]").hide();
			}
	    };
	    
		// 반올림
	    fnBeneValRound = function (p_obj){
	    	var obj = $(p_obj);
			var id = obj.attr("id");
			var bene_val = $("#bene_val_divi_cd_sel").val();
			
			// 값이 숫자가 아닐경우 체크
			if ( isNaN(obj.val()) ){
				obj.val("0");
			}
		
			//금액일 경우
			if ( bene_val == _PR_BENE_VAL_DIVI_CD_AMT ){
				obj.val( Math.floor(obj.val()/10)*10 );
			} else if ( id != "bene_val" ) {	// 혜택값을 제외한 부분 전부
				obj.val( Math.floor(obj.val()/10)*10 );
			}
	    };
	    
	    //CS전용 체크
		fnCsCouponChk = function(){
			if($("#cs_use_poss_yn_chk").is(":checked") && $("#expd_divi_cd_sel").val() != _PR_EXPD_DIVI_CD_CS){
				return true;
			}
			return false;
		}
	    
		// 사은품 검색
		searchGiftBtn = function( obj ){
			var parentObj = $(obj).parent().parent();
	        var _promo_kind_cd = $("#promo_kind_cd").val();
	        
	        if( _promo_kind_cd == _PR_PROMO_KIND_CD_GIFT ||
	        	_promo_kind_cd == _PR_PROMO_KIND_CD_ORDER_GIFT){
	            fnGiftListPop({
		            	param:{multi_yn: _BOOLEAN_FALSE,
		            		   gift_type_cd : _PV_GIFT_TYPE_CD_PROMO,
		            		   type_fix_yn : _BOOLEAN_TRUE
	            	},
	                callback:function(pin){
	                    pin = pin.data;
	                    var chk = false;
	                    
	                    $.each( $("[name=gift_mgmt_no]"), function(){
	                    	if ( $(this).val() == pin[0]["GIFT_MGMT_NO"]){
	                    		chk = true;
	                    	}
	                    });
	                    
	                    if ( chk ){
	                    	alert("이미 선택된 사은품입니다.");
	                    }else{
		                    $("input[id=gift_mgmt_nm]", parentObj).val(pin[0]["GIFT_MGMT_NM"]);
		                    $("input[id=gift_mgmt_no]", parentObj).val(pin[0]["GIFT_MGMT_NO"]);
	                    }
	                }
	            });
	        }            
		}
	    
	    /********************************************************** 적용유형 그리드 **********************************************************/

		fnCommonApplyTypeVal = function(applyTypeCdVal, curr_row) {
			commApplyGrid.SetValue({id : "APPLY_NM", row : curr_row, value :""});
			commApplyGrid.SetValue({id : "APPLY_VAL", row : curr_row, value :""});
			
			// 사이트/임직원그룹은 콤보
		    if (applyTypeCdVal == _PR_APPLY_TYPE_CD_SITE || applyTypeCdVal == _PR_APPLY_TYPE_CD_STAFF) {
		    	var callback = function(combo){
		    		commApplyGrid.ChangeCellType({
	                    row:curr_row,
	                    id: "APPLY_NM",
	                    type: "C"
	                });
		    		commApplyGrid.CreateCombo({
                        row:curr_row,
                        id:"APPLY_NM",              
                        combo:combo
                    });
		    		
		    		commApplyGrid.SetEditable({row:curr_row, id:"APPLY_NM", editable:true});
		    	}
		    	//사이트
		        if(applyTypeCdVal == _PR_APPLY_TYPE_CD_SITE){
		        	$.ajax({
		                url: "/system/site/searchSiteList.action",
		                dataType: "json",
		                data: {user_id : _userId},
		                success : function(data) {
		                	var combo = {
		                		//'0' : '전체사이트'
		                	};
		                    for(var idx = 0; idx < data.length; idx++){
		                    	combo[data[idx].site_no] = data[idx].site_nm;
		                    }
		                    callback(combo);		
		                    
		                    
		                    if ( $("#expd_divi_cd_sel").val() == _PR_EXPD_DIVI_CD_CAMPAIGN_GEN || $("#expd_divi_cd_sel").val() == _PR_EXPD_DIVI_CD_CAMPAIGN_MKT 
		                    		|| $("#expd_divi_cd_sel").val() == _PR_EXPD_DIVI_CD_CAMPAIGN_CRM ){
		                    	if(data[0] != null && data[0].site_no != ""){
	                                commApplyGrid.SetValue({row:curr_row, id:"APPLY_NM", value: data[0].site_no});
	                                commApplyGrid.SetEditable({row: curr_row, id: "APPLY_NM", editable: false});
	                                commApplyGrid.SetValue({row:curr_row, id:"APPLY_VAL", value: data[0].site_no});
	                            }
		                    }
		                }
		            });
		        }//임직원그룹
			    else if(applyTypeCdVal == _PR_APPLY_TYPE_CD_STAFF){
			    	$.ajax({
		                url: "/system/code/searchStCommCdDtlList.action",
		                dataType: "json",
		                data:{method:"json", comm_cd:"MB0039"},
		                success : function(data) {
			                var object = data;
			                var combo = {};
		                    $.each(object , function (idx , obj){
		                        combo[obj.comm_dtl_cd] = obj.cd_nm;
		                    });
		                    callback(combo);	
		                }
		            }); 
		        }
		        
		    }// 채널/회원등급/상위가상업체
		    else if (applyTypeCdVal == _PR_APPLY_TYPE_CD_CHANNEL || applyTypeCdVal == _PR_APPLY_TYPE_CD_MEMBERGRADE || applyTypeCdVal == _PR_APPLY_TYPE_CD_UPPERVEND ){
		    	commApplyGrid.ChangeCellType({
		            row:curr_row,
		            id: "APPLY_NM",
		            type: "T"
		        });
		    	
		    	//채널
		    	if ( applyTypeCdVal == _PR_APPLY_TYPE_CD_CHANNEL ){
		    		fnChnlListPopForForm({
		    			callback:function(pin){
		    				pin = pin.data;
		    				
		    				for(var idx = 0; idx < pin.length; idx++){
		    					commApplyGrid.SetValue({row:curr_row , id:"APPLY_NM", value:pin[idx]["CHNL_DTL_TYPE_NM"]});
		    					commApplyGrid.SetValue({row:curr_row , id:"APPLY_VAL", value:pin[idx]["CHNL_NO"]});
		    				}
		    			}
		    		});
		    	}//회원등급
		        else if(applyTypeCdVal == _PR_APPLY_TYPE_CD_MEMBERGRADE){
		        	var addCount = 0;
		        	fnMbrGradeListPop({params: {"multi_yn": "Y"},
		    			callback:function(pin){
		    				pin = pin.data;
		    				
		    				for(var idx = 0; idx < pin.length; idx++){
		    					var apply_nm = (pin[idx]["CLUB_NM"] != "기본" ? "["+pin[idx]["CLUB_NM"] +"] " : "") + pin[idx]["MBR_GRADE_NM"];
		    					var grade_no = pin[idx]["MBR_GRADE_NO"];
		    					if(addCount == 0){
		    						commApplyGrid.SetValue({row:curr_row , id:"APPLY_NM", value: apply_nm});
		    						commApplyGrid.SetValue({row:curr_row , id:"APPLY_VAL", value: grade_no});
		    						addCount++;
		    					} else {
		    						var createRow = commApplyGrid.GetRowCount();
		    						fnSetCommApplyGrid(createRow, apply_nm, grade_no, _PR_APPLY_TYPE_CD_MEMBERGRADE, false);
		    						var row = commApplyGrid.GetRow({row : createRow});
		    						if(row["PAY_APPR_CD"] != null){
		    							commApplyGrid.SetValue({row:createRow , id:"UPT_PROC_DIVI_CD", value: _PR_UPT_PROC_DIVI_CD_ADD});
		                    		}
		    					}
		    				}
		    			}
		    		});
		    	}// 상위 가상업체
		    	else if(applyTypeCdVal == _PR_APPLY_TYPE_CD_UPPERVEND){
		    		var grp_store_cd = _PV_VEND_TYPE_CD_GRP2_STORE;		// 점포
		    		fnUpperVendListPop({params:{param:{vend_divi_cd:_PV_VEND_DIVI_CD_GOODS_SUPPLY, resd_yn:"Y" /*,grp_store_cd:grp_store_cd*/}},
		    			callback:function(pin){
		    				pin = pin.data;
		    				
		    				for(var idx = 0; idx < pin.length; idx++){
		    					commApplyGrid.SetValue({row:curr_row , id:"APPLY_NM", value:pin[idx]["LOW_VEND_NM"]});
		    					commApplyGrid.SetValue({row:curr_row , id:"APPLY_VAL", value:pin[idx]["VIR_VEND_NO"]});
		    				}
		    			}
		    		});
		    	}
		    }//회원그룹
		    else if(applyTypeCdVal == _PR_APPLY_TYPE_CD_MEMBERGROUP){
	        	commApplyGrid.ChangeCellType({
                    row:curr_row,
                    id: "APPLY_NM",
                    type: "T"
                });
	        	commApplyGrid.SetEditable({row:curr_row, id:"APPLY_NM", editable:true});
	        }
		}
		
		
		// 적용유형선택시 
		fnApplyTypeVal = function(applyTypeCdVal, curr_row, todayDate) {
			applyGrid.SetValue({id : "APPLY_NM1", row : curr_row, value :""});
			applyGrid.SetValue({id : "APPLY_NM2", row : curr_row, value :""});
			applyGrid.SetValue({id : "APPLY_NM3", row : curr_row, value :""});
			applyGrid.SetValue({id : "APPLY_VAL1", row : curr_row, value :""});
			applyGrid.SetValue({id : "APPLY_VAL2", row : curr_row, value :"0"});
			applyGrid.SetValue({id : "APPLY_VAL3", row : curr_row, value :"0"});
			applyGrid.SetEditable({id:"APPLY_NM2", row: curr_row, editable: false});
			
    		applyGrid.ChangeCellType({
	            row:curr_row,
	            id: "APPLY_NM1",
	            type: "T"
	        });
    		applyGrid.ChangeCellType({
	            row:curr_row,
	            id: "APPLY_NM2",
	            type: "T"
	        });
    		
    		var addCount = 0;
    		
    		// 전시카테고리
		    if(applyTypeCdVal == _PR_APPLY_TYPE_CD_DISPCTG){
	            fnDispListPop({params:{multi_yn : "Y", level_chk : "Y", leaf_yn:"N", shop_type_cd:_DS_CTG_SHOP_TYPE_CD_DISP_CTG_GRP, level_no:"4"},
	                callback:function(pin){
	                    pin = pin.data;
	                    
	                    for(var idx = 0; idx < pin.length; idx++){
	                        var varDisp_nm = pin[idx]["DISP_CTG_NM"].split(">");
	                        var varDisp_no = pin[idx]["DISP_CTG_NO_PATH"].split(">");
	                        
	                    	if(addCount == 0){
	                            applyGrid.SetValue({row:curr_row , id:"APPLY_NM1", value:varDisp_nm[0]});
	                            applyGrid.SetValue({row:curr_row , id:"APPLY_VAL1", value:varDisp_no[0]});
	                            
	                            if(varDisp_nm.length >= 2){
	                                applyGrid.SetValue({row:curr_row, id:"APPLY_NM2", value:varDisp_nm[1]});
	                                applyGrid.SetValue({row:curr_row, id:"APPLY_VAL2", value:varDisp_no[1]});
	                            }
	                            if(varDisp_nm.length >= 3){
	                                applyGrid.SetValue({row:curr_row, id:"APPLY_NM3", value:varDisp_nm[2]});
	                                applyGrid.SetValue({row:curr_row, id:"APPLY_VAL3", value:varDisp_no[2]});
	                            }
	                            addCount++;
	                    	} else {
								var createRow = applyGrid.GetRowCount();
								var firstRow = applyGrid.GetRow({row : curr_row});
								
								fnSetApplyGrid(createRow, varDisp_nm[0], varDisp_no[0], _PR_APPLY_TYPE_CD_DISPCTG, todayDate);
								applyGrid.SetValue({row: createRow, id:"APPLY_EXP_DIVI_CD", value: firstRow["APPLY_EXP_DIVI_CD"]});
	                    		
	                    		if(varDisp_nm.length >= 2){
	                                applyGrid.SetValue({row:createRow, id:"APPLY_NM2", value:varDisp_nm[1]});
	                                applyGrid.SetValue({row:createRow, id:"APPLY_VAL2", value:varDisp_no[1]});
	                            }
	                    		if(varDisp_nm.length >= 3){
	                                applyGrid.SetValue({row:createRow, id:"APPLY_NM3", value:varDisp_nm[2]});
	                                applyGrid.SetValue({row:createRow, id:"APPLY_VAL3", value:varDisp_no[2]});
	                            }
	                    		
	                    		var row = applyGrid.GetRow({row : createRow});
	                    		if(row["PAY_APPR_CD"] != null){
	                    			applyGrid.SetValue({row:createRow, id:"PAY_APPR_CD", value: firstRow["PAY_APPR_CD"]});
		                            applyGrid.SetValue({row:createRow, id:"UPT_PROC_DIVI_CD", value: firstRow["UPT_PROC_DIVI_CD"]});
	                    		}
	                    	}
	                    }
	                }
	            });
	        }// 기획전
		    else if(applyTypeCdVal == _PR_APPLY_TYPE_CD_PLANSHOP){
	            fnDispListPop({params:{multi_yn : "Y" , leaf_yn:"N", shop_type_cd:_DS_CTG_SHOP_TYPE_CD_SHOP_GRP, depth_no:"2"},
	                callback:function(pin){
	                    pin = pin.data;
	                    
	                    for(var idx = 0; idx < pin.length; idx++){
	                        var varDisp_nm = pin[idx]["DISP_CTG_NM"].split(">");
	                        var varDisp_no = pin[idx]["DISP_CTG_NO_PATH"].split(">");
	                        
	                    	if(addCount == 0){
	                            applyGrid.SetValue({row:curr_row , id:"APPLY_NM1", value:varDisp_nm[0]});
	                            applyGrid.SetValue({row:curr_row , id:"APPLY_VAL1", value:varDisp_no[0]});
	                            
	                            if(varDisp_nm.length >= 2){
	                                applyGrid.SetValue({row:curr_row, id:"APPLY_NM2", value:varDisp_nm[1]});
	                                applyGrid.SetValue({row:curr_row, id:"APPLY_VAL2", value:varDisp_no[1]});
	                            }
	                            addCount++;
	                    	} else {
	                    		var createRow = applyGrid.GetRowCount();
	                    		var firstRow = applyGrid.GetRow({row : curr_row});
	                    		
	                    		fnSetApplyGrid(createRow, varDisp_nm[0], varDisp_no[0], _PR_APPLY_TYPE_CD_PLANSHOP, todayDate);
	                    		applyGrid.SetValue({row: createRow, id:"APPLY_EXP_DIVI_CD", value: firstRow["APPLY_EXP_DIVI_CD"]});
	                    		
	                    		if(varDisp_nm.length >= 2){
	                                applyGrid.SetValue({row:createRow, id:"APPLY_NM2", value:varDisp_nm[1]});
	                                applyGrid.SetValue({row:createRow, id:"APPLY_VAL2", value:varDisp_no[1]});
	                            }
	                    		
	                    		var row = applyGrid.GetRow({row : createRow});
	                    		if(row["PAY_APPR_CD"] != null){
	                    			applyGrid.SetValue({row:createRow, id:"PAY_APPR_CD", value: firstRow["PAY_APPR_CD"]});
		                            applyGrid.SetValue({row:createRow, id:"UPT_PROC_DIVI_CD", value: firstRow["UPT_PROC_DIVI_CD"]});
	                    		}
	                    	}
	                    }
	                }
	            });
	        }// 상품
		    else if(applyTypeCdVal == _PR_APPLY_TYPE_CD_GOODS){
		    	var promo_kind_cd = $("#promo_kind_cd").val();
	            var param = {
	            		multi_yn : "Y",
	            		promo_apply_yn: "Y"
		            }
	           
	            switch(promo_kind_cd){
	            	case _PR_PROMO_KIND_CD_CUPN:
	            		param.goods_type_cd_list = "101,201,204"; //일반/세트/다중구매
	            		break;
	            	case _PR_PROMO_KIND_CD_GIFT:
	            		param.goods_type_cd_list = "101"; // 사은품 일반상품 가능
	            		param.fix_goods_type_cd = _PV_GOODS_TYPE_CD_GENERAL;
	            		if ( sys_divi_cd == _ST_SYS_DIVI_CD_BO ){
	            			param.self_yn = _BOOLEAN_TRUE;
	            		}
	            		break;
	            	case _PR_PROMO_KIND_CD_MULTI_SALE:
	            		param.goods_type_cd_list = "101"; //일반
	            		break;
	            }
	            
	            fnGoodsListPop({params:param,
	                callback:function(pin){
	                    pin = pin.data;
	                    for(var idx = 0; idx < pin.length; idx++){
	                    	if(addCount == 0){
	                        	applyGrid.SetValue({row:curr_row , id:"APPLY_NM1", value: "[" + pin[idx]["GOODS_NO"]+"]"+pin[idx]["GOODS_NM"] });
	                            applyGrid.SetValue({row:curr_row , id:"APPLY_VAL1", value:pin[idx]["GOODS_NO"]});
	                        	addCount++;
	                    	} else {
	                    		var createRow = applyGrid.GetRowCount();
	                    		var firstRow = applyGrid.GetRow({row : curr_row});
	                    		
	                    		fnSetApplyGrid(createRow, "[" + pin[idx]["GOODS_NO"]+"]"+pin[idx]["GOODS_NM"], pin[idx]["GOODS_NO"], _PR_APPLY_TYPE_CD_GOODS, todayDate);
	                            applyGrid.SetValue({row: createRow, id:"APPLY_EXP_DIVI_CD", value: firstRow["APPLY_EXP_DIVI_CD"]});
	                    		
	                            var row = applyGrid.GetRow({row : createRow });
	                    		if(row["PAY_APPR_CD"] != null){
	                    			applyGrid.SetValue({row: createRow, id:"PAY_APPR_CD", value: firstRow["PAY_APPR_CD"]});
		                            applyGrid.SetValue({row: createRow, id:"UPT_PROC_DIVI_CD", value: firstRow["UPT_PROC_DIVI_CD"]});
	                    		}
	                    	}
	                    }
	                }
	            });
	        }// 가상업체
		    else if(applyTypeCdVal == _PR_APPLY_TYPE_CD_VEND){
	            fnLowVendListPop({param :{vend_divi_cd:_PV_VEND_DIVI_CD_GOODS_SUPPLY, resd_yn:"N", multi_yn:"Y"},
	                callback:function(pin){
	                    pin = pin.data;
	                    for(var idx = 0; idx < pin.length; idx++){
	                    	if(addCount == 0){		                    		
	                            applyGrid.SetValue({row:curr_row , id:"APPLY_NM1", value: "[" + pin[idx]["LOW_VEND_NM"]+"]"+pin[idx]["VEND_NM"]});
	                            applyGrid.SetValue({row:curr_row , id:"APPLY_VAL1", value:pin[idx]["VIR_VEND_NO"]});
	                    		addCount++;
	                    	} else {
	                    		var createRow = applyGrid.GetRowCount();
	                    		var firstRow = applyGrid.GetRow({row : curr_row});
	                    		
	                    		fnSetApplyGrid(createRow, "[" + pin[idx]["LOW_VEND_NM"]+"]"+pin[idx]["VEND_NM"], pin[idx]["VIR_VEND_NO"], _PR_APPLY_TYPE_CD_VEND, todayDate);
	                    		applyGrid.SetValue({row: createRow, id:"APPLY_EXP_DIVI_CD", value: firstRow["APPLY_EXP_DIVI_CD"]});
	                    		
	                    		var row = applyGrid.GetRow({row : createRow});
	                    		if(row["PAY_APPR_CD"] != null){
	                    			applyGrid.SetValue({row: createRow, id:"PAY_APPR_CD", value: firstRow["PAY_APPR_CD"]});
		                            applyGrid.SetValue({row: createRow, id:"UPT_PROC_DIVI_CD", value: firstRow["UPT_PROC_DIVI_CD"]});
	                    		}
	                    	}
	                    }
	                }
	            });
	        }// md상품군
		    else if(applyTypeCdVal == _PR_APPLY_TYPE_CD_STDGOODS){
	        	fnStdGsgrListPop({params:{leaf_yn:"N", allYn:"Y", level:"2"},
	                callback:function(pin){
	                    pin = pin.data;
	                    
	                    for(var idx = 0; idx < pin.length; idx++){
	                        var varMd_gsgr_nm = pin[idx]["STD_GSGR_FULL_PATH"].split(">");
	                        var varMd_gsgr_no = pin[idx]["STD_GSGR_FULL_PATH_NO"].split(">");
	                        
	                        applyGrid.SetValue({row:curr_row , id:"APPLY_NM1", value:varMd_gsgr_nm[0]});
	                        applyGrid.SetValue({row:curr_row , id:"APPLY_VAL1", value:varMd_gsgr_no[0]});
	                        
	                        if(varMd_gsgr_no.length >= 2){ 
	                            applyGrid.SetValue({row:curr_row, id:"APPLY_NM2", value:varMd_gsgr_nm[1]});
	                            applyGrid.SetValue({row:curr_row, id:"APPLY_VAL2", value:varMd_gsgr_no[1]});
	                        }
	                    }
	                }
	            });
	        }// 브랜드
		    else if(applyTypeCdVal == _PR_APPLY_TYPE_CD_BRAND){
		    	var promo_kind_cd = $("#promo_kind_cd").val();
		    	var param = {
	            		multi_yn : "Y"
		            }
	           
		    	if(promo_kind_cd == _PR_PROMO_KIND_CD_GIFT){
		    		if ( sys_divi_cd == _ST_SYS_DIVI_CD_BO ){
            			param.ownBrandYn = _BOOLEAN_TRUE;
            		}
		    	}
		    	
	    		fnBrandListPopForForm({params:param,
	                callback:function(pin){
	                	pin = pin.data;
	                    for(var idx = 0; idx < pin.length; idx++){
	                    	if(addCount == 0){
	                    		applyGrid.SetValue({row:curr_row , id:"APPLY_NM1", value:pin[idx]["BRAND_NM"]});
		                        applyGrid.SetValue({row:curr_row , id:"APPLY_VAL1", value:pin[idx]["BRAND_NO"]});
	                        	addCount++;
	                    	} else {
	                    		var createRow = applyGrid.GetRowCount();
	                    		var firstRow = applyGrid.GetRow({row : curr_row});
	                    		
	                            fnSetApplyGrid(createRow, pin[idx]["BRAND_NM"], pin[idx]["BRAND_NO"], _PR_APPLY_TYPE_CD_BRAND, todayDate);
	                            applyGrid.SetValue({row: createRow, id:"APPLY_EXP_DIVI_CD", value: firstRow["APPLY_EXP_DIVI_CD"]});	//적용제외 설정
	                    		
	                            var row = applyGrid.GetRow({row : createRow});
	                    		if(row["PAY_APPR_CD"] != null){
	                    			applyGrid.SetValue({row: createRow, id:"PAY_APPR_CD", value: firstRow["PAY_APPR_CD"]});
		                            applyGrid.SetValue({row: createRow, id:"UPT_PROC_DIVI_CD", value: firstRow["UPT_PROC_DIVI_CD"]});
	                    		}
	                    	}
	                    }
	                }
	            });
	        }// 연수/시즌
		    else if(applyTypeCdVal == _PR_APPLY_TYPE_CD_YEARSEASON){
	    		fnSetYearSeasonCombo(curr_row, true, true);
	        }
		};
		
		//연수 시즌일때 콤보박스 생성
		fnSetYearSeasonCombo = function(rownumber, edit, default_yn){
        	applyGrid.CreateCombo({
                row: rownumber,
                id:"APPLY_NM1",
                combo: applyYear
            });
            applyGrid.CreateCombo({
                row: rownumber,
                id:"APPLY_NM2",
                combo: applySeason
            });
        	applyGrid.ChangeCellType({
                row: rownumber,
                id: "APPLY_NM1",
                type: "C"
            });
        	applyGrid.ChangeCellType({
                row: rownumber,
                id: "APPLY_NM2",
                type: "C"
            });
        	applyGrid.ChangeCellType({
                row: rownumber,
                id: "APPLY_NM3",
                type: "T"
            });
	        
        	applyGrid.SetEditable({row: rownumber, id:"APPLY_NM1", editable: edit});
            applyGrid.SetEditable({row: rownumber, id:"APPLY_NM2", editable: edit});
            if(default_yn){
	            applyGrid.SetValue({row: rownumber, id:"APPLY_NM1", value: "선택"});
	            applyGrid.SetValue({row: rownumber, id:"APPLY_NM2", value: "선택"});
	            applyGrid.SetValue({row: rownumber, id:"APPLY_NM3", value: "브랜드선택"});
            }
		}
		
		fnSetYearSeasonApplyBrand = function(curr_row){
			var addCount = 0;
			fnBrandListPopForForm({params:{multi_yn:"Y"},
                callback:function(pin){
                	pin = pin.data;
                    for(var idx = 0; idx < pin.length; idx++){
                    	if(addCount == 0){
                    		applyGrid.SetValue({row:curr_row , id:"APPLY_NM3", value:pin[idx]["BRAND_NM"]});
	                        applyGrid.SetValue({row:curr_row , id:"APPLY_VAL3", value:pin[idx]["BRAND_NO"]});
                        	addCount++;
                    	} else {
                    		var createRow = applyGrid.GetRowCount();
                    		var firstRow = applyGrid.GetRow({row : curr_row});
                    		
                            fnSetApplyGrid(createRow, "", "", _PR_APPLY_TYPE_CD_YEARSEASON, firstRow["APPLY_START_DTIME"]);
                            fnSetYearSeasonCombo(createRow, true);
                            applyGrid.SetValue({row: createRow, id:"APPLY_NM1", value: firstRow["APPLY_NM1"]});		//연수
                            applyGrid.SetValue({row: createRow, id:"APPLY_NM2", value: firstRow["APPLY_NM2"]});		//시즌
                            applyGrid.SetValue({row: createRow, id:"APPLY_NM3", value: pin[idx]["BRAND_NM"]});		//브랜드
                            applyGrid.SetValue({row: createRow, id:"APPLY_VAL1", value: firstRow["APPLY_VAL1"]});	//연수
                            applyGrid.SetValue({row: createRow, id:"APPLY_VAL2", value: firstRow["APPLY_VAL2"]});	//시즌
                            applyGrid.SetValue({row: createRow, id:"APPLY_VAL3", value: pin[idx]["BRAND_NO"]});		//브랜드
                            applyGrid.SetValue({row: createRow, id:"APPLY_EXP_DIVI_CD", value: firstRow["APPLY_EXP_DIVI_CD"]});	//적용제외 설정
                    		
                            var row = applyGrid.GetRow({row : createRow});
                    		if(row["PAY_APPR_CD"] != null){
                    			applyGrid.SetValue({row: createRow, id:"PAY_APPR_CD", value: firstRow["PAY_APPR_CD"]});
	                            applyGrid.SetValue({row: createRow, id:"UPT_PROC_DIVI_CD", value: firstRow["UPT_PROC_DIVI_CD"]});
                    		}
                    	}
                    }
                }
            });
		}
		
		//매장
		fnApplyShopPop = function(curr_row, editYn, callback){
			var row_num = curr_row;
			var addCount = 0;
			fnStoreListPop({params:{multi_yn:"Y"},
                callback:function(pin){
                	pin = pin.data;
                    for(var idx = 0; idx < pin.length; idx++){
                    	if(addCount == 0 && editYn == true){
                    		applyShopGrid.SetValue({row:row_num , id:"STORE_NO", value:pin[idx]["ERP_SHOP_CD"]});
                    		applyShopGrid.SetValue({row:row_num , id:"STORE_NM", value:pin[idx]["STORE_NM"]});
                    		if($.type(callback) == "function"){
                        		callback(row_num);
                        	}
                    	}else{
                    		applyShopGrid.AddRow({
                    			data: {
                    				STORE_NO: pin[idx]["ERP_SHOP_CD"],
                    				STORE_NM: pin[idx]["STORE_NM"]
                    			},
                    			row: row_num
                    		});
                    		if($.type(callback) == "function"){
                        		callback(row_num);
                        	}
                    	}
                    	row_num++;
                    	addCount++;
                    }
                }
            });
		}
		
		
		// 적용대상 추가(등록,상세 공통사용)
        fnSetApplyGrid = function(curr_row, nm, val, type_cd, todayDate){
        	var tDate = todayDate;
        	
        	if ( todayDate == undefined || todayDate >$("#disp_apply_end_dtime").val() ){
        		tDate = $("#disp_apply_start_dtime").val();
        	}
        	
        	applyGrid.AddRow({
                data: {
                	APPLY_EXP_DIVI_CD: _PR_APPLY_EXP_DIVI_CD_APPLY,
                    APPLY_START_DTIME: tDate,
                    APPLY_END_DTIME: $("#disp_apply_end_dtime").val(),
                   	APPLY_NM1 : nm,
                   	APPLY_VAL1 : val,
                   	APPLY_VAL2 : "0",
                   	APPLY_VAL3 : "0",
                    APPLY_TYPE_CD: type_cd
                },
                row: curr_row
            });
        	
            applyGrid.SetEditable({row:curr_row, id:"APPLY_NM1", editable:false});
            applyGrid.SetEditable({row:curr_row, id:"APPLY_NM2", editable:false});
            applyGrid.SetEditable({row:curr_row, id:"APPLY_NM3", editable:false}); 
        };
		
		// 공통적용대상 추가(등록,상세 공통사용)
        fnSetCommApplyGrid = function(curr_row, nm, val, type_cd, varEditable){
        	commApplyGrid.AddRow({
                data: {
                	APPLY_EXP_DIVI_CD: _PR_APPLY_EXP_DIVI_CD_APPLY,
                   	APPLY_NM : nm,
                   	APPLY_VAL : val,
                    APPLY_TYPE_CD: type_cd
                },
                row: curr_row
            });
            
        	if(varEditable != undefined){
        		commApplyGrid.SetEditable({row:curr_row, id:"APPLY_NM", editable:varEditable});
        	}else{
        		commApplyGrid.SetEditable({row:curr_row, id:"APPLY_NM", editable:false});	
        	}
        };
	});
	
    //그리드 행추가
    addGridRow = function(gridObject){
 		gridObject.AddRow({row:gridObject.GetRowCount()});
 	}
 	
    //그리드 행삭제
 	deleteGridRow = function(gridObject, use_yn){
 		gridObject.DeleteCreateRows();
 		
 		if(use_yn == _BOOLEAN_TRUE){
 			var rows = gridObject.GetRows({checked:true});
 	    	
 	    	$.each(rows, function(idx, row){
 	    		gridObject.SetValue({
 	    			row: row.Index,
 	    			id:"USE_YN",
 	    			value: _BOOLEAN_FALSE
 	    		});
 	    	});
 		}
 	}
 	
	// Grid CRUD 변경
    fnChangeGridCrud = function(varGrid, varCrud){
		$.each(varGrid.GetRows(), function(idx, row){
			varGrid.ChangeCRUD({				
				row: idx,
				crud: varCrud
			});	
		});
    };
    
    
	/********************************************************** 프로모션 공통 팝업 **********************************************************/
	
	/**
     * 기본제한확인
     */
	fnsearchLimitListPop = function(){
		popup({
			url : "/promo/popup/forward.PromoBaseLimitListPop.action",
            winname : "searchLimitListPop",
            title : "기본제한확인 팝업",
            type : "xml",
            height : "450px",
            scrollbars : true,
            autoresize : false
        });	
	};
	
	/**
	 * 프로모션 등록
	 */
	fnPromoInsPop = function(pin) {
		var varUrl = "/promo/promomgmt/initPromoIns.action";
		
		if(pin != undefined && pin.move != undefined){
			var varParam = "";
			
			$.each(pin, function(name, value) {
				if(name == "move"){
					return;
				}
				varParam += ((varParam != "")?"&":"?") + escape(name) + "=" + encodeURI(value);
			});
			
			window.location.href = varUrl + varParam;
		}else{
	        var strTitle = "프로모션 등록";
	
	        popup({
	            url : varUrl,
	            winname : "PromoIns_pop",
	            title : strTitle,
	            width : "1150",
	            height : "800",
	            scrollbars : true,
	            autoresize : false
	        });
		}
    };
	
	/**
	 * 프로모션 상세 팝업 
	 */
	fnPromoViewPop = function(pin){
		popup({
            url : "/promo/promomgmt/initPromoView.action",
			winname : "PromoView_pop",
			title : "프로모션상세",
			width : "1150",
            height : "800",
			scrollbars :true,
			autoresize :false,
			form:"srchForm",
			params: pin
		});
	};
	
	/**
	 * 쿠폰발행 팝업 
	 */
	fnCouponPop = function(pin){
		popup({
			url:"/promo/popup/forward.PromoCouponPop.action",
			winname : "PromoCoupon_pop",
			title :"쿠폰 발행",
			width :"650",
			height :"500",
			scrollbars :false,
			autoresize :false,
			params: pin
		});
	};
	
	/**
	 * 인증번호 발급관리 팝업 
	 */
	fnCertNoMgmtPop = function(pin){
		popup({
			url:"/promo/promomgmt/initPrCertNoPop.action",
			winname : "CertNoMgmtList_pop",
			title :"인증번호 발급관리",
			width :"800",
			height :"420",
			scrollbars :false,
			autoresize :true,
			params: pin
		});
	};
	
	/**
	 * 적용조건변경팝업
	 */
	fnApplyChangePop = function(pin){
		popup({
			url:"/promo/popup/forward.PromoApplyChangePop.action",
			winname : "PromoApplyChange_pop",
			title :"적용조건변경",
			width :"890",
			height :"600",
			scrollbars :false,
			autoresize :true,
			params: pin
		});
	};

	
})(jQuery);