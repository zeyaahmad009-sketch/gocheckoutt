import React, { useState, useEffect } from "react";
import {
  UserAssessment,
  DietPlan,
  WeightLog,
  MeasurementLog,
  FoodLog,
  WaterLog,
  WorkoutLog,
  ProgressPhoto,
  ChatMessage
} from "./types";
import LandingHero from "./components/LandingHero";
import AssessmentForm from "./components/AssessmentForm";
import DietPlanDashboard from "./components/DietPlanDashboard";
import ProgressTracker from "./components/ProgressTracker";
import NutritionChat from "./components/NutritionChat";
import {
  Apple,
  Moon,
  Sun,
  Dumbbell,
  MessageSquare,
  Sparkles,
  Award,
  ChevronRight,
  TrendingUp,
  LineChart,
  User,
  Heart,
  RefreshCw,
  Info
} from "lucide-react";
import { motion } from "motion/react";

export default function App() {
  // Theme State
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Navigation / Screen State
  const [currentScreen, setCurrentScreen] = useState<"landing" | "assessment" | "dashboard" | "tracker" | "chat">("landing");

  // Core Nutrition State
  const [userAssessment, setUserAssessment] = useState<UserAssessment | null>(null);
  const [activePlan, setActivePlan] = useState<DietPlan | null>(null);

  // Tracking State logs
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [measurementLogs, setMeasurementLogs] = useState<MeasurementLog[]>([]);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>([]);

  // Conversational Assistant Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatSending, setIsChatSending] = useState(false);

  // UX Generation States
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Apply Theme on load and change
  useEffect(() => {
    // Default to dark theme for premium fitness vibe
    const savedTheme = localStorage.getItem("app-theme") || "dark";
    setTheme(savedTheme as "light" | "dark");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("app-theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // LocalStorage state hydration on initial render
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem("user-profile");
      if (storedProfile) setUserAssessment(JSON.parse(storedProfile));

      const storedPlan = localStorage.getItem("active-plan");
      if (storedPlan) {
        const parsed = JSON.parse(storedPlan);
        setActivePlan(parsed);
        setCurrentScreen("dashboard");
      }

      const storedWeight = localStorage.getItem("logs-weight");
      if (storedWeight) setWeightLogs(JSON.parse(storedWeight));

      const storedMeasure = localStorage.getItem("logs-measurements");
      if (storedMeasure) setMeasurementLogs(JSON.parse(storedMeasure));

      const storedFood = localStorage.getItem("logs-food");
      if (storedFood) setFoodLogs(JSON.parse(storedFood));

      const storedWater = localStorage.getItem("logs-water");
      if (storedWater) setWaterLogs(JSON.parse(storedWater));

      const storedWorkout = localStorage.getItem("logs-workout");
      if (storedWorkout) setWorkoutLogs(JSON.parse(storedWorkout));

      const storedPhotos = localStorage.getItem("logs-photos");
      if (storedPhotos) setProgressPhotos(JSON.parse(storedPhotos));

      const storedChat = localStorage.getItem("logs-chat");
      if (storedChat) setChatMessages(JSON.parse(storedChat));
    } catch (e) {
      console.error("Failed to parse localStorage logs state", e);
    }
  }, []);

  // Sync state mutations back to LocalStorage
  useEffect(() => {
    if (userAssessment) localStorage.setItem("user-profile", JSON.stringify(userAssessment));
  }, [userAssessment]);

  useEffect(() => {
    if (activePlan) {
      localStorage.setItem("active-plan", JSON.stringify(activePlan));
    } else {
      localStorage.removeItem("active-plan");
    }
  }, [activePlan]);

  useEffect(() => {
    localStorage.setItem("logs-weight", JSON.stringify(weightLogs));
  }, [weightLogs]);

  useEffect(() => {
    localStorage.setItem("logs-measurements", JSON.stringify(measurementLogs));
  }, [measurementLogs]);

  useEffect(() => {
    localStorage.setItem("logs-food", JSON.stringify(foodLogs));
  }, [foodLogs]);

  useEffect(() => {
    localStorage.setItem("logs-water", JSON.stringify(waterLogs));
  }, [waterLogs]);

  useEffect(() => {
    localStorage.setItem("logs-workout", JSON.stringify(workoutLogs));
  }, [workoutLogs]);

  useEffect(() => {
    localStorage.setItem("logs-photos", JSON.stringify(progressPhotos));
  }, [progressPhotos]);

  useEffect(() => {
    localStorage.setItem("logs-chat", JSON.stringify(chatMessages));
  }, [chatMessages]);

  // AI Diet Generation Action Handlers
  const handleGenerateDietPlan = async (assessment: UserAssessment) => {
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assessment)
      });

      if (!response.ok) {
        throw new Error("Generation endpoint failed. Please try again.");
      }

      const planData = await response.json();
      
      // Auto-populate weight logs on first generation if not already logged
      const hasLoggedTodayWeight = weightLogs.some((l) => l.date === new Date().toISOString().split("T")[0]);
      if (!hasLoggedTodayWeight) {
        const initWeightLog: WeightLog = {
          id: Math.random().toString(36).substring(7),
          date: new Date().toISOString().split("T")[0],
          weight: assessment.weight
        };
        setWeightLogs((prev) => [...prev, initWeightLog]);
      }

      setUserAssessment(assessment);
      setActivePlan(planData);
      setCurrentScreen("dashboard");
    } catch (err: any) {
      console.error("Generation error:", err);
      setErrorMessage(err.message || "Failed to contact Diet Generation Engine. Check server logs.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDietPlan = () => {
    // Since our client persists it to LocalStorage in useEffect, saving is automatic.
    // Display an instant motivational notification toast or feedback.
    alert("Plan successfully saved to your offline local profile!");
  };

  const handleResetAssessment = () => {
    if (confirm("Are you sure you want to delete your current plan and physical assessment profiles? This will not erase historical weight tracking progress.")) {
      setActivePlan(null);
      setUserAssessment(null);
      localStorage.removeItem("active-plan");
      localStorage.removeItem("user-profile");
      setFoodLogs([]);
      setCurrentScreen("landing");
    }
  };

  // Logging Metric mutators passed down to components
  const handleAddWeightLog = (weight: number, date: string) => {
    const newLog: WeightLog = {
      id: Math.random().toString(36).substring(7),
      date,
      weight
    };
    setWeightLogs((prev) => [...prev, newLog]);
  };

  const handleDeleteWeightLog = (id: string) => {
    setWeightLogs((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddMeasurementLog = (measurements: Partial<MeasurementLog>, date: string) => {
    const newLog: MeasurementLog = {
      id: Math.random().toString(36).substring(7),
      date,
      ...measurements
    };
    setMeasurementLogs((prev) => [...prev, newLog]);
  };

  const handleDeleteMeasurementLog = (id: string) => {
    setMeasurementLogs((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddFoodLog = (name: string, calories: number, protein: number, carbs: number, fats: number, date: string) => {
    const newLog: FoodLog = {
      id: Math.random().toString(36).substring(7),
      date,
      name,
      calories,
      protein,
      carbs,
      fats
    };
    setFoodLogs((prev) => [...prev, newLog]);
  };

  const handleDeleteFoodLog = (id: string) => {
    setFoodLogs((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddWaterLog = (amountMl: number, date: string) => {
    const newLog: WaterLog = {
      id: Math.random().toString(36).substring(7),
      date,
      amountMl
    };
    setWaterLogs((prev) => [...prev, newLog]);
  };

  const handleClearWaterLogs = (date: string) => {
    setWaterLogs((prev) => prev.filter((item) => item.date !== date));
  };

  const handleToggleWorkoutLog = (date: string) => {
    setWorkoutLogs((prev) => {
      const exists = prev.find((item) => item.date === date);
      if (exists) {
        return prev.map((item) => (item.date === date ? { ...item, completed: !item.completed } : item));
      } else {
        return [...prev, { id: Math.random().toString(36).substring(7), date, completed: true }];
      }
    });
  };

  const handleAddProgressPhoto = (url: string, note: string, date: string) => {
    const newPhoto: ProgressPhoto = {
      id: Math.random().toString(36).substring(7),
      date,
      url,
      note
    };
    setProgressPhotos((prev) => [...prev, newPhoto]);
  };

  const handleDeleteProgressPhoto = (id: string) => {
    setProgressPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  // AI Chat Assistance Messaging
  const handleSendChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setIsChatSending(true);

    try {
      const response = await fetch("/api/chat-nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          userProfile: userAssessment,
          activePlan
        })
      });

      if (!response.ok) {
        throw new Error("Chat assistant was offline or timed out. Please try again.");
      }

      const chatData = await response.json();
      const assistantMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: chatData.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("Chat message error:", err);
      const errMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: `Sorry, there was a problem getting response from the AI Nutritionist: ${err.message}. Please verify your connection.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setChatMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsChatSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 text-gray-800 dark:text-gray-100 font-sans">
      {/* Premium Fitness Branding Nav Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-150 dark:border-gray-900/60 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <button
            onClick={() => setCurrentScreen(activePlan ? "dashboard" : "landing")}
            className="flex items-center gap-2 cursor-pointer text-left group"
          >
            <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-500 text-white font-bold transition group-hover:scale-105">
              <Apple className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-base tracking-tight text-gray-950 dark:text-white block leading-tight">AI Nutritionist</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Diet & Metric Coach</span>
            </div>
          </button>

          {/* Active Navigation Tabs */}
          {activePlan && (
            <nav className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-gray-900/60 p-1 rounded-xl">
              <button
                onClick={() => setCurrentScreen("dashboard")}
                className={`px-4 py-2 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                  currentScreen === "dashboard"
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                📊 Diet Plan Dashboard
              </button>
              <button
                onClick={() => setCurrentScreen("tracker")}
                className={`px-4 py-2 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                  currentScreen === "tracker"
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                📈 Progress Loggers
              </button>
              <button
                onClick={() => setCurrentScreen("chat")}
                className={`px-4 py-2 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                  currentScreen === "chat"
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                💬 Ask Assistant
              </button>
            </nav>
          )}

          {/* Right Header Side: Theme, Assessment Trigger */}
          <div className="flex items-center gap-2.5">
            <button
              id="theme-toggle"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-gray-150 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-850 text-gray-600 dark:text-gray-300 transition cursor-pointer shadow-sm"
            >
              {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {userAssessment && (
              <div className="hidden sm:flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-150 dark:border-gray-800 pl-3 pr-2.5 py-1.5 rounded-xl text-xs font-bold">
                <div className="text-right">
                  <span className="text-[9px] text-gray-400 uppercase font-black block leading-none">TARGET WEIGHT</span>
                  <span className="text-gray-900 dark:text-white block mt-0.5">{userAssessment.weight} kg</span>
                </div>
                <div className="w-px h-6 bg-gray-200 dark:bg-gray-850" />
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 rounded-full font-extrabold tracking-wide uppercase text-[9px]">
                  {userAssessment.fitnessGoal}
                </span>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Mobile-only Persistent Sub-navigation Drawer */}
      {activePlan && (
        <div className="md:hidden sticky top-[64px] z-40 bg-white dark:bg-gray-950 border-b border-gray-150 dark:border-gray-900 p-2 flex gap-1 justify-center">
          <button
            onClick={() => setCurrentScreen("dashboard")}
            className={`flex-1 py-2 text-center rounded-xl text-[10px] font-black uppercase tracking-wider transition cursor-pointer ${
              currentScreen === "dashboard"
                ? "bg-emerald-500 text-white font-black"
                : "bg-gray-100 dark:bg-gray-900 text-gray-500"
            }`}
          >
            📊 Diet Plan
          </button>
          <button
            onClick={() => setCurrentScreen("tracker")}
            className={`flex-1 py-2 text-center rounded-xl text-[10px] font-black uppercase tracking-wider transition cursor-pointer ${
              currentScreen === "tracker"
                ? "bg-emerald-500 text-white font-black"
                : "bg-gray-100 dark:bg-gray-900 text-gray-500"
            }`}
          >
            📈 Loggers
          </button>
          <button
            onClick={() => setCurrentScreen("chat")}
            className={`flex-1 py-2 text-center rounded-xl text-[10px] font-black uppercase tracking-wider transition cursor-pointer ${
              currentScreen === "chat"
                ? "bg-emerald-500 text-white font-black"
                : "bg-gray-100 dark:bg-gray-900 text-gray-500"
            }`}
          >
            💬 Assistant
          </button>
        </div>
      )}

      {/* Main Body Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Error message Banner */}
        {errorMessage && (
          <div className="p-4 mb-6 rounded-2xl bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/20 text-sm text-red-900 dark:text-red-400 font-medium flex items-start gap-2.5 max-w-3xl mx-auto">
            <Info className="w-5 h-5 shrink-0" />
            <div>
              <h4 className="font-bold mb-0.5">Diet Plan Generation Failed</h4>
              <p className="text-xs leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Dynamic Display Switching */}
        <div className="w-full">
          {currentScreen === "landing" && (
            <LandingHero
              onStart={() => setCurrentScreen("assessment")}
              onViewSaved={() => setCurrentScreen("dashboard")}
              hasSavedPlan={activePlan !== null}
            />
          )}

          {currentScreen === "assessment" && (
            <AssessmentForm
              onSubmit={handleGenerateDietPlan}
              onCancel={() => setCurrentScreen(activePlan ? "dashboard" : "landing")}
              isGenerating={isGenerating}
            />
          )}

          {currentScreen === "dashboard" && activePlan && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DietPlanDashboard
                plan={activePlan}
                userAssessment={userAssessment || undefined}
                onSavePlan={handleSaveDietPlan}
                onLogMeal={(name, cal, prot, carb, fat) => handleAddFoodLog(name, cal, prot, carb, fat, new Date().toISOString().split("T")[0])}
                onReset={handleResetAssessment}
                foodLogs={foodLogs}
                waterLogs={waterLogs}
                weightLogs={weightLogs}
                workoutLogs={workoutLogs}
                onAddWaterLog={handleAddWaterLog}
                onToggleWorkoutLog={handleToggleWorkoutLog}
              />
            </motion.div>
          )}

          {currentScreen === "tracker" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ProgressTracker
                activePlan={activePlan}
                weightLogs={weightLogs}
                onAddWeightLog={handleAddWeightLog}
                onDeleteWeightLog={handleDeleteWeightLog}
                measurementLogs={measurementLogs}
                onAddMeasurementLog={handleAddMeasurementLog}
                onDeleteMeasurementLog={handleDeleteMeasurementLog}
                foodLogs={foodLogs}
                onAddFoodLog={handleAddFoodLog}
                onDeleteFoodLog={handleDeleteFoodLog}
                waterLogs={waterLogs}
                onAddWaterLog={handleAddWaterLog}
                onClearWaterLogs={handleClearWaterLogs}
                workoutLogs={workoutLogs}
                onToggleWorkoutLog={handleToggleWorkoutLog}
                progressPhotos={progressPhotos}
                onAddProgressPhoto={handleAddProgressPhoto}
                onDeleteProgressPhoto={handleDeleteProgressPhoto}
              />
            </motion.div>
          )}

          {currentScreen === "chat" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <NutritionChat
                userAssessment={userAssessment}
                activePlan={activePlan}
                chatMessages={chatMessages}
                onSendMessage={handleSendChatMessage}
                isSending={isChatSending}
                onClearChat={() => setChatMessages([])}
              />
            </motion.div>
          )}
        </div>
      </main>

      {/* Decorative Brand Footer */}
      <footer className="border-t border-gray-150 dark:border-gray-900 mt-20 py-8 bg-white dark:bg-gray-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-1 text-xs text-gray-500 font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
            AI Professional Diet Plan Generator
          </div>
          <p className="text-[10px] text-gray-400">
            Powered by Gemini AI model. Always consult a certified dietitian or physician before embarking on a rigorous calorie deficit or specific fitness program.
          </p>
        </div>
      </footer>

    </div>
  );
}
