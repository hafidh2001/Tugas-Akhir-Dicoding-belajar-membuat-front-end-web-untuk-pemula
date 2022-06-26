const books = [];

const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "BOOKS_NOTE";

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, year, author, isCompleted) {
  return {
    id,
    title,
    year,
    author,
    isCompleted,
  };
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function searchBook() {
  let textSearch = document.getElementById("search").value.trim();
  let filter = textSearch.toLowerCase();

  let textJudul = document.getElementsByTagName("h2");
  let container = document.querySelectorAll("section");

  for (var index = 0; index < textJudul.length; index++) {
    const title = textJudul[index].innerText.toLowerCase();

    if (title.indexOf(textSearch) !== -1) {
      container[index].style.display = "block";
    } else {
      container[index].style.display = "none";
    }
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const item of data) {
      books.push(item);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const { id, title, author, year, isCompleted } = bookObject;

  const container = document.createElement("section");
  container.setAttribute("id", `book-${id}`);

  const dataContainer = document.createElement("div");
  dataContainer.classList.add("book");

  var actionContainer = document.createElement("div");
  actionContainer.classList.add("action-book");

  const textJudul = document.createElement("h2");
  textJudul.innerText = title;
  textJudul.setAttribute("id", "f-judul");

  const textTahun = document.createElement("p");
  textTahun.innerText = ` (${year})`;
  textTahun.setAttribute("id", "f-tahun");

  const textPenulis = document.createElement("p");
  textPenulis.innerText = ` Karya : ${author}`;
  textPenulis.setAttribute("id", "f-penulis");

  dataContainer.append(textJudul, textTahun, textPenulis);

  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("type", "button");
  deleteButton.classList.add("delete");
  const iconDeleteButton = document.createElement("i");
  iconDeleteButton.classList.add("fa-solid", "fa-xmark");
  deleteButton.append(iconDeleteButton);
  deleteButton.addEventListener("click", function () {
    removeBook(id);
  });

  const editButton = document.createElement("button");
  editButton.setAttribute("type", "button");
  editButton.classList.add("edit");
  const iconEditButton = document.createElement("i");
  iconEditButton.classList.add("fa-solid", "fa-pen-to-square");
  editButton.append(iconEditButton);
  editButton.addEventListener("click", function () {
    showFormEdit(id);
  });

  actionContainer.append(deleteButton, editButton);

  if (isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.setAttribute("type", "button");
    undoButton.classList.add("undo");

    const iconUndoButton = document.createElement("i");
    iconUndoButton.classList.add("fa-solid", "fa-rotate-left");

    undoButton.append(iconUndoButton);

    undoButton.addEventListener("click", function () {
      undoBookFromCompleted(id);
    });

    actionContainer.append(undoButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.setAttribute("type", "button");
    checkButton.classList.add("check");

    const iconCheckButton = document.createElement("i");
    iconCheckButton.classList.add("fa-solid", "fa-check");

    checkButton.append(iconCheckButton);

    checkButton.addEventListener("click", function () {
      checkBookToCompleted(id);
    });

    actionContainer.append(checkButton);
  }

  container.append(dataContainer, actionContainer);
  return container;
}

function addBook() {
  const textJudul = document.getElementById("judul").value;
  const textTahun = document.getElementById("tahun").value;
  const textPenulis = document.getElementById("penulis").value;
  const textIsCompleted = document.getElementById("isCompleted").checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    textJudul,
    textTahun,
    textPenulis,
    textIsCompleted
  );

  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function checkBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function cancelEdit() {
  const addForm = document.querySelector(".add-book");
  addForm.removeAttribute("hidden");

  const editForm = document.querySelector(".edit-book");
  editForm.setAttribute("hidden", true);
}

function showFormEdit(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      const addForm = document.querySelector(".add-book");
      addForm.setAttribute("hidden", true);

      const editForm = document.querySelector(".edit-book");
      editForm.removeAttribute("hidden");

      document.getElementById("id-book").value = bookItem.id;
      document.getElementById("edit-judul").value = bookItem.title;
      document.getElementById("edit-tahun").value = bookItem.year;
      document.getElementById("edit-penulis").value = bookItem.author;
      document.getElementById("edit-isCompleted").checked =
        bookItem.isCompleted;
    }
  }
}

function editBook() {
  const bookId = parseInt(document.getElementById("id-book").value);
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      bookItem.title = document.getElementById("edit-judul").value;
      bookItem.year = document.getElementById("edit-tahun").value;
      bookItem.author = document.getElementById("edit-penulis").value;
      bookItem.isCompleted =
        document.getElementById("edit-isCompleted").checked;
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();

    document.getElementById("judul").value = "";
    document.getElementById("tahun").value = "";
    document.getElementById("penulis").value = "";
    document.getElementById("isCompleted").checked = false;
  });

  const editForm = document.getElementById("edit-form");

  editForm.addEventListener("submit", function (event) {
    event.preventDefault();
    editBook();

    const addForm = document.querySelector(".add-book");
    addForm.removeAttribute("hidden");

    const editForm = document.querySelector(".edit-book");
    editForm.setAttribute("hidden", true);
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById("unfinished-book");
  const completedBookList = document.getElementById("finished-book");

  uncompletedBookList.innerHTML = "";
  completedBookList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      completedBookList.append(bookElement);
    } else {
      uncompletedBookList.append(bookElement);
    }
  }
});
