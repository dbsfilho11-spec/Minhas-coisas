var botaoMenu = document.querySelector('.alternarMenu');
var menuLateral = document.getElementById('menuLateral');
var quadroJogo = document.querySelector('.quadroJogo');
var sobreposicaoPainel = document.getElementById('sobreposicaoPainel');
var botaoFecharPainel = document.querySelector('.fecharPainel');
var linksMenu = document.querySelectorAll('.linkMenu');
var conteudosPainel = document.querySelectorAll('.conteudoPainel');
var botaoTema = document.getElementById('botaoTema');
var textoTema = document.querySelector('.textoTema');
var iconeTema = document.querySelector('.iconeTema');
var elementoSaudacao = document.getElementById('saudacao');
var formularioContato = document.getElementById('formularioContato');

function atualizarSaudacao() {
    if (!elementoSaudacao) {
        return;
    }

    var horaAtual = new Date().getHours();
    var textoSaudacao = 'Boa noite';

    if (horaAtual >= 5 && horaAtual < 12) {
        textoSaudacao = 'Bom dia';
    } else if (horaAtual >= 12 && horaAtual < 18) {
        textoSaudacao = 'Boa tarde';
    }

    elementoSaudacao.textContent = textoSaudacao + ', aventureiro.';
}

function aplicarTema(modoClaro) {
    document.body.classList.toggle('modoClaro', modoClaro);

    if (textoTema) {
        textoTema.textContent = modoClaro ? 'Escuro' : 'Claro';
    }

    if (iconeTema) {
        iconeTema.textContent = modoClaro ? '🌙' : '☀️';
    }

    if (botaoTema) {
        botaoTema.setAttribute('aria-pressed', String(modoClaro));
    }

    localStorage.setItem('temaPortifolio', modoClaro ? 'claro' : 'escuro');
}

function inicializarTema() {
    var temaSalvo = localStorage.getItem('temaPortifolio');
    var preferenciaSistema = window.matchMedia('(prefers-color-scheme: light)').matches;
    var deveUsarTemaClaro = temaSalvo ? temaSalvo === 'claro' : preferenciaSistema;

    aplicarTema(deveUsarTemaClaro);
}

if (botaoTema) {
    botaoTema.addEventListener('click', function() {
        var modoClaroAtivo = document.body.classList.contains('modoClaro');
        aplicarTema(!modoClaroAtivo);
    });
}

atualizarSaudacao();
inicializarTema();

function alternarMenu(forcarAbertura) {
    if (!menuLateral || !botaoMenu) {
        return;
    }

    var deveAbrir = forcarAbertura;

    if (typeof forcarAbertura !== 'boolean') {
        deveAbrir = !menuLateral.classList.contains('aberto');
    }

    menuLateral.classList.toggle('aberto', deveAbrir);
    botaoMenu.classList.toggle('ativo', deveAbrir);
    botaoMenu.setAttribute('aria-expanded', String(deveAbrir));
    menuLateral.setAttribute('aria-hidden', String(!deveAbrir));
}

function abrirPainel(chavePainel) {
    for (var i = 0; i < conteudosPainel.length; i++) {
        var painel = conteudosPainel[i];
        var estaAtivo = painel.dataset.painelConteudo === chavePainel;
        painel.classList.toggle('ativo', estaAtivo);
    }

    if (sobreposicaoPainel) {
        sobreposicaoPainel.classList.add('visivel');
        sobreposicaoPainel.setAttribute('aria-hidden', 'false');
    }

    alternarMenu(false);
}

if (botaoMenu) {
    botaoMenu.addEventListener('click', function() {
        alternarMenu();
    });
}

for (var i = 0; i < linksMenu.length; i++) {
    linksMenu[i].addEventListener('click', function() {
        abrirPainel(this.dataset.painel);
    });
}

var botaoVoltarHome = document.querySelector('[data-voltar-home]');

if (botaoVoltarHome) {
    botaoVoltarHome.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
}

if (botaoFecharPainel && sobreposicaoPainel) {
    botaoFecharPainel.addEventListener('click', function() {
        sobreposicaoPainel.classList.remove('visivel');
        sobreposicaoPainel.setAttribute('aria-hidden', 'true');
    });
}

if (sobreposicaoPainel) {
    sobreposicaoPainel.addEventListener('click', function(evento) {
        if (evento.target === sobreposicaoPainel) {
            sobreposicaoPainel.classList.remove('visivel');
            sobreposicaoPainel.setAttribute('aria-hidden', 'true');
        }
    });
}

if (formularioContato) {
    var nomeContato = document.getElementById('nomeContato');
    var emailContato = document.getElementById('emailContato');
    var mensagemContato = document.getElementById('mensagemContato');

    var camposFormulario = [nomeContato, emailContato, mensagemContato];

    function mostrarErro(campo, texto) {
        var mensagemErro = document.querySelector('[data-erro="' + campo.name + '"]');
        campo.classList.add('invalido');

        if (mensagemErro) {
            mensagemErro.textContent = texto;
        }
    }

    function limparErro(campo) {
        var mensagemErro = document.querySelector('[data-erro="' + campo.name + '"]');
        campo.classList.remove('invalido');

        if (mensagemErro) {
            mensagemErro.textContent = '';
        }
    }

    function validarCampo(campo) {
        var valor = campo.value.trim();

        if (!valor) {
            mostrarErro(campo, 'Este campo é obrigatório.');
            return false;
        }

        if (campo.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
            mostrarErro(campo, 'Digite um e-mail válido.');
            return false;
        }

        if (campo.name === 'mensagem' && valor.length < 10) {
            mostrarErro(campo, 'A mensagem precisa ter pelo menos 10 caracteres.');
            return false;
        }

        limparErro(campo);
        return true;
    }

    for (var i = 0; i < camposFormulario.length; i++) {
        var campo = camposFormulario[i];

        if (!campo) {
            continue;
        }

        campo.addEventListener('input', function() {
            validarCampo(this);
        });
    }

    formularioContato.addEventListener('submit', function(evento) {
        evento.preventDefault();

        var camposValidos = [];
        for (var i = 0; i < camposFormulario.length; i++) {
            var campo = camposFormulario[i];
            if (campo) {
                camposValidos.push(validarCampo(campo));
            }
        }

        var formularioValido = true;
        for (var i = 0; i < camposValidos.length; i++) {
            if (camposValidos[i] === false) {
                formularioValido = false;
                break;
            }
        }

        var mensagemSucesso = document.getElementById('mensagemSucesso');

        if (!formularioValido) {
            if (mensagemSucesso) {
                mensagemSucesso.textContent = 'Corrija os campos destacados antes de enviar.';
            }
            return;
        }

        if (mensagemSucesso) {
            mensagemSucesso.textContent = 'Mensagem enviada com sucesso!';
        }

        formularioContato.reset();
    });
}

document.addEventListener('click', function(evento) {
    if (!quadroJogo || !sobreposicaoPainel) {
        return;
    }

    if (!quadroJogo.contains(evento.target) && !sobreposicaoPainel.contains(evento.target)) {
        alternarMenu(false);
    }
});

document.addEventListener('keydown', function(evento) {
    if (evento.key === 'Escape' && sobreposicaoPainel && sobreposicaoPainel.classList.contains('visivel')) {
        sobreposicaoPainel.classList.remove('visivel');
        sobreposicaoPainel.setAttribute('aria-hidden', 'true');
    }
});
