# Scripts de Automação para WhatsApp Web

> **Scripts executados diretamente no navegador, pelo Console do WhatsApp Web. Sem instalação, sem aplicativo, sem celular.**

---

## ⚠️ Isenção de Responsabilidade

> O uso destes scripts viola os **Termos de Serviço do WhatsApp**. O comportamento automatizado pode ser detectado pela plataforma, resultando em **bloqueio temporário ou banimento permanente** do número. Todo o risco e toda a responsabilidade pelo uso são **exclusivamente seus**. O autor não se responsabiliza por nenhuma consequência decorrente do uso desta ferramenta.

---

## Requisitos

- **Computador** (Windows, Mac ou Linux) — estes scripts **não funcionam em celular**
- Navegador moderno: **Google Chrome**, Microsoft Edge ou Firefox (recomenda-se Chrome)
- Acesso ao **WhatsApp Web** em `https://web.whatsapp.com`
- Acesso às **Ferramentas de Desenvolvedor** do navegador (tecla `F12`)

---

## Os Scripts Disponíveis

### 🎴 SpamFigZap — Envio de figurinhas em sequência

Envia a mesma figurinha repetidamente em uma conversa. Você clica uma vez na figurinha que quer enviar e o script cuida do resto. Se o painel de figurinhas fechar sozinho, o script tenta reabri-lo automaticamente.

**Configurações no início do arquivo `spam-fig.js`:**

| Parâmetro | Padrão | O que faz |
|-----------|--------|-----------|
| `quantidade` | `30` | Quantas vezes a figurinha será enviada |
| `delayMin` | `2200` | Tempo mínimo entre envios (em milissegundos) |
| `delayMax` | `6500` | Tempo máximo entre envios (em milissegundos) |

> O script confirma apenas que realizou o **clique** na figurinha — não verifica se a mensagem foi efetivamente entregue pelo WhatsApp.

---

### 💬 SpamText — Envio de uma lista de mensagens de texto

Envia uma sequência de mensagens de texto que você definiu previamente no código. Ideal para mandar roteiros, listas ou frases em ordem. **Antes de usar, você precisa editar a lista de mensagens diretamente no script.**

**Configurações no início do arquivo `spam-texto.js`:**

| Parâmetro | Padrão | O que faz |
|-----------|--------|-----------|
| `mensagens` | *(lista de exemplo)* | As mensagens que serão enviadas, em ordem |
| `delayMin` | `450` | Tempo mínimo entre mensagens (em milissegundos) |
| `delayMax` | `950` | Tempo máximo entre mensagens (em milissegundos) |
| `maxTentativasPorMensagem` | `3` | Quantas tentativas antes de parar por erro |
| `modoSeguro` | `true` | Usa simulação de tecla Enter como alternativa ao botão de envio |

---

## Como Usar — Passo a Passo

### Antes de começar

1. Acesse `https://web.whatsapp.com` no navegador do seu computador e faça login normalmente
2. Entre na conversa onde deseja enviar as mensagens
3. Verifique se a conversa correta está aberta — o script enviará tudo para ela

### Para o SpamFigZap (figurinhas)

1. Com a conversa aberta, pressione `F12` (ou `Ctrl+Shift+I`) para abrir as Ferramentas de Desenvolvedor
2. Clique na aba **Console** dentro da janela que abriu
3. Copie o conteúdo do arquivo `scripts/spam-fig.js` (ou clique em "Copiar Código" na página do projeto)
4. Cole o código no Console e pressione `Enter`
5. O script vai confirmar no Console que reconheceu a interface e pedirá que você clique em uma figurinha
6. Abra o painel de figurinhas no WhatsApp, encontre a figurinha desejada e **clique nela uma única vez**
7. O script registra esse clique e passa a enviar automaticamente, reabrindo o painel se necessário
8. Acompanhe o progresso pelo Console — cada envio é registrado

### Para o SpamText (mensagens de texto)

1. Antes de copiar o script, **edite o arquivo `scripts/spam-texto.js`** e substitua o conteúdo de `CONFIG.mensagens` pelas mensagens que você deseja enviar. Exemplo:
   ```js
   mensagens: [
     "Boa noite!",
     "Tudo bem?",
     "Só vim dar um oi mesmo",
   ],
   ```
