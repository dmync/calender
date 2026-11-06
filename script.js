const monthSelect = document.getElementById("labelMonth");
const yearSelect = document.getElementById("labelYear");
const datesGrid = document.getElementById("datesGrid");

const btnPreviousMonth = document.getElementById("btnPreviousMonth");
const btnNextMonth = document.getElementById("btnNextMonth");
const btnPreviousYear = document.getElementById("btnPreviousYear");
const btnNextYear = document.getElementById("btnNextYear");

let currentDate = new Date();


// --------------------------------------------------
// 1. MONTH DROPDOWN
// --------------------------------------------------

const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];

months.forEach((month, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = month;
    monthSelect.appendChild(option);
});


// --------------------------------------------------
// 2. YEAR DROPDOWN
// --------------------------------------------------

function updateYearOptions(selectedYear) {

    yearSelect.innerHTML = "";

    for (let year = 1900; year <= 2100; year++) {

        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;

        yearSelect.appendChild(option);
    }

    if (selectedYear < 1900 || selectedYear > 2100) {

        const option = document.createElement("option");
        option.value = selectedYear;
        option.textContent = selectedYear;

        yearSelect.appendChild(option);
    }

    yearSelect.value = selectedYear;
}

updateYearOptions(currentDate.getFullYear());


// --------------------------------------------------
// 3. VERIFIED OFFICIAL POYA DATES
// --------------------------------------------------

const poyaData = {

    2019: {
        0: [20], 1: [19], 2: [20], 3: [19],
        4: [18, 19], 5: [16], 6: [16], 7: [14],
        8: [13], 9: [13], 10: [12], 11: [11]
    },

    2020: {
        0: [10], 1: [8], 2: [9], 3: [7],
        4: [6, 7], 5: [5], 6: [4], 7: [3],
        8: [1], 9: [1, 29], 10: [29], 11: [29]
    },

    2021: {
        0: [28], 1: [26], 2: [28], 3: [26],
        4: [25, 26], 5: [24], 6: [23], 7: [22],
        8: [20], 9: [20], 10: [18], 11: [18]
    },

    2022: {
        0: [17], 1: [16], 2: [17], 3: [16],
        4: [15, 16], 5: [14], 6: [13], 7: [11],
        8: [10], 9: [9], 10: [7], 11: [7]
    },

    2023: {
        0: [6], 1: [5], 2: [6], 3: [5],
        4: [5, 6], 5: [3], 6: [3], 7: [1, 30],
        8: [29], 9: [28], 10: [27], 11: [26]
    },

    2024: {
        0: [25], 1: [23], 2: [24], 3: [23],
        4: [23, 24], 5: [21], 6: [20], 7: [19],
        8: [17], 9: [17], 10: [15], 11: [15]
    },

    2025: {
        0: [13], 1: [12], 2: [13], 3: [12],
        4: [12, 13], 5: [10], 6: [10], 7: [8],
        8: [7], 9: [6], 10: [5], 11: [4]
    },

    2026: {
        0: [2], 1: [1], 2: [3], 3: [1],
        4: [1, 30, 31], 5: [29], 6: [29], 7: [27],
        8: [26], 9: [25], 10: [24], 11: [23]
    },

    2027: {
        0: [22], 1: [20], 2: [21], 3: [20],
        4: [20, 21], 5: [18], 6: [18], 7: [16],
        8: [15], 9: [15], 10: [13], 11: [13]
    },

    2028: {
        0: [13], 1: [11], 2: [12], 3: [10],
        4: [10, 11], 5: [8], 6: [8], 7: [6],
        8: [4], 9: [4], 10: [2], 11: [1]
    }

};


// --------------------------------------------------
// 4. HOLIDAY API AND CACHE
// --------------------------------------------------

const holidayCache = new Map();


// --------------------------------------------------
// 5. CALCULATE EASTER SUNDAY
// --------------------------------------------------

function calculateEasterSunday(year) {

    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;

    const d = Math.floor(b / 4);
    const e = b % 4;

    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);

    const h = (19 * a + b - d - g + 15) % 30;

    const i = Math.floor(c / 4);
    const k = c % 4;

    const l = (32 + 2 * e + 2 * i - h - k) % 7;

    const m = Math.floor((a + 11 * h + 22 * l) / 451);

    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;

    return new Date(year, month - 1, day);
}


