// Seletores principais
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const taskList = document.getElementById("taskList");
const completedList = document.getElementById("completedList");
const allTasksBtn = document.getElementById("allTasksBtn");
const completedTasksBtn = document.getElementById("completedTasksBtn");
const taskSection = document.getElementById("taskSection");
const completedSection = document.getElementById("completedSection");

// Função para salvar listas no localStorage
function saveLists() {
    const tasks = [];
    taskList.querySelectorAll("li").forEach(li => {
        tasks.push(li.querySelector(".task-text").textContent);
    });
    const completed = [];
    completedList.querySelectorAll("li").forEach(li => {
        completed.push(li.querySelector(".task-text").textContent);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("completed", JSON.stringify(completed));
}

// Função para criar nova tarefa (com opção de não salvar ao restaurar)
function createTask(text, skipSave = false) {
    const li = document.createElement("li");

    // Cria o span para o texto da tarefa
    const textSpan = document.createElement("span");
    textSpan.className = "task-text";
    textSpan.textContent = text;
    textSpan.title = text; 

    const actions = document.createElement("div");

    const doneBtn = document.createElement("button");
    doneBtn.innerHTML = '<i class="fas fa-check"></i>';
    doneBtn.style.color = "#27ae60";
    doneBtn.setAttribute("aria-label", "Marcar tarefa como concluída");
    doneBtn.onclick = () => {
        completeTask(li, textSpan.textContent);
        saveLists();
    };

    // Botão de edição
    const editBtn = document.createElement("button");
    editBtn.innerHTML = '<i class="fas fa-pen" style="font-size:1.4rem"></i>';
    editBtn.style.color = "#f1c40f";
    editBtn.setAttribute("aria-label", "Editar tarefa");
    editBtn.onclick = () => {
        const currentText = textSpan.textContent;
        const input = document.createElement("input");
        input.type = "text";
        input.value = currentText;
        input.maxLength = 30;
        input.style.fontSize = "1.4rem";
        input.style.flexGrow = "1";
        input.style.marginRight = "1rem";

        textSpan.style.display = "none";
        li.insertBefore(input, actions);
        input.focus();

        function saveEdit() {
            const newText = input.value.trim();
            if (newText) {
                li.removeChild(input);
                textSpan.textContent = newText;
                textSpan.title = newText;
                textSpan.style.display = "";
                saveLists();
            } else {
                li.remove();
                saveLists();
            }
        }
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") saveEdit();
        });
        input.addEventListener("blur", saveEdit);
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
    deleteBtn.setAttribute("aria-label", "Excluir tarefa");
    deleteBtn.onclick = () => {
        li.remove();
        saveLists();
    };

    actions.appendChild(doneBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(textSpan);
    li.appendChild(actions);

    taskList.appendChild(li);

    if (!skipSave) saveLists();
}

// Função para criar tarefa concluída (com opção de não salvar ao restaurar)
function createCompletedTask(text, skipSave = false) {
    const completedLi = document.createElement("li");
    completedLi.classList.add("completed");

    const textSpan = document.createElement("span");
    textSpan.className = "task-text";
    textSpan.textContent = text;
    textSpan.title = text;

    const actions = document.createElement("div");

    // Botão para restaurar tarefa para lista padrão
    const restoreBtn = document.createElement("button");
    restoreBtn.innerHTML = '<i class="fas fa-undo" style="font-size:1.4rem"></i>';
    restoreBtn.style.color = "#2980b9";
    restoreBtn.setAttribute("aria-label", "Restaurar tarefa para pendente");
    restoreBtn.onclick = () => {
        completedLi.remove();
        createTask(textSpan.textContent);
        saveLists();
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.setAttribute("aria-label", "Excluir tarefa concluída");
    deleteBtn.onclick = () => {
        completedLi.remove();
        saveLists();
    };

    actions.appendChild(restoreBtn);
    actions.appendChild(deleteBtn);
    completedLi.appendChild(textSpan);
    completedLi.appendChild(actions);
    completedList.appendChild(completedLi);

    if (!skipSave) saveLists();
}

// Adicionar nova tarefa
addTaskBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    if (text) {
        createTask(text);
        taskInput.value = "";
    }
});

// Excluir todas as tarefas OU concluídas, dependendo da seção visível
clearAllBtn.addEventListener("click", () => {
    if (!taskSection.classList.contains("hidden")) {
        taskList.innerHTML = "";
    } else if (!completedSection.classList.contains("hidden")) {
        completedList.innerHTML = "";
    }
    saveLists();
});

// Completar tarefa
function completeTask(li, text) {
    li.remove();
    createCompletedTask(text);
}

// Alternar menus
allTasksBtn.addEventListener("click", () => {
    taskSection.classList.remove("hidden");
    completedSection.classList.add("hidden");
});

completedTasksBtn.addEventListener("click", () => {
    taskSection.classList.add("hidden");
    completedSection.classList.remove("hidden");
});

// Carregar listas do localStorage ao iniciar
window.addEventListener("DOMContentLoaded", () => {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const completed = JSON.parse(localStorage.getItem("completed") || "[]");
    tasks.forEach(text => createTask(text, true));
    completed.forEach(text => createCompletedTask(text, true));
});

// Garante o limite de 50 caracteres no input, inclusive na versão mobile
taskInput.addEventListener("input", function () {
    if (this.value.length > 50) {
        this.value = this.value.slice(0, 50);
    }
});

// Permite adicionar tarefa pressionando Enter no input
taskInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        addTaskBtn.click();
    }
});