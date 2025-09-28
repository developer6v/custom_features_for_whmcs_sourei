<?php


function assets_login() {
    $base_url = 'https://' . $_SERVER['HTTP_HOST'] . '/modules/addons/custom_features_for_whmcs_sourei/public';
    $version = time(); 
    $assets = '<link rel="stylesheet" type="text/css" href="' . $base_url . '/css/assets.css?v=' . $version . '">';
    $assets .= '<script type="text/javascript" src="' . $base_url . '/js/assets.js?v=' . $version . '"></script>';
    
    return $assets;
}