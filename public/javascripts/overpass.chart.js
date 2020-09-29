(function($){
	
	M.use("common");
	
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
	
	/** 네임 스페이스 생성*/
	if(!$.overpass){
		$.overpass = {};
	}
	
	$.overpass.chart = {
			
			/** 차트를 집어넣을 기본 DIV 아이디를 셋팅 */    			
			_CHART_TARG_ID : "_OVERPASS_CHART_TARG",
			
			/** 차트를 집어넣을 LI 아이디를 셋팅 좌우 정렬 때문에 LI 사용. */    			
			_CHART_LI_ID : "_OVERPASS_CHART_TARG",
			
			
			config : {
				target : null,
				chart :  null,
				vAlign : "vertical",
				interval : 0 ,
				data : [],
				options : {
					chartArea:{ left : 10, top : 10, width : "100%", height : "100%"}
				},
				events  : {}    				
			},
			
			/**
			 * 
			 *  차트를 생성 한다.
			 * 
			 * @param config 설정 객체를 넘긴다.
			 * @author 장진철 zerocooldog@pionnet.co.kr
			 */    	
			
			createChart : function (config) {
				
				$o = $.overpass.chart;
				
				$.extend($o.config, config || {});
				
				
				//차트를 집어 넣을 li 아이디를 배열로 구한다.
				var wrapDivId = $o.getElementRename($o._CHART_TARG_ID);


				//차트를 집어 넣을 li 아이디를 배열로 구한다.
				var liIdArr = $o.createWrapLayout($o,wrapDivId);
				
				for (var i = 0; i < liIdArr.length; i++ ) { 

					$o.drawChart($o,liIdArr[i],wrapDivId,i);
				}
				
			},    			
			
			/**
			 *  다이나믹 차트를 생성 한다.
			 * 
			 * @param config 설정 객체를 넘긴다.
			 * @author 장진철 zerocooldog@pionnet.co.kr
			 */    	
			
			createDynamicChart : function (config) {
				
				$o = $.overpass.chart;
				
				$.extend($o.config, config || {});
				
				
				if ( typeof(config.xhr == "function") ){				
					$o.config.data = config.xhr();
				}else{
					window.alert(M.common.message.잘못된호출로인하여xhr을실행할수없습니다);
					return;
				}

				if( !($o.config.data instanceof Array) ) {					
					window.alert("xhr function 리턴값이 Array 형이 아닙니다.")
					return;
				} 
				
				
				//차트를 집어 넣을 li 아이디를 배열로 구한다.
				var wrapDivId = $o.getElementRename($o._CHART_TARG_ID);
				
				//차트를 집어 넣을 li 아이디를 배열로 구한다.
				var liIdArr = $o.createWrapLayout($o,wrapDivId);
				
				drawChart(liIdArr);

				//타이머를 돌린다.
				var intervalId = setInterval(function(){

					if(!$("#"+$o.config.target)[0]) {
						clearInterval(intervalId);
						intervalId = 0;
					}
					
					if( intervalId > 0 ){
						
						$o.config.data = config.xhr();					
						drawChart(liIdArr);						
					}

				},$o.config.interval);
				
				//배열 길이만큼 그리도록 for문을 돌린다.
				
				function drawChart (liIdArr) {
					for (var i = 0; i < liIdArr.length; i++ ) { 

						$o.drawChart($o,liIdArr[i],wrapDivId,i);
					}
				}//end drawChart function
			},    					
			/**
			 * 
			 *  차트를 구성할 wrapper 레이아웃을 구성한다.
			 * 
			 * @param name 엘리먼트 아이디 및 이름을 변경 할 문자열
			 * @author 장진철 zerocooldog@pionnet.co.kr
			 */
			    			
			createWrapLayout : function ($o,targDivId) {
				
				
				$("<div id = \""+targDivId+"\" style='position:relative;width:100%;height:100%'></div>").prependTo("body");

				//li 아이디를 담을 배열
				var liId = [];
				var dataLength = $o.config.data.length;
				
				var layoutStyle = "margin: 0;padding: 0;border: 0;font-size: 100%;font: inherit;vertical-align: baseline";
				
				var html = "<ul style=\"overflow:hidden;list-style: none;"+layoutStyle+"\" >";

				for (var i = 0; i < dataLength ; i ++) {
					var tmpLiId = $o.getElementRename($o._CHART_LI_ID)+i+"_"+$o.config.target;    		
					html += "<li id=\""+(tmpLiId) +"\" style=\"overflow:hidden;position:relative;float:"+(($o.config.vAlign == "horizon") ? "left" : "none" )+";"+layoutStyle+";width:"+$o.config.options.chartArea.width+"px;height:"+($o.config.options.chartArea.height)+"px\">zxczxc</li>";    					 					
					liId[i] = tmpLiId;
					tempLiId = null;
				}
				html +="</ul>";
				
				$(html).appendTo("#"+targDivId);
				
				return liId;
			
			},
			
			drawChart : function ($o,liId,wrapDivId,i) {
				
				var tmpOpt;
				
				tmpOpt = $.extend(true,tmpOpt,$o.config.options);
				
				if(($o.config.options.title instanceof Array) && ($o.config.options.title.length > 1)){
					tmpOpt.title = $o.config.options.title[i];								
				}else if (($o.config.options.title instanceof Array) &&($o.config.options.title.length == 1)) { 
				
					if( i < 1 ){
						tmpOpt.title = $o.config.options.title[0];				
					}else{
						tmpOpt.title = "";
					}
				}
				

				var data = new google.visualization.DataTable($o.config.data[i]);
                var chart = new google.visualization[$o.config.chart]($("#"+liId)[0]);
                
                if ($o.config.chart == "LineChart") {
                    //차트 그릴때 옵션에 추가하면 Line 차트같은 경우 화면이 짤린다.
                    delete tmpOpt.chartArea.width;
                    delete tmpOpt.chartArea.height;                	
                }                
                
            	chart.draw(data, tmpOpt);
				$($("#"+wrapDivId)[0]).appendTo("#"+$o.config.target);
				
				//layerCreate 함수에서 쓰이는 iframe이 grid를 뚫는 버그 때문에.. css를 이용하여 막고 있는데... 
				//그 때문에 신규 추가되는 iframe이 영향을 받아 화면에 뜨지 않는다.. 공통 함수라 소스나 css를  고치기 난감하여..
				// 브라우져 구분하여 css 값을 다시 지정 해준다.
				if (Browser.type == "MSIE" && Browser.version < 9) {

					$("#"+$o.config.target).find("iframe").css({					
						"z-index" : 1000,
						"filter" : "alpha(opacity=100)",
						"opacity" : "100",
						"-moz-opacity" : "100",
						"width" : "100%",
						"position" : "relative",
						"top":0,
						"left":0,
						"height":"100%"});
					
				}

				
				//이벤트를 등록한다.
				for ( var eventNm in $o.config.events) {
					google.visualization.events.addListener(chart, eventNm, $o.config.events[eventNm]);
				}

   			},
			    			
			
			/**
			 * 
			 *  객체 아이디가 중복 되지 않게 이름을 임의로 변경 한다.
			 * 
			 * @param name 엘리먼트 아이디 및 이름을 변경 할 문자열
			 * @author 장진철 zerocooldog@pionnet.co.kr
			 */
			
			getElementRename : function (name) {
				
				var $o = $.overpass.chart;
				
				var cdate = new Date();
				var h=$o.addZero(cdate.getHours(),2);
				var m=$o.addZero(cdate.getMinutes(),2);
				var s=$o.addZero(cdate.getSeconds(),2);
				var ms=$o.addZero(cdate.getMilliseconds(),3);
				var rename = name+h+m+s+ms;
		
				return rename
			},		
			
			/**
			* 시 분 초가 2자리수 미만 이면 앞자리에 0을 붙여준다.
			*
			* @param c 파라메터 값 문자열
			* @link http://www.digitalbart.com/blog/jquery-and-urlencode/ 댓글에서 퍼옴
			*/     
		     
		    addZero : function (x,n) {
				if (x.toString().length<n) 
				{
					x="0" + x;
				}
				return x;
			},
			
			
			/***
			 * chartData를 그리기 위한 데이터를 셋팅하기 위한 DTO
			 * setColumn으로 컬럼을 먼저 지정한 후에 setRow를 통하여 데이터를 등록한다.
			 * 
			 * 숫자 포맷을 위한 jquery.numberformatter-1.2.3.min.js 라이브러리도 필요하다.
			 * 
			 * ex)	var amtData  = new $.overpass.chart.ChartDataTable();
			 * 		amtData.setColumn(
			 *			{ id : 'DAY', label : '요일', type : 'string' },
			 *			{ id : 'ORD_AMT', label : '주문금액', type : 'number' },
			 *			{ id : 'SALE_AMT', label : '매출금액', type : 'number' }
			 *		);
			 *		//데이터를 셋팅 한다. v :  value 데이터 값, f :  format 숫자 형식을 포맷한다, nvl : 데이터 값이 없을 때 지정한 값을 채운다.
			 *		amtData.setRow ( { v : dayNm }, { v : ordAmt, f : "#,###", nvl : "0"  }, { v : saleAmt, f : "#,###" , nvl : "0" } );
			 *
			 *		//셋팅된 데이터를 가져온다.
			 *		amtData.getData()
			 *
			 * @author 장진철 
			 */
			
			ChartDataTable : function () {				
				
				/** chart 를 그리기 위해 필요한 data, private 변수**/
				var chartData = {
					//컬럼 정보 셋팅
					cols : new Array(),
					//로우 정보 셋팅
					rows : new Array()
				};
				
				var config = {
						cols : { id : '', label : '', type : 'String' },
						rows : { c : [] },
					}
				
				
				//chartData를 리턴 한다.
				this.getData = function () {
					return chartData;
				}
				
				//컬럼 갯수를 리턴한다.
				this.getColumnSize = function () {
					return chartData.cols.length;
				}
				
				//로우 갯수를 리턴한다.
				this.getRowSize = function () {
					return chartData.cols.length;
				}
				
				// data 설정 정보를 불러온다.
				this.getConfig  = function () {
					return config;
				}
				
			}
			
	}

	
	/**
	 * ChartDataTable 객체 생성시 불필요한 메모리 소모를 막기 위하여 공통적으로 쓰이는 함수는
	 * prototype 에 담아둔다. ChartDto 는 google chart를 그리기 위해 필요한 데이터를 담는 클래스다.
	 * 
	 * @author 장진철
	 */
	$.overpass.chart.ChartDataTable.prototype  = {
			
		/***
		 * chart 컬럼을 셋팅한다. 기본은 JSON형으로 받아오지만 [] 간단한 배열 형태도 가능한다.
		 *  
		 * json 형식 { id : 'DAY', label : '요일', type : 'string' }
		 * 배열 형식 ["DAY","요일","string"]
		 * 
		 * @param args 인자 값
		 * @return 
		 * @author 장진철 
		 */
			
		setColumn : function (args) {
			
			var data = this.getData();
			
			var config = this.getConfig();
			
			
			var argsLength = arguments.length;
			
			for (var i = 0 ; i < argsLength ; i++) {
				
				if( !(arguments[i] instanceof Array) && typeof(arguments[i])  == "object" ) {
					
					data.cols.push(arguments[i]);
	
				}else if( arguments[i] instanceof Array){
					
					var argsColsLength = arguments[i].length;
					
					var tmpConfig = {};

					for (var x = 0 ; x < argsColsLength ; x++) {
						
						if( x == 0 ){
							tmpConfig.id = arguments[i][x];
						}else 	if( x == 1 ){
							tmpConfig.label = arguments[i][x];
						}else 	if( x == 2 ){
							tmpConfig.type = arguments[i][x];
						} //end if						
					} // end for
					
					var colsArr = $.extend(true,config.cols,tmpConfig)
					data.cols.push(colsArr);
					
				} // end else if				
			}// end for
	
		},
		
		/***
		 * chart row 데이터를 셋팅한다.
		 * 
		 * @param args 인자 값
		 * @return 
		 * @author 장진철 
		 */
		
		setRow : function (args) {
			
			var data = this.getData();			
			var config = this.getConfig();
			
			var argsLength = arguments.length;
			
			var tmpCell  = $.extend(false,config.rows,{ c : [] });

			for (var i = 0 ; i < argsLength ; i++) {
				
			
				if( !(arguments[i] instanceof Array) && typeof(arguments[i])  == "object" ) {
									
					var getArgs = arguments[i];

					if(getArgs.f){
						getArgs.f = $.formatNumber(getArgs.v, {format : getArgs.f, locale:"kr"});
					}
					
					if(getArgs.nvl){						
					//	getArgs.v = (getArgs.v && getArgs.v == "" ) ? getArgs.nvl : getArgs.v; 
						getArgs.f = (getArgs.f == null || getArgs.f == "" || getArgs.f == 0 ) ? getArgs.nvl : getArgs.f; 
					}
					
					delete getArgs.nvl;
					
					tmpCell.c[i] = getArgs;

				}// end if			
			} // end for

			data.rows.push(tmpCell);
			
		}// end setRow
	}
	
})(jQuery);