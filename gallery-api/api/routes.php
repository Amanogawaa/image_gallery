<?php
// header("Access-Control-Allow-Origin: *");
// if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
//     header("Access-Control-Allow-Origin: *");
//     header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
//     header("Access-Control-Allow-Headers: Content-Type");
//     http_response_code(200);
//     exit;
// }
// header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
// header("Access-Control-Allow-Headers: Content-Type");
// http_response_code(200);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "./module/Post.php";
require_once "./module/GET.php";
require_once "./module/Global.php";

require_once "./config/database.php";
require_once __DIR__ . '/bootstrap.php';
require_once "./src/Jwt.php";

$con = new Connection();
$pdo = $con->connect();
$post = new Post($pdo);
$get = new Get($pdo);

if (isset($_REQUEST['request'])) {
    $request = explode('/', $_REQUEST['request']);
} else {
    echo "Not Found";

    http_response_code(404);
    exit();
}

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        switch ($request[0]) {

            case 'login':
                $data = json_decode(file_get_contents("php://input"), true);

                if (!isset($data['email']) || !isset($data['password'])) {
                    throw new Exception("Missing login credentials", 400);
                }

                $user = $get->getByEmail($data['email']);
                $post->login($data, $user);
                break;

            case 'adduser':
                echo json_encode($post->add_user($data));
                break;

            case 'addcomment':
                echo json_encode($post->add_comment($data));
                break;

            case 'fileupload':
                echo json_encode($post->fileUpload());
                break;

            case 'updateimage':
                echo json_encode($post->updateImage($request[1]));
                break;

            case 'deleteimage':
                echo json_encode($post->deleteImage($request[1]));
                break;

            default:
                echo "This is forbidden";
                http_response_code(403);
                break;
        }
        break;

    case 'GET':
        switch ($request[0]) {
            case 'getimage':
                if (isset($request[1])) {
                    echo json_encode($get->getImageData($request[1]));
                } else {
                    echo "ID not provided";
                    http_response_code(400);
                }
                break;

            case 'getallimages':
                echo json_encode($get->getAllImages());
                break;

            case 'getuserimage':
                if (isset($request[1])) {
                    echo json_encode($get->getUserImages($request[1]));
                } else {
                    echo "ID not provided";
                    http_response_code(400);
                }
                break;

            case 'getimagedetails':
                if (isset($request[1])) {
                    echo json_encode($get->getImageDetails($request[1]));
                } else {
                    echo "ID not provided";
                    http_response_code(400);
                }
                break;

            case 'getimagecomment':
                if (isset($request[1])) {
                    echo json_encode($get->getComment($request[1]));
                } else {
                    echo "ID not provided";
                    http_response_code(400);
                }
                break;

            case 'getusers':
                if (isset($request[1])) {
                    echo json_encode($get->getUser($request[1]));
                } else {
                    echo "ID not provided";
                    http_response_code(400);
                }
                break;

            default:
                echo "This is forbidden";
                http_response_code(403);
                break;
        }
        break;

    case 'DELETE':
        switch ($request[0]) {
            case 'deleteimage':
                if (isset($request[1])) {
                    echo json_encode($post->deleteImage($request[1]));
                } else {
                    http_response_code(400);
                    echo json_encode(["message" => "Event ID is required for deletion"]);
                }
                break;
        }
        break;


    default:
        echo "This is forbidden";
        http_response_code(403);
        break;
}
