
$('.dt-form').on('submit',function(){

	var thisform = $(this);
	$('#'+thisform.data('tableid')).DataTable().$('input, select').each(function(index, data)
	{
		if($(data).prop('type') === 'checkbox')
		{
			if($(data).prop('checked'))
			{
				thisform.prepend('<input type="hidden" value="'+$(data).val()+'" name="'+$(data).attr('name')+'">');
			}
		}
		else
		{
			thisform.prepend('<input type="hidden" value="'+$(data).val()+'" name="'+$(data).attr('name')+'">');
		}
	});
});