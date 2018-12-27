(function(window, document, $, undefined) {
	$.fn.dataTable.ext.oPagination.pager = {
		fnInit : function(oSettings, nPaging, fnCallbackDraw)
		{
			if($(oSettings.nTable).hasClass('dt-pager') || $(oSettings.nTable).hasClass('dt-ofp') || $(oSettings.nTable).hasClass('dt-fp'))
			{
				this.Init_Pager_Widget(oSettings);
				this.HtmlProcess(oSettings, nPaging);
				this.ActionClick(oSettings, fnCallbackDraw);

			}
			else
			{
				oSettings.oFeatures.bPaginate = false;
			}
		},

		fnUpdate : function(oSettings,fnCallbackDraw)
		{
			if($(oSettings.nTable).hasClass('dt-pager') || $(oSettings.nTable).hasClass('dt-ofp') || $(oSettings.nTable).hasClass('dt-fp'))
			{
				if (!oSettings.aanFeatures.p) {
						return;
				}
				this.MenuLengthVal(oSettings);
				this.checkPage(oSettings);
				this.reWriteOptions(oSettings);



				this.ActionChange(oSettings,fnCallbackDraw);
				this.UpdateClass(oSettings);
			}
		},
		
		Init_Pager_Widget : function(oSettings)
		{

			var len;
			oSettings.cPager = {
				Html : {
					table : $(oSettings.aanFeatures.t),
					tId : '',
					pager : $('<form  class="pagerDataTable">'),
					IFirst : $('<img src="/pics/icons/first.png" class="first"/>'),
					IPrevious : $('<img src="/pics/icons/prev.png" class="prev"/>'),
					SPages : $('<select class="pagerDataTable_page pagerdataTable_page_number"></select>'),
					INext : $('<img  src="/pics/icons/next.png" class="next"/>'),
					ILast : $('<img  src="/pics/icons/last.png" class="last"/>'),
					SOptions : []
					
				},
				val : {
					all : len === -1,
					len : oSettings._iDisplayLength,
					pages : 0,
					nbPage : 0,
					page : 0
				},
				settings : oSettings,
				hasFirstPageCallback : null,
				hasLastPageCallback : null
			};

			oSettings.cPager.val.pages = Math.ceil(oSettings.fnRecordsDisplay() / oSettings.cPager.val.len);
			oSettings.cPager.val.nbPage = oSettings.cPager.val.all ? 1 : Math.ceil(oSettings.fnRecordsDisplay() / oSettings.cPager.val.len);
			oSettings.cPager.val.page = oSettings.cPager.val.all ? 0 : Math.ceil( oSettings._iDisplayStart / oSettings.cPager.val.len );
			oSettings.cPager.Html.tId = oSettings.cPager.Html.table.attr('id');
			oSettings.cPager.Html.pager.attr('id', "pager"+oSettings.cPager.Html.tId);
			oSettings.cPager.Html.IFirst.attr('id', oSettings.cPager.Html.tId+"_first_page");
			oSettings.cPager.Html.IPrevious.attr('id', oSettings.cPager.Html.tId+"_previous_page");
			oSettings.cPager.Html.INext.attr('id', oSettings.cPager.Html.tId+"_next_page");
			oSettings.cPager.Html.ILast.attr('id', oSettings.cPager.Html.tId+"_last_page");
			oSettings.cPager.Html.SPages.attr('id', oSettings.cPager.Html.tId+"_SPages");
			
			for(var i=1; i <= oSettings.cPager.val.nbPage; i++){
				oSettings.cPager.Html.SOptions.push($('<option class="paginate_button" value="'+i+'">'+i+'</option>'));
			}
			
			
		},
		
		HtmlProcess : function(oSettings, nPaging)
		{
			var cPager = oSettings.cPager;
			
			cPager.Html.pager.appendTo(nPaging);
			cPager.Html.IFirst.appendTo(cPager.Html.pager);
			cPager.Html.IPrevious.appendTo(cPager.Html.pager);
			cPager.Html.SPages.appendTo(cPager.Html.pager);
			cPager.Html.INext.appendTo(cPager.Html.pager);
			cPager.Html.ILast.appendTo(cPager.Html.pager);
		},
		
		ActionClick : function(oSettings, fnCallbackDraw)
		{
			fnClickHandler = function ( e ) {
				if ( oSettings.oApi._fnPageChange( oSettings, e.data.action ) )
				{
					fnCallbackDraw( oSettings );
				}
			};
			
			var cPager = oSettings.cPager;
			oSettings.oApi._fnBindAction( cPager.Html.IFirst, {action:"first"}, fnClickHandler );
			oSettings.oApi._fnBindAction( cPager.Html.IPrevious, {action:"previous"}, fnClickHandler );
			oSettings.oApi._fnBindAction( cPager.Html.INext, {action:"next"}, fnClickHandler );
			oSettings.oApi._fnBindAction( cPager.Html.ILast, {action:"last"}, fnClickHandler );	
		},
		
		MenuLengthVal : function(oSettings)
		{
			var mLength = $(oSettings.aanFeatures.L), opts = mLength.children().children('option'), mLen = opts.length;
			for(var i=0; i < mLen; i++)
			{
				if(mLength.children().children('option').eq(i).val() == oSettings._iDisplayLength.toString())
				{
					mLength.children().children('option').eq(i).val(oSettings._iDisplayLength.toString()).attr('selected', 'selected');
				}
			}
		},
		
		checkPage : function (oSettings)
		{
			var cPager = oSettings.cPager;
			if(!cPager.val.page > 0){
				cPager.hasFirstPageCallback = true;
			}else{
				cPager.hasFirstPageCallback = false;
			}
			if(cPager.val.page < cPager.val.nbPage-1){
				cPager.hasLastPageCallback = false;
			}else{
				cPager.hasLastPageCallback = true;
			}
			
			oSettings.cPager.val.len = oSettings._iDisplayLength;
			oSettings.cPager.val.pages = Math.ceil(oSettings.fnRecordsDisplay() / oSettings.cPager.val.len);
			oSettings.cPager.val.nbPage = oSettings.cPager.val.all ? 1 : Math.ceil(oSettings.fnRecordsDisplay() / oSettings.cPager.val.len);
			oSettings.cPager.val.page = oSettings.cPager.val.all ? 0 : Math.ceil( oSettings._iDisplayStart / oSettings.cPager.val.len );
			
		},
		
		reWriteOptions : function(oSettings)
		{
			oSettings.cPager.Html.SOptions = [];
			
			for(var i=1; i <= oSettings.cPager.val.nbPage; i++){
				oSettings.cPager.Html.SOptions.push($('<option class="paginate_button" value="'+i+'">'+i+'</option>'));
			}
			
			oSettings.cPager.Html.SPages.children('option').remove();
			
			for(var i = 0; i < oSettings.cPager.val.nbPage; i++)
			{
				$('<option class="paginate_button" value="'+(i+1)+'">'+(i+1)+'</option>').appendTo(oSettings.cPager.Html.SPages);
			}
			oSettings.cPager.Html.SPages.children('option').eq(oSettings.cPager.val.page).attr('selected', 'selected');
		},
		
		ActionChange : function(oSettings, fnCallbackDraw)
		{
			oSettings.cPager.Html.SPages.bind('change', function (e) {
				if ( oSettings.oApi._fnPageChange( oSettings, parseInt($(this).val())-1) )
				{
					fnCallbackDraw( oSettings );
				}
			});
		},
		
		UpdateClass : function (oSettings)
		{
			var tId = oSettings.cPager.Html.tId;
			$('#'+tId+'_first_page').switchClass(this.hasFirstPageCallback, $('#'+tId+'_first_page'), 'disabled');
			$('#'+tId+'_previous_page').switchClass(this.hasFirstPageCallback, $('#'+tId+'_previous_page'), 'disabled');
			$('#'+tId+'_next_page').switchClass(this.hasLastPageCallback, $('#'+tId+'_next_page'), 'disabled');
			$('#'+tId+'_last_page').switchClass(this.hasLastPageCallback, $('#'+tId+'_last_page'), 'disabled');
		}
	},

	(function($){
		$.fn.switchClass = function (conditionCallback, elem, disabled)
		{
			if(conditionCallback){
				elem.addClass(disabled);
			}
			else
			{
				elem.removeClass(disabled);
			}
		};
		
			

		$(document).keydown(function (event) 
		{
         // left arrow
        if (event.which == 37 && event.shiftKey && event.ctrlKey) {
            $('.datatable').DataTable().page( 'previous' ).draw( 'page' );                    
        }
        // right arrow
        if (event.which == 39 && event.shiftKey && event.ctrlKey) {
            $('.datatable').DataTable().page( 'next' ).draw( 'page' );
        }
        
		});
	})(jQuery);
	
})(window, document, jQuery);