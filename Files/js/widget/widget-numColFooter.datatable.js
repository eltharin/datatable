(function(window, document, $) {

	$.fn.dataTable.ext.numColFooter = function ( settings )
	{
		if(!$(settings.aanFeatures.t).hasClass('dt-totalizer')) {return;}
		Init_numColFooter_Widget( settings );
	},
	
	Init_numColFooter_Widget = function ( settings ) {
		
		var virtualArray = [], nbColumn, nbRow, columnArray = [], rows, len;
		var classes = ['dt-calc-sum','dt-calc-avg','dt-calc-nb', 'dt-calc-bord'];
		nbColumn = settings.aoColumns.length;
		nbRow = settings.nTFoot.childElementCount;
		rows = settings.aoData;
		len = $(rows).length;
		
		for(r = 0; r < nbRow; r++)
		{
			virtualArray.push([]);
			for(c=0; c < nbColumn; c++)
			{
				virtualArray[r][c] = c;
			}
		}
		
		$('tfoot > tr').each(function(row, data)
		{
			numcol=0; 
			for(a=0;a<nbColumn;a++)
			{
				if(virtualArray[row][a] !== 'X')
				{
					d = $(data).children().get(numcol);
					for(i=0;i<$(d).attr('colspan');i++)
					{
						for(j=0;j<$(d).attr('rowspan');j++)
						{
							if(!(i === 0 && j === 0))
							{
								virtualArray[row+j][a+i] = 'X';
							}
						}
					}
					numcol ++;
				}
			};
		});
		
		$('tfoot > tr').each(function(index, data)
		{
			numcol=0;
			for(a=0;a<nbColumn;a++)
			{
				if(virtualArray[index][a] !== 'X')
				{
					d = $(data).children().get(numcol);
					if($(d).is('.'+classes.join(', .')))
					{
						$(d).data("numCol", virtualArray[index][a]);
						found = $.map(columnArray, function(val) {
							if(val.num === $(d).data("numCol"))
							{
								return 0;
							};
						});
						if(found.length === 0)
						{
							columnArray.push({ num: $(d).data("numCol"), nom: settings.aoColumns[a].mData});
						}
						
					}
					numcol ++;
				}
			};
		});
		settings.columnArray = columnArray;
	};
	
})(window, document, jQuery);