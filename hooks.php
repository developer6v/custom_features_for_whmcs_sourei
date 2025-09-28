<?php
include_once __DIR__ . '/src/Config/Assets/login.php';
include_once __DIR__ . '/src/Config/Assets/checkout.php';


use WHMCS\View\Template\Smarty;


add_hook('ClientAreaPrimarySidebar', 1, function($primarySidebar) {
    if (basename($_SERVER['PHP_SELF']) === 'logincustom.php') {
        foreach ($primarySidebar->getChildren() as $child) {
            $primarySidebar->removeChild($child->getName());
        }
    }
});


add_hook('ClientAreaFooterOutput', 1, function($vars) {
    $currentFile = basename($_SERVER['PHP_SELF']);

    if ($currentFile === 'logincustom.php') {
        return assets_login();
    }

    return '';
});
