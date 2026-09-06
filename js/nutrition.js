// =========================================
// DATE DISPLAY
// =========================================

const dateDisplay = document.getElementById("dateDisplay");
const today = new Date();
dateDisplay.textContent = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
});

// =========================================
// GENDER TOGGLE
// =========================================

const genderBtns = document.querySelectorAll(".gender-btn");
let selectedGender = "male";

genderBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        genderBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedGender = btn.dataset.gender;
    });
});

// =========================================
// MACRO CALCULATOR
// =========================================

const calculateBtn = document.getElementById("calculateBtn");
const resultsSection = document.getElementById("resultsSection");

const tdeeValue = document.getElementById("tdeeValue");
const tdeeGoalText = document.getElementById("tdeeGoalText");

const proteinGrams = document.getElementById("proteinGrams");
const proteinPct = document.getElementById("proteinPct");
const proteinBar = document.getElementById("proteinBar");

const carbsGrams = document.getElementById("carbsGrams");
const carbsPct = document.getElementById("carbsPct");
const carbsBar = document.getElementById("carbsBar");

const fatGrams = document.getElementById("fatGrams");
const fatPct = document.getElementById("fatPct");
const fatBar = document.getElementById("fatBar");

calculateBtn.addEventListener("click", () => {
    const activityLevel = document.getElementById("activityLevel").value;
    const goal = document.getElementById("goalSelect").value;

    const activityMultipliers = {
        "sedentary": 1.2,
        "lightly-active": 1.375,
        "moderately-active": 1.55,
        "very-active": 1.725,
        "extra-active": 1.9
    };

    const goalAdjustments = {
        "build-muscle": 300,
        "lose-weight": -500,
        "stay-fit": 0,
        "improve-fitness": 0
    };

    const goalTexts = {
        "build-muscle": "Caloric surplus for muscle gain",
        "lose-weight": "Caloric deficit for fat loss",
        "stay-fit": "Maintenance calories",
        "improve-fitness": "Maintenance for performance"
    };

    const bmr = selectedGender === "male" ? 1750 : 1450;
    const multiplier = activityMultipliers[activityLevel] || 1.55;
    const adjustment = goalAdjustments[goal] || 0;
    const tdee = Math.round(bmr * multiplier + adjustment);

    const proteinRatio = goal === "build-muscle" ? 0.35 : goal === "lose-weight" ? 0.35 : 0.30;
    const fatRatio = 0.25;
    const carbsRatio = 1 - proteinRatio - fatRatio;

    const protein = Math.round((tdee * proteinRatio) / 4);
    const carbs = Math.round((tdee * carbsRatio) / 4);
    const fat = Math.round((tdee * fatRatio) / 9);

    tdeeValue.textContent = tdee;
    tdeeGoalText.textContent = goalTexts[goal] || "";

    proteinGrams.textContent = protein + "g";
    proteinPct.textContent = Math.round(proteinRatio * 100) + "%";
    proteinBar.style.width = Math.round(proteinRatio * 100) + "%";

    carbsGrams.textContent = carbs + "g";
    carbsPct.textContent = Math.round(carbsRatio * 100) + "%";
    carbsBar.style.width = Math.round(carbsRatio * 100) + "%";

    fatGrams.textContent = fat + "g";
    fatPct.textContent = Math.round(fatRatio * 100) + "%";
    fatBar.style.width = Math.round(fatRatio * 100) + "%";

    window._macroTargets = { calories: tdee, protein, carbs, fat };

    resultsSection.classList.add("active");

    updateDailyProgress();
});

// =========================================
// MEAL TRACKING
// =========================================

const MEALS_KEY = "vivafitMeals";

function getMeals() {
    try {
        return JSON.parse(localStorage.getItem(MEALS_KEY)) || [];
    } catch {
        return [];
    }
}

function saveMeals(meals) {
    localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
}

function calcCalories(protein, carbs, fat) {
    return Math.round(protein * 4 + carbs * 4 + fat * 9);
}

const addMealBtn = document.getElementById("addMealBtn");
const mealForm = document.getElementById("mealForm");
const mealFormCancel = document.getElementById("mealFormCancel");
const mealFormAdd = document.getElementById("mealFormAdd");
const mealsList = document.getElementById("mealsList");
const mealsContainer = document.getElementById("mealsContainer");
const mealsEmpty = document.getElementById("mealsEmpty");
const mealCaloriesPreview = document.getElementById("mealCaloriesPreview");

const mealName = document.getElementById("mealName");
const mealProtein = document.getElementById("mealProtein");
const mealCarbs = document.getElementById("mealCarbs");
const mealFat = document.getElementById("mealFat");

