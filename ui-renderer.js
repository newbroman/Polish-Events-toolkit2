/**
 * ui-renderer.js - Fixed Structure
 */
import { getWrittenDay, getPhoneticDay, getYearPolish, getYearPhonetic } from './numbers.js';
import phonetics from './phonetics.js';
import holidayData from './holiday.js';

/**
 * Bridges the Formal/Informal toggle with Time Logic
 * This is now a top-level export to fix the SyntaxError.
 */
export function getPolishTimeStrings(hours, minutes, isMeetingMode) {
    const hNom = ["północ", "pierwsza", "druga", "trzecia", "czwarta", "piąta", "szósta", "siódma", "ósma", "dziewiąta", "dziesiąta", "jedenasta", "południe", "trzynasta", "czternasta", "piętnasta", "szesnasta", "siedemnasta", "osiemnasta", "dziewiętnasta", "dwudziesta", "dwudziesta pierwsza", "dwudziesta druga", "dwudziesta trzecia"];
    const hGen = ["północy", "pierwszej", "drugiej", "trzeciej", "czwartej", "piątej", "szóstej", "siódmej", "ósmej", "dziewiątej", "dziesiątej", "jedenastej", "południa", "trzynastej", "czternastej", "piętnastej", "szesnastej", "siedemnastej", "osiemnastej", "dziewiętnastej", "dwudziestej", "dwudziestej pierwszej", "dwudziestej drugiej", "dwudziestej trzeciej"];
    const mAll = ["zero", "jedna", "dwie", "trzy", "cztery", "pięć", "sześć", "siedem", "osiem", "dziewięć", "dziesięć", "jedenaście", "dwanaście", "trzynaście", "czternaście", "piętnaście", "szesnaście", "siedemnaście", "osiemnaście", "dziewiętnaście", "dwadzieścia", "dwadzieścia jeden", "dwadzieścia dwie", "dwadzieścia trzy", "dwadzieścia cztery", "dwadzieścia pięć", "dwadzieścia sześć", "dwadzieścia siedem", "dwadzieścia osiem", "dwadzieścia dziewięć", "trzydzieści", "trzydzieści jeden", "trzydzieści dwie", "trzydzieści trzy", "trzydzieści cztery", "trzydzieści pięć", "trzydzieści sześć", "trzydzieści siedem", "trzydzieści osiem", "trzydzieści dziewięć", "czterdzieści", "czterdzieści jeden", "czterdzieści dwie", "czterdzieści trzy", "czterdzieści cztery", "czterdzieści pięć", "czterdzieści sześć", "czterdzieści siedem", "czterdzieści osiem", "czterdzieści dziewięć", "pięćdziesiąt", "pięćdziesiąt jeden", "pięćdziesiąt dwie", "pięćdziesiąt trzy", "pięćdziesiąt cztery", "pięćdziesiąt pięć", "pięćdziesiąt sześć", "pięćdziesiąt siedem", "pięćdziesiąt osiem", "pięćdziesiąt dziewięć"];

    let polish = "";
    let english = "";

    if (isMeetingMode) {
        if (minutes === 0) {
            polish = `O ${hGen[hours]}`;
            english = `At ${hours % 12 || 12} o'clock`;
        } else if (minutes < 30) {
            polish = `${mAll[minutes]} po ${hGen[hours % 12]}`;
            english = `${minutes} past ${hours % 12 || 12}`;
        } else if (minutes === 30) {
            polish = `Wpół do ${hGen[(hours + 1) % 12]}`;
            english = `Half past ${hours % 12 || 12}`;
        } else {
            let diff = 60 - minutes;
            polish = `Za ${mAll[diff]} ${hNom[(hours + 1) % 12]}`;
            english = `${diff} to ${(hours + 1) % 12 || 12}`;
        }
    } else {
        polish = `Godzina ${hNom[hours]} ${minutes.toString().padStart(2, '0')}`;
        english = `It is ${hours}:${minutes.toString().padStart(2, '0')}`;
    }
    return { polish, english };
}

export function updateInfoPanel(selectedDate, includeYear, isFormal) {
    const plDisplay = document.getElementById('plPhrase');
    const enDisplay = document.getElementById('enPhrase');
    const phoneticDisplay = document.getElementById('phoneticPhrase');
    const holidayDisplay = document.getElementById('holidayName'); 
    const footer = document.querySelector('.info-panel');

    if (!selectedDate || !plDisplay) return;

    const day = selectedDate.getDate();
    const monthIndex = selectedDate.getMonth();
    const year = selectedDate.getFullYear();

    if (footer) {
        footer.classList.toggle('formal-theme', isFormal);
        footer.classList.toggle('informal-theme', !isFormal);
    }

    const monthNamesEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthKeysPl = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
    
    const currentMonthKey = monthKeysPl[monthIndex];
    const monthPhonetic = phonetics.months[currentMonthKey]; 
    const monthEn = monthNamesEn[monthIndex];

    const daySpelling = getWrittenDay(day, isFormal);      
    const dayPhonetic = getPhoneticDay(day, isFormal);

    const capitalizedDaySpelling = daySpelling.charAt(0).toUpperCase() + daySpelling.slice(1);
    const capitalizedDayPhonetic = dayPhonetic.charAt(0).toUpperCase() + dayPhonetic.slice(1);
    
    let fullPl = `${capitalizedDaySpelling} ${currentMonthKey}`;
    let fullEn = `${monthEn} ${day}${getEnglishSuffix(day)}`;
    let fullPhonetic = `${capitalizedDayPhonetic} ${monthPhonetic}`;

   if (includeYear) {
       const yearSpelling = getYearPolish(year, isFormal);
       const yearPhonetic = getYearPhonetic(year, isFormal);
       const suffixPl = isFormal ? "rok" : "roku";
       const suffixPhonetic = isFormal ? "rok" : "ro-koo";

       fullPl += ` ${yearSpelling} ${suffixPl}`;
       fullEn += `, ${year}`;
       fullPhonetic += ` ${yearPhonetic} ${suffixPhonetic}`;
   }

    const holidays = holidayData.getHolidaysForYear(year);
    const holidayKey = `${monthIndex}-${day}`;
    
    if (holidayDisplay) {
        if (holidays[holidayKey]) {
            holidayDisplay.innerText = `🎉 ${holidays[holidayKey]}`;
            holidayDisplay.style.display = "block";
        } else {
            holidayDisplay.style.display = "none";
        }
    }

    plDisplay.innerText = fullPl.trim();
    enDisplay.innerText = fullEn.trim();
    phoneticDisplay.innerText = fullPhonetic.trim();
}

function getEnglishSuffix(i) {
    const j = i % 10, k = i % 100;
    if (j == 1 && k != 11) return "st";
    if (j == 2 && k != 12) return "nd";
    if (j == 3 && k != 13) return "rd";
    return "th";
}

export function speakPolish() {
    const text = document.getElementById('plPhrase').innerText;
    if (!text || text === "Wybierz datę") return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pl-PL';
    utterance.rate = 0.85; 
    window.speechSynthesis.speak(utterance);
}
