
export function validateEventsForm(form){
    const errors = {};
    const name = form.values.name.trim();
    if (form.touched["name"] && name ===""){
        errors.name = "Поле не може бути порожнім!";
    }
    const date = form.values.date.trim();
    console.log("DATE:", date);
    if (form.touched["date"] && date ==="") {
        errors.date = "Поле не може бути порожнім або дата некоректна!";
    } else if (form.touched["date"]) {
        const text = form.values.date.trim();
        const m = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!m) {
            errors.date = "Неправильна дата!";
        } else {
            const y = Number(m[1]);
            const mo = Number(m[2]);
            const d = Number(m[3]);
            const selected = new Date(Date.UTC(y, mo - 1, d));
            const todayUTC = new Date();
            todayUTC.setUTCHours(0, 0, 0, 0);
            if (selected.getTime() < todayUTC.getTime()) {
                errors.date = "Не можна планувати на минуле!";
            }
        }
    }
    const location = form.values.location.trim();
    if (form.touched["location"] && location ===""){
        errors.location = "Поле не може бути порожнім!";
    }
    const capacity = form.values.capacity;
    if (form.touched["capacity"] && capacity ===""){
        errors.capacity = "Поле не може бути порожнім або Ви ввели не правильне число!";
    }else if (form.touched["capacity"]){
        const capacity = Number(form.values.capacity);
        if (Number.isNaN(capacity) || capacity < 1 || capacity > 200) {
            errors.capacity = "Число має бути в діапазоні 1–200.";
        }
    }
    console.log(errors)
    return errors;
}
export function validateUsersForm(form) {
    const errors = {};
    const name = (form.values.name ?? "").trim();
    const email = (form.values.email ?? "").trim();
    const password = (form.values.password ?? "");
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (form.touched["name"] && name === "") {
        errors.name = "Поле не може бути порожнім!";
    }
    if (form.touched["email"] && email === "") {
        errors.email = "Поле не може бути порожнім!"
    } else if (form.touched["email"] && emailRegex.test(form.values.email.trim()) === false) {
        errors.email = "Пошта введена не вірно!"
    }
    if (form.touched["password"] && password === ""){
        errors.password = "Поле не може бути порожнім"
    }else if (form.touched["password"] && (password.length < 8 || password.length > 50)){
        errors.password = "Пароль має менше ніж 8 символів або більше ніж 50!"
    }
    return errors;
}
export function validateLoginForm(form) {
    const errors = {};
    const email = (form.values.email ?? "").trim();
    const password = (form.values.password ?? "");
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (form.touched["email"] && email === "")  {
        errors.email = "Поле не може бути порожнім!"
    } else if (form.touched["email"] && emailRegex.test(form.values.email.trim()) === false) {
        errors.email = "Пошта введена не вірно!"
    }
    if (form.touched["password"] && password === ""){
        errors.password = "Поле не може бути порожнім"
    }else if (form.touched["password"] && (password.length < 8 || password.length > 50)){
        errors.password = "Пароль має менше ніж 8 символів або більше ніж 50!"
    }
    return errors;
}
export function validateRegistrationForm(form) {
    const errors = {};
    const email = (form.values.email ?? "").trim();
    const name = (form.values.name ?? "").trim();
    const password = (form.values.password ?? "");
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (form.touched["name"] && name === "")  {
        errors.name = "Поле не може бути порожнім!"
    }else if (form.touched["name"] && (name.length < 3 || name.length > 50)){
        errors.name = "Мало або багато символів"
    }
    if (form.touched["email"] && email === "")  {
        errors.email = "Поле не може бути порожнім!"
    } else if (form.touched["email"] && emailRegex.test(form.values.email.trim()) === false) {
        errors.email = "Пошта введена не вірно!"
    }
    if (form.touched["password"] && password === ""){
        errors.password = "Поле не може бути порожнім"
    }else if (form.touched["password"] && (password.length < 8 || password.length > 50)){
        errors.password = "Пароль має менше ніж 8 символів або більше ніж 50!"
    }
    return errors;
}
export function validateEditUsersTable(values) {
    let validationObj = {};
    let fields = ["name", "email"];
    for (const field of fields) {
        const v = (values[field] ?? "").toString().trim();
        validationObj[field] = v !== "" && v.length <= 50;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (validationObj.email !== false && emailRegex.test(values.email) === false) {
        validationObj.email = false;
    }
    return validationObj;
}

 export function validateEditEventsTable(values){
    let validationObj = {};
    let fields = ["name", "date", "location", "capacity", "description"];
     for (const field of fields) {
         console.log("FIELD:", values[field]);
         const v = (values[field] ?? "").toString().trim();
         validationObj[field] = v !== "" && v.length <= 50;
     }
     const text = (values.date ?? "").trim();
     let validDate = false;

         const [yyyy, mm, dd] = text.split("-").map(Number);
         const d = new Date(Date.UTC(yyyy, mm - 1, dd));
         validDate = !isNaN(d.getTime()) &&
             d.getUTCFullYear() === yyyy &&
             d.getUTCMonth() === mm - 1 &&
             d.getUTCDate() === dd;
         const todayUTC = new Date();
         todayUTC.setUTCHours(0, 0, 0, 0);
         validDate = validDate && d.getTime() >= todayUTC.getTime();
         console.log("DATE FINAL VALIDATION:", validDate);

     if (!validDate) validationObj.date = false;

     if (validationObj.capacity !== false) {
         const c = Number(values.capacity);
         if (!Number.isFinite(c) || c < 1 || c > 200) {
             validationObj.capacity = false;
         }
     }
     return validationObj;
}
