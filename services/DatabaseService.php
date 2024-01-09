<?php
require_once __DIR__.'/../config.php';

class DatabaseService {
    // Connection instance
    private static $db = null;

    // Ensuring single database instance
    private function __construct() {}

    // Connect to the postgres instance and store it
    public static function database() {

        if (self::$db == null) {
            // This is a standard URI to connect to a postgres server
            $conn_uri = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME;

            // Creates a new database connection with the parameters
            // ATTR_ERRMODE: Instructs php to throw error if db error occurs
            try {
                self::$db = new PDO($conn_uri, DB_USER, DB_PASSWORD, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
            } catch (PDOException $err) {
                // Displays the error
                echo "[Server Error] Cannot connect to DB: " . $err->getMessage();
            }
        }

        return self::$db;
    }
}

?>
