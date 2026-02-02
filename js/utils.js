// ===================================
// Utility Functions
// ===================================

/**
 * Format waktu ke format 24 jam (HH:MM)
 */
function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

/**
 * Format angka dengan leading zero
 */
function padZero(num) {
    return String(num).padStart(2, '0');
}

/**
 * Simpan data ke localStorage
 */
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

/**
 * Ambil data dari localStorage
 */
function getFromLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
}

/**
 * Hapus data dari localStorage
 */
function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
}

/**
 * Dapatkan tanggal hari ini dalam format YYYY-MM-DD
 */
function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = padZero(today.getMonth() + 1);
    const day = padZero(today.getDate());
    return `${year}-${month}-${day}`;
}

/**
 * Cek apakah data masih valid (hari ini)
 */
function isDataValid(savedDate) {
    return savedDate === getTodayDate();
}

/**
 * Hitung selisih waktu dalam menit
 */
function getTimeDifferenceInMinutes(time1, time2) {
    const diff = time2 - time1;
    return Math.floor(diff / 60000); // Convert milliseconds to minutes
}

/**
 * Format durasi ke format yang mudah dibaca
 */
function formatDuration(minutes) {
    if (minutes < 60) {
        return `${minutes} menit`;
    }

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (mins === 0) {
        return `${hours} jam`;
    }

    return `${hours} jam ${mins} menit`;
}

/**
 * Dapatkan nama hari dalam Bahasa Indonesia
 */
function getDayName(dayIndex) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[dayIndex];
}

/**
 * Dapatkan nama bulan dalam Bahasa Indonesia
 */
function getMonthName(monthIndex) {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[monthIndex];
}

/**
 * Format tanggal lengkap dalam Bahasa Indonesia
 */
function formatDateIndonesian(date) {
    const dayName = getDayName(date.getDay());
    const day = date.getDate();
    const monthName = getMonthName(date.getMonth());
    const year = date.getFullYear();

    return `${dayName}, ${day} ${monthName} ${year}`;
}

/**
 * Konversi tanggal Gregorian ke Hijriyah menggunakan moment-hijri
 */
function getHijriDate(date = new Date()) {
    if (typeof moment !== 'undefined' && moment.fn.iHijri) {
        const hijriDate = moment(date).format('iDD iMMMM iYYYY');
        return hijriDate;
    }
    return 'Tanggal Hijriyah tidak tersedia';
}

/**
 * Dapatkan tanggal awal Ramadan (estimasi untuk 1447 H)
 * Ramadan 1447 H diperkirakan mulai sekitar 1 Maret 2026
 */
function getRamadanStartDate() {
    // Estimasi awal Ramadan 1447 H
    return new Date(2026, 2, 1, 0, 0, 0); // 1 Maret 2026
}

/**
 * Cek apakah sedang bulan Ramadan
 */
function isRamadan() {
    const now = new Date();
    const ramadanStart = getRamadanStartDate();
    const ramadanEnd = new Date(ramadanStart);
    ramadanEnd.setDate(ramadanEnd.getDate() + 29); // 30 hari Ramadan

    return now >= ramadanStart && now <= ramadanEnd;
}

/**
 * Dapatkan hari ke berapa Ramadan
 */
function getRamadanDay() {
    if (!isRamadan()) return 0;

    const now = new Date();
    const ramadanStart = getRamadanStartDate();
    const diffTime = now - ramadanStart;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return Math.min(diffDays, 30);
}

/**
 * Show notification (jika browser support)
 */
function showNotification(title, body, icon = '🕌') {
    if (!('Notification' in window)) {
        console.log('Browser tidak support notifikasi');
        return;
    }

    if (Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
            icon: icon,
            badge: icon
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(title, {
                    body: body,
                    icon: icon,
                    badge: icon
                });
            }
        });
    }
}

/**
 * Request notification permission
 */
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

/**
 * Debounce function untuk optimasi performance
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Animate counter
 */
function animateCounter(element, target, duration = 1000) {
    const start = parseInt(element.textContent) || 0;
    const increment = (target - start) / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Export functions (jika menggunakan modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatTime,
        padZero,
        saveToLocalStorage,
        getFromLocalStorage,
        removeFromLocalStorage,
        getTodayDate,
        isDataValid,
        getTimeDifferenceInMinutes,
        formatDuration,
        getDayName,
        getMonthName,
        formatDateIndonesian,
        getHijriDate,
        getRamadanStartDate,
        isRamadan,
        getRamadanDay,
        showNotification,
        requestNotificationPermission,
        debounce,
        animateCounter
    };
}
