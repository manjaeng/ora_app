function clearInput(elem){
	var last_obj = "";
	$.each(elem, function(idx, obj){
		if (elem.form != undefined && elem.form != "") {
			last_obj = $("#"+obj, $("#"+elem.form));
			last_obj.val("");
		} else {
			last_obj = $("#"+obj);
			last_obj.val("");
		}
 
	});
	last_obj.focus();  
}

function clearInput2(elem){
	var arrData = elem.split(",");
	for(var i = 0; i < arrData.length; i++) {
		$("#"+arrData[i]).val("");
	}
	$("#"+arrData[0]).focus();
}

function fnCombo(tabId, targetId){

	var stat = $("#"+targetId).css('display');
    if (stat == 'none'){
		$("#"+targetId).show();
        $("#"+tabId)[0].className = $("#"+tabId)[0].className.replace("off", "on");
    }else{
		$("#"+targetId).hide();
        $("#"+tabId)[0].className = $("#"+tabId)[0].className.replace("on", "off");
    }
    //wijmo flexgrid 사용시 필요. 이걸 호출 하지 않으면 display:block 할 경우 새로 조회하지 않는 이상. 컬럼및 데이터가 렌더링 되지 않는다.
    try {
        if(displayBlockGrid && typeof(displayBlockGrid) == "function"){
        	displayBlockGrid();
        }		
	} catch (e) {
		// TODO: handle exception
	}

}

function fnCombo2(tabId, targetId, gridId){    
	var stat = $("#"+targetId).css('display');
	
	var targetHeight = $("#"+targetId).height();
	var gridHeight = $("#"+gridId).height();

	if (stat == 'none'){
		$("#"+targetId).show();
		$("#"+gridId).height(gridHeight-targetHeight);
		$("#"+tabId)[0].className = $("#"+tabId)[0].className.replace("off", "on");
    }else{
		$("#"+targetId).hide();
		$("#"+gridId).height(gridHeight+targetHeight);
        $("#"+tabId)[0].className = $("#"+tabId)[0].className.replace("on", "off");
    }
}

function selectToggle(sid){  
	var iopt;
	var sopt;
	for ( var i = 0; i < $("#"+sid+" option").size(); i++ ) {
		iopt = $("#"+sid+" option:eq("+i+")").val();
		sopt = $("#"+sid+" option:selected").val();
		if (sopt == iopt) {$("#"+iopt).show();}
		else{$("#"+iopt).hide();}
	}
}

// LAYER 처리
function lyrOpen(selectId) {
	var selectVal = $("#"+selectId).val();
	var arrData = selectVal.split(",");
	
	var lyrId = arrData[0];

	var top = "50%";     
	var left = "50%";
	var width = $("#"+lyrId).width();
	var height = $("#"+lyrId).height();
	var	margin_top = -(height/2)+'px';
	var	margin_left =  -(width/2)+'px';
	
	if(lyrId){
		$('#'+lyrId).show();
		$('#'+lyrId).appendTo("body");
		$('#'+lyrId).css({
			top: top, 
			left: left,
			marginTop:	margin_top,
			marginLeft: margin_left
		});

		// BLOCK UI
		$("<div id='mask'></div><iframe id='mask_ifr' frameborder='0' ></iframe>").appendTo("body");
	}
}

function lyrCombo(lyrId,top,left,width2,height2) {
	
	var stat = $("#"+lyrId).css('display');
	
	//top = top +'px';     
	//left = left +'px';
	//width = width +'px';
	//height = height +'px';
	
	var top = "50%";     
	var left = "50%";
	var width = $("#"+lyrId).width();
	var height = $("#"+lyrId).height();
	var	margin_top = -(height/2)+'px';
	var	margin_left =  -(width/2)+'px';

	if (stat == 'none'){
		$('#'+lyrId).show();
		$('#'+lyrId).appendTo("body");
		$('#'+lyrId).css({
			position:'absolute', 
			width: width2 +'px',
			top: top, 
			left: left, 
			marginTop:	margin_top,
			marginLeft: margin_left
		});

		// BLOCK UI
		$("<div id='mask'></div><iframe id='mask_ifr' frameborder='0' ></iframe>").appendTo("body");

    }else{
		$("#"+lyrId).hide();
		
		// UNBLOCK UI
		$('#mask').remove();
		$('#mask_ifr').remove();
    }	
}

// 레이어 Show/Hide 처리
function displayLayer(id, disp) {
	var obj = document.getElementById(id);
	obj.style.display = disp;
	
	// UNBLOCK UI
	if ($("body:has('#mask')")){		
		$('#mask').remove();
		$('#mask_ifr').remove();
	}
}

function fnToggleFrm(targetId) {
	var frame = parent.frames['content_frame'];
	var	stat = frame.$("#"+targetId).css('display');

	if (stat == 'none'){
		frame.$("#"+targetId).show();
    }else{
		frame.$("#"+targetId).hide();
    }
}

function fnToggle(targetId, btnId) {
	var stat = $("#"+targetId).css('display');
	
	if (stat == 'none'){
		$("#"+targetId).show();
    }else{
		$("#"+targetId).hide();
    }
	
	if(btnId){
        // POSITION
        var bt_top = $("#"+btnId).offset().top;
		var bt_left = $("#"+btnId).offset().left;
		var el_height = $('#'+targetId).height() + 12;

        $('#'+targetId).css({top:bt_top-el_height,left:bt_left-90});
    }
}