addMealBtn.addEventListener("click", () => {
    mealForm.classList.add("active");
    mealName.focus();
});

mealFormCancel.addEventListener("click", () => {
    mealForm.classList.remove("active");
    clearMealForm();
});

function clearMealForm() {
    mealName.value = "";
    mealProtein.value = "";
    mealCarbs.value = "";
    mealFat.value = "";
    mealCaloriesPreview.textContent = "0 kcal";
}

[mealProtein, mealCarbs, mealFat].forEach(input => {
    input.addEventListener("input", () => {
        const p = parseFloat(mealProtein.value) || 0;
        const c = parseFloat(mealCarbs.value) || 0;
        const f = parseFloat(mealFat.value) || 0;
        mealCaloriesPreview.textContent = calcCalories(p, c, f) + " kcal";
    });
});

mealFormAdd.addEventListener("click", () => {
    const name = mealName.value.trim();
    const p = parseFloat(mealProtein.value) || 0;
    const c = parseFloat(mealCarbs.value) || 0;
    const f = parseFloat(mealFat.value) || 0;

    if (!name) {
        mealName.style.borderColor = "#ff4a60";
        setTimeout(() => { mealName.style.borderColor = ""; }, 2000);
        return;
    }

    const meals = getMeals();
    meals.push({
        name,
        protein: p,
        carbs: c,
        fat: f,
        calories: calcCalories(p, c, f),
        addedAt: new Date().toISOString()
    });
    saveMeals(meals);

    mealForm.classList.remove("active");
    clearMealForm();
    renderMeals();
    updateDailyProgress();
});

function renderMeals() {
    const meals = getMeals();

    if (meals.length === 0) {
        mealsEmpty.style.display = "";
        mealsContainer.innerHTML = "";
        return;
    }

    mealsEmpty.style.display = "none";
    mealsContainer.innerHTML = meals.map((m, i) => `
        <div class="meal-item">
            <div class="meal-info">
                <div class="meal-name">${m.name}</div>
                <div class="meal-macros">
                    <span class="macro-p">P: ${m.protein}g</span>
                    <span class="macro-c">C: ${m.carbs}g</span>
                    <span class="macro-f">F: ${m.fat}g</span>
                </div>
            </div>
            <div class="meal-right">
                <span class="meal-cal">${m.calories} kcal</span>
                <button class="meal-delete-btn" data-index="${i}" title="Remove meal">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
    `).join("");
}

mealsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".meal-delete-btn");
    if (!btn) return;

    const meals = getMeals();
    meals.splice(parseInt(btn.dataset.index), 1);
    saveMeals(meals);
    renderMeals();
    updateDailyProgress();
});

// =========================================
// DAILY PROGRESS
// =========================================

const totalCalories = document.getElementById("totalCalories");
const targetCalories = document.getElementById("targetCalories");
const caloriesBar = document.getElementById("caloriesBar");

const totalProtein = document.getElementById("totalProtein");
const targetProtein = document.getElementById("targetProtein");
const proteinProgress = document.getElementById("proteinProgress");

const totalCarbs = document.getElementById("totalCarbs");
const targetCarbs = document.getElementById("targetCarbs");
const carbsProgress = document.getElementById("carbsProgress");

const totalFat = document.getElementById("totalFat");
const targetFat = document.getElementById("targetFat");
const fatProgress = document.getElementById("fatProgress");

