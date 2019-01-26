/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function(window, document, $, undefined) {
	

	$.fn.dataTable.ext.json = function ( settings ) {

		checkElem(settings);
		
		Init_Json_Widget(settings);

		initColumn( settings );
		
		setJColumn(settings);
	
		setJData( settings);
	},
	
	Init_Json_Widget = function (settings){
		
		settings.json = {
			jData : settings.oInit.myData,
			jColumn:[]
		};
		
	},
	
	initColumn = function (settings){
		var jTh = $(settings.nTHead).children('tr').children('th'), jCol = settings.json.jColumn;
		
		$.each(jTh, function(i,v){	
			
			if($(v).attr('data-column') === undefined){
				//checkElem(settings, 'jth_d_c', v);
			}

			jCol.push({mData:$(v).attr('data-column')});
			
			
		});
	},
	
	setJColumn = function (settings){
		var jColumn = settings.json.jColumn, aoColumns = settings.aoColumns;
		
		$.each(aoColumns, function (i, v)
		{
			v.mData = jColumn[i].mData;
			settings.oApi._fnColumnOptions(settings, i, {data:jColumn[i].mData});
		});
	},
	
	setJData = function(settings){
		var jData = settings.json.jData, arData;
		$.each(jData, function(i, v){
			
			arData = {};
			$.each(v, function(j,w){
				arData[j]=w;
			});
			settings.oApi._fnAddData(settings, arData);
		});
	},
	
	checkElem = function(settings, code, elem){
		if(settings.oInit.myData === undefined)
		{
			settings.oInit.myData = {};
			return ;
		}
		
		if(settings.oInit.myData.length === 0)
		{
			return ;//jQuery.error("wjson : myData property is empty");
		}
		
		if(typeof settings.oInit.myData !== 'object')
		{
			return jQuery.error("wjson : myData is not an object");
		}
		
		if(code === 'jth_d_c')
		{
			return ;//jQuery.error("wjson : data-column is "+ $(elem).attr('data-column')+" for header cell : \""+elem.innerHTML+"\"");
		}
	};


})(window, document, jQuery);


