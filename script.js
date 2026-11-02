const labelMonth = document.getElementById("labelMonth");
const labelYear = document.getElementById("labelYear");
const datesGrid = document.getElementById("datesGrid");

const btnPreviousMonth = document.getElementById("btnPreviousMonth");
const btnNextMonth = document.getElementById("btnNextMonth");
const btnPreviousYear = document.getElementById("btnPreviousYear");
const btnNextYear = document.getElementById("btnNextYear");

let currentDate = new Date();

function createCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const poyaData = {
    2019: {
      0: [20],
      1: [19],
      2: [20],
      3: [19],
      4: [18, 19], // Vesak 2 days
      5: [16],
      6: [16],
      7: [14],
      8: [13],
      9: [13],
      10: [12],
      11: [11]
    },
    2020: {
      0: [10],
      1: [8],
      2: [9],
      3: [7],
      4: [6, 7],  // Vesak 2 days
      5: [5],
      6: [4],
      7: [3],
      8: [1],
      9: [1, 29],
      10: [29],
      11: [29]
    },
    2021: {
      0: [28],
      1: [26],
      2: [28],
      3: [26],
      4: [25, 26],  // Vesak 2 days
      5: [24],
      6: [23],
      7: [22],
      8: [20],
      9: [20],
      10: [18],
      11: [18]
    },
    2022: {
      0: [17],
      1: [16],
      2: [17],
      3: [16],
      4: [15, 16],  // Vesak 2 days
      5: [14],
      6: [13],
      7: [11],
      8: [10],
      9: [9],
      10: [7],
      11: [7]
    },
    2023: {
      0: [6],
      1: [5],
      2: [6],
      3: [5],
      4: [5, 6],  // Vesak 2 days
      5: [3],
      6: [3],
      7: [1, 30],
      8: [29],
      9: [28],
      10: [27],
      11: [26]
    },
    2024: {
      0: [25],
      1: [23],
      2: [24],
      3: [23],
      4: [23, 24],  // Vesak 2 days
      5: [21],
      6: [20],
      7: [19],
      8: [17],
      9: [17],
      10: [15],
      11: [15]
    },
    2025: {
      0: [13],
      1: [12],
      2: [13],
      3: [12],
      4: [12, 13],  // Vesak 2 days
      5: [10],
      6: [10],
      7: [8],
      8: [7],
      9: [6],
      10: [5],
      11: [4]
    },
    2026: {
      0: [2],
      1: [1],
      2: [3],
      3: [1],
      4: [1, 30, 31],  // Vesak 2 days are 1 and 30 May + 31 May extra Poya
      5: [29],
      6: [29],
      7: [27],
      8: [26],
      9: [25],
      10: [24],
      11: [23]
    },
    2027: {
      0: [22],
      1: [20],
      2: [21],
      3: [20],
      4: [20, 21],  // Vesak 2 days
      5: [18],
      6: [18],
      7: [16],
      8: [15],
      9: [15],
      10: [13],
      11: [13]
    },
    2028: {
      0: [13],
      1: [11],
      2: [12],
      3: [10],
      4: [10, 11],  // Vesak 2 days
      5: [8],
      6: [8],
      7: [6],
      8: [4],
      9: [4],
      10: [2],
      11: [1]
    }
  };

  // Finding poya day(s)
  function isPoya(year, month, day) {
    return poyaData[year]?.[month]?.includes(day);
  }

  // Set current month in label
  labelMonth.textContent = currentDate.toLocaleString("default", { month: "long" });
  labelYear.textContent = year;

  datesGrid.innerHTML = "";

  // Finding actualy need 35 or 42 cells for selected month
  const totalCells = firstDayIndex + totalDays > 35 ? 42 : 35;

  //Fill cells 
  for (let i = 0; i < totalCells; i++) {
    const dayCell = document.createElement("div");
    const dayNum = i - firstDayIndex + 1;

    //Set blankday
    if (i < firstDayIndex || dayNum > totalDays) {
      dayCell.classList.add("blankDay");
      dayCell.textContent = "*";
    } 

    else {
      dayCell.textContent = dayNum;
      const cellDate = new Date(year, month, dayNum);
      const dayOfWeek = cellDate.getDay();

      // Set Weekend
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        dayCell.classList.add("weekendDay");
      }

      // Set Today
      if (dayNum === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
        dayCell.classList.add("todayDay");
      }

      // Set Poyaday
      if (isPoya(year, month, dayNum)) {
        dayCell.classList.add("poyaDay");
      }

    }

    datesGrid.appendChild(dayCell);
  }
}

// Display previous year
btnPreviousYear.addEventListener("click", () => {
  currentDate.setFullYear(currentDate.getFullYear() - 1);
  createCalendar();
});

// Display previous year
btnNextYear.addEventListener("click", () => {
  currentDate.setFullYear(currentDate.getFullYear() + 1);
  createCalendar();
});

// Display previous Month
btnPreviousMonth.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  createCalendar();
});

// Display next Month
btnNextMonth.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  createCalendar();
});

createCalendar();
