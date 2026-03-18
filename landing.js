"use strict";

const scripts = {
  fig: `"use strict";

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
        console.log(\`📤 Enviada [\${enviadas + 1}/\${quantidade}] (Silencioso)\`);
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
        console.log(\`📤 Enviada [\${enviadas + 1}/\${quantidade}] (Contingência)\`);
        enviadas++;
        return;
      }

      setTimeout(() => {
        sticker = getPanelSticker();
        if (sticker) {
          sticker.click();
          console.log(\`📤 Enviada [\${enviadas + 1}/\${quantidade}] (Contingência)\`);
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
      stickerSelector = \`img[src="\${img.src}"]\`;
    } else {
      console.error("❌ Não consegui capturar a figurinha. Tente novamente.");
      return;
    }

    document.removeEventListener("click", captureHandler, true);

    enviadas = 1;
    console.log(\`📤 Primeira figurinha enviada! Iniciando as outras...\`);
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
        console.log(\`📤 Enviada [\${enviadas + 1}/\${quantidade}] (Silencioso)\`);
        enviadas++;
      } catch (err) {
        recoverAndClick();
        console.log(\`📤 Enviada [\${enviadas + 1}/\${quantidade}] (Contingência)\`);
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
})();`,
  texto: `"use strict";

(() => {
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

  if (!CONFIG.mensagens || CONFIG.mensagens.length === 0) {
    console.error(
      "%c❌ Array de mensagens está vazio",
      "color: red; font-weight: bold",
    );
    return;
  }

  let enviadas = 0;
  let running = true;
  let timeoutId = null;
  let totalMensagens = CONFIG.mensagens.length;

  console.log(
    "%c🚀 Script de Texto carregado!",
    "color: #00ff00; font-weight: bold",
  );
  console.log(\`📋 Total de mensagens: \${totalMensagens}\`);
  console.log("Pra parar a qualquer momento: digite   parar()");

  // Captura o chat alvo na inicialização
  const header = document.querySelector("#main header");
  const targetChat = header ? header.innerText.split("\n")[0] : null;

  const localizarElementos = () => {
    const chat =
      document.querySelector("#main") ||
      document.querySelector('[data-testid="chat"]');
    if (!chat) throw new Error("Nenhuma conversa aberta");

    const campo =
      chat.querySelector('div[contenteditable="true"][role="textbox"]') ||
      chat.querySelector('div[contenteditable="true"]');

    const botao =
      chat.querySelector('[data-testid="send"]') ||
      chat.querySelector('button[aria-label="Enviar"]') ||
      chat.querySelector('button[aria-label="Send"]') ||
      chat.querySelector('button span[data-icon="send"]')?.closest("button");

    return { campo, botao };
  };

  const inserirTexto = (campo, texto) => {
    campo.focus();

    // Limpa o conteúdo existente
    document.execCommand("selectAll", false, null);
    document.execCommand("delete", false, null);

    // Insere o texto de forma que o React detecte
    document.execCommand("insertText", false, texto);

    // Eventos que o WhatsApp espera
    campo.dispatchEvent(
      new InputEvent("input", { bubbles: true, composed: true }),
    );
    campo.dispatchEvent(
      new InputEvent("compositionend", { bubbles: true, composed: true }),
    );
    campo.dispatchEvent(new Event("input", { bubbles: true }));
    campo.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const enviarMensagemComRetry = async (texto, tentativa = 1) => {
    const { campo, botao } = localizarElementos();
    if (!campo) throw new Error("Campo de texto não encontrado");

    inserirTexto(campo, texto);

    await new Promise((r) => setTimeout(r, 220));

    if (botao && botao.offsetParent !== null && !botao.disabled) {
      botao.click();
      return true;
    }

    if (CONFIG.modoSeguro) {
      const enter = new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        bubbles: true,
        cancelable: true,
        keyCode: 13,
        which: 13,
      });
      campo.dispatchEvent(enter);
      campo.dispatchEvent(new KeyboardEvent("keypress", { ...enter }));
      campo.dispatchEvent(new KeyboardEvent("keyup", { ...enter }));
      return true;
    }

    if (tentativa < CONFIG.maxTentativasPorMensagem) {
      await new Promise((r) => setTimeout(r, 400));
      return enviarMensagemComRetry(texto, tentativa + 1);
    }

    throw new Error("Não conseguiu enviar após várias tentativas");
  };

  const startSpam = () => {
    const sendNext = async () => {
      if (!running || enviadas >= totalMensagens) {
        console.log(
          "%c✅ Envio concluído com sucesso",
          "color: lime; font-weight: bold",
        );
        console.log(\`Total enviado: \${enviadas}/\${totalMensagens}\`);
        return;
      }

      // Validação de Segurança para Texto
      const currentHeader = document.querySelector("#main header");
      const currentChat = currentHeader
        ? currentHeader.innerText.split("\n")[0]
        : null;

      if (targetChat && currentChat !== targetChat) {
        window.parar();
        console.error(
          "%c🛡️ SEGURANÇA: Você trocou de chat! Script interrompido por segurança.",
          "color: orange; font-weight: bold; font-size: 14px;",
        );
        return;
      }

      const msg = CONFIG.mensagens[enviadas];

      try {
        await enviarMensagemComRetry(msg);
        enviadas++;
        const progresso = Math.round((enviadas / totalMensagens) * 100);
        console.log(
          \`📤 [\${enviadas}/\${totalMensagens}] \${progresso}%  \${msg.substring(0, 60)}\${msg.length > 60 ? "..." : ""}\`,
        );
      } catch (e) {
        console.error(\`❌ Erro na mensagem \${enviadas + 1}: \${e.message}\`);
        running = false;
        return;
      }

      // Delay ALEATÓRIO a cada mensagem
      const delay =
        Math.floor(Math.random() * (CONFIG.delayMax - CONFIG.delayMin + 1)) +
        CONFIG.delayMin;
      timeoutId = setTimeout(sendNext, delay);
    };

    // Inicia após 1 segundo
    timeoutId = setTimeout(sendNext, 1000);
  };

  window.parar = () => {
    running = false;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    console.log(
      "%c⛔ Script parado manualmente",
      "color: red; font-weight: bold",
    );
  };

  console.log("Iniciando em 1 segundo...");
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

window.copiarCodigoBase = () => {
  const codigoBase =
    "// 1. Abra o WhatsApp Web no Chrome\\n// 2. Aperte F12 > Console\\n// 3. Cole o script desejado\\n// 4. Digite parar() para interromper";
  const botao = document.querySelector(".grupo-acoes-topo .botao-repositorio");
  copiarParaTransferencia(codigoBase, botao);
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
