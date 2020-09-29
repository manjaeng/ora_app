var transAgentFlag = false;
var transAgentTel = "";

function fInitPage(id) {
	//log 관련
	UfjSoftphone.logEvent = fLogWrite;
	
	//녹취 ActiveX 설정
	CreateUBRec_Operator({
		ContainerID: "ubrec_container",
		ElementID: "UBASERec",
		Operator_Type: "REC",
		RECEventFunctions: {
		}
	});

	//녹취vtm ActiveX설정
	CreateVtmRec_Operator({
		ContainerID: "vtmrec_container",
		ElementID: "VtmApiCtrl",
		Operator_Type: "REC",
		RECVtmEventFunctions: {
		}
	});
		
	//소프트폰 ActiveX 설정
	CreatePxAPI_Operator({
		ContainerID: "pxapi_container",
		ElementID: "PxAPI",
		Operator_Type: "SOFTPHONE",
		//소프트폰 이벤트선언
		SPEventFunctions: {
			EvtMonitorDevice: function(This_dn) {
				UfjSoftphone.PxAPI_EvtMonitorDevice(This_dn);
			},
			EvtErrMonitorDevice: function(EvtVal, This_dn, MsgCode, Msg) {
				UfjSoftphone.PxAPI_EvtErrMonitorDevice(EvtVal, This_dn, MsgCode, Msg);
			},
			EvtMonitorEnded: function(This_dn) {
				UfjSoftphone.PxAPI_EvtMonitorEnded(This_dn);
			},
			EvtQueryAgentState: function(This_dn,AGTstate) {
				UfjSoftphone.PxAPI_EvtQueryAgentState(This_dn,AGTstate);
			},
			EvtDelivered: function(This_dn,CallID,localConnState,eventCause,Subject_dn,Calling_dn,Called_dn,Redirection_dn,UserInfo) {
				UfjSoftphone.PxAPI_EvtDelivered(This_dn,CallID,localConnState,eventCause,Subject_dn,Calling_dn,Called_dn,Redirection_dn,UserInfo);
			},
			EvtScreenPopData: function(This_dn,Calling_dn,Called_dn, UserInfo) {
				UfjSoftphone.PxAPI_EvtScreenPopData(This_dn,Calling_dn,Called_dn, UserInfo);
			},
			EvtEstablished: function(This_dn,CallID,localConnState,eventCause,Subject_dn,Calling_dn,Called_dn,Redirection_dn) {
				UfjSoftphone.PxAPI_EvtEstablished(This_dn,CallID,localConnState,eventCause,Subject_dn,Calling_dn,Called_dn,Redirection_dn);
			},
			EvtConnectionCleared: function(This_dn, CallID, localConnState, eventCause, Subject_dn) {
				UfjSoftphone.PxAPI_EvtConnectionCleared(This_dn, CallID, localConnState, eventCause, Subject_dn);
			},
			EvtHeld: function(This_dn,CallID,localConnState,eventCause,Subject_dn) {
				UfjSoftphone.PxAPI_EvtHeld(This_dn,CallID,localConnState,eventCause,Subject_dn);
			},
			EvtRetrieved: function(This_dn, CallID, localConnState, eventCause, Subject_dn) {
				UfjSoftphone.PxAPI_EvtRetrieved(This_dn, CallID, localConnState, eventCause, Subject_dn);
			},
			EvtServiceInitated: function(This_dn, CallID, localConnState, eventCause) {
				UfjSoftphone.PxAPI_EvtServiceInitated(This_dn, CallID, localConnState, eventCause);
			},
			EvtOriginated: function(This_dn, CallID, localConnState, eventCause, Calling_dn, Called_dn) {
				UfjSoftphone.PxAPI_EvtOriginated(This_dn, CallID, localConnState, eventCause, Calling_dn, Called_dn);
			},
			EvtTransferred: function(This_dn,CallID,PriOldCallID,SecOldCallID,localConnState,eventCause,Calling_dn,Called_dn,Connection_dn1,Connection_dn2,Connection_dn3) {
				UfjSoftphone.PxAPI_EvtTransferred(This_dn,CallID,PriOldCallID,SecOldCallID,localConnState,eventCause,Calling_dn,Called_dn,Connection_dn1,Connection_dn2,Connection_dn3);
			},
			EvtConferenced: function(Dn,CallID,PriOldCallID,SecOldCallID,localConnState,eventCause,Calling_dn,Called_dn,Connection_dn1,Connection_dn2,Connection_dn3) {			
				UfjSoftphone.PxAPI_EvtConferenced(Dn,CallID,PriOldCallID,SecOldCallID,localConnState,eventCause,Calling_dn,Called_dn,Connection_dn1,Connection_dn2,Connection_dn3);
			},
			EvtNetWorkReached: function(This_dn, CallID, localConnState, eventCause, Calling_dn, Called_dn) {
				UfjSoftphone.PxAPI_EvtNetWorkReached(This_dn, CallID, localConnState, eventCause, Calling_dn, Called_dn);
			},
			EvtSendMessage: function(EvtVal, This_dn, MsgCode, Msg) {
				UfjSoftphone.PxAPI_EvtSendMessage(EvtVal, This_dn, MsgCode, Msg);
			},
			EvtCTILinkDown: function(EvtVal, This_dn, MsgCode, Msg) {
				UfjSoftphone.PxAPI_EvtCTILinkDown(EvtVal, This_dn, MsgCode, Msg);
			},
			EvtErrMonitorDevice: function(EvtVal, This_dn, MsgCode, Msg) {
				UfjSoftphone.PxAPI_EvtScreenPopData(EvtVal, This_dn, MsgCode, Msg);
			},
			EvtErrSetAgentState: function(EvtVal, This_dn, MsgCode, Msg) {
				UfjSoftphone.PxAPI_EvtErrSetAgentState(EvtVal, This_dn, MsgCode, Msg);
			},
			EvtErrMakeCall: function(EvtVal, This_dn, MsgCode, Msg) {
				UfjSoftphone.PxAPI_EvtErrMakeCall(EvtVal, This_dn, MsgCode, Msg);
			},
			EvtErrAnswerCall: function(EvtVal, This_dn, MsgCode, Msg) {
				UfjSoftphone.PxAPI_EvtErrAnswerCall(EvtVal, This_dn, MsgCode, Msg);
			},
			EvtErrClearConnection: function(EvtVal, This_dn, MsgCode, Msg) {
				UfjSoftphone.PxAPI_EvtErrClearConnection(EvtVal, This_dn, MsgCode, Msg);
			},
			EvtErrHoldCall: function(EvtVal, This_dn, MsgCode, Msg) {
				UfjSoftphone.PxAPI_EvtErrHoldCall(EvtVal, This_dn, MsgCode, Msg);
			},
			EvtErrRetrieveCall: function(EvtVal, This_dn, MsgCode, Msg) {
				UfjSoftphone.PxAPI_EvtErrRetrieveCall(EvtVal, This_dn, MsgCode, Msg);
			},
			EvtErrConsultationCall: function(EvtVal, This_dn, MsgCode, Msg) {
				UfjSoftphone.PxAPI_EvtErrConsultationCall(EvtVal, This_dn, MsgCode, Msg);
			},
			EvtErrReconnectCall: function(EvtVal, This_dn, MsgCode, Msg) {
				UfjSoftphone.PxAPI_EvtErrReconnectCall(EvtVal, This_dn, MsgCode, Msg);
			},
			EvtErrTransferCall: function(EvtVal, This_dn, MsgCode, Msg) {
				UfjSoftphone.PxAPI_EvtErrTransferCall(EvtVal, This_dn, MsgCode, Msg);
			},
			EvtErrConferenceCall: function(EvtVal, This_dn, MsgCode, Msg) {
				UfjSoftphone.PxAPI_EvtErrConferenceCall(EvtVal, This_dn, MsgCode, Msg);
			},
			EvtPriICDList: function(IcdList) {
				UfjSoftphone.PxAPI_EvtPriICDList(IcdList);
			},
			EvtPriAGTList: function(AgentList) {
				UfjSoftphone.PxAPI_EvtPriAGTList(AgentList);
			},
			EvtErrQueryAgentState: function(EvtVal, This_dn, MsgCode, Msg) {
				UfjSoftphone.PxAPI_EvtErrQueryAgentState(EvtVal, This_dn, MsgCode, Msg);
			},
			EvtPriAGTState: function(AgentState) {
				UfjSoftphone.PxAPI_EvtPriAGTState(AgentState);
			},
			EvtPriICDStatus: function(ICDStatus) {
				UfjSoftphone.PxAPI_EvtPriICDStatus(ICDStatus);
			},
			EvtPriICDStatus2: function(ICDStatus) {
				UfjSoftphone.PxAPI_EvtPriICDStatus2(ICDStatus);
			},
			EvtIVRConferenceRequest: function(data) {
				UfjSoftphone.EvtIVRConferenceRequest(data);
			},
			PxAPI_EvtCallInfoPri: function(CallID,Event1,localConnState,eventCause,Calling_dn,Called_dn,Holding_dn,Other_dn,UserInfo) {
				UfjSoftphone.PxAPI_EvtCallInfoPri(CallID,Event1,localConnState,eventCause,Calling_dn,Called_dn,Holding_dn,Other_dn,UserInfo);
			},
			EvtCallInfoSec: function(CallID,Event1,localConnState,eventCause,Calling_dn,Called_dn,Holding_dn,Other_dn,UserInfo) {
				UfjSoftphone.PxAPI_EvtCallInfoSec(CallID,Event1,localConnState,eventCause,Calling_dn,Called_dn,Holding_dn,Other_dn,UserInfo);
			},
			EvtButtonState: function(bLogin,bLogOut,bMakeCall,bAnswer,bDisconnect,bHold,bRetrieve,bConsultTrans,bTransfer,bReconnectTrans,bConsultConf,bConference,bReady,bNotReady,bMessage) {			
				UfjSoftphone.PxAPI_EvtButtonState(bLogin,bLogOut,bMakeCall,bAnswer,bDisconnect,bHold,bRetrieve,bConsultTrans,bTransfer,bReconnectTrans,bConsultConf,bConference,bReady,bNotReady,bMessage);
			}
		}
	});

	//소프트폰 연결-------------------------------------------------------------
	UfjSoftphone.recNum = UBASERec.RecNum();
	UfjSoftphone.logEvent("[ RecNum(내선번호) ] " + UfjSoftphone.recNum);
	
	//로그인 연결 
	UfjSoftphone.agentId = id;
	
	//CTI 서버 연결 호출
	var OpenServerFlag = PxAPI.ndOpenServer();
	
	//CTI서버와 연결을 생성하고 해당전화기를 모니터링 할수 있도록 모니터링 함수 호출
	var MonitorDeviceFlag = PxAPI.ndMonitorDevice(0,0,0,0,0,"0");
	
	if(OpenServerFlag == false) {
		alert("CTI서버와 연결이 되지 않았습니다.\n소프트폰을 사용할 수 없습니다.");
		UfjSoftphone.disableSoftphoneItems();
		return;
	}
  
	if(MonitorDeviceFlag == false) {
		alert("소프트폰 연결이 실패 하였습니다.\n소프트폰을 사용할 수 없습니다.");
		UfjSoftphone.disableSoftphoneItems();
		return;
	}
	//------------------------------------------------------------------------
}

