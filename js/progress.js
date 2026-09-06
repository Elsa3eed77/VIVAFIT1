// =========================================
// MOTIVATION QUOTES
// =========================================

var quotes = [
    "The only bad workout is the one that didn't happen.",
    "Your body can stand almost anything. It's your mind that you have to convince.",
    "Strength does not come from the body. It comes from the will.",
    "The pain you feel today will be the strength you feel tomorrow.",
    "Don't limit your challenges. Challenge your limits.",
    "Success is walking from failure to failure with no loss of enthusiasm.",
    "The hard days are the best because that's when champions are made.",
    "Take care of your body. It's the only place you have to live.",
    "Motivation is what gets you started. Habit is what keeps you going.",
    "The only way to prove you are a good sport is to lose.",
    "Push harder than yesterday if you want a different tomorrow.",
    "You don't have to be extreme, just consistent.",
    "The body achieves what the mind believes.",
    "Wake up with determination. Go to bed with satisfaction.",
    "A one-hour workout is only 4% of your day. No excuses.",
    "The difference between try and triumph is a little umph.",
    "Fitness is not about being better than someone else. It's about being better than you used to be.",
    "Sweat is just fat crying.",
    "Discipline is choosing between what you want now and what you want most.",
    "Small daily improvements over time lead to stunning results.",
    "The clock is ticking. Are you becoming the person you want to be?",
    "Strength does not come from winning. Your struggles develop your strengths.",
    "The last three or four reps is what makes the muscle grow.",
    "You miss 100% of the shots you don't take.",
    "The real workout starts when you want to stop.",
    "Don't wish for a good body, work for it.",
    "Your health is an investment, not an expense.",
    "A champion is someone who gets up when they can't.",
    "The only limit is the one you set yourself.",
    "Fall seven times, stand up eight.",
    "The harder the battle, the sweeter the victory.",
    "What hurts today makes you stronger tomorrow.",
    "No pain, no gain. Shut up and train.",
    "The body achieves what the mind believes.",
    "Train insane or remain the same.",
    "Strive for progress, not perfection.",
    "Be stronger than your strongest excuse.",
    "The pain you feel today will be the silence you hear tomorrow.",
    "Don't stop when you're tired. Stop when you're done.",
    "Success isn't always about greatness. It's about consistency."
];

var currentQuoteIndex = -1;
var quoteInterval = null;


function showRandomQuote() {
    var index;
    do {
        index = Math.floor(Math.random() * quotes.length);
    } while (index === currentQuoteIndex && quotes.length > 1);
    currentQuoteIndex = index;

    var quoteEl = document.getElementById("motivationQuote");
    if (quoteEl) {
        quoteEl.style.opacity = "0";
        quoteEl.style.transform = "translateY(8px)";

        setTimeout(function () {
            quoteEl.textContent = quotes[index];
            quoteEl.style.opacity = "1";
            quoteEl.style.transform = "translateY(0)";
        }, 300);
    }
}

function startQuoteRotation() {
    showRandomQuote();
    quoteInterval = setInterval(showRandomQuote, 8000);
}


// =========================================
// LOCALSTORAGE HELPERS
// =========================================

function getStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
        return [];
    }
}

function setStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getProfile() {
    try {
        return JSON.parse(localStorage.getItem("vivafitProfile")) || {};
    } catch {
        return {};
    }
}

function getSavedWorkouts() {
    return getStorage("vivafitWorkouts");
}

function getWeightLog() {
    return getStorage("vivafitWeightLog");
}

function getMeasurements() {
    return getStorage("vivafitMeasurements");
}

function getLiftLog() {
    return getStorage("vivafitLiftLog");
}


// =========================================
// DATE HELPERS
// =========================================

