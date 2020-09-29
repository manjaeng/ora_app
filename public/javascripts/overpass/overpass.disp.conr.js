(function ($) {
	
    /**  템플릿 코너에서 사용할 공통 함수 */ 
	$(document).ready(function () {
		
		    var conrCondBaseCont = 0 //데이타 검색
		  
		    var vParamPin = {};
		    
			//코너 마케팅 기준등록 데이타 조회
			fnSetConrCond = function(p){
			  //pin셋팅값 form에 셋팅하기
			  $.each(p, function(name, val) {
				  vParamPin[name] = val;
			  });
			};
		      
	        //템플릿 마스터 영역 구성  grid
	        var areaConrGrid = $("#areaConrDivGrid").createGrid({
	            columns : [
	                { header:"LEVEL",               id:"LEVEL", type:"L" },    //레벨로 사용할 컬럼은 type을 "L"로 지정             
	                { header:"영역명",              id:"AREA_NM",                width:150},
	                { header:"코너스탁그룹명",      id:"CONR_STOCK_GRP_NM",      width:200, underline: true },
	                { header:"전시순서",            id:"DISP_SEQ",               width:50 , type:"N", editable:true , maxlength:3,  align:'right'}, 
	                { header:"전시시작일",          id:"DISP_START_DTIME",       width:140, editable:true,  type:"D" , calendar: { sdate: "DISP_START_DTIME", edate: "DISP_END_DTIME", hour: true, minute: true }},
	                { header:"전시종료일",          id:"DISP_END_DTIME",         width:140, editable:true,  type:"D" , calendar: { sdate: "DISP_START_DTIME", edate: "DISP_END_DTIME", hour: true, minute: true }},
	                { header:"전시여부",            id:"DISP_YN",                width:60, type:"B",  editable:true, checkbox:false  , align:'center'},
	                { id:"CONR_STOCK_GRP_NO",      type: "H" },
	                { id:"CONR_STOCK_NO",          type: "H" },  
	                { id:"AREA_NO",                type: "H" },
	                { id:"AREA_NO_PATH",           type: "H" },
	                { id:"ORG_CONR_STOCK_GRP_NO",  type: "H" },
	                { id:"LEAF_YN",                type: "H" },
	                { id:"CONR_NO",                type: "H" },
	                { id:"GUBUN",                  type: "H" },
	                { id:"AREA_LEAF_YN" ,          type: "H" },
	                { id:"ON_DEPTH_DISP_NUM_STR",  type: "H" },
	                { id:"SHOP_TYPE_DISP_CTG_NO",  type: "H" }
	            ],
	            properties:{ 
	                height:$("#areaConrDivGrid").height(),
	                sort:false
	            },           
	            events : {
	    			RowChanged: function(row1, row2) {
	    				var cell = areaConrGrid.GetCell({row:row1.Index, id:"CONR_STOCK_GRP_NM"});
	    				if(cell.Text != "" ){
	    					fnSearchConrSetGrid();
	    					
	    				}else{
	    					conrSetGrid.ClearRows();
	    				}
	    				var idx = row1.Index;
	    				console.log(idx);
	    				for(var i = idx ; idx >= 0 ; i--){
	    						var cRow = areaConrGrid.GetRow({row:i});
	    						if(cRow["LEAF_YN"] == "N"){
	    							$("#slt_area").html(cRow["AREA_NM"]);
	    							break;
	    						}
	    					
	    				}
	    				
					},
	                RowAdded: function(row) {
	                	
	                    if(row["GUBUN"] == "G" || row["GUBUN"] == "A" && row["AREA_LEAF_YN"] == DEF_BOOLEAN_TRUE ){
	                        
							areaConrGrid.SetEditable({
								row:row.Index ,  id :"DISP_START_DTIME", editable:true
							});
							areaConrGrid.SetEditable({
								row:row.Index ,  id :"DISP_END_DTIME", editable:true
							});
							  
							areaConrGrid.SetEditable({
								row:row.Index ,  id :"DISP_YN", editable:true
							});    
	                          
	                    }else{
	                        
							areaConrGrid.SetEditable({
							    row:row.Index ,  id :"DISP_START_DTIME", editable:false
							});
							areaConrGrid.SetEditable({
							    row:row.Index ,  id :"DISP_END_DTIME", editable:false
							});
							areaConrGrid.SetEditable({
							    row:row.Index ,  id :"DISP_YN", editable:false
							});                        
	                    }
	                }/*,
	                CellClick: function(c){
	                	if(c.Id == "CONR_STOCK_GRP_NM" && c.Text != ""){
	                		rowChng = true;
	                		console.log("들어감");
	                		fnSearchConrSetGrid();
	                	};
	                }*/
	                
	            }
	        });

	        //영역 그리드 넘기기 
	        getGridObject = function(gubun){
	        	
	        	var grid = "";
	        	if(gubun =="A"){
	        		grid =  areaConrGrid;
	        	}
	        	return grid;
	        };
	        
	       //스탁연결 
	       $("#addstockConrBtn").click(function() {
	         
				var row = areaConrGrid.GetRow({});
				
				if(!row){
				    alert('스탁연결할 영역을 선택 해 주세요 ');
				    return;
				}
				
				if(row["AREA_LEAF_YN"] == DEF_BOOLEAN_TRUE) {
				    fnConrStockLink(row);
				} else {
					alert('영역의 최 하단에만 등록 가능합니다.');
				}
	         
	      });   
	      
	      //코너 스탁 링크 연결     
	      fnConrStockLink = function (row){
	          
              var vSite_no = "";
              if(typeof($("#site_no").val()) != "undefined" ){
            	  vSite_no = $("#site_no").val();
              }
              
	          fnConrStockListPop({
	                
	              callback:function(rows) {
	                  
	                   $.each(rows , function (sub , optionData){
	                       
	                       //중복체크하기 
	                       var mstRows = areaConrGrid.GetRows();
	                       var cnt = 0;
	                       for ( var idx = row.Index ;  idx < mstRows.length ;  idx++) {
	                           
	                           //영역번호 동일한 것 사이에서만 돌려야 함 
	                           if(mstRows[idx]["AREA_NO"] != row["AREA_NO"]){  
	                               break;
	                           }
	                           
	                           //동일한 그룹번호가 존재 한다면 등록하면 안됨 
	                           if(mstRows[idx]["CONR_STOCK_GRP_NO"] == optionData["CONR_STOCK_GRP_NO"]){
	                               cnt++;
	                               break;
	                           }
	                       }
	                       
	                       if(cnt == 0){
	                           
	                           areaConrGrid.AddRow({
	                               data: {
	                                      CONR_STOCK_GRP_NO:optionData["CONR_STOCK_GRP_NO"],
	                                      CONR_STOCK_GRP_NM:optionData["CONR_STOCK_GRP_NM"],
	                                      CONR_STOCK_NO:optionData["CONR_STOCK_NO"],
	                                      AREA_NO:row["AREA_NO"],
	                                      AREA_NO_PATH:row["AREA_NO_PATH"],
	                                      DISP_SEQ:row["DISP_SEQ"],
	                                      LEAF_YN:DEF_BOOLEAN_TRUE,
	                                      DISP_YN:DEF_BOOLEAN_TRUE,
	                                      GUBUN:"G",
	                                      SHOP_TYPE_DISP_CTG_NO:row["SHOP_TYPE_DISP_CTG_NO"]
	                                   },
	                               sibling: false
	                           });
	                           
	                           areaConrGrid.SelectRow({
	                               row: row.Index
	                           });
	                           
	                        }
	                       
	                    });
	               },
	               
	               params:{
                       site_no:vSite_no,
                       conr_yn:DEF_BOOLEAN_TRUE,
                       area_no:row["AREA_NO"],
                       disp_ctg_no:$('#disp_ctg_no').val()
	               }
	          });
	      };
	      
	    //삭제 
	    $("#deleteConrBtn").click(function () { 
	        
	        areaConrGrid.DeleteCreateRows();
	    });
	      

	    //저장 
	    fnSaveConr = function(paramPin){
	    	
	    	var count = areaConrGrid.GetRowCount();
	        
	        //필수 입력 사항 체크 하기 
	        if(count <= 0 ){
	            alert('데이타가 존재 하지 않습니다.');
	            return;
	        }
	        
	        var rows = areaConrGrid.GetRows();
	        var pin = {};
	        var chkVaild = true;  //유효성 체크하기 
	        
	        $.each(rows , function(idx, obj){
	            
	        	if(!chkVaild){
	                return;
	            }
	                
                if(obj["AREA_LEAF_YN"] == DEF_BOOLEAN_TRUE || obj["LEAF_YN"] == DEF_BOOLEAN_TRUE){
                    
                    if(obj["DISP_START_DTIME"] == ""){
                        areaConrGrid.SelectCell({
                            row: idx,
                            id: "DISP_START_DTIME"
                        });
                          
                        alert('전시시작일을 선택해 주세요');  
                        chkVaild = false;
                        return;
                    }
                    
                    if(obj["DISP_END_DTIME"] == ""){
                        
                        areaConrGrid.SelectCell({
                            row: idx,
                            id: "DISP_START_DTIME"
                        });
                        
                        alert('전시종료일을 선택해 주세요');
                        chkVaild = false;
                        return;
                      
                    }
                }
	            
	            //영역인 것만 담기 
	            if(obj["CONR_STOCK_GRP_NO"] == ""){
	                
	                  pin["NO"+obj["AREA_NO"]] = obj["DISP_SEQ"];
	                  
	            }
	            
	            if(obj["AREA_LEAF_YN"] == DEF_BOOLEAN_TRUE){
	                
	                  var str_disp = '';
	                  var p_area_no_path = obj["AREA_NO_PATH"];
	                  var arr_area_no_path = p_area_no_path.split(';');
	                
	                  for(var mst = 0 ;  mst <  arr_area_no_path.length ;  mst++){

	                      if (arr_area_no_path[mst] != "") {
	             
	                          if (str_disp == "") {
	                              
	                              var pinDispSeq = eval("pin.NO"+arr_area_no_path[mst]);
	                              str_disp = pinDispSeq.zf(3) ;
	                              
	                          } else {
	                              var pinDispSeq = eval("pin.NO"+arr_area_no_path[mst]);
	                              str_disp =  str_disp+ ";"+ pinDispSeq.zf(3);
	                          }
	                      }
	                 }
	                  
	                 areaConrGrid.SetValue({row:idx , id:"ON_DEPTH_DISP_NUM_STR" ,value:str_disp});
	            }
	            
	        });
	        
	        if(chkVaild){
	        	
		        if (msgConfirm("S")) {
		            //저장하기 
		            areaConrGrid.DoSave({
		                 action:paramPin.action,
		                 cud:["C", "U", "D"],
		                 params:paramPin.params
		             });
		        
		        }
	        }
	    };
	    
		//위로 이동  
		$("#moveUpConrBtn").click(function () {
		
		     var rows = areaConrGrid.MoveRow({       //현재 선택 Row를 위/아래로 이동               
		         direction: 'U'
		     });
		     //rows[0] 이동된 위치, rows[1] 이넘으로 인해서 이동된 넘의 위치
		     
		     if(rows != null ){
		         
		         var org_disp_seq =  parseInt(areaConrGrid.GetValue({row:rows[0] ,  id:"DISP_SEQ"}));
		         var chg_disp_seq =  parseInt(areaConrGrid.GetValue({row:rows[1] ,  id:"DISP_SEQ"}));
		         
		         if(org_disp_seq == chg_disp_seq){
		             
		             org_disp_seq++;
		         }
		         
		        if(org_disp_seq < chg_disp_seq){
		             
		            //전시 순번 바꾸기 
		            areaConrGrid.SetValue({row:rows[0] , id:"DISP_SEQ" , value:org_disp_seq});
		            areaConrGrid.SetValue({row:rows[1] , id:"DISP_SEQ" , value:chg_disp_seq});
		            
		         }else{
		             
		            //전시 순번 바꾸기 
		            areaConrGrid.SetValue({row:rows[0] , id:"DISP_SEQ" , value:chg_disp_seq});
		            areaConrGrid.SetValue({row:rows[1] , id:"DISP_SEQ" , value:org_disp_seq});
		             
		         }
		     }
		 });
		 
		 //아래로 이동
		 $("#moveDownConrBtn").click(function () {
		     
		     var rows = areaConrGrid.MoveRow({       //현재 선택 Row를 위/아래로 이동               
		         direction: 'D'
		     });
		     //rows[0] 이동된 위치, rows[1] 이넘으로 인해서 이동된 넘의 위치
		     
		     if(rows != null ){
		     
		         var org_disp_seq =  parseInt(areaConrGrid.GetValue({row:rows[0] ,  id:"DISP_SEQ"}));
		         var chg_disp_seq =  parseInt(areaConrGrid.GetValue({row:rows[1] ,  id:"DISP_SEQ"}));
		       
		         if(org_disp_seq == chg_disp_seq){
		             
		             chg_disp_seq++;
		         }
		         
		         if(org_disp_seq < chg_disp_seq){
		             
		            //전시 순번 바꾸기 
		            areaConrGrid.SetValue({row:rows[0] , id:"DISP_SEQ" , value:chg_disp_seq});
		            areaConrGrid.SetValue({row:rows[1] , id:"DISP_SEQ" , value:org_disp_seq});
		            
		         }else{
		             
		             //전시 순번 바꾸기 
		             areaConrGrid.SetValue({row:rows[0] , id:"DISP_SEQ" , value:org_disp_seq});
		             areaConrGrid.SetValue({row:rows[1] , id:"DISP_SEQ" , value:chg_disp_seq});
		             
		         }
		     }
		     
		 });
		 
		 /* 카테고리의 전체 view 생성하기 */
		 fnInsFullDsCtgAreaConrView	 = function (p_disp_ctg_no , p_shop_type_disp_ctg_no) {
			
	    	var count = areaConrGrid.GetRowCount();
	        
	        //필수 입력 사항 체크 하기 
	        if(count <= 0 ){
	            alert('데이타가 존재 하지 않습니다.');
	            return;
	        }
		        
			if (msgConfirm("C")) {
				
				 var vparam = {disp_ctg_no:p_disp_ctg_no,shop_type_disp_ctg_no:p_shop_type_disp_ctg_no};
				
		         $.ajax({url:"/disp/templconr/insertDsCtgAreaConrViewList.action", 
	                 dataType: "json",
	                 data: vparam,
	                 success : function(data){
	                	 msgSuccess("C");
	                 },
	                 error: function(p) {
	                     if(p.error_type == "kr.co.overpass.exception.UserException") {
	                         window.alert(p.error_message);              
	                     }else{
	                         alert('전시카테고리코너스탁뷰 생성 중 오류가 발생하였습니다222');
	                     }
	                 }
	            });
			}
		};
			
		/* 카테고리 영역의 그룹 view 생성하기 */
		fnInsDsCtgAreaConrView = function (p_disp_ctg_no , p_shop_type_disp_ctg_no ) {
            
        	var count = areaConrGrid.GetRowCount();
	        
	        //필수 입력 사항 체크 하기 
	        if(count <= 0 ){
	            alert('데이타가 존재 하지 않습니다.');
	            return;
	        }
	        
	        var row = areaConrGrid.GetRow();
	        //필수 입력 사항 체크 하기 
	        if(row["AREA_NO"] == ""){
	            alert('영역번호가 존재 하지 않습니다.');
	            return;
	        }
	        
	        if(row["CONR_STOCK_GRP_NO"] == ""){
	            alert('코너스탁그룹명을 선택해 주세요.');
	            return;
	        }
	        
        	if (msgConfirm("C")) {
        		
        		var vparam = {disp_ctg_no:p_disp_ctg_no,
        				      shop_type_disp_ctg_no:p_shop_type_disp_ctg_no,
        				      area_no:row["AREA_NO"],
        				      conr_stock_grp_no:row["CONR_STOCK_GRP_NO"]
        				      };
        		
	            $.ajax({url:"/disp/templconr/insertDsCtgAreaConrViewList.action", 
	                dataType: "json",
	                data: vparam,
	                success : function(data){
	                	msgSuccess("C");
	                },
	                error: function(p) {
	                    if(p.error_type == "kr.co.overpass.exception.UserException") {
	                        window.alert(p.error_message);              
	                    }else{
	                    	alert('전시카테고리코너스탁뷰 생성 중 오류가 발생하였습니다222');
	                    }
	                }
	             });
             }
         };
	   
	      //코너 셋트 구성 GRID 
	     var conrSetGrid = $("#conrSetDivGrid").createGrid({
	          columns : [
	              { header:"LEVEL",               id:"LEV", type:"L" },    //레벨로 사용할 컬럼은 type을 "L"로 지정                              
	              { header:"코너명",              id:"CONR_NM",            width:80,  editable:false },       
	              { header:"코너세트명",          id:"CONR_SET_NM",        width:80,  editable:false, underline:true},
	              { header:"구성명",              id:"CONR_SET_CMPS_NM",   width:80,  editable:true},
	              { header:"코너스탁",            id:"CONR_STOCK_NM",      width:80,  editable:true, type:"C"},
	              { header:"전시시작일",          id:"DISP_START_DTIME",   width:150, editable:true, type:"D", calendar: { sdate: "DISP_START_DTIME", edate: "DISP_END_DTIME", hour: true, minute: true }},
	              { header:"전시종료일",          id:"DISP_END_DTIME",     width:150, editable:true, type:"D", calendar: { sdate: "DISP_START_DTIME", edate: "DISP_END_DTIME", hour: true, minute: true }},
	              { header:"전시순서",            id:"DISP_SEQ",           width:50,  editable:true, type:"N", align:'right',  maxlength:3},
	              { header:"전시여부",            id:"DISP_YN",            width:50,  editable:true, type:"B", align:'center', checkbox:false},
	              { header:"매체",         		  id:"CHNL_CD",            width:80,  align:'center',  type:"C", combo:{ action:"/system/code/searchStCommCdDtlList.action", cd:"comm_dtl_cd", name:"cd_nm",params:{comm_cd:ST_CHNL_CD, grp_cd1:DEF_BOOLEAN_TRUE}}},
	              { id:"CONR_SET_CMPS_NO",       type: "H"}, 
	              { id:"UPPER_CONR_SET_CMPS_NO", type: "H"},
	              { id:"CONR_STOCK_NO",         type: "H"}, 
	              { id:"CONR_NO",               type: "H"},
	              { id:"DEPTH_NO",              type: "H"},
	              { id:"CONR_SET_NO",           type: "H"},
	              { id:"LEAF_YN",               type: "H"},
	              { id:"DISP_CTG_NO",           type: "H"},
	              { id:"AREA_NO",               type: "H"},
	              { id:"CONR_STOCK_GRP_NO",     type: "H"},
	              { id:"SHOP_TYPE_DISP_CTG_NO", type: "H"},
	              { id:"CONT_DISP_YN",          type: "H"},
	              { id:"TMP_UPPER_CONR_SET_NO",  type: "H"},
	              { id:"TMP_UPPER_CONR_SET_CMPS_NO", type: "H"}
	          ],
	          properties:{
	              height:$("#conrSetDivGrid").height(),
	              sort:false,
	              checkbox:true
	          },           
	          events : {              

	        	  RowChanged: function(row1, row2) {
	            	  //코너세트의 컨텐츠를 선택했다면! 하위조회
	                  if((row1["LEAF_YN"] == DEF_BOOLEAN_TRUE && row1["CONT_DISP_YN"] == DEF_BOOLEAN_TRUE ) || (row1["LEAF_YN"] == DEF_BOOLEAN_FALSE)){
	                	 
	                	 if($("li[id^=info2_tab]").length > 1){
	                    	 fnSearchConSetCmpList();
	                     }else{
	                    	 fnSearchConSetCmpList({tab_cnt : 1});
	                     }
	                	  
	                  } else {
	                	  $('#info2_cont0').html("");
	                  }
	                  
	                  if(row1["LEV"] == 1 && row1["CONR_NM"] != ""){
	                	  $("#slt_conr").html(row1["CONR_NM"]);
	                  }else if(row1["LEV"] > 1 && row1["CONR_SET_NM"] != ""){
	                	  //$("#slt_conr_set").html($("#slt_conr").text()+ " > " + row1["CONR_SET_NM"]);
	                	  $("#slt_conr_set").html(row1["CONR_SET_NM"]);
	                  }
	              },
	              RowAdded: function(row) {
	            	  if(row["LEV"] == 1 && row.Index == 0){
	            		  $("#slt_conr").html(row["CONR_NM"]);
	            	  }
	            	  
	              },
	              ChangeCell : function(cell) {
	                  
	                  if(cell.Id == "CONR_STOCK_NM"){
	                      
	                      conrSetGrid.SetValue({row:cell.Row , id:"CONR_STOCK_NO" , value:cell.Value});
	                      
	                  }
	              },
	              BeginEdit: function(cell) {
	                  
	                    var conrSetRow = conrSetGrid.GetRow({row:cell.Row}); 
	                    
                        if(cell.Id == "CONR_STOCK_NM"){
                            
                            var row = areaConrGrid.GetRow({}); 
                            
                            conrSetGrid.CreateCombo({ row:cell.Row,
                                id:"CONR_STOCK_NM",
                                combo: { action:"/disp/templmstconr/searchConrStockComboList.action",
                                cd:"conr_stock_no", 
                                name:"conr_stock_nm", 
                                params:{ conr_stock_grp_no:row["CONR_STOCK_GRP_NO"] }}
                             });
                            
                        }
	              }
	          }
	      });
	          
	     
	     fntest = function(){
	    	 var cRow = conrSetGrid.GetRow({row:0}); $('#slt_conr').html(cRow['CONR_NM']);
	     };
	     $("#searchConrSetBtn").click(function(){
	    	 fntest();
	     });
	          
	      //구성조회 
	      fnSearchConrSetGrid = function(){
	          
	           var row = areaConrGrid.GetRow({});
	           conrSetGrid.DoQuery({
	               action:"/disp/templmstconr/searchDsCtgAreaConrSetList.action",
	               params:{area_no:row["AREA_NO"],
	                       conr_stock_grp_no:row["CONR_STOCK_GRP_NO"],
	                       shop_type_disp_ctg_no:row["SHOP_TYPE_DISP_CTG_NO"],
	                       disp_ctg_no:$('#disp_ctg_no').val()}
	           });
	           
	       }; 
	     
	     
	       //구성추가
	       $("#addConrSetBtn").click(function () {

        	  var row = conrSetGrid.GetRow({});
	     	  if(!row){
	     		  alert("코너 구성을 클릭하여 구성을 추가해 주세요.");
	     		  return ;
	     	  }
	     	  //해당 구성을 추가 할 수 있다. 
	     	  var vConrSetNo = row["CONR_SET_NO"];
	          $.post("/disp/templmstconr/getDsConrSetInfoList.action", 
	 	    		{conr_set_no:vConrSetNo},
	 	            function(data){
	 	    			var addRow ; //추가하는 row정보 
	 	    			var chkRow ;
	 	    		    var grpRowInfo = {};
	 	    		    grpRowInfo["depth_no_"+row["DEPTH_NO"]] = row.Index; //그룹의 rowIndex를 알기 위해서
	 	    		   
	 	                //option을 생성한다.
	 	                $.each(data , function (sub , optionData){
	 	                	
	 	                	//최상위 레벨인 경우 
	 	                	if(optionData["depth_no"] == row["DEPTH_NO"]){ //1레벨
	 	                	    conrSetGrid.SelectRow({row:row.Index});
	 	                	} else if (optionData["leaf_yn"] == DEF_BOOLEAN_FALSE){ //2레벨
	 	                	    conrSetGrid.SelectRow({row:grpRowInfo["depth_no_"+optionData["DEPTH_NO"]]});
	 	                	}
	 	                	
	 	                	chkRow = conrSetGrid.GetRow({});
	 	                	
	 	                	//코너세트번호가 동일하거나 depth_no가 동일하다면 동일레벨 추가로 처리 
	 	                	if(optionData["conr_set_no"] == vConrSetNo ) {
	 	                		
							 	 addRow = conrSetGrid.AddRow( {
								    data:{
									     CONR_SET_NM:optionData["conr_set_nm"],
										 CONR_SET_NO:optionData["conr_set_no"],
										 DISP_YN:DEF_BOOLEAN_TRUE,
										 DEPTH_NO:optionData["depth_no"],
										 LEAF_YN:optionData["leaf_yn"],
										 CONR_NO:optionData["conr_no"],
										 DISP_SEQ:optionData["disp_seq"],
										 TMP_UPPER_CONR_SET_NO:optionData["upper_conr_set_no"], 
										 TMP_UPPER_CONR_SET_CMPS_NO:row["UPPER_CONR_SET_CMPS_NO"]
									  },
								    sibling: true
								});
							 	
	 	                   } else if((addRow && addRow["DEPTH_NO"] == optionData["depth_no"]) 
	 	                			|| (chkRow && chkRow["DEPTH_NO"] == optionData["depth_no"])){	 	
	 	                	   
	 	             	 	    addRow = conrSetGrid.AddRow( {
								    data:{
									     CONR_SET_NM:optionData["conr_set_nm"],
										 CONR_SET_NO:optionData["conr_set_no"],
										 DISP_YN:DEF_BOOLEAN_TRUE,
										 DEPTH_NO:optionData["depth_no"],
										 LEAF_YN:optionData["leaf_yn"],
										 CONR_NO:optionData["conr_no"],
										 DISP_SEQ:optionData["disp_seq"],
										 TMP_UPPER_CONR_SET_NO:optionData["upper_conr_set_no"]
									  },
								    sibling: true
								});
	 	             	 	 
	 	                   } else {
	 	                	   addRow =  conrSetGrid.AddRow( {
								    data:{
									     CONR_SET_NM:optionData["conr_set_nm"],
										 CONR_SET_NO:optionData["conr_set_no"],
										 DISP_YN:DEF_BOOLEAN_TRUE,
										 DEPTH_NO:optionData["depth_no"],
										 LEAF_YN:optionData["leaf_yn"],
										 CONR_NO:optionData["conr_no"],
										 DISP_SEQ:optionData["disp_seq"],
										 TMP_UPPER_CONR_SET_NO:optionData["upper_conr_set_no"]
									  },
								    sibling: false
								});
	 	                	 
	 	                   }
	 	                
	 	       		 	    //그룹인 경우만 그룹의 index를 받는다. 
						 	if (optionData["leaf_yn"] == DEF_BOOLEAN_FALSE){
						 	    grpRowInfo["depth_no_"+optionData["DEPTH_NO"]] = addRow.Index; //그룹의 rowIndex를 알기 위해서
						 	}
						 	
	 	                });
	 	            }, 
	 	       "json");
	       });
	       
	      //구성삭제
	      $("#deleteConrSetBtn").click(function () {
	    	  //상위만 삭제시 하위도 삭제처리
	    	  var rows = conrSetGrid.GetRows();
	    	  var conrSetNo = "";
	    	  
	    	  $.each(rows, function(idx, row ) {
	    		  if(row.Checked && row.CRUD == "C" && row["LEAF_YN"] == DEF_BOOLEAN_FALSE){
	    			  conrSetNo = row["CONR_SET_NO"];
	    		  }
	    		  //하위도 같이 선택 처리한다
	        	  if(!row.Checked && row.CRUD == "C" && row["LEAF_YN"] == DEF_BOOLEAN_TRUE){
	        		  if(conrSetNo != "" && conrSetNo == row["TMP_UPPER_CONR_SET_NO"]){
	        			  conrSetGrid.CheckRow({
	                          row: idx,
		      				  checked: true
		      			  });
	        	  	  }
	        	  }
	          });
	          
	          conrSetGrid.DeleteCreateRows();
	      });
	      
	      
	      //구성저장
	      $("#saveConrSetBtn").click(function () {
	          
	          //필수 입력 사항 체크 하기 
	          var count = conrSetGrid.GetRowCount();
	          
	          if(count <= 0 ){
	              alert('데이타가 존재 하지 않습니다.');
	              return;
	          }
	          
	          
	          var rows = conrSetGrid.GetRows();
	          var valild = true;
	          $.each(rows, function(idx, row ) {
	        	  
	        	  if(!valild){
	        		  return;
	        	  }
	    		   
	        	  if(row["DEPTH_NO"] >= 1){
	        		  
	        		  if(row["CONR_STOCK_NM"] == ""){
	        			  
	        			  conrSetGrid.SelectCell({
	                           row: idx,
	                           id: "CONR_STOCK_NM"
	                       });
	                       
	        			  valild = false;
	        			  alert("코너 스탁을 선택해 주세요");
	        			  return;
	        			  
	        		  }
	        		  
                      if(row["DISP_START_DTIME"] == ""){
                    	  
	        			  conrSetGrid.SelectCell({
	                           row: idx,
	                           id: "DISP_START_DTIME"
	                       });
	        			  valild = false;
                    	  alert("전시시작일을 선택해 주세요");
	        			  return;
	        			  
	        		  }
  
                      if(row["DISP_END_DTIME"] == ""){
                    	  
	        			  conrSetGrid.SelectCell({
	                           row: idx,
	                           id: "DISP_END_DTIME"
	                       });
	        			  valild = false;
                    	  alert("전시종료일을 선택해 주세요")
	        			  return;
	        			  
	        		  }
	        		  
	        	  }
	    	   });
	          
	          if(!valild){
        		  return;
        	  }
	          
	          if(msgConfirm('S')){
	        	  
		          var row = areaConrGrid.GetRow({});
		          conrSetGrid.DoSave({
		              action:"/disp/templmstconr/registDsCtgAreaConrSetList.action",
		              cud:["C", "U", "D"],
		              params:{conr_stock_grp_no:row["CONR_STOCK_GRP_NO"],
		                      area_no:row["AREA_NO"],
		                      shop_type_disp_ctg_no:row["SHOP_TYPE_DISP_CTG_NO"],
		                      disp_ctg_no:$('#disp_ctg_no').val()}
		          });
	          }
	      });
		
	      
	      //구성에 대한 코드 data 조회하기 
	      fnSearchConSetCmpList = function(pin){
	    	  
	    	  var row =  conrSetGrid.GetRow({});
	    	  if (!row) {
	    		  alert('코너세트구성을 선택해 주세요');
	    		  return;
	    	  }
	    	  
	    	  //파라미터 셋팅 값 필요
	    	  var vDefParams = {
	    			            disp_ctg_no:"",
	    			            area_no:"", 
	    			            shop_type_disp_ctg_no:"",
	    			            conr_stock_grp_no:"",
	    			            leaf_yn:"",
	    			            conr_set_cmps_no:"",
	    			            cont_height:$('#info2_cont0').attr("conr_width")
	    			            };
	    	  
	    	  $.each(vDefParams, function(name, value) {
	    		  if(row[name.toUpperCase()]){
	    			  vDefParams[name] = row[name.toUpperCase()];
	    		  }
	          });
	    	  
	    	  console.dir(pin);
	    	  //구성은 첫번째 tab입니다.!!
	    	  if(typeof(pin) == "undefined"){
	    		  fnTabConSetCmp(2, 'info2_tab', 0, 'info2_cont');
	    	  }
	    	  fnSetConrCond(vDefParams);
	    	  
	    	  $('#info2_cont0').html("");
	    	  $('#info2_cont0').load('/disp/templmstconr/initConrContMgmt.action',vDefParams);
	          
	      };
		       
	      
	      //마케팅, Data Tab
	      fnTabConSetCmp = function (length , tabnm , tabIdx , objNm ){

	    	  //마케팅 조건 선택 시에는 코너가 필수로 선택 되어야 한다.
	    	  if(tabIdx == 1){
	    		  
	              if( typeof(vParamPin["conr_conts_no"])  == "undefined"  || vParamPin["conr_conts_no"] == ""  ){
	                  alert('마케팅 조건을 선택 할 코너 DATA를 선택 해 주세요');            
	                  return;
	              }
	              //탭을 활성화 한다.
	              fnTab(length, tabnm, tabIdx, objNm);

	              //마케팅조건 기본 검색 하기 
	              searchConrCondBase();
	              
	              //마케팅조건 기본 data, 상품, 회원 검색 하기
	              searchConrCondData(0);
	    		 
	             
	             }else{
	            	 
	    		    fnTab(length, tabnm, tabIdx, objNm);
	             }
	    	  
	      };
	      
	      //마케팅 조건 코너data,상품 조회
	      searchConrCondData = function(tabNO){
	    	  vParamPin["tabIdx"] = tabNO;  //탭번호 생성처리
	    	  
	    	  $('#conrContCondDiv').html("");
	          $('#conrContCondDiv').load('/disp/templmstconr/initConrContCond.action',vParamPin);
	      };
	      
	      //마케팅조건 기본 데이터를 조회한다.
	      searchConrCondBase =  function (){
	    	  
	    	  /*
	    	    conrCondBase GRID가 처음에 로딩시에 style="display:none" 상태에서는 생성을 못하고
	    	    처음 노출 될때 생성되기에 생성될때는 Initialize 에서 검색 하게 하고 
	    	    그 다음부터는 해당 기본 펑션으로 조회 하게 처리 한다.
	    	  */  
	    	  if(conrCondBaseCont > 0){
	    		  
		    	  conrCondBase.DoQuery({
		    		  action:"/disp/templmstconr/searchDsConrConts.action",
		              params:vParamPin
		              
		          });
	    	  }
	    	  conrCondBaseCont++;
	      };
	      
	      //코너마케팅 기준등록 데이타 그리드 생성
	      var conrCondBase = $("#conrCondGrid").createGrid({
	          columns : [
					{ header:"순번",         id:"SEQ",                      width:80, align:'center'},       
					{ header:"파일PATH",     id:"INPUT_CONTS1",             width:100},
					{ header:"파일명",       id:"INPUT_CONTS2",             width:100},
					{ header:"TEXT",         id:"INPUT_CONTS1_TEXT",        width:100},
					{ header:"TEXT2",        id:"INPUT_CONTS2_TEXT",        width:100},    
					{ header:"배너번호",     id:"REL_CONTS_NO1_BANNER_NO",     width:100, align:'center'},
					{ header:"배너명",       id:"REL_CONTS_NO1_BANNER_NM",  width:100},
					{ header:"상품번호",     id:"REL_CONTS_NO1_GOODS_NO",        width:100, align:'center'},
					{ header:"상품명",       id:"REL_CONTS_NO1_GOODS_NM",     width:100},
					{ header:"전시번호",     id:"REL_CONTS_NO1_DISPCTG_NO",     width:100, align:'center'},
					{ header:"전시명",       id:"REL_CONTS_NO1_DISPCTG_NM",  width:100},
					{ header:"기획전번호",   id:"REL_CONTS_NO1_SHOP_NO",        width:100, align:'center'},
					{ header:"기획전명",     id:"REL_CONTS_NO1_SHOP_NM",     width:100},
			        { header:"브랜드번호",   id:"REL_CONTS_NO1_BRAND_NO",        width:100, align:'center'},
	                { header:"브랜드명",     id:"REL_CONTS_NO1_BRAND_NM",     width:100},				
					{ header:"전시시작일",   id:"DISP_START_DTIME",          width:150 , type:"D"}, 
					{ header:"전시종료일",   id:"DISP_END_DTIME",            width:150 , type:"D"},
					{ header:"전시순서",     id:"DISP_SEQ",                  width:70, align:'right'},
					{ header:"전시여부",     id:"DISP_YN",                   width:60, type:"B", align:'center'},
					{ header:"사용여부",     id:"USE_YN",                    width:60, type:"B", align:'center'},
					{ header:"매체",         id:"CHNL_CD",                   width:80,  align:'center',  type:"C", combo:{ action:"/system/code/searchStCommCdDtlList.action", cd:"comm_dtl_cd", name:"cd_nm",params:{comm_cd:ST_CHNL_CD, grp_cd1:DEF_BOOLEAN_TRUE}}},
	                { id:"CONTS_FORM_CD",     type: "H"}
	          ],
	          properties:{
	              height:"70px",
	              sort:false,
	              checkbox:true
	          },
	          events : {       
                  Initialize: function() {
	            	  
                	 conrCondBase.DoQuery({
	            		  action:"/disp/templmstconr/searchDsConrConts.action",
			              params:vParamPin,
	                      
	                  });
	            	  
	              },
	              EndQuery : function (result){
	                  
	                  //조회시 기본 첫번째 row로 조회 하게 처리 한다. 
	                  if(conrCondBase.GetRowCount() > 0){
	                	  
	                      var conts_form_cd =  conrCondBase.GetValue({row:0, id:"CONTS_FORM_CD"});
	                      //visible 처리 하기 
	                      setConrCondVisible(conts_form_cd);
	                  }
	              }
	          }
	      });
	      
	      //컨텐츠에 따라. 노출과 비노출 처리 하기 
	      setConrCondVisible =  function (p_conts_form_cd){
	    	  
	          conrCondBase.HideColumn({id:"INPUT_CONTS1"});
	          conrCondBase.HideColumn({id:"INPUT_CONTS2"});
	          conrCondBase.HideColumn({id:"INPUT_CONTS1_TEXT"});
	          conrCondBase.HideColumn({id:"INPUT_CONTS2_TEXT"});
	          
	          conrCondBase.HideColumn({id:"REL_CONTS_NO1_BANNER_NO"});
	          conrCondBase.HideColumn({id:"REL_CONTS_NO1_BANNER_NM"});
	          conrCondBase.HideColumn({id:"REL_CONTS_NO1_GOODS_NO"});
	          conrCondBase.HideColumn({id:"REL_CONTS_NO1_GOODS_NM"});
	          conrCondBase.HideColumn({id:"REL_CONTS_NO1_DISPCTG_NO"});
	          conrCondBase.HideColumn({id:"REL_CONTS_NO1_DISPCTG_NM"});
	          conrCondBase.HideColumn({id:"REL_CONTS_NO1_SHOP_NO"});
	          conrCondBase.HideColumn({id:"REL_CONTS_NO1_SHOP_NM"});
	          conrCondBase.HideColumn({id:"REL_CONTS_NO1_BRAND_NO"});
	          conrCondBase.HideColumn({id:"REL_CONTS_NO1_BRAND_NM"}); 
	          
	          if (p_conts_form_cd == DS_CONTS_FORM_CD_BANNER){
	              conrCondBase.ShowColumn({id:"REL_CONTS_NO1_BANNER_NO"});
	              conrCondBase.ShowColumn({id:"REL_CONTS_NO1_BANNER_NM"});
	          }else if(p_conts_form_cd == DS_CONTS_FORM_CD_TEXT){
	              conrCondBase.ShowColumn({id:"INPUT_CONTS1_TEXT"});
	              conrCondBase.ShowColumn({id:"INPUT_CONTS2_TEXT"});              
	          }else if(p_conts_form_cd == DS_CONTS_FORM_CD_SHOP){
	              conrCondBase.ShowColumn({id:"REL_CONTS_NO1_SHOP_NO"});
	              conrCondBase.ShowColumn({id:"REL_CONTS_NO1_SHOP_NM"});                  
	          }else if(p_conts_form_cd == DS_CONTS_FORM_CD_GOODS){
	              conrCondBase.ShowColumn({id:"REL_CONTS_NO1_GOODS_NO"});
	              conrCondBase.ShowColumn({id:"REL_CONTS_NO1_GOODS_NM"});                  
	          }else if(p_conts_form_cd == DS_CONTS_FORM_CD_DISPCTG){
	              conrCondBase.ShowColumn({id:"REL_CONTS_NO1_DISPCTG_NO"});
	              conrCondBase.ShowColumn({id:"REL_CONTS_NO1_DISPCTG_NM"});                   
	          }else if(p_conts_form_cd == DS_CONTS_FORM_CD_IMAGE){
	              conrCondBase.ShowColumn({id:"INPUT_CONTS1"});
	              conrCondBase.ShowColumn({id:"INPUT_CONTS2"});         
	          }else if(p_conts_form_cd == DS_CONTS_FORM_CD_BRAND){         
	        	  conrCondBase.ShowColumn({id:"REL_CONTS_NO1_BRAND_NO"});
	              conrCondBase.ShowColumn({id:"REL_CONTS_NO1_BRAND_NM"});
	          }
	      };
	      

			//영역선택 
			fnAreaSel = function(sortData){
			
				if(areaConrGrid.GetRowCount() <= 0){
			        return;
			    }
			    
			    var rows =  areaConrGrid.GetRows();
			    for(var idx=0; idx < rows.length; idx++) {
			    	
			        if(rows[idx]["AREA_NO"] == sortData.AREA_NO  && rows[idx]["CONR_STOCK_GRP_NM"] != ""  && rows[idx]["AREA_LEAF_YN"] != 'Y' ){
			   
			         areaConrGrid.SelectCell({
			            row: idx,
			            id: "CONR_STOCK_GRP_NM"
			         });
			           
			         fnSearchConrSetGrid();
			         break;
			         
			     }else if(rows[idx]["AREA_NO"] == sortData.AREA_NO && rows[idx]["AREA_LEAF_YN"] == 'N'){
			         areaConrGrid.SelectCell({
			            row: idx,
			            id: "AREA_NM"
			             });
			             
			             break;
			         }
			     }         
			};
	        
	        //영역 저장하기 
	        fnAreaSave = function(pin){

	        	if(areaConrGrid.GetRowCount() <= 0){
	                return;
	            }
	            
	            var rows =  areaConrGrid.GetRows();
	            
	            $.each(pin , function(cnt, sortData){
	                
	                 for(var idx=0; idx < rows.length; idx++) {
	                       
	                       if(rows[idx]["AREA_NO"] == sortData.AREA_NO){
	                           areaConrGrid.SetValue({row:idx , id:"DISP_SEQ" , value:sortData.DISP_SEQ});
	                           break;
	                       }
	                 }  
	            });
	      };
	      
	      
	      
	      /***************************************************************************************************/
	      /*************************  마케팅 조건 이벤트 펑션 추가 (다이나믹한 이벤트 발생을 위해 jquery  live 이벤트가 이상함 그래서 이쪽으로 이동 처리   *********************/
	      
	      
	       //객체 추가
	        $(document).on('click','button[name=addDsConrContsCond]',function() {	
	        	var obj = $(this).parent().parent();
	        	var vConts_cond_type_cd = $("[name=conts_cond_type_cd]", obj).eq(0).val();
	        	var vnewObj = $("<tr></tr>");
	        	vnewObj.load('/disp/templmstconr/initConrContCondJson.action',{conr_set_no:vParamPin["conr_set_no"],conts_cond_type_cd:vConts_cond_type_cd});
	        	vnewObj.insertAfter(obj);        // 초기화된 상태로 붙여넣기
	        	
	        });

	        //append 가 된경우는 live 이벤트로 사용해야 한다.
	        $(document).on('change','select[name=conts_cond_type_cd]',function() {	
	        	var obj = $(this).parent().parent();
	        	if($(this).attr("mst") == DEF_BOOLEAN_TRUE) {
	        		obj.load('/disp/templmstconr/initConrContCondJson.action',{conr_set_no:vParamPin["conr_set_no"],conts_cond_type_cd:$(this).val() , mst_yn:DEF_BOOLEAN_TRUE});
	        	} else {
	        		obj.load('/disp/templmstconr/initConrContCondJson.action',{conr_set_no:vParamPin["conr_set_no"],conts_cond_type_cd:$(this).val()});
	        	}
	        });
	        
	        
	        //append 가 된경우는 live 이벤트로 사용해야 한다.
	        $(document).on('click','button[name=deleteDsConrContsCond]',function() {	
	        	var obj = $(this).parent().parent();
	            var mode = $("input[name=mode]", obj).val();  

	            if(mode == "C"){
	                $(this).parent().parent().remove();
	            }else{
	                var conts_cond_seq = $("input[name=conts_cond_seq]", obj).val();
	                obj.find("input").val("");            //객체에서 input의 value를 공백으로 바꿈
	                
	                $("input[name=conts_cond_seq]", obj).val(conts_cond_seq);
	                $("input[name=mode]", obj).val("D");
	                $("input[name=use_yn]", obj).val(DEF_BOOLEAN_FALSE);
	                
	                $(this).parent().parent().hide();  //화면에서 사용여부 죽이고 숨기기!
	            }
	            
	        });
	        
	        //해당 값이 변경시 
	        $(document).on('change','input[name=apply_val1]',function() {	
	        	 fnModCheck($(this));
	        });
	        $(document).on('change','input[name=apply_val2]',function() {	
	        	 fnModCheck($(this));
	        });
	        
	        //해당 값이 변경시 
	        $(document).on('change','input[name=temp_apply_val1]',function() {	
	            fnModCheck($(this));
	        });
	        
	        //해당 값이 변경시 
	        $(document).on('change','select[name=apply_exp_divi_cd]',function() {	
	            fnModCheck($(this));
	        });
	        
	        $(document).on('change','input[name=apply_val1_chk]',function() {	
	            var obj = $(this).parent().parent();
	            var chk_apply_val_1 = $("input[name=apply_val1]", obj);
	            if($(this).is(':checked')){
	            	chk_apply_val_1.val(DEF_BOOLEAN_TRUE);
	             }else{
	                chk_apply_val_1.val(DEF_BOOLEAN_FALSE); 
	             }
	            
	            fnModCheck($(this));
	        });
	        
	        //팝업
	        $(document).on('click','button[name=popDsConrContsCond]',function() {	
	        	
	            var obj = $(this).parent().parent();
	            
	            var conts_cond_type_cd = $("select[name=conts_cond_type_cd]", obj).val();
	            var apply_val1             = $("input[name=apply_val1]", obj);
	            var temp_apply_val1        = $("input[name=temp_apply_val1]", obj);
	            var temp_apply_val1_nm     = $("input[name=temp_apply_val1_nm]", obj);
	            
	            //유형에 따라 팝업 종류가 달라진다. 
	            //MD상품군
	            if(conts_cond_type_cd == DS_CONTS_COND_TYPE_CD_MD_GOODS){
	            	
	            	fnStdGsgr1lvlListPop({
	            		callback:function(pin){
	            			apply_val1.val(pin.data[0]["STD_GSGR_NO"]);
	            			temp_apply_val1.val(pin.data[0]["STD_GSGR_NM"]);
	            			temp_apply_val1_nm.val(pin.data[0]["STD_GSGR_NM"]);
	            			
	            			 fnModCheck(apply_val1);
	                    },
	            		param:{std_gsgr_no:temp_apply_val1.val(), std_gsgr_nm:temp_apply_val1_nm.val() }
	            	});
	            //매장	
	            }else if(conts_cond_type_cd == DS_CONTS_COND_TYPE_CD_SHOP){
	            	
	            	fnDispListPop({
	                       callback:function(pin){
	                    	   apply_val1.val(pin.data[0]["DISP_CTG_NO"]);
	                    	   temp_apply_val1.val(pin.data[0]["DISP_CTG_NO"]);
	                    	   temp_apply_val1_nm.val(pin.data[0]["DISP_CTG_NM"]);
	                    	   
	                    	   fnModCheck(apply_val1);
	                       },
	                       param:{disp_ctg_no:temp_apply_val1.val(), disp_ctg_nm:temp_apply_val1_nm.val() , shop_type_cd:DS_CTG_SHOP_TYPE_CD_SHOP }
	                   });
	            //전시	
	            }else if(conts_cond_type_cd == DS_CONTS_COND_TYPE_CD_DISPCTG){
	            	
	            	fnDispTreePop({
	                    callback:function(pin){
	                    	apply_val1.val(pin.data[0]["DISP_CTG_NO"]);
	                    	temp_apply_val1.val(pin.data[0]["DISP_CTG_NO"]);
	                    	temp_apply_val1_nm.val(pin.data[0]["DISP_CTG_NM"]);
	                    	
	                    	fnModCheck(apply_val1);
	                    },
	                    param:{shop_type_cd:DS_CTG_SHOP_TYPE_CD_DISP_CTG}
	                });
	            	
	            //출고지   
	            }else if(conts_cond_type_cd ==DS_CONTS_COND_TYPE_CD_VENDER){
	            	
	            	fnLowVendListPop({
	                      callback:function(pin){
	                    	  apply_val1.val(pin.data[0]["VIR_VEND_NO"]);
	                    	  temp_apply_val1.val(pin.data[0]["LOW_VEND_NO"]);
	                    	  temp_apply_val1_nm.val(pin.data[0]["LOW_VEND_NM"]);
	                    	  
	                    	  fnModCheck(apply_val1);
	                      },
	                      param:{low_vend_no:temp_apply_val1.val(), low_vend_nm:temp_apply_val1_nm.val() }
	                  });
	            
	            //채널
	            }else if(conts_cond_type_cd == DS_CONTS_COND_TYPE_CD_CHNNEL){
	            	
	            	fnChnlListPopForForm({
	                      callback:function(pin){
	                    	  
	                    	  apply_val1.val(pin.data[0]["CHNL_NO"]);
	                          temp_apply_val1.val(pin.data[0]["CHNL_NO"]);
	                          temp_apply_val1_nm.val(pin.data[0]["CHNL_NM"]);
	                          
	                          fnModCheck(apply_val1);
	                          
	                      },
	                      param:{disp_ctg_no:temp_apply_val1.val(), disp_ctg_nm:temp_apply_val1_nm.val() }
	                  });
	            } else if(conts_cond_type_cd == DS_CONTS_COND_TYPE_CD_SITE ){
	            	fnSiteListPop({
	                    callback:function(pin){
	                        
	                        apply_val1.val(pin.data[0]["SITE_NO"]);
	                        temp_apply_val1.val(pin.data[0]["SITE_NO"]);
	                        temp_apply_val1_nm.val(pin.data[0]["SITE_NM"]);
	                        
	                        fnModCheck(apply_val1);
	                        
	                    },
	                    param:{site_no:temp_apply_val1.val(), site_nm:temp_apply_val1_nm.val() }
	                });
	            }
	           
	       });
	      
	});
    
})(jQuery);