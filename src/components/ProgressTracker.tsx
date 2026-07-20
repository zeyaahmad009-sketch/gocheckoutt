import React, { useState } from "react";
import {
  WeightLog,
  MeasurementLog,
  FoodLog,
  WaterLog,
  WorkoutLog,
  ProgressPhoto,
  DietPlan
} from "../types";
import {
  Plus,
  Trash2,
  TrendingUp,
  Droplet,
  Calendar,
  Flame,
  ChevronRight,
  Sparkles,
  Award,
  PlusCircle,
  Dumbbell,
  Upload,
  Camera,
  Activity
} from "lucide-react";
import { motion } from "motion/react";

interface ProgressTrackerProps {
  activePlan: DietPlan | null;
  weightLogs: WeightLog[];
  onAddWeightLog: (weight: number, date: string) => void;
  onDeleteWeightLog: (id: string) => void;
  measurementLogs: MeasurementLog[];
  onAddMeasurementLog: (measurements: Partial<MeasurementLog>, date: string) => void;
  onDeleteMeasurementLog: (id: string) => void;
  foodLogs: FoodLog[];
  onAddFoodLog: (name: string, calories: number, protein: number, carbs: number, fats: number, date: string) => void;
  onDeleteFoodLog: (id: string) => void;
  waterLogs: WaterLog[];
  onAddWaterLog: (amountMl: number, date: string) => void;
  onClearWaterLogs: (date: string) => void;
  workoutLogs: WorkoutLog[];
  onToggleWorkoutLog: (date: string) => void;
  progressPhotos: ProgressPhoto[];
  onAddProgressPhoto: (url: string, note: string, date: string) => void;
  onDeleteProgressPhoto: (id: string) => void;
}

