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
	
	$('.dt-form-container').on('submit',function(){
		
		$(this).children('.inputContainer').remove();
		
		var thisform = $(this).append('<div class="inputContainer"></div>');
				
		$('table.dataTable').each(function(index, data)
		{
			console.log(data);
			console.log($(data).DataTable().$('input, select'))
			
			$(data).DataTable().$('input, select').each(function(index, data)
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
});