<?php
class BancoDados {
    private $conn;

    public function __construct() {
        $servername = "localhost";
        $username = "root";
        $password = "";
        $dbname = "sistema_teste";
        $this->conn = new mysqli($servername, $username, $password, $dbname);
        if ($this->conn->connect_error) {
            die("Erro na conexão com o banco de dados: " . $this->conn->connect_error);
        }
    }

    public function fecharConexao() {
        $this->conn->close();
    }

    public function cadastrarCargo($nomeCargo, $cargoDescricao) {
        // Preparar a consulta SQL com uma instrução preparada
        $sql = "INSERT INTO cargos (nome_cargo, descricao) VALUES (?, ?)";
        $stmt = $this->conn->prepare($sql);
        // Vincular os parâmetros
        $stmt->bind_param("ss", $nomeCargo, $cargoDescricao);
        if ($stmt->execute()) {
            $response = array("status" => "sucesso", "message" => "Cargo $nomeCargo cadastrado com sucesso");
        } else {
            $response = array("status" => "erro", "message" => "Erro ao cadastrar o Cargo $nomeCargo: " . $stmt->error);
        }
        $stmt->close();
        return json_encode($response);
    }

    public function listarCargos() {
        // Preparar a consulta SQL com uma instrução preparada
        $sql = "SELECT * FROM cargos";
        $result = $this->conn->query($sql);
        $response = array();
        while ($row = $result->fetch_assoc()) {
            $response[] = $row;
        }
        return json_encode($response);
    }

    public function listarFuncionarios() {
        // Preparar a consulta SQL com uma instrução preparada
        $sql = "SELECT id, nome_profissional, sobrenome_profissional FROM funcionario";
        $result = $this->conn->query($sql);
        $response = array();
        while ($row = $result->fetch_assoc()) {
            $response[] = $row;
        }
        return json_encode($response);
    }

    public function cadastrarFuncionario($nomeFuncionario, $sobreNomeFuncionario, $cargoId, $dataNascimento, $salarioFuncionarioCadastro, $descricaoCargoCadastro) {
        $nomeFuncionario = $this->conn->real_escape_string($nomeFuncionario);
        $sobreNomeFuncionario = $this->conn->real_escape_string($sobreNomeFuncionario);
        $cargoId = $this->conn->real_escape_string($cargoId);
        $dataNascimento = $this->conn->real_escape_string($dataNascimento);
        $salarioFuncionarioCadastro = $this->conn->real_escape_string($salarioFuncionarioCadastro);
        $descricaoCargoCadastro = $this->conn->real_escape_string($descricaoCargoCadastro);

        // Verificar se a especialidade existe
        $sqlCargo = "SELECT id FROM Cargos WHERE id = '$cargoId'";
        $resultadoCargo = $this->conn->query($sqlCargo);

        if ($resultadoCargo->num_rows > 0) {
            // A especialidade existe, realizar a inserção do profissional
            $sql = "INSERT INTO funcionario (id, nome_profissional, sobrenome_profissional, cargo_id, data_nascimento, salario, descricao_atividades) VALUES (NULL, '$nomeFuncionario', '$sobreNomeFuncionario', '$cargoId','$dataNascimento','$salarioFuncionarioCadastro','$descricaoCargoCadastro')";

            if ($this->conn->query($sql) === TRUE) {
                $response = array("status" => "sucesso", "message" => "Profissional $nomeFuncionario cadastrado com sucesso!");
            } else {
                $response = array("status" => "erro", "message" => "Erro ao cadastrar o profissional: " . $this->conn->error);
            }
        } else {
            // A especialidade não existe
            $response = array("status" => "erro", "message" => "A especialidade fornecida não é válida.");
        }

        return json_encode($response);
    }

    public function deletarProfissional($idFuncionario) {
        $sql = "DELETE FROM funcionario WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $idFuncionario);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            $response = array("status" => "sucesso", "message" => "Profissional ID $idFuncionario deletado com sucesso!");
        } else {
            $response = array("status" => "erro", "message" => "Erro ao deletar o profissional: " . $this->conn->error);
        }

