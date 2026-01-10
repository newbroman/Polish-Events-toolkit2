/**
 * app.js - Final Integration Fixed
 */
import { updateInfoPanel } from './ui-renderer.js';
import { setupListeners } from './events.js';
import holidayData from './holiday.js';
import { checkVoices } from './audio.js';
import { getRulesHTML } from './rules.js'; // Assuming you have this module
import { getPolishTimeStrings } from './time-logic.js';
import { renderCulturalHub, renderRulesPage } from './events.js'; // Ensure these are imported

// 1. Initialize Global State
const state = { 
    viewDate: new Date(),    
    selectedDate: new Date(), 
    includeYear: true,
    isPolish: false,
    isFormal: true, // Correctly starts as Written/Genitive by default
    activeView: 'calendar' // NEW: Tracks which "room" we are in
};dateText

// 2. View Switcher Logic
const views = {
    calendar: document.getElementById('viewCalendar'), // The wrapper for the calendar section
    time: document.getElementById('viewTime'),
    culture: document.getElementById('culturalHub'),   // Changed from viewCulture
    rules: document.getElementById('rulesPage')        // Changed from viewRules
};

function setActiveView(viewName) {
    state.activeView = viewName;
    
    // Hide all views, show the active one
    Object.keys(views).forEach(key => {
        if (views[key]) views[key].style.display = (key === viewName) ? 'block' : 'none';
    });

    // Handle special content injection
    if (viewName === 'rules' && views.rules) {
        views.rules.innerHTML = getRulesHTML();
    }
    if (viewName === 'culture') {
        renderCulturalHub(state); 
    } else if (viewName === 'rules') {
        renderRulesPage(state);
    }

    render(); // Re-render to update the header/footer context
}

/**
 * 3. Main Render Function 
 */
