// =========================================
// ADAPTIVE WORKOUT SYSTEM
// =========================================

var ADAPTIVE_STORAGE = {
    performance: "vivafitWorkoutPerformance",
    recommendations: "vivafitWorkoutRecommendations",
    history: "vivafitAdaptiveHistory"
};

// =========================================
// STORAGE HELPERS
// =========================================

function getAdaptiveStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
        return [];
    }
}

function setAdaptiveStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// =========================================
// PERFORMANCE TRACKING
// =========================================

function logWorkoutPerformance(entry) {
    var log = getAdaptiveStorage(ADAPTIVE_STORAGE.performance);
    log.push({
        date: entry.date || todayStr(),
        workoutId: entry.workoutId,
        exercise: entry.exercise,
        weight: parseFloat(entry.weight) || 0,
        reps: parseInt(entry.reps) || 0,
        sets: parseInt(entry.sets) || 0,
        completedSets: parseInt(entry.completedSets) || 0,
        rpe: parseInt(entry.rpe) || 5,
        notes: entry.notes || ""
    });
    log.sort(function (a, b) {
        return new Date(a.date) - new Date(b.date);
    });
    setAdaptiveStorage(ADAPTIVE_STORAGE.performance, log);
}

function getPerformanceLog() {
    return getAdaptiveStorage(ADAPTIVE_STORAGE.performance);
}

function getPerformanceForExercise(exerciseName) {
    var log = getPerformanceLog();
    return log.filter(function (entry) {
        return entry.exercise === exerciseName;
    });
}

// =========================================
// ANALYSIS ENGINE
// =========================================

function analyzeExercise(exerciseName) {
    var entries = getPerformanceForExercise(exerciseName);

    if (entries.length === 0) {
        return {
            exercise: exerciseName,
            hasData: false,
            sessions: 0
        };
    }

    var sessions = entries.length;
    var recentCount = Math.min(3, Math.ceil(sessions / 2));
    var recentEntries = entries.slice(-recentCount);
    var olderEntries = entries.slice(0, sessions - recentCount);

    var recentAvgRPE = average(recentEntries.map(function (e) { return e.rpe; }));
    var recentAvgWeight = average(recentEntries.map(function (e) { return e.weight; }));
    var recentAvgReps = average(recentEntries.map(function (e) { return e.reps; }));
    var recentAvgSets = average(recentEntries.map(function (e) { return e.completedSets || e.sets; }));

    var olderAvgRPE = olderEntries.length > 0
        ? average(olderEntries.map(function (e) { return e.rpe; }))
        : recentAvgRPE;
    var olderAvgWeight = olderEntries.length > 0
        ? average(olderEntries.map(function (e) { return e.weight; }))
        : recentAvgWeight;

    var rpeTrend = recentAvgRPE - olderAvgRPE;
    var weightTrend = recentAvgWeight - olderAvgWeight;

    var isGettingEasier = rpeTrend < -0.5 || (recentAvgRPE <= 5 && weightTrend >= 0);
    var isGettingHarder = rpeTrend > 0.5 || (recentAvgRPE >= 8 && weightTrend <= 0);
    var isImproving = weightTrend > 0 && rpeTrend <= 0.5;

    var maxRPE = Math.max.apply(null, recentEntries.map(function (e) { return e.rpe; }));
    var minRPE = Math.min.apply(null, recentEntries.map(function (e) { return e.rpe; }));

    return {
        exercise: exerciseName,
        hasData: true,
        sessions: sessions,
        recentSessions: recentCount,
        recentAvgRPE: round(recentAvgRPE, 1),
        recentAvgWeight: round(recentAvgWeight, 1),
        recentAvgReps: round(recentAvgReps, 0),
        recentAvgSets: round(recentAvgSets, 0),
        olderAvgRPE: round(olderAvgRPE, 1),
        olderAvgWeight: round(olderAvgWeight, 1),
        rpeTrend: round(rpeTrend, 2),
        weightTrend: round(weightTrend, 1),
        isGettingEasier: isGettingEasier,
        isGettingHarder: isGettingHarder,
        isImproving: isImproving,
        maxRPE: maxRPE,
        minRPE: minRPE
    };
}

