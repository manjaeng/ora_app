// ActiveX 파일 설치 URL 환경에 맞춰 변경하면 됨.
var vSoftphone_InstallPageURI = "http://ubase.co.kr/softphone/2112/sp_01.htm";

// 버전 입력(현재 사용안함 PxAPI 버전 체크 기능이 있어야 사용가능.. 현재 불가능..)
var vPxAPI_Version = "2.1.1.2";

var vUBRec_Version = "1.1.0.0";

var vVtmActiveXCtrl_Version = "1,0,0,0";

(function(win) { 
    win.SPOperators = {};
    win.RECOperators = {};
    win.RECVtmOperators = {};
    win.isIE = function() {
        if (navigator.appName == "Microsoft Internet Explorer") return true;
        else if (navigator.userAgent.indexOf("Trident") >= 0) return true;
        else return false;
    };
    win.isOverIE11 = function() {
        var vPosBegin = navigator.userAgent.indexOf("Trident/");
        if (vPosBegin >= 0) {
            var vPosEnd = navigator.userAgent.indexOf(";", vPosBegin + "Trident".length + 1);
            var vTridentVer = parseFloat(navigator.userAgent.substring(vPosBegin + "Trident".length + 1, vPosEnd));
            if (vTridentVer >= 7.0) {
                return true;
            }
        }
        return false;
    };

    function isChrome() {
        if (navigator.userAgent.indexOf("Chrome") >= 0 && navigator.userAgent.indexOf("Safari") >= 0) {
            return true;
        }
        false;
    };

    function isSafari() {
        if (navigator.userAgent.indexOf("Chrome") < 0 && navigator.userAgent.indexOf("Safari") >= 0) {
            return true;
        }
        return false;
    };

    function isDefined(obj) {
        return !(typeof obj === "undefined" || obj === null || obj == "");
    };

    function checkConfigValues() {
        if (!isDefined(vSoftphone_InstallPageURI)) return false;
        
        return true;
    };

    function getObject(id) {
        return document.getElementById(id);
    };

    win.CreatePxAPI_Operator = function(config) {
        if (!isDefined(config)) {
            return;
        }
        if (!checkConfigValues()) {
            if (vSoftphone_InstallPageURI != "") {
                alert("ActiveX 설치 URL이 없습니다. activex.js 파일을 확인해주세요.");
                return;
            }
        }
        var container = getObject(config.ContainerID);
        if (!container) {
            alert("containerID가 없습니다. 확인 해주세요.");
            return;
        }
        if (!isDefined(config.ElementID)) {
            alert("Element ID가 없습니다. 확인 해주세요.");
            return;
        }
        var style = container.style || {};
        var vWidth = 0,
            vHeight = 0;
        if (("width" in style) && (style.width != "")) {
            vWidth = style.width;
            if ((vWidth != "") && (vWidth[vWidth.length - 1] == "%")) {
                vWidth = "100%";
            }
        } else {
            vWidth = "100%";
        }
        if (("height" in style) && (style.height != "")) {
            vHeight = style.height;
            if ((vHeight != "") && (vHeight[vHeight.length - 1] == "%")) {
                vHeight = "100%";
            }
        } else {
            vHeight = "100%";
        }
        var objectElement = document.createElement("object");
        objectElement.setAttribute("width", vWidth);
        objectElement.setAttribute("height", vHeight);
        var paramElement = null;
        paramElement = document.createElement("param");
        paramElement.setAttribute("name", "VersionInScript");
        paramElement.setAttribute("value", vPxAPI_Version);
        objectElement.appendChild(paramElement);
        for (var propName in config) {
            paramElement = document.createElement("param");
            paramElement.setAttribute("name", propName);
            paramElement.setAttribute("value", config[propName]);
            objectElement.appendChild(paramElement);
        }
        objectElement.setAttribute("id", config.ElementID);
        if (isIE()) {
            objectElement.setAttribute("classid", "CLSID:1393D186-65F9-4C13-A451-2056C4BE93CE");
        }
        //objectElement.setAttribute("codebase", "http://ubase.co.kr/softphone/2112/PxAPI.cab#version=2,1,1,2");
		objectElement.setAttribute("codebase", "/common/js/cti/cab/PxAPI.cab#version=2,1,1,2");
        objectElement.Config = config;
        container.appendChild(objectElement);
        win.SPOperators[objectElement.getAttribute("id")] = objectElement;
        if (!isDefined(SPOperators["PxAPI"])) {
            if (vSoftphone_InstallPageURI != "") {
                document.location.href = vSoftphone_InstallPageURI;
                return;
            }
        } else {
        		
            /*
            var vVerSplit_Script, vVerSplit_Module;
            vVerSplit_Script = vPxAPI_Version.split(".");
            vVerSplit_Module = objectElement.NXVersion.split(".");
            if ((vVerSplit_Script.length != 4) || (vVerSplit_Module.length != 4)) {
                if (vSoftphone_InstallPageURI != "") {
                    document.location.href = vSoftphone_InstallPageURI;
                    return;
                }
            } else {
                var vIdx = 0,
                    vVerModule = 0,
                    vVerScript = 0;
                for (vIdx = 0; vIdx < 4; vIdx++) {
                    vVerModule = parseInt(vVerSplit_Module[vIdx]);
                    vVerScript = parseInt(vVerSplit_Script[vIdx]);
                    if (vVerModule < vVerScript) {
                        document.location.href = vSoftphone_InstallPageURI;
                        return;
                    } else if (vVerModule == vVerScript) {
                        continue;
                    } else {
                        break;
                    }
                }
            }*/
        }
        if (isIE()) {
            for (var funcName in objectElement.Config.SPEventFunctions) {
                if (isDefined(objectElement.attachEvent)) {
                    objectElement.attachEvent(funcName, objectElement.Config.SPEventFunctions[funcName]);
                } else {
                    var handler = document.createElement("script");
                    handler.setAttribute("type", "text/javascript");
                    handler.setAttribute("for", objectElement.Config.ElementID);
                    var strArgs = objectElement.Config.SPEventFunctions[funcName].toString();
                    var vBegin = strArgs.indexOf("(");
                    var vEnd = strArgs.indexOf(")");
                    strArgs = strArgs.substring(vBegin, vEnd + 1);
                    handler.event = "" + funcName + strArgs;
                    handler.appendChild(document.createTextNode('SPOperators["' + objectElement.Config.ElementID + '"]' + '.Config.SPEventFunctions["' + funcName + '"]' + strArgs));
                    document.head.appendChild(handler);
                }
            }
        } 
    };
    
    win.CreateUBRec_Operator = function(config) {
        if (!isDefined(config)) {
            return;
        }
        if (!checkConfigValues()) {
            if (vSoftphone_InstallPageURI != "") {
                alert("ActiveX 설치 URL이 없습니다. activex.js 파일을 확인해주세요.");
                return;
            }
        }
        var container = getObject(config.ContainerID);
        if (!container) {
            alert("containerID가 없습니다. 확인 해주세요.");
            return;
        }
        if (!isDefined(config.ElementID)) {
            alert("Element ID가 없습니다. 확인 해주세요.");
            return;
        }
        var style = container.style || {};
        var vWidth = 0,
            vHeight = 0;
        if (("width" in style) && (style.width != "")) {
            vWidth = style.width;
            if ((vWidth != "") && (vWidth[vWidth.length - 1] == "%")) {
                vWidth = "100%";
            }
        } else {
            vWidth = "100%";
        }
        if (("height" in style) && (style.height != "")) {
            vHeight = style.height;
            if ((vHeight != "") && (vHeight[vHeight.length - 1] == "%")) {
                vHeight = "100%";
            }
        } else {
            vHeight = "100%";
        }
        var objectElement = document.createElement("object");
        objectElement.setAttribute("width", vWidth);
        objectElement.setAttribute("height", vHeight);
        var paramElement = null;
        paramElement = document.createElement("param");
        paramElement.setAttribute("name", "VersionInScript");
        paramElement.setAttribute("value", vUBRec_Version);
        objectElement.appendChild(paramElement);
        for (var propName in config) {
            paramElement = document.createElement("param");
            paramElement.setAttribute("name", propName);
            paramElement.setAttribute("value", config[propName]);
            objectElement.appendChild(paramElement);
        }
        objectElement.setAttribute("id", config.ElementID);
        if (isIE()) {
            objectElement.setAttribute("classid", "CLSID:3ABCFAEB-0462-4F2D-BF23-8C443C385325");
        }
       // objectElement.setAttribute("codebase", "http://ubase.co.kr/softphone/2112/UBREC.cab#version=1,1,0,0");
		objectElement.setAttribute("codebase", "/common/js/cti/cab/UBREC.cab");
        objectElement.Config = config;
        container.appendChild(objectElement);
        win.RECOperators[objectElement.getAttribute("id")] = objectElement;
        if (!isDefined(RECOperators["UBASERec"])) {
            if (vSoftphone_InstallPageURI != "") {
                document.location.href = vSoftphone_InstallPageURI;
                return;
            }
        } else {
        		
            /*
            var vVerSplit_Script, vVerSplit_Module;
            vVerSplit_Script = vPxAPI_Version.split(".");
            vVerSplit_Module = objectElement.NXVersion.split(".");
            if ((vVerSplit_Script.length != 4) || (vVerSplit_Module.length != 4)) {
                if (vSoftphone_InstallPageURI != "") {
                    document.location.href = vSoftphone_InstallPageURI;
                    return;
                }
            } else {
                var vIdx = 0,
                    vVerModule = 0,
                    vVerScript = 0;
                for (vIdx = 0; vIdx < 4; vIdx++) {
                    vVerModule = parseInt(vVerSplit_Module[vIdx]);
                    vVerScript = parseInt(vVerSplit_Script[vIdx]);
                    if (vVerModule < vVerScript) {
                        document.location.href = vSoftphone_InstallPageURI;
                        return;
                    } else if (vVerModule == vVerScript) {
                        continue;
                    } else {
                        break;
                    }
                }
            }*/
        }
        if (isIE()) {
            for (var funcName in objectElement.Config.RECEventFunctions) {
                if (isDefined(objectElement.attachEvent)) {
                    objectElement.attachEvent(funcName, objectElement.Config.RECEventFunctions[funcName]);
                } else {
                    var handler = document.createElement("script");
                    handler.setAttribute("type", "text/javascript");
                    handler.setAttribute("for", objectElement.Config.ElementID);
                    var strArgs = objectElement.Config.RECEventFunctions[funcName].toString();
                    var vBegin = strArgs.indexOf("(");
                    var vEnd = strArgs.indexOf(")");
                    strArgs = strArgs.substring(vBegin, vEnd + 1);
                    handler.event = "" + funcName + strArgs;
                    handler.appendChild(document.createTextNode('RECOperators["' + objectElement.Config.ElementID + '"]' + '.Config.RECEventFunctions["' + funcName + '"]' + strArgs));
                    document.head.appendChild(handler);
                }
            }
        } 
    };


	win.CreateVtmRec_Operator = function(config) {
      if (!isDefined(config)) {
          return;
      }
      if (!checkConfigValues()) {
          if (vSoftphone_InstallPageURI != "") {
              alert("ActiveX 설치 URL이 없습니다. activex.js 파일을 확인해주세요.");
              return;
          }
      }
      var container = getObject(config.ContainerID);
      if (!container) {
          alert("containerID가 없습니다. 확인 해주세요.");
          return;
      }
      if (!isDefined(config.ElementID)) {
          alert("Element ID가 없습니다. 확인 해주세요.");
          return;
      }
      var style = container.style || {};
      var vWidth = 0,
          vHeight = 0;
      if (("width" in style) && (style.width != "")) {
          vWidth = style.width;
          if ((vWidth != "") && (vWidth[vWidth.length - 1] == "%")) {
              vWidth = "100%";
          }
      } else {
          vWidth = "100%";
      }
      if (("height" in style) && (style.height != "")) {
          vHeight = style.height;
          if ((vHeight != "") && (vHeight[vHeight.length - 1] == "%")) {
              vHeight = "100%";
          }
      } else {
          vHeight = "100%";
      }
      var objectElement = document.createElement("object");
      objectElement.setAttribute("width", vWidth);
      objectElement.setAttribute("height", vHeight);
      var paramElement = null;
      paramElement = document.createElement("param");
      paramElement.setAttribute("name", "VersionInScript");
      paramElement.setAttribute("value", vVtmActiveXCtrl_Version);
      objectElement.appendChild(paramElement);
      for (var propName in config) {
          paramElement = document.createElement("param");
          paramElement.setAttribute("name", propName);
          paramElement.setAttribute("value", config[propName]);
          objectElement.appendChild(paramElement);
      }
      objectElement.setAttribute("id", config.ElementID);
      if (isIE()) {
          objectElement.setAttribute("classid", "CLSID:BC5C4EC1-6E57-4A86-AE8F-4F4A3F5C3339");
      }
     // objectElement.setAttribute("codebase", "http://ubase.co.kr/softphone/2112/VtmActiveXCtrlV2.CAB#version=1,0,0,0");
	  objectElement.setAttribute("codebase", "/common/js/cti/cab/VtmActiveXCtrl.cab");
      objectElement.Config = config;
      container.appendChild(objectElement);
      win.RECVtmOperators[objectElement.getAttribute("id")] = objectElement;
      if (!isDefined(RECVtmOperators["VtmApiCtrl"])) {
          if (vSoftphone_InstallPageURI != "") {
              document.location.href = vSoftphone_InstallPageURI;
              return;
          }
      } else {
      		
          /*
          var vVerSplit_Script, vVerSplit_Module;
          vVerSplit_Script = vPxAPI_Version.split(".");
          vVerSplit_Module = objectElement.NXVersion.split(".");
          if ((vVerSplit_Script.length != 4) || (vVerSplit_Module.length != 4)) {
              if (vSoftphone_InstallPageURI != "") {
                  document.location.href = vSoftphone_InstallPageURI;
                  return;
              }
          } else {
              var vIdx = 0,
                  vVerModule = 0,
                  vVerScript = 0;
              for (vIdx = 0; vIdx < 4; vIdx++) {
                  vVerModule = parseInt(vVerSplit_Module[vIdx]);
                  vVerScript = parseInt(vVerSplit_Script[vIdx]);
                  if (vVerModule < vVerScript) {
                      document.location.href = vSoftphone_InstallPageURI;
                      return;
                  } else if (vVerModule == vVerScript) {
                      continue;
                  } else {
                      break;
                  }
              }
          }*/
      }
      if (isIE()) {
          for (var funcName in objectElement.Config.RECVtmEventFunctions) {
              if (isDefined(objectElement.attachEvent)) {
                  objectElement.attachEvent(funcName, objectElement.Config.RECVtmEventFunctions[funcName]);
              } else {
                  var handler = document.createElement("script");
                  handler.setAttribute("type", "text/javascript");
                  handler.setAttribute("for", objectElement.Config.ElementID);
                  var strArgs = objectElement.Config.RECVtmEventFunctions[funcName].toString();
                  var vBegin = strArgs.indexOf("(");
                  var vEnd = strArgs.indexOf(")");
                  strArgs = strArgs.substring(vBegin, vEnd + 1);
                  handler.event = "" + funcName + strArgs;
                  handler.appendChild(document.createTextNode('RECVtmOperators["' + objectElement.Config.ElementID + '"]' + '.Config.RECVtmEventFunctions["' + funcName + '"]' + strArgs));
                  document.head.appendChild(handler);
              }
          }
      } 
  };

})(window);