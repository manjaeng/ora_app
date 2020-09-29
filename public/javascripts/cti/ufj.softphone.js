function ICEvent() {};
// ===== 메시지 =====
ICEvent.ON_LOGIN_ING	= "로그인 요청 중";
ICEvent.ON_LOGIN		= "로그인 상태";
ICEvent.ON_AUX_ING		= "자리비움 요청 중";
ICEvent.ON_AUX			= "자리비움 상태";
ICEvent.ON_READY_ING	= "준비 요청 중";
ICEvent.ON_READY		= "준비 상태";
ICEvent.ON_BUSY			= "상대방 통화 중";
ICEvent.ON_INCOM		= "호인입 상태";
ICEvent.ON_ANSWER_ING	= "내선받기 상태";
ICEvent.ON_ANSWER		= "내선받기 상태";
ICEvent.ON_ABANDON		= "포기 상태";
ICEvent.ON_RING_ING		= "걸기 요청 중";
ICEvent.ON_RING			= "걸기 상태";
ICEvent.ON_CALL			= "통화 상태";
ICEvent.ON_HOLD_ING		= "보류 요청 중";
ICEvent.ON_HOLD			= "보류 상태";
ICEvent.ON_RECONN_ING	= "보류해제 요청 중";
ICEvent.ON_RECONN		= "보류해제 상태";
ICEvent.ON_HANGUP_ING	= "통화종료 요청 중";
ICEvent.ON_DISCONN		= "통화종료 상태";
ICEvent.ON_TRANSFER		= "호전환 상태";
ICEvent.ON_CONFERENCE	= "3자통화 상태";
ICEvent.ON_WRAPUP_ING	= "작업 요청 중";
ICEvent.ON_WRAPUP		= "작업 상태";
ICEvent.ON_LOGOUT_ING	= "로그아웃 요청 중";
ICEvent.ON_LOGOUT		= "로그아웃 상태";

//===== cti 버튼 Controll =====
/**
 * 초기화 (로그인 상태)
 */
fnCtiInit = function(){
	showCtiBtn("ready");
	showCtiBtn("answer");
	showCtiBtn("makecall");
	hideCtiBtn("hangup");
	hideCtiBtn("hold");
	showCtiBtn("work");
	showCtiBtn("auxwork");
};

/**
 * 대기중
 */
fnWaiting = function(){
	showCtiBtn("ready");
	showCtiBtn("answer");
	hideCtiBtn("makecall");
	hideCtiBtn("hangup");
	hideCtiBtn("hold");
	showCtiBtn("work");
	showCtiBtn("auxwork");
};

/**
 * 작업중
 */
fnWorking = function(){
	showCtiBtn("ready");
	hideCtiBtn("answer");
	showCtiBtn("makecall");
	hideCtiBtn("hangup");
	hideCtiBtn("hold");
	showCtiBtn("work");
	showCtiBtn("auxwork");
};

/**
 * 자리비움(휴식)중
 */
fnResting = function(){
	showCtiBtn("ready");
	hideCtiBtn("answer");
	hideCtiBtn("makecall");
	hideCtiBtn("hangup");
	hideCtiBtn("hold");
	showCtiBtn("work");
	showCtiBtn("auxwork");
};

/**
 * 통화중
 */
fnCalling = function(){
	hideCtiBtn("ready");
	hideCtiBtn("answer");
	hideCtiBtn("makecall");
	showCtiBtn("hangup");
	showCtiBtn("hold");
	hideCtiBtn("work");
	hideCtiBtn("auxwork");
};

/**
 * 통화대기중
 */
fnHolding = function(){
	hideCtiBtn("ready");
	hideCtiBtn("answer"); 
	hideCtiBtn("makecall");
	hideCtiBtn("hangup");
	showCtiBtn("hold");
	hideCtiBtn("work");
	hideCtiBtn("auxwork");
};

/**
 * class on/off
 */
fnClassOn = function(id){
	$('li[class^="m"] > a').attr('class','off');
	$('li[class^="m"] > a').attr('disabled', false);
	$("#"+id).attr('class', 'on');
	if(id != 'hold'){
		$("#"+id).attr('disabled', true);
	}
};

fnClassOff = function(id){
	$("#"+id).attr('class', 'off');
};

/**
 * 버튼보이기
 */
showCtiBtn = function(id){
	$("#"+id).show();
};

/**
 * 버튼숨기기
 */
hideCtiBtn = function(id){
	$("#"+id).hide();
};

