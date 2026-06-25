// Inicializa os ícones do Lucide
lucide.createIcons();

// Gerenciamento de Tamanho da Fonte
let tamanhoFonteAtual = 18; // Inicial em pixels para o corpo do texto principal

function alterarFonte(valor) {
    const corpoDocumento = document.getElementById('app-body');
    tamanhoFonteAtual += valor;
    if (tamanhoFonteAtual < 14) tamanhoFonteAtual = 14; // Limite mínimo
    if (tamanhoFonteAtual > 30) tamanhoFonteAtual = 30; // Limite máximo para evitar quebra extrema
    
    corpoDocumento.style.fontSize = tamanhoFonteAtual + 'px';
}

function resetarFonte() {
    const corpoDocumento = document.getElementById('app-body');
    tamanhoFonteAtual = 18;
    corpoDocumento.style.fontSize = '18px';
}

// Alternar Alto Contraste
function alternarContraste() {
    const corpoDocumento = document.getElementById('app-body');
    corpoDocumento.classList.toggle('alto-contraste');
}

// Sistema de Leitura de Voz (Text-to-Speech)
let vozAtiva = null;

function falarTexto(texto) {
    // Se já estiver falando, para a voz atual
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }

    // Cria o objeto de voz
    const sintese = new SpeechSynthesisUtterance(texto);
    sintese.lang = 'pt-BR';
    sintese.rate = 0.9; // Velocidade ligeiramente reduzida para facilitar a compreensão de idosos

    window.speechSynthesis.speak(sintese);
}

// Função para ler o conteúdo de uma seção inteira
function falarSecao(idSecao) {
    const secao = document.getElementById(idSecao);
    if (!secao) return;

    // Pega o título da seção
    const titulo = secao.querySelector('h3').innerText;
    
    // Pega todos os parágrafos relevantes de texto
    const paragrafos = Array.from(secao.querySelectorAll('p, li, h4')).map(el => el.innerText).join('. ');
    
    const textoCompleto = `${titulo}. ${paragrafos}`;
    falarTexto(textoCompleto);
}

// Lógica do Quiz / Treinamento
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

    // Atualiza ícones gerados dinamicamente no feedback
    lucide.createIcons();

    // Configuração do botão de avançar
    if (numeroPergunta < 3) {
        btnProximo.innerText = "Ir para Próxima Situação";
        btnProximo.onclick = function() {
            avancarPergunta(numeroPergunta + 1);
        };
    } else {
        btnProximo.innerText = "Recomeçar Teste";
        btnProximo.onclick = function() {
            recomecarQuiz();
        };
    }
}

function avancarPergunta(proxima) {
    // Oculta a pergunta anterior
    document.getElementById(`pergunta-${perguntaAtual}`).classList.add('hidden');
    document.getElementById('quiz-feedback').classList.add('hidden');

    // Mostra a nova
    perguntaAtual = proxima;
    document.getElementById(`pergunta-${proxima}`).classList.remove('hidden');
    
    // Lê a nova pergunta automaticamente
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