function formatDateShort(dateStr) {
    var d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getWeekLabel(date) {
    var d = new Date(date);
    var start = new Date(d);
    start.setDate(d.getDate() - d.getDay());
    var end = new Date(start);
    end.setDate(start.getDate() + 6);
    return formatDateShort(start) + " - " + formatDateShort(end);
}

function isSameWeek(d1, d2) {
    var a = new Date(d1);
    var b = new Date(d2);
    var startA = new Date(a);
    startA.setDate(a.getDate() - a.getDay());
    startA.setHours(0, 0, 0, 0);
    var startB = new Date(b);
    startB.setDate(b.getDate() - b.getDay());
    startB.setHours(0, 0, 0, 0);
    return startA.getTime() === startB.getTime();
}

function toISODate(date) {
    var d = new Date(date);
    var year = d.getFullYear();
    var month = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
}

function todayStr() {
    return toISODate(new Date());
}


// =========================================
// UNIQUE EXERCISES (from workouts.js data)
// =========================================

var exerciseList = [
    "Bench Press", "Overhead Press", "Barbell Row", "Bicep Curls", "Tricep Dips",
    "Barbell Squat", "Romanian Deadlift", "Leg Press", "Walking Lunges", "Calf Raises",
    "Deadlift", "Pull-Ups", "Plank", "Jump Rope", "Burpees",
    "Mountain Climbers", "High Knees", "Jumping Jacks",
    "Incline Bench Press", "Dumbbell Shoulder Press", "Cable Flyes",
    "Lateral Raises", "Tricep Pushdowns", "Seated Cable Row", "Face Pulls",
    "Hammer Curls", "Front Squat", "Bulgarian Split Squat", "Leg Curl",
    "Leg Extension", "Hip Thrust", "Back Squat"
];


// =========================================
// STATS
// =========================================

function computeStats() {
    var workouts = getSavedWorkouts();
    var weightLog = getWeightLog();
    var liftLog = getLiftLog();

    var totalWorkouts = workouts.length;

    var streak = 0;
    if (workouts.length > 0) {
        var dates = workouts.map(function (w) {
            return toISODate(w.addedAt);
        });
        var unique = [];
        dates.forEach(function (d) {
            if (unique.indexOf(d) === -1) unique.push(d);
        });
        unique.sort(function (a, b) {
            return new Date(b) - new Date(a);
        });

        var checkDate = new Date();
        checkDate.setHours(0, 0, 0, 0);

        for (var i = 0; i < unique.length; i++) {
            var d = new Date(unique[i]);
            d.setHours(0, 0, 0, 0);
            var expected = new Date(checkDate);
            expected.setDate(expected.getDate() - i);
            expected.setHours(0, 0, 0, 0);
            if (d.getTime() === expected.getTime()) {
                streak++;
            } else {
                break;
            }
        }
    }

    var weightChange = 0;
    if (weightLog.length >= 2) {
        weightChange = weightLog[weightLog.length - 1].weight - weightLog[0].weight;
    }

    var totalLifts = liftLog.length;

    return {
        totalWorkouts: totalWorkouts,
        streak: streak,
        weightChange: weightChange,
        totalLifts: totalLifts
    };
}

function renderStats() {
    var stats = computeStats();

    document.getElementById("statWorkouts").textContent = stats.totalWorkouts;
    document.getElementById("statStreak").textContent = stats.streak;
    document.getElementById("statLifts").textContent = stats.totalLifts;

    var wcEl = document.getElementById("statWeightChange");
    if (stats.weightChange === 0) {
        wcEl.textContent = "--";
    } else {
        var sign = stats.weightChange > 0 ? "+" : "";
        wcEl.textContent = sign + stats.weightChange.toFixed(1) + " kg";
    }
}


// =========================================
// CHART.JS DEFAULTS
// =========================================

var chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: "#a6a9b5",
                font: { size: 12, family: "Inter, Arial, sans-serif" },
                padding: 20
            }
        },
        tooltip: {
            backgroundColor: "rgba(13, 17, 28, 0.95)",
            titleColor: "#ffffff",
            bodyColor: "#d2d4dc",
            borderColor: "rgba(255, 255, 255, 0.16)",
            borderWidth: 1,
            cornerRadius: 10,
            padding: 12,
            titleFont: { weight: "700" }
        }
    },
    scales: {
        x: {
            ticks: { color: "#a6a9b5", font: { size: 11 } },
            grid: { color: "rgba(255, 255, 255, 0.06)" },
            border: { color: "rgba(255, 255, 255, 0.1)" }
        },
        y: {
            ticks: { color: "#a6a9b5", font: { size: 11 } },
            grid: { color: "rgba(255, 255, 255, 0.06)" },
            border: { color: "rgba(255, 255, 255, 0.1)" }
        }
    }
};


// =========================================
// WEIGHT CHART
// =========================================

var weightChart = null;

