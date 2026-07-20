import React, { useState } from "react";
import { DietPlan, MealItem, UserAssessment, FoodLog, WaterLog, WeightLog, WorkoutLog } from "../types";
import {
  Calendar,
  CheckSquare,
  Square,
  Sparkles,
  Flame,
  Droplet,
  ShieldCheck,
  ShoppingBag,
  Clock,
  ChevronRight,
  Info,
  TrendingDown,
  TrendingUp,
  RotateCw,
  PlusCircle,
  Activity,
  User,
  Heart,
  Dumbbell
} from "lucide-react";
import { motion } from "motion/react";

interface DietPlanDashboardProps {
  plan: DietPlan;
  userAssessment?: UserAssessment;
  onSavePlan?: () => void;
  onLogMeal: (mealName: string, calories: number, protein: number, carbs: number, fats: number) => void;
  onReset: () => void;
  foodLogs?: FoodLog[];
  waterLogs?: WaterLog[];
  weightLogs?: WeightLog[];
  workoutLogs?: WorkoutLog[];
  onAddWaterLog?: (amountMl: number, date: string) => void;
  onToggleWorkoutLog?: (date: string) => void;
}

export default function DietPlanDashboard({
  plan,
  userAssessment,
  onSavePlan,
  onLogMeal,
  onReset,
  foodLogs,
  waterLogs,
  weightLogs,
  workoutLogs,
  onAddWaterLog,
  onToggleWorkoutLog
}: DietPlanDashboardProps) {
  const [activeTab, setActiveTab] = useState<"meals" | "groceries" | "insights" | "supplements">("meals");
  const [checkedGroceries, setCheckedGroceries] = useState<Record<string, boolean>>({});
  const [loggedMeals, setLoggedMeals] = useState<Record<string, boolean>>({});
  const [selectedDay, setSelectedDay] = useState<string>("Today");
  const [localWaterLog, setLocalWaterLog] = useState<number>(0);
  const [localWorkout, setLocalWorkout] = useState<boolean>(false);

  const toggleGrocery = (item: string) => {
    setCheckedGroceries((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const todayDate = new Date().toISOString().split("T")[0];
  const todayFood = foodLogs ? foodLogs.filter((l) => l.date === todayDate) : [];

  // Calculate consumed calories based on actual logs or fallback to logged meals
  let totalCalsConsumed = 0;
  let totalProteinConsumed = 0;
  let totalCarbsConsumed = 0;
  let totalFatsConsumed = 0;

  if (foodLogs && foodLogs.length > 0) {
    totalCalsConsumed = todayFood.reduce((sum, item) => sum + item.calories, 0);
    totalProteinConsumed = todayFood.reduce((sum, item) => sum + (item.protein || 0), 0);
    totalCarbsConsumed = todayFood.reduce((sum, item) => sum + (item.carbs || 0), 0);
    totalFatsConsumed = todayFood.reduce((sum, item) => sum + (item.fats || 0), 0);
  } else {
    // Fallback: calculate from mealPlan and loggedMeals state
    const mealTypesKeys = [
      "breakfast",
      "morningSnack",
      "lunch",
      "preWorkoutMeal",
      "postWorkoutMeal",
      "dinner",
      "eveningSnack"
    ];
    mealTypesKeys.forEach((key) => {
      const items = plan.mealPlan[key as keyof typeof plan.mealPlan] as MealItem[];
      if (items) {
        items.forEach((item) => {
          if (loggedMeals[`${key}-${item.name}`]) {
            totalCalsConsumed += item.calories;
            totalProteinConsumed += item.protein || 0;
            totalCarbsConsumed += item.carbs || 0;
            totalFatsConsumed += item.fats || 0;
          }
        });
      }
    });
  }

  const handleLogMealItem = (mealType: string, item: MealItem) => {
    const key = `${mealType}-${item.name}`;
    if (loggedMeals[key]) return; // already logged

    onLogMeal(
      `${mealType.toUpperCase()}: ${item.name}`,
      item.calories,
      item.protein || 0,
      item.carbs || 0,
      item.fats || 0
    );

    setLoggedMeals((prev) => ({ ...prev, [key]: true }));
  };

  const handleQuickWater = (amount: number) => {
    if (onAddWaterLog) {
      onAddWaterLog(amount, todayDate);
    } else {
      setLocalWaterLog((prev) => prev + amount);
    }
  };

  const handleWorkoutToggle = () => {
    if (onToggleWorkoutLog) {
      onToggleWorkoutLog(todayDate);
    } else {
      setLocalWorkout((prev) => !prev);
    }
  };

  // Safe macro fallback logic
  const proteinVal = plan.macros?.protein || 0;
  const carbsVal = plan.macros?.carbs || 0;
  const fatsVal = plan.macros?.fats || 0;
  const fiberVal = plan.macros?.fiber || 0;

  const totalMacroGrams = proteinVal + carbsVal + fatsVal;
  const proteinPercent = totalMacroGrams ? Math.round((proteinVal / totalMacroGrams) * 100) : 0;
  const carbsPercent = totalMacroGrams ? Math.round((carbsVal / totalMacroGrams) * 100) : 0;
  const fatsPercent = totalMacroGrams ? Math.round((fatsVal / totalMacroGrams) * 100) : 0;

  const proteinConsumedPercent = proteinVal ? Math.min(100, Math.round((totalProteinConsumed / proteinVal) * 100)) : 0;
  const carbsConsumedPercent = carbsVal ? Math.min(100, Math.round((totalCarbsConsumed / carbsVal) * 100)) : 0;
  const fatsConsumedPercent = fatsVal ? Math.min(100, Math.round((totalFatsConsumed / fatsVal) * 100)) : 0;

  // Extract schedule for timing indicators
  const sched = userAssessment?.schedule;

  const mealTiming: Record<string, string> = {
    breakfast: sched?.breakfast || "08:00",
    morningSnack: "10:30",
    lunch: sched?.lunch || "13:00",
    preWorkoutMeal: sched?.workout ? subtractTime(sched.workout, 90) : "16:30",
    postWorkoutMeal: sched?.workout ? addTime(sched.workout, 45) : "19:30",
    dinner: sched?.dinner || "20:00",
    eveningSnack: "21:30"
  };

  function subtractTime(timeStr: string, minutesToSub: number): string {
    try {
      const [h, m] = timeStr.split(":").map(Number);
      let date = new Date();
      date.setHours(h);
      date.setMinutes(m - minutesToSub);
      return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    } catch {
      return "16:30";
    }
  }

  function addTime(timeStr: string, minutesToAdd: number): string {
    try {
      const [h, m] = timeStr.split(":").map(Number);
      let date = new Date();
      date.setHours(h);
      date.setMinutes(m + minutesToAdd);
      return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    } catch {
      return "19:30";
    }
  }

  const mealTypes = [
    { key: "breakfast", label: "Breakfast", icon: "🍳" },
    { key: "morningSnack", label: "Morning Snack", icon: "🍎" },
    { key: "lunch", label: "Lunch", icon: "🍲" },
    { key: "preWorkoutMeal", label: "Pre-Workout Meal", icon: "🍌" },
    { key: "postWorkoutMeal", label: "Post-Workout Meal", icon: "🥤" },
    { key: "dinner", label: "Dinner", icon: "🍗" },
    { key: "eveningSnack", label: "Evening Snack", icon: "🥜" }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gray-900 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-0" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-900">
              <Sparkles className="w-3 h-3" />
              Plan Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              My Personalized <span className="text-emerald-400">Diet Plan</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1.5">
              Based on {userAssessment?.fitnessGoal || "your goal"} • {userAssessment?.weight || 75} kg • {userAssessment?.dietaryPreference || "Non-Vegetarian"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onSavePlan && (
              <button
                id="dashboard-save-plan"
                onClick={onSavePlan}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                Save This Plan
              </button>
            )}
            <button
              id="dashboard-reset-plan"
              onClick={onReset}
              className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-sm border border-gray-700 transition cursor-pointer flex items-center gap-1.5"
            >
              <RotateCw className="w-4 h-4" />
              New Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Dashboard Summary Cockpit */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Calorie Balance & Core Progress Ring */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-md flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 dark:bg-orange-500/2 rounded-full blur-2xl -z-0" />
          
          {/* Circular Progress Ring */}
          <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="calorieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
              {/* Back trail */}
              <circle
                cx="50"
                cy="50"
                r="40"
                strokeWidth="7"
                stroke="currentColor"
                fill="transparent"
                className="text-slate-100 dark:text-slate-800"
              />
              {/* Front progress */}
              <circle
                cx="50"
                cy="50"
                r="40"
                strokeWidth="7"
                stroke="url(#calorieGrad)"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (Math.min(100, (totalCalsConsumed / plan.dailyCalories) * 100) / 100) * 251.2}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {totalCalsConsumed}
              </span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mt-0.5">
                / {plan.dailyCalories}
              </span>
              <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest mt-1">
                kcal
              </span>
            </div>
          </div>

          {/* Calorie Stats */}
          <div className="flex-1 space-y-3.5 z-10 w-full">
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Today's Calorie Balance</span>
              <h3 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-0.5">
                {totalCalsConsumed >= plan.dailyCalories ? "Budget Completed! 🎉" : "Fueling your day"}
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 rounded-2xl bg-orange-50/50 dark:bg-orange-950/15 border border-orange-100/50 dark:border-orange-900/10">
                <span className="text-[10px] font-bold text-orange-600/80 dark:text-orange-400/80 block uppercase">Consumed</span>
                <span className="text-base font-black text-orange-600 dark:text-orange-400">
                  {Math.round((totalCalsConsumed / plan.dailyCalories) * 100)}%
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-150 dark:border-slate-800/30">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase">Remaining</span>
                <span className="text-base font-black text-slate-700 dark:text-slate-300">
                  {Math.max(0, plan.dailyCalories - totalCalsConsumed)} <span className="text-xs font-semibold">kcal</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Real-time Macronutrients breakdown */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-md flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 dark:bg-emerald-500/2 rounded-full blur-2xl -z-0" />
          
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Nutritional Macros Ratio</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400">
              Fiber Target: {fiberVal}g
            </span>
          </div>

          <div className="space-y-4 z-10">
            {/* Protein Progress */}
            <div>
              <div className="flex justify-between items-baseline text-xs font-bold mb-1">
                <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Protein
                </span>
                <span className="font-mono text-slate-500">
                  {totalProteinConsumed}g <span className="text-slate-400 font-semibold">/ {proteinVal}g</span>
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full transition-all duration-500" 
                  style={{ width: `${proteinConsumedPercent}%` }} 
                />
              </div>
            </div>

            {/* Carbs Progress */}
            <div>
              <div className="flex justify-between items-baseline text-xs font-bold mb-1">
                <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Carbohydrates
                </span>
                <span className="font-mono text-slate-500">
                  {totalCarbsConsumed}g <span className="text-slate-400 font-semibold">/ {carbsVal}g</span>
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                  style={{ width: `${carbsConsumedPercent}%` }} 
                />
              </div>
            </div>

            {/* Fats Progress */}
            <div>
              <div className="flex justify-between items-baseline text-xs font-bold mb-1">
                <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  Fats
                </span>
                <span className="font-mono text-slate-500">
                  {totalFatsConsumed}g <span className="text-slate-400 font-semibold">/ {fatsVal}g</span>
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-cyan-500 rounded-full transition-all duration-500" 
                  style={{ width: `${fatsConsumedPercent}%` }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Hydration quick log */}
        {(() => {
          const targetWaterMl = (plan.hydrationPlan?.recommendedDailyLiters || 2.7) * 1000;
          const totalWaterIntake = waterLogs 
            ? waterLogs.filter((l) => l.date === todayDate).reduce((sum, item) => sum + item.amountMl, 0)
            : localWaterLog;
          const waterPercent = Math.min(100, Math.round((totalWaterIntake / targetWaterMl) * 100));

          return (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-md flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 dark:bg-cyan-500/2 rounded-full blur-2xl -z-0" />
              
              <div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Hydration Goal</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-black text-cyan-500 dark:text-cyan-400">
                    {totalWaterIntake}
                  </span>
                  <span className="text-xs text-slate-400">
                    / {targetWaterMl} ml
                  </span>
                </div>
                
                {/* Micro water drops visual checklist */}
                <div className="flex gap-1.5 mt-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => {
                    const active = totalWaterIntake >= i * 400;
                    return (
                      <div 
                        key={i} 
                        className={`h-6 flex-1 rounded-md transition-all duration-300 flex items-center justify-center text-[10px] ${
                          active 
                            ? "bg-cyan-500 text-white font-bold" 
                            : "bg-slate-50 dark:bg-slate-800 text-slate-400"
                        }`}
                      >
                        💧
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 space-y-2 z-10">
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleQuickWater(250)}
                    className="flex-1 py-1.5 bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/25 dark:hover:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 font-extrabold text-[10px] uppercase tracking-wider rounded-xl border border-cyan-100/10 transition cursor-pointer"
                  >
                    + 250ml
                  </button>
                  <button
                    onClick={() => handleQuickWater(500)}
                    className="flex-1 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition cursor-pointer"
                  >
                    + 500ml
                  </button>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 rounded-full transition-all duration-300" 
                    style={{ width: `${waterPercent}%` }} 
                  />
                </div>
              </div>
            </div>
          );
        })()}

        {/* Card 4: Daily timeline checklist */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-md flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-500/2 rounded-full blur-2xl -z-0" />
          
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-3">Today's Timeline</span>
            
            <div className="space-y-2.5 relative pl-3 border-l border-slate-100 dark:border-slate-800 z-10">
              <div className="relative">
                <span className="absolute -left-[16.5px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white dark:border-slate-900" />
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Breakfast</span>
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 leading-none">{mealTiming.breakfast}</span>
              </div>
              <div className="relative">
                <span className="absolute -left-[16.5px] top-1 w-2.5 h-2.5 rounded-full bg-orange-500 border-2 border-white dark:border-slate-900" />
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Lunch</span>
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 leading-none">{mealTiming.lunch}</span>
              </div>
              <div className="relative">
                <span className="absolute -left-[16.5px] top-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white dark:border-slate-900" />
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Workout Window</span>
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 leading-none">
                  {userAssessment?.schedule?.workout || "18:00"}
                </span>
              </div>
              <div className="relative">
                <span className="absolute -left-[16.5px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-900" />
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Dinner</span>
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 leading-none">{mealTiming.dinner}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: Profile, Goal & Weight tracker */}
        {(() => {
          const isWorkoutCompleted = workoutLogs
            ? workoutLogs.some((l) => l.date === todayDate && l.completed)
            : localWorkout;

          // Dynamic quotes based on fitness goals
          const goal = userAssessment?.fitnessGoal || "Fitness";
          let quote = "Progress is quiet. Consistency makes it loud.";
          if (goal.includes("Loss")) {
            quote = "Deficit done right. Sweat is fat crying.";
          } else if (goal.includes("Gain") || goal.includes("Bulk")) {
            quote = "Feed the muscles, starve the excuses.";
          } else if (goal.includes("Athletic")) {
            quote = "Train like an athlete, eat like a nutritionist.";
          }

          return (
            <div className="md:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-md flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 dark:bg-violet-500/2 rounded-full blur-2xl -z-0" />
              
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">My Target Goal</span>
                  <span className="text-lg font-extrabold text-slate-800 dark:text-white mt-1 block">
                    {goal}
                  </span>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    Starting: {userAssessment?.weight || 75} kg • {userAssessment?.activityLevel || "Active"}
                  </p>
                </div>
                
                <span className="px-2.5 py-1 bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {userAssessment?.workoutType || "Gym"}
                </span>
              </div>

              {/* Dynamic motivational quote */}
              <div className="p-3 my-3 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800/60 text-xs italic text-slate-500 dark:text-slate-400 font-semibold text-center z-10">
                "{quote}"
              </div>

              <div className="flex gap-2 items-center mt-2 z-10">
                <button
                  onClick={handleWorkoutToggle}
                  className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition duration-300 cursor-pointer ${
                    isWorkoutCompleted
                      ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100/50"
                      : "bg-slate-950 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-750 text-white"
                  }`}
                >
                  {isWorkoutCompleted ? "✓ Workout Completed!" : "Mark Workout Done Today"}
                </button>
              </div>
            </div>
          );
        })()}

      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 overflow-x-auto no-scrollbar pt-2">
        <button
          onClick={() => setActiveTab("meals")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition shrink-0 cursor-pointer ${
            activeTab === "meals"
              ? "border-emerald-500 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          📅 Today's Meal Plan
        </button>
        <button
          onClick={() => setActiveTab("groceries")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition shrink-0 cursor-pointer ${
            activeTab === "groceries"
              ? "border-emerald-500 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          🛒 Grocery Shopping List
        </button>
        <button
          onClick={() => setActiveTab("insights")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition shrink-0 cursor-pointer ${
            activeTab === "insights"
              ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          💡 Insights & Weekly Rotation
        </button>
        <button
          onClick={() => setActiveTab("supplements")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition shrink-0 cursor-pointer ${
            activeTab === "supplements"
              ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          💊 Hydration & Supplements
        </button>
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        {/* TAB 1: MEAL PLAN */}
        {activeTab === "meals" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>Structured Meal Log</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Click "+ Log Eaten" on any meal item to automatically log those calories and macros to your daily tracker history.
                </p>
              </div>

              {/* Day selector for meal rotation preview */}
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {["Today", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                      selectedDay === d
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {selectedDay !== "Today" ? (
              // Display rotation meal info
              <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200/50 dark:border-gray-700/50 space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  <Calendar className="w-4.5 h-4.5" />
                  Meal Alternatives for {selectedDay}
                </div>
                {plan.weeklyRotation?.find((x) => x.day.toLowerCase() === selectedDay.toLowerCase()) ? (
                  (() => {
                    const rot = plan.weeklyRotation.find((x) => x.day.toLowerCase() === selectedDay.toLowerCase());
                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">🍳 Breakfast Alternative</span>
                          <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold">{rot?.meals.breakfast}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">🍲 Lunch Alternative</span>
                          <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold">{rot?.meals.lunch}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">🍗 Dinner Alternative</span>
                          <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold">{rot?.meals.dinner}</p>
                        </div>
                        {rot?.meals.snacks && (
                          <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 sm:col-span-3">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">🍎 Snacking Ideas</span>
                            <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold">{rot?.meals.snacks}</p>
                          </div>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <p className="text-sm text-gray-500">Use dynamic smart chat substitution for additional personalized meal configurations on {selectedDay}.</p>
                )}
              </div>
            ) : (
              // Display primary meal plan
              <div className="space-y-4">
                {mealTypes.map(({ key, label, icon }) => {
                  const items = plan.mealPlan[key as keyof typeof plan.mealPlan] as MealItem[];
                  if (!items || items.length === 0) return null;

                  const mealCalories = items.reduce((sum, item) => sum + item.calories, 0);
                  const mealTime = mealTiming[key] || "08:00";

                  return (
                    <div
                      key={key}
                      className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm transition hover:shadow-md"
                    >
                      {/* Meal Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-50 dark:border-gray-800/80 pb-3 mb-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{icon}</span>
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-base">{label}</h3>
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{mealTime}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Subtotal</span>
                            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{mealCalories} kcal</span>
                          </div>
                        </div>
                      </div>

                      {/* Meal Foods List */}
                      <div className="space-y-3">
                        {items.map((item, idx) => {
                          const keyId = `${key}-${item.name}`;
                          const isLogged = loggedMeals[keyId];

                          return (
                            <div
                              key={idx}
                              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-850/40 border border-gray-200/40 dark:border-gray-800/40 gap-3"
                            >
                              <div className="space-y-0.5">
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white">{item.name}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Quantity: {item.quantity}</p>
                              </div>

                              <div className="flex items-center gap-4 justify-between sm:justify-end">
                                {/* Food Macros Indicator */}
                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                  <div className="flex items-baseline gap-0.5">
                                    <span className="font-extrabold text-orange-600 dark:text-orange-400 text-sm">{item.calories}</span>
                                    <span className="text-[9px]">kcal</span>
                                  </div>
                                  {(item.protein || item.carbs || item.fats) && (
                                    <div className="flex gap-2 text-[10px] font-semibold border-l border-gray-200 dark:border-gray-800 pl-3">
                                      <span className="text-red-600 dark:text-red-400">P: {item.protein || 0}g</span>
                                      <span className="text-amber-600 dark:text-amber-400">C: {item.carbs || 0}g</span>
                                      <span className="text-cyan-600 dark:text-cyan-400">F: {item.fats || 0}g</span>
                                    </div>
                                  )}
                                </div>

                                <button
                                  id={`log-meal-${keyId}`}
                                  onClick={() => handleLogMealItem(key, item)}
                                  disabled={isLogged}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1 cursor-pointer transition ${
                                    isLogged
                                      ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                                      : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60 dark:text-emerald-400"
                                  }`}
                                >
                                  {isLogged ? "Logged ✓" : <><PlusCircle className="w-3.5 h-3.5" /> Log Eaten</>}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GROCERY LIST */}
        {activeTab === "groceries" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Grocery Shopping Checklist</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Check off items as you shop. Grouped into fresh nutrients and proteins.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(plan.groceryList).map(([category, items]) => {
                if (!items || !Array.isArray(items) || items.length === 0) return null;

                const categoryLabels: Record<string, string> = {
                  proteins: "🥩 Proteins",
                  fruits: "🍎 Fruits",
                  vegetables: "🥦 Vegetables",
                  dairy: "🥛 Dairy",
                  grains: "🌾 Grains & Carbs",
                  healthyFats: "🥑 Healthy Fats",
                  snacks: "🍿 Snacks",
                  supplements: "💊 Supplements"
                };

                return (
                  <div
                    key={category}
                    className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm"
                  >
                    <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wider text-gray-400 border-b border-gray-50 dark:border-gray-800 pb-2">
                      {categoryLabels[category] || category}
                    </h3>
                    <div className="space-y-2">
                      {items.map((item, idx) => {
                        const isChecked = checkedGroceries[item];
                        return (
                          <button
                            key={idx}
                            id={`grocery-${category}-${idx}`}
                            onClick={() => toggleGrocery(item)}
                            className="w-full text-left flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-850 transition cursor-pointer"
                          >
                            <div className="mt-0.5 shrink-0 text-gray-400 hover:text-emerald-500 transition">
                              {isChecked ? (
                                <CheckSquare className="w-4.5 h-4.5 text-emerald-500 fill-emerald-500/10" />
                              ) : (
                                <Square className="w-4.5 h-4.5" />
                              )}
                            </div>
                            <span
                              className={`text-sm font-semibold ${
                                isChecked
                                  ? "line-through text-gray-400 dark:text-gray-600"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {item}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: INSIGHTS & ROTATION */}
        {activeTab === "insights" && (
          <div className="space-y-6">
            {/* Scientific Justifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">
                  <Flame className="w-4 h-4 text-orange-500" />
                  Calorie Target Justification
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  {plan.insights.calorieJustification}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  Macronutrient Proportions
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  {plan.insights.macroJustification}
                </p>
              </div>
            </div>

            {/* Foods to prioritize vs limit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100/60 dark:border-emerald-900/20">
                <h3 className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2 mb-3 text-sm uppercase tracking-wider">
                  <TrendingUp className="w-4.5 h-4.5" />
                  Foods to Prioritize
                </h3>
                <ul className="space-y-2">
                  {plan.insights.foodsToPrioritize.map((food, idx) => (
                    <li key={idx} className="text-sm text-emerald-900 dark:text-emerald-300 flex items-start gap-2 font-medium">
                      <span className="text-emerald-500 shrink-0 mt-1">•</span>
                      <span>{food}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-red-50/40 dark:bg-red-950/10 border border-red-100/60 dark:border-red-900/20">
                <h3 className="font-bold text-red-800 dark:text-red-400 flex items-center gap-2 mb-3 text-sm uppercase tracking-wider">
                  <TrendingDown className="w-4.5 h-4.5" />
                  Foods to Avoid or Limit
                </h3>
                <ul className="space-y-2">
                  {plan.insights.foodsToLimit.map((food, idx) => (
                    <li key={idx} className="text-sm text-red-900 dark:text-red-300 flex items-start gap-2 font-medium">
                      <span className="text-red-400 shrink-0 mt-1">•</span>
                      <span>{food}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recovery Tips */}
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4 text-sm uppercase tracking-wider">
                <ShieldCheck className="w-5 h-5 text-indigo-500" />
                Advanced Athletic Recovery & Muscle Tips
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {plan.insights.recoveryTips.map((tip, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-800/80 text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: WATER & SUPPLEMENTS */}
        {activeTab === "supplements" && (
          <div className="space-y-6">
            {/* Hydration Section */}
            <div className="p-6 rounded-2xl bg-cyan-50/30 dark:bg-cyan-950/10 border border-cyan-100/50 dark:border-cyan-900/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 rounded-xl shrink-0">
                  <Droplet className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-cyan-900 dark:text-cyan-300 text-lg">Hydration Blueprint</h3>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-extrabold text-cyan-700 dark:text-cyan-400">
                      {plan.hydrationPlan.recommendedDailyLiters || 2.7}
                    </span>
                    <span className="text-xs font-semibold text-cyan-600">Liters / day</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {plan.hydrationPlan.tips.map((tip, idx) => (
                  <div key={idx} className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-cyan-100/30 dark:border-cyan-900/30 text-sm text-gray-700 dark:text-gray-300 font-medium">
                    💧 {tip}
                  </div>
                ))}
              </div>
            </div>

            {/* Supplements Recommendations */}
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  Supplement Recommendations
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Scientific supplement recommendations generated specifically for your physical profile.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plan.supplements && plan.supplements.length > 0 ? (
                  plan.supplements.map((sup, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-bold text-gray-900 dark:text-white text-base">{sup.name}</h4>
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            {sup.timing}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium mt-1">
                          {sup.reason}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500 border border-dashed rounded-xl col-span-2">
                    No custom supplements suggested for this caloric profile. Consult your physician.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
