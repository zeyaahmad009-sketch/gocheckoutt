import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini client on the server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.use(express.json());

// API route: Generate personalized diet plan
app.post("/api/generate-plan", async (req, res) => {
  try {
    const assessment = req.body;
    if (!assessment) {
      return res.status(400).json({ error: "Assessment data is required" });
    }

    const {
      name, age, gender, height, weight, bodyFat,
      fitnessGoal, activityLevel, workoutType,
      workoutDays, workoutDuration, workoutIntensity,
      dietaryPreference, foodPreferences, allergies,
      healthConditions, schedule, budget, supplements,
      waterIntake
    } = assessment;

    const userProfilePrompt = `
      Create a highly personalized, complete diet plan for the following user profile:
      - Name: ${name || "User"}
      - Age: ${age} years old
      - Gender: ${gender}
      - Height: ${height} cm
      - Weight: ${weight} kg
      - Body Fat %: ${bodyFat || "Not provided"}
      - Fitness Goal: ${fitnessGoal}
      - Activity Level: ${activityLevel}
      
      Workout Routine:
      - Type: ${workoutType || "None"}
      - Frequency: ${workoutDays} days/week
      - Duration: ${workoutDuration} minutes/session
      - Intensity: ${workoutIntensity || "Moderate"}
      
      Dietary Profile:
      - Dietary Preference: ${dietaryPreference}
      - Food Focus: ${foodPreferences ? foodPreferences.join(", ") : "Balanced"}
      - Allergies & Restrictions: ${allergies ? allergies.join(", ") : "None"}
      - Health Conditions: ${healthConditions ? healthConditions.join(", ") : "None"}
      - Current daily water intake: ${waterIntake || "Not provided"} ml
      
      Lifestyle Details:
      - Daily Schedule:
        * Wake-up: ${schedule?.wakeup || "07:00"}
        * Breakfast: ${schedule?.breakfast || "08:00"}
        * Lunch: ${schedule?.lunch || "13:00"}
        * Dinner: ${schedule?.dinner || "20:00"}
        * Workout: ${schedule?.workout || "18:00"}
        * Sleep: ${schedule?.sleep || "23:00"}
      - Budget: ${budget} (Tailor food options to this budget category)
      - Supplements currently taking: ${supplements ? supplements.join(", ") : "None"}
    `;

    const systemInstruction = `
      You are an elite sports dietitian and professional clinical nutritionist.
      Your goal is to calculate the precise daily calorie and macronutrient requirements for the user based on their physical profile, fitness goals, and activity level.
      You must design a detailed meal plan matching their dietary preferences, allergies, health conditions, budget, and daily schedule.
      You will also provide a comprehensive grocery list, custom hydration plan, supplement suggestions, and valuable nutrition insights.
      Ensure the plan is realistic, appetizing, and fits their daily timing perfectly.
      Make sure to provide alternatives for Tuesday, Wednesday, Thursday, Friday, Saturday, and Sunday in the weeklyRotation field so they don't get bored of eating the same things.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userProfilePrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dailyCalories: { type: Type.INTEGER, description: "Daily calorie target, e.g., 2350" },
            macros: {
              type: Type.OBJECT,
              properties: {
                protein: { type: Type.INTEGER, description: "Protein target in grams" },
                carbs: { type: Type.INTEGER, description: "Carbohydrate target in grams" },
                fats: { type: Type.INTEGER, description: "Fat target in grams" },
                fiber: { type: Type.INTEGER, description: "Fiber target in grams" }
              },
              required: ["protein", "carbs", "fats", "fiber"]
            },
            mealPlan: {
              type: Type.OBJECT,
              properties: {
                breakfast: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: "Food item name" },
                      quantity: { type: Type.STRING, description: "e.g., 3 large eggs, 50g oats" },
                      calories: { type: Type.INTEGER },
                      protein: { type: Type.INTEGER },
                      carbs: { type: Type.INTEGER },
                      fats: { type: Type.INTEGER }
                    },
                    required: ["name", "quantity", "calories"]
                  }
                },
                morningSnack: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      quantity: { type: Type.STRING },
                      calories: { type: Type.INTEGER },
                      protein: { type: Type.INTEGER },
                      carbs: { type: Type.INTEGER },
                      fats: { type: Type.INTEGER }
                    },
                    required: ["name", "quantity", "calories"]
                  }
                },
                lunch: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      quantity: { type: Type.STRING },
                      calories: { type: Type.INTEGER },
                      protein: { type: Type.INTEGER },
                      carbs: { type: Type.INTEGER },
                      fats: { type: Type.INTEGER }
                    },
                    required: ["name", "quantity", "calories"]
                  }
                },
                preWorkoutMeal: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      quantity: { type: Type.STRING },
                      calories: { type: Type.INTEGER },
                      protein: { type: Type.INTEGER },
                      carbs: { type: Type.INTEGER },
                      fats: { type: Type.INTEGER }
                    },
                    required: ["name", "quantity", "calories"]
                  }
                },
                postWorkoutMeal: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      quantity: { type: Type.STRING },
                      calories: { type: Type.INTEGER },
                      protein: { type: Type.INTEGER },
                      carbs: { type: Type.INTEGER },
                      fats: { type: Type.INTEGER }
                    },
                    required: ["name", "quantity", "calories"]
                  }
                },
                dinner: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      quantity: { type: Type.STRING },
                      calories: { type: Type.INTEGER },
                      protein: { type: Type.INTEGER },
                      carbs: { type: Type.INTEGER },
                      fats: { type: Type.INTEGER }
                    },
                    required: ["name", "quantity", "calories"]
                  }
                },
                eveningSnack: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      quantity: { type: Type.STRING },
                      calories: { type: Type.INTEGER },
                      protein: { type: Type.INTEGER },
                      carbs: { type: Type.INTEGER },
                      fats: { type: Type.INTEGER }
                    },
                    required: ["name", "quantity", "calories"]
                  }
                }
              },
              required: ["breakfast", "lunch", "dinner"]
            },
            weeklyRotation: {
              type: Type.ARRAY,
              description: "Alternative meals for other days of the week to ensure rotation variety.",
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING, description: "e.g., Tuesday, Wednesday" },
                  meals: {
                    type: Type.OBJECT,
                    properties: {
                      breakfast: { type: Type.STRING },
                      lunch: { type: Type.STRING },
                      dinner: { type: Type.STRING },
                      snacks: { type: Type.STRING }
                    },
                    required: ["breakfast", "lunch", "dinner"]
                  }
                },
                required: ["day", "meals"]
              }
            },
            groceryList: {
              type: Type.OBJECT,
              properties: {
                proteins: { type: Type.ARRAY, items: { type: Type.STRING } },
                fruits: { type: Type.ARRAY, items: { type: Type.STRING } },
                vegetables: { type: Type.ARRAY, items: { type: Type.STRING } },
                dairy: { type: Type.ARRAY, items: { type: Type.STRING } },
                grains: { type: Type.ARRAY, items: { type: Type.STRING } },
                healthyFats: { type: Type.ARRAY, items: { type: Type.STRING } },
                snacks: { type: Type.ARRAY, items: { type: Type.STRING } },
                supplements: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["proteins", "fruits", "vegetables", "dairy", "grains", "healthyFats"]
            },
            hydrationPlan: {
              type: Type.OBJECT,
              properties: {
                recommendedDailyLiters: { type: Type.NUMBER, description: "Recommended daily water in liters" },
                tips: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["recommendedDailyLiters", "tips"]
            },
            supplements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  timing: { type: Type.STRING, description: "e.g., with Breakfast, Pre-workout" },
                  reason: { type: Type.STRING, description: "Brief scientific explanation of benefits for their goal" }
                },
                required: ["name", "timing", "reason"]
              }
            },
            insights: {
              type: Type.OBJECT,
              properties: {
                calorieJustification: { type: Type.STRING },
                macroJustification: { type: Type.STRING },
                foodsToPrioritize: { type: Type.ARRAY, items: { type: Type.STRING } },
                foodsToLimit: { type: Type.ARRAY, items: { type: Type.STRING } },
                recoveryTips: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["calorieJustification", "macroJustification", "foodsToPrioritize", "foodsToLimit", "recoveryTips"]
            }
          },
          required: [
            "dailyCalories", "macros", "mealPlan", "weeklyRotation",
            "groceryList", "hydrationPlan", "supplements", "insights"
          ]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response text received from Gemini");
    }

    const plan = JSON.parse(resultText);
    res.json(plan);
  } catch (error: any) {
    console.error("Error generating diet plan:", error);
    res.status(500).json({ error: error.message || "Failed to generate plan" });
  }
});

// API route: AI chat assistant for nutrition and food substitutions
app.post("/api/chat-nutrition", async (req, res) => {
  try {
    const { messages, userProfile, activePlan } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const lastMessage = messages[messages.length - 1].content;

    // Create system instruction and context
    let contextPrompt = "You are a professional nutrition AI assistant. Help the user with their nutrition, meal, dietary preference questions.";
    if (userProfile) {
      contextPrompt += `\nUser Profile:\nGoal: ${userProfile.fitnessGoal}\nPreference: ${userProfile.dietaryPreference}\nWeight: ${userProfile.weight}kg, Height: ${userProfile.height}cm`;
    }
    if (activePlan) {
      contextPrompt += `\nActive Diet Plan:\nCalories: ${activePlan.dailyCalories} kcal\nMacros: P:${activePlan.macros?.protein}g, C:${activePlan.macros?.carbs}g, F:${activePlan.macros?.fats}g\n`;
    }

    contextPrompt += `\nGuidelines:
    - Provide precise, actionable, and scientific nutrition advice.
    - If the user asks for substitutions (e.g. replacing chicken or dairy), provide healthy, matching-macro substitutions.
    - Be supportive, motivational, and safe. Recommend consulting a physician for medical conditions.
    - Keep answers moderately concise and perfectly formatted with markdown bullet points.`;

    // Construct contents for conversation history
    const geminiMessages = messages.map((m: any) => ({
      role: m.role === "user" ? "user" as const : "model" as const,
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: geminiMessages,
      config: {
        systemInstruction: contextPrompt,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in chat assistant:", error);
    res.status(500).json({ error: error.message || "Failed to complete chat response" });
  }
});

// Start Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
