var $cyl = window.cyl || {};

/**
 * th 에 정렬 표시하는 script 
 * ajax 를 통하여 목록을 새로고침하는 경우만 사용가능. 
 * thead 는 그대로 이고 tbody 만 목록을 새로고침 해주어야함. 
 * 
 * table 의 thead 안에 있는 thead > tr > th 에 sort event 를 건다.
 * toggle 되는 3가지 event 를 custom 할경우 funcObj 에 함수를 넣어주고 사용 안할 경우 아예 빼면 기본값이 사용된다. 
 * 
 * usage : 
 * var param = {
 * 		elements : $jquery('thead > tr > th'),
 * 		data : {
 * 			th_idx : {up : 'name', down : 'name desc'},
 * 			3 : {up : 'depart', down : 'depart desc'},
 * 			4 : {up : 'email', down : 'email desc'}
 * 		},
 * 		funcObj : {
 * 			first : function(element){},
 * 			second : function(element){},
 * 			third : function(element){}
 * 		},
 * 		funcFinal : function(){ console.log('클릭 후 마지막에 실행되는 함수')}
 * }
 * $cyl.thSort(param);
 * 
 */
$cyl.thSort = function(param) {
	
	var elements = param.elements;
	var data = param.data;
	var funcObj = param.funcObj || null;
	var funcFinal = param.funcFinal || null;
	
	var _arrSort = [];
	
	/**
	 * th 에 title 을 달아서 몇번째 정렬인지 표시한다. 
	 */
	var orderNum = function(){
		elements.each(function(idx,el) {
			if( data.hasOwnProperty(idx) ){
				var downIdx = _arrSort.indexOf($(el).data('down'));
				var upIdx = _arrSort.indexOf($(el).data('up'));
				if(downIdx > -1){
					$(el).attr('title', (downIdx + 1) + '번째 정렬');
				}else if(upIdx > -1){
					$(el).attr('title', (upIdx + 1) + '번째 정렬');
				}else{
					$(el).removeAttr('title');
				}
			}
		});
	}
	
	/**
	 * 정렬 텍스트를 리턴한다. 
	 * usage : thSort.sortText()
	 */
	var _sortText = function(){
		var arrSortText = [];
		elements.each(function(idx,el) {
			var downIdx = _arrSort.indexOf($(el).data('down'));
			var upIdx = _arrSort.indexOf($(el).data('up'));
			if(downIdx > -1){
				arrSortText[downIdx] = $(el).text() + ' ▼'; 
			}else if(upIdx > -1){
				arrSortText[upIdx] = $(el).text() + ' ▲';
			}
   		});
		return arrSortText.join();
	}
	
	/**
	 * toggle 되는 event 기본 값이다. 
	 * first, second, third 순으로 실행된다. 
	 */
	var _default = {
		first : function(_element){
			_element.find('span').remove();
    		_element.append($('<span>',{class : 'ui-dynatree-btn-up', style : 'float:right;position:relative;height:12px;' }));	
    		if(_arrSort.indexOf(_element.data('down')) > -1){
    			_arrSort.splice(_arrSort.indexOf(_element.data('down')),1);	
    		}
    		_arrSort.push(_element.data('up'));
    		orderNum();
    		if(funcFinal){funcFinal();}
		},
		second : function(_element){
			_element.find('span').remove();
    		_element.append($('<span>',{class : 'ui-dynatree-btn-down', style : 'float:right;position:relative;height:12px;' }));
    		if(_arrSort.indexOf(_element.data('up')) > -1){
    			_arrSort.splice(_arrSort.indexOf(_element.data('up')),1);	
    		}
    		_arrSort.push(_element.data('down'));
    		orderNum();
    		if(funcFinal){funcFinal();}
		},
		third : function(_element){
			_element.find('span').remove();
    		if(_arrSort.indexOf(_element.data('up')) > -1){
    			_arrSort.splice(_arrSort.indexOf(_element.data('up')),1);	
    		}
    		if(_arrSort.indexOf(_element.data('down')) > -1){
    			_arrSort.splice(_arrSort.indexOf(_element.data('down')),1);	
    		}
    		orderNum();
    		if(funcFinal){funcFinal();}
		}
	}
	/**
	 * 초기화 함수
	 */
	var _init = function(){
		if(elements){
			elements.each(function(idx,el) {
				if( data.hasOwnProperty(idx) ){
					$(el).addClass('sorting');
					$(el).data(data[idx]);
					if(funcObj && funcObj.first && funcObj.second && funcObj.third){
						$(el).on('click',function(){
							if(!$(el).data('flag')){
								funcObj.first($(el));
								$(el).data('flag','first');
							}else if($(el).data('flag') == 'first'){
								funcObj.second($(el));
								$(el).data('flag','second');
							}else if($(el).data('flag') == 'second'){
								funcObj.third($(el));
								$.removeData( el, 'flag');
							}
						});
					}else{
						$(el).on('click',function(){
							if(!$(el).data('flag')){
								_default.first($(el));
								$(el).data('flag','first');
							}else if($(el).data('flag') == 'first'){
								_default.second($(el));
								$(el).data('flag','second');
							}else if($(el).data('flag') == 'second'){
								_default.third($(el));
								$.removeData( el, 'flag');
							}
						});
					}
					$(el).css( 'cursor', 'pointer' );
				}
			});
		}else{
			console.log('thSort element not find');
		}
	}
	
	/**
	 * 정렬했던 내용을 초기화
	 */
	var _clear = function(){
		elements.each(function(idx,el) {
			$(el).find('span').remove();
			$.removeData( el, 'flag');
		});
		_arrSort.length = 0;
	}
	
	_init(); // initialize
	
	/**
	 * thSort 초기화 이후에 접근할 함수나, 변수를 return 처리 
	 */
	return {
		arrSort : _arrSort,
		clear : _clear,
		sortText : _sortText,
		finalFunction : funcFinal
	};
}

