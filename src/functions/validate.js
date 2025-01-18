export const validateFirstName = (value) => {
    value = value.trim();
    let errMsg = "";
    let err = true;
    const nameRegex = /^[A-ZĄĆĘŁŃÓŚŻŹa-ząćęłńóśżź'-]+$/;

    if (value.length === 0) {
        errMsg = "Wprowadź imię";
    } else if (!nameRegex.test(value)) {
        errMsg += "W imieniu znajdują się niepoprawne znaki. ";
    } else if (value.length < 3) {
        errMsg += "Imię jest za krótkie.";
    } else {
        err = false;
    }
    return { err, errMsg };
};

export const validateSecondName = (value) => {
    value = value.trim();
    let errMsg = "";
    let err = true;
    const nameRegex = /^[A-ZĄĆĘŁŃÓŚŻŹa-ząćęłńóśżź'-]+$/;

    if (value.length === 0) {
        errMsg = "Wprowadź nazwisko";
    } else if (!nameRegex.test(value)) {
        errMsg += "W nazwisku znajdują się niepoprawne znaki. ";
    } else if (value.length < 2) {
        errMsg += "Nazwisko jest za krótkie.";
    } else {
        err = false;
    }
    return { err, errMsg };
};

export const validateEmail = (value) => {
    value = value.trim();
    let errMsg = "";
    let err = true;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(value)) {
        errMsg = "Adres e-mail jest niepoprawny.";
    } else {
        err = false;
    }
    return { err, errMsg };
};

export const validatePassword = (value) => {
    let errMsg = "";
    let err = true;
    const passwordRegex = /^(?=.*\d).{8,}$/;

    if (!passwordRegex.test(value)) {
        errMsg = "Hasło musi mieć przynajmniej 8 znaków i zawierać co najmniej jedną cyfrę.";
    } else {
        err = false;
    }

    return { err, errMsg };
};

export const validateCheckPassword = (password, checkPassword) => {
    let errMsg = "";
    let err = true;
    if (password !== checkPassword) {
        errMsg = "Hasła nie są identyczne!";
    } else {
        err = false;
    }
    return { err, errMsg };
};

export const validateHourlyRate = (value) => {
    let errMsg = "";
    let err = true;
    const rate = parseFloat(value);

    if (isNaN(rate) || rate <= 0) {
        errMsg = "Podaj poprawną stawkę godzinową (liczba dodatnia).";
    } else {
        err = false;
    }
    return { err, errMsg };
};

export const validateSubjects = (value) => {
    let errMsg = "";
    let err = true;

    if (!value || value.trim().length === 0) {
        errMsg = "Wprowadź przynajmniej jeden przedmiot.";
    } else if (value.split(',').length === 0) {
        errMsg = "Przedmioty muszą być oddzielone przecinkami.";
    } else {
        err = false;
    }
    return { err, errMsg };
};

export const validate = (registerData) => {
    let err = false;
    let errMsgs = {
        firstName: validateFirstName(registerData.firstName).errMsg,
        secondName: validateSecondName(registerData.secondName).errMsg,
        email: validateEmail(registerData.email).errMsg,
        password: validatePassword(registerData.password).errMsg,
        checkPassword: validateCheckPassword(registerData.password, registerData.checkPassword).errMsg,
        hourlyRate: registerData.hourlyRate !== undefined ? validateHourlyRate(registerData.hourlyRate).errMsg : "",
        subjects: registerData.subjects !== undefined ? validateSubjects(registerData.subjects).errMsg : "",
    };

    if (
        validateFirstName(registerData.firstName).err ||
        validateSecondName(registerData.secondName).err ||
        validateEmail(registerData.email).err ||
        validatePassword(registerData.password).err ||
        validateCheckPassword(registerData.password, registerData.checkPassword).err ||
        (registerData.hourlyRate !== undefined && validateHourlyRate(registerData.hourlyRate).err) ||
        (registerData.subjects !== undefined && validateSubjects(registerData.subjects).err)
    ) {
        err = true;
    }

    return { err, errMsgs };
};
export const validateLessonData = (lessonData) => {
    let err = false;
    let errMsgs = {
      subject: "",
      studentId: "",
      lessonDate: "",
      lessonTime: "",
      price: "",
    };
  
    if (!lessonData.subject || lessonData.subject.trim().length < 3) {
      errMsgs.subject = "Przedmiot musi mieć co najmniej 3 znaki.";
      err = true;
    }
    if (!lessonData.lessonDate) {
      errMsgs.lessonDate = "Podaj datę lekcji.";
      err = true;
    }
    if (!lessonData.lessonTime) {
      errMsgs.lessonTime = "Podaj godzinę lekcji.";
      err = true;
    }
    const price = parseFloat(lessonData.price);
    if (isNaN(price) || price <= 0) {
      errMsgs.price = "Cena musi być liczbą większą niż 0.";
      err = true;
    }
  
    return { err, errMsgs };
  };
  