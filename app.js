/**
 * TaskMaster - Gerenciador de Tarefas Moderno em Modo Escuro
 * Desenvolvido com HTML5, Tailwind CSS e Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // Chave para armazenamento no localStorage
  const STORAGE_KEY = 'taskmaster_tasks_v1';

  // Elementos do DOM
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const emptyState = document.getElementById('empty-state');
  const emptyStateTitle = document.getElementById('empty-state-title');
  const emptyStateSubtitle = document.getElementById('empty-state-subtitle');
  const currentDateEl = document.getElementById('current-date');
  const progressBar = document.getElementById('progress-bar');
  const progressPercentage = document.getElementById('progress-percentage');
  const headerPendingCount = document.getElementById('header-pending-count');
  const headerCompletedCount = document.getElementById('header-completed-count');
  const countAll = document.getElementById('count-all');
  const countPending = document.getElementById('count-pending');
  const countCompleted = document.getElementById('count-completed');
  const btnClearCompleted = document.getElementById('btn-clear-completed');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const toastContainer = document.getElementById('toast-container');
  const footerSummary = document.getElementById('footer-summary');

  // Estado da Aplicação
  let tasks = [];
  let currentFilter = 'all'; // 'all' | 'pending' | 'completed'

  /**
   * Inicializa a data atual formatada em português brasileiro
   */
  function initCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const formatted = now.toLocaleDateString('pt-BR', options);
    // Capitaliza a primeira letra do dia da semana
    currentDateEl.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  /**
   * Carrega as tarefas salvas no localStorage
   */
  function loadTasks() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        tasks = JSON.parse(stored);
      } else {
        // Tarefas de exemplo na primeira utilização para demonstrar as funcionalidades
        tasks = [
          {
            id: 'sample-1',
            text: 'Boas-vindas ao TaskMaster! Conclua esta tarefa clicando no círculo.',
            completed: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'sample-2',
            text: 'Crie suas próprias metas e tarefas usando o campo acima.',
            completed: false,
            createdAt: new Date().toISOString()
          }
        ];
        saveTasks();
      }
    } catch (error) {
      console.error('Erro ao ler tarefas do localStorage:', error);
      tasks = [];
    }
  }

  /**
   * Salva a lista de tarefas no localStorage
   */
  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Erro ao salvar tarefas no localStorage:', error);
      showToast('Erro ao salvar no armazenamento local.', 'error');
    }
  }

  /**
   * Mostra um toast elegante no canto da tela
   */
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-xl text-xs sm:text-sm font-medium transition-all duration-300 transform translate-y-2 opacity-0 ${
      type === 'success' 
        ? 'bg-emerald-950/90 text-emerald-200 border border-emerald-800/80 shadow-emerald-900/20' 
        : type === 'delete'
        ? 'bg-rose-950/90 text-rose-200 border border-rose-800/80 shadow-rose-900/20'
        : 'bg-slate-800 text-slate-200 border border-slate-700 shadow-slate-950/50'
    }`;

    // Ícones para o toast
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>`;
    } else if (type === 'delete') {
      iconSvg = `<svg class="w-4 h-4 text-rose-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>`;
    } else {
      iconSvg = `<svg class="w-4 h-4 text-indigo-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
    }

    toast.innerHTML = `${iconSvg}<span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);

    // Animação de entrada
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    // Animação de saída
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 2500);
  }

  /**
   * Sanitiza strings para evitar injeção XSS
   */
  function escapeHtml(string) {
    const div = document.createElement('div');
    div.textContent = string;
    return div.innerHTML;
  }

  /**
   * Adiciona uma nova tarefa
   */
  function addTask(text) {
    const trimmed = text.trim();
    if (!trimmed) {
      showToast('Por favor, digite uma descrição para a tarefa.', 'info');
      taskInput.focus();
      return;
    }

    const newTask = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      text: trimmed,
      completed: false,
      createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);
    saveTasks();
    render();
    showToast('Tarefa adicionada com sucesso!', 'success');
    taskInput.value = '';
    taskInput.focus();
  }

  /**
   * Alterna o estado de conclusão de uma tarefa
   */
  function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    task.completed = !task.completed;
    saveTasks();
    render();

    if (task.completed) {
      showToast('Tarefa concluída! Parabéns!', 'success');
    }
  }

  /**
   * Remove uma tarefa individualmente com animação
   */
  function deleteTask(id) {
    const taskElement = document.querySelector(`[data-task-id="${id}"]`);
    
    if (taskElement) {
      taskElement.classList.add('task-item-exit');
      taskElement.addEventListener('animationend', () => {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        render();
        showToast('Tarefa excluída.', 'delete');
      }, { once: true });
    } else {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      render();
      showToast('Tarefa excluída.', 'delete');
    }
  }

  /**
   * Remove todas as tarefas concluídas
   */
  function clearCompletedTasks() {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount === 0) return;

    if (confirm(`Deseja remover todas as ${completedCount} tarefa(s) concluída(s)?`)) {
      tasks = tasks.filter(t => !t.completed);
      saveTasks();
      render();
      showToast(`${completedCount} tarefa(s) concluída(s) removida(s).`, 'delete');
    }
  }

  /**
   * Atualiza estatísticas, contadores e barra de progresso
   */
  function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    // Atualiza contadores numéricos
    headerPendingCount.textContent = pending;
    headerCompletedCount.textContent = completed;
    countAll.textContent = `(${total})`;
    countPending.textContent = `(${pending})`;
    countCompleted.textContent = `(${completed})`;

    // Atualiza rodapé
    if (total === 0) {
      footerSummary.textContent = 'Nenhuma tarefa cadastrada';
    } else if (total === 1) {
      footerSummary.textContent = '1 tarefa no total';
    } else {
      footerSummary.textContent = `${total} tarefas no total`;
    }

    // Atualiza barra de progresso
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    progressBar.style.width = `${percentage}%`;
    progressPercentage.textContent = `${percentage}%`;

    // Exibe ou oculta o botão de limpar concluídas
    if (completed > 0) {
      btnClearCompleted.classList.remove('hidden');
    } else {
      btnClearCompleted.classList.add('hidden');
    }
  }

  /**
   * Atualiza visualmente o botão de filtro ativo
   */
  function updateFilterButtons() {
    filterButtons.forEach(btn => {
      const filterType = btn.getAttribute('data-filter');
      if (filterType === currentFilter) {
        btn.className = 'filter-btn px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 bg-indigo-600 text-white shadow-sm';
      } else {
        btn.className = 'filter-btn px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-200 rounded-xl transition-all duration-200 hover:bg-slate-800/50';
      }
    });
  }

  /**
   * Renderiza a lista de tarefas e atualiza a interface completa
   */
  function render() {
    updateStats();
    updateFilterButtons();

    // Filtra tarefas conforme seleção
    const filteredTasks = tasks.filter(task => {
      if (currentFilter === 'pending') return !task.completed;
      if (currentFilter === 'completed') return task.completed;
      return true; // 'all'
    });

    // Limpa lista atual
    taskList.innerHTML = '';

    if (filteredTasks.length === 0) {
      emptyState.classList.remove('hidden');
      emptyState.classList.add('flex');

      if (currentFilter === 'completed') {
        emptyStateTitle.textContent = 'Nenhuma tarefa concluída ainda';
        emptyStateSubtitle.textContent = 'Marque suas tarefas pendentes como concluídas para vê-las aqui.';
      } else if (currentFilter === 'pending') {
        emptyStateTitle.textContent = 'Tudo em dia por aqui!';
        emptyStateSubtitle.textContent = 'Você não possui tarefas pendentes no momento. Bom trabalho!';
      } else {
        emptyStateTitle.textContent = 'Nenhuma tarefa encontrada';
        emptyStateSubtitle.textContent = 'Comece adicionando uma nova tarefa no campo acima.';
      }
      return;
    }

    emptyState.classList.add('hidden');
    emptyState.classList.remove('flex');

    // Cria elementos HTML para cada tarefa
    filteredTasks.forEach(task => {
      const li = document.createElement('li');
      li.setAttribute('data-task-id', task.id);
      li.className = `task-item-enter group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 ${
        task.completed 
          ? 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/30' 
          : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800/90 hover:border-slate-600 shadow-sm'
      }`;

      // Botão Checkbox e Texto da Tarefa
      const contentContainer = document.createElement('div');
      contentContainer.className = 'flex items-center gap-3.5 flex-1 min-w-0 pr-2 cursor-pointer select-none';
      contentContainer.addEventListener('click', () => toggleTask(task.id));

      // Botão de Marcação Estilizado (Checkbox Customizado)
      const checkButton = document.createElement('button');
      checkButton.type = 'button';
      checkButton.setAttribute('aria-label', task.completed ? 'Marcar como não concluída' : 'Marcar como concluída');
      checkButton.className = `w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
        task.completed 
          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 ring-2 ring-emerald-500/30' 
          : 'border-2 border-slate-600 group-hover:border-indigo-400 bg-slate-900/50'
      }`;

      if (task.completed) {
        checkButton.innerHTML = `
          <svg class="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        `;
      }

      // Descrição da Tarefa com Efeito de Tachado e Opacidade
      const textSpan = document.createElement('span');
      textSpan.className = `text-sm sm:text-base break-words flex-1 transition-all duration-200 ${
        task.completed 
          ? 'line-through text-slate-500 italic decoration-slate-500/80 decoration-2' 
          : 'text-slate-200 font-normal'
      }`;
      textSpan.textContent = task.text;

      contentContainer.appendChild(checkButton);
      contentContainer.appendChild(textSpan);

      // Botão Excluir (Lixeira)
      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.setAttribute('aria-label', 'Remover tarefa');
      deleteButton.className = 'opacity-80 sm:opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-200 cursor-pointer shrink-0';
      deleteButton.innerHTML = `
        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      `;
      deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(task.id);
      });

      li.appendChild(contentContainer);
      li.appendChild(deleteButton);
      taskList.appendChild(li);
    });
  }

  // --- Ouvintes de Eventos (Event Listeners) ---

  // Submissão do formulário de adição
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(taskInput.value);
  });

  // Filtros de visualização
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.getAttribute('data-filter');
      render();
    });
  });

  // Botão limpar concluídas
  btnClearCompleted.addEventListener('click', clearCompletedTasks);

  // Inicialização da Aplicação
  initCurrentDate();
  loadTasks();
  render();
});
