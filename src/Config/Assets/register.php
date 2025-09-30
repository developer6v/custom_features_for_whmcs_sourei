<?php


function assets_register() {
    $base_url = 'https://' . $_SERVER['HTTP_HOST'] . '/modules/addons/custom_features_for_whmcs_sourei/public';
    $version = time(); 
    $assets = '<link rel="stylesheet" type="text/css" href="' . $base_url . '/css/register.css?v=' . $version . '">';
    $assets .= '<script type="text/javascript" src="' . $base_url . '/js/register.js?v=' . $version . '"></script>';
    
    return $assets;
}