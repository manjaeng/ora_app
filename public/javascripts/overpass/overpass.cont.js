(function ($) {
	
    /**
     * 게시판상세
     * fnBbsViewPop({bbs_no:"99999999",bbs_seq:"9999999999",mbr_no:"9999999"})
     * @param bbs_no, bbs_seq, answ_seq, mbr_no
     */
    fnBbsViewPop = function(param) {
		popup({
            url : "/content/bbs/initBbsViewPop.action",
            winname : "BbsViewPop",
            title : "게시판 상세",
            params :param,
            type : "xml",
            height : (param.answ_seq == "9999999")?"830px":"770px",
            scrollbars : true,
            autoresize : false
        });
    };
    
    
    /**
     * 게시판등록
     * 
     * @param answYn, wrtGubun, bbs_no, clss_type_no, bbs_type_cd, clss_nm, bbs_nm
     * wrtGubun 은 Const 에 정의되어있는 CT_WRT_DIVI_CD = "CT0003"; // 작성자 구분코드
     */
    fnInsertBbsPop = function(param) {
		popup({
            url : "/content/bbs/forward.BbsInsPop.action",
            winname : "BbsIns_pop",
            title : "게시물등록",
            params : param,
            type : "xml",
            height : (param.answYn == "Y")?"302px":"635px",
            scrollbars : false,
            autoresize : false
        });
    };
    
    
    /**
     * 상품평 상세
     * 
     */
	  fnGoodsEvalDetailPop = function(param){
  		popup({
                 url : "/content/goodseval/initGoodsEvalDetailPop.action",
                 winname : "GoodsEvalDetailPop",
                 params :param,
                 title : "상품평 상세",
                 type : "m",
                 width: "700px",
                 height : "550px",
                 scrollbars : true,
                 autoresize : false
         });	
	  };
   
	  /**
     * 업무연락  발송일시 없는 것 발송처리 팝업
     * fnJobTelInfoSevedSendPop({job_tel_no:row["JOB_TEL_NO"],recv_yn:row["RECV_YN"],mboxgubun:$("#mBoxGubun").val(),jobTelDiviCd:"<%=Const.ST_WORK_TEL_DIVI_CD_SEND%>",workgubun:"send"});
	 */ 
	  fnJobTelInfoSevedSendPop = function(param){
			popup({
	            url : "/cont/jobtel/initJobTelInfoSevedSendPop.action",
	            winname : "JobTelInfoInsPop",
	            params :param,
	            title : "업무연락 등록",
	            type : "l",
	            height : "650px",
	            scrollbars : true,
	            autoresize : false
	        });
	  };
	  /**
	     * 업무연락  작성
	     * fnJobTelInfoInsPop({jobTelDiviCd:"<%=Const.ST_WORK_TEL_DIVI_CD_SEND%>"});
	     */ 
	  fnJobTelInfoInsPop = function(param){
			popup({
	            url : "/cont/jobtel/forward.JobTelInfoInsPop.action",
	            winname : "JobTelInfoInsPop",
	            params :param,
	            title : "업무연락 등록",
	            type : "l",
	            height : "650px",
	            scrollbars : true,
	            autoresize : false
	        });
	  };
	  
	  /**
	     * 업무연락  수신자찾기
	     * JobTelGrpRecvListPop({multi_yn:"<%=Const.BOOLEAN_TRUE%>",form:'schrForm', rtnFunc:'fnSetaddresseeInfoGrid'});
	     */ 	  
	  JobTelGrpRecvListPop = function(param){
  		popup({
            url : "/cont/jobtel/forward.JobTelGrpRecvListPop.action",
            winname : "JobTelGrpRecvListPop",
            title : "업무연락수신자 찾기",
            params :param,
            type : "l",
            height : "650px",
            scrollbars : true,
            autoresize : false
        });
	  };
  		
  		/*
  		 * 공지사항 등록
  		 */
  		fnNotiInsPop = function(param){
			popup({
	            url : "/content/noti/forward.NotiInsPop.action",
	            winname : "NotiIns_pop",
	            title : "공지사항등록",
	            params :param,
                type : "xl",
                height : "750px",
	            scrollbars : true,
	            autoresize : false
	        });
  		}
  		
  		/*
  		 * 설문상세
  		 */
  		fnPollPtcoDetailPop = function(param){
    		popup({
                url : "/content/poll/initPollPtcoDetailPop.action",
                winname : "PollPtcoDetailPop",
                params :param,
                title : "설문참여 상세",
                type : "xml",
                height : "510px",
                scrollbars : true,
                autoresize : false
            });
  		};
  		
		fnQuestItemListPop = function(pin) {
			//해당 받는 펑션은 기본으로 셋팅해 준다. 
			var pinParam = { rtnFunc :((pin.rtnFunc)?pin.rtnFunc:(pin.callback)?"":"fnSetQuestItemForForm") };

			var strTitle = (pin.title == undefined) ? "질문항목조회" : pin.title;
			
			
			if (pin.param != undefined) {
				
				$.extend(pinParam, pin.param);
			}

			var defaultParam = {
					url : "/content/poll/forward.PollQuestItemListPop.action",
					winname : "PollQuestItemListPop",
					title : strTitle,
					type : "l",
					height : "500",
					scrollbars : false,
					autoresize : false
				};
			pin = $.extend(defaultParam, pin||{});
			popup(pin);
		};
		
  		/*
  		 * 설문회원조회
  		*/
  		fnPollPtcoListPop = function(param){
  			popup({
  				url : "/content/poll/forward.PollPtcoListPop.action",
  				winname : "PollPtcoListPop",
  				params : param,
  				width : "800px",
  				height : "680px",
  				scrollbars : true,
  				autoresize : false
  			});
  		}

    
})(jQuery);