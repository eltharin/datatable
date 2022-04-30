
//filter settings
$.fn.dataTable.defaults.oLanguage.sInfo = "_START_ à _END_ sur _TOTAL_ lignes";
$.fn.dataTable.defaults.oLanguage.sInfoFiltered = " (filtrage sur _MAX_ lignes) ";
$.fn.dataTable.defaults.bStateSave = false; //save filter in session storage or localStorage
$.fn.dataTable.defaults.sPaginationType = "pager";
$.fn.dataTable.defaults.lengthMenu = [[10, 25, 50, 100, 250, 500, -1], [10, 25, 50, 100, 250, 500, "All"]];
$.fn.dataTable.defaults.bInfo = true;
$.fn.dataTable.defaults.ordering = true;
$.fn.dataTable.defaults.paging = true;
$.fn.dataTable.defaults.autoWidth = false;
$.fn.dataTable.defaults.lengthChange = false;
$.fn.dataTable.defaults.sDom = "FipLt";

$.fn.dataTable.defaults.sDom = "<'datatable_flex'<'datatable_controls'Fpi>L<'datatable_button'>><'dataTables_divtable't>"; 
$.fn.dataTable.defaults.aaSorting = [];
$.fn.dataTable.defaults.aoColumnDefs=tableRender;
$.fn.dataTable.defaults.searchDelay=250;
$.fn.dataTable.defaults.deferRender=true;


$(document).ready(  function ()
{
    $('table.dt').dataTable();
});


$(document).on( 'preInit.dt', function (e, oSettings) 
{
	datatableSettings = oSettings;
//    console.log("preInit");
	if(!$(oSettings.nTable).hasClass('dt-pager') && !$(oSettings.nTable).hasClass('dt-ofp') && !$(oSettings.nTable).hasClass('dt-fp'))
	{
		$('#'+oSettings.sTableId+'_info').remove();
		$('#'+oSettings.sTableId+'_paginate').remove();
	}

	if(!$(oSettings.nTable).hasClass('dt-nosort'))
	{
		oSettings.oFeatures.bSort = true;
	}
	else
	{
		oSettings.oFeatures.bSort = false;
		$.fn.dataTable.defaults.ordering = false;
	}

	if($(oSettings.nTable).hasClass('dt-json'))
	{
		new $.fn.dataTable.ext.json(oSettings);
	}
	
	if($(oSettings.nTable).hasClass('dt-filter') || $(oSettings.nTable).hasClass('dt-fp') || $(oSettings.nTable).hasClass('dt-ofp'))
	{
		new $.fn.dataTable.ext.filter(oSettings);
	}
	if($(oSettings.nTable).hasClass('dt-totalizer'))
	{
		new $.fn.dataTable.ext.numColFooter(oSettings);
	}
});

$(document).off('plugin-init.dt').on( 'plugin-init.dt', function (e, oSettings) 
{
    //console.log("plugin");
	if($(oSettings.nTable).hasClass('dt-output') || $(oSettings.nTable).hasClass('dt-ofp'))
	{
		new $.fn.dataTable.ext.output(oSettings);
	}
});


$(document).on( 'draw.dt', function (e, oSettings) 
{
    //console.log("draw");
	if($(oSettings.nTable).hasClass('dt-totalizer'))
	{
		new $.fn.dataTable.ext.totalizer(oSettings);
	}
});


jQuery.extend( jQuery.fn.dataTableExt.type.search, {
		date: function ( data ) 
		{
			return data.replace( /[\r\n]/g, " " )
					   .replace( /<([^>]*)>/g, "" );
		}
	} );



