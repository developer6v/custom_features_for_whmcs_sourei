<?php
include_once __DIR__ . '/src/Config/Assets/login.php';
include_once __DIR__ . '/src/Config/Assets/checkout.php';


use WHMCS\View\Template\Smarty;





add_hook('ClientAreaFooterOutput', 1, function($vars) {
    // Detecta a página de login tanto com Friendly URLs quanto sem
    $isLogin =
        (($vars['templatefile'] ?? '') === 'login')                  // template login.tpl
        || (($vars['filename'] ?? '') === 'login')                  // filename = login
        || (isset($_SERVER['REQUEST_URI']) && (                     // fallback pela URL
            stripos($_SERVER['REQUEST_URI'], '/login') !== false    // /login
            || stripos($_SERVER['REQUEST_URI'], 'action=login') !== false // clientarea.php?action=login
        ));

    if ($isLogin) {
        return assets_login();
    }

    return '';
});
