let formularioAtual = null;
const formularioRelatorio = document.getElementById("gerarRelatorio");

function mostrarFormulario(formularioId) {
  if (formularioAtual) {
    formularioAtual.style.display = "none"; // Oculta o formulário atual
  }

  const formularioDesejado = document.getElementById(formularioId);
  formularioDesejado.style.display = "block"; // Exibe o formulário desejado
  formularioAtual = formularioDesejado;
}
function cadastrarCargo() {
  const cargoNome = document.getElementById("nomeCargoCadastrado").value;
  const cargoDescricao = document.getElementById(
    "descricaoCargoCadastroCargo"
  ).value;

  if (cargoDescricao !== "") {
    fetch("principal.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `nomeCargo=${encodeURIComponent(
        cargoNome
      )}&cargoDescricao=${encodeURIComponent(cargoDescricao)}`,
    })
      .then((response) => {
        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return response.json();
          } else {
            throw new Error("Response is not in JSON format");
          }
        } else {
          throw new Error(`Ocorreu um erro: ${response.status}`);
        }
      })
      .then((data) => {
        if (data) {
          if (data.status === "sucesso") {
            alert(`O cargo ${cargoNome} foi cadastrado com sucesso`);
          } else {
            alert(`Erro ao cadastrar o cargo: ${data.message}`);
          }
        } else {
          throw new Error("Resposta vazia ou não é JSON válido");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Ocorreu um erro ao cadastrar o cargo.");
      });
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const formularioCadastrarCargo = document.getElementById("cadastrarCargo");
  const cadastrarCargoButton = formularioCadastrarCargo.querySelector(
    'button[type="submit"]'
  );

  cadastrarCargoButton.addEventListener("click", function (event) {
    event.preventDefault();
    cadastrarCargo();
  });
});

async function fetchCargosDisponiveis() {
  try {
    const response = await fetch("principal.php?listarTodosCargos=true");

    if (!response.ok) {
      throw new Error("Ocorreu um erro: " + response.status);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

function preencherCargoSelect(data) {
  const cargoCadastro = document.getElementById('selectCargoFuncionario')
  

  // Limpar as opções existentes
  cargoCadastro.innerHTML=""

  // Adicionar cada especialidade às opções
  data.forEach((cargo) => {
    const option = document.createElement("option");
    option.value = cargo.id;
    option.textContent = cargo.nome_cargo;
    cargoCadastro.appendChild(option);
  });
}
function preencherCargoSelectAlteracao(data){
  const cargoAlteradoSelect = document.getElementById('cargoFuncionarioAlterado')

  cargoAlteradoSelect.innerHTML=""
  data.forEach((cargo) => {
    const option = document.createElement("option");
    option.value = cargo.id;
    option.textContent = cargo.nome_cargo;
    cargoAlteradoSelect.appendChild(option);
  })
  
}
function preencherCargoSelectExcluir(data){
  const cargoExcluidoSelect = document.getElementById('selectCargoExcluirSelecionado')

  cargoExcluidoSelect.innerHTML=""
  data.forEach((cargo) => {
    const option = document.createElement("option");
    option.value = cargo.id;
    option.textContent = cargo.nome_cargo;
    cargoExcluidoSelect.appendChild(option);
  })
  
}

async function atualizarCargosDisponiveis() {
  try {
    const data = await fetchCargosDisponiveis();
    preencherCargoSelect(data)
    preencherCargoSelectAlteracao(data);
    preencherCargoSelectExcluir(data)
  } catch (error) {
    console.error(error);
    // Exibir uma mensagem de erro ao usuário, se desejado
  }
}

atualizarCargosDisponiveis();

async function cadastrarFuncionario() {
  const funcionarioNome = document.getElementById(
    "nomeFuncionarioCadastrar"
  ).value;
  const funcionarioSobreNome = document.getElementById(
    "sobreNomeFuncionarioCadastrar"
  ).value;
  const funcionarioCargo = document.getElementById(
    "selectCargoFuncionario"
  ).value;
  const funcionarioDataNascimento = document.getElementById("pickDate").value;
  const funcionarioSalario = document.getElementById(
    "salarioFuncionarioCadastrar"
  ).value;
  const funcionarioCargoDescricao = document.getElementById(
    "descricaoCargoFuncionarioCadastrar"
  ).value;

  try {
    const response = await fetch("principal.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `nomeFuncionario=${encodeURIComponent(
        funcionarioNome
      )}&sobreNomeFuncionario=${encodeURIComponent(
        funcionarioSobreNome
      )}&cargoId=${encodeURIComponent(
        funcionarioCargo
      )}&dataNascimento=${encodeURIComponent(
        funcionarioDataNascimento
      )}&salarioFuncionarioCadastro=${encodeURIComponent(
        funcionarioSalario
      )}&descricaoCargoCadastro=${encodeURIComponent(
        funcionarioCargoDescricao
      )}`,
    });

    if (!response.ok) {
      throw new Error(`Ocorreu um erro: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      if (data.status === "sucesso") {
        alert(`O Funcionario ${funcionarioNome} foi cadastrado com sucesso`);
      } else {
        alert(`Erro ao cadastrar o funcionario: ${data.message}`);
      }
    } else {
      throw new Error("Resposta vazia ou não é JSON válido");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Ocorreu um erro ao cadastrar o Funcionario.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const formularioCadastrarFuncionario = document.getElementById(
    "cadastrarFuncionario"
  );
  const cadastrarFuncionarioButton =
    formularioCadastrarFuncionario.querySelector('button[type="submit"]');

  cadastrarFuncionarioButton.addEventListener("click", function (event) {
    event.preventDefault();
    cadastrarFuncionario();
  });
});

