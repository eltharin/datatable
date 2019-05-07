<?php
namespace Plugin\Datatable\Controllers;

class Export extends \Core\App\Mvc\Controller
{

	function Action_export()
	{
		$colonne = json_decode($_POST['colonne'], true);
		$footer = json_decode($_POST['footer'], true);
		
		ini_set('memory_limit', '-1');
		set_time_limit(-1);
		
		$data = $this->get_data($_POST['data']);
		$titre = $_POST['titre'];
		$param = $_POST['param'];
		$type = $_POST['type'];
		$valeurs = $_POST['valeurs'];
		
		$banned = $_POST['banned']!=''?explode(",", $_POST['banned']):[];
		rsort($banned);
		
		$rupture = (isset($_POST['rupture']) && $_POST['rupture']!=='')?$_POST['rupture']:null;
		$colonne = $this->format_header($colonne, $banned);
		
		if ($type == "excel")
		{
			$this->xl($this->get_columns($colonne), $data, $titre, $param, $valeurs);
		}
		else
		{
			$orientation = $_POST['orientation']??null;
			$type_taille = $_POST['type_taille']??null;
			$this->pdf($colonne, $data, $titre, $param, $orientation, $type_taille, $valeurs, $footer, $rupture);
		}
	}

	function get_columns($tabcol)
	{
		$cols = [];
		
		foreach($tabcol as $numrow => $row)
		{
			$numcol = 0;
			
			foreach($row as $k => $r)
			{
				while(isset($cols[$numrow][$numcol]))
				{
					$numcol++;
				}
				for($i=0;$i<$r['colspan'];$i++)
				{
					for($j=0;$j<$r['rowspan'];$j++)
					{
						$cols[$numrow+$j][$numcol+$i] = $r;
						$cols[$numrow+$j][$numcol+$i]['fictif'] = 1;
					}
				}
				
				$cols[$numrow][$numcol] = $r;
				$numcol += $r['colspan'];				
			}
			ksort($cols[$numrow]);
		}	
		
		return $cols;
	}
	
	function get_data($data)
	{
		$test = json_decode($data, 1);
		if($test !== null)
		{
			return $test;
		}
		else
		{

			$data = substr($data,2,-2);
			$data = explode('],[',$data);
			
			foreach($data as $test)
			{
				if(json_decode('['.$test.']') === null)
				{
					echo $test . BRN;
					var_dump(json_decode(str_replace('','','['.$test.']')));
					echo BRN;
				}
			}
			\HTTP::error_page(500,'data incorrectes');
		}
		
	}
	
	function tab_size($colonne)
	{
		$tabsize = array();
		$nb_tr = count(array_keys($colonne));
		if ($nb_tr == 1)
		{
			foreach ($colonne as $numcol => $case)
			{
				foreach ($case as $key => $value)
				{
					if (($value['showpdf'] !== 'no' && $value['display'] !== 'none'))
					{
						$tabsize[$key] = $value['taille'];
					}
					else
					{
						$tabsize[$key] = 0;
					}
				}
			}
		}
		else
		{
			$rowspan = array();
			//-- calcul du tabsize
			
			foreach ($colonne as $numligne => $ligne)
			{
				$colindex = 0;
				
				foreach ($ligne as $case)
				{
					if(isset($rowspan[$numligne][$colindex]))
					{
						$colindex += $rowspan[$numligne][$colindex]['colspan'];
					}
					
					if ($case['rowspan'] > 1)
					{
						
						for($i=1;$i<$case['rowspan'];$i++)
						{
							$rowspan[$numligne+$i][$colindex] = $case;
							$rowspan[$numligne+$i][$colindex]['rowspan'] = $case['rowspan']-$i;
							$rowspan[$numligne+$i][$colindex]['fictif'] = 1;
						}
						
					}
					if (!isset($tabsize[$colindex]))
					{
						$tabsize[$colindex] = '-1';
					}
					if (($case['colspan'] == 1) && (isset($case['taille'])) && $case['taille'] != '' && ($tabsize[$colindex] == -1))
					{
						$tabsize[$colindex] = $case['taille'];
					}
					/*if (($case['showpdf'] == "no" || $case['display'] == 'none'))
					{
						$tabsize[$colindex] = 0;
					}*/
					$colindex += $case['colspan'];
				}
			}
			
			//-- calcul des colonnes
			foreach ($colonne as $numligne => $ligne)
			{
				
				if ($numligne > 0)
				{
					$colindex = 0;
					$decalage_deja_fait = 0;
					if(isset($rowspan[$numligne]))
					{
						foreach ($rowspan[$numligne] as $cle => $caserowspan)
						{
							$ligne = array_merge(array_slice($ligne, 0, $cle + $decalage_deja_fait), array($caserowspan), array_slice($ligne, $cle + $decalage_deja_fait));
							$decalage_deja_fait += $caserowspan['colspan'] - 1;	
						}
					}
					$colonne[$numligne] = $ligne;
				}
				
				$idcol=0;
				foreach($ligne as $numcol => $col)
				{
					if($col['taille'] == '')
					{
						$colonne[$numligne][$numcol]['taille'] = 0;
						for($i=$idcol;$i<$idcol+$col['colspan'];$i++)
						{
							$colonne[$numligne][$numcol]['taille'] += $tabsize[$numcol];
						}
					}
				}			
			}
		}
		return [$colonne,$tabsize];
	}

