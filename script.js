const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

addBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  if (taskText === '') return;

  const li = document.createElement('li');
  li.className = 'list-group-item d-flex justify-content-between align-items-center';

  li.innerHTML = `
    <span class="task-text">${taskText}</span>
    <div>
      <button class="btn btn-success btn-sm me-2 completeBtn"><i class="fa-solid fa-circle-check completeBtn"></i></button>
      <button class="btn btn-danger btn-sm deleteBtn"><i class="fa-solid fa-eraser deleteBtn"></i></button>
    </div>`;

  taskList.appendChild(li);
  taskInput.value = '';
});

taskList.addEventListener('click', (e) => {
  if (e.target.classList.contains('completeBtn')) {
    e.target.closest('li').querySelector('.task-text').classList.toggle('completed');
  }

  if (e.target.classList.contains('deleteBtn')) {
    e.target.closest('li').remove();
  }
});