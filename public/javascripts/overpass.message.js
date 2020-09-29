(function($) {
	//메세지 영역
	window.M = {
		use: function(pkg) {
			if ($.type(this[pkg]) != "object") {
				//기본 메세지 파일 load
				var m = {};
				$.ajax({
					url: "/common/js/i18n/" + pkg + "/" + pkg + ".js",
					dataType: "script",
					async: false,
					complete: function() {
						if ($.type(window.M[pkg]) == "object") {
							m = window.M[pkg];
							window.M[pkg] = null;
						};
					},
					error: function() {}
				});
				if (OVERPASS.country != "") {
					$.ajax({
						url: "/common/js/i18n/" + pkg + "/" + pkg + "_" + OVERPASS.language + "_" + OVERPASS.country + ".js",
						dataType: "script",
						async: false,
						complete: function() {},
						error: function() {}
					});
				};
				if ($.type(window.M[pkg]) != "object") {	//메세지가 아직 load 되지 않았다.
					$.ajax({
						url: "/common/js/i18n/" + pkg + "/" + pkg + "_" + OVERPASS.language + ".js",
						dataType: "script",
						async: false,
						complete: function() {},
						error: function() {}
					});
				};
			};			
		}
	};
	
	fnGetI18nMessge = function(code) {
        var value = eval(code.replaceAll(" ", ""));
        
        if (typeof(value) == "string" ) {
        	return value;
        } else {
        	var arrCode = code.split("."); 
            value = arrCode[arrCode.length-1];
        }
        
        return value;
	};
	
})(jQuery);