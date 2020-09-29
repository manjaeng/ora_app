//절때 밖으로 빼지 마시오. - 장진철.
var CKEDITOR_BASEPATH = '/common/ckeditor/';   // * 고정 

(function($) {
	
	//overpass 는 fckeditor에서 사용하던 함수를 호춤 함으로 따로 작성하여 호출한다.
	if(!window.OnUploadCompleted){
		OnUploadCompleted = function(CKEditorFuncNum,url,arg,msg){
			CKEDITOR.tools.callFunction(CKEditorFuncNum, url, msg);
		}
	}
	
	
	var browser = (function() {
	    var s = navigator.userAgent.toLowerCase();
	    var match = /(webkit)[ \/](\w.]+)/.exec(s) ||
	                /(opera)(?:.*version)?[ \/](\w.]+)/.exec(s) ||
	                /(msie) ([\w.]+)/.exec(s) ||
	               !/compatible/.test(s) &&  /(mozilla)(?:.*? rv:([\w.]+))?/.exec(s) ||
	               [];
	    return { name: match[1] || "", version: match[2] || "0" };
	}());
	
	
	var editor = {};
	var editors = [];
	var _callback_ = null;

	$.ajax({
		url: "/common/ckeditor/ckeditor.js",
		dataType: "script",
		async: false,
		error: function() {
			alert("에디터 정보를 load 할 수 없습니다.");
		},
		success : function(){
			
		}
	});
	
	$.fn.createEditor = function(pin, callback) {
		_callback_ = callback;
		try {
			this.each(function() {	//설정
				var editor_div = $(this);
				var editor_id = this.id;
				var textarea = editor_div.find(">textarea");
				var textarea_id = textarea.attr("id");
				var textarea_name = textarea.attr("name");
				textarea.attr({
					id: "ck_" + textarea_id,
					name: "ck_" + textarea_name
				});
								
				var p = $.extend({
					editor_id: editor_id,
					textarea_id: textarea_id,
					textarea_name: textarea_name,
					edit: true,
					init: null,
					width: "100%",
					height: null,			
					dir_name:	"",
					img_url: "",
					toolbar: "Default"
				}, pin[editor_id] || {});
				
				//fckeditor는 에디터 전체 사이즈가 조절되었으나. ckeditor에서는 textarea영역으로 사이즈 조절됌.
				//또한 editor를 싸고 div테그에 높이를 지정해 주면 fckeditor는 자동으로 높이 조절이 되었으나 ckeditor는 안됌.
				
				
				if (!p.edit) {	//편집모드 설정
					p.toolbar = "Preview";
				};
				if ($.trim(p.dir_name) == "") {
					throw "이미지 저장 경로가 올바르지 않습니다.[ckeditor]";				
				};
				if ($.trim(p.img_url) == "") {
					throw "이미지 URL이 올바르지 않습니다.[ckeditor]";
				};
				editor[editor_id] = {
					init: p.init,
					edit: p.edit,
					textarea_id: textarea_id,
					textarea_name: textarea_name
				};

				editors.push(p);
			});
			create(pin);		
			return editor;
		} catch(e) {
			alert(e);
		}
	};
	
	var create = function(pin) {
		if (editors.length == 0) {	//더이상 만들 editor가 없다.
			if (typeof _callback_ == "function") {
				_callback_();
			};
		};		

		$.each(editors, function() {
			
			var p = this;
			var ckeditor = CKEDITOR.replace("ck_" + p.textarea_id ,{
				customConfig: "/common/ckeditor/config.js",
				toolbar : p.toolbar,
				width: p.width,
			//	height: [*수정 금지]	// * 에디터 height 조절은 CKEDITOR.on('instanceReady', function(e) { }); 에서 한다. 
				resize_enabled : false,
				removePlugins: 'elementspath',
		 	    language : 'ko',
		 	    filebrowserUploadUrl : "/common/uploadFCKeditorImage.action?dir_name=" + p.dir_name + "&img_url=" + p.img_url,
		 	    on : {instanceReady : function(e) {
		 	    	if(typeof CKEDITOR.instances[p.editor_id] != 'undefined') {
		 	    	    CKEDITOR.instances[p.editor_id].updateElement();
		 	    	    CKEDITOR.instances[p.editor_id].destroy();
		 	    	}

		 	    	// tags 에 있는 태그들의 들여쓰기(indent)를 하지 않도록 설정한다.
		 	    	// 들여쓰기가 <li>&nbsp;&nbsp;&nbsp;</li> 태그로 자동변환되어 불필요한 태그가 생성되면서 html 소스 용량이 증가하는 것을 방지한다.
		 	    	var tags = ['p', 'ol', 'ul', 'li', 'h1', 'h2', 'h3', 'h4'];

					for (var key in tags) {
						this.dataProcessor.writer.setRules(tags[key],
						{
							indent : false
						});
					}
		 	    	
		 	    	var editor_id = p.editor_id;
		 	    	var pin = {};
		 	    	pin[p.editor_id] = p;
		 	    	//var editor = pin[p.editor_id] = p;		 	    	

		 	    	var $wrap_div = $("#"+e.editor["name"]).parent();
					var editor_id = $wrap_div.attr("id");
					var originalData = CKEDITOR.instances[e.editor["name"]].getData();
					
						
						//에디터 크기(높이) 조절은 여기서 한다.
					if(pin[editor_id].height){
						
						var height  = pin[editor_id].height;
						
						if(typeof(height) == "string" && height.indexOf("px") > -1){
							height = Number(height.replace("px",""));
						}				
			            e.editor.resize("100%", height);		
			            
					}else{
						
						if($wrap_div[0].clientHeight== 0){
						
							var clearIntervarId = setInterval(function(){

								e.editor.resize("100%", $wrap_div.css("height").replace("px",""));
	
								if($wrap_div[0].clientHeight> 0){
									clearInterval(clearIntervarId);
								}
							},500);

						}else{
							e.editor.resize("100%", $wrap_div[0].clientHeight);
						}
					}
						

					
					editor[editor_id] = $.extend(pin, {
						getData : function() {
							return CKEDITOR.instances[e.editor["name"]].getData();
						},
						setData : function(v) {
							CKEDITOR.instances[e.editor["name"]].setData(v);					
						},
						convert : function() {
							var field_id = pin[editor_id].textarea_id;
							var field_name = pin[editor_id].textarea_name;
							var editor_div = $("#" + editor_id);
							var input = editor_div.find("#" + field_id);
							if (input.length == 0) {
								input = $("<input type=\"hidden\" name=\"" + field_name + "\" id=\"" + field_id + "\"></input>");
								editor_div.append(input);
								input = editor_div.find("#" + field_id);
							};
							input.val(CKEDITOR.instances[e.editor["name"]].getData());
						},
						clear: function() {
							CKEDITOR.instances[e.editor["name"]].setData("");
						},
						isEmpty : function() {
							var content = CKEDITOR.instances[e.editor["name"]].getData(); 
							if (content.trim() == "") {
								return true;
							} else {
								return false;
							};
						},
						isChanged : function() {

							if (
								!e.editor.readOnly &&
								browser.name == "msie" &&
								(browser.version == "8.0" || browser.version == "9.0" || browser.version == "10.0") 
								&& CKEDITOR.instances[e.editor["name"]].getData() == ""
							) {	//ie이고 초기값이 ""일 경우...
								return !(originalData == CKEDITOR.instances[e.editor["name"]].getData()); 
							} else {
								return CKEDITOR.instances[e.editor["name"]].checkDirty() ;	
							};
						},
						focus : function(){
							CKEDITOR.instances[e.editor["name"]].focus();
						}
					});
					
					if (pin[editor_id].hasOwnProperty("edit") && !pin[editor_id].edit) {		//편집안됨..
						e.editor.setReadOnly( true );
					};
					
					
					if (pin[editor_id].init != null) {
						pin[editor_id].init();
					};
					create(pin);

				}}
		 	});
			editors = editors.slice(1, editors.length);		//처리된 editor는 지운다.			

			return false;			
			
		});
	};
}(jQuery));