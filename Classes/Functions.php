<?php

namespace Plugin\Datatable\Classes;

class Functions
{
	static function includes()
	{
		\Core::$config->HTMLtemplate->add_css('/datatable/css/datatable/filter.datatable.css');
		\Core::$config->HTMLtemplate->add_css('/datatable/css/datatable/datatable.css');
		\Core::$config->HTMLtemplate->add_css('/datatable/css/datatable/pager.datatable.css');
		\Core::$config->HTMLtemplate->add_css('/datatable/css/datatable/menuLength.datatable.css');
		\Core::$config->HTMLtemplate->add_css('/datatable/css/datatable/output.datatable.css');
		\Core::$config->HTMLtemplate->add_css('/datatable/css/multiple-select.css');

		\Core::$config->HTMLtemplate->add_script('/datatable/js/datatable/core/jquery.dataTables.js'); 
		\Core::$config->HTMLtemplate->add_script('/datatable/js/datatable/renderers.datatable.js');
		\Core::$config->HTMLtemplate->add_script('/datatable/js/datatable/dataTable.basic.js'); 
		
		\Core::$config->HTMLtemplate->add_script('/datatable/js/datatable/widget/widget-pager.datatable.js'); 
		\Core::$config->HTMLtemplate->add_script('/datatable/js/datatable/widget/widget-menuLength.datatable.js'); 
		\Core::$config->HTMLtemplate->add_script('/datatable/js/datatable/widget/widget-json.datatable.js'); 
		\Core::$config->HTMLtemplate->add_script('/datatable/js/datatable/widget/widget-filter.datatable.js'); 
		\Core::$config->HTMLtemplate->add_script('/datatable/js/datatable/widget/widget-totalizer.datatable.js');
		\Core::$config->HTMLtemplate->add_script('/datatable/js/datatable/widget/widget-numColFooter.datatable.js');
		\Core::$config->HTMLtemplate->add_script('/datatable/js/datatable/widget/widget-output.datatable.js'); 
		\Core::$config->HTMLtemplate->add_script('/datatable/js/multiple-select.js');
	}
}