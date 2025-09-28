<?php


function assets_login() {
    $base_url = 'https://' . $_SERVER['HTTP_HOST'] . '/modules/addons/custom_features_for_whmcs_sourei/public';
    $version = time(); 
    $assets = '<link rel="stylesheet" type="text/css" href="' . $base_url . '/css/login.css?v=' . $version . '">';
    $assets .= '<script type="text/javascript" src="' . $base_url . '/js/login.js?v=' . $version . '"></script>';
    
    return $assets;
}