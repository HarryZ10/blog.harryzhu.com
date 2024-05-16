<?php
// require __DIR__ . '/../../../vendor/autoload.php';
// Dotenv\Dotenv::createUnsafeImmutable(__DIR__ . '/../../')->load();

class DatabaseService {
    private static $db = null;                      // DB Connection instance

    // Ensuring single database instance
    private function __construct() {}

    // Connect to the postgres instance and store it
    public static function database() {

        $DB_HOST = "blog-backend-do-user-2309895-0.c.db.ondigitalocean.com";
        $DB_PASSWORD = "AVNS_eWZAyM34bR24zjgYhg3";

        if (self::$db == null) {
            // Standard URI to connect to a postgres server
            $conn_uri = "pgsql:host=" . $DB_HOST . ";port=" . "25060" . ";dbname=" . "blog";

            // Creates a new database connection with the parameters
            try {
                self::$db = new PDO($conn_uri, "blog", $DB_PASSWORD, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
            } catch (PDOException $err) {
                echo "[Server Error] Cannot connect to DB: " . $err->getMessage();
            }
        }

        return self::$db;
    }
}

?>
