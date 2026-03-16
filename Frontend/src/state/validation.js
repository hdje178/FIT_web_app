
export function validateForm(form){
    const errors = {};
    const name = form.values.name.trim();
    if (form.touched["name"] && name ===""){
        errors.name = "Поле не може бути порожнім!";
    }
    const date = form.values.date.trim();
    if (form.touched["date"] && date ==="") {
        errors.date = "Поле не може бути порожнім або дата некоректна!";
    }else if (form.touched["date"]) {
        const date_for_check = new Date(date);
        const now = new Date()
        if (isNaN(date_for_check.getTime())) {
            errors.date = "Неправильна дата!";
        }
        if (date_for_check < now) {
            errors.date = "Не можна планувати на минуле!";
        }
    }
    const locate = form.values.location.trim();
    if (form.touched["location"] && locate ===""){
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

// VALIDATE EDIT TABLE FUNCTION

 export function validateEditTable(values){
    let validationObj = {};
    let fields = ["name", "date", "location", "capacity", "description"];
    fields.forEach(field => {
        validationObj[field] = (!(values[field] === "") && !(values[field].length > 50));
    })
     if (validationObj[fields[1]] !== false) {
         let date = new Date(values["date"]);
         if (isNaN(date.getTime())) {
             validationObj[fields[1]] = false;
         }
     }
     if (validationObj[fields[3]] !== false) {
         if(Number(values["capacity"]) <= 0 || (Number(values["capacity"]) > 200) || (!isFinite(values["capacity"]))) {
             validationObj[fields[3]] = false;
         }
     }

     return validationObj;
}
