const elementoSaudacao = document.getElementById('saudacao');
const elementoAno = document.getElementById('anoAtual');
const mensagem = document.querySelector('.mensagemMenu');
const botoesMenu = [...document.querySelectorAll('.itemMenu')];

const modalConquistas = document.getElementById('modalConquistas');
const botaoFecharConquistas = document.querySelector('.fecharConquistas');

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

function atualizarAno() {
    if (elementoAno) {
        elementoAno.textContent = new Date().getFullYear();
    }
}

atualizarSaudacao();
atualizarAno();

const mensagensMenu = {
    iniciar: 'A jornada começa. O abismo está esperando…',
    opcoes: 'Aqui você pode colocar suas informações, ajustes e preferências.',
    conquistas: 'Suas conquistas e marcos aparecerão aqui.'
};

function abrirModalConquistas() {
    if (!modalConquistas) return;
    modalConquistas.classList.add('visivel');
    modalConquistas.setAttribute('aria-hidden', 'false');
}

function fecharModalConquistas() {
    if (!modalConquistas) return;
    modalConquistas.classList.remove('visivel');
    modalConquistas.setAttribute('aria-hidden', 'true');
}

function selecionarItemMenu(botao) {
    botoesMenu.forEach((item) => item.classList.toggle('selecionado', item === botao));

    const acao = botao.dataset.acao;
    if (mensagem) {
        mensagem.textContent = mensagensMenu[acao] || 'Selecione uma opção.';
    }

    if (acao === 'iniciar') {
        fecharModalConquistas();
        const telaInicial = document.querySelector('.telaInicial');
        if (telaInicial) {
            telaInicial.classList.add('inicio');
            window.setTimeout(() => telaInicial.classList.remove('inicio'), 900);
            window.setTimeout(() => {
                window.location.href = 'Pag2.html#areaJogo';
            }, 500);
        }
        return;
    }

    if (acao === 'conquistas') {
        abrirModalConquistas();
    }
}

botoesMenu.forEach((botao) => {
    botao.addEventListener('click', () => selecionarItemMenu(botao));
});

if (botaoFecharConquistas) {
    botaoFecharConquistas.addEventListener('click', fecharModalConquistas);
}

if (modalConquistas) {
    modalConquistas.addEventListener('click', (evento) => {
        if (evento.target === modalConquistas) {
            fecharModalConquistas();
        }
    });
}

document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && modalConquistas && modalConquistas.classList.contains('visivel')) {
        fecharModalConquistas();
        return;
    }

    if (evento.key === 'Enter' && !botoesMenu.includes(document.activeElement)) {
        evento.preventDefault();
        botoesMenu.find((botao) => botao.classList.contains('selecionado'))?.click();
        return;
    }

    if (evento.key !== 'ArrowDown' && evento.key !== 'ArrowUp') return;

    evento.preventDefault();
    const indiceAtual = botoesMenu.indexOf(document.activeElement);
    const direcao = evento.key === 'ArrowDown' ? 1 : -1;
    const proximo = (indiceAtual + direcao + botoesMenu.length) % botoesMenu.length;

    botoesMenu[proximo].focus();
    selecionarItemMenu(botoesMenu[proximo]);
});
