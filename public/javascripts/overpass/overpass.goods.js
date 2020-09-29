(function($){
	
	$(document).ready(function () {
		
		// Enter Key
		$("div[id=search_off]").bind({
	        keypress : function(event){
	        	if ( event.which == 13 && event.srcElement.tagName != "TEXTAREA" ) {
		        	event.preventDefault();
		        	$("#srchBtn").click();
	        	}
			}
	    });
		
		$("#goods_no_list").bind({
			keyup:function(event){
	        	if($(this).val() != ""){
	        		$("#goods_no_list_chk").attr("checked", true);
	        	}else{
	        		$("#goods_no_list_chk").attr("checked", false);
	        	}
			}
	    });
		
		//숫자만 입력가능
		$("[role=num]").keyup(function(){
			var str = $(this);
			str.val(str.val().replace(/[^0-9]/gi,''));
		});
		
		
		/**
		 * 선택값에 따른 셀렉트박스 제어
		 * param: 공통커코드, 제어할셀렉트 박스 , 그룹값1~5
		 */
		fnCreaetSelectBox = function(p){
			p = $.extend({
				comm_cd : null, 
				sel_id : null, 
				grp_cd1: null, 
				grp_cd2 : null, 
				grp_cd3 : null, 
				grp_cd4: null,
				grp_cd5: null,
				method:"json",
				default_text:"전체",
				default_yn:"Y"
			}, p || {});
			$("#"+p.sel_id + " option").remove();
			$.ajax({
                url: "/system/code/searchStCommCdDtlList.action",
                dataType: "json",            
                data:p,
                async: false,
                success : function(data) {
                	if(p.default_yn == "Y"){
                		$("#"+p.sel_id).append("<option value=''>"+ p.default_text +"</option>");
                	}
                    for(var idx = 0; idx < data.length; idx++){
                    	$("#"+p.sel_id).append("<option value='" + data[idx].comm_dtl_cd + "'>" + data[idx].cd_nm + "</option>");
                    }
                }
            });
		};
		
		/**
		 * 필수값 처리
		 * param: 타겟아이디, 체크여부
		 */
		fnSetPnt = function(p){
			p = $.extend({
				trg_id:"",
				check_yn:"Y",
				message:""
			}, p || {});
			if(p.trg_id == ""){
				return;
			}
			if(p.check_yn == "Y"){
				$("#" + p.trg_id).attr("validate", "empty");
				$("[for|='" + p.trg_id + "'] span").show();
				if(p.message != ""){
					$("#" + p.trg_id).attr("message", p.message);
				}
			} else {
				$("#" + p.trg_id).attr("validate", "");
				$("[for|='" + p.trg_id + "'] span").hide();
			}
		};
		
		/**
		 * 체크박스 체크 디스에이블
		 * param: 타겟아이디, 체크여부
		 */
		fnSetCheckBoxDisabled = function(p){
			p = $.extend({
				trg_id:"",
				checked:true
			}, p || {});
			if(p.trg_id == ""){
				return;
			}
			$("#" + p.trg_id).prop("checked", p.checked);
			$("#" + p.trg_id).prop("disabled", p.checked);
		};
		
		$("#good_no_list").bind({
			keypress:function(event){
	        	if($(this).val() != ""){
	        		$("#good_no_list_chk").attr("checked", true);
	        	}
			}
	    });
		
		//승인권한체크
		fnGetTempGoodsApprAuth = function(pin){
			var rstAuthYn = "N";
			if(pin.std_gsgr_no == ""){
				return rstAuthYn;
			}
			$.ajax({
				url: "/goods/baseinfo/fnGetTempGoodsApprAuth.action",
				dataType: "json",
				data: {
					req_type_cd : pin.req_type_cd,
					appr_stat_cd : pin.appr_stat_cd,
					brand_no	 : pin.brand_no,
					user_id 	 : pin.user_id
				},
				async: false,
				success : function(data) {
					rstAuthYn = data.rstAuthYn;
				}
			});
			return rstAuthYn;
		};
		
	    // MD조회 set
	    fnSetMd = function(pin) {
	        $("input[id=md_id]", $("#" + pin.form)).val(pin.data[0]["MD_ID"]);
	        $("input[id=md_nm]", $("#" + pin.form)).val(pin.data[0]["USER_NM"]);
	        
	        fnSetStdGdgrList();
	    };
	    
	    // MD조회 set
	    fnSetMdList = function(md_id) {
	    	var strUserid = $("#user_id").val();
	    	var strMdId = md_id;
	    	if(null == strUserid || "" == strUserid){
	    		return;
	    	}
	    	
	    	$.ajax({
				url: "/system/user/searchUserMdList.action",
				dataType: "json",
				data: {
					user_id:strUserid
				},
				async: false,
				success : function(data) {
	                $("#md_id option", $("#srchForm")).remove();
		            $("#md_id", $("#srchForm")).append("<option value=''>전체</option>");
					for (var idx = 0; idx < data.length; idx++) {
	                    $("#md_id", $("#srchForm")).append("<option value='" + data[idx].md_id + "'>" + data[idx].md_nm + "</option>");
	                }
				}
			});
	    	if(strMdId !=null || strMdId !=""){
	    		$("#md_id").val(strMdId);
	    	} 
	    };
	    
	    
	    /**
		 *기본색상 조회 팝업
		 * 
		 * @param pin : var pin = {param:{multi_yn:''};
		 */
		fnColorListPop = function(pin) {
			//해당 받는 펑션은 기본으로 셋팅해 준다. 
			var pinParam = { rtnFunc : ((pin.rtnFunc)?pin.rtnFunc:"") };

			var strTitle = (pin.title == undefined) ? "기본색상조회" : pin.title;
			
			if (pin.param != undefined) {
				$.extend(pinParam, pin.param);
			}

			var defaultParam = {
					url : "/goods/popup/forward.ColorListPop.action",
					winname : "ColorListPop",
					title : strTitle,
					type : "m",
					height : "455px",
					params : pinParam,
					scrollbars : false,
					autoresize : false
			};
			
			pin = $.extend(defaultParam, pin||{});
			popup(pin);
		};
	    
		
		//글자수 제한
		limitCharactersAllType = function(textid, limit, limitid){        
			// 입력 값 저장        
			var text = $('#'+textid).val();   
			
			// 입력값 길이 저장        
			var textlength = 0;
			var orgtext = "";
			
			for(var i = 0; i < text.length; i++){
				textlength += (text.charCodeAt(i) > 128)?3:1;
				
				if(textlength <= limit){
					orgtext += text.substring(i, i+1);
				}
			}
			
			if(textlength > limit){                
				$('#'+limitid).html(limit+ '자 이상 쓸수 없습니다!');                
				
				// 제한 글자 길이만큼 값 재 저장                
				$('#'+textid).val(orgtext);                
				return false;        
			}else{                
				$('#'+limitid).html(limit - textlength);                
				return true;        
			}
		};
		
		
		
		//브랜드 셋팅 
		fnSetBrand = function(pin) {
	        $("#brand_no").val(pin.data[0]["BRAND_NO"]);
	        $("#erp_brand_cd").val(pin.data[0]["ERP_BRAND_CD"]);
	        $("#brand_nm").val(pin.data[0]["BRAND_NM"]);
	        fnGetVirVendInfo(pin.data[0]["VIR_VEND_NO"]);
	        fnBtnControl();
	    };
	    
	    // 출고지검색
	    fnSearchVend = function(){
	    	var paramPin = {};
	    	
	    	var varRtnFunc = 'fnSetVend';
	     	var varGoods_type_cd = $("#goods_type_cd").val();
	     	var vendTypeCd = _PV_VEND_TYPE_CD_SELF;
	    	
	    	//일반상품 입점업체일경우 브랜드 검색후 사용가능 
	    	if(strGoodsCmpsDiviCd == _PV_GOODS_CMPS_DIVI_CD_GENERAL){
	    		if (ownGoodsYn == "N" && $("#brand_no").val() == ""){
		    		alert("브랜드 선택 후 사용 가능합니다.");
		    		return;
		    	};
		    	
		    	if(ownGoodsYn == "N") {
		     		vendTypeCd = _PV_VEND_TYPE_CD_GOODS_SUPPLY;
		     	};
	    	};
	    	
	    	//사은품 
	    	if(varGoods_type_cd == _PV_GOODS_TYPE_CD_GIFT){
	    		
	    		paramPin = {
	    				multi_yn:'N', 
				    	prgs_stat_cd:_PV_PRGS_STAT_CD_TRADE, 
				    	vend_divi_cd:_PV_VEND_DIVI_CD_GOODS_SUPPLY,
				    	workMode:$("#workMode").val(),
				    	goods_no:$("#goods_no").val(),
				    	vend_type_cd: vendTypeCd
	    		};
	    	
	    	}else {
		    	paramPin = {
		    		multi_yn:'N', 
		    		prgs_stat_cd:_PV_PRGS_STAT_CD_TRADE, 
		    		vend_divi_cd:_PV_VEND_DIVI_CD_GOODS_SUPPLY,
		    		workMode:$("#workMode").val(),
		    		goods_no:$("#goods_no").val(),
		    		tax_divi_cd:$("#tax_divi_cd").val(),
		    		vend_type_cd: vendTypeCd
		    	}
	    	};
	    	
	    	//세트상품일경우 업체 유형을 넘기지 않는다.
	    	if(strGoodsCmpsDiviCd == _PV_GOODS_CMPS_DIVI_CD_SET){
	    		paramPin.vend_type_cd = null;
	    	};
	    	
	    	fnLowVendListPop({param:paramPin, rtnFunc:varRtnFunc});
	    };
	    
	    // 출고지검색
	    fnSetVend = function(pin) {
	        $("#low_vend_nm").val(pin.data[0]["LOW_VEND_NM"]);
	        $("#vend_no").val(pin.data[0]["VEND_NO"]);
	        $("#vir_vend_no").val(pin.data[0]["VIR_VEND_NO"]);
	        $("#upper_vir_vend_no").val(pin.data[0]["UPPER_VIR_VEND_NO"]);
	        $("#purch_form_cd").val(pin.data[0]["PURCH_FORM_CD"]);
	        $("#purch_form_cd_sel").val(pin.data[0]["PURCH_FORM_CD"]);
	        $("#purch_form_cd_sel").prop("disabled", true);
	        $("#span_vend_nm").text(pin.data[0]["VEND_NM"]);
	        $("#read_time").val(pin.data[0]["READ_TIME"]);
	        $("#ship_dlvp_no").val(pin.data[0]["BASE_SHIP_ADDR_NO"]);
	        $("#exists_pcno_yn").val(pin.data[0]["exists_pcno_yn"]);
	        fnSetdeliFormCd(pin.data[0]["EXISTS_PCNO_YN"]);
	        fnSetPvDeliCostPoli(pin.data[0]);
	        fnSetPvRetDlvp(pin.data[0]["VIR_VEND_NO"]);
	        if($("#goods_type_cd").val() ==  _PV_GOODS_TYPE_CD_PKG 
	        		|| $("#goods_type_cd").val() == _PV_GOODS_TYPE_CD_CUSTOM
	        		|| $("#goods_type_cd").val() == _PV_GOODS_TYPE_CD_MULTI
	        		|| $("#goods_type_cd").val() == _PV_GOODS_TYPE_CD_NMDISCOUNT){
	        	setCmpsGrid.ClearRows();
	        	
	        }else if($("#goods_type_cd").val() == _PV_GOODS_TYPE_CD_NMCMPS){
	        	setSaleGrid.ClearRows();
	        	setDiscntGrid.ClearRows();
	        }
	        fnCreateMarginInfo();
	    };
	    
	    //물리센터이고 고객사 센터 사용 업체는 배송형태 센터로 고정
	    fnSetdeliFormCd = function(exists_pcno_yn){
	    	if(exists_pcno_yn == _BOOLEAN_TRUE){
            	$("#deli_form_cd").val(_DELI_FORM_CD_CENTER);
            	//센터경유 옵션이 있는지 확인하고 없으면 추가하고 디스에이블처리
            	var cnt = 0;
            	$("#deli_form_cd_sel option").each(function(){
            		if(this.value == _DELI_FORM_CD_CENTER){
            			cnt++;
            		}
            	});
            	if(cnt == 0){
            		$("#deli_form_cd_sel").append("<option value='"+ _DELI_FORM_CD_CENTER +"'>센터경유</otpion>");
            	}
            	$("#deli_form_cd_sel").val(_DELI_FORM_CD_CENTER);
            	$("#deli_form_cd_sel").prop("disabled", true);
            } else {
            	$("#deli_form_cd").val("");
            	$("#deli_form_cd_sel").prop("disabled", false);
            	$("#deli_form_cd_sel option").each(function(){
            		if(this.value == _DELI_FORM_CD_CENTER){
            			$(this).remove();
            		}
            	});
            	$("#deli_form_cd_sel").val("");
            }
	    }
	    
	    //출고지배송비정책 콤보박스 생성
	    fnSetPvDeliCostPoli = function(p){
	    	
	    	var virVendNo ;
	    	var exists_pcno_yn ;
	    	
	    	if($("#exists_pcno_yn").val() == ""){
	    		exists_pcno_yn = p["EXISTS_PCNO_YN"];
	    	}else{
	    		exists_pcno_yn = $("#exists_pcno_yn").val();
	    	}
	    	
	    	if(p["VIR_VEND_NO"] == null || p["VIR_VEND_NO"] == undefined || p["VIR_VEND_NO"] == ""){
	    		virVendNo = p;
	    	}else{
	    		virVendNo = p["VIR_VEND_NO"];
	    	}
	    		
	    	$.ajax({
		        url: "/vend/vend/searchGoodsDeliCostPoliList.action",
		        dataType: "json",
		        data:{ 
		        	   vir_vend_no : virVendNo,
		        	   exists_pcno_yn : exists_pcno_yn
		        	 },
		        async: false,
		        success : function(data) {
		            $("#deli_cost_poli_no_sel option").remove();
		            $("#deli_cost_poli_no_sel").append("<option value=''>선택</option>");
		            
		            for(var idx = 0; idx < data.length; idx++){
		                $("#deli_cost_poli_no_sel").append("<option value='" + data[idx].deli_cost_poli_no + "'>" + data[idx].deli_cost_poli_nm + "</option>");
		            };
		            if($("#deli_cost_poli_no").val() != ""){
		            	$("#deli_cost_poli_no_sel").val($("#deli_cost_poli_no").val());
		            } else {
		            	if ($("#deli_cost_poli_no_sel option:eq(1)").val() != undefined) {
		            		$("#deli_cost_poli_no_sel option:eq(1)").prop("selected", true);
		            	};
		            };
		        }
		    }); 
	    };
	    
	    //반품배송지 콤보박스 생성
	    fnSetPvRetDlvp = function(virVendNo){
	    	$.ajax({
		        url: "/vend/vend/searchGoodsRetDlvpList.action",
		        dataType: "json",
		        data:{vir_vend_no:virVendNo},
		        async: false,
		        success : function(data) {
		            $("#ret_dlvp_no_sel option").remove();
		            $("#ret_dlvp_no_sel").append("<option value=''>선택</option>");
		            
		            for(var idx = 0; idx < data.length; idx++){
		                $("#ret_dlvp_no_sel").append("<option value='" + data[idx].addr_no + "'>" + data[idx].addr + "</option>");
		            };
		            if($("#ret_dlvp_no").val() != ""){
		            	$("#ret_dlvp_no_sel").val($("#ret_dlvp_no").val());
		            } else {
		            	if($("#ret_dlvp_no_sel option:eq(1)").val()){
		            		$("#ret_dlvp_no_sel option:eq(1)").prop("selected", true);
		            	};
		            };
		        }
		    }); 
	    };
	    
	    //마진정보 : 공급업체에서 출고지로 마진정보변경: upper_vir_vend_no->vir_vend_no
	    fnCreateMarginInfo = function(){
	    	//var virVendNo = $("#upper_vir_vend_no").val();
	    	var virVendNo = $("#vir_vend_no").val();
	    	var brandNo = $("#brand_no").val();
	    	if(virVendNo != ""){
	    		$.ajax({
			        url: "/vend/vend/searchMarginInfo.action",
			        dataType: "json",
			        data:{
			        	vir_vend_no: virVendNo,
			        	brand_no: brandNo,
			        	disp_start_dtime: $("#disp_start_dtime").val()
			        },
			        async: false,
			        success : function(data) {
			        	$("#margin_info").text("");
			        	var marginInfo = [];
			        	var baseYnChk = false;
			        	for(var idx = 0; idx < data.length; idx++){
			        		var baseYnStr = "";
			        		if(data[idx].base_yn == _BOOLEAN_TRUE ){
			        			baseYnStr = "(기본) ";
			        		}
			        		if(data[idx].margin_divi_cd == _PV_MARGIN_DIVI_CD_FIX || data[idx].margin_divi_cd == _PV_MARGIN_DIVI_CD_EVENT_FIX){
			        			marginInfo[idx] = baseYnStr + data[idx].margin_divi_cd_nm + " : " + data[idx].margin_start_rate + "%";
			        		} else {
			        			marginInfo[idx] = baseYnStr + data[idx].margin_divi_cd_nm + " : " + data[idx].margin_start_rate + "% ~" + data[idx].margin_end_rate + "%";
			        		}
			        		if(data[idx].base_yn == _BOOLEAN_TRUE && $("#workMode").val() == _PV_GOODS_WORK_MODE_INSERT){
			        			$("#margin_rate").val(data[idx].margin_start_rate);
			        			baseYnChk=true;
			        		}
			        	};
			        	if($("#workMode").val() == _PV_GOODS_WORK_MODE_INSERT && !baseYnChk){
			        		$("#margin_rate").val(0);
			        	}
			        	$("#margin_info").append(marginInfo.join(" , "));
			        }
			    }); 
	    	}
	    };
	    
	    //fnCreateMarginInfo 의 상세 화면용
	    //workMode : 수정화면인지 체크
	    fnViewMarginInfo = function(workMode){
	    	var virVendNo = $("#vir_vend_no").val();
	    	var brandNo = $("#brand_no").val();
	    	if(virVendNo != ""){
	    		$.ajax({
			        url: "/vend/vend/searchMarginInfo.action",
			        dataType: "json",
			        data:{
			        	vir_vend_no: virVendNo,
			        	brand_no: brandNo,
			        	//disp_start_dtime: $("#disp_start_dtime").val(),
			        	workMode : workMode
			        },
			        async: false,
			        success : function(data) {
			        	$("#margin_info").text("");
			        	var marginInfo = [];
			        	var baseYnChk = false;
			        	for(var idx = 0; idx < data.length; idx++){
			        		var baseYnStr = "";
			        		if(data[idx].base_yn == _BOOLEAN_TRUE ){
			        			baseYnStr = "(기본) ";
			        		}
			        		if(data[idx].margin_divi_cd == _PV_MARGIN_DIVI_CD_FIX || data[idx].margin_divi_cd == _PV_MARGIN_DIVI_CD_EVENT_FIX){
			        			marginInfo[idx] = baseYnStr + data[idx].margin_divi_cd_nm + " : " + data[idx].margin_start_rate + "%";
			        		} else {
			        			marginInfo[idx] = baseYnStr + data[idx].margin_divi_cd_nm + " : " + data[idx].margin_start_rate + "% ~" + data[idx].margin_end_rate + "%";
			        		}
			        		if(data[idx].base_yn == _BOOLEAN_TRUE && $("#workMode").val() == _PV_GOODS_WORK_MODE_INSERT){
			        			$("#margin_rate").val(data[idx].margin_start_rate);
			        			baseYnChk=true;
			        		}
			        	};
			        	if($("#workMode").val() == _PV_GOODS_WORK_MODE_INSERT && !baseYnChk){
			        		$("#margin_rate").val(0);
			        	}
			        	$("#margin_info").append(marginInfo.join(" , "));
			        }
			    }); 
	    	}
	    };
	    
	    // 판매가-마진율-공급원가-마진금액 계산
	    $("[action_group=price]").bind("focusout", function(){
	    	//숫자 입력만 가능
	    	if(!isDecimal($(this))){
	    		$(this).val(0);
	    	}
	        fnCalMargin($(this).attr("name"));
	    });
	    
	    //계산하기 
	    fnCalMargin = function(opt){
	    	var change_gubun = "10";
	    	if(opt == "margin_rate") {
	    		change_gubun = "10";
	    	} else if(opt == "supply_price"){
	    		change_gubun = "20";
	    	} else if(opt == "sale_price"){
	    		change_gubun = "30";
	    	};
	    	
	    	var round_divi_cd = $("#round_divi_cd").val() || "10";
	    	
	    	$.ajax({
		        url: "/goods/temporarygoods/fnGetPriceInfo.action",
		        dataType: "json",
		        data:{
		        	change_gubun:change_gubun,
		        	round_divi_cd:round_divi_cd,
		        	supply_price:$("#supply_price").val(),
		        	margin_rate:$("#margin_rate").val(),
		        	sale_price:$("#sale_price").val()
		        },
		        async: false,
		        success : function(data) {
		        	$("#margin_rate").val(data.MARGIN_RATE);
		        	
		        	if(data.MARGIN_RATE == 0){
		        		if(opt == "margin_rate") {
		        			$("#supply_price").val($("#sale_price").val());
		    	    	} else if(opt == "supply_price"){
		    	    		$("#sale_price").val($("#supply_price").val());
		    	    	} else if(opt == "sale_price"){
		    	    		$("#supply_price").val($("#sale_price").val());
		    	    	};
		        	} else {
		        		$("#supply_price").val(data.SUPPLY_PRICE);
			        	$("#sale_price").val(data.SALE_PRICE);
		        	}
		        }
		    }); 
	    	
	    	fnGetPriceAddInfo();
	    };
	    
	    fnGetPriceAddInfo = function(){
	    	var varMargin_price = +$("#sale_price").val() - +$("#supply_price").val();
	    	if($("#margin_rate").val() == 0){
	    		varMargin_price = 0;
	    	};
	        $("#margin_price").empty();
	        $("#margin_price").append(toCurrency(varMargin_price));
	    };
	    
	    //그리드 마진 계산하기 
	    fnCalGridMargin = function(pin){
	    	var rstpin = {};
	    	$.ajax({
		        url: "/goods/temporarygoods/fnGetPriceInfo.action",
		        dataType: "json",
		        data:{
		        	change_gubun : pin.change_gubun,
		        	round_divi_cd : pin.round_divi_cd,
		        	supply_price : pin.supply_price,
		        	margin_rate : pin.margin_rate,
		        	sale_price : pin.sale_price
		        },
		        async: false,
		        success : function(data) {
		        	rstpin.margin_rate = data.MARGIN_RATE;
		        	rstpin.supply_price = data.SUPPLY_PRICE;
		        	rstpin.sale_price = data.SALE_PRICE;
		        }
		    });
	    	return rstpin;
	    };
	    
	    //가상업체번호로 출고지정보 조회하기
	    fnGetVirVendInfo = function(vir_vend_no){
	    	$.ajax({
				url: "/vend/vend/getPoLowVendInfo.action",
				dataType: "json",
				data: {
					vir_vend_no: vir_vend_no
				},
				async: false,
				success : function(data) {
					$("#low_vend_nm").val(data.low_vend_nm);
			        $("#vend_no").val(data.vend_no);
			        $("#vir_vend_no").val(data.vir_vend_no);
			        $("#upper_vir_vend_no").val(data.upper_vir_vend_no);
			        $("#purch_form_cd").val(data.purch_form_cd);
			        $("#purch_form_cd_sel").val(data.purch_form_cd);
			        $("#purch_form_cd_sel").prop("disabled", true);
			        $("#span_vend_nm").text(data.vend_nm);
			        $("#read_time").val(data.read_time);
			        $("#ship_dlvp_no").val(data.base_ship_addr_no);
			        $("#exists_pcno_yn").val(data.exists_pcno_yn);
			        fnSetdeliFormCd(data.exists_pcno_yn);
			        fnSetPvDeliCostPoli(data.vir_vend_no);
			        fnSetPvRetDlvp(data.vir_vend_no);
			        if($("#goods_type_cd").val() != _PV_GOODS_TYPE_CD_GIFT){
			            fnCreateMarginInfo();    	
			        }
			        //$("#srchVendBtn").hide();
				}
			});
	    };
	    //배송상품구분 설치상품일경우 처리
	    fnSetInstallGoodsData = function(deli_goods_divi_cd){
	    	if(deli_goods_divi_cd == _PV_DELI_GOODS_DIVI_CD_INSTALL) {
	    		$("#deli_form_cd_sel").val(_PV_DELI_FORM_CD_PERSON);
	    		$("#deli_cost_form_cd_sel").val(_PV_DELI_COST_FORM_CD_DESC);
	    		$("#deli_form_cd").val(_PV_DELI_FORM_CD_PERSON);
	    		$("#deli_cost_form_cd").val(_PV_DELI_COST_FORM_CD_DESC);
	    		$("#deli_form_cd_sel").attr("disabled", true);
	    		$("#deli_cost_form_cd_sel").attr("disabled", true);
	    	} else {
	    		$("#deli_form_cd_sel").attr("disabled", false);
	    		$("#deli_cost_form_cd_sel").attr("disabled", false);
	    	};
	    };
	    
	    
	    
	    /* 상품체크로직 시작 */
	    //필수값 체크
	    fnGoodsDataCheck = function(){
	    	
	    	//진행상테 아닐경우 바로 페스
	    	var strPrgsStatCd = $("#prgs_stat_cd").val();
	    	if(strPrgsStatCd != "" && _PV_GOODS_PRGS_STAT_CD_SALE != strPrgsStatCd && workMode != _PV_GOODS_WORK_MODE_INSERT ){
	    		return false;
	    	};
	    	
	    	var strGoodsReqStatCd = $("#goods_req_stat_cd").val();
	    	var strReqTypeCd = $("#req_type_cd").val();
	    	var strReqTypeDtlCd = $("#req_type_dtl_cd").val();
	    	var strGoodsTypeCd = $("#goods_type_cd").val();
	    	
	    	//임시저장, 대표상품 
	    	if(strGoodsReqStatCd == _PV_GOODS_REQ_STAT_CD_TEMP_SAVE || strGoodsReqStatCd == _PV_GOODS_REQ_STAT_CD_BASE){
	    		//공통체크사항 가격정보, 안전인증정보, SKU정보는 출고지 정보가 등록되지 않으면 사용할수 없다.
	    		if(strReqTypeCd == _PV_REQ_TYPE_CD_BASE){
	    			if(strReqTypeDtlCd == _PV_REQ_TYPE_DTL_CD_CO_GOODS_BASE){
	    				//제휴대표상품은 업체정보와 업체상품번호가 필수
	    	    		if($("#vir_vend_no").val() == ""){
	    	    			$("#vir_vend_no").focus();
	    	    			alert("업체정보를 선택해 주세요.");
	    	    			return true;
	    	    		}
	    	    		if($("#vend_goods_no").val() == ""){
	    	    			$("#vend_goods_no").focus();
	    	    			alert("업체상품번호를 입력해 주세요.");
	    	    			return true;
	    	    		}
	    			} else if (strReqTypeDtlCd == _PV_REQ_TYPE_DTL_CD_GOODS_VEND_BASE){
	    				//업체상품기본정보는 업체정보와 필수
	    	    		if($("#vir_vend_no").val() == ""){
	    	    			$("#vir_vend_no").focus();
	    	    			alert("업체정보를 선택해 주세요.");
	    	    			return true;
	    	    		}
	    			}
	    		}
	    		return false;
	    	};
	    	
    		var check = true;
    		$("[validate=empty]").each(function(){
    			if($(this).is(':visible') == true || $(this).attr("type") == "hidden"){
    				if(this.value == ""){
        				if (this.id == "deli_cost_poli_no") {
        					$("#deli_cost_poli_no_sel").focus();
        				} else if (this.id == "ret_deli_cost_poli_no") {
        					$("#ret_deli_cost_poli_no_sel").focus();
        				} else if (this.id == "ret_dlvp_no") {
        					$("#ret_dlvp_no_sel").focus();
        				} 
        				else {
        					$(this).focus();
        				};
        				alert($(this).attr("message"));
        				check = false;
            			return false;
        			};
    			};
    		});
    		
    		if(!check){
    			return true;
    		};
    		
	        //주문가능수량관리
	        if($("#ord_poss_min_qty").val() != undefined){
	        	if($("#ord_poss_min_qty").val() != ""){
	        		if(!isNumber($("#ord_poss_min_qty"))){
		        		 alert("최저주문수량을 숫자로 입력해 주세요.");
				         $("#ord_poss_min_qty").focus();
		        		 return true;
		        	};
	        	};
	        };
	        
	        if($("#ord_poss_max_qty").val() != undefined){
	        	if($("#ord_poss_max_qty").val() != ""){
	        		if(!isNumber($("#ord_poss_max_qty"))){
		        		 alert("최대주문수량을 숫자로 입력해 주세요.");
				         $("#ord_poss_max_qty").focus();
		        		 return true;
		        	};
	        	};
	        };
	        
	        //최대 주문수량이 0 보다 크다면 입력 주문가능기준 필수
	        if($("#ord_poss_max_qty").val() != undefined){
	        	if($("#ord_poss_max_qty_st_cd").val() == "" && Number($("#ord_poss_max_qty").val()) > 0 ){
		            alert("주문가능기준을 선택해 주세요.");
		            $("#ord_poss_max_qty_st_cd").focus();
		            return true;
	        	};
	        };
	        
	        if($("#ord_poss_max_qty").val() != undefined && Number($("#ord_poss_max_qty").val()) > 0 && Number($("#ord_poss_min_qty").val()) > 0){
	        	if(Number($("#ord_poss_min_qty").val()) >  Number($("#ord_poss_max_qty").val())){
		            alert("최저주문 수량이 최대주문 수량보다 클 수 없습니다.");
		            $("#ord_poss_min_qty").focus();
		            return true;
		            
	        	};
	        };

	        // 배송기일은 0입력 불가
	        if($("#read_time").val() != undefined && Number($("#read_time").val()) < 1 ){
	        	alert("배송기일은 0으로 입력하실 수 없습니다.");
	        	$("#read_time").focus();
	            return true;
	        }
	        // 배송기일은 1입력시 confirm
	        if($("#read_time").val() != undefined && Number($("#read_time").val()) == 1 ){
	        	if (confirm("배송기일을 1일 이내로 수정하겠습니까?")) {
	        	} else {
		        	$("#read_time").focus();
		            return true;
	        	}
	        }

    		//개별단위수량 은 개별단위배송만 가능하다
    		if($("#deli_cost_form_cd").val() != undefined && $("#deli_cost_unit_qty").val() != undefined){
	        	if($("#deli_cost_form_cd").val() != _PV_DELI_COST_FORM_CD_INPK && $("#deli_cost_unit_qty").val() != ""){
	        		alert("배송비 형태가 개별단위일 경우만 개별단위 수량 선택이 가능합니다.");
	        		$("#deli_cost_form_cd").focus();
	        		return true;
	        	};
	        	
	        	if($("#deli_cost_form_cd").val() == _PV_DELI_COST_FORM_CD_INPK && $("#deli_cost_unit_qty").val() == ""){
	        		alert("개별단위 수량을 선택해주세요.");
	        		$("#deli_cost_unit_qty").focus();
	        		return true;
	        	};
	        };
    		
    		if($("#sale_price").val() == "0" && $("#supply_price").val() == "0" && $("#margin_rate").val() != "0"){
    			alert("마진율을 확인해주세요");
    			$("#margin_rate").focus();
    			return true;
    		};
    		
            //상품이미지 체크
            if($("#goods_type_cd").val() != _PV_GOODS_TYPE_CD_GIFT){
	            var images = goodImgUploader.GetImages();
	            var resdImgCnt = 0;    // 대표이미지 
	            var nullDiviCdCnt = 0;
	            $.each(images, function() {
	            	var images_data = this["images_data"];
	            	
	            	$.each(images_data, function() {
	            		if(this["img_divi_cd"] == "" && this["crud"] != "D"){
	            			nullDiviCdCnt++;
	            		}
	            		if(this["img_divi_cd"] == _PV_IMG_DIVI_CD_DEFAULT && this["crud"] != "D") {
	                        resdImgCnt++;
	                    }
					});
	            });
	
	            if(nullDiviCdCnt > 0){
	            	alert("상품 이미지 구분을 선택해 주세요.");
	                $("#good_img").focus();
	                return true;
	            };
	          
	            if(resdImgCnt == 0 ) {
	               alert("상품의 기본이미지를 등록해 주세요.");
	               $("#good_img").focus();
	               return true;
	            };
	            
	            if(resdImgCnt > 1 ) {
	                alert("상품의 기본이미지는 하나만 등록가능합니다.");
	                $("#good_img").focus();
	                return true;
	            };
            
            };
            
            //고시정보 체크
            if($("#goods_clss_guide_no").attr("name") != undefined && $("#goods_clss_guide_no").val() != undefined && typeof(goodClssGuideGrid) != "undefined"){
            	if($("#goods_clss_guide_no").val() == ""){
            		alert("상품고시정보를 선택해 주세요");
            		$("#goods_clss_guide_no").focus();
            		return true;
            	};
            	
              	var goodClssGuideCheckValid = false;
                var rows = goodClssGuideGrid.GetRows({});
                $.each(rows, function(idx, row) {
                	if(row["MDTY_YN"] == "Y" &&  (row["CLSS_GUIDE_CONT"] == null || row["CLSS_GUIDE_CONT"].trim() == "")){
                		alert("고시정보 내용을 입력해 주세요.");
                		$("#goodClssGuideGrid").focus();
	                   	goodClssGuideGrid.SelectRow({
	                   		row: row.Index
	               		});
                   		goodClssGuideCheckValid = true;
                   		return false;
                   	};
       		    });
                if(goodClssGuideCheckValid){
                       return true;
                };
            };
            
            //SKU정보 체크
            if(typeof(itemGrid) != "undefined"){
            	if($("#multi_item_yn").val() == "Y"){
                	if(itemGrid.GetRowCount() == 0 || itemCreateGrid.GetRowCount() == 0){
                        alert("옵션을 추가해주세요.");
                        return true;
                    };
                    // 옵션 유효성 체크
                	if(itemGrid.GetRowCount() > 0){
                        if (!itemGrid.CheckRequired()) {
                            return true;
                        };
                        
                        //업체SKU번호 중복 체크
                        var rows = itemCreateGrid.GetRows();
                        var dupCheck = false;
                        $.each(rows, function(idx, data){
                        	$.each(rows, function(tdx, tdata){
                            	if(data["VEND_ITEM_NO"] != ""){
                            		if(idx != tdx && data["VEND_ITEM_NO"] == tdata["VEND_ITEM_NO"]){
                            			$("#itemCreateGrid").focus();
                            			alert("중복되는 업체SKU 번호가 있습니다.");
                            			itemGrid.SelectCell({
                            				row: data.Index,
                            				id: "VEND_ITEM_NO"
                            			});
                            			dupCheck = true;
                            			return false;
                            		};
                            	};
                            	if(dupCheck){
                            		return false;
                            	};
                            });
                        	if(dupCheck){
                        		return false;
                        	};
                        });
                        if(dupCheck){
                    		return true;
                    	};
            		};
                };
            };
            
            //카테고리 체크
	        if(typeof(dispCtgGrid) != "undefined"){
	        	
		        var dispList = dispCtgGrid.GetRows();
		        var isBase = 0;
		        var dispCtgList = "";
		        var baseDispCtg = "";
		        var baseDispCtgTypeCd = "";
		        var rowIndex = 0;
		        var tMallCnt = 0;
		        for(var idx = 0; idx < dispList.length; idx++){
		            if(dispList[idx]["BASE_YN"] == _BOOLEAN_TRUE && dispList[idx]["CRUD"] == "R"){
		                isBase++;                   
		            };
		            if(dispList[idx]["BASE_YN"] == _BOOLEAN_TRUE && dispList[idx]["CRUD"] == "C" && dispList[idx].Checked){
		                isBase++;                   
		            };
		            if(dispList[idx]["BASE_YN"] == _BOOLEAN_TRUE && dispList[idx]["CRUD"] == "U" && dispList[idx].Checked){
		                isBase++;                   
		            };
		            if(dispList[idx]["BASE_YN"] == _BOOLEAN_TRUE) {
		            	rowIndex = dispList[idx].Index;
	        			baseDispCtg = dispList[idx]["DISP_CTG_NO"];
	        			baseDispCtgTypeCd = dispList[idx]["DISP_TYPE_CD"];
		            }
		            if(dispList[idx]["DISP_MALL_NO"] == _DEFAULT_DISP_MALL_NO && dispList[idx]["CRUD"] != "D") {
	        			tMallCnt++;
	        		}
		        };
		        if(dispCtgGrid.GetRowCount() == 0) {
		        	alert("기본전시 카테고리를 설정해 주세요.");
		        	return true;
		        };
		        if(dispCtgGrid.GetRowCount() > 0){
		        	if(isBase > 1){
		        		alert("기본 카테고리는 하나만 선택가능합니다.");
			            return true;
		        	} else if (isBase == 0){
		        		alert("기본 카테고리를 선택 해주세요.");
			            return true;
		        	};
	            };
	            
	            if(dispList.length > 0) {
		            //회원별 전시상품이 아닌경우
		    		if($(":radio[name=spc_mbr_disp_yn]:checked").val() == _BOOLEAN_FALSE) {
			    		//기본여부를 전시카테고리 외에 정보로 체크하여 저장시 일반이 아닐경우
			    		if(baseDispCtgTypeCd != _DS_DISP_TYPE_CD_NOMAL) {
				    		if(confirm("'일반-전시카테고리' 가 아닌 카테고리를 기본 카테고리로 선택하셨습니다.\n검색 시, 카테고리 정보가 제공되지 않습니다.\n저장 하시겠습니까?") == false) {
				    			return true;
				    		}
			    		}
		    		}
		    		
		    		//자주카테고리만 등록한 경우
		    		if(tMallCnt == 0){
		    			//회원별 전시가 N인 경우
		    			if($(":radio[name=spc_mbr_disp_yn]:checked").val() == _BOOLEAN_FALSE) {
		    				//단품시에만 사은품 가능여부 N인 상품 체크
		    				if(strGoodsCmpsDiviCd == _PV_GOODS_CMPS_DIVI_CD_GENERAL) {
		    					if($("input:checkbox[id='gift_poss_yn_chk']").is(":checked") == false){
		    						alert("*통합몰 카테고리 등록은 필수입니다.");
		    						return true;
		    					}
		    				}else {
		    					alert("*통합몰 카테고리 등록은 필수입니다.");
		    					return true;
		    				}
		    			}
		    		}
	    		
		            //유효한 카테고리 여부
		    		var chkCtgYn = false;
		        	$.ajax({
		    			url: "/disp/dispctg/getAvailableCtgYn.action",
		    			dataType: "json",
		    			data: {
		    				disp_ctg_no: baseDispCtg
		    			},
		    			async: false,
		    			success : function(data) {
		    				if(data.avaCtgYn == _BOOLEAN_FALSE) {
		    					chkCtgYn = true;
		    				}
		    			}
		    		});
		        	if(chkCtgYn) {
		        		alert("선택한 기본카테고리는 유효하지 않은 카테고리 입니다.");
		        		dispCtgGrid.DeleteRow({row: rowIndex});
		    			return true;
		        	}
	            }
	        };
	        
	        if(typeof(condGrid) != "undefined"){
    			if(condGrid.GetRowCount() > 0){
                    if (!condGrid.CheckRequired()) {
                    	$("#condGrid").focus();
                        return true;
                    };
                };
    		};
	        
	        if(typeof(sellpntGrid) != "undefined"){
    			if(sellpntGrid.GetRowCount() > 0){
                    if (!sellpntGrid.CheckRequired()) {
                    	$("#sellpntGrid").focus();
                        return true;
                    };
                };
    		};
    		
    		if(typeof(mdpntGrid) != "undefined"){
    			if(mdpntGrid.GetRowCount() > 0){
                    if (!mdpntGrid.CheckRequired()) {
                    	$("#mdpntGrid").focus();
                        return true;
                    };
                };
    		};
    		
    		if(typeof(carveGrid) != "undefined"){
    			if(carveGrid.GetRowCount() > 0){
                    if (!carveGrid.CheckRequired()) {
                    	$("#carveGrid").focus();
                        return true;
                    };
                };
    		};
    		
    		if(typeof(filterGrid) != "undefined"){
    			if(filterGrid.GetRowCount() > 0){
                    if (!filterGrid.CheckRequired()) {
                    	$("#carveGrid").focus();
                        return true;
                    };
                    //중목체크
                    var dupCheck = false;
                    var rows = filterGrid.GetRows();
                    $.each(rows, function(idx, data){
                    	$.each(rows, function(tdx, tdata){
                    		if(idx != tdx && data["FILTER_ALTI_CLS_CD"] == tdata["FILTER_ALTI_CLS_CD"]){
                    			dupCheck = true;
                    			alert("중복되는 속성그룹이 존재합니다.");
                    			$("#carveGrid").focus();
                    			return false;
                    		};
                    	});
                    	if(dupCheck){
                    		return false;
                    	};
                    });
                    
                    if(dupCheck){
                		return true;
                	};
                };
    		};
    		
	        //세트상품일경우 체크사항
	        if((strReqTypeCd == _PV_REQ_TYPE_CD_REGIST_SET || strReqTypeCd == _PV_REQ_TYPE_CD_UPDATE_SET) ){
	        	if(strGoodsTypeCd == _PV_GOODS_TYPE_CD_PKG){
	        		var rows;
	        		if(workMode=="upd"){
	        			rows = setCmpsGrid.GetRows();
	        		}else{
	        			rows = setCmpsGrid.GetRows({checked: true});	
	        		}
					var mdtyGrpCnt = 0;
					var selGrpCnt = 0;
					var resdItemCnt = 0;
					var price0Item = 0;
					var mdtyGrpSeq = "";
					var emptyGrpNm = 0;
					var resdSaleCnt = 0;
					var mdtyUseCnt = 0;
					var cmpsGrpSeqChk = []; 
					var rootChk = true;
					
					
					$.each(rows, function(index,row){
						if(this["LEVEL1"] == 1){
							if(this["CMPS_GRP_NM"] == ""){
								emptyGrpNm++;
							};
							if(this["MDTY_YN"] == _BOOLEAN_TRUE){
								mdtyGrpCnt++;
								mdtyGrpSeq = this["CMPS_GRP_SEQ"];
							} else {
								selGrpCnt++;
							};
							if(this["MDTY_YN"] == _BOOLEAN_TRUE && this["USE_YN"] == _BOOLEAN_FALSE){
								mdtyUseCnt++;
							};
							cmpsGrpSeqChk[row["CMPS_GRP_SEQ"]]=row["CMPS_GRP_SEQ"];
						} else {
							if(cmpsGrpSeqChk[row["CMPS_GRP_SEQ"]]!=row["CMPS_GRP_SEQ"]){
								rootChk = false;
								return true;
							}
							if(this["RESD_YN"] == _BOOLEAN_TRUE && this.CRUD == "R"){
								resdItemCnt++;
							};
							if(this["RESD_YN"] == _BOOLEAN_TRUE && this.CRUD == "U" && this.Checked){
								resdItemCnt++;
							};
							if(this["RESD_YN"] == _BOOLEAN_TRUE && this.CRUD == "C" && this.Checked){
								resdItemCnt++;
							};
							if(this["SALE_YN"] == _BOOLEAN_FALSE && this["RESD_YN"] == _BOOLEAN_TRUE){
								resdSaleCnt++;
							};
						};
					});
					
					if(!rootChk){
						alert("구성그룹이 없는 구성품이 존재합니다.");
						return true;
					}
					
					if(mdtyGrpCnt == 0){
						alert("필수그룹을 생성해 주세요.");
						return true;
					};
					if(emptyGrpNm > 0){
						alert("구성그룹명을 입력하세요.");
						return true;
					};
					if(resdItemCnt == 0){
						alert("그룹별 대표상품을 선택해 주세요.");
						return true;
					};
					if(mdtyGrpCnt != resdItemCnt){
						alert("그룹별 대표상품을 선택해 주세요.");
						return true;
					};
					if(resdSaleCnt > 0){
						alert("대표 구성품은  판매여부를 체크해야 합니다.");
						return true;
					};
					if(mdtyUseCnt > 0){
						alert("필수인 그룹은 사용여부를 체크해야 합니다.");
						return true;
					};
																
		        };
	        	if(strGoodsTypeCd == _PV_GOODS_TYPE_CD_NMCMPS){	//N+M 구성상품 검사
	        		
	        		//판매그룹 구성수량
	        		var varSaleGrpCmpsQty = $("input[name=cmps_qty]:eq(0)").val();
	        		var varDscGrpCmpsQty = $("input[name=cmps_qty]:eq(1)").val();
	        		var setSaleGridRows;
	        		var setDiscntGridRows;
	        		var saleResdItemCnt = 0;
	        		var discntResdItemCnt = 0;
	        		
	        		if(workMode =="upd"){
	        			setSaleGridRows = setSaleGrid.GetRows();
	        			setDiscntGridRows = setDiscntGrid.GetRows();
	        		}else{
	        			setSaleGridRows = setSaleGrid.GetRows({checked: true});
	        			setDiscntGridRows = setDiscntGrid.GetRows({checked: true});
	        		}
	        		
	        		$.each(setSaleGridRows, function(index,row){
						if(row["RESD_YN"] == _BOOLEAN_TRUE && row.CRUD == "R"){
							saleResdItemCnt++;
						}
						if(row["RESD_YN"] == _BOOLEAN_TRUE && row.CRUD == "C" && row.Checked){
							saleResdItemCnt++;
						}
						if(row["RESD_YN"] == _BOOLEAN_TRUE && row.CRUD == "U" && row.Checked){
							saleResdItemCnt++;
						}
					});
	        		$.each(setDiscntGridRows, function(index,row){
	        			if(row["RESD_YN"] == _BOOLEAN_TRUE && row.CRUD == "R"){
	        				discntResdItemCnt++;	
	        			}
	        			if(row["RESD_YN"] == _BOOLEAN_TRUE && row.CRUD == "C" && row.Checked){
	        				discntResdItemCnt++;	
	        			}
	        			if(row["RESD_YN"] == _BOOLEAN_TRUE && row.CRUD == "U" && row.Checked){
	        				discntResdItemCnt++;	
	        			}
					});
	        	
	        		if(setSaleGridRows.length == 0){
			        	alert("판매그룹 상품을 추가하세요.");
		        		return true;
			        } else if (setSaleGridRows.length < varSaleGrpCmpsQty) {
			        	alert("판매그룹 상품이 구성수량보다 작을수 없습니다.");
		        		return true;
			        };
	        		
	        		if(setDiscntGridRows.length == 0){
			        	alert("할인그룹 상품을 추가하세요.");
		        		return true;
			       	} else if (setDiscntGridRows.length < varDscGrpCmpsQty) {
			       		alert("할인그룹 상품이 구성수량보다 작을수 없습니다.");
		        		return true;
			       	};
			    	
	        		if(saleResdItemCnt == 0){
	        			alert("판매그룹의 대표상품을 선택해주세요.");
	        			return true;
	        		}else if(discntResdItemCnt == 0){
	        			alert("할인그룹의 대표상품을 선택해주세요.");
	        			return true;
	        		}
			       	
	        	};
	        	if(strGoodsTypeCd == _PV_GOODS_TYPE_CD_NMDISCOUNT){	//N+M할인상품 검사 
	        		//판매그룹 구성수량
	        		var varSaleGrpCmpsQty = $("#cmps_qty").val();
	        		var varAddqty = $("#add_qty").val();
	        		var setCmpsGridRows;
	        		var resdItemCnt = 0;
	        		
	        		if(workMode=="upd"){
	        			setCmpsGridRows = setCmpsGrid.GetRows();	
	        		}else{
	        			setCmpsGridRows = setCmpsGrid.GetRows({checked: true});
	        		}
	        		
	        		$.each(setCmpsGridRows, function(index,row){
						if(row["RESD_YN"] == _BOOLEAN_TRUE && row.CRUD == "R"){
							resdItemCnt++;
						}
						if(row["RESD_YN"] == _BOOLEAN_TRUE && row.CRUD == "C" && row.Checked){
							resdItemCnt++;
						}
						if(row["RESD_YN"] == _BOOLEAN_TRUE && row.CRUD == "U" && row.Checked){
							resdItemCnt++;
						}
					});
	        		
	        		if(setCmpsGridRows.length == 0){
			        	alert("구성 상품을 추가하세요.");
		        		return true;
			        } else if (setCmpsGridRows.length < (+varSaleGrpCmpsQty + +varAddqty)) {
			        	alert("구성 상품이 (구성수량  + 추가수량)합보다 작을수 없습니다.");
		        		return true;
			        };
			        
			        if(resdItemCnt == 0){
	        			alert("대표상품을 선택해주세요.");
	        			return true;
	        		}
			        
	        	};
	        	if(strGoodsTypeCd == _PV_GOODS_TYPE_CD_MULTI ) {// 다중구매
	        		var setCmpsGridRows;
	        		if(workMode=="upd"){
	        			setCmpsGridRows = setCmpsGrid.GetRows();
	        		}else{
	        			setCmpsGridRows = setCmpsGrid.GetRows({checked: true});
	        		}
	        		
	        		if(setCmpsGridRows.length == 0){
		        		alert("구성 상품을 추가하세요.");
	        			return true;
	        		};
	        	};
		    }
	        return false;
	    };
		/*상품체크로직 끝*/
	
	});
	    
	    
	    
	    
	    
	    /****************************************************************팝업영역*******************************************************************************/
	    
	    
	    
	    /**
	     * 배송가능지역 찾기 팝업
	     * params:upper_vir_vend_no
	     *        vir_vend_no
	     * 둘중 한개만 넘기면 됨.
	     * 상위사이트 환경변수 배송지역 관리점포속성 관리여부가 N으로 설정시 넘겨진 파라메터들은 검색조건으로 쓰이지않고 전체데이터가 조회됨.
	     */
	    fnDeliPossAreaListPop = function(pin) {
	    	if($("#upper_vir_vend_no").val() == null || $("#upper_vir_vend_no").val() == ""){
	    		alert("출고지정보를 먼저 선택해 주세요.");
	    		$("#srchVendBtn").focus();
	    		return;
	    	}
	    	var pinParam = { rtnFunc:((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetDeliPossAreaInfo"), upper_vir_vend_no:$("#upper_vir_vend_no").val() };
	    	
	    	//form이 존재 하는 경우 
			if (pin.form != undefined && pin.form != "") {
				//해당하는 기본 데이타 셋팅 값을 처리해 준다. 
				$.extend(pinParam, {form : pin.form}); 
			}

			if (pin.param != undefined) {
				$.extend(pinParam, pin.param );
			}
			
	    	var strTitle = (pin.title == undefined) ? "배송지역 조회" : pin.title;
	        var defaultParam = {
	        		url : "/goods/popup/forward.DeliPossAreaPop.action",
	                winname : "DeliPossAreaPop",
	                title : strTitle,
	                width : "760",
	                height : "700",
	                params : pinParam,
	                scrollbars : true,
	                autoresize : false
				};
			pin = $.extend(defaultParam, pin||{});
			popup(pin);
	    }
	    
	    fnSetDeliPossAreaInfo = function(pin) {
			$("input[id=deli_poss_area_grp_no]", $("#" + pin.form)).val(pin.data[0]["DELI_POSS_AREA_GRP_NO"]);
			$("input[id=deli_poss_area_grp_nm]", $("#" + pin.form)).val(pin.data[0]["DELI_POSS_AREA_GRP_NM"]);
		}
	
		/**
	     * 셀링포인트 조회 팝업
	     */
	    fnSellpntListPop = function(pin) {
	    	
	    	var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetSelpntForForm") };
	    	
	    	//form이 존재 하는 경우 
			if (pin.form != undefined && pin.form != "") {
				//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
				$.extend(pinParam ,{form : pin.form}); 
			}
	    	
			if (pin.param != undefined) {
				$.extend(pinParam, pin.param );
			}
	    	var strTitle = (pin.title == undefined) ? "셀링포인트 조회" : pin.title;
	        var defaultParam = {
	        		url : "/goods/popup/forward.SellpntListPop.action",
	                winname : "SellpntListPop",
	                title : strTitle,
	                type : "xl",
	                height : "520",
	                params : pinParam,
	                scrollbars : false,
	                autoresize : false
				};
			pin = $.extend(defaultParam, pin||{});
			popup(pin);
		}
	
	    fnSetSelpntForForm = function(pin) {
			$("input[id=sellpnt_no]", $("#" + pin.form)).val(pin.data[0]["SELLPNT_NO"]);
			$("input[id=sellpnt_cont]", $("#" + pin.form)).val(pin.data[0]["SELLPNT_CONT"]);
		};
    
	    /**
	     * 셀링포인트 적용사이트 정보 보기 레이어
	     */
	    fnInItApplySiteVeiwLayer = function(cell, strSellPntNo){
			
			var url ="/goods/popup/forward.sellpntApplySiteViewLayer.action?sellpnt_no="+strSellPntNo;
			var $content = $("<div />");
			_clicked = false;    
			var layer = createLayer({
	              width:"500px",
	              height:"300px",
				  cell: cell,
	              content:$content.load(url, function() {
	                	//레이어 닫기버튼 클릭시
	                	$content.find("button.button_cls").click(function() {
	                		closeLayer(layer);
	            	    });
	              })
			});
	    };
    
    
	    
		
		
		/**
		 * 옵션속성조회 팝업 오픈 form에서 오픈할 경우
		 * 
		 * @param pin :
		 *            var pin = {form:"schrForm", param:{brand_no:"1111", brand_nm:""}, rtnFunc:"fnOptValListPop"};
		 * @param pin :
		 *            var pin = {form:"schrForm", param:"&brand_no=1111, rtnFunc:"fnOptValListPop"};
		 */
		fnOptValListPop = function(pin) {
			//해당 받는 펑션은 기본으로 셋팅해 준다. 
			var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetOptValForForm") };

			var strTitle = (pin.title == undefined) ? "옵션속성조회" : pin.title;
			
			//form이 존재 하는 경우 
			if (pin.form != undefined && pin.form != "") {
				
				var objForm = $("#" + pin.form)
				var strBrand_no = $("input[id=brand_no]", objForm).val();
				var strBrand_nm = $("input[id=brand_nm]", objForm).val();

				//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
				$.extend(pinParam ,{
					brand_no : (strBrand_no == "undefined") ? "" : strBrand_no,
					brand_nm : (strBrand_nm == "undefined") ? "" : strBrand_nm,
					form : pin.form
				}); 
			}
			
			if (pin.param != undefined) {
				
				$.extend(pinParam, pin.param);
			}

			var defaultParam = {
					url : "/goods/popup/forward.OptValListPop.action",
					winname : "OptValList_pop",
					title : strTitle,
					type : "l",
					height : "400",
					params : pinParam,
					scrollbars : false,
					autoresize : false
				};
			pin = $.extend(defaultParam, pin||{});
			popup(pin);
		};

		OptValForForm = function(pin) {
			$("input[id=opt_val_cd]", $("#" + pin.form)).val(pin.data[0]["OPT_VAL_CD"]);
			$("input[id=opt_val_nm]", $("#" + pin.form)).val(pin.data[0]["OPT_VAL_NM"]);
		};
		
		
		/**
	     *  상품 상세 수정 팝업 
	     *  var pin = {goods_no:goods_no};
	     */
	    fnGoodsUpdPop = function(pin) {
	    	
	        var strTitle = (pin.title == undefined) ? "상품수정" : pin.title;
	        popup({
	            url : "/goods/temporarygoods/initGoodsMgmtPop.action",
	            winname : "GoodsUpd_pop",
	            title : strTitle,
	            width : "1100",
	            height : "800",
	            params : pin,
	            scrollbars : true,
	            autoresize : false
	        });
	    };
	    
	    /**
	     *  임시상품 상세 수정 팝업 
	     *  var pin = {temp_goods_no:temp_goods_no};
	     */
	    fnGoodsInsPop = function(pin) {
	        var strTitle = (pin.title == undefined) ? "상품등록" : pin.title;
	        popup({
	            url : "/goods/temporarygoods/initGoodsMgmtPop.action",
	            winname : "GoodsIns_pop",
	            title : strTitle,
	            width : "1100",
	            height : "800",
	            params : pin,
	            scrollbars : true,
	            autoresize : false
	        });
	    };
	    
	    /**
	     *  파트너 임시상품 상세 수정 팝업 
	     *  var pin = {temp_goods_no:temp_goods_no};
	     */
	    fnSvsGoodsInsPop = function(pin) {
	    	
	        var strTitle = (pin.title == undefined) ? "상품등록" : pin.title;
	        popup({
	            url : "/goods/temporarygoods/initGoodsMgmtPop.action",
	            winname : "GoodsIns_pop",
	            title : strTitle,
	            width : "1100",
	            height : "800",
	            params : pin,
	            scrollbars : true,
	            autoresize : false
	        });
	    };
	    
	    
	    //사이즈별이미지보기 팝업
	    fnGoodsImgViewPop = function(param){
			popup({
	            url : "/goods/goods/initGoodsImgViewPop.action",
	            winname : "GoodsImgViewPop",
	            title : "사이즈별 이미지 보기",
	            params :param,
	            width : "1000px",
	            height : "650px",
	            scrollbars : false,
	            autoresize : false
	        });	
		};
		
	    // 임시상품승인관리 팝업
	    fnGoodsApprMgmtPop = function(pin){
	    	var strTitle = (pin.title == undefined) ? "임시상품승인관리" : pin.title;

	        popup({
	            url : "/goods/temporarygoods/initGoodsApprMgmtPop.action",
	            winname : "GoodsApprMgmtPop",
	            title : strTitle,
	            width : "1000",
	            height : "650",
	            params : pin,
	            scrollbars : true,
	            autoresize : false
	        });
	    };	
	    
	    // 임시상품승인완료 팝업 - VIEW
	    fnGoodsApprViewPop = function(pin){
	    	var strTitle = (pin.title == undefined) ? "임시상품승인완료" : pin.title;

	        popup({
	            url : "/goods/temporarygoods/initGoodsApprViewPop.action",
	            winname : "GoodsApprMgmtPop",
	            title : strTitle,
	            width : "1000",
	            height : "650",
	            params : pin,
	            scrollbars : true,
	            autoresize : false
	        });
	    };
	    
	    /**
	     * 가격이력팝업
	     *  var pin = {goods_no:goods_no};
	     */
	    fnGoodsPriceHistPop = function(param) {
	    	
	    	var defaultParam = {
	    			url : "/goods/goods/initGoodsPriceHistPop.action",
		            winname : "GoodsPriceHistPop",
		            title : "상품가격이력조회",
		            params :param,
		            width : "900",
		            height : "550",
		            scrollbars : true,
		            resizable : false
		    };
	    	
	    	param = $.extend(defaultParam, param||{});
			popup(param);
	    };
	    
	    /**
	     * erp 가격이력팝업
	     *  var pin = {goods_no:goods_no};
	     */
	    fnGoodsErpPriceHistPop = function(param) {
	    	
	    	var defaultParam = {
	    			url : "/goods/goods/initGoodsErpPriceHistPop.action",
		            winname : "GoodsErpPriceHistPop",
		            title : "상품 erp가격이력조회",
		            params :param,
		            width : "860",
		            height : "330",
		            scrollbars : true,
		            resizable : false
		    };
	    	
	    	param = $.extend(defaultParam, param||{});
			popup(param);
	    };
	    
	    /**
	     * 임직원할인관리
	     *  var pin = {goods_no:goods_no, brand_no:brand_no};
	     */
	    fnStaffDcMgmtPop = function(param) {
	    	
	    	var defaultParam = {
	    			url : "/goods/popup/forward.GoodsStaffDcMgmtPop.action",
		            winname : "GoodsPriceHistPop",
		            title : "임직원할인관리",
		            params :param,
		            width : "650",
		            height : "450",
		            scrollbars : true,
		            resizable : false
		    };
	    	
	    	param = $.extend(defaultParam, param||{});
			popup(param);
	    };
	    
	    /**
	     * 임직원할인관리
	     *  var pin = {goods_no:goods_no, brand_no:brand_no};
	     */
	    fnOnlineDcMgmtPop = function(param) {
	    	
	    	var defaultParam = {
	    			url : "/goods/popup/forward.GoodsOnlineDcMgmtPop.action",
		            winname : "GoodsPriceHistPop",
		            title : "온라인할인관리",
		            params :param,
		            width : "650",
		            height : "450",
		            scrollbars : true,
		            resizable : false
		    };
	    	
	    	param = $.extend(defaultParam, param||{});
			popup(param);
	    };
	    
	    /**
	     *  묶음상품 상세 수정 팝업 
	     *  var pin = {goods_no:goods_no};
	     */
	    fnSetCmpsGoodsUpdPop = function(pin) {
	    	
	        var strTitle = (pin.title == undefined) ? "세트상품수정" : pin.title;
	        popup({
	            url : "/goods/temporarygoods/initSetCmpsGoodsMgmt.action",
	            winname : "SetCmpsGoodsUpd_pop",
	            title : strTitle,
	            width : "1100",
	            height : "800",
	            params : pin,
	            scrollbars : true,
	            autoresize : false
	        });
	    };
	    
	    //예약상품등록
	    fnReserveInsPop  = function(pin) { 	
	        var strTitle = (pin.title == undefined) ? "예약상품등록" : pin.title;
	        popup({
	            url : "/goods/popup/forward.GoodsReserveInsPop.action",
	            winname : "ReserveIns_pop",
	            title : strTitle,
	            width : "760",
	            height : "370",
	            params : pin,
	            scrollbars : false,
	            autoresize : false
	        });
	    };
	    
	   // 묶음상품 가격 변경 팝업
        fnSetGoodsPriceListPop = function(pin){
        	var strTitle = (pin.title == undefined) ? "묶음상품가격변경" : pin.title;
            
            var pinParam = {}
            
    		if (pin.param != undefined) {
    			$.extend(pinParam , pin.param);
    		}

    		var defaultParam = {
    				url : "/goods/goods/initSetGoodsPriceUpdPop.action",
    				winname : "SetGoodsPrice_pop",
    				title : strTitle,
    				type : "l",
    				height : "550",
    				params : pinParam,
    				scrollbars : false,
    				autoresize : false
    			};
    		pin = $.extend(defaultParam, pin||{});
    		popup(pin);
        };
        
        // 일반상품 가격 변경 팝업
        fnGenGoodsPriceListPop = function(pin){
        	var strTitle = (pin.title == undefined) ? "일반상품가격변경" : pin.title;

            popup({
                url : "/goods/goods/initGeneralGoodsPriceUpdPop.action",
                winname : "GeneralGoodsPriceUpd_pop",
                title : strTitle,
                type : "l",
                height : "500",
                params : pin,
                scrollbars : true,
                autoresize : false
            });
        };	    
	    
	    // 업체추가
	    fnSetAddVend = function(pin){
	    	var varGoods_no = $('#goods_no').val();

	    	if(pin.data[0]["PRGS_STAT_CD"] == "30") {
	    		alert("거래중지된 업체입니다.");
	    		return;
	    	}
	    	
	    	// 업체관련 영역 초기화
			$.ajax({
				url:"/goods/temporarygoods/registVendAdd.action", 
				dataType: "json",
				data: {goods_no:varGoods_no, vir_vend_no:pin.data[0]["VIR_VEND_NO"], low_vend_no:pin.data[0]["LOW_VEND_NO"]},
				async: false,
			    success : function(data){
			    	
			    	if(data.code == "F"){
			    		if(data.msg == ""){
			    			 alert("상품업체 추가 중 오류가 발생 되었습니다.");
			    		}else{
			    			alert(data.msg);
			    		}
			    	}else{
				    	if(confirm("상품업체가 추가되었습니다. \r상품업체의 기본정보를 등록 하시겠습니까?")){
				    		//가상업체추가 화면 활성화 하기
				    		var paramPin = {temp_goods_no:data.temp_goods_no, goods_no:varGoods_no, vir_vend_no:pin.data[0]["VIR_VEND_NO"]};
				    		fnGoodsVendAddPop(paramPin);
				    	}
			    	}
			    },
			    error: function(p) {	//iframe이 true 일 경우 submit후 호출됨
					 alert("상품업체 추가 중 오류가 발생 되었습니다.");
				}
		    });
	    };
	    
	    // 가상업체추가 기본정보 팝업창 호출하기 
	    fnGoodsVendAddPop = function(pin){	    	
	    	var strTitle = (pin.title == undefined) ? "상품업체추가팝업" : pin.title;
	        popup({
	            url : "/goods/goods/initGoodsVendAddPop.action",
	            winname : "GoodsVendAdd_Pop",
	            title : strTitle,
	            width : "1000",
	            height : "700",
	            params : pin,
	            scrollbars : true,
	            autoresize : false
	        });
	    };	 
	    
		/**
		 * SKU/재고정보 팝업 오픈 form에서 오픈할 경우
		 * 
		 * @param pin :
		 *            var pin = {form:"schrForm", param:{goods_no:"1111"}};
		 * @param pin :
		 *            var pin = {form:"schrForm", param:"&goods_no=1111"};
		 */
		fnItemStockListPop = function(pin) {
			//해당 받는 펑션은 기본으로 셋팅해 준다. 
			var pinParam = {};

			var strTitle = (pin.title == undefined) ? "옵션/재고정보" : pin.title;
			
			//form이 존재 하는 경우 
			if (pin.form != undefined && pin.form != "") {
				
				var objForm = $("#" + pin.form)
				var strGoods_no = $("input[id=goods_no]", objForm).val();

				//해당 하는 기본 데이타 셋팅 값을 처리해 준다. 
				$.extend(pinParam ,{
					goods_no : (strGoods_no == "undefined") ? "" : strGoods_no,
					form : pin.form
				}); 
			}
			
			if (pin.param != undefined) {
				
				$.extend(pinParam, pin.param);
			}

			var defaultParam = {
					url : "/goods/goods/initItemStockListPop.action",
					winname : "ItemStockList_pop",
					title : strTitle,
					type : "m",
					height : "400",
					params : pinParam,
					scrollbars : false,
					autoresize : false
				};
			pin = $.extend(defaultParam, pin||{});
			popup(pin);
		};	
		
	    /**
	     * 옵션변경팝업
	     */    
		fnItemChangePop = function(pin) {
	    	var strTitle = (pin.title == undefined) ? "옵션변경" : pin.title;

	        popup({
	            url : "/goods/goods/initGoodsItemChangePop.action",
	            winname : "ItemChangePop",
	            title : strTitle,
	            width : "900",
	            height : "650",
	            params : pin,
	            scrollbars : true,
	            autoresize : false
	        });
	    };
	    
	    /**
	     * 상품분류가이드관리팝업
	     */    
		fnClssGuidePwrdPop = function(pin) {
	    	var strTitle = (pin.title == undefined) ? "상품분류가이드관리" : pin.title;

	        popup({
	            url : "/goods/popup/forward.ClssGuidePrwdMgmtPop.action",
	            winname : "ItemChangePop",
	            title : strTitle,
	            width : "700",
	            height : "400",
	            params : pin,
	            scrollbars : true,
	            autoresize : false
	        });
	    };	    
	    
	    /**
	     * 상품상세미리보기
	     */    
	    fnGoodsPreview = function(){
	    	if($("#site_no_slct").val() == ""){
				alert("미리보기할 사이트를 선택해 주세요.");
				$("#site_no_slct").focus();
				return;
			}
			$.ajax({
	            url: "/system/site/getFrontUrl.action",
	            dataType: "json",
	            data:{prop_no:_ST_SYS_PROP_SITE_DOMAIN_ENV, rel_no:$("#site_no_slct").val()},
	            async: false,
	            success : function(data) { 
	            	if(data.frontUrl == null || data.frontUrl == ""){
	            		alert("프론트URL 정보가 업습니다.\n다른사이트를 선택해 주세요.");
	            		$("#site_no_slct").focus();
	            	} else {
	            		popup({
	                        url : "http://"+data.frontUrl+"/goods/initGoodDetail.action",
	                        winname : "_POPUP_",
	                        title : "상품상세미리보기",
	                        params : {goods_no:strGoodsNo,previewYn:'Y', goodYn:'Y'},
	                        method: "get",
	                        scrollbars : true,
	                        width : "1280px",
	                        height : "720px"
	                    }); 
	            	}
	            }
	        });
	    };
	    
	    
    
	    /**
	     *  SKU관리팝업 
	     *  var param = {goods_no : goods_no,
	     *  vir_vend_no : vir_vend_no, 
	     *  brand_no:brand_no};그리드 색상 콤보박스 생성에 필요함.
	     */
	    fnItemMgmtPop = function(param) {
	        var strTitle = (param.title == undefined) ? "SKU관리" : param.title;
	        popup({
	            url : "/goods/goods/initItemMgmtPop.action",
	            winname : "ItemMgmtPop",
	            title : strTitle,
	            width : "1100",
	            height : "500",
	            params : param,
	            scrollbars : true,
	            autoresize : false
	        });
	    };
	    
		/**
	     *  고시정보 Excel 데이터 팝업 
	     */
		fnGoodsClssGuidePop = function(pin) {
			//해당 받는 펑션은 기본으로 셋팅해 준다. 
			var strTitle = (pin.title == undefined) ? "고시정보 Excel데이터만들기" : pin.title;
			popup({
				url : "/goods/temporarygoods/initGoodsClssGuideExcelPop.action",
	            winname : "GoodsClssGuide_pop",
	            title : strTitle,
	            width: "800",
	            height: "450",
	            params : pin,
	            scrollbars : true,
	            autoresize : false
			});
			return;
		};
		/**
	     *  상품메모 등록/수정 레이어 
	     */
		fnGoodsMemoLayer = function(rel_no, goods_nm, grid, mode){
			var $content = $("<div />");
            _clicked = false;    
            var layer = createLayer({
            	width:"450px",
                height:"220px",
                content:
                	$content.load('/goods/popup/forward.GoodsMemoLayer.action',{rel_no: rel_no, goods_nm: goods_nm, mode:mode},
	                                function() {
                						if(mode=="R"){
                							$content.find("#saveBtn").hide();
                							$content.find("#log_title").attr("readonly",true);
                							$content.find("#sys_log_cont").attr("readonly",true);
                						}
                		
	                            		$content.find("#saveBtn").click(function(){
	                            			$.form($content.find("#memoForm")).submit({
	                            				action:"/goods/goods/registGoodsMemo.action",
	                            				iframe: true,
	                            				success: function(p) {
	                            					$.form($content.find("#memoForm")).run(false);
	                            					if(p.work_gubun == "C"){
	                            						msgSuccess("C");
	                            					}else{
	                            						msgSuccess("U");
	                            					}
	                            					var row = grid.GetRow();	 
	                            					grid.SetValue({
	                            						row: row.Index,
	                            						id: "SYS_LOG_CONT",
	                            						value: p.sys_log_cont
	                            					});
	                            					closeLayer(layer);
	                            				},
	                            				error: function(p) {	//iframe이 true 일 경우 submit후 호출됨
	                            					alert(p.error_message);
	                            				},
	                            				confirm: function() {	//confirm에 대한 개별 구현 가능. check(), valid()까지 모두 통과되었다면 그 다음에 호출됨
	                            					return msgConfirm("S");
	                            				}
	                            			});
                						});
	                                    $content.find("button.button_cls").click(function() {
	                                        closeLayer(layer);
	                                    });
                					})
            });
		}
		/**
	     *  이미지 Layer 
	     */

		fnGoodsImgLayer = function(img_path,rs){
			var $content = $("<div />");
            _clicked = false;
            
            if(rs!=null && rs!=""){
            	img_path = img_path.split("?")[0] + "?RS="+rs+"&SP=1";
            }
            
            var layer = createLayer({
            	width:"600px",
                height:"400px",
                content:
                	$content.load('/goods/popup/forward.BrandImgLayer.action',{img_path: img_path},  
	                                function() {
	                                    $content.find("button.button_cls").click(function() {
	                                        closeLayer(layer);
	                                    });
                					})
            });
		}
		
		/**
	     *  필터정보 Excel 데이터 팝업 
	     */
		fnFilterInfoPop = function(pin) {
			//해당 받는 펑션은 기본으로 셋팅해 준다. 
			var strTitle = (pin.title == undefined) ? "필터정보Excel데이터만들기" : pin.title;
			popup({
				url : "/goods/popup/forward.FilterInfoPop.action",
	            winname : "filterInfo_pop",
	            title : strTitle,
	            width: "600",
	            height: "450",
	            params : pin,
	            scrollbars : true,
	            autoresize : false
			});
			return;
		};
		

		/**
	     *  색상칩 번호 조회 팝업 
	     */
		fnColorChipInfoPop = function(pin) {
			//해당 받는 펑션은 기본으로 셋팅해 준다. 
			var strTitle = (pin.title == undefined) ? "색상칩번호조회" : pin.title;
			popup({
				url : "/goods/popup/forward.ColorChipInfoPop.action",
	            winname : "colorChipInfoPop_pop",
	            title : strTitle,
	            width: "600",
	            height: "450",
	            params : pin,
	            scrollbars : true,
	            autoresize : false
			});
			return;
		};
		
		/**
	     *  필터정보 팝업
	     */
		fnFilterInfoListPop = function(pin) {
			//해당 받는 펑션은 기본으로 셋팅해 준다. 
			var strTitle = (pin.title == undefined) ? "필터정보" : pin.title;
			popup({
				url : "/goods/popup/forward.FilterInfoListPop.action",
	            winname : "filterInfo_pop",
	            title : strTitle,
	            width: "700",
	            height: "450",
	            params : pin,
	            scrollbars : true,
	            autoresize : false
			});
			return;
		};
		
		/**
	     *  고시정보List 팝업
	     */
		fnGoodsClssGuideListPop = function(pin) {
			//해당 받는 펑션은 기본으로 셋팅해 준다. 
			var strTitle = (pin.title == undefined) ? "고시정보" : pin.title;
			popup({
				url : "/goods/temporarygoods/initGoodsClssGuideListPop.action",
	            winname : "goodsClssGuideList_pop",
	            title : strTitle,
	            width: "700",
	            height: "450",
	            params : pin,
	            scrollbars : true,
	            autoresize : false
			});
			return;
		};
	/*documenteRead END*/
})(jQuery);