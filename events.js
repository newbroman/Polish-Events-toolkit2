/**
 * events.js - Final Integration with Alignment Fix
 */
import { speakText, checkVoices } from './audio.js';
import holidayData from './holiday.js';
import culturalData from './cultural.js';
import { getRulesHTML } from './rules.js';

export function setupListeners(state, render) {
    
    // --- 1. Audio and Logic Toggles ---
    const triggerAudioUnlock = () => {
        import('./audio.js').then(m => m.unlockAudio());
        document.removeEventListener('touchstart', triggerAudioUnlock);
        document.removeEventListener('click', triggerAudioUnlock);
    };
    document.addEventListener('touchstart', triggerAudioUnlock);
    document.addEventListener('click', triggerAudioUnlock);
    
    const playBtn = document.getElementById('playBtn');
    if (playBtn) {
        checkVoices((ready) => {
            if (ready) {
                playBtn.disabled = false;
                playBtn.style.opacity = "1";
                render(); 
            }
        });

        playBtn.onclick = () => {
            const textToSpeak = document.getElementById('plPhrase').innerText;
            if (textToSpeak && !textToSpeak.includes("Wybierz") && !textToSpeak.includes("Select")) {
                speakText(textToSpeak);
            }
        };
    }

    // --- Formal/Informal Toggle ---
    const meetingBtn = document.getElementById('meetingToggle');
    if (meetingBtn) {
        meetingBtn.onclick = () => {
            state.isFormal = !state.isFormal;
            render(); 
        };
    }
// --- 2. Navigation Logic ---
const showSection = (id) => {
    window.scrollTo(0, 0); 
    const sections = {
        'calendar': document.getElementById('calendarSection'),
        'time': document.getElementById('viewTime'), // ADDED THIS
        'culture': document.getElementById('culturalHub'),
        'rules': document.getElementById('rulesPage')
    };
    const infoPanel = document.querySelector('.info-panel');

    Object.values(sections).forEach(s => { 
        if (s) s.style.setProperty('display', 'none', 'important'); 
    });

    const activeSection = sections[id];
    if (activeSection) {
        const displayType = (id === 'calendar') ? 'flex' : 'block';
        activeSection.style.setProperty('display', displayType, 'important');
        if (id !== 'calendar') activeSection.classList.add('content-page');
    }

    // Toggle Info Panel: Keep it visible for Calendar AND Time
    if (infoPanel) {
        const shouldShowFooter = (id === 'calendar' || id === 'time');
        infoPanel.style.setProperty('display', shouldShowFooter ? 'flex' : 'none', 'important');
    }

    document.querySelectorAll('.nav-icon-btn').forEach(b => {
        b.classList.toggle('active', b.id === `nav${id.charAt(0).toUpperCase() + id.slice(1)}`);
    });
};

// --- 3. Click Listeners ---

// --- 3. Click Listeners ---

const randomBtn = document.getElementById('randomTimeBtn');
if (randomBtn) {
    randomBtn.onclick = () => {
        // 1. Generate random hour (0-23)
        const hour = Math.floor(Math.random() * 24);
        
        // 2. Generate random 5-minute increment (0, 5, 10... up to 55)
        // Math.random() * 12 gives a number between 0 and 11.99
        // Math.floor() makes it an integer 0, 1, 2... 11
        const minute = Math.floor(Math.random() * 12) * 5;
        
        // 3. Format to HH:MM (ensuring leading zeros like 05:05)
        const timeValue = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        
        const timePicker = document.getElementById('timePicker');
        if (timePicker) {
            timePicker.value = timeValue;
            render(); // Triggers the Polish translation update
        }
    };
}

document.getElementById('navCalendar').onclick = () => {
    showSection('calendar');
    state.activeView = 'calendar';
    render(); 
};

// ADD THE TIME NAV LISTENER
document.getElementById('navTime').onclick = () => {
    showSection('time');
    state.activeView = 'time';
    render();
};

    document.getElementById('navCulture').onclick = () => {
        showSection('culture');
        state.activeView = 'culture';
        renderCulturalHub(state); 
    };

    document.getElementById('navRules').onclick = () => {
        showSection('rules');
        state.activeView = 'rules';
        renderRulesPage(state);
    };

    // Calendar Controls
    document.getElementById('prevMonth').onclick = () => {
        state.viewDate.setMonth(state.viewDate.getMonth() - 1);
        render();
    };

    document.getElementById('nextMonth').onclick = () => {
        state.viewDate.setMonth(state.viewDate.getMonth() + 1);
        render();
    };

    document.getElementById('monthRoller').onchange = (e) => {
        state.viewDate.setMonth(parseInt(e.target.value));
        render();
    };

    document.getElementById('yearInput').onchange = (e) => {
        state.viewDate.setFullYear(parseInt(e.target.value));
        render();
    };

    document.getElementById('langToggle').onclick = (e) => {
        state.isPolish = !state.isPolish;
        e.target.innerText = state.isPolish ? 'PL' : 'EN';
        render(); 
    };

    document.getElementById('repeatYearBtn').onclick = () => {
        state.includeYear = !state.includeYear;
        render(); 
    };
} 