//상담원 상태
//ndGetAGTState 호출시발생하는 이벤트.
//'Format : TELNO(4)+ AGTID(12)+ AGTNAME(20)+TELSTATE(1)+AGTSTATE(1)+CHTSTATE(1)
//'예로 this785 상담원 상태값 : 0869this785     송영은              WWW
//'TELSTATE(1)+AGTSTATE(1)+CHTSTATE(1) 가  WWW 일때 상담원 대기 상태
//'/* CALL 상태 */
//'CAL_STOP             'S'
//'CAL_INITIATED        'I'
//'CAL_ORIGINATED       'O'
//'CAL_DELIVERED        'D'
//'CAL_ESTABLISHED      'E'
//'CAL_IDLE             'W'
//'CAL_HELD             'H'
//'CAL_RETRIEVED        'R'
//'
//'/* 상담원 상태 */
//'AGT_LOGIN            'I'    상담원 LOGIN   
//'AGT_NOTREADY         'P'    상담원 휴식중   
//'AGT_READY            'W     상담원 대기중    
//'AGT_WORKNOTREADY     'S'    상담원 저장중     
//'AGT_LOGOUT           'O'    상담원 로그아웃   
//'AGT_BUSY             'B'    상담원 통화중     
function fAgtState(state) {
	alert(state);
	var agtState = UfjSoftphone.string.right(state,3);
	transAgentTel = UfjSoftphone.string.left(state,4);
	// 전환하고자 하는 상담원이 대기 상태인지 체크	
	if (agtState != "WWW" ){
		//Clear_call;
		UfjSoftphone.setConsultFlag(false);
		alert("상담원은 대기 상태가 아닙니다.");
	}else{
		transAgentFlag = true;
	}
}

