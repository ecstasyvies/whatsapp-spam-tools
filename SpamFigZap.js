"use strict";

(async () => {
  const quantidade = 30; // Total de figurinhas a serem enviadas
  const delayMin = 2200; // Tempo mínimo de espera (ms)
  const delayMax = 6500; // Tempo máximo de espera (ms)

  let stickerHandler = null;
  let stickerSelector = null;
  let enviadas = 0;
  let running = true;
  let intervalo = null;

  console.log(
    "%c🚀 Script Automático V1 (Híbrido) carregado!",
    "color: cyan; font-weight: bold",
  );
  console.log("Clique na figurinha para iniciar o processo.");

  const findHandler = (el) => {
    let current = el;
    while (current && current !== document.body) {
      const key = Object.keys(current).find(
        (k) =>
          k.startsWith("__reactProps") ||
          k.startsWith("__reactFiber") ||
          k.startsWith("__reactEventHandlers"),
      );
      if (key) {
        const data = current[key];
        const handler =
          data?.onClick ||
          data?.memoizedProps?.onClick ||
          data?.children?.props?.onClick;
        if (typeof handler === "function") return handler;
      }
      current = current.parentElement;
    }
    return null;
  };

  const recoverAndClick = () => {
    console.log("🔄 Contingência: abrindo painel...");
    const btnPainel =
      document.querySelector('[data-testid="emoji-button"]') ||
      document.querySelector('span[data-icon="smiley"]') ||
      document.querySelector('span[data-icon="sticker"]');

    if (btnPainel) {
      btnPainel.click();
      setTimeout(() => {
        const figurinha = document.querySelector(stickerSelector);
        if (figurinha) {
          figurinha.click();
          console.log("🎯 Envio via contingência realizado.");
        } else {
          console.warn("⚠️ Figurinha não encontrada na contingência.");
        }
      }, 800);
    }
  };

  const captureHandler = (e) => {
    const el =
      e.target.closest('div[role="button"]') ||
      e.target.closest("img") ||
      e.target;

    const img = el.querySelector("img") || (el.tagName === "IMG" ? el : null);
    if (img && img.src) {
      stickerSelector = `img[src="${img.src}"]`;
    }

    stickerHandler = findHandler(el);
    document.removeEventListener("click", captureHandler, true);

    if (stickerHandler) {
      console.log("✅ Método principal (silencioso) capturado.");
    } else {
      console.warn("⚠️ Método principal falhou. Usando contingência.");
    }

    enviadas = 1; // o clique que você deu já enviou a primeira
    console.log(`📤 Primeira figurinha enviada! Iniciando as outras...`);
    startSpam();
  };

  const startSpam = () => {
    intervalo = setInterval(
      () => {
        if (!running || enviadas >= quantidade) {
          clearInterval(intervalo);
          console.log("%c✅ Spam concluído!", "color: lime; font-weight: bold");
          return;
        }

        try {
          if (stickerHandler) {
            stickerHandler({
              preventDefault: () => {},
              stopPropagation: () => {},
              nativeEvent: new MouseEvent("click"),
            });
            console.log(
              `📤 Enviada [${enviadas + 1}/${quantidade}] (Silencioso)`,
            );
          } else {
            throw new Error("Handler não disponível");
          }
        } catch (err) {
          recoverAndClick();
          console.log(
            `📤 Enviada [${enviadas + 1}/${quantidade}] (Contingência)`,
          );
        }

        enviadas++;
      },
      Math.floor(Math.random() * (delayMax - delayMin + 1)) + delayMin,
    );
  };

  document.addEventListener("click", captureHandler, true);

  window.parar = () => {
    running = false;
    if (intervalo) {
      clearInterval(intervalo);
      intervalo = null;
    }
    console.log(
      "%c⛔ Script parado pelo usuário!",
      "color: red; font-weight: bold",
    );
  };

  console.log("🎮 Para parar a qualquer momento, digite apenas: parar()");
})();
