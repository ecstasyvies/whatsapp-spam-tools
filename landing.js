"use strict";

const scripts = {
  fig: `"use strict";

(() => {
  const VERSAO = "2.0.0";

  const CONFIG = {
    quantidade: 30,
    delayMin: 2200,
    delayMax: 6500,
  };

  const SELETORES = {
    painelEmoji: [
      'button[aria-label="Emojis"]',
      'button[aria-label*="Emoji"]',
      'button[aria-label*="emoji"]',
      '[data-testid="emoji-button"]',
    ],
    painelEmojiIcone: [
      'span[data-icon="emoji"]',
      'span[data-icon="sticker"]',
    ],
    chatPrincipal: "#main",
    cabecalhoChat: "#main header",
  };

  const verificarCompatibilidade = () => {
    const chatPrincipal = document.querySelector(SELETORES.chatPrincipal);
    if (!chatPrincipal) return false;
    const cabecalho = document.querySelector(SELETORES.cabecalhoChat);
    if (!cabecalho) return false;
    const urlAtual = window.location.hostname;
    if (!urlAtual.includes("web.whatsapp.com")) return false;
    return true;
  };

  const encerrarPorIncompatibilidade = (motivo) => {
    running = false;
    if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
    document.removeEventListener("click", captureHandler, true);
    console.error("%c⛔ INTERFACE NÃO RECONHECIDA", "color: #ff4444; font-weight: bold; font-size: 15px;");
    console.error(\`%c\${motivo}\`, "color: #ff8800; font-weight: bold;");
    console.error("%cO WhatsApp Web pode ter atualizado sua interface. Não tente novamente — atualize o script em: https://github.com/ecstasyvies/whatsapp-spam-tools", "color: #ffcc00;");
  };

  let stickerSelector = null;
  let targetChat = null;
  let enviadas = 0;
  let running = true;
  let timeoutId = null;

  console.log(\`%c🚀 SpamFigZap v\${VERSAO} carregado!\`, "color: cyan; font-weight: bold");

  if (!verificarCompatibilidade()) {
    encerrarPorIncompatibilidade("A página atual não é o WhatsApp Web ou os elementos essenciais não foram encontrados.");
    return;
  }

  console.log("✅ Interface reconhecida. Clique na figurinha que deseja enviar.");
  console.log("🎮 Para parar a qualquer momento, digite: parar()");

  const getPanelSticker = () => {
    if (!stickerSelector) return null;
    const todos = document.querySelectorAll(stickerSelector);
    return Array.from(todos).find((img) => {
      if (!img || !img.isConnected) return false;
      const rect = img.getBoundingClientRect();
      return !img.closest("#main") && rect.width > 20 && rect.height > 20;
    });
  };

  const isPanelOpen = () => getPanelSticker() !== null;

  const findPanelButton = () => {
    for (const seletor of SELETORES.painelEmoji) {
      const btn = document.querySelector(seletor);
      if (btn) return btn;
    }
    for (const seletor of SELETORES.painelEmojiIcone) {
      const icone = document.querySelector(seletor);
      const btn = icone?.closest('button, div[role="button"]');
      if (btn) return btn;
    }
    return null;
  };

  const recoverAndClick = (callback) => {
    if (isPanelOpen()) {
      const sticker = getPanelSticker();
      if (sticker) {
        sticker.click();
        enviadas++;
        console.log(\`📤 Clique realizado [\${enviadas}/\${CONFIG.quantidade}] (painel aberto)\`);
        callback(true);
        return;
      }
    }

    console.log("🔄 Painel fechado — tentando reabrir...");
    const btnPainel = findPanelButton();

    if (!btnPainel) {
      console.warn("⚠️ Botão do painel de figurinhas não encontrado durante recuperação.");
      callback(false);
      return;
    }

    btnPainel.click();

    setTimeout(() => {
      const sticker = getPanelSticker();
      if (sticker) {
        sticker.click();
        enviadas++;
        console.log(\`📤 Clique realizado [\${enviadas}/\${CONFIG.quantidade}] (recuperação 1)\`);
        callback(true);
        return;
      }
      setTimeout(() => {
        const stickerFinal = getPanelSticker();
        if (stickerFinal) {
          stickerFinal.click();
          enviadas++;
          console.log(\`📤 Clique realizado [\${enviadas}/\${CONFIG.quantidade}] (recuperação 2)\`);
          callback(true);
        } else {
          console.warn("⚠️ Figurinha não encontrada mesmo após reabrir o painel.");
          callback(false);
        }
      }, 900);
    }, 1600);
  };

  const captureHandler = (e) => {
    if (!running) return;

    const cabecalho = document.querySelector(SELETORES.cabecalhoChat);
    if (!cabecalho) {
      encerrarPorIncompatibilidade("O cabeçalho da conversa não foi encontrado ao capturar a figurinha.");
      return;
    }

    targetChat = cabecalho.innerText.split("\\n")[0];

    const img =
      e.target.closest("img") ||
      e.target.querySelector("img") ||
      (e.target.tagName === "IMG" ? e.target : null);

    if (img && img.src) {
      stickerSelector = \`img[src="\${img.src}"]\`;
    } else {
      console.error("❌ Não consegui identificar a figurinha clicada. Tente novamente.");
      return;
    }

    document.removeEventListener("click", captureHandler, true);
    enviadas = 1;
    console.log(\`📤 Clique inicial registrado. Iniciando sequência de \${CONFIG.quantidade} envios...\`);
    startSpam();
  };

  const startSpam = () => {
    const sendNext = () => {
      if (!running) return;

      if (enviadas >= CONFIG.quantidade) {
        console.log("%c✅ Concluído!", "color: lime; font-weight: bold");
        console.log(\`Total de cliques registrados: \${enviadas}/\${CONFIG.quantidade}\`);
        return;
      }

      if (!verificarCompatibilidade()) {
        encerrarPorIncompatibilidade("Os elementos essenciais do WhatsApp Web desapareceram durante a execução.");
        return;
      }

      const cabecalhoAtual = document.querySelector(SELETORES.cabecalhoChat);
      const chatAtual = cabecalhoAtual ? cabecalhoAtual.innerText.split("\\n")[0] : null;

      if (targetChat && chatAtual !== targetChat) {
        window.parar();
        console.error("%c🛡️ SEGURANÇA: Conversa alterada — script interrompido para evitar envio no local errado.", "color: orange; font-weight: bold; font-size: 14px;");
        return;
      }

      const sticker = getPanelSticker();
      if (sticker) {
        sticker.click();
        enviadas++;
        console.log(\`📤 Clique realizado [\${enviadas}/\${CONFIG.quantidade}]\`);
        agendarProximo();
      } else {
        recoverAndClick((sucesso) => {
          if (!sucesso) console.warn("⚠️ Tentativa de recuperação falhou. Aguardando próximo ciclo...");
          if (running) agendarProximo();
        });
      }
    };

    const agendarProximo = () => {
      if (!running) return;
      const delay = Math.floor(Math.random() * (CONFIG.delayMax - CONFIG.delayMin + 1)) + CONFIG.delayMin;
      timeoutId = setTimeout(sendNext, delay);
    };

    const delayInicial = Math.floor(Math.random() * (CONFIG.delayMax - CONFIG.delayMin + 1)) + CONFIG.delayMin;
    timeoutId = setTimeout(sendNext, delayInicial);
  };

  document.addEventListener("click", captureHandler, true);

  window.parar = () => {
    running = false;
    if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
    document.removeEventListener("click", captureHandler, true);
    console.log("%c⛔ Script parado.", "color: red; font-weight: bold");
  };
})();`,

  texto: `"use strict";

(() => {
  const VERSAO = "2.0.0";

  const CONFIG = {
    mensagens: [
      "Primeira linha do seu roteiro ou texto personalizado",
      "Segunda linha aqui",
      "Terceira linha aqui",
    ],
    delayMin: 450,
    delayMax: 950,
    maxTentativasPorMensagem: 3,
    modoSeguro: true,
  };

  const SELETORES = {
    chatPrincipal: "#main",
    chatAlternativo: '[data-testid="chat"]',
    campoTexto: 'div[contenteditable="true"][role="textbox"]',
    campoTextoFallback: 'div[contenteditable="true"]',
    botaoEnviar: '[data-testid="send"]',
    botaoEnviarPt: 'button[aria-label="Enviar"]',
    botaoEnviarEn: 'button[aria-label="Send"]',
    botaoEnviarIcone: 'button span[data-icon="send"]',
    cabecalhoChat: "#main header",
  };

  const verificarCompatibilidade = () => {
    const urlAtual = window.location.hostname;
    if (!urlAtual.includes("web.whatsapp.com")) return false;
    const chatPrincipal = document.querySelector(SELETORES.chatPrincipal) || document.querySelector(SELETORES.chatAlternativo);
    if (!chatPrincipal) return false;
    const cabecalho = document.querySelector(SELETORES.cabecalhoChat);
    if (!cabecalho) return false;
    const campo = chatPrincipal.querySelector(SELETORES.campoTexto);
    if (!campo) return false;
    return true;
  };

  const encerrarPorIncompatibilidade = (motivo) => {
    running = false;
    if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
    console.error("%c⛔ INTERFACE NÃO RECONHECIDA", "color: #ff4444; font-weight: bold; font-size: 15px;");
    console.error(\`%c\${motivo}\`, "color: #ff8800; font-weight: bold;");
    console.error("%cO WhatsApp Web pode ter atualizado sua interface. Não tente novamente — atualize o script em: https://github.com/ecstasyvies/whatsapp-spam-tools", "color: #ffcc00;");
  };

  if (!CONFIG.mensagens || CONFIG.mensagens.length === 0) {
    console.error("%c❌ A lista de mensagens está vazia. Adicione pelo menos uma mensagem no CONFIG.mensagens antes de executar.", "color: red; font-weight: bold");
    return;
  }

  let enviadas = 0;
  let running = true;
  let timeoutId = null;
  const totalMensagens = CONFIG.mensagens.length;

  console.log(\`%c🚀 SpamText v\${VERSAO} carregado!\`, "color: #00ff00; font-weight: bold");
  console.log(\`📋 Mensagens na fila: \${totalMensagens}\`);

  if (!verificarCompatibilidade()) {
    encerrarPorIncompatibilidade("A página atual não é o WhatsApp Web ou os elementos essenciais (conversa aberta, campo de texto) não foram encontrados.");
    return;
  }

  const cabecalhoInicial = document.querySelector(SELETORES.cabecalhoChat);
  const targetChat = cabecalhoInicial ? cabecalhoInicial.innerText.split("\\n")[0] : null;

  console.log("✅ Interface reconhecida. Iniciando em 1 segundo...");
  console.log("🎮 Para parar a qualquer momento, digite: parar()");

  const localizarElementos = () => {
    const chat = document.querySelector(SELETORES.chatPrincipal) || document.querySelector(SELETORES.chatAlternativo);
    if (!chat) throw new Error("INCOMPATIBILIDADE: contêiner principal da conversa não encontrado");

    const campo = chat.querySelector(SELETORES.campoTexto) || chat.querySelector(SELETORES.campoTextoFallback);
    const botao =
      chat.querySelector(SELETORES.botaoEnviar) ||
      chat.querySelector(SELETORES.botaoEnviarPt) ||
      chat.querySelector(SELETORES.botaoEnviarEn) ||
      chat.querySelector(SELETORES.botaoEnviarIcone)?.closest("button");

    return { chat, campo, botao };
  };

  const inserirTexto = (campo, texto) => {
    campo.focus();
    document.execCommand("selectAll", false, null);
    document.execCommand("delete", false, null);
    document.execCommand("insertText", false, texto);
    campo.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
    campo.dispatchEvent(new InputEvent("compositionend", { bubbles: true, composed: true }));
    campo.dispatchEvent(new Event("input", { bubbles: true }));
    campo.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const enviarMensagemComRetry = async (texto, tentativa = 1) => {
    const { campo, botao } = localizarElementos();
    if (!campo) throw new Error("INCOMPATIBILIDADE: campo de texto não encontrado");

    inserirTexto(campo, texto);
    await new Promise((r) => setTimeout(r, 220));

    if (botao && botao.offsetParent !== null && !botao.disabled) {
      botao.click();
      return true;
    }

    if (CONFIG.modoSeguro) {
      const enter = new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true, cancelable: true, keyCode: 13, which: 13 });
      campo.dispatchEvent(enter);
      campo.dispatchEvent(new KeyboardEvent("keypress", { ...enter }));
      campo.dispatchEvent(new KeyboardEvent("keyup", { ...enter }));
      return true;
    }

    if (tentativa < CONFIG.maxTentativasPorMensagem) {
      await new Promise((r) => setTimeout(r, 400));
      return enviarMensagemComRetry(texto, tentativa + 1);
    }

    throw new Error("Botão de envio não disponível após várias tentativas");
  };

  const startSpam = () => {
    const sendNext = async () => {
      if (!running) return;

      if (enviadas >= totalMensagens) {
        console.log("%c✅ Todas as mensagens foram enviadas!", "color: lime; font-weight: bold");
        console.log(\`Total enviado: \${enviadas}/\${totalMensagens}\`);
        return;
      }

      const cabecalhoAtual = document.querySelector(SELETORES.cabecalhoChat);
      const chatAtual = cabecalhoAtual ? cabecalhoAtual.innerText.split("\\n")[0] : null;

      if (targetChat && chatAtual !== targetChat) {
        window.parar();
        console.error("%c🛡️ SEGURANÇA: Conversa alterada — script interrompido para evitar envio no local errado.", "color: orange; font-weight: bold; font-size: 14px;");
        return;
      }

      const msg = CONFIG.mensagens[enviadas];

      try {
        await enviarMensagemComRetry(msg);
        enviadas++;
        const progresso = Math.round((enviadas / totalMensagens) * 100);
        console.log(\`📤 [\${enviadas}/\${totalMensagens}] \${progresso}% — \${msg.substring(0, 60)}\${msg.length > 60 ? "..." : ""}\`);
      } catch (e) {
        if (e.message.startsWith("INCOMPATIBILIDADE:")) {
          encerrarPorIncompatibilidade(\`Elemento essencial desapareceu durante a execução: \${e.message.replace("INCOMPATIBILIDADE: ", "")}\`);
          return;
        }
        console.error(\`❌ Erro ao enviar mensagem \${enviadas + 1}: \${e.message}\`);
        running = false;
        return;
      }

      const delay = Math.floor(Math.random() * (CONFIG.delayMax - CONFIG.delayMin + 1)) + CONFIG.delayMin;
      timeoutId = setTimeout(sendNext, delay);
    };

    timeoutId = setTimeout(sendNext, 1000);
  };

  window.parar = () => {
    running = false;
    if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
    console.log("%c⛔ Script parado.", "color: red; font-weight: bold");
  };

  startSpam();
})();`,
};

