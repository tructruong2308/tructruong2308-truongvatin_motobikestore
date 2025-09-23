<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Laravel CORS Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => ['*'],   // Cho phép tất cả endpoint

    'allowed_methods' => ['*'],   // Cho phép tất cả method (GET, POST, PUT, DELETE)

    'allowed_origins' => ['*'],   // Cho phép tất cả domain (FE, mobile app...)

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],   // Cho phép tất cả header

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
