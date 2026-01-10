/**
 * time-logic.js - Merged Logic (No Kwadrans)
 */

const hoursNominative = [
    "północ", "pierwsza", "druga", "trzecia", "czwarta", "piąta", 
    "szósta", "siódma", "ósma", "dziewiąta", "dziesiąta", "jedenasta", "dwunasta"
];

const hoursLocative = [
    "północy", "pierwszej", "drugiej", "trzeciej", "czwartej", "piątej", 
    "szóstej", "siódmej", "ósmej", "dziewiątej", "dziesiątej", "jedenastej", "dwunastej"
];

export function getPolishTimeStrings(hrs, mins, isFormal) {
    let h24 = parseInt(hrs);
    let h12 = h24 % 12;
    const m = parseInt(mins);

    // 1. HALF PAST LOGIC ("Wpół do...")
    if (m === 30) {
        const nextH = (h12 + 1) > 12 ? 1 : (h12 + 1);
        const hourWord = hoursLocative[nextH]; 
        
        // Handling the display for 12:30 specifically for the English helper
        const currentHDisplay = (h12 === 0) ? 12 : h12;
        
        return {
            polish: `Wpół do ${hourWord}`,
            english: `Half past ${currentHDisplay} (Half to ${nextH})`
        };
    } 
    
    // 2. FULL HOUR LOGIC
    if (m === 0) {
        // Map 0 to index 0 (północ) or 12 (dwunasta) as needed
        const hourIndex = (h24 === 0 || h24 === 12) ? (h24 === 0 ? 0 : 12) : h12;
        
        return {
            polish: isFormal ? `Godzina ${hoursNominative[hourIndex]}` : `O godzinie ${hoursLocative[hourIndex]}`,
            english: isFormal ? `It is ${h12 === 0 ? 12 : h12} o'clock` : `At ${h12 === 0 ? 12 : h12} o'clock`
        };
    }

    // 3. DIGITAL FALLBACK (Strictly no kwadrans)
    return {
        polish: isFormal ? `Jest ${hrs}:${mins}` : `O ${hrs}:${mins}`,
        english: isFormal ? `It is ${hrs}:${mins}` : `At ${hrs}:${mins}`
    };
}
