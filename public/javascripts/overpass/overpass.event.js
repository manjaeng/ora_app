var varRankSeq = 1;
var varCondSeq = 1;
var varTypeSeq = 1;
var varRankStageSeq = 1;
var varSiteNo = "";
var varEventType = "";
var varAssetResouDiviCdHtml = "";
var _EVENT_NO = "";
//회계번호
var erpAcntUnitCd = "G99";
var acntNo = "00000000";
    
(function ($) {
	
	// 이벤트 종류 변경에 따른 화면 셋팅
	fnSetManyByEventKindCd = function(mode, event_type, applySiteNo){
		var varEventKindCd = ("detail" == mode) ? event_type : $("#event_kind_cd").val();
		var link_check = 0;
	    var linkResetTarget = $("#entry_cond_type_cd , #entry_cnt_type_cd, #draw_mean_cd, #win_type_cd, #present_cond_limit_cd, #premium_type_cd")
	    	, linkResetDtimeTarget = $("#entry_start_dtime, #entry_end_dtime")
	    	, linkResetDateTarget = $("#win_anno_date");
	    
	    varEventType = varEventKindCd;
	    fnInitDisplay(mode);		// 초기화
	    
		if ( varEventKindCd == "" ){
			return;
		}
		
	    //이벤트 종류가 단순링크인 이벤트 저장시 유효성 체크 PASS를 위한 세팅
		if ($('#issue_targ_yn_chk').is(':checked')) {
			$('#issue_targ_yn_chk').removeAttr('checked', false);
		}

	    if(varEventKindCd == _EV_EVENT_KIND_CD_LINK) {
	    	$("#entry_cond_type_cd").val(_EV_ENTRY_COND_TYPE_CD_NONE);
	    	$("#entry_cnt_type_cd").val(_EV_ENTRY_CNT_TYPE_CD_UNLIMITED);
	    	$("#draw_mean_cd").val(_EV_DRAW_MEAN_CD_NON_DRAW);
	    	$("#win_type_cd").val(_EV_WIN_TYPE_CD_BATCH);
	    	$("#present_cond_limit_cd").val(_EV_PRESENT_COND_LIMIT_CD_ONE);
	    	$("#premium_type_cd").val(_EV_PREMIUM_TYPE_CD_ETC);
	    	
            $("#goods_prt_type_no_pc > option").eq(0).val("0");
            $("#goods_prt_type_no_mo > option").eq(0).val("0");
            $("#best_goods_prt_type_no_pc > option").eq(0).val("0");
            $("#best_goods_prt_type_no_mo > option").eq(0).val("0");
            
	    	linkResetDtimeTarget.val(_DEFAULT_END_DTIME);
	    	linkResetDateTarget.val(_DEFAULT_END_DAY);
	    	link_check++;
	    	$("#eventGoodsInfo").show();			// 이벤트 상품정보
	    	$("#eventRelContInfo").show();			// 연관매거진정보
	    	$("#eventEnteryCond").show();			// 응모조건
	    	$("label[for=date41]").parents("tr").hide();	// 안내형 마케팅수신여부체크를위한
	    	$("label[for=info44]").parents("tr").hide();	// 안내형 마케팅수신여부체크를위한
		    $("#eventElementInfo").show();			// 이벤트 요소
		    $('#eventApplyGoodsGrid_hd').hide();
		    $('#eventApplyBestGoodsGrid_hd').hide();
		    $('#issue_targ_yn_chk').removeAttr('disabled');

	    } else if ( varEventKindCd == _EV_EVENT_KIND_CD_ONEDAYDEAL ) {
	    	$("#entry_cond_type_cd").val(_EV_ENTRY_COND_TYPE_CD_NONE);
	    	$("#entry_cnt_type_cd").val(_EV_ENTRY_CNT_TYPE_CD_UNLIMITED);
	    	$("#draw_mean_cd").val(_EV_DRAW_MEAN_CD_NON_DRAW);
	    	$("#win_type_cd").val(_EV_WIN_TYPE_CD_BATCH);
	    	$("#present_cond_limit_cd").val(_EV_PRESENT_COND_LIMIT_CD_ONE);
	    	$("#premium_type_cd").val(_EV_PREMIUM_TYPE_CD_ETC);

            $("#best_goods_prt_type_no_pc > option").eq(0).val("0");
            $("#best_goods_prt_type_no_mo > option").eq(0).val("0");
            
	    	linkResetDtimeTarget.val(_DEFAULT_END_DTIME);
	    	linkResetDateTarget.val(_DEFAULT_END_DAY);
	    	link_check++;
	    	$("#eventGoodsInfo").show();			// 이벤트 상품정보
	    	$("#eventRelContInfo").show();			// 연관매거진정보
	    	$("label[for=date41]").parents("tr").hide();	// 안내형 마케팅수신여부체크를위한
	    	$("label[for=info44]").parents("tr").hide();	// 안내형 마케팅수신여부체크를위한
	    	
            $('select[name=goods_prt_type_no_pc]').css('width', '100%');
            $('select[name=goods_prt_type_no_mo]').css('width', '100%');
            $('select[name=goods_prt_type_no_pc]').attr('disabled', false);
            $('select[name=goods_prt_type_no_mo]').attr('disabled', false);

            $('select[name=best_goods_prt_type_no_pc]').css('width', '100%');
            $('select[name=best_goods_prt_type_no_mo]').css('width', '100%');
            $('select[name=best_goods_prt_type_no_pc]').attr('disabled', false);
            $('select[name=best_goods_prt_type_no_mo]').attr('disabled', false);
            
            $('#eventApplyGoodsGrid_hd').show();
            $('#select_section').show();
            
	    } else {
	    	if(link_check > 0) {
	    		linkResetTarget.val("");
	    	    linkResetDtimeTarget.val("");
	    	    linkResetDateTarget.val("");
	    		link_check = 0;
	    	}
		    $("#eventEnteryCond").show();			// 응모조건
		    $("label[for=date41]").parents("tr").show();	// 안내형 마케팅수신여부체크를위한
	    	$("label[for=info44]").parents("tr").show();	// 안내형 마케팅수신여부체크를위한
		    $("#eventWinnerCondInfo").show();	// 당첨조건
		    $("#eventGiftInfo").show();				// 경품정보
		    $("#eventGoodsInfo").show();			// 이벤트 상품정보
	    	$("#eventRelContInfo").show();			// 연관매거진정보
		    $("#eventElementInfo").show();			// 이벤트 요소
		    $("#draw_mean_cd").removeAttr("disabled");
		    $('#issue_targ_yn_chk').removeAttr('disabled');

		    if (varEventKindCd == _EV_EVENT_KIND_CD_GATHER) {
                $('select[name=goods_prt_type_no_pc]').css('width', '100%');
                $('select[name=goods_prt_type_no_mo]').css('width', '100%');
                $('select[name=goods_prt_type_no_pc]').attr('disabled', false);
                $('select[name=goods_prt_type_no_mo]').attr('disabled', false);
                
                $('select[name=best_goods_prt_type_no_pc]').css('width', '100%');
                $('select[name=best_goods_prt_type_no_mo]').css('width', '100%');
                $('select[name=best_goods_prt_type_no_pc]').attr('disabled', false);
                $('select[name=best_goods_prt_type_no_mo]').attr('disabled', false);
                
			    $('#tab_0').hide();
			    $('#select_section').show();
			    
			    if (deal_use_yn == 'Y') {
			    	$('#eventApplyGoodsPrtType').show();
			    }
			    if (best_use_yn == 'Y') {
			    	$('#eventApplyBestGoodsGrid_hd').show();
			    }

			} else {
                $("#goods_prt_type_no_pc > option").eq(0).val("0");
                $("#goods_prt_type_no_mo > option").eq(0).val("0");
                $("#best_goods_prt_type_no_pc > option").eq(0).val("0");
                $("#best_goods_prt_type_no_mo > option").eq(0).val("0");
			}
		    
		    // 게시판(응모조건, 당첨조건. 회차생성, 경품정보, 게시판, 이벤트요소)
			if(varEventKindCd == _EV_EVENT_KIND_CD_BBS){
				$("#bbsDiv").show();
			}// 설문투표/퀴즈(응모조건, 당첨조건. 회차생성, 경품정보, 설문투표)
			else if( varEventKindCd == _EV_EVENT_KIND_CD_POLL || 	varEventKindCd == _EV_EVENT_KIND_CD_QUIZ	){
				$("#pollDiv").show();
				
				if("detail"==mode) {
					fnSearchPoll(mode, applySiteNo);
				} else {
					fnSearchPoll("init");
				}
			}// 선착순/즉석(응모조건, 당첨조건. 회차생성. 즉석당첨정보, 경품정보, 이벤트요소)
			else if( varEventKindCd == _EV_EVENT_KIND_CD_ARRIVAL || varEventKindCd == _EV_EVENT_KIND_CD_SPOTWIN	){	
				$("#spotDiv").show();
			}// 구매사은
			else if(varEventKindCd == _EV_EVENT_KIND_CD_PURCHASE_GIFT){
				$("#buyDrawDiv").show();
				$("#addApplyBtn").show(); 			//적용추가버튼 보이기
			}
			
			// 이벤트 종류별 값 세팅
			fnSetKindCdBySelect(varEventKindCd);
	    }
	};
	
	// 이벤트 종류별 값 세팅
	fnSetKindCdBySelect = function(varEventKindCd){
		// 응모조건유형 세팅
		if(varEventKindCd == _EV_EVENT_KIND_CD_PURCHASE_GIFT){			// 구매사은
			 fnSelectDisabled($("#entry_cond_type_cd"), _EV_ENTRY_COND_TYPE_CD_SHOPPER, true);	// 응모조건유형-구매자
		}
		
		// 추첨방식 세팅(즉석당첨/구매사은/출석체크)
		if( varEventKindCd == _EV_EVENT_KIND_CD_SPOTWIN || 	
			varEventKindCd == _EV_EVENT_KIND_CD_PURCHASE_GIFT ||
			varEventKindCd == _EV_EVENT_KIND_CD_ATTEND){								// 즉석당첨
			fnSelectDisabled($("#draw_mean_cd"), _EV_DRAW_MEAN_CD_AUTO, true);	// 추첨방식-자동
		}
		
		// 당첨유형 세팅
		if( varEventKindCd == _EV_EVENT_KIND_CD_ARRIVAL ){	// 선착순
			$("#win_type_cd").children("[value=" + _EV_WIN_TYPE_CD_SPOT_WIN + "]").remove();	// 즉석당첨불가
		}else if( varEventKindCd == _EV_EVENT_KIND_CD_SPOTWIN ){	// 즉석당첨
			fnSelectDisabled($("#win_type_cd"), _EV_WIN_TYPE_CD_SPOT_WIN, true);		// 당첨유형-즉석당첨
		}else if(varEventKindCd == _EV_EVENT_KIND_CD_ATTEND){					// 출석체크
			fnSelectDisabled($("#win_type_cd"), "", false);
			$('#issue_targ_yn_chk').attr('disabled', true);
			$("#win_type_cd").children("[value=" + _EV_WIN_TYPE_CD_ARRIVAL + "]").remove();	// 선착순불가
		}else{
			fnSelectDisabled($("#win_type_cd"), _EV_WIN_TYPE_CD_BATCH, true);	// 당첨유형-일괄추첨
		}
		
		// 추첨범위 세팅
/*		if( varEventKindCd == _EV_EVENT_KIND_CD_ATTEND ){			// 출석체크
			fnSelectDisabled($("#draw_scope_cd"), "", false);	// 추첨범위 - 제한없음
		}else{
			fnSelectDisabled($("#draw_scope_cd"), _EV_DRAW_SCOPE_CD_EVENT, true);		// 추첨범위 - 이벤트
		}*/
		
		// 당첨조건유형 셋팅
		if(varEventKindCd == _EV_EVENT_KIND_CD_BBS){									// 게시판 - 출석횟수/정답/최고점수/득점율 사용안함
			$("[name=win_cond_type_cd]").children("[value=" + _EV_WIN_COND_TYPE_CD_RIGHT_ANSWER + "]").remove();
	        $("[name=win_cond_type_cd]").children("[value=" + _EV_WIN_COND_TYPE_CD_HIGH_SCORE + "]").remove();
	        $("[name=win_cond_type_cd]").children("[value=" + _EV_WIN_COND_TYPE_CD_ATTEND_CNT + "]").remove();
	        $("[name=win_cond_type_cd]").children("[value=" + _EV_WIN_COND_TYPE_CD_SCORE_RATIO + "]").remove();
		}else if(varEventKindCd == _EV_EVENT_KIND_CD_ATTEND){					// 출석체크	- 정답/최고점수/득점율/글자수 사용안함
	        $("[name=win_cond_type_cd]").children("[value=" + _EV_WIN_COND_TYPE_CD_RIGHT_ANSWER + "]").remove();
	        $("[name=win_cond_type_cd]").children("[value=" + _EV_WIN_COND_TYPE_CD_HIGH_SCORE + "]").remove();
	        $("[name=win_cond_type_cd]").children("[value=" + _EV_WIN_COND_TYPE_CD_SCORE_RATIO + "]").remove();
	        $("[name=win_cond_type_cd]").children("[value=" + _EV_WIN_COND_TYPE_CD_TEXT_CNT + "]").remove();
		}else if(varEventKindCd == _EV_EVENT_KIND_CD_QUIZ){						// 퀴즈 - 출석횟수/글자수/최고점수 사용안함
	        $("[name=win_cond_type_cd]").children("[value=" + _EV_WIN_COND_TYPE_CD_ATTEND_CNT + "]").remove();
	        $("[name=win_cond_type_cd]").children("[value=" + _EV_WIN_COND_TYPE_CD_TEXT_CNT + "]").remove();
	        $("[name=win_cond_type_cd]").children("[value=" + _EV_WIN_COND_TYPE_CD_HIGH_SCORE + "]").remove();
		}else if(varEventKindCd == _EV_EVENT_KIND_CD_GAME){						// 게임 - 출석횟수/정답/득점율/글자수 사용안함
			$("[name=win_cond_type_cd]").children("[value=" + _EV_WIN_COND_TYPE_CD_RIGHT_ANSWER + "]").remove();
	        $("[name=win_cond_type_cd]").children("[value=" + _EV_WIN_COND_TYPE_CD_ATTEND_CNT + "]").remove();
	        $("[name=win_cond_type_cd]").children("[value=" + _EV_WIN_COND_TYPE_CD_SCORE_RATIO + "]").remove();
	        $("[name=win_cond_type_cd]").children("[value=" + _EV_WIN_COND_TYPE_CD_TEXT_CNT + "]").remove();
		}else{
			// 출석횟수/정답/최고점수/득점율/글자수는 보통의 경우 사용하지 않음
	        $("[name=win_cond_type_cd]").children("[value=" + _EV_WIN_COND_TYPE_CD_RIGHT_ANSWER + "]").remove();
	        $("[name=win_cond_type_cd]").children("[value=" + _EV_WIN_COND_TYPE_CD_HIGH_SCORE + "]").remove();
	        $("[name=win_cond_type_cd]").children("[value=" + _EV_WIN_COND_TYPE_CD_ATTEND_CNT + "]").remove();
	        $("[name=win_cond_type_cd]").children("[value=" + _EV_WIN_COND_TYPE_CD_SCORE_RATIO + "]").remove();
	        $("[name=win_cond_type_cd]").children("[value=" + _EV_WIN_COND_TYPE_CD_TEXT_CNT + "]").remove();
		}
	}
	
	// 화면 초기화
	fnInitDisplay = function(mode){
		// selectbox 내용 초기화
		var resetSelectBox = $("#draw_mean_cd, #win_type_cd, #entry_cond_type_cd");
		var resetCheckBox = $("#deal_use_yn_chk, #best_use_yn_chk");
		resetSelectBox.empty();
		resetCheckBox.prop('checked', false);
        $("#draw_mean_cd").append(orgDrawMeanCdSel);
        $("#win_type_cd").append(orgWinTypeCdSel);
        $("#entry_cond_type_cd").append(orgEntryCondTypeCdSel);
        resetSelectBox.val("");
        varSiteNo = ""; 	// siteNo 초기화
        
        // 그리드 숨김처리
        $('div[role=hideGrid], tr[role=hideGrid]').hide();
        	
        // 그리드 초기화
		if(bbsClssGrid.GetRowCount() > 0){
			bbsClssGrid.DeleteCreateRows();
		}
		if(eventSpotGrid.GetRowCount() > 0){
			eventSpotGrid.DeleteCreateRows();
		}
		if(eventFactorGrid.GetRowCount() > 0){
			eventFactorGrid.DeleteCreateRows();
		}
		if(mbChoiceGrid.GetRowCount() > 0){
			mbChoiceGrid.DeleteCreateRows();
		}
		if(magazineGrid.GetRowCount() > 0){
			magazineGrid.DeleteCreateRows();
		}
		if(eventApplyGoodsGrid.GetRowCount() > 0){
			eventApplyGoodsGrid.DeleteCreateRows();
		}
        if(eventApplyDayGoodsGrid.GetRowCount() > 0){
            eventApplyDayGoodsGrid.DeleteCreateRows();
        }
		if(eventApplyBestGoodsInfoGrid.GetRowCount() > 0){
			eventApplyBestGoodsInfoGrid.DeleteCreateRows();
		}
		
//		$("#premium_type_cd").attr("style", "width:95%");
		
		if ("detail"!=mode) {
			$("#premiumInfo").empty();
			$("[name=win_cond_type_cd]").empty();
	        $("[name=win_cond_type_cd]").append(orgWinCondTypeCdSel);
	        $("[name=win_cond_type_cd]").val("");
	        $("#win_anno_date").val("");
	        $("label[for=einfo2]").hide();
	        $("#win_prize_yn").hide();
	        $("#win_stand_prize").hide();
	        $("#w_prize_nm").hide();
	        $("[name=rank_info]").hide();
			$('#issue_targ_tb').hide();
			$('#saveMgzBtn').hide();
			fnRankDisplay(null, false);
		}
	};
	
	// 상위이벤트 저장
    fnSaveUpperEvent = function(pin){
        $("[id$=_chk]").each(function(){
        	var obj = $(this).parent();
        	if($(this).is(":checked")){
                $("#" + $(this).attr("name").substring(0, $(this).attr("name").length-4), obj).val(_BOOLEAN_TRUE);
            }else{
            	$("#" + $(this).attr("name").substring(0, $(this).attr("name").length-4), obj).val(_BOOLEAN_FALSE);
            }
        });

        // 유효성 체크
		if(!$.form("#eventForm").check({})){
			return;
        }
        
		$.form("#eventForm").submit({
			action:"/event/event/registUpperEvent.action",
			iframe: true,
			success: function(p) {
				self.close();
				opener.$("#srchBtn").click();
			},
			error: function(p) {	//iframe이 true 일 경우 submit후 호출됨
				alert(p.error_message);
			},
			confirm: function() {	//confirm에 대한 개별 구현 가능. check(), valid()까지 모두 통과되었다면 그 다음에 호출됨
				return msgConfirm("S");
			}
		});
		
    };
	
	// 이벤트 저장
    fnSaveEvent = function(mode){
    	//값 setting
        $("[id$=_sel]").each(function(){
            $("#" + $(this).attr("name").substring(0, $(this).attr("name").length-4)).val($(this).val());
        });
        $("[id$=_chk]").each(function(){
        	var obj = $(this).parent();
        	if($(this).is(":checked")){
                $("#" + $(this).attr("name").substring(0, $(this).attr("name").length-4), obj).val(_BOOLEAN_TRUE);
            }else{
            	$("#" + $(this).attr("name").substring(0, $(this).attr("name").length-4), obj).val(_BOOLEAN_FALSE);
            }
        });

        // 차수 삭제
        eventChasuGrid.DeleteCreateRows();
        if(fnCreateChasu()){	// 차수 생성( 항상 기본회차생성)
        	return;
        }
        
        // 유효성 체크
        if(fnCheckEvent(mode)){
            return;
        }
        
        // 등수 - 회차 - 당첨조건 - 경품유형 연결을 위한 연계키 생성하기
        // step1 - 등수에 가상키 생성하기
        $("[name=temp_rank_no]", $.form("#eventForm")).each(function(idx, val){
        	$(this).val("R" + (idx+1));
        });
        
        // step2 - 회차에 가상키 연결하기
        $("[name=stage_rel_no]", $.form("#eventForm")).each(function(idx, val){
        	var parentObj = $(this).closest("tbody");
        	$(this).val($("#temp_rank_no", parentObj).val());
        });
        
        // step3 - 당첨조건에 가상키 연결하기
        $("[name=cond_rel_no]", $.form("#eventForm")).each(function(idx, val){
        	var parentObj = $(this).closest("tbody");
        	$(this).val($("#temp_rank_no", parentObj).val());
        });
        
        // step4 - 경품유형에 가상키 연결하기
        $("[name=premium_rel_no]", $.form("#eventForm")).each(function(idx, val){
        	var parentObj = $(this).closest("tbody");
        	$(this).val($("#temp_rank_no", parentObj).val());
        });

        // 저장시에 disabled처리된것 다 풀기
        fnDisabeldDateUnChk();

        eventApplyGrid.DoSave({
            action:"/event/event/registEvent.action",
            group:[/*eventBaseBannerGrid,*/ eventChasuGrid, eventSpotGrid, eventFactorGrid, bbsClssGrid, mbChoiceGrid, magazineGrid, eventApplyGoodsGrid,  eventApplyDayGoodsGrid, eventApplyBestGoodsInfoGrid ],
            form:["eventForm"]
        });
    };
    
/*    fnBestGoodsTab = function(idx){
    	    	if (idx == '0') {
    	    		console.log('사용하지 않는 코너 : disabled');
    	    		return false;
    	    	}
    	    	var tabTotCnt = $(".tit_tabs ul li").size();
    	    	fnTab(tabTotCnt, 'type_tab', idx, 'info2_cont');
    			
    	    	for (var i = 0; i < tabTotCnt; i++) {
    	    		if ($('#eventApplyBestGoodsGrid_hd> table').eq(i+1).attr('id') == 'tab_' + idx) {
    	    			$('#tab_' + i).show();
    	    		} else {
    	    			$('#tab_' + i).hide();
    	    		}
    	    	}
    			
    	    }*/

    
	// 담당자 조회
	fnSearchUser = function(){
		fnUserListPopForForm({
			callback:function(pin){
				$("#charge_id").val(pin.data[0]["USER_ID"]);
				$("#charge_nm").val(pin.data[0]["USER_NM"]);
			}
		});
	};
	
	// 설문조회
	fnSearchPoll = function(path, site_no){
		var varTempSiteNo = "";
		var rowCnt = eventApplyGrid.GetRows();
		var passYn = "Y";
        
		if("detail" == path) {
			varTempSiteNo = site_no;
		} else {
			$.each(rowCnt, function(idx, row){
	            if(row["APPLY_EXP_DIVI_CD"] == _PR_APPLY_EXP_DIVI_CD_APPLY &&
	            		row["ENTRY_APPLY_EXP_TYPE_CD"] == _EV_ENTRY_APPLY_EXP_TYPE_CD_SITE){
	            	varTempSiteNo = row["APPLY_VAL1"];
	            }
	        });	
		}
		
		if (path ==  undefined && (isEmpty($("#entry_start_dtime")) || isEmpty($("#entry_end_dtime"))) ) {
			alert("설문 리스트를 조회 하려면 응모일시를 설정해야 합니다.");
			passYn = "N";
			return;
		}	
		
		if(varTempSiteNo == "" && path != "init"){
			alert("'이벤트 응모 적용대상'에 사이트를 지정해주세요.");
			return;
		}
		
		$.ajax({
       	 	type: "POST",
            url: "/content/poll/searchCtPollList.action",
            dataType: "json",
            data: {poll_type_cd : _CT_POLL_TYPE_CD_EVENT,
            	   site_no : varTempSiteNo,
            	   start_date : (entry_start_dtime != "") ? entry_start_dtime : $("#entry_start_dtime").val().substring(0, 10).replaceAll("-", ""),
            	   end_date : (entry_end_dtime != "") ? entry_end_dtime : $("#entry_end_dtime").val().substring(0, 10).replaceAll("-", "")},
            async: false,
            success : function(data) {
            	var pollList = data.lPollList;
            	
            	$("#rel_no").empty();
                for(var idx = 0; idx < pollList.length; idx++){
                	$("#rel_no").append("<option value='" + pollList[idx].poll_no + "'>" + pollList[idx].poll_nm +"</option>");
                }
            }
       });
	};
	
	// 상품구좌노출
	fnExposGoodsArea = function(obj){
		var objId = $(obj).attr('id');
		var upperId = '';
		if (objId == 'deal_use_yn_chk') {
			//upperId = 'onedeal_section';
			upperId = 'eventApplyGoodsPrtType';
		} else {
			upperId = 'eventApplyBestGoodsGrid_hd';
		}
		if (obj.is(':checked')) {
			$('#' + upperId).show();
		} else {
			$('#' + upperId).hide();
		}
	};
	
	// 구매횟수 제한 여부에 따라 제한수량 입력여부 설정
	fnSetLimitPurchCnt = function(){
		$("#limit_purch_cnt").val("0");
		$("#limit_purch_cnt").attr("disabled", true);
		
		$("[name=purch_cnt_limit_yn_check]").each(function(i){
			if(this.checked){
				$("#purch_cnt_limit_yn").val($(this).val());
				if($(this).val() == "Y"){
					$("#limit_purch_cnt").attr("disabled", false);
				}
			}
		});
	};
	
	// 응모횟수유형 선택
	fnSetEntryCntByEntryCntTypeCd = function(){
        if($("#entry_cnt_type_cd").val() == _EV_ENTRY_CNT_TYPE_CD_UNLIMITED){
        	fnSelectDisabled($("#entry_cnt"), "", true);
            $("#entry_cnt").attr("class", "input rt readonly");
        }else{
        	fnSelectDisabled($("#entry_cnt"), "1", false);
            $("#entry_cnt").attr("class", "input rt");
        }
	};
	
	// 이벤트응모 적용제외 적용유형에 따른 적용값
    fnSetApplyExpType = function(curr_row){
    	var entryApplyExpType = eventApplyGrid.GetValue({row:curr_row, id:"ENTRY_APPLY_EXP_TYPE_CD"});
    	
    	eventApplyGrid.SetValue({row:curr_row, id:"APPLY_NM1", value:""});
        eventApplyGrid.SetValue({row:curr_row, id:"APPLY_NM2", value:""});
        eventApplyGrid.SetValue({row:curr_row, id:"APPLY_NM3", value:""});
        eventApplyGrid.SetValue({row:curr_row, id:"APPLY_VAL1", value:""});
        eventApplyGrid.SetValue({row:curr_row, id:"APPLY_VAL2", value:""});
        eventApplyGrid.SetValue({row:curr_row, id:"APPLY_VAL3", value:""});
        
        if(entryApplyExpType == _EV_ENTRY_APPLY_EXP_TYPE_CD_SITE || 
        		entryApplyExpType == _EV_ENTRY_APPLY_EXP_TYPE_CD_MEDIA ||
        		entryApplyExpType == _EV_ENTRY_APPLY_EXP_TYPE_CD_MEM_GRADE ||
        		entryApplyExpType == _EV_ENTRY_APPLY_EXP_TYPE_CD_MEM_GENDER ||
        		entryApplyExpType == _EV_ENTRY_APPLY_EXP_TYPE_CD_MEM_UNUSUAL ||
        		entryApplyExpType == _EV_ENTRY_APPLY_EXP_TYPE_CD_STAFF ||
        		entryApplyExpType == _EV_ENTRY_APPLY_EXP_TYPE_CD_AREA){					// 사이트/매체/고객등급/회원성별/회원특이사항/지역은 콤보
            fnSetApplyGrid(curr_row, "", "");
            var combo = {};
            
            //사이트
            if(entryApplyExpType == _EV_ENTRY_APPLY_EXP_TYPE_CD_SITE){
                $.ajax({
                    url: "/system/site/searchSiteList.action",
                    dataType: "json",
                    data: {user_id : _userId},
                    async: false,
                    success : function(data) {
	                    //option을 생성한다.
	                    for(var idx = 0; idx < data.length; idx++){
	                    	combo[data[idx].site_no] = data[idx].site_nm;
	                    }
                    }
                }); 
            //매체
            } else if(entryApplyExpType == _EV_ENTRY_APPLY_EXP_TYPE_CD_MEDIA){
            	$.ajax({
                    url: "/system/code/searchStCommCdDtlList.action",
                    dataType: "json",
                    data: {comm_cd : _ST_CHNL_CD, use_yn : "Y", method : "json"},
                    async: false,
                    success : function(data) {
	                    //option을 생성한다.
	                    for(var idx = 0; idx < data.length; idx++){
	                    	combo[data[idx].comm_dtl_cd] = data[idx].cd_nm;
	                    }
                    }
                }); 
            //회원등급
            }else if(entryApplyExpType == _EV_ENTRY_APPLY_EXP_TYPE_CD_MEM_GRADE){
                $.ajax({
                    url: "/member/member/searchMbMbrGradeMgmtList.action",
                    dataType: "json",
                    data:{method:"json"},
                    async: false,
                    success : function(data) {
                        //option을 생성한다.
                        $.each(data.memberGradeList , function (idx , obj){
                            combo[obj.mbr_grade_no] = obj.mbr_grade_nm;
                        });
                    }
                }); 
            //회원성별
            }else if(entryApplyExpType == _EV_ENTRY_APPLY_EXP_TYPE_CD_MEM_GENDER){
                $.ajax({
                    url: "/system/code/searchStCommCdDtlList.action",
                    dataType: "json",
                    data: {comm_cd : _MB_GEND_CD, use_yn : "Y", method : "json"},
                    async: false,
                    success : function(data) {
	                    //option을 생성한다.
	                    for(var idx = 0; idx < data.length; idx++){
	                    	combo[data[idx].comm_dtl_cd] = data[idx].cd_nm;
	                    }
                    }
                }); 
            //지역
            }else if(entryApplyExpType == _EV_ENTRY_APPLY_EXP_TYPE_CD_AREA){
            	$.ajax({
                    url: "/system/code/searchStCommCdDtlList.action",
                    dataType: "json",
                    data: {comm_cd : _ST_AREA_DIVI_CD, use_yn : "Y", method : "json"},
                    async: false,
                    success : function(data) {
	                    //option을 생성한다.
	                    for(var idx = 0; idx < data.length; idx++){
	                    	combo[data[idx].comm_dtl_cd] = data[idx].cd_nm;
	                    }
                    }
                }); 
            //회원특이사항
            }else if(entryApplyExpType == _EV_ENTRY_APPLY_EXP_TYPE_CD_MEM_UNUSUAL){
            	$.ajax({
                    url: "/system/code/searchStCommCdDtlList.action",
                    dataType: "json",
                    data: {comm_cd : _MB_MBR_UNUS_DIVI_CD, use_yn : "Y", method : "json"},
                    async: false,
                    success : function(data) {
	                    //option을 생성한다.
	                    for(var idx = 0; idx < data.length; idx++){
	                    	combo[data[idx].comm_dtl_cd] = data[idx].cd_nm;
	                    }
                    }
                }); 
            //임직원
            } else if (entryApplyExpType == _EV_ENTRY_APPLY_EXP_TYPE_CD_STAFF){
            	$.ajax({
                    url: "/system/code/searchStCommCdDtlList.action",
                    dataType: "json",
                    data: {comm_cd : _MB_STAFF_DIVI_CD, use_yn : "Y", method : "json"},
                    async: false,
                    success : function(data) {
	                    //option을 생성한다.
	                    for(var idx = 0; idx < data.length; idx++){
	                    	combo[data[idx].comm_dtl_cd] = data[idx].cd_nm;
	                    }
                    }
                }); 
            }
            
            eventApplyGrid.CreateCombo({
                row:curr_row,
                id:"APPLY_NM1",              
                combo:combo
            });
            
            eventApplyGrid.ChangeCellType({
                row:curr_row,
                id: "APPLY_NM1",
                type: "C"
            });
            
            eventApplyGrid.SetEditable({row:curr_row, id:"APPLY_NM1", editable:true});
        }else{
        	eventApplyGrid.ChangeCellType({
	            row:curr_row,
	            id: "APPLY_NM1",
	            type: "T"
	        });
        	
        	var addCount = 0;
        	var init_row = curr_row;
        	
            if(entryApplyExpType == _EV_ENTRY_APPLY_EXP_TYPE_CD_CHANNEL){				// 채널
            	fnChnlListPopForForm({params:{ multi_yn:"Y"},
                    callback:function(pin){
                        pin = pin.data;
                        for(var idx = 0; idx < pin.length; idx++){
                        	if(addCount == 0){
                        		fnSetApplyGrid(curr_row, pin[idx]["CHNL_NM"], pin[idx]["CHNL_NO"]);
                        		addCount++;
                        	}else{
                        		curr_row = eventApplyGrid.GetRowCount();
                        		fnSetApplyGrid(curr_row, pin[idx]["CHNL_NM"], pin[idx]["CHNL_NO"], init_row);
                        	}
                        }
                    }
                });
            }else if(entryApplyExpType == _EV_ENTRY_APPLY_EXP_TYPE_CD_DISP){			// 전시카테고리
            	fnDispListPop({params:{ multi_yn:"Y", leaf_yn:"N", shop_type_cd:_DS_CTG_SHOP_TYPE_CD_DISP_CTG_GRP, level_no:"4" },
                    callback:function(pin){
                        pin = pin.data;
                        for(var idx = 0; idx < pin.length; idx++){
                            var varDisp_nm = pin[idx]["DISP_CTG_NM"].split(">");
                            var varDisp_no = pin[idx]["DISP_CTG_NO_PATH"].split(">");
                            
                            if(addCount == 0){
                        		fnSetApplyGrid(curr_row, varDisp_nm[0], varDisp_no[0]);
                        		addCount++;
                        	}else{
                        		curr_row = eventApplyGrid.GetRowCount();
                        		fnSetApplyGrid(curr_row, varDisp_nm[0], varDisp_no[0], init_row);
                        	}
                            
                            if(varDisp_nm.length >= 2){
                                eventApplyGrid.SetValue({row:curr_row, id:"APPLY_NM2", value:varDisp_nm[1]});
                                eventApplyGrid.SetValue({row:curr_row, id:"APPLY_VAL2", value:varDisp_no[1]});
                            }
                            if(varDisp_nm.length >= 3){
                                eventApplyGrid.SetValue({row:curr_row, id:"APPLY_NM3", value:varDisp_nm[2]});
                                eventApplyGrid.SetValue({row:curr_row, id:"APPLY_VAL3", value:varDisp_no[2]});
                            }
                        }
                    }
                });
            }else if(entryApplyExpType == _EV_ENTRY_APPLY_EXP_TYPE_CD_PLAN){			// 기획전
                fnDispListPop({params:{ multi_yn:"Y", leaf_yn:"N", shop_type_cd:_DS_CTG_SHOP_TYPE_CD_SHOP_GRP, depth_no:"2"},
                    callback:function(pin){
                        pin = pin.data;
                        
                        for(var idx = 0; idx < pin.length; idx++){
                            var varDisp_nm = pin[idx]["DISP_CTG_NM"].split(">");
                            var varDisp_no = pin[idx]["DISP_CTG_NO_PATH"].split(">");
                            
                            if(addCount == 0){
                        		fnSetApplyGrid(curr_row, varDisp_nm[0], varDisp_no[0]);
                        		addCount++;
                        	}else{
                        		curr_row = eventApplyGrid.GetRowCount();
                        		fnSetApplyGrid(curr_row, varDisp_nm[0], varDisp_no[0], init_row);
                        	}
                            if(varDisp_nm.length >= 2){
                                eventApplyGrid.SetValue({row:curr_row, id:"APPLY_NM2", value:varDisp_nm[1]});
                                eventApplyGrid.SetValue({row:curr_row, id:"APPLY_VAL2", value:varDisp_no[1]});
                            }
                        }
                    }
                });
            }else if(entryApplyExpType == _EV_ENTRY_APPLY_EXP_TYPE_CD_GOODS){			// 상품
            	fnGoodsListPop({
            		params:{
            			multi_yn: "Y"
            		},
                    callback:function(pin){
                        pin = pin.data;
                        
                        for(var idx = 0; idx < pin.length; idx++){
                        	if(addCount == 0){
                        		fnSetApplyGrid(curr_row, pin[idx]["GOODS_NM"], pin[idx]["GOODS_NO"]);
                        		addCount++;
                        	}else{
                        		curr_row = eventApplyGrid.GetRowCount();
                        		fnSetApplyGrid(curr_row, pin[idx]["GOODS_NM"], pin[idx]["GOODS_NO"], init_row);
                        	}
                        }
                    }
                });
            }else if(entryApplyExpType == _EV_ENTRY_APPLY_EXP_TYPE_CD_VEND){			// 업체
                fnVendListPop({params:{multi_yn:"Y", vend_divi_cd:_PV_VEND_DIVI_CD_GOODS_SUPPLY, resd_yn:"N"},
                    callback:function(pin){
                        pin = pin.data;
                        
                        for(var idx = 0; idx < pin.length; idx++){
                        	if(addCount == 0){
                        		fnSetApplyGrid(curr_row, pin[idx]["LOW_VEND_NM"], pin[idx]["VIR_VEND_NO"]);
                        		addCount++;
                        	}else{
                        		curr_row = eventApplyGrid.GetRowCount();
                        		fnSetApplyGrid(curr_row, pin[idx]["LOW_VEND_NM"], pin[idx]["VIR_VEND_NO"], init_row);
                        	}
                        }
                    }
                });
            }else if(entryApplyExpType == _EV_ENTRY_APPLY_EXP_TYPE_CD_BRAND){			// 브랜드
                fnBrandListPopForForm({
                    callback:function(pin){
                        pin = pin.data;
                        
                        for(var idx = 0; idx < pin.length; idx++){
                        	if(addCount == 0){
                        		fnSetApplyGrid(curr_row, pin[idx]["BRAND_NM"], pin[idx]["BRAND_NO"]);
                        		addCount++;
                        	}else{
                        		curr_row = eventApplyGrid.GetRowCount();
                        		fnSetApplyGrid(curr_row, pin[idx]["BRAND_NM"], pin[idx]["BRAND_NO"], init_row);
                        	}
                        }
                    }
                });
            }else if(entryApplyExpType == _EV_ENTRY_APPLY_EXP_TYPE_CD_STDGOODS){		// 표준상품군
            	fnStdGsgrListPop({params:{ leaf_yn:"N", level:"2"},
                    callback:function(pin){
                        pin = pin.data;
                        
                        for(var idx = 0; idx < pin.length; idx++){
                            var varMd_gsgr_nm = pin[idx]["STD_GSGR_FULL_PATH"].split(">");
                            var varMd_gsgr_no = pin[idx]["STD_GSGR_FULL_PATH_NO"].split(">");
                            
                            if(addCount == 0){
                        		fnSetApplyGrid(curr_row, varMd_gsgr_nm[0], varMd_gsgr_no[0]);
                        		addCount++;
                        	}else{
                        		curr_row = eventApplyGrid.GetRowCount();
                        		fnSetApplyGrid(curr_row, varMd_gsgr_nm[0], varMd_gsgr_no[0], init_row);
                        	}
                            if(varMd_gsgr_no.length >= 2){ 
                                eventApplyGrid.SetValue({row:curr_row, id:"APPLY_NM2", value:varMd_gsgr_nm[1]});
                                eventApplyGrid.SetValue({row:curr_row, id:"APPLY_VAL2", value:varMd_gsgr_no[1]});
                            }
                        }
                    }
                });
            }else if(entryApplyExpType == _EV_ENTRY_APPLY_EXP_TYPE_CD_MEM_YEAR || 
            		entryApplyExpType == _EV_ENTRY_APPLY_EXP_TYPE_CD_SALE_AMT || 
            		entryApplyExpType == _EV_ENTRY_APPLY_EXP_TYPE_CD_SALE_CNT){			// 연령, 구매금액, 구매건수
            	fnSetApplyGrid(curr_row, "", "");
                
                eventApplyGrid.SetEditable({row:curr_row, id:"APPLY_NM1", editable:true});
                eventApplyGrid.SetEditable({row:curr_row, id:"APPLY_NM2", editable:true});
                
                eventApplyGrid.ChangeCellType({
                    row:curr_row,
                    id: "APPLY_NM1",
                    type: "T"
                });
                eventApplyGrid.ChangeCellType({
                    row:curr_row,
                    id: "APPLY_NM2",
                    type: "T"
                });
                
            }else if(entryApplyExpType == _EV_ENTRY_APPLY_EXP_TYPE_CD_MEM_ENTRY_DATE || 
            		entryApplyExpType == _EV_ENTRY_APPLY_EXP_TYPE_CD_SALE_DATE){		// 회원가입일시/구매일시
            	fnSetApplyGrid(curr_row, "", "");
                
                eventApplyGrid.SetEditable({row:curr_row, id:"APPLY_NM1", editable:true});
                eventApplyGrid.SetEditable({row:curr_row, id:"APPLY_NM2", editable:true});
                
                eventApplyGrid.ChangeCellType({
                    row:curr_row,
                    id: "APPLY_NM1",
                    type: "D",
                    format : "yyyy-MM-dd"
                });
                eventApplyGrid.ChangeCellType({
                    row:curr_row,
                    id: "APPLY_NM2",
                    type: "D",
                    format : "yyyy-MM-dd"
                });
            }else if(entryApplyExpType == _EV_ENTRY_APPLY_EXP_TYPE_CD_STAFF){			//임직원
            	fnSetApplyGrid(curr_row, "", "");
                
            }else{
            	eventApplyGrid.SetEditable({row:curr_row, id:"APPLY_NM1", editable:false});
                eventApplyGrid.SetEditable({row:curr_row, id:"APPLY_NM2", editable:false});
                eventApplyGrid.SetEditable({row:curr_row, id:"APPLY_NM3", editable:false});
            }
        }
    };
    
    // 적용대상 추가/수정
    fnSetApplyGrid = function(curr_row, nm, val, init_row){
    	if(curr_row == eventApplyGrid.GetRowCount()){
    		if(init_row == undefined){
    			eventApplyGrid.AddRow({
                    data: {
                    	USE_YN : "Y",
                    	ENTRY_APPLY_EXP_TYPE_CD : _EV_ENTRY_APPLY_EXP_TYPE_CD_SITE,
                    	APPLY_EXP_DIVI_CD : _PR_APPLY_EXP_DIVI_CD_APPLY,
                    	APPLY_ST_CD : _EV_APPLY_ST_CD_ALL
                    },
                    row: curr_row
                });
    		}else{
    			eventApplyGrid.AddRow({
                    data: {
                    	USE_YN : "Y",
                    	ENTRY_APPLY_EXP_TYPE_CD : eventApplyGrid.GetValue({row:init_row, id:"ENTRY_APPLY_EXP_TYPE_CD"}),
                    	APPLY_EXP_DIVI_CD : eventApplyGrid.GetValue({row:init_row, id:"APPLY_EXP_DIVI_CD"}),
                    	APPLY_ST_CD : eventApplyGrid.GetValue({row:init_row, id:"APPLY_ST_CD"})
                    },
                    row: curr_row
                });
    		}
    	}
    	
        if(nm != undefined && nm != ""){
            eventApplyGrid.SetValue({row:curr_row, id:"APPLY_NM1", value:nm});
            eventApplyGrid.SetValue({row:curr_row, id:"APPLY_VAL1", value:val});
        }
        
        eventApplyGrid.SetValue({row:curr_row, id:"GB", value:"Y"});
        
        eventApplyGrid.SetEditable({row:curr_row, id:"APPLY_NM1", editable:true});
        eventApplyGrid.SetEditable({row:curr_row, id:"APPLY_NM2", editable:false});
        eventApplyGrid.SetEditable({row:curr_row, id:"APPLY_NM3", editable:false});
    };
    
    // 일별회차 여부 선택
    fnChangeChasuRadio = function(){
    	if(eventChasuGrid.GetRowCount() > 0 && confirm("기존 회차 내역을 삭제하시겠습니까?")){
    		eventChasuGrid.ClearRows();    
    	}
    };
    
    // 회차생성
    fnCreateChasu = function(){
    	if(isEmpty($("#event_kind_cd"))){
    		alert("이벤트 종류를 선택해주세요.");
        	return true;
    	}
    	
    	if(isEmpty($("#entry_start_dtime")) || isEmpty($("#entry_end_dtime"))){
        	alert("이벤트 응모일시를 입력하세요.");
        	return true;
        }
    	
    	// 당첨자발표일
        if(isEmpty($("#win_anno_date"))){
        	alert("당첨자 발표일을 입력하세요.");
        	return true;
        }
    	
/*    	var varDiff = getDateDiff($("#entry_start_dtime").val(),$("#entry_end_dtime").val());
    	var isDays = false;
        var varChangeDate ;
        
        // 일별회차여부
        $("[name=chasuRadio_chk]").each(function(){
            if($(this).is(":checked") && $(this).val() == "Y"){
                isDays = true;
            }
        });
        
        if( isDays ){
        	eventChasuGrid.ClearRows();
        	for (var days = 0; days < varDiff + 1; days++ ) {
        		varChangeDate = addDate($("#entry_start_dtime").val(), "Day", days, "");
                if(fnAddChasu(varChangeDate)){
                	return;
                }
        	}	
        }
*/        
        fnSearchChasu();
    };
    
    /**
	 * 두 날짜 사이의 차를 구한다.
	 * @param sDate : $("#sObj").val();
	 * @param eDate : $("#eObj").val();
	 * @return number 일수
	 */
	getDateDiff = function(sDate, eDate) {
		var start_date  = sDate.replaceAll("-", "").replaceAll(":", "").replaceAll(" ", "");
		var end_date  = eDate.replaceAll("-", "").replaceAll(":", "").replaceAll(" ", "");
		var DateS = new Date(start_date.substring(0,4), start_date.substring(4,6), start_date.substring(6,8));
	    var DateE = new Date(end_date.substring(0,4), end_date.substring(4,6), end_date.substring(6,8));

		var diff = (DateE - DateS)/(1000*60*60*24);
		return diff;
	};
	
	/**
	 * 기준일자 + stValue 날자를 반환한다.
	 * @param stDate  : 기준일자 : $("#stObj").val();
	 * @param stType  : 계산할 일자 기준 : 년,월,일 {Year|Month|Day}
	 * @param stValue : int 더할 숫자
	 * @return string 날짜- yyyy-mm-dd
	 */
	addDate = function(stDate, stType, stValue) {
		//parsing 변수
		var CurYear; 
		var CurMonth;
		var CurDate;
		
		//계산 변수
		var chVal;
		var chYear;
		var chMonth;
		var chDate;
		
		//리턴 변수
		var returnDate = "";

		// '-' 문자 치환 및 parsing
		stDate  = stDate.replaceAll("-", "");
		CurYear = stDate.substring(0,4);
		CurMonth = stDate.substring(4,6);
		CurDate = stDate.substring(6,8);
		
		/* 일자 계산 부분  */
		var TDate = new Date();
		
		//년을 가감할 경우
		chVal  = parseFloat(CurYear) + ( stType == 'Year' ? stValue : 0 );
		TDate.setFullYear(chVal);
		
		//월을 가감할 경우
		chVal = (parseFloat(CurMonth) - 1) + ( stType == 'Month' ? stValue : 0 );
		TDate.setMonth(chVal);
		
		//일을 가감할 경우
		chVal = parseFloat(CurDate) + ( stType == 'Day' ? stValue : 0 );
		TDate.setDate(chVal);
		
		chYear = TDate.getFullYear();
		chMonth = TDate.getMonth()+1;
		chDate = TDate.getDate();
		
		if (chMonth < 10) {
			chMonth = '0' + chMonth;
		}
		if (chDate<10) {
			chDate = '0' + chDate;
		}
		
		// return  값 생성 
		returnDate = chYear + "-" + chMonth + "-" + chDate;
		return  returnDate;
	};
    
    // 회차추가
    // 일별회차여부에 상관없이 한건씩 추가
    fnAddChasu = function(varChangeDate){
    	var varLumpPremiumGiveYn = "N";
    	var varRankMgmtYn = "N";
    	var varStartDate = "";
    	var varEndDate = "";
    	
        
        if(isEmpty($("#draw_scope_cd"))){
    		alert("추첨범위를 선택해주세요.");
    		return true;
    	}
    	
        if(varChangeDate != undefined){
        	varStartDate = varChangeDate + " 00:00:00";
        	varEndDate = varChangeDate + " 23:59:59";
        }
        
    	eventChasuGrid.AddRow({
            data: {
                EVENT_STAGE_START_DTIME: varStartDate,
                EVENT_STAGE_END_DTIME: varEndDate,
                WIN_ANNO_DATE: $("#win_anno_date").val().replaceAll("-", ""),
                LUMP_PREMIUM_GIVE_YN : varLumpPremiumGiveYn,
                RANK_MGMT_YN : varRankMgmtYn,
                ENTRY_YN : "Y"
            },
            row: eventChasuGrid.GetRowCount()
        });
    };
    
    fnSearchChasuForDetailPage = function(){
    	$("#temp_stage_no").val("");
    	var temp_stage_no_list = "";
    	if(eventChasuGrid.GetRowCount() > 0){
    		var rows =  eventChasuGrid.GetRows();
    		$.each(rows, function(idx, row){
    			if(row.CRUD == "D"){	// 삭제건은 제외하고 차수정보 생성
    				return;
    			}
    			
    		    row["TEMP_STAGE_NO"] = row["STAGE_CHASU"];
    		    var stage_chasu = row["STAGE_CHASU"] + "," ;
    		    temp_stage_no_list = temp_stage_no_list + stage_chasu;
        	    var text = "(" + row["EVENT_STAGE_START_DTIME"].substring(0, 10) + "~" + row["EVENT_STAGE_END_DTIME"].substring(0, 10) + ")";
    			
    			stageInfo[stageInfo.length] = {	"stage_key" : row["STAGE_CHASU"],	
									            			"stage_text" : text,
									            			"rank_mgmt_yn" : row["RANK_MGMT_YN"],
									            			"rank_list" : ""};
        	});
    	}
    	$("#temp_stage_no").val(temp_stage_no_list);
    };
    
    // 회차조회
    fnSearchChasu = function(){
    	var varChasuTempNo = 1;		// 경품과 매치하기 위한 임시차수 키값
    	var varRankMgmtYn = "N";
    	var varLumpPremiumGiveYn = "N";
    	
    	if(isEmpty($("#draw_scope_cd"))){
    		alert("추첨범위를 선택해주세요.");
    		return false;
    	}
    	
    	var varRow = -1;
    	
    	// 추첨범위가 이벤트, 이벤트 + 회차인 경우 회차정보에 이벤트전체기간으로 한 회차를 생성한다. 
    	if($("#draw_scope_cd").val() != _EV_DRAW_SCOPE_CD_STAGE){
        	var rows =  eventChasuGrid.GetRows();
        	var isCreate = false;
    		$.each(rows, function(idx, row){
    			if(row["TEMP_STAGE_NO"] == "0" ||
    					(row["TEMP_STAGE_NO"] == "" && row["STAGE_CHASU"] == _EV_STAGE_CHASU_DEFAULT_EVENT) ){
    				isCreate = true;
    			}
    			
    			// 이벤트 전체기간으로 한 회차가 이미 생성된 경우 다시 생성할 필요 없다
    			if(row["EVENT_STAGE_START_DTIME"].substring(0, 16) == $("#entry_start_dtime").val().substring(0, 16) && 
    					row["EVENT_STAGE_END_DTIME"].substring(0, 16) == $("#entry_end_dtime").val().substring(0, 16)){
    				isCreate = true;
    				varRow = idx;
    			}
        	});

    		if(!isCreate){
    	        if(isEmpty($("#entry_start_dtime")) || isEmpty($("#entry_end_dtime"))){
    	        	alert("이벤트 응모일시를 입력하세요.");
    	        	return;
    	        }
    	        
    	        if(isEmpty($("#win_anno_date"))){
    	        	alert("당첨자 발표일을 입력하세요.");
    	        	return;
    	        }
    	        
    			eventChasuGrid.AddRow({
                    data: {
                        EVENT_STAGE_START_DTIME: $("#entry_start_dtime").val(),
                        EVENT_STAGE_END_DTIME: $("#entry_end_dtime").val(),
                        WIN_ANNO_DATE: $("#win_anno_date").val().replaceAll("-", ""),
                        LUMP_PREMIUM_GIVE_YN : varLumpPremiumGiveYn,
                        RANK_MGMT_YN : varRankMgmtYn,
                        ENTRY_YN : ($("#draw_scope_cd").val() == _EV_DRAW_SCOPE_CD_EVENT)?"Y":"N",
                        TEMP_STAGE_NO : "0"
                    },
                    row: 0
                });
    			varRow = 0; //전체기간 회차 row미설정
    		}
    	}

//    	$("[name=stage_chasu]").empty();
//    	$("[name=stage_chasu]").append("<optionC value=''>회차를 선택해주세요.</option>");
    	
    	if(eventChasuGrid.GetRowCount() > 0){
    		var rows =  eventChasuGrid.GetRows();
    		var text = "";
    		$.each(rows, function(idx, row){
    			if(row.CRUD == "D"){	// 삭제건은 제외하고 차수정보 생성
    				return;
    			}
    			
    			// 전체기간으로 설정된 회차가 존재하는 경우
    			if(varRow >= 0 && varRow == idx){
    				if (row["STAGE_CHASU"] == null || row["STAGE_CHASU"] == "") {
    					row["TEMP_STAGE_NO"] = "0";
    				}else{
    					row["TEMP_STAGE_NO"] = row["STAGE_CHASU"];
    				}
    			}
    			
    			if(row["TEMP_STAGE_NO"] == "0"){
    				text = row["EVENT_STAGE_START_DTIME"].substring(0, 10) + "~" + row["EVENT_STAGE_END_DTIME"].substring(0, 10);
    			}else{
    				if (row["STAGE_CHASU"] == null || row["STAGE_CHASU"] == "") {
    					row["TEMP_STAGE_NO"] = varChasuTempNo++;
    				}else{
    					row["TEMP_STAGE_NO"] = row["STAGE_CHASU"];
    				}
    				
        			text = row["EVENT_STAGE_START_DTIME"].substring(0, 10) + "~" + row["EVENT_STAGE_END_DTIME"].substring(0, 10);
    			}
    			
    			// 추첨범위에 따라 등수별 선택 가능한 회차정보가 다르게 생성되어야 한다.
    			if($("#draw_scope_cd").val() == _EV_DRAW_SCOPE_CD_EVENT){				// 추첨범위 - 이벤트
    				if(row["TEMP_STAGE_NO"] != "0" && row["STAGE_CHASU"] != _EV_STAGE_CHASU_DEFAULT_EVENT){
    					return;
    				}
    			}else if($("#draw_scope_cd").val() == _EV_DRAW_SCOPE_CD_STAGE){			// 추첨범위 - 차수
    				if(row["TEMP_STAGE_NO"] == "0" || row["STAGE_CHASU"] == _EV_STAGE_CHASU_DEFAULT_EVENT){
    					return;
    				}
    			}

//    			$("[name=stage_chasu]").append("<option value='" + row["TEMP_STAGE_NO"] + "' rank_mgmt_yn='" + row["RANK_MGMT_YN"] + "'>" + text + "</option>");
    			$("[name=stage_chasu]").attr("rank_mgmt_yn", row["RANK_MGMT_YN"]).val(row["TEMP_STAGE_NO"]);

    			stageInfo[stageInfo.length] = {	"stage_key" : row["TEMP_STAGE_NO"],	
									            			"stage_text" : text,
									            			"rank_mgmt_yn" : row["RANK_MGMT_YN"],
									            			"rank_list" : ""};
        	});
    		
    		// 추첨범위가 이벤트 - 전체기간으로 설정된 회차가 존재하고 전체 차수가 1개이상인 경우 
			// ==> 전체기간으로 설정된 회차는 응모불가하다
			/*if($("#draw_scope_cd").val() == _EV_DRAW_SCOPE_CD_EVENT){
				if(varRow >= 0 && eventChasuGrid.GetRowCount() > 1){
					eventChasuGrid.SetValue({row:varRow, id:"ENTRY_YN", value:"N"});
    			}
			}*/
    	}
    };
    
    // 상품구좌 설정시
    fnChangeGoodsPrtType = function(obj) {
        var objVal = $(obj).val();
        var objPcId = $(obj).attr('id');
        var objMoId = $('#' + objPcId + '').parent().next().find('select').attr('id');
        if (objVal == _EV_EVENT_GOODS_PRT_TYPE_3X4){
            $('#' + objMoId + '').find('option').eq(2).remove();
        } else {
            if ( !$('#' + objMoId + '').find('option').eq(2).val() ) {
                $('#' + objMoId + '').find('option').last().after("<option value='" + _EV_EVENT_GOODS_PRT_TYPE_1X2 + "'>1 x 2</option>");
            }
        }
    }
    
    // 상품구좌 설정시
    fnChangeGoodsPrtTypeMo = function(obj) {
    	var objVal = $(obj).val();
    	var objMoId = $(obj).attr('id');
    	if ($('#' + objMoId + '').parents('tr').find('select').val() == _EV_EVENT_GOODS_PRT_TYPE_3X4 ) {
    		$('#' + objMoId + '').find('option').eq(2).remove();
    		console.log('remove success!!');
    	}
    }
    
    // 즉석당첨 일별당첨정보 생성
    fnCreateSpot = function(){
    	if(isEmpty($("#entry_start_dtime")) || isEmpty($("#entry_end_dtime"))){
        	alert("이벤트 응모일시를 입력하세요.");
        	return;
        }
    	
    	var varDiff = getDateDiff($("#entry_start_dtime").val(),$("#entry_end_dtime").val());
    	var isDays = false;
        var varChangeDate ;
        
        for (var days = 0; days < varDiff + 1; days++ ) {
    		varChangeDate = addDate($("#entry_start_dtime").val(), "Day", days, "");
    		eventSpotGrid.AddRow({
                data: {
                	APPLY_START_DATE: varChangeDate,
                	APPLY_END_DATE: varChangeDate
                },
                row: eventSpotGrid.GetRowCount()
            });
    	}	
    };
    
    // 이벤트 경품정보 - 등수 여부 선택
	fnSetRank = function(obj){
		var val = obj.val();
		$("[name=rank]").each(function(){
			if ( val == _BOOLEAN_TRUE ){
				$(this).removeAttr("readonly");
				$(this).attr("class", "input rt");	
			}else{
				$(this).attr("readonly", true);
				$(this).addClass("readonly");
				$(this).val(0);
			}
		});
	};
	
	// 이벤트 경품정보 - 확률 여부 선택
	fnSetWinRank = function(obj){
		var val = obj.val();
		$("[name=win_rate]").each(function(){
			if ( val == _BOOLEAN_TRUE ){
				$(this).removeAttr("readonly");
				$(this).attr("class", "input rt");	
			}else{
				$(this).attr("readonly", true);
				$(this).addClass("readonly");
				$(this).val('');
			}
		});
		$("[name=win_qty_day]").each(function(){
			if ( val == _BOOLEAN_TRUE ){
				$(this).removeAttr("readonly");
				$(this).attr("class", "input rt");	
			}else{
				$(this).attr("readonly", true);
				$(this).addClass("readonly");
				$(this).val(0);
			}
		});
		$("[name=win_prize_yn]").each(function(){
			if ( val == _BOOLEAN_TRUE ) {
				$(this).attr("disabled", false);
			} else {
				$(this).attr("disabled", true);
				$('input:checkbox[id="win_prize_yn"]').attr('checked', false);
				$('#win_stand_prize').val('');
			}
			$('#win_stand_prize').hide();
		});
	};

	fnSetWinPrizeNo = function() {
		if ($('input:checkbox[id="win_prize_yn"]').is(":checked")) {
			$('#win_stand_prize').show();
		} else {
			$('#win_stand_prize').hide();
			$('#win_stand_prize').val('');
		}
	}
    
    // 이벤트 경품정보 - 등수 추가/삭제/복사
    fnRankDisplay = function(obj, dtlYn){
    	var varTrObj = "";
		
    	// 최초 로딩시에 복사해오기
    	var fnTmp = function( copyObj ){
    		var $premiumInfo = $("#premiumInfo");
    		var $tmp = copyObj.clone();
    		if( varEventType == _EV_EVENT_KIND_CD_ATTEND ) {// 출석체크 - 경품조건 영역
    			$tmp.find("[id^=win_cond_type_cd_]").show();
    			$tmp.find("#imme_apply_yn_td").removeAttr("colspan");
    		}else{
    			$tmp.find("[id^=win_cond_type_cd_]").hide();
    			$tmp.find("#imme_apply_yn_td").attr("colspan", "7");
    		}
    		$tmp.show();
    		$tmp.removeAttr("id");
    		//회계번호
    		if(!dtlYn){
	    		varTrObj = $tmp.find("[name=premiumTypeTr]");
	    		fnAcntUnitCdSelectBox(erpAcntUnitCd, acntNo, varTrObj);
    		}
    		
    		return $tmp;
    	}
    	if(obj == undefined || obj == null){
    		var $premiumInfo = $("#premiumInfo");
    		$premiumInfo.append(fnTmp($("#premiumInfoTemplate")));
    	}else{
    		var $btn = $(obj);
        	var role = $btn.attr("role");
        	var $tbody = $btn.closest("tbody");
        	
        	if ( role == "+" ){	// 추가
        		var $newTbody = fnTmp($("#premiumInfoTemplate tbody"));
        		$newTbody.find("[name=rankBtnTd] button").show();
        		$tbody.after($newTbody);
        	}else if ( role == "-" ){	// 삭제
        		$tbody.remove();
        	}
    	}
    };

    // 이벤트 경품정보 - 회차 추가
    fnRankStageDisplay = function(obj){
    	var $btn = $(obj);
    	var $span = $btn.closest("span");
    	var role = $btn.attr("role");
    	
    	if ( role == "+" ){	// 추가
    		var $newSpan = $span.clone();
    		$newSpan.find("button").show();
    		$newSpan.find("input, select").val("");
    		$span.after($newSpan);
    	}else if ( role == "-" ){	// 삭제
    		$span.remove();
    	}
    };
    
    // 이벤트 경품정보 - ROW 추가/삭제
    fnPremiumDisplay = function(obj){
    	var $btn = $(obj);
    	var $tr = $btn.closest("tr");
    	var role = $btn.attr("role");
    	
    	if ( role == "+" ){	// 추가
    		var trName = $tr.attr("name");
    		var $newTr = $("[name="+trName+"]", "#premiumInfoTemplate").clone();
    		//회계번호
    		fnAcntUnitCdSelectBox(erpAcntUnitCd, acntNo, $newTr);
    		
    		$newTr.find("[name=btnTd] button").show();
    		$newTr.show();
    		$tr.after($newTr);
    	}else if ( role == "-" ){	// 삭제
    		$tr.remove();
    	}
    };
      
    
    
    // 이벤트 경품정보 - 경품유형 선택
    fnSetManyByPremiumTypeCd = function(obj){
    	var varTrObj = obj.closest("tr");
    	
    	$("#premiumBtnSearch", varTrObj).hide();
        $("#assetResouDiviCdSpan", varTrObj).hide();
        $("#usePossAvalDaySpan", varTrObj).hide();
        
        $("#asset_resou_divi_cd", varTrObj).val("");
        $("#premium_bene_val", varTrObj).val("");
        $("#premium_bene_val_nm", varTrObj).val("");
        $("#premium_bene_val_add", varTrObj).val("");
        //$("#etc_goods_nm", varTrObj).val("");
        
        $("#premium_bene_val_nm", varTrObj).attr("style", "width:80%");
        
        if(obj.val() == _EV_PREMIUM_TYPE_CD_PROMO || obj.val() == _EV_PREMIUM_TYPE_CD_GIFT) {				// 프로모션/사은품
            $("#premiumBtnSearch", varTrObj).show();
        }else if(obj.val() == _EV_PREMIUM_TYPE_CD_ASSET_RESOU){		// 자산자원
        	$("#usePossAvalDaySpan", varTrObj).show();
        	$("#assetResouDiviCdSpan", varTrObj).show();
        	
        	$("#premium_bene_val_nm", varTrObj).attr("style", "width:70px;");

			fnSearchAssetResouDiviCd(obj);
        }
    };
    
    // 회원등급
    fnSetManyByMbrTypeCd = function(obj){
    	var varTrObj = obj.closest("tr");
    	
    	$("#premi_apply_val1", varTrObj).val("");
    	$("#premi_apply_val1_nm", varTrObj).val("");
    	
    	if ($("#premi_cond_type_cd", varTrObj).val() == _DS_CONTS_COND_TYPE_CD_MBR_GRADE) {
			fnMbrGradeListPop({
				multi_yn : 'N' , 
				callback : function(pin){
					$('#premi_apply_val1', varTrObj).val( pin.data[0]["MBR_GRADE_NO"] );
					$('#premi_apply_val1_nm', varTrObj).val( pin.data[0]["CLUB_NM"] +" > " + pin.data[0]["MBR_GRADE_NM"] );
				}
			});
		}
    };
    
    // 이벤트 경품정보 - (프로모션 조회, 사은품 조회)
    fnSetPremiumBeneVal = function(obj){
    	var varTrObj = obj.closest("tr");
    	
    	if($("#premium_type_cd", varTrObj).val() == _EV_PREMIUM_TYPE_CD_PROMO){
    		var varPromoKindCd = _PR_PROMO_KIND_CD_CUPN + ":" + _PR_PROMO_KIND_CD_CART_CUPN + ":" + _PR_PROMO_KIND_CD_DELI_CUPN;
            fnPromoListPop({params:{multi_yn : "N", promo_kind_cd_list : varPromoKindCd, pay_appr_cd : "20"},
                callback:function(pin){
                    $("#premium_bene_val", varTrObj).val(pin.data[0]["PROMO_NO"]);
                    $("#premium_bene_val_nm", varTrObj).val(pin.data[0]["PROMO_NM"]);
                    
                    if(pin.data[0]["PROMO_KIND_CD"] == _PR_PROMO_KIND_CD_CUPN || pin.data[0]["PROMO_KIND_CD"] == _PR_PROMO_KIND_CD_CART_CUPN){
                    	$("#promo_asset_resou_divi_cd", varTrObj).val(_ST_SYS_PROP_SITE_SAVE_ASSET_CUPN);
                    }else if(pin.data[0]["PROMO_KIND_CD"] == _PR_PROMO_KIND_CD_DELI_CUPN){
                    	$("#promo_asset_resou_divi_cd", varTrObj).val(_ST_SYS_PROP_SITE_SAVE_ASSET_DELI_CUPN);
                    } 
                }
            });
        }else if($("#premium_type_cd", varTrObj).val() == _EV_PREMIUM_TYPE_CD_GIFT){
        	fnGiftListPop({param:{multi_yn : _BOOLEAN_FALSE, gift_type_cd : _PV_GIFT_TYPE_CD_EVENT, type_fix_yn : _BOOLEAN_TRUE},
                callback:function(pin){
                    $("#premium_bene_val", varTrObj).val(pin.data[0]["GIFT_MGMT_NO"]);
                    $("#premium_bene_val_nm", varTrObj).val(pin.data[0]["GIFT_MGMT_NM"]);
                }
            });
        }
    };
    
    
    //회계번호 셋팅
    fnAcntUnitCdSelectBox = function(val1, val2, obj){
        var erp_acnt_unit_cd = $("#erp_acnt_unit_cd", obj);
        var acnt_no = $("#acnt_no", obj);
        var searchAcntUnitCd = function(object, erp_acnt_unit_cd_val, acnt_no_val){
                  var pin = {};
                  var selectbox;

                  if (object == undefined){
                	  selectbox = erp_acnt_unit_cd;
                	  selectbox.empty();
                  }else if(object.attr("name") == "erp_acnt_unit_cd"){
                	  var val = object.find("option:selected").attr("data-erp-acnt-unit-cd");
                	  pin = {erp_acnt_unit_cd: val};
                	  selectbox = acnt_no;
                	  selectbox.empty();
                  }

                  if(selectbox){
                	  selectbox.append($("<option></option>").text("선택"));
                	  if(selectbox.attr("name") == "acnt_no"){
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

    
    // 자산자원 조회
    fnSearchAssetResouDiviCd = function(obj){
    	var varTrObj = obj.closest("tr");
    	var varTempSiteNo = "";
		var rowCnt = eventApplyGrid.GetRows();
        
        $.each(rowCnt, function(idx, row){
            if(row["APPLY_EXP_DIVI_CD"] == _PR_APPLY_EXP_DIVI_CD_APPLY &&
            		row["ENTRY_APPLY_EXP_TYPE_CD"] == _EV_ENTRY_APPLY_EXP_TYPE_CD_SITE){
            	varTempSiteNo = row["APPLY_VAL1"];
            }
        });
		
		if(varTempSiteNo == ""){
			alert("'이벤트 응모 적용대상'에 사이트를 지정해주세요.");
			$("#premium_type_cd", varTrObj).val("");
			$("#premium_type_cd", varTrObj).change();
			return;
		}
		
		var asset_resou_divi_cd = $("#asset_resou_divi_cd", varTrObj);
		asset_resou_divi_cd.empty();
		
		if(varSiteNo != "" && varSiteNo == varTempSiteNo && varAssetResouDiviCdHtml != ""){
			asset_resou_divi_cd.append(varAssetResouDiviCdHtml);
			return;
		}else{
			varSiteNo = varTempSiteNo;
		}
		
		$("#asset_resou_divi_cd", varTrObj).empty();
		
		//회계번호
		fnAcntUnitCdSelectBox(erpAcntUnitCd, acntNo, varTrObj);
		
    	$.ajax({
       	 	type: "POST",
            url: "/system/code/searchStSysPropDtlList.action",
            dataType: "json",
            data: {prop_no : _ST_SYS_PROP_SITE_SAVE_ASSET_CD,
            	   rel_no : varTempSiteNo,
            	   prop_dtl_apply_cont5 : "Y",
            	   method : "json"},
            async: false,
            success : function(data) {
            	varAssetResouDiviCdHtml = "<option value=''>선택</option>";
        		for(var idx = 0; idx < data.length; idx++){
        			varAssetResouDiviCdHtml += "<option value='" + data[idx].prop_dtl_no + "'>" + data[idx].prop_dtl_nm +"</option>";
        		}
        		asset_resou_divi_cd.append(varAssetResouDiviCdHtml);
            }
        });
    	
    	
    	
    };
    
	// 게시판분류 추가
	fnAddBbs = function(curr_idx){
		var addCount = 0;
		fnBbsListPop({
            callback:function(pin){
                pin = pin.data;
                
                for(var idx = 0; idx < pin.length; idx++){
                	var row = {"REL_NO" 					: pin[idx]["BBS_NO"],
                			   "REL_DTL_NO" 				: pin[idx]["CLSS_TYPE_NO"],
                			   "BBS_NM" 					: pin[idx]["BBS_NM"],
                			   "CLSS_NM"	 				: pin[idx]["CLSS_NM"],
                			   "BBS_NO"						: pin[idx]["BBS_NO"],
		          			   "CLSS_TYPE_NO"				: pin[idx]["CLSS_TYPE_NO"],
                			   "UPPER_CLSS_TYPE_NO"			: pin[idx]["UPPER_CLSS_TYPE_NO"],
                			   "BBS_KIND_CD"				: pin[idx]["BBS_KIND_CD"],
							   "TEMP_CLSS_TYPE_NO"			: "",
							   "TEMP_UPPER_CLSS_TYPE_NO"	: ""};
                	
                	if(addCount == 0){
                		addCount++;
                	}else{
                		curr_idx = eventApplyGrid.GetRowCount();
                	}
                	
                	fnAddBbsLevel(curr_idx, row, true);
                }
            }
        });
	};
	
	var varTempRelNo = 1;	// 신규생성된 row에 하위레벨 추가시 구분하기 위한 키값
	
	// 게시판 레벨추가
	fnAddBbsLevel = function(curr_idx, varRow, varLevel){
		bbsClssGrid.AddRow({
       		row: curr_idx,
			data:{
				"REL_DIVI_CD"				: _EV_CONTENT_REL_DIVI_CD_BBS,
				"BBS_NM"					: varRow["BBS_NM"],
				"CLSS_NM"					: varRow["CLSS_NM"],
				"REL_NO"					: varRow["REL_NO"],
				"REL_DTL_NO"				: varRow["REL_DTL_NO"],
				"BBS_NO"					: varRow["BBS_NO"],
   			    "CLSS_TYPE_NO"				: varRow["CLSS_TYPE_NO"],
				"UPPER_CLSS_TYPE_NO"		: varRow["UPPER_CLSS_TYPE_NO"],
				"BBS_KIND_CD"				: varRow["BBS_KIND_CD"],
				"TEMP_CLSS_TYPE_NO"			: varTempRelNo++,
				"TEMP_UPPER_CLSS_TYPE_NO" 	: varRow["TEMP_UPPER_CLSS_TYPE_NO"]
			},
			sibling: varLevel
    	});
	};
	
    var stageInfo = new Array();
    
    // 저장시 disabled처리된 변수 풀기
    fnDisabeldDateUnChk = function(){
    	var disabledTarget = $("#event_kind_cd, #draw_mean_cd, #win_type_cd, #entry_cond_type_cd, #draw_scope_cd");// 추첨방식/당첨유형/응모조건유형/추첨범위
    	$.each(disabledTarget, function(){
    		if ( $(this).is(":disabled") ){
    			$(this).removeAttr("disabled");
    		}
    	});
    }
    
	// 이벤트 유효성 체크
    //mode : 이벤트 등록과 상세 구분
    fnCheckEvent = function(mode){
    	// 유효성 체크 - 이벤트 기본 =============================================
		if(!$.form("#eventForm").check({})){
			return true;
        }
		
    	//이벤트 기본배너 유효성 체크
/*    	if(!fnSaveEventBanner()){
    		return true;
    	};*/
    	// 유효성 체크 - 이벤트 기본 =============================================
    	
    	// 유효성 체크 - 이벤트 응모 적용대상 ========================================
    	if (!eventApplyGrid.CheckRequired()) {
    		return true;
    	};
    	
    	var isSiteCnt = 0;
    	var isSaleDateCnt = 0;
    	var isSaleDateAllCnt = 0;
    	var isEntryDateCnt = 0;
    	var varMsg = "";
    	
    	$.each(eventApplyGrid.GetRows(), function(idx, row){
    		if(	row["ENTRY_APPLY_EXP_TYPE_CD"] == _EV_ENTRY_APPLY_EXP_TYPE_CD_MEM_UNUSUAL){
    			// 제외만 가능 - 회원특이사항
    			if(row["APPLY_EXP_DIVI_CD"] == _PR_APPLY_EXP_DIVI_CD_APPLY){
    				varMsg = "'이벤트 응모 적용대상'의 회원특이사항 적용제외구분은 제외만 선택가능합니다.";
    			}
    		//임직원을 제외한 나머지
    		}else if ( row["ENTRY_APPLY_EXP_TYPE_CD"] != _EV_ENTRY_APPLY_EXP_TYPE_CD_STAFF ){
        		// 적용만 가능 - 나머지
        		if(row["APPLY_EXP_DIVI_CD"] != _PR_APPLY_EXP_DIVI_CD_APPLY){
        			varMsg = "'이벤트 응모 적용대상'의 회원특이사항/임직원이 아닌 적용제외구분은 적용만 선택가능합니다.";
        		}
        	}
    		
    		if(((row.Checked && row.CRUD == "C" || row.CRUD == "U") || row.CRUD == "R")
    				&& varMsg == "" && row["APPLY_EXP_DIVI_CD"] == _PR_APPLY_EXP_DIVI_CD_APPLY 
    				&& row["ENTRY_APPLY_EXP_TYPE_CD"] == _EV_ENTRY_APPLY_EXP_TYPE_CD_SITE){
    			isSiteCnt++;
    		}
    		
    		if(varMsg == ""){
    			if(row["APPLY_NM1"] == ""){
    				row["APPLY_NM1"] = "0";
    			}
    			if(row["APPLY_NM2"] == ""){
    				row["APPLY_NM2"] = "0";
    			}
    			if(row["APPLY_NM3"] == ""){
    				row["APPLY_NM3"] = "0";
    			}
    			
    			if(row["GB"] == "Y"){
    				if(row["APPLY_VAL1"] == ""){
    					row["APPLY_VAL1"] = row["APPLY_NM1"];
    				}
    				if(row["APPLY_VAL2"] == ""){
    					row["APPLY_VAL2"] = row["APPLY_NM2"];
    				}
    				if(row["APPLY_VAL3"] == ""){
    					row["APPLY_VAL3"] = row["APPLY_NM3"];
    				}
    			}
    			
    			if(row["ENTRY_APPLY_EXP_TYPE_CD"] == _EV_ENTRY_APPLY_EXP_TYPE_CD_SITE ||
    					row["ENTRY_APPLY_EXP_TYPE_CD"] == _EV_ENTRY_APPLY_EXP_TYPE_CD_CHANNEL ||
    					row["ENTRY_APPLY_EXP_TYPE_CD"] == _EV_ENTRY_APPLY_EXP_TYPE_CD_GOODS ||
    					row["ENTRY_APPLY_EXP_TYPE_CD"] == _EV_ENTRY_APPLY_EXP_TYPE_CD_VEND ||
    					row["ENTRY_APPLY_EXP_TYPE_CD"] == _EV_ENTRY_APPLY_EXP_TYPE_CD_BRAND ||
    					row["ENTRY_APPLY_EXP_TYPE_CD"] == _EV_ENTRY_APPLY_EXP_TYPE_CD_MEM_GRADE ||
    					row["ENTRY_APPLY_EXP_TYPE_CD"] == _EV_ENTRY_APPLY_EXP_TYPE_CD_MEM_GENDER ||
    					row["ENTRY_APPLY_EXP_TYPE_CD"] == _EV_ENTRY_APPLY_EXP_TYPE_CD_MEM_UNUSUAL ||
    					row["ENTRY_APPLY_EXP_TYPE_CD"] == _EV_ENTRY_APPLY_EXP_TYPE_CD_AREA){
    				// 적용값1만 설정가능 - 사이트, 채널, 상품, 가상업체, 브랜드, 회원등급, 회원성별, 회원특이사항, 지역
    				if(row["APPLY_NM1"] == "" || row["APPLY_NM2"] != "0" || row["APPLY_NM3"] != "0"){
    					varMsg = "'이벤트 응모 적용대상'의 적용값1 설정만 가능합니다.";
    				}
    			}else if(row["ENTRY_APPLY_EXP_TYPE_CD"] == _EV_ENTRY_APPLY_EXP_TYPE_CD_SALE_AMT ||
    					row["ENTRY_APPLY_EXP_TYPE_CD"] == _EV_ENTRY_APPLY_EXP_TYPE_CD_SALE_CNT ||
    					row["ENTRY_APPLY_EXP_TYPE_CD"] == _EV_ENTRY_APPLY_EXP_TYPE_CD_MEM_YEAR){
    				// 적용값1(필수) 적용값2(선택) 설정가능 - 구매금액, 구매건수, 회원연령
    				if(row["APPLY_NM1"] == "" || row["APPLY_NM3"] != "0"){
    					varMsg = "'이벤트 응모 적용대상'의 적용값1, 적용값2 설정만 가능합니다.";
    				}
    			}else if(row["ENTRY_APPLY_EXP_TYPE_CD"] == _EV_ENTRY_APPLY_EXP_TYPE_CD_SALE_DATE ||
    					row["ENTRY_APPLY_EXP_TYPE_CD"] == _EV_ENTRY_APPLY_EXP_TYPE_CD_MEM_ENTRY_DATE){
    				// 적용값1, 적용값2만 설정가능 - 구매일시, 회원가입일시
    				if(row["APPLY_NM1"] == "" || row["APPLY_NM2"] == "" || row["APPLY_NM3"] != "0"){
    					varMsg = "'이벤트 응모 적용대상'의 적용값1, 적용값2 설정만 가능합니다.";
    				}
    				
    			}else if(row["ENTRY_APPLY_EXP_TYPE_CD"] == _EV_ENTRY_APPLY_EXP_TYPE_CD_DISP ||
    					row["ENTRY_APPLY_EXP_TYPE_CD"] == _EV_ENTRY_APPLY_EXP_TYPE_CD_STDGOODS ||
    					row["ENTRY_APPLY_EXP_TYPE_CD"] == _EV_ENTRY_APPLY_EXP_TYPE_CD_PLAN){
    				// 적용값1(필수), 적용값2(선택), 적용값3(선택) 설정가능 - 전시카테고리, 표준상품군, 기획전
    				if(row["APPLY_NM1"] == "" || row["APPLY_NM2"] == "" || row["APPLY_NM3"] != "0"){
    					varMsg = "'이벤트 응모 적용대상'의 적용값1, 적용값2 설정만 가능합니다.";
    				}
    			}
    		}
    		
    		if(row["ENTRY_APPLY_EXP_TYPE_CD"] == _EV_ENTRY_APPLY_EXP_TYPE_CD_SALE_DATE){
    			isSaleDateCnt++;
    			
    			// 모두/당첨인 경우 구매기간 설정
    			if(row["APPLY_ST_CD"] != _EV_APPLY_ST_CD_ENTRY){
    				isSaleDateAllCnt++;
    			}
    		}else if(row["ENTRY_APPLY_EXP_TYPE_CD"] == _EV_ENTRY_APPLY_EXP_TYPE_CD_MEM_ENTRY_DATE){
    			isEntryDateCnt++;
    		}
    	});
    	
		if ( $('#new_mem_yn_chk').is(':checked') ) {
			if ($('#newmem_start_dtime').val() == '' || $('#newmem_end_dtime').val() == '') {
				alert('신규회원가입 기간을 입력하세요!');
				return true;
			}
		}
		
		if ( $('#issue_targ_yn_chk').is(':checked') ) {
			if (mbChoiceGrid.GetRowCount() < 1 ) {
				alert('대상회원 데이터가 존재 하지 않습니다.');
				return true;
			}
		}
		
    	if(isSiteCnt != 1){
    		alert("'이벤트 응모 적용대상'에 한개 사이트를 필수로 지정하셔야 합니다.");
    		return true;
    	}
    	
    	if (eventApplyGrid.GetRowCount() == 0) {
    		alert("'이벤트 응모 적용대상'를 입력해주세요.");
    		return true;
    	};
    	
    	// 응모조건유형에 따른 응모적용제외유형 체크
    	if($("#entry_cond_type_cd").val() == _EV_ENTRY_COND_TYPE_CD_SHOPPER && isSaleDateCnt == 0){
    		alert("응모조건유형이 구매자인 경우 '이벤트 응모 적용대상'에 구매일시를 지정해주세요.");
    		return true;
    	}else if($("#entry_cond_type_cd").val() == _EV_ENTRY_COND_TYPE_CD_NON_SHOPPER && isSaleDateCnt == 0){
    		alert("응모조건유형이 비구매자인 경우 '이벤트 응모 적용대상'에 구매일시를 지정해주세요.");
    		return true;
    	}else if($("#entry_cond_type_cd").val() == _EV_ENTRY_COND_TYPE_CD_NEW_MEMBER && isEntryDateCnt == 0){
    		alert("응모조건유형이 신규회원인 경우 '이벤트 응모 적용대상'에 회원가입일시를 지정해주세요.");
    		return true;
    	}
    	
    	if(isSaleDateCnt > 0 && isSaleDateCnt != 1){
    		alert("'이벤트 응모 적용대상'에 구매기간은 하나만 입력하셔야 합니다.");
    		return true;
    	}
    	
    	if(isEntryDateCnt > 0 && isEntryDateCnt != 1){
    		alert("'이벤트 응모 적용대상'에 회원가입기간은 하나만 입력하셔야 합니다.");
    		return true;
    	}
    	
    	
        if ( $('#event_kind_cd').val() == _EV_EVENT_KIND_CD_ONEDAYDEAL || $('#event_kind_cd').val() == _EV_EVENT_KIND_CD_GATHER) {
        	if ( $("#deal_use_yn_chk").is(":checked") ) {
        		if ($('#goods_prt_type_no_mo').val() == '' || $('#goods_prt_type_no_mo').val() == '0') {
        			varMsg = "딜 상품전시타입(MO)을 선택해주세요.";
        		}
        		if ($('#goods_prt_type_no_pc').val() == '' || $('#goods_prt_type_no_pc').val() == '0') {
        			varMsg = "딜 상품전시타입(PC)을 선택해주세요.";
        		}
        	} 
        	
        	if ($("#best_use_yn_chk").is(":checked")) {
        		if ($('#best_goods_prt_type_no_mo').val() == '' || $('#best_goods_prt_type_no_mo').val() == '0') {
        			varMsg = "베스트 상품전시타입(MO)을 선택해주세요.";
        		}
        		if ($('#best_goods_prt_type_no_pc').val() == '' || $('#best_goods_prt_type_no_pc').val() == '0') {
        			varMsg = "베스트 상품전시타입(PC)을 선택해주세요.";
        		}
        	}
        	
        	// 상품설정체크(품절노출)
            if ( $("#soldout_expos_yn_chk").is(":checked")) {
                $("#soldout_expos_yn").val("Y");
            } else {
                $("#soldout_expos_yn").val("N");
            }
            // 상품설정체크(할인율)
            if ( $("#discount_expos_yn_chk").is(":checked")) {
                $("#discount_expos_yn").val("Y");
            } else {
                $("#discount_expos_yn").val("N");
            }
            // 상품설정체크(브랜드로고노출)
            if ( $("#brand_logo_expos_yn_chk").is(":checked")) {
                $("#brand_logo_expos_yn").val("Y");
            } else {
                $("#brand_logo_expos_yn").val("N");
            }
            // 상품설정체크(브랜드명노출)
            if ( $("#brand_nm_expos_yn_chk").is(":checked")) {
                $("#brand_nm_expos_yn").val("Y");
            } else {
                $("#brand_nm_expos_yn").val("N");
            }
            // 상품설정체크(구좌사용여부)
            if ( $("#deal_use_yn_chk").is(":checked")) {
            	$("#deal_use_yn").val("Y");
            } else {
            	$("#deal_use_yn").val("N");
            }
            
            
            // 베스트상품
            // 상품설정체크(품절노출)
            if ( $("#best_soldout_expos_yn_chk").is(":checked")) {
                $("#best_soldout_expos_yn").val("Y");
            } else {
                $("#best_soldout_expos_yn").val("N");
            }
            // 상품설정체크(할인율)
            if ( $("#best_discount_expos_yn_chk").is(":checked")) {
                $("#best_discount_expos_yn").val("Y");
            } else {
                $("#best_discount_expos_yn").val("N");
            }
            // 상품설정체크(브랜드로고노출)
            if ( $("#best_brand_logo_expos_yn_chk").is(":checked")) {
                $("#best_brand_logo_expos_yn").val("Y");
            } else {
                $("#best_brand_logo_expos_yn").val("N");
            }
            // 상품설정체크(브랜드명노출)
            if ( $("#best_brand_nm_expos_yn_chk").is(":checked")) {
                $("#best_brand_nm_expos_yn").val("Y");
            } else {
                $("#best_brand_nm_expos_yn").val("N");
            }
            // 상품설정체크(구좌사용여부)
            if ( $("#best_use_yn_chk").is(":checked")) {
            	$("#best_use_yn").val("Y");
            } else {
            	$("#best_use_yn_chk").val("N");
            }
            
        }
        
    	if(varMsg != ""){
    		alert(varMsg);
    		return true;
    	}
    	// 유효성 체크 - '이벤트 응모 적용대상' ========================================
    	
    	
    	
	    if ( ($("#event_kind_cd").val() != _EV_EVENT_KIND_CD_LINK) && ($("#event_kind_cd").val() != _EV_EVENT_KIND_CD_ONEDAYDEAL) ) { //단순링크는 응모관련 유효성 체크 안함    	
	    	if ( $("#entry_start_date").val() == "" || $("#entry_end_date").val() == "" ) {
	    		alert("응모일시를 입력해 주세요.")
	    		return true;
	    	}  
	        
	        // 유효성 체크 - 이벤트 종류별 ===========================================
			if($("#event_kind_cd").val() == _EV_EVENT_KIND_CD_BBS){				// 게시판
				/*if(bbsClssGrid.GetRowCount() == 0){
					alert("게시판 이벤트는 게시판정보를 추가하셔야 합니다.");
					return true;
				}*/
			}else if($("#event_kind_cd").val() == _EV_EVENT_KIND_CD_POLL ||
					$("#event_kind_cd").val() == _EV_EVENT_KIND_CD_QUIZ){			// 설문투표/퀴즈
				if(isEmpty($("#rel_no"))){
					alert("설문투표, 퀴즈 이벤트의 경우 설문을 선택하셔야 합니다.");
					return true;
				}
			}else if($("#event_kind_cd").val() == _EV_EVENT_KIND_CD_ATTEND){		// 출석체크
				// 회차등록
				if(eventChasuGrid.GetRowCount() == 0){
					alert("출석체크 이벤트는 회차를 필수로 입력하셔야 합니다.");
		    		return true;
				}
			}else if($("#event_kind_cd").val() == _EV_EVENT_KIND_CD_ARRIVAL ||
					$("#event_kind_cd").val() == _EV_EVENT_KIND_CD_SPOTWIN){		// 선착순/즉석
				if (eventSpotGrid.GetRowCount() == 0) {
					alert("이벤트 종류가 선착순, 즉석 이벤트인 경우 즉석당첨 정보를 입력하셔야 합니다.");
		            return true;
		        };
		        
		        // 회차일시 중복여부 체크
		        var isDupDayWinDate = false;
		        $.each(eventSpotGrid.GetRows(), function(idx, row){
		        	var varSDtime1 = row["APPLY_START_DATE"].replaceAll("-", "");
		        	var varEDtime1 = row["APPLY_END_DATE"].replaceAll("-", "");
		        	
		        	$.each(eventSpotGrid.GetRows({checked : true}), function(sidx, srow){
		        		var varSDtime2 = srow["APPLY_START_DATE"].replaceAll("-", "");
		            	var varEDtime2 = srow["APPLY_END_DATE"].replaceAll("-", "");
		            	
		            	if(idx != sidx && varSDtime1 < varEDtime2 && varEDtime1 > varSDtime2){
		            		isDupDayWinDate = true;
		            	}
		            });
		        });
		        
		        if(isDupDayWinDate){
		        	alert("날짜 중복된 즉석당첨 정보가 존재합니다.");
		    		return true;
		        }
			}
			// 유효성 체크 - 이벤트 종류별 ===========================================
			
			// 유효성 체크 - 이벤트회차 ==============================================
	        if (eventChasuGrid.GetRowCount() > 0 && !eventChasuGrid.CheckRequired()) {
	            return true;
	        };
	        
	        // 회차일시 중복여부 체크
	        var isDupStage = false;
	        $.each(eventChasuGrid.GetRows(), function(idx, row){
	        	// 당첨범위 - 이벤트
	            if($("#draw_scope_cd").val() != _EV_DRAW_SCOPE_CD_STAGE && idx == 0){
	            	return;
	            }
	            
	        	var varSDtime1 = row["EVENT_STAGE_START_DTIME"].replaceAll("-", "").replaceAll(":", "").replaceAll(" ", "");
	        	var varEDtime1 = row["EVENT_STAGE_END_DTIME"].replaceAll("-", "").replaceAll(":", "").replaceAll(" ", "");
	        	
	        	$.each(eventChasuGrid.GetRows({checked : true}), function(sidx, srow){
	        		// 당첨범위 - 이벤트
	                if($("#draw_scope_cd").val() != _EV_DRAW_SCOPE_CD_STAGE && sidx == 0){
	                	return;
	                }
	                
	        		var varSDtime2 = srow["EVENT_STAGE_START_DTIME"].replaceAll("-", "").replaceAll(":", "").replaceAll(" ", "");
	            	var varEDtime2 = srow["EVENT_STAGE_END_DTIME"].replaceAll("-", "").replaceAll(":", "").replaceAll(" ", "");
	            	
	            	if(idx != sidx && varSDtime1 < varEDtime2 && varEDtime1 > varSDtime2){
	            		isDupStage = true;
	            	}
	            });
	        });
	        
	        if(isDupStage){
	        	alert("날짜 중복된 회차가 존재합니다.");
	    		return true;
	        }
	        
	        // 추첨범위코드
	        if($("#draw_scope_cd").val() != _EV_DRAW_SCOPE_CD_EVENT && eventChasuGrid.GetRowCount() == 0){
	        	// 차수, 이벤트 + 회차인 경우 회차정보가 존재
	        	alert("추첨범위가 회차, 이벤트 + 회차인 경우 회차정보가 등록되어야 합니다.");
	    		return true;
	        }
	        // 유효성 체크 - 이벤트회차 ==============================================
			
	        // 유효성 체크 - 이벤트경품 ==============================================
			// 지정된 회차의 등수관리여부에 따른 체크
	        // test 회차가 삭제된 경우도 확인할것
	        var varErrorMsg = "";
	        var isOrderExists = false;
	        
	        //비추첨이 아닐때만 처리되는 분기문에서 이곳으로 이동(비추첨일때 경품영역 차수 insert NULL문제)
	        if("detail"==mode) {
	        	fnSearchChasuForDetailPage();
	        }
	        
	        // 추첨방식이 비추첨이 아닌경우 - 경품정보가 존재해야 한다.
	        if($("#draw_mean_cd").val() != _EV_DRAW_MEAN_CD_NON_DRAW){
		        // 당첨조건 - 당첨조건이 없을수도 있음. 이 경우 당첨조건유형을 선택한 경우만 적용값 체크를 한다.
		        $("[name=win_cond_type_cd]", $.form("#eventForm")).each(function(idx, val){
		        	if($(this).val() != null && $(this).val() != "" ){
		        		if(varErrorMsg == "" && $(this).val() != _EV_WIN_COND_TYPE_CD_RIGHT_ANSWER &&
			        			$(this).val() != _EV_WIN_COND_TYPE_CD_HIGH_SCORE){		// 정답/최고점수 - 적용값필드 사용안함
		        			if($("[name=apply_val1]").eq(idx).val() == ""){
		        				varErrorMsg = "적용범위를 입력해주세요.";
		        			}
			        	}
		        		
		        		if($(this).val() == _EV_WIN_COND_TYPE_CD_ORDER_AMT || $(this).val() == _EV_WIN_COND_TYPE_CD_ORDER_CNT){
		        			isOrderExists = true;
		        		}
		        	}
				});
		        
		        if(varErrorMsg != ""){
		        	alert(varErrorMsg);
		        	return true;
		        }
		        
		        // 구매관련 조건이 존재하는 경우 구매기간 셋팅은 필수
				if(isOrderExists && isSaleDateAllCnt == 0){
		        	alert("구매관련 당첨조건이 존재하는 경우 '이벤트 응모 적용대상'에 구매일시를 적용기준 모두/당첨으로 지정해주세요.");
		    		return true;
		        }
		        
		        if(stageInfo.length == 0){
		        	alert("회차재조회 버튼을 클릭해주세요. 경품별 회차를 지정하셔야 합니다.");
		        	return true;
		        }else{
		        	// 체크를 위한 회차 정보 초기화하기
		        	$.each(stageInfo, function(idx, obj){
		        		stageInfo[idx].rank_list = "";
		        		
		        		// 등수관리여부 값 다시 셋팅하기
			        	$.each(eventChasuGrid.GetRows(), function(sidx, row){
		        			if(row.CRUD == "D"){	// 삭제건은 제외하고 차수정보 생성
		        				return;
		        			}
		        			
		        			var currText = "(" + row["EVENT_STAGE_START_DTIME"].substring(0, 10) + "~" + row["EVENT_STAGE_END_DTIME"].substring(0, 10) + ")";
		        			
		        			if(stageInfo[idx].stage_text == currText){
		        				stageInfo[idx].rank_mgmt_yn = row["RANK_MGMT_YN"];
		        			}
		            	});
		        	});
		        }
		        
		        // 회차에 대해 동일한 등수가 설정되었는지, 지정된 등수 취합
		        $.each(stageInfo, function(idx, obj){
		        	if(varErrorMsg == ""){
		        		var rank_exist_yn = $("[name=rank_exists_yn]:checked", $.form("#eventForm")).val();	
		        		$("[name=stage_chasu]", $.form("#eventForm")).each(function(sidx, val){
		        			var parentObj = $(this).closest("tbody");
	
		        			if(stageInfo[idx].stage_key == $(this).val()){
		        				$(this).attr("use_yn", "Y");
		        				
		        				if ( rank_exist_yn == _BOOLEAN_TRUE ){// 등수가 있을때만 검사함.
			        				var varRank = $("[name=rank]", parentObj).val();
			        				if(stageInfo[idx].rank_list == "" || stageInfo[idx].rank_list.indexOf(varRank) < 0){
			        					if(stageInfo[idx].rank_list != ""){
			        						stageInfo[idx].rank_list += ",";
			        					}
			        					stageInfo[idx].rank_list += varRank;
			        				}else if(stageInfo[idx].rank_list != "" && stageInfo[idx].rank_list.indexOf(varRank) >= 0){
			        					// 중복된 등수가 존재함
			        					varErrorMsg = stageInfo[idx].stage_text + " 회차에 동일한 등수가 설정되어 있습니다."+stageInfo[idx].rank_list;
			        					return false;
			        				}
		        				}
		        			}
		        		});
		        	}
		        	
/*		        	if(varErrorMsg == "" && stageInfo[idx].rank_mgmt_yn == "N" && stageInfo[idx].rank_list.split(",").length > 1){
		        		varErrorMsg = stageInfo[idx].stage_text + " 회차는 등수별 경품을 관리하지 않는 회차입니다.";
		        		return false;
		        	}*/
		        	
		        	if(varErrorMsg == "" && $("#draw_mean_cd").val() != _EV_DRAW_MEAN_CD_NON_DRAW){			// 추첨방식 - 비추첨 제외
		        		if($("#draw_scope_cd").val() == _EV_DRAW_SCOPE_CD_EVENT){				// 추첨범위 - 이벤트
		        			if((stageInfo[idx].stage_key != "0" && stageInfo[idx].stage_key != _EV_STAGE_CHASU_DEFAULT_EVENT) && stageInfo[idx].rank_list != ""){
		        				varErrorMsg = "추첨범위가 이벤트인 경우 이벤트에만 경품정보를 지정해주세요.";
		        				return false;
		        			}
		        		}else if($("#draw_scope_cd").val() == _EV_DRAW_SCOPE_CD_STAGE){		// 추첨범위 - 차수
		        			if((stageInfo[idx].stage_key == "0" || stageInfo[idx].stage_key == _EV_STAGE_CHASU_DEFAULT_EVENT) && stageInfo[idx].rank_list != ""){
		        				varErrorMsg = "추첨범위가 차수인 경우 회차에만 경품정보를 지정해주세요.";
		        				return false;
		        			}
		        		}else if ( stageInfo[idx].rank_list == "" ){
	        				varErrorMsg = stageInfo[idx].stage_text + " 회차에 경품정보를 지정해주세요.";
	        				return false;
		        		}
		        	}
		        });
		        
		        if(varErrorMsg != ""){
		        	window.alert(varErrorMsg);
		        	return true;
		        }
		        
		        $("[name=stage_chasu]", $.form("#eventForm")).each(function(sidx, val){
		        	if($(this).val() == ""){
		        		varErrorMsg = $(this).val() + "경품대상 회차를 선택해주세요.";
		        	}
		        	
		        	if(varErrorMsg != ""){
						return;
					}
		        	
		        	if($(this).attr("use_yn") != "Y"){
		        		varErrorMsg = "회차정보에 없는 회차가 경품정보에 지정되어 있습니다. 재조회하여 주세요.";
		        	}
		        	
		        	if(varErrorMsg != ""){
						return;
					}
				});
		        
				// 경품정보
				$("[name=premi_cond_type_cd]", $.form("#eventForm")).each(function(idx, obj){
		        	if ($('#mem_rank_yn_chk').is(':checked')) {
		        		if($("[name=premi_apply_val1_nm]", $.form("#eventForm")).eq(idx).val() == ""){	 
		        			varErrorMsg = "회원등급을 선택해주세요.";
		        		}
		        	}
		        	
					if(varErrorMsg != ""){
						return;
					}
				});
	        	
		        
		        if(varErrorMsg != ""){
		        	alert(varErrorMsg);
		        	return true;
		        }
				
				// 경품정보
				$("[name=premium_type_cd]", $.form("#eventForm")).each(function(idx, obj){
					if($(this).val() == _EV_PREMIUM_TYPE_CD_ASSET_RESOU){		// 경품유형 - 자산자원
						// premium_bene_val_nm값 premium_bene_val에 넣기
						$("[name=premium_bene_val]", $.form("#eventForm")).eq(idx).val($("[name=premium_bene_val_nm]").eq(idx).val());
	
						if($("[name=asset_resou_divi_cd]").eq(idx).val() == ""){
							varErrorMsg = "자산자원을 선택해주세요.";
							$("[name=asset_resou_divi_cd]").eq(idx).focus();
						}
						
						if(varErrorMsg == "" && $("[name=use_poss_aval_day]").eq(idx).val() == ""){
							varErrorMsg = "유효기간을 선택해주세요.";
							$("[name=use_poss_aval_day]").eq(idx).focus();
						}
					}else if($(this).val() == _EV_PREMIUM_TYPE_CD_GIFT){		// 경품유형 - 사은품
						obj = $(this).closest("tbody");
						if($("#send_day_cnt", obj).val() == ""){
							varErrorMsg = "발송일수를 입력해주세요.";
							$("#send_day_cnt", obj).focus();
						}
					}else if($(this).val() == _EV_PREMIUM_TYPE_CD_ETC){		// 경품유형 - 기타
						$("[name=premium_bene_val]", $.form("#eventForm")).eq(idx).val($("[name=premium_bene_val_nm]").eq(idx).val());
					}
					
					if(varErrorMsg != ""){
						return;
					}
					
					if($(this).val() != _EV_PREMIUM_TYPE_CD_ETC && $("[name=premium_bene_val]", $.form("#eventForm")).eq(idx).val() == ""){		// 경품유형 기타아닌 경우	 
						varErrorMsg = "경품값을 입력해주세요.";
					}
					
					if(varErrorMsg != ""){
						return;
					}
				});
				
				if(varErrorMsg != ""){
		        	alert(varErrorMsg);
		        	return true;
		        }
				
				// 당첨수량
				$("[name=win_qty]", $.form("#eventForm")).each(function(idx, obj){
					if($(this).val() == ""){
						varErrorMsg = "당첨수량을 입력해주세요.";
					}
				})
				;
				if ($('input:radio[name="probaty_param_yn"]:checked').val() == 'Y') {
					// 당첨확률
					$("[name=win_rate]", $.form("#eventForm")).each(function(idx, obj){
						if($(this).val() == "" || $(this).val() == '0'){
							varErrorMsg = "당첨확률을 입력해주세요.";
						}
					});
					
					// 일일최대당첨수량
					$("[name=win_qty_day]", $.form("#eventForm")).each(function(idx, obj){
						if($(this).val() == "" || $(this).val() == '0'){
							varErrorMsg = "일일최대당첨수량을 입력해주세요.";
						}
					});
				}
				
				if(varErrorMsg != ""){
		        	window.alert(varErrorMsg);
		        	return true;
		        }
	        } else {
				$("[name=premium_type_cd]", $.form("#eventForm")).each(function(idx, obj){
					if($(this).val() == _EV_PREMIUM_TYPE_CD_ASSET_RESOU){		// 경품유형 - 자산자원
						// premium_bene_val_nm값 premium_bene_val에 넣기
						$("[name=premium_bene_val]", $.form("#eventForm")).eq(idx).val($("[name=premium_bene_val_nm]").eq(idx).val());
					}
				});
	        }
			// 유효성 체크 - 이벤트경품 ==============================================
						
			// 유효성 체크 - 이벤트요소 ==============================================
			if(eventFactorGrid.GetRowCount() > 0 && !eventFactorGrid.CheckRequired()){
	        	return true;
	        }
			// 유효성 체크 - 이벤트요소 ==============================================
			
			// 유효성 체크 - 이벤트게시판 ============================================
			if(eventSpotGrid.GetRowCount() > 0 && !eventSpotGrid.CheckRequired()){
	        	return true;
	        }
			// 유효성 체크 - 이벤트게시판 ============================================
			
			
			// 유효성 체크 - 통자이벤트 ============================================
			 if( $("#event_kind_cd").val() == _EV_EVENT_KIND_CD_GATHER) {
			    // 유효성 체크 - 원데이딜요소 ==============================================
				if ($('#deal_use_yn_chk').is(':checked')) {
					if(eventApplyGoodsGrid.GetRowCount() > 0 && !eventApplyGoodsGrid.CheckRequired()){
						return true;
					}
					if(eventApplyDayGoodsGrid.GetRowCount() > 0 && !eventApplyDayGoodsGrid.CheckRequired()){
						return true;
					}
					
				}
				if ($('#best_use_yn_chk').is(':checked')) {
					if(eventApplyBestGoodsInfoGrid.GetRowCount() > 0 && !eventApplyBestGoodsInfoGrid.CheckRequired()){
						return true;
					}
					
					// 유효성 체크 - 베스트상품영역(상품컷) ========================================
					if (!eventApplyBestGoodsInfoGrid.CheckRequired()) {
						return true;
					};
				}
			}
			 // 유효성 체크 - 통자이벤트 ============================================
	    } else if ($("#event_kind_cd").val() == _EV_EVENT_KIND_CD_ONEDAYDEAL) {
	        // 유효성 체크 - 원데이딜요소 ==============================================
	    	if ($('#deal_use_yn_chk').is(':checked')) {
	    		if(eventApplyGoodsGrid.GetRowCount() > 0 && !eventApplyGoodsGrid.CheckRequired()){
	    			return true;
	    		}
	    	}
	    }
    };
    
    // Grid CRUD 변경
    fnChangeGridCrud = function(varGrid, varCrud){
		$.each(varGrid.GetRows(), function(idx, row){
			varGrid.ChangeCRUD({				
				row: idx,
				crud: varCrud
			});	
		});
    };
    
	//객체에 값 세팅 및 disabled 처리
	fnSelectDisabled = function(obj, val, flag){
		obj.val(val).attr("disabled", flag);
	}
	
	// 경품순위별 조회 결과 셋팅하기
    fnSetPremiumRank = function(data, parentObj){
    	var acnt_no = "";
    	var erpAcntUnitCd = "";
        $.each(data, function(name, val) {
        	if ( $.type(val) == "array"){
        		var idx = 0;
            	var $obj = $("[name="+name+"Tr]", parentObj);
            	
            	$.each(val, function() {
            		if ( idx > 0 ){
            			if ( name == "chasu" ){
                			fnRankStageDisplay($obj.eq($obj.length-1).find("button.btn_plus"));
                		}else{
                			fnPremiumDisplay($obj.eq($obj.length-1).find("button.btn_plus"));
                		}
               		}
            		$obj = $("[name="+name+"Tr]", parentObj);
               		fnSetPremiumRank(this, $obj.eq(idx));
               		idx++;
            	});
        	}else{
        		var formObj = $("#"+name, parentObj);
                var formObj_chk = $("#" + name + "_chk", parentObj);
                
                if(formObj != "undefined") {
                    formObj.val(val);
                }
                
                if(formObj.attr("type") == undefined){
                    formObj.change();
                }
                if(formObj_chk != "undefined"){
                    formObj_chk.val(val);
                }
                if(formObj_chk != "undefined" && formObj_chk.length == 1){
        			if(val == _BOOLEAN_TRUE){
                        formObj_chk.attr("checked" , true);
                    }else{
                        formObj_chk.removeAttr("checked");
                    }
        		}
                
                if(name == "acnt_no" && val != ""){ //회계번호
                	acnt_no = val;
                }
                if(name == "erp_acnt_unit_cd" && val != ""){ //회계번호
                	erpAcntUnitCd = val;
                }
                if(acnt_no != "" && erpAcntUnitCd != ""){ //회계번호
                	fnAcntUnitCdSelectBox(erpAcntUnitCd, acnt_no, parentObj);
                	acnt_no = "";
                	erpAcntUnitCd = "";
                }
        	}
        });
    }
    
    // 이벤트 경품정보 셋팅
    fnSetPremiumInfo = function(){
    	// 단순링크가 아닐때 경품생성
    	if ( (varEventType != _EV_EVENT_KIND_CD_LINK) && (varEventType != _EV_EVENT_KIND_CD_ONEDAYDEAL)){
    		var giftInfoTabObj = $("#eventGiftInfo");
    		$("[name=rank_exists_yn][value="+rank_exist_yn+"]").attr("checked", true);	// 등수
    		$("[name=rank_exists_yn][value="+rank_exist_yn+"]").click();	// 등수
    		
    		$("[name=probaty_param_yn][value="+probaty_param_yn+"]").attr("checked", true);	// 확률
    		$("[name=probaty_param_yn][value="+probaty_param_yn+"]").click();	// 확률
    		
    		
    		
    		if (win_prize_yn == _BOOLEAN_TRUE) {
    			$("input:checkbox[id=win_prize_yn]").attr("checked", true);	// 기준경품
    			$("#win_stand_prize").val(standVal);	// 기준경품
    			$("#win_stand_prize").show();	// 기준경품
    		}
    		
    		if (mem_rank_yn == _BOOLEAN_TRUE) {
    			$("[name=mem_rank_yn]").val(mem_rank_yn); // 멤버쉽
    			$("[name=mem_rank_yn_chk]").attr('checked', true);
        		$('.memCheck').show();
        		$('.premi_apply_mbr_area').show();
        		$('.premi_apply_val_mbr_area').show();
        		$('.premi_apply_br_area1').show();
        		$('.premi_apply_br_area2').show();
        		$('.premi_apply_br_area3').show();
        		$('.premi_apply_btn_area').show();
     		}
    		
            fnSearchChasu();	// 차수 검색
            fnRankDisplay(null, true);	// 등수별 경품정보 영역 생성
            
            var $tbody = $("#premiumTable tbody", giftInfoTabObj);
            $.each(preminumData, function(idx, val){
            	if ( idx > 0 ){
           			fnRankDisplay($tbody.eq($tbody.length-1).find("[name=rankBtn].btn_plus"), true);	// 등수별 경품정보 영역 생성
           		}
            	$tbody = $("#premiumTable tbody", giftInfoTabObj);
           		fnSetPremiumRank(this, $tbody.eq(idx));
            });
    	}
    }
    
    /********************************************************** 이벤트 공통 팝업 **********************************************************/
    
    /**
	 * 이벤트 추첨팝업
	 */
	fnEventDrawPop = function(pin){
		var varUrl = "/event/event/initDrawEntryPop.action";
		
		if(pin.move != undefined){
			var varParam = "";
			
			$.each(pin, function(name, value) {
				if(name == "move"){
					return;
				}
				varParam += ((varParam != "")?"&":"?") + escape(name) + "=" + encodeURI(value);
			});
			
			window.location.href = varUrl + varParam;
		}else{
			popup({
	            url : varUrl,
	            title : "이벤트 추첨",
	            width : "800",
	            height : "730",
	            scrollbars : true,
	            autoresize : false,
	            params :pin
	        });
		}
	};

    
})(jQuery);