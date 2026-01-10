/**
 * time-logic.js - Modern Polish Time Logic
 */

// Nominative: used for "Godzina..." (Formal/Startup)
const hoursNominative = [
    "północ", "pierwsza", "druga", "trzecia", "czwarta", 
    "piąta", "szósta", "siódma", "ósma", "dziewiąta", 
    "dziesiąta", "jedenastej", "dwunasta"
];

// Locative: used for "O godzinie..." and "Wpół do..." (Informal/Toggle)
const hoursLocative = [
    "północy", "pierwszej", "drugiej", "trzeciej", "czwartej", 
    "piątej", "szóstej", "siódmej", "ósmej", "dziewiątej", 
    "dziesiątej", "jedenastej", "dwunastej"
];

export function getPolishTimeStrings(hrs, mins, isFormal) {
    let h = parseInt(hrs) % 12;
    // Handle 12:xx or 00:xx correctly (index 0 is midnight/północ)
    const m = parseInt(mins);

    // 1. HALF PAST LOGIC (The "Forward-looking" rule)
    if (m === 30) {
        const nextH = (h + 1) > 12 ? 1 : (h + 1);
        const hourWord = hoursLocative[nextH]; 
        return {
            polish: `Wpół do ${hourWord}`,
            english: `Half past ${h === 0 ? 12 : h} (Half to ${nextH})`
        };
    }
