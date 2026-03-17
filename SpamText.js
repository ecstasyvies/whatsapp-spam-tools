"use strict";

(async () => {
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
  let intervalo = null;
  let totalMensagens = CONFIG.mensagens.length;

  console.log(
    "%c🚀 Script de Texto carregado!",
    "color: #00ff00; font-weight: bold",
  );
  console.log(`📋 Total de mensagens: ${totalMensagens}`);
  console.log("Pra parar a qualquer momento: digite   parar()");

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

  const iniciarEnvio = () => {
    intervalo = setInterval(
      async () => {
        if (!running || enviadas >= totalMensagens) {
          clearInterval(intervalo);
          console.log(
            "%c✅ Envio concluído com sucesso",
            "color: lime; font-weight: bold",
          );
          console.log(`Total enviado: ${enviadas}/${totalMensagens}`);
          return;
        }

        const msg = CONFIG.mensagens[enviadas];

        try {
          await enviarMensagemComRetry(msg);
          enviadas++;
          const progresso = Math.round((enviadas / totalMensagens) * 100);
          console.log(
            `📤 [${enviadas}/${totalMensagens}] ${progresso}%  ${msg.substring(0, 60)}${msg.length > 60 ? "..." : ""}`,
          );
        } catch (e) {
          console.error(`❌ Erro na mensagem ${enviadas + 1}: ${e.message}`);
          running = false;
          clearInterval(intervalo);
        }
      },
      Math.floor(Math.random() * (CONFIG.delayMax - CONFIG.delayMin + 1)) +
        CONFIG.delayMin,
    );
  };

  window.parar = () => {
    running = false;
    if (intervalo) clearInterval(intervalo);
    console.log(
      "%c⛔ Script parado manualmente",
      "color: red; font-weight: bold",
    );
  };

  console.log("Iniciando em 1 segundo...");
  setTimeout(iniciarEnvio, 1000);
})();
