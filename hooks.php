<?php
include_once __DIR__ . '/src/Config/Assets/login.php';
include_once __DIR__ . '/src/Config/Assets/checkout.php';


use WHMCS\View\Template\Smarty;



add_hook('ClientAreaFooterOutput', 1, function($vars) {
    $currentFile = basename($_SERVER['PHP_SELF']);

    if ($currentFile === 'logincustom.php') {
        return assets_login();
    }

    return '';
});
