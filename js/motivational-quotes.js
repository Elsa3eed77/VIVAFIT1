// =========================================
// MOTIVATIONAL QUOTES
// =========================================

const motivationalQuotes = [
    "Keep going! \uD83D\uDD25",
    "The only bad workout is the one that didn't happen.",
    "Your body can stand almost anything. It\u2019s your mind that you have to convince.",
    "Strength does not come from the body. It comes from the will.",
    "The pain you feel today will be the strength you feel tomorrow.",
    "Don\u2019t limit your challenges. Challenge your limits.",
    "Success is walking from failure to failure with no loss of enthusiasm.",
    "The hard days are the best because that\u2019s when champions are made.",
    "Take care of your body. It\u2019s the only place you have to live.",
    "Motivation is what gets you started. Habit is what keeps you going.",
    "Push harder than yesterday if you want a different tomorrow.",
    "You don\u2019t have to be extreme, just consistent.",
    "The body achieves what the mind believes.",
    "Wake up with determination. Go to bed with satisfaction.",
    "A one-hour workout is only 4% of your day. No excuses.",
    "Discipline is choosing between what you want now and what you want most.",
    "Small daily improvements over time lead to stunning results.",
    "Sweat is just fat crying.",
    "Fitness is not about being better than someone else. It\u2019s about being better than you used to be.",
    "The difference between try and triumph is a little umph."
];

function getRandomQuote() {
    var index = Math.floor(Math.random() * motivationalQuotes.length);
    return motivationalQuotes[index];
}

function renderRandomQuote(elementId) {
    var el = document.getElementById(elementId);
    if (el) {
        el.textContent = getRandomQuote();
    }
}