function renderWeightChart() {
    var data = getWeightLog();
    var labels = data.map(function (d) { return formatDateShort(d.date); });
    var values = data.map(function (d) { return d.weight; });

    var ctx = document.getElementById("weightChart").getContext("2d");

    if (weightChart) weightChart.destroy();

    weightChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Weight (kg)",
                data: values,
                borderColor: "#ff1530",
                backgroundColor: function (context) {
                    var chart = context.chart;
                    var ctx2 = chart.ctx;
                    var area = chart.chartArea;
                    if (!area) return "rgba(255, 21, 48, 0.1)";
                    var gradient = ctx2.createLinearGradient(0, area.top, 0, area.bottom);
                    gradient.addColorStop(0, "rgba(255, 21, 48, 0.35)");
                    gradient.addColorStop(1, "rgba(255, 21, 48, 0.02)");
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "#ff1530",
                pointBorderColor: "#ffffff",
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8
            }]
        },
        options: {
            ...chartDefaults,
            plugins: {
                ...chartDefaults.plugins,
                legend: { display: false }
            }
        }
    });
}


// =========================================
// MEASUREMENTS CHART
// =========================================

var measurementsChart = null;

function renderMeasurementsChart() {
    var data = getMeasurements();
    var labels = data.map(function (d) { return formatDateShort(d.date); });

    var colors = ["#ff1530", "#d90072", "#ff6b6b", "#ff9a76"];
    var names = ["Chest", "Waist", "Arms", "Thighs"];
    var keys = ["chest", "waist", "arms", "thighs"];

    var datasets = keys.map(function (key, i) {
        return {
            label: names[i],
            data: data.map(function (d) { return d[key] || null; }),
            borderColor: colors[i],
            backgroundColor: "transparent",
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 7,
            borderWidth: 2
        };
    });

    var ctx = document.getElementById("measurementsChart").getContext("2d");

    if (measurementsChart) measurementsChart.destroy();

    measurementsChart = new Chart(ctx, {
        type: "line",
        data: { labels: labels, datasets: datasets },
        options: chartDefaults
    });
}


// =========================================
// LIFT CHART
// =========================================

var liftChart = null;

function renderLiftChart() {
    var data = getLiftLog();

    var exerciseMap = {};
    data.forEach(function (entry) {
        if (!exerciseMap[entry.exercise]) {
            exerciseMap[entry.exercise] = [];
        }
        exerciseMap[entry.exercise].push(entry.weight);
    });

    var exercises = Object.keys(exerciseMap).slice(0, 8);
    var avgWeights = exercises.map(function (ex) {
        var weights = exerciseMap[ex];
        var sum = weights.reduce(function (a, b) { return a + b; }, 0);
        return Math.round(sum / weights.length);
    });

    var ctx = document.getElementById("liftChart").getContext("2d");

    if (liftChart) liftChart.destroy();

    liftChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: exercises,
            datasets: [{
                label: "Avg Weight (kg)",
                data: avgWeights,
                backgroundColor: function (context) {
                    var chart = context.chart;
                    var ctx2 = chart.ctx;
                    var area = chart.chartArea;
                    if (!area) return "rgba(255, 21, 48, 0.6)";
                    var gradient = ctx2.createLinearGradient(0, area.bottom, 0, area.top);
                    gradient.addColorStop(0, "rgba(255, 21, 48, 0.4)");
                    gradient.addColorStop(1, "rgba(217, 0, 114, 0.8)");
                    return gradient;
                },
                borderColor: "#ff1530",
                borderWidth: 1,
                borderRadius: 6
            }]
        },
        options: {
            ...chartDefaults,
            plugins: {
                ...chartDefaults.plugins,
                legend: { display: false }
            },
            scales: {
                ...chartDefaults.scales,
                x: {
                    ...chartDefaults.scales.x,
                    ticks: {
                        ...chartDefaults.scales.x.ticks,
                        maxRotation: 45,
                        minRotation: 30
                    }
                }
            }
        }
    });
}


// =========================================
// WORKOUTS PER WEEK CHART
// =========================================

var workoutsPerWeekChart = null;

