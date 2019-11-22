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
	return {
		display: function ( d ) {
			if(d == '')
			{
				return '';
			}
			else 
			{
				ret = parseFloat(d).toLocaleString('fr-FR');
				
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
		},
		export: function(d){
			return d;
		}
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
	return {
		display: function ( d ) {
			
			return isNaN(parseInt(d)) ? "" : parseInt(d).toLocaleString('fr-FR');
			

		}
	};
};



var tableRender = [];
