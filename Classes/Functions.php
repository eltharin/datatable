<?php

namespace Plugin\Datatable\Classes;

class Functions
{
	static function includes()
	{
		//\Config::get('HTMLTemplate')->addCss('/datatable/css/filter.datatable.css');
		\Config::get('HTMLTemplate')->addCss('/datatable/css/datatable.css');
		//\Config::get('HTMLTemplate')->addCss('/datatable/css/pager.datatable.css');
		//\Config::get('HTMLTemplate')->addCss('/datatable/css/menuLength.datatable.css');
		//\Config::get('HTMLTemplate')->addCss('/datatable/css/output.datatable.css');
		
		\Config::get('HTMLTemplate')->addScript('/datatable/js/core/jquery.dataTables.js'); 
		\Config::get('HTMLTemplate')->addScript('/datatable/js/renderers.datatable.js');
		\Config::get('HTMLTemplate')->addScript('/datatable/js/dataTable.basic.js'); 
		
		\Config::get('HTMLTemplate')->addScript('/datatable/js/widget/widget-pager.datatable.js'); 
		\Config::get('HTMLTemplate')->addScript('/datatable/js/widget/widget-menuLength.datatable.js'); 
		\Config::get('HTMLTemplate')->addScript('/datatable/js/widget/widget-json.datatable.js'); 
		\Config::get('HTMLTemplate')->addScript('/datatable/js/widget/widget-filter.datatable.js'); 
		\Config::get('HTMLTemplate')->addScript('/datatable/js/widget/widget-totalizer.datatable.js');
		\Config::get('HTMLTemplate')->addScript('/datatable/js/widget/widget-numColFooter.datatable.js');
		\Config::get('HTMLTemplate')->addScript('/datatable/js/widget/widget-output.datatable.js'); 
		
		
		\Config::get('HTMLTemplate')->addCss('/multipleselect/css/multiple-select.css');
		\Config::get('HTMLTemplate')->addScript('/multipleselect/js/multiple-select.js');
	}
}