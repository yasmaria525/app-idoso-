// O tamanho padrão dos navegadores é 16px
let tamanhoFonteAtual = 16; 

function alterarFonte(valor) {
    const root = document.documentElement; // Pega a tag <html> em vez do <body>
    tamanhoFonteAtual += valor;
    
    // Limites de tamanho para não desconfigurar o site
    if (tamanhoFonteAtual < 12) tamanhoFonteAtual = 12;
    if (tamanhoFonteAtual > 26) tamanhoFonteAtual = 26;
    
    // Aplica na raiz. O Tailwind vai aumentar tudo proporcionalmente!
    root.style.fontSize = tamanhoFonteAtual + 'px';
}

function resetarFonte() {
    const root = document.documentElement;
    tamanhoFonteAtual = 16;
    root.style.fontSize = '16px';
}

// Alternar Alto Contraste
function alternarContraste() {
    const corpoDocumento = document.getElementById('app-body');
    corpoDocumento.classList.toggle('alto-contraste');
}

// Sistema de Leitura de Voz (Text-to-Speech)
let vozAtiva = null;

function falarTexto(texto) {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    const sintese = new SpeechSynthesisUtterance(texto);
    sintese.lang = 'pt-BR';
    sintese.rate = 0.9;
    window.speechSynthesis.speak(sintese);
}

function falarSecao(idSecao) {
    const secao = document.getElementById(idSecao);
    if (!secao) return;
    const titulo = secao.querySelector('h3').innerText;
    const paragrafos = Array.from(secao.querySelectorAll('p, li, h4')).map(el => el.innerText).join('. ');
    falarTexto(`${titulo}. ${paragrafos}`);
}

// Lógica do Quiz
let perguntaAtual = 1;

function responderQuiz(numeroPergunta, statusResposta, justificativa) {
    const feedbackContainer = document.getElementById('quiz-feedback');
    const feedbackText = document.getElementById('feedback-text');
    const feedbackIcon = document.getElementById('feedback-icon');
    const btnProximo = document.getElementById('btn-proximo');

    feedbackContainer.classList.remove('hidden');

    if (statusResposta === 'certo') {
        feedbackContainer.className = "mt-6 p-5 rounded-xl border-2 text-center space-y-4 bg-emerald-950/80 border-emerald-500 text-emerald-100";
        feedbackIcon.innerHTML = `<div class="bg-emerald-500 text-white p-3 rounded-full"><i data-lucide="check" class="w-10 h-10"></i></div>`;
        feedbackText.innerText = "Parabéns! Você acertou! " + justificativa;
        falarTexto("Parabéns! Você acertou! " + justificativa);
    } else {
        feedbackContainer.className = "mt-6 p-5 rounded-xl border-2 text-center space-y-4 bg-red-950/80 border-red-500 text-red-100";
        feedbackIcon.innerHTML = `<div class="bg-red-500 text-white p-3 rounded-full"><i data-lucide="x" class="w-10 h-10"></i></div>`;
        feedbackText.innerText = "Ops, quase lá! Veja por quê: " + justificativa;
        falarTexto("Ops, quase lá! Veja por quê: " + justificativa);
    }

    lucide.createIcons();

    if (numeroPergunta < 3) {
        btnProximo.innerText = "Ir para Próxima Situação";
        btnProximo.onclick = function() { avancarPergunta(numeroPergunta + 1); };
    } else {
        btnProximo.innerText = "Recomeçar Teste";
        btnProximo.onclick = function() { recomecarQuiz(); };
    }
}

function avancarPergunta(proxima) {
    document.getElementById(`pergunta-${perguntaAtual}`).classList.add('hidden');
    document.getElementById('quiz-feedback').classList.add('hidden');
    perguntaAtual = proxima;
    document.getElementById(`pergunta-${proxima}`).classList.remove('hidden');
    const textoPergunta = document.getElementById(`pergunta-${proxima}`).querySelector('h4').innerText;
    falarTexto(`Próxima situação: ${textoPergunta}`);
}

function recomecarQuiz() {
    document.getElementById(`pergunta-${perguntaAtual}`).classList.add('hidden');
    document.getElementById('quiz-feedback').classList.add('hidden');
    perguntaAtual = 1;
    document.getElementById('pergunta-1').classList.remove('hidden');
    falarTexto("Iniciando o teste de defesa novamente. Vamos à primeira situação.");
}

// Só desenha os ícones quando a página termina de carregar (Evita travamentos)
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
});