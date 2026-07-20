import React, { useState } from "react";
import { UserAssessment, Schedule } from "../types";
import { ArrowLeft, ArrowRight, Sparkles, Check, Info } from "lucide-react";
import { motion } from "motion/react";

interface AssessmentFormProps {
  onSubmit: (assessment: UserAssessment) => void;
  onCancel: () => void;
  isGenerating: boolean;
}

const DEFAULT_SCHEDULE: Schedule = {
  wakeup: "07:00",
  breakfast: "08:00",
  lunch: "13:00",
  dinner: "20:00",
  workout: "18:00",
  sleep: "23:00"
};

const INITIAL_STATE: UserAssessment = {
  name: "",
  age: 28,
  gender: "Male",
  height: 175,
  weight: 75,
  bodyFat: undefined,
  fitnessGoal: "Fat Loss",
  activityLevel: "Moderately Active",
  workoutType: "Gym",
  workoutDays: 4,
  workoutDuration: 60,
  workoutIntensity: "Moderate",
  dietaryPreference: "Non-Vegetarian",
  foodPreferences: ["High Protein"],
  allergies: [],
  healthConditions: [],
  schedule: DEFAULT_SCHEDULE,
  budget: "Medium",
  waterIntake: 2000,
  supplements: []
};

const FITNESS_GOALS = [
  "Weight Loss",
  "Fat Loss",
  "Muscle Gain",
  "Lean Bulk",
  "Body Recomposition",
  "Maintenance",
  "Improve Athletic Performance"
];

const ACTIVITY_LEVELS = [
  { value: "Sedentary", label: "Sedentary", desc: "Little to no exercise, desk job" },
  { value: "Lightly Active", label: "Lightly Active", desc: "Light exercise 1-3 days/week" },
  { value: "Moderately Active", label: "Moderately Active", desc: "Moderate exercise 3-5 days/week" },
  { value: "Very Active", label: "Very Active", desc: "Hard exercise 6-7 days/week" },
  { value: "Athlete", label: "Athlete", desc: "Professional athlete or dual daily workouts" }
];

const WORKOUT_TYPES = ["Gym", "Home Workout", "CrossFit", "Running", "Cycling", "Yoga", "Calisthenics", "Sports"];
const DIETARY_PREFERENCES = ["Vegetarian", "Vegan", "Non-Vegetarian", "Eggetarian", "Pescatarian"];
const FOOD_PREFS = ["Indian", "Mediterranean", "Asian", "High Protein", "Low Carb", "Keto", "Paleo", "Balanced Diet"];
const ALLERGIES_LIST = ["Lactose Intolerant", "Gluten-Free", "Nut Allergy", "Soy Allergy", "Egg Allergy"];
const HEALTH_CONDITIONS = ["Diabetes", "High Blood Pressure", "PCOS", "Thyroid", "High Cholesterol", "Digestive Issues"];
const SUPPLEMENTS_LIST = ["Whey Protein", "Creatine", "Multivitamin", "Fish Oil", "BCAA"];