/**
 * 같은 값이 있는 열을 병합함
 * 사용법 : $cyl.rowspan($jquery('tableId'), colIdx);
 * 비고 : isStats parameter 의 기능을 파악못함. isStats 가 true 이면 바로 전에 있는 td에 있는 값도 확인하여 rowspan 을 하는 것 같다.   
 */
$cyl.rowSpan = function(table, colIdx, isStats) {
	return table.each(function() {
		var that;
		$('tr', this).each(function(row) {
			$('td', this).eq(colIdx).filter(':visible').each(function(col) {

				if ($(this).html() == $(that).html() && (!isStats || isStats && $(this).prev().html() == $(that).prev().html())) {
					rowspan = $(that).attr("rowspan") || 1;
					rowspan = Number(rowspan) + 1;

					$(that).attr("rowspan", rowspan);

					// do your action for the colspan cell here
					$(this).hide();

					// $(this).remove();
					// do your action for the old cell here

				} else {
					that = this;
				}

				// set the that if not already set
				that = (that == null) ? this : that;
			});
		});
	});
}

/**
 * 같은 값이 있는 열을 병합함
 * 사용법 : $cyl.colSpan($jquery('tableId'), colIdx);
 */
$cyl.colSpan = function(table, rowIdx) {
	return table.each(function() {
		var that;
		$('tr', this).filter(":eq(" + rowIdx + ")").each(function(row) {
			$(this).find('td').filter(':visible').each(function(col) {
				if ($(this).html() == $(that).html()) {
					colspan = $(that).attr("colSpan");
					if (colspan == undefined) {
						$(that).attr("colSpan", 1);
						colspan = $(that).attr("colSpan");
					}
					colspan = Number(colspan) + 1;
					$(that).attr("colSpan", colspan);
					$(this).hide(); // .remove();  
				} else {
					that = this;
				}
				that = (that == null) ? this : that; // set the that if not already set  
			});
		});

	});
}  
