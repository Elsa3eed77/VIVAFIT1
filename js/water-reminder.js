(function () {

    "use strict";

const ENABLED_KEY = "vivafit_water_reminders_enabled";
const LAST_KEY = "vivafit_water_last_reminder";
    const INTERVAL_MS = 2 * 60 * 60 * 1000; // every 2 hours
    const CHECK_EVERY_MS = 60 * 1000;        // check once a minute

    const REMINDER_MESSAGES = [
        "Time for a water break — your body will thank you.",
        "Quick reminder: grab a glass of water 💧",
        "Stay on track — log some water now.",
        "A little hydration boost never hurts."
    ];


    function isEnabled() {
        return getData(ENABLED_KEY, null) === true;
    }

    function setEnabled(val) {
        saveData(ENABLED_KEY, val ? true : false);
    }

    function getLast() {
        return getData(LAST_KEY, 0) || 0;
    }

    function setLast(ts) {
        saveData(LAST_KEY, ts);
    }


    function randomMessage() {
        return REMINDER_MESSAGES[Math.floor(Math.random() * REMINDER_MESSAGES.length)];
    }

    function fireReminder() {

        setLast(Date.now());

        const canUseOSNotification =
            "Notification" in window &&
            Notification.permission === "granted" &&
            document.hidden;

        if (canUseOSNotification) {
            try {
                const notif = new Notification("VIVAFIT — Hydration Reminder", {
                    body: randomMessage(),
                    tag: "vivafit-water-reminder"
                });
                notif.onclick = function () {
                    window.focus();
                    notif.close();
                };
                return;
            } catch (e) {
            }
        }

        showToast();
    }

    function ensureToastContainer() {
        let container = document.getElementById("waterToastContainer");
        if (!container) {
            container = document.createElement("div");
            container.id = "waterToastContainer";
            container.className = "water-toast-container";
            document.body.appendChild(container);
        }
        return container;
    }

    function showToast() {

        const container = ensureToastContainer();

        const toast = document.createElement("div");
        toast.className = "water-toast";
        toast.innerHTML =
            '<div class="water-toast-icon"><i class="fa-solid fa-droplet"></i></div>' +
            '<div class="water-toast-body">' +
                '<h4>Hydration check-in</h4>' +
                '<p>' + randomMessage() + '</p>' +
                '<div class="water-toast-actions">' +
                    '<button class="water-toast-btn primary" data-action="add">' +
                        '<i class="fa-solid fa-plus"></i> Log 250ml' +
                    '</button>' +
                    '<button class="water-toast-btn secondary" data-action="dismiss">Dismiss</button>' +
                '</div>' +
            '</div>' +
            '<button class="water-toast-close" data-action="dismiss">' +
                '<i class="fa-solid fa-xmark"></i>' +
            '</button>';

        function close() {
            toast.classList.add("closing");
            setTimeout(() => toast.remove(), 300);
        }

        toast.addEventListener("click", function (e) {
            const action = e.target.closest("[data-action]");
            if (!action) return;

            if (action.dataset.action === "add" && window.VivaWater) {
                window.VivaWater.addToday(250);
            }
            close();
        });

        container.appendChild(toast);

        // auto-dismiss after 12s if the user ignores it
        setTimeout(close, 12000);
    }


    function checkAndFireIfDue() {
        if (!isEnabled()) return;

        const last = getLast();
        if (last === 0) {
            // first time enabling — start the clock from now
            setLast(Date.now());
            return;
        }

        if (Date.now() - last >= INTERVAL_MS) {
            fireReminder();
        }
    }

    function startScheduler() {
        checkAndFireIfDue();
        setInterval(checkAndFireIfDue, CHECK_EVERY_MS);
    }


    function renderToggleUI() {

        const toggle = document.getElementById("waterReminderToggle");
        const sub = document.getElementById("waterReminderSub");
        if (!toggle) return;

        function paint() {
            const on = isEnabled();
            toggle.classList.toggle("active", on);
            toggle.setAttribute("aria-checked", on ? "true" : "false");

            if (!sub) return;

            if (!on) {
                sub.textContent = "Off — turn on to get reminded every 2 hours.";
            } else if (!("Notification" in window)) {
                sub.textContent = "On — using in-page alerts (browser notifications unsupported).";
            } else if (Notification.permission === "granted") {
                sub.textContent = "On — you'll get a notification every 2 hours.";
            } else if (Notification.permission === "denied") {
                sub.textContent = "On — notifications blocked, using in-page alerts instead.";
            } else {
                sub.textContent = "On — using in-page alerts until notifications are allowed.";
            }
        }

        toggle.addEventListener("click", function () {
            const nextState = !isEnabled();
            setEnabled(nextState);

            if (nextState && "Notification" in window && Notification.permission === "default") {
                Notification.requestPermission().then(paint);
            }

            if (nextState) setLast(Date.now());

            paint();
        });

        paint();
    }


    document.addEventListener("DOMContentLoaded", function () {
        renderToggleUI();
        startScheduler();
    });

})();