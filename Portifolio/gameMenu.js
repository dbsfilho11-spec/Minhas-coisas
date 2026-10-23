const botaoMenu = document.querySelector('.alternarMenu');
const menuLateral = document.getElementById('menuLateral');
const quadroJogo = document.querySelector('.quadroJogo');
const sobreposicaoPainel = document.getElementById('sobreposicaoPainel');
const botaoFecharPainel = document.querySelector('.fecharPainel');
const linksMenu = document.querySelectorAll('.linkMenu');
const conteudosPainel = document.querySelectorAll('.conteudoPainel');
const botaoTema = document.getElementById('botaoTema');
const textoTema = document.querySelector('.textoTema');
const iconeTema = document.querySelector('.iconeTema');
const elementoSaudacao = document.getElementById('saudacao');
const formularioContato = document.getElementById('formularioContato');

function atualizarSaudacao() {
    if (!elementoSaudacao) return;

    const horaAtual = new Date().getHours();
    let textoSaudacao = 'Boa noite';

    if (horaAtual >= 5 && horaAtual < 12) {
        textoSaudacao = 'Bom dia';
    } else if (horaAtual >= 12 && horaAtual < 18) {
        textoSaudacao = 'Boa tarde';
    }

    elementoSaudacao.textContent = `${textoSaudacao}, aventureiro.`;
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
    const temaSalvo = localStorage.getItem('temaPortifolio');
    const preferenciaSistema = window.matchMedia('(prefers-color-scheme: light)').matches;
    const deveUsarTemaClaro = temaSalvo ? temaSalvo === 'claro' : preferenciaSistema;

    aplicarTema(deveUsarTemaClaro);
}

if (botaoTema) {
    botaoTema.addEventListener('click', () => {
        const modoClaroAtivo = document.body.classList.contains('modoClaro');
        aplicarTema(!modoClaroAtivo);
    });
}

atualizarSaudacao();
inicializarTema();

function alternarMenu(forcarAbertura) {
    if (!menuLateral || !botaoMenu) return;

    const deveAbrir = typeof forcarAbertura === 'boolean' ? forcarAbertura : !menuLateral.classList.contains('aberto');
    menuLateral.classList.toggle('aberto', deveAbrir);
    botaoMenu.classList.toggle('ativo', deveAbrir);
    botaoMenu.setAttribute('aria-expanded', String(deveAbrir));
    menuLateral.setAttribute('aria-hidden', String(!deveAbrir));
}

function abrirPainel(chavePainel) {
    conteudosPainel.forEach((painel) => {
        const estaAtivo = painel.dataset.painelConteudo === chavePainel;
        painel.classList.toggle('ativo', estaAtivo);
    });

    if (sobreposicaoPainel) {
        sobreposicaoPainel.classList.add('visivel');
        sobreposicaoPainel.setAttribute('aria-hidden', 'false');
    }

    alternarMenu(false);
}

if (botaoMenu) {
    botaoMenu.addEventListener('click', () => alternarMenu());
}

linksMenu.forEach((botao) => {
    botao.addEventListener('click', () => abrirPainel(botao.dataset.painel));
});

if (botaoFecharPainel && sobreposicaoPainel) {
    botaoFecharPainel.addEventListener('click', () => {
        sobreposicaoPainel.classList.remove('visivel');
        sobreposicaoPainel.setAttribute('aria-hidden', 'true');
    });
}

if (sobreposicaoPainel) {
    sobreposicaoPainel.addEventListener('click', (evento) => {
        if (evento.target === sobreposicaoPainel) {
            sobreposicaoPainel.classList.remove('visivel');
            sobreposicaoPainel.setAttribute('aria-hidden', 'true');
        }
    });
}

if (formularioContato) {
    const camposFormulario = {
        nome: document.getElementById('nomeContato'),
        email: document.getElementById('emailContato'),
        mensagem: document.getElementById('mensagemContato')
    };

    function mostrarErro(campo, texto) {
        const mensagemErro = document.querySelector(`[data-erro="${campo.name}"]`);
        campo.classList.add('invalido');
        if (mensagemErro) {
            mensagemErro.textContent = texto;
        }
    }

    function limparErro(campo) {
        const mensagemErro = document.querySelector(`[data-erro="${campo.name}"]`);
        campo.classList.remove('invalido');
        if (mensagemErro) {
            mensagemErro.textContent = '';
        }
    }

    function validarCampo(campo) {
        const valor = campo.value.trim();

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

    Object.values(camposFormulario).forEach((campo) => {
        if (!campo) return;

        campo.addEventListener('input', () => validarCampo(campo));
    });

    formularioContato.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const camposValidos = Object.values(camposFormulario).filter(Boolean).map((campo) => validarCampo(campo));
        const formularioValido = camposValidos.every(Boolean);
        const mensagemSucesso = document.getElementById('mensagemSucesso');

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

document.addEventListener('click', (evento) => {
    if (!quadroJogo || !sobreposicaoPainel) return;

    if (!quadroJogo.contains(evento.target) && !sobreposicaoPainel.contains(evento.target)) {
        alternarMenu(false);
    }
});

document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && sobreposicaoPainel && sobreposicaoPainel.classList.contains('visivel')) {
        sobreposicaoPainel.classList.remove('visivel');
        sobreposicaoPainel.setAttribute('aria-hidden', 'true');
    }
});
