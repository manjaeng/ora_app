(function($) {
	var editor = {};
	var editors = [];
	var _callback_ = null;

	$.ajax({
		url: "/common/fckeditor/fckeditor.js",
		dataType: "script",
		async: false,
		error: function() {
			alert("에디터 정보를 load 할 수 없습니다.");
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
					id: "fck_" + textarea_id,
					name: "fck_" + textarea_name
				});
				
				var p = $.extend({
					editor_id: editor_id,
					textarea_id: textarea_id,
					edit: true,
					init: null,
					width: '100%',
					height: '100%',			
					dir_name:	"",
					img_url: "",
					toolbar: "Default"
				}, pin[editor_id] || {});
				
				if (!p.edit) {	//편집모드 설정
					p.toolbar = "Preview";
				};
				if ($.trim(p.dir_name) == "") {
					throw "이미지 저장 경로가 올바르지 않습니다.[FCKeditor]";				
				};
				if ($.trim(p.img_url) == "") {
					throw "이미지 URL이 올바르지 않습니다.[FCKeditor]";
				};
				editor[editor_id] = {
					init: p.init,
					edit: p.edit,
					textarea_id: textarea_id,
					textarea_name: textarea_name
				};
				editors.push(p);
			});
			create();		
			return editor;
		} catch(e) {
			alert(e);
		}
	};
	
	var create = function() {
		if (editors.length == 0) {	//더이상 만들 editor가 없다.
			if (typeof _callback_ == "function") {
				_callback_();
			};
		};
		if (typeof(FCKeditor_OnComplete) == "undefined" || $.type(FCKeditor_OnComplete) != "function") {
			FCKeditor_OnComplete = function(e) {
				var editor_id = e.Config["editor_id"];
				if (!editor[editor_id].edit) {		//편집안됨..
					e.EditorDocument.designMode = "off";					
				};
				
				editor[editor_id] = $.extend(editor[editor_id], {
					getData : function() {
						return e.GetXHTML();
					},
					setData : function(v) {
						e.SetHTML(v);					
					},
					convert : function() {
						var field_id = editor[editor_id].textarea_id;
						var field_name = editor[editor_id].textarea_name;
						var editor_div = $("#" + editor_id);
						var input = editor_div.find("#" + field_id);
						if (input.length == 0) {
							input = $("<input type=\"hidden\" name=\"" + field_name + "\" id=\"" + field_id + "\"></input>");
							editor_div.append(input);
							input = editor_div.find("#" + field_id);
						};
						input.val(e.GetXHTML());
					},
					clear: function() {
						e.SetHTML("");
					},
					isEmpty : function() {
						var content = e.GetXHTML();
						if (content.trim() == "") {
							return true;
						} else {
							return false;
						};
					},
					isChanged : function() {
						if (e.EditMode == 0 && $.browser.msie && e.StartupValue == "") {	//ie이고 초기값이 ""일 경우...
							return !(e.EditorDocument.body.innerHTML == "<P></P>"); 
						} else {
							return e.IsDirty();	
						};
					}					
				});
				if (editor[editor_id].init != null) {
					editor[editor_id].init();
				};
				create();
			};
		};
		$.each(editors, function() {
			var p = this;
			var fckeditor = new FCKeditor("fck_" + p.textarea_id, null, null, p.toolbar);
			fckeditor.Config["CustomConfigurationsPath"] = "/common/fckeditor/fckeditor.overpass.config.js";	//FCKeditor 설정 적용		
			fckeditor.Config["Params"] = "dir_name=" + p.dir_name + "&img_url=" + p.img_url;	//FCKeditor 설정 적용
			fckeditor.Config["editor_id"] = p.editor_id;
			fckeditor.BasePath = "/common/fckeditor/";
			fckeditor.Width = p.width;
			fckeditor.Height = p.height;
			fckeditor.ReplaceTextarea();
			editors = editors.slice(1, editors.length);		//처리된 editor는 지운다.			
			return false;
		});
	};
}(jQuery));