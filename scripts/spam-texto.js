"use strict";

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

    const chatPrincipal =
      document.querySelector(SELETORES.chatPrincipal) ||
      document.querySelector(SELETORES.chatAlternativo);
    if (!chatPrincipal) return false;

    const cabecalho = document.querySelector(SELETORES.cabecalhoChat);
    if (!cabecalho) return false;

    const campo = chatPrincipal.querySelector(SELETORES.campoTexto);
    if (!campo) return false;

    return true;
  };

  const encerrarPorIncompatibilidade = (motivo) => {
    running = false;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    console.error(
      "%c⛔ INTERFACE NÃO RECONHECIDA",
      "color: #ff4444; font-weight: bold; font-size: 15px;"
    );
    console.error(`%c${motivo}`, "color: #ff8800; font-weight: bold;");
    console.error(
      "%cO WhatsApp Web pode ter atualizado sua interface. Não tente novamente — atualize o script em: https://github.com/ecstasyvies/whatsapp-spam-tools",
      "color: #ffcc00;"
    );
  };

  if (!CONFIG.mensagens || CONFIG.mensagens.length === 0) {
    console.error(
      "%c❌ A lista de mensagens está vazia. Adicione pelo menos uma mensagem no CONFIG.mensagens antes de executar.",
      "color: red; font-weight: bold"
    );
    return;
  }

  let enviadas = 0;
  let running = true;
  let timeoutId = null;
  const totalMensagens = CONFIG.mensagens.length;

  console.log(
    `%c🚀 SpamText v${VERSAO} carregado!`,
    "color: #00ff00; font-weight: bold"
  );
  console.log(`📋 Mensagens na fila: ${totalMensagens}`);

  if (!verificarCompatibilidade()) {
    encerrarPorIncompatibilidade(
      "A página atual não é o WhatsApp Web ou os elementos essenciais (conversa aberta, campo de texto) não foram encontrados."
    );
    return;
  }

  const cabecalhoInicial = document.querySelector(SELETORES.cabecalhoChat);
  const targetChat = cabecalhoInicial ? cabecalhoInicial.innerText.split("\n")[0] : null;

  console.log("✅ Interface reconhecida. Iniciando em 1 segundo...");
  console.log("🎮 Para parar a qualquer momento, digite: parar()");

  const localizarElementos = () => {
    const chat =
      document.querySelector(SELETORES.chatPrincipal) ||
      document.querySelector(SELETORES.chatAlternativo);

    if (!chat) {
      throw new Error("INCOMPATIBILIDADE: contêiner principal da conversa não encontrado");
    }

    const campo =
      chat.querySelector(SELETORES.campoTexto) ||
      chat.querySelector(SELETORES.campoTextoFallback);

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

    if (!campo) {
      throw new Error("INCOMPATIBILIDADE: campo de texto não encontrado");
    }

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

    throw new Error("Botão de envio não disponível após várias tentativas");
  };

  const startSpam = () => {
    const sendNext = async () => {
      if (!running) return;

      if (enviadas >= totalMensagens) {
        console.log("%c✅ Todas as mensagens foram enviadas!", "color: lime; font-weight: bold");
        console.log(`Total enviado: ${enviadas}/${totalMensagens}`);
        return;
      }

      const cabecalhoAtual = document.querySelector(SELETORES.cabecalhoChat);
      const chatAtual = cabecalhoAtual ? cabecalhoAtual.innerText.split("\n")[0] : null;

      if (targetChat && chatAtual !== targetChat) {
        window.parar();
        console.error(
          "%c🛡️ SEGURANÇA: Conversa alterada — script interrompido para evitar envio no local errado.",
          "color: orange; font-weight: bold; font-size: 14px;"
        );
        return;
      }

      const msg = CONFIG.mensagens[enviadas];

      try {
        await enviarMensagemComRetry(msg);
        enviadas++;
        const progresso = Math.round((enviadas / totalMensagens) * 100);
        console.log(
          `📤 [${enviadas}/${totalMensagens}] ${progresso}% — ${msg.substring(0, 60)}${msg.length > 60 ? "..." : ""}`
        );
      } catch (e) {
        if (e.message.startsWith("INCOMPATIBILIDADE:")) {
          encerrarPorIncompatibilidade(
            `Elemento essencial desapareceu durante a execução: ${e.message.replace("INCOMPATIBILIDADE: ", "")}`
          );
          return;
        }
        console.error(`❌ Erro ao enviar mensagem ${enviadas + 1}: ${e.message}`);
        running = false;
        return;
      }

      const delay =
        Math.floor(Math.random() * (CONFIG.delayMax - CONFIG.delayMin + 1)) +
        CONFIG.delayMin;
      timeoutId = setTimeout(sendNext, delay);
    };

    timeoutId = setTimeout(sendNext, 1000);
  };

  window.parar = () => {
    running = false;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    console.log("%c⛔ Script parado.", "color: red; font-weight: bold");
  };

  startSpam();
})();
