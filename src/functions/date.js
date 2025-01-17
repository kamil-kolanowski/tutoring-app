export const getDate = () => {
    const today = new Date();
    const day = today.getDate();
    const monthNames = [
        "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
        "lipca", "sierpnia", "września", "października", "listopada", "grudnia"
    ];
    const month = monthNames[today.getMonth()];
    const year = today.getFullYear();
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const showTime = `${hours}:${minutes}`;
    return `${day}. ${month} ${year}r, godzina: ${showTime}`;
};

export const formatDate = (dateString) => {
    const [day, month, year] = dateString.split('-');

    const formattedDate = new Date(`${year}-${month}-${day}`);

    if (isNaN(formattedDate.getTime())) {
        console.error("Błędny format daty:", dateString);
        return "Nieprawidłowa data";
    }

    const formattedDay = String(formattedDate.getDate()).padStart(2, '0');
    const formattedMonth = String(formattedDate.getMonth() + 1).padStart(2, '0');
    const formattedYear = formattedDate.getFullYear();

    return `${formattedDay}.${formattedMonth}.${formattedYear}`;
};