function renderWorkoutsPerWeekChart() {
    var workouts = getSavedWorkouts();
    var weeks = [];
    var now = new Date();

    for (var i = 7; i >= 0; i--) {
        var weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay() - (i * 7));
        weekStart.setHours(0, 0, 0, 0);
        weeks.push({
            start: new Date(weekStart),
            label: getWeekLabel(weekStart),
            count: 0
        });
    }

    workouts.forEach(function (w) {
        var wDate = new Date(w.addedAt);
        for (var j = 0; j < weeks.length; j++) {
            if (isSameWeek(wDate, weeks[j].start)) {
                weeks[j].count++;
                break;
            }
        }
    });

    var labels = weeks.map(function (w) { return w.label; });
    var counts = weeks.map(function (w) { return w.count; });

    var ctx = document.getElementById("workoutsPerWeekChart").getContext("2d");

    if (workoutsPerWeekChart) workoutsPerWeekChart.destroy();

    workoutsPerWeekChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Workouts",
                data: counts,
                backgroundColor: function (context) {
                    var chart = context.chart;
                    var ctx2 = chart.ctx;
                    var area = chart.chartArea;
                    if (!area) return "rgba(255, 21, 48, 0.6)";
                    var gradient = ctx2.createLinearGradient(0, area.bottom, 0, area.top);
                    gradient.addColorStop(0, "rgba(255, 21, 48, 0.3)");
                    gradient.addColorStop(1, "rgba(255, 21, 48, 0.85)");
                    return gradient;
                },
                borderColor: "#ff1530",
                borderWidth: 1,
                borderRadius: 6
            }]
        },
        options: {
            ...chartDefaults,
            plugins: {
                ...chartDefaults.plugins,
                legend: { display: false }
            },
            scales: {
                ...chartDefaults.scales,
                y: {
                    ...chartDefaults.scales.y,
                    beginAtZero: true,
                    ticks: {
                        ...chartDefaults.scales.y.ticks,
                        stepSize: 1
                    }
                }
            }
        }
    });
}


// =========================================
// SETS BREAKDOWN DOUGHNUT
// =========================================

var setsChart = null;

function renderSetsChart() {
    var data = getLiftLog();
    var normal = 0;
    var warmup = 0;
    var failure = 0;

    data.forEach(function (entry) {
        normal += entry.normalSets || 0;
        warmup += entry.warmupSets || 0;
        failure += entry.failureSets || 0;
    });

    var total = normal + warmup + failure;
    var isEmpty = total === 0;

    var ctx = document.getElementById("setsChart").getContext("2d");

    if (setsChart) setsChart.destroy();

    if (isEmpty) {
        setsChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["No data yet"],
                datasets: [{
                    data: [1],
                    backgroundColor: ["rgba(255, 255, 255, 0.06)"],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "65%",
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
        return;
    }

    setsChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Normal Sets", "Warmup Sets", "Failure Sets"],
            datasets: [{
                data: [normal, warmup, failure],
                backgroundColor: ["#ff1530", "#ff6b6b", "#d90072"],
                borderColor: "rgba(8, 11, 19, 0.8)",
                borderWidth: 3,
                hoverBorderColor: "#ffffff"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "65%",
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: "#a6a9b5",
                        font: { size: 12, family: "Inter, Arial, sans-serif" },
                        padding: 16,
                        usePointStyle: true,
                        pointStyleWidth: 10
                    }
                },
                tooltip: {
                    backgroundColor: "rgba(13, 17, 28, 0.95)",
                    titleColor: "#ffffff",
                    bodyColor: "#d2d4dc",
                    borderColor: "rgba(255, 255, 255, 0.16)",
                    borderWidth: 1,
                    cornerRadius: 10,
                    padding: 12
                }
            }
        }
    });
}


// =========================================
// FORM: LOG WEIGHT
// =========================================

function initWeightForm() {
    var dateInput = document.getElementById("weightDate");
    var weightInput = document.getElementById("weightInput");
    var btn = document.getElementById("logWeightBtn");
    var msg = document.getElementById("weightMsg");

    dateInput.value = todayStr();

    btn.addEventListener("click", function () {
        var date = dateInput.value;
        var weight = parseFloat(weightInput.value);

        if (!date) {
            msg.textContent = "Please select a date.";
            msg.style.color = "#ff4a60";
            return;
        }
        if (isNaN(weight) || weight <= 0 || weight > 500) {
            msg.textContent = "Enter a valid weight (1-500 kg).";
            msg.style.color = "#ff4a60";
            return;
        }

        var log = getWeightLog();

        var existing = log.findIndex(function (e) {
            return e.date === date;
        });

        if (existing >= 0) {
            log[existing].weight = weight;
        } else {
            log.push({ date: date, weight: weight });
        }

        log.sort(function (a, b) {
            return new Date(a.date) - new Date(b.date);
        });

        setStorage("vivafitWeightLog", log);

        weightInput.value = "";
        msg.textContent = "Weight logged!";
        msg.style.color = "#45e58a";

        setTimeout(function () { msg.textContent = ""; }, 2000);

        renderWeightChart();
        renderStats();
    });
}