/**
 * Renders the Cultural Hub
 */
export function renderCulturalHub(state) {
    const hub = document.getElementById('culturalHub');
    const monthIndex = state.viewDate.getMonth();
    const year = state.viewDate.getFullYear();
    
    // Get month etymology from culturalData
    const monthInfo = culturalData.months[monthIndex] || { pl: "Miesiąc", derivation: "N/A", season: "N/A" };
    
    // Get holidays and their full descriptions
    const holidays = holidayData.getHolidaysForYear(year);

    let html = `
    <div class="content-body">
        <header class="content-header">
            <h1>${state.isPolish ? monthInfo.pl : (culturalData.months[monthIndex].en || "Month")} ${year}</h1>
            <div class="season-box">
                <span class="season-icon">${getSeasonIcon(monthInfo.season)}</span>
                <strong>${state.isPolish ? 'Pora roku' : 'Season'}:</strong> 
                <span class="season-text">${monthInfo.season}</span>
            </div>
        </header>

            <section class="info-block">
                <h3>📜 ${state.isPolish ? 'Etymologia' : 'Etymology'}</h3>
                <p class="derivation-text">${monthInfo.derivation}</p>
            </section>

            <section class="info-block">
                <h3>🎈 ${state.isPolish ? 'Wydarzenia i Święta' : 'Holidays & Traditions'}</h3>
                <div class="holiday-list">`;

    let foundHoliday = false;
    
    // Loop through holidays and find matches for current month
    Object.entries(holidays).forEach(([key, holidayName]) => {
        if (key.startsWith(`${monthIndex}-`)) {
            const dayNum = key.split('-')[1];
            // Get description from holidayData if it exists
            const description = holidayData.descriptions ? holidayData.descriptions[holidayName] : null;

            html += `
                <div class="holiday-entry">
                    <div class="holiday-title"><strong>${dayNum} ${monthInfo.pl}:</strong> ${holidayName}</div>
                    ${description ? `<p class="holiday-desc">${description}</p>` : ''}
                </div>`;
            foundHoliday = true;
        }
    });

    if (!foundHoliday) {
        html += `<p class="no-data">${state.isPolish ? 'Brak głównych świąt w tym miesiącu.' : 'No major holidays this month.'}</p>`;
    }

    html += `
                </div>
            </section>
            
            <div class="nav-actions">
                <button class="pill-btn back-to-cal">← ${state.isPolish ? 'Powrót' : 'Back to Calendar'}</button>
            </div>
        </div>`;

    hub.innerHTML = html;
    hub.querySelector('.back-to-cal').onclick = () => document.getElementById('navCalendar').click();
}

/**
 * Renders the Grammar Rules page
 */
export function renderRulesPage(state) {
    const page = document.getElementById('rulesPage');
    if (!page) return;
    
    page.innerHTML = `
        <div class="content-body">
            ${getRulesHTML()}
            <div style="text-align:center;">
                <button class="pill-btn back-to-cal" style="margin-top:20px">← Back to Calendar</button>
            </div>
        </div>`;

    page.querySelector('.back-to-cal').onclick = () => document.getElementById('navCalendar').click();
}
function getSeasonIcon(season) {
    if (season.includes("Wiosna")) return "🌱";
    if (season.includes("Lato")) return "☀️";
    if (season.includes("Jesień")) return "🍂";
    if (season.includes("Zima")) return "❄️";
    return "📅";
}
