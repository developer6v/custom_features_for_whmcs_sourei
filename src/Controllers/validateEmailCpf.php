<?php
include_once('../../../../../init.php'); 
use WHMCS\Database\Capsule;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(file_get_contents("php://input"), true);

    $cpf = isset($data['cpf']) ? (int) $data['cpf'] : null;
    $email = isset($data['email']) ? (int) $data['email'] : null;
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


            // Retorna sucesso
            echo json_encode(['status' => 'success', 'message' => 'cpf: ' . $cpfBanco]);
    } catch (Exception $e) {
        // Em caso de erro, retorna a mensagem de erro
        echo json_encode(['status' => 'error', 'message' => 'Erro ao atualizar configurações: ' . $e->getMessage()]);
    }

} else {
    echo json_encode(['status' => 'error', 'message' => 'Método inválido. Somente POST é permitido.']);
}
?>