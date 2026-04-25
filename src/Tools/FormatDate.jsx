/**
 * Formats a JavaScript Date object into the string displayed on the page
 * (e.g., "apr 5th at 3 PM" or "apr 5th at 3:07 PM").
 *
 * @param {Date} date - The date object to format.
 * @returns {string} A formatted date string with month, ordinal day, and time.
 */
/**
 * Converts a date string in the format "DD/MM/YY, HH:MM AM/PM"
 * (e.g., "26/03/26, 05:26 AM") into a formatted string
 * like "mar 26th at 5:26 AM".
 *
 * @param {string} dateString - The input date string.
 * @returns {string} A formatted date string with month, ordinal day, and time.
 */
export default function formatDate(dateString) {
    const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

    const getOrdinal = (n) => {
        if (n > 3 && n < 21) return "th";
        switch (n % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    };

    const [datePart, timePartRaw] = dateString.split(",");

    const [dayStr, monthStr] = datePart.trim().split("/");
    const day = parseInt(dayStr, 10);
    const monthIndex = parseInt(monthStr, 10) - 1;

    const timePart = timePartRaw.replace(/\u202F/g, " ").trim();

    let [time, ampm] = timePart.split(" ");
    let [hoursStr, minutesStr] = time.split(":");

    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    hours = hours % 12 || 12;

    const suffix = getOrdinal(day);

    const formattedTime = minutes === 0
        ? `${hours} ${ampm}`
        : `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;

    return `${months[monthIndex]} ${day}${suffix} at ${formattedTime}`;
}