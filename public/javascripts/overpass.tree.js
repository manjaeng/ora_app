(function ($) {
	_createTree = function(pin) {
		var div = document.getElementById(pin.div_id);	// HTMLDivElement
		
		var root = $(div).addClass("tree").addClass("scroll").append(root).append("<ul id=\"root_" + pin.id + "\"></ul>");
		var nodes = {};
		var key = 0;
		//action을 호출하여 데이타를 트리에 적재
		var level_name = "";
		var searchData = function(p) {
			var DATA_BINDINGS = [];
			$.each(pin.node.bindings, function(i, binding) {
				DATA_BINDINGS.push({ BINDING: binding });
				if (pin.properties.level_name == binding) {
					level_name = binding;
				};
			});
			if (level_name == "") {
				DATA_BINDINGS.push({ BINDING: pin.properties.level_name });
			};
			var querystring = "DATA_BINDINGS=" + JSON.stringify(DATA_BINDINGS);
			$.each(p.params, function(k, v) {
				querystring += ("&" + k + "=" + v);				
			});
			querystring += "&GRID_DATA=&MOBILE_YN=Y";
			var result = { message: {}, records: [] };
			$.ajax({
				url: p.action,					
				type: "POST",
				dataType: "json",
				data: querystring,
				async: false,
				success : function(data) {
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
					result.message = message;
					if ($.type(data.RECORDS) != "undefined") {
						result.records = data.RECORDS;
					};
				},
				error: function(jqXHR, textStatus, errorThrown) {
					alert("jqXHR1 : " + jqXHR.responseText  + "\n" + "textStatus : " + textStatus + "\n" + "errorThrown : " + errorThrown);					
				}
			});
			return result;
    	};
    	
    	var createNode = function(parent, data, level) {
    		var node_key = pin.id + "_key" + key;
    		nodes[node_key] = data;	//data 저장
    		
    		//노드 추가전 사용자 작업
    		var title = $("<a href=\"#\" role=\"title\" onclick=\"return false;\">" + data[pin.node.header] + "</a>");
    		var anchor = $("<a href=\"#\" class=\"ico\" onclick=\"return false;\">열기/닫기</a>");
    		pin.events.BeforeAddNode({
				key: node_key,
				a: title,
				data: data
			});
    		
    		var node = $("<li level=\"" + level + "\"></li>").append(anchor).append(title).attr("id", node_key);
    		if (pin.properties.checkbox) {
    			title.before("<input type=\"checkbox\" />");
    		};
    		title.click(function() {
				var ul = $(this).parent().find(">ul");
				var n = pin.functions.GetNode({ key: node_key });
				pin.functions.SelectNode({ key: node_key });
				pin.events.NodeClick(pin.functions.GetNode({ key: node_key }));
			});
    		anchor.click(function() {
    			var ul = $(this).parent().find(">ul");
    			var n = pin.functions.GetNode({ key: node_key });
    			pin.events.AnchorClick(pin.functions.GetNode({ key: node_key }));
    			if (ul.css("display") == "block") {
					n.Collapse();
				} else {
					n.Expand();
				};
    		});
    		var ul = parent.find(">ul");
    		var leaf_yn = data[pin.properties.leaf_name];
			if (ul.length != 1) {
				ul = $("<ul></ul>").hide();
				parent.append(ul);
			};
			ul.append(node);
			if (leaf_yn == "N") {
				node.addClass("leaf");
			};
			parent.addClass("leaf");
			key++;			
			return node;
    	};
    	
    	var checkLastNode = function(p) {
    		var siblings = p.parent.find(">ul>li");
    		siblings.filter(".last").removeClass("last");
    		siblings.filter(":last").addClass("last");    		
    	};
		
		$.extend(pin.functions, {
			AddNode: function(p) {								
				var parent = null;
				if (p.root) {
					parent = root;
				} else if (p.key != "") {
					parent = $("#" + p.key);
				} else {
					var selected = pin.functions.SelectedNode();
					if (selected != null) {
						parent = $("#" + selected.Key);
					} else {
						parent = root;
					};
				};
				var parent_node = pin.functions.GetNode({ key: parent.attr("id") });
				var level = 1;
				if (parent_node != null && $.type(parent_node.Level) != "undefined") {
					level = parseInt(parent_node.Level, 10) + 1;
				};
				var datas = [];
				var message = null;
				if (p.action != "") {
					var result = searchData(p);
					message = result.message;
					datas = result.records;
				} else {
					datas = [ p.data ];
				};
				var node = null;
				$.each(datas, function(i, data) {
					node = createNode(parent, data, level);
				});
				if (parent_node != null) {
					parent_node.Expand();					
				};
				pin.events.EndAddNode(message || {});
				if (p.action == "") {
					node = pin.functions.GetNode({ key: node.attr("id") });
					if (parent_node != null) {
						pin.functions.SelectNode({ key: parent_node.Key, index: node.Index });	
					} else {
						pin.functions.SelectNode({ index: node.Index });
					};
				};
				checkLastNode({ parent: parent });
				return node;
			},
			AddNodes: function(p) {				
				var result = searchData(p);
				var records = result.records;
				var message = result.message;				
	    		var level_name = pin.properties.level_name;
	    		var parent = null;
	    		var previous_item = null; 
	    		var current = 0;
	            var previous = 0;
	            var level = 0;
	            $.each(records, function(i, data) {
	            	current = data[level_name];	            	
	            	if (previous < current) {	//하위에 노드 추가(parent가 바뀜)	            		
	    				if (previous_item != null) {
	                        parent = previous_item;
	                        level = parent.Level + 1;
	                    } else {
	                    	parent = root;
	                    	level = 1;
	                    };
	    			} else if (previous > current) {	//previous - current 만큼의 위로 올라감	    				
	    				var up = previous - current;
	    				for (var j = 0 ; j < up ; j++) {
	    					parent = parent.parent().parent();
	    				};
	    				level = level - up;
	    			};
	    			previous_item = createNode(parent, data, level);
	    			previous_item.Level = level;	    			
	    			previous = current;
	            });
	            checkLastNode({ parent: parent });
	            pin.functions.SelectNode({ index: 0 });
	            pin.events.EndAddNodes(message);
			},
			SelectedNode: function(p) {
				var node = root.find(".active");
				if (node.length == 0) {
					return null;
				} else {
					return pin.functions.GetNode({ key: node.attr("id") });
				}
			},
			SelectNode: function(p) {				
				var node = null;
				if ($.type(p.index) == "number") {
					var parent = null;
					if ($.type(p.key) == "undefined" || p.key == "") {
						parent = root;
					} else {
						parent = $("#" + p.key);
					};
					node = parent.find(">ul>li").eq(p.index);
				} else {	//index가 없다면 해당 node를 선택한다.
					node = $("#" + p.key);
				};
				root.find(".active").removeClass("active");
				node.addClass("active");
				
				var postionTop = this.ShowNode(p); //해당 노드가 숨어 있다면 부모 노드들을 모두 expand 시켜준다.
				if (postionTop > root.height()) {					
					root.scrollTop(postionTop);
				};
			},
			ShowNode: function(p) {	//해당 노드를 expand 시켜준다.				
				var p = $.extend({ key: "" }, p || {});
				var postionTop= 0;
				var key = p.key;
				var n = $("#" + key);
				n.parent().show();
				var up = n.parent().parent();
				if ($.type(up.attr("id")) != "undefined" && up.attr("id") != root.attr("id")) {
					this.ShowNode({ key: up.attr("id") });
				};
				if (n.position() != null) {
					postionTop += n.position().top						
				};
				return postionTop;
			},
	        DoQuery: function (p) {},
	        GetNode: function(p) {
	        	var node_key = p.key;
	        	var node = $("#" + node_key);
	        	var data = nodes[node_key];
	        	if ($.type(data) != "object") {
	        		return null;
	        	};
	        	
	        	var parent_key = node.parent().parent().attr("id");
	        	var parent = null;
	        	if ($.type(nodes[node_key]) == "object") {
	        		parent = pin.functions.GetNode({ key: parent_key });	        		
	        	};	  
	        	return {
					Key: node_key,
					Get: function(binding) {
						return data[binding];
					},
					Count: node.find(">ul>li").length,
					Index: node.parent().parent().find(">ul>li").index(node),
					Parent: parent,
					Level: node.attr("level"),
					Expand: function() {
						var leaf_yn = null;
						if ($.type(pin.properties.leaf_name) == "string" && $.type(pin.properties.leaf_name) != "") {	//LEAF_YN 검사
							leaf_yn = data[pin.properties.leaf_name];
						};
						var count = node.find(">ul>li").length;						
						if (count > 0 || leaf_yn == "N") {
							node.removeClass("leaf");
							node.addClass("open");
							node.find(">ul").show();							
						};
					},
					IsExpand: function() {
						if (node.hasClass("open")) {
							return true;
						} else {
							return false;
						};
					},
					Collapse: function() {						
						node.removeClass("open");
						node.addClass("leaf");
						node.find(">ul").hide();
					},
					Checked: pin.properties.checkbox && node.find(">input:checked").length == 1 ? true : false
				};
	        },
	        GetChildren: function(p) {
	        	var parent = null;
	        	if (p.key == "") {
	        		parent = root;
	        	} else {
	        		parent = $("#" + p.key);
	        	};
	        	var children = [];
	        	parent.find(">ul>li").each(function(i, li) {
	        		children.push(pin.functions.GetNode({ key: li.id }));
	        	});
	        	return children;
	        },
	        ClearNodes: function(p) {
	        	if (p.key == "") {
	        		root.find(">ul>li").remove();
	        	} else {
	        		$("#" + p.key).find(">ul>li").remove();
	        	};
	        },
	        RemoveNode: function(p) {
	        	var node = pin.functions.GetNode({ key: p.key });	        	
	        	$("#" + p.key).remove();	        	
	        	checkLastNode({ parent: node.Parent != null ? $("#" + node.Parent.Key) : root });
	        },
			SetData : function(p) {
				var node = nodes[p.key];				
				$.each(p.data, function(k, v) {					
					node[k] = v;					
				});
				$("#" + p.key).find(">a").text(node[pin.node.header]);
			},
			//이전 검색 정보를 저장
			SearchNodesResult: { selectedkey: "", a_index: -1, searched_key: "" },		//노드 검색결과 저장
			SearchNodes: function(p) {
				
				var results = root.find("a:contains('" + p.keyword + "')");	  //해당 검색어에 대한 검색 결과
				
				if (results.length > 0) {	  //검색결과가 있다면 이전 검색 결과 조회
					
					var a_index = this.SearchNodesResult.a_index;
					
					var selected_node = this.SelectedNode();	//현재선택되어 있는 노드 찾기
					if (this.SearchNodesResult.selectedkey != selected_node.Key) {	//이전 검색시 선택된 노드와 비교
						var li = $("#" + selected_node.Key);		//해당 li 요소
						var li_index = root.find("li").index(li);
						var sub_results = root.find("li:gt(" + li_index + ")").find("a:contains('" + p.keyword + "')");	  //해당 li 이후로 검색
						sub_results.each(function() {			
							a_index = results.index(this) - 1;							
							return false;
						});
					};
					
					a_index++;				
					if ((results.length <= a_index)) {
						a_index = 0;
					};
					var result = $(results[a_index]);
					
					//이전 검색 결과 bold체 복구
					$("#" + this.SearchNodesResult.searched_key).find(">a").each(function() {
						$(this).html($(this).html().replace(/<(\/*)b>/gi, ""));
					});
					result.html(result.text().replace(new RegExp(p.keyword, "gi"), "<b>" + p.keyword + "</b>"));
					
					this.SearchNodesResult.selectedkey = selected_node.Key;
					this.SearchNodesResult.a_index = a_index;
					this.SearchNodesResult.searched_key = result.parent().attr("id");
					
					this.ShowNode({ key: this.SearchNodesResult.searched_key });	//검색된 노드를 보이도록  expand 한다.
					result.focus();
				} else {
					alert("검색된 결과가 없습니다.");
				};
			}
		});
	};
})(jQuery);