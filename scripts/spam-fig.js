"use strict";

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
    painelEmojiIcone: ['span[data-icon="emoji"]', 'span[data-icon="sticker"]'],
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
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    document.removeEventListener("click", captureHandler, true);
    console.error(
      "%c⛔ INTERFACE NÃO RECONHECIDA",
      "color: #ff4444; font-weight: bold; font-size: 15px;",
    );
    console.error(`%c${motivo}`, "color: #ff8800; font-weight: bold;");
    console.error(
      "%cO WhatsApp Web pode ter atualizado sua interface. Não tente novamente — atualize o script em: https://github.com/ecstasyvies/whatsapp-spam-tools",
      "color: #ffcc00;",
    );
  };

  let stickerSelector = null;
  let targetChat = null;
  let enviadas = 0;
  let running = true;
  let timeoutId = null;

  console.log(
    `%c🚀 SpamFigZap v${VERSAO} carregado!`,
    "color: cyan; font-weight: bold",
  );

  if (!verificarCompatibilidade()) {
    encerrarPorIncompatibilidade(
      "A página atual não é o WhatsApp Web ou os elementos essenciais não foram encontrados.",
    );
    return;
  }

  console.log(
    "✅ Interface reconhecida. Clique na figurinha que deseja enviar.",
  );
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
        console.log(
          `📤 Clique realizado [${enviadas}/${CONFIG.quantidade}] (painel aberto)`,
        );
        callback(true);
        return;
      }
    }

    console.log("🔄 Painel fechado — tentando reabrir...");
    const btnPainel = findPanelButton();

    if (!btnPainel) {
      console.warn(
        "⚠️ Botão do painel de figurinhas não encontrado durante recuperação.",
      );
      callback(false);
      return;
    }

    btnPainel.click();

    setTimeout(() => {
      const sticker = getPanelSticker();
      if (sticker) {
        sticker.click();
        enviadas++;
        console.log(
          `📤 Clique realizado [${enviadas}/${CONFIG.quantidade}] (recuperação 1)`,
        );
        callback(true);
        return;
      }

      setTimeout(() => {
        const stickerFinal = getPanelSticker();
        if (stickerFinal) {
          stickerFinal.click();
          enviadas++;
          console.log(
            `📤 Clique realizado [${enviadas}/${CONFIG.quantidade}] (recuperação 2)`,
          );
          callback(true);
        } else {
          console.warn(
            "⚠️ Figurinha não encontrada mesmo após reabrir o painel.",
          );
          callback(false);
        }
      }, 900);
    }, 1600);
  };

  const captureHandler = (e) => {
    if (!running) return;

    const cabecalho = document.querySelector(SELETORES.cabecalhoChat);
    if (!cabecalho) {
      encerrarPorIncompatibilidade(
        "O cabeçalho da conversa não foi encontrado ao capturar a figurinha.",
      );
      return;
    }

    targetChat = cabecalho.innerText.split("\n")[0];

    const img =
      e.target.closest("img") ||
      e.target.querySelector("img") ||
      (e.target.tagName === "IMG" ? e.target : null);

    if (img && img.src) {
      stickerSelector = `img[src="${img.src}"]`;
    } else {
      console.error(
        "❌ Não consegui identificar a figurinha clicada. Tente novamente.",
      );
      return;
    }

    document.removeEventListener("click", captureHandler, true);

    enviadas = 1;
    console.log(
      `📤 Clique inicial registrado. Iniciando sequência de ${CONFIG.quantidade} envios...`,
    );
    startSpam();
  };

  const startSpam = () => {
    const sendNext = () => {
      if (!running) return;

      if (enviadas >= CONFIG.quantidade) {
        console.log("%c✅ Concluído!", "color: lime; font-weight: bold");
        console.log(
          `Total de cliques registrados: ${enviadas}/${CONFIG.quantidade}`,
        );
        return;
      }

      if (!verificarCompatibilidade()) {
        encerrarPorIncompatibilidade(
          "Os elementos essenciais do WhatsApp Web desapareceram durante a execução.",
        );
        return;
      }

      const cabecalhoAtual = document.querySelector(SELETORES.cabecalhoChat);
      const chatAtual = cabecalhoAtual
        ? cabecalhoAtual.innerText.split("\n")[0]
        : null;

      if (targetChat && chatAtual !== targetChat) {
        window.parar();
        console.error(
          "%c🛡️ SEGURANÇA: Conversa alterada — script interrompido para evitar envio no local errado.",
          "color: orange; font-weight: bold; font-size: 14px;",
        );
        return;
      }

      const sticker = getPanelSticker();
      if (sticker) {
        sticker.click();
        enviadas++;
        console.log(`📤 Clique realizado [${enviadas}/${CONFIG.quantidade}]`);
        agendarProximo();
      } else {
        recoverAndClick((sucesso) => {
          if (!sucesso) {
            console.warn(
              "⚠️ Tentativa de recuperação falhou. Aguardando próximo ciclo...",
            );
          }
          if (running) agendarProximo();
        });
      }
    };

    const agendarProximo = () => {
      if (!running) return;
      const delay =
        Math.floor(Math.random() * (CONFIG.delayMax - CONFIG.delayMin + 1)) +
        CONFIG.delayMin;
      timeoutId = setTimeout(sendNext, delay);
    };

    const delayInicial =
      Math.floor(Math.random() * (CONFIG.delayMax - CONFIG.delayMin + 1)) +
      CONFIG.delayMin;
    timeoutId = setTimeout(sendNext, delayInicial);
  };

  document.addEventListener("click", captureHandler, true);

  window.parar = () => {
    running = false;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    document.removeEventListener("click", captureHandler, true);
    console.log("%c⛔ Script parado.", "color: red; font-weight: bold");
  };
})();