	function pdf($colonne, $data, $titre, $param,  $orientation, $type_taille, $valeurs, $footer, $rupture=null)
	{
		if (!empty($colonne))
		{
			ini_set('memory_limit', '-1');
			set_time_limit(-1);
			$pdf = new \pdf(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
			$pdf->set_vars('titre', $titre);

			$pdf->SetHeaderData();
			$pdf->setfont('Times', '', 10);
			$pdf->setCreator(PDF_CREATOR);
			//$pdf->setAuthor($_SESSION['_auth']['nom']);
			$pdf->setTitle($titre);
			$pdf->setFillColor(180, 200, 250);
			
			$pdf->SetMargins(9, 0, 0);
			$pdf->SetFooterMargin(10);
			$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);
			$pdf->setJPEGQuality(75);
			$pdf->startPageGroup();
			$pdf->setHeaderByFunction(array($this, 'pdf_header'));
			$pdf->setFooterByFunction(array($this, 'pdf_footer'));

			$pdf->set_vars('rupture', $rupture);
			$nb_tr = count(array_keys($colonne));
			list($colonne,$tabsize) = $this->tab_size($colonne);
			
			$pdf->set_vars('nb_tr', $nb_tr);
			$pdf->set_vars('colonne', $colonne);
			$pdf->set_vars('param', $param);

			$somme = 0;
			$marge = 0;
			$nb_elem = 0;

			foreach ($tabsize as $tab)
			{
				if ($tab > 0)
				{
					$nb_elem += 1;
					$somme += $tab;
				}
			}
			
			//-- calcul du format du pdf
			if(is_null($orientation))
			{
				if ($somme <= 180)
				{
					$type_taille = 'A4';
					$orientation = 'P';
					$diff = 190 - $somme;
					$marge = $diff / $nb_elem;
				}
				elseif ($somme <= 277)
				{
					$type_taille = 'A4';
					$orientation = 'L';
					$diff = 277 - $somme;
					$marge = $diff / $nb_elem;
				}
				else
				{
					$type_taille = 'A3';
					$orientation = 'L';
					$diff = 400 - $somme;
					$marge = $diff / $nb_elem;
				}
			}
			else
			{
				if ($orientation == 'P' && $type_taille == 'A4')
				{
					$diff = 190 - $somme;
					$marge = $diff / $nb_elem;
				}
				elseif ($orientation == 'L' && $type_taille == 'A4')
				{
					$diff = 277 - $somme;
					$marge = $diff / $nb_elem;
				}
				elseif($orientation == 'P' && $type_taille == 'A3')
				{
					$orientation = 'P';
					$diff = 277 - $somme;
					$marge = $diff / $nb_elem;
				}
				elseif($type_taille == 'A3')
				{
					$orientation = 'L';
					$diff = 400 - $somme;
					$marge = $diff / $nb_elem;
				}
			}

			$pdf->set_vars('marge', $marge);
			$pdf->set_vars('orientation', $orientation);
			$pdf->set_vars('type_taille', $type_taille);
			$pdf->AddPage($orientation, $type_taille);
			$u = $nb_tr - 1;
			$m = $marge;

			if($rupture !== null)
			{
				usort($data, function ($a, $b) use ($rupture)
						{
							return $a[$rupture]<=>$b[$rupture];
						}
					);
			}
			
			$previous = null;			
			foreach ($data as $num => $ligne)
			{
				$count = 0;
				$i = 0;
				$plus = 0;
				if($valeurs == 0)
				{
					foreach ($ligne as $numcase => $v)
					{
						if ($tabsize[$numcase] > 0)
						{
							if ($colonne[count($colonne) - 1][$i]['type'] == "VAL")
							{
								$count++;
								if ($v == '0,00')
								{
									$plus++;
								}
							}
						}
						$i++;
					}
				}
				
				if (($plus != $count) || ($count == 0))
				{
					$i = 0;
					$max_height = 1;
					$height = 5;
					foreach ($ligne as $numcase => $case)
					{
						if(substr_count($case, '<br>') + 1> $max_height)
						{
							$max_height = substr_count($case, '<br>') + 1;
						}						
					}
					
					if($rupture !== null)
					{
						if(($previous !== null) && ($ligne[$rupture] != $previous))
						{
							$pdf->startPageGroup();
							$pdf->AddPage($orientation, $type_taille);
						}

						$previous = $ligne[$rupture];
						$pdf->set_vars('rupturelib',$ligne[$rupture]);
					}
					
					foreach ($ligne as $numcase => $case)
					{
						if ($tabsize[$numcase] > 0)
						{
							if ($nb_tr == 1)
							{
								//-- on ecrit les lignes du tableau Cell par cell à chaque saut de ligne à l'intérieur des cases
								foreach(explode('<br>', $case) as $keydefou => $valdefou)
								{
									if($keydefou == 0)
									{
										$xdefou = $pdf->GetX();
										$pdf->Cell($tabsize[$i] + $m, $max_height*$height, str_replace(' ¤ ', ' ', str_replace('<hr>', '',  $valdefou)), 1, 0, $colonne[0][$i]['align'], false, '', 1, true, '', 'T');
										$ydefou = $pdf->GetY();
									}
									else
									{
										$pdf->setX($xdefou);
										$pdf->Cell($tabsize[$i] + $m, $height, str_replace(' ¤ ', ' ', str_replace('<hr>', '',  $valdefou)), 0, 0, $colonne[0][$i]['align'], false, '', 1, true, '', 'T');
									}
									$pdf->ln($height);
								}
								$pdf->setY($ydefou);
								$pdf->setX($xdefou + $tabsize[$i] + $m);
							}
							else
							{
								$pdf->Cell($tabsize[$i] + $m, $height, str_replace('<br>', '', str_replace('<br><hr>', RN, $case)), 1, 0, $colonne[$u][$i]['align'], false, '', 1);
							}
						}
						$i++;
					}
					$pdf->Cell(1, $max_height*$height, '', 0, 1);
					$pdf->setX(9);
				}
			}
			$pdf->setFillColor(180, 200, 250);
			foreach ($footer as $f)
			{
				$i=0;
				foreach($f as $case)
				{
					if($case['colspan'] > 1)
					{
						$taillecol = 0;
						for($j=$i; $j < $i+$case['colspan']; $j++)
						{
							$taillecol += $tabsize[$j];
						}
						$taillecol += $case['colspan'] * $m;
						$i += $case['colspan']-1;
					}
					else
					{
						$taillecol = $tabsize[$i] + $m;
					}
					if(end($colonne)[$i]['showpdf'] != 'no')
					{
						$pdf->Cell($taillecol, $height, $case['value'], 1, 0, 'C', 1, '', 1);
					}
					$i++;
				}
				$pdf->Cell(1, $max_height*$height, '', 0, 1);
				$pdf->setX(9);
			}
			
			if ($titre != "")
			{
				$pdf->Output($titre . '.pdf', 'D');
			}
			else
			{
				$pdf->Output('export pdf.pdf', 'D');
			}
		}
	}

