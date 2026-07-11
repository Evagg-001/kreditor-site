<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false]); exit; }
function c($v,$m){$v=trim(strip_tags((string)$v));$v=preg_replace('/[\r\n]+/',' ',$v);return mb_substr($v,0,$m);}
if (!empty($_POST['company_site'])) { echo json_encode(['ok'=>true]); exit; }
$name=c($_POST['name']??'',120);$phone=c($_POST['phone']??'',30);$email=c($_POST['email']??'',160);$topic=c($_POST['topic']??'',180);$message=mb_substr(trim(strip_tags((string)($_POST['message']??''))),0,4000);$consent=$_POST['consent']??'';
if($name===''||$phone===''||$message===''||$consent!=='yes'){http_response_code(422);echo json_encode(['ok'=>false]);exit;}
$to='kreditoro@bk.ru';$subject='Новое обращение с kreditor.pro';$body="Имя: $name\nТелефон: $phone\nEmail: $email\nТема: $topic\n\n$message";$headers="From: site@kreditor.pro\r\nReply-To: ".($email?:'kreditoro@bk.ru')."\r\nContent-Type: text/plain; charset=UTF-8\r\n";$ok=@mail($to,'=?UTF-8?B?'.base64_encode($subject).'?=',$body,$headers);if(!$ok){http_response_code(500);echo json_encode(['ok'=>false]);exit;}echo json_encode(['ok'=>true]);