function analyzeWorkoutExercises(workout) {
    if (!workout || !workout.exercises) return [];
    return workout.exercises.map(function (ex) {
        return analyzeExercise(ex.name);
    });
}

// =========================================
// RECOMMENDATION ENGINE
// =========================================

function generateRecommendation(exerciseName, originalExercise) {
    var analysis = analyzeExercise(exerciseName);

    if (!analysis.hasData) {
        return {
            exercise: exerciseName,
            action: "keep",
            reason: "No previous data found. Start logging to get adaptive recommendations.",
            suggestedWeight: 0,
            suggestedReps: originalExercise.reps,
            suggestedSets: originalExercise.sets,
            suggestedRest: originalExercise.rest,
            confidence: "none",
            icon: "fa-solid fa-info-circle",
            color: "#a6a9b5"
        };
    }

    var suggestedWeight = analysis.recentAvgWeight;
    var suggestedReps = parseReps(originalExercise.reps);
    var suggestedSets = originalExercise.sets;
    var suggestedRest = originalExercise.rest;
    var action = "keep";
    var reason = "";
    var confidence = "medium";
    var icon = "fa-solid fa-equals";
    var color = "#a6a9b5";

    if (analysis.isGettingEasier) {
        action = "increase";
        confidence = analysis.rpeTrend < -1 ? "high" : "medium";

        if (analysis.recentAvgRPE <= 4) {
            suggestedWeight = round(analysis.recentAvgWeight * 1.05, 0.5);
            reason = exerciseName + " feels easy (avg RPE " + analysis.recentAvgRPE + "). You've been consistent. Increase weight by ~5% to keep progressing.";
            icon = "fa-solid fa-arrow-up";
            color = "#45e58a";
        } else {
            suggestedWeight = round(analysis.recentAvgWeight * 1.025, 0.5);
            reason = exerciseName + " is trending easier (RPE dropped by " + Math.abs(analysis.rpeTrend) + "). A small ~2.5% weight increase will maintain challenge.";
            icon = "fa-solid fa-arrow-trend-up";
            color = "#ff9a76";
        }
    } else if (analysis.isGettingHarder) {
        action = "decrease";
        confidence = analysis.rpeTrend > 1.5 ? "high" : "medium";

        if (analysis.recentAvgRPE >= 9) {
            suggestedWeight = round(analysis.recentAvgWeight * 0.9, 0.5);
            suggestedReps = Math.max(6, suggestedReps - 2);
            reason = exerciseName + " is very challenging (avg RPE " + analysis.recentAvgRPE + "). Reduce weight by ~10% and reps by 2 to recover and rebuild.";
            icon = "fa-solid fa-arrow-down";
            color = "#ff4a60";
        } else {
            suggestedWeight = round(analysis.recentAvgWeight * 0.95, 0.5);
            reason = exerciseName + " is getting harder (RPE increased by " + analysis.rpeTrend + "). Reduce weight by ~5% to maintain form and prevent overtraining.";
            icon = "fa-solid fa-arrow-trend-down";
            color = "#ff9a76";
        }
    } else if (analysis.isImproving) {
        action = "increase";
        confidence = "high";
        suggestedWeight = round(analysis.recentAvgWeight * 1.025, 0.5);
        reason = exerciseName + " is improving! Weight is up while RPE stays stable. A small ~2.5% increase keeps the positive trend going.";
        icon = "fa-solid fa-chart-line";
        color = "#45e58a";
    } else {
        action = "keep";
        confidence = "low";
        reason = exerciseName + " performance is stable (RPE " + analysis.recentAvgRPE + "). Maintain current parameters to build consistency.";
        icon = "fa-solid fa-equals";
        color = "#a6a9b5";
    }

    if (analysis.sessions >= 5 && analysis.recentAvgRPE >= 3 && analysis.recentAvgRPE <= 7) {
        suggestedReps = Math.min(suggestedReps + 1, 20);
        if (action === "keep") {
            reason += " Consider adding 1 rep to increase volume gradually.";
        }
    }

    return {
        exercise: exerciseName,
        action: action,
        reason: reason,
        suggestedWeight: suggestedWeight,
        suggestedReps: suggestedReps,
        suggestedSets: suggestedSets,
        suggestedRest: suggestedRest,
        confidence: confidence,
        icon: icon,
        color: color,
        previousAvgWeight: analysis.recentAvgWeight,
        previousAvgRPE: analysis.recentAvgRPE,
        sessions: analysis.sessions,
        trend: analysis.rpeTrend > 0.3 ? "harder" : analysis.rpeTrend < -0.3 ? "easier" : "stable"
    };
}

