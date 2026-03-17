# Scripts de Automação para WhatsApp Web (V1)

Este repositório reúne ferramentas desenvolvidas em JavaScript para automação de interações no ambiente do WhatsApp Web. O projeto é composto por dois módulos independentes: o **SpamFigZap**, especializado no envio resiliente de figurinhas, e o **SpamText**, projetado para o envio sequencial de mensagens de texto personalizadas.

---

## 1. Módulo SpamFigZap.js

Este componente automatiza o envio repetitivo de uma única figurinha selecionada na interface. Sua arquitetura foi projetada para garantir a continuidade do processo mesmo diante de variações na interface de uso.

### Características e Funcionamento
*   **Envio via Gatilho Interno:** O script identifica o manipulador de eventos (*handler*) do React associado à figurinha. Isso permite que o disparo das mensagens ocorra em segundo plano, sem a necessidade de manter a gaveta de figurinhas aberta.
*   **Protocolo de Contingência:** Caso o método principal de envio silencioso seja interrompido ou falhe, o script aciona automaticamente uma rotina de recuperação. Esta rotina simula a abertura do painel de figurinhas e executa um clique físico no elemento visual correspondente para assegurar que o fluxo de mensagens não seja interrompido.

### Instruções de Operação
1.  Acesse o [WhatsApp Web](https://web.whatsapp.com) e selecione o chat de destino.
2.  Abra as Ferramentas de Desenvolvimento do navegador (tecla `F12` ou `Ctrl+Shift+I`) e selecione a aba **Console**.
3.  Copie o código contido no arquivo `SpamFigZap.js` e cole-o no console, pressionando `Enter` em seguida.
4.  No WhatsApp, abra o painel de figurinhas e realize **um único clique** sobre a figurinha que deseja enviar. 
5.  Após a confirmação da captura pelo script, a gaveta de figurinhas pode ser fechada manualmente; a automação prosseguirá de forma autônoma.

---

## 2. Módulo SpamText.js

Este componente é destinado ao envio automatizado de uma sequência pré-definida de textos, funcionando como um disparador de roteiros ou listas de mensagens.

### Características e Funcionamento
*   **Processamento Sequencial:** O script percorre uma lista (*array*) de strings e envia cada item em ordem, respeitando os intervalos configurados.
*   **Emulação de Entrada Nativa:** Utiliza o comando `execCommand('insertText')` e o disparo coordenado de eventos de teclado (`InputEvent`, `KeyboardEvent`). Esta técnica assegura que o estado interno do WhatsApp detecte a presença de texto, habilitando o botão de envio de forma legítima.
*   **Sistema de Reenvio (Retry):** Possui lógica para tentar reenviar mensagens em caso de falhas momentâneas na detecção do campo de texto ou do botão de envio.

### Instruções de Operação
1.  Antes da execução, abra o arquivo `SpamText.js` e localize a constante `CONFIG.mensagens`. Edite o conteúdo desta lista com as mensagens que deseja disparar.
2.  No console do navegador (aba **Console** das Ferramentas de Desenvolvimento), cole o código completo e pressione `Enter`.
3.  O script iniciará o ciclo de envios automaticamente após um intervalo de 1 segundo, exibindo o progresso e o status de cada disparo diretamente no terminal do console.

---

## 3. Configurações Gerais e Parâmetros de Execução

Ambos os scripts compartilham variáveis de controle localizadas no início de cada arquivo, que permitem ajustar o comportamento da automação:

*   **delayMin e delayMax:** Definem, respectivamente, o tempo mínimo e máximo de espera entre dois envios consecutivos (em milissegundos). O script seleciona um valor aleatório dentro deste intervalo para cada disparo, visando reduzir padrões de comportamento excessivamente regulares.
*   **quantidade (SpamFigZap):** Define o limite total de figurinhas a serem enviadas.
*   **maxTentativasPorMensagem (SpamText):** Determina quantas vezes o script tentará reenviar um texto antes de acusar erro crítico.

---

## 4. Segurança, Riscos e Boas Práticas

O uso de scripts de automação viola os Termos de Serviço do WhatsApp. O comportamento automatizado pode ser detectado pelos sistemas de segurança da plataforma, resultando no **bloqueio ou banimento permanente** do número associado.

### Parâmetros de Referência Segura
Para mitigar riscos de detecção automática, recomenda-se adotar intervalos de tempo conservadores:
*   **Intervalo Sugerido:** Configure `delayMin: 5000` (5 segundos) e `delayMax: 15000` (15 segundos).
*   **Volume de Envios:** Evite o disparo massivo de mensagens (acima de 50 itens) em uma única sessão.
*   **Moderação:** Não utilize as ferramentas de forma contínua ou em conversas com múltiplos contatos em curtos espaços de tempo.

---

## 5. Procedimento de Interrupção

Para cessar qualquer um dos scripts manualmente antes da conclusão do ciclo programado, digite o seguinte comando no console do navegador e pressione `Enter`:

`parar()`

Este comando limpará imediatamente os processos agendados e exibirá uma mensagem de confirmação de parada no console.

---

## 6. Requisitos de Sistema
*   Navegador baseado em Chromium (Google Chrome, Microsoft Edge, Brave, etc.).
*   Sessão ativa e conectada no WhatsApp Web.
