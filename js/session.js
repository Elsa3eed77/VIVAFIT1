// SESSION HELPER — runs BEFORE all other scripts
// Routes every user's saved data through per-account keys AND
// syncs each value to the server database (php/user_data.php),
// so every account sees its own data — on any device after login.

function currentUserId() {
    try {
        return localStorage.getItem("userId") || "";
    } catch (e) {
        return "";
    }
}

function scopedStorageKey(key) {
    var uid = currentUserId();
    return uid ? key + "__u_" + uid : key;
}

function getScopedStorage(key, fallback) {
    try {
        var raw = localStorage.getItem(scopedStorageKey(key));
        return raw === null ? (fallback === undefined ? null : fallback) : raw;
    } catch (e) {
        return fallback === undefined ? null : fallback;
    }
}

// Read a JSON value for the current account (local cache first).
function getData(key, fallback) {
    try {
        var raw = localStorage.getItem(scopedStorageKey(key));
        return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
        return fallback;
    }
}

// Save a JSON value for the current account:
// 1) write locally (instant)  2) sync to the server (background).
function saveData(key, value) {
    try {
        localStorage.setItem(scopedStorageKey(key), JSON.stringify(value));
    } catch (e) {}
    var uid = currentUserId();
    if (!uid || !window.fetch) return;
    try {
        fetch("php/user_data.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: uid, key: key, value: JSON.stringify(value) })
        }).catch(function () {});
    } catch (e) {}
}

// ---------------------------------------------------------
// HYDRATION — pull this account's saved data from the server
// on page load, then reload once if it brought new data in.
// ---------------------------------------------------------

var _dataReadyCallbacks = [];

function onDataReady(cb) {
    _dataReadyCallbacks.push(cb);
}

function _finishHydrate(changed) {
    _dataReadyCallbacks.slice().forEach(function (cb) { cb(); });
    _dataReadyCallbacks = [];
    if (changed) {
        try {
            if (!sessionStorage.getItem("vivafit-hydrated")) {
                sessionStorage.setItem("vivafit-hydrated", "1");
                window.location.reload();
            }
        } catch (e) {}
    }
}

function hydrateUserData() {
    var uid = currentUserId();
    if (!uid) {
        _finishHydrate(false);
        return;
    }
    fetch("php/user_data.php?userId=" + encodeURIComponent(uid))
        .then(function (r) { return r.json(); })
        .then(function (res) {
            var changed = false;
            if (res && res.success && res.data) {
                var keys = Object.keys(res.data);
                for (var i = 0; i < keys.length; i++) {
                    try {
                        var scoped = scopedStorageKey(keys[i]);
                        if (localStorage.getItem(scoped) === null) changed = true;
                        localStorage.setItem(scoped, res.data[keys[i]]);
                    } catch (e) {}
                }
            }
            _finishHydrate(changed);
        })
        .catch(function () {
            _finishHydrate(false);
        });
}

document.addEventListener("DOMContentLoaded", hydrateUserData);