// --------------------------------------------------
// 6. ESTIMATED HOLIDAYS FOR OTHER YEARS
// --------------------------------------------------

function getEstimatedHolidays(year) {

    const holidays = [];

    function addHoliday(month, day, name) {

        const date = new Date(year, month - 1, day);

        if (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
        ) {

            holidays.push({
                date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
                name: name,
                estimated: true
            });

        }
    }

    addHoliday(1, 14, "Thai Pongal Day");
    addHoliday(2, 4, "Independence Day");
    addHoliday(4, 14, "Sinhala and Tamil New Year");
    addHoliday(5, 1, "May Day");
    addHoliday(12, 25, "Christmas Day");

    // Good Friday = Easter Sunday - 2 days
    const easter = calculateEasterSunday(year);

    const goodFriday = new Date(
        year,
        easter.getMonth(),
        easter.getDate() - 2
    );

    addHoliday(
        goodFriday.getMonth() + 1,
        goodFriday.getDate(),
        "Good Friday"
    );

    return holidays;
}


// --------------------------------------------------
// 7. GET HOLIDAYS FROM API
// --------------------------------------------------

async function getHolidayDates(year) {

    if (holidayCache.has(year)) {
        return holidayCache.get(year);
    }

    // API currently supports 2026 and 2027
    if (year === 2026 || year === 2027) {

        try {

            const response = await fetch(
                `https://induwara.lk/api/v1/holidays?year=${year}`
            );

            if (!response.ok) {
                throw new Error("Holiday API request failed");
            }

            const result = await response.json();

            if (
                result.ok &&
                result.data &&
                Array.isArray(result.data.holidays)
            ) {

                const holidays = result.data.holidays.filter(holiday => {

                    const name = (
                        holiday.name ||
                        holiday.name_en ||
                        ""
                    ).toLowerCase();

                    return !name.includes("poya");

                });

                holidayCache.set(year, holidays);

                return holidays;
            }

        } catch (error) {

            console.error("Holiday API error:", error);

        }
    }

    // Fallback for unsupported years or API errors
    const estimatedHolidays = getEstimatedHolidays(year);

    holidayCache.set(year, estimatedHolidays);

    return estimatedHolidays;
}


// --------------------------------------------------
// 8. CALCULATE ESTIMATED FULL MOON DATES
// --------------------------------------------------

function calculatePoyaDates(year) {

    const dates = [];
    const RAD = Math.PI / 180;

    const startK = Math.floor((year - 2000) * 12.3685);

    for (let n = startK - 2; n <= startK + 15; n++) {

        const k = n + 0.5;

        const T = k / 1236.85;
        const T2 = T * T;
        const T3 = T2 * T;
        const T4 = T3 * T;

        let jde =
            2451550.09766 +
            29.530588861 * k +
            0.00015437 * T2 -
            0.000000150 * T3 +
            0.00000000073 * T4;

        const E =
            1 -
            0.002516 * T -
            0.0000074 * T2;

        const M = (
            2.5534 +
            29.10535670 * k -
            0.0000014 * T2 -
            0.00000011 * T3
        ) * RAD;

        const Mp = (
            201.5643 +
            385.81693528 * k +
            0.0107582 * T2 +
            0.00001238 * T3 -
            0.000000058 * T4
        ) * RAD;

        const F = (
            160.7108 +
            390.67050284 * k -
            0.0016118 * T2 -
            0.00000227 * T3 +
            0.000000011 * T4
        ) * RAD;

        const omega = (
            124.7746 -
            1.56375588 * k +
            0.0020672 * T2 +
            0.00000215 * T3
        ) * RAD;

        jde +=
            -0.40614 * Math.sin(Mp) +
            0.17302 * E * Math.sin(M) +
            0.01614 * Math.sin(2 * Mp) +
            0.01043 * Math.sin(2 * F) +
            0.00734 * E * Math.sin(Mp - M) -
            0.00515 * E * Math.sin(Mp + M) +
            0.00209 * E * E * Math.sin(2 * M) -
            0.00111 * Math.sin(Mp - 2 * F) -
            0.00057 * Math.sin(Mp + 2 * F) +
            0.00056 * E * Math.sin(2 * Mp + M) -
            0.00042 * Math.sin(3 * Mp) +
            0.00042 * E * Math.sin(M + 2 * F) +
            0.00038 * E * Math.sin(M - 2 * F) -
            0.00024 * E * Math.sin(2 * Mp - M) -
            0.00017 * Math.sin(omega) -
            0.00007 * Math.sin(Mp + 2 * M) +
            0.00004 * Math.sin(2 * Mp - 2 * F) +
            0.00004 * Math.sin(3 * M) +
            0.00003 * Math.sin(Mp + M - 2 * F) +
            0.00003 * Math.sin(2 * Mp + 2 * F) -
            0.00003 * Math.sin(Mp + M + 2 * F) +
            0.00003 * Math.sin(Mp - M + 2 * F) -
            0.00002 * Math.sin(Mp - M - 2 * F) -
            0.00002 * Math.sin(3 * Mp + M) +
            0.00002 * Math.sin(4 * Mp);

        const timestamp = (jde - 2440587.5) * 86400000;

        const utcDate = new Date(timestamp);

        const dateParts = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Colombo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).formatToParts(utcDate);

        const dateValues = {};

        dateParts.forEach(part => {
            dateValues[part.type] = part.value;
        });

        const localYear = Number(dateValues.year);
        const localMonth = Number(dateValues.month) - 1;
        const localDay = Number(dateValues.day);

        if (localYear === year) {

            dates.push({
                year: localYear,
                month: localMonth,
                day: localDay,
                status: "estimated"
            });

        }
    }

    return dates;
}