function fnTabImg(tabSize, tabId, idx, targetId) {
	
	 for ( var i = 0; i < tabSize; i++ ) {
        if ( i == idx ) {
			$("#"+tabId+i).attr("src", $("#"+tabId+i).attr("src").replace("_off", "_on"));
            if ( $("#"+targetId+i) ) { $("#"+targetId+i).show(); }
        }else{
			$("#"+tabId+i).attr("src", $("#"+tabId+i).attr("src").replace("_on", "_off"));
            if ( $("#"+targetId+i) ) { $("#"+targetId+i).hide(); }
        }
    }
}

function fnTab(tabSize, tabId, idx, targetId) {


    for ( var i = 0; i < tabSize; i++ ) {
        if ( i == idx ) {
            $("#"+tabId+i)[0].className = $("#"+tabId+i)[0].className.replace("off", "on");
            if ( $("#"+targetId+i) ) { $("#"+targetId+i).show(); }
        }else{
            $("#"+tabId+i)[0].className = $("#"+tabId+i)[0].className.replace("on", "off");
            if ( $("#"+targetId+i) ) {$("#"+targetId+i).hide(); }
        }
    }
    
//    //wijmo flexgrid 사용시 필요. 이걸 호출 하지 않으면 display:block 할 경우 새로 조회하지 않는 이상. 컬럼및 데이터가 렌더링 되지 않는다.
//    if(displayBlockGrid && typeof(displayBlockGrid) == "function"){
//    	displayBlockGrid();
//    }
}

function frameCombo(tabId, targetId){
	var frame = parent.frames['content_frame'];
	var	stat = frame.$("#sub").width()+'px';
	
    if (frame.$("#contents").css('left') == stat){
		frame.$("#contents").css('left','0');
		frame.$("#contents").css('width',frame.$("#contents").width() + frame.$("#sub").width());
		frame.$("#sub").css('left','-'+stat);

    }else{
		frame.$("#contents").css('left',stat);
		frame.$("#contents").css('width',frame.$("#contents").width() - frame.$("#sub").width());
		frame.$("#sub").css('left','0');
    }
}


function fnHeight(tabId, targetId, targetHeight) {
	
	if ($("#"+tabId+">span").text() == "입력창 넓히기 ▼"){
		$("#"+tabId+">span").text("입력창 줄이기 ▲");
		$("#"+targetId).height(targetHeight);
    }else{
		$("#"+tabId+">span").text("입력창 넓히기 ▼");
		$("#"+targetId).height(200);
    }
}

function RemoveEl(id,pid) {
	$("#"+id).remove();
	if(pid){$("#"+pid).append("<li id='"+id+"'><a href='#lnb' class='on'>메뉴추가</a></li>");}
}


// IMG COLOR
function fnColor(tabSize, targetId, idx) {

	 for ( var i = 0; i < tabSize; i++ ) {
        if ( i == idx ) {
			$("#"+targetId+i)[0].className = $("#"+targetId+i)[0].className.replace("off", "on");
		
			if ($("#"+targetId+i+"[class *= box]")[0]){
				$("#"+targetId+i).append("<img src='../../images/ico_color_chk.gif' />");
			 }else{
				$("#"+targetId+i).append("<img src='../../images/ico_color_chk2.gif' />");	
			}
        }else{
			$("#"+targetId+i)[0].className = $("#"+targetId+i)[0].className.replace("on", "off");
			$("#"+targetId+i).empty();
        }
    }
}

// a rollver
$(function() {    
	$("a.rollover").hover(
	function() {
	this.className = this.className.replace("off","on");
	},
	function() {
	this.className = this.className.replace("on","off");
	}); 
});

// image rollver
$(function() {    
	$("img.rollover, input.rollover").hover(
	function() {
	this.src = this.src.replace("_off","_on");
	},
	function() {
	this.src = this.src.replace("_on","_off");
	}); 
});

$(function() {    
	$("#lnb li").hover(
	function() {
	this.className = this.className.replace("","on");
	},
	function() {
	this.className = this.className.replace("on","");
	}); 
});


$(function() {   
    $('.hover a').hover(
        function () { $(this).parent().parent().addClass('active');},
        function () { $(this).parent().parent().removeClass('active');  }
    );
});

//글자수 제한
function limitCharacters(textid, limit, limitid){        
	
	// 입력 값 저장        
	var text = $('#'+textid).val();   

	// 입력값 길이 저장        
	var textlength = text.length;   // 전체길이       
	if(textlength > limit){                
		//$('#'+limitid).html(limit+ '자 이상 쓸수 없습니다!');                
		alert("글자를 초과 입력할수 없습니다. 초과된 내용은 자동으로 삭제 됩니다."); 
		// 제한 글자 길이만큼 값 재 저장                
		$('#'+textid).val(text.substr(0,limit));                
		return false;        
	}else{                
		$('#'+limitid).val(limit - textlength);                
		return true;        
	}
}

// PHOTO
function changeImage(pid, imageUrl) {
	 if (pid){$("#"+pid).attr("src",imageUrl);}
} 

// DATE
/*
jQuery(function($){
	$(".cal").prev(".inputbox").addClass('readonly');
});
*/

// READONLY
jQuery(function($){
	$('input.readonly').attr("readonly",true);
	$('textarea.readonly').attr("readonly",true);
	$('.readonly>input').attr("readonly",true);
	$('.inputtxt.readonly>textarea').attr("readonly",true);
});

// POPUP
jQuery(function($){
	$(".popup").parents("body").css("background","#FFF");
});