export interface Schedule {
  wakeup: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  workout: string;
  sleep: string;
}

export interface UserAssessment {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  bodyFat?: number;
  fitnessGoal: string;
  activityLevel: string;
  workoutType: string;
  workoutDays: number;
  workoutDuration: number;
  workoutIntensity: string;
  dietaryPreference: string;
  foodPreferences: string[];
  allergies: string[];
  healthConditions: string[];
  schedule: Schedule;
  budget: string;
  waterIntake: number;
  supplements: string[];
}

export interface MealItem {
  name: string;
  quantity: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fats?: number;
}

export interface MealPlan {
  breakfast: MealItem[];
  morningSnack?: MealItem[];
  lunch: MealItem[];
  preWorkoutMeal?: MealItem[];
  postWorkoutMeal?: MealItem[];
  dinner: MealItem[];
  eveningSnack?: MealItem[];
}

export interface WeeklyRotationDay {
  day: string;
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks?: string;
  };
}

export interface GroceryList {
  proteins: string[];
  fruits: string[];
  vegetables: string[];
  dairy: string[];
  grains: string[];
  healthyFats: string[];
  snacks?: string[];
  supplements?: string[];
}

export interface HydrationPlan {
  recommendedDailyLiters: number;
  tips: string[];
}

export interface SupplementRec {
  name: string;
  timing: string;
  reason: string;
}

export interface NutritionInsights {
  calorieJustification: string;
  macroJustification: string;
  foodsToPrioritize: string[];
  foodsToLimit: string[];
  recoveryTips: string[];
}

export interface DietPlan {
  id?: string;
  createdAt?: string;
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
  mealPlan: MealPlan;
  weeklyRotation: WeeklyRotationDay[];
  groceryList: GroceryList;
  hydrationPlan: HydrationPlan;
  supplements: SupplementRec[];
  insights: NutritionInsights;
}

// Progress Dashboard Types
export interface WeightLog {
  id: string;
  date: string;
  weight: number;
}

export interface MeasurementLog {
  id: string;
  date: string;
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  thighs?: number;
}

export interface FoodLog {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface WaterLog {
  id: string;
  date: string; // YYYY-MM-DD
  amountMl: number;
}

export interface WorkoutLog {
  id: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  notes?: string;
}

export interface ProgressPhoto {
  id: string;
  date: string;
  url: string; // Base64 data or mock image url
  note?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
