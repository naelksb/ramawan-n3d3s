// ===================================
// Prayer Times Calculator
// ===================================

/**
 * Class untuk menghitung waktu sholat
 * Menggunakan API Aladhan untuk akurasi tinggi
 */
class PrayerTimes {
    constructor() {
        this.city = 'Jakarta';
        this.country = 'Indonesia';
        this.method = 2; // Islamic Society of North America (ISNA) - cocok untuk Indonesia
        this.times = null;
        this.location = null;
    }

    /**
     * Dapatkan lokasi pengguna menggunakan Geolocation API
     */
    async getUserLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation tidak didukung browser'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                position => {
                    this.location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    resolve(this.location);
                },
                error => {
                    console.warn('Gagal mendapatkan lokasi:', error);
                    reject(error);
                }
            );
        });
    }

    /**
     * Dapatkan nama kota dari koordinat menggunakan reverse geocoding
     */
    async getCityFromCoordinates(lat, lon) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=id`
            );
            const data = await response.json();

            if (data.address) {
                this.city = data.address.city || data.address.town || data.address.village || 'Jakarta';
                this.country = data.address.country || 'Indonesia';
                return this.city;
            }
        } catch (error) {
            console.error('Error getting city name:', error);
        }
        return this.city;
    }

    /**
     * Fetch waktu sholat dari API Aladhan berdasarkan kota
     */
    async fetchPrayerTimesByCity() {
        try {
            const today = new Date();
            const day = today.getDate();
            const month = today.getMonth() + 1;
            const year = today.getFullYear();

            const url = `https://api.aladhan.com/v1/timingsByCity/${day}-${month}-${year}?city=${this.city}&country=${this.country}&method=${this.method}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.code === 200 && data.data) {
                this.times = this.parsePrayerTimes(data.data.timings);
                this.saveToCache();
                return this.times;
            }
        } catch (error) {
            console.error('Error fetching prayer times by city:', error);
            return this.loadFromCache();
        }
    }

    /**
     * Fetch waktu sholat dari API Aladhan berdasarkan koordinat
     */
    async fetchPrayerTimesByCoordinates(lat, lon) {
        try {
            const today = new Date();
            const timestamp = Math.floor(today.getTime() / 1000);

            const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lon}&method=${this.method}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.code === 200 && data.data) {
                this.times = this.parsePrayerTimes(data.data.timings);
                this.saveToCache();
                return this.times;
            }
        } catch (error) {
            console.error('Error fetching prayer times by coordinates:', error);
            return this.loadFromCache();
        }
    }

    /**
     * Parse waktu sholat dari response API
     */
    parsePrayerTimes(timings) {
        return {
            fajr: this.parseTime(timings.Fajr),
            dhuhr: this.parseTime(timings.Dhuhr),
            asr: this.parseTime(timings.Asr),
            maghrib: this.parseTime(timings.Maghrib),
            isha: this.parseTime(timings.Isha),
            sunrise: this.parseTime(timings.Sunrise),
            midnight: this.parseTime(timings.Midnight)
        };
    }

    /**
     * Parse string waktu ke object Date
     */
    parseTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        return date;
    }

    /**
     * Dapatkan waktu sholat (coba dari cache dulu, lalu fetch jika perlu)
     */
    async getPrayerTimes() {
        // Cek cache terlebih dahulu
        const cached = this.loadFromCache();
        if (cached) {
            this.times = cached;
            return cached;
        }

        // Coba dapatkan lokasi pengguna
        try {
            const location = await this.getUserLocation();
            await this.getCityFromCoordinates(location.latitude, location.longitude);
            return await this.fetchPrayerTimesByCoordinates(location.latitude, location.longitude);
        } catch (error) {
            // Fallback ke kota default
            console.log('Menggunakan lokasi default:', this.city);
            return await this.fetchPrayerTimesByCity();
        }
    }

    /**
     * Dapatkan waktu sholat berikutnya
     */
    getNextPrayer() {
        if (!this.times) return null;

        const now = new Date();
        const prayers = [
            { name: 'Subuh', time: this.times.fajr, key: 'fajr' },
            { name: 'Dzuhur', time: this.times.dhuhr, key: 'dhuhr' },
            { name: 'Ashar', time: this.times.asr, key: 'asr' },
            { name: 'Maghrib', time: this.times.maghrib, key: 'maghrib' },
            { name: 'Isya', time: this.times.isha, key: 'isha' }
        ];

        // Cari sholat berikutnya
        for (let prayer of prayers) {
            if (now < prayer.time) {
                return prayer;
            }
        }

        // Jika sudah lewat semua, return Subuh besok
        const tomorrow = new Date(this.times.fajr);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return { name: 'Subuh', time: tomorrow, key: 'fajr' };
    }

    /**
     * Dapatkan waktu sholat yang sedang berlangsung
     */
    getCurrentPrayer() {
        if (!this.times) return null;

        const now = new Date();
        const prayers = [
            { name: 'Subuh', start: this.times.fajr, end: this.times.sunrise, key: 'fajr' },
            { name: 'Dzuhur', start: this.times.dhuhr, end: this.times.asr, key: 'dhuhr' },
            { name: 'Ashar', start: this.times.asr, end: this.times.maghrib, key: 'asr' },
            { name: 'Maghrib', start: this.times.maghrib, end: this.times.isha, key: 'maghrib' },
            { name: 'Isya', start: this.times.isha, end: this.times.fajr, key: 'isha' }
        ];

        for (let prayer of prayers) {
            if (now >= prayer.start && now < prayer.end) {
                return prayer;
            }
        }

        return null;
    }

    /**
     * Hitung waktu tersisa hingga sholat berikutnya
     */
    getTimeUntilNextPrayer() {
        const nextPrayer = this.getNextPrayer();
        if (!nextPrayer) return null;

        const now = new Date();
        const diff = nextPrayer.time - now;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return {
            hours,
            minutes,
            seconds,
            totalMinutes: Math.floor(diff / (1000 * 60)),
            prayer: nextPrayer
        };
    }

    /**
     * Simpan waktu sholat ke cache (localStorage)
     */
    saveToCache() {
        if (!this.times) return;

        const cacheData = {
            date: getTodayDate(),
            city: this.city,
            country: this.country,
            times: {
                fajr: this.times.fajr.toISOString(),
                dhuhr: this.times.dhuhr.toISOString(),
                asr: this.times.asr.toISOString(),
                maghrib: this.times.maghrib.toISOString(),
                isha: this.times.isha.toISOString(),
                sunrise: this.times.sunrise.toISOString(),
                midnight: this.times.midnight.toISOString()
            }
        };

        saveToLocalStorage('prayerTimes', cacheData);
    }

    /**
     * Load waktu sholat dari cache
     */
    loadFromCache() {
        const cached = getFromLocalStorage('prayerTimes');

        if (!cached || !isDataValid(cached.date)) {
            return null;
        }

        this.city = cached.city;
        this.country = cached.country;

        // Parse ISO strings back to Date objects
        this.times = {
            fajr: new Date(cached.times.fajr),
            dhuhr: new Date(cached.times.dhuhr),
            asr: new Date(cached.times.asr),
            maghrib: new Date(cached.times.maghrib),
            isha: new Date(cached.times.isha),
            sunrise: new Date(cached.times.sunrise),
            midnight: new Date(cached.times.midnight)
        };

        return this.times;
    }

    /**
     * Format waktu untuk ditampilkan
     */
    formatPrayerTime(time) {
        return formatTime(time);
    }
}

// Export class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PrayerTimes;
}