export default function ProgressTracker({
  activePlan,
  weightLogs,
  onAddWeightLog,
  onDeleteWeightLog,
  measurementLogs,
  onAddMeasurementLog,
  onDeleteMeasurementLog,
  foodLogs,
  onAddFoodLog,
  onDeleteFoodLog,
  waterLogs,
  onAddWaterLog,
  onClearWaterLogs,
  workoutLogs,
  onToggleWorkoutLog,
  progressPhotos,
  onAddProgressPhoto,
  onDeleteProgressPhoto
}: ProgressTrackerProps) {
  const [trackerTab, setTrackerTab] = useState<"calories" | "weight" | "measurements" | "photos">("calories");
  
  // Form States
  const [weightInput, setWeightInput] = useState("");
  const [weightDate, setWeightDate] = useState(new Date().toISOString().split("T")[0]);

  const [chestInput, setChestInput] = useState("");
  const [waistInput, setWaistInput] = useState("");
  const [hipsInput, setHipsInput] = useState("");
  const [bicepsInput, setBicepsInput] = useState("");
  const [thighsInput, setThighsInput] = useState("");
  const [measureDate, setMeasureDate] = useState(new Date().toISOString().split("T")[0]);

  const [foodName, setFoodName] = useState("");
  const [foodCal, setFoodCal] = useState("");
  const [foodProt, setFoodProt] = useState("");
  const [foodCarb, setFoodCarb] = useState("");
  const [foodFat, setFoodFat] = useState("");

  const [photoNote, setPhotoNote] = useState("");
  const [photoDate, setPhotoDate] = useState(new Date().toISOString().split("T")[0]);

  const todayDate = new Date().toISOString().split("T")[0];

  // Daily Calculations
  const targetCalories = activePlan?.dailyCalories || 2000;
  const targetProtein = activePlan?.macros?.protein || 140;
  const targetCarbs = activePlan?.macros?.carbs || 200;
  const targetFats = activePlan?.macros?.fats || 65;
  const targetWaterLiters = activePlan?.hydrationPlan?.recommendedDailyLiters || 3;
  const targetWaterMl = targetWaterLiters * 1000;

  const todayFoodLogs = foodLogs.filter((log) => log.date === todayDate);
  const totalCaloriesConsumed = todayFoodLogs.reduce((sum, item) => sum + item.calories, 0);
  const totalProteinConsumed = todayFoodLogs.reduce((sum, item) => sum + (item.protein || 0), 0);
  const totalCarbsConsumed = todayFoodLogs.reduce((sum, item) => sum + (item.carbs || 0), 0);
  const totalFatsConsumed = todayFoodLogs.reduce((sum, item) => sum + (item.fats || 0), 0);

  const todayWaterLogs = waterLogs.filter((log) => log.date === todayDate);
  const totalWaterIntake = todayWaterLogs.reduce((sum, item) => sum + item.amountMl, 0);

  const todayWorkoutCompleted = workoutLogs.some((log) => log.date === todayDate && log.completed);

  // Weight chart generation (Custom SVG)
  const sortedWeightLogs = [...weightLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const hasWeightData = sortedWeightLogs.length > 0;

  // Render inline custom SVG graph
  const renderWeightChart = () => {
    if (sortedWeightLogs.length < 2) {
      return (
        <div className="h-48 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
          <TrendingUp className="w-8 h-8 mb-2" />
          <p className="text-xs font-bold">Need at least 2 weight logs to plot progression trend.</p>
        </div>
      );
    }

    const minWeight = Math.min(...sortedWeightLogs.map((d) => d.weight)) - 2;
    const maxWeight = Math.max(...sortedWeightLogs.map((d) => d.weight)) + 2;
    const weightRange = maxWeight - minWeight;

    const width = 500;
    const height = 180;
    const padding = 30;

    const points = sortedWeightLogs.map((d, index) => {
      const x = padding + (index / (sortedWeightLogs.length - 1)) * (width - padding * 2);
      const y = height - padding - ((d.weight - minWeight) / weightRange) * (height - padding * 2);
      return { x, y, ...d };
    });

    const pathData = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

    return (
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[400px] text-emerald-500">
          {/* Horizontal gridlines */}
          {[0, 0.5, 1].map((ratio, i) => {
            const y = padding + ratio * (height - padding * 2);
            const value = maxWeight - ratio * weightRange;
            return (
              <g key={i} className="opacity-30">
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="currentColor" strokeWidth={0.5} strokeDasharray="3 3" />
                <text x={padding - 5} y={y + 3} fill="currentColor" fontSize="8" textAnchor="end" className="dark:text-gray-400 font-semibold">
                  {Math.round(value)}kg
                </text>
              </g>
            );
          })}

          {/* Trend Line */}
          <path d={pathData} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />

          {/* Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={4} fill="#10B981" stroke="#fff" strokeWidth={1.5} className="cursor-pointer" />
              {/* Tooltip text */}
              <text x={p.x} y={p.y - 8} fontSize="7" fontWeight="bold" textAnchor="middle" fill="currentColor" className="dark:text-white">
                {p.weight}
              </text>
              {/* Date text */}
              <text x={p.x} y={height - 8} fontSize="7" textAnchor="middle" className="text-gray-400 dark:text-gray-500">
                {p.date.substring(5)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(weightInput);
    if (!isNaN(val) && val > 0) {
      onAddWeightLog(val, weightDate);
      setWeightInput("");
    }
  };

  const handleAddMeasurements = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<MeasurementLog> = {};
    if (chestInput) payload.chest = parseFloat(chestInput);
    if (waistInput) payload.waist = parseFloat(waistInput);
    if (hipsInput) payload.hips = parseFloat(hipsInput);
    if (bicepsInput) payload.biceps = parseFloat(bicepsInput);
    if (thighsInput) payload.thighs = parseFloat(thighsInput);

    onAddMeasurementLog(payload, measureDate);
    setChestInput("");
    setWaistInput("");
    setHipsInput("");
    setBicepsInput("");
    setThighsInput("");
  };

  const handleAddManualFood = (e: React.FormEvent) => {
    e.preventDefault();
    const cal = parseInt(foodCal);
    if (foodName.trim() && !isNaN(cal) && cal >= 0) {
      onAddFoodLog(
        foodName.trim(),
        cal,
        parseInt(foodProt) || 0,
        parseInt(foodCarb) || 0,
        parseInt(foodFat) || 0,
        todayDate
      );
      setFoodName("");
      setFoodCal("");
      setFoodProt("");
      setFoodCarb("");
      setFoodFat("");
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAddProgressPhoto(reader.result as string, photoNote || "Weekly progress photo", photoDate);
        setPhotoNote("");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Header Navigation */}
      <div className="flex flex-wrap border-b border-gray-100 dark:border-gray-800 gap-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setTrackerTab("calories")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition shrink-0 cursor-pointer ${
            trackerTab === "calories"
              ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          🔥 Calories & Hydration Log
        </button>
        <button
          onClick={() => setTrackerTab("weight")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition shrink-0 cursor-pointer ${
            trackerTab === "weight"
              ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          ⚖️ Weight Tracker
        </button>
        <button
          onClick={() => setTrackerTab("measurements")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition shrink-0 cursor-pointer ${
            trackerTab === "measurements"
              ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          📏 Body Measurements
        </button>
        <button
          onClick={() => setTrackerTab("photos")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition shrink-0 cursor-pointer ${
            trackerTab === "photos"
              ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          📷 Progress Photos
        </button>
      </div>

      {/* Main Trackers Area */}
      <div className="space-y-6">
        
        {/* TAB 1: CALORIES & HYDRATION */}
        {trackerTab === "calories" && (
          <div className="space-y-6">
            {/* Today Rings/Counters Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Calories Consumed Ring Display */}
              <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Today's Energy Balance</span>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="text-3xl font-black text-gray-900 dark:text-white">{totalCaloriesConsumed}</span>
                    <span className="text-xs text-gray-400">/ {targetCalories} kcal</span>
                  </div>
                </div>
                {/* Visual Progress Line */}
                <div className="mt-5 space-y-1.5">
                  <div className="h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (totalCaloriesConsumed / targetCalories) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                    <span>{Math.round((totalCaloriesConsumed / targetCalories) * 100)}% Consumed</span>
                    <span>{Math.max(0, targetCalories - totalCaloriesConsumed)} kcal remaining</span>
                  </div>
                </div>
              </div>

              {/* Water Log Ring Display */}
              <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hydration Level</span>
                    {totalWaterIntake > 0 && (
                      <button
                        onClick={() => onClearWaterLogs(todayDate)}
                        className="text-[10px] font-extrabold text-red-500 hover:underline cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="text-3xl font-black text-cyan-600 dark:text-cyan-400">{totalWaterIntake}</span>
                    <span className="text-xs text-gray-400">/ {targetWaterMl} ml</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-1.5">
                  <button
                    id="add-water-250"
                    onClick={() => onAddWaterLog(250, todayDate)}
                    className="flex-1 py-1.5 bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/20 dark:hover:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 font-bold text-xs rounded-xl border border-cyan-100/30 transition cursor-pointer"
                  >
                    + 250ml Cup
                  </button>
                  <button
                    id="add-water-500"
                    onClick={() => onAddWaterLog(500, todayDate)}
                    className="flex-1 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    + 500ml Bottle
                  </button>
                </div>
                {/* Progress bar */}
                <div className="mt-3">
                  <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (totalWaterIntake / targetWaterMl) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Workout Checklist / Consistency Display */}
              <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Workout Check-in</span>
                  <div className="flex items-center gap-3 mt-3">
                    <div className={`p-2.5 rounded-xl shrink-0 ${
                      todayWorkoutCompleted ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                    }`}>
                      <Dumbbell className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white block">
                        {todayWorkoutCompleted ? "Workout Completed!" : "Rest or Pending"}
                      </span>
                      <span className="text-xs text-gray-400">Keep up the momentum</span>
                    </div>
                  </div>
                </div>

                <button
                  id="toggle-workout-today"
                  onClick={() => onToggleWorkoutLog(todayDate)}
                  className={`w-full py-2 rounded-xl text-xs font-extrabold transition cursor-pointer mt-4 ${
                    todayWorkoutCompleted
                      ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100"
                      : "bg-gray-900 dark:bg-gray-850 text-white hover:bg-gray-850"
                  }`}
                >
                  {todayWorkoutCompleted ? "✓ Logged Complete (Toggle)" : "+ Mark Today's Workout Complete"}
                </button>
              </div>

            </div>

            {/* Daily Macronutrients Burned Progress */}
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-4">Daily Macronutrients (Today)</span>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-500">Protein</span>
                    <span className="font-bold text-gray-900 dark:text-white">{totalProteinConsumed}g / {targetProtein}g</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min(100, (totalProteinConsumed / targetProtein) * 100)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-500">Carbohydrates</span>
                    <span className="font-bold text-gray-900 dark:text-white">{totalCarbsConsumed}g / {targetCarbs}g</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, (totalCarbsConsumed / targetCarbs) * 100)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-500">Fats</span>
                    <span className="font-bold text-gray-900 dark:text-white">{totalFatsConsumed}g / {targetFats}g</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${Math.min(100, (totalFatsConsumed / targetFats) * 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Log Manual Meals / Consumed Foods */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Manual Food Logging Form */}
              <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm lg:col-span-1">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">Log Custom Meal Item</h3>
                <form onSubmit={handleAddManualFood} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Food / Meal Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Scrambled Eggs with Avocado"
                      value={foodName}
                      onChange={(e) => setFoodName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-250 dark:border-gray-800 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Calories (kcal)</label>
                      <input
                        type="number"
                        required
                        min="0"
                        placeholder="350"
                        value={foodCal}
                        onChange={(e) => setFoodCal(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Protein (g)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="24"
                        value={foodProt}
                        onChange={(e) => setFoodProt(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Carbs (g)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="10"
                        value={foodCarb}
                        onChange={(e) => setFoodCarb(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Fats (g)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="12"
                        value={foodFat}
                        onChange={(e) => setFoodFat(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer transition shadow-lg shadow-emerald-500/10 mt-2"
                  >
                    + Add to Daily Food Logs
                  </button>
                </form>
              </div>

              {/* Today's Food Logs List */}
              <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm lg:col-span-2 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Today's Consumed Log</h3>
                  {todayFoodLogs.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 dark:text-gray-500 text-xs">
                      No foods logged yet for today. Use the structured diet dashboard meals or input a custom meal above.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                      {todayFoodLogs.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-800"
                        >
                          <div>
                            <span className="font-bold text-sm text-gray-900 dark:text-white block">{item.name}</span>
                            <span className="text-[10px] text-gray-400 font-semibold uppercase">
                              P: {item.protein}g • C: {item.carbs}g • F: {item.fats}g
                            </span>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">{item.calories} kcal</span>
                            <button
                              id={`delete-food-${item.id}`}
                              onClick={() => onDeleteFoodLog(item.id)}
                              className="p-1 text-gray-400 hover:text-red-500 rounded transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: WEIGHT TRACKER */}
        {trackerTab === "weight" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Form: Log New Weight */}
              <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm lg:col-span-1">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">Log Weight Entry</h3>
                <form onSubmit={handleAddWeight} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="e.g. 74.5"
                      value={weightInput}
                      onChange={(e) => setWeightInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Date</label>
                    <input
                      type="date"
                      required
                      value={weightDate}
                      onChange={(e) => setWeightDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/15 cursor-pointer transition"
                  >
                    + Save Weight Entry
                  </button>
                </form>
              </div>

              {/* Middle & Right: Trend Chart & logs list */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* SVG Progress Graph */}
                <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-4">Weight Progression Chart</span>
                  {renderWeightChart()}
                </div>

                {/* Weight Logs List */}
                <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Weight History Entries</span>
                  {weightLogs.length === 0 ? (
                    <div className="py-6 text-center text-gray-400 text-xs">No entries logged yet.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                      {[...weightLogs]
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-800/80"
                          >
                            <div className="flex items-center gap-2.5">
                              <Calendar className="w-4 h-4 text-emerald-600" />
                              <div>
                                <span className="font-bold text-sm text-gray-900 dark:text-white block">{item.weight} kg</span>
                                <span className="text-[10px] text-gray-400 font-medium">{item.date}</span>
                              </div>
                            </div>
                            <button
                              id={`delete-weight-${item.id}`}
                              onClick={() => onDeleteWeightLog(item.id)}
                              className="p-1 text-gray-400 hover:text-red-500 rounded transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MEASUREMENTS */}
        {trackerTab === "measurements" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Form: Record Body Measurements */}
              <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm lg:col-span-1">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">Record Measurements</h3>
                <form onSubmit={handleAddMeasurements} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Chest (cm)</label>
                      <input
                        type="number"
                        placeholder="e.g. 104"
                        value={chestInput}
                        onChange={(e) => setChestInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Waist (cm)</label>
                      <input
                        type="number"
                        placeholder="e.g. 82"
                        value={waistInput}
                        onChange={(e) => setWaistInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Hips (cm)</label>
                      <input
                        type="number"
                        placeholder="e.g. 96"
                        value={hipsInput}
                        onChange={(e) => setHipsInput(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Bicep (cm)</label>
                      <input
                        type="number"
                        placeholder="e.g. 38"
                        value={bicepsInput}
                        onChange={(e) => setBicepsInput(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Thigh (cm)</label>
                      <input
                        type="number"
                        placeholder="e.g. 58"
                        value={thighsInput}
                        onChange={(e) => setThighsInput(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Entry Date</label>
                    <input
                      type="date"
                      required
                      value={measureDate}
                      onChange={(e) => setMeasureDate(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/15 cursor-pointer mt-1"
                  >
                    Save Measurement Log
                  </button>
                </form>
              </div>

              {/* Right List: Display Body logs */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Measurement History Records</h3>
                  {measurementLogs.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 text-xs">No logs recorded yet. Fill out the record card.</div>
                  ) : (
                    <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                      {[...measurementLogs]
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((item) => (
                          <div
                            key={item.id}
                            className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-800 flex items-center justify-between"
                          >
                            <div>
                              <span className="text-xs text-gray-400 font-bold block mb-1">DATE: {item.date}</span>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-700 dark:text-gray-300 font-semibold">
                                {item.chest && <span>Chest: {item.chest}cm</span>}
                                {item.waist && <span>Waist: {item.waist}cm</span>}
                                {item.hips && <span>Hips: {item.hips}cm</span>}
                                {item.biceps && <span>Bicep: {item.biceps}cm</span>}
                                {item.thighs && <span>Thigh: {item.thighs}cm</span>}
                              </div>
                            </div>

                            <button
                              id={`delete-measure-${item.id}`}
                              onClick={() => onDeleteMeasurementLog(item.id)}
                              className="p-1 text-gray-400 hover:text-red-500 transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: PROGRESS PHOTOS */}
        {trackerTab === "photos" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Photo Input and Details */}
              <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm lg:col-span-1">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">Upload Progress Photo</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Note</label>
                    <input
                      type="text"
                      placeholder="e.g. Week 4 Check-in"
                      value={photoNote}
                      onChange={(e) => setPhotoNote(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Date</label>
                    <input
                      type="date"
                      value={photoDate}
                      onChange={(e) => setPhotoDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Drag and drop input area */}
                  <label className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-6 text-center flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition group block">
                    <Camera className="w-8 h-8 text-gray-400 group-hover:text-emerald-500 transition mb-2" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Choose Photo or Drag Here</span>
                    <span className="text-[10px] text-gray-400 block">Survives refresh locally via localStorage</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Photos Gallery */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">My Physical Progression Timeline</h3>
                {progressPhotos.length === 0 ? (
                  <div className="py-24 text-center text-gray-400 dark:text-gray-500 text-xs border border-dashed border-gray-150 dark:border-gray-800 rounded-2xl flex flex-col items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    No progress photos uploaded yet. Upload a photo in the form card.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-1">
                    {[...progressPhotos]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((p) => (
                        <div
                          key={p.id}
                          className="relative rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-850 group aspect-[3/4]"
                        >
                          <img
                            src={p.url}
                            alt={p.note}
                            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
                            <span className="text-[10px] font-bold text-white block truncate leading-tight">{p.note}</span>
                            <span className="text-[8px] text-gray-300 block leading-tight mt-0.5">{p.date}</span>
                          </div>
                          <button
                            id={`delete-photo-${p.id}`}
                            onClick={() => onDeleteProgressPhoto(p.id)}
                            className="absolute top-1.5 right-1.5 p-1.5 bg-black/60 hover:bg-red-600/90 rounded-lg text-white transition scale-90 opacity-0 group-hover:opacity-100 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
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
