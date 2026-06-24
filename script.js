/* ===========================================================
   JÚNIOR MANUTENÇÕES DE CELULARES — SCRIPT
   Contém: lógica do assistente virtual "Juninho".
   =========================================================== */

(function () {
    'use strict';

    /* ----------------------------------------------------------
       Dados do negócio (fáceis de editar / manter atualizados)
       ---------------------------------------------------------- */
    const NEGOCIO = {
        whatsapp: '5519999440013',
        telefone: '(19) 99944-0013',
        mapsLink: 'https://maps.app.goo.gl/HY1dgPxmiNvggXCW6',
        endereco: 'Piracicaba, São Paulo',
    };

    function linkWhats(msg) {
        return `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(msg)}`;
    }

    /* ----------------------------------------------------------
       Base de respostas do Juninho
       Cada item: palavras-chave -> resposta + (opcional) chips
       ---------------------------------------------------------- */
    const BASE_RESPOSTAS = [
        {
            chaves: ['tela', 'vidro', 'display', 'quebr', 'trinc'],
            resposta:
                'Trocamos telas/vidros de praticamente todos os modelos! O valor da troca de vidro começa em <strong>R$ 100,00</strong>, podendo variar conforme o modelo do aparelho. Quer um orçamento exato pro seu celular?',
            chips: ['Pedir orçamento', 'Quais marcas atendem?'],
        },
        {
            chaves: ['bateria', 'carregador', 'não carrega', 'nao carrega', 'descarrega'],
            resposta:
                'Fazemos troca de bateria com garantia e também resolvemos problemas de carregador (pino, cabo ou placa de carga). Me diga a marca/modelo do seu celular que eu já te oriento melhor.',
            chips: ['Pedir orçamento', 'Quanto tempo demora?'],
        },
        {
            chaves: ['preço', 'preco', 'valor', 'quanto custa', 'orçamento', 'orcamento'],
            resposta:
                'Os valores variam de acordo com o modelo do aparelho e o tipo de serviço. A troca de vidro, por exemplo, começa em <strong>R$ 100,00</strong>. Pra te passar um valor certinho, o ideal é falar direto com a gente no WhatsApp e mandar o modelo do celular.',
            chips: ['Chamar no WhatsApp', 'Quais serviços fazem?'],
        },
        {
            chaves: ['demora', 'tempo', 'prazo', 'quanto tempo'],
            resposta:
                'Na maioria dos casos o conserto é feito no <strong>mesmo dia</strong>! O prazo exato depende da peça e do problema, mas a gente sempre informa antes de começar o serviço.',
            chips: ['Pedir orçamento', 'Endereço da loja'],
        },
        {
            chaves: ['endereço', 'endereco', 'localiz', 'onde fica', 'mapa', 'maps', 'fica onde'],
            resposta: `Estamos localizados em ${NEGOCIO.endereco}. Você pode ver a localização exata e como chegar pelo Google Maps:<br><a href="${NEGOCIO.mapsLink}" target="_blank" rel="noopener">📍 Ver no Google Maps</a>`,
            chips: ['Avaliar no Google', 'Chamar no WhatsApp'],
        },
        {
            chaves: ['avali', 'review', 'nota', 'estrela', 'opini'],
            resposta:
                'Ficamos muito felizes com o carinho dos nossos clientes! Se você já foi atendido por nós e quer deixar sua opinião, é rapidinho pelo Google:<br><a href="' +
                NEGOCIO.mapsLink +
                '" target="_blank" rel="noopener">⭐ Avaliar no Google Maps</a>',
            chips: ['Chamar no WhatsApp', 'Quais serviços fazem?'],
        },
        {
            chaves: ['horário', 'horario', 'aberto', 'funciona', 'fecha'],
            resposta:
                'Pra confirmar o horário de funcionamento de hoje, o mais rápido é chamar a gente no WhatsApp — assim você já garante que tem alguém disponível pra te atender.',
            chips: ['Chamar no WhatsApp', 'Endereço da loja'],
        },
        {
            chaves: ['software', 'travando', 'trava', 'lento', 'lenta', 'formatar', 'app', 'aplicativo', 'sistema'],
            resposta:
                'Resolvemos também problemas de software: celular lento, travando, apps com erro, formatação e configuração geral. Me conta um pouco mais sobre o que está acontecendo com o seu aparelho.',
            chips: ['Pedir orçamento', 'Chamar no WhatsApp'],
        },
        {
            chaves: ['molhou', 'água', 'agua', 'caiu na água', 'caiu na agua', 'umidade'],
            resposta:
                'Celular que pegou água precisa de atenção rápida! Desligue o aparelho, não tente carregar e traga o quanto antes pra avaliarmos os danos. Quer já chamar no WhatsApp pra agilizar?',
            chips: ['Chamar no WhatsApp', 'Endereço da loja'],
        },
        {
            chaves: ['garantia'],
            resposta:
                'Trabalhamos com peças originais e de primeira linha, e os nossos serviços contam com garantia. As condições específicas variam por tipo de serviço — posso te conectar com o time pra confirmar os detalhes do seu caso?',
            chips: ['Chamar no WhatsApp', 'Quais serviços fazem?'],
        },
        {
            chaves: ['serviç', 'servic', 'o que faz', 'o que vc', 'o que voce', 'conserta'],
            resposta:
                'Fazemos: <br>📱 Troca de tela/vidro<br>🔋 Troca de bateria e carregador<br>🔧 Reparo de hardware e software<br>💧 Avaliação de aparelhos com dano por líquido<br><br>Quer saber mais sobre algum desses serviços?',
            chips: ['Pedir orçamento', 'Chamar no WhatsApp'],
        },
        {
            chaves: ['obrigad', 'obrigado', 'obrigada', 'valeu', 'agradeç'],
            resposta: 'Eu que agradeço! 😊 Qualquer outra dúvida, é só me chamar por aqui. Estou sempre por aqui pra ajudar!',
            chips: ['Chamar no WhatsApp', 'Avaliar no Google'],
        },
        {
            chaves: ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'eae', 'opa'],
            resposta:
                'Olá! 👋 Eu sou o <strong>Juninho</strong>, assistente virtual da Júnior Manutenções de Celulares. Posso te ajudar com informações sobre serviços, preços, prazos ou te direcionar pro nosso atendimento humano. O que você precisa?',
            chips: ['Pedir orçamento', 'Quais serviços fazem?', 'Chamar no WhatsApp'],
        },
    ];

    const RESPOSTA_PADRAO = {
        resposta:
            'Não tenho certeza se entendi sua dúvida, mas não se preocupe — posso te conectar direto com o nosso time no WhatsApp, que vai te ajudar com qualquer detalhe específico do seu caso.',
        chips: ['Chamar no WhatsApp', 'Quais serviços fazem?', 'Pedir orçamento'],
    };

    // Ações que abrem links diretos em vez de respostas de texto puro
    const ACOES_CHIP = {
        'Chamar no WhatsApp': () => {
            window.open(linkWhats('Olá! Vim através do site e gostaria de mais informações.'), '_blank');
            return 'Perfeito! Abri o WhatsApp pra você falar direto com a gente. 📲';
        },
        'Avaliar no Google': () => {
            window.open(NEGOCIO.mapsLink, '_blank');
            return 'Que ótimo! Abri a página de avaliações no Google Maps. Muito obrigado por compartilhar sua experiência! ⭐';
        },
        'Pedir orçamento': () => {
            window.open(linkWhats('Olá! Gostaria de pedir um orçamento para o conserto do meu celular.'), '_blank');
            return 'Show! Abri o WhatsApp com uma mensagem pronta pra você só completar com o modelo do seu celular e o problema. 🔧';
        },
        'Endereço da loja': () => {
            window.open(NEGOCIO.mapsLink, '_blank');
            return `Estamos em ${NEGOCIO.endereco}. Abri o mapa pra você ver a localização exata e a rota até aqui. 📍`;
        },
        'Quais serviços fazem?': () => findResposta('serviços'),
        'Quanto tempo demora?': () => findResposta('quanto tempo demora'),
        'Quais marcas atendem?': () =>
            'Atendemos praticamente todas as marcas: Samsung, Motorola, iPhone/Apple, Xiaomi, LG e outras. Me diga o modelo do seu aparelho que eu confirmo com você!',
    };

    function findResposta(textoOriginal) {
        const texto = textoOriginal.toLowerCase();
        for (const item of BASE_RESPOSTAS) {
            if (item.chaves.some((chave) => texto.includes(chave))) {
                return item.resposta;
            }
        }
        return null;
    }

    /* ----------------------------------------------------------
       Construção da UI do widget (gerada via JS para não poluir
       o HTML principal e facilitar reaproveitamento)
       ---------------------------------------------------------- */
    function criarWidget() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <button class="juninho-button" id="juninhoToggle" aria-label="Abrir assistente virtual Juninho" aria-expanded="false">
                <span class="juninho-pulse" aria-hidden="true"></span>
                <img src="conversacao.png" alt="">
                <span class="juninho-badge" id="juninhoBadge">1</span>
            </button>

            <div class="juninho-window" id="juninhoWindow" role="dialog" aria-label="Chat com Juninho, assistente virtual">
                <div class="juninho-header">
                    <div class="juninho-avatar">🤖</div>
                    <div class="juninho-header-info">
                        <strong>Juninho</strong>
                        <span><span class="juninho-status-dot" aria-hidden="true"></span> Assistente virtual • online</span>
                    </div>
                    <button class="juninho-close" id="juninhoClose" aria-label="Fechar chat">✕</button>
                </div>

                <div class="juninho-messages" id="juninhoMessages"></div>

                <div class="juninho-quick-replies" id="juninhoChips"></div>

                <div class="juninho-input-row">
                    <input type="text" id="juninhoInput" placeholder="Digite sua dúvida..." autocomplete="off" maxlength="200">
                    <button class="juninho-send" id="juninhoSend" aria-label="Enviar mensagem">➤</button>
                </div>
            </div>
        `;
        document.body.appendChild(wrapper);
    }

    function scrollToBottom(container) {
        container.scrollTop = container.scrollHeight;
    }

    function addMensagem(texto, autor) {
        const container = document.getElementById('juninhoMessages');
        const bubble = document.createElement('div');
        bubble.className = `juninho-msg ${autor}`;
        bubble.innerHTML = texto;
        container.appendChild(bubble);
        scrollToBottom(container);
    }

    function mostrarDigitando() {
        const container = document.getElementById('juninhoMessages');
        const typing = document.createElement('div');
        typing.className = 'juninho-typing';
        typing.id = 'juninhoTypingIndicator';
        typing.innerHTML = '<span></span><span></span><span></span>';
        container.appendChild(typing);
        scrollToBottom(container);
    }

    function removerDigitando() {
        const typing = document.getElementById('juninhoTypingIndicator');
        if (typing) typing.remove();
    }

    function setChips(lista) {
        const chipContainer = document.getElementById('juninhoChips');
        chipContainer.innerHTML = '';
        lista.forEach((label) => {
            const chip = document.createElement('button');
            chip.className = 'juninho-chip';
            chip.type = 'button';
            chip.textContent = label;
            chip.addEventListener('click', () => handleEntradaUsuario(label));
            chipContainer.appendChild(chip);
        });
    }

    function responderComo(textoUsuario) {
        // Se for um chip de ação direta (abre link), executa a ação
        if (ACOES_CHIP[textoUsuario]) {
            const resultado = ACOES_CHIP[textoUsuario]();
            // Ações podem retornar string (mensagem) ou null (delegado a findResposta)
            if (typeof resultado === 'string') return resultado;
        }
        const resposta = findResposta(textoUsuario);
        return resposta || RESPOSTA_PADRAO.resposta;
    }

    function handleEntradaUsuario(texto) {
        const limpo = texto.trim();
        if (!limpo) return;

        addMensagem(escapeHTML(limpo), 'user');
        setChips([]);

        mostrarDigitando();

        const delay = 500 + Math.random() * 400;
        setTimeout(() => {
            removerDigitando();
            const resposta = responderComo(limpo);
            addMensagem(resposta, 'bot');

            // Sugere chips relacionados ao último tema reconhecido, senão usa os padrões
            const itemRelacionado = BASE_RESPOSTAS.find((item) =>
                item.chaves.some((chave) => limpo.toLowerCase().includes(chave))
            );
            setChips(itemRelacionado ? itemRelacionado.chips : RESPOSTA_PADRAO.chips);
        }, delay);
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function abrirChat() {
        const win = document.getElementById('juninhoWindow');
        const toggle = document.getElementById('juninhoToggle');
        const badge = document.getElementById('juninhoBadge');
        win.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
        if (badge) badge.style.display = 'none';
        document.getElementById('juninhoInput').focus();
    }

    function fecharChat() {
        const win = document.getElementById('juninhoWindow');
        const toggle = document.getElementById('juninhoToggle');
        win.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    }

    function inicializarEventos() {
        const toggle = document.getElementById('juninhoToggle');
        const closeBtn = document.getElementById('juninhoClose');
        const sendBtn = document.getElementById('juninhoSend');
        const input = document.getElementById('juninhoInput');

        toggle.addEventListener('click', () => {
            const win = document.getElementById('juninhoWindow');
            win.classList.contains('open') ? fecharChat() : abrirChat();
        });

        closeBtn.addEventListener('click', fecharChat);

        sendBtn.addEventListener('click', () => {
            if (input.value.trim()) {
                handleEntradaUsuario(input.value);
                input.value = '';
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (input.value.trim()) {
                    handleEntradaUsuario(input.value);
                    input.value = '';
                }
            }
        });

        // Fecha com Esc
        document.addEventListener('keydown', (e) => {
            const win = document.getElementById('juninhoWindow');
            if (e.key === 'Escape' && win.classList.contains('open')) {
                fecharChat();
            }
        });
    }

    function mensagemBoasVindas() {
        addMensagem(
            'Olá! 👋 Eu sou o <strong>Juninho</strong>, assistente virtual da Júnior Manutenções de Celulares. Posso te ajudar a tirar dúvidas sobre serviços, preços, prazos e muito mais. Como posso ajudar?',
            'bot'
        );
        setChips(['Pedir orçamento', 'Quais serviços fazem?', 'Endereço da loja', 'Avaliar no Google']);
    }

    function iniciar() {
        criarWidget();
        inicializarEventos();
        mensagemBoasVindas();
        verificarVideo();
    }

    // Mostra o aviso "vídeo em breve" caso o arquivo video-junior.mp4 não exista na pasta
    function verificarVideo() {
        const video = document.getElementById('videoJunior');
        const fallback = document.getElementById('videoFallback');
        if (!video || !fallback) return;

        const ativarFallback = () => {
            video.style.display = 'none';
            fallback.style.display = 'flex';
        };

        video.addEventListener('error', ativarFallback);
        const source = video.querySelector('source');
        if (source) source.addEventListener('error', ativarFallback);

        // Se depois de carregar os metadados a duração for inválida, também cai no fallback
        video.addEventListener('loadedmetadata', () => {
            if (!isFinite(video.duration) || video.duration === 0) ativarFallback();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }
})();
