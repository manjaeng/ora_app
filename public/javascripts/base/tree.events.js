(function ($) {
    $.fn.tree.events = {
        Initialize: function () { //초기화시 발생이벤트        	
            //alert("Initialize");
        },
        TreeClick: function() {	//트리가 클릭 되었을 경우	-> 페이지내 createLayer로 생성된 레이어를 제거한다.
        	if (_clicked) {
        		$(document).click();
        		_clicked = true;
        	};        	
        },
        /**
         * node : 클릭된 node를 리턴
         * node.Key -> 노드마다 가지고 있는 트리내의 유일한 Key값 리턴
         * node.Get("bingding") -> 바인딩되어 있는 값을 리턴
         */
        NodeClick: function (node) { //노드 클릭시        	
            //alert("NodeClick");
        },
        AnchorClick: function (node) { //앵커 클릭시        	
            //alert("NodeClick");
        },
        /**
         * action으로 AddNode 완료후 발생 
         */
        EndAddNode : function(result) {
        	//alert("EndAddNode");
        },
        /**
         * action으로 AddNodes 완료후 발생 
         */
        EndAddNodes : function(result) {
        	//alert("EndAddNodes");
        },
        /**
         * 노드가 페이지에 추가되기 전 발생
         */
        BeforeAddNode: function(node) {
        	
        },
        EndLogin: function (result) {	//서버쪽 로그인 정보 없을 경우 발생
        	//alert("EndLogin \n");
        }
    };

})(jQuery);