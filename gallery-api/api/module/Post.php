<?php
require_once 'Global.php';
require __DIR__ . "/../../vendor/autoload.php";

class Post extends GlobalMethods
{
    private $pdo;
    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    //login 
    public function login($data, $user)
    {
        if ($user !== false && isset($user['password'])) {
            if (!password_verify($data['password'], $user['password'])) {
                return $this->sendPayload(null, "failed", "Invalid Credentials.", 401);
            }

            $JwtController = new Jwt($_ENV["SECRET_KEY"]);
            $tokenData = [
                "id" => $user['id'],
                "username" => $user['username'],
                "email" => $user['email'],
            ];

            $token = $JwtController->encode($tokenData);

            http_response_code(200);
            echo json_encode(["token" => $token]);
        } else {
            if ($user === false) {
                return $this->sendPayload(null, "failed", "User not found.", 404);
            } else {
                return $this->sendPayload(null, "failed", "Invalid credentials or user data.", 401);
            }
        }
    }


    #CRUD OPERATION

    //add user
    public function add_user($data)
    {

        if (
            !isset(
                $data->username,
                $data->email,
                $data->password,
            )
        ) {
            return $this->sendPayload(null, 'failed', "Incomplete user data.", 400);
        }

        if (!filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
            return $this->sendPayload(null, 'failed', "Invalid email format.", 400);
        }

        if (strlen($data->password) < 8) {
            return $this->sendPayload(null, 'failed', "Password must be at least 8 characters long.", 400);
        }

        $user_name = $data->username;
        $email = $data->email;
        $password = $data->password;


        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO users ( username, password, email ) 
                VALUES (?, ?, ? )";
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                $user_name,
                $hashed_password,
                $email
            ]);

            if ($stmt->rowCount() > 0) {

                return $this->sendPayload(null, 'success', "User added successfully.", 200);
            } else {
                return $this->sendPayload(null, 'failed', "Failed to add user.", 500);
            }
        } catch (PDOException $e) {
            error_log("Database error: " . $e->getMessage());
            return $this->sendPayload(null, 'failed', $e->getMessage(), 500);
        }
    }

    public function add_comment($data)
    {

        if (
            !isset(
                $data->user_id,
                $data->image_id,
                $data->content,
            )
        ) {
            return $this->sendPayload(null, 'failed', "Incomplete comment data.", 400);
        }




        $image_id = $data->image_id;
        $user_id = $data->user_id;
        $content = $data->content;



        $sql = "INSERT INTO comments ( image_id, user_id, content ) 
                VALUES (?, ?, ? )";
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                $image_id,
                $user_id,
                $content
            ]);

            if ($stmt->rowCount() > 0) {

                return $this->sendPayload(null, 'success', "Comment added successfully.", 200);
            } else {
                return $this->sendPayload(null, 'failed', "Failed to add comment.", 500);
            }
        } catch (PDOException $e) {
            error_log("Database error: " . $e->getMessage());
            return $this->sendPayload(null, 'failed', $e->getMessage(), 500);
        }
    }

    //file upload
    public function fileUpload()
    {
        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            return $this->sendPayload(null, 'failed', 'Error with file upload.', 400);
        }

        if (!isset($_POST['user_id']) || !isset($_POST['title']) || !isset($_POST['description'])) {
            return $this->sendPayload(null, 'failed', 'User ID, Title, and Description are required.', 400);
        }

        $userId = intval($_POST['user_id']);
        $title = $_POST['title'];
        $description = $_POST['description'];

        $destinationFolder = '../../images/uploads/';
        $fileTmpName = $_FILES['file']['tmp_name'];
        $fileName = date('Y-m-d_H-i-s') . "_" . basename($_FILES['file']['name']);
        $filePath = $destinationFolder . $fileName;


        // Move the uploaded file to the destination folder
        if (move_uploaded_file($fileTmpName, $filePath)) {
            $sql = "INSERT INTO images (user_id ,file_path, title, description) VALUES (?, ?, ?, ?) ";
            try {
                $stmt = $this->pdo->prepare($sql);
                $stmt->execute([$userId, $filePath, $title, $description]);

                if ($stmt->rowCount() > 0) {
                    return $this->sendPayload(null, 'success', 'File uploaded and path saved successfully.', 200);
                } else {
                    return $this->sendPayload(null, 'failed', 'Failed to update product image path.', 500);
                }
            } catch (PDOException $e) {
                return $this->sendPayload(null, 'failed', $e->getMessage(), 500);
            }
        } else {
            return $this->sendPayload(null, 'failed', 'Failed to move uploaded file.', 500);
        }
    }

    public function updateImage($imageId)
    {
        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            return $this->sendPayload(null, 'failed', 'Error with file upload.', 400);
        }

        $destinationFolder = '../../images/uploads/';
        $fileTmpName = $_FILES['file']['tmp_name'];
        $fileName = date('Y-m-d_H-i-s') . "_" . basename($_FILES['file']['name']);
        $filePath = $destinationFolder . $fileName;

        // Move the uploaded file to the destination folder
        if (move_uploaded_file($fileTmpName, $filePath)) {
            $sql = "UPDATE images SET file_path = ? WHERE id = ?";
            try {
                $stmt = $this->pdo->prepare($sql);
                $stmt->execute([$filePath, $imageId]);

                if ($stmt->rowCount() > 0) {
                    return $this->sendPayload(null, 'success', 'File updated and path saved successfully.', 200);
                } else {
                    return $this->sendPayload(null, 'failed', 'Failed to update file path. Record might not exist.', 404);
                }
            } catch (PDOException $e) {
                return $this->sendPayload(null, 'failed', $e->getMessage(), 500);
            }
        } else {
            return $this->sendPayload(null, 'failed', 'Failed to move uploaded file.', 500);
        }
    }

    public function deleteImage($imageId)
    {
        $sql = "SELECT file_path FROM images WHERE id = ?";
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$imageId]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($result) {
                $filePath = $result['file_path'];

                if (file_exists($filePath)) {
                    if (unlink($filePath)) {
                        $sql = "DELETE FROM images WHERE id = ?";
                        $stmt = $this->pdo->prepare($sql);
                        $stmt->execute([$imageId]);

                        if ($stmt->rowCount() > 0) {
                            return $this->sendPayload(null, 'success', 'Image deleted successfully.', 200);
                        } else {
                            return $this->sendPayload(null, 'failed', 'Failed to delete image record.', 500);
                        }
                    } else {
                        return $this->sendPayload(null, 'failed', 'Failed to delete file from server.', 500);
                    }
                } else {
                    return $this->sendPayload(null, 'failed', 'File not found on server.', 404);
                }
            } else {
                return $this->sendPayload(null, 'failed', 'Image record not found.', 404);
            }
        } catch (PDOException $e) {
            return $this->sendPayload(null, 'failed', $e->getMessage(), 500);
        }
    }
}