/**
 * 전화번호 입력 레이어 호출 (걸기)
 */
createAniNumberInput = function(e){
	fnMakeCallAniNumberInput(e);
};

/**
 * 전화걸기 레이어 호출
 */
var makeCallLayer = "";
fnMakeCallAniNumberInput = function(e){
	var frame = parent.frames["content_frame"];
	var $content = $("<div />");
	e.stopPropagation();

	makeCallLayer = frame.createLayer({
		event:e,    //이벤트 e를 넘기면 마우스의 위치에 레이어 생성
		width:"343px",
		height:"100px",
		nonHideYn:true, //클릭시 레이어 안닫히게
		callback:function(){
			UfjSoftphone.setNotReady1();
		},
		content:$content.load(
			'/counsel/cti/forward.CtiMakeCallLayer.action',
			function() {
				$content.find("#ani").focus();
				$content.find("#applyBtn").click(function() {
					UfjSoftphone.makeCall($content.find("#ani").val());
				});
				$content.find("#ani").keyup(function(e) {
					if(e.keyCode == 13){
						UfjSoftphone.makeCall($content.find("#ani").val());
					}
				});
			}
		)
	});
};

/**
 * 전화걸기 클릭 이벤트
 */
$(document).click(function() {
	if(makeCallLayer != null && makeCallLayer != ""){
		closeLayer(makeCallLayer);
		makeCallLayer = "";
		UfjSoftphone.setNotReady1();
	}
});

