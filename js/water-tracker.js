(function () {

    "use strict";


    const WATER_LOG_KEY = "vivafit_water_log";       // { "YYYY-MM-DD": ml }
    const WATER_TARGET_KEY = "vivafit_water_target";  // custom override in ml
    const DEFAULT_TARGET_ML = 2500;

    const PROFILE_KEY = "vivafit_profile";

    const QUICK_ADD_OPTIONS = [
        { ml: 250, label: "Glass", icon: "fa-glass-water" },
        { ml: 350, label: "Cup", icon: "fa-mug-hot" },
        { ml: 500, label: "Bottle", icon: "fa-bottle-water" },
        { ml: 1000, label: "Large", icon: "fa-jug-detergent" }
    ];

    const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];



    function todayKey(offsetDays) {
        const d = new Date();
        if (offsetDays) d.setDate(d.getDate() + offsetDays);
        return d.toISOString().slice(0, 10);
    }



    function readLog() {
        try {
            return getData(WATER_LOG_KEY, {}) || {};
        } catch (e) {
            return {};
        }
    }

    function writeLog(log) {
        saveData(WATER_LOG_KEY, log);
    }

    function getToday() {
        const log = readLog();
        return log[todayKey()] || 0;
    }

    function setToday(ml) {
        const log = readLog();
        log[todayKey()] = Math.max(0, ml);
        writeLog(log);
        renderAll();
    }

    function addToday(ml) {
        window.lastWaterAdd = ml;
        setToday(getToday() + ml);
    }

    function getTarget() {
        const custom = getData(WATER_TARGET_KEY, null);
        if (custom > 0) return custom;

        try {
            const profile = getData(PROFILE_KEY, null);
            const weight = profile && parseFloat(profile.weight);
            if (weight > 0) return Math.round(weight * 35);
        } catch (e) { /* fall through to default */ }

        return DEFAULT_TARGET_ML;
    }

    function getStreak() {
        const log = readLog();
        const target = getTarget();
        let streak = 0;
        // Count backwards from yesterday (today doesn't have to be
        // finished yet to keep the streak alive).
        for (let i = 1; i <= 365; i++) {
            const key = todayKey(-i);
            if ((log[key] || 0) >= target) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }



    function renderFullTracker() {

        const root = document.getElementById("waterTrackerCard");
        if (!root) return;

        const ml = getToday();
        const target = getTarget();
        const pct = Math.min(100, Math.round((ml / target) * 100));

        const fillEl = document.getElementById("waterFill");
        const pctEl = document.getElementById("waterPctText");
        const mlEl = document.getElementById("waterMlText");
        const targetEl = document.getElementById("waterTargetText");
        const msgEl = document.getElementById("waterMessage");
        const streakEl = document.getElementById("waterStreakCount");

        if (fillEl) fillEl.style.height = pct + "%";
        if (pctEl) pctEl.textContent = pct + "%";
        if (mlEl) mlEl.textContent = ml + " / " + target + " ml";
        if (targetEl) {
            targetEl.innerHTML = "Daily goal: <strong>" + target + " ml</strong>";
        }

        if (msgEl) {
            let msg;
            if (pct >= 100) {
                msg = "Goal smashed! Your body says thank you. 💧";
                msgEl.classList.add("goal-met");
            } else if (pct >= 66) {
                msg = "Almost there — a couple more glasses to go.";
                msgEl.classList.remove("goal-met");
            } else if (pct >= 33) {
                msg = "Good pace, keep the water coming.";
                msgEl.classList.remove("goal-met");
            } else {
                msg = "Let's get hydrated — tap a quick-add below.";
                msgEl.classList.remove("goal-met");
            }
            msgEl.textContent = msg;
        }

        if (streakEl) streakEl.textContent = getStreak();

        renderWeekStrip();
    }


    function renderWeekStrip() {

        const row = document.getElementById("waterWeekRow");
        if (!row) return;

        const log = readLog();
        const target = getTarget();
        row.innerHTML = "";

        for (let i = 6; i >= 0; i--) {
            const key = todayKey(-i);
            const ml = log[key] || 0;
            const pct = Math.min(100, Math.round((ml / target) * 100));
            const isToday = i === 0;
            const dayIndex = new Date(key + "T00:00:00").getDay();

            const dayWrap = document.createElement("div");
            dayWrap.className = "water-day" + (isToday ? " is-today" : "");

            dayWrap.innerHTML =
                '<div class="water-day-track' +
                    (pct >= 100 ? " complete" : "") +
                    (isToday ? " today" : "") + '">' +
                    '<div class="water-day-fill" style="height:' + pct + '%"></div>' +
                '</div>' +
                '<span class="water-day-name">' + DAY_LABELS[dayIndex] + '</span>';

            row.appendChild(dayWrap);
        }
    }


    function buildQuickAddButtons() {
        const wrap = document.getElementById("waterQuickAdd");
        if (!wrap || wrap.dataset.built) return;

        QUICK_ADD_OPTIONS.forEach(opt => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "water-qty-btn";
            btn.innerHTML =
                '<i class="fa-solid ' + opt.icon + '"></i>' +
                '<span>+' + opt.ml + 'ml</span>';
            btn.addEventListener("click", () => addToday(opt.ml));
            wrap.appendChild(btn);
        });

        wrap.dataset.built = "true";
    }


    function wireFullTrackerEvents() {

        buildQuickAddButtons();

        const customInput = document.getElementById("waterCustomInput");
        const customBtn = document.getElementById("waterCustomAddBtn");

        if (customBtn && !customBtn.dataset.wired) {
            customBtn.addEventListener("click", () => {
                const val = parseInt(customInput.value, 10);
                if (val > 0) {
                    addToday(val);
                    customInput.value = "";
                }
            });
            customBtn.dataset.wired = "true";
        }

        if (customInput && !customInput.dataset.wired) {
            customInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") customBtn.click();
            });
            customInput.dataset.wired = "true";
        }

        const undoBtn = document.getElementById("waterUndoBtn");
        if (undoBtn && !undoBtn.dataset.wired) {
            undoBtn.addEventListener("click", () => {
                if (window.lastWaterAdd) {
                    setToday(getToday() - window.lastWaterAdd);
                    window.lastWaterAdd = 0;
                }
            });
            undoBtn.dataset.wired = "true";
        }

        const resetBtn = document.getElementById("waterResetBtn");
        if (resetBtn && !resetBtn.dataset.wired) {
            resetBtn.addEventListener("click", () => {
                if (confirm("Reset today's water log to 0ml?")) setToday(0);
            });
            resetBtn.dataset.wired = "true";
        }
    }


    function renderMiniWidget() {

        const root = document.getElementById("waterMiniWidget");
        if (!root) return;

        const ml = getToday();
        const target = getTarget();
        const pct = Math.min(100, Math.round((ml / target) * 100));

        const ringFill = document.getElementById("waterMiniRingFill");
        const label = document.getElementById("waterMiniLabel");
        const sub = document.getElementById("waterMiniSub");

        if (ringFill) {
            const circumference = 2 * Math.PI * 26; // r=26
            const offset = circumference - (pct / 100) * circumference;
            ringFill.style.strokeDasharray = circumference;
            ringFill.style.strokeDashoffset = offset;
        }

        if (label) label.textContent = ml + " / " + target + " ml";
        if (sub) sub.textContent = pct >= 100 ? "Goal reached today 🎉" : pct + "% of today's goal";
    }



    function renderAll() {
        renderFullTracker();
        renderMiniWidget();
    }

    document.addEventListener("DOMContentLoaded", function () {
        wireFullTrackerEvents();
        renderAll();
    });

    window.VivaWater = {
        getToday,
        getTarget,
        getStreak,
        addToday,
        setToday
    };

})();