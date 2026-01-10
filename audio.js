/**
 * audio.js - Integrated with Mobile Fixes & Sentence Logic
 */
import phonetics from './phonetics.js';

let audioUnlocked = false;

/**
 * 1. UNLOCKING & CHROME FIXES
 */
export function checkVoices(onReady) {
    if ('speechSynthesis' in window) {
        // Chrome fix: voiceschanged is required to populate the list
        if (speechSynthesis.getVoices().length > 0) {
            onReady();
        } else {
            speechSynthesis.onvoiceschanged = onReady;
        }
    }
}

/**
 * Mobile Fix: Call this on the first user interaction (click/touch)
 * to unlock audio on iOS and Android Chrome.
 */
export function unlockAudio() {
    if (audioUnlocked) return;
    const utterance = new SpeechSynthesisUtterance("");
    utterance.volume = 0;
    window.speechSynthesis.speak(utterance);
    audioUnlocked = true;
    console.log("🔊 Audio Unlocked for Mobile");
}

/**
 * 2. CORE SPEECH ENGINE
 */
export function speakPolish(text) {
    if (!('speechSynthesis' in window)) return;

    // Stop any current speech to prevent overlapping
    window.speechSynthesis.cancel();

    // iOS Fix: Wrap in a timeout if necessary, but usually cancel is enough
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    // Set voice and language
    const plVoice = voices.find(v => v.lang.startsWith('pl'));
    if (plVoice) utterance.voice = plVoice;
    
    utterance.lang = 'pl-PL';
    utterance.rate = 0.85; 
    
    window.speechSynthesis.speak(utterance);
}

/**
 * 3. NEW FEATURE: Dynamic UI Phrase Reader
 */
export function playCurrentView() {
    // Looks for the main Polish phrases updated by ui-renderer.js or time-logic.js
    const plDisplay = document.getElementById('plDisplay');
    const plPhrase = document.getElementById('plPhrase');
    
    // Choose whichever is visible/exists
    const textToSpeak = (plDisplay && plDisplay.innerText) || (plPhrase && plPhrase.innerText) || "";
    
    if (textToSpeak) {
        speakPolish(textToSpeak);
    }
}

/**
 * 4. PHONETIC HELPERS
 */
export function getPhoneticMonth(monthName) {
    return phonetics.months[monthName] || monthName;
}

export function getPhoneticDayName(dayName) {
    return phonetics.days[dayName.toLowerCase()] || dayName;
}
