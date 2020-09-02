$(document).ready(function(){
	$('.dt-form').on('submit',function(){
		
		$(this).children('.inputContainer').remove();
		
		var thisform = $(this).append('<div class="inputContainer"></div>');
				
		$('#'+thisform.data('tableid')).DataTable().$('input, select').each(function(index, data)
		{
			if($(data).prop('type') === 'checkbox')
			{
				if($(data).prop('checked'))
				{
					thisform.children('.inputContainer').append('<input type="hidden" value="'+$(data).val()+'" name="'+$(data).attr('name')+'">');
				}
			}
			else
			{
				thisform.children('.inputContainer').append('<input type="hidden" value="'+$(data).val()+'" name="'+$(data).attr('name')+'">');
			}
		});
	});
});