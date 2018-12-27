(function(window, document, $, undefined) {

	$.fn.dataTable.ext.totalizer = function ( settings )
	{
		if(!$(settings.aanFeatures.t).hasClass('dt-totalizer')) {return;}
		Init_Totalizer_Widget( settings );
	},
	
	
	Init_Totalizer_Widget = function ( settings ) {
		var columnResult = [], rows, len;
		rows = settings.aoData;
		len = $(rows).length;
		
		$(settings.columnArray).each(function(indice, data)
			{
				if(columnResult[data.num] === undefined)
				{
					columnResult[data.num] = {};
					columnResult[data.num]['global'] = {value : 0, nb: 0};
					columnResult[data.num]['view'] = {value : 0, nb: 0};
					columnResult[data.num]['filter'] = {value : 0, nb: 0};
					columnResult[data.num]['bord'] = {max : 0, min: 0};
				}
				
				$(settings.aiDisplay).each(function(ind, d)
				{
					columnResult[data.num]['filter'].nb++;
					if(!isNaN(parseFloat(rows[d]._aData[data.nom])))
					{
						columnResult[data.num]['filter'].value += parseFloat(rows[d]._aData[data.nom]);
					}
				});
			});

			for(i=0; i< len; i++)
			{
				$(settings.columnArray).each(function(indice, data)
				{
					if(rows[i].nTr.isConnected)
					{
						columnResult[data.num]['view'].nb++;
					}

					columnResult[data.num]['global'].nb++;
					if(!isNaN(parseFloat(rows[i]._aData[data.nom])))
					{
						if(rows[i].nTr.isConnected)
						{
							columnResult[data.num]['view'].value += parseFloat(rows[i]._aData[data.nom]);
						}
						columnResult[data.num]['global'].value += parseFloat(rows[i]._aData[data.nom]);
						if(parseFloat(rows[i]._aData[data.nom]) > columnResult[data.num]['bord'].max)
						{
							columnResult[data.num]['bord'].max = parseFloat(rows[i]._aData[data.nom]);
						}
						if(parseFloat(rows[i]._aData[data.nom]) < columnResult[data.num]['bord'].min)
						{
							columnResult[data.num]['bord'].min = parseFloat(rows[i]._aData[data.nom]);
						}
						
					}
				});
			}
			
			$(settings.columnArray).each(function(indice, data)
			{
				columnResult[data.num]['global'].value = columnResult[data.num]['global'].value.toFixed(2);
				columnResult[data.num]['view'].value = columnResult[data.num]['view'].value.toFixed(2);
				columnResult[data.num]['filter'].value = columnResult[data.num]['filter'].value.toFixed(2);
				columnResult[data.num]['bord'].min = columnResult[data.num]['bord'].min.toFixed(2);
				columnResult[data.num]['bord'].max = columnResult[data.num]['bord'].max.toFixed(2);
			});
			
			$('.dt-calc-sum').each(function (ind, d)
			{
				valsum = null;
				
				if($(this).hasClass('dt-filter'))
				{
					valsum = columnResult[$(this).data('numCol')]['filter'].value;
				}

				if($(this).hasClass('dt-global'))
				{
					valsum = columnResult[$(this).data('numCol')]['global'].value;
				}

				if($(this).hasClass('dt-view'))
				{
					valsum = columnResult[$(this).data('numCol')]['view'].value;
				}
				
				if (valsum !== null)
				{
					if(settings.aoColumns[$(this).data('numCol')].mRender !== null)
					{
						$(this).html(settings.aoColumns[$(this).data('numCol')].mRender.display(valsum));
					}
					else
					{
						$(this).html(valsum);
					}
				}
			});

			$('.dt-calc-nb').each(function (ind, d)
			{
				if($(this).hasClass('dt-filter'))
				{
					$(this).html(columnResult[$(this).data('numCol')]['filter'].nb);
				}

				if($(this).hasClass('dt-global'))
				{
					$(this).html(columnResult[$(this).data('numCol')]['global'].nb);
				}

				if($(this).hasClass('dt-view'))
				{
					$(this).html(columnResult[$(this).data('numCol')]['view'].nb);
				}
			});

			$('.dt-calc-avg').each(function (ind, d)
			{
				if($(this).hasClass('dt-filter'))
				{
					average = (columnResult[$(this).data('numCol')]['filter'].value / columnResult[$(this).data('numCol')]['filter'].nb).toFixed(2);
				}

				if($(this).hasClass('dt-global'))
				{
					average = (columnResult[$(this).data('numCol')]['global'].value / columnResult[$(this).data('numCol')]['global'].nb).toFixed(2);
				}

				if($(this).hasClass('dt-view'))
				{
					average = (columnResult[$(this).data('numCol')]['view'].value / columnResult[$(this).data('numCol')]['view'].nb).toFixed(2);
				}
				
				if (average !== null)
				{
					if(settings.aoColumns[$(this).data('numCol')].render !== undefined)
					{
						$(this).html(settings.aoColumns[$(this).data('numCol')].render.display(average));
					}
					else
					{
						$(this).html(average);
					}
				}
			});
			
			$('.dt-calc-bord').each(function (ind, d)
			{
				if($(this).hasClass('dt-min'))
				{
					bord = columnResult[$(this).data('numCol')]['bord'].min;
				}
				
				if($(this).hasClass('dt-max'))
				{
					bord = columnResult[$(this).data('numCol')]['bord'].max;
				}
				
				if (bord !== null)
				{
					if(settings.aoColumns[$(this).data('numCol')].render !== undefined)
					{
						$(this).html(settings.aoColumns[$(this).data('numCol')].render.display(bord));
					}
					else
					{
						$(this).html(bord);
					}
				}
			});
			
		};
	
})(window, document, jQuery);