var $cyl = window.cyl || {};

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
