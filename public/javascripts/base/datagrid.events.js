(function ($) {	
	$.fn.grid.events = {
        Initialize: function () { //Grid 초기화시 발생이벤트        	
            //alert("Initialize");
        },
        EndQuery: function (result) {   	//DoQuery 종료시 발생 이벤트
            //alert("EndQuery \n" + result.TotalCount);
        },
        EndSave: function (result) {   	//DoSave 종료시 발생 이벤트
            //alert("EndSave \n");
        },
        EndLogin: function (result) {	//서버쪽 로그인 정보 없을 경우 발생
        	//alert("EndLogin \n");
        },
        GridClick: function() {	//그리드가 클릭 되었을 경우(셀영역 클릭, 스크롤바 위치 변경)	-> 페이지내 createLayer로 생성된 레이어를 제거한다.
        	if (_clicked) {
        		$(document).click();
        		_clicked = true;
        	};        	
        },
        /**
         * cell.Id	-> 컬럼 ID
         * cell.Row		-> Row 번호
         * cell.Value		-> Cell 값
         */
        CellClick: function (cell) {  //Cell 클릭시 발생 이벤트
            //alert("CellClick \n [" + row + ", " + col + "] -> " + value);
        },
        CheckboxClick: function (check) {
        	//alert(check.Checked + ", " + check.Row);
        },
        /**
         * cell.Id	-> 컬럼 ID
         * cell.Row		-> Row 번호
         * cell.Value		-> Cell 값
         */
        CellDblClick: function (cell) {  //Cell 더블클릭시 발생 이벤트
        	//alert("CellDblClick \n [" + cell.Row + ", " + cell.Id + "] -> " + cell.Value);
        },
        /**
         * cell.Id			-> 컬럼 ID
         * cell.Row		-> Row 번호
         * cell.Value		-> Cell 값
         * cell.PreValue	-> 변경전 셀의 값
         * cell.OrgValue -> 셀의 최초값
         */
        ChangeCell: function (cell) {     //Cell이 변경되었을때 발생 이벤트
        	//alert("Id : " + cell.Id + "\nRow : " +  cell.Row + "\nColumn : " + cell.Value  + "\nPreValue : " + cell.PreValue + "\nOrgValue : " +  cell.OrgValue);            
        },
        ChangeCombo: function (cell) {     //콤보가 변경되었을때 발생 이벤트
        	//alert("Id : " + cell.Id + "\nRow : " +  cell.Row + "\nColumn : " + cell.Value  + "\nPreValue : " + cell.PreValue + "\nOrgValue : " +  cell.OrgValue);            
        }, 
        /**
         * 셀 편집 시작시 발생
         * return:Overpass.FlexGrid.Scriptable.ScriptableCell
         * cell.Id			-> 컬럼 ID
         * cell.Row		-> Row 번호
         * cell.Value		-> Cell 값
         */
        BeginEdit: function(cell) {
        	//alert("Id : " + cell.Id + "\nRow : " +  cell.Row + "\nColumn : " + cell.Value);
        },
        /**
         * 로우 변경시 발생(0.5초)
         * row1 : 변경된 row 정보
         * row2 : 바로이전에 RowChanged 이벤트가 발생된 row 정보
         */
        RowChanged: function(row1, row2) {	
        	//alert("RowChanged");        	
        },
        /**
         * Row정보가 추가될 때 마다 발생
         */
        RowAdded: function(row) {
        	//alert("RowAdded");      
        },
        /**
         * 셀안의 버튼 클릭시 발생
         */
        ButtonClick: function(cell) {
        	//alert("ButtonClick");
        },
        /**
         * FilterRow 실행완료후 호출됨.
         */
        EndFilter: function(row) {
        	//alert("EndFilter");
        },
        End: function(message) {
        	alert(message);
        },
        /**
         * 엑셀 가져오기 파일 작업전 발생(파일에 대한 처리 방법 설정:서버 업로드 후 처리 등등) 
         */
        BeforeExcelImport: function() {
        	//alert("BeforeExcelImport");
        	return { upload: true};
        },
        /**
         * 엑셀 가져오기 완료후 발생 
         */
        EndExcelImport: function(a) {
        	if (a.code == "F"){
        		alert(a.error_message);;
        	}
        },
        /**
         * 엑셀 내보내기 실행전에 발생
         */
        BeforeExcelExport: function() {
        	//alert("BeforeExcelExport");
        },
        RowDragged: function(row) {	
        	//alert("Id : " + row.Target + "\nRow : " +  row.Row + "\nRow : " + row.Data);            
        },
        BeforeFooterAdded: function(row) {},
        
        /**
         * 임의의 그룹 로우를 추가한다.
         * rows : 임의의 그룹 로우를 추가 하기전 화면에 뿌려질 전체 row 배열
         * return 배열.
         */
        BeforeGroupRowAdd: function(rows) {
        	//alert("BeforeGroupRowAdd length :" + rows.length);
        //	return []
        }

    };

})(jQuery);