(function ($) {
	var message = "사용할 수 없는 기능 입니다.";
	$.fn.grid.functions = {
		/**
		 * 서버로 질의 전송
		 * {
		 * 	action:String,
		 * 	form:[String1, String2, ...],
		 * 	params:{key1:value2, key2:value2, ...},	//동일키 사용시 마지막 값 반영
		 * 	save: boolean		//디폴트 false -> true 실제 서버로 전송되지 않고 그리드의 컬럼정보와 서버 전송 패러미터 정보를 문자열 형태로 리턴한다.
		 * }	
		 */
        DoQuery: function (p) {
        	alert(message + " [DoQuery]");
        },
        /**
         * 서버로 그리드의 변경내용을 함께 전송
         * {
         * 	action:String,
         * 	cud:["C", "U", "D", "R"],
         *  checked: boolean,		//cud가 "R"인 경우 check된 row만 넘기고 싶을경우 true로 셋팅, false일 경우 모든 데이타가 다 넘어감
         * 	form:[String1, String2, ...],
         * 	params:{key1: value2, key2: value2, ...}	//동일키 사용시 마지막 값 반영
         * }
         */
        DoSave: function (p) {
        	alert(message + " [DoSave]");
        },
        /**
         * 그리드내 row 추가, 레벨이 있는 트리형 그리드의 경우 현재 선택되어진 Row의 하위 또는 동일 레벨에 Row가 추가된다. row값은 무시된다.
         * {
         * 	row:number	-> 추가될 row의 순서(디폴트 0),	-1 일 경우 트리형 그리드의 ROOT 레벨에 추가한다.
         *  data:{id1: value1, id2: value2, ...},	-> 셋팅할 값(id는 그리드에 셋팅된 id값과 일치하여야 함)
         *  sibling:boolean		-> 레벨이 있는 트리형 그리드의 경우 true:동일레벨에 추가, false:하위에 추가 디폴트는 false
         *  tree_row: number 	-> 트리형 그리드에서 사용할 경우 현재 선택되어진 Row가 아니라 tree_row로 지정된 row를 기준으로 처리됨.
         * }
         */
        AddRow: function (p) {
        	alert(message + " [AddRow]");
        },
        /**
         * 컬럼 추가 
         * {컬럼정보}
         */
        AddColumn: function (p) {
        	alert(message + " [AddColumn]");
        },
        /**
         * 컬럼 제거 
         * {
         * 	id: string	-> 제거할 컬럼ID
         * }
         */
        RemoveColumn: function (p) {
        	alert(message + " [RemoveColumn]");
        },
        /**
         * 트리형 그리드내에서 현재 선택된 Row를 위/아래로 이동 시킨다.
         * 순서가 서로 바뀐 두 row의 위치값이 배열로 리턴된다. int[] -> int[0] : 이동되어진 위치, int[1] : 이로 인해서 이동된 row의 위치 
         * {
         *  direction: String	-> "U"/"D" 위/아래 
         * }
         */
        MoveRow: function(p) {
        	alert(message + " [MoveRow]");
        },
        /**
         * 행삭제(CRUD중 C인 체크된 Row를 그리드에서 제거한다.)
         * {
         * 	옵션없음
         * } 
         */
        DeleteCreateRows : function(p) {
        	alert(message + " [DeleteCreateRows]");
        },
        /**
         * 삭제(CRUD중 RU인 체크된 Row를 삭제대상 처리. 실제로 그리드에서 제거하지 않는다.)
         * 
         * {
         * 	옵션없음
         * }
         */
        DeleteRows : function(p) {
        	alert(message + " [DeleteRows]");
        },
        /**
         * 해당 Row를 실제 그리드에서 제거한다. 
         * {
         * 	row: Number	//삭제하고자 하는 row 번호
         * }
         */
        DeleteRow: function(p) {
        	alert(message + " [DeleteRow]");
        },
        /**
         * 그리드 내 cell 값 조회
         * {
         * 	row:Number, 
         * 	id:String
         * } 
         */
        GetValue: function(p) {
        	alert(message + " [GetValue]");
        },
        /**
         * 지정된 cell 정보 조회
         * {
         * 	row:Number, 
         * 	id:String
         * }
         * return:Overpass.FlexGrid.Scriptable.ScriptableCell
         */
        GetCell: function(p) {
        	alert(message + " [GetCell]");
        },
        /**
         * 그리드의 Row조회
         * {
         * 	row:Number	//row  미지정시 현재 선택된 row 리턴, 현재 선택된 Row가 없으면 null 리턴
         * }
         */
        GetRow: function(p) {
        	alert(message + " [GetRow]");
        },
        /**
         * 그리드의 Row 리스트 조회
         * return 배열 rowData
         * {
         *	checked:boolean		//true일 경우 체크박스 체크된 것만 조회
         * }
         */
        GetRows: function(p) {
        	alert(message + " [GetRows]");
        },
        /**
         * 그리드 내 cell에 값 셋팅
         * {
         * 	row:Number, 
         *	id:String, 
         *	value:String,
         *	bold: boolean,	//true 일 경우 폰트색은 빨간색, 볼드처리
         * event_yn: boolean 	//default: false	false일 경우 BeginEdit, ChangeCell 발생안함.
         * } 
         */
        SetValue: function(p) {
        	alert(message + " [SetValue]");
        },
        /**
         * 그리드내 변경된 내용을 최초 상태로 복원(CREATE, UPDATE, DELETE)
         * 옵션없음
         * {
         * 	
         * }
         */
        Restore: function(p) {
        	alert(message + " [Restore]");
        },
        /**
         * 지정된 컬럼을 숨긴다.
         * {
         * 	id: String
         * }
         */
        HideColumn: function(p) {
        	alert(message + " [HideColumn]");
        },
        /**
         * 지정된 컬럼을 보여준다.
         * {
         * 	id: String
         * }
         */
        ShowColumn: function(p) {
        	alert(message + " [ShowColumn]");
        },
        /**
         * 지정된 컬럼의 인덱스를 변경한다.
         * {
         * 	id: String,
         * 	index: number
         * }
         */
        SetColumnIndex: function(p) {
        	alert(message + " [SetColumnIndex]");
        },
        /**
         * 지정된 row를 숨긴다.
         * {
         * 	row:number
         * }
         */
        HideRow: function(p) {
        	alert(message + " [HideRow]");
        },
        /**
         * 지정된 row를 보여준다.
         * {
         * 	row:number
         * }
         */
        ShowRow: function(p) {
        	alert(message + " [ShowRow]");
        },
        /**
         * 콤보 다시 생성
         * {
         * 	row:Number,
         *  id:String,
         *  combo: String | { action:String, cd:String, name:String, params: {k1: v1, ...} },		//콤보값이 String일 경우 공통코드 대분류를 조회함. action을 직접 지정하고 cd, name, params을 셋팅하면 사용자가 지정한 값 사용 가능 
         * }
         */
        CreateCombo: function(p) {
        	alert(message + " [CreateCombo]");
        },
        /**
         * 그리드내 모든 row제거
         * {
         * 	옵션없음
         * }
         */
        ClearRows: function(p) {
        	alert(message + " [ClearRows]");
        },
        /**
         * 편집가능한 컬럼내에서 특정 셀의 편집 여부를 셋팅
         * {
         * 	row:Number, 
         *	id:String, 
         *	value:boolean	//true:편집 가능, false:편집 불가능
         * }
         */
        CancelEdit: function(p) {
        	alert(message + " [CancelEdit]");
        },
        /**
         * 그리드내의 row갯수를 반환한다. 
         * {
         * 	옵션없음
         * }
         */
        GetRowCount : function(p) {
        	alert(message + " [GetRowCount]");
        },
        /**
         * 그리드의 컬럼별 편집 가능 여부 셋팅
         * 
         * 편집 우선 순위 cell > column
         * 
         * grid.SetEditable( true||false );	//그리드 전체 컬럼에 대해서 편집여부를 설정한다(true: 편집가능, false: 편집불가)
         * grid.SetEditable({ row: Number, editable: true||false })	//해당 row의 모든 셀에 대해서 편집여부를 설정한다(true: 편집가능, false: 편집불가)
         * grid.SetEditable({ id: String, editable: true||false })	//해당 column에 대해서 편집여부를 설정한다(true: 편집가능, false: 편집불가)
         * grid.SetEditable({ row: Number, id: String, editable: true||false }).	//해당 row/id의 셀에 대해서 편집여부를 설정한다(true: 편집가능, false: 편집불가)
         * grid.SetEditable( [{ id:String, editable:boolean}, {id:String, editable:boolean}, ..., {id:String, editable:boolean} ] );	//해당 컬럼들에 대해서 편집여부를 설정한다(true: 편집가능, false: 편집불가)
         */
        SetEditable: function(p) {
        	alert(message + " [SetEditable]");
        },
        /**
         * 셀별로 타입을 변경
         * {
         *	row: Number, 
         * 	id: String,
         *  type: String	//"T", "N, "D",...
         *  format: String	//타입이 변경된 셀에 적용될 format 	
         * }
         */
        ChangeCellType: function(p) {
        	alert(message + " [ChangeCellType]");
        },
        /**
         * 셀별 속성 재정의(RowAdded 시 사용)
         * {
         *	row:Number, 
         * 	id:String,
         *  button: boolean		//버튼 사용여부 	
         * }
         */
        ChangeCellProperties: function(p) {
        	alert(message + " [ChangeCellProperties]");
        },
        /**
         * 그리드 유효성 검사 -> 유효하지 않은 데이타 존재시 false 리턴. 해당 cell에 focus()
         * {
         * 
         * } 
         */
        CheckRequired: function(p) {
        	alert(message + " [CheckRequired]");
        },
        /**
         * Row 선택
         * {
         * 	row: Number	-> 선택하고자 하는 row 번호
         * } 
         */
        SelectRow: function(p) {
        	alert(message + " [SelectRow]");
        },
        /**
         * Cell 선택
         * {
         * 	row: Number	-> 셀의 row 번호
         *  id: String			-> 셀의 id
         *  edit: boolean	 -> 해당셀이 텍스트 편집일 경우 편집모드로 전환여부(default: false)
         * } 
         */
        SelectCell: function(p) {
        	alert(message + " [SelectCell]");
        },
        /**
         * 레코드 필터링, 선택된 컬럼에 주어진 텍스트로 필터리된 레코드만 노출 시킨다.
         * {
         *  id: String,			-> 컬럼 id
         *  keyword: String	->	검색어 
         * } 
         */
        FilterRow: function(p) {
        	alert(message + " [FilterRow]");
        },
        /**
         * 그리드의 컬럼정보를 다시 셋팅한다.(기존 컬럼 정보는 사라짐)
         * {
         * 
         * }
         */
        ReplaceColumns: function(p) {
        	alert(message + " [ReplaceColumns]");
        },
        /**
         * 해당 Row 체크박스를 셋팅한다.
         * {
         * 	row: number,
         *  crud: String
         *  checked: boolean
         * }
         */
        CheckRow: function(p) {
        	alert(message + " [CheckRow]");
        },
        /**
         * 해당 Row 의 CRUD를 변경한다.
         * CUD로 변경되면 체크박스가 체크된다
         * {
         * 	row: number,
		 *	crud: string
         * }
         */
		ChangeCRUD: function(p) {
        	alert(message + " [ChangeCRUD]");
        },
        /**
         * 레코드 검색, 선택된 컬럼에 주어진 키워드를 포함한 Row를 찾는다.
         * {
         *  id: String,			-> 컬럼 id
         *  keyword: String	->	검색어 
         * } 
         */
        SearchRow: function(p) {
        	alert(message + " [SearchRow]");
        },
        /**
         * Row의 배경색을 변경한다.
         * {
         *  row: number		--> 변경 대상 row 인덱스
         *  id: String			--> 변경 대상 컬럼 아이디(생략시 전체 row의 background색 변경)
         *  color: String	 	--> 변경 색상(R|G|B -> 256색상값 255|255|255)
         * } 
         */
        SetBackground: function(p) {
        	alert(message + " [SetBackground]");
        },
        /**
         * row의 font색을 변경한다.
         * {
         *  row: number		--> 변경 대상 row 인덱스
         *  id: String			--> 변경 대상 컬럼 아이디(생략시 전체 row의 font색 변경)
         *  color: String	 	--> 변경 색상(R|G|B -> 256색상값 255|255|255)
         * } 
         */
        SetForeground: function(p) {
        	alert(message + " [SetForeground]");
        },
        /**
         * 트리형 그리드의 경우 해당 row를 접는다.
         * {
         *  row: number		--> 대상 row 인덱스
         * } 
         */
        CollapseRow: function(p) {
        	alert(message + " [CollapseRow]");
        },
		MergeGroupAddRow : function(p){
		}
    };

})(jQuery);