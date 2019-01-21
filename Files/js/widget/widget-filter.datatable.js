(function(window, document, $) {
$.fn.dataTable.ext.filter = function ( settings ) {
	settings.zfilter = [];
	settings.zfilter.oClasse = {
		thClasse : "dataTable-col-research",
		noFilter  : "none",
		sFilter : "dataTable-select-research",
		iFilter : "dataTable-input-research",
		custFilter : "is_customFilter",
		iClassFilter : "is_input_customFilter"
	};
	settings.zfilter.cols = [];
	settings.zfilter.selects = [];
	settings.zfilter.multiselect = true;
	
	settings.zfilter.trFilter = $('<tr class="dataTable-research"></tr>');
	$(settings.nTHead).append(settings.zfilter.trFilter);
	
	$(document).on('dblclick','.'+settings.zfilter.oClasse.iFilter,function(){
			$(this).val('<<vide>>');
			$(this).change();
		});
	
	settings.aoInitComplete.push( {
		"sName" : "filter_widget",
		"fn": function (settings) {
			var oClasse = settings.zfilter.oClasse;
			var trFilter = settings.zfilter.trFilter;
			var th = getRow(settings);
			settings.zfilter.th = th;
			settings.datatableinstance = this;
			var thLen = th.length;

			for (var i = 0; i < thLen; i++)
			{
				if(th[i].hasClass('filter-none'))
				{
					th.push($('<th idx="'+i+'" class="'+oClasse.thClasse + ' '+ oClasse.noFilter+'"></th>').appendTo(trFilter));
				}
				else if(th[i].hasClass('filter-select'))
				{
					settings.zfilter.cols[i] = "";
					settings.aoPreSearchCols[i].exactSearch = true;
					var myth = $('<th idx="'+i+'" class="'+oClasse.thClasse+'"></th>').appendTo(trFilter);
					
					th.push(myth);
					var select = $('<select class="'+oClasse.sFilter+' select_parametre"></select>');
					settings.zfilter.selects[i] = select;
					
					select.appendTo(myth).on( 'change', function () {
						settings.zfilter.cols[$(this).parent().attr('idx')] = $(this).val();
						settings.oApi._fnReDraw(settings);
						settings.zfilter.redraw_filters(settings);
					});

					settings.zfilter.get_data_select(i);
					if(th[i].data('filter') !== undefined)
					{
						if(select.find('option[value='+th[i].data('filter')+']').length === 0)
						{
                            select.append('<option value="'+th[i].data('filter')+'">'+th[i].data('filter')+'</option>');
						}
                        select.val(th[i].data('filter')).prop('selected', true);
						settings.zfilter.cols[i] = th[i].data('filter');
						settings.oApi._fnReDraw(settings);
					}
					
					if(settings.zfilter.multiselect)
					{
						select.attr('multiple','multiple');
						select.val('');
						select.multipleSelect({
							selectAll: true,
							width: '100%',
							filter:true,
							dropWidth: 'auto'
						});
					}
				}
				else
				{
					settings.aoPreSearchCols[i].exactSearch = false;
					var myth = ($('<th idx="'+i+'" class="'+oClasse.thClasse+'"></th>').appendTo(trFilter));
					th.push(myth);
					if(th[i].data('search'))
					{
						var input = $('<input class="'+oClasse.iFilter+'" type="search" value="' + th[i].data('search') + '">');
					}
					else
					{
						var input = $('<input class="'+oClasse.iFilter+'" type="search">');
					}

					input.appendTo(myth).on( 'change keyup search', function () {
						if($(this).val().match(/[\<\>\!\=]/g))
						{
							settings.zfilter.cols[$(this).parent().attr('idx')] = $(this).val();
							settings.aoPreSearchCols[$(this).parent().attr('idx')].sSearch = "";
						}
						else
						{
							settings.zfilter.cols[$(this).parent().attr('idx')] = "";
							settings.aoPreSearchCols[$(this).parent().attr('idx')].sSearch = $(this).val();
							
						}	
						settings.oApi._fnReDraw(settings);	
						settings.zfilter.redraw_filters(settings);						
					});
					if(input.val() !== '')
					{
						input.trigger('search');
					}
				}
			}
		}
	});
	
	$.fn.dataTableExt.afnFiltering.push
	(
        function (oSettings, aData) 
		{
			var val_return = true;
			
			
			if(oSettings.zfilter != undefined)
			{
				$(oSettings.zfilter.cols).each(
				function(index,value)
				{
					//console.log(value)
					if(value !== null && value !== "" && value !== undefined && value.length > 0)
					{

						if(settings.aoPreSearchCols[index].exactSearch)
						{
							if(value.indexOf(aData[index]) === -1 && (value.indexOf("<<vide>>") === -1 || (aData[index] !== null && aData[index] !== "" && aData[index] !== " ")))
							{
								val_return = false;
							}
						}
						else if(settings.zfilter.cols[index] !== "")
						{
							str = settings.zfilter.cols[index].replace(" ","");

							if(str === "<<vide>>")
							{
								if(aData[index] !== "")
								{
									val_return = false;
								}
							}
							else if(str.substring(0,2) === ">=")
							{
								if(!(parseFloat(aData[index]) >= parseFloat(str.substring(2))))
								{
									val_return = false;
								}
							}
							else if(str.substring(0,1) === ">")
							{
								if(!(parseFloat(aData[index]) > parseFloat(str.substring(1))))
								{
									val_return = false;
								}
							}
							else if(str.substring(0,2) === "<=")
							{
								if(!(parseFloat(aData[index]) <= parseFloat(str.substring(2))))
								{
									val_return = false;
								}
							}
							else if(str.substring(0,1) === "<")
							{
								if(!(parseFloat(aData[index]) < parseFloat(str.substring(1))))
								{
									val_return = false;
								}
							}
							else if(str.substring(0,1) === "=")
							{
								if(!(parseFloat(aData[index]) === parseFloat(str.substring(1))))
								{
									val_return = false;
								}
							}
							else if(str.substring(0,2) === "==")
							{
								if(!(parseFloat(aData[index]) === parseFloat(str.substring(2))))
								{
									val_return = false;
								}
							}
							else if(str.substring(0,2) === "!=")
							{
								if(!(parseFloat(aData[index]) !== parseFloat(str.substring(2))))
								{
									val_return = false;
								}
							}
						}
						else
						{
							if(!aData[index].match(new RegExp(value)))
							{
								val_return = false;
							}
						}
					}
				});
			}
			return val_return;
        }
    );
	
	settings.zfilter.get_data_select = function(i)
	{
		var column = settings.datatableinstance.api().column(i);
		var valvide= false;
		var select = settings.zfilter.selects[i];
		select.empty();
				
		column.data().map(settings.zfilter.convert_filter_data).unique().sort(Intl.Collator().compare).each( function ( d, j )
		{
			if(d !== null && d !== "" && d !== " ")
			{
				select.append( '<option value="'+d+'">'+d+'</option>' );
			}
			else
			{
				valvide= true;
			}
		});

		if(valvide)
		{
			$('<option value="<<vide>>">&lt;&lt;vide&gt;&gt;</option>').prependTo(select);
		}
		if(!settings.zfilter.multiselect)
		{
			$('<option value="" selected="selected"></option>').prependTo(select);
		}
	};

	settings.zfilter.create_filters = function()
	{
		
			var th = getRow(settings);
			var thLen = th.length;
			
			for (var i = 0; i < thLen; i++)
			{
				if(th[i].hasClass('filter-select'))
				{
					select = settings.zfilter.selects[i];
					var oldval = select.val();
					
				    settings.zfilter.get_data_select(i);
					
					
					if(th[i].data('filter') !== undefined)
					{
						if(select.find('option[value='+th[i].data('filter')+']').length === 0)
						{
                            select.append('<option value="'+th[i].data('filter')+'">'+th[i].data('filter')+'</option>');
						}
                        select.val(th[i].data('filter')).prop('selected', true);
						

						settings.zfilter.cols[i] = th[i].data('filter');
						settings.oApi._fnReDraw(settings);
					}
					
					if(settings.zfilter.multiselect)
					{
						select.attr('multiple','multiple');
						select.val(oldval);
						select.multipleSelect({
							selectAll: true,
							width: '100%',
							filter:true,
							dropWidth: 'auto'
						});
					}
				}
			}
	};

	settings.zfilter.redraw_filters = function()
	{
		settings.zfilter.trFilter.find('option').css('color','black');
		settings.zfilter.trFilter.find('li span').css('color','black');
        
		if(settings.aoData.length != settings.aiDisplay.length)
		{
			$(settings.zfilter.selects).each(function( index, mySelect ) {
			if(mySelect != undefined)
			{
				data = [];
				$(settings.aiDisplay).each(function(a,b){
					
					if(settings.aoColumns[index].data != undefined)
					{
						val = settings.aoData[b]._aData[settings.aoColumns[index].data];
					}
					else
					{
						val = settings.aoData[b]._aData[index];
					}
					
					if($.inArray(val,data))
					{
						data.push(val);
					}
				});
				
				data = data.map(settings.zfilter.convert_filter_data);

				mySelect.find('option').each(function(k,v ) {
						if($.inArray($(v).val(),data) === -1)
						{
							$(v).css('color','grey');
						}					
					});
					
				mySelect.parents('th').find('li span').each(function(k,v ) {
						if($.inArray($(v).html(),data) === -1)
						{
							$(v).css('color','grey');
						}				
					});
				}
			});
		}
	};
	settings.zfilter.convert_filter_data = function(a)
	{
		if(a === null)
		{
			a = '';
		}
		
		return a.toString().replace( /[\r\n]/g, " " ).replace( /<([^>]*)title="([^"]*)"([^>]*)>/g, "$2" ).replace( /<([^>]*)>/g, "" );
	};
},
getRow = function(settings){
	var tr = $(settings.aoHeader).last().get(0);
	var len = tr.length, filterHead=[];
	for (var i = 0; i < len; i++)
	{
		filterHead.push($($(tr).eq(i).get(0)['cell']));
	}
	return filterHead;
};

})(window, document, jQuery);


