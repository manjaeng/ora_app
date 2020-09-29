/**
 * 메인 화면 위젲 만들기  
 */
(function ($) {
	$(document).ready(function() {
		// 공통 -00001: 공지사항, 00002: 업무연락 
		// 콜센타 - 00003: 고객문의 미처리내역, 00004: 상품문의, 00015: 상태별 상담현황, 00016: 콜백현황, 00017: 아웃바운드현황
		// MD - 00006: 상품매출 TOP5, 00007: 상품등록현황, 00008: 카테고리매출, 00018: 주문상품속보
		// 마케터 - 00009: 회원현황, 00010: 구매고객분석(성별/연령), 00011: 이벤트현황
		// 디자이너 - 00012: 디자인요청현황
		// 협력사 - 00005: 배송현황(처리지연), 00013: 회수현황, 00014: 상품등록현황
		var widgets = {};
		widgets["00001"] = {
		    columns: [
		        { key: "NOTI_TITLE", 	header: "제목", 			width: "58%" },
		        { key: "CD_NM", 		header: "분류", 			width: "27%" },
		        { key: "START_DTIME", 	header: "공지시작일", 	width: "15%" },
		        { key: "NOTI_NO" }
		    ],
		    createRow: function(data, tbody) {
		    	var tr = $("<tr></tr>");
		    	tr.append("<td class=\"tit\"><a href=\"#\" onclick=\"return false;\">" + data["NOTI_TITLE"] + "</a></td>");
		    	tr.append("<td>" + data["CD_NM"] + "</td>");
		    	tr.append("<td>" + new Date(data["START_DTIME"].replace(/-/g, "/")).format("yyyy-MM-dd") + "</td>");
		    	tr.find(".tit>a").click(function() {
        			fnNotiViewPop({ noti_no: data["NOTI_NO"], mode:"VIEW" });
		    	});
		    	tbody.append(tr);
		    },
		    scr_link_url: "/content/noti/forward.NotiList.action"
		};
		widgets["00002"] = {
		    columns: [
		        { key: "WORK_TEL_TYPE_CD_NM",	header: "유형", 	width: "7%" },
		        { key: "TITLE", 				header: "제목", 	width: "58%" },
		        { key: "SEND_NM", 				header: "발송자", 	width: "11%" },
		        { key: "SEND_DTIME", 			header: "발송일자",	width: "24%" },
		        { key: "WORK_TEL_NO" },
		        { key: "WORK_TEL_DIVI_CD" },
		        { key: "RECV_SEQ" }
		    ],
		    createRow: function(data, tbody) {
		    	var tr = $("<tr></tr>");
		    	tr.append("<td>" + data["WORK_TEL_TYPE_CD_NM"] + "</td>");
		    	tr.append("<td class=\"tit\"><a href=\"#\" onclick=\"return false;\">" + data["TITLE"] + "</a></td>");
		    	tr.append("<td>" + data["SEND_NM"] + "</td>");
		    	tr.append("<td>" + new Date(data["SEND_DTIME"].replace(/-/g, "/")).format("yyyy-MM-dd HH:mm:ss") + "</td>");
		    	tr.find(".tit>a").click(function() {
		    		fnWorkTelInfoMgmtPop({
		    							  work_tel_no:data["WORK_TEL_NO"], 
		    							  box_divi:"INBOX", 
		    							  recv_seq:data["RECV_SEQ"] 
		    							});
		    	});
		    	tbody.append(tr);
		    },
		    scr_link_url: "/system/worktel/forward.WorkTelRecvMgmt.action"		    
		};
		widgets["00003"] = {
			count_yn: true,
		    columns: [
		        { key: "COUNSEL_NO",			header: "상담번호",	width: "15%" },
		        { key: "RECEIPT_DTIME", 		header: "접수일시", width: "20%" },
		        { key: "QUEST_TITLE", 			header: "문의제목", width: "40%" },
		        { key: "QUEST_NM", 				header: "회원명",	width: "11%" },
		        { key: "TEL_NO", 				header: "연락처", 	width: "14%" }
		    ],
		    createRow: function(data, tbody) {
		    	var tr = $("<tr></tr>");
		    	tr.append("<td class=\"tit\">" + data["COUNSEL_NO"] + "</td>");
		    	tr.append("<td class=\"tit\">" + new Date(data["RECEIPT_DTIME"].replace(/-/g, "/")).format("yyyy-MM-dd HH:mm:ss") + "</td>");
		    	tr.append("<td class=\"tit\"><a href=\"#\" onclick=\"return false;\">" + data["QUEST_TITLE"] + "</a></td>");
		    	tr.append("<td>" + data["QUEST_NM"] + "</td>");
		    	tr.append("<td>" + data["TEL_NO"] + "</td>");
		    	tr.find(".tit>a").click(function() {
		    		fnCounselViewPop({ param: { counsel_no: data["COUNSEL_NO"] } });
		    	});		    	
		    	tbody.append(tr);
		    },
		    scr_link_url: "/counsel/counsel/initCounselMgmt.action"
		};
		widgets["00004"] = {
			count_yn: true,
		    columns: [
		        { key: "COUNSEL_NO",			header: "접수번호",	width: "16%" },
		        { key: "REQ_DTIME", 			header: "요청일시", 	width: "16%" },
		        { key: "QUEST_TITLE", 			header: "문의제목", 	width: "40%" },
		        { key: "QUEST_NM", 				header: "회원명",		width: "10%" },
		        { key: "COUNSEL_STAT_CD_NM",	header: "처리상태",	width: "10%" },
		        { key: "TEL_NO", 				header: "연락처", 	width: "14%" }
		    ],
		    createRow: function(data, tbody) {
		    	var tr = $("<tr></tr>");
		    	tr.append("<td class=\"tit\">" + data["COUNSEL_NO"] + "</td>");
		    	tr.append("<td class=\"tit\">" + new Date(data["REQ_DTIME"].replace(/-/g, "/")).format("yyyy-MM-dd HH:mm:ss") + "</td>");
		    	tr.append("<td class=\"tit\"><a href=\"#\" onclick=\"return false;\">" + data["QUEST_TITLE"] + "</a></td>");
		    	tr.append("<td>" + data["QUEST_NM"] + "</td>");
		    	tr.append("<td>" + data["COUNSEL_STAT_CD_NM"] + "</td>");
		    	tr.append("<td>" + data["TEL_NO"] + "</td>");
		    	tr.find(".tit>a").click(function() {
		    		
		    	});		    	
		    	tbody.append(tr);
		    },
		    scr_link_url: "/counsel/goodinquiry/initGoodInquiryMgmt.action"
		};
		
		// 콜센타- 00015: 상태별 상담현황
		widgets["00015"] = {
			    columns: [
			        { key: "GUBUN", 	header: "구분", 		width: "10%" },
			        { key: "REQ_CNT", 	header: "요청", 		width: "10%" },
			        { key: "REC_CNT", 	header: "접수", 		width: "20%" },
			        { key: "ING_CNT", 	header: "처리중", 		width: "20%" },
			        { key: "FIN_CNT", 	header: "상담완료", 	width: "20%" },
			        { key: "APR_CNT", 	header: "승인완료", 	width: "20%" }	
			    ],
			    createRow: function(data, tbody) {
			    	var tr = $("<tr></tr>");
			    	tr.append("<td>" + data["GUBUN"] + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["REQ_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["REC_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["ING_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["FIN_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["APR_CNT"]) + "</td>");

			    	tbody.append(tr);
			    },
			    scr_link_url: "/counsel/counsel/initCounselMgmt.action"
			};
		// 콜센타 - 00016: 콜백현황
		widgets["00016"] = {
			    columns: [
			        { key: "TIME_NM", 	header: "시간", 		width: "58%" },
			        { key: "REQ_CNT", 	header: "요청", 		width: "27%" },
			        { key: "FIN_CNT", 	header: "완료", 		width: "15%" }
			    ],
			    createRow: function(data, tbody) {
			    	var tr = $("<tr></tr>");
			    	tr.append("<td>" + data["TIME_NM"] + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["REQ_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["FIN_CNT"]) + "</td>");

			    	tbody.append(tr);
			    },
			    scr_link_url: "#"
			};
		// 콜센타 - 00017: 아웃바운드현황
		widgets["00017"] = {
			    columns: [
			        { key: "OB_TYPE_NM", 	header: "아웃바운드", 	width: "40%" },
			        { key: "REC_CNT", 		header: "배분", 		width: "20%" },
			        { key: "ING_CNT", 		header: "처리중", 		width: "20%" },
			        { key: "FIN_CNT", 		header: "완료", 		width: "20%" }
			    ],
			    createRow: function(data, tbody) {
			    	var tr = $("<tr></tr>");
			    	tr.append("<td class=\"tit\">" + data["OB_TYPE_NM"] + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["REC_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["ING_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["FIN_CNT"]) + "</td>");

			    	tbody.append(tr);
			    },
			    scr_link_url: "/counsel/outbound/initOutBoundCounselorList.action"
			};
		// MD - 00006: 상품매출 TOP5 			
		widgets["00006"] = {
			    columns: [
			        { key: "GOOD_NM", 		header: "상품명", 		width: "40%" },
			        { key: "STD_GSGR_NM", 	header: "카테고리", 	width: "20%" },
			        { key: "ORD_QTY", 		header: "판매건수", 	width: "20%" },
			        { key: "SALE_AMT", 		header: "판매량", 		width: "20%" }
			    ],
			    createRow: function(data, tbody) {
			    	var tr = $("<tr></tr>");
			    	tr.append("<td class=\"tit\">" + data["GOOD_NM"] + "</td>");
			    	tr.append("<td class=\"tit\">" + data["STD_GSGR_NM"] + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["ORD_QTY"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["SALE_AMT"]) + "</td>");

			    	tbody.append(tr);
			    },
			    scr_link_url: "#"
			};
		// MD - 00007: 상품등록현황 						
		widgets["00007"] = {
			    columns: [
			        { key: "GUBUN", 			header: "구분", 			width: "10%" },
			        { key: "NEW_REQ_CNT", 		header: "신규승인요청", 	width: "7%" },
			        { key: "NEW_FIN_CNT", 		header: "신규승인완료", 	width: "7%" },
			        { key: "UPT_REQ_CNT", 		header: "수정승인요청", 	width: "7%" },
			        { key: "UPT_FIN_CNT", 		header: "수정승인완료", 	width: "7%" },
			        { key: "PRC_REQ_CNT", 		header: "단가수정요청",	    width: "7%" },
			        { key: "PRC_FIN_CNT", 		header: "단가승인완료",	    width: "7%" },
			        { key: "VEND_REQ_CNT", 		header: "업체추가승인요청", width: "7%" },
			        { key: "VEND_FIN_CNT", 		header: "업체추가승인완료",	width: "7%" },
			        { key: "SALE_CNT", 			header: "판매중", 			width: "8%" },
			        { key: "SALE_STOP_CNT", 	header: "판매중지", 		width: "8%" }
			    ],
			    createRow: function(data, tbody) {
			    	var tr = $("<tr></tr>");
			    	tr.append("<td>" + data["GUBUN"] + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["NEW_REQ_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["NEW_FIN_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["UPT_REQ_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["UPT_FIN_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["PRC_REQ_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["PRC_FIN_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["VEND_REQ_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["VEND_FIN_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["SALE_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["SALE_STOP_CNT"]) + "</td>");

			    	tbody.append(tr);
			    },
			    scr_link_url: "#"
			};
		// MD - 00008: 카테고리매출 			
		widgets["00008"] = {
			    columns: [
			        { key: "STD_GSGR_NO_LEV1_NM", 	header: "대카테고리", 		width: "30%" },
			        { key: "STD_GSGR_NO_LEV2_NM", 	header: "중카테고리", 		width: "30%" },
			        { key: "ORD_QTY", 				header: "판매건수", 		width: "20%" },
			        { key: "SALE_AMT", 				header: "판매금액", 		width: "20%" }
			    ],
			    createRow: function(data, tbody) {
			    	var tr = $("<tr></tr>");
			    	tr.append("<td class=\"tit\">" + data["STD_GSGR_NO_LEV1_NM"] + "[" + data["STD_GSGR_NO_LEV1"] + "]" + "</td>");
			    	tr.append("<td class=\"tit\">" + data["STD_GSGR_NO_LEV2_NM"] + "[" + data["STD_GSGR_NO_LEV2"] + "]" + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["ORD_QTY"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["SALE_AMT"]) + "</td>");

			    	tbody.append(tr);
			    },
			    scr_link_url: "/stats/sale/initSaleCategoryStats.action"
			};
		// MD - 00018: 주문상품속보 			
		widgets["00018"] = {
			    columns: [
			        { key: "GOODS_NO", 		header: "상품번호", 			width: "20%" },
			        { key: "GOODS_NM", 		header: "상품명", 				width: "40%" },
			        { key: "QTY", 			header: "판매수량", 			width: "20%" },
			        { key: "AMT", 			header: "판매액(할인미반영)", 	width: "20%" }
			    ],
			    createRow: function(data, tbody) {
			    	var tr = $("<tr></tr>");
			    	tr.append("<td class=\"tit\">" + data["GOODS_NO"] + "</td>");
			    	tr.append("<td class=\"tit\">" + data["GOODS_NM"] + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["QTY"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["AMT"]) + "</td>");

			    	tbody.append(tr);
			    },
			    scr_link_url: "#"
			};
		// 마케터 - 00009: 회원현황 			
		widgets["00009"] = {
			    columns: [
			        { key: "TOT_CNT", 		header: "전체회원수", 			width: "15%" },
			        { key: "MEM_CNT", 		header: "멤버십회원수", 		width: "15%" },
			        { key: "NMEM_CNT", 		header: "간편회원수", 			width: "15%" },
			        { key: "OFFMEM_CNT", 	header: "오프라인\n멤버십회원수", 	width: "15%" },
			        { key: "OFFNMEM_CNT", 	header: "오프라인\n간편회원수", 	width: "15%" },
			        { key: "NON_CNT", 		header: "비회원수", 			width: "15%" },
			        { key: "NEW_CNT", 		header: "신규고객", 			width: "15%" }
			    ],
			    createRow: function(data, tbody) {
			    	var tr = $("<tr></tr>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["TOT_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["MEM_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["NMEM_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["OFFMEM_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["OFFNMEM_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["NON_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["NEW_CNT"]) + "</td>");

			    	tbody.append(tr);
			    },
			    scr_link_url: "#"
			};
		// 마케터 - 00010: 구매고객분석(성별) 			
		widgets["00010"] = {
			    columns: [
			        { key: "GEND_NM", 		header: "성별", 			width: "25%" },
			        { key: "ORD_QTY", 		header: "판매건수", 		width: "25%" },
			        { key: "SALE_AMT", 		header: "판매금액", 		width: "25%" }
			    ],
			    createRow: function(data, tbody) {
			    	var tr = $("<tr></tr>");
			    	tr.append("<td>" + data["GEND_NM"] + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["ORD_QTY"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["SALE_AMT"]) + "</td>");

			    	tbody.append(tr);
			    },
			    scr_link_url: "#"
			};
		// 마케터 - 00011: 이벤트현황 		
		widgets["00011"] = {
			    columns: [
			        { key: "EVENT_NM", 				header: "이벤트명", 		width: "58%" },
			        { key: "EVENT_START_DTIME", 	header: "이벤트기간", 		width: "27%" },
			        { key: "ENTRY_CNT", 			header: "응모자수", 		width: "15%" }
			    ],
			    createRow: function(data, tbody) {
			    	var tr = $("<tr></tr>");
			    	tr.append("<td class=\"tit\">" + data["EVENT_NM"] + "</td>");
			    	tr.append("<td>" + new Date(data["EVENT_START_DTIME"].replace(/-/g, "/")).format("yyyy-MM-dd") + "~" + new Date(data["EVENT_END_DTIME"].replace(/-/g, "/")).format("yyyy-MM-dd")+ "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["ENTRY_CNT"]) + "</td>");

			    	tbody.append(tr);
			    },
			    scr_link_url: "/event/forward.EventMgmt.action"
			};
		// 협력사 - 00005: 배송현황(처리지연) 					
		widgets["00005"] = {
			    columns: [
			        { key: "DELI_INDI_CNT", 	header: "상품준비중", 		width: "20%" },
			        { key: "SHIP_FINI_CNT", 	header: "배송중", 		width: "20%" },
			        { key: "DELI_FINI_CNT", 	header: "배송완료", 		width: "20%" },
			        { key: "CHEN_INDI_CNT", 	header: "교환상품준비중", 		width: "20%" },
			        { key: "CHEN_SHIP_CNT", 	header: "교환배송중", 	width: "20%" },
			        { key: "CHEN_FINI_CNT", 	header: "교환배송완료", 	width: "20%" }
			    ],
			    createRow: function(data, tbody) {
			    	var tr = $("<tr></tr>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["DELI_INDI_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["SHIP_FINI_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["DELI_FINI_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["CHEN_INDI_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["CHEN_SHIP_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["CHEN_FINI_CNT"]) + "</td>");
			    	
			    	tbody.append(tr);
			    	
			    	var tr = $("<tr></tr>");
			    	tr.append("<th>재배송<br>상품준비중</th>");
			    	tr.append("<th>재배송 배송중</th>");
			    	tr.append("<th>재배송<br>배송완료</th>");
			    	tr.append("<th>추가배송<br>상품준비중</th>");
			    	tr.append("<th>추가배송<br>배송중</th>");
			    	tr.append("<th>추가배송<br>배송완료</th>");
			    	
			    	tbody.append(tr);
			    	
			    	var tr = $("<tr></tr>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["RDEL_INDI_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["RDEL_SHIP_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["RDEL_FINI_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["ADEL_INDI_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["ADEL_SHIP_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["ADEL_FINI_CNT"]) + "</td>");
			    	
			    	tbody.append(tr);
			    	
			    	var tr = $("<tr></tr>");
			    	tr.append("<th>교환회수중</th>");
			    	tr.append("<th>교환회수완료</th>");
			    	tr.append("<th>반품회수중</th>");
			    	tr.append("<th>반품회수완료</th>");
			    	
			    	tbody.append(tr);
			    	
			    	var tr = $("<tr></tr>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["RCHEN_ING_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["RCHEN_FINI_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["RET_ING_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["RET_FINI_CNT"]) + "</td>");
			    	
			    	tbody.append(tr);

			    },
			    scr_link_url: "/deli/delivery/forward.DeliveryDelayStatMgmt.action"
			};
		// 협력사 - 00013: 회수현황 			
		widgets["00013"] = {
			    columns: [
			        { key: "RET_INDI_CNT", 		header: "반품지시", 		width: "25" },
			        { key: "RET_CFM_CNT", 		header: "반품확인", 		width: "25%" },
			        { key: "RET_FINI_CNT", 		header: "반품완료", 		width: "25%" },
			        { key: "DELAY_CNT", 		header: "반품지연", 		width: "25%" }
			    ],
			    createRow: function(data, tbody) {
			    	var tr = $("<tr></tr>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["RET_INDI_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["RET_CFM_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["RET_FINI_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["DELAY_CNT"]) + "</td>");

			    	tbody.append(tr);
			    },
			    scr_link_url: "/deli/delivery/forward.DeliveryRetMgmt.action"
			};
		// 협력사 - 00014: 상품등록현황 					
		widgets["00014"] = {
			    columns: [
			        { key: "NEW_REQ_CNT", 		header: "신규승인요청", 	width: "20%" },
			        { key: "NEW_FIN_CNT", 		header: "신규승인완료", 	width: "16%" },
			        { key: "UPT_REQ_CNT", 		header: "수정승인요청", 	width: "16%" },
			        { key: "UPT_FIN_CNT", 		header: "수정승인완료", 	width: "16%" },
			        { key: "SALE_CNT", 			header: "판매중", 			width: "16%" },
			        { key: "SALE_STOP_CNT", 	header: "판매종료", 		width: "16%" }
			    ],
			    createRow: function(data, tbody) {
			    	var tr = $("<tr></tr>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["NEW_REQ_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["NEW_FIN_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["UPT_REQ_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["UPT_FIN_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["SALE_CNT"]) + "</td>");
			    	tr.append("<td class=\"rt\">" + toCurrency(data["SALE_STOP_CNT"]) + "</td>");

			    	tbody.append(tr);
			    },
			    scr_link_url: "#"
			};
		
		widgets["00019"] = {
				count_yn: true,
			    columns: [
			        { key: "COUNSEL_NO",			header: "접수번호",	width: "13%" },
			        { key: "REQ_DTIME", 			header: "요청일시", 	width: "16%" },
			        { key: "QUEST_TITLE", 			header: "문의제목", 	width: "40%" },
			        { key: "QUEST_NM", 				header: "회원명",		width: "10%" },
			        { key: "COUNSEL_STAT_CD_NM",	header: "처리상태",	width: "10%" },
			        { key: "TEL_NO", 				header: "연락처", 	width: "14%" }
			    ],
			    createRow: function(data, tbody) {
			    	var tr = $("<tr></tr>");
			    	tr.append("<td class=\"tit\">" + data["COUNSEL_NO"] + "</td>");
			    	tr.append("<td class=\"tit\">" + new Date(data["REQ_DTIME"].replace(/-/g, "/")).format("yyyy-MM-dd HH:mm:ss") + "</td>");
			    	tr.append("<td class=\"tit\"><a href=\"#\" onclick=\"return false;\">" + data["QUEST_TITLE"] + "</a></td>");
			    	tr.append("<td>" + data["QUEST_NM"] + "</td>");
			    	tr.append("<td>" + data["COUNSEL_STAT_CD_NM"] + "</td>");
			    	tr.append("<td>" + data["TEL_NO"] + "</td>");
			    	tr.find(".tit>a").click(function() {
			    		
			    	});		    	
			    	tbody.append(tr);
			    },
			    createBlankRow:function(tbody) {
			    	var tr = $("<tr></tr>");
			    	tr.append("<td colspan=\"6\">접수된 문의가 없습니다</td>");
			    	tbody.append(tr);
			    },
			    scr_link_url: "/svs/svscounsel/forward.SvsVendQuestMgmt.action"
			};
		
		widgets["00020"] = {
				count_yn: true,
			    columns: [
			        { key: "COUNSEL_NO",			header: "접수번호",	width: "13%" },
			        { key: "REQ_DTIME", 			header: "요청일시",	width: "16%" },
			        { key: "QUEST_TITLE", 			header: "문의제목", 	width: "40%" },
			        { key: "QUEST_NM", 				header: "회원명",		width: "10%" },
			        { key: "COUNSEL_STAT_CD_NM",	header: "처리상태",	width: "10%" },
			        { key: "TEL_NO", 				header: "연락처", 	width: "14%" }
			    ],
			    createRow: function(data, tbody) {
			    	var tr = $("<tr></tr>");
			    	tr.append("<td class=\"tit\">" + data["COUNSEL_NO"] + "</td>");
			    	tr.append("<td class=\"tit\">" + new Date(data["REQ_DTIME"].replace(/-/g, "/")).format("yyyy-MM-dd HH:mm:ss") + "</td>");
			    	tr.append("<td class=\"tit\"><a href=\"#\" onclick=\"return false;\">" + data["QUEST_TITLE"] + "</a></td>");
			    	tr.append("<td>" + data["QUEST_NM"] + "</td>");
			    	tr.append("<td>" + data["COUNSEL_STAT_CD_NM"] + "</td>");
			    	tr.append("<td>" + data["TEL_NO"] + "</td>");
			    	tr.find(".tit>a").click(function() {
			    		
			    	});		    	
			    	tbody.append(tr);
			    },
			    createBlankRow:function(tbody) {
			    	var tr = $("<tr></tr>");
			    	tr.append("<td colspan=\"6\">접수된 문의가 없습니다</td>");
			    	tbody.append(tr);
			    	
			    },
			    scr_link_url: "/svs/svscounsel/forward.SvsVendQuestStatList.action"
			};
	
		var createWidget = function(widget_no) {
			var widget = widgets[widget_no];
			var rows = widget.rows;
			var widget_nm = widget.widget_nm;
			var widget_loca_cd = widget.widget_loca_cd;			
			var force_apply_yn = widget.force_apply_yn;			
			var count_yn = widget.count_yn;
			var count = widget.count;
			var div = $("<div class=\"notice\" id=\"widget_layer_" + widget_no + "\" widge_no=\"" + widget_no + "\"></div>");
			div.append(
				"<div class=\"n_tit\"><strong></strong><span class=\"btns\"></span></div>" + 
				"<div class=\"n_tbl\"><table summary=\"\" cellpadding=\"0\" class=\"tbl\"><caption></caption><thead></thead><tbody></tbody></table></div>"
			);
			var btn_off = $("<button type=\"button\">열기/닫기</button>").addClass("btn_off").click(function() {
				if ($(this).hasClass("btn_off")) {
					$(this).removeClass("btn_off");
					$(this).addClass("btn_on");
					div.find(".n_tbl").hide();						
				} else {
					$(this).removeClass("btn_on");
					$(this).addClass("btn_off");
					div.find(".n_tbl").show();
				};
			});
			div.find(".btns").append(btn_off);
			if (force_apply_yn != "Y") {
				var btn_del = $("<button type=\"button\">삭제</button>").addClass("btn_del").click(function() {
					if ($("#_WIDGET_FORM").length > 0) {
						$("#_WIDGET_FORM").remove();
					};
					var form = $("<form id=\"_WIDGET_FORM\" name=\"_WIDGET_FORM\" method=\"post\"></form>").appendTo("body");
					form.empty();
					form.append("<input type=\"hidden\" name=\"widget_no\" value=\"" + widget_no + "\"></input>");
					form.append("<input type=\"hidden\" name=\"widget_loca_cd\" value=\"" + widget_loca_cd + "\"></input>");
					form.append("<input type=\"hidden\" name=\"use_yn\" value=\"N\"></input>");
					$.form("#_WIDGET_FORM").submit({
						action: "/system/main/updateWidget.action",
						iframe: true,
						success: function() {
							widgets[widget_no].use_yn = "N";
							div.hide();
						},
						error: function(p) {
							alert("error_type: " + p["error_type"] + "\nerror_message: " + p.error_message);	
						}
					});
				});
				div.find(".btns").append("&nbsp;");
				div.find(".btns").append(btn_del);
			};
			div.find(".n_tit > strong").append(widget_nm);
			if ($.type(count_yn) == "boolean" && count_yn) {
				div.find(".n_tit > strong").append("<em>(" + ($.type(count) == "number" ? toCurrency(count) : "0") + ")</em>");
			};
			div.find(".n_tbl > table").attr({ "summary" : widget_nm }).find(">caption").text(widget_nm);
			var columns = widgets[widget_no].columns;
			var colgroup = $("<colgroup></colgroup>");				
			var th_tr = $("<tr></tr>");				
			$.each(columns, function(i, c) {
				if ($.type(c.header) != "string") {
					return true;	//continue
				};
				colgroup.append("<col width=\"" + c.width + "\" />");
				th_tr.append("<th>" + c.header + "</th>");
			});
			//모두보기 버튼
			var scr_link_url = widgets[widget_no].scr_link_url;
			$.ajax({
				url: "/system/main/getMenuInfo.action",
				dataType: "json",
				data: { scr_link_url: scr_link_url },
				async: false,
				success : function(data) {
					if(data == null){
						return;
					}
					var scr_no  = data["SCR_NO"];
					var menu_no  = data["MENU_NO"];
					var link_btn = $("<button type=\"button\" class=\"button\"><span>모두보기</span></button>").click(function() {
						window.location.href = scr_link_url + "?_scr_no=" + scr_no + "&_menu_no=" + menu_no;
					});
					div.find(".n_tit").append(link_btn);
				},
				error: function(jqXHR, textStatus, errorThrown) {}
			});
			div.find("caption").after(colgroup);
			div.find("thead").append(th_tr);				
			$("#widget_loca_cd_" + widget_loca_cd).append(div);
			
			//데이타 만들기
			var tbody = div.find("tbody");			
			if ($.type(rows) != "array") {
				return true;
			};
			
			if(count == 0 && (widget_no == '00019' || widget_no == '00020')){
				widgets[widget_no].createBlankRow(tbody);
			}else{
				$.each(rows, function(i, row) {
					widgets[widget_no].createRow(row, tbody);
				});
			};
			
		};
		
		$.ajax({
			url: "/system/main/searchStUserWidgetUserListDetail.action",
			dataType: "json",			
			async: false,
			success : function(data) {
				$.each(data.list, function(i, w) {
					var widget_no = w["WIDGET_NO"];
					var widget_nm = w["WIDGET_NM"];
					var widget_loca_cd = w["WIDGET_LOCA_CD"];
					var disp_seq = w["DISP_SEQ"];
					var force_apply_yn = w["FORCE_APPLY_YN"];
					var use_yn = w["USE_YN"];
					
					if(widgets[widget_no] == undefined){
						alert("죄송합니다.\n["+widget_nm+"] 위젯내용을 가져오지 못했습니다.");
						return true;
					}
					//위젯정보를 저장한다.
					widgets[widget_no]["widget_nm"] = widget_nm;
					widgets[widget_no]["widget_loca_cd"] = widget_loca_cd;
					widgets[widget_no]["disp_seq"] = disp_seq;
					widgets[widget_no]["force_apply_yn"] = force_apply_yn;					
					widgets[widget_no]["rows"] = data[widget_no];
					if (widgets[widget_no].count_yn) {
						widgets[widget_no]["count"] = data[widget_no + "-count"];
					};
					widgets[widget_no]["use_yn"] = use_yn;
					if (use_yn != "Y") {
						return true;	//continue	
					};
					createWidget(widget_no);
				});
				// 위젯 레이어 변경시
				$( ".notice_wrap" ).sortable({
					connectWith: ".notice_wrap",
					opacity: 0.6, 
					cursor: "move",
					accurateIntersection: false,  
					forcePlaceholderSize: true, 
					placeholder: "divBoxBorder", 
					update: function() {
						var widget_loca_cd = $(this).attr("widget_loca_cd");
						if ($("#_WIDGET_FORM").length > 0) {
							$("#_WIDGET_FORM").remove();
						};
						var form = $("<form id=\"_WIDGET_FORM\" name=\"_WIDGET_FORM\" method=\"post\"></form>").appendTo("body");
						form.empty();
						$(this).find("div.notice").each(function(i, div) {
							var widget_no = $(div).attr("widge_no");							
							var widget = widgets[widget_no];
							widgets[widget_no].widget_loca_cd = F;
							widgets[widget_no].disp_seq = i + 1;
							form.append("<input type=\"hidden\" name=\"widget_no\" value=\"" + widget_no + "\"></input>");
							form.append("<input type=\"hidden\" name=\"widget_loca_cd\" value=\"" + widgets[widget_no].widget_loca_cd + "\"></input>");
							form.append("<input type=\"hidden\" name=\"use_yn\" value=\"" + widgets[widget_no].use_yn + "\"></input>");
							form.append("<input type=\"hidden\" name=\"disp_seq\" value=\"" + widgets[widget_no].disp_seq + "\"></input>");
						});
						if (form.find(":input").length > 0) {
							$.form("#_WIDGET_FORM").submit({
								action: "/system/main/updateWidgets.action",
								iframe: true,
								success: function() {
									//해줄게 없음
								},
								error: function(p) {
									alert("error_type: " + p["error_type"] + "\nerror_message: " + p.error_message);	
								}
							});
						};
					}					
				});
				// 위젯 레이어 변경시
				$( "#widget_loca_cd_10, #widget_loca_cd_20" ).disableSelection();				
				
				var widget_button = $("#_widget_button");
				widget_button.click(function(e) {
					$.ajax({
						url: "/system/main/searchStUserWidgetUserList.action",
						dataType: "json",						
						async: false,
						success : function(list) {
							var layer = $("#_WIDGET_LIST_LAYER");
							var underlayer = $("#_LAYER_OVERLAY");	//모달레이어
							var show = function() {
								underlayer.show();
								layer.show();
							};							
							var hide = function() {
								underlayer.hide();
								layer.hide();
								
								//변경 사항을 저장했는지를 확인한다. 변경 사항을 저장하지 않았다면 원복 시켜주자.
								$.each(widgets, function(widget_no, widget) {
									if (widget.use_yn == "Y") {
										$("#widget_layer_" + widget_no).show();
									} else {
										$("#widget_layer_" + widget_no).hide();
									};
								});
							};
							
							if (layer.length == 0) {
								layer = $(
									"<div class=\"layer_wrap\" id=\"_WIDGET_LIST_LAYER\" style=\"width:236px; z-index: 1002;\">" +
									"	<p class=\"close\">Main화면 Widget 설정<button type=\"button\" onclick=\"return false;\">닫기</button></p>" +
									"	<div class=\"lyr_li\"><ul></ul></div>" +
									"	<div class=\"lyr_btns\">" +
									"		<button type=\"button\" class=\"button_chk\" ><span>확인</span></button>" +
									"	</div>" +
									"</div>"		
								).hide();
								layer.find(".close>button").click(function() {
									hide();
								});
								layer.find(".button_chk").click(function() {
									if ($("#_WIDGET_FORM").length > 0) {
										$("#_WIDGET_FORM").remove();
									};
									var form = $("<form id=\"_WIDGET_FORM\" name=\"_WIDGET_FORM\" method=\"post\"></form>").appendTo("body");
									form.empty();
									var count = 0;
									layer.find(":checkbox").each(function() {
										var widget_no = this.value;
										var widget = widgets[widget_no];
										var widget_loca_cd = widgets[widget_no].widget_loca_cd;
										var use_yn = widget.use_yn;
										if (!this.disabled) {
											if ((this.checked ? "Y" : "N") != use_yn) {	//변경된 위젯만 저장되도록 하자.
												form.append("<input type=\"hidden\" name=\"widget_no\" value=\"" + widget_no + "\"></input>");
												form.append("<input type=\"hidden\" name=\"widget_loca_cd\" value=\"" + widget_loca_cd + "\"></input>");
												form.append("<input type=\"hidden\" name=\"use_yn\" value=\"" + (this.checked ? "Y" : "N") + "\"></input>");
												count++;
											};
										};
									});
									if (count > 0) {
										$.form("#_WIDGET_FORM").submit({
											action: "/system/main/updateWidgets.action",
											iframe: true,
											success: function() {
												layer.find(":checkbox").each(function() {
													widgets[this.value].use_yn = (this.checked ? "Y" : "N");
												});
												hide();
											},
											error: function(p) {
												alert("error_type: " + p["error_type"] + "\nerror_message: " + p.error_message);	
											}
										});
									} else {
										alert("변경된 내용이 없습니다.");
									};
								});
								layer.appendTo("body");
								layer.css({
									top: widget_button.offset().top,
									left: widget_button.offset().left - layer.width()
									//top: (parseInt($.ui.dialog.overlay.height().replace(/px/g, ""), 10) / 2) - (layer.height() / 2),
									//left: (parseInt($.ui.dialog.overlay.width().replace(/px/g, ""), 10) / 2) - (layer.width() / 2)
								});
							};
							if (underlayer.length == 0) {
								underlayer = $("<div id=\"_LAYER_OVERLAY\" ></div>").css({
									position: "absolute",
									display: "none",
									top: "0px", 
									left: "0px", 
									width: "100%", 
									height: "100%",
									background: "url(images/ui-bg_diagonals-thick_20_666666_40x40.png) 50% 50% repeat",
									"z-index": 1001
								}).appendTo("body").click(function() {
									hide();
								});
							};
							if (layer.css("display") == "none") {
								show();
							} else {
								hide();
								return false;
							};
							layer.find(".lyr_li>ul").empty();
							$.each(list, function(i, data) {
								if(widgets[data["WIDGET_NO"]] == undefined){
									return true;
								}
								var widget_no = data["WIDGET_NO"]; 
								var widget_nm = data["WIDGET_NM"];
								var use_yn = data["USE_YN"];
								var force_apply_yn = data["FORCE_APPLY_YN"];
								var li = $("<li></li>");
								var checkbox = $("<input type=\"checkbox\" value=\"" + widget_no + "\" class=\"checkbox\" name=\"my_widget_checkbox_" + widget_no + "\" id=\"my_widget_" + widget_no + "\" />");
								checkbox.click(function() {
									var widget_layer = $("#widget_layer_" + widget_no);
									if (this.checked) {
										if (widget_layer.length == 0) {
											$.ajax({
												url: "/system/main/searchStUserWidgetList.action",
												dataType: "json",
												data: { widget_no: widget_no },
												async: false,
												success : function(data) {
													widgets[widget_no].rows = data["list"];													
													if (widgets[widget_no].count_yn) {
														widgets[widget_no].count = data[widget_no + "-count"];
													};
													createWidget(widget_no);
												},
												error: function(jqXHR, textStatus, errorThrown) {alert("죄송합니다. 위젯내용을 가져오지 못했습니다.");}
											});
										} else {
											widget_layer.show();											
										};
									} else {
										widget_layer.hide();
									};
								});
								if (use_yn == "Y") {
									checkbox.attr({
										checked: "checked"
									});
								};
								if (force_apply_yn == "Y") {
									checkbox.attr({
										disabled: "disabled"
									});
								};
								li.append(checkbox);
								li.append("<label for=\"my_widget_" + widget_no + "\">" + widget_nm + "</label>");
								layer.find(".lyr_li>ul").append(li);
							});														
						},
						error: function(jqXHR, textStatus, errorThrown) {}
					});
				});				
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert("죄송합니다. 위젯내용을 가져오지 못했습니다.");					
			}
		});
		
		fnWorkTelInfoMgmtPop = function(param){
			popup({
	            url : "/system/worktel/initWorkTelInfoMgmtPop.action",
	            winname : "WorkTelInfoInsPop",
	            params :param,
	            title : "업무연락 등록",
	            type : "l",
	            height : "650px",
	            scrollbars : true,
	            autoresize : false
	        });
	    };
		
	});
})(jQuery);