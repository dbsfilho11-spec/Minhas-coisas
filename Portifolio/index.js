var elementoSaudacao = document.getElementById('saudacao');
var elementoAno = document.getElementById('anoAtual');
var mensagem = document.querySelector('.mensagemMenu');
var botoesMenu = document.querySelectorAll('.itemMenu');

var modalConquistas = document.getElementById('modalConquistas');
var botaoFecharConquistas = document.querySelector('.fecharConquistas');

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

function atualizarAno() {
    if (elementoAno) {
        elementoAno.textContent = new Date().getFullYear();
    }
}

atualizarSaudacao();
atualizarAno();

function abrirModalConquistas() {
    if (!modalConquistas) {
        return;
    }

    modalConquistas.classList.add('visivel');
    modalConquistas.setAttribute('aria-hidden', 'false');
}

function fecharModalConquistas() {
    if (!modalConquistas) {
        return;
    }

    modalConquistas.classList.remove('visivel');
    modalConquistas.setAttribute('aria-hidden', 'true');
}

function selecionarItemMenu(botao) {
    for (var i = 0; i < botoesMenu.length; i++) {
        var item = botoesMenu[i];
        if (item === botao) {
            item.classList.add('selecionado');
        } else {
            item.classList.remove('selecionado');
        }
    }

    var acao = botao.dataset.acao;

    if (mensagem) {
        if (acao === 'iniciar') {
            mensagem.textContent = 'A jornada começa. O abismo está esperando…';
        } else if (acao === 'opcoes') {
            mensagem.textContent = 'Aqui você pode colocar suas informações, ajustes e preferências.';
        } else if (acao === 'conquistas') {
            mensagem.textContent = 'Suas conquistas e marcos aparecerão aqui.';
        } else {
            mensagem.textContent = 'Selecione uma opção.';
        }
    }

    if (acao === 'iniciar') {
        fecharModalConquistas();

        var telaInicial = document.querySelector('.telaInicial');
        if (telaInicial) {
            telaInicial.classList.add('inicio');

            window.setTimeout(function() {
                telaInicial.classList.remove('inicio');
            }, 900);

            window.setTimeout(function() {
                window.location.href = 'Pag2.html#areaJogo';
            }, 500);
        }

        return;
    }

    if (acao === 'opcoes') {
        window.location.href = 'opcoes.html';
        return;
    }

    if (acao === 'conquistas') {
        abrirModalConquistas();
    }
}

for (var i = 0; i < botoesMenu.length; i++) {
    botoesMenu[i].addEventListener('click', function() {
        selecionarItemMenu(this);
    });
}

if (botaoFecharConquistas) {
    botaoFecharConquistas.addEventListener('click', fecharModalConquistas);
}

if (modalConquistas) {
    modalConquistas.addEventListener('click', function(evento) {
        if (evento.target === modalConquistas) {
            fecharModalConquistas();
        }
    });
}

document.addEventListener('keydown', function(evento) {
    if (evento.key === 'Escape' && modalConquistas && modalConquistas.classList.contains('visivel')) {
        fecharModalConquistas();
        return;
    }

    if (evento.key === 'Enter') {
        var botaoSelecionado = document.querySelector('.itemMenu.selecionado');

        if (!botaoSelecionado && document.activeElement && document.activeElement.classList && document.activeElement.classList.contains('itemMenu') === false) {
            evento.preventDefault();

            var primeiroBotao = document.querySelector('.itemMenu');
            if (primeiroBotao) {
                primeiroBotao.click();
            }
            return;
        }

        if (!botaoSelecionado) {
            return;
        }

        if (document.activeElement !== botaoSelecionado) {
            evento.preventDefault();
            botaoSelecionado.click();
        }
        return;
    }

    if (evento.key !== 'ArrowDown' && evento.key !== 'ArrowUp') {
        return;
    }

    evento.preventDefault();

    var botoesAtivos = document.querySelectorAll('.itemMenu');
    var indiceAtual = -1;

    for (var i = 0; i < botoesAtivos.length; i++) {
        if (document.activeElement === botoesAtivos[i]) {
            indiceAtual = i;
            break;
        }
    }

    var direcao = evento.key === 'ArrowDown' ? 1 : -1;
    var proximo = (indiceAtual + direcao + botoesAtivos.length) % botoesAtivos.length;

    if (indiceAtual === -1) {
        proximo = 0;
    }

    botoesAtivos[proximo].focus();
    selecionarItemMenu(botoesAtivos[proximo]);
});
