<?php

require_once 'Global.php';

class Get extends GlobalMethods
{
    private $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    private function get_records($table, $conditions = null, $columns = '*')
    {
        $sqlStr = "SELECT $columns FROM $table";
        if ($conditions != null) {
            $sqlStr .= " WHERE " . $conditions;
        }
        $result = $this->executeQuery($sqlStr);

        if ($result['code'] == 200) {
            return $this->sendPayload($result['data'], 'success', "Successfully retrieved data.", $result['code']);
        }
        return $this->sendPayload(null, 'failed', "Failed to retrieve data.", $result['code']);
    }

    private function executeQuery($sql, $params = [])
    {
        $data = array();
        $errmsg = "";
        $code = 0;

        try {
            // Prepare the SQL statement
            $statement = $this->pdo->prepare($sql);

            // Execute the SQL statement with parameters
            $statement->execute($params);

            // Fetch the results
            $result = $statement->fetchAll(PDO::FETCH_ASSOC);
            foreach ($result as $record) {
                if (isset($record['file_data'])) {
                    $record['file_data'] = base64_encode($record['file_data']);
                }
                array_push($data, $record);
            }
            $code = 200;
            return array("code" => $code, "data" => $data);
        } catch (\PDOException $e) {
            $errmsg = $e->getMessage();
            $code = 403;
        }
        return array("code" => $code, "errmsg" => $errmsg);
    }

    public function getByEmail(string $email = null): array|false
    {
        $conditions = ($email !== null) ? "email = '$email'" : null;
        $result = $this->get_records('users', $conditions);

        if ($result['status']['remarks'] === 'success' && !empty($result['payload'])) {
            return $result['payload'][0];
        } else {
            return false;
        }
    }


    public function getImageDetails($id)
    {
        $condition = ($id !== null) ? "id = $id" : null;
        $result = $this->get_records('images', $condition, 'id, title, description');

        if ($result['status']['remarks'] === 'success') {
            return $result['payload'];
        } else {
            return [];
        }
    }

    public function getComment($image_id)
    {
        // Ensure $image_id is properly sanitized to avoid SQL injection
        if (!is_numeric($image_id)) {
            throw new InvalidArgumentException('Invalid image ID');
        }

        // Prepare the SQL query with a placeholder for image_id
        $sql = "
            SELECT 
                c.id AS comment_id,
                c.content AS comment_content,
                c.created_at AS comment_created_at,
                u.id AS user_id,
                u.username AS user_username
            FROM 
                comments c
            JOIN 
                users u ON c.user_id = u.id
            WHERE 
                c.image_id = :image_id
            ORDER BY 
                c.created_at DESC
        ";

        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindParam(':image_id', $image_id, PDO::PARAM_INT);
            $stmt->execute();

            $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return [
                'status' => [
                    'remarks' => 'success',
                ],
                'payload' => $comments,
            ];
        } catch (PDOException $e) {
            return [
                'status' => [
                    'remarks' => 'error',
                    'message' => $e->getMessage(),
                ],
                'payload' => [],
            ];
        }
    }



    // public function getComment($image_id)
    // {
    //     $condition = ($image_id !== null) ? "image_id = $image_id" : null;
    //     $result = $this->get_records('comments', $condition);

    //     if ($result['status']['remarks'] === 'success') {
    //         return $result['payload'];
    //     } else {
    //         return [];
    //     }
    // }

    public function getAllImages()
    {
        $result = $this->get_records('images', null, 'id, file_path, title, description');

        if ($result['status']['remarks'] === 'success') {
            return $result['payload'];
        } else {
            return [];
        }
    }



    public function getUserImages($id)
    {
        $id = intval($id);

        $sql = "SELECT id, file_path, title, description FROM images WHERE user_id = ?";
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$id]);

            $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($images) {
                $baseURL = 'http://localhost/gallery/images/uploads/';
                foreach ($images as &$image) {
                    $image['file_path'] = $baseURL . basename($image['file_path']);
                }
                return $this->sendPayload($images, 'success', 'Images retrieved successfully.', 200);
            } else {
                return $this->sendPayload(null, 'failed', 'No images found for this user.', 404);
            }
        } catch (PDOException $e) {
            return [];
        }
    }



    public function image($id = null)
    {
        $columns = "file_path";
        $condition = ($id !== null) ? "id = $id" : null;
        $result = $this->get_records('images', $condition, $columns);

        if ($result['status']['remarks'] === 'success' && isset($result['payload'][0]['file_path'])) {
            return array("file_path" => $result['payload'][0]['file_path']);
        } else {
            return array("file_path" => null);
        }
    }


    public function getImageData($id)
    {
        $fileInfo = $this->image($id);

        if ($fileInfo['file_path'] !== null) {
            $filePath = $fileInfo['file_path'];

            if (file_exists($filePath)) {
                $fileType = mime_content_type($filePath);
                header('Content-Type: ' . $fileType);
                header('Content-Length: ' . filesize($filePath));
                readfile($filePath);
                exit();
            } else {
                http_response_code(404);
                echo "Image file not found.";
                exit();
            }
        } else {
            http_response_code(404);
            echo "Image path not found in database.";
            exit();
        }
    }
}
