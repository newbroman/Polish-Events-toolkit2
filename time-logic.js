/**
 * time-logic.js - Merged Logic
 */

// Nominative: Used for "Godzina..." (Formal/Startup Default)
const hoursNominative = [
    "północ",      // 0
    "pierwsza",    // 1
    "druga",       // 2
    "trzecia",     // 3
    "czwarta",     // 4
    "piąta",       // 5
    "szósta",      // 6
    "siódma",      // 7
    "ósma",        // 8
    "dziewiąta",   // 9
    "dziesiąta",   // 10
    "jedenasta",   // 11
    "dwunasta"     // 12
];

// Locative/Genitive: Used for "O godzinie..." and "Wpół do..." (Informal/Meeting Toggle)
const hoursLocative = [
    "północy",     // 0
    "pierwszej",   // 1
    "drugiej",     // 2
    "trzeciej",    // 3
    "czwartej",    // 4
    "piątej",      // 5
    "szóstej",     // 6
    "siódmej",     // 7
    "ósmej",       // 8
    "dziewiątej",  // 9
    "dziesiątej",  // 10
    "jedenastej",  // 11
    "dwunastej"    // 12
];

/**
 * hrs: "00"-"23" (from time picker)
 * mins: "00"-"59"
 * isFormal: true (It is...) / false (At/Meeting...)
 */
export function getPolishTimeStrings(hrs, mins, isFormal) {
    let h24 = parseInt(hrs);
    let h12 = h24 % 12;
    const m = parseInt(mins);

    // 1. HALF PAST LOGIC ("Wpół do...")
    // Note: Polish time "Wpół do" is always informal/relative by nature
    if (m === 30) {
        const nextH = (h12 + 1) > 12 ? 1 : (h12 + 1);
        const hourWord = hoursLocative[nextH]; 
        
        return {
            polish: `Wpół do ${hourWord}`,
            english: `Half past ${h12 === 0 ? 12 : h12} (Half to ${nextH})`
        };
    } 
    
    // 2. FULL HOUR LOGIC
    if (m === 0) {
        // If Formal: Godzina pierwsza (1:00)
        // If Informal: O godzinie pierwszej (At 1:00)
        return {
            polish: isFormal ? `Godzina ${hoursNominative[h12]}` : `O godzinie ${hoursLocative[h12]}`,
            english: isFormal ? `It is ${h12 === 0 ? 12 : h12} o'clock` : `At ${h12 === 0 ? 12 : h12} o'clock`
        };
    }

    // 3. DIGITAL FALLBACK (For all other minutes)
    // "Jest 13:45" vs "O 13:45"
    return {
        polish: isFormal ? `Jest ${hrs}:${mins}` : `O ${hrs}:${mins}`,
        english: isFormal ? `It is ${hrs}:${mins}` : `At ${hrs}:${mins}`
    };
}
