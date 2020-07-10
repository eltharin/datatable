<?php


namespace Plugin\Datatable\Classes;


class Maker
{
	function make($params, \Core\Classes\Providers\DB\QueryBuilder $qb, Array $cols)
	{
		$qbTot  = clone $qb;
		$total = $qbTot->select('count(*) nb',true)->first();

		foreach($params['columns'] as $col)
		{
			if($col['search']['value'] != '')
			{
				if($col['search']['regex'] == 'true')
				{
					$tabCond = [];
					$tabParams = [];

					foreach(explode(',',$col['search']['value']) as $i => $cond)
					{
						$tabCond[] =  $cols[$col['data']] . ' = :search_' . $col['data'] . '_' . $i;
						$tabParams['search_' . $col['data'] . '_' . $i] = $cond;
					}
					$qb->where('(' . implode(' OR ', $tabCond) . ')', $tabParams);
				}
				else
				{
					$qb->where($cols[$col['data']] . ' like :search_' . $col['data'] ,['search_' . $col['data'] => $col['search']['value'] . '%']);
				}
			}
		}


		$qbTotF = clone $qb;
		$totalF = $qbTotF->select('count(*) nb',true)->first();

		//$qb->select(null,true);
		$qb->select(implode(',', $cols),true);
		/*foreach($cols as $k => $v)
		{
			$qb->select($v . ' "' . $k . '"');
		}*/

		$qb->fetchMode(\PDO::FETCH_NUM)->setCallback(null);

		$qb->offset($params['start']);
		$qb->limit($params['length']);

		//\HTML::pr($qb->all());

		$ret[] = ['draw' => $params['draw']];
		$ret['recordsTotal'] = $total->nb;
		$ret['recordsFiltered'] = $totalF->nb;
		$ret['data'] = $qb->all();
		return $ret;
	}
}