jQuery.fn.dataTable.render["comptaDC"] = function() {
	return {

		display: function ( d ) {
			if(d > 0)
			{
				d = Math.abs(d).toFixed(2).replace(/./g, function(c, i, a) {
					return i && c !== "." && ((a.length - i) % 3 === 0) ? ' ' + c : c;
				}).replace('.', ',');;
				d += ' D';
			}
			else if(d < 0)
			{
				d = Math.abs(d).toFixed(2).replace(/./g, function(c, i, a) {
					return i && c !== "." && ((a.length - i) % 3 === 0) ? ' ' + c: c;
				}).replace('.', ',');
				d += ' C';
			}
			else if(d === 0)
			{
				d = '0,00 D';
			}
			else
			{
				d = '';
			}
			return d;
		}
	};
};

jQuery.fn.dataTable.render["montant"] = function() {
	return function ( data, type, row ) {
		if(type == 'display')
		{
			if(data == '')
			{
				return '';
			}
			
			ret = parseFloat(data).toLocaleString('fr-FR');
				
			if(ret.search(",") === -1)
			{
				ret = ret + ',00';
			}
			else if(ret.search(",") >= ret.length-2)
			{
				ret = ret + '0';
			}
			return ret;
		}
		if(type == 'sort')
		{
			if(data == '')
			{
				return -0.0000000001;
			}
			return parseFloat(data);	
		}
		return data;
	};
};

jQuery.fn.dataTable.render["%2"] = function() {
	return {
		display: function ( d ) {
			if(d == '')
			{
				return '';
			}
			else 
			{
				ret = Math.round(parseFloat(d*100),2).toLocaleString('fr-FR');
				
				/*if(ret.search(",") === -1)
				{
					ret = ret + ',00';
				}
				else if(ret.search(",") >= ret.length-2)
				{
					ret = ret + '0';
				}*/
				return ret;
			}
		}
	};
};

jQuery.fn.dataTable.render["integer"] = function() {
	return function ( data, type, row ) {
		if(type == 'display')
		{
			if(data == '')
			{
				return '';
			}
			
			ret = parseInt(data).toLocaleString('fr-FR');

			return ret;
		}
		if(type == 'sort')
		{
			if(data == '')
			{
				return -0.0000000001;
			}
			return parseInt(data);	
		}
		return data;
	};
};


jQuery.fn.dataTable.render["html"] = function() {
	return function ( data, type, row ) {
		if(type != 'display')
		{
			return data.replace( /<.*(title=\"([^\"]*)\").*?>/g, "$2" ).replace( /<.*(title=\'([^\']*)\').*?>/g, "$2" ).replace( /<.*?>/g, "" ).toLowerCase();
		}
		return data;
	};
};


jQuery.fn.dataTable.render["check"] = function() {
	return function ( data , type, row )
    {
        if(type=='display')
        {
            if (data == '0')
            {
                return '<td class="center"><img title="0" src="/intranet/pics/icons/red_cross.png"/></td>';
            }
            else if(data == '1')
            {
                return '<td class="center"><img title="1" src="/intranet/pics/icons/check.png"/></td>';
            }
        }
        return data;
    }
};
	


var tableRender = [];