	function pdf_header($pdf)
	{
		$pdf->setfont('Times', '', 8);
		$pdf->setFillColor(180, 200, 250);
		$pdf->setY(10);
		$pdf->SetLineWidth(0.25);


		$m = $pdf->get_vars('marge');
		$colonne = $pdf->get_vars('colonne');
		$nb_tr = $pdf->get_vars('nb_tr');
		$heightheader = 12;
		
		if ($pdf->get_num_pagegroup() <= 1)
		{
			//$pdf->set_vars('titre','test');
			if($pdf->get_vars('titre') != '')
			{
				$pdf->setfont('Times', '', 14);
				$pdf->setY(5);
				if ($pdf->get_vars('orientation') == 'L')
				{
					$pdf->Cell(277, 0, $pdf->get_vars('titre'), 'B', 0, 'C');
				}
				else
				{
					$pdf->Cell(190, 0, $pdf->get_vars('titre'), 'B', 0, 'C');
				}
				$pdf->setfont('Times', '', 8);
				$pdf->Ln(20);
			}
		}
		
		foreach ($colonne as $c)
		{
			foreach ($c as $k => $v)
			{
				$taillecol = ($c[$k]['taille'] + ($m) * $c[$k]['colspan']);
				if ($nb_tr == 1)
				{
					if ($v['showpdf'] != 'no' && $v['display'] != 'none')
					{
						$pdf->Multicell($taillecol, $heightheader, $v['name'], 1, 'C', true, 0, '', '', 1, 0, 0, 1, 11, 'M');
					}
				}
				else
				{
					if (!array_key_exists('fictif', $v) && isset($c[$k]['colspan']) && ($v['showpdf'] != 'no' && $v['display'] != 'none'))
					{
						$pdf->Multicell($taillecol, $heightheader * $c[$k]['rowspan'], $c[$k]['name'], 1, 'C', true, 0, '', '', 1, 0, 0, 1, 11, 'M');
					}
					else
					{
						if (isset($c[$k]['colspan']) && ($v['showpdf'] != 'no' && $v['display'] != 'none'))
						{
							$pdf->Multicell($taillecol, $heightheader, '', 0, 'C', false, 0, '', '', 1, 0, 0, 1, 11, 'M');
						}
					}
				}
			}
			$pdf->ln($heightheader);
			$y = $pdf->getY();
		}
		$pdf->SetTopMargin($y);
	}

