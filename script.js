const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBar = document.querySelector('.filter-bar');
const taskCounter = document.getElementById('taskCounter');
const darkModeToggle = document.getElementById('darkModeToggle');
const loadingSpinner = document.getElementById('loadingSpinner');

let tasks = [];
let currentFilter = 'all';

// --- Local Storage Helpers ---
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
function loadTasks() {
  tasks = JSON.parse(localStorage.getItem('tasks')) || [];
}

// --- Rendering ---
function renderTasks() {
  taskList.innerHTML = '';
  let filtered = tasks;
  if (currentFilter === 'active') filtered = tasks.filter(t => !t.completed);
  if (currentFilter === 'completed') filtered = tasks.filter(t => t.completed);

  if (filtered.length === 0) {
    taskList.innerHTML = `<li class="list-group-item text-center text-muted border-0" style="background:transparent;">No tasks found.</li>`;
  } else {
    filtered.forEach((task, idx) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      if (task.removed) li.classList.add('removed');
      li.innerHTML = `
        <span class="task-text${task.completed ? ' completed' : ''}" tabindex="0">${task.text}</span>
        <div>
          <button class="btn btn-success btn-sm me-2 completeBtn" title="Mark as complete" aria-label="Complete">
            <i class="fa-solid fa-circle-check completeBtn"></i>
          </button>
          <button class="btn btn-danger btn-sm deleteBtn" title="Delete" aria-label="Delete">
            <i class="fa-solid fa-eraser deleteBtn"></i>
          </button>
        </div>`;
      li.dataset.index = idx;
      taskList.appendChild(li);
    });
  }
  updateCounter();
}

// --- Task Counter ---
function updateCounter() {
  const activeCount = tasks.filter(t => !t.completed).length;
  const total = tasks.length;
  taskCounter.textContent = total === 0
    ? 'No tasks'
    : `${activeCount} active / ${total} total`;
}

// --- Add Task ---
function handleAddTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ text, completed: false });
  saveTasks();
  renderTasks();
  taskInput.value = '';
  taskInput.focus();
}
addBtn.addEventListener('click', handleAddTask);
taskInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleAddTask();
});

// --- Task Actions (Complete/Delete) ---
taskList.addEventListener('click', e => {
  const li = e.target.closest('li');
  if (!li) return;
  const idx = parseInt(li.dataset.index, 10);
  if (e.target.closest('.completeBtn')) {
    tasks[idx].completed = !tasks[idx].completed;
    saveTasks();
    renderTasks();
  }
  if (e.target.closest('.deleteBtn')) {
    // Animate removal
    li.classList.add('removed');
    setTimeout(() => {
      tasks.splice(idx, 1);
      saveTasks();
      renderTasks();
    }, 400);
  }
});

// --- Filtering ---
filterBar.addEventListener('click', e => {
  if (e.target.classList.contains('filter-btn')) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    e.target.classList.add('active');
    e.target.setAttribute('aria-selected', 'true');
    currentFilter = e.target.dataset.filter;
    renderTasks();
  }
});

// --- Dark Mode ---
function setDarkMode(on) {
  document.body.classList.toggle('dark-mode', on);
  localStorage.setItem('darkMode', on ? '1' : '0');
  darkModeToggle.innerHTML = on
    ? '<i class="bi bi-brightness-high-fill"></i>'
    : '<i class="bi bi-moon-stars-fill"></i>';
  darkModeToggle.setAttribute('aria-label', on ? 'Switch to light mode' : 'Switch to dark mode');
}
darkModeToggle.addEventListener('click', () => {
  const isDark = !document.body.classList.contains('dark-mode');
  setDarkMode(isDark);
});
(function initDarkMode() {
  const dark = localStorage.getItem('darkMode') === '1';
  setDarkMode(dark);
})();

// --- Accessibility: Keyboard support for task completion ---
taskList.addEventListener('keydown', e => {
  if (e.target.classList.contains('task-text')) {
    const idx = parseInt(e.target.closest('li').dataset.index, 10);
    if (e.key === ' ' || e.key === 'Enter') {
      tasks[idx].completed = !tasks[idx].completed;
      saveTasks();
      renderTasks();
    }
  }
});

// --- Loading Spinner (for async, demo only) ---
function showLoading(show = true) {
  if (!loadingSpinner) return;
  loadingSpinner.classList.toggle('d-none', !show);
  taskList.classList.toggle('d-none', show);
}

// --- Initial Load ---
function init() {
  showLoading(true);
  setTimeout(() => { // Simulate loading
    loadTasks();
    renderTasks();
    showLoading(false);
  }, 400);
}
init();