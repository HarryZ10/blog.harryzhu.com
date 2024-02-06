<?php
require_once __DIR__.'/backend/routes/Router.php';

$httpOrigin = "http://web.cs.georgefox.edu/~hzhu20";

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: $httpOrigin");

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    http_response_code(200);
    exit();
}

$router = new Router();
$router->handleRequest();

?>