	function pdf_footer($pdf)
	{
		$rupture = $pdf->get_vars('rupture');
		$l = 190;
		$pdf->SetXY(10, -15);
		$pdf->SetFont('helvetica', 'I', 7);
		if ($pdf->get_vars('orientation') == 'L' && ($pdf->get_vars('type_taille') == 'A3'))
		{
			$l = 400;
		}
		elseif ($pdf->get_vars('orientation') == 'L' && ($pdf->get_vars('type_taille') == 'A4'))
		{
			$l = 277;
		}
		elseif ($pdf->get_vars('orientation') == 'P' && ($pdf->get_vars('type_taille') == 'A3'))
		{
			$l = 277;
		}

		if($rupture === null)
		{
			$pdf->Cell(($l - 30) / 2, 10, '', 0, false, 'L');
			$pdf->Cell(30, 10, 'Page ' . $pdf->getAliasNumPage() . '/' . $pdf->getAliasNbPages(), 0, false, 'C', 0, '', 0, false, 'T', 'M');
		}
		else
		{
			$pdf->Cell(($l - 30) / 2, 10, $pdf->get_vars('rupturelib'), 0, false, 'L');
			$pdf->Cell(30, 10, 'Page ' . $pdf->getPageNumGroupAlias() . '/' . $pdf->getPageGroupAlias(), 0, false, 'C', 0, '', 0, false, 'T', 'M');
		}
		$pdf->Cell(($l - 30) / 2, 10, strftime('%d/%m/%Y %H:%M'), 0, false, 'R');
	}

	function xl($header, $data, $titre, $param, $valeurs)
	{
		$objExcel = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
		$objExcel->getActiveSheet()->setTitle("Feuil 1");
		$worksheet = $objExcel->setActiveSheetIndex(0);
		$objExcel->getActiveSheet()->getPageSetup()->setHorizontalCentered(true);
		$objExcel->getActiveSheet()->getPageSetup()->setVerticalCentered(false);
		$objExcel->getActiveSheet()->getAutoFilter();
		$worksheet->getPageSetup()->setOrientation(\PhpOffice\PhpSpreadsheet\Worksheet\PageSetup::ORIENTATION_LANDSCAPE);
		$worksheet->getPageSetup()->setFitToWidth(1);

		$ligne = 1;
		$numcol = 0;

		for($i=0;$i<count($header[0]);$i++)
		{
			$worksheet->getColumnDimension(\PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($numcol+$i))->setAutoSize(true);
		}
		
		foreach ($header as $numrow => $row)
		{
			foreach ($row as $numcol => $v)
			{
				$mynumrow = $numrow +1;

				if (!array_key_exists('fictif', $v) && ($v['showpdf'] != 'no' && $v['display'] != 'none'))
				{
					$worksheet->getStyle(\PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($numcol))->getAlignment()->setWrapText(true);
					
					for($i=0;$i<$v['colspan'];$i++)
					{
						
						$worksheet->getStyle(\PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($numcol))->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT);
						$worksheet->getStyle(\PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($numcol))->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
					}
					
					$worksheet->setCellValueByColumnAndRow($numcol+1, $mynumrow, $v['name']);
					
					
					if($v['colspan'] > 1 || $v['rowspan'] > 1)
					{
						$objExcel->getActiveSheet()->mergeCells(\PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($numcol+1) . $mynumrow . ':' . \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($numcol+$v['colspan']) . ($mynumrow+$v['rowspan']-1));
					}
				}
			}
			
			$ligne++;
		}
		$objExcel->getActiveSheet()->setAutoFilter('A' . ($ligne - 1) . ':' . (\PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex(count($header[0])-1)) . ($ligne - 1));
				
