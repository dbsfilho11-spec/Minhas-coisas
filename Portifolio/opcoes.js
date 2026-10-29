var toggleTema = document.querySelector('[data-theme-toggle]');
var checkboxAltoContraste = document.querySelector('[data-option="alto-contraste"]');
var checkboxReducaoAnimacoes = document.querySelector('[data-option="reduzir-animacoes"]');
var rangeTamanhoTexto = document.querySelector('[data-option="font-size"]');
var rangeVolume = document.querySelector('[data-option="volume"]');
var botoesVoltar = document.querySelectorAll('[data-voltar-home]');
var botaoReset = document.querySelector('[data-reset]');

function lerLocalStorage(chave, padrao) {
    try {
        var valor = localStorage.getItem(chave);
        return valor === null ? padrao : valor;
    } catch (erro) {
        return padrao;
    }
}

function salvarLocalStorage(chave, valor) {
    try {
        localStorage.setItem(chave, valor);
    } catch (erro) {
        // Ignora falha do navegador em ambientes restritos.
    }
}

function atualizarTemaTexto() {
    if (!toggleTema) {
        return;
    }

    var temaAtivo = document.body.classList.contains('tema-claro') ? 'claro' : 'escuro';
    toggleTema.textContent = temaAtivo === 'claro' ? 'Tema claro' : 'Tema escuro';
    toggleTema.setAttribute('aria-pressed', String(temaAtivo === 'claro'));
}

function aplicarTema(temaClaro) {
    document.body.classList.toggle('tema-claro', !!temaClaro);
    atualizarTemaTexto();
    salvarLocalStorage('portfolioTema', temaClaro ? 'claro' : 'escuro');
}

function aplicarAjustes() {
    var temaSalvo = lerLocalStorage('portfolioTema', 'escuro');
    var contrasteSalvo = lerLocalStorage('portfolioAltoContraste', 'false') === 'true';
    var reducaoSalva = lerLocalStorage('portfolioReducaoAnimacoes', 'false') === 'true';
    var tamanhoTexto = Number(lerLocalStorage('portfolioTamanhoTexto', '16'));
    var volume = Number(lerLocalStorage('portfolioVolume', '70'));

    document.body.classList.toggle('tema-claro', temaSalvo === 'claro');
    document.body.classList.toggle('alto-contraste', contrasteSalvo);
    document.body.classList.toggle('reducao-animacoes', reducaoSalva);

    if (checkboxAltoContraste) {
        checkboxAltoContraste.checked = contrasteSalvo;
    }

    if (checkboxReducaoAnimacoes) {
        checkboxReducaoAnimacoes.checked = reducaoSalva;
    }

    if (rangeTamanhoTexto) {
        rangeTamanhoTexto.value = String(Math.min(22, Math.max(14, tamanhoTexto)));
        var saidaTexto = document.querySelector('[data-output="font-size"]');
        if (saidaTexto) {
            saidaTexto.textContent = rangeTamanhoTexto.value + 'px';
        }
        document.documentElement.style.setProperty('--font-size-base', rangeTamanhoTexto.value + 'px');
    }

    if (rangeVolume) {
        rangeVolume.value = String(Math.min(100, Math.max(0, volume)));
        var saidaVolume = document.querySelector('[data-output="volume"]');
        if (saidaVolume) {
            saidaVolume.textContent = rangeVolume.value + '%';
        }
    }

    atualizarTemaTexto();
}

if (toggleTema) {
    toggleTema.addEventListener('click', function() {
        var temaClaro = !document.body.classList.contains('tema-claro');
        aplicarTema(temaClaro);
    });
}

if (checkboxAltoContraste) {
    checkboxAltoContraste.addEventListener('change', function() {
        var ativo = this.checked;
        document.body.classList.toggle('alto-contraste', ativo);
        salvarLocalStorage('portfolioAltoContraste', String(ativo));
    });
}

if (checkboxReducaoAnimacoes) {
    checkboxReducaoAnimacoes.addEventListener('change', function() {
        var ativo = this.checked;
        document.body.classList.toggle('reducao-animacoes', ativo);
        salvarLocalStorage('portfolioReducaoAnimacoes', String(ativo));
    });
}

if (rangeTamanhoTexto) {
    rangeTamanhoTexto.addEventListener('input', function() {
        var valor = this.value;
        document.documentElement.style.setProperty('--font-size-base', valor + 'px');
        var saida = document.querySelector('[data-output="font-size"]');
        if (saida) {
            saida.textContent = valor + 'px';
        }
        salvarLocalStorage('portfolioTamanhoTexto', valor);
    });
}

if (rangeVolume) {
    rangeVolume.addEventListener('input', function() {
        var valor = this.value;
        var saida = document.querySelector('[data-output="volume"]');
        if (saida) {
            saida.textContent = valor + '%';
        }
        salvarLocalStorage('portfolioVolume', valor);
    });
}

if (botaoReset) {
    botaoReset.addEventListener('click', function() {
        aplicarTema(false);
        document.body.classList.remove('alto-contraste');
        document.body.classList.remove('reducao-animacoes');

        if (checkboxAltoContraste) {
            checkboxAltoContraste.checked = false;
        }
        if (checkboxReducaoAnimacoes) {
            checkboxReducaoAnimacoes.checked = false;
        }

        if (rangeTamanhoTexto) {
            rangeTamanhoTexto.value = '16';
            document.documentElement.style.setProperty('--font-size-base', '16px');
            var saidaTexto = document.querySelector('[data-output="font-size"]');
            if (saidaTexto) {
                saidaTexto.textContent = '16px';
            }
        }

        if (rangeVolume) {
            rangeVolume.value = '70';
            var saidaVolume = document.querySelector('[data-output="volume"]');
            if (saidaVolume) {
                saidaVolume.textContent = '70%';
            }
        }

        salvarLocalStorage('portfolioTema', 'escuro');
        salvarLocalStorage('portfolioAltoContraste', 'false');
        salvarLocalStorage('portfolioReducaoAnimacoes', 'false');
        salvarLocalStorage('portfolioTamanhoTexto', '16');
        salvarLocalStorage('portfolioVolume', '70');
    });
}

for (var i = 0; i < botoesVoltar.length; i++) {
    botoesVoltar[i].addEventListener('click', function() {
        window.location.href = 'index.html';
    });
}

aplicarAjustes();
