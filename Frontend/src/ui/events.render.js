function renderEventsApp(state) {
    renderEventsTable(state);
    renderEventsTableErrors(state.events);
    renderEventsFormErrors(state.events);
    renderEventsForm(state);
    renderHeader(state);
    renderWelcome(state);
    renderEventsThead(state);
    console.log("renderEventsApp")
}
let lastAuthUser = undefined;

export { renderEventsApp };

function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function renderEventsTable(state) {
    const tbody = document.querySelector(".register_table_body");
    tbody.innerHTML = "";

    const events = state.events.ui.filterText ? state.events.ui.filterItems : state.events.list;
    console.log(events);

    const rowHtml = events.map((item, index) => {
        const isEditing = state.events.ui.editingId === item.id;
        const v = isEditing && state.events.ui.editValues ? state.events.ui.editValues : null;

        const nameVal = isEditing ? v.name : item.name;
        const locationVal = isEditing ? v.location : item.location;
        const capacityVal = isEditing ? v.capacity : item.capacity;
        const descriptionVal = isEditing ? v.description : item.description;

        const dateVal = isEditing ? v.date : new Date(item.date).toLocaleDateString('uk-UA');

        if (state.auth.user) {
            if (state.auth.user.role.toLowerCase() === "admin") {
                return `
      <tr data-id="${item.id}">
        <td data-id="${item.id}">${index + 1}</td>
        <td data-id="${item.id}" ${isEditing ? 'contenteditable="true"' : ""}>${escapeHtml(nameVal)}</td>
        <td data-id="${item.id}" ${isEditing ? 'contenteditable="true"' : ""}>${escapeHtml(dateVal)}</td>
        <td data-id="${item.id}" ${isEditing ? 'contenteditable="true"' : ""}>${escapeHtml(locationVal)}</td>
        <td data-id="${item.id}" ${isEditing ? 'contenteditable="true"' : ""}>${escapeHtml(capacityVal)}</td>
        <td data-id="${item.id}" width="15%" ${isEditing ? 'contenteditable="true"' : ""}>${escapeHtml(descriptionVal)}</td>
        <td data-id="${item.id}"><button type="button" class="delete-btn" data-id="${item.id}">Видалити</button></td>
        <td data-id="${item.id}"><button type="button" ${isEditing ? 'class="save-btn"' : 'class="edit-btn"'} data-id="${item.id}">${isEditing ? "Зберегти" : "Редагувати"}</button></td>
      </tr>`;
            } else {
                const isRegistered = state.registration.list.some(r => r.eventId === item.id);
                return `
      <tr data-id="${item.id}">
        <td data-id="${item.id}">${index + 1}</td>
        <td data-id="${item.id}" ${isEditing ? 'contenteditable="true"' : ""}>${escapeHtml(nameVal)}</td>
        <td data-id="${item.id}" ${isEditing ? 'contenteditable="true"' : ""}>${escapeHtml(dateVal)}</td>
        <td data-id="${item.id}" ${isEditing ? 'contenteditable="true"' : ""}>${escapeHtml(locationVal)}</td>
        <td data-id="${item.id}" ${isEditing ? 'contenteditable="true"' : ""}>${escapeHtml(capacityVal)}</td>
        <td data-id="${item.id}" width="15%" ${isEditing ? 'contenteditable="true"' : ""}>${escapeHtml(descriptionVal)}</td>
        <td data-id="${item.id}"><button type="button" class="registration-btn" data-id="${item.id}" ${isRegistered ? 'disabled' : ''}>${isRegistered ? 'Вже зареєстровані' : 'Зареєструватись'}</button></td>
      </tr>`;
            }
        } else {
            return `
      <tr data-id="${item.id}">
        <td data-id="${item.id}">${index + 1}</td>
        <td data-id="${item.id}" ${isEditing ? 'contenteditable="true"' : ""}>${escapeHtml(nameVal)}</td>
        <td data-id="${item.id}" ${isEditing ? 'contenteditable="true"' : ""}>${escapeHtml(dateVal)}</td>
        <td data-id="${item.id}" ${isEditing ? 'contenteditable="true"' : ""}>${escapeHtml(locationVal)}</td>
        <td data-id="${item.id}" ${isEditing ? 'contenteditable="true"' : ""}>${escapeHtml(capacityVal)}</td>
        <td data-id="${item.id}" width="15%" ${isEditing ? 'contenteditable="true"' : ""}>${escapeHtml(descriptionVal)}</td>
      </tr>`;
        }
    }).join("");

    tbody.innerHTML = rowHtml;
}
export function renderHeader(state){
    if (lastAuthUser === state.auth.user){
        return;
    }
    lastAuthUser = state.auth.user;
    const header = document.querySelector("header");
    if (state.auth.user){
        if (state.auth.user.role.toLowerCase() === "admin"){
          header.innerHTML =   `        <span class="logo">
            <a href="events.html"><img alt="FIT logo" src="../icons/FIT_icon.png">&nbsp;& JunkoTeam</a></span>
        <nav class="navbar_header">
            <ul>
                <li><a href="events.html">Events</a></li>
                <li><a href="users.html">Users</a></li>
                <li><a href="myRegistrations.html">My Registrations</a></li>
                <li><a id="logout">Logout</a></li>
            </ul>
        </nav>`
        }else{
            header.innerHTML = `        <span class="logo">
            <a href="events.html"><img alt="FIT logo" src="../icons/FIT_icon.png">&nbsp;& JunkoTeam</a></span>
        <nav class="navbar_header">
            <ul>
                <li><a href="events.html">Events</a></li>
                <li><a href="myRegistrations.html">My Registrations</a></li>
                <li><a id="logout">Logout</a></li>
            </ul>
        </nav>`
        }
    }else {
        header.innerHTML = `      <span class="logo">
            <a href="events.html"><img alt="FIT logo" src="../icons/FIT_icon.png">&nbsp;& JunkoTeam</a></span>
        <nav class="navbar_header">
            <ul>
                <li><a href="login.html?redirect=${encodeURIComponent(window.location.pathname)}">Login</a></li>
                <li><a href="registration.html">Registration</a></li>
            </ul>
        </nav>`
    }
    requestAnimationFrame(() => {
        header.querySelector("nav").classList.add("visible");
    });
}
export function renderWelcome(state){
    const h1 = document.querySelector("#header_h1");
    let welcome = document.querySelector("#welcome_msg");

    if (state.auth.user) {
        if (!welcome) {
            welcome = document.createElement("p");
            welcome.id = "welcome_msg";
            h1.insertAdjacentElement("afterend", welcome);
            welcome.style.textAlign = "center";
            welcome.style.marginBottom = "20px";
            welcome.style.fontSize = "1.2em";
        }
        welcome.textContent = `Вітаємо, ${state.auth.userInfo?.name || "користувачу"}!`;
    } else {
        if (welcome) welcome.remove();
    }
}
function renderEventsThead(state) {
    const thead = document.querySelector(".register_table_head");
    if (state.auth.user){
        if (state.auth.user.role.toLowerCase() === "admin"){
            thead.innerHTML = `           <tr>
                        <th>Номер</th>
                        <th>Назва</th>
                        <th>Дата</th>
                        <th>Локація</th>
                        <th>К-сть чоловік</th>
                        <th>Опис</th>
                        <th>Видалити</th>
                        <th>Редагувати/Зберегти</th>
                    </tr>`
        }else{
            thead.innerHTML = ` <tr>
                        <th>Номер</th>
                        <th>Назва</th>
                        <th>Дата</th>
                        <th>Локація</th>
                        <th>К-сть чоловік</th>
                        <th>Опис</th>
                        <th>Реєстрація</th>
                        </tr>    `
        }
    }else{
        thead.innerHTML = ` <tr>
                        <th>Номер</th>
                        <th>Назва</th>
                        <th>Дата</th>
                        <th>Локація</th>
                        <th>К-сть чоловік</th>
                        <th>Опис</th>
                        </tr>    `
    }
}

