// =========================================
// SHARED WORKOUTS DATA
// =========================================

const workouts = [
    {
        id: "upper-body",
        name: "Upper Body",
        category: "strength",
        icon: "fa-solid fa-dumbbell",
        description: "Build stronger arms, chest and back.",
        duration: "40 min",
        difficulty: "Medium",
        exercises: [
            { name: "Bench Press", sets: 4, reps: "10", rest: "90s" },
            { name: "Overhead Press", sets: 3, reps: "12", rest: "60s" },
            { name: "Barbell Row", sets: 4, reps: "10", rest: "90s" },
            { name: "Bicep Curls", sets: 3, reps: "15", rest: "45s" },
            { name: "Tricep Dips", sets: 3, reps: "12", rest: "45s" }
        ]
    },
    {
        id: "lower-body",
        name: "Lower Body",
        category: "strength",
        icon: "fa-solid fa-person-running",
        description: "Stronger legs and glutes for a fitter you.",
        duration: "45 min",
        difficulty: "Medium",
        exercises: [
            { name: "Barbell Squat", sets: 4, reps: "10", rest: "90s" },
            { name: "Romanian Deadlift", sets: 4, reps: "8", rest: "90s" },
            { name: "Leg Press", sets: 3, reps: "12", rest: "60s" },
            { name: "Walking Lunges", sets: 3, reps: "12 each", rest: "60s" },
            { name: "Calf Raises", sets: 4, reps: "15", rest: "45s" }
        ]
    },
    {
        id: "full-body",
        name: "Full Body",
        category: "full-body",
        icon: "fa-solid fa-heart-pulse",
        description: "A complete workout for total fitness.",
        duration: "50 min",
        difficulty: "Hard",
        exercises: [
            { name: "Deadlift", sets: 4, reps: "8", rest: "120s" },
            { name: "Barbell Squat", sets: 4, reps: "10", rest: "90s" },
            { name: "Bench Press", sets: 4, reps: "10", rest: "90s" },
            { name: "Pull-Ups", sets: 3, reps: "Max", rest: "60s" },
            { name: "Plank", sets: 3, reps: "60s", rest: "45s" }
        ]
    },
    {
        id: "cardio-blast",
        name: "Cardio Blast",
        category: "cardio",
        icon: "fa-solid fa-person-running",
        description: "Boost endurance and burn calories.",
        duration: "30 min",
        difficulty: "Easy",
        exercises: [
            { name: "Jump Rope", sets: 1, reps: "3 min", rest: "30s" },
            { name: "Burpees", sets: 3, reps: "15", rest: "45s" },
            { name: "Mountain Climbers", sets: 3, reps: "30s", rest: "30s" },
            { name: "High Knees", sets: 3, reps: "30s", rest: "30s" },
            { name: "Jumping Jacks", sets: 1, reps: "3 min", rest: "30s" }
        ]
    },
    {
        id: "push",
        name: "Push Day",
        category: "strength",
        icon: "fa-solid fa-arrows-up-down",
        description: "Chest, shoulders and triceps focus.",
        duration: "45 min",
        difficulty: "Medium",
        exercises: [
            { name: "Incline Bench Press", sets: 4, reps: "10", rest: "90s" },
            { name: "Dumbbell Shoulder Press", sets: 4, reps: "10", rest: "60s" },
            { name: "Cable Flyes", sets: 3, reps: "12", rest: "45s" },
            { name: "Lateral Raises", sets: 3, reps: "15", rest: "45s" },
            { name: "Tricep Pushdowns", sets: 3, reps: "12", rest: "45s" }
        ]
    },
    {
        id: "pull",
        name: "Pull Day",
        category: "strength",
        icon: "fa-solid fa-hand-fist",
        description: "Back and biceps for a powerful pull.",
        duration: "42 min",
        difficulty: "Medium",
        exercises: [
            { name: "Deadlift", sets: 4, reps: "6", rest: "120s" },
            { name: "Pull-Ups", sets: 4, reps: "8", rest: "90s" },
            { name: "Seated Cable Row", sets: 3, reps: "12", rest: "60s" },
            { name: "Face Pulls", sets: 3, reps: "15", rest: "45s" },
            { name: "Hammer Curls", sets: 3, reps: "12", rest: "45s" }
        ]
    },
    {
        id: "legs",
        name: "Leg Day",
        category: "strength",
        icon: "fa-solid fa-shoe-prints",
        description: "Heavy legs workout for serious gains.",
        duration: "50 min",
        difficulty: "Hard",
        exercises: [
            { name: "Back Squat", sets: 5, reps: "5", rest: "120s" },
            { name: "Front Squat", sets: 3, reps: "8", rest: "90s" },
            { name: "Bulgarian Split Squat", sets: 3, reps: "10 each", rest: "60s" },
            { name: "Leg Curl", sets: 3, reps: "12", rest: "45s" },
            { name: "Leg Extension", sets: 3, reps: "15", rest: "45s" }
        ]
    }
];