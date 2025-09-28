<?php

include_once __DIR__ . '/hooks.php';
include_once __DIR__ . '/src/Views/config.php';
include_once __DIR__ . '/src/Config/Assets/login.php';
include_once __DIR__ . '/src/Config/Assets/checkout.php';

function custom_features_for_whmcs_sourei_config() { 
    return array(
        'name' => 'Custom Features For WHMCS',
        'description' => 'Módulo responsável por customizações no WHMCS.',
        'version' => '1.0',
        'author' => 'Sourei',
        'fields' => array()
    );
}

function custom_features_for_whmcs_sourei_activate() {
    return array('status' => 'success', 'description' => 'Módulo ativado com sucesso!');
}

function custom_features_for_whmcs_sourei_deactivate() {
    return array('status' => 'success', 'description' => 'Módulo desativado com sucesso!');
}

function custom_features_for_whmcs_sourei_output() {
    echo config();
}



?>