function renderEventsForm(state) {
    const form = document.querySelector(".form_container");
    const table = document.querySelector(".table_container");
    if (state.auth.user){
        if (state.auth.user.role.toLowerCase() === "admin"){
            form.classList.remove("hidden");

            if (Object.keys(state.events.form.touched).length === 0) {
                const fields = ["name", "date", "location", "capacity", "description"];
                fields.forEach(field => {
                    const input = document.getElementById(`register-form_${field}`);
                    if (input) input.value = "";
                });
            }
        }else{
            form.classList.add("hidden");
        }
    }else{
        form.classList.add("hidden");
    }
}

function renderEventsFormErrors(state) {
    let fields = ["name", "date", "location", "capacity"];
    let submit_btn = document.querySelector(".register-form_button_submit button");
    fields.forEach(field => {
        let el = document.getElementById(`${field}_error`);
        let input = document.getElementById(`register-form_${field}`);
        const message = state.form.touched[`${field}`] ? state.form.errors[field] ?? "": "";
        el.textContent = message;
        message? input.classList.add("invalid") : input.classList.remove("invalid");
        if (message) {
            el.classList.add("visible");
        } else {
            el.classList.remove("visible");
        }
    });
    submit_btn.disabled = !state.form.isValid;
}
function renderEventsTableErrors(state) {
    if (!state.ui.editErrors) return;
    if (!state.ui.editingId) return;
    let fields = ["name", "date", "location", "capacity", "description"];
    let cellsEditing = document.querySelectorAll(`td[data-id="${state.ui.editingId}"][contenteditable="true"]`);
    if (!cellsEditing.length) return;
    fields.forEach((field,index) => {
        let el = cellsEditing[index];
        if (state.ui.editErrors[field] === false){
            el.classList.add("error-cell");
        }else {
            el.classList.remove("error-cell");
        }
    })
}