// --------------------------------------------------
// 9. GET POYA DATES
// --------------------------------------------------

function getPoyaDates(year) {

    if (poyaData[year]) {

        const officialDates = [];

        Object.keys(poyaData[year]).forEach(month => {

            poyaData[year][month].forEach(day => {

                officialDates.push({
                    year: year,
                    month: Number(month),
                    day: day,
                    status: "official"
                });

            });

        });

        return officialDates;
    }

    return calculatePoyaDates(year);
}


// --------------------------------------------------
// 10. HELPER: CHECK HOLIDAY BOOLEAN
// --------------------------------------------------

function isHolidayType(value) {

    return value === true ||
           value === "true" ||
           value === "yes" ||
           value === 1;
}


// --------------------------------------------------
// 11. CREATE CALENDAR
// --------------------------------------------------

async function createCalendar() {

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const today = new Date();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Update dropdowns
    monthSelect.value = month;

    if (yearSelect.value !== String(year)) {
        updateYearOptions(year);
    }

    // Clear old calendar
    datesGrid.innerHTML = "";

    // Get Poya dates
    const poyaDates = getPoyaDates(year);

    const poyaMap = new Map();

    poyaDates.forEach(poya => {
        poyaMap.set(`${poya.month}-${poya.day}`, poya);
    });

    // Get other holidays
    const holidays = await getHolidayDates(year);

    // Prevent outdated API responses
    if (
        year !== currentDate.getFullYear() ||
        month !== currentDate.getMonth()
    ) {
        return;
    }

    // Create holiday map
    const holidayMap = new Map();

    holidays.forEach(holiday => {

        if (!holiday.date) {
            return;
        }

        const [holidayYear, holidayMonth, holidayDay] =
            holiday.date.split("-").map(Number);

        if (
            holidayYear === year &&
            holidayMonth >= 1 &&
            holidayMonth <= 12
        ) {

            const key = `${holidayMonth - 1}-${holidayDay}`;

            if (!holidayMap.has(key)) {
                holidayMap.set(key, []);
            }

            holidayMap.get(key).push(holiday);
        }

    });


    // Create 35 or 42 calendar cells
    const totalCells = firstDayIndex + totalDays > 35 ? 42 : 35;

    for (let i = 0; i < totalCells; i++) {

        const dayCell = document.createElement("div");

        const dayNum = i - firstDayIndex + 1;

        // Empty cells
        if (i < firstDayIndex || dayNum > totalDays) {

            dayCell.classList.add("blankDay");
            dayCell.textContent = "";

        } else {

            dayCell.textContent = dayNum;

            const cellDate = new Date(year, month, dayNum);

            const dayOfWeek = cellDate.getDay();

            // Weekend
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                dayCell.classList.add("weekendDay");
            }

            // Today
            if (
                dayNum === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()
            ) {

                dayCell.classList.add("todayDay");

            }

            // Poya day
            const poya = poyaMap.get(`${month}-${dayNum}`);

            if (poya) {

                dayCell.classList.add("poyaDay");

                if (poya.status === "official") {

                    dayCell.classList.add("officialPoya");
                    dayCell.title = "Official Poya Day";

                } else {

                    dayCell.classList.add("estimatedPoya");

                    dayCell.title =
                        "Estimated Full Moon - Not an official Poya holiday";

                }
            }


            // ------------------------------------------
            // OTHER HOLIDAYS
            // ------------------------------------------

            const dayHolidays = holidayMap.get(`${month}-${dayNum}`);

            if (dayHolidays && dayHolidays.length > 0) {

                const isEstimated = dayHolidays.some(
                    holiday => holiday.estimated
                );

                // Apply holiday styles
                if (isEstimated) {

                    dayCell.classList.add("estimatedHoliday");

                } else {

                    if (dayHolidays.some(h => isHolidayType(h.public))) {
                        dayCell.classList.add("publicHoliday");
                    }

                    if (dayHolidays.some(h => isHolidayType(h.bank))) {
                        dayCell.classList.add("bankHoliday");
                    }

                    if (dayHolidays.some(h => isHolidayType(h.mercantile))) {
                        dayCell.classList.add("mercantileHoliday");
                    }

                }


                // --------------------------------------
                // HOLIDAY NAME
                // --------------------------------------

                const holidayNames = dayHolidays.map(holiday =>
                    holiday.name ||
                    holiday.name_en ||
                    holiday.name_si ||
                    "Holiday"
                ).join(", ");


                // --------------------------------------
                // HOLIDAY TYPE
                // --------------------------------------

                const holidayTypes = [];

                if (isEstimated) {

                    holidayTypes.push("Estimated Holiday");

                } else {

                    if (dayHolidays.some(h => isHolidayType(h.public))) {
                        holidayTypes.push("Public Holiday");
                    }

                    if (dayHolidays.some(h => isHolidayType(h.bank))) {
                        holidayTypes.push("Bank Holiday");
                    }

                    if (dayHolidays.some(h => isHolidayType(h.mercantile))) {
                        holidayTypes.push("Mercantile Holiday");
                    }

                }


                // --------------------------------------
                // MOUSE HOVER TOOLTIP
                // --------------------------------------

                dayCell.title =
                    holidayNames +
                    " (" + holidayTypes.join(", ") + ")";

                if (isEstimated) {

                    dayCell.title +=
                        " - Not officially confirmed";

                }

            }

        }

        datesGrid.appendChild(dayCell);

    }

}