        $stmt->close();
        return json_encode($response);
    }

    public function deletarCargo($idCargo) {
        $sql = "DELETE FROM cargos WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $idCargo);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            $response = array("status" => "sucesso", "message" => "Cargo ID $idCargo deletado com sucesso!");
        } else {
            $response = array("status" => "erro", "message" => "Erro ao deletar o Cargo: " . $this->conn->error);
        }

        $stmt->close();
        return json_encode($response);
    }

    public function alterarFuncionario($idFuncionario, $idNovoCargo, $novoSalario, $novaDescricao) {
        $sql = "UPDATE funcionario set cargo_id = '$idNovoCargo', salario = '$novoSalario', descricao_atividades = '$novaDescricao' where id = '$idFuncionario'; ";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            $response = array("status" => "sucesso", "message" => "Profissional ID $idFuncionario alterado com sucesso!");
        } else {
            $response = array("status" => "erro", "message" => "Erro ao alterar o profissional: " . $this->conn->error);
        }

        $stmt->close();
        return json_encode($response);
    }
}

$bancoDados = new BancoDados();

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if (isset($_GET['listarFuncionarios'])) {
        $response = $bancoDados->listarFuncionarios();
        echo $response;
    } else if (isset($_GET['listarTodosCargos'])) {
        $response = $bancoDados->listarCargos();
        echo $response;
    }
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['nomeCargo']) && isset($_POST['cargoDescricao'])) {
        $nomeCargo = $_POST["nomeCargo"];
        $cargoDescricao = $_POST["cargoDescricao"];
        $response = $bancoDados->cadastrarCargo($nomeCargo, $cargoDescricao);
        header('Content-Type: application/json');
        echo $response;
    } else if (isset($_POST['nomeFuncionario']) && isset($_POST['sobreNomeFuncionario']) && isset($_POST['cargoId']) && isset($_POST['dataNascimento']) && isset($_POST['salarioFuncionarioCadastro']) && isset($_POST['descricaoCargoCadastro'])) {
        $nomeFuncionario = $_POST["nomeFuncionario"];
        $sobreNomeFuncionario = $_POST["sobreNomeFuncionario"];
        $cargoId = $_POST["cargoId"];
        $dataNascimento = $_POST["dataNascimento"];
        $salarioFuncionarioCadastro = $_POST["salarioFuncionarioCadastro"];
        $descricaoCargoCadastro = $_POST["descricaoCargoCadastro"];
        $response = $bancoDados->cadastrarFuncionario($nomeFuncionario, $sobreNomeFuncionario, $cargoId, $dataNascimento, $salarioFuncionarioCadastro, $descricaoCargoCadastro);
        header('Content-Type: application/json');
        echo $response;
    } else if (isset($_POST['excluirFuncionario'])) {
        $idFuncionario = $_POST['excluirFuncionario'];
        $response = $bancoDados->deletarProfissional($idFuncionario);
        header('Content-Type: application/json');
        echo $response;
    } else if (isset($_POST['excluirCargo'])) {
        $idCargo = $_POST['excluirCargo'];
        $response = $bancoDados->deletarCargo($idCargo);
        header('Content-Type: application/json');
        echo $response;
    } else if (isset($_POST['nomeFuncionarioSelecionado']) && isset($_POST['cargoIdNovo']) && isset($_POST['salarioFuncionarioAlterado']) && isset($_POST['descricaoCargoAlterado'])) {
        $idFuncionario = $_POST["nomeFuncionarioSelecionado"];
        $idNovoCargo = $_POST['cargoIdNovo'];
        $novoSalario = $_POST['salarioFuncionarioAlterado'];
        $novaDescricao = $_POST['descricaoCargoAlterado'];
        $response = $bancoDados->alterarFuncionario($idFuncionario, $idNovoCargo, $novoSalario, $novaDescricao);
        header('Content-Type: application/json');
        echo $response;
    }
}

$bancoDados->fecharConexao();
