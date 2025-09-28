<?php

use WHMCS\View\Template\Smarty;

// Hook que roda no footer do Client Area
add_hook('ClientAreaFooterOutput', 1, function($vars) {
    // Detecta a página atual
    $currentFile = basename($_SERVER['PHP_SELF']);

    if ($currentFile === 'logincustom.php') {
        return <<<HTML
<script>
    alert('⚠️ Aviso: Esta é a página de login customizada!');
</script>
HTML;
    }

    return '';
});
