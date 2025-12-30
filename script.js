import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// ---------------- Firebase setup ----------------
const appSettings = {
  databaseURL: "https://shopping-list-firebase-project-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListItemsInDB = ref(database, "shoppingListItems");

// ---------------- DOM elements ----------------
const inputFieldElement = document.getElementById("input-field");
const addToCartButtonElement = document.getElementById("add-button");
const shoppingListULelement = document.getElementById("shopping-list");
const notificationElement = document.getElementById("notification");

// ---------------- Placeholder fade on focus/blur ----------------
inputFieldElement.addEventListener("focus", () => {
  inputFieldElement.classList.add("placeholder-hidden");
});

inputFieldElement.addEventListener("blur", () => {
  if (inputFieldElement.value.trim() === "") {
    inputFieldElement.classList.remove("placeholder-hidden");
  }
});

// ---------------- Hide notification when user starts typing ----------------
inputFieldElement.addEventListener("input", () => {
  if (notificationElement.classList.contains("notification-visible")) {
    notificationElement.classList.remove("notification-visible");
    notificationElement.textContent = "";
  }
});

// ---------------- Input validation ----------------
const isInputFieldEmpty = (value) => {
  if (value.trim().length === 0) {
    notificationElement.textContent = "Please enter an item!";
    notificationElement.classList.add("notification-visible");
    inputFieldElement.focus();
    return null;
  }

  return value;
};

// ---------------- Add item to the UL with delete button ----------------
const addListItemToLiElement = (value, key) => {
  if (!value) return;

  const li = document.createElement("li");
  li.textContent = value;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "❌";
  deleteButton.style.marginLeft = "10px";
  deleteButton.addEventListener("click", () => deleteItemFromDB(key, li));

  li.appendChild(deleteButton);
  shoppingListULelement.appendChild(li);
};

// ---------------- Delete item from Firebase and UI ----------------
const deleteItemFromDB = (key, liElement) => {
  const itemRef = ref(database, `shoppingListItems/${key}`);
  remove(itemRef)
    .then(() => {
      shoppingListULelement.removeChild(liElement);
    })
    .catch((err) => console.error("Error deleting item:", err));
};

// ---------------- Add item to Firebase ----------------
const onClickAddToCartButton = () => {
  const inputValue = inputFieldElement.value.trim();
  const validValue = isInputFieldEmpty(inputValue);
  if (!validValue) return;

  push(shoppingListItemsInDB, validValue);
  inputFieldElement.value = "";
};

// ---------------- Event listeners ----------------
addToCartButtonElement.addEventListener("click", onClickAddToCartButton);

inputFieldElement.addEventListener("keypress", (e) => {
  if (e.key === "Enter") onClickAddToCartButton();
});

// ---------------- Real-time listener: updates UI when new items are added ----------------
onChildAdded(shoppingListItemsInDB, (data) => {
  addListItemToLiElement(data.val(), data.key);
});