async function fetchFuncionariosDisponiveis() {
  try {
    const response = await fetch("principal.php?listarFuncionarios=true");

    if (!response.ok) {
      throw new Error("Ocorreu um erro: " + response.status);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

function preencherFuncionariosSelect(data) {
  const funcionarioRelatorioSelect = document.getElementById("funcionarioSelecionadoRelatorio")
  funcionarioRelatorioSelect.innerHTML="";
  data.forEach((funcionario) => {
    const option = document.createElement("option");
    option.value = funcionario.id;
    option.textContent =` ${funcionario.nome_profissional} ${funcionario.sobrenome_profissional}`
    funcionarioRelatorioSelect.appendChild(option)
  });
}

function preencherSelectFuncionarioExcluir(data){
  const funcionarioExcluidoSelect = document.getElementById('selectExcluirFuncionario')
  funcionarioExcluidoSelect.innerHTML="";
  data.forEach((funcionario) => {
    const option = document.createElement("option");
    option.value = funcionario.id;
    option.textContent =` ${funcionario.nome_profissional} ${funcionario.sobrenome_profissional}`
    funcionarioExcluidoSelect.appendChild(option)
  });
}

function preencherSelectFuncionarioAlterar(data){
  const FuncionarioAlteradoSelect = document.getElementById("funcionarioAlterado")
  FuncionarioAlteradoSelect.innerHTML="";
  data.forEach((funcionario) => {
    const option = document.createElement("option");
    option.value = funcionario.id;
    option.textContent =` ${funcionario.nome_profissional} ${funcionario.sobrenome_profissional}`
    FuncionarioAlteradoSelect.appendChild(option)
  });
}

async function atualizarFuncionariosDisponiveis() {
  try {
    const data = await fetchFuncionariosDisponiveis();
    preencherFuncionariosSelect(data);
    preencherSelectFuncionarioExcluir(data)
    preencherSelectFuncionarioAlterar(data)
  } catch (error) {
    console.error(error);
    // Exibir uma mensagem de erro ao usuário, se desejado
  }
}

atualizarFuncionariosDisponiveis();

async function excluirFuncionario() {
  const excluirFuncionario = document.getElementById("selectExcluirFuncionario").value;

  try {
    const response = await fetch("principal.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `excluirFuncionario=${encodeURIComponent(excluirFuncionario)}`
    });

    if (!response.ok) {
      throw new Error(`Ocorreu um erro: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log(data);

      if (data) {
        if (data.status === "sucesso") {
          alert(`O Funcionário foi excluído do banco de dados.`);
        } else {
          alert(`Erro ao excluir o Funcionário: ${data.message}`);
        }
      } else {
        throw new Error("Resposta vazia ou não é JSON válido");
      }
    } else {
      throw new Error("Response is not in JSON format");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Ocorreu um erro ao excluir o funcionário.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const formularioExclusaoFuncionario = document.getElementById("excluirFuncionario");

  formularioExclusaoFuncionario.addEventListener("submit", function (event) {
    event.preventDefault(); 
    excluirFuncionario();
  });
});

async function excluirCargo() {
  const excluirCargo = document.getElementById("selectCargoExcluirSelecionado").value;

  try {
    const response = await fetch("principal.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `excluirCargo=${encodeURIComponent(excluirCargo)}`
    });

    if (!response.ok) {
      throw new Error(`Ocorreu um erro: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log(data);

      if (data) {
        if (data.status === "sucesso") {
          alert(`O Cargo foi excluído do banco de dados.`);
        } else {
          alert(`Erro ao excluir o Cargo: ${data.message}`);
        }
      } else {
        throw new Error("Resposta vazia ou não é JSON válido");
      }
    } else {
      throw new Error("Response is not in JSON format");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Ocorreu um erro ao excluir o funcionário.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const formularioexclusaoCargo = document.getElementById("excluirCargo");

  formularioexclusaoCargo.addEventListener("submit", function (event) {
    event.preventDefault(); 
    excluirCargo();
  });
});

async function alterarFuncionario() {
  const funcionarioNomeSelecionado = document.getElementById(
    "funcionarioAlterado"
  ).value;
  const funcionarioCargoNovo = document.getElementById(
    "cargoFuncionarioAlterado"
  ).value;
  const funcionarioSalarioAlterado = document.getElementById(
    "salarioAlterado"
  ).value;
  const funcionarioCargoDescricaoAlterado = document.getElementById(
    "descricaoAlterada"
  ).value;

  try {
    const response = await fetch("principal.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `nomeFuncionarioSelecionado=${encodeURIComponent(
        funcionarioNomeSelecionado
      )}&cargoIdNovo=${encodeURIComponent(
        funcionarioCargoNovo
      )}&salarioFuncionarioAlterado=${encodeURIComponent(
        funcionarioSalarioAlterado
      )}&descricaoCargoAlterado=${encodeURIComponent(
        funcionarioCargoDescricaoAlterado
      )}`,
    });

    if (!response.ok) {
      throw new Error(`Ocorreu um erro: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      if (data.status === "sucesso") {
        alert(`O Funcionario foi alterado com sucesso`);
      } else {
        alert(`Erro ao Modificar o funcionario: ${data.message}`);
      }
    } else {
      throw new Error("Resposta vazia ou não é JSON válido");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Ocorreu um erro ao Modificar o Funcionario.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const formularioAlterarFuncionario = document.getElementById("alterarFuncionario");
  const alterarFuncionarioButton = formularioAlterarFuncionario.querySelector('button[type="submit"]');

  alterarFuncionarioButton.addEventListener("click", function (event) {
    event.preventDefault();
    alterarFuncionario();
  });
});
