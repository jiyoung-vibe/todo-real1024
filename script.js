const input = document.getElementById("todo-input");
const dateInput = document.getElementById("todo-date");
const addButton = document.getElementById("add-button");
const list = document.getElementById("todo-list");
const remainingCount = document.getElementById("remaining-count");

const STORAGE_KEY = "todo-items";

// 저장된 할 일을 불러옵니다. 저장이 안 되는 브라우저에서도 화면은 뜨도록 try로 감쌉니다.
function loadItems() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveItems() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    // 저장에 실패해도 지금 화면에서는 계속 쓸 수 있게 둡니다.
  }
}

let items = loadItems();

// 목록과 남은 개수를 현재 items에 맞게 다시 그립니다.
function render() {
  list.innerHTML = "";

  items.forEach((item, index) => {
    const li = document.createElement("li");
    if (item.done) {
      li.classList.add("done");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.done;
    checkbox.addEventListener("change", () => {
      item.done = checkbox.checked;
      saveItems();
      render();
    });

    const text = document.createElement("span");
    text.textContent = item.text;

    const deadline = document.createElement("span");
    deadline.className = "due";
    deadline.textContent = "마감 " + item.due;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "삭제";
    deleteButton.addEventListener("click", () => {
      items.splice(index, 1);
      saveItems();
      render();
    });

    li.append(checkbox, text);
    if (item.due) {
      li.append(deadline);
    }
    li.append(deleteButton);
    list.appendChild(li);
  });

  remainingCount.textContent = items.filter((item) => !item.done).length;
}

addButton.addEventListener("click", () => {
  const text = input.value.trim();
  if (text === "") {
    return;
  }

  items.push({ text: text, done: false, due: dateInput.value });
  input.value = "";
  dateInput.value = "";
  saveItems();
  render();
  input.focus();
});

render();
