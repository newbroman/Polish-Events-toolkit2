/**
 * time-logic.js - Modern Polish Time Logic
 */

// We use these endings for "O godzinie..." and "Wpół do..."
const hoursFeminine = [
    "północy",    // 0
    "pierwszej",  // 1
    "drugiej",    // 2
    "trzeciej",   // 3
    "czwartej",   // 4
    "piątej",     // 5
    "szóstej",    // 6
    "siódmej",    // 7
    "ósmej",      // 8
    "dziewiątej", // 9
    "dziesiątej", // 10
    "jedenastej", // 11
    "dwunastej"   // 12
];

export function getPolishTimeStrings(hrs, mins, isFormal) {
    let h = parseInt(hrs) % 12;
    if (h === 0 && parseInt(hrs) !== 0) h = 12; 
    const m = parseInt(mins);

    let polish = "";
    let english = "";

    // HALF PAST LOGIC (The most important Polish rule)
    if (m === 30) {
        const nextH = (h + 1) > 12 ? 1 : (h + 1);
        const hourWord = hoursFeminine[nextH === 12 ? 12 : nextH];
        
        // "Wpół do..." is used for both Formal and Informal usually
        polish = `Wpół do ${hourWord}`;
        english = `Half past ${h} (Half to ${nextH})`;
    } 
    // FULL HOUR LOGIC
    else if (m === 0) {
        const hourWord = hoursFeminine[h];
        polish = isFormal ? `Godzina ${hourWord}` : `O godzinie ${hourWord}`;
        english = isFormal ? `It is ${h} o'clock` : `At ${h} o'clock`;
    } 
    // DIGITAL FALLBACK (For all other minutes)
    else {
        polish = isFormal ? `Jest ${hrs}:${mins}` : `O ${hrs}:${mins}`;
        english = isFormal ? `It is ${hrs}:${mins}` : `At ${hrs}:${mins}`;
    }

    return { polish, english };
}