var UfjSoftphone = {
		isLoaded: true,
		logEvent: "",								//logData
		recNum: "",									//내선번호 
		recKey: "", 								//녹취키 
		agentId: "",								//상담원 ID
		agentName: "",							//상담원명 
		consultCallFlag: false,			//상담전환 FLAG
		autoTransferFlag: false,		//상담 자동 전환 FLAG
		conferenceCallFlag: false,	//삼자통환 FLAG
		softphoneLoginFlag: false,	//전화기 로그인 FLAG
		ioType: "",									//IN/OUT 구분 
		softphoneUUI: "",						//UUI 정보(핀정보)
		tempTel: "",								//임시 전화번호(연결전화번호) 
		changeAgtTel: "",						//전환 전화번호
		btnMakeCall: "",						//전화걸기 버튼 상태
		btnAnswer: "",							//전화받기 버튼 상태
		btnCallEnd: "",							//전화끊기 버튼 상태
		btnCallHold: "",						//전화보류 버튼 상태
		btnRetrieve: "",						//전화재연결 버튼 상태
		btnTransfer: "",						//호전환 버튼 상태
		btnReconnecet: "",					//재연결 버튼 상태
		btnConference: "",					//3자통화 버튼 상태
		btnConsult: "",							//전환 버튼 상태
		btnNotReady1: "",						//전화기 상태(타업무)       
		btnNotReady2: "",           //전화기 상태(식사)         
		btnNotReady3: "",           //전화기 상태(휴식)         
		btnNotReady4: "",           //전화기 상태(교육)         
		btnWorkNotReady: "",        //전화기 상태(후처리)       
		btnReady: "",               //전화기 상태(대기)         
		btnLogin: "",               //전화기 상태(로그인)       
		btnLogout: "",              //전화기 상태(로그아웃)     
		fScreenPop: "",							//PxAPI_EvtScreenPopData Event 함수
		fIVRPopData: "",						//PxAPI_EvtIVRConferenceRequest Event 함수
		fAgtState: "",							//상담원 상태
		fRec1: "",									// 녹취 시작 호출 
		fRec2: "",									// 녹취 종료 호출
		fRec3: "",									// 녹취 저장 호출
		fRec4: "",									// 녹취 묵음 시작 호출
		fRec5: "",									// 녹취 묵음 종료 호출
		fRec7: "",									// 부분 녹취 시작 호출
		fRec8: "",									// 부분 녹취 종료 호출
		isHolding: false,							// 보류상태체크
		
		initSoftPhone: function(){
			
		},
		
		//autoTransfer
		setAutoTransfer: function(flag) {
			UfjSoftphone.autoTransferFlag = flag;
		},
		//ConsultCall
		setConsultFlag: function(flag){
			UfjSoftphone.consultCallFlag = flag;
		},
		//ConferenceCall
		setConferenceCallFlag: function(flag){
			UfjSoftphone.conferenceCallFlag = flag;
		},
		
		//녹취시작 패킷 전송
		ubaseRecData1: function(temp1,temp2,temp3){
			var rec;
			var today = new Date();

			//녹취키 초기화
		   UfjSoftphone.recKey  = "";
		   var t_month = today.getMonth()+1;
		   var t_date = today.getDate();
		   var t_hours = today.getHours();
		   var t_minutes = today.getMinutes();
		   var t_seconds = today.getSeconds(); 
		   if (t_month < 10 ) { t_month = "0" + t_month; }
		   if (t_date < 10 ) { t_date = "0" + t_date; }
		   if (t_hours < 10 ) { t_hours = "0" + t_hours; }
		   if (t_minutes < 10 ) { t_minutes = "0" + t_minutes; }
		   if (t_seconds < 10 ) { t_seconds = "0" + t_seconds; }
		   //녹취키 생성
		   UfjSoftphone.recKey = today.getFullYear() + "" + t_month + t_date + t_hours + t_minutes + t_seconds + "_" + UfjSoftphone.agentId;
		   //VtmApiCtrl.VTMOCXStartCall_V2("녹취서버메인IP","녹취서버백업IP",포트번호,"내선번호",상담원ID,"통화중인상대방전화번호","통화방향(I/O)","녹취키","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보")
		   //rec = VtmApiCtrl.VTMOCXStartCall_V1("200.200.102.109", "", 2070, UfjSoftphone.recNum, UfjSoftphone.agentId, UfjSoftphone.tempTel, UfjSoftphone.ioType, UfjSoftphone.recKey,temp1,temp2,"","","","","","","","","","","","","","","","","");
		   rec = UBASERec.REC1_SEND(UfjSoftphone.recKey, UfjSoftphone.agentId, UfjSoftphone.agentName, UfjSoftphone.tempTel, UfjSoftphone.ioType, "SSGINTER", "", "", "", "", "", "", "", "", "", UfjSoftphone.localIP);
		   //녹취 패킷이 정상으로 전송되었는지 확인
		   /*if (rec != "0") {
			UfjSoftphone.logEvent("[ ubaseRecData1 ] 녹취패킷 전송 에러 ");
			alert("[ ubaseRecData1 ] 녹취패킷 전송 에러 ");
		   }*/
		  },
		  
		  //녹취강제 시작 키값동일 패킷 전송
		  ubaseRecData11: function(temp1,temp2,temp3,temp4){
		   var rec;
		   if(UfjSoftphone.recKey != "") {
			//VtmApiCtrl.VTMOCXEndCall_V2("녹취메인서버IP", "녹취백업서버IP", 포트번호, "내선번호", "상담원ID", "통화중인상대방전화번호", "통화방향(I/O)", "녹취키","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보")
			//rec = VtmApiCtrl.VTMOCXStartCall_V1("200.200.102.109", "", 2070, UfjSoftphone.recNum, UfjSoftphone.agentId, UfjSoftphone.tempTel, UfjSoftphone.ioType, UfjSoftphone.recKey,temp1,temp2,"","","","","","","","","","","","","","","","","");
			rec = UBASERec.REC2_SEND(UfjSoftphone.recKey, UfjSoftphone.agentId, UfjSoftphone.agentName, UfjSoftphone.tempTel, UfjSoftphone.ioType, "SSGINTER", "", "", "", "", "", "", "", "", "", UfjSoftphone.localIP);
			//녹취 패킷이 정상으로 전송되었는지 확인
			/*if (rec != "0") {
			 UfjSoftphone.logEvent("[ ubaseRecData2 ] 녹취패킷 전송 에러 ");
			 alert("[ ubaseRecData2 ] 녹취패킷 전송 에러 ");
			}*/
		   }
		  },
		  //녹취종료 패킷 전송
		  ubaseRecData2: function(temp1,temp2,temp3,temp4){
		   var rec;
		   if(UfjSoftphone.recKey != "") {
			//VtmApiCtrl.VTMOCXEndCall_V2("녹취메인서버IP", "녹취백업서버IP", 포트번호, "내선번호", "상담원ID", "통화중인상대방전화번호", "통화방향(I/O)", "녹취키","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보","부가정보")
			//rec = VtmApiCtrl.VTMOCXEndCall_V2("200.200.102.109", "", 2070, UfjSoftphone.recNum, 1, UfjSoftphone.agentId, UfjSoftphone.tempTel, UfjSoftphone.ioType, UfjSoftphone.recKey,temp1,temp2,temp3,temp4,"","","","","","","","","","","","","","","");
			rec = UBASERec.REC2_SEND(UfjSoftphone.recKey, UfjSoftphone.agentId, UfjSoftphone.agentName, UfjSoftphone.tempTel, UfjSoftphone.ioType, "SSGINTER", "", "", "", "", "", "", "", "", "", UfjSoftphone.localIP);
			//녹취 패킷이 정상으로 전송되었는지 확인
			/*if (rec != "0") {
			 UfjSoftphone.logEvent("[ ubaseRecData2 ] 녹취패킷 전송 에러 ");
			 alert("[ ubaseRecData2 ] 녹취패킷 전송 에러 ");
			}*/
		   }
		  },
		  //녹취저장 패킷 전송 T_TEMP2 ~~ 추가 넣을수있다.
		  ubaseRecData3: function(temp1,temp2,temp3,temp4,temp5,temp6,temp7){     
		   var rec;
		   if (UfjSoftphone.recKey != ""){
			
			//VtmApiCtrl.VTMOCXUpdateCall_V2("녹취메인서버IP","녹취백업서버IP", 포트번호, "내선번호", overwrite(1/0), 1, UfjSoftphone.recKey,"UC2","UC3","","","","","","","","","","","","","","","","","")
			//rec = VtmApiCtrl.VTMOCXUpdateCall_V2("200.200.102.109","", 2070, UfjSoftphone.recNum, 1, UfjSoftphone.recKey,temp1,temp2,temp3,temp4,temp5,temp6,temp7,"","","","","","","","","","","","");
			rec = UBASERec.REC3_SEND(UfjSoftphone.recKey, UfjSoftphone.agentId, UfjSoftphone.agentName, UfjSoftphone.tempTel, UfjSoftphone.ioType, "SSGINTER", temp1, temp2, temp3, temp4, temp5, temp6, temp7, "", "", UfjSoftphone.localIP);
					   /*
			//녹취 패킷이 정상으로 전송되었는지 확인
			if (rec != "0") {
			 UfjSoftphone.logEvent("[ ubaseRecData3 ] 녹취패킷 전송 에러 ");
			 alert("[ ubaseRecData3 ] 녹취패킷 전송 에러 ");
			}*/
		   }
		  },

		//녹취키 삭제
		setRecKeyClear: function() {
			UfjSoftphone.recKey = "";
		},
		// 상담원 상태 가져오기 
		getAgtState: function(agtID){
			PxAPI.ndGetAGTState(agtID);	
		},
		// 대기 (전화를 받을수 있는 상태로 변경한다. Ready 상태.)
		setReady: function(){
			UfjSoftphone.logEvent(ICEvent.ON_READY_ING);
			if(!PxAPI.ndSetAgentState(3,UfjSoftphone.agentId,"","","")){ //CTI '대기' 상태 변경
				alert("대기 실패");
				fnCtiInit();
			}else{
				fnClassOn("ready");
				fnWaiting();
				UfjSoftphone.logEvent(ICEvent.ON_READY);
			}
		},
		// 후처리 상태
		setWNReady: function btnWNReady(){
			UfjSoftphone.logEvent(ICEvent.ON_WRAPUP);
			if(!PxAPI.ndSetAgentState(4,UfjSoftphone.agentId,"","","")){ //CTI '후처리' 상태 변경
				alert("후처리 실패");
			}
		},
		//타업무 ( 휴식상태값 ==> "01" : 타업무 ,"02" : 식사 ,"03" : 휴식 ,"04" : 교육  ) 
		//전화를 받지 않도록 상태를 변경한다. 마지막 인자값은 상담원세부상태로 
		//CTI 와 상태를 맞추도록 한다.
		setNotReady1: function(){
			UfjSoftphone.logEvent(ICEvent.ON_WRAPUP_ING);
			if(!PxAPI.ndSetAgentState(2,UfjSoftphone.agentId,"","","01")){ //CTI '타업무' 상태 변경
				alert("작업 실패");
			}else {
				//UfjSoftphone.setWNReady(); //후처리
				fnClassOn("work");
				fnWorking();
				UfjSoftphone.logEvent(ICEvent.ON_WRAPUP);
			}
		},
		//식사 ( 휴식상태값 ==> "01" : 타업무 ,"02" : 식사 ,"03" : 휴식 ,"04" : 교육  ) 
		//전화를 받지 않도록 상태를 변경한다. 마지막 인자값은 상담원세부상태로 
		//CTI 와 상태를 맞추도록 한다.
		setNotReady2: function (){
			UfjSoftphone.logEvent(ICEvent.ON_AUX_ING);
			if(!PxAPI.ndSetAgentState(2,UfjSoftphone.agentId,"","","02")){ //CTI '식사' 상태 변경
				alert("자리비움(식사) 실패");
			}else{
				fnClassOn("auxwork");
				fnResting();
				UfjSoftphone.logEvent(ICEvent.ON_AUX);
			}
		},
		//휴식 ( 휴식상태값 ==> "01" : 타업무 ,"02" : 식사 ,"03" : 휴식 ,"04" : 교육  ) 
		//전화를 받지 않도록 상태를 변경한다. 마지막 인자값은 상담원세부상태로 
		//CTI 와 상태를 맞추도록 한다.
		setNotReady3: function(){
			UfjSoftphone.logEvent(ICEvent.ON_AUX_ING);
			if(!PxAPI.ndSetAgentState(2,UfjSoftphone.agentId,"","","03")){ //CTI '휴식' 상태 변경
				alert("자리비움(휴식) 실패");
			}else{
				fnClassOn("auxwork");
				fnResting();
				UfjSoftphone.logEvent(ICEvent.ON_AUX);
			}
		},
		//교육 ( 휴식상태값 ==> "01" : 타업무 ,"02" : 식사 ,"03" : 휴식 ,"04" : 교육  ) 
		//전화를 받지 않도록 상태를 변경한다. 마지막 인자값은 상담원세부상태로 
		//CTI 와 상태를 맞추도록 한다.
		setNotReady4: function(){
			UfjSoftphone.logEvent(ICEvent.ON_AUX_ING);
			if(!PxAPI.ndSetAgentState(2,UfjSoftphone.agentId,"","","04")){ //CTI '교육' 상태 변경
				alert("자리비움(교육) 실패");
			}else{
				fnClassOn("auxwork");
				fnResting();
				UfjSoftphone.logEvent(ICEvent.ON_AUX);
			}
		},
		//LogOut 상태
		setLogOut: function(){
			UfjSoftphone.logEvent(ICEvent.ON_LOGOUT_ING);
			if(!PxAPI.ndSetAgentState(1,UfjSoftphone.agentId,"","","")){ // CTI 로그아웃 처리
				alert("로그아웃 실패");
			}else{				
				UfjSoftphone.logEvent(ICEvent.ON_LOGOUT);
			}
		},
		// 전화를 받는다. 전화받기 교환기에서 자동받기가 아닐경우 사용
		setAnswerCall: function(){
			if(!PxAPI.ndAnswerCall()){
				alert("받기 실패");
			}else{
				fnCalling();
				UfjSoftphone.logEvent(ICEvent.ON_CALL);
				//고객 팝업
				fnchoiceMbrPop(UfjSoftphone.tempTel);
			}
		},
		//현재통화를 보류로 만든다.
		setHeldCall: function(){
			UfjSoftphone.logEvent(ICEvent.ON_HOLD_ING);
			if(!PxAPI.ndHoldCall()){
				alert("보류 실패"); 
			}
		},
		//현재 보류된 통화를 활성화 한다.
		setRetrieveCall: function(){
			UfjSoftphone.logEvent(ICEvent.ON_RECONN_ING);
			if(!PxAPI.ndRetrieveCall()){
				alert("재연결 실패");
			}
		},
		//전화를 끊는다.
		setClearConnectionCall: function (){
			if(!PxAPI.ndClearConnection()){
				alert("끊기 실패");
			}else {
				//후처리상태 후 대기상태로 변경해줘야 통화 받을 수 있음 (수동으로 변경하기)
				UfjSoftphone.setWNReady(); //후처리
				//작업상태로 변경
				UfjSoftphone.setNotReady1();
			}
		},
		//현재통화를 보류시키고 지정된 Dn으로 전화를 걸었을때
		//다시 현재통화를 활성화 시키고 지정된 Dn의 전화를 끊을때.
		setReconnecetCall: function(){ 
			PxAPI.ndReconnectCall();
		},
		// 고객과 통화중에 IVR과 비밀번호 연동시 호출한다.
		setIVRConfReq: function(svrIP, svrPort, arsIcd, pUUI){
			//PxAPI.ndIVRConferenceRequest("127.0.0.1","1999","3000","10");
			PxAPI.ndIVRConferenceRequest(svrIP,svrPort,arsIcd,pUUI);
		},
		// 지정된 번호를 전화를 걸때 사용한다.
		makeCall: function(telNumber){
			if(telNumber == "null" || telNumber == ""){
				alert("전화번호를 입력하세요.");
				return;
			}
			UfjSoftphone.logEvent(ICEvent.ON_RING_ING);
			
			//전화번호가 4자리면 내선발신, 그외는 외부발신
			if($.trim(telNumber).length != 4) {
				telNumber = "9" + telNumber;
			}
			
			var str = "";
			if(!PxAPI.ndMakeCall(telNumber, str, str.length)){
				alert("걸기 실패");
			}else{
				fnClassOff("makecall");
				fnCalling();
				UfjSoftphone.logEvent(ICEvent.ON_CALL);
			}
			if(makeCallLayer != "null" && makeCallLayer != ""){
				closeLayer(makeCallLayer);
				makeCallLayer = "";
			};
		},
		//  현재통화를 보류시키고 지정된 Dn으로 전화를 건다.
		//  호전환 이나 삼자통화를 할때 반드시 호출한후 Transfer 또는 Conference 할수 있다.
		//  PxAPI.ndConsultationCall(호전화번호,UUI정보(IVR PIN정보),UUI길이);
		consultCall: function(consultNumber){
			if(!PxAPI.ndConsultationCall(consultNumber, "", 0)){
				alert("협의요청 실패");
			}
		},
		//호전환을한다.
		//PxAPI_EvtTransferred 이벤트 발생
		transferCall: function(){
			if(!PxAPI.ndTransferCall()){
				alert("호전환 실패");
			}
		},
		//삼자통화를 한다.  
		//PxAPI_EvtConferenced 이벤트 발생
		conferenceCall: function(){
			if(!PxAPI.ndConferenceCall()){
				alert("삼자통화 실패");
			}
		},
        //소프트폰 로그인
		userLogin: function(){
			if(UfjSoftphone.agentId == "" || UfjSoftphone.agentId == "null"){
				alert("상담원ID를 입력해주세요");
				return;
			}
			UfjSoftphone.logEvent(ICEvent.ON_LOGIN_ING);
			window.setTimeout(function(){
				if(!PxAPI.ndSetAgentState(0,UfjSoftphone.agentId,"","","")){ //로그인 상태
					alert("로그인 실패");
				}else{
					$('li[class^="m"]').attr('class', function(i, c){
		              	return c.replace('hide', '');
		           	});
					fnCtiInit();
					UfjSoftphone.logEvent(ICEvent.ON_LOGIN);
				}
			},4000);
		},
		
		// CTI Event ===================================================================================================================================
		PxAPI_EvtMonitorDevice: function(This_dn) {
			UfjSoftphone.logEvent("[ MonitorDevice성공] ");
			//softPhone 로그인
			UfjSoftphone.userLogin();
		},
		PxAPI_EvtMonitorEnded: function(This_dn) {
		},
		PxAPI_EvtQueryAgentState: function(This_dn,AGTstate) {
			//상담원 상태이벤트
			switch(AGTstate) 
			{
				case 0:	// 비업무(로그인/휴식)
					break;
					
				case 1:	 // 로그아웃
					break;
					
				case 2:	 // 대기
					break;

				case 3:	 // 후처리
					break;

				default:
			}
		},
		PxAPI_EvtDelivered: function(This_dn,CallID,localConnState,eventCause,Subject_dn,Calling_dn,Called_dn,Redirection_dn,UserInfo) {
			UfjSoftphone.logEvent("[ PxAPI_EvtDelivered ] ");
			if (UfjSoftphone.consultCallFlag == true) {
			} else {
				if (This_dn == Calling_dn) {					//OB 콜
					UfjSoftphone.tempTel = Called_dn;
					UfjSoftphone.ioType = "O";
				} else {
					UfjSoftphone.tempTel = Calling_dn;		    //IN 콜
					UfjSoftphone.ioType = "I";
				}
				// 앞자리 0이 없을경우(ex : 326222004) 맨앞자리에 0을 붙여준다
				if (UfjSoftphone.tempTel.length > 4) {
					if (UfjSoftphone.tempTel.substring(0,1) != "0") {
						UfjSoftphone.tempTel = '0' +  UfjSoftphone.tempTel;
					}
				}
				//녹취 시작 패킷 전송 (OUT 콜 일경우만 녹취시작패킷 전송)
        		if(This_dn == Calling_dn) {	
        			UfjSoftphone.ubaseRecData1();
        			//UfjSoftphone.fRec1();
        		}
			}
		},
		//전화가 왔을때.(벨이울릴때) 발생하는 이벤트
		//INBOUND 시 발생한다.
		PxAPI_EvtScreenPopData: function(This_dn,Calling_dn,Called_dn, UserInfo) {
			UfjSoftphone.logEvent("[ PxAPI_EvtScreenPopData ] ");
			//고객 PIN정보 저장
			UfjSoftphone.softphoneUUI = UserInfo;
		},
		PxAPI_EvtEstablished: function(This_dn,CallID,localConnState,eventCause,Subject_dn,Calling_dn,Called_dn,Redirection_dn) {
			UfjSoftphone.logEvent("[ PxAPI_EvtEstablished ] ");
			if (UfjSoftphone.consultCallFlag == true) {
				if(UfjSoftphone.autoTransferFlag == true) {
					//자동 호전환
					UfjSoftphone.transferCall();
				}
			} else {
				if (This_dn == Calling_dn) {					//OB 콜
					UfjSoftphone.tempTel = Called_dn;
					UfjSoftphone.ioType = "O";
				} else {
					UfjSoftphone.tempTel = Calling_dn;		    //IN 콜
					UfjSoftphone.ioType = "I";
				}
				// 앞자리 0이 없을경우(ex : 326222004) 맨앞자리에 0을 붙여준다
				if (UfjSoftphone.tempTel.length > 4) {
					if (UfjSoftphone.tempTel.substring(0,1) != "0") { 
						UfjSoftphone.tempTel = '0' +  UfjSoftphone.tempTel;
					}
				}
				//녹취 시작 패킷 전송 (IN 콜 일경우만 녹취시작패킷 전송)
        		if (This_dn != Calling_dn) {	
				  UfjSoftphone.ubaseRecData1();
        			//UfjSoftphone.fRec1();
        		}
			} 
		},
		PxAPI_EvtConnectionCleared: function(This_dn, CallID, localConnState, eventCause, Subject_dn) {
			UfjSoftphone.logEvent("[ PxAPI_EvtConnectionCleared ] ");
			if (Subject_dn == This_dn) {
				if (UfjSoftphone.consultCallFlag == true) {
					//전환콜일 경우 변수 초기화
					UfjSoftphone.setConsultFlag(false);
					//자동호전환 변수 초기화
					UfjSoftphone.setAutoTransfer(false);
					if (UfjSoftphone.conferenceCallFlag == true) {	//3자 통화 일 경우
						//녹취종료 패킷 전송
						UfjSoftphone.ubaseRecData2();
						//UfjSoftphone.fRec2();
						//한콜이 끝나면 자동으로 전화상태를 저장상태로 만들어 준다.
						UfjSoftphone.setWNReady();
						//작업상태로 변경
						UfjSoftphone.setNotReady1();
						//3자 통화 변수 초기화
						UfjSoftphone.setConferenceCallFlag(false);
					}
				} else {
					//전환콜일 경우 변수 초기화
					UfjSoftphone.setConsultFlag(false);
					//자동호전환 변수 초기화
					UfjSoftphone.setAutoTransfer(false);					
					//이벤트가 2번 발생하므로 자신 This_dn 하고 Subject_dn 같을때만 처리하면 된다.
					if (Subject_dn == This_dn) {
						//녹취 종료 패킷 전송
						UfjSoftphone.ubaseRecData2();
						//UfjSoftphone.fRec2();
						//한콜이 끝나면 자동으로 전화상태를 저장상태로 만들어 준다.
						UfjSoftphone.setWNReady();
						//작업상태로 변경
						UfjSoftphone.setNotReady1();
					}
				}
			} else {
				if(UfjSoftphone.conferenceCallFlag == true){
					//3자 통화 변수 초기화
					UfjSoftphone.setConferenceCallFlag(false);
					//전환콜 변수 초기화
					UfjSoftphone.setConsultFlag(false);
					//자동호전환 변수 초기화
					UfjSoftphone.setAutoTransfer(false);
				}
			}
		},
		PxAPI_EvtHeld: function(This_dn,CallID,localConnState,eventCause,Subject_dn) {
			UfjSoftphone.logEvent("[ PxAPI_EvtHeld ] ");
			fnClassOn("hold");
			fnHolding();
			UfjSoftphone.isHolding = true;
			UfjSoftphone.logEvent(ICEvent.ON_HOLD);
		},
		PxAPI_EvtRetrieved: function(This_dn, CallID, localConnState, eventCause, Subject_dn) {
			UfjSoftphone.logEvent("[ PxAPI_EvtRetrieved ] ");	
			fnClassOff("hold");
			fnCalling();
			UfjSoftphone.isHolding = false;
			UfjSoftphone.logEvent(ICEvent.ON_CALL);
		},
		//콜을 생성할 때 발생 (outbound)
		//ndMakeCall or ndConsultationCall 함수의 성공적 호출시 발생하는 이벤트중 하나.
		PxAPI_EvtServiceInitated: function(This_dn, CallID, localConnState, eventCause) {
			UfjSoftphone.logEvent("[ PxAPI_EvtServiceInitated ] ");	
			if (UfjSoftphone.consultCallFlag == true) {
			} else {
				UfjSoftphone.setRecKeyClear();
			}
		},
		//콜을 생성이 완료되었을 때 발생
		//ndMakeCall or ndConsultationCall 함수의 성공적 호출시 발생하는 이벤트중 하나.
		//OUTBOUND 일때 이벤트가 발생하면 녹취 KEY을 초기화 해준다
		PxAPI_EvtOriginated: function(This_dn, CallID, localConnState, eventCause, Calling_dn, Called_dn) {
			UfjSoftphone.logEvent("[ PxAPI_EvtOriginated ] ");	
			if (UfjSoftphone.consultCallFlag == true) {
			} else {
				UfjSoftphone.setRecKeyClear();
			}
		},
		PxAPI_EvtTransferred: function(This_dn,CallID,PriOldCallID,SecOldCallID,localConnState,eventCause,Calling_dn,Called_dn,Connection_dn1,Connection_dn2,Connection_dn3) {
			UfjSoftphone.logEvent("[ PxAPI_EvtTransferred ] ");	
			//호전환일 경우
			if (UfjSoftphone.consultCallFlag == true) {
				//녹취 종료 패킷 전송
				UfjSoftphone.ubaseRecData2();
				//UfjSoftphone.fRec2();
			}
			if (Called_dn != This_dn) {
				//한콜이 끝나면 자동으로 전화상태를 저장상태로 만들어준다.
				UfjSoftphone.setWNReady();
			}
			//전환콜일 경우 변수 초기화
			UfjSoftphone.setConsultFlag(false);
			//자동호전환 변수 초기화
			UfjSoftphone.setAutoTransfer(false);
		},
		PxAPI_EvtConferenced: function(Dn,CallID,PriOldCallID,SecOldCallID,localConnState,eventCause,Calling_dn,Called_dn,Connection_dn1,Connection_dn2,Connection_dn3) {			
			UfjSoftphone.logEvent("[ PxAPI_EvtConferenced ] ");	
			//3자 통화 경우 변수 True
			UfjSoftphone.setConferenceCallFlag(true);
		},
		PxAPI_EvtNetWorkReached: function(This_dn, CallID, localConnState, eventCause, Calling_dn, Called_dn) {
			UfjSoftphone.logEvent("[ PxAPI_EvtNetWorkReached ] ");	
		},
		PxAPI_EvtSendMessage: function(EvtVal, This_dn, MsgCode, Msg) {
			UfjSoftphone.logEvent("[ PxAPI_EvtSendMessage ] ");	
		},
		PxAPI_EvtCTILinkDown: function(EvtVal, This_dn, MsgCode, Msg) {
			UfjSoftphone.logEvent("[ PxAPI_EvtCTILinkDown ] ");	
		},
		PxAPI_EvtErrMonitorDevice: function(EvtVal, This_dn, MsgCode, Msg) {
			UfjSoftphone.logEvent("[ PxAPI_EvtErrMonitorDevice ] ");	
		},
		PxAPI_EvtErrSetAgentState: function(EvtVal, This_dn, MsgCode, Msg) {
			UfjSoftphone.logEvent("[ PxAPI_EvtErrSetAgentState ] ");	
		},
		PxAPI_EvtErrMakeCall: function(EvtVal, This_dn, MsgCode, Msg) {
			UfjSoftphone.logEvent("[ PxAPI_EvtErrMakeCall ] ");	
		},
		PxAPI_EvtErrAnswerCall: function(EvtVal, This_dn, MsgCode, Msg) {
			UfjSoftphone.logEvent("[ PxAPI_EvtErrAnswerCall ] ");	
		},
		PxAPI_EvtErrClearConnection: function(EvtVal, This_dn, MsgCode, Msg) {
			UfjSoftphone.logEvent("[ PxAPI_EvtErrClearConnection ] ");	
		},
		PxAPI_EvtErrHoldCall: function(EvtVal, This_dn, MsgCode, Msg) {
			UfjSoftphone.logEvent("[ PxAPI_EvtErrHoldCall ] ");	
		},
		PxAPI_EvtErrRetrieveCall: function(EvtVal, This_dn, MsgCode, Msg) {
			UfjSoftphone.logEvent("[ PxAPI_EvtErrRetrieveCall ] ");	
		},
		PxAPI_EvtErrConsultationCall: function(EvtVal, This_dn, MsgCode, Msg) {
			UfjSoftphone.logEvent("[ PxAPI_EvtErrConsultationCall ] ");	
		},
		PxAPI_EvtErrReconnectCall: function(EvtVal, This_dn, MsgCode, Msg) {
			UfjSoftphone.logEvent("[ PxAPI_EvtErrReconnectCall ] ");	
		},
		PxAPI_EvtErrTransferCall: function(EvtVal, This_dn, MsgCode, Msg) {
			UfjSoftphone.logEvent("[ PxAPI_EvtErrTransferCall ] ");	
		},
		PxAPI_EvtErrConferenceCall: function(EvtVal, This_dn, MsgCode, Msg) {
			UfjSoftphone.logEvent("[ PxAPI_EvtErrConferenceCall ] ");	
		},
		PxAPI_EvtPriICDList: function(IcdList) {
			UfjSoftphone.logEvent("[ PxAPI_EvtPriICDList ] ");	
		},
		PxAPI_EvtPriAGTList: function(AgentList) {
			UfjSoftphone.logEvent("[ PxAPI_EvtPriAGTList ] ");	
		},
		//ndSetAgentState(상태변경)호출시 실패했을때 발생한다.
		PxAPI_EvtErrQueryAgentState: function(EvtVal, This_dn, MsgCode, Msg) {
			UfjSoftphone.logEvent("[ PxAPI_EvtErrQueryAgentState ] ");	
		},
		PxAPI_EvtPriAGTState: function(AgentState) {
			UfjSoftphone.logEvent("[ PxAPI_EvtPriAGTState ] ");	
			UfjSoftphone.fAgtState(AgentState);
		},
		//ndGetICDStatus 호출시 발생하는 이벤트.
		//Format : 대기인원(4)+대기상담원(4)+로그인상담원(4)
		PxAPI_EvtPriICDStatus: function(ICDStatus) {
			UfjSoftphone.logEvent("[ PxAPI_EvtPriICDStatus ] ");	
		},
		//ndGetICDStatus 호출시 발생하는 이벤트.
		//Format : 호출된ICDNO(4) + 대기인원(4)+대기상담원(4)+로그인상담원(4)
		PxAPI_EvtPriICDStatus2: function(ICDStatus) {
			UfjSoftphone.logEvent("[ PxAPI_EvtPriICDStatus2 ] ");	
		},
		//비밀번호연동시 IVR로부터 데이타를 받았을때 발생하는 이벤트.
		PxAPI_EvtIVRConferenceRequest: function(data) {
			UfjSoftphone.logEvent("[ PxAPI_EvtIVRConferenceRequest ] ");	
			UfjSoftphone.fIVRPopData(data);
		},
		PxAPI_EvtCallInfoPri: function(CallID,Event1,localConnState,eventCause,Calling_dn,Called_dn,Holding_dn,Other_dn,UserInfo) {
			UfjSoftphone.logEvent("[ PxAPI_EvtCallInfoPri ] ");	
		},
		PxAPI_EvtCallInfoSec: function(CallID,Event1,localConnState,eventCause,Calling_dn,Called_dn,Holding_dn,Other_dn,UserInfo) {
			UfjSoftphone.logEvent("[ PxAPI_EvtCallInfoSec ] ");	
		},
		// 버튼 제어 이벤트
		PxAPI_EvtButtonState: function(bLogin,bLogOut,bMakeCall,bAnswer,bDisconnect,bHold,bRetrieve,bConsultTrans,bTransfer,bReconnectTrans,bConsultConf,bConference,bReady,bNotReady,bMessage) {			
			UfjSoftphone.logEvent("[ PxAPI_EvtButtonState ] ");	
			//UfjSoftphone.logEvent("[ssssss) ] " + bDisconnect);
			if(bLogin == true) {
				UfjSoftphone.softphoneLoginFlag = true;
				UfjSoftphone.btnLogin.disabled = false;
			}else{
				UfjSoftphone.btnLogin.disabled = true;
			}
			
			// if(bLogOut == true) {
				// UfjSoftphone.softphoneLoginFlag = false;
				// UfjSoftphone.btnLogout.disabled = false;
			// }else{
				// UfjSoftphone.btnLogout.disabled = true;
			// }

			if(bMakeCall == true) {
				UfjSoftphone.btnMakeCall.disabled = false;
			} else {
				UfjSoftphone.btnMakeCall.disabled = true;
			}

			if(bAnswer == true) {
				UfjSoftphone.btnAnswer.disabled = false;
			} else {
				UfjSoftphone.btnAnswer.disabled = true;
			}

			if(bDisconnect == true) {
				UfjSoftphone.btnCallEnd.disabled = false;
			} else {
				UfjSoftphone.btnCallEnd.disabled = true;
			}

			if(bHold == true) {
				UfjSoftphone.btnCallHold.disabled = false;
			} else {
				UfjSoftphone.btnCallHold.disabled = true;
			}

			/*if(bR == true) {
				UfjSoftphone.btnRetrieve.disabled = false;
			} else {
				UfjSoftphone.btnRetrieve.disabled = true;
			}*/

			if(bConsultTrans == true) {
				UfjSoftphone.btnConsult.disabled = false;
			} else {
				UfjSoftphone.btnConsult.disabled = true;
			}

			if(bTransfer == true) { 
				UfjSoftphone.btnTransfer.disabled = false;
			} else {
				UfjSoftphone.btnTransfer.disabled = true;
			}

			if(bReconnectTrans == true) {
				UfjSoftphone.btnReconnecet.disabled = false;
			} else {
				UfjSoftphone.btnReconnecet.disabled = true;
			}

			if(bConference == true) {
				UfjSoftphone.btnConference.disabled = false;
			} else {
				UfjSoftphone.btnConference.disabled = true;
			}

			if(bReady == true) { 
				UfjSoftphone.btnReady.disabled = false;
			} else {
				UfjSoftphone.btnReady.disabled = true;
			}

			if (bNotReady == true) {
				UfjSoftphone.btnNotReady1.disabled = false;
				UfjSoftphone.btnNotReady2.disabled = false;
				UfjSoftphone.btnNotReady3.disabled = false;
				UfjSoftphone.btnNotReady4.disabled = false;
				UfjSoftphone.btnWorkNotReady.disabled = false;
			} else {
				UfjSoftphone.btnNotReady1.disabled = true;
				UfjSoftphone.btnNotReady2.disabled = true;
				UfjSoftphone.btnNotReady3.disabled = true;
				UfjSoftphone.btnNotReady4.disabled = true;
				UfjSoftphone.btnWorkNotReady.disabled = true;
			}
		},
		string: {
			left: function(str, n){
				if (n <= 0)
				    return "";
				else if (n > String(str).length)
				    return str;
				else
				    return String(str).substring(0,n);
			},
			right: function(str, n){
			    if (n <= 0)
			       return "";
			    else if (n > String(str).length)
			       return str;
			    else {
			       var iLen = String(str).length;
			       return String(str).substring(iLen, iLen - n);
			    }
			}
		},
		getObject: function(id) {
        return document.getElementById(id);
    }
}
