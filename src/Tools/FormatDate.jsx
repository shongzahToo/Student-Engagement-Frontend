export default function formatDate(date) {
    const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

    const getOrdinal = (n) => {
        if (n > 3 && n < 21) return "th";
        switch (n % 10) {case 1: return "st"; case 2: return "nd"; case 3: return "rd"; default: return "th";
        }
    };

    const month = months[date.getMonth()];
    const day = date.getDate();
    const suffix = getOrdinal(day);

    let hours = date.getHours();
    const minutes = date.getMinutes();

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    const time = minutes === 0
        ? `${hours} ${ampm}`
        : `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;

    return `${month} ${day}${suffix} at ${time}`;
}