function updateDailyProgress() {
    const meals = getMeals();
    const totals = meals.reduce((acc, m) => ({
        calories: acc.calories + m.calories,
        protein: acc.protein + m.protein,
        carbs: acc.carbs + m.carbs,
        fat: acc.fat + m.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    const targets = window._macroTargets || { calories: 2000, protein: 150, carbs: 200, fat: 65 };

    totalCalories.textContent = totals.calories;
    targetCalories.textContent = targets.calories;
    caloriesBar.style.width = Math.min(100, (totals.calories / targets.calories) * 100) + "%";

    totalProtein.textContent = totals.protein + "g";
    targetProtein.textContent = targets.protein + "g";
    proteinProgress.style.width = Math.min(100, (totals.protein / targets.protein) * 100) + "%";

    totalCarbs.textContent = totals.carbs + "g";
    targetCarbs.textContent = targets.carbs + "g";
    carbsProgress.style.width = Math.min(100, (totals.carbs / targets.carbs) * 100) + "%";

    totalFat.textContent = totals.fat + "g";
    targetFat.textContent = targets.fat + "g";
    fatProgress.style.width = Math.min(100, (totals.fat / targets.fat) * 100) + "%";
}

// =========================================
// GROCERY LIST
// =========================================

const GROCERY_CHECKED_KEY = "vivafitGroceryChecked";

const groceryOverlay = document.getElementById("groceryOverlay");
const groceryListBtn = document.getElementById("groceryListBtn");
const groceryCloseBtn = document.getElementById("groceryCloseBtn");
const groceryModalBody = document.getElementById("groceryModalBody");
const groceryListContainer = document.getElementById("groceryListContainer");
const groceryEmpty = document.getElementById("groceryEmpty");
const groceryModalFooter = document.getElementById("groceryModalFooter");
const groceryClearBtn = document.getElementById("groceryClearBtn");
const groceryRegenBtn = document.getElementById("groceryRegenBtn");

const FOOD_CATEGORIES = {
    protein: {
        icon: "fa-solid fa-drumstick-bite",
        keywords: [
            "chicken", "turkey", "beef", "steak", "pork", "lamb", "fish", "salmon",
            "tuna", "shrimp", "prawn", "crab", "lobster", "egg", "eggs", "tofu",
            "tempeh", "seitan", "whey", "protein powder", "protein shake",
            "ground beef", "ground turkey", "bacon", "ham", "sausage", "pepperoni",
            "anchovy", "sardine", "mackerel", "cod", "tilapia", "halibut",
            "duck", "goose", "veal", "bison", "venison", "rabbit",
            "deli meat", "prosciutto", "salami", "jerky", "biltong"
        ]
    },
    carbs: {
        icon: "fa-solid fa-wheat-awn",
        keywords: [
            "rice", "pasta", "noodle", "bread", "oat", "oats", "oatmeal",
            "quinoa", "cereal", "granola", "bagel", "tortilla", "wrap",
            "potato", "sweet potato", "yam", "corn", "barley", "bulgur",
            "couscous", "millet", "rye", "spelt", "buckwheat", "muesli",
            "cracker", "pretzel", "pancake", "waffle", "muffin",
            "spaghetti", "penne", "fettuccine", "macaroni", "linguine",
            "rice cake", "pita", "naan", "flatbread", "croissant"
        ]
    },
    vegetables: {
        icon: "fa-solid fa-leaf",
        keywords: [
            "broccoli", "spinach", "kale", "lettuce", "cabbage", "cauliflower",
            "carrot", "celery", "cucumber", "tomato", "pepper", "bell pepper",
            "onion", "garlic", "mushroom", "zucchini", "squash", "pumpkin",
            "asparagus", "green bean", "pea", "corn", "beet", "radish",
            "turnip", "parsnip", "artichoke", "leek", "shallot", "scallion",
            "green onion", "chili", "jalapeno", "eggplant", "okra",
            "brussels sprout", "bok choy", "arugula", "watercress",
            "rocket", "endive", "romaine", "mixed greens", "spring mix",
            "sweet corn", "baby corn", "bean sprout", "alfalfa sprout"
        ]
    },
    fruits: {
        icon: "fa-solid fa-apple-whole",
        keywords: [
            "apple", "banana", "orange", "grape", "strawberry", "blueberry",
            "raspberry", "blackberry", "mango", "pineapple", "peach", "pear",
            "plum", "cherry", "kiwi", "watermelon", "melon", "cantaloupe",
            "lemon", "lime", "grapefruit", "tangerine", "clementine",
            "avocado", "coconut", "fig", "date", "pomegranate", "papaya",
            "guava", "passion fruit", "dragon fruit", "lychee", "starfruit",
            "cranberry", "currant", "elderberry", "boysenberry"
        ]
    },
    dairy: {
        icon: "fa-solid fa-cheese",
        keywords: [
            "milk", "cheese", "yogurt", "yoghurt", "cottage cheese",
            "cream cheese", "sour cream", "butter", "cream", "half and half",
            "whipped cream", "ice cream", "whey protein", "casein",
            "parmesan", "mozzarella", "cheddar", "provolone", "swiss",
            "brie", "feta", "ricotta", "mascarpone", "goat cheese",
            "kefir", "buttermilk", "ghee", "paneer"
        ]
    }
};

function getGroceryChecked() {
    try {
        return JSON.parse(localStorage.getItem(GROCERY_CHECKED_KEY)) || {};
    } catch {
        return {};
    }
}

function saveGroceryChecked(checked) {
    localStorage.setItem(GROCERY_CHECKED_KEY, JSON.stringify(checked));
}

function categorizeFood(name) {
    const lower = name.toLowerCase().trim();
    for (const [category, data] of Object.entries(FOOD_CATEGORIES)) {
        for (const keyword of data.keywords) {
            if (lower.includes(keyword)) {
                return category;
            }
        }
    }
    return "other";
}

function generateGroceryData() {
    const meals = getMeals();
    if (meals.length === 0) return null;

    const combined = {};
    meals.forEach(m => {
        const key = m.name.toLowerCase().trim();
        if (combined[key]) {
            combined[key].protein += m.protein;
            combined[key].carbs += m.carbs;
            combined[key].fat += m.fat;
            combined[key].calories += m.calories;
            combined[key].count += 1;
        } else {
            combined[key] = {
                name: m.name.trim(),
                protein: m.protein,
                carbs: m.carbs,
                fat: m.fat,
                calories: m.calories,
                count: 1
            };
        }
    });

    const categorized = {};
    for (const [key, item] of Object.entries(combined)) {
        const cat = categorizeFood(item.name);
        if (!categorized[cat]) categorized[cat] = [];
        categorized[cat].push(item);
    }

    const order = ["protein", "carbs", "vegetables", "fruits", "dairy", "other"];
    const categoryLabels = {
        protein: "Protein",
        carbs: "Carbohydrates",
        vegetables: "Vegetables",
        fruits: "Fruits",
        dairy: "Dairy",
        other: "Other"
    };

    return order
        .filter(c => categorized[c] && categorized[c].length > 0)
        .map(c => ({
            category: c,
            label: categoryLabels[c],
            icon: FOOD_CATEGORIES[c]?.icon || "fa-solid fa-basket-shopping",
            items: categorized[c].sort((a, b) => a.name.localeCompare(b.name))
        }));
}

function renderGroceryList() {
    const data = generateGroceryData();
    const checked = getGroceryChecked();

    if (!data) {
        groceryEmpty.style.display = "";
        groceryListContainer.innerHTML = "";
        groceryModalFooter.style.display = "none";
        return;
    }

    groceryEmpty.style.display = "none";
    groceryModalFooter.style.display = "";

    groceryListContainer.innerHTML = data.map(group => `
        <div class="grocery-category">
            <div class="grocery-category-header">
                <div class="grocery-category-icon ${group.category}">
                    <i class="${group.icon}"></i>
                </div>
                <span class="grocery-category-name">${group.label}</span>
            </div>
            ${group.items.map(item => {
                const id = item.name.toLowerCase().replace(/\s+/g, "_");
                const isChecked = checked[id] ? "purchased" : "";
                const checkIcon = checked[id] ? "fa-solid fa-check" : "";
                const macros = [];
                if (item.protein > 0) macros.push(`P: ${Math.round(item.protein)}g`);
                if (item.carbs > 0) macros.push(`C: ${Math.round(item.carbs)}g`);
                if (item.fat > 0) macros.push(`F: ${Math.round(item.fat)}g`);
                const qty = macros.join("  ·  ") || `${item.calories} kcal`;
                const suffix = item.count > 1 ? ` (×${item.count})` : "";
                return `
                    <div class="grocery-item ${isChecked}" data-id="${id}">
                        <div class="grocery-check" data-id="${id}">
                            <i class="${checkIcon}"></i>
                        </div>
                        <div class="grocery-item-info">
                            <div class="grocery-item-name">${item.name}${suffix}</div>
                            <div class="grocery-item-qty">${qty}</div>
                        </div>
                    </div>
                `;
            }).join("")}
        </div>
    `).join("");
}

groceryListBtn.addEventListener("click", () => {
    renderGroceryList();
    groceryOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
});

function closeGroceryModal() {
    groceryOverlay.classList.remove("active");
    document.body.style.overflow = "";
}

groceryCloseBtn.addEventListener("click", closeGroceryModal);

groceryOverlay.addEventListener("click", (e) => {
    if (e.target === groceryOverlay) closeGroceryModal();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && groceryOverlay.classList.contains("active")) {
        closeGroceryModal();
    }
});

groceryListContainer.addEventListener("click", (e) => {
    const check = e.target.closest(".grocery-check");
    if (!check) return;

    const id = check.dataset.id;
    const checked = getGroceryChecked();
    const item = check.closest(".grocery-item");

    if (checked[id]) {
        delete checked[id];
        item.classList.remove("purchased");
        check.innerHTML = "";
    } else {
        checked[id] = true;
        item.classList.add("purchased");
        check.innerHTML = '<i class="fa-solid fa-check"></i>';
    }

    saveGroceryChecked(checked);
});

groceryClearBtn.addEventListener("click", () => {
    groceryListContainer.innerHTML = "";
    groceryEmpty.style.display = "";
    groceryModalFooter.style.display = "none";
    saveGroceryChecked({});
});

groceryRegenBtn.addEventListener("click", () => {
    renderGroceryList();
});

// =========================================
// INIT
// =========================================

renderMeals();
updateDailyProgress();
