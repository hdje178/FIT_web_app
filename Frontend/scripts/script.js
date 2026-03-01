"use strict";
// CONSTANT AND IMPORTANT VARIABLES

const STORAGE_KEY = "lr1_items";

const table_arr = loadFromLocalStorage(STORAGE_KEY);

let nextId = Number(localStorage.getItem("lr1_nextId") ?? "1");

// STARTING RENDER

renderTable(table_arr);

// FUNCTION FOR LOCAL STORAGE

function saveToLocalStorage(items, STORAGE_KEY){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
console.log("LOCAL_STORAGE");
}
function loadFromLocalStorage(STORAGE_KEY) {
    const json =localStorage.getItem(STORAGE_KEY);
    if (json ===null){
        return [];
    }
    try {
        const data = JSON.parse(json);
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

// FUNCTION TO WORK WITH FORM

function readForm() {
    const id = nextId++;
    const name_of_event = document.querySelector("#register-form_name").value;
    const date_of_event = document.querySelector("#register-form_date").value;
    const location_of_event = document.querySelector("#register-form_location").value;
    const capacity_of_event = document.querySelector("#register-form_capacity").value;
    const description_of_event = document.querySelector("#register-form_description").value;
    localStorage.setItem("lr1_nextId", String(nextId));
    return {
        id : id,
        name: name_of_event,
        date: date_of_event,
        location: location_of_event,
        capacity: capacity_of_event,
        description: description_of_event ? description_of_event : "-",
    };
}
function resetForm() {
    document.getElementById("register-form").reset();
}

function validateForm(dto){
    clearErrors()
    let isValid = true;
    const name = dto.name.trim();
    if (name ===""){
        isValid = false;
        showError("register-form_name","name_error", "Поле не може бути порожнім!" )
    }
    const date = dto.date.trim();
    if (date ==="") {
        isValid = false;
        showError("register-form_date", "date_error", "Поле не може бути порожнім або дата некоректна!")
    }else {
        const date_for_check = new Date(date);
        const now = new Date()
        if (isNaN(date_for_check.getTime())) {
            isValid = false;
            showError("register-form_date","date_error", "Неправильна дата!");
        }
        if (date_for_check < now) {
            isValid = false;
            showError("register-form_date","date_error", "Не можна планувати на минуле!!");
        }
    }
    const locate = dto.location.trim();
    if (locate ===""){
        isValid = false;
        showError("register-form_location","location_error", "Поле не може бути порожнім!" )
    }
    const capacity = dto.capacity;
    if (capacity ===""){
        isValid = false;
        showError("register-form_capacity","capacity_error","Поле не може бути порожнім або Ви ввели не правильне число!"  )
    }else{
        const capacity = Number(dto.capacity);
        if (Number.isNaN(capacity) || capacity < 1 || capacity > 200) {
            showError("register-form_capacity", "capacity_error", "Число має бути в діапазоні 1–200.");
            isValid = false;
        }
    }
    return isValid;
}
function clearErrors() {
    clearError("register-form_name", "name_error")
    clearError("register-form_date","date_error")
    clearError("register-form_location","location_error")
    clearError("register-form_capacity","capacity_error")
}

function clearError(inputId, errorId) {
    document.getElementById(inputId).classList.remove("invalid");
    document.getElementById(errorId).innerHTML = "";
}
function showError(inputId,errorId, message) {
    document.getElementById(inputId).classList.add("invalid");
    document.getElementById(errorId).innerHTML = message;
}

// RENDER-TABLE FUNCTION

function renderTable(table_arr){
    const tbody = document.querySelector(".register_table_body");
    const rowHtml = table_arr.map((item , index) =>`
        <tr>
        <td data-id="${item.id}">${index+1}</td>
        <td data-id="${item.id}">${item.name}</td>
        <td data-id="${item.id}">${item.date}</td>
        <td data-id="${item.id}">${item.location}</td>
        <td data-id="${item.id}">${item.capacity}</td>
        <td data-id="${item.id}" width="15%">${item.description}</td>
        <td data-id="${item.id}"><button type="button" class="delete-btn" data-id="${item.id}">Видалити</button></td>
        <td data-id="${item.id}"><button type="button" class="edit-btn" data-id="${item.id}">Редагувати</button>
        </td>
        </tr>`).join("");
    tbody.innerHTML = rowHtml;
}

//EDIT , SAVE , ADD , DELETE FUNCTION

function editRow(id, table_arr, buttonElement){
    const row = buttonElement.closest('tr');
    const cells = row.querySelectorAll('td');
    const allSaveBtns = document.querySelectorAll('.save-btn');

    allSaveBtns.forEach(btn => {
        if (btn !== buttonElement) {
            btn.textContent = 'Редагувати';
            btn.classList.remove('save-btn');
            btn.classList.add('edit-btn');
        }
    });

    for (let i = 1; i < cells.length - 2; i++) {
        cells[i].contentEditable = true;
        cells[i].classList.add('edit');
    }
    cells[1].focus();
    buttonElement.textContent = 'Зберегти';
    buttonElement.classList.remove('edit-btn');
    buttonElement.classList.add('save-btn');

}

function saveRow(id, table_arr, buttonElement){
    const item = table_arr.find(el => el.id ===id);
    const row = buttonElement.closest('tr');
    const cells = row.querySelectorAll('td');
    if(!validateEditTable(cells)){
        return;
    }
    if(item){
        item.name = cells[1].textContent.trim();
        item.date = cells[2].textContent;
        item.location = cells[3].textContent.trim();
        item.capacity = cells[4].textContent.trim();
        item.description = cells[5].textContent.trim();
    }
    for(let i = 1; i < cells.length - 2 ; i++){
        cells[i].contentEditable = false;
        cells[i].classList.remove('edit');
    }

    buttonElement.textContent = 'Редагувати';
    buttonElement.classList.remove('save-btn');
    buttonElement.classList.add('edit-btn');
    saveToLocalStorage(table_arr, STORAGE_KEY);
}

function addItems(dto, table_arr){
    table_arr.push(dto);
}

function deleteItems(index, table_arr){
    const index_in_arr = table_arr.findIndex((el)=> el.id === index);
    table_arr.splice(index_in_arr, 1);
    saveToLocalStorage(STORAGE_KEY);
}

// VALIDATE EDIT TABLE FUNCTION

function validateEditTable(cells){
    for(let i = 0; i < cells.length - 2; i++){
        if(cells[i].textContent.trim() ===  ""){
            return false;
        }
    }
    if(Number(cells[4].textContent) <= 0 || Number(cells[4].textContent > 200) || (!isFinite(cells[4].textContent))) {
        return false;
    }
    let date = new Date(cells[2].textContent);
    if (isNaN(date.getTime())){
        return false;
    }
    return true;
}

// SEARCH FUNCTION FOR TABLE

function searchFunc(value, table_arr){
    let regex = new RegExp(`^${value}.*`, "i")
    const result = table_arr.filter(el => regex.test(el.name));
    if(result){
        renderTable(result);
    }else{
        return []
    }
}

// LISTENER FOR SEARCH AND RESET BUTTON (SEARCH)

const searchContainer = document.querySelector(".search_for_element");

searchContainer.addEventListener("click", function(event){
    const target = event.target;
    const input = document.querySelector("#input_for_search");

    if(target.id === "button_for_search"){
        searchFunc(input.value, table_arr);
    }

    if(target.id === "button_for_reset"){
        input.value = "";
        renderTable(table_arr);
    }
});

// LISTENER SORT TABLE

const select = document.querySelector("#table_sorter");
select.addEventListener("change", (event) => {
    const target = event.target.value;
        if (target === "number_sorter"){
            table_arr.sort((a, b) => b.id - a.id);
            saveToLocalStorage(table_arr,STORAGE_KEY);
            renderTable(table_arr);
        }else if(target === "date_sorter"){
            table_arr.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
            saveToLocalStorage(table_arr,STORAGE_KEY);
            renderTable(table_arr);
        }else if(target === "name_sorter"){
            table_arr.sort((a,b)=> a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            console.log(table_arr);
            saveToLocalStorage(table_arr,STORAGE_KEY);
            renderTable(table_arr);
        }else if(target === "capacity_sorter") {
            table_arr.sort((a, b) => b.capacity - a.capacity);
            saveToLocalStorage(table_arr, STORAGE_KEY);
            renderTable(table_arr);
        }
})

//LISTENER REGISTRATION FORM INPUTS (MAIN LISTENER)

const tbody = document.querySelector(".register_table_body");
tbody.addEventListener("click", function (event) {
    const target = event.target;
    if(target.classList.contains("delete-btn")){
        const id = Number(target.dataset.id);
        deleteItems(id, table_arr)
        renderTable(table_arr);
        saveToLocalStorage(table_arr, STORAGE_KEY);
        return
    }
    if (target.classList.contains("edit-btn")){
        const id = Number(target.dataset.id);
        editRow(id, table_arr, target);
        saveToLocalStorage(table_arr, STORAGE_KEY);
        return
    }
    if (target.classList.contains("save-btn")){
        const id = Number(target.dataset.id);
        saveRow(id, table_arr, target)
        renderTable(table_arr);
    }
})

//LISTENER FOR RESET AND SUBMIT BTN

const btn = document.querySelector(".register-form_button_reset");
btn.addEventListener("click", () => {resetForm();clearErrors()});
const form = document.getElementById("register-form");
form.addEventListener("submit", function (event){
    event.preventDefault();
    const dto = readForm();
    const isValid = validateForm(dto);
    if (!isValid) {
        return;
    }
    addItems(dto, table_arr);
    saveToLocalStorage(table_arr, STORAGE_KEY);
    renderTable(table_arr);
    resetForm();
});
