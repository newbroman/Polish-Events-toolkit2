/**
 * time-logic.js - Modern Polish Time Logic
 */

// Nominative: Used for "Godzina..." (Formal/Startup Default)
// These end in -a (naming the hour)
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
// These end in -ej (specifying the point in time)
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

export function getPolishTimeStrings(hrs, mins, isFormal) {
    let h = parseInt(hrs) % 12;
    // Note: index 0 in our arrays is 'północ' (midnight)
    const m = parseInt(mins);

    // 1. HALF PAST LOGIC (The "Wpół do..." rule)
    if (m === 30) {
        // Polish looks ahead to the NEXT hour
        const nextH = (h + 1) > 12 ? 1 : (h + 1);
        const hourWord = hoursLocative[nextH]; 
        
        return {
            polish: `Wpół do ${hourWord}`,
            english: `Half past ${h === 0 ? 12 : h} (Half to ${nextH})`
        };
    } 
    
    // 2. FULL HOUR LOGIC
    if (m === 0) {
        return {
            polish: isFormal ? `Godzina ${hoursNominative[h]}` : `O godzinie ${hoursLocative[h]}`,
            english: isFormal ? `It is ${h === 0 ? 12 : h} o'clock` : `At ${h === 0 ? 12 : h} o'clock`
        };
    }

    // 3. DIGITAL FALLBACK (For all other minutes)
    return {
        polish: isFormal ? `Jest ${hrs}:${mins}` : `O ${hrs}:${mins}`,
        english: isFormal ? `It is ${hrs}:${mins}` : `At ${hrs}:${mins}`
    };
}
