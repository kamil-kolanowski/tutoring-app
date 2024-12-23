
export const validateFirstName = (value) => {
    value = value.trim();
    let errMsg = ""
    let err = true
    const nameRegex = /^[A-ZĄĆĘŁŃÓŚŻŹa-ząćęłńóśżź'-]+$/;

    if ((value.length === 0)) {
        errMsg = "Wprowadź imię";
    }

    else if (!nameRegex.test(value)) {
        errMsg += "W imieniu znajdują się niepoprawne znaki. ";
    }

    else if (value.length < 3) {
        errMsg += "Imię jest za krótkie."
    }

    else {
        err = false
    }
    return {err, errMsg}
}
export const validateSecondName = (value) => {
    value = value.trim();
    let errMsg = ""
    let err = true
    const nameRegex = /^[A-ZĄĆĘŁŃÓŚŻŹa-ząćęłńóśżź'-]+$/;

    if ((value.length === 0)) {
        errMsg = "Wprowadź nazwisko";
    }

    else if (!nameRegex.test(value)) {
        errMsg += "W nazwisku znajdują się niepoprawne znaki. ";
    }

    else if (value.length < 2) {
        errMsg += "Nazwisko jest za krótkie."
    }

    else {
        err = false
    }
    return {err, errMsg}
}

export const validateEmail = (value) => {
    value = value.trim();
    let errMsg = ""
    let err = true
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(value)) {
        errMsg = "Adres e-mail jest niepoprawny."
    }
    else {
        err = false
    }
    return {err, errMsg}
}


export const validatePassword = (value) => {
    let errMsg = "";
    let err = true
    const passwordRegex = /^(?=.*\d).{8,}$/;

    if (!passwordRegex.test(value)) {
        errMsg = "Hasło musi mieć przynajniej 8 znaków i zawierać co najmniej jedną cyfrę. "
    } else {
        err = false
    }

    return {err, errMsg}
}

const validateCheckPassword = (password, checkPassword) => {
    let errMsg = "";
    let err = true
    if (password !== checkPassword) {
        errMsg = "Hasła nie są identyczne!"
    } else {
        err = false
    }
    return {err, errMsg}
}

export const validate = (registerData) => {

    let err = false
    let errMsgs = {
      firstName: validateFirstName(registerData.firstName).errMsg,
      secondName: validateSecondName(registerData.secondName).errMsg,
      email: validateEmail(registerData.email).errMsg,
      password: validatePassword(registerData.password).errMsg,
      checkPassword: validateCheckPassword(registerData.password, registerData.checkPassword).errMsg, 
    }
    if (validateFirstName(registerData.firstName).err || validateSecondName(registerData.secondName).err || validateEmail(registerData.email).err || validatePassword(registerData.password).err || validateCheckPassword(registerData.password, registerData.checkPassword).err) {
        err = true
    }

    return {err, errMsgs}
}