2. Com a conversa correta aberta no WhatsApp Web, pressione `F12` → aba **Console**
3. Cole o código editado no Console e pressione `Enter`
4. O script reconhece a interface, aguarda 1 segundo e começa a enviar as mensagens em sequência
5. Acompanhe o progresso — o Console mostra porcentagem e prévia de cada mensagem enviada

---

## Como Parar o Script

Para interromper a execução a qualquer momento, digite no Console e pressione `Enter`:

```js
parar()
```

O script para imediatamente e não realiza mais nenhuma ação.

---

## Se Não Funcionar

### "⛔ INTERFACE NÃO RECONHECIDA"

Esta é a mensagem mais importante. Ela aparece quando o script não conseguiu identificar os elementos essenciais do WhatsApp Web — seja porque:

- A página não é o WhatsApp Web (`https://web.whatsapp.com`)
- Nenhuma conversa está aberta
- O WhatsApp Web **atualizou sua interface** e os seletores do script ficaram desatualizados

**O que fazer:** Não tente executar novamente. Acesse o repositório do projeto no GitHub para verificar se há uma versão atualizada do script. Forçar execução após essa mensagem pode causar comportamentos incorretos.

### "❌ A lista de mensagens está vazia"

Você executou o SpamText sem editar a lista de mensagens, ou apagou o conteúdo acidentalmente. Adicione pelo menos uma mensagem no `CONFIG.mensagens` antes de executar.

### "🛡️ SEGURANÇA: Conversa alterada"

Você trocou de conversa enquanto o script estava rodando. O script parou automaticamente para evitar enviar mensagens no lugar errado. Recomece o processo na conversa correta.

### "⚠️ Figurinha não encontrada mesmo após reabrir o painel"

O painel de figurinhas foi fechado e o script não conseguiu encontrá-la ao reabrir. Pode ser uma falha pontual (tente novamente) ou uma mudança de interface. Se acontecer repetidamente, verifique se o script está atualizado.

### O Console mostra "allow pasting" ou pede confirmação

Alguns navegadores bloqueiam a colagem de scripts por segurança. No Chrome, se aparecer essa mensagem, digite `allow pasting` no Console, pressione `Enter` e então cole o script novamente.

### Nada acontece após colar e dar Enter

- Confirme que está no Console (não em outro painel como "Elements" ou "Network")
- Confirme que o WhatsApp Web está aberto **na mesma aba** onde você abriu o Console
- Tente recarregar a página do WhatsApp Web e repetir o processo

---

## Segurança Operacional

- **Verifique a conversa antes de iniciar.** Após abrir o Console e antes de executar, confirme visualmente que a conversa aberta é a correta.
- **Monitore o início da execução.** Fique de olho nas primeiras linhas do Console para garantir que o script reconheceu a interface corretamente.
- **Pare imediatamente** se aparecer qualquer mensagem de incompatibilidade ou comportamento inesperado.
- **Não use em múltiplos chats simultâneos** — cada instância do Console controla apenas uma aba.
- **Não exagere na quantidade.** Muitos envios em sequência aumentam o risco de detecção e bloqueio pelo WhatsApp.

### Parâmetros de referência para menor risco

| Script | `delayMin` recomendado | `delayMax` recomendado | Quantidade máxima por sessão |
|--------|------------------------|------------------------|------------------------------|
| Figurinhas | 2200 ms | 6500 ms (ou mais) | 50–100 |
| Texto | 450 ms | 950 ms (ou mais) | Quantidade da sua lista |

---

## Versão e Histórico de Alterações

### v2.0.0
- Verificação de compatibilidade antes da execução: o script só roda se reconhecer o WhatsApp Web e os elementos essenciais
- Verificação contínua durante a execução: se a interface mudar, o script para com segurança e informa o motivo
- Seletores centralizados no objeto `SELETORES` em cada script, facilitando atualização futura
- Correção na contagem do SpamFigZap: o log agora informa "clique registrado" (sem prometer confirmação de entrega)
- Erros de incompatibilidade diferenciados de falhas pontuais no SpamText
- Versão identificada na inicialização de cada script (`v2.0.0`)
- Remoção do fallback genérico `footer [role="button"]` do SpamFigZap
- README reescrito com foco em usuário não-técnico

### v1.0.0
- Versão inicial com SpamFigZap e SpamText
- Detecção de mudança de conversa
- Sistema de recuperação automática do painel de figurinhas
- Mecanismo de parada manual via `parar()`