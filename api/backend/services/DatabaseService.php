<?php
// require __DIR__ . '/../../../vendor/autoload.php';
// Dotenv\Dotenv::createUnsafeImmutable(__DIR__ . '/../../')->load();

class DatabaseService {
    private static $db = null;                      // DB Connection instance

    // Ensuring single database instance
    private function __construct() {}

    // Connect to the postgres instance and store it
    public static function database() {

        if (self::$db == null) {
		
	    // Standard URI to connect to a postgres server
            $conn_uri = "pgsql:host=" . $_ENV['DB_HOST'] . ";port=" . $_ENV['DB_PORT'] . ";dbname=" . $_ENV['DB_NAME'];

            // Creates a new database connection with the parameters
            try {
                self::$db = new PDO($conn_uri, $_ENV['DB_USER'], $_ENV['DB_PASSWORD'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
            } catch (PDOException $err) {
                echo "[Server Error] Cannot connect to DB: " . $err->getMessage();
            }
        }

        return self::$db;
    }
}

?>
