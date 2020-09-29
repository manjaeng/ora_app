(function ($) {
	$.fn.createTree = function(pin) {
		return this.each(function() {	//HTMLDivElement의 jQuery 객체
			var div = this;	// HTMLDivElement
			pin = $.extend({
				node: {},
				events: {},
				id: "tree_" + div.id,
				div_id: div.id,
				api: $.extend({}, $.fn.tree.functions)
			}, pin || {});
			
			pin.node = $.extend({ header:"", bindings:[] }, pin.node || {});
			
			pin.properties = $.extend({            	
	        	checkbox: false,
	        	level_name: "LEVEL",
	        	close_layer: true
	        }, pin.properties || {});
			
			if ($.trim(pin.node.header) == "") {
				alert("트리뷰 노드의 헤더정보가 없습니다.");
				return;
			};
			
			if (pin.node.bindings.length == 0) {
				alert("트리뷰 노드의 바인딩 정보가 없습니다.");
				return;
			}; 
			
			var checkHeader = false;
			
			for(var i = 0 ; i < pin.node.bindings.length ; i++) {
				if (pin.node.bindings[i] == pin.node.header) {
					checkHeader = true;
					break;
				};
			};
			
			if (!checkHeader) {
				alert("바인딩 정보내에 헤더정보가 없습니다.");
				return;
			};
			
			pin.functions = {};
			pin.events = $.extend({}, $.fn.tree.events, pin.events, {
				EndLogin: function(message) {
					var p = { message: message.error_message };
					goAlertIndex(p);
				}	
			});
			
			_createTree(pin);
			
			$.extend(pin.api, {
				AddNode: function(p) {
					p = $.extend({
	            		root: false,
	            		key: "", 
	            		data: {},
	            		action: "",
	            		params: {}
	            	}, p || {});
	            	if (p.action != "" && p.action.indexOf("http") < 0) {
	    				p.action = window.location.protocol + "//" + window.location.hostname + p.action;
	                };
	                return pin.functions.AddNode(p);
				},
				AddNodes: function(p) {
					p = $.extend({ key: "", action: "",  params: {}}, p || {});
	            	if (p.action == "") {
	            		alert("action값이 존재하지 않습니다.");
	            		return false;
	            	};
	            	if (p.action != "" && p.action.indexOf("http") < 0) {
	    				p.action = window.location.protocol + "//" + window.location.hostname + p.action;
	                };
	                pin.functions.AddNodes(p);
				},
				SelectedNode: function(p) {
					p = {} || p;
	            	return pin.functions.SelectedNode(p);
				},
				SelectNode: function(p) {
					p = $.extend({ key: ""}, p || {});
	            	if ($.type(p.index) == "string") {
	            		p.index = parseInt(p.index, 10);
	            	};
	            	pin.functions.SelectNode(p);
				},
		        GetNode: function(p) {
		        	p = $.extend({ key: "" }, p || {});
	            	if (p.key == "") {
	            		alert("Key값이 존재하지 않습니다.");
	            		return false;
	            	};
	            	return pin.functions.GetNode(p);
		        },
		        GetChildren: function(p) {
		        	p = $.extend({ key: "" }, p || {});
	            	return pin.functions.GetChildren(p);
		        },
		        ClearNodes: function(p) {
		        	p = $.extend({ key: "" }, p || {});
		        	pin.functions.ClearNodes(p);
		        },
		        RemoveNode: function(p) {
		        	p = $.extend({ key: ""}, p || {});
		        	pin.functions.RemoveNode(p);
		        },
		        SetData: function(p) {
		        	p = $.extend({ key: "", action: "", params: {} }, p || {});
	            	if (p.key == "") {
	            		alert("Key값이 존재하지 않습니다.");
	            		return false;
	            	};
	            	if (p.action != "" && p.action.indexOf("http") < 0) {
	    				p.action = window.location.protocol + "//" + window.location.hostname + p.action;
	                };
	                pin.functions.SetData(p);
				},
				SearchNodes: function(p) {
					p = $.extend({ keyword: "" }, p || {});                        	
	            	if ($.trim(p.keyword) == "") {
	            		alert("검색어를 입력하세요!");
	            		return false;
	            	};
	            	pin.functions.SearchNodes(p);
				}
			});
			setTimeout(function() { pin.events.Initialize(); }, 50);
		}).extend(pin.api);
	};
})(jQuery);