function generateWorkoutRecommendations(workout) {
    if (!workout || !workout.exercises) return [];

    return workout.exercises.map(function (ex) {
        return generateRecommendation(ex.name, ex);
    });
}

// =========================================
// SAVE / LOAD RECOMMENDATIONS
// =========================================

function saveRecommendations(workoutId, recommendations) {
    var all = getAdaptiveStorage(ADAPTIVE_STORAGE.recommendations);
    var existing = all.findIndex(function (r) { return r.workoutId === workoutId; });
    var record = {
        workoutId: workoutId,
        generatedAt: new Date().toISOString(),
        recommendations: recommendations
    };
    if (existing >= 0) {
        all[existing] = record;
    } else {
        all.push(record);
    }
    setAdaptiveStorage(ADAPTIVE_STORAGE.recommendations, all);
}

function getRecommendations(workoutId) {
    var all = getAdaptiveStorage(ADAPTIVE_STORAGE.recommendations);
    return all.find(function (r) { return r.workoutId === workoutId; }) || null;
}

function saveAdaptiveHistory(workoutId, adjustments) {
    var history = getAdaptiveStorage(ADAPTIVE_STORAGE.history);
    history.push({
        workoutId: workoutId,
        date: new Date().toISOString(),
        adjustments: adjustments
    });
    setAdaptiveStorage(ADAPTIVE_STORAGE.history, history);
}

function getAdaptiveHistory() {
    return getAdaptiveStorage(ADAPTIVE_STORAGE.history);
}

// =========================================
// UI RENDERING
// =========================================

