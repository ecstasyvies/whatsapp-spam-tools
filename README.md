# Scripts de Automação para WhatsApp Web (V1)

Este repositório reúne ferramentas desenvolvidas em JavaScript para automação de interações no ambiente do WhatsApp Web. O projeto é composto por dois módulos independentes: o **SpamFigZap**, especializado no envio resiliente de figurinhas, e o **SpamText**, projetado para o envio sequencial de mensagens de texto personalizadas.

---

## ⚠️ Isenção de Responsabilidade

> **O autor deste script não se responsabiliza por quaisquer consequências decorrentes do uso desta ferramenta. Todos os possíveis efeitos e riscos já estão integralmente descritos nesta documentação. Toda a responsabilidade pelo uso do script recai exclusivamente sobre quem usar.**

---

## 1. Módulo Spam de Figurinhas

Este componente automatiza o envio repetitivo de uma única figurinha selecionada na interface. Sua arquitetura foi projetada para garantir a continuidade do processo mesmo quando o painel de figurinhas é fechado pelo usuário.

### Características e Funcionamento
*   **Clique direto no elemento DOM**: utiliza o elemento real da figurinha no painel (método mais estável em 2026).
*   **Detecção inteligente do painel**: verifica em tempo real se a gaveta de figurinhas está aberta. Caso esteja fechada, o script reabre automaticamente.
*   **Proteção anti-zoom**: ignora completamente as figurinhas já enviadas no chat, evitando abrir o preview por engano.
*   **Delay realmente aleatório**: calcula um novo intervalo entre cada envio (nunca repete o mesmo tempo).
*   **Contador preciso**: só incrementa quando o envio é confirmado visualmente.
*   **Recuperação automática**: se o painel demorar para carregar, faz uma segunda tentativa.

### Instruções de Operação
1.  Acesse o [WhatsApp Web](https://web.whatsapp.com) e selecione o chat de destino.
2.  Abra as Ferramentas de Desenvolvimento do navegador (tecla `F12` ou `Ctrl+Shift+I`) e selecione a aba **Console**.
3.  Copie o código do script de figurinhas (disponível na página principal) e cole no console, pressionando `Enter`.
4.  Abra o painel de figurinhas e realize **um único clique** sobre a figurinha que deseja enviar. 
5.  Após a confirmação, você pode fechar o painel — o script continua sozinho e reabre quando necessário.

---

## 2. Módulo Spam de Texto

Este componente é destinado ao envio automatizado de uma sequência pré-definida de textos, funcionando como um disparador de roteiros ou listas de mensagens.

### Características e Funcionamento
*   **Processamento sequencial**: percorre a lista de mensagens em ordem, respeitando os intervalos configurados.
*   **Emulação de entrada nativa**: utiliza `execCommand('insertText')` + eventos de input e teclado para simular digitação real.
*   **Sistema de retry**: tenta reenviar automaticamente em caso de falha momentânea no campo de texto ou botão de envio.
*   **Delay realmente aleatório**: novo tempo calculado entre cada mensagem.

### Instruções de Operação
1.  Antes da execução, abra o código e edite a constante `CONFIG.mensagens` com os textos desejados.
2.  No console do navegador, cole o código completo e pressione `Enter`.
3.  O script iniciará o ciclo automaticamente após 1 segundo, exibindo progresso em tempo real.

---

## 3. Configurações Gerais e Parâmetros de Execução

Ambos os scripts permitem ajustes no início do código:

*   **delayMin e delayMax**: tempo mínimo e máximo entre envios (em milissegundos). O script sempre escolhe um valor aleatório dentro deste intervalo.
*   **quantidade** (figurinha): limite total de repetições.
*   **maxTentativasPorMensagem** (texto): quantas tentativas de envio antes de parar por erro.

---

## 4. Segurança, Riscos e Boas Práticas

O uso de scripts de automação viola os Termos de Serviço do WhatsApp. O comportamento automatizado pode ser detectado, resultando em **bloqueio temporário ou banimento permanente** do número.

### Parâmetros de Referência Segura
*   **Figurinhas**: mantenha `delayMin: 2200` e `delayMax: 6500` (ou aumente para 5000–15000 ms).
*   **Texto**: mantenha `delayMin: 450` e `delayMax: 950` (ou aumente para 2000–5000 ms).
*   **Volume**: evite mais de 50–100 envios por sessão.
*   **Moderação**: nunca use em múltiplos chats ou de forma contínua.

---

## 5. Procedimento de Interrupção

Para parar qualquer script a qualquer momento, digite no console:

```js
parar()