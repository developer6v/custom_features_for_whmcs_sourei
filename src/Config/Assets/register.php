<?php

function assets_register() {
    $base_url = 'https://' . $_SERVER['HTTP_HOST'] . '/modules/addons/custom_features_for_whmcs_sourei/public';
    $version = time(); 

    // Registra os assets do intl-tel-input
    $assets = '<script src="https://cdnjs.cloudflare.com/ajax/libs/libphonenumber-js/1.11.17/libphonenumber-js.min.js" integrity="sha512-JFbywe8/knwmSlszErleCKSV66ey9S/k0IDBX18RLPg7kxpFrTB6mOiDYmOWou0zR7Oz6wCl1C/k33AGDYIlyg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>';
    $assets .= '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/css/intlTelInput.css">';
    $assets .= '<script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/intlTelInput.min.js"></script>';
    $assets .= '<script src="https://cdnjs.cloudflare.com/ajax/libs/inputmask/5.0.7/inputmask.min.js"></script>';
    
    // Registra os assets do flatpickr (biblioteca do calendário)
    $assets .= '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">';
    $assets .= '<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>';

    // Registra os assets personalizados
    $assets .= '<script type="text/javascript" src="' . $base_url . '/js/paises.js?v=' . $version . '"></script>';

    $assets .= '<script type="text/javascript" src="' . $base_url . '/js/countrySelect.js?v=' . $version . '"></script>';
    $assets .= '<link rel="stylesheet" type="text/css" href="' . $base_url . '/css/register.css?v=' . $version . '">';
    $assets .= '<script type="text/javascript" src="' . $base_url . '/js/register.js?v=' . $version . '"></script>';

    return $assets;
}
