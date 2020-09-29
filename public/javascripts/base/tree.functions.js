/**
 * node API
 * node.Key 			-> 해당 노드의 키값
 * node.Level			-> 해당 노드의 레벨(1 > 2 > 3 > 4 ..., 최상위 레벨은 1)
 * node.Get(string)	-> 해당 노드에 바인딩되어 있는 값 조회
 * node.Count()		-> 해당 노드의 자식 갯수
 * node.UnRoll()		-> 해당 노드 펼치기
 * node.Roll()		-> 해당 노드 닫기
 * node.GetParent()	-> 부모 노드 구하기
 */
(function ($) {
	var message = "사용할 수 없는 기능 입니다.";
    $.fn.tree.functions = {
		/**
		 * 노드에 자식 추가
		 * {
		 *  root: boolean,							-> 주어진 data를 무조건 root에 추가시킨다.
		 * 	key: String, 								-> 해당키의 노드에 자식추가(키값이 없으면 현재 선택되어 있는 노드에 자식추가. 선택된 노드가 없으면 최상위에 자식추가)
		 * 	data: { key1:value1, key2:value2, ... },	-> 추가될 자식의 데이타 정보
		 *  action: String,							-> action이 지정되어 있으면 data는 무시되고 해당 action을 호출하여 자식데이타를 추가한다.(조회된 만큼 모두 추가한다.)
		 *  params:{ key1: value2, key2: value2, ... }	-> action 지정시 함께 전송될 패러미터 정보 셋팅 
		 * }
		 * 
		 * data로 한건 추가시만 해당 node를 리턴한다. action으로 추가시 null 리턴
		 */
		AddNode: function(p) {
			alert(message);
		},
		/**
		 * 주어진 action의 결과를 tree에 셋팅함. LEVEL 필드가 있어야 함.
		 */
		AddNodes: function(p) {
			alert(message);
		},
		/**
		 * 현재 선택되어진 노드 조회
		 * 선택되어진 노드가 없을 경우 null 리턴
		 */
		SelectedNode: function(p) {
			alert(message);
		},
		/**
		 * 해당 노드의 index에 해당하는 자식노드를 선택한다. key값이 없을 경우 트리뷰이 최상위 자식들의 index 번째를 선택한다.
		 * {
		 * 	key:String,		//선택하고자 하는 자식의 부모 키, key값 생략시 최상위 자식들중에 선택
		 * 	index: Number	//해당 key 자식의 인덱스	<- 인덱스가 없으면 해당 key의 노드를 선택
		 * }
		 */
		SelectNode: function(p) {
			alert(message);
		},		
        /**
         * key값을 알고 있다면 해당 노드를 조회할 수 있다.
         * {
         * 	key: String
         * }
         */
        GetNode: function(p) {
        	alert(message);
        },
        /**
         * 해당 key값 노드의 자식정보 조회(key값이 없으면 최상위 ROOT 밑에 자식정보)
         * {
         * 	key: String
         * }
         * 노드의 배열이 리턴됨
         */
        GetChildren: function(p) {
        	alert(message);
        },
        /**
         * 트리의 모든 노드를 제거한다.
         * {
         * 	key: String 	//key값이 있으면 해당 key의 자식들만 제거한다.
         * }
         */
        ClearNodes: function(p) {
        	alert(message);
        },
        /**
         * {
         * 	key: String	//해당 key의 노드와 하위 노드를 제거한다.
         * }
         */
        RemoveNode: function(p) {
        	alert(message);
        },
        /**
		 * 노드값 변경하기
		 * {
		 *  key: String				//대상 노드의 키값
		 * 	data: { key1: value1, key2: value2, .. },
		 * }
		 */
		SetData : function(p) {
			alert(message);
		},
		/**
		 * 텍스트 검색
		 * {
		 *  keyword: String
		 * }
		 */
		SearchNodes: function(p) {
			alert(message);
		}
    };
})(jQuery);