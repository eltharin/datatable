/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
 var datatablesSettingsArray = [];
 
(function(window, document, $, undefined) {
	
	$.fn.dataTable.ext.output = function ( oSettings ) {
		var settings = oSettings;
		settings.output = [];
		
		active_output( settings );
	};
	
	setup = function ( settings ) {
		var output = settings.output, mydonne = [], $rows = [];
		
		if(settings.output === undefined) {
			return;
		}
		
		$.each(settings.aiDisplay, function (index, val) {
			$rows.push(settings.aoData[val]);
		});
		
		output.header = header( settings );
		
		mydonne['header'] = output.header['name'];
		mydonne['banned'] = output.header['banned'];
		mydonne['data'] = body(settings, $rows, output.header['tab_col'], output.header['banned']);
		mydonne['footer'] = footer(settings);
		return mydonne;
	};
	
	footer = function( settings )
	{
		var index_colonne = 0, tab_show = [];
        var oTFoot = $(settings.nTFoot);
		var value = '[';
		
		oTFoot.children('tr').each(function()
		{
			$(this).find('th').each(function () {
				
				if($(this).attr('colspan') > 1) {

					if($.isNumeric($(this).attr("colspan")) === false) 
					{
						index_colonne += 1;
					} 
					else 
					{
						index_colonne +=  parseInt($(this).attr("colspan"));
					}
				}
				else if ($(this).attr("rowspan") > 1) 
				{
					tab_show.push(index_colonne);
					index_colonne += 1;
				} 
				else if (tab_show.indexOf(index_colonne) !== -1) 
				{
						index_colonne += 2;
				} 
				else 
				{
						index_colonne += 1;
				}
				value += '{\"value\":\"' + $(this).text() + '\",\"colspan\":\"' + parseInt($(this).attr("colspan")) + '\",\"rowspan\":\"' + parseInt($(this).attr("rowspan")) + '\"},';
			});
			value = value.substr(0, (value.length - 1)) + "],[";
			
		});
		value = "[" + value.substr(0, (value.length - 2)) + "]";
		return value;
	};
	

	header = function( settings ) {
		var tab_col = [],index_colonne = 0, tab_show = [],dataheader = [];
		var oThead = $(settings.nTHead);
		var banned = [];
		var name = '[';
		
		$(settings.aoColumns).each(function () {
			if(this.print === "no")
			{
				banned.push(this.idx);
			}
		});			
				
		oThead.children('tr').each(function () {
			
			if(!$(this).hasClass('dataTable-research')) {
				
				
				$(this).find('th').each(function () {
										
				
			
						if($(this).attr('colspan') > 1) {

							if($.isNumeric($(this).attr("colspan")) === false) {

								index_colonne += 1;
							} else {

								index_colonne +=  parseInt($(this).attr("colspan"));
							}
						} else if ($(this).attr("rowspan") > 1) {
								tab_show.push(index_colonne);
								index_colonne += 1;
						} else if (tab_show.indexOf(index_colonne) !== -1) {
							index_colonne += 2;
						} else {
							index_colonne += 1;
						}

						var taille = 0;
						var align = "";
						var format = "";
						var colspan = "";
						var rowspan = "";
						var showpdf = "";
						var type = "";
						var display = "";



						if ($(this).data("align") === undefined) {
							if ($(this).attr("align") === undefined) {
								align = "C";
							} else {
								align = $(this).attr("align");
							}
						} else {
							align = $(this).data("align");
						}

						if ($.isNumeric($(this).attr("colspan")) === false) {
							colspan = "1";
						} else {
							colspan = parseInt($(this).attr("colspan"));
						}

						if ($.isNumeric($(this).attr("rowspan")) === false) {
							rowspan = "1";
						} else {
							rowspan = parseInt($(this).attr("rowspan"));
						}

						if ($(this).attr("format") === undefined) {
							format = "";
						} else {
							format = $(this).attr("format");
						}
						
						if ($(this).data("format") === undefined) {
							//format = "";
						} else {
							format = $(this).data("format");
						}

						if ($(this).data("print") === undefined) {
							if ($(this).attr("showpdf") === undefined) {
								showpdf = "";
							} else {
								showpdf = $(this).attr("showpdf");
							}	
						} else {
							showpdf = $(this).data("print");
						}						

						if ($(this).attr("type") === undefined) {
							type = "";
						} else {
							type = $(this).attr("type");
						}

						if ($(this).data("size") === undefined) 
						{
							if ($(this).attr("taille") === undefined) 
							{
								if(colspan > 1)
								{
									taille = "";
								}
								else
								{
									taille = "20";
								}

							} else {
								taille = $(this).attr("taille");
							}	

						} else {
							taille = $(this).data("size");
						}								   


						if ($(this).is(':visible')) {
							display = "";
						} else {
							display = 'none';
						}

						name += '{\"name\":\"' + $(this).text() + '\",\"type\":\"' + type + '\",\"showpdf\":\"' + showpdf + '\",\"taille\":\"' + taille + '\",\"colspan\":\"' + colspan + '\",\"rowspan\":\"' + rowspan + '\",\"align\":\"' + align + '\",\"display\":\"' + display + '\",\"format\":\"' + format + '\"},';
					
				});
				
					name = name.substr(0, (name.length - 1)) + "],[";
			}
		});
		name = "[" + name.substr(0, (name.length - 2)) + "]";


		dataheader['banned'] = banned;
		dataheader['name'] = name;
		dataheader['tab_col'] = tab_col;
		return dataheader;
	};
	
	body = function ( settings, $rows, tab_col, banned) {
		var rowsLength = $rows.length;
		var mydata = "[";
		for (var rowIndex = 0; rowIndex < rowsLength; rowIndex++)
		{
			mydata += "[";
			if(jQuery.type($rows[rowIndex]._aData) === 'object')
			{

				for (var i=0; i< $(settings.aoColumns).length; i++)
				{
					var allow = true;
					
					jQuery.each(banned, function(index, value)
					{
						allow &= i!==value;
					});

					if(allow)
					{
						if($rows[rowIndex]._aData[settings.aoColumns[i].data])
						{
							if($rows[rowIndex]._aData[settings.aoColumns[i].data] === null)
							{
								mydata += '"' + '",';
							}
							else
							{
								var data = $rows[rowIndex]._aData[settings.aoColumns[i].data];
								
								if(settings.aoColumns[i].mRender !== null)
								{
									if(settings.aoColumns[i].mRender.export !== undefined)
									{
										data = settings.aoColumns[i].mRender.export(data,'export',$rows[rowIndex]._aData);
									}
									else if(settings.aoColumns[i].mRender.display !== undefined)
									{
										data = settings.aoColumns[i].mRender.display(data,'display',$rows[rowIndex]._aData);
									}
									else
									{
										data = settings.aoColumns[i].mRender(data,'display',$rows[rowIndex]._aData);	
									}
								}
								mydata += '"' + data.toString().replace( /<([^>]*)>/g, "" )
													.replace(/\"/g, '')
													.replace(/\\/g, '\\\\')
													.replace(/\t/g, ' ')
													.replace(/\r\n/g, '</br>')
													.replace(/\r/g, '</br>')
													.replace(/\n/g, '</br>')
													 + '",';							
							}
						}
						else
						{
							mydata += '"' + '",';
						}
					}
				}
			}
			else
			{
				for (var i=0; i< $rows[rowIndex]._aData.length; i++)
				{
                    allow = true;

                    jQuery.each(banned, function(index, value)
                    {
                        if(value === i)
						{
							allow = false;
						}
                    });

                    if(allow) {
                        var data = $rows[rowIndex]._aData[i];

                        if (settings.aoColumns[i].mRender !== null) 
						{
							if(settings.aoColumns[i].mRender.export !== undefined)
							{
								data = settings.aoColumns[i].mRender.export(data);
							}
							else if(settings.aoColumns[i].mRender.display !== undefined)
							{
								data = settings.aoColumns[i].mRender.display(data);
							}
                            
                        }
                        mydata += '"' + data.toString().replace(/<([^>]*)>/g, "")
													   .replace(/\"/g, '')
													   .replace(/\\/g, '\\\\')
													   .replace(/\t/g, ' ')
													   .replace(/\r\n/g, '</br>')
													   .replace(/\r/g, '</br>')
													   .replace(/\n/g, '</br>') + '",';
                    }

				}
			}
			
			mydata = mydata.substr(0, mydata.length-1);
			mydata += "],";
					
		}
		if(mydata.length > 2)
		{
            mydata = mydata.substr(0, mydata.length -2);
            mydata += "]]";
		}
		else
		{
			mydata = "";
		}

        return mydata;
	};
	
	active_output = function ( settings )
	{
		var mydonnee, tId;
		if(settings.aanFeatures.t.length === 0) {
			return;
		}

		var dom_table = $(settings.aanFeatures.t);
		tId = dom_table.attr('id');
		
		datatablesSettingsArray[dom_table.attr('id')] = settings;
		
		$(dom_table).closest('.dataTables_wrapper').children('.datatable_flex').children('.datatable_button').append('<form method="POST" action="/datatable_export/export" class="datatable_export_form_output">'+
				'<input type=hidden name="colonne" value = "" >'+
				'<input type=hidden name="data" value = "" >'+
				'<input type=hidden name="footer" value = "" >'+
				'<input type=hidden name="param" value = "" >'+
				'<input type=hidden name="titre" value = "" >'+
				'<input type=hidden name="banned" value = "" >'+
				'<input type=hidden name="type" value = "" >'+
				'<input type="button" value="Export XL" class="datatable_export_button" data-forid="'+tId+'">'+
				'<input type="button" value=" " class="datatable_export_showparam">'+
				'<div class="datatable_export_parampage">'+
					'<div class="datatable_export_parampagecontent">'+
						'<div>'+
							'<input type="radio" class="datatable_export_choix" name="type_exp" value="XL" checked> Excel'+
							'<input type="radio" class="datatable_export_choix" name="type_exp" value="PDF"> Pdf'+
							'<hr>'+
						'</div>'+

						'Prendre les valeurs nulles : '+
						'<input type="radio" name="valeurs" value="1" checked> Oui'+
						'<input type="radio" name="valeurs" value="0"> Non<br><hr>'+
											
						'<div class="datatable_export_paramexport_xl" style="display:none;">'+
						'</div>'+
											
						'<div class="datatable_export_paramexport_pdf" style="display:none;">'+
							'Parametrage : '+
							'<input type="radio" class="datatable_export_exportpdf_parametrage" name="param" value="auto" checked> auto'+
							'<input type="radio" class="datatable_export_exportpdf_parametrage" name="param" value="mano"> manuel <br>'+
									
							'Orientation : '+
							'<input type="radio" name="orientation" class="datatable_export_exportpdf_disabler" value="L" checked disabled> paysage'+
							'<input type="radio" name="orientation" class="datatable_export_exportpdf_disabler" value="P" disabled> portrait <br>'+
							
							'Type taille : '+
							'<input type="radio" name="type_taille" class="datatable_export_exportpdf_disabler" value="A4" checked disabled> A4'+
							'<input type="radio" name="type_taille" class="datatable_export_exportpdf_disabler" value="A3" disabled> A3<br>'+
							
							'Rupture :' +
							'<select name="rupture">' +
								'<option selected></option>'+
							'</select>' +
						'</div>' + 
					'</div>' + 
				'</div>'+
			'</form>');
					
		var valRup = 0;
		$(settings.aoColumns).each(function ()
		{
			var colonne = this.nTh.outerHTML;
			var colonne_regex = /^<th ((?!data-print="no").)*$/i;

			if(colonne_regex.test(colonne))
			{
				$(dom_table).closest('.dataTables_wrapper').find('select[name=rupture]').append('<option value='+valRup+'>'+this.sTitle+'</option>');
				valRup++;
			}
		});
	};
})(window, document, jQuery);


$(document).on('click', function (e)
{
	if($(".datatable_export_showparam").is(e.target)/* && $('.datatable_export_parampagecontent').css('display') === 'none0'*/)
	{
		var parampagecontent = $(e.target).closest('.dataTables_wrapper').find('.datatable_export_parampagecontent');
		
		if(parampagecontent.css('display') == 'none')
		{
			$('.datatable_export_parampagecontent').css('display', 'none');
			parampagecontent.css('display', 'inline-block');
		}
		else
		{
			$('.datatable_export_parampagecontent').css('display', 'none');
		}
	}
	else if(!$(".datatable_export_parampagecontent").is(e.target) && $(".datatable_export_parampagecontent").has(e.target).length === 0)
	{
		$('.datatable_export_parampagecontent').css('display', 'none');
	}
});

$(document).on('click', '.datatable_export_choix', function ()
{
	var parampagecontent = $(this).closest('.dataTables_wrapper').find('.datatable_export_parampagecontent');
	
	if($(this).val() == 'xl')
	{
		parampagecontent.find('.datatable_export_paramexport_pdf').hide();
		parampagecontent.find('.datatable_export_paramexport_xl').show();
	}
	else
	{
		parampagecontent.find('.datatable_export_paramexport_xl').hide();
		parampagecontent.find('.datatable_export_paramexport_pdf').show();
	}	
	
	$(this).closest('.dataTables_wrapper').find('.datatable_export_button').val('Export ' + $(this).val());
});

$(document).on('click', '.datatable_export_exportpdf_parametrage', function ()
{
	if($(this).val()==="mano")
	{
		$(this).closest('.dataTables_wrapper').find('.datatable_export_paramexport_pdf').find('[name=orientation]').prop('disabled', false);
		$(this).closest('.dataTables_wrapper').find('.datatable_export_paramexport_pdf').find('[name=type_taille]').prop('disabled', false);
	}
	else
	{
		$(this).closest('.dataTables_wrapper').find('.datatable_export_paramexport_pdf').find('[name=orientation][value=L]').prop('checked', true);
		$(this).closest('.dataTables_wrapper').find('.datatable_export_paramexport_pdf').find('[name=type_taille][value=A4]').prop('checked', true);
		
		$(this).closest('.dataTables_wrapper').find('.datatable_export_paramexport_pdf').find('[name=orientation]').prop('disabled', true);
		$(this).closest('.dataTables_wrapper').find('.datatable_export_paramexport_pdf').find('[name=type_taille]').prop('disabled', true);

	}
});


$(document).on('click', '.datatable_export_button', function (e)
{

	mydonnee = setup(datatablesSettingsArray[$(e.target).data('forid')]);
	
	if(mydonnee['data'].length > 0)
	{
		var title = $('#'+$(e.target).data('forid')).attr('pdf_title');
		var param = $('#'+$(e.target).data('forid')).attr('pdf_param');

		if (title === 'undefined'){title = '';}
		if (param === 'undefined'){param = '';}
		
		
		$(this).closest('.dataTables_wrapper').find('.datatable_export_form_output').find('input[name=data]').attr("value", mydonnee['data']);
		$(this).closest('.dataTables_wrapper').find('.datatable_export_form_output').find('input[name=colonne]').attr("value",mydonnee['header']);
		$(this).closest('.dataTables_wrapper').find('.datatable_export_form_output').find('input[name=footer]').attr("value",mydonnee['footer']);
		$(this).closest('.dataTables_wrapper').find('.datatable_export_form_output').find('input[name=banned]').attr("value",mydonnee['banned']);
		$(this).closest('.dataTables_wrapper').find('.datatable_export_form_output').find('input[name=titre]').attr("value",title);
		$(this).closest('.dataTables_wrapper').find('.datatable_export_form_output').find('input[name=param]').attr("value",param);
		
		if($(this).closest('.dataTables_wrapper').find('.datatable_export_parampagecontent').find('input[name=type_exp]').val() === 'XL')
		{
			$(this).closest('.dataTables_wrapper').find('.datatable_export_form_output').find('input[name=type]').attr("value", "excel");
		}
		else
		{
			$(this).closest('.dataTables_wrapper').find('.datatable_export_form_output').find('input[name=type]').attr("value", "pdf");
		}
		$(this).closest('.dataTables_wrapper').find('.datatable_export_form_output').submit();
	}
	else
	{
		ohSnap('Il n\'y a aucune donnée à exporter', {color: 'red'});
	}
});