/**
 * 회원선택 팝업(PxAPI_EvtScreenPopData 이벤트 발생시)
 */
fnchoiceMbrPop = function(callNum){
	if(callNum != ""){
		var schValues = fnTelOrCellNumberAddHipen(callNum);
		var schGubun = schValues[0];
		var schNumber = schValues[1];
		
		popup({
			url : "/counsel/counsel/initChoiceMbrPop.action",
			winname : "ChoiceMbrPop",
			title : "회원선택",
			width : "950",
			height : "750",
			params : {"schVal":schNumber, "schGubun":schGubun},
			scrollbars : false,
			autoresize : false
		});
	}
};

/**
 * 휴식 팝업
 */
fnAuxworkReasonPopup = function(param) {
	popup({
		url : "/popup/forward.CtiAuxworkReasonPop.action",
		winname : "CtiAuxworkReasonPop",
		title : "이석사유",
		params :param,
		width : "300",
		height : "150",
		scrollbars : false,
		resizable : false
	});
};

/**
 * 휴식 선택 이벤트
 */
ctiAuxwork = function (reasonCode){
	if(reasonCode == null || reasonCode == ""){
		alert("이석 사유를 선택하세요.");
		return;
	}
	if(reasonCode == "02"){ //식사 
		UfjSoftphone.setNotReady2();
	}else if(reasonCode == "04"){ //교육
		UfjSoftphone.setNotReady4();
	}else{ //휴식
		UfjSoftphone.setNotReady3();
	}
};

/**
 * event log
 */
function fLogWrite(data) {
	console.log(data);
};