export default function AssessmentForm({ onSubmit, onCancel, isGenerating }: AssessmentFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserAssessment>(INITIAL_STATE);
  const [customAllergy, setCustomAllergy] = useState("");
  const [customHealth, setCustomHealth] = useState("");

  const totalSteps = 5;

  const updateField = (field: keyof UserAssessment, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateSchedule = (field: keyof Schedule, value: string) => {
    setFormData((prev) => ({
      ...prev,
      schedule: { ...prev.schedule, [field]: value }
    }));
  };

  const toggleArrayItem = (field: "foodPreferences" | "allergies" | "healthConditions" | "supplements", item: string) => {
    setFormData((prev) => {
      const arr = prev[field] || [];
      const updated = arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
      return { ...prev, [field]: updated };
    });
  };

  const handleAddCustomAllergy = () => {
    if (customAllergy.trim()) {
      toggleArrayItem("allergies", customAllergy.trim());
      setCustomAllergy("");
    }
  };

  const handleAddCustomHealth = () => {
    if (customHealth.trim()) {
      toggleArrayItem("healthConditions", customHealth.trim());
      setCustomHealth("");
    }
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
      {/* Progress Header */}
      <div className="px-6 py-5 bg-gray-50 dark:bg-gray-850/40 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            Step {step} of {totalSteps}
          </span>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {step === 1 && "Physical Profile"}
            {step === 2 && "Fitness Goals & Lifestyle"}
            {step === 3 && "Workout Routine"}
            {step === 4 && "Nutrition & Diet preferences"}
            {step === 5 && "Daily Schedule & Timing"}
          </h2>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div
              key={idx}
              className={`h-2 w-8 rounded-full transition-all duration-300 ${
                idx + 1 === step
                  ? "bg-emerald-600 w-12"
                  : idx + 1 < step
                  ? "bg-emerald-400"
                  : "bg-gray-200 dark:bg-gray-800"
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {/* STEP 1: PHYSICAL PROFILE */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Name <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Gender</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Male", "Female", "Other"].map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => updateField("gender", g)}
                      className={`py-3 px-4 rounded-xl border text-sm font-medium transition cursor-pointer text-center ${
                        formData.gender === g
                          ? "bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-500 dark:text-emerald-400 font-semibold"
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Age (Years)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={formData.age || ""}
                  onChange={(e) => updateField("age", parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Height (cm)</label>
                <input
                  type="number"
                  required
                  min="50"
                  max="300"
                  value={formData.height || ""}
                  onChange={(e) => updateField("height", parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Weight (kg)</label>
                <input
                  type="number"
                  required
                  min="10"
                  max="500"
                  value={formData.weight || ""}
                  onChange={(e) => updateField("weight", parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Body Fat % <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                min="2"
                max="70"
                value={formData.bodyFat || ""}
                onChange={(e) => updateField("bodyFat", e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="e.g. 15"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-gray-400" />
                Leaving body fat blank will calculate an approximate metabolic rate using generic parameters.
              </p>
            </div>
          </motion.div>
        )}

        {/* STEP 2: FITNESS GOALS & LIFESTYLE */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Primary Fitness Goal</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FITNESS_GOALS.map((goal) => (
                  <button
                    type="button"
                    key={goal}
                    onClick={() => updateField("fitnessGoal", goal)}
                    className={`py-3 px-4 rounded-xl border text-left text-sm font-medium transition cursor-pointer flex items-center justify-between ${
                      formData.fitnessGoal === goal
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-500 dark:text-emerald-400 font-semibold"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <span>{goal}</span>
                    {formData.fitnessGoal === goal && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Daily Activity Level</label>
              <div className="space-y-2">
                {ACTIVITY_LEVELS.map((act) => (
                  <button
                    type="button"
                    key={act.value}
                    onClick={() => updateField("activityLevel", act.value)}
                    className={`w-full p-4 rounded-xl border text-left transition cursor-pointer flex items-start gap-3 ${
                      formData.activityLevel === act.value
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-500 dark:text-emerald-400"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <div className="mt-1">
                      <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${
                        formData.activityLevel === act.value ? "border-emerald-500 bg-emerald-500" : "border-gray-300 dark:border-gray-600"
                      }`}>
                        {formData.activityLevel === act.value && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-bold">{act.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{act.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Food & Ingredient Budget</label>
              <div className="grid grid-cols-3 gap-2">
                {["Low", "Medium", "High"].map((b) => (
                  <button
                    type="button"
                    key={b}
                    onClick={() => updateField("budget", b)}
                    className={`py-3 px-4 rounded-xl border text-sm font-medium transition cursor-pointer text-center ${
                      formData.budget === b
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-500 dark:text-emerald-400 font-semibold"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {b} Budget
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: WORKOUT ROUTINE */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Primary Workout Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {WORKOUT_TYPES.map((wt) => (
                  <button
                    type="button"
                    key={wt}
                    onClick={() => updateField("workoutType", wt)}
                    className={`py-3 px-3 rounded-xl border text-xs font-semibold transition cursor-pointer text-center ${
                      formData.workoutType === wt
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-500 dark:text-emerald-400"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {wt}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Workout Frequency (Days / Week)</label>
                <input
                  type="number"
                  min="0"
                  max="7"
                  value={formData.workoutDays || ""}
                  onChange={(e) => updateField("workoutDays", parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Workout Duration (Minutes / Session)</label>
                <input
                  type="number"
                  min="10"
                  max="300"
                  value={formData.workoutDuration || ""}
                  onChange={(e) => updateField("workoutDuration", parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Workout Intensity</label>
              <div className="grid grid-cols-3 gap-2">
                {["Low", "Moderate", "High"].map((intensity) => (
                  <button
                    type="button"
                    key={intensity}
                    onClick={() => updateField("workoutIntensity", intensity)}
                    className={`py-3 px-4 rounded-xl border text-sm font-medium transition cursor-pointer text-center ${
                      formData.workoutIntensity === intensity
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-500 dark:text-emerald-400 font-semibold"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {intensity}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 4: NUTRITIONAL STYLE */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Dietary Preference</label>
                <select
                  value={formData.dietaryPreference}
                  onChange={(e) => updateField("dietaryPreference", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none"
                >
                  {DIETARY_PREFERENCES.map((dp) => (
                    <option key={dp} value={dp} className="dark:bg-gray-900">
                      {dp}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Current Water Intake (ml/day)</label>
                <input
                  type="number"
                  min="0"
                  max="10000"
                  value={formData.waterIntake || ""}
                  onChange={(e) => updateField("waterIntake", parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Food Focus & Diet Style (Multi-select)</label>
              <div className="flex flex-wrap gap-2">
                {FOOD_PREFS.map((fp) => {
                  const isSelected = formData.foodPreferences?.includes(fp);
                  return (
                    <button
                      type="button"
                      key={fp}
                      onClick={() => toggleArrayItem("foodPreferences", fp)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                        isSelected
                          ? "bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-500 dark:text-emerald-400"
                          : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {fp}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Allergies & Exclusions</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {ALLERGIES_LIST.map((al) => {
                    const isSelected = formData.allergies?.includes(al);
                    return (
                      <button
                        type="button"
                        key={al}
                        onClick={() => toggleArrayItem("allergies", al)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                          isSelected
                            ? "bg-red-50 border-red-500 text-red-800 dark:bg-red-950/20 dark:border-red-500 dark:text-red-400"
                            : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        {al}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Other allergy..."
                    value={customAllergy}
                    onChange={(e) => setCustomAllergy(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomAllergy}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 rounded-lg text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
                {formData.allergies?.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    Selected: {formData.allergies.join(", ")}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Health Conditions</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {HEALTH_CONDITIONS.map((hc) => {
                    const isSelected = formData.healthConditions?.includes(hc);
                    return (
                      <button
                        type="button"
                        key={hc}
                        onClick={() => toggleArrayItem("healthConditions", hc)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                          isSelected
                            ? "bg-amber-50 border-amber-500 text-amber-800 dark:bg-amber-950/20 dark:border-amber-500 dark:text-amber-400"
                            : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        {hc}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Other health condition..."
                    value={customHealth}
                    onChange={(e) => setCustomHealth(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomHealth}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 rounded-lg text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
                {formData.healthConditions?.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    Selected: {formData.healthConditions.join(", ")}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Current Supplements Taking</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SUPPLEMENTS_LIST.map((sup) => {
                  const isSelected = formData.supplements?.includes(sup);
                  return (
                    <button
                      type="button"
                      key={sup}
                      onClick={() => toggleArrayItem("supplements", sup)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition cursor-pointer text-center ${
                        isSelected
                          ? "bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-500 dark:text-emerald-400"
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {sup}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 5: DAILY SCHEDULE */}
        {step === 5 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Providing accurate timing details allows the AI Nutrition Engine to correctly place and space breakfast, pre-workout energizers, post-workout recovery shakes, and standard meals.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Wake-up Time</label>
                <input
                  type="time"
                  value={formData.schedule.wakeup}
                  onChange={(e) => updateSchedule("wakeup", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Breakfast Time</label>
                <input
                  type="time"
                  value={formData.schedule.breakfast}
                  onChange={(e) => updateSchedule("breakfast", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Lunch Time</label>
                <input
                  type="time"
                  value={formData.schedule.lunch}
                  onChange={(e) => updateSchedule("lunch", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Workout Time</label>
                <input
                  type="time"
                  value={formData.schedule.workout}
                  onChange={(e) => updateSchedule("workout", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Dinner Time</label>
                <input
                  type="time"
                  value={formData.schedule.dinner}
                  onChange={(e) => updateSchedule("dinner", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Sleep Time</label>
                <input
                  type="time"
                  value={formData.schedule.sleep}
                  onChange={(e) => updateSchedule("sleep", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex items-start gap-3 mt-8">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-300">Ready to Calculate!</h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-400 mt-1">
                  Click generate below. The advanced nutrition algorithm will calculate your optimal caloric requirement, design 7 complete meals corresponding to your timeline, and write custom medical and nutrient justifications.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <button
            type="button"
            onClick={step === 1 ? onCancel : prevStep}
            disabled={isGenerating}
            className="px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 1 ? "Cancel" : "Back"}
          </button>

          {step < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 cursor-pointer"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isGenerating}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-white font-bold flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Diet Plan
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
