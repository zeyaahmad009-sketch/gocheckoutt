import React from "react";
import { Sparkles, Activity, Flame, ShieldCheck, Trophy } from "lucide-react";
import { motion } from "motion/react";

interface LandingHeroProps {
  onStart: () => void;
  onViewSaved: () => void;
  hasSavedPlan: boolean;
}

export default function LandingHero({ onStart, onViewSaved, hasSavedPlan }: LandingHeroProps) {
  return (
    <div className="relative overflow-hidden py-16 sm:py-24">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-4xl mx-auto text-center px-4">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 text-xs font-semibold tracking-wide uppercase border border-emerald-200 dark:border-emerald-900/30 mb-8"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Advanced AI Nutrition Engine
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight"
        >
          Personalized Diet Plans for Your <span className="bg-gradient-to-r from-emerald-600 to-cyan-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-cyan-400">Fitness Goals</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Get an AI-generated meal plan designed specifically for your body, workout routine, and lifestyle.
        </motion.p>

        {/* Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            id="cta-start-assessment"
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition duration-200 flex items-center justify-center gap-2 cursor-pointer dark:bg-emerald-500 dark:hover:bg-emerald-400 text-base"
          >
            <Activity className="w-5 h-5" />
            Create My Diet Plan
          </button>

          {hasSavedPlan && (
            <button
              id="cta-view-saved"
              onClick={onViewSaved}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition duration-200 flex items-center justify-center gap-2 cursor-pointer text-base"
            >
              View My Existing Plan
            </button>
          )}
        </motion.div>

        {/* Trust Metrics / Bento Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200/50 dark:border-gray-700/40 text-left"
        >
          <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50">
            <div className="p-2 w-fit rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mb-3">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Tailored Calories</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Calculated precisely for your body mass & deficit/surplus needs.</p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50">
            <div className="p-2 w-fit rounded-lg bg-cyan-100 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 mb-3">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Workout Aligned</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Meal timing optimized around gym, yoga, sports or cardios.</p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50">
            <div className="p-2 w-fit rounded-lg bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Diet Tolerances</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Respects vegan, lactose, gluten, thyroid, diabetes and preferences.</p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50">
            <div className="p-2 w-fit rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 mb-3">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Progress Tracker</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Log water, custom meals, body logs & weekly check-in graphs.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