const copiarParaTransferencia = (texto, elementoOrigem) => {
  navigator.clipboard.writeText(texto).then(() => {
    const textoOriginal = elementoOrigem.innerText;
    elementoOrigem.innerText = "Copiado!";
    elementoOrigem.style.background = "var(--primaria)";
    elementoOrigem.style.color = "#000";

    setTimeout(() => {
      elementoOrigem.innerText = textoOriginal;
      elementoOrigem.style.background = "";
      elementoOrigem.style.color = "";
    }, 2000);
  });
};

window.copiarScript = (tipo) => {
  const botao = event.currentTarget;
  copiarParaTransferencia(scripts[tipo], botao);
};

const configurarAnimacoes = () => {
  const opcoesObservador = {
    threshold: 0.15,
    rootMargin: "0px",
  };

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        const elemento = entrada.target;
        elemento.style.opacity = "1";
        elemento.style.transform = "translateY(0)";
        observador.unobserve(elemento);
      }
    });
  }, opcoesObservador);

  document.querySelectorAll("[data-ao-rolar]").forEach((cartao) => {
    cartao.style.opacity = "0";
    cartao.style.transform = "translateY(40px)";
    cartao.style.transition = "all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)";
    observador.observe(cartao);
  });
};

document.addEventListener("DOMContentLoaded", configurarAnimacoes);
