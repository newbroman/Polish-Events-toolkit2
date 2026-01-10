/**
 * app.js - Final Integration Fixed
 */
import { updateInfoPanel } from './ui-renderer.js';
import { setupListeners } from './events.js';
import holidayData from './holiday.js';
import { checkVoices } from './audio.js';
import { getRulesHTML } from './rules.js'; 
import { getPolishTimeStrings } from './time-logic.js';
import { renderCulturalHub, renderRulesPage } from './events.js';

// 1. Initialize Global State
const state = {
    selectedDate: new Date(),
    viewDate: new Date(), // Added this to prevent "undefined" error in render()
    activeView: 'calendar',
    includeYear: true,
    isFormal: true,   // Formal startup (Gold Theme)
    isPolish: false   // Show English helpers by default
};

// 2. Initialization Function
function init() {
    updateInfoPanel(
        state.selectedDate, 
        state.includeYear, 
        state.isFormal, 
        state.isPolish
    );
} // <--- FIXED: Added missing closing brace for init()

// 3. View Switcher Logic
const views = {
    calendar: document.getElementById('viewCalendar'),
    time: document.getElementById('viewTime'),
    culture: document.getElementById('culturalHub'), 
    rules: document.getElementById('rulesPage') 
};

function setActiveView(viewName) {
    state.activeView = viewName;
    
    Object.keys(views).forEach(key => {
        if (views[key]) views[key].style.display = (key === viewName) ? 'block' : 'none';
    });

    if (viewName === 'rules' && views.rules) {
        views.rules.innerHTML = getRulesHTML();
    }
    
    if (viewName === 'culture') {
        renderCulturalHub(state); 
    } else if (viewName === 'rules') {
        renderRulesPage(state);
    }

    render(); 
}

/**
 * 4. Main Render Function 
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

    // Use viewDate for the calendar display, selectedDate for the specific pick
    const monthIndex = state.viewDate.getMonth();
    const year = state.viewDate.getFullYear();

    // --- 1. MODE BUTTON PHRASING (Personalized: Formal Default) ---
    if (meetingBtn) {
        const status = state.isFormal ? 
            (state.isPolish ? "To jest..." : "Date: (It is...)") : 
            (state.isPolish ? "Dnia..." : "Date: (On the...)");
        
        meetingBtn.innerText = status;
        meetingBtn.className = `pill-btn ${state.isFormal ? 'mode-btn-formal' : 'mode-btn-informal'}`;
    }

    // --- 2. VIEW-SPECIFIC LOGIC ---
    if (state.activeView === 'calendar') {
        if (weekdayContainer) weekdayContainer.style.display = 'grid';
        grid.style.display = 'grid';
        
        renderCalendarGrid(state.viewDate, state.selectedDate, (newDate) => {
            state.selectedDate = newDate;
            state.viewDate = new Date(newDate); // Sync view to selection
            render(); 
        });

        updateInfoPanel(state.selectedDate, state.includeYear, state.isFormal, state.isPolish);

    } else if (state.activeView === 'time') {
        if (weekdayContainer) weekdayContainer.style.display = 'none';
        grid.style.display = 'none';
        updateTimeDisplay(state.isFormal, state.isPolish);
    }

    // --- 3. SEASONS & THEMES ---
    const seasons = ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'];
    document.body.className = seasons[monthIndex];

    // --- 4. CONTROL UPDATES ---
    if (mRoller) {
        const monthNamesEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthNamesPl = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
        const names = state.isPolish ? monthNamesPl : monthNamesEn;
        mRoller.innerHTML = names.map((name, i) => 
            `<option value="${i}" ${i === monthIndex ? 'selected' : ''}>${name}</option>`
        ).join('');
    }
    
    if (yInput) yInput.value = year;

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

// 5. Grid Drawing Logic
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

// 6. Initialize App
window.onload = () => {
    init(); // Run internal setup
    setupListeners(state, render);
    
    document.getElementById('navCalendar').onclick = () => setActiveView('calendar');
    document.getElementById('navTime').onclick = () => setActiveView('time');
    document.getElementById('navCulture').onclick = () => setActiveView('culture');
    document.getElementById('navRules').onclick = () => setActiveView('rules');

    const randomBtn = document.getElementById('randomTimeBtn');
    if (randomBtn) {
        randomBtn.onclick = () => {
            const hour = Math.floor(Math.random() * 24);
            const minuteMultiplier = Math.floor(Math.random() * 12); 
            const minute = minuteMultiplier * 5; 
            const timePicker = document.getElementById('timePicker');
            if (timePicker) {
                timePicker.value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                render(); 
            }
        };
    }

    const timePicker = document.getElementById('timePicker');
    if (timePicker) {
        timePicker.oninput = () => render(); 
    }
    
    checkVoices(() => render());

    if ('serviceWorker' in navigator) {
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                window.location.reload();
                refreshing = true;
            }
        });
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('✅ Registered at:', reg.scope))
            .catch(err => console.log('❌ Failed:', err));
    }
    
    render(); 
};

function updateTimeDisplay(isFormal, isPolish) {
    const pl = document.getElementById('plPhrase');
    const en = document.getElementById('enPhrase');
    const timePicker = document.getElementById('timePicker');
    
    if (timePicker && !timePicker.value) {
        timePicker.value = "12:00";
    }
    
    let timeValue = timePicker?.value || "12:00";
    const [hrs, mins] = timeValue.split(':');

    // Calls your time-logic.js (Personalized: No Kwadrans)
    const timeData = getPolishTimeStrings(hrs, mins, isFormal);

    if (pl) {
        pl.innerText = timeData.polish;
        pl.style.display = 'block'; 
    }
    if (en) {
        en.innerText = timeData.english;
        en.style.display = isPolish ? 'none' : 'block'; 
    }
}

// Global exposure for debugging
window.render = render;
window.state = state;