function render() {
    const grid = document.getElementById('calendarGrid');
    const mRoller = document.getElementById('monthRoller');
    const yInput = document.getElementById('yearInput');
    const weekdayContainer = document.querySelector('.weekdays');
    const meetingBtn = document.getElementById('meetingToggle');
    const playBtn = document.getElementById('playBtn');
    const repeatYearBtn = document.getElementById('repeatYearBtn');
    
    if (!grid) return;

    const monthIndex = state.viewDate.getMonth();
    const year = state.viewDate.getFullYear();

    // --- 1. MODE BUTTON PHRASING ---
    if (meetingBtn) {
        const status = state.isFormal ? 
            (state.isPolish ? "To jest..." : "Date: (It is...)") : 
            (state.isPolish ? "Dnia..." : "Date: (On the...)");
        
        meetingBtn.innerText = status;
        meetingBtn.className = `pill-btn ${state.isFormal ? 'mode-btn-formal' : 'mode-btn-informal'}`;
    }

    // --- 2. VIEW-SPECIFIC LOGIC (The Room Controller) ---
    if (state.activeView === 'calendar') {
        // Show Calendar elements
        if (weekdayContainer) weekdayContainer.style.display = 'grid';
        grid.style.display = 'grid';
        
        renderCalendarGrid(state.viewDate, state.selectedDate, (newDate) => {
            state.selectedDate = newDate;
            render(); 
        });

        updateInfoPanel(state.selectedDate, state.includeYear, state.isFormal, state.isPolish);

    } else if (state.activeView === 'time') {
        // Hide Calendar elements
        if (weekdayContainer) weekdayContainer.style.display = 'none';
        grid.style.display = 'none';

        updateTimeDisplay(state.isFormal, state.isPolish);

    } else if (state.activeView === 'culture') {
        // --- EXPLICIT CULTURAL HUB REFERENCE ---
        // This function is imported from events.js
        import('./events.js').then(m => {
            m.renderCulturalHub(state);
        });
    }

    // --- 3. GLOBAL UI UPDATES (Themes & Seasons) ---
    const seasons = ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'];
    document.body.className = seasons[monthIndex];

    // --- 4. CONTROL UPDATES (Dropdowns) ---
    if (mRoller) {
        const monthNamesEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthNamesPl = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
        const names = state.isPolish ? monthNamesPl : monthNamesEn;
        mRoller.innerHTML = names.map((name, i) => 
            `<option value="${i}" ${i === monthIndex ? 'selected' : ''}>${name}</option>`
        ).join('');
    }
    
    if (yInput) yInput.value = year;

    // --- 5. TRANSLATIONS ---
    if (weekdayContainer) {
        const days = state.isPolish ? ["Nie", "Pon", "Wt", "Śr", "Czw", "Pią", "Sob"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        weekdayContainer.innerHTML = days.map(d => `<span>${d}</span>`).join('');
    }

    if (playBtn && !playBtn.innerText.includes("⌛")) {
        playBtn.innerText = state.isPolish ? "🔊 Słuchaj" : "🔊 Listen";
    }

    if (repeatYearBtn) {
        const yearLabel = state.isPolish ? "Rok" : "Year";
        repeatYearBtn.innerText = `${yearLabel}: ${state.includeYear ? "ON" : "OFF"}`;
    }
}
// 4. Grid Drawing Logic
function renderCalendarGrid(viewDate, selectedDate, onDateClick) {
    const grid = document.getElementById('calendarGrid'); 
    if (!grid) return;
    grid.innerHTML = "";

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const today = new Date();
    
    const holidays = (holidayData && typeof holidayData.getHolidaysForYear === 'function') 
        ? holidayData.getHolidaysForYear(year) 
        : {};

    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();

    for (let x = 0; x < firstDayIndex; x++) {
        const spacer = document.createElement('div');
        spacer.className = 'calendar-day spacer';
        grid.appendChild(spacer);
    }

    for (let day = 1; day <= lastDay; day++) {
        const daySquare = document.createElement('div');
        daySquare.className = 'calendar-day';
        daySquare.innerText = day;

        const holidayKey = `${month}-${day}`;
        if (holidays[holidayKey]) daySquare.classList.add('holiday');

        const isToday = day === today.getDate() && 
                        month === today.getMonth() && 
                        year === today.getFullYear();
        if (isToday) daySquare.classList.add('today-highlight');

        const isSelected = selectedDate && 
                           day === selectedDate.getDate() && 
                           month === selectedDate.getMonth() && 
                           year === selectedDate.getFullYear();
        if (isSelected) daySquare.classList.add('selected');

        daySquare.onclick = () => {
            const newSelected = new Date(year, month, day);
            onDateClick(newSelected);
        };

        grid.appendChild(daySquare);
    }
}

// 5. Initialize
window.onload = () => {
    setupListeners(state, render);
    
    document.getElementById('navCalendar').onclick = () => setActiveView('calendar');
    document.getElementById('navTime').onclick = () => setActiveView('time');
    document.getElementById('navCulture').onclick = () => setActiveView('culture');
    document.getElementById('navRules').onclick = () => setActiveView('rules');
// --- ADD THE 5-MINUTE RANDOMIZER HERE ---
    const randomBtn = document.getElementById('randomTimeBtn');
    if (randomBtn) {
        randomBtn.onclick = () => {
            const hour = Math.floor(Math.random() * 24);
            const minuteMultiplier = Math.floor(Math.random() * 12); // 0-11
            const minute = minuteMultiplier * 5; // Multiples of 5
            
            const timePicker = document.getElementById('timePicker');
            if (timePicker) {
                timePicker.value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                render(); 
            }
        };
    }
    render(); 

    const timePicker = document.getElementById('timePicker');
    if (timePicker) {
        timePicker.oninput = () => render(); 
    }
    
    checkVoices(() => render());

    if ('serviceWorker' in navigator) {
        // --- ADD THIS PART HERE ---
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                window.location.reload();
                refreshing = true;
            }
        });
        // ---------------------------

        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('✅ Registered at:', reg.scope))
            .catch(err => console.log('❌ Failed:', err));
    }
};

// Keep these at the very bottom for debugging
window.render = render;
window.state = state;
window.renderCalendarGrid = renderCalendarGrid;

function updateTimeDisplay(isFormal, isPolish) {
    const pl = document.getElementById('plPhrase');
    const en = document.getElementById('enPhrase');
    const timePicker = document.getElementById('timePicker');
    
    if (timePicker && !timePicker.value) {
        timePicker.value = "12:00";
    }
    
    let timeValue = timePicker?.value || "12:00";
    const [hrs, mins] = timeValue.split(':');

    // Calls your time-logic.js
    const timeData = getPolishTimeStrings(hrs, mins, isFormal);

    if (pl) {
        pl.innerText = timeData.polish;
        pl.style.display = 'block'; // Fixed: Always show the Polish learning text
    }
    if (en) {
        en.innerText = timeData.english;
        en.style.display = isPolish ? 'none' : 'block'; 
    }

    console.log("Time UI Updated:", timeData.polish);
} 