		foreach ($data as $a)
		{
			$col = 0;
			$plus = 0;
			$count = 0;
			$i = 0;
			if($valeurs == 0)
			{
				foreach ($a as $k => $v)
				{

					if (($header[count($header) - 1][$k]['showpdf'] !== 'no' && $header[count($header) - 1][$k]['display'] !== 'none') && $header[count($header) - 1][$k]['type'] == "VAL")
					{
						$count++;
						if ($v == '0,00')
						{
							$plus++;
						}
					}
					$i++;
				}
			}
			
			if (($plus != $count) || ($count == 0))
			{
				foreach ($a as $k => $v)
				{
				    if(isset($header[count($header) - 1][$k]))
                    {
                        if ($header[count($header) - 1][$k]['showpdf'] !== 'no' && $header[count($header) - 1][$k]['display'] !== 'none')
                        {
                            if ($header[count($header) - 1][$k]['format'] == "text")
                            {
                                $worksheet->setCellValueExplicit(\PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($col+1) . $ligne,  str_replace('<br>', '', str_replace('<br><hr>', RN,$v)), \PhpOffice\PhpSpreadsheet\Cell\DataType :: TYPE_STRING);
                            }
                            elseif ($header[count($header) - 1][$k]['format'] == "nb")
                            {
                                $worksheet->setCellValueExplicit(\PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($col+1) . $ligne, preg_replace('/[^0-9\.\,\-]+/', '', str_replace(',', '.', $v)), \PhpOffice\PhpSpreadsheet\Cell\DataType :: TYPE_NUMERIC);
                            }
                            else
                            {
                                $worksheet->setCellValueExplicit(\PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($col+1) . $ligne,  str_replace('<br>', '', str_replace('<br><hr>', RN,$v)), \PhpOffice\PhpSpreadsheet\Cell\DataType :: TYPE_STRING);
                            }
                            $col++;
                        }
                    }
				}
				$ligne++;
			}
		}
		
		
		if ($titre == "")
		{
			$titre = "tableau_excel";
		}

		\Core::$response->setWithTemplate(false);
		\Core::$response->set_content_type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		\Core::$response->add_header('Content-Disposition: attachment;filename="' . $titre . '.xlsx"');
		$objWriter = \PhpOffice\PhpSpreadsheet\IOFactory::createWriter($objExcel, 'Xlsx');
		$objWriter->save('php://output');
	}

	private function format_header($header, $aSuppr)
	{
		/*Mise en forme des headers non filtrables*/
        $NbLineheader = count($header);
		$nbLineHNonModifiable = $NbLineheader-2;
		
		if((!empty($aSuppr)) && ($nbLineHNonModifiable>=0))
		{
			for($i=$nbLineHNonModifiable; $i>=0; $i--)	// pour chaque header excepté le dernier qui a les données
			{
				//on initialise le tableau qui va stocker le nb de colspan a supprimer
				for($k=$nbLineHNonModifiable; $k>=0; $k--)
				{
					$countCell = count($header[$k])-1;
					for($j=0; $j<=$countCell; $j++)		
					{
						$colSuppr[$j] = 0;
					}
				}
			
				$countCell = count($header[$i])-1;	//nb cellule dans le header[$i]
				foreach($aSuppr as $suppr)
				{
					if($countCell >= 0)
					{
						for($z=$countCell; $z>0; $z--)
						{
							if(($this->addition($header[$i], $z-1) < $suppr+1) && ($suppr+1 <= $this->addition($header[$i], $z)))
							{
								$colSuppr[$z]++;
							}
						}
						if($suppr+1 <= $this->addition($header[$i], 0))
						{
							$colSuppr[0]++;
						}
					}
				}
				
				//on reduit-supprime les colonnes
				$nbColSuppr = count($colSuppr)-1;
				for($j=$nbColSuppr; $j>=0; $j--)
				{
					if(isset($header[$i][$j]))
					{
						$header[$i][$j]['colspan']-=$colSuppr[$j];
						if($header[$i][$j]['colspan'] == 0)
						{
							array_splice($header[$i], $j, 1);
						}
					}
				}
			}
		}
		return $header;
	}
	
	private function addition($tab, $i)
	{
		$val=0;

		for($j=$i; $j>=0; $j--)
		{
			$val+=$tab[$j]['colspan'];
		}
		return $val;
	}
}
