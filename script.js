// import { add } from "../functions.js";
// const addTwoNumber = (num1, num2) => {
//   const result = add(num1, num2);
//   console.log(`Using add function - add ${num1} & ${num2}. The result is - ${result}`);
//   return result;
// };

// addTwoNumber(4, 5);
// addTwoNumber(10, 15);

// ------------------------------------------------------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://shopping-list-firebase-project-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListItemsInDB = ref(database, "shoppingListItems");

const inputFieldElement = document.getElementById("input-field");
const addToCartButtonElement = document.getElementById("add-button");
const shoppingListULelement = document.getElementById("shopping-list");

const isInputFieldEmpty = (value) => {
  if (value.length !== 0) {
    return value;
  }

  console.log("Input is empty");
  inputFieldElement.focus();
};

const addListItemToLiElement = (value) => {
  isInputFieldEmpty(value);
  const li = document.createElement("li");
  li.textContent = value;

  if (shoppingListULelement) {
    shoppingListULelement.appendChild(li);
  }
};

const onClickAddToCartButton = () => {
  const inputValue = inputFieldElement.value;
  console.log(`${inputValue} added to database`);
  push(shoppingListItemsInDB, inputValue);
  inputFieldElement.value = "";
  addListItemToLiElement(inputValue);
};

addToCartButtonElement.addEventListener("click", onClickAddToCartButton);
