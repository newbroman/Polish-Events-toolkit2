/**
 * app.js - Final Integration Fixed
 */
import { updateInfoPanel } from './ui-renderer.js';
import { setupListeners } from './events.js';
import holidayData from './holiday.js';
import { checkVoices } from './audio.js';
import { getRulesHTML } from './rules.js'; // Assuming you have this module
import { getPolishTimeStrings } from './time-logic.js';
import { getPolishTimeStrings } from './time-logic.js';

// 1. Initialize Global State
const state = { 
    viewDate: new Date(),    
    selectedDate: new Date(), 
    includeYear: true,
    isPolish: false,
    isFormal: true, // Correctly starts as Written/Genitive by default
    activeView: 'calendar' // NEW: Tracks which "room" we are in
};

// 2. View Switcher Logic
const views = {
    calendar: document.getElementById('viewCalendar'),
    time: document.getElementById('viewTime'),
    culture: document.getElementById('viewCulture'),
    rules: document.getElementById('viewRules')
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

    render(); // Re-render to update the header/footer context
}

// 3. Main Render Function
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

    // 1. Update Mode Button Phrasing (Formal/Informal toggle)
    if (meetingBtn) {
        const status = state.isFormal ? 
            (state.isPolish ? "To jest..." : "Date: (It is...)") : 
            (state.isPolish ? "Dnia..." : "Date: (On the...)");
        
        meetingBtn.innerText = status;
        meetingBtn.className = `pill-btn ${state.isFormal ? 'mode-btn-spoken' : 'mode-btn-written'}`;
    }

    // 2. VIEW-SPECIFIC LOGIC
    if (state.activeView === 'calendar') {
        // --- CALENDAR ROOM ---
        renderCalendarGrid(state.viewDate, state.selectedDate, (newDate) => {
            state.selectedDate = newDate;
            render(); 
        });

        // Update the footer with the Date phrase
        updateInfoPanel(state.selectedDate, state.includeYear, state.isFormal, state.isPolish);
        
        // Ensure calendar-only controls are visible
        if (weekdayContainer) weekdayContainer.style.display = 'grid';
        grid.style.display = 'grid';

    } else if (state.activeView === 'time') {
      

        // Update the footer with the Time phrase
        // We will create this function next!
        updateTimeDisplay(state.isFormal, state.isPolish);
    }

    // 3. GLOBAL UI UPDATES (Themes & Translations)
    document.body.className = ''; 
    const seasons = ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'];
    document.body.classList.add(seasons[monthIndex]);

 
    // 4. Update Month Dropdown
    if (mRoller) {
        const monthNamesEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthNamesPl = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
        const names = state.isPolish ? monthNamesPl : monthNamesEn;
        
        mRoller.innerHTML = names.map((name, i) => 
            `<option value="${i}" ${i === monthIndex ? 'selected' : ''}>${name}</option>`
        ).join('');
    }
    
    if (yInput) yInput.value = year;

    // 5. Weekday Labels
    if (weekdayContainer) {
        const days = state.isPolish ? ["Nie", "Pon", "Wt", "Śr", "Czw", "Pią", "Sob"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        weekdayContainer.innerHTML = days.map(d => `<span>${d}</span>`).join('');
    }

    // 6. Button Translations
    if (playBtn && !playBtn.innerText.includes("⌛")) {
        playBtn.innerText = state.isPolish ? "🔊 Słuchaj" : "🔊 Listen";
    }

    if (repeatYearBtn) {
        const yearLabel = state.isPolish ? "Rok" : "Year";
        const status = state.includeYear ? "ON" : "OFF";
        repeatYearBtn.innerText = `${yearLabel}: ${status}`;
    }

    // 7. Render Calendar Grid
    renderCalendarGrid(state.viewDate, state.selectedDate, (newDate) => {
        state.selectedDate = newDate;
        render(); 
    });
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
    
    // Ensure we have a default time if none is selected
    if (timePicker && !timePicker.value) {
        timePicker.value = "12:00";
    }
    let timeValue = timePicker?.value || "12:00";
    const [hrs, mins] = timeValue.split(':');

    // THIS CALLS YOUR TIME-LOGIC.JS ENGINE
    const timeData = getPolishTimeStrings(hrs, mins, isFormal);

    if (pl) {
        pl.innerText = timeData.polish;
        pl.style.display = isPolish ? 'block' : 'none';
    }
    if (en) {
        en.innerText = timeData.english;
    }

    console.log("Time UI Updated:", timeData.polish);
}