// --------------------------------------------------
// 12. MONTH DROPDOWN EVENT
// --------------------------------------------------

monthSelect.addEventListener("change", function () {

    currentDate.setDate(1);
    currentDate.setMonth(Number(this.value));

    createCalendar();

});


// --------------------------------------------------
// 13. YEAR DROPDOWN EVENT
// --------------------------------------------------

yearSelect.addEventListener("change", function () {

    currentDate.setDate(1);
    currentDate.setFullYear(Number(this.value));

    createCalendar();

});


// --------------------------------------------------
// 14. NAVIGATION BUTTONS
// --------------------------------------------------

btnPreviousYear.addEventListener("click", () => {

    currentDate.setDate(1);
    currentDate.setFullYear(currentDate.getFullYear() - 1);

    createCalendar();

});


btnNextYear.addEventListener("click", () => {

    currentDate.setDate(1);
    currentDate.setFullYear(currentDate.getFullYear() + 1);

    createCalendar();

});


btnPreviousMonth.addEventListener("click", () => {

    currentDate.setDate(1);
    currentDate.setMonth(currentDate.getMonth() - 1);

    createCalendar();

});


btnNextMonth.addEventListener("click", () => {

    currentDate.setDate(1);
    currentDate.setMonth(currentDate.getMonth() + 1);

    createCalendar();

});


// --------------------------------------------------
// 15. INITIAL CALENDAR
// --------------------------------------------------

createCalendar();
