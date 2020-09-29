(function($){
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
		} else if (browerAgent.indexOf("MSIE") != -1 || browerAgent.indexOf("rv:") != -1) {
		    browerType = "MSIE";
		}else{
		    browerType = "Opera";       
		}
		
		returnObj.type = browerType;        
	        
		var rv = -1; // Return value assumes failure.      
		var ua = navigator.userAgent;
		var re = null;
		
		if (browerType == "MSIE") {
			
			if (browerAgent.indexOf("rv:") != -1) {
			    re = new RegExp("rv:([0-9]{1,}[\.0-9]{0,})");			
			}else{
			    re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");			
			}
			
		} else {
		    re = new RegExp(browerType + "/([0-9]{1,}[\.0-9]{0,})");
		}
		if (re.exec(ua) != null) {
		    rv = parseFloat(RegExp.$1);
		}
		
		
		returnObj.version = rv;
		
		return returnObj;
	
	        
	})();
	
	var CRUD = {
		C: "C",
		R: "R",
		U: "U",
		D: "D"
	};
	
	var NODE_NAME = "_NODE_";
	
	clickSystemCheckbox = function(e,checkbox, id, rowid) {
		
		e = e || event;
		e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
		
		var g = $("#" + id)[0];
		var rdata = g.jq.getLocalRow(rowid);
		rdata["Checked"] = checkbox.checked ? "Y" : "N" ;
		
		g.CheckboxClick({ "Checked": checkbox.checked, "Row": g.getRowIndex({ rowid: rowid }) });
	};
	
	//데이타 cell의 체크박스 클릭시...
	clickCheckbox = function(e,checkbox, id) {
		var $g = $("#" + id);
		var g = $g[0];
		var chk = $(checkbox);
		var rowid = chk.attr("rowid");		//this.rowid와 같이 사용하면 ie에서만 값을 가져온다.
		var cid = chk.attr("name");
		
		//일단 편집여부를 먼저 확인하자...
		var editable = g.getEditable(rowid, cid); 
		if (!editable) {
			checkbox.checked = checkbox.checked ? false : true ;
			return false;
		};
		g.o.SetValue({
			rowid: rowid, 
			id: cid, 
			value: checkbox.checked ? "Y" : "N"
		});
		
		var dataitem = g.jq.getLocalRow(rowid);
		var cell_value = dataitem[cid];
		var pre_value = dataitem["_PRE_" + cid];
		var org_value = dataitem["_ORG_" + cid];

		//이걸 안해주면 document.click까지 이벤트가 전달되어서... 레이어 같은것이 바로 사라지기 때문에...
		var e = e || window.event;
		e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
		
		//현재cell의 위치
		var $td = $g.find("td[aria-describedby="+id+"_"+cid+"]");
		var position = $td.offset();

		g.o.events.CellClick({
			Id: cid,
			Row: g.getRowIndex({ rowid: rowid }),					
			Value: cell_value,
			Text: cell_value,
			PreValue: pre_value,
			OrgValue: org_value,
			Left: position.left,
			Top: position.top,
			Right: (position.left + $td[0].clientWidth),
			Bottom: (position.top + $td[0].clientHeight),
			isGroup: dataitem.isGroup ? true : false,
			isTotal: dataitem.isTotal ? true : false
		});
		
	};
	
	clickSystemHeaderCheckbox = function(e, checkbox, id) {
		e = e || event;
		e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
		var g = $("#" + id)[0];		
		var ids = g.jq.getDataIDs();
		var length = ids.length;
		for (var i = 0 ; i < length ; i++) {
    		g.o.CheckRow({
    			row: i, checked: checkbox.checked    			
    		});
		};
	};
	
	clickCellButton = function(e, id, rowid, colid) {
		e = e || event;
		e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
		var g = $("#" + id)[0];
		var row = g.jq.getInd(rowid) - 1;	//실제 테이블내의 로우순번
		var cell = g.o.GetCell({
			row: row,
			id: colid			
		});
		g.o.events.ButtonClick(cell);
	};
	
	clickDeleteFileButton = function(e, id, rowid, colid) {
		e = e || event;
		e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
		var g = $("#" + id)[0];
		var row = g.jq.getInd(rowid) - 1;	//실제 테이블내의 로우순번
		var cell = g.o.GetCell({
			row: row,
			id: colid			
		});

		delete g.o.uploads.cellupload[rowid + "_" + colid];
		delete g.o.uploads.celluploadfiles[rowid + "_" + colid];

		g.o.SetValue({
			row : row,
			id : colid,
			value : cell["OrgValue"] || "",
			filename : cell["OrgFileValue"]
		});
	};
	
	
	clickUploadButton = function(e, id, rowid, colid) {
		e = e || event;
		e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
		var g = $("#" + id)[0];
		var row = g.jq.getInd(rowid) - 1;	//실제 테이블내의 로우순번

		$inputFile = $(e.currentTarget).find("input[type=file]");
		if(!e.currentTarget){
			return;
		}
		
		$inputFile.off("change");
		$inputFile.on("change",function(e) {
		
			e = e || event;
			e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
			
			var name = new Date().getTime() +"";
	
			this.name = name;
											
			g.o.uploads.cellupload[row + "_" + colid] = {
				value : this.value,
				name : name
			};
			
			g.o.uploads.celluploadfiles[row + "_" + colid] = this;
			
			g.o.SetValue({
				row : row,
				id : colid,
				value : name,
				filename : Util.getFileName(this.value)
			});
			
		});
		
		$inputFile.trigger("click");
	};
	
	var parseUrlParameter = function (url) {
		var regex = /[?&]?([^=#]+)=([^&#]*)/g,
			params = {},
			match;
			while(match = regex.exec(url)) {
				params[match[1]] = match[2];
			}
		return params;
	 };

    var crossAjax  = function(p,callback){
        
        var isUpload = false;
        
        //업로드 여부 체크.
        for ( var key in p.celluploadfiles) {
                isUpload = true;
                break;
        }
        
        //formdata 없을 경우
        if(Browser.type == "MSIE" && Browser.version < 10 && isUpload){

            var formParams = parseUrlParameter(p.querystring);
            
            var form = "";
            form += "<form id=\"flexgrid-upload-form\" content-type='multipart/form-data' method='POST' action=\""+p.action+"\" enctype='multipart/form-data'  target=\"flexgrid-upload-iframe\">                                                                                                                                                                            \n";
            for ( var fp in formParams) {
                   form += "<input type='hidden' name='"+fp+"' value='"+formParams[fp]+"' />                                           \n";
            }
            form += "<input type='hidden' name='_AJAX_' value='Y' />                                                                                                       \n";
            form += "</form>                                                                                                                                                                                     \n";
            
            var iframe = "";

            iframe += "<iframe id=\"flexgrid-upload-iframe\" src=\"about:blank\" name=\"flexgrid-upload-iframe\" style=\"display:none;visibility:hidden\"></iframe>\n";
            
            var $form = $(form);                  
            var $iframe = $(iframe);

     
			$iframe.bind("load",function(e){
			  
				var resultStr = $(this).contents().find("body").html();
            	var tmpjsonRtn = null;
            	if(resultStr != ""){
            		
            		try {
                    	tmpjsonRtn = JSON.parse($(this).contents().find("body").html());
					} catch (e) {
						alert("JSON 객체로 변환 중  에러 발생 - JSON 형식의 문자열이 아닙니다.  [ grid id : "+p.div_id+" ] ");						
						console.log("error crossAjax(iframe) function [ grid id : "+p.div_id+" ] ");						
						console.log(e);	
						
                		$iframe.remove();
                    	$form.remove();
						return;
					}
				
					jsonRtn = tmpjsonRtn;
				
					try {
						if(callback && typeof(callback) == "function"){
							callback(jsonRtn);
							$iframe.unbind("load");
							$iframe.remove();
							$form.remove();
						}                                                                   
					           
					} catch (e) {
						
						if(jqXHR.responseText === undefined){
							alert("데이터 처리 중  에러 발생  [ grid id : "+p.div_id+" ] ");						
						}
						console.log("error crossAjax(iframe) function [ grid id : "+p.div_id+" ] ");						
						console.log(e);	
						
						$iframe.remove();
						$form.remove();
					}      
				}
			
			                           
			});
     
			$iframe.bind("error",function(){                            
				alert("서버와 연결이 제대로 이루어지지 않습니다.");
				$iframe.unbind("error");
				$iframe.remove();
				$form.remove();
			});
                
            $form.appendTo("body");
            $iframe.appendTo("body");
            
            for ( var file in p.celluploadfiles) {
               $form.append(p.celluploadfiles[file]);       
               delete p.celluploadfiles[file]; //업로드를 제외한 조회할 경우에는 $.ajax를 실행하기 위하여 첨부파일 객체를 날려준다.
            }
    
            $form[0].submit();

        }else{
            console.log("p.isFormData=>"+p.isFormData)
			$.ajax({
				url : p.action,
				type : "POST",
				data : (p.isFormData) ? p.formData : p.querystring,
				async : p.dataAsync || true,
				timeout: 30000,
				processData : false,
				dataType : "json",
				contentType: (p.isFormData) ? false : "application/x-www-form-urlencoded;charset=utf-8",
				success : function(data) {       
					callback(data);                                                      
				},
				error : function(jqXHR, textStatus, errorThrown) {
					if(jqXHR.responseText === undefined){
						alert("서버와 통신 중 에러 발생  [ grid id : "+p.div_id+" ] ");						
					}
					console.log("error crossAjax function [ grid id : "+p.div_id+" ] ");						
					console.log(errorThrown);		
				}
			});     
                               
        }
    }                      
    
	OVERPASS.GRID.JQGRID.util = {

		getFileName : function(val){
		    var tmpStr = val;
		    
		    var cnt = 0;
		    while(true){
		        cnt = tmpStr.indexOf("/");
		        if(cnt == -1) break;
		        tmpStr = tmpStr.substring(cnt+1);
		    }
		    while(true){
		        cnt = tmpStr.indexOf("\\");
		        if(cnt == -1) break;
		        tmpStr = tmpStr.substring(cnt+1);
		    }
		    
		    return tmpStr;
		}

	};
	
	// alias 모음. grid 네임스페이스를 약어로 축약 한다.
	var Util = OVERPASS.GRID.JQGRID.util;

	OVERPASS.GRID.JQGRID.excel = {

		/**
		 * 엑셀파일에 담긴 내용을 Flexgrid에 입력한다.
		 */
		importExcel : function(g, pin, $contextLayer, files,columns,columnsName) {


			var X = XLSX;
			var rABS = typeof FileReader !== "undefined" && typeof FileReader.prototype !== "undefined" && typeof FileReader.prototype.readAsBinaryString !== "undefined";
			
			var fixdata = function(data) {
				var o = "", l = 0, w = 10240;
				for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
				o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
				return o;
			}
			
			var to_json = function(workbook) {
				var result = {};
				workbook.SheetNames.forEach(function(sheetName) {
					var roa = X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
					if(roa.length > 0){
						result[sheetName] = roa;
					}
				});
				return result;
			}
			
			var to_csv = function(workbook) {
				var result = [];
				workbook.SheetNames.forEach(function(sheetName) {
					var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
					if(csv.length > 0){
						result.push(csv);
					}
				});
				return result.join("\n");
			}
			var process_wb = function(wb) {
				var output = to_json(wb);
				
				for ( var sheetKey in output) {
					var sheetLength = output[sheetKey].length;	
					var isColumn = true; //추후에 엑셀 첫번째 row에 컬럼명이 하나도 일치 하는지 하지 않는지 체크 할 때에는 false로 기본값으로 변경 해줘야 함.
					
					
					if(sheetLength > 0 ){
						var excelFirstRow = output[sheetKey][0];
						//엑셀 첫번째 row에 컬럼명이 하나도 일치 하는지 하지 않는지 체크.
//							for ( var key in excelFirstRow) {
//
//								if(Util.getColumnId(fg,key) != ""){
//									isColumn = true;
//								}
//							}
						
						if(!isColumn){
							//엑셀 첫번째 row에 컬럼명이 하나도 일치 하지 않는다면 text로 받아서 처리함.							
							process_wb_csv(wb);
							
						}else{
							for (var i = 0; i < sheetLength; i++) {
								
								var excel_org = output[sheetKey][i];
								var addRow = {};
								
								for ( var key in excel_org) {
									
									if(columns[key]){
										addRow[columns[key].id] = excel_org[key];																	
									}else if(columnsName[key]){
										addRow[columnsName[key].id] = excel_org[key];																											
									}
									
								}
								g.o.AddRow({
									position : "last",
									data : addRow
								});

							}//end for (var i = 0; i < sheetLength; i++) {	
						} //end }else{							
					}//end 	if(sheetLength > 0 ){				
				}
			}

			if (g) {
				
				g.o.ClearRows();	//데이타 초기화
				
				var isExcelImportUrl = false;
				var excelImportUrl = "";
				var gridGlobal = OVERPASS.GRID.JQGRID.global;
				
				if(gridGlobal && gridGlobal.excel_import_url && gridGlobal.excel_import_url != ""){
					isExcelImportUrl = true;
					excelImportUrl = gridGlobal.excel_import_url;
				}
				
				if(pin.properties.excel_import_url && pin.properties.excel_import_url != "" ){
					isExcelImportUrl = true;
					excelImportUrl = pin.properties.excel_import_url;
				}
				
				if(isExcelImportUrl){

					//DATA_BINDINGS
					var DATA_BINDINGS = [];
					$.each(pin.columns, function(i, column) {
						DATA_BINDINGS.push({
							ID: column.binding,
							TYPE: column.type
						});
					});
					
					var querystring = null;
	
					
	                var isFormData = false;
	                var formData = null;
	                var celluploadfiles = {};
	                
                    var file_id = Math.round(Math.random() * 100000);
                    files.name = file_id;
                    celluploadfiles[file_id] = files;

	                if((Browser.type == "MSIE" && Browser.version >= 10) || Browser.type != "MSIE"){

	                	isFormData = true;
	                    
	                    formData = new FormData();
	                    formData.append(file_id,files.files[0]);  
	                    formData.append("file_id",file_id);  
	                }
	
	                if(isFormData){                       
	    				formData.append("DATA_BINDINGS",JSON.stringify(DATA_BINDINGS));
	    				formData.append("MOBILE_YN","Y");
	    				//formData.append("GRID_DATA","{}"); //해당 파라메터 명을 넘기면 grid data 로 인식 하여 해당 값({"MESSAGE":{"login":"Y","code":"S"}})이 붙어 나온다. 필요없으니 제거. 
	    				formData.append("_AJAX_","Y");
	                }else{
	                	querystring = "DATA_BINDINGS=" + JSON.stringify(DATA_BINDINGS) + "&MOBILE_YN=Y&_AJAX_=Y&file_id="+file_id;
	                }
					
	
	                var crosssAjaxPin = {
	                        div_id : pin.div_id,
	                        action : excelImportUrl, 
	                        querystring : querystring,
	                        formData : formData,
	                        isFormData : isFormData,
	                        celluploadfiles : celluploadfiles,
	                        dataAsync : false
	                 }
	                 
	                 crossAjax(crosssAjaxPin,function(data) {
	                	
	                	if(data != null){
	                    	
	                    	if((data instanceof Array) && data.length > 0){
	                    		var length = data.length;
	                    		for (var i = 0; i < length; i++) {
		
	            					g.o.AddRow({
	            						position : "last",
	            						data : data[i]
	            					});
								}
	                    		
	                    	}
		
	                	}
							
	                 });
				
				}else{
	
					//chrome,firefox,ie10 이상
					var reader = new FileReader();
					var f = files.files[0];
					var name = f.name;
					reader.onload = function(e) {
	
						var data = e.target.result;
						var wb;
						if(rABS) {
							wb = X.read(data, {type: 'binary'});
						} else {
							var arr = fixdata(data);
							wb = X.read(btoa(arr), {type: 'base64'});
						}
						process_wb(wb);
					};
					
					if(rABS) reader.readAsBinaryString(f);
					else reader.readAsArrayBuffer(f);					
				}
				$contextLayer.remove();
			}

		},

		/**
		 * FlexGrid내용을 엑셀 파일로 출력한다.
		 */
		exportExcel : function(g, pin, $contextLayer, anchor,columns) {
			
			var X = XLSX;

			var datenum = function(v, date1904) {
				if(date1904) v+=1462;
				var epoch = Date.parse(v);
				return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
			}
			 
			var sheet_from_array_of_arrays = function(data, opts) {
				var ws = {};
				var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
				for(var R = 0; R != data.length; ++R) {
					for(var C = 0; C != data[R].length; ++C) {
						if(range.s.r > R) range.s.r = R;
						if(range.s.c > C) range.s.c = C;
						if(range.e.r < R) range.e.r = R;
						if(range.e.c < C) range.e.c = C;
						var cell = {v: data[R][C] };
						if(cell.v == null) continue;
						var cell_ref = X.utils.encode_cell({c:C,r:R});
						
						if(typeof cell.v === 'number') cell.t = 'n';
						else if(typeof cell.v === 'boolean') cell.t = 'b';
						else if(cell.v instanceof Date) {
							cell.t = 'n'; cell.z = X.SSF._table[14];
							cell.v = datenum(cell.v);
						}
						else cell.t = 's';
						
						ws[cell_ref] = cell;
					}
				}
				if(range.s.c < 10000000) ws['!ref'] = X.utils.encode_range(range);
				return ws;
			}
			
			var s2ab = function (s) {
				var buf = new ArrayBuffer(s.length);
				var view = new Uint8Array(buf);
				for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
				return buf;
			}
			
			if(g.jq.getDataIDs().length == 0){
				$contextLayer.remove();
				return;
			}

			var data = g.o.GetRows({
				checked : false
			});
			
			var sheetsData = [];
			
			
			var colLength = pin.columns.length;
			var colIds = [];
			var colNames = [];
			
			for ( var i = 0; i < colLength ; i++) {
				if(!pin.columns[i].hidden){
					colIds.push(pin.columns[i].id);
					colNames.push(pin.columns[i].header);
				}
			}			
			
			sheetsData.push(colNames);
			
			var dataLength = data.length;
			var colIdsLength = colIds.length;
			for (var z = 0; z < dataLength ; z++) {
				
				var tmpData  = [] ;
				for (var k = 0; k < colIdsLength; k++) {
					tmpData.push(data[z][colIds[k]]);					
				}
				
				sheetsData.push(tmpData);				
			}

			var ws_name = "Sheet";
			 
			var Workbook = function () {
				if(!(this instanceof Workbook)) return new Workbook();
				this.SheetNames = [];
				this.Sheets = {};
			}
			
			var wb = new Workbook(), ws = sheet_from_array_of_arrays(sheetsData);

//			/* add worksheet to workbook */
			wb.SheetNames.push(ws_name);
			wb.Sheets[ws_name] = ws;
			
			var wbout = X.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
//			
			saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), pin.properties.excel_export_name || pin.id+".xlsx");
//			
			$contextLayer.remove();
		}
	};

	// 엑셀 변수 지정.
	var Excel = OVERPASS.GRID.JQGRID.excel;
	
	OVERPASS.GRID.JQGRID.createGrid = function (pin) {
		var GM = pin.GM;
		var div_id = pin.div_id;
		var o = { id: pin.id, div_id: div_id, events: pin.events };
		
		var grid_table = $("<table id=\"" + pin.id + "\"></table>");
		
		$("#" + div_id).append(grid_table);
		
		var g = grid_table[0];
		g["div_id"] = div_id;
		var rid = 0;
		
		//아래 오브젝트들은 DoQuery시 초기화 시켜준다.
		var combos = {};	//CreateCombo를 통해서 생성된 콤보정보 저장
		var editablerows = {}; //row별 편집여부 저장
		var editablecells = {}; //cell별 편집여부 저장
		var celltypes = {};	//cell별 데이타타입 저장
		var cellformats = {};	//cell별 format 저장
		var cellbuttons = {};	//cell별 button사용 여부
		var cellupload= {};  //셀별 파일 업로드 정보.
		var celluploadfiles= {};  //셀별 파일 업로드 정보.
		//위 오브젝트들은 DoQuery시 초기화 시켜준다.		

		var mergecolumns = [];	//머지 대상 컬럼 정보
		var merge_yn = false;
		var groupcolumns = {};
		var calculations= {};
		
		var frozen_yn = false;
		
		//colNames, colModel에 등록되어 있지 않으면 dataitem에 저장되지 않는다.
		var colNames = [];
		var colModel = [];
		var columns = {};	//column정보를 맵형태로 저장해 준다.
		var columnsName = {};	//column정보를 맵형태로 저장해 준다.
		var lastrowid = "";
		
		var string_format = function(s, args) {
			if ($.type(args) == "array") {
				for (var i = 0; i < args.length; i++) {       
					var reg = new RegExp("\\{" + i + "\\}", "gm");             
					s = s.replace(reg, args[i]);
				}
				return s;				
			} else {
				return s;
			};
		};
		
		var getEditable = function(rowid, id) {	//해당 cell에대한 편집가능 여부 판단
			var coleditable = columns[id].editable;
			var roweditable = $.type(editablerows[rowid]) == "boolean" ? editablerows[rowid] : true;
			var celleditable = $.type(editablecells[rowid + "_" + id]) == "boolean" ? editablecells[rowid + "_" + id] : true; 
			return coleditable && roweditable && celleditable ;
		};
		g.getEditable = getEditable;
		
		var formatter = function(value, format) {
			var fs = format.split("");
			var r = "";
			var i = 0;
			$.each(fs, function(x, c) {
				if (fs[x] == "#") {
					if ($.type(value[i]) != "undefined") {
						r += value[i];						
					};
					i++;
				} else {
					r += fs[x];
				};
			});
			if (i != value.length) {
				r += value.substring(i);
			};
			return r;
		};
		
		var makeNumberformat = function(format) {
			var length = 0;
			var decimal = "";
			if (format.length == 2) {
				length = format.substring(1);
				if (length > 0) {
					decimal = ".";						
				};
			};
			for (var i = 0 ; i < length ; i++) {
				decimal += "0";
			};
			return "#,###" + decimal;
		};
		
		var formatNumber = function(value, format) {
			if (value == 0) {		//0을 포맷하면 ""이 나옴...
				return value;
			};
			
			value = $.formatNumber(value, { format: format });
			
			if(value.indexOf(".") == 0){
				value = "0"+value;
			}
			
			return value;
		};
		
		//row에 해당하는 rowid를 조회
		var getRowID = function(p) {
			return grid_table.find("tr:eq(" + (p.row + 1) + ")")[0].id;
		};
		
		//rowid의 tr이 몇번째 row인지 조회
		var getRowIndex = function(p) {
			return jq.getInd(p.rowid) - 1;
		};
		
		//해당 row의 시스템 체크박스 상태 없데이트
		var updateStatus = function(p) {
			jq.setCell(p.rid, "_CHECKBOX_", p.rid);
		};
		
		//그룹 컬럼에 대한 처리....
		var group_yn = false;
		$.each(pin.groupcolumns, function(i, groupcolumn) {	//처리하기 쉽도록 배열을 객체로 변환
			group_yn = true;
			groupcolumns[groupcolumn.id] = groupcolumn;
		});
		
		//계산 컬럼에 대한 처리...
		var calculation_yn = false;
		$.each(pin.calculations, function(i, calculation) {	//처리하기 쉽도록 배열을 객체로 변환
			calculation_yn = true;
			calculation.format = makeNumberformat(calculation.format);
			calculations[calculation.id] = calculation;
		});
		
		//총계
		var total_yn = $.type(pin.grouptotal) == "object" ? true : false ;
		
		//Node
		var Node = function(level) {
			this.rowid = null;
			this.level = +level;
			this.parent = null;
			this.children = [];
			this.div = null;
			this.tr = null;
		};
		Node.prototype.findLastChild = function() {	//이웃한 노드의 제일 마지막 자식 찾기....
			var last = this;
			if (this.children.length > 0) {
				last = this.children[this.children.length - 1].findLastChild();
			};
			return last;
		};
		Node.prototype.findParent = function(count) {
			if (count >= 0) {
				if (this.parent != null) {
					return this.parent.findParent(count - 1);	
				} else {	//ROOT라는 소리임...
					return this.parent;
				};
			} else {
				return this;
			};
		};
		Node.prototype.addTR = function(tr) {		//row insert시 한번만 실행...
			if (this.tr != null) {
				return false;
			};
			this.tr = tr;
			var td = this.tr.find("td[aria-describedby='grid_" + pin.div_id + "_" + pin.properties.level_id + "']");
			this.div = $("<div/>").css({ left: (this.level - 1) * 18 }).addClass("ui-icon").addClass("treeclick");
			var node = this;
			if (this.children.length == 0) {	//ui-icon-radio-off: leaf, ui-icon-triangle-1-s: expand, ui-icon-triangle-1-e: collapse
				this.div.addClass("ui-icon-radio-off").addClass("tree-leaf");
			} else {		//expand 상태
				this.div.addClass("ui-icon-triangle-1-s").addClass("tree-minus");
			};
			td.append($("<div/>").addClass("tree-wrap").addClass("tree-wrap-ltr").css({ width: (this.level * 18) }).append(this.div));
			td.click(function() {
				node.expand();
			});
		};
		Node.prototype.append = function(n) {
			n.parent = this;
			this.children.push(n);
			if (this.div != null && this.div.hasClass("tree-leaf")) {
				this.div.removeClass("tree-leaf").removeClass("ui-icon-radio-off");
				this.div.addClass("tree-minus").addClass("ui-icon-triangle-1-s");
			};
		};
		Node.prototype.expandChild = function(b) {
			$.each(this.children, function(i, child) {
				if (b) {
					if (child.div.hasClass("tree-minus")) {
						child.expandChild(b);											
					};
					child.tr.show();
				} else {
					if (child.div.hasClass("tree-minus")) {
						child.expandChild(b);											
					};
					child.tr.hide();
				};
			});
		};
		Node.prototype.expand = function(b) {
			if ($.type(b) != "boolean") {
				if (this.div.hasClass("tree-minus")) {
					b = false;
				} else if (this.div.hasClass("tree-plus")) {
					b = true;
				} else if (this.div.hasClass("tree-leaf")) {
					return false;
				};
			};
			if (b) {
				this.div.removeClass("tree-plus").removeClass("ui-icon-triangle-1-e");
				this.div.addClass("tree-minus").addClass("ui-icon-triangle-1-s");
			} else {
				this.div.removeClass("tree-minus").removeClass("ui-icon-triangle-1-s");
				this.div.addClass("tree-plus").addClass("ui-icon-triangle-1-e");
			};
			this.expandChild(b);
		};
		
		var root_node = new Node(0);
		
		colNames.push("<input type=\"checkbox\" id=\"" + pin.id + "_system_checkbox\" onclick=\"clickSystemHeaderCheckbox(event, this, '"+ pin.id + "');\" />");
		colModel.push({		//시스템 체크 박스 
			name: "_CHECKBOX_", 
			index: "_CHECKBOX_", 
			width: 40,
			hidden: pin.properties.checkbox ? false : true,
			align: "center",
			editable: false,
			sortable: false,
			resizable: false,
			formatter: function(rowid, options, rowObject) {
				var crud = null;
				var checked = null;
				var rdata = jq.getLocalRow(rowid);
				if (rdata) {
					crud = rdata["CRUD"];
					checked = rdata["Checked"];
				} else {
					crud = rowObject["CRUD"];
					checked = rowObject["Checked"];					
				};

				var img = "";
				if (crud == CRUD.R) {
					img = "/images/grid/icon_read.png";
				} else if (crud == CRUD.C) {
					img = "/images/grid/icon_create.png";
				} else if (crud == CRUD.U) {
					img = "/images/grid/icon_update.png";
				} else if (crud == CRUD.D) {
					img = "/images/grid/icon_delete.png";
				};
				return "<input type=\"checkbox\" role=\"_CHECK_\" " + (checked == "Y" ? "checked=\"checked\"" : "") + " onclick=\"clickSystemCheckbox(event,this, '" + pin.id + "', '" + rowid + "');\" />&nbsp;<img src=\"" + img + "\" style=\"vertical-align: middle;\" />";
			}
		});
		
		//실제 사용될 컬럼들...
		var edit_column_exist = false;		//편집 가능한 컬럼이 존재하는지 확인(편집 가능한 컬럼이 있을 경우 frozen 처리 해주지 않는다)
		$.each(pin.columns, function(i, column) {
			if (column.editable) {
				edit_column_exist = true;
			};
			if (column.frozen) {		//컬럼 고정 여부
				frozen_yn = true;
			};
			if (column.type == DATATYPE.NUMBER && column.format != "") {
				column.format = makeNumberformat(column.format);	//format 변환 (N1 -> #,###.0 형태로...)
			};
			if (group_yn && groupcolumns[column.id]) {	//그룹 컬럼이 있다면....
				column.merge = true;
				column.group = true;
				column.group_align = groupcolumns[column.id].align;
				column.group_format = groupcolumns[column.id].format;
				column.group_ids = groupcolumns[column.id].ids;
			};
			
			if (calculation_yn && calculations[column.id]) {	//계산식 컬럼이 있다면....
				column.calculation = true;
			};
			if (column.merge) {	//머지 컬럼
				merge_yn = true;
				column["_MIDX_"] = 0;
				mergecolumns.push(column);
			};

			column = $.extend(column, {
				name: column.id, 
				index: column.id,
				hidden: column.type == DATATYPE.HIDDEN ? true : !column.visible,	//파일타입도 보여주지 말자.. 어차피 파일업로드 불가하니깐...				
				editable: column.editable,
				sortable: column.sort,
				sorttype: column.sort && column.type == "N" ? "int" : "text",	//숫자로 정렬 될 수 있도록...
				formatter: function(cellvalue, options, rowObject) {	//데이타를 보여주자..
					var rowid = options.rowId;
					var type = celltypes[rowid + "_" + column.id] || column.type;
					var format = cellformats[rowid + "_" + column.id] || column.format ;					
					if (column.default_value !=  "" && cellvalue == "") {
						cellvalue = column.default_value;
					};
					if ($.type(cellvalue) == "undefined" || cellvalue == null) {
						cellvalue = "";
					};
					if (type == DATATYPE.TEXT) {
						if (cellvalue != "" && format != "") {
							cellvalue = formatter(cellvalue, format);
						};
					} else if (type == DATATYPE.NUMBER) {
						if (cellvalue == "" || cellvalue == 0) {
							cellvalue = "0";
						} else {
							cellvalue = formatNumber(cellvalue, format);
						}
					} else if (type == DATATYPE.DATE) {
						if (cellvalue != "" && format != "") {
							cellvalue = new Date(cellvalue.replace(/-/g, "/")).format(format);
						};
					} else if (type == DATATYPE.COMBO) {
						var combo = combos[rowid + "_" + column.id] || column.combo ;
						
						$.each(combo, function(k, v) {
							if (v["key"] == cellvalue) {
								cellvalue = v["value"];
								return false;
							};							
						});	
						
					} else if (type == DATATYPE.CHECKBOX) {
						if (column.editable) {
							cellvalue = "<input type=\"checkbox\" role=\"B\" rowid=\"" + rowid + "\" onclick=\"clickCheckbox(event,this, '" + pin.id + "');\" name=\"" + column.id + "\" " + (cellvalue == "Y" ? "checked=\"checked\"" : "") + " ></input>";
						} else {
							cellvalue = "<input type=\"checkbox\" role=\"B\" rowid=\"" + rowid + "\" name=\"" + column.id + "\" " + (cellvalue == "Y" ? "checked=\"checked\"" : "") + " disabled=\"disabled\" ></input>";
						};
					} else if (type == DATATYPE.LEVEL) {
						//afterInsertRow에서 이벤트 처리...
						cellvalue = "";
					} else if (type == DATATYPE.IMAGE) {
						if (cellvalue != "") {
							cellvalue = "<img src=\"" + column.domain + cellvalue + "\" width=\"20px\" height=\"20px\" />";							
						};
					} else if (type == DATATYPE.TEXT_DATE) {
						if (cellvalue != "" && format != "") {
							cellvalue = formatter(cellvalue, format);
						};
					}else if(type == DATATYPE.FILE){


						var uploadData = cellupload[rowid+"_"+column.id];

						var uploadHtml = "";
							uploadHtml =  "<div style=\"position:relative; height:19px; padding:3px 17px 0 0;\">" + cellvalue;							
						
						if(getEditable(rowid, column.id)){
							
							uploadHtml += "<a href=\"#\" onclick=\"clickDeleteFileButton(event, '" + pin.id + "', " + rowid + ", '" + column.id + "'); return false;\" style=\"position:absolute;top:3px;right: 15px;\">";							
							uploadHtml += "<img src=\"/images/grid/ico_x.gif\" />";							
							uploadHtml += "</a>";							
							uploadHtml += "<a href=\"#\" onclick=\"clickUploadButton(event, '" + pin.id + "', " + rowid + ", '" + column.id + "');\" style=\"position:absolute;top:3px;right:0;\">";							
							uploadHtml += "<img src=\"/images/grid/ico_upload.gif\" />";							
							var filterFileExtention = "";

							if(column.hasOwnProperty("filter") && column.filter !== ""){
								filterFileExtention = column.filter.split("|")[1];								
							}
							
							try {
							
								if(filterFileExtention !== ""){
									
									filterFileExtention = filterFileExtention.replace(/(\*.([a-z]*);*)/ig,function (a, b, extention,d) {
										return "."+extention+",";
									});
								}
							} catch (e) {
								console.log("filter properties error...   ex) EXTENTION DESC|.gif,.jpeg");
							}				
							
							uploadHtml += "<input type=\"file\" accept=\""+filterFileExtention+"\" style=\"width: 0px;height: 0px;position: absolute;\" />";
							uploadHtml += "</a>";					
							
						}
							uploadHtml += "</div>";		
							
							cellvalue = uploadHtml;							
					
					
					};
					if (cellvalue != "" && column.prefix != "") {
						cellvalue = (column.prefix != "" ? column.prefix + " " : "") + cellvalue;
					};
					if (cellvalue != "" && column.suffix != "") {
						cellvalue = cellvalue + (column.suffix != "" ? " " + column.suffix : "");
					};
					if (column.underline) {
						cellvalue = "<u style=\"cursor: pointer;\">" + cellvalue + "</u>";
					};
					if (column.button) {	//셀에 돋보기 버튼을 보여주자...
						var b = cellbuttons[rowid + "_" + column.id];
						if ($.type(b) != "boolean" || $.type(b) == "boolean" && b) {
							cellvalue = "<div style=\"position:relative; height:19px; padding:3px 17px 0 0;\">" + cellvalue + "<a href=\"#\" onclick=\"clickCellButton(event, '" + pin.id + "', " + rowid + ", '" + column.id + "'); return false;\" style=\"position:absolute;top:3px;right:0;\"><img src=\"/images/grid/icon_search.png\"></a></div>";							
						};
					};
					return cellvalue;
				}
			});
			
			if (column.merge || column.calculation) {
				column.cellattr = function(rowid, value, rowObject, col, rdata) {
					var value = "";
					if (col.calculation) {
						value = "calculation=true calculation_id=\"" + col.id + "\" ";
					};
					if ($.type(rowObject["merge_id_" + col.id]) == "string") {
						value += "merge_id=\"" + rowObject["merge_id_" + col.id] + "\"";	
					};
					return value;
				};
			};
			colNames.push(column.header);
			colModel.push(column);
			columns[column.id] = column;
			columnsName[column.header] = column;  
		});
		
		var selected_cell = null;
		
		var events = {
			//Initialize: function () {},			//base/datagrid.js 에서 호출됨
	        //EndQuery: function (result) {},	//DoSubmit 호출후 데이타 적재한 다음에 호출됨
	        //EndSave: function (result) {},		//DoSubmit 호출후 데이타 적재한 다음에 호출됨
	        //EndLogin: function (result) {},	//DoSubmit 호출후 호출됨
	        /* CellClick: function (cell) {} */ 
			onCellSelect: function(rowid, iCol, cellcontent, e) {		//편집모드를 만들어주자...
				if ($.type(g.p.colModel[iCol]) != "object") {	//셀을 마우스 드래그해서 옆셀로 이동할 경우 undefined가 리턴됨.
					return false;
				};
				
	        	var id = g.p.colModel[iCol].id;
	        	
	        	if (($.type(id) == "undefined")) {	//컬럼 이외의 셀을 클릭했을 경우는 제외(넘버컬럼..)
	        		return false;
				};
	        	
	        	var column = columns[id];		//컬럼 정보
				var dataitem = jq.getLocalRow(rowid);
				var cell_value = dataitem[id];
				var pre_value = dataitem["_PRE_" + id];
				var org_value = dataitem["_ORG_" + id];
				var text = cellcontent;
				
				var editable = getEditable(rowid, id);
				var type = celltypes[rowid + "_" + id] || column.type;
				
				if (editable) {
					pin.events.BeginEdit({ Id: id, Row: getRowIndex({ rowid: rowid }), Value: cell_value, PreValue: pre_value, OrgValue: org_value, Text: text });
					//e.target <- 이넘이 해당cell의 td임
					var td = $(e.target);
					if (type == DATATYPE.TEXT || type == DATATYPE.NUMBER) {
						td.empty();
						var input = $("<input type=\"text\"></input>").css({ width: e.target.clientWidth*0.9 }).blur(function() {		//input box의 width를 cell의 width로 맞추자..
							o.SetValue({
								rowid: rowid, 
								id: id, 
								value: this.value
							});
						});
						if (type == DATATYPE.NUMBER) {
							input.css({
								"text-align": "right"
							});						
						};
						input.val(cell_value);
						input.attr({
							maxlength: column.maxlength
						});
						td.append(input);
						input.focus();
					} else if (type == DATATYPE.DATE || type == DATATYPE.TEXT_DATE) {
						var format = type == DATATYPE.DATE ? "yyyy-MM-dd HH:mm:ss" : "yyyyMMdd" ;						 
						var div = $("<div />");                        	
                    	var dates = [];
                    	if ($.type(column.calendar) == "object" && column.calendar.sdate && column.calendar.edate) {	//B타입(2단)
                    		dates = [column.calendar.sdate, column.calendar.edate];
                    	} else {
                    		dates = [id];
                    	};
                    	
                    	$.each(dates, function(i, name) {
                    		var date = null;
                    		var value = dataitem[name];	//해당 필드의 날짜값
                    		if (value == "") {	//값이 없을 경우 현재일을 셋팅하자...
                    			date = new Date();
                    		} else {
                    			date =  type == DATATYPE.DATE ? new Date(value.replace(/-/g, "/")) : new Date(value.substring(0, 4) + "/" + value.substring(4, 6) + "/" + value.substring(6)) ;
                    		};
                    		
                    		div.append("<span><input value='" + date.format("yyyy-MM-dd") + "'  /></span>");
                    		div.append("<button />");
                    		if ($.type(column.calendar) == "object" && column.calendar.hour) {
                    			div.append("<span><input value='" + date.format("HH") + "'  /></span>");
                        		div.append("<span><input value='" + date.format("mm") + "'  /></span>");
                    		};
                    		div.append("<span>~</span>");
                    	});
                    	//현재cell의 위치
        				var position = $(e.target).offset();
                    	$("button", div).showCalendar({
                    		grid:true,
                    		clickcheck: false,
                    		left: position.left,
                    		top: position.top,
                    		offx: 0,
                    		offy: 0,
                    		fn: function(sdate, edate) {
                    			if (sdate != null) {
                    				o.SetValue({
        								rowid: rowid, 
        								id: dates[0], 
        								value: sdate.format(format)
        							});                    				
                    			};
                    			if (edate != null) {
                    				o.SetValue({
        								rowid: rowid, 
        								id: dates[1], 
        								value: edate.format(format)
        							});
                    			};
                    		}
                    	});
					} else if (type == DATATYPE.COMBO) {
						var combo = combos[rowid + "_" + id] || column.combo ;
						td.empty();
						var input = $("<select></select>").change(function() {	//blur시 적용하는것이 맞지만 안드로이드에서 blur 이벤트 발생시기가 pc 브라우저하고 상이함...
							var v = this.value;	//값을 따로 저장하지 않으면 IE에서는 정상적으로 값이 전달되지 않을 수 도 있음???
							o.SetValue({ row: getRowIndex({ rowid: rowid }), id: id, value: v });
							pin.events.ChangeCombo({
		        				Id: id,
		        		        Row: getRowIndex({ rowid: rowid }),
		        		        Value: v,
		        		        PreValue: cell_value,
		        		        OrgValue: org_value
							});							
						}).blur(function() {	//blur가 되면 콤보를 없애자...
							o.SetValue({ row: getRowIndex({ rowid: rowid }), id: id, value: this.value });
						});
						var count = 0;
						$.each(combo, function(k, v) {
							input.append("<option value=\"" + v["key"] + "\">" + v["value"] + "</option>");
							count++;
						});
						if (count > 0) {
							input.val(cell_value);
							td.append(input);
							input.focus();						
						};
					} else if (type == DATATYPE.CHECKBOX) {
						text = cell_value;
						//do nothing...
					} else if (type == DATATYPE.LEVEL) {
						//do nothing...
					} else if (type == DATATYPE.IMAGE) {
						//do nothing...
					};					
				};
				
				//이걸 안해주면 document.click까지 이벤트가 전달되어서... 레이어 같은것이 바로 사라지기 때문에...
				e = e || event;
				e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
				
				//현재cell의 위치
				var position = $(e.target).offset();
				pin.events.CellClick({
					Id: id,
					Row: getRowIndex({ rowid: rowid }),					
					Value: cell_value,
					Text: text,
					PreValue: pre_value,
					OrgValue: org_value,
					Left: position.left,
					Top: position.top,
					Right: (position.left + e.target.clientWidth),
					Bottom: (position.top + e.target.clientHeight),
					isGroup: dataitem.isGroup ? true : false,
					isTotal: dataitem.isTotal ? true : false
				});
			},	
	        //CheckboxClick: function (check) {}, <-- 시스템 체크박스 클릭시 발생해줌 clickSystemCheckbox 참조
	        //ChangeCell: function (cell) {},	<-- SetValue시 발생
			//ChangeCombo: function (cell) {},	<-- 콤보변경시
	        //BeginEdit: function(cell) {},	<-- 편집모드 전환이전에 발생
	        //RowChanged: function(row1, row2) {},			
	        onSelectRow: function(rowid, status, e) {
	        	
	        	//SelectCell로 선택된 넘이 있다면 초기화...
				if (selected_cell != null) {
					selected_cell.removeClass("ui-state-highlight");
					selected_cell = null;
				};
	        	
	        	if (lastrowid != rowid) {
	        		var row1 = o.GetRow({ row: getRowIndex({ rowid: rowid }) });
	        		var row2 = null;
	        		if (lastrowid != "") {
	        			row2 = o.GetRow({ row: getRowIndex({ rowid: lastrowid }) });
	        		};
	        		lastrowid = rowid;	//RowChanged 호출전에 lastrowid를 먼저 셋팅하도록 하자...
	        		pin.events.RowChanged(row1, row2);
	        	};
	        },
	        //RowAdded: function(row) {}		<-- AddRow시 발생
	        /*CellDblClick: function (cell) {}*/
	        ondblClickRow: function(rowid, iRow, iCol, e) {
	        	
	        	if ($.type(g.p.colModel[iCol]) != "object") {	//셀을 마우스 드래그해서 옆셀로 이동할 경우 undefined가 리턴됨.
					return false;
				};
	        	
	        	var id = g.p.colModel[iCol].id;
	        	
	        	if (($.type(id) == "undefined")) {	//컬럼 이외의 셀을 클릭했을 경우는 제외(넘버컬럼..)
	        		return false;
				};
				var column = columns[id];		//컬럼 정보
	        	var dataitem = jq.getLocalRow(rowid);
				var cell_value = dataitem[id];
				var pre_value = dataitem["_PRE_" + id];
				var org_value = dataitem["_ORG_" + id];
				
				var type = celltypes[rowid + "_" + id] || column.type;
	        	
	        	//이걸 안해주면 document.click까지 이벤트가 전달되어서... 레이어 같은것이 바로 사라지기 때문에...
				e = e || event;
				e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
				
				//현재cell의 위치
				var position = $(e.target).offset();
				
				pin.events.CellDblClick({
					Id: id,
					Row: getRowIndex({ rowid: rowid }),					
					Value: cell_value,
					PreValue: pre_value,
					OrgValue: org_value,
					Left: position.left,
					Top: position.top,
					Right: (position.left + e.target.clientWidth),
					Bottom: (position.top + e.target.clientHeight),
					isGroup: dataitem.isGroup ? true : false,
					isTotal: dataitem.isTotal ? true : false
				});
	        },
	        ButtonClick: function(cell) {},	//지원안함
	        EndFilter: function(row) {}		//지원안함
	        //GridClick: function() {},			//의미없음?
		};
		
		if (pin.properties.level) {
			events.afterInsertRow = function(rowid, rowdata, rowelem) {
				var tr = $("#" + rowid, grid_table);
				var node = rowdata[NODE_NAME];
				node.addTR(tr);
			};
		};
		
		//그리드 레이아웃 생성
		var jq_params = $.extend({
		    datatype: "local",		//xml, json
		    colNames: colNames,
		    colModel: colModel,
		    width: pin.properties.width,
		    height: pin.properties.height,
		    autowidth: true, 
		    shrinkToFit: false,
		    rownumbers: true	//왼쪽에 순번 보여줌...
		}, events);
		
		if (group_yn) {
			jq_params.rowattr = function(o1, o2) {
		    	//o2를 사용하자...
				if (o2.isGroup) {
					return { colmerge: o2.colmerge };
				};
			};
		};
		if (!edit_column_exist && frozen_yn) {	//컬럼고정 처리
			$.each(colModel, function() {
				if (this.frozen) {
					return false;
				};
				this.frozen = true;
			});			
		};
		
		var jq = grid_table.jqGrid(jq_params);
		
		//멀티헤드 처리
		var cl = pin.columnheaders.length;
		if (cl > 1) {
			var columnheaders = [];
			//일단 columnheader를 추가하자...
			$.each(pin.columnheaders, function(i) {
				columnheaders[cl - i - 1] = this;
				if (i != 0) {
					jq.setGroupHeaders({
						useColSpanStyle: false
					});	
				};
			});
			var trs = $("table.ui-jqgrid-htable > thead > tr.ui-jqgrid-labels", jq[0].grid.hDiv);
			var rnths = [];
			var chkths = [];
			trs.each(function(i) {
				var tr = $(this);
				rnths.push(tr.find("th:eq(0)")[0]);
				chkths.push(tr.find("th:eq(1)")[0]);
				tr.find("th:gt(1)").each(function(j) {
					var th = $(this);
					if (i < (cl - 1)) {
						th.text(columnheaders[i][j].header);						
					};
					th.attr({
						"merge_id": columnheaders[i][j].id
					});
				});
			});

			var header_colspan_pool = {};
			var header_rowspan_pool = {};
			trs.each(function(i) {
				var tr = $(this);
				var ths = tr.find("th:gt(1):visible");
				ths.each(function(j) {
					var th = $(this);
					var merge_id = th.attr("merge_id");					
					if (!header_colspan_pool[i + "_" + merge_id]) {	//colspan 대상
						header_colspan_pool[i + "_" + merge_id] = ths.filter("[merge_id=\"" + merge_id + "\"]");
					};
					if (!header_rowspan_pool[j + "_" + merge_id]) {	//rowspan 대상
						header_rowspan_pool[j + "_" + merge_id] = [];
					};
					header_rowspan_pool[j + "_" + merge_id].push(this);
				});
			});
			
			//colspan 처리
			$.each(header_colspan_pool, function() {
				var ths = $(this);				
				var length = ths.length; 
				if (length > 1) {		//colspan 하자...
					cth = ths.filter(":eq(0)");
					cth.attr({
						"colspan": length
					});
					cth.css({
						"text-align": "center"
					});
					ths.filter(":gt(0)").hide();
				};
			});
			//rowspan 처리
			$.each(header_rowspan_pool, function() {
				var ths = $(this);
				var length = ths.length;
				if (ths.filter(":visible").length > 1) {	//colspan 처리로 hide된 th들이 존재할 수 있다.
					//마지막 헤더가 rowspan에 포함되어 있다면 바꿔치기 해야 한다...
					var hth = ths.filter(".ui-th-column");
					if (hth.length == 1) {
						ths.filter(":eq(0)").replaceWith(hth);	//헤더th를 제일 위로 보내고....
						hth.attr({	//rowspan 해주자...
							"rowspan": length
						});
						//첫번째와 마지막을 제외하고 hide 해주자(이때 hth까지 hide됨!!!).						
						ths.filter(":gt(0):lt(" + (ths.length - 1) + ")").hide();
						hth.show();	//보여주자...
						
						hth.find("span.ui-jqgrid-resize").each(function() {
							var span = $(this);				
							span.attr({	//컬럼 resize에 사용되는 span의 height를 rowspan 된 만큼 늘려주자
								style: "height: " + hth.height() + "px !important; cursor: col-resize;"
							});
						});
						
						hth.find("div.ui-jqgrid-sortable").each(function() {
							//th의 height를 기준으로 div를 늘려주고 텍스트가 middle에 위치 할 수 있도록...
							var div = $(this);
							var padtop = 22 * (length/2) - 11;	//th의 높이를 22px로 잡는다.
							var dh = hth.height() - padtop;
							div.css({
								"height": dh + "px",
								"padding-top": padtop + "px"
							});
						});
					} else {
						ths.filter(":eq(0)").attr({
							"rowspan": length
						});
						ths.filter(":gt(0)").hide();						
					};
				};
			});
			
			//멀티헤더에 대해서 colspan, rowspan 작업완료 후 번호 컬럼과 체크박스 컬럼 처리...
			var rowmerge = function(ths) {
				var length = ths.length;
				var hth = ths.filter(".ui-th-column");
				if (!hth.is(":visible")) {	//보일 경우만 해주자....(컬럼 resize시 이상동작 함...)
					return false;
				};
				ths.filter(":eq(0)").replaceWith(hth);
				hth.attr({
					"rowspan": length
				});
				ths.filter(":gt(0):lt(" + (ths.length - 1) + ")").hide();
				hth.show();
			};
			rowmerge($(rnths));
			rowmerge($(chkths));
		};
		
		if (frozen_yn) {
			jq.setFrozenColumns();			
		};
		
		var isShow = ((Browser.type == "MSIE" && Browser.version >= 10) || Browser.type != "MSIE" );

		if(pin.properties.excel_export){
			pin.properties.excel_export = isShow;
		}
		
		var isTopLeftOff = (!pin.properties.excel_export && !pin.properties.excel_import && !pin.properties.excel_sample && !pin.properties.editable);
		
		if(!isTopLeftOff){
		
			var $topColumnHeader = $("table.ui-jqgrid-htable > thead > tr.ui-jqgrid-labels:eq(0)", jq[0].grid.hDiv);
	
			var $rnTopLeft = $topColumnHeader.find("#"+pin.id+"_rn");
			var headerLeftIcon = "<img src='/images/grid/icon_header_left.gif' style='margin-top:5px'></img>";
	
			$rnTopLeft.find("div").html(headerLeftIcon + $rnTopLeft.find("div").html());
	
			$("#gview_"+pin.id).click(function(e){
				
				e = e || event;
				e.stopPropagation ? e.stopPropagation(): e.cancelBubble = true;
			 	e.preventDefault();
			 	
			 	if ($(".g_lyr").length > 0) {
					$(".g_lyr").remove();
				}
			});
			$rnTopLeft.contextmenu(function(e){
				e = e || event;
				e.stopPropagation ? e.stopPropagation(): e.cancelBubble = true;
			 	e.preventDefault();
			 	
			 	if ($(".g_lyr").length > 0) {
					$(".g_lyr").remove();
				}
			 	
				// 현재cell의 위치
				var position = $rnTopLeft.offset();
	
				var html = "<div class=\"g_lyr\" style=\"left : "+ e.pageX+ "px;top : "+ e.pageY+ "px;position:absolute;display:inline;z-index:10000\" oncontextmenu='return false'> 					\n";
				html += "<ul>									\n";
	
				if (pin.properties.excel_import) {
					html += "	<li id=\"overpass_excel_import\" class=\"wj-topleftcontextmenu-li\"><div class=\"wj-topleftcontextmenu\"><span class=\"btn btn-default btn-file\"><img alt=\"\" src=\"/images/grid/ico_import.gif\" style=\"vertical-align:middle\">엑셀 가져오기  <input type=\"file\"></span></div></li>";
				}
				if (pin.properties.excel_sample) {
					html += "	<li id=\"overpass_excel_sample\" class=\"wj-topleftcontextmenu-li\"><div class=\"wj-topleftcontextmenu\"><span><img alt=\"\" src=\"/images/grid/ico_sample.gif\">엑셀 샘플받기 </span></div></li>";
				}
				if (pin.properties.excel_export) {
					html += "	<li id=\"overpass_excel_export\" class=\"wj-topleftcontextmenu-li\"><a download=\""+(pin.properties.excel_export_name || pin.id+".xlsx")+"\"><div class=\"wj-topleftcontextmenu\"><span><img alt=\"\" src=\"/images/grid/ico_export.gif\"> 엑셀 내보내기 </span></div></a></li>";
				}
				
				if(pin.properties.editable){
					html += "	<li id=\"overpass_excel_restore\" class=\"wj-topleftcontextmenu-li\"><div class=\"wj-topleftcontextmenu\"><span><img alt=\"\" src=\"/images/grid/ico_restore.gif\"> 변경 취소하기</span></div></li>";									
				}
				html += "</ul>									\n";
				html += "</div> 					\n";
	
				var $contextTopLeft = $(html);
				
				// li 루프 돌며 이벤트 구현.
				$contextTopLeft.find("li").each(function(i, el) {
					switch (el.id) {
					case "overpass_excel_import":
	
						$(this).find("input[type=file]").change(function(e) {
							Excel.importExcel(g,pin,$contextTopLeft,this,columns,columnsName);
						});
	
	
						break;
					case "overpass_excel_sample":
	
						$(this).click(function(e) {
							o.DownloadExcelSample(pin.properties.sample_id,pin.properties.sample_name);
							$contextTopLeft.remove();
						});
	
						break;
					case "overpass_excel_export":
	
						$(this).find("a").click(function(e) {
							Excel.exportExcel(g,pin,$contextTopLeft,this,columns);
						});
	
						break;
					case "overpass_excel_restore":
						
						$(this).click(function(e) {
							o.Restore();
							$contextTopLeft.remove();
						});
	
						break;
					default:
						break;
					}
				});
	
				$contextTopLeft.appendTo("body");
				
			});//end $rnTopLeft.contextmenu(function(e){
		}
		
		g.jq = o.jq = jq;
		g.o = o;
		g.o.uploads = {
			cellupload : cellupload,
			celluploadfiles : celluploadfiles
		};
		
		//데이타 초기화(그리드 데이타 초기화, 관련 오브젝트 초기화)
		var clearGridData = function() {
			jq.clearGridData();
			combos = {};
			editablerows = {};
			editablecells = {};
			celltypes = {};
			cellformats = {};
			cellbuttons = {};				
			g.o.uploads.cellupload= {};  //셀별 파일 업로드 정보.
			g.o.uploads.celluploadfiles= {};  //셀별 파일 업로드 정보.
		};
		
		var DoSubmit = function(p, grid) {
			//DATA_BINDINGS
			var DATA_BINDINGS = [];
			$.each(pin.columns, function(i, column) {
				DATA_BINDINGS.push({
					BINDING: column.binding,
					TYPE: column.type
				});
			});
			var querystring = "DATA_BINDINGS=" + JSON.stringify(DATA_BINDINGS) + "&MOBILE_YN=Y";
			if (p.mode == "S") {	//저장시...				
				var groups = [{ grid: p.o, cud: p.cud }];
				var data = { "IDS": [] };
				//group 정보 셋팅
                $.each(p.group, function(idx, g) {
                	if ("DoQuery" in g) {
                		g = { grid:g };
                	};
                	g = $.extend(false, { cud:["C", "U", "D"] }, g || {});
                	groups.push({ 
                		grid: g.grid, cud: g.cud 
                	});
                });
                $.each(groups, function(i, g) {
                	var C = false;
                	var R = false;
                	var U = false;
                	var D = false;
                	$.each(g.cud, function(i, crud) {
                		if (crud == CRUD.C) {
                			C = true;
                		} else if (crud == CRUD.R) {
                			R = true;
                		} else if (crud == CRUD.U) {
                			U = true;
                		} else if (crud == CRUD.D) {
                			D = true;
                		};
                	});
                	var jq = g.grid.jq;
                	data.IDS.push(g.grid.div_id);
                	data[g.grid.div_id] = { CREATE: [], UPDATE: [], DELETE: [], READ: [] };
                	var ids = jq.getDataIDs();
                	var length = ids.length;
                	for (var i = 0 ; i < length ; i++) {
                		var rowid = ids[i];
                		var row = {};
                		var rdata = jq.getLocalRow(rowid);
                		var crud = rdata["CRUD"];
                		var checked = rdata["Checked"];
                		if (!R && checked != "Y") {
                			continue;
                		} else if (R && p.checked && checked != "Y") {
                			continue;
                		};
                		$.each(g.grid.columns, function(i, column) {
                			row[column.id] = rdata[column.id] != null ? rdata[column.id] : "" ;	//null값일 경우 처리... 아니면 null이라는 문자열이 날라감...
                			if (column.type == DATATYPE.NUMBER && row[column.id] == "") {
                				row[column.id] = 0;
                			} else if (typeof(row[column.id]) == "string") {
                				row[column.id] = row[column.id].replace(/"/gi, "\\\"");                				
                			};
                			row[column.id] = row[column.id];
                		});
                		if (typeof(p.check_binding) == "string" && p.check_binding != "") {
                			row[p.check_binding.toUpperCase()] = checked;
                		};
                		
                		if (crud == "C") {
                			data[g.grid.div_id].CREATE.push(row);
                		} else if (crud == "U") {
                			data[g.grid.div_id].UPDATE.push(row);
                		} else if (crud == "D") {
                			data[g.grid.div_id].DELETE.push(row);
                		} else if (crud == "R") {
                			data[g.grid.div_id].READ.push(row);
                		};
                	};
                });
                
                querystring += "&GRID_DATA=" + encodeURI(JSON.stringify(data));
			} else {
				querystring += "&GRID_DATA={}";				
			};
			$.each(p.parameters, function(i, q) {
				querystring += "&" + q;
			});
			
			
			var isFormData = false;
			var formData = null;
			
			if(Browser.type == "MSIE" && Browser.version >= 10 || Browser.type != "MSIE"){
				var gFiles = $("#" + p.o.id)[0];

				for ( var cuf in gFiles.o.uploads.celluploadfiles) {
					isFormData = true;
					formData = new FormData();
					formData.append(gFiles.o.uploads.celluploadfiles[cuf].name,gFiles.o.uploads.celluploadfiles[cuf].files[0]);
				}
			}

			if(isFormData){
				var formParams = querystring.parseUrlParameter();
				for ( var fp in formParams) {
					formData.append(fp,(fp == "GRID_DATA") ? JSON.stringify(data) : formParams[fp]);
				}
			}				


			var crosssAjaxPin = {
				div_id : div_id,
				action : p.action, 
				querystring : querystring,
				formData : formData,
				isFormData : isFormData,
				celluploadfiles : gFiles.o.uploads.celluploadfiles,
				dataAsync : pin.properties.dataAsync || true, 

			};
             
			crossAjax(crosssAjaxPin,function(data) {
				
				var message = {};
				if ($.type(data.MESSAGE) != "undefined") {
					$.each(data.MESSAGE, function(key, value) {
						message[key] = value;
					});
				};
				if (message.code == "F" && data.MESSAGE.login == "N") {
					pin.events.EndLogin(message);
					return false;
				};
				if (message.code == "S" && p.mode == "Q") {
					clearGridData();	//데이타 초기화
				};
				if ($.type(data.RECORDS) != "undefined") {
					lastrowid = "";
					var records = data.RECORDS;
					rid = 0;	//rid 초기화

					//------------- 머지, 그룹, 총계, 계산식------------------
					var row_span_pools = [];
					if (merge_yn) {
						//머지 가능 하도록 records를 다시 생성한다.
						var new_records = [];
						var add_count = 0;
						
						var makeMerge = function(rows, idx) {
							var mc = mergecolumns[idx];
							if (!mc) {
								return false;
							};
							var array = [];
							var subtotals = {};
							if (calculation_yn) {
								$.each(calculations, function(cid) {
									subtotals[cid] = { count: 0, sum: 0 };
								});
							};
							$.each(rows, function(i) {
								var current = rows[i];
								var next = rows[i + 1];
								if ($.type(current["_INDEX_"]) != "number") {	//배열에 row 삽입위치를 잡기위해 순번 저장...
									new_records.push(current);
									current["_INDEX_"] = i;
								};
								
								if (calculation_yn) {
									$.each(calculations, function(cid) {
										var v = columns[cid].binding == cid ? current[cid] : current[columns[cid].binding] ;	//실제 바인딩 컬럼이 다르다면 AddRow이전에는 값이 셋팅되지 않으니 처리하자...
										subtotals[cid].count++;
										subtotals[cid].sum += (+v);
									});
								};
								
								current["merge_id_" + mc.id] = mc.id + "_" + mc["_MIDX_"] ;
								
								var rowno = current["_INDEX_"];
								array.push(current);
								if (!next || current[mc.id] != next[mc.id]) {										
									makeMerge(array, idx + 1);
									
									if (mc.group) {
										var gr = { isGroup: true, colmerge: mc.id };
										$.each(columns, function(id) {
											if (id == mc.id) {
												return false;
											};
											gr[id] = current[id];
										});
										$.each(mergecolumns, function() {
											if (this.id == mc.id) {
												return false;
											};
											gr["merge_id_" + this.id] = this.id + "_" + this["_MIDX_"] ;												
										});
										//그룹 row 삽입...
										if (calculation_yn) {
											$.each(calculations, function(cid, cc) {
												var v = 0;
												switch(cc.mode) {
													case "COUNT":
														v = subtotals[cid].count;
														break;
													case "SUM":
														v = subtotals[cid].sum;
														break;
													case "AVERAGE":
														v = subtotals[cid].sum / subtotals[cid].count;
														break;
												};													
												gr[cid] = v;
												subtotals[cid] = { count: 0, sum: 0 };
											});
										};
										new_records.splice(rowno + add_count + 1, 0, gr);											
										add_count++;
									};
									
									array = [];
									row_span_pools.push(mc.id + "_" + mc["_MIDX_"]);
									mc["_MIDX_"]++;
								};
							});
						};
						makeMerge(records, 0);
						records = new_records;
					};
					
					var totals = {};
					
					if (total_yn) {
						$.each(calculations, function() {
							totals[this.id] = { count: 0, sum: 0 };
						});
					};
					
					//---------------------------------------------------------------------------
					if (pin.properties.level) {
						var level_id = pin.properties.level_id;
						var makeTree = function(idx, parent) {								
							var record = records[idx];
							var next = records[idx + 1];
							var node = new Node(record[level_id]);
							parent.append(node);
							record[NODE_NAME] = node;
							if (next) {
								if (record[level_id] < next[level_id]) {
									parent = node;										
								} else if (record[level_id] > next[level_id]) {
									parent = node.findParent(record[level_id] - next[level_id]);
								};
								makeTree(idx + 1, parent);
							};
						};
						makeTree(0, root_node);
					};
					//---------------------------------------------------------------------------
					$.each(records, function(i, record) {
						o.AddRow({
							crud: CRUD.R,
							data: record,
							position: "last",
							set_rownum: false
						});
						if (total_yn && !record.isGroup) {	//총계값
							$.each(calculations, function() {
								totals[this.id].count++;
								totals[this.id].sum += (+record[this.id]);
							});
						};
					});
					
					if (total_yn) {
						var total = {};
						$.each(calculations, function(cid, cc) {
							var v = "";
							switch(cc.mode) {
								case "COUNT":
									v = totals[cid].count;
									break;
								case "SUM":
									v = totals[cid].sum;
									break;
								case "AVERAGE":
									v = totals[cid].sum / totals[cid].count;
									break;
							};
							total[cc.id] = v;
						});
						o.AddRow({
							crud: CRUD.R,
							data: total,
							position: "last",
							set_rownum: false
						});
					};
					
					//---------------------------------------------------------------------------
					if (merge_yn) {
						var trs = grid_table.find("tbody").find("tr.jqgrow");
						$.each(row_span_pools, function() {
							var tds = trs.find("td[merge_id='" + this + "']");
							var rowspan = tds.length;
							var ftd = tds.filter(":eq(0)");
							var htd = tds.filter(":gt(0)");
							ftd.attr("rowspan", rowspan);
							htd.hide();
						});
						
						if (group_yn) {
							trs.filter("[colmerge]").each(function() {
								var tr = $(this);
								var gid = tr.attr("colmerge");
								var rowid = tr.attr("id");
								var rdata = jq.getLocalRow(rowid);
								rdata["isGroup"] = true;
								var td = tr.find("td[aria-describedby=\"" + "grid_" + pin.div_id + "_" + gid + "\"]");
								var caltds = tr.find("td[calculation=true]");
								var fcaltd = caltds.filter(":eq(0)");
								
								var tds = tr.find("td").slice(td.index(), fcaltd.index());
								var htds = tr.find("td").slice(td.index() + 1, fcaltd.index());
								var colspan = tds.filter(":visible").length;
								
								td.attr("colspan", colspan);
								htds.hide();
								
								//그룹컬럼 셋팅
								var gc = groupcolumns[gid];
								if (gc.ids.length > 0) {
									var pre_tr = tr.prev();
									var pre_rowid = pre_tr.attr("id");
									var pre_rdata = jq.getLocalRow(pre_rowid);
									
									var formats = [];
									$.each(gc.ids, function() {
										formats.push(pre_rdata[this]);
									});
									td.text(string_format(gc.format, formats));
								} else {
									td.text(gc.format);
								};
								td.css({
									"text-align": gc.align
								});
								
								//계산식 컬럼 셋팅
								caltds.each(function() {
									var td = $(this);
									var cid = td.attr("calculation_id");
									var cc = calculations[cid];
									td.text((cc.prefix != "" ? cc.prefix + " " : "") + formatNumber(+rdata[cid], cc.format) + (cc.suffix != "" ? " " + cc.suffix : ""));
								});
							});
						};
					};
					if (total_yn) {
						var tr = grid_table.find("tbody").find("tr.jqgrow:last()");	
						var rdata = jq.getLocalRow(tr.attr("id"));
						rdata["isTotal"] = true;
						
						var tds = tr.find("td:gt(1)");		//번호/체크박스 컬럼 제외
						
						//첫번째 컬럼
						var td = tds.filter(":visible:eq(0)");
						
						var caltds = tr.find("td[calculation=true]");
						var fcaltd = caltds.filter(":eq(0)");
						var tds = tr.find("td").slice(td.index(), fcaltd.index());
						var htds = tr.find("td").slice(td.index() + 1, fcaltd.index());
						var colspan = tds.filter(":visible").length;
						
						td.attr("colspan", colspan);
						htds.hide();
						
						td.text(pin.grouptotal.description);
						td.css({
							"text-align": pin.grouptotal.align
						});
						
						//계산식 컬럼 셋팅
						caltds.each(function() {
							var td = $(this);
							var cid = td.attr("calculation_id");
							var cc = calculations[cid];
							td.text((cc.prefix != "" ? cc.prefix + " " : "") + formatNumber(+rdata[cid], cc.format) + (cc.suffix != "" ? " " + cc.suffix : ""));
						});
					};
					//---------------------------------------------------------------------------
					
					if (records.length > 0) {
						o.SelectRow({ row: 0 });
						jq.setGridParam({ rowNum: records.length });	//rowNum을 셋팅해주 않으면... sort시 디폴트 20개만 보여짐???
						if (frozen_yn || group_yn || total_yn) {		//이 경우 틀고점된 영역에 가로 스크롤이 생길 수 있으므로 처리해 준다...
							$("#grid_" + div_id + "_frozen").parent().css({
								"overflow-x": "hidden"
							});
						};
					};
				};
				if ($.type(data.PAGED_INFO) != "undefined") {
					$.each(data.PAGED_INFO, function(key, value) {
						message[key] = value;						
					});						
				};
				if (p.mode == "Q") {
					pin.events.EndQuery(message);						
				} else if (p.mode == "S") {
					pin.events.EndSave(message);
				};
				//시스템 체크박스를 언체크 해주자...
				$("#" + pin.id + "_system_checkbox").attr({
					checked: false
				});
			});
    	};
    	
		//functions 셋팅
		$.extend(o, $.fn.grid.functions, {
        	DoQuery: function (p) {	//조회
        		return DoSubmit(p, this);
            },
            DoSave: function(p) {
            	return DoSubmit(p, this);
            },
            GetValue: function (p) {
            	var id = p.id;
            	var rowid = getRowID(p);
            	var rdata = jq.getLocalRow(rowid);
            	var value = "";
            	if (rowid != "") {
            		value = rdata[id];
            	};
            	return value;
            },
            SetValue: function(p) {
            	var rowid = "";
            	if ($.type(p.row) != "undefined") {
            		rowid = getRowID(p);
            	} else {
            		rowid = p.rowid;
            	};
            	
				var isEventYn = (p.hasOwnProperty("event_yn") && p.event_yn === true) ? true : false;
            	var id = p.id; 
            	var value = p.value;		//셋팅할 값
            	
            	//입력된 값에 대한 validation
            	if (columns[id].type == DATATYPE.NUMBER) {
            		if (!$.isNumeric(value)) {
            			value = curdata;
        			};	
            	};
            	
            	if (value == "") {	//empty를 셋팅하기 위해서는 null을 넘겨줘야 함???
            		value = null;
            	};
            	
            	if (p.readonly) {	//readonly:true 일 경우 값만 셋팅하고 빠져나오자...
            		jq.setCell(rowid, id, value);
            		return false;
            	};
            	
            	var rdata = jq.getLocalRow(rowid);
            	
				var curdata = rdata[id];	//현재 셀의 실제값
				var curdataFile = rdata["_F_"+id]; // 타입이 파일일 경우 현재 셀의 실제값

				var org_value = rdata["_ORG_" + id];	//현재 셀의 원값
				var org_value_file = rdata["_F_ORG_" + id];	//퍄일 타입의 현재 셀의 원값
				var crud = rdata["CRUD"];
	

				if(columns[id].type == DATATYPE.FILE && !rdata.hasOwnProperty("_F_ORG_" + id)){
					rdata["_F_ORG_" + id] = curdataFile;
				}
				
				rdata["_F_"+id] = p.filename;
				
				jq.setCell(rowid, id, (columns[id].type == DATATYPE.FILE)  ? ((p.filename == "") ? null : p.filename) : value);
            	
    			//현재 row의 상태값 셋팅(CUD)
    			var changed = false;

				if(columns[id].type == DATATYPE.FILE){
					
					for ( var key in rdata) {

						if (rdata.hasOwnProperty("_F_ORG_" + key)	&& rdata[key] != rdata["_F_ORG_"+ key]) {
							
							if(rdata[key] == null && rdata["_F_ORG_"+ key] == ""){
								changed = false;
							}else{
								changed = true;							
							}
						}
					}
					
				}else{
	    			$.each(columns, function(id, column) {
						if (rdata["_ORG_" + id] != (rdata[id] == null ? "" : rdata[id])) {	//원값과 비교하여 변경 여부 확인
							changed = true;
							return false;
						};
	    			});    								
				}
    			
    			if (crud == CRUD.C || crud == CRUD.D) {		//상태가 바뀔 이유가 없음...
    				//do nothing...
    			} else if (changed) {
    				rdata["Checked"] = "Y";
    				rdata["CRUD"] = CRUD.U;
    			} else {
    				rdata["Checked"] = "N";
    				rdata["CRUD"] = CRUD.R;
    			};
    			
				updateStatus({
            		rid: rowid
            	});
				
				rdata["_PRE_" + id] = curdata;

				//컬럼 타입이 파일일 경우 
				if(columns[id].type == DATATYPE.FILE){
					rdata["_F_PRE_" + id] = curdataFile;
					rdata[id] = value;

				}
				
				if (p.bold) {
					grid_table.find("#" + rowid).find("td[aria-describedby=\"grid_" + pin.div_id + "_" + id + "\"]").css({
						"font-weight": "bold"
	            	});
				};
				
				
				if(!isEventYn){
					return;
				}
				

				if (columns[id].type != DATATYPE.FILE && curdata != (value == null ? "" : value) ) { // cell이 내용이 변경되었다면 이벤트를 발생시켜주자.. ""으로 셋팅한 값은 null이 리턴되므로 주의하자...
					pin.events.ChangeCell({
        				Id: id,
        		        Row: getRowIndex({ rowid: rowid }),
        		        Value: p.value,
        		        PreValue: curdata,
        		        OrgValue: org_value
					});
				}else if (columns[id].type == DATATYPE.FILE && curdataFile != (p.filename == null ? "" : p.filename)) { // cell이 내용이 변경되었다면 이벤트를 발생시켜주자.. ""으로 셋팅한 값은 null이 리턴되므로 주의하자...
					pin.events.ChangeCell({
						Id : id,
						Row : row,
						Value : p.filename,
						PreValue : curdataFile || "",
						OrgValue : org_value_file || ""
					});
				};
				

            },
            AddRow: function (p) {
            	p = $.extend({ set_rownum: true }, p || {});	//로우가 추가될 때 마다 전체 rowNum 값을 갱신한다.
            	$.each(pin.columns, function(j, column) {
            		var value = "";
            		if (column.id != column.binding) {	//컬럼id와 바인딩 컬럼이 다르다면...
            			value = p.data[column.id] ? p.data[column.id] : p.data[column.binding] ;  
            		} else {
            			value = p.data[column.binding];
            		};
            		if (!value) {
            			value = "";
            		};
            		p.data[column.id] = value;
				});
            	//시스템 체크박스에서 사용할 수 있도록...
            	p.data["_CHECKBOX_"] = rid;
            	
            	$.extend(p.data, {
					CRUD: p.crud || CRUD.C
				});
            	            	
            	p.data["Checked"] = (p.data["CRUD"] == CRUD.C) ? "Y" : "N" ;		//해당row의 체크박스 체크여부
            	
            	
				var isTreeRow = (p.hasOwnProperty("tree_row") && p.tree_row !== undefined && p.tree_row !== null);
            	
            	if (pin.properties.level) {
            		if (!p.data[NODE_NAME]) {	//AddRow 함수로 통해서 추가 하는 경우...
            			var parent = null;
            			if (p.row == -1) {	//ROOT에 추가
            				parent = root_node;
            			} else {

            				var data = null;
            				if (isTreeRow) {
            					data = o.GetRow({ row: p.tree_row });
            				} else {
            					data = o.GetRow({});
            				};
            				if (p.sibling) {	//동일레벨에 추가
            					parent = data[NODE_NAME].parent;
            					var last = parent.findLastChild();
            					p.rowid = last.rowid; 
            				} else {	//하위레벨에 추가
            					var node = data[NODE_NAME];
            					parent = node;
            					var last = node.findLastChild();
            					p.rowid = last.rowid;
            				};
            			};
            			var node = new Node(parent.level + 1);
            			parent.append(node);
            			p.data[NODE_NAME] = node;

                		//레벨 정보도 등록한다.
    					$.each(columns, function(i, column) {
    						if(column.type === DATATYPE.LEVEL){
    							p.data[column.id] = node.level+"";
    							return false;
    						}	
    					});
    					
            			if (p.row == -1) {
            				jq.addRowData(rid, p.data, "last");            				
            			} else if (p.sibling) {
            				jq.addRowData(rid, p.data, "after", p.rowid);
            			} else {
            				jq.addRowData(rid, p.data, "after", p.rowid);
            			};
            			jq.setSelection(rid, true);
            			grid_table.find("tr:eq(" + (rid + 1) + ")").focus();
            		} else {
            			jq.addRowData(rid, p.data, p.position || "first");            			
            		};
            		

            		
            		
            	} else {
            		
            		//rowid를 추가한다. 위치는 기존에 존재하는 row 앞 또는 뒤에 추가 하기 때문에 loop구문을 이용하여 row의 키값을 찾아 앞에 등록한다.
            		if (p.hasOwnProperty("row")) {            
            			
            			var rowLength = jq.getDataIDs().length;

            			if(rowLength == 0){
                    		jq.addRowData(rid, p.data, "first");
            			}else if(rowLength == p.row) {
                    		jq.addRowData(rid, p.data, "last");
            			}else{
            				
            				var rowId = -1;
            				for (var i = 0; i < rowLength; i++) {
            					if(p.row == i){
            						rowId = jq.getDataIDs()[i];
            						break;
            					}								
							}
            				
            				if(rowId != -1){
                        		jq.addRowData(rid, p.data, "before", rowId);            					
            				}
            				
            			}
                	} else {
                		jq.addRowData(rid, p.data, p.position || "first");            		
                	};            		
            	};
            	
            	if (p.set_rownum) {
            		jq.setGridParam({ rowNum: jq.getDataIDs().length });
            	};
            	
            	var rdata = jq.getLocalRow(rid);
            	rdata["Checked"] = p.data["Checked"] ;		//해당row의 체크박스 체크여부 저장(_CHECKBOX_의 formatter에서 사용할 수 있도록...)
            	rdata["Visible"] = "Y" ;
            	rdata["CRUD"] = p.data["CRUD"];
            	$.each(pin.columns, function(j, column) {	//그리드 기능을 위한 추가적인 값들...
            		var value = p.data[column.id];           		
            		rdata["_ORG_" + column.id] = value;		//해당 cell의 최초값
            		rdata["_PRE_" + column.id] = value;		//해당 cell 변경 이전의 값
            		
            		if(column.type == DATATYPE.FILE){
            			
            			
        				if(!rdata.hasOwnProperty("_F_ORG_" + column.id)){
        					rdata["_F_ORG_" + column.id] = rdata["_F_"+column.id] || (value ||"");
        				}

        				if(!rdata.hasOwnProperty("_F_PRE_" + column.id)){
        					rdata["_F_PRE_" + column.id] = rdata["_F_"+column.id] || (value ||"");
        				}

            		}
            		
				});
            	
            	if (pin.properties.level) {
            		p.data[NODE_NAME].rowid = rid;
            		rdata[NODE_NAME] = p.data[NODE_NAME];
            	};
            	
            	p.data["Index"] = getRowIndex({ rowid: rid });
            	
            	pin.events.RowAdded(p.data);
            	rid++;
            	return p.data;
            },
            GetRowCount: function(p) {
            	return jq.getDataIDs().length;
            },
            DeleteCreateRows: function(p) {
            	$.each(jq.getDataIDs(), function(i, rowid) {
            		var rdata = jq.getLocalRow(rowid);
            		if (rdata["Checked"] == "Y" && rdata["CRUD"] == "C") {
            			jq.delRowData(rowid);
            			jq.setGridParam({ rowNum: jq.getDataIDs().length });
            		};
            	});
            },
            DeleteRows: function(p) {
            	$.each(jq.getDataIDs(), function(i, rowid) {
            		var rdata = jq.getLocalRow(rowid);
            		if (rdata["Checked"] == "Y" && (rdata["CRUD"] == "R" || rdata["CRUD"] == "U")) {
            			rdata["CRUD"] = CRUD.D;
            			updateStatus({
            				rid: rowid
            			});
            		};
            	});
            },
            DeleteRow: function(p) {
            	var rowid = getRowID({ row: p.row });
            	var rdata = jq.getLocalRow(rowid);
            	rdata["Checked"] = "Y";
            	rdata["CRUD"] = CRUD.D;
            	updateStatus({ rid: rowid });
            },
            Restore: function(p) {
            	$.each(jq.getDataIDs(), function(i, rowid) {
            		var rdata = jq.getLocalRow(rowid);
            		rdata["Checked"] = "N";
            		if (rdata.CRUD == CRUD.C) {
            			jq.delRowData(rowid);
            		} else if (rdata.CRUD != CRUD.R) {
            			$.each(columns, function(j, column) {
            				if (column.editable) {
            					var org_value = rdata["_ORG_" + column.id];
            					jq.setCell(rowid, column.id, org_value);
            					rdata["_PRE_" + column.id] = org_value;
            				};
            			});
            			rdata["CRUD"] = CRUD.R;
    					updateStatus({ rid: rowid });
            		};
            	});
            	jq.setGridParam({ rowNum: jq.getDataIDs().length });
            },
            GetRow: function(p) {
            	var rowid = "";
            	if ($.type(p.row) == "number") {
            		rowid = getRowID({ row: p.row });
            	} else {
            		if ($.type(p.rowid) == "string") {
                		rowid = p.rowid;
                	} else {
                		rowid = lastrowid;
                	};
                	p.row = getRowIndex({ rowid: rowid });
            	};
            	var data = null;
            	if (rowid != "") {
            		var rdata = jq.getLocalRow(rowid);
            		data = { 
        				Checked: rdata.Checked == "Y" ? true : false, 
        				Visible: rdata.Visible == "Y" ? true : false, 
        				Index: p.row, 
        				CRUD: rdata["CRUD"]	
            		};
            		data[NODE_NAME] = rdata[NODE_NAME];
            		$.each(pin.columns, function(i, column) {
            			data[column.id] = rdata[column.id];
            		}); 
            	};
            	return data;
            },
            GetRows: function(p) {
            	var rows = [];
            	var ids = jq.getDataIDs();
            	var length = ids.length;
            	for (var i = 0 ; i < length ; i++) {
            		var rdata = o.GetRow({ row: i });
            		if (p.checked && !rdata.Checked) {
            			continue;
            		};
            		rows.push(rdata);
            	};
            	return rows;
            },
            GetCell: function(p) {
            	var id = p.id;
            	var cell = null;
            	var rowid = "";            	
            	if ($.type(p.row) == "undefined" || $.type(p.row) != "number") {
            		rowid = lastrowid;
            	} else {
            		rowid = getRowID({ row: p.row });
            	};
            	if (rowid != "") {
            		var rdata = jq.getLocalRow(rowid);
            		var text = jq.getCell(rowid, id);
            		cell = { 
            			Id: id, 
            			Row: p.row, 
            			Value: rdata[id], 
            			PreValue: rdata["_PRE_" + id], 
            			OrgValue: rdata["_ORG_" + id], 
            			Text: text, 
            			DataType: celltypes[rowid + "_" + id] || columns[id].type,
            			isGroup: rdata.isGroup ? true : false,
            			isTotal: rdata.isTotal ? true : false
            		};            
            		
            		//파일인 경우에 
            		if(columns[id].type == DATATYPE.FILE){
            			cell.PreFileValue = rdata["_F_PRE_" + id]
            			cell.OrgFileValue = rdata["_F_ORG_" + id]
            		}
            	};
            	return cell;
            },
            HideColumn: function(p) {
            	jq.hideCol(p.id);
            },
            ShowColumn: function(p) {
            	jq.showCol(p.id);
            },
            HideRow: function(p) {
            	var rowid = p.rowid || getRowID(p);
            	var rdata = jq.getLocalRow(rowid); 
            	rdata["Visible"] = "N";
            	grid_table.find("#" + rowid).hide();
            },
            ShowRow: function(p) {
            	var rowid = p.rowid || getRowID(p);
            	var rdata = jq.getLocalRow(rowid);
            	rdata["Visible"] = "Y";
            	grid_table.find("#" + rowid).show();
            },
            CreateCombo: function(p) {
            	var rowid = getRowID(p);
            	var id = p.id;
            	var combo = null;
            	if (rowid != "") {
            		combo = getCombo(p.combo);	
            	};
            	if (combo != null) {
            		combos[rowid + "_" + id] = combo;
            	};
            	//콤보 생성후 해당 cell 업데이트
            	o.SetValue({
            		row: p.row, 
            		id: id, 
            		value: o.GetCell({ row: p.row, id: id }).Value
            	});
            },
            ClearRows: function(p) {
            	clearGridData();
            },
            SelectRow: function(p) {
            	var ids = jq.getDataIDs();
            	if (ids.length > 0) {
            		var rowid = p.rowid || getRowID(p);
                	jq.setSelection(rowid, true);
                	var tr = $("#" + rowid, grid_table);                	
                	tr.focus();
            	};
            },
            SetEditable: function(p) {
            	if ($.type(p) == "boolean") {	//전체 컬럼에 대해서 적용
            		$.each(columns, function(i, column) {
            			column.editable = p;
            		});
            	} else if ($.isArray(p)) {	 //지정된 컬럼들에 대해서 적용
            		$.each(p, function(i, column) {
            			columns[column.id].editable = column.editable;
            		});
            	} else if ($.isPlainObject(p)) {	//특정 row 또는 column 또는 cell에 적용
            		var rowid = $.type(p.row) == "number" ? getRowID(p) : "" ;
            		var id = $.type(p.id) == "string" ? p.id : "" ;
            		if (rowid != "" && id != "") {	//cell 지정
            			editablecells[rowid + "_" + id] = p.editable;
            		} else if (rowid != "") {	//row 지정
            			editablerows[rowid] = p.editable;
            		} else if (id != "") {	//column 지정
            			columns[id].editable = p.editable;
            		};
            	};
            },
            CancelEdit: function(p) {
            	o.SetEditable({
            		row: p.row,
            		id: p.id,
            		editable: p.value
            	});
            },
			/*
            SetColumnIndex: function(p) {
            	var colModels = g.p.colModel;
            	var id = p.id;
            	var pos = p.index + 2;  //rn(넘버), checkbox 컬럼 2개
            	var order = [];
            	var orgpos = 0;
            	$.each(colModels, function(i, colModel) {
            		if (colModel.name == id) {
            			orgpos = i;
            		} else {
            			order.push(i);
            		};
            	});
            	var permutation = [];
            	$.each(order, function(x, i) {
            		permutation.push(i);
            		if (i == pos) {
            			permutation.push(orgpos);
            		};
            	});
            	jq.remapColumns(permutation, true);
            },
			*/
            CheckRequired: function(p) {
            	var rowids = jq.getDataIDs();
            	var result = true;
            	$.each(rowids, function(i, rowid) {
            		var rdata = jq.getLocalRow(rowid);
            		var crud = rdata["CRUD"];
            		if (crud == CRUD.C || crud == CRUD.U) {
            			//빈값 검사
            			$.each(columns, function(j, column) {
            				if (column.required && $.trim(rdata[column.id]) == "") {
            					var rn = jq.getCell(rowid, "rn");
            					alert(GM.invalid_required.format(column.header, rn));
            					result = false;
            					return false;
            				};
            			});
            		};
            	});
            	return result;
            },
            ChangeCellType: function(p) {
            	p = $.extend({ type: "" }, p || {});
            	var rowid = getRowID(p);
            	var rdata = jq.getLocalRow(rowid);            	
            	var id = p.id;
            	var type = p.type;
            	if (type != "") {
            		celltypes[rowid + "_" + id] = type;            		
            	};
            	var format = p.format;
            	if (format != "") {
            		cellformats[rowid + "_" + id] = format;            		
            	};
            	//cell의 컨텐츠를 변경해주도록 하자...
            	jq.setCell(rowid, id, rdata[id]);
            },
            CheckRow: function(p) {
            	var ids = jq.getDataIDs();
            	if (ids.length > 0) {
            		var rowid = getRowID(p);
            		var rdata = jq.getLocalRow(rowid);
            		grid_table.find("#" + rowid).find(":checkbox[role=_CHECK_]").each(function() {
                		this.checked = p.checked;
                		rdata["Checked"] = p.checked ? "Y" : "N" ;
                	});
            	};
            },
            ChangeCRUD: function(p) {
            	var ids = jq.getDataIDs();
            	if (ids.length > 0) {
            		var rowid = getRowID(p);
            		var rdata = jq.getLocalRow(rowid);
            		grid_table.find("#" + rowid).find(":checkbox[role=_CHECK_]").each(function() {
                		this.checked = (p.crud == "R") ? false : true ;
                		rdata["Checked"] = (p.crud == "R") ? "N" : "Y" ;
						rdata["CRUD"] = p.crud;
                	});
                	updateStatus({ rid: rowid });
            	};
            },
            SetBackground: function(p) {
            	var color = "#";
            	$.each(p.color.split("|"), function() {
            		color += (+this).toString(16);
            	});
            	var rowid = getRowID(p);				
				if (p.id != "") {	//cell
					grid_table.find("#" + rowid).find("td[aria-describedby=\"grid_" + pin.div_id + "_" + p.id + "\"]").css({
						"background-color": color
					});
				} else {	//전체row
					grid_table.find("#" + rowid).find("td").css({
						"background-color": color
					});
				};            	
            },
            SetForeground: function(p) {
            	var color = "#";
            	$.each(p.color.split("|"), function() {
            		color += (+this).toString(16);
            	});
            	var rowid = getRowID(p);
				if (p.id != "") {	//cell
					grid_table.find("#" + rowid).find("td[aria-describedby=\"grid_" + pin.div_id + "_" + p.id + "\"]").css({
						"color": color
					});
				} else {
					grid_table.find("#" + rowid).find("td").css({
						"color": color
					});				
				};
            },
            CollapseRow: function(p) {
            	var rowid = getRowID(p);
            	var rdata = jq.getLocalRow(rowid);
            	rdata[NODE_NAME].expand(false);
            },
            FilterRow: function(p) {
            	var first_matched_row = null;
            	$.each(jq.getDataIDs(), function() {
            		if (p.keyword == "") {
            			if (first_matched_row == null) {
            				first_matched_row = this;
            			};
            			o.ShowRow({ rowid: this });
            		} else {
            			var index = jq.getLocalRow(this)[p.id].indexOf(p.keyword);
            			if (index >= 0) {
            				if (first_matched_row == null) {
                				first_matched_row = this;
                			};
            				o.ShowRow({ rowid: this });
            			} else {
            				o.HideRow({ rowid: this });
            			};
            		};
            	});
            	if (first_matched_row != null) {
            		o.SelectRow({ rowid: first_matched_row });
            		pin.events.EndFilter(o.GetRow({ rowid: first_matched_row }));
            		first_matched_row = null;
            	};
            },
            SearchRow: function(p) {
            	var cur_row = o.GetRow({});
            	var search_row = null;
            	var search_id = null;
            	var first_row = null;
            	$.each(jq.getDataIDs(), function() {
            		if (jq.getLocalRow(this)[p.id].indexOf(p.keyword) >= 0) {
            			var rowid = this;
            			var index = getRowIndex({ rowid: rowid });
            			if (first_row == null) {
            				first_row = index;
            			};
            			if (cur_row.Index < index) {
            				search_row = index;
            				search_id = rowid;
            				return false;
            			};
            		};
            	});
            	var row = search_row || first_row ;
            	if (row != null) {
            		o.SelectRow({ row: row });
    				o.SelectCell({ row: row, id: p.id });
    				if (pin.properties.level) {	//트리형의 경우 노드가 접혀 있다면 expand 해주자...
    					var showNode = function(n) {
    						if (n && n.tr != null && !n.tr.is(":visible")) {
    							if (n.parent != null) {
        							showNode(n.parent);
        							n.parent.expand(true);
        						};
    						};
    					};
    					var rdata = jq.getLocalRow(search_id);
    					var node = rdata[NODE_NAME];
    					showNode(node);
    				};
            	};
            },
            ReplaceColumns: function(p) {},	//지원안함            
            ShowColumnsButton: function() {},	//지원안함
            MoveRow: function(p) {	//tree형 그리드에서 사용
            	var result = null;
            	var row = o.GetRow({});
            	var node = row[NODE_NAME];
            	var tr = $("#" + node.rowid, grid_table);
            	var pre_tr = null;
            	var moveChildren = function(n) {
            		pre_tr = $("#" + n.rowid, grid_table);
            		$.each(n.children, function(i, child) {
            			var tr = $("#" + child.rowid, grid_table);
            			tr.insertAfter(pre_tr);
            			pre_tr = tr;
            			moveChildren(child);
            		});
            	};
            	if (node.parent.children.length > 1) {
            		var index = $.inArray(node, node.parent.children);	//현재 노드의 위치(javascript의 indexOf는 ie에서 동작을 보장할 수 없음..!!!!)
            		var node1 = node;
            		var rowid1 = node.rowid;
            		var node2 = null;
            		var rowid2 = null;
            		if (p.direction === "U" && index > 0) {
            			node2 = node.parent.children[index - 1];
            			rowid2 = node2.rowid;
            			var pre_tr = $("#" + rowid2, grid_table);
                		tr.insertBefore(pre_tr);	//대상 노드를 위로 옮기고... 자식 노드들을 대상 노드 뒤로 차례대로...
                		moveChildren(node);              		
                		node.parent.children.splice(index - 1, 0, node.parent.children.splice(index, 1)[0]);		//배열 순서 바꿔주기
                	} else if (p.direction === "D" && (node.parent.children.length - 1) > index) {
                		var node2 = node.parent.children[index + 1];
                		rowid2 = node2.rowid;
                		var last_rowid = node2.findLastChild().rowid;
                		var next_tr = $("#" + last_rowid, grid_table);
                		tr.insertAfter(next_tr);	//대상 노드를 아래로 옮기고... 자식 노드들을 대상 노드 뒤로 차례대로...
                		moveChildren(node);
                		node.parent.children.splice(index + 1, 0, node.parent.children.splice(index, 1)[0]);	//배열 순서 바꿔주기
                	};
                	if (rowid2 != null) {
                		result = [ getRowIndex({ rowid: rowid1 }), getRowIndex({ rowid: rowid2 }) ];
                		//번호 교정...
                		var updateNumber = function(n) {
                			var index = getRowIndex({ rowid: n.rowid }); 
                			n.tr.find("td.jqgrid-rownum").text(index + 1);
                			$.each(n.children, function(i, child) {
                				updateNumber(child);
                			});
                		};
                		updateNumber(node1);
                		updateNumber(node2);
                		node1.tr.focus();
                	};
            	};
            	return result;
            },
            SelectCell: function(p) {
            	jq.resetSelection();
            	var tr = grid_table.find("tr:eq(" + (p.row + 1) + ")");
            	var td = tr.find("td[aria-describedby='grid_" + pin.div_id + "_" + p.id + "']");
            	td.addClass("ui-state-highlight");
            	selected_cell = td;
            	tr.focus();
            },
            DownloadExcelSample: function(id, name) {
				var $form = null;
				if ($("#_ExcelSampleForm").length == 0) {
					$form = $("<form id='_ExcelSampleForm' />")
					.append("<input type='hidden' name='sample_id'>")
					.append("<input type='hidden' name='sample_name'>");
					$form.attr({
								action : "/common/downExcelSample.action",
								method : "post"
							});
					$form.appendTo('body');
				} else {
					$form = $("#_ExcelSampleForm");
				}
				;
				$form.find("input[name=sample_id]").val(id);
				$form.find("input[name=sample_name]").val(name);
				$.form($form).submit({
					iframe : true
				});
				$.form($form).run(false);
            },	
            ChangeCellProperties: function(p) {
            	var rowid = getRowID(p);
            	var rdata = jq.getLocalRow(rowid);
            	cellbuttons[rowid + "_" + p.id] = p.button;
            	//cell의 컨텐츠를 변경해주도록 하자...
            	jq.setCell(rowid, p.id, rdata[p.id]);
            }
            //ShowCalendar: function(cell) {},
            /*End: function(message) {
            	alert(message);	
            },*/
        });

		g.CheckboxClick = pin.events.CheckboxClick;
		g.getRowIndex = getRowIndex;
		
		return o;
	};
})(jQuery);