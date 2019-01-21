<?php

namespace Plugin\Datatable\Classes;

class Functions
{
	static function includes()
	{
		\Core::$config->HTMLtemplate->add_css('/datatable/css/filter.datatable.css');
		\Core::$config->HTMLtemplate->add_css('/datatable/css/datatable.css');
		\Core::$config->HTMLtemplate->add_css('/datatable/css/pager.datatable.css');
		\Core::$config->HTMLtemplate->add_css('/datatable/css/menuLength.datatable.css');
		\Core::$config->HTMLtemplate->add_css('/datatable/css/output.datatable.css');
		\Core::$config->HTMLtemplate->add_css('/datatable/css/multiple-select.css');

		\Core::$config->HTMLtemplate->add_script('/datatable/js/core/jquery.dataTables.js'); 
		\Core::$config->HTMLtemplate->add_script('/datatable/js/renderers.datatable.js');
		\Core::$config->HTMLtemplate->add_script('/datatable/js/dataTable.basic.js'); 
		
		\Core::$config->HTMLtemplate->add_script('/datatable/js/widget/widget-pager.datatable.js'); 
		\Core::$config->HTMLtemplate->add_script('/datatable/js/widget/widget-menuLength.datatable.js'); 
		\Core::$config->HTMLtemplate->add_script('/datatable/js/widget/widget-json.datatable.js'); 
		\Core::$config->HTMLtemplate->add_script('/datatable/js/widget/widget-filter.datatable.js'); 
		\Core::$config->HTMLtemplate->add_script('/datatable/js/widget/widget-totalizer.datatable.js');
		\Core::$config->HTMLtemplate->add_script('/datatable/js/widget/widget-numColFooter.datatable.js');
		\Core::$config->HTMLtemplate->add_script('/datatable/js/widget/widget-output.datatable.js'); 
		\Core::$config->HTMLtemplate->add_script('/datatable/js/multiple-select.js');
	}
}