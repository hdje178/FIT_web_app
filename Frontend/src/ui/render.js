

function renderApp(state) {
    renderTable(state);
    renderTableErrors(state);
    renderFormErrors(state);
    renderForm(state);
}

export { renderApp };

function renderTable(state){
    const tbody = document.querySelector(".register_table_body");
    tbody.innerHTML = "";
    const items = state.ui.filterText? state.ui.filterItems : state.items;
    const rowHtml = items.map((item , index) =>{
        const isEditing = state.ui.editingId === item.id;
        return`
       
        <tr data-id="${item.id}">
        <td data-id="${item.id}" >${index+1}</td>
        <td data-id="${item.id}" ${isEditing? 'contenteditable="true"' : ""}>${item.name}</td>
        <td data-id="${item.id}" ${isEditing? 'contenteditable="true"' : ""}>${item.date}</td>
        <td data-id="${item.id}" ${isEditing? 'contenteditable="true"' : ""}>${item.location}</td>
        <td data-id="${item.id}" ${isEditing? 'contenteditable="true"' : ""}>${item.capacity}</td>
        <td data-id="${item.id}" width="15%" ${isEditing? 'contenteditable="true"' : ""}>${item.description}</td>
        <td data-id="${item.id}"><button type="button" class="delete-btn" data-id="${item.id}">Видалити</button></td>
        <td data-id="${item.id}"><button type="button" ${isEditing? 'class="save-btn"' : 'class="edit-btn"'} data-id="${item.id}">${isEditing? "Зберегти" : "Редагувати"}</button>
        </td>
        </tr>`}).join("");
    tbody.innerHTML = rowHtml;
}

function renderForm(state) {
    if (Object.keys(state.form.touched).length === 0) {
        const fields = ["name", "date", "location", "capacity", "description"];
        fields.forEach(field => {
            const input = document.getElementById(`register-form_${field}`);
            if (input) input.value = "";
        });
    }
}

function renderFormErrors(state) {
    let fields = ["name", "date", "location", "capacity"];
    let submit_btn = document.querySelector(".register-form_button_submit button");
    fields.forEach(field => {
        let el = document.getElementById(`${field}_error`);
        let input = document.getElementById(`register-form_${field}`);
        el.textContent = state.form.touched[`${field}`] ? state.form.errors[field] ?? "": "";
        el.textContent? input.classList.add("invalid") : input.classList.remove("invalid");
        el.hidden = !state.form.touched[`${field}`];

    })
    submit_btn.disabled = !state.form.isValid;
}
function renderTableErrors(state) {
    if (!state.ui.editErrors) return;
    if (!state.ui.editingId) return;
    let fields = ["name", "date", "location", "capacity", "description"];
    let cellsEditing = document.querySelectorAll(`td[data-id="${state.ui.editingId}"][contenteditable="true"]`);
    if (!cellsEditing.length) return;
    let save_btn = cellsEditing[0].closest("tr").querySelector(".save-btn");
    fields.forEach((field,index) => {
        let el = cellsEditing[index];
        if (state.ui.editErrors[field] === false){
            el.classList.add("error-cell");
        }else {
            el.classList.remove("error-cell");
        }
    })
}