jQuery.extend( jQuery.fn.dataTableExt.oSort, 
{
	"date-pre": function ( date ) 
	{
		var date = date.replace( /<.*?>/g, "" );
		if(date.length > 0)
		{
			var pattern = new RegExp(/^(([0-9]{2})[\/\-\.]([0-9]{2})[\/\-\.](\d{4}))(\s{1}(\d{2}):(\d{2})(:(\d{2}))?)?/);
			var match = pattern.exec(date); 
			if(match !== null)
			{
				if(match[4]) {year  = match[4];} else {year = '0000';}
				if(match[3]) {month = match[3];} else {month = '00';}
				if(match[2]) {day   = match[2];} else {day = '00';}
				if(match[6]) {hour  = match[6];} else {hour = '00';}
				if(match[7]) {minut = match[7];} else {minut = '00';}
				if(match[9]) {second = match[9];} else {second = '00';}
				
				return (year + '-' + month + '-' + day + ' ' + hour + ':' + minut + ':' + second);
			}


		}
		return ('0000-00-00 00:00:00');
	},
	"date-asc": function ( a, b ) 
	{
		return ((a < b) ? -1 : ((a > b) ? 1 : 0));
	},
	"date-desc": function ( a, b ) 
	{
		return ((a < b) ? 1 : ((a > b) ? -1 : 0));
	},
	"montant-pre": function ( a ) 
	{
		return a;
	},
	"montant-asc": function ( a, b ) 
	{
		return ((b < a) ? -1 : ((b > a) ? 1 : 0));
	},
	"montant-desc": function ( a, b ) 
	{
		return ((b < a) ? 1 : ((b > a) ? -1 : 0));
	}
});

$.fn.dataTableExt.ofnSearch['date'] = function ( date )
{
	if (date == null)
	{
		date = '';
	}
	return date.replace( /<.*?>/g, "" );
};

//--- Datatable new functions

$.fn.dataTableExt.oApi.fnLoadHTML = function ( oSettings,data)
{
	oSettings.oApi._fnClearTable(oSettings);
	oSettings.oApi._fnAddTr(oSettings,data);
	oSettings.oApi._fnReDraw(oSettings,true);
};

$.fn.dataTableExt.oApi.fnLoadJSON = function ( oSettings,data)
{
	if(jQuery.type( data ) === "string")
	{
		try 
		{ 
			data = $.parseJSON(data); 
		} 
		catch(err)  
		{ 
			console.log(err);
		}
	}	
	oSettings.oApi._fnClearTable(oSettings);
	oSettings.oApi._fnAjaxUpdateDraw(oSettings,{data:data});
	oSettings.oApi._fnReDraw(oSettings,true);

	if(oSettings.zfilter !== undefined)
	{
		oSettings.zfilter.create_filters(oSettings);
	}
};

$.fn.dataTableExt.oApi.fnLoadBigTableFromURL = function ( oSettings,url)
{
	oSettings.oApi._fnClearTable(oSettings);
	getAjaxDataForBigTable(oSettings,url,{});

};

function getAjaxDataForBigTable(oSettings,url,params)
{
	$.post( url,params, function( data ) {
		try
		{
			if (data != '')
			{
				data = $.parseJSON(data);

				//console.log(data);

				$.each(data.data,function (i,v){
					oSettings.oApi._fnAddData(oSettings,v);
				});
				data.data = null;

				oSettings.oApi._fnReDraw(oSettings,true);


				if (data.next == 'plus')
				{
					getAjaxDataForBigTable(oSettings,url,{transactionuuid:data.uuid});
				}
				else
				{
					oSettings.zfilter.create_filters(oSettings);
				}
			}
		}
		catch(err)
		{
			console.log(err);
		}
    });
}

function toto()
{
	$.post( url, function( data ) {
		try
		{
			data = $.parseJSON(data);
			console.log(data.data);

			$.each(data.data,function (i,v){
				oSettings.oApi._fnAddData(oSettings,v);
			});

			oSettings.oApi._fnReDraw(oSettings,true);

			    $.post( url, {transactionuuid:data.uuid}, function( data ) {
				try
				{
					data = $.parseJSON(data);
					console.log(data.data);

					$.each(data.data,function (i,v){
						oSettings.oApi._fnAddData(oSettings,v);
					});
					oSettings.oApi._fnReDraw(oSettings,true);
				}
				catch(err)
				{
					console.log(err);
				}
			});
		}
		catch(err)
		{
			console.log(err);
		}
    });
}


$.fn.dataTableExt.oApi.fnGetAllObject = function ( oSettings,formid,object)
{
	var myobj=[];
	$(oSettings.aoData).each(function(k){
		$(this.nTr).find(object).each(function(){
				myobj.push(this);
		});
	});
	return myobj;
}

$.fn.dataTableExt.oApi.fnGetObject = function ( oSettings)
{
	oSettings.oApi._fnLengthChange(oSettings,-1);
	oSettings.oApi._fnReDraw(oSettings,true);
}

$.fn.dataTableExt.oApi.fnSetOption = function ( oSettings,settings)
{
	console.log(oSettings)
}