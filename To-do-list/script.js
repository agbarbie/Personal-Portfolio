let tasks = JSON.parse(
      localStorage.getItem('taskflow_tasks') || '[]'
    );
    let currentFilter = 'all';

    function saveTasks() {
      localStorage.setItem(
        'taskflow_tasks',
        JSON.stringify(tasks)
      );
    }

    function addTask() {
      const input = document.getElementById('task-input');
      const text  = input.value.trim();
      if (!text) return;

      tasks.unshift({
        id: Date.now(),
        text,
        completed: false,
        createdAt: new Date().toISOString()
      });

      input.value = '';
      saveTasks();
      render();
    }

    function toggleTask(id) {
      const task = tasks.find(t => t.id === id);
      if (task) {
        task.completed = !task.completed;
        saveTasks();
        render();
      }
    }

    function deleteTask(id) {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      render();
    }

    function clearCompleted() {
      tasks = tasks.filter(t => !t.completed);
      saveTasks();
      render();
    }

    function setFilter(filter, btn) {
      currentFilter = filter;
      document.querySelectorAll('.filter-btn')
        .forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render();
    }

    function render() {
      const list = document.getElementById('task-list');

      const filtered = tasks.filter(t => {
        if (currentFilter === 'active')    return !t.completed;
        if (currentFilter === 'completed') return  t.completed;
        return true;
      });

      if (filtered.length === 0) {
        const icon = currentFilter === 'completed' ? '🎉' : '📝';
        const msg  = currentFilter === 'completed'
          ? 'No completed tasks yet.'
          : 'No tasks here. Add one above!';
        list.innerHTML = `
          <div class="empty-state">
            <div class="icon">${icon}</div>
            <p>${msg}</p>
          </div>
        `;
      } else {
        list.innerHTML = filtered.map(t => `
          <div class="task-item ${t.completed ? 'completed' : ''}"
               id="task-${t.id}">
            <div class="checkbox"
                 onclick="toggleTask(${t.id})">
              <span class="checkbox-check">✓</span>
            </div>
            <div class="task-text">${escapeHtml(t.text)}</div>
            <div class="task-actions">
              <button
                class="action-btn"
                onclick="deleteTask(${t.id})"
                title="Delete">
                🗑️
              </button>
            </div>
          </div>
        `).join('');
      }

      const total  = tasks.length;
      const done   = tasks.filter(t => t.completed).length;
      const active = total - done;

      document.getElementById('total-count').textContent  = total;
      document.getElementById('active-count').textContent = active;
      document.getElementById('done-count').textContent   = done;
      document.getElementById('remaining-text').textContent =
        total === 0
          ? 'No tasks yet'
          : `${active} task${active !== 1 ? 's' : ''} remaining`;
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    document.getElementById('task-input')
      .addEventListener('keydown', e => {
        if (e.key === 'Enter') addTask();
      });

    render();