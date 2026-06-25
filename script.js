// Gerenciamento de Tamanho da Fonte (Base padrão do navegador é 16px)
let tamanhoFonteAtual = 16; 

function alterarFonte(valor) {
    tamanhoFonteAtual += valor;
    
    // Limites seguros para idosos não quebrarem o layout
    if (tamanhoFonteAtual < 12) tamanhoFonteAtual = 12; 
    if (tamanhoFonteAtual > 26) tamanhoFonteAtual = 26; 
    
    // Aplica diretamente na tag raiz <html>. Isso faz o Tailwind recalcular todos os tamanhos (rem)
    document.documentElement.style.fontSize = tamanhoFonteAtual + 'px';
}

function resetarFonte() {
    tamanhoFonteAtual = 16;
    document.documentElement.style.fontSize = '16px';
}

// Alternar Alto Contraste
function alternarContraste() {
    const corpoDocumento = document.getElementById('app-body');
    corpoDocumento.classList.toggle('alto-contraste');
}

// Funções do Novo Modal de Instruções
function abrirModal() {
    document.getElementById('modal-ajuda').classList.remove('hidden');
    // Lê as instruções do modal em voz alta de forma amigável
    falarTexto("Bem-vindo ao Guia Digital! Este site foi feito para ajudar você a navegar na internet com segurança. Se precisar, use o painel no topo para aumentar as letras ou ativar o modo preto e branco. Você também pode clicar nos botões ouvir para escutar os textos. Clique no botão verde no centro da tela para começar.");
}

function fecharModal() {
    document.getElementById('modal-ajuda').classList.add('hidden');
    // Para a voz do modal imediatamente ao fechar
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
}

// Sistema de Leitura de Voz (Text-to-Speech)
function falarTexto(texto) {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }

    const sintese = new SpeechSynthesisUtterance(texto);
    sintese.lang = 'pt-BR';
    sintese.rate = 0.85; // Velocidade ligeiramente reduzida para facilitar a compreensão de idosos

    window.speechSynthesis.speak(sintese);
}

function falarSecao(idSecao) {
    const secao = document.getElementById(idSecao);
    if (!secao) return;

    const titulo = secao.querySelector('h3').innerText;
    const paragrafos = Array.from(secao.querySelectorAll('p, li, h4')).map(el => el.innerText).join('. ');
    
    falarTexto(`${titulo}. ${paragrafos}`);
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

    lucide.createIcons();

    if (numeroPergunta < 3) {
        btnProximo.innerHTML = '<span>Ir para Próxima Situação</span><i data-lucide="arrow-right" class="w-5 h-5"></i>';
        btnProximo.onclick = function() {
            avancarPergunta(numeroPergunta + 1);
        };
    } else {
        btnProximo.innerHTML = '<span>Recomeçar Teste</span><i data-lucide="rotate-ccw" class="w-5 h-5"></i>';
        btnProximo.onclick = function() {
            recomecarQuiz();
        };
    }
    lucide.createIcons();
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

// Quando carregar a página completa: desenha ícones e abre o Modal de Ajuda
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    abrirModal();
});