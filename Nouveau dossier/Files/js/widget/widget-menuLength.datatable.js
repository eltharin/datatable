
(function(window, document, $, undefined) {

	$.fn.dataTable.LengthLinks = function ( oSettings ) {
		
		// Initialisation of the LengthMenu object
		Init_MenuLength_Widget(oSettings);
		// API, so the feature wrapper can return the node to insert
		this.container = oSettings.cLengthMenu.Html.container;

		// Update on each draw
		oSettings.aoDrawCallback.push( {
			"fn": function (oSettings) {
				draw(oSettings);
			},
			"sName": "PagingControl"
		} );

		//Action : change Length of the table
		actionChange(oSettings);


	},

	/**
	 * Initialisation of the LengthMenu object
	 * @param {Object} oSettings - Is the settings of Datatable
	 * 
	 */
	Init_MenuLength_Widget = function(oSettings)
	{
		oSettings.cLengthMenu = {
			Html : {
				container : $('<div><select></select></div>').addClass( oSettings.oClasses.sLength )
			},
			lastLength : -1,
			lang : oSettings.aLengthMenu.length===2 && $.isArray(oSettings.aLengthMenu[0]) ? oSettings.aLengthMenu[1] : oSettings.aLengthMenu,
			lens : oSettings.aLengthMenu.length===2 && $.isArray(oSettings.aLengthMenu[0]) ? oSettings.aLengthMenu[0] : oSettings.aLengthMenu,
			out : null,
			LSelect : ''
		};

		var out =  $.map( oSettings.cLengthMenu.lens, function (el, i) {
				return el == oSettings._iDisplayLength ?
					'<option value="'+oSettings.cLengthMenu.lens[i]+'">'+oSettings.cLengthMenu.lang[i]+'</option>' :
					'<option value="'+oSettings.cLengthMenu.lens[i]+'">'+oSettings.cLengthMenu.lang[i]+'</option>';
			} ) ;

		oSettings.cLengthMenu.out = out.toString().replace(/\,/g,'');
		oSettings.cLengthMenu.LSelect = "<select class=\"change_lengthOfPager\" aria-controls=\"datatable\">"+out+"</select>";
		oSettings.cLengthMenu.LSelect = jQuery.makeArray(oSettings.cLengthMenu.LSelect);
		oSettings.oLanguage.sLengthMenu = "_MENU_"; 
	},

	/**
	 * Allow to create HTML content
	 * @param {Object} oSettings - Settings of Datatable
	 * @returns {undefined}
	 */
	draw = function(oSettings)
	{
		var container = oSettings.cLengthMenu.Html.container, LSelect = oSettings.cLengthMenu.LSelect, lastLength = oSettings.cLengthMenu.lastLength;

		// No point in updating - nothing has changed
		if ( oSettings._iDisplayLength === lastLength ) {
			return;
		}

		container.html( oSettings.oLanguage.sLengthMenu.replace( '_MENU_', LSelect.join(' ') ) );

		lastLength = oSettings._iDisplayLength;
	},

	/**
	 * Event called when change selected option in MenuLength (select)
	 * @param {Object} oSettings - Settings of Datatable
	 *
	 */
	actionChange = function (oSettings){

		var container = oSettings.cLengthMenu.Html.container;
		// Listen for events to change the page length
		container.on('change', '.change_lengthOfPager', function(e)
		{
			e.preventDefault();
			fnLengthChange( oSettings, parseInt( $(this).children('option:selected').val() ) );
			$('.change_lengthOfPager').val($(this).children('option:selected').val());	
		});
	},

	/**
	 * 
	 * @param {Object} oSettings - Settings of Datatable
	 * @param {type} iDisplay - number of line selected
	 * @returns Redraw Datatable with number of line selected
	 */
	fnLengthChange = function(oSettings, iDisplay) {
		
		oSettings._iDisplayLength = iDisplay;
		oSettings.oApi._fnCalculateEnd( oSettings );

		/* If we have space to show extra rows (backing up from the end point - then do so */
		if ( oSettings._iDisplayEnd === oSettings.aiDisplay.length ) {
			
			oSettings._iDisplayStart = oSettings._iDisplayEnd - oSettings._iDisplayLength;
			if ( oSettings._iDisplayStart < 0 ) {
				oSettings._iDisplayStart = 0;
			}
		}

		if ( oSettings._iDisplayLength == -1 ) {
			oSettings._iDisplayStart = 0;
		}

		oSettings.oApi._fnDraw( oSettings );
	},

	// Subscribe the feature plug-in to DataTables, ready for use
	$.fn.dataTableExt.aoFeatures.push( {
		"fnInit": function( oSettings ) {
			if($(oSettings.nTable).hasClass('dt-pager') || $(oSettings.nTable).hasClass('dt-ofp') || $(oSettings.nTable).hasClass('dt-fp'))
			{
				var l = new $.fn.dataTable.LengthLinks( oSettings );
				return l.container[0];
			}
			return null;
		},
		"cFeature": "L",
		"sFeature": "LengthLinks"
	} );



})(window, document, jQuery);