// =========================================
// FORM: LOG MEASUREMENTS
// =========================================

function initMeasurementsForm() {
    var dateInput = document.getElementById("measureDate");
    var chestInput = document.getElementById("chestInput");
    var waistInput = document.getElementById("waistInput");
    var armsInput = document.getElementById("armsInput");
    var thighsInput = document.getElementById("thighsInput");
    var btn = document.getElementById("logMeasureBtn");
    var msg = document.getElementById("measureMsg");

    dateInput.value = todayStr();

    btn.addEventListener("click", function () {
        var date = dateInput.value;

        if (!date) {
            msg.textContent = "Please select a date.";
            msg.style.color = "#ff4a60";
            return;
        }

        var chest = parseFloat(chestInput.value) || null;
        var waist = parseFloat(waistInput.value) || null;
        var arms = parseFloat(armsInput.value) || null;
        var thighs = parseFloat(thighsInput.value) || null;

        if (chest === null && waist === null && arms === null && thighs === null) {
            msg.textContent = "Enter at least one measurement.";
            msg.style.color = "#ff4a60";
            return;
        }

        var log = getMeasurements();

        var existing = log.findIndex(function (e) {
            return e.date === date;
        });

        var entry = { date: date };
        if (chest !== null) entry.chest = chest;
        if (waist !== null) entry.waist = waist;
        if (arms !== null) entry.arms = arms;
        if (thighs !== null) entry.thighs = thighs;

        if (existing >= 0) {
            log[existing] = entry;
        } else {
            log.push(entry);
        }

        log.sort(function (a, b) {
            return new Date(a.date) - new Date(b.date);
        });

        setStorage("vivafitMeasurements", log);

        chestInput.value = "";
        waistInput.value = "";
        armsInput.value = "";
        thighsInput.value = "";

        msg.textContent = "Measurements logged!";
        msg.style.color = "#45e58a";

        setTimeout(function () { msg.textContent = ""; }, 2000);

        renderMeasurementsChart();
    });
}


// =========================================
// FORM: LOG LIFT
// =========================================

function initLiftForm() {
    var dateInput = document.getElementById("liftDate");
    var exerciseSelect = document.getElementById("exerciseSelect");
    var weightInput = document.getElementById("liftWeightInput");
    var repsInput = document.getElementById("liftRepsInput");
    var normalInput = document.getElementById("normalSetsInput");
    var warmupInput = document.getElementById("warmupSetsInput");
    var failureInput = document.getElementById("failureSetsInput");
    var btn = document.getElementById("logLiftBtn");
    var msg = document.getElementById("liftMsg");

    dateInput.value = todayStr();

    exerciseList.forEach(function (name) {
        var opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        exerciseSelect.appendChild(opt);
    });

    btn.addEventListener("click", function () {
        var date = dateInput.value;
        var exercise = exerciseSelect.value;
        var weight = parseFloat(weightInput.value);
        var reps = parseInt(repsInput.value);
        var normalSets = parseInt(normalInput.value) || 0;
        var warmupSets = parseInt(warmupInput.value) || 0;
        var failureSets = parseInt(failureInput.value) || 0;

        if (!date) {
            msg.textContent = "Please select a date.";
            msg.style.color = "#ff4a60";
            return;
        }
        if (!exercise) {
            msg.textContent = "Please select an exercise.";
            msg.style.color = "#ff4a60";
            return;
        }
        if (isNaN(weight) || weight <= 0) {
            msg.textContent = "Enter a valid weight.";
            msg.style.color = "#ff4a60";
            return;
        }
        if (isNaN(reps) || reps <= 0) {
            msg.textContent = "Enter valid reps.";
            msg.style.color = "#ff4a60";
            return;
        }

        var log = getLiftLog();

        log.push({
            date: date,
            exercise: exercise,
            weight: weight,
            reps: reps,
            normalSets: normalSets,
            warmupSets: warmupSets,
            failureSets: failureSets
        });

        log.sort(function (a, b) {
            return new Date(a.date) - new Date(b.date);
        });

        setStorage("vivafitLiftLog", log);

        weightInput.value = "";
        repsInput.value = "";
        normalInput.value = "";
        warmupInput.value = "";
        failureInput.value = "";

        msg.textContent = "Lift logged!";
        msg.style.color = "#45e58a";

        setTimeout(function () { msg.textContent = ""; }, 2000);

        renderLiftChart();
        renderSetsChart();
        renderStats();
    });
}