function renderAdaptiveBanner(workout, containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var recommendations = generateWorkoutRecommendations(workout);
    var hasChanges = recommendations.some(function (r) {
        return r.action !== "keep";
    });

    saveRecommendations(workout.id, recommendations);

    if (!hasChanges) {
        container.innerHTML = '';
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';
    var html = '<div class="adaptive-banner">';
    html += '<div class="adaptive-banner-header">';
    html += '<i class="fa-solid fa-wand-magic-sparkles"></i>';
    html += '<span>ADAPTIVE RECOMMENDATIONS</span>';
    html += '</div>';
    html += '<p class="adaptive-banner-subtitle">Based on your recent performance, we recommend these adjustments:</p>';
    html += '<div class="adaptive-recommendations">';

    recommendations.forEach(function (rec) {
        if (rec.action === "keep" && rec.confidence === "none") return;

        html += '<div class="adaptive-rec-card action-' + rec.action + '">';
        html += '<div class="adaptive-rec-header">';
        html += '<i class="' + rec.icon + '" style="color:' + rec.color + '"></i>';
        html += '<span class="adaptive-rec-exercise">' + rec.exercise + '</span>';
        html += '<span class="adaptive-rec-badge badge-' + rec.action + '">' + formatAction(rec.action) + '</span>';
        html += '</div>';

        html += '<div class="adaptive-rec-changes">';

        if (rec.previousAvgWeight > 0) {
            html += '<div class="adaptive-change-row">';
            html += '<span class="change-label">Weight</span>';
            html += '<span class="change-old">' + rec.previousAvgWeight + ' kg</span>';
            html += '<i class="fa-solid fa-arrow-right change-arrow"></i>';
            html += '<span class="change-new">' + rec.suggestedWeight + ' kg</span>';
            html += '</div>';
        }

        html += '<div class="adaptive-change-row">';
        html += '<span class="change-label">Reps</span>';
        html += '<span class="change-old">' + rec.suggestedReps + '</span>';
        html += '<span class="change-label" style="min-width:30px;text-align:center">per set</span>';
        html += '</div>';

        html += '<div class="adaptive-change-row">';
        html += '<span class="change-label">Sets</span>';
        html += '<span class="change-old">' + rec.suggestedSets + '</span>';
        html += '<span class="change-label" style="min-width:30px;text-align:center">total</span>';
        html += '</div>';

        html += '</div>';

        html += '<div class="adaptive-reason">';
        html += '<i class="fa-solid fa-circle-info"></i>';
        html += '<span>' + rec.reason + '</span>';
        html += '</div>';

        if (rec.previousAvgRPE !== undefined) {
            html += '<div class="adaptive-meta">';
            html += '<span>Avg RPE: ' + rec.previousAvgRPE + '</span>';
            html += '<span>Sessions: ' + rec.sessions + '</span>';
            html += '<span>Trend: ' + rec.trend + '</span>';
            html += '<span class="confidence-' + rec.confidence + '">Confidence: ' + rec.confidence + '</span>';
            html += '</div>';
        }

        html += '</div>';
    });

    html += '</div>';
    html += '</div>';

    container.innerHTML = html;
}

function renderAdaptiveHistory(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var history = getAdaptiveHistory();
    if (history.length === 0) {
        container.innerHTML = '<div class="adaptive-history-empty"><i class="fa-solid fa-clock-rotate-left"></i><p>No adaptive history yet. Complete workouts to see your adjustment history.</p></div>';
        return;
    }

    var html = '<div class="adaptive-history-list">';

    var recentHistory = history.slice(-10).reverse();

    recentHistory.forEach(function (entry) {
        var date = new Date(entry.date);
        var dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

        html += '<div class="adaptive-history-item">';
        html += '<div class="adaptive-history-date">' + dateStr + '</div>';
        html += '<div class="adaptive-history-workout">' + entry.workoutId + '</div>';
        html += '<div class="adaptive-history-adjustments">';

        entry.adjustments.forEach(function (adj) {
            if (adj.action !== "keep") {
                html += '<span class="history-adj badge-' + adj.action + '">' + adj.exercise + ': ' + formatAction(adj.action) + '</span>';
            }
        });

        html += '</div>';
        html += '</div>';
    });

    html += '</div>';

    container.innerHTML = html;
}

// =========================================
// PERFORMANCE LOGGING FORM
// =========================================

function renderPerformanceForm(exercises, workoutId, containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var html = '<div class="perf-form-container">';
    html += '<div class="perf-form-header">';
    html += '<i class="fa-solid fa-clipboard-check"></i>';
    html += '<span>LOG YOUR PERFORMANCE</span>';
    html += '</div>';
    html += '<p class="perf-form-subtitle">Track your actual performance to get better adaptive recommendations.</p>';
    html += '<form id="performanceLogForm" class="perf-form">';

    exercises.forEach(function (ex, i) {
        var prevData = getPerformanceForExercise(ex.name);
        var lastEntry = prevData.length > 0 ? prevData[prevData.length - 1] : null;

        html += '<div class="perf-exercise-entry" data-exercise="' + ex.name + '">';
        html += '<div class="perf-exercise-header">';
        html += '<span class="perf-exercise-num">' + (i + 1) + '</span>';
        html += '<span class="perf-exercise-name">' + ex.name + '</span>';
        html += '</div>';

        html += '<div class="perf-fields">';
        html += '<div class="perf-field">';
        html += '<label>Weight (kg)</label>';
        html += '<input type="number" step="0.5" min="0" class="form-input perf-weight" value="' + (lastEntry ? lastEntry.weight : '') + '" placeholder="' + (lastEntry ? lastEntry.weight + ' kg' : '0') + '">';
        html += '</div>';

        html += '<div class="perf-field">';
        html += '<label>Reps</label>';
        html += '<input type="number" min="1" class="form-input perf-reps" value="" placeholder="' + ex.reps + '">';
        html += '</div>';

        html += '<div class="perf-field">';
        html += '<label>Completed Sets</label>';
        html += '<input type="number" min="0" max="20" class="form-input perf-completed-sets" value="" placeholder="' + ex.sets + '">';
        html += '</div>';

        html += '<div class="perf-field">';
        html += '<label>RPE (1-10)</label>';
        html += '<div class="rpe-selector">';
        for (var r = 1; r <= 10; r++) {
            var rpeClass = r <= 3 ? 'rpe-easy' : r <= 6 ? 'rpe-moderate' : 'rpe-hard';
            html += '<button type="button" class="rpe-btn ' + rpeClass + '" data-rpe="' + r + '" data-exercise="' + ex.name + '">' + r + '</button>';
        }
        html += '</div>';
        html += '<input type="hidden" class="perf-rpe" value="">';
        html += '</div>';

        html += '</div>';
        html += '</div>';
    });

    html += '<div class="perf-form-actions">';
    html += '<button type="button" class="btn-red perf-save-btn" id="savePerformanceBtn">';
    html += '<i class="fa-solid fa-check"></i> Save Performance';
    html += '</button>';
    html += '<span class="perf-form-msg" id="perfFormMsg"></span>';
    html += '</div>';

    html += '</form>';
    html += '</div>';

    container.innerHTML = html;

    initPerformanceForm(workoutId);
}

function initPerformanceForm(workoutId) {
    var rpeButtons = document.querySelectorAll('.rpe-btn');
    rpeButtons.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var exercise = btn.dataset.exercise;
            var rpe = btn.dataset.rpe;

            var siblings = btn.parentElement.querySelectorAll('.rpe-btn');
            siblings.forEach(function (b) { b.classList.remove('selected'); });
            btn.classList.add('selected');

            var hiddenInput = btn.closest('.perf-exercise-entry').querySelector('.perf-rpe');
            hiddenInput.value = rpe;
        });
    });

    var saveBtn = document.getElementById('savePerformanceBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function () {
            savePerformanceData(workoutId);
        });
    }
}

