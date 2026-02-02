// ===================================
// Main Application Logic
// ===================================

// Initialize prayer times calculator
const prayerTimesCalc = new PrayerTimes();

// State management
let currentTheme = getFromLocalStorage('theme', 'light');
let prayerCheckStatus = getFromLocalStorage('prayerCheck_' + getTodayDate(), {});
let dzikirCount = getFromLocalStorage('dzikirCount_' + getTodayDate(), 0);
let quranProgress = getFromLocalStorage('quranProgress_' + getTodayDate(), { juz: 0, pages: 0 });
let sedekahStatus = getFromLocalStorage('sedekahCheck_' + getTodayDate(), false);

// ===================================
// Initialization
// ===================================

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize AOS animations
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }

    // Apply saved theme
    applyTheme(currentTheme);

    // Initialize all components
    initThemeToggle();
    initNavigation();
    initDates();
    await initPrayerTimes();
    initCountdown();
    initTrackers();

    // Request notification permission
    requestNotificationPermission();

    // Update times every minute
    setInterval(updateTimes, 60000);

    // Update countdown every second
    setInterval(updateCountdown, 1000);
});

// ===================================
// Theme Management
// ===================================

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(currentTheme);
        saveToLocalStorage('theme', currentTheme);
    });
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        const icon = document.querySelector('#themeToggle i');
        if (icon) icon.className = 'fas fa-sun';
    } else {
        document.body.classList.remove('dark-mode');
        const icon = document.querySelector('#themeToggle i');
        if (icon) icon.className = 'fas fa-moon';
    }
}

// ===================================
// Navigation
// ===================================

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));

            // Add active class to clicked link
            link.classList.add('active');

            // Smooth scroll to section
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', debounce(() => {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, 100));
}

// ===================================
// Date Management
// ===================================

function initDates() {
    updateGregorianDate();
    updateHijriDate();
}

function updateGregorianDate() {
    const gregorianDateEl = document.getElementById('gregorianDate');
    if (!gregorianDateEl) return;

    const today = new Date();
    gregorianDateEl.textContent = formatDateIndonesian(today);
}

function updateHijriDate() {
    const hijriDateEl = document.getElementById('hijriDate');
    if (!hijriDateEl) return;

    const hijriDate = getHijriDate();
    hijriDateEl.textContent = hijriDate;
}

// ===================================
// Prayer Times
// ===================================

async function initPrayerTimes() {
    try {
        // Show loading state
        updateLocationDisplay('Mendeteksi lokasi...');

        // Get prayer times
        await prayerTimesCalc.getPrayerTimes();

        // Update location display
        updateLocationDisplay(`${prayerTimesCalc.city}, ${prayerTimesCalc.country}`);

        // Display prayer times
        displayPrayerTimes();

        // Update next prayer info
        updateNextPrayer();

        // Highlight current prayer
        highlightCurrentPrayer();

    } catch (error) {
        console.error('Error initializing prayer times:', error);
        updateLocationDisplay('Jakarta, Indonesia (Default)');
    }
}

function displayPrayerTimes() {
    if (!prayerTimesCalc.times) return;

    const times = prayerTimesCalc.times;

    // Update each prayer time
    updatePrayerTimeElement('fajr', times.fajr);
    updatePrayerTimeElement('dhuhr', times.dhuhr);
    updatePrayerTimeElement('asr', times.asr);
    updatePrayerTimeElement('maghrib', times.maghrib);
    updatePrayerTimeElement('isha', times.isha);
}

function updatePrayerTimeElement(prayerId, time) {
    const element = document.getElementById(prayerId);
    if (element) {
        element.textContent = formatTime(time);
    }
}

function updateLocationDisplay(location) {
    const locationEl = document.querySelector('#location span');
    if (locationEl) {
        locationEl.textContent = location;
    }
}

function highlightCurrentPrayer() {
    const currentPrayer = prayerTimesCalc.getCurrentPrayer();

    // Remove active class from all cards
    document.querySelectorAll('.prayer-card').forEach(card => {
        card.classList.remove('active');
    });

    // Add active class to current prayer
    if (currentPrayer) {
        const currentCard = document.querySelector(`.prayer-card:has(#${currentPrayer.key})`);
        if (currentCard) {
            currentCard.classList.add('active');
        }
    }
}

function updateNextPrayer() {
    const timeUntil = prayerTimesCalc.getTimeUntilNextPrayer();
    if (!timeUntil) return;

    const nextPrayerNameEl = document.getElementById('nextPrayerName');
    const timeRemainingEl = document.getElementById('timeRemaining');

    if (nextPrayerNameEl) {
        nextPrayerNameEl.textContent = timeUntil.prayer.name;
    }

    if (timeRemainingEl) {
        const hours = timeUntil.hours;
        const minutes = timeUntil.minutes;

        let timeText = 'dalam ';
        if (hours > 0) {
            timeText += `${hours} jam `;
        }
        timeText += `${minutes} menit`;

        timeRemainingEl.textContent = timeText;
    }

    // Check if it's prayer time (within 1 minute)
    if (timeUntil.totalMinutes === 0) {
        showNotification(
            `Waktu ${timeUntil.prayer.name}`,
            `Sudah masuk waktu sholat ${timeUntil.prayer.name}`,
            '🕌'
        );
    }
}

function updateTimes() {
    updateNextPrayer();
    highlightCurrentPrayer();
}

// ===================================
// Ramadan Countdown
// ===================================

function initCountdown() {
    updateCountdown();
    updateRamadanProgress();
}

