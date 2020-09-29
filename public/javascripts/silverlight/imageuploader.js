(function ($) {
	OVERPASS.UPLOADER.SILVERLIGHT.create = function(pin) {
		
		var VERSION = "1.0.6";
		
		var div_id = pin.div_id;
		var div = document.getElementById(div_id);	// HTMLDivElement
		
		Silverlight.createObjectEx({
			source: "/common/xap/ImageUploader.xap#version=" + VERSION,
            parentElement: div,
            id: pin.id,                
            properties: {
                width: "100%",
                height: "100%",
                background: "white",
                enableHtmlAccess:"true",
                //windowless:"true",
                //alt: "<!--not installed-->",	<--해당 버전의 실버라이트가 설치되어 있지 않을 경우 처리방법 기술...
                version: OVERPASS.SILVERLIGHT.VERSION
            },
            events: {
            	onError: function (sender, args) {
            		alert("ErrorCode : " + args.ErrorCode + "\nErrorMessage : " + args.ErrorMessage + "\nErrorType : " + args.ErrorType);
                },
                onLoad: function (sender, args) {
                	var u = document.getElementById(pin.id);                   	                    	
                	var scriptable = sender.Content[sender.id]; 	//Silverlight ImageUploader내 호출가능한 Object
                	u.upper_item_no = {};
                	
                	//이벤트 셋팅
                	$.each(pin.events, function(name, event) {
                		u[name] = event;
                	});
                	
                	var DoSubmit = function(p) {
                        scriptable.run("DoSubmit", JSON.stringify(p));                    		
                	};
                	
                	u.EndUpload = function(message) {
                		alert(message);
                	};
                	u.ResizeDiv = function(div_id, height) {
                		$("#" + div_id).height(height);
                	};
                	
                	$.extend(pin.functions, {
                		AddImages: function(p) {                			
                			scriptable.run("AddImages", JSON.stringify(p));
                		},                		
                		ChangeColorCombo: function(p) {
                			scriptable.run("ChangeColorCombo", JSON.stringify(p));
                		},
                		GetImages: function(p) {
                			return scriptable.run("GetImages", JSON.stringify(p));
                		},
                		SetImage: function(p) {
                			scriptable.run("SetImage", JSON.stringify(p));
                		},                    	
                    	DoSave: function(p) {
                    		DoSubmit(p);                  		
                    	},                    	
                    	Clear: function(p) {
                    		scriptable.run("Clear", JSON.stringify(p));
                    	}
                	});                	
                	pin.properties.div_width = $(div).width();	//화면 로딩시 해당 이미지 업로더가 브라우저에 노출되지 않을 경우 내부적으로  layout의 width값이 0 이기 때문에 넘겨주자...
                	scriptable.run("Initialize", JSON.stringify(pin));	//초기화(트리뷰 바디) 
                }
            },
            initParams: "id=" + pin.id + ",div_id=" + pin.div_id		//,로 구분 
		});
	};
})(jQuery);