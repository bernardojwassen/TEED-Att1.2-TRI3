const botaoCriar = document.querySelector(".botaoCriar");
const campoNome = document.querySelector("[name='campoNome']");
const campoTipo = document.querySelector("[name='campoTipo']");
const campoEmail = document.querySelector("[name='campoEmail']");
const campoSenha = document.querySelector("[name='campoSenha']");
const listaUsuarios = document.querySelector("#listaUsuarios");

const URL_API = "http://localhost:3000/users";

botaoCriar.addEventListener('click', function (evento) {
    evento.preventDefault();

    const novoUsuario = {
        nome: campoNome.value,
        tipo: campoTipo.value,
        email: campoEmail.value,
        senha: campoSenha.value
    };

    criarUsuario(novoUsuario);
});

function criarUsuario(novoUsuario) {
    fetch(URL_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(novoUsuario),
    })
    .then(function (resposta) {
        return resposta.json();
    })
    .then(function (dadosCriados) {
        console.log("Usuário criado:", dadosCriados);
        carregarUsuarios();
    })
    .catch(function (erro) {
        console.error("Erro ao criar usuário:", erro);
    });
}

function carregarUsuarios() {
    fetch(URL_API, {
        method: "GET",
    })
    .then(function (resposta) {
        return resposta.json();
    })
    .then(function (listaDeUsuarios) {
        listaUsuarios.innerHTML = "";

        for (const usuario of listaDeUsuarios) {
            montarBlocoUsuario(usuario);
        }
    })
    .catch(function (erro) {
        console.error("Erro ao buscar usuários:", erro);
    });
}

function montarBlocoUsuario(usuario) {
    const blocoUsuario = document.createElement("div");
    blocoUsuario.classList.add("bloco");
    
    blocoUsuario.innerHTML = `
        <input type="text" class="editar-nome" value="${usuario.nome || ""}">
        <h3>TIPO: <input type="text" class="editar-tipo" value="${usuario.tipo || ""}"></h3>
        <h3>EMAIL: <input type="text" class="editar-email" value="${usuario.email || ""}"></h3>
        <h3>SENHA: <input type="text" class="editar-senha" value="${usuario.senha || ""}"></h3>
        <button class="botao-remover">Remover</button>
        <button class="botao-atualizar">UPDATE</button>
        <hr>
    `;

    blocoUsuario.querySelector(".botao-remover").addEventListener("click", function () {
        removerUsuario(usuario.id);
    });

    blocoUsuario.querySelector(".botao-atualizar").addEventListener("click", function () {
        const usuarioEditado = {
            nome: blocoUsuario.querySelector(".editar-nome").value,
            tipo: blocoUsuario.querySelector(".editar-tipo").value,
            email: blocoUsuario.querySelector(".editar-email").value,
            senha: blocoUsuario.querySelector(".editar-senha").value
        };

        atualizarUsuario(usuario.id, usuarioEditado);
    });

    listaUsuarios.append(blocoUsuario);
}

function atualizarUsuario(idUsuario, novosDados) {
    fetch(`${URL_API}/${idUsuario}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(novosDados)
    })
    .then(function (resposta) {
        return resposta.json();
    })
    .then(function (dadosAtualizados) {
        console.log("Usuário atualizado com sucesso:", dadosAtualizados);
        carregarUsuarios();
    })
    .catch(function (erro) {
        console.error("Erro ao atualizar usuário:", erro);
    });
}

function removerUsuario(idUsuario) {
    fetch(`${URL_API}/${idUsuario}`, {
        method: "DELETE"
    })
    .then(function () {
        carregarUsuarios();
    })
    .catch(function (erro) {
        console.error("Erro ao remover usuário:", erro);
    });
}

carregarUsuarios();