function updateCountdown() {
    const ramadanStart = getRamadanStartDate();
    const now = new Date();

    // Check if Ramadan has started
    if (isRamadan()) {
        // Show progress instead of countdown
        document.getElementById('countdownCard').style.display = 'none';
        document.getElementById('ramadanProgress').style.display = 'block';
        updateRamadanProgress();
    } else {
        // Show countdown
        document.getElementById('countdownCard').style.display = 'block';
        document.getElementById('ramadanProgress').style.display = 'none';

        const diff = ramadanStart - now;

        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            updateCountdownElement('days', days);
            updateCountdownElement('hours', hours);
            updateCountdownElement('minutes', minutes);
            updateCountdownElement('seconds', seconds);
        }
    }
}

function updateCountdownElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function updateRamadanProgress() {
    if (!isRamadan()) return;

    const day = getRamadanDay();
    const progress = (day / 30) * 100;

    const ramadanDayEl = document.getElementById('ramadanDay');
    const progressPercentEl = document.getElementById('progressPercent');
    const progressFillEl = document.getElementById('progressFill');

    if (ramadanDayEl) ramadanDayEl.textContent = day;
    if (progressPercentEl) progressPercentEl.textContent = `${Math.round(progress)}%`;
    if (progressFillEl) progressFillEl.style.width = `${progress}%`;
}

// ===================================
// Ibadah Trackers
// ===================================

function initTrackers() {
    initPrayerTracker();
    initQuranTracker();
    initDzikirCounter();
    initSedekahTracker();
}

// Prayer Tracker
function initPrayerTracker() {
    const checkboxes = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

    checkboxes.forEach(prayer => {
        const checkbox = document.getElementById(`check-${prayer}`);
        if (!checkbox) return;

        // Load saved state
        checkbox.checked = prayerCheckStatus[prayer] || false;

        // Add event listener
        checkbox.addEventListener('change', () => {
            prayerCheckStatus[prayer] = checkbox.checked;
            saveToLocalStorage('prayerCheck_' + getTodayDate(), prayerCheckStatus);
            updatePrayerProgress();
        });
    });

    updatePrayerProgress();
}

function updatePrayerProgress() {
    const total = 5;
    const checked = Object.values(prayerCheckStatus).filter(v => v).length;

    const progressEl = document.getElementById('prayerProgress');
    if (progressEl) {
        progressEl.textContent = `${checked}/${total} Sholat`;
    }
}

// Quran Tracker
function initQuranTracker() {
    const juzInput = document.getElementById('juzInput');
    const pageInput = document.getElementById('pageInput');
    const saveBtn = document.getElementById('saveQuran');

    // Load saved progress
    if (juzInput) juzInput.value = quranProgress.juz || '';
    if (pageInput) pageInput.value = quranProgress.pages || '';

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const juz = parseInt(juzInput.value) || 0;
            const pages = parseInt(pageInput.value) || 0;

            quranProgress = { juz, pages };
            saveToLocalStorage('quranProgress_' + getTodayDate(), quranProgress);

            updateQuranProgress();

            // Show feedback
            saveBtn.innerHTML = '<i class="fas fa-check"></i> Tersimpan!';
            setTimeout(() => {
                saveBtn.innerHTML = '<i class="fas fa-save"></i> Simpan';
            }, 2000);
        });
    }

    updateQuranProgress();
}

function updateQuranProgress() {
    const progressEl = document.getElementById('quranToday');
    if (progressEl) {
        progressEl.textContent = `${quranProgress.pages || 0} halaman`;
    }
}

// Dzikir Counter
function initDzikirCounter() {
    const counterDisplay = document.getElementById('dzikirCount');
    const incrementBtn = document.getElementById('dzikirBtn');
    const resetBtn = document.getElementById('resetDzikir');

    // Load saved count
    if (counterDisplay) {
        counterDisplay.textContent = dzikirCount;
    }

    // Increment button
    if (incrementBtn) {
        incrementBtn.addEventListener('click', () => {
            dzikirCount++;
            counterDisplay.textContent = dzikirCount;
            saveToLocalStorage('dzikirCount_' + getTodayDate(), dzikirCount);

            // Add pulse animation
            counterDisplay.classList.add('pulse');
            setTimeout(() => {
                counterDisplay.classList.remove('pulse');
            }, 500);

            // Vibrate if supported
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });
    }

    // Reset button
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Reset counter dzikir?')) {
                dzikirCount = 0;
                counterDisplay.textContent = dzikirCount;
                saveToLocalStorage('dzikirCount_' + getTodayDate(), dzikirCount);
            }
        });
    }
}

// Sedekah Tracker
function initSedekahTracker() {
    const checkbox = document.getElementById('check-sedekah');
    if (!checkbox) return;

    // Load saved state
    checkbox.checked = sedekahStatus;

    // Add event listener
    checkbox.addEventListener('change', () => {
        sedekahStatus = checkbox.checked;
        saveToLocalStorage('sedekahCheck_' + getTodayDate(), sedekahStatus);
        updateSedekahStreak();
    });

    updateSedekahStreak();
}

function updateSedekahStreak() {
    // Simple streak calculation (can be enhanced)
    const streakEl = document.getElementById('sedekahStreak');
    if (streakEl) {
        const streak = sedekahStatus ? 1 : 0;
        streakEl.textContent = `${streak} hari`;
    }
}

// ===================================
// Utility Functions
// ===================================

// Clean up old localStorage data (keep only last 7 days)
function cleanupOldData() {
    const keys = Object.keys(localStorage);
    const today = new Date();

    keys.forEach(key => {
        if (key.includes('_202')) { // Keys with dates
            const dateStr = key.split('_').pop();
            const itemDate = new Date(dateStr);
            const daysDiff = Math.floor((today - itemDate) / (1000 * 60 * 60 * 24));

            if (daysDiff > 7) {
                localStorage.removeItem(key);
            }
        }
    });
}

// Run cleanup on load
cleanupOldData();

console.log('🕌 Ramawan App initialized successfully!');
