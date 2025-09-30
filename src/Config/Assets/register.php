<?php

function assets_register() {
    $base_url = 'https://' . $_SERVER['HTTP_HOST'] . '/modules/addons/custom_features_for_whmcs_sourei/public';
    $version = time(); 

    // Registra os assets personalizados
    $assets = '<link rel="stylesheet" type="text/css" href="' . $base_url . '/css/register.css?v=' . $version . '">';
    $assets .= '<script type="text/javascript" src="' . $base_url . '/js/register.js?v=' . $version . '"></script>';

    // Registra os assets do intl-tel-input
    $assets .= '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/css/intlTelInput.css">';
    $assets .= '<script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/intlTelInput.min.js"></script>';

    return $assets;
}
