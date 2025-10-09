<?php
include_once('../../../../../init.php'); 
use WHMCS\Database\Capsule;
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(file_get_contents("php://input"), true);

    $cpf = isset($data['cpf']) ? (string) $data['cpf'] : null;
    $email = isset($data['email']) ? (string) $data['email'] : null;
    $cpfDigits = preg_replace('/\D+/', '', (string)$cpf);

    if ($cpf === null || $email === null) {
        echo json_encode(['status' => 'error', 'message' => 'Faltando dados necessários.']);
        exit;
    }

    try {
        $cpfBanco = Capsule::table('tblcustomfieldsvalues')
            ->where('fieldid', 2)
            ->whereRaw("REGEXP_REPLACE(value, '[^0-9]', '') = ?", [$cpfDigits])
            ->first();

        $resultsClients = localAPI('GetClients', array('search'=>$email));
        $qtdDeClientes = $resultsClients["totalresults"] > 0;
        $cpfIsset = isset($cpfBanco);


        $cpfDbDigits = preg_replace('/\D+/', '', (string)$cpfBanco->value);
        echo json_encode([
            'status'  => 'success',
            'cpf'     => ($cpfIsset),
            'email'=> $qtdDeClientes,
        ], JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
    
        exit;
    } catch (Exception $e) {
        // Em caso de erro, retorna a mensagem de erro
        echo json_encode(['status' => 'error', 'message' => 'Erro ao atualizar configurações: ' . $e->getMessage()]);
    }

} else {
    echo json_encode(['status' => 'error', 'message' => 'Método inválido. Somente POST é permitido.']);
}
?>