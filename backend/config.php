<?php
    // Configuration settings for our postgres database
    define('DB_HOST', '127.0.0.1');
    define('DB_PORT', '5432');

    // Local development
    //define('DB_NAME', 'program');
    //define('DB_USER', 'dev');
    //define('DB_PASSWORD', '314dev');
    //define('HTTP_ORIGIN', 'http://10.10.10.25:3000');
    define('HTTP_ORIGIN', 'http://web.cs.georgefox.edu/~hzhu20');

    // Production mode
    define('PRODUCTION_MODE', true);

    // Production environment
    define('DB_NAME', 'blog');
    define('DB_USER', 'charlie');
    define('DB_PASSWORD', 'charlie');
?>
