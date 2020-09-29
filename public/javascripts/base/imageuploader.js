(function ($) {
	$.fn.createImageUploader = function(pin) {
		return this.each(function() {	//HTMLDivElement의 jQuery 객체
			var div = this;	// HTMLDivElement
			var uploader_type = (function() {
				pin = $.extend({
					uploader_type: (function() {
						var type = OVERPASS.UPLOADER.SILVERLIGHT.type;
						if (window.FormData != undefined && window.FileReader != undefined && window.Image != undefined && document.createElement("canvas").getContext != undefined) {	//javascript를 지원할 수 있는지 확인
							type = OVERPASS.UPLOADER.JS.type;
						};
						return type;
					})(),
					id: "image_uploader_" + div.id,
					div_id: div.id,								
					api: $.extend({}, $.fn.imageuploader.functions)
				}, pin || {});
				return pin.uploader_type;
			})();
			
			pin.properties = $.extend({	//이미지업로더 속성 기본값
				type: "A",				
	        	width: $(div).width(),
	        	img_divi_cd_combo: [],
	        	color_no_combo: [],
	        	min_width: 0,
	        	min_height: 0
	        }, pin.properties || {});
			
			pin.functions = {};
			pin.events = $.extend({}, $.fn.imageuploader.events, pin.events, {
				EndLogin: function(message) {
					var p = { message: message.error_message };
					goAlertIndex(p);
				}	
			});
			
			var def = {
	    		action: "",                        		
	    		params: {},                        		
	    		mode: "Q",
	    		url: "",
	    		alert: true
	        };
			
			if (uploader_type == OVERPASS.UPLOADER.SILVERLIGHT.type) {
				OVERPASS.UPLOADER.SILVERLIGHT.create(pin);				
			} else if (uploader_type == OVERPASS.UPLOADER.JS.type) {
				OVERPASS.UPLOADER.JS.create(pin);
			};
			
			$.extend(pin.api, {
				AddImages: function(p) {
					var chip_count  = 0;					
					p = $.extend({ images: [] }, p);
					if (pin.properties.type == "A") {
						p.opt_val_nm = "XXX";
					} else if (pin.properties.type == "B") {
						if ($.type(p.opt_val_nm) != "string" || $.trim(p.opt_val_nm) == "") {
							alert("opt_val_nm 정보가 올바르지 않습니다.");
							return false;
						};
					};
					$.each(p.images, function(i, image) {
						p.images[i] = $.extend({ goods_no: "", img_seq: "", img_divi_cd: "", img_url: "", color_no: "", chip_yn: "N", width: 0, height: 0 }, image);
						if (p.images[i].goods_no != ""&& p.images[i].img_seq != "") {
							p.images[i].crud = "R";
						} else {
							p.images[i].crud = "C";
						};
						if (p.images[i].chip_yn == "Y") {
							chip_count++;
						};
					});
					if (pin.properties.type == "B" && chip_count > 1) {
						alert("이미지칩은 2개 이상 등록할 수 없습니다.");
						return false;
					};
					pin.functions.AddImages(p);
				},				
				ChangeColorCombo: function(p) {
					p = p || {};
		        	pin.functions.ChangeColorCombo(p);
				},
				GetImages: function(p) {
					p = p || {};
		        	return pin.functions.GetImages(p);
				},
				SetImage: function(p) {
					p = p || {};
					p.col = +p.col;
		        	pin.functions.SetImage(p);
				},				
				DoSave: function (p) {
					p = $.extend(def, p || {});
					if (typeof p.action == "undefined" || p.action == null || p.action == "") {
	            		alert("action 미지정");
	            		return false;
	            	};
	            	if (p.action.indexOf("http") < 0) {
	                    p.action = window.location.protocol + "//" + window.location.hostname + p.action;
	                };
	        		p.mode = "S";
	        		pin.functions.DoSave(p);
		        },
		        Clear: function (p) {
		        	p = p || {};
		        	pin.functions.Clear(p);
		        }				
			});
			
			if (uploader_type == OVERPASS.UPLOADER.JS.type) {
	        	setTimeout(function() { pin.events.Initialize(); }, 50);
	        };
		}).extend(pin.api);
	};

})(jQuery);