function savePerformanceData(workoutId) {
    var entries = document.querySelectorAll('.perf-exercise-entry');
    var msg = document.getElementById('perfFormMsg');
    var allValid = true;

    entries.forEach(function (entry) {
        var exercise = entry.dataset.exercise;
        var weight = entry.querySelector('.perf-weight').value;
        var reps = entry.querySelector('.perf-reps').value;
        var sets = entry.querySelector('.perf-completed-sets').value;
        var rpe = entry.querySelector('.perf-rpe').value;

        if (weight && reps && rpe) {
            logWorkoutPerformance({
                workoutId: workoutId,
                exercise: exercise,
                weight: weight,
                reps: reps,
                sets: sets || entry.querySelector('.perf-completed-sets').placeholder,
                completedSets: sets || entry.querySelector('.perf-completed-sets').placeholder,
                rpe: rpe
            });
        } else if (weight || reps || rpe) {
            allValid = false;
        }
    });

    if (!allValid) {
        msg.textContent = 'Fill weight, reps, and RPE for all logged exercises.';
        msg.style.color = '#ff4a60';
        return;
    }

    msg.textContent = 'Performance logged successfully!';
    msg.style.color = '#45e58a';

    var adjustments = entries.length > 0 ? generateWorkoutRecommendations(workouts.find(function (w) { return w.id === workoutId; })) : [];
    saveAdaptiveHistory(workoutId, adjustments);

    setTimeout(function () { msg.textContent = ''; }, 3000);
}

// =========================================
// UTILITY FUNCTIONS
// =========================================

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

function average(arr) {
    if (arr.length === 0) return 0;
    var sum = arr.reduce(function (a, b) { return a + b; }, 0);
    return sum / arr.length;
}

function round(val, precision) {
    if (precision === 0.5) {
        return Math.round(val * 2) / 2;
    }
    var factor = Math.pow(10, precision || 1);
    return Math.round(val * factor) / factor;
}

function parseReps(repsStr) {
    if (typeof repsStr === 'number') return repsStr;
    var match = repsStr.match(/\d+/);
    return match ? parseInt(match[0]) : 10;
}

function formatAction(action) {
    switch (action) {
        case 'increase': return 'Increase';
        case 'decrease': return 'Decrease';
        case 'keep': return 'Maintain';
        default: return action;
    }
}
