# 📋 TaskMaster - Lista de Tarefas Moderna

Uma aplicação web estática, responsiva e elegante de Lista de Tarefas (To-Do List) desenvolvida em **HTML5**, **Tailwind CSS** e **JavaScript Vanilla**, com visual nativo em **Modo Escuro (Dark Mode)** e persistência em tempo real via **localStorage**.

---

## ✨ Funcionalidades Principais

1. **Adição de Tarefas**:
   - Inclusão rápida pelo formulário com validação de texto.
   - Suporte ao envio via tecla <kbd>Enter</kbd> ou botão de ação.
   - Sanitização de texto contra ataques XSS.

2. **Marcação e Efeito Visual de Tachado**:
   - Alternância de conclusão ao clicar no checkbox circular ou na descrição da tarefa.
   - Efeito visual de tachado suave (`line-through`), transição de cor e opacidade indicando conclusão.

3. **Remoção Individual**:
   - Botão de lixeira por item com animação suave de saída (`task-item-exit`).
   - Botão para limpar todas as tarefas concluídas em lote.

4. **Persistência Completa no `localStorage`**:
   - Todas as operações (criação, edição de status e exclusão) são salvas imediatamente no navegador sob a chave `taskmaster_tasks_v1`.
   - Se a página for atualizada ou o navegador fechado, o estado é totalmente preservado.

5. **Interface Moderna e Responsiva**:
   - Tema escuro de alto contraste (`slate-950` / `slate-900`) com acentos em degradê Índigo e Esmeralda.
   - Barra de progresso interativa que calcula dinamicamente o percentual de tarefas concluídas.
   - Filtros de visualização: **Todas**, **Pendentes** e **Concluídas** com contadores dinâmicos.
   - Feedbacks visuais por meio de notificações flutuantes (*Toasts*).
   - Data atual formatada dinamicamente em português brasileiro (pt-BR).

---

## 📁 Estrutura de Arquivos

```
task-master/
├── index.html     # Estrutura semântica HTML5 com Tailwind CSS
├── style.css      # Estilos customizados, scrollbars e animações
├── app.js         # Lógica JavaScript com manipulação do DOM e localStorage
└── README.md      # Documentação da aplicação
```

---

## 🚀 Como Executar

A aplicação é 100% estática e não necessita de instalações ou servidores de compilação:

1. Basta abrir o arquivo `index.html` em qualquer navegador web moderno (Google Chrome, Firefox, Edge, Safari, Brave).
2. Se preferir rodar com um servidor local, pode usar a extensão *Live Server* do VS Code ou pelo terminal:
   ```bash
   npx serve .
   ```
