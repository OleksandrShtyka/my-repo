document.addEventListener('DOMContentLoaded', () => {
    const addTaskForm = document.getElementById('addTaskForm');
    const taskTitleInput = document.getElementById('taskTitleInput');
    const taskDescriptionInput = document.getElementById('taskDescriptionInput');
    const taskPriorityInput = document.getElementById('taskPriorityInput');
    const taskList = document.getElementById('taskList');

    // Массив для хранения задач (пока в памяти)
    let tasks = [];

    // Пример: Загрузка задач из localStorage (если они там есть)
    loadTasks();

    addTaskForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Предотвращаем стандартную отправку формы

        const title = taskTitleInput.value.trim();
        const description = taskDescriptionInput.value.trim();
        const priority = taskPriorityInput.value;

        if (title === '') {
            alert('Название задачи не может быть пустым!');
            return;
        }

        const newTask = {
            id: Date.now().toString(), // Уникальный ID на основе времени
            title: title,
            description: description,
            priority: priority,
            completed: false
        };

        tasks.push(newTask);
        saveTasks(); // Сохраняем задачи
        renderTasks();

        // Очистка формы
        taskTitleInput.value = '';
        taskDescriptionInput.value = '';
        taskPriorityInput.value = 'medium'; // Сброс на средний приоритет
    });

    function renderTasks() {
        taskList.innerHTML = ''; // Очищаем текущий список

        if (tasks.length === 0) {
            taskList.innerHTML = '<p>Задач пока нет. Добавьте первую!</p>';
            return;
        }

        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');
            if (task.completed) {
                taskItem.classList.add('completed');
            }
            // Добавляем класс для приоритета
            taskItem.classList.add(`priority-${task.priority}`);
            taskItem.dataset.taskId = task.id; // Сохраняем ID задачи в data-атрибуте

            taskItem.innerHTML = `
                <div class="task-info">
                    <h3>${escapeHTML(task.title)}</h3>
                    <p>${escapeHTML(task.description)}</p>
                    <span>Приоритет: ${capitalizeFirstLetter(task.priority)}</span>
                </div>
                <div class="task-actions">
                    <button class="complete-btn">${task.completed ? 'Отменить' : 'Выполнить'}</button>
                    <button class="edit-btn">Редактировать</button>
                    <button class="delete-btn">Удалить</button>
                </div>
            `;

            taskList.appendChild(taskItem);
        });
    }

    // Обработка кликов на кнопки задач (делегирование событий)
    taskList.addEventListener('click', function(event) {
        const target = event.target;
        const taskItem = target.closest('.task-item'); // Находим родительский элемент задачи
        if (!taskItem) return;

        const taskId = taskItem.dataset.taskId;

        if (target.classList.contains('delete-btn')) {
            deleteTask(taskId);
        } else if (target.classList.contains('complete-btn')) {
            toggleCompleteTask(taskId);
        } else if (target.classList.contains('edit-btn')) {
            // TODO: Реализовать редактирование задачи
            alert(`Редактирование задачи с ID: ${taskId} (пока не реализовано)`);
        }
    });

    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
    }

    function toggleCompleteTask(taskId) {
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        saveTasks();
        renderTasks();
    }

    // Сохранение задач в localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Загрузка задач из localStorage
    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
        }
        renderTasks(); // Отрисовываем задачи после загрузки
    }

    // Вспомогательная функция для экранирования HTML (простая версия)
    function escapeHTML(str) {
        return str.replace(/[&<>"']/g, function (match) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[match];
        });
    }

    // Вспомогательная функция для первой заглавной буквы
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

});