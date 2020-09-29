
	var Browser = (function(){
		
		var returnObj = {};
	    returnObj.type ="";
	    returnObj.version= "";
	
		var browerAgent = navigator.userAgent;
		
		var browerType = ""; // 브라우져 종류
		// 브라우져 종류 설정.
		if (browerAgent.indexOf("Chrome") != -1) {
		    browerType = "Chrome";
		} else if (browerAgent.indexOf("Firefox") != -1) {
		    browerType = "Firefox";
		} else if (browerAgent.indexOf("Safari") != -1) {
		    browerType = "Safari";
		} else if (browerAgent.indexOf("MSIE") != -1) {
		    browerType = "MSIE";
		}else{
		    browerType = "Opera";       
		}
		
		returnObj.type = browerType;        
	        
		var rv = -1; // Return value assumes failure.      
		var ua = navigator.userAgent;
		var re = null;
		
		if (browerType == "MSIE") {
		    re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		} else {
		    re = new RegExp(browerType + "/([0-9]{1,}[\.0-9]{0,})");
		}
		if (re.exec(ua) != null) {
		    rv = parseFloat(RegExp.$1);
		}
		
		returnObj.version = rv;
		
		return returnObj;
	
	        
	})();
	
	
	/***
	* 상수 정보 저장
	*
	*
	*/
	
	var BNGeneratorConst = {
			//아이템 형식 
			_TYPE : {
				I : "I", //이미지
				B: "B", //배경 패널
				T: "T" //TEXT
			},
			//옵션 코드
			_OPTCD : {

				SC : "1000000033",   		// 표준 배너 선택 사항 코드
				TC : "1000000036",				// 타이틀(기획전) 배너 선택 사항 코드
				TB : "1000000034", 	// 타이틀(기획전) 배너 장식 선택 사항 코드
				TD : "1000000035"		// 타이틀(기획전) 배너 배경이미지 선택 사항 코드
			},
			_COUPON_TEXT : {
				fontFamily : "Malgun Gothic",
				fontSize : "10",
				fontWeight : "bold",
				color : "#000000"
			},
			
			_FONT_SIZE : {
				
				 "9" : {
					 size : "9",
					 interlineSpacing : "0",
					 letterSpacing : "-1",
					 lineHeight : "0"
				 },				 
				 "10" : {
					 size : "10",
					 interlineSpacing : "0",
					 letterSpacing : "-1",
					 lineHeight : "0"
				 },
				 "12" : {
					 size : "12",
					 interlineSpacing : "0",
					 letterSpacing : "-1",
					 lineHeight : "0"
				 },
				 "14" : {
					 size : "14",
					 interlineSpacing : "0",
					 letterSpacing : "-1",
					 lineHeight : "0"
				 },	
				 "18" : {
					 size : "18",
					 interlineSpacing : "0",
					 letterSpacing : "-1",
					 lineHeight : "0"
				 },	 
				 "24" : {
					 size : "24",
					 interlineSpacing : "0",
					 letterSpacing : "-1",
					 lineHeight : "0"
				 },
				 "32" : {
					 size : "32",
					 interlineSpacing : "0",
					 letterSpacing : "-1",
					 lineHeight : "0"
				 }	 	 				 
			},
			
			_FONT_FAMILY : {
				
				 "MalgunGothic" : "Malgun Gothic",		 
				 "NanumPen" : "Nanum Pen"
			}			
	}
	
	
	/**
	* 배너 생성기에 필요한 Json 객체의 인터페이스를 정의 한다.
	*
	*/
	var BNGeneratorInterface = {
				
			/** 구동에 필요한 설정 객체 */
			config : {
				/* parent divId를 저장한다*/
				divId : "",						
				/* 표준 배너 모드 인자 기획전 배너 인지 구분*/
				mode : "",				
				/* 사이트 이미지를 호출한 상위사이트 번호까지의 URL*/				
				siteImgUrl : "",
				
				/* 타이틀 배너 아이템 레디오 name */				
				choiceItemRadio : "choiceItemRadio",
				
				/*표준 배너 실행시 초기에 수행되어야 하는 이벤트 아이디들을 지정. */
				eventTarget :  [ {
						canvasId : "",   // 캔버스 아이디
						panelId : "",     // 패널 아이디
						textItemId : [""]		// 타이틀 및 내용을 입력하는 텍스트 아이디		
					}],
				/* 상품이미지를 호출하는 주소 */	
				prdImgLoad : "",
				/* 상품 번호를 입력하는 인풋 아이디 */					
				prdNoInputId : "",
				/* 선택 아이템 이미지를 호출 하는 주소. */									
				choiceImgLoad : "",
				/* 선택 아이템 이미지 html을 집어넣을 타켓 아이디 */									
				choiceImgTargetId : "",
				/* 배너를 생성 하는 URL*/				
				generatorUrl : "",
				/* 마우스 오른쪽 버튼을 클릭시 생성되는 컨텍스트 메뉴 아이디*/								
				contextMenu : "",
				/*텍스트 메뉴를 클릭 한다.*/
				textMenu : "",
				/*텍스트 컬러 input 아이디.*/				
				textColorInput : "",
				/*이미지 다운로드 경로*/
				imgDownLoadUrl : "",
				imgUpLoadUrl : ""
			},
			
			/** 패널에 추가되는 아이템의 메타정보를 구성.   */
			itemDto : {
					type : "",
					width : "",
					height : "",
					posX : "",
					posY : "",
					bgColor : "#FFFFFF",
					color : "",
					fontSize : "",
					fontFamily : "",
					lineHeight : "",
					interlineSpacing : "",
					letterSpacing : "",
					text : "",
					align : "",
					style : "",
					fontWeight : "",
					imgPath : "",
					textYn :"N",
					choiceTextInfo : {},
					zIndex : ""
			}
	}

	
	
	var OBGtemplate = {
			// 180x250 template 정보.
		standard : [
				// 180x250 template 정보.
				[{
					type : "T",
					width : "162",
					height : "30",
					posX : "8",
					posY : "178",
					fontFamily : "Malgun Gothic",
					lineHeight : "18",
					interlineSpacing : "-4",
					color : "#000",
					letterSpacing : "-1",
					fontSize : "16",
					fontWeight : "bold"
				},
				{
					type : "T",				
					width : "162",
					height : "64",
					posX : "8",
					posY : "216",
					fontFamily : "Malgun Gothic",
					lineHeight : "14",
					interlineSpacing : "-2",					
					color : "#777777",
					letterSpacing : "-1",
					fontSize : "10",
					fontWeight : "bold",
				}]
			,
			// 180x120 template 정보.		
				[{
					type : "T",
					width : "172",
					height : "15",
					posX : "3",
					posY : "82",
					fontFamily : "Malgun Gothic",
					lineHeight : "18",
					interlineSpacing : "-2",					
					color : "#000",
					letterSpacing : "-1",
					fontSize : "13",			
					fontWeight : "bold",
				},
				{
					type : "T",
					width : "172",
					height : "13",
					posX : "3",
					posY : "99",
					fontFamily : "Malgun Gothic",
					lineHeight : "14",
					interlineSpacing : "-2",					
					color : "#777777",	
					letterSpacing : "-1",
					fontSize : "10",
					fontWeight : "bold",
					
				}]
			]
	/*		
		title : [
				// 180x250 template 정보.
				[{
					type : "T",
					width : "200",
					height : "30",
					posX : "600",
					posY : "280",
					fontFamily : "Malgun Gothic",
					interlineSpacing : "0",
					letterSpacing : "-1",
					lineHeight : "0",
					fontSize : "16",
					fontWeight : "bold",
					text : "자기야!! 나 저거 갖고싶엉~"

				},
				
				{
					type : "T",				
					width : "500",
					height : "64",
					posX : "240",
					posY : "112",
					fontFamily : "Malgun Gothic",
					interlineSpacing : "0",
					letterSpacing : "-1",
					lineHeight : "0",
					fontSize : "24",
					fontWeight : "bold",
					text : "와!!! 겨울이다!!!! 12월 시즌 기념!! 빅 오픈~!!"
				}]
			]*/
		}

	
	
	
	var BNGenerator = function(config) {
		
		/** 언제 어디서든 공유 할 수 있는 static한 값을 정의한다.		*/
		var static_define = {

				/** 현재 선택된 Cansvas 아이디. */			
				currCanvasId : null ,
				
				/** 현재 선택된 Panel 아이디. */			
				currPanelId : null,
				
				/** 추가된 아이템을 감싼 div 아이디. */		
				currParentId : null,
				
				/** 현재 선택된 childId. */			
				currChildId : null,
				
				/** 이미지 합성에 필요한 정보들을 전부 담는다. */
				metaData : {},
				
				/** 인덱스 정보를 담는다. */
				indexData : {},
				
				/** 현재 지정한 배경 색을 담는다*/
				currBgColor : "none",
				
				/**  현재 지정한 폰트 색을 담는다*/
				currFontColor : "#000000",
				
				/** 타이틀 및 컨텐츠 내용을 Text아이템으로 보내기 위하여 아이디를 저장*/				
				textInputId : {},			
				/** 타이틀 배너 에서 선택항목 라디오 버튼을 이전에 선택한 아이디*/				
				prevItemsCode : "",
				
				wrapItemDivId : {},
				
				/** 다운로드 에 필요한 데이터를 저장  */
				currDownLoadData : {},

				/** 레리어 팝업 아이디.  */
				layerPopUpId : "",

				/** textMenu에 있는 폰트 selectbox 아이디.  */
				tmselFontFamily :"",
				
				/** textMenu에 있는 폰트크기 selectbox 아이디.  */
				tmselFontSize : ""
		};
		
		var config = $.extend(false,BNGeneratorInterface.config,config);
		
		
		this.getStatic_define = function() {
			return static_define;
		}
		
		this.getConfig = function () {
			return config;
		}
		
		/** 캔버스를 초기화 한다.*/
		
		var initialization = (function (t) {
		
			var tconfig = t.getConfig();

			t.setCanvas(tconfig.eventTarget);
			
		})(this);
		
	}
	
	BNGenerator.prototype = {
			
			
			/***
			* 어떤 함수 및 이벤트를 실행 할 때 해당 캔버스가 선택 되어있는지 체크 한다.
			*
			*/
			
			currCanvasCheck : function () {
				
				var cf = this.getStatic_define() ;
				var rtn = true;

				if (cf.currCanvasId === undefined || cf.currCanvasId === null || cf.currCanvasId == "" ) {
					window.alert("현재 작업중인 캔버스가 지정되어 있지 않습니다. 캔버스를 클릭 해주세요.");
					rtn = false;
				} 				

				return rtn;

			},
			
			/**
			*  itemDto json 객체를 기본으로 추가 될 값이나 변경 될 값을 임시로 생성
			*/
			
			tmpMetaDataMerge : function (obj) {
				
				if(!obj){
					obj= {};
				}
				
				return $.extend(false,BNGeneratorInterface.itemDto,obj);			
			},
			
			/**
			* 아이템 이름과 아이템을 둘러쌀 div 이름을 셋팅 한다.
			* @param type 아이템 타입을 셋팅 한다.
			*/
			
			getAppendElementIds : function (type) {

				var rename = this.getNewElementId(type);
		
				return {
					type : type,
					parentId : rename,
					childId : rename + "child"
				}
			},	
			
			getNewElementId : function (type){
				
				var cdate = new Date();
				var h=cdate.getHours();
				var m=cdate.getMinutes();
				var s=cdate.getSeconds();
				var ms=cdate.getMilliseconds();
				var rename = type+h+m+s+ms;
				
				return rename;
				
			},
			
			getGnerateUrlHost : function() {
				
				var gc = this.getConfig();

				var rUrlRegex = /(http(s)?:\/\/)?\S+(\.[^(\n|\t|\s|\/))]+)+/gi;
				return gc.siteImgUrl.match(rUrlRegex);
			},
			
			setBgColor : function (color) {
				
				
				if(!this.currCanvasCheck()){
					return;
				};
				
				var cf = this.getStatic_define() ;

				$("#" + cf.currPanelId).css("background-color",color);

				//배경인 패널 아이디 값을 이용하여 메타데이터 수정
				this.modifyMetaData(cf.currCanvasId,cf.currPanelId,{bgColor : color});
				this.hideContextMenu();

			},
	
			
			setTextColor : function (targetDivId,color) {
				
				
				if(!this.currCanvasCheck()){
					return;
				};
				
				var cf = this.getStatic_define() ;
				var gc = this.getConfig();
			
				$("#" + targetDivId).css("background",color);
				$("#" + gc.textColorInput).val(color);
				this.hideContextMenu();

			},			
		
			applyTextJustify : function (cm) {
			

				
				var cf = this.getStatic_define() ;
				var gc = this.getConfig();
				
				$("#"+cf.currChildId).focus();

				document.execCommand (cm, false, null);
				
				if(cm == "justifycenter"){				
					cm = "center";
				}else if(cm == "justifyleft"){
					cm = "west";
				}else if(cm == "justifyright"){
					cm = "east";
				}
				
				//배경인 패널 아이디 값을 이용하여 메타데이터 수정
				this.modifyMetaData(cf.currCanvasId,cf.currParentId,{align : cm});
				this.hideContextMenu();

			},			
			
			applyTextColor : function () {
				
				
				if(!this.currCanvasCheck()){
					return;
				};
				

				
				var cf = this.getStatic_define() ;
				var gc = this.getConfig();

				var color  = $("#"+gc.textColorInput).val();
				$("#" + cf.currChildId).css("color",color);

				//배경인 패널 아이디 값을 이용하여 메타데이터 수정
				this.modifyMetaData(cf.currCanvasId,cf.currParentId,{color : color});
				this.hideContextMenu();

			},
	
			applyTextSize : function (selectBoxId) {
				
				
				if(!this.currCanvasCheck()){
					return;
				};
								
				var cf = this.getStatic_define() ;
				var gc = this.getConfig();


				cf.tmselFontSize = selectBoxId;
				
				
				var size  = $("#"+selectBoxId + " option:selected").val();

				var fontInfo =BNGeneratorConst._FONT_SIZE[size];

				$("#" + cf.currChildId).css("font-size",fontInfo.size+"px");

						 
				//text박스 크기를 조절하기위하여 parent Div 객체 구함
				var $p = $("#"+cf.currParentId);
				var $c = $("#"+cf.currChildId);
				
				$p.width($c.width());					
				$p.height($c.prop("scrollHeight"));					
				
				
				//배경인 패널 아이디 값을 이용하여 메타데이터 수정
				this.modifyMetaData(cf.currCanvasId,cf.currParentId,{
					fontSize : size,
					interlineSpacing : fontInfo.interlineSpacing,
					lineHeight : fontInfo.lineHeight,
				});
				this.hideContextMenu();

			},
			
			
			applyTextFontFamily : function (selectBoxId) {
				
				
				if(!this.currCanvasCheck()){
					return;
				};

				var cf = this.getStatic_define() ;
				var gc = this.getConfig();

				
				cf.tmselFontFamily = selectBoxId;

				
				var ff  = $("#"+selectBoxId + " option:selected").val();

				var ffInfo =BNGeneratorConst._FONT_FAMILY[ff];

				$("#" + cf.currChildId).css("font-family",ffInfo);
				$("#" + cf.currChildId).css("font-weight","normal");

						 
				//text박스 크기를 조절하기위하여 parent Div 객체 구함
				var $p = $("#"+cf.currParentId);
				var $c = $("#"+cf.currChildId);
				
				$p.width($c.width());					
				$p.height($c.prop("scrollHeight"));			
				
				
				
				//배경인 패널 아이디 값을 이용하여 메타데이터 수정
				this.modifyMetaData(cf.currCanvasId,cf.currParentId,{
					choiceTextInfo : { fontFamily : ffInfo},
					fontFamily : ffInfo,
					fontWeight : (ff == "MalgunGothic") ? "bold" : ""
				});
				
				this.hideContextMenu();

			},
			
			setLayerPopup  : function (){
				
				var cf = this.getStatic_define() ;
				var gc = this.getConfig() ;
				
				var layerPopUpId= this.getNewElementId("layerPop");
				
				cf.layerPopUpId = layerPopUpId;
				
				var html="";
				html += "<div id ='"+layerPopUpId+"'"; 
				html += " style='";
				html += "display:none;";
				html += "position:absolute;";
				html += "width:100%;";
				html += "height:100%;";
				html += "background-color: #e4e4e4;";
				html += "z-index:10000;top:0px;left:0px;";
				html += "filter:alpha(opacity=50);opacity: 0.5;-moz-opacity:0.5;";
				html += "'>";
				html += "</div>";

				
				$("body").append(html);	
			//	alert($("#"+layerPopUpId).css("display","block"))
				
			},
			
			standardLayerPop : function (data) {
				
				var self = this;
				var cf = this.getStatic_define() ;
				var gc = this.getConfig() ;
				
				var layerPopUpContentId= this.getNewElementId("layerPopUpContentId");
				var layerPopConfirm= this.getNewElementId("layerPopConfirm");
				var layerPopCancel= this.getNewElementId("layerPopCancel");
				
				
				var $layerPopup = $("#"+cf.layerPopUpId);
			
				var html="";
				
				html += "<div id='"+layerPopUpContentId+"' class='contents popup' style='";
				html += "	position:absolute;";
				html += "	z-index:10001;";
				html += "	background-color:white;";
				html += "	width:680px;";
				html += "	height:327px;";
				html += "	border:1px solid gray;";
				html += "	overflow:hidden;";
				html += "	top:170px;";
				html += "	left:80px;";
				html += "	text-align:center;";
				html += "	'>";
				html += "		<div class='bnprv' style='width:182px;height:253px;display:inline-block;margin-top:20px;margin-bottom:20px' >";
				html += "			<img src='"+this.getGnerateUrlHost()+"/"+data[cf.currCanvasId].RETURN_PATH+"' alt='banner'/>";
				html += "		</div>";
				html += "		<div class='pop_btns'>";
				html += "			<button type='button' class='button_chk' id='"+layerPopConfirm+"'><span>다운로드</span></button>";
				html += "			<button type='button' class='button_cls'  id='"+layerPopCancel+"'><span>취소</span></button>";
				html += "		</div>";
				html += "</div>";
				
				var $htmlObj = $(html);
				
				$htmlObj.find("#"+layerPopConfirm).bind("click",function(){
					
					
					var formId = self.getNewElementId("formId");

					var formHtml = "";
					formHtml += "<form id='"+formId+"' action='"+gc.imgDownLoadUrl+"' method='post' onsubmit='javascript:return false;'>";
					formHtml += "<input type='hidden' name='filePath' value='"+data[cf.currCanvasId].FILE_PATH+"' />";
					formHtml += "<input type='hidden' name='fileName' value='"+data[cf.currCanvasId].FILE_NAME+"' />";
					formHtml += "</form>";

					$("body").append(formHtml); 
					
					
					var $form = $("#"+formId)[0];
					$form.submit();
					
				//	setTimeout(function(){
				//		$form.remove();
				//	},1000);
					
					
				});
				
				$htmlObj.find("#"+layerPopCancel).bind("click",function(){
					
					$layerPopup.css("display","none");
					$("#"+layerPopUpContentId).remove();
					
				});
				
				$("body").append($htmlObj);
				$layerPopup.show();
				
			},
			
			titleLayerPop : function (data) {
				
				var self = this;
				var cf = this.getStatic_define() ;
				var gc = this.getConfig() ;
				
				var layerPopUpContentId= this.getNewElementId("layerPopUpContentId");
				var layerPopConfirm= this.getNewElementId("layerPopConfirm");
				var layerPopCancel= this.getNewElementId("layerPopCancel");
				
				
				var $layerPopup = $("#"+cf.layerPopUpId);
			
				var html="";
				
				html += "<div id='"+layerPopUpContentId+"' class='contents popup' style='";
				html += "	position:absolute;";
				html += "	z-index:10001;";
				html += "	background-color:white;";
				html += "	width:990px;";
				html += "	height:425px;";
				html += "	border:1px solid gray;";
				html += "	overflow:hidden;";
				html += "	top:170px;";
				html += "	left:80px;";
				html += "	text-align:center;";
				html += "	'>";
				html += "		<div class='bnprv' style='width:980px;display:inline-block;margin-top:20px;margin-bottom:20px' >";
				html += "			<img src='"+this.getGnerateUrlHost()+"/"+data[cf.currCanvasId].RETURN_PATH+"' alt='banner'/>";
				html += "		</div>";
				html += "		<div class='pop_btns'>";
				html += "			<button type='button' class='button_chk' id='"+layerPopConfirm+"'><span>다운로드</span></button>";
				html += "			<button type='button' class='button_cls'  id='"+layerPopCancel+"'><span>취소</span></button>";
				html += "		</div>";
				html += "</div>";
				
				var $htmlObj = $(html);
				
				$htmlObj.find("#"+layerPopConfirm).bind("click",function(){
					
					
					var formId = self.getNewElementId("formId");

					var formHtml = "";
					formHtml += "<form id='"+formId+"' action='"+gc.imgDownLoadUrl+"' method='post' onsubmit='javascript:return false;'>";
					formHtml += "<input type='hidden' name='filePath' value='"+data[cf.currCanvasId].FILE_PATH+"' />";
					formHtml += "<input type='hidden' name='fileName' value='"+data[cf.currCanvasId].FILE_NAME+"' />";
					formHtml += "</form>";

					$("body").append(formHtml); 
					
					
					var $form = $("#"+formId)[0];
					$form.submit();
					
				//	setTimeout(function(){
				//		$form.remove();
				//	},1000);
					
					
				});
				
				$htmlObj.find("#"+layerPopCancel).bind("click",function(){
					
					$layerPopup.css("display","none");
					$("#"+layerPopUpContentId).remove();
					
				});
				
				$("body").append($htmlObj);
				$layerPopup.show();
				
			},
			
			
			
			/**
			* 초기 캔버스를 셋팅 한다.
			*
			*/
			setCanvas : function (et) {
				
				var $cid,$pid;
				var cf = this.getStatic_define() ;
				var gc = this.getConfig() ;

				for(var i = 0 ; i < et.length ; i++ ){
					
					$cid = $("#"+et[i].canvasId);
					$pid = $("#"+et[i].panelId);
					
					
					if( !et[i].canvasId || et[i].canvasId == "" ){
						window.alert("캔버스 아이디값이 지정되지 않았습니다.");
						return;
					} else if ( !et[i].panelId || et[i].panelId == "" ){
						window.alert("패널 아이디값이 지정되지 않았습니다.");
						return;
					} else if($cid.attr("id") === undefined || $cid.attr("id") == ""){
						window.alert("캔버스가 존재하지 않습니다.");
						return;
					} else if($pid.attr("id") === undefined || $pid.attr("id") == "" ){
						window.alert("패널이 존재하지 않습니다.");
						return;
					}
					
					this.changeCanvasEvt($cid,et[i]);
					this.changeCanvasEvt($pid,et[i]);

					this.setMetaData(et[i].canvasId,et[i].panelId,"B",this.tmpMetaDataMerge());

				}
				
				if(gc.mode == "standard") {
					this.standard(gc.eventTarget);
					//t표준 배너 선택 아이템 요청.
					this.requestChoiceItem(BNGeneratorConst._OPTCD.SC);
				}else if (gc.mode == "title") {
					this.title(gc.eventTarget);
					this.requestChoiceItem(BNGeneratorConst._OPTCD.TB,"choice");

				}
				
				this.setLayerPopup();

				
			},
			
			
			
			//초기 표준 배너 템플릿을 셋팅.
			standard : function (et) {
				
				
				var cf = this.getStatic_define() ;
				var gc = this.getConfig() ;
				
				for(var i = 0 ; i < et.length ; i++ ){
					
					
					if(OBGtemplate !== undefined && OBGtemplate.standard[i] !== undefined ) {

						for(var j = 0 ; j < OBGtemplate.standard[i].length ; j++ ){
							var t = OBGtemplate.standard[i][j];
							var id = et[i];
							
							var aei = this.getAppendElementIds(t.type);
							cf.textInputId[id.textItemId[j]] = aei;
							
							var tmpTemplate = this.tmpMetaDataMerge(t);	
	
							this.addItemData(aei,id.canvasId,id.panelId,tmpTemplate);
							this.applyTextEvt(id.canvasId,id.textItemId[j],aei);
							this.applyText(id.canvasId,id.textItemId[j],aei);
							
						}
					}
				}

			},
			
			//초기 타이틀 
			//배너 템플릿을 셋팅.
			title : function (et) {
				
				
				var cf = this.getStatic_define() ;
				var gc = this.getConfig();
				
				cf.currCanvasId = gc.eventTarget[0].canvasId;
				cf.currPanelId = gc.eventTarget[0].panelId;

				$("#"+cf.currCanvasId).css("background-color","#FFFFFF");
				
				
				//this.changeCanvas(gc.eventTarget);

/*				for(var i = 0 ; i < et.length ; i++ ){
					
					if(OBGtemplate !== undefined && OBGtemplate.title[i] !== undefined ) {

						for(var j = 0 ; j < OBGtemplate.title[i].length ; j++ ){

							var t = OBGtemplate.title[i][j];
							var id = et[i];
							
							var aei = this.getAppendElementIds(t.type);
						//	cf.textInputId[id.textItemId[j]] = aei;
							
							var tmpTemplate = this.tmpMetaDataMerge(t);	
								
							this.addItemData(aei,id.canvasId,id.panelId,tmpTemplate);
							//this.applyTextEvt(id.canvasId,id.textItemId[j],aei);
							this.applyTitleBannerText(id.canvasId,aei,t.text);
							
						}
					}

				}//end for */
			},			
			
			/**
			* 아이템을 추가 한다.
			* @ param aei getAppendElementIds() 함수 리턴 객체 아이템을 추가할 때 필요한 divName 과 childName을 리턴
			* @ param panelId 아이템을 추가 할 패널 아이디
			* @ param t 아이템을 정의한 템플릿 정보.
			*/
			
			addItemData : function (aei,canvasId,panelId,t,imgPath){
				
				
				var cf = this.getStatic_define();
				var gc = this.getConfig();
				
				
				var warpHtml="";
				
				if(aei.type=="I") {
					
					warpHtml = "<div id='"+aei.parentId+"' class='edit_t' ";						
					warpHtml += "style='position:absolute;top:0;left:0;z-index:"+cf.metaData[canvasId].length; 
					warpHtml += " '>";
					warpHtml += "<img id='"+aei.childId+"' alt='shiftkey를 누르시고 이미지 크기를 조정하시기 바랍니다' ";

					if (gc.mode=="standard" && t.prdImg =="Y" && gc.eventTarget[0].canvasId == cf.currCanvasId) {							
						warpHtml += "width='178px' ";
						warpHtml += "height='178px' ";
						
						delete t.prdImg;
						
					}else if (gc.mode=="standard" && t.prdImg =="Y" && gc.eventTarget[1].canvasId == cf.currCanvasId) {
						warpHtml += "width='80px' ";
						warpHtml += "height='80px' ";
						
						delete t.prdImg;

					}else if (gc.mode=="title"&& t.prdImg =="Y"){
						warpHtml += "width='330px' ";
						warpHtml += "height='330px ' ";
					}

					warpHtml += "src='"+((imgPath) ? imgPath :  gc.siteImgUrl+t.imgPath)+"'";
					warpHtml += "' />";
					warpHtml += "</div>";						
					////console.log(gc.siteImgUrl+t.imgPath);
					////console.log(warpHtml);

				}else if(aei.type=="T") {

					warpHtml += "<div id='"+aei.parentId+"'  class='edit_t' style='";
					
					
					if (t.lineHeight && t.lineHeight != "0") {						
						warpHtml += "line-height:"+t.lineHeight+"px;";
					}
					warpHtml += "position:absolute;left:"+t.posX+"px;top:"+t.posY+"px;z-index:"+cf.metaData[canvasId].length+"'>";
					warpHtml +="<span id='"+aei.childId+"' style=';word-break:keep-all;word-wrap:break-word";
					warpHtml += "width:"+t.width+"px;";
					warpHtml += "color:"+t.color+";";
					warpHtml += "font-size:"+t.fontSize+"px;";
					warpHtml += "font-weight:"+t.fontWeight+";";
					warpHtml += "font-family:"+t.fontFamily+";";
					warpHtml += "letter-spacing:"+t.letterSpacing+"px;";
					warpHtml += "display:inline-block;";
					warpHtml += "overflow:none;";
					warpHtml += "'>";
					
					
					
					//표준 배너 모드라면 text 입력
					if (gc.mode == "title" ) {
						warpHtml += t.text;
					}					
					warpHtml += "</span></div>";				
					//console.log(warpHtml);
					
				}else if(aei.type=="B") {
					warpHtml = "<div id='"+aei.parentId+" style='z-index:"+cf.metaData[canvasId].length+"'><img id='' src ='' /></div>";
				}
				
				
				$(warpHtml).appendTo("#"+panelId);


				//엘리먼트 드래그 및 리사이징을 한다.
				this.addResizable(aei.parentId,aei.childId,t);
				
				//엘리먼트 메타 정보들을 저장 한다.
				this.setMetaData(canvasId,aei.parentId,aei.type,t);
					
				
				this.mouseRightBtnEvt(canvasId, aei);
				
			},
			
			textItemHtml : function (canvasId,aei,t) {
				
				var cf = this.getStatic_define();
				var gc = this.getConfig();
				
				
			
				var warpHtml = "<div id='"+aei.parentId+"' class='edit_t' ";
				
				
				if(t.textYn == "Y"){
					//warpHtml = "<div id='"+aei.parentId+"' class='edit_t' style='text-align:center;-ms-behavior: url(/SpringBBS/images/common/backgroundsize.min.htc);background-size: cover;background-image:url("+gc.choiceImgUrl+t.imgPath+") '><span id='"+aei.childId+"' >"+t.text+"</span></div>";
				
					if(Browser.type != "MSIE") {
						warpHtml += "style='text-align:center;"; 
						warpHtml += "z-index:"+cf.metaData[canvasId].length+";";
						warpHtml += "width:"+t.width+"px;";
						warpHtml += "height:"+t.height+"px;";
						warpHtml += "background-size: cover;";
						warpHtml += "background-image:url("+gc.siteImgUrl+t.imgPath+")";
						warpHtml += " '>";
						warpHtml += "<span id='"+aei.childId+"' ";
						warpHtml += "style='display:inline-block;";
						warpHtml += "'>";
						warpHtml += ""+t.text+"";
						warpHtml += "</span></div>";

					}else{
						//filter:progid:DXImageTransform.Microsoft.Matrix(sizingMethod=auto expand)
						warpHtml += "style='text-align:center;"; 
						warpHtml += "z-index:"+cf.metaData[canvasId].length+";";
						warpHtml += "width:"+t.width+"px;";
						warpHtml += "height:"+t.height+"px;";
						warpHtml += "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+gc.siteImgUrl+t.imgPath+",sizingMethod=scale)";
						warpHtml += " '>";
						warpHtml += "<span id='"+aei.childId+"' ";
						warpHtml += "style='display:inline-block;";
						warpHtml += "'>";
						warpHtml += ""+t.text+"";
						warpHtml += "</span></div>";

					}
				}
					
				return warpHtml;
			},
			
			/**
			* 표준 배너 모드에서 text기본값을 셋팅 한다.
			*
			*/
			
			applyText : function (canvasId,inputId,aei) {
				
				var cf = this.getStatic_define();

				var $input = $("#"+inputId);

				//text 내용을 패널 아이템에 등록한다.
				$("#"+aei.childId).html($input.val());
				
				//text박스 크기를 조절하기위하여 parent Div 객체 구함
				var p = $("#"+aei.childId).parent();
				
				//text 박스의 스크롤 높이를 구한만큼 parent div 크기도 변경
				p.height($("#"+aei.childId).prop("scrollHeight"));
	//			////console.log($("#"+aei.childName).width() +", height : "+$("#"+aei.childName).prop("offsetHeight"));
				
	
				this.modifyMetaData(canvasId ,aei.parentId,{text : $input.val()});

			},
			
			
			/**
			* 타이틀 배너 모드에서 text기본값을 셋팅 한다.
			*
			*/
			
			applyTitleBannerText : function (canvasId,aei,text) {
				
				var cf = this.getStatic_define();
				var gc = this.getConfig();

				
				//text박스 크기를 조절하기위하여 parent Div 객체 구함
				var $p = $("#"+aei.childId).parent();
				var $c = $("#"+aei.childId);
				
				
				if ($c.width() > 80) {
					$p.width($c.width());					
				}else{
					$c.width("80");					
				}

				$p.height($c.prop("scrollHeight"));					
				$c.css("position","absolute");		
				$c.css("top","0px");		

	//			////console.log($("#"+aei.childName).width() +", height : "+$("#"+aei.childName).prop("offsetHeight"));
				this.applyTitleEvt(cf.currCanvasId, aei);

				this.modifyMetaData(canvasId ,aei.parentId,{text : text});

			},			
			
			
			addText : function (){
				
				var cf = this.getStatic_define();
				var gc = this.getConfig();
				
				var aei = this.getAppendElementIds("T");

				var tmpTemplate = this.tmpMetaDataMerge(
						{
							type : "T",
							text : "텍스트를 입력 하세요",
							fontFamily : BNGeneratorConst._COUPON_TEXT.fontFamily,
							fontSize : BNGeneratorConst._COUPON_TEXT.fontSize,
							fontWeight : BNGeneratorConst._COUPON_TEXT.fontWeight,
							color : BNGeneratorConst._COUPON_TEXT.color,
						});	
			
				tmpTemplate.choiceTextInfo = BNGeneratorConst._COUPON_TEXT

				this.addItemData(aei,cf.currCanvasId ,cf.currPanelId,tmpTemplate);
				
				this.applyTitleBannerText(cf.currCanvasId, aei, tmpTemplate.text);

				this.applyTitleEvt(cf.currCanvasId, aei);
				
				
			},
			
			
			
			standardChoiceItem : function (data) {
				
				var cf = this.getStatic_define();
				var gc = this.getConfig();
				var self = this;
				
				for ( var i = 0; i < data.ITEMS.length; i++) {
					
					var tdata = data.ITEMS[i];
					
					if(tdata.TEXT_YN =="Y"){
					
						var html = "";

						
						var itemIds = {};
						
						itemIds.radioId = self.getNewElementId("radio");
						itemIds.inputTextId = self.getNewElementId("inputTextId");
						itemIds.inputBtnId = self.getNewElementId("inputBtnId");
						itemIds.deleteId = self.getNewElementId("deleteId");
					
						html += "<li>";
						html += "<input type='radio' class='radio' name='items' id='"+itemIds.radioId+"' value='"+data.NO+"'/>";
						html += "<label for='item1'>"+tdata.ITEM_NAME+"</label>";
						html += "<span class='inputbox' style='width:50px' >";
						html += "	<input type='text' id= "+itemIds.inputTextId+" name='"+itemIds.inputTextId+"' class='input' value='' />";
						html += "	<button type='button' id='"+itemIds.deleteId+"'>삭제</button>";
						html += "</span>";
						html += "<button type='button' class='button' id='"+itemIds.inputBtnId+"'><span>입력</span></button>";
						html += "</li>";
						
						var li = $(html);

						var $choiceTarget = $("#"+gc.choiceImgTargetId);
						$choiceTarget.append(li);
						
						
						
						
						self.choiceItemElementEvt($choiceTarget.find("#"+itemIds.inputBtnId),itemIds,tdata,function($obj,itemIds,data){
							$obj.click(function(){
								
								if(!self.currCanvasCheck()){
									return;
								};
								
								
								if($("#"+itemIds.inputTextId).val() == ""){
									window.alert("쿠폰 단위를 입력하여 주십시요.");
									return;
								}
								
								if(!$("#"+itemIds.radioId).is(":checked")){
									window.alert("라디오 버튼이 선택되어 있지 않습니다.")
									return;
								}
								

								$("<img/>") // Make in memory copy of image to avoid css issues
								    .attr("src", gc.siteImgUrl+data.IMG_PATH+"#"+Math.random())
								    .load(function() {
								    	
										var aei = self.getAppendElementIds(BNGeneratorConst._TYPE.I);
										
										var temdata  = self.tmpMetaDataMerge({
											width : ""+(this.width-2),
											height : ""+(this.height-2),
											textYn : "Y",
											imgPath : data.IMG_PATH,
											text : $("#"+itemIds.inputTextId).val(),
											choiceTextInfo : BNGeneratorConst._COUPON_TEXT
										});			
										
										
			                          
										var arr = data.OPT_4.split(".");									
										
										temdata.type = aei.type;
										temdata.textYn = "Y";										
										//이곳에서 span margin을 계산한다.
										temdata.choiceTextInfo.posX = ""+(parseInt(arr[2]));
										temdata.choiceTextInfo.posY = ""+(parseInt(arr[3]));
										temdata.choiceTextInfo.width = ""+((arr[0]));
										temdata.choiceTextInfo.height = ""+(arr[1]);		
										temdata.choiceTextInfo.fontSize = ""+(arr[4]);										
										temdata.choiceTextInfo.align = "center";	
										
										//각도 조정 값이 있으면 roate추가 없으면 rotate  프로퍼티 제거.
										if (arr[5]) {
											temdata.choiceTextInfo.rotate = ""+(arr[5]);													
										}else{
											delete temdata.choiceTextInfo.rotate;
										}
										
										var jsonData = {};
										
										jsonData[cf.currCanvasId] = [temdata];
										
										$.ajax({
											url: gc.generatorUrl, // 상품 이미지 호출 주소.
											dataType: "json",
											data: {bgData : JSON.stringify(jsonData)},
											async: false,
											success : function(data,status,request) {
												
												var domain =self.getGnerateUrlHost()
																											    
											    self.imgLoad(domain+data[cf.currCanvasId].RETURN_PATH,function(o){
													var temdata2  = self.tmpMetaDataMerge({
														width: (o.width-2),
														height: (o.height-2),
														imgPath : data[cf.currCanvasId].RETURN_PATH,
														newItem :"Y",
														textYn : "N"
													});			
													self.addItemData(aei,cf.currCanvasId,cf.currPanelId,temdata2,domain+data[cf.currCanvasId].RETURN_PATH);								

											    });
												
											
											},
											error : function (request,status,error) {
												alert("message : 잘못된 요청입니다.\nRequest Code : " +request.status+"\n"+ "Error Message : " +error +"ResponseText : "+request.responseText);	
												return;
											}
										});	

								    });
								
								
								self.hideContextMenu();
								
							});
							
						});
						
						self.choiceItemElementEvt($choiceTarget.find("#"+itemIds.deleteId),itemIds,tdata,function($obj,itemIds,data){
							
							$obj.click(function(){
								$("#"+itemIds.inputTextId).val("");
								self.hideContextMenu();								
							});
							
						});
	
						
					}else{
						
						
						var html = "";

						
						var itemIds = {};
						
						itemIds.radioId = self.getNewElementId("radio");

						html += "<li>";
						html += "<input type='radio' class='radio' name='items' id='"+itemIds.radioId+"' value='"+tdata.NO+"'/>";
						html += "<label for='item2'>"+tdata.ITEM_NAME+"</label>";
						html += "</li>";
						
						var li = $(html);

						self.choiceItemElementEvt(li.find("#"+itemIds.radioId),itemIds,tdata,function($obj,itemIds,data){
							
							$obj.click(function(event){
								
								self.cancelEventBubbling(event);
								
								if(!self.currCanvasCheck()){
									return;
								};
								
								var temdata  = self.tmpMetaDataMerge({
									imgPath : data.IMG_PATH
								});								
								
								
								var aei = self.getAppendElementIds(BNGeneratorConst._TYPE.I);

								self.addItemData(aei,cf.currCanvasId,cf.currPanelId,temdata);
							
								self.hideContextMenu();

							});
							
						});

						
						var $choiceTarget = $("#"+gc.choiceImgTargetId);
						$choiceTarget.append(li);
						
					}
					
				}
				
			},
			
			titleChoiceItem : function (data,radioBtnId,opt_cd) {
				
				var cf = this.getStatic_define();
				var gc = this.getConfig();
				var self = this;
				
				
			//	alert($("#"+cf.wrapItemDivId[opt_cd]).css("display"));
					
				if($(":radio[name="+gc.choiceItemRadio+"]:checked").val() ==BNGeneratorConst._OPTCD.TC ){
					this.generateChoiceItemHtml(data, radioBtnId);

				}else if($(":radio[name="+gc.choiceItemRadio+"]:checked").val() ==BNGeneratorConst._OPTCD.TB ){
					this.generateBackgroundItemHtml(data, radioBtnId);					
				}else if($(":radio[name="+gc.choiceItemRadio+"]:checked").val() ==BNGeneratorConst._OPTCD.TD ){
					this.generateDecorationItemHtml(data, radioBtnId);					
				}							
				
				cf.prevItemsCode = opt_cd;

			},	
			
			imgLoad : function (url,func) {
				
				$("<img/>") // Make in memory copy of image to avoid css issues
			    .attr("src", url+"#"+Math.random())
			    .load(function(a) {			    	
			    	func({
						width: this.width,
						height: this.height
			    	});
			    	
			    })
			    
			},
			
			
			generateChoiceItemHtml : function (data,radioBtnId) {
				
				var cf = this.getStatic_define();
				var gc = this.getConfig();
				var self = this;
				
				var $ul  = $("<ul></ul>"),
				$li = "" ;
				
				
				for ( var i = 0; i < data.ITEMS.length; i++) {
					
					var tdata = data.ITEMS[i];

					if( (i % 5 ) == 0 ) {
						$li = $("<li></li>");
					}
					
					
					if(tdata.TEXT_YN =="Y"){
					
						var itemIds = {};						
						itemIds.radioId = self.getNewElementId("radio");
						itemIds.inputTextId = self.getNewElementId("inputTextId");
						itemIds.inputBtnId = self.getNewElementId("inputBtnId");
						itemIds.deleteId = self.getNewElementId("deleteId");
						
						var liData = "";
						liData += "					<div class='ico'>";
						liData += "						<span class='sico'>";
						liData += "							<input type='radio' class='radio' name='items"+radioBtnId+"' id='"+itemIds.radioId+"' value='"+data.NO+"'/>";
						liData += "							<label for='sico1'>"+tdata.ITEM_NAME+"</label>";
						liData += "						</span>	";
						liData += "						<span class='sico'>";
						liData += "							<img src='"+gc.siteImgUrl+tdata.IMG_PATH+"'  height='53' alt='"+tdata.ITEM_NAME+"' />";
						liData += "						</span>	";
						liData += "						<span class='sico'>";
						liData += "							<span class='inputbox' style='width:55%;' >";
						liData += "								<input type='text' id= "+itemIds.inputTextId+" name='"+itemIds.inputTextId+"' class='input' value='' />";
						liData += "								<button type='button' id='"+itemIds.deleteId+"'>삭제</button>";
						liData += "							</span>	";
						liData += "							<button type='button' class='button'  id='"+itemIds.inputBtnId+"'><span>입력</span></button>";
						liData += "						</span>";
						liData += "					</div>";
								
						
						var $itemHtml = $(liData);
						
						
						self.choiceItemElementEvt($itemHtml.find("#"+itemIds.inputBtnId),itemIds,tdata,function($obj,itemIds,data){
						
							$obj.click(function(){
								
								if(!self.currCanvasCheck()){
									return;
								};
								
								if($("#"+itemIds.inputTextId).val() == ""){
									window.alert("내용을 입력하여 주십시요.");
									return;
								}
								
								if(!$("#"+itemIds.radioId).is(":checked")){
									window.alert("라디오 버튼이 선택되어 있지 않습니다.")
									return;
								}
								

								$("<img/>") // Make in memory copy of image to avoid css issues
								    .attr("src", gc.siteImgUrl+data.IMG_PATH+"#"+Math.random())
								    .load(function() {
								    	
										var aei = self.getAppendElementIds(BNGeneratorConst._TYPE.I);
										
										var temdata  = self.tmpMetaDataMerge({
											width : ""+(this.width-2),
											height : ""+(this.height-2),
											textYn : "Y",
											imgPath : data.IMG_PATH,
											text : $("#"+itemIds.inputTextId).val(),
											choiceTextInfo : BNGeneratorConst._COUPON_TEXT
										});			
										
										
			                          
										var arr = data.OPT_4.split(".");									
										temdata.type = aei.type;
										temdata.textYn = "Y";										
										//이곳에서 span margin을 계산한다.
										temdata.choiceTextInfo.posX = ""+(parseInt(arr[2]));
										temdata.choiceTextInfo.posY = ""+(parseInt(arr[3]));
										temdata.choiceTextInfo.width = ""+((arr[0]));
										temdata.choiceTextInfo.height = ""+(arr[1]);		
										temdata.choiceTextInfo.fontSize = ""+(arr[4]);		
										temdata.choiceTextInfo.align = "center";	
										//각도 조정 값이 있으면 roate추가 없으면 rotate  프로퍼티 제거.
										if (arr[5]) {
											temdata.choiceTextInfo.rotate = ""+(arr[5]);													
										}else{
											delete temdata.choiceTextInfo.rotate;
										}
										
										var jsonData = {};
										
										jsonData[cf.currCanvasId] = [temdata];
										
										$.ajax({
											url: gc.generatorUrl, // 상품 이미지 호출 주소.
											dataType: "json",
											data: {bgData : JSON.stringify(jsonData)},
											async: false,
											success : function(data,status,request) {
												

												
												var rUrlRegex = /(http(s)?:\/\/)?\S+(\.[^(\n|\t|\s|\/))]+)+/gi;
												var domain =gc.siteImgUrl.match(rUrlRegex);
															    
											    self.imgLoad(domain+data[cf.currCanvasId].RETURN_PATH,function(o){
													var temdata2  = self.tmpMetaDataMerge({
														width: o.width,
														height: o.height,
														imgPath : data[cf.currCanvasId].RETURN_PATH,
														newItem :"Y",
														textYn : "N"
													});			
													
													self.addItemData(aei,cf.currCanvasId,cf.currPanelId,temdata2,domain+data[cf.currCanvasId].RETURN_PATH);								

											    });
											
											},
											error : function (request,status,error) {
												alert("message : 잘못된 요청입니다.\nRequest Code : " +request.status+"\n"+ "Error Message : " +error +"ResponseText : "+request.responseText);	
												return;
											}
										});	
								    });
								
								self.hideContextMenu();
	
							});
							
						});
						
						self.choiceItemElementEvt($itemHtml.find("#"+itemIds.deleteId),itemIds,tdata,function($obj,itemIds,data){
							
							$obj.click(function(){
								$obj.click(function(){
									$("#"+itemIds.inputTextId).val("");
									self.hideContextMenu();								
								});
							});
						});						

						$li.append($itemHtml);
						
					} else {
						
						var itemIds = {};
						
						itemIds.radioId = self.getNewElementId("radio");

						var liData="";
						liData += "<div class='ico'>";
						liData += "		<span class='sico'>";
						liData += "			<input type='radio' class='radio' name='items"+radioBtnId+"' id='"+itemIds.radioId+"' value='"+tdata.NO+"'/>";
						liData += "			<label for='sico4'>"+tdata.ITEM_NAME+"</label>";
						liData += "		</span>";
						liData += "		<span class='sico'>";
						liData += "			<img src='"+gc.siteImgUrl+tdata.IMG_PATH+"'  height='53' alt='"+tdata.ITEM_NAME+"' />";
						liData += "		</span>";
						liData += "<div>";

					
						var $itemHtml = $(liData);
						
												
						self.choiceItemElementEvt($itemHtml.find("#"+itemIds.radioId),itemIds,tdata,function($obj,itemIds,data){
						
							$obj.click(function(){
								
								if(!self.currCanvasCheck()){
									return;
								};
								var temdata  = self.tmpMetaDataMerge({
									imgPath : data.IMG_PATH
								});								
								
								
								var aei = self.getAppendElementIds(BNGeneratorConst._TYPE.I);

								self.addItemData(aei,cf.currCanvasId,cf.currPanelId,temdata);
								self.hideContextMenu();
											
							});
							
						})//end choiceItemElementEvt;*/
						
						$li.append($itemHtml);
					
						
					}//end else	
					
					
					// li에 담긴 아이템이 5개가 넘어가면 ul 테그에 li엘리먼트를 붙인다.
					if( (i % 5 ) == 0 ) {
						$ul.append($li);
					}				
					
					
					
					
				}//end for
				
				
				var wrapDivId = self.getNewElementId("wrapDivId");
				var ulDivId = self.getNewElementId("ulDivId");
				var prevBtn = self.getNewElementId("prevId");
				var nextBtn = self.getNewElementId("nextId");
				
				
				var html = "";
				html += "<div class='bn_wrap' id='"+wrapDivId+"'>";
				html += "		<div class='bn_list1' id='"+ulDivId+"'>";
				html += "		</div>";
				html += "		<button type='button' class='bn_prev' id='"+prevBtn+"'><img src='/images/btn_arr_up.gif' width='24' height='21' alt='prev' /></button>";
				html += "		<button type='button' class='bn_next' id='"+nextBtn+"'><img src='/images/btn_arr_down.gif' width='24' height='21'  alt='next' /></button>";
				html += "</div>";				
				
				// 아이템들이 들어가야 할 td 영역 타겟 지정
				var $choiceTarget = $("#"+gc.choiceImgTargetId);
				$choiceTarget.html("");
				$choiceTarget.html(html); // 선택 아이템을 담고 있을 html을 집어 넣는다.
				
				//아이템들을 담고 있는 ul을 붙여 넣는다.
				var $appendUl = $("#"+ulDivId);
				$appendUl.append($ul);

				$("#"+ulDivId).jCarouselLite({			
											btnNext: ".bn_next",			
											btnPrev: ".bn_prev",			
											visible: 1,		
											speed: 300,			
											vertical: true,
											circular: false		
										});
				
				cf.wrapItemDivId[BNGeneratorConst._OPTCD.TC] = wrapDivId;
			
			},
			
			
			generateBackgroundItemHtml : function (data,radioBtnId) {
				
				var cf = this.getStatic_define();
				var gc = this.getConfig();
				var self = this;
				
				var $ul  = $("<ul></ul>"),
				$li = $("<li></li>");
				
				if(data.ITEMS){
				
					for ( var i = 0; i < data.ITEMS.length; i++) {
						
						var tdata = data.ITEMS[i];
	
						if( (i % 5 ) == 0 ) {
							$li = $("<li></li>");
						}
								
										
						var itemIds = {};
						
						itemIds.background = self.getNewElementId("background");
	
						var liData="";
						liData += "<a href='#'><img id='"+itemIds.background+"' src='"+gc.siteImgUrl+tdata.OPT_4+"' width='140' height='58' alt='"+tdata.ITEM_NAME+"' /></a>";
	
					
						var $itemHtml = $(liData);
										
						self.choiceItemElementEvt($itemHtml.find("#"+itemIds.background),itemIds,tdata,function($obj,itemIds,data){
						
							$obj.click(function(){
								
								if(!self.currCanvasCheck()){
									return;
								};
								
								var temdata  = self.tmpMetaDataMerge({
									imgPath : data.IMG_PATH
								});								
								
								$("#"+cf.currPanelId).css("background-image","url("+gc.siteImgUrl +data.IMG_PATH+")");
								
	
								var getData =self.getIndexData(cf.currCanvasId,cf.currPanelId);
								
								cf.metaData[cf.currCanvasId][getData.num].imgPath = data.IMG_PATH;
							
								self.hideContextMenu();
							//	self.addItemData(aei,cf.currCanvasId,cf.currPanelId,temdata);
														
							});
							
						})//end choiceItemElementEvt;*/
						
						$li.append($itemHtml);
											
						
						// li에 담긴 아이템이 5개가 넘어가면 ul 테그에 li엘리먼트를 붙인다.
						if( (i % 5 ) == 0 ) {
							$ul.append($li);
						}				
						
						
					}//end for
				}//end if
				
				
				
				var wrapDivId = self.getNewElementId("wrapDivId");
				var ulDivId = self.getNewElementId("ulDivId");
				var prevBtn = self.getNewElementId("prevId");
				var nextBtn = self.getNewElementId("nextId");
				var file = "bgfile";
				var formId = self.getNewElementId("DnformId");

				
				var html = "";
				html += "<div class='bn_wrap' id='"+wrapDivId+"'>";
				html += "		<div class='bn_list' id='"+ulDivId+"'>";
				html += "		</div>";
				html += "		<button type='button' class='bn_prev' id='"+prevBtn+"'><img src='/images/btn_arr_up.gif' width='24' height='21' alt='prev' /></button>";
				html += "		<button type='button' class='bn_next' id='"+nextBtn+"'><img src='/images/btn_arr_down.gif' width='24' height='21'  alt='next' /></button>";
				html += "</div>";				
				html += "<div class='bn_reg'>";				
				html +="<form id='"+formId+"' action='"+gc.imgUpLoadUrl+"' method='post' onsubmit='javascript:return false;'>";			
				html += "<label for='file1'>외부이미지 등록</label>";	
				html += "<span class='st_file'><input type='file' style='width:300px' id='"+file+"' name='"+file+"' alt='이미지찾기'/></span>";				
				html += "</form>";				
				html += "</div>";				
				html += "</div>";							
				
				// 아이템들이 들어가야 할 td 영역 타겟 지정
				var $choiceTarget = $("#"+gc.choiceImgTargetId);
				$choiceTarget.html("");
				$choiceTarget.html(html); // 선택 아이템을 담고 있을 html을 집어 넣는다.
				
				//아이템들을 담고 있는 ul을 붙여 넣는다.
				var $appendUl = $("#"+ulDivId);
				$appendUl.append($ul);
				
				
				
				$("#"+file).bind("change",function(){
					
					var frm=$("#"+formId); 				    	

				    frm.ajaxForm(function(dt,state){
				    					    	
				    	dt = JSON.parse(dt);
				    	
				    	if (typeof(dt) == "object") {
						
				    		if (dt.STATE != "SUCCESS") {
					    		window.alert("Stat : " +dt.STATE+", Message : "+dt.MESSAGE);
					    		return;
							}else {
																
								if(!self.currCanvasCheck()){
									return;
								};

								$("#"+cf.currPanelId).css( 
										{
											"background-image": "url("+self.getGnerateUrlHost()+dt.RETURN_PATH+")",
											"background-repeat" : "no-repeat"
										});
							//		console.log(self.getGnerateUrlHost()+dt.RETURN_PATH);
								var getData =self.getIndexData(cf.currCanvasId,cf.currPanelId);

								cf.metaData[cf.currCanvasId][getData.num].imgPath = dt.RETURN_PATH;
							
								//새로 추가하는 아이템일 경우 newItem으로 서버에서 구분할 수 있게 해준다.
								cf.metaData[cf.currCanvasId][getData.num].newItem = "Y";
								
								self.hideContextMenu();
							//	self.addItemData(aei,cf.currCanvasId,cf.currPanelId,temdata);
							}
				    		
						}
				    	
				    }); 
				    
				    frm.attr("action",gc.imgUpLoadUrl);
				    frm.submit(); 
				
				});
				
				
				$("#"+ulDivId).jCarouselLite({			
											btnNext: ".bn_next",			
											btnPrev: ".bn_prev",			
											visible: 1,		
											speed: 300,			
											vertical: true,
											circular: false		
										});
				
				//wrap 아이디 저장
				cf.wrapItemDivId[BNGeneratorConst._OPTCD.TB] = wrapDivId;
			},		
			
					
			generateDecorationItemHtml : function (data,radioBtnId) {
				
				var cf = this.getStatic_define();
				var gc = this.getConfig();
				var self = this;
				
				var $ul  = $("<ul></ul>"),
				$li =  $("<li></li>");
				
				if(data.ITEMS){
					for ( var i = 0; i < data.ITEMS.length; i++) {
						
						var tdata = data.ITEMS[i];
	
						if( (i % 5 ) == 0 ) {
							$li = $("<li></li>");
						}
								
										
						var itemIds = {};
						
						itemIds.background = self.getNewElementId("background");
	
						var liData="";
						liData += "<a href='#'><img id='"+itemIds.background+"' src='"+gc.siteImgUrl+tdata.OPT_4+"' width='140' height='58' alt='"+tdata.ITEM_NAME+"' /></a>";
	
					
						var $itemHtml = $(liData);
										
						self.choiceItemElementEvt($itemHtml.find("#"+itemIds.background),itemIds,tdata,function($obj,itemIds,data){
						
							$obj.click(function(){
								
								if(!self.currCanvasCheck()){
									return;
								};
								
								var temdata  = self.tmpMetaDataMerge({
									imgPath : data.IMG_PATH
								});								
								
								
								var aei = self.getAppendElementIds(BNGeneratorConst._TYPE.I);
	
								self.addItemData(aei,cf.currCanvasId,cf.currPanelId,temdata);
								self.hideContextMenu();
										
							});
							
						})//end choiceItemElementEvt;*/
						
						$li.append($itemHtml);
											
						
						// li에 담긴 아이템이 5개가 넘어가면 ul 테그에 li엘리먼트를 붙인다.
						if( (i % 5 ) == 0 ) {
							$ul.append($li);
						}				
						
					}//end for
				}//end if
				
				
				var wrapDivId = self.getNewElementId("wrapDivId");
				var ulDivId = self.getNewElementId("ulDivId");
				var prevBtn = self.getNewElementId("prevId");
				var nextBtn = self.getNewElementId("nextId");
				var file = self.getNewElementId("fileId");
				
				
				var html = "";
				html += "<div class='bn_wrap' id='"+wrapDivId+"'>";
				html += "		<div class='bn_list2' id='"+ulDivId+"'>";
				html += "		</div>";
				html += "		<button type='button' class='bn_prev' id='"+prevBtn+"'><img src='/images/btn_arr_up.gif' width='24' height='21' alt='prev' /></button>";
				html += "		<button type='button' class='bn_next' id='"+nextBtn+"'><img src='/images/btn_arr_down.gif' width='24' height='21'  alt='next' /></button>";
				html += "</div>";				
				html += "</div>";							
				
				// 아이템들이 들어가야 할 td 영역 타겟 지정
				var $choiceTarget = $("#"+gc.choiceImgTargetId);
				$choiceTarget.html("");
				$choiceTarget.html(html); // 선택 아이템을 담고 있을 html을 집어 넣는다.
				
				//아이템들을 담고 있는 ul을 붙여 넣는다.
				var $appendUl = $("#"+ulDivId);
				$appendUl.append($ul);

				$("#"+ulDivId).jCarouselLite({			
											btnNext: ".bn_next",			
											btnPrev: ".bn_prev",			
											visible: 1,		
											speed: 300,			
											vertical: true,
											circular: false		
										});
				
				//wrap 아이디 저장
				cf.wrapItemDivId[BNGeneratorConst._OPTCD.TB] = wrapDivId;
			},					
			
			requestChoiceItem  : function (opt_cd,radioBtnId) {
				
				var cf = this.getStatic_define();
				var gc = this.getConfig();
				var self = this;
/*
				var data  = {
						
						SITE_IMG_PATH : "http://local.overpass.co.kr",
						
						ITEMS :	[
						       	 
		 						{
									NO : "100000000",
									IMG_PATH : "/SpringBBS/images/coupon.png",
									IMG_THUMB_PATH : "/SpringBBS/images/coupon.png",
									TEXT_YN :"Y",
									ITEM_NAME : "쿠폰"
								
								},	
								{
									NO : "100000001",
									IMG_PATH : "/SpringBBS/images/sale.png",
									IMG_THUMB_PATH : "/SpringBBS/images/sale.png",									
									TEXT_YN :"N",		
									ITEM_NAME : "빅세일"									
								}
						] 						
				}
				
			
				if(gc.mode == "standard"){
					self.standardChoiceItem(data);							
				}else	if(gc.mode == "title"){
					self.titleChoiceItem(data,radioBtnId,opt_cd);							
				}				
		*/			
				
				//config에 선택아이템 이미지를 호출할 상위사이트 번호까지의 url 주소를 셋팅한다. 생략 해도 무방...
			//	gc.siteImgUrl = data.SITE_IMG_PATH;


				
				$.ajax({
					url: gc.choiceImgLoad, // 상품 이미지 호출 주소.
					dataType: "json",
					data: {opt_cd : opt_cd},
					async: false,
					success : function(data,status,request) {
						
						data = JSON.parse(data);
						//config에 선택아이템 이미지를 호출할 상위사이트 번호까지의 url 주소를 셋팅한다.
						gc.siteImgUrl = data.SITE_IMG_PATH;
						
						if(gc.mode == "standard"){
							self.standardChoiceItem(data);							
						}else	if(gc.mode == "title"){
							self.titleChoiceItem(data,radioBtnId,opt_cd);							
						}
					},
					error : function (request,status,error) {
						alert("message : 잘못된 요청입니다.\nRequest Code : " +request.status+"\n"+ "Error Message : " +error +"ResponseText : "+request.responseText);	
						return;
					}
				});	
					
			},
	
			requestGeneratorBanner  : function () {
				
				
				var cf = this.getStatic_define();
				var gc = this.getConfig();
				var self = this;

				//config에 선택아이템 이미지를 호출할 상위사이트 번호까지의 url 주소를 셋팅한다. 생략 해도 무방...
			//	gc.siteImgUrl = data.SITE_IMG_PATH;

				

				var metaDataObj = {}
				metaDataObj[cf.currCanvasId] = cf.metaData[cf.currCanvasId];
				
				$.ajax({
					url: gc.generatorUrl, // 상품 이미지 호출 주소.
					dataType: "json",
					type :"post",
					data: {bgData : JSON.stringify(metaDataObj)},
					async: false,
					success : function(data,status,request) {
						cf.currDownLoadData = data;
					
						if (gc.mode=="standard") {
							self.standardLayerPop(data)
						}else{
							self.titleLayerPop(data);								
						}
						
					},
					error : function (request,status,error) {
						alert("message : 잘못된 요청입니다.\nRequest Code : " +request.status+"\n"+ "Error Message : " +error +"ResponseText : "+request.responseText);	
						return;
					}
				});	
					
			},
			
			choiceItemElementEvt : function ($obj,itemIds,data,callback) {
					
				if(typeof(callback) == "function") {
					callback($obj,itemIds,data);
				}
				
			},
			
			applyTextEvt : function (canvasId,inputId,aei) {

				
				var $input = $("#"+inputId);
				var self =this;
				var cf = this.getStatic_define() ;
				var gc = this.getConfig();
				
								
				function evtAction () {
					
					for ( var i = 0; i < gc.applyAllText.length; i++) {
						//체크박스 체크 확인
						var check =$("#"+gc.applyAllText[i]).is(":checked");
						
						if(check){
							// 체크박스가 체크 되어 있으면 해당 텍스트 아이디를 가져온다.
							var currInputId = gc.eventTarget[0].textItemId[i];
							
							if(currInputId == inputId){

								for(var j = 0 ; j < gc.eventTarget.length ; j++ ){
									// 체크박스가 가리키는 input 아이디를 가져온다.
									var tmpInputId =gc.eventTarget[j].textItemId[i];
									//텍스트 아이템 등록시에 생성되는 아이디를 가져온다
									var cfAei = cf.textInputId[tmpInputId];
									//텍스트 적용
									self.applyText(gc.eventTarget[j].canvasId,currInputId,cfAei);
									//텍스트 값을 공유한다.
									$("#"+tmpInputId).val($("#"+currInputId).val());				
								//	$("#"+tmpInputId).attr("disabled", "disabled");
	
									
								}		
							}else {
								check = false;
							}
						}										
					}	
					
					return check;
				}
				
				
				$input.bind("keyup",function(e){
					
					var check = false;
					
					check = evtAction();
					
					if(!check){
						self.applyText(canvasId,inputId,aei);
					}
					self.hideContextMenu();

				});
				
				
				for ( var k = 0; k < gc.applyAllText.length; k++) {
					
					var $checkObj = $("#"+gc.applyAllText[k]);
					
					$checkObj.bind("click",function(e){
						
						check = evtAction();
						self.hideContextMenu();

					});	
				}			
				
			},
	
			
			applyTitleEvt : function (canvasId,aei) {

				
				var $text = $("#"+aei.childId);
				var self =this;
				var cf = this.getStatic_define() ;
				var gc = this.getConfig();
								
				
				$text.bind("dblclick",function(e){
					$(this).attr("contenteditable","true");
					$(this).focus();
					self.hideContextMenu();

				});
				
				$text.bind("click",function(e){
					
					e.preventDefault();

					$child = $(this);
									
					var $parent = $child.parent();
					mouseDown();
					self.hideContextMenu();
					//컨텍스트 메뉴 초기화
					var $textMenu = $("#"+gc.textMenu);
					$textMenu.css({"position" : "absolute","z-index" : "1000"});
					$textMenu.css({
						"display" : "block",
						"left" : e.pageX,
						"top" : (parseInt($parent.offset().top) - $textMenu.height()-10)
					});
					

					
					var getData =self.getIndexData(cf.currCanvasId,cf.currParentId);

					var tmpData = cf.metaData[cf.currCanvasId][getData.num];
					
					
					
					if (cf.tmselFontFamily && cf.tmselFontFamily != "") {
						
						self.selectOptionTextmenu({
							selectId : cf.tmselFontFamily,
							constObj : BNGeneratorConst._FONT_FAMILY,
							equalsValue : tmpData.fontFamily
						});

					} 
					
					if (cf.tmselFontSize && cf.tmselFontSize != "") {
						
						self.selectOptionTextmenu({
							selectId : cf.tmselFontSize,
							constObj : BNGeneratorConst._FONT_SIZE,
							equalsValue : tmpData.fontSize
						});
					} 					
				
					
					cf.currParentId = aei.parentId;
					cf.currChildId = aei.childId;
				});

				$text.bind("keyup",function(e){
					
					
					//text박스 크기를 조절하기위하여 parent Div 객체 구함
					var $p = $("#"+aei.childId).parent();
					var $c = $("#"+aei.childId);
					
					
					if ($c.width() > 80) {
						$p.width($c.width());			
					}else{
						$c.width("80");					
					}
					

					$p.height($c.prop("scrollHeight"));					
					$c.css("position","absolute");		
					$c.css("top","0px");		
					
					self.modifyMetaData(cf.currCanvasId, aei.parentId,{type :"T",text : $("#"+aei.childId).text()});

					self.hideContextMenu();

				});
				
				
				
				function mouseDown (){
					$text.bind("mousedown",function(e){
						if($(this).attr("contenteditable") == "true"){
							self.cancelEventBubbling(e);						
						}
					});
				}
				
						
				
			},		
			
			
			selectOptionTextmenu : function (obj) {
				
				
				var selectConstObj = obj.constObj;				
				var selValue;
				
				
				for ( var key in selectConstObj) {			
					
					if (selectConstObj[key].size) {
						
						if (selectConstObj[key].size == obj.equalsValue) {
							selValue = key;
						}
					}else{
						
						if (selectConstObj[key] == obj.equalsValue) {
							selValue = key;
						}
					}
				}
				
				var selFrm = $("#"+obj.selectId+" option[value="+selValue+"]");

				selFrm.attr("selected","selected");			
				
			},
			
			
			/***
			 * 아이템 선택 후 마우스 오른쪽 버튼을 누르면 context메뉴가 뜨도록 한다.
			 * 
			 * @param canvasId 현재 캔버스 아이디
			 * @param aei parentId 와 childId 를 담고 있는 json 객체
			 */					
			mouseRightBtnEvt : function (canvasId,aei) {
				
				
				var $context = $("#"+aei.parentId);
				var self =this;
				var cf = this.getStatic_define() ;
				var gc = this.getConfig();
								
				
	
				//컨텍스트 메뉴 초기화
				$contextMenu = $("#"+gc.contextMenu);
				$contextMenu.css({"position" : "absolute","z-index" : "1000"});

				$context.bind("contextmenu",function(e){

					//기본 이벤트 무력화
					e.preventDefault();
					
					if(!self.currCanvasCheck()){
						return;	
					}
					
					$child = $("#"+aei.childId);
					$child.attr("contenteditable","false");
					$child.unbind("mousedown");
					$child.blur();
	
					
					$contextMenu.css({
						"display" : "block",
						"left" : e.pageX,
						"top" : e.pageY
					});
					$("#"+gc.textMenu).css("display","none");

					cf.currParentId = aei.parentId;
					cf.currChildId = aei.childId;

				});						
				
			},		
			
			/***
			 * 아이템의 z-index 위치를 조정 한다. (뒤로)
			 */
			prevItemzIndex : function () {

				
				if(!this.currCanvasCheck()){
					return;	
				}
				
				var self =this;
				var cf = this.getStatic_define() ;
				var gc = this.getConfig();
				

				this.hideContextMenu();

				//컨텍스트 메뉴 초기화
				var $parentId = $("#"+cf.currParentId);
				
				var getData =this.getIndexData(cf.currCanvasId,cf.currParentId);
				
				var currIndex = getData.num;
				
				
				if ((currIndex-1) < 1) {
					
					window.alert("더이상 뒤로 이동은 불가능 합니다.");
					return;					
				}
				

				var tmpData = cf.metaData[cf.currCanvasId][currIndex-1];
				
				cf.metaData[cf.currCanvasId][currIndex-1] = getData.data;
				cf.metaData[cf.currCanvasId][currIndex] = tmpData;

				$parentId.css("z-index",currIndex-1);			
				this.setIndexData(cf.currCanvasId, cf.currParentId, currIndex-1);

				$("#"+tmpData.divId).css("z-index",currIndex);
				this.setIndexData(cf.currCanvasId, tmpData.divId, currIndex);
				
				
		//		console.log("data : "+JSON.stringify(cf.metaData[cf.currCanvasId]));
										
			},			
			
			/***
			 * 아이템의 z-index 위치를 조정 한다. (앞으로)
			 */		
			nextItemzIndex : function () {
				
				if(!this.currCanvasCheck()){
					return;	
				}
				
				var cf = this.getStatic_define() ;
				var gc = this.getConfig();
				
				this.hideContextMenu();

	
				//컨텍스트 메뉴 초기화
				var $parentId = $("#"+cf.currParentId);
				
				
				var getData =this.getIndexData(cf.currCanvasId,cf.currParentId);
				
				var currIndex = getData.num;
				
				
				if ((currIndex+1) > (cf.metaData[cf.currCanvasId].length-1)) {
					
					window.alert("더이상 앞으로 이동은 불가능 합니다.");
					return;					
				}
				

				var tmpData = cf.metaData[cf.currCanvasId][currIndex+1];
				
				cf.metaData[cf.currCanvasId][currIndex+1] = getData.data;
				cf.metaData[cf.currCanvasId][currIndex] = tmpData;

				$parentId.css("z-index",currIndex+1);			
				this.setIndexData(cf.currCanvasId, cf.currParentId, currIndex+1);

				$("#"+tmpData.divId).css("z-index",currIndex);
				this.setIndexData(cf.currCanvasId, tmpData.divId, currIndex);
						
	//			console.log(JSON.stringify(cf.metaData[cf.currCanvasId]));

			},		
			
			
			/***
			 * 아이템의 z-index 위치를 조정 한다. (맨 뒤로)
			 */					
			firstItemzIndex : function () {

				
				if(!this.currCanvasCheck()){
					return;	
				}
				
				var cf = this.getStatic_define() ;
				var gc = this.getConfig();
				
				this.hideContextMenu();

				var flag = true;
				
				while (flag) {					

					var getData =this.getIndexData(cf.currCanvasId,cf.currParentId);
					
					if ((getData.num-1) < 1) {
						flag = false;
					}else{
						this.prevItemzIndex();						
					}
				}
				
	//			console.log(JSON.stringify(cf.metaData[cf.currCanvasId]));

			},	
			
			
			/***
			 * 아이템의 z-index 위치를 조정 한다. (맨 앞으로)
			 */								
			lastItemzIndex : function () {

				
				if(!this.currCanvasCheck()){
					return;	
				}
				
				var cf = this.getStatic_define() ;
				var gc = this.getConfig();

				this.hideContextMenu();

				
				var flag = true;
				
				while (flag) {					

					var getData =this.getIndexData(cf.currCanvasId,cf.currParentId);
					
					if ((getData.num+1) > (cf.metaData[cf.currCanvasId].length-1)) {
						flag = false;
					}else{
						this.nextItemzIndex();						
					}
				}
				
				
			},				
			
			/***
			 * 아이템을 제거 한다
			 */								
			deleteItem : function () {

				
				if(!this.currCanvasCheck()){
					return;	
				}
				
				var cf = this.getStatic_define() ;
				var gc = this.getConfig();
				
				var flag = true;
				
				$("#"+cf.currParentId).remove();
				
				var getData =this.getIndexData(cf.currCanvasId,cf.currParentId);
				var num = getData.num;
				var metadata = cf.metaData[cf.currCanvasId];
				
		
				for ( var key in cf.indexData[cf.currCanvasId]) {
				
					if(cf.indexData[cf.currCanvasId][key] != num 
							&& cf.indexData[cf.currCanvasId][key] != 0 
							&& cf.indexData[cf.currCanvasId][key] > num){
						
						var modifyIndex = cf.indexData[cf.currCanvasId][key]-1;
						this.setIndexData(cf.currCanvasId, key, modifyIndex);
						$("#"+key).css("z-index",modifyIndex);
						
					//	console.log("z-index : "+ $("#"+key).css("z-index")); 
					}else if (cf.indexData[cf.currCanvasId][key] == num) {
						delete cf.indexData[cf.currCanvasId][key];
					}					
				}				
				
				cf.metaData[cf.currCanvasId] = $.grep(metadata,function(arrData,index){
					return (index != num);
				});
				
				this.hideContextMenu();
	//			console.log(JSON.stringify(cf.metaData[cf.currCanvasId]));

			},	
			
			
			/***
			 * 컨텍스트 메뉴를 숨긴다.
			 */
			
			hideContextMenu : function () {
				
				
				var self =this;
				var cf = this.getStatic_define() ;
				var gc = this.getConfig();
				
				$("#"+gc.contextMenu).css("display","none");
		//		alert($("#"+cf.currParentId).css("display"))
			},
			
			
			/**
			* 아이템  정보를 저장 한다.
			* @param canvasId 캔버스 아이디
			* @param parentId 부모아이디
			* @param data 타입을 지정.
			*/			
			setMetaData : function (canvasId,parentId,type,data) {

				if(!data){
					data = {};
				}else{
					data = this.tmpMetaDataMerge(data);	
				}
				
			//	delete data.lineHeight;
								
				var cf = this.getStatic_define();
				var gc = this.getConfig();
				
				
				if(cf.metaData[canvasId] === undefined){
					cf.metaData[canvasId] = new Array();
				}
				
				var $obj = $("#"+parentId);
				var $position =$obj.position();			

				data.divId = parentId;
				data.type = type;
				
				if (Browser.type=="Chrome" &&data.newItem && data.newItem=="Y" ) {
					 this.imgLoad($obj.find("img").attr("src"), function(o){
						 data.width = ""+((o.width)-2);
						 data.height = ""+((o.height)-2);
					 });					 
				}else{
					data.width = ""+($obj.width()-2);
					data.height = ""+($obj.height()-2);						
				}				

				data.posX = ""+($position.left+1);
				data.posY = ""+($position.top+1);

				cf.metaData[canvasId].push(data);			
				
				var idxLength = cf.metaData[canvasId].length;
				
				//인덱스 정보를 저장한다.
				this.setIndexData(canvasId ,parentId, ( idxLength < 1) ? 0 : (idxLength-1) );
		//		//console.log(JSON.stringify(cf.metaData));
				
			},
			
			
			
			/**
			* 크기 및 위치 가 변경된 정보들을 저장한다.
			* @param canvasId 캔버스 아이디
			* @param parentId 부모 아이디 div
			* @param type 타입을 지정.
			*/
			
			modifyMetaData : function (canvasId,parentId,data,childId) {
				
				if(!data){
					data = {};
				}
				
				var cf = this.getStatic_define();
				var gc = this.getConfig();				
				
				if(cf.metaData[canvasId] === undefined){
					cf.metaData[canvasId] = new Array();
				}
				
				var $obj = $("#"+parentId);
				var $position =$obj.position();			


				data.width = ""+($obj.width()-2);
				data.height = ""+($obj.height()-2);						

				data.posX = ""+($position.left+1);
				data.posY = ""+($position.top+1);
				data.choiceTextInfo={};
			
				var getData =this.getIndexData(canvasId,parentId);
				
				cf.metaData[canvasId][getData.num] = $.extend(true,getData.data,data);

				//console.log(JSON.stringify(cf.metaData));
									
			},
			
			
			/**
			*  인덱스 정보를 넣는다.
			*/
			setIndexData : function(canvasId,parentId,num) {
				
				var cf = this.getStatic_define();
				
				if(cf.indexData[canvasId] === undefined){
					cf.indexData[canvasId] = {};
				}
				
				cf.indexData[canvasId][parentId] = num;
				
			},
			
			/**
			*  인덱스 정보를 찾는다
			*/
			getIndexData : function(canvasId,parentId) {
				
				var cf = this.getStatic_define();
		//		var gc = this.getConfig();		
				
				if(cf.indexData[canvasId] === undefined){
					window.alert("현재 캔버스에 대한 인덱스 정보가 존재 하지 않습니다.");
					return;
				}
				//메타데이터에 들어있는 배열 순번을 가져온다.
				var getNum = cf.indexData[canvasId][parentId];
							
				return {
					num : getNum,
					data : cf.metaData[canvasId][getNum]
				};

			},		
			
			
			downloadImage : function () {
			
				
			},
			
			/**
			* 상품 이미지를 불러 온다.
			*
			*/
			
			productImgLoad : function () {
				
				var self =  this;
				var cf = this.getStatic_define();
				var gc = this.getConfig();		
				
				//컨버스 선택 여부 체크
				if (!this.currCanvasCheck()) {
					return;
				}
				
				var gc = this.getConfig() ;
				
				var good_no = $("#"+gc.prdNoInputId).val();

				if(good_no == ""){
					window.alert("상품 번호가 등록되어 있지 않습니다");
					return;
				}
				
				$.ajax({
					url: gc.prdImgLoad, // 상품 이미지 호출 주소.
					dataType: "json",
					data: {good_no : good_no},
					async: false,
					success : function(data,status,request) {

						if (data === null) {
							window.alert("현재 상품이 존재하지 않습니다.");
							return;
						}
						

						var aei = self.getAppendElementIds(BNGeneratorConst._TYPE.I);

						var temdata  = self.tmpMetaDataMerge({
							imgPath : data.IMG_PATH,
							prdImg : "Y"
						});			
						
						
						//config에 선택아이템 이미지를 호출할 상위사이트 번호까지의 url 주소를 셋팅한다. 생략 해도 무방..
						//cf.siteImgUrl = data.SITE_IMG_PATH;
						
						self.addItemData(aei,cf.currCanvasId,cf.currPanelId,temdata);

					},
					error : function (request,status,error) {
						alert("message : 잘못된 요청입니다.\nRequest Code : " +request.status+"\n"+ "Error Message : " +error);	
						return;
					}
				});	
			},
				
			deleteProductInput : function () {
				
				var self =  this;
				var cf = this.getStatic_define();
				var gc = this.getConfig();		
				
				var gc = this.getConfig() ;
				
				var prdInputId = $("#"+gc.prdNoInputId).val("");
			},			
			
			
			/***
			* 각 엘리먼트 이미지를 리사이징 한다.
			*
			*/
			
			addResizable  :  function (parentId,childId,t) {
				
				
				//아이템의 가로 세로  사이즈를 구한다.				
				var i = $("#"+childId);
				var s = this;
				var cf = this.getStatic_define();

				if (!t.width) {
					t.width = i.width();
					t.height = i.height();
				}
								
				
				var $parentObj = $("#"+parentId);
				var originalOffset = $parentObj.offset();

			
				
				

				if ($("#"+childId).prop("tagName").toLowerCase() == "span") {

					$parentObj.resizable(
						{
							alsoResize:"#"+childId ,
							handles : "all", 
							resize : function( event, ui ) {
								
								
								if(!s.currCanvasCheck()){
									$parentObj.css({ width: ui.originalSize.width, height: ui.originalSize.height});
									$("#"+childId).css({ width: ui.originalSize.width, height: ui.originalSize.height});
									event.preventDefault();
									return;	
								}
	
								if( ($("#"+childId).prop("tagName").toLowerCase() == "img") && !event.shiftKey){
									$parentObj.css({ width: ui.originalSize.width, height: ui.originalSize.height});
									return;
	
								}
								
								$("#"+childId).css({ width: ui.size.width, height: ui.size.height});
								
								s.modifyMetaData(cf.currCanvasId ,parentId);
								
							},
	
							stop : function( event, ui ) {
							
							}
						}
					)
					
				}
				
				$parentObj.draggable(
						{
							start : function( event, ui ) {
								

							},
							drag : function(event, ui ){
								s.cancelEventBubbling(event)

								if(!s.currCanvasCheck()){
									$parentObj.offset({ top: originalOffset.top, left: originalOffset.left});
									event.preventDefault();
									return;	
								}
								
								s.modifyMetaData(cf.currCanvasId ,parentId);
							},
							stop : function( event, ui ) {
								
							}
						}		
				)
				.css({'width': t.width+'px', 'height': t.height+'px'});		
				////console.log(i.width() +","+i.height());
			},

			
			/***
			* 캔버스 작업 구역 변경 클릭 이벤트를 등록 한다.
			*
			*/
						
			changeCanvasEvt :  function ($obj,id) {
				
				var cf = this.getStatic_define() ;
				var s = this;
				var gc = this.getConfig();		

				$obj.bind("click",function(e){
					
					s.cancelEventBubbling(e);
					s.changeCanvas(id);
					s.hideContextMenu();

				});		
				
				$obj.bind("contextmenu",function(e){

					$("#"+gc.textMenu).css({"display" : "none"});
					if (($("#"+cf.currChildId).prop("tagName")).toLowerCase() == "span") {
						$("#"+cf.currChildId).attr({"contenteditable" : "false"});						
					}
					
					//기본 이벤트 무력화
					e.preventDefault();
					
					$child = $(cf.currChildId);
					$child.attr("contenteditable","false");
					$child.unbind("mousedown");
					$child.blur();
					
				});		
				
			},

			/**
			* 캔버스 작업 구역을 변경한다
			*/
			
			changeCanvas : function (id) {
				
				var cf = this.getStatic_define();
				
				$("#"+cf.currCanvasId).css("background-color","");
				
				cf.currCanvasId = id.canvasId;
				cf.currPanelId = id.panelId;

				$("#"+cf.currCanvasId).css("background-color","#FFFFFF");
				
			},
			
			
			/**
			 * 이벤트 진행시 이루어지는 버블링을 취소한다.
			 * @param event 이벤트 객체.
			 */

			cancelEventBubbling : function (e) {
				var eventReference = e ? e : window.event;
				if (eventReference.stopPropagation) {
					eventReference.stopPropagation();
				} else {
					eventReference.cancelBubble = true;
				}
			}
			
			

	}
		
	
	var OBGenerator = OBGenerator || {};
	
	OBGenerator.init = function(config){		
		
		return new BNGenerator(config);
	}