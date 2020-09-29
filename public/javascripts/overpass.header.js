(function ($) {
	$(document).ready(function() {
		m1s = [];	//var 붙이지 않는다... content_frame에서도 접근해야 함...
		
		var selected_m3_no = null;
		var frame = null;
		
		clickMenu = function(m3, a, snb) {			
			selected_m3_no = m3.menu_no;								
			var p = null;
			if (m3.pop_yn == "N") {
				goMenuPage(m3.scr_link_url, m3.scr_no, m3.menu_no);	
			} else {
				var p = JSON.parse(m3.scr_link_url);
				popup(p);
				var frame = parent.frames["content_frame"];
				var stat = frame.$("#sub").width() + "px";
				frame.$("#contents").css("left", "0");
		    	frame.$("#sub").css("left", "-" + stat);
		    	$(a).addClass("over");
		    	if ($.type(snb) == "object") {
		    		snb.hide();
		    	};
			};
		};
		
		//컨텐츠 페이지 이동
		goMenuPage = function(link, scr_no, menu_no) {
			if (link == "" && ($.type(link) != "string" || $.type(scr_no) != "string" || $.type(menu_no) != "string")) {
				alert("메뉴를 이동 할 수 없습니다.");
				return false;
			};
			if (link.indexOf("?") > 0) {
				link = link + "&_scr_no=" + scr_no + "&_menu_no=" + menu_no;
			} else {
				link = link + "?_scr_no=" + scr_no + "&_menu_no=" + menu_no;
			};
			console.dir(link);
			//메뉴 이동
			parent.frames["content_frame"].location.href = link;
		};
		
		//사용자별 메뉴 조회
		$.ajax({
			url: "/system/persarea/searchStUserMenuByUser.action",
			type: "POST",
			dataType: "json",
			data: {},
			async: false,
			success: function(ms) {								
				$.each(ms, function(i, m) {
					//대메뉴					
					if (m.rank1 == 1) {
						var m1 = {
							menu_no: m.m1_menu_no,
							menu_nm: m.m1_menu_nm,
							cls: null,
							m2s: []		
						};
						m1s.push(m1);
					};
					
					//중메뉴					
					if (m.rank2 == 1) {
						var m2 = {
							menu_no: m.m2_menu_no,
							menu_nm: m.m2_menu_nm,
							cls: null,
							m3s: []	
						};
						m1s[m1s.length - 1].m2s.push(m2);
					};
					
					//소메뉴
					var m3 = {
						menu_no: m.m3_menu_no,
						menu_nm: m.m3_menu_nm,
						scr_no: m.scr_no,
						scr_nm : m.scr_nm,
						scr_link_url: m.scr_link_url,
						pop_yn: m.pop_yn	
					};					
					m1s[m1s.length - 1].m2s[m1s[m1s.length - 1].m2s.length - 1].m3s.push(m3);
				});
			},
			error: function() {
				alert("죄송합니다. 사용자 메뉴를 가져올 수 없습니다.");
			}
		});
		
		$("#view_menu_button").click(function() {
			var frame = parent.frames["content_frame"];
			if ($.type(frame) != "object") {
				alert("페이지가 로딩중 입니다. 잠시만 기다려 주세요.");
				return false;
			};
			
			var stat = frame.$("#sub").width() + "px";
			
			if (frame.$("#contents").css("left") != stat) {	//메뉴를 보여주자...
				var ul = frame.$("#menu_ul")
				if (ul.length != 1) {
					alert("페이지가 로딩중 입니다. 잠시만 기다려 주세요.");
					return false;
				};
				if (ul.find(">li").length == 0) {
					//메뉴셋팅
					var selected_m1 = null;
					$.each(m1s, function(m1no, m1) {	//대메뉴 셋팅
						var m1_ul = $("<ul id=\"" + m1.menu_no + "\" m1no=\"" + m1no + "\"></ul>");
						var m1_menu = $("<li class=\"mn\"><a href=\"#\" class=\"cm\" onclick=\"return false;\">" + m1.menu_nm + "</a><div class=\"sml\"></div></li>");
						m1_menu.find(">div").append(m1_ul);
						ul.append(m1_menu);
						
						if (m1.cls != null) {
							m1_menu.addClass("active");
							selected_m1 = m1_ul;
						};
						$.each(m1.m2s, function(m2no, m2) {	//중메뉴 셋팅
							var m2_ul = $("<ul id=\"" + m2.menu_no + "\" m2no=\"" + m2no + "\" ></ul>");
							var m2_menu = $("<li><a href=\"#\" onclick=\"return false;\" >" + m2.menu_nm + "</a></li>");
							m2_menu.append(m2_ul);
							m1_ul.append(m2_menu);
							$.each(m2.m3s, function(m3no, m3) {	//소메뉴 셋팅
								var scr = $("<li class=\"context_link_menu\" popup=\"" + m3.pop_yn + "\"><a href=\"#\" onclick=\"return false;\" no=\"" + m1no + "|" + m2no + "|" + m3no + "\">" + m3.menu_nm + "</a></li>");
								if (selected_m3_no == m3.menu_no) {								
									scr.find(">a").addClass("over");	
								};
								scr.find(">a").click(function() {
									subMenuActive();
									clickMenu(m3, this);
								});
								m2_ul.append(scr);
							});						
						});
					});
					//메뉴셋팅-->
					if (selected_m1 == null) {
						if (m1s.length > 0) {
							m1s[0]	.cls = "active";
							selected_m1 = $("#" + m1s[0].menu_no, ul);
							selected_m1.parent().parent().addClass("active");
						};
					};
					
					frame.$.contextMenu({
						selector: ".context_link_menu[popup=N]",
				        items: {
				            _new: {
				            	name: "새창", 
				            	//icon: "edit", 
				            	callback: function(a, b) {
				            		var $a = this.find(">a");
				            		var nos = $a.attr("no").split("|");
				            		var m3 = m1s[nos[0]].m2s[nos[1]].m3s[nos[2]];
				            		var target = "NEW_WINDOW_" + new Date().getTime();
				            		//새창 뛰우고 메뉴 숨기기
				            		frame.$("#contents").css("left", "0");
				    		    	frame.$("#sub").css("left", "-" + stat);
				            		window.open(m3.scr_link_url, target, "menubar=yes, scrollbars=yes, resizable=yes, status=yes");
				            	}
				            },
				            _tab: {
				            	name: "새탭", 
				            	//icon: "cut",
				            	callback: function() {
				            		var $a = this.find(">a");
				            		var nos = $a.attr("no").split("|");
				            		var m3 = m1s[nos[0]].m2s[nos[1]].m3s[nos[2]];				            		
				            		var $f = $("#_CONTEXT_MENU_FORM");
				            		if ($f.length > 0) {
				            			$f.remove();
				            		};
				            		$f = $("<form id=\"_CONTEXT_MENU_FORM\"></form>");
				            		$f.appendTo("body");
				            		$f.attr({
				            			target: new Date().getTime(),
				            			action: m3.scr_link_url,
				            			method: "post"
				            		}).submit();
				            	}
				            }
				        }
					});
					frame.$.contextMenu({
						selector: ".context_link_menu[popup=Y]",
				        items: {
				            _popup: {
				            	name: "팝업", 
				            	callback: function(a, b) {
				            		var $a = this.find(">a");
				            		var nos = $a.attr("no").split("|");
				            		var m3 = m1s[nos[0]].m2s[nos[1]].m3s[nos[2]];
				            		clickMenu(m3, $a[0]);
				            	}
				            }
				        }
					});
					
					//메뉴 셋팅후 스크립트 적용
					var li_list = ul.find(">li");
					
					// Show Menu
					function show_menu() {
						t = $(this);
						var m1no = t.parent("li").find(">div>ul").attr("m1no");
						//li_list.removeClass("active");
						li_list.each(function(i, li) {					
							$(li).removeClass("active");
							m1s[$(li).find(">div>ul").attr("m1no")].cls = null;
						});
						t.parent("li").addClass("active");
						m1s[m1no].cls = "active";
					};
					
					//대메뉴 클릭시
					li_list.find(">a").click(show_menu).focus(show_menu);
					
					// Side SUB Menu
					var sMenu = frame.$("div.sml", ul);					
					var sItem = sMenu.find(">ul>li");
					var ssItem = sMenu.find(">ul>li>ul>li");				
					
					sItem.find(">ul").hide();		//일단 소메뉴를 숨기자...
					sMenu.find(">ul>li>ul>li[class=active]").parents("li").attr("class", "active");
					sMenu.find(">ul>li[class=active]").find(">ul").css("display", "block");
					
					var lastEvent = null;
					function sMenuToggle(e, a) {		//중메뉴 클릭시...
						var t = a || $(e.target);
						if (e != null) {	//중메뉴 클릭시 click과 focus 이벤트가 동시에 발생하므로 한번만 적용되도록 하자..
							if (e.target == lastEvent) {
								return false
							};					
							lastEvent = e.target;
							setTimeout(function() { lastEvent=null }, 200);	
						};
						
						//같은 대분류 내에서 중분류는 한개만 펼쳐지도록 한다.
						t.parent().parent().find("li.active").each(function() {
							if ( t.next("ul").attr("id") != $(this).find(">ul").attr("id") ) {
								$(this).find(">ul").hide();
								$(this).removeClass("active");
								var m1no = $(this).parent().attr("m1no");					
								var m2no = $(this).find(">ul").attr("m2no");
								var m2 = m1s[m1no].m2s[m2no];								
								m2.cls = null;
							};
						});
						
						if (t.next("ul").is(":hidden")) {
							t.next("ul").show();
						} else if(!t.next("ul").length) {
							sItem.find(">ul").hide();
						} else {
							t.next("ul").hide();
						};
						
						var m1no = t.parent("li").parent().attr("m1no");					
						var m2no = t.parent("li").find(">ul").attr("m2no");
						var m2 = m1s[m1no].m2s[m2no];
						
						//페이지 이동 후에도 중메뉴 클릭정보를 보여주도록 한다.
						if (t.parent("li").hasClass("active")) {
							t.parent("li").removeClass("active");						
							m2.cls = null;
						} else {
							t.parent("li").addClass("active");
							m2.cls = "active";
						};
					};
					
					sItem.find(">a").click(function(e) {	//중메뉴 클릭시...
						sMenuToggle(e);
					}).focus(function(e) {
						sMenuToggle(e);
					});
					
					function subMenuActive() {	//소메뉴 클릭시...
						ssItem.removeClass("active");
						$(this).parent(ssItem).addClass("active");
					};
					
					if (selected_m1 != null) {
						selected_m1.find(">li").each(function(i, l) {
							var li = $(l);
							var m2no = li.find(">ul").attr("m2no");					
							var m1 = m1s[selected_m1.attr("m1no")];
							var m2 = m1.m2s[m2no];					
							if (m2.cls != null) {
								sMenuToggle(null, li.find(">a"));
							};
						});	
					};
				};
				
				//메뉴 보이기
				frame.$("#contents").css("left" , stat);
		    	frame.$("#sub").css("left", "0");
			} else {
				frame.$("#contents").css("left", "0");
		    	frame.$("#sub").css("left", "-" + stat);
			};
		});
		
		var addBookMark = function() {
			var frame = parent.frames["content_frame"];
			if ($.type(frame._menu_no) != "string") {
				alert("죄송합니다. 페이지가 로딩중 이거나 즐겨찾기 할 수 없는 페이지 입니다.");
				return false;	
			};
			var menu_no = frame._menu_no;
			$.ajax({
				url: "/system/persarea/registStUserMenuByUserBookmark.action",
				type: "POST",
				dataType: "json",
				data: {
					menu_no: menu_no,
					menu_divi_cd: "20",
					sort_seq: 0,
					use_yn: "Y"
				},
				async: false,
				success: function() {
					alert("바로가기가 등록되었습니다.");
					loadBookMark();
				},
				error : function() {
					alert("죄송합니다. 바로가기를 추가할 수 없습니다.");
				}
			});
		};
		
		//바로가기 조회
		var loadBookMark = function() {
			$.ajax({
				url: "/system/persarea/searchStUserMenuByUserBookmark.action",
				type: "POST",
				dataType: "json",
				data: {
					use_yn: "Y",
					rownum: 10			
				},
				async: false,
				success: function(menus) {
					$.each(menus, function(i, menu) {
						var li = $("li", "#lnb").eq(i);
						li.find("a").remove();
						li.append("<a href=\"#\" class=\"gm\" title=\"" + menu.SCR_NM + "\">" + (menu.SCR_NM.length > 7 ? menu.SCR_NM.substring(0,7) + ". . ." : menu.SCR_NM) + "</a>");
						li.append("<a href=\"#lnb\" onclick=\"return false;\" class=\"off\">메뉴삭제</a>");
						
						$("a", li).eq(0).click(function() {
							//메뉴 이동
							goMenuPage(menu.SCR_LINK_URL, menu.SCR_NO, menu.MENU_NO);
						});
						$("a", li).eq(1).click(function() {
							//바로가기 삭제
							$.ajax({
								url: "/system/persarea/registStUserMenuByUserBookmark.action",
								type: "POST",
								dataType: "json",
								data: {
									menu_no: menu.MENU_NO,
									menu_divi_cd: "20",
									use_yn: "N"
								},
								async: false,
								success: function() {
									alert("바로가기가 삭제되었습니다.");
									loadBookMark();
								},
								error : function() {
									alert("죄송합니다. 바로가기를 삭제할 수 없습니다.");
								}
							});
							li.find("a").remove();
							li.append("<a href=\"#lnb\" class=\"on\" onclick=\"return false;\">메뉴추가</a>");					
							$("a", li).eq(0).click(addBookMark);					
						});
					});
				}, 
				error: function() {
					alert("죄송합니다. 바로가기 메뉴를 가져 올 수 없습니다.");
				}
			});		
		};
		
		loadBookMark();
		
		//바로가기 추가
		$("a.on", "#lnb").click(addBookMark);
		
		$("#goMain").click(function() {
			parent.content_frame.location.href = "/welcome.action";
		});
		
		$("#logout_button").click(function() {
			top.location.href = "/system/login/logout.action";
		})
		
		$("#modifyUserInfoBtn").click(function(){
			fnCheckUserPwPop();
			//fnModifyUserInfoPop();
		});
		
  		/*
  		 * 공지사항 리스트 조회
  		 */
  		fnNotiListPop = function(param){
			popup({
	            url : "/popup/initNotiListPop.action",
	            winname : "NotiList_pop",
	            title : "공지사항",
	            params :param,
                type : "xl",
                width : "800px",
                height : "700x",
	            autoresize : false
	        });
  		}
  		
  		/*
  		 * 미확인 업무연락 리스트 조회
  		 */
  		fnRecvInfoListPop = function(param){
			popup({
	            url : "/system/worktel/initWorkTelRecvListPop.action",
	            winname : "RecvInfoList_pop",
	            title : "미확인 업무연락",
	            params :param,
                type : "xl",
                width : "800px",
                height : "700x",
	            autoresize : false
	        });
  		}  		
  		/*
  		 * 진행중 시스템 공지 리스트조회
  		 */
  		fnSysLogInfoListPop = function(param){
			popup({
	            url : "/system/system/initSysLogInfoListPop.action",
	            winname : "SysLogInfoList_pop",
	            title : "진행중 시스템 공지 조회",
	            params :param,
                type : "xl",
                width : "800px",
                height : "900x",
	            autoresize : false
	        });
  		}  					
	});
})(jQuery);