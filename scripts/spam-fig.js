"use strict";

(() => {
  const quantidade = 30; // Total de figurinhas a serem enviadas
  const delayMin = 2200; // Tempo mínimo de espera (ms)
  const delayMax = 6500; // Tempo máximo de espera (ms)

  let stickerSelector = null;
  let targetChat = null;
  let enviadas = 0;
  let running = true;
  let timeoutId = null;

  console.log(
    "%c🚀 Script Automático V1 (Híbrido) carregado!",
    "color: cyan; font-weight: bold",
  );
  console.log("Clique na figurinha para iniciar o processo.");

  const getPanelSticker = () => {
    if (!stickerSelector) return null;
    const all = document.querySelectorAll(stickerSelector);
    return Array.from(all).find((img) => {
      if (!img || !img.isConnected) return false;
      const rect = img.getBoundingClientRect();
      return !img.closest("#main") && rect.width > 20 && rect.height > 20;
    });
  };

  const isPanelOpen = () => getPanelSticker() !== null;

  const findPanelButton = () => {
    return (
      document.querySelector('button[aria-label="Emojis"]') ||
      document.querySelector('button[aria-label*="Emoji"]') ||
      document.querySelector('button[aria-label*="emoji"]') ||
      document.querySelector('[data-testid="emoji-button"]') ||
      document
        .querySelector('span[data-icon="emoji"]')
        ?.closest('button, div[role="button"]') ||
      document
        .querySelector('span[data-icon="sticker"]')
        ?.closest('button, div[role="button"]') ||
      document.querySelector('footer [role="button"]')
    );
  };

  const recoverAndClick = () => {
    if (isPanelOpen()) {
      const sticker = getPanelSticker();
      if (sticker) {
        sticker.click();
        console.log(`📤 Enviada [${enviadas + 1}/${quantidade}] (Silencioso)`);
        enviadas++;
        return;
      }
    }

    console.log("🔄 Contingência: abrindo painel...");
    const btnPainel = findPanelButton();

    if (!btnPainel) {
      console.error("❌ Botão do painel não encontrado.");
      return;
    }

    btnPainel.click();

    setTimeout(() => {
      let sticker = getPanelSticker();
      if (sticker) {
        sticker.click();
        console.log(
          `📤 Enviada [${enviadas + 1}/${quantidade}] (Contingência)`,
        );
        enviadas++;
        return;
      }

      setTimeout(() => {
        sticker = getPanelSticker();
        if (sticker) {
          sticker.click();
          console.log(
            `📤 Enviada [${enviadas + 1}/${quantidade}] (Contingência)`,
          );
          enviadas++;
        } else {
          console.warn("⚠️ Figurinha não encontrada na contingência.");
        }
      }, 900);
    }, 1600);
  };

  const captureHandler = (e) => {
    const header = document.querySelector("#main header");
    targetChat = header ? header.innerText.split("\n")[0] : null;

    const img =
      e.target.closest("img") ||
      e.target.querySelector("img") ||
      (e.target.tagName === "IMG" ? e.target : null);

    if (img && img.src) {
      stickerSelector = `img[src="${img.src}"]`;
    } else {
      console.error("❌ Não consegui capturar a figurinha. Tente novamente.");
      return;
    }

    document.removeEventListener("click", captureHandler, true);

    enviadas = 1;
    console.log(`📤 Primeira figurinha enviada! Iniciando as outras...`);
    startSpam();
  };

  const startSpam = () => {
    const sendNext = () => {
      if (!running || enviadas >= quantidade) {
        console.log("%c✅ Spam concluído!", "color: lime; font-weight: bold");
        return;
      }

      const currentHeader = document.querySelector("#main header");
      const currentChat = currentHeader
        ? currentHeader.innerText.split("\n")[0]
        : null;
      if (targetChat && currentChat !== targetChat) {
        window.parar();
        console.error(
          "%c🛡️ SEGURANÇA: Chat alterado detectado! Parando script para evitar envio incorreto.",
          "color: orange; font-weight: bold; font-size: 14px;",
        );
        return;
      }

      try {
        const sticker = getPanelSticker();
        if (!sticker) throw new Error("Figurinha não encontrada no painel");

        sticker.click();
        console.log(`📤 Enviada [${enviadas + 1}/${quantidade}] (Silencioso)`);
        enviadas++;
      } catch (err) {
        recoverAndClick();
        console.log(
          `📤 Enviada [${enviadas + 1}/${quantidade}] (Contingência)`,
        );
      }

      const delay =
        Math.floor(Math.random() * (delayMax - delayMin + 1)) + delayMin;
      timeoutId = setTimeout(sendNext, delay);
    };

    const initialDelay =
      Math.floor(Math.random() * (delayMax - delayMin + 1)) + delayMin;
    timeoutId = setTimeout(sendNext, initialDelay);
  };

  document.addEventListener("click", captureHandler, true);

  window.parar = () => {
    running = false;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    console.log(
      "%c⛔ Script parado pelo usuário!",
      "color: red; font-weight: bold",
    );
  };

  console.log("🎮 Para parar a qualquer momento, digite apenas: parar()");
})();
