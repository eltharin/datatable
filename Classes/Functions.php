<?php

namespace Plugin\Datatable\Classes;

class Functions
{
	static function includes()
	{
		\config::add_css('/datatable/css/datatable/filter.datatable.css');
		\config::add_css('/datatable/css/datatable/datatable.css');
		\config::add_css('/datatable/css/datatable/pager.datatable.css');
		\config::add_css('/datatable/css/datatable/menuLength.datatable.css');
		\config::add_css('/datatable/css/datatable/output.datatable.css');
		\config::add_css('/datatable/css/multiple-select.css');

		\config::add_script('/datatable/js/datatable/core/jquery.dataTables.js'); 
		\config::add_script('/datatable/js/datatable/renderers.datatable.js');
		\config::add_script('/datatable/js/datatable/dataTable.basic.js'); 
		
		\config::add_script('/datatable/js/datatable/widget/widget-pager.datatable.js'); 
		\config::add_script('/datatable/js/datatable/widget/widget-menuLength.datatable.js'); 
		\config::add_script('/datatable/js/datatable/widget/widget-json.datatable.js'); 
		\config::add_script('/datatable/js/datatable/widget/widget-filter.datatable.js'); 
		\config::add_script('/datatable/js/datatable/widget/widget-totalizer.datatable.js');
		\config::add_script('/datatable/js/datatable/widget/widget-numColFooter.datatable.js');
		\config::add_script('/datatable/js/datatable/widget/widget-output.datatable.js'); 
		\config::add_script('/datatable/js/multiple-select.js');
	}
}