// =========================================
// ADAPTIVE INSIGHTS (Progress Page)
// =========================================

function renderAdaptiveInsights() {
    var container = document.getElementById("progressAdaptiveInsights");
    if (!container || typeof analyzeExercise === "undefined") return;

    var liftLog = getLiftLog();
    if (liftLog.length === 0) {
        container.innerHTML = '<div class="chart-empty"><i class="fa-solid fa-wand-magic-sparkles"></i><p>Log lifts to see adaptive insights.</p></div>';
        return;
    }

    var exerciseMap = {};
    liftLog.forEach(function (entry) {
        if (!exerciseMap[entry.exercise]) {
            exerciseMap[entry.exercise] = [];
        }
        exerciseMap[entry.exercise].push(entry);
    });

    var exercises = Object.keys(exerciseMap);
    var insights = [];

    exercises.forEach(function (name) {
        var analysis = analyzeExercise(name);
        if (analysis.hasData) {
            insights.push(analysis);
        }
    });

    if (insights.length === 0) {
        container.innerHTML = '<div class="chart-empty"><i class="fa-solid fa-wand-magic-sparkles"></i><p>Not enough data for insights yet. Keep logging!</p></div>';
        return;
    }

    var html = '<div class="adaptive-recommendations">';

    insights.forEach(function (insight) {
        var action = "stable";
        var color = "#a6a9b5";
        var icon = "fa-solid fa-equals";
        var msg = "";

        if (insight.isGettingEasier) {
            action = "progressing";
            color = "#45e58a";
            icon = "fa-solid fa-arrow-trend-up";
            msg = "Getting easier. Consider increasing weight by ~2.5-5%.";
        } else if (insight.isGettingHarder) {
            action = "struggling";
            color = "#ff4a60";
            icon = "fa-solid fa-arrow-trend-down";
            msg = "Getting harder. Consider reducing weight by ~5% or taking a deload.";
        } else if (insight.isImproving) {
            action = "improving";
            color = "#45e58a";
            icon = "fa-solid fa-chart-line";
            msg = "Good progress! Maintain or slightly increase intensity.";
        } else {
            msg = "Performance stable. Keep building consistency.";
        }

        html += '<div class="adaptive-rec-card action-' + (action === "struggling" ? "decrease" : action === "progressing" || action === "improving" ? "increase" : "keep") + '">';
        html += '<div class="adaptive-rec-header">';
        html += '<i class="' + icon + '" style="color:' + color + '"></i>';
        html += '<span class="adaptive-rec-exercise">' + insight.exercise + '</span>';
        html += '<span class="adaptive-rec-badge badge-' + (action === "struggling" ? "decrease" : action === "progressing" || action === "improving" ? "increase" : "keep") + '">' + insight.sessions + ' sessions</span>';
        html += '</div>';

        html += '<div class="adaptive-reason">';
        html += '<i class="fa-solid fa-circle-info"></i>';
        html += '<span>' + msg + ' (Avg RPE: ' + insight.recentAvgRPE + ', Avg Weight: ' + insight.recentAvgWeight + ' kg)</span>';
        html += '</div>';

        html += '</div>';
    });

    html += '</div>';

    container.innerHTML = html;
}


// =========================================
// INIT
// =========================================

document.addEventListener("DOMContentLoaded", function () {
    startQuoteRotation();
    renderStats();
    renderWeightChart();
    renderMeasurementsChart();
    renderLiftChart();
    renderWorkoutsPerWeekChart();
    renderSetsChart();
    initWeightForm();
    initMeasurementsForm();
    initLiftForm();
    renderAdaptiveInsights();
});
