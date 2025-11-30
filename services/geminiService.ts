import { GoogleGenAI } from "@google/genai";
import { Log, UserSettings } from "../types";

// Initialize Gemini Client
// IMPORTANT: In a real production app, ensure this key is not exposed to the client bundle publicly
// without restrictions. For this demo, we assume process.env.API_KEY is available.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const analyzeHabits = async (logs: Log[], settings: UserSettings): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure your environment variables.";
  }

  // Filter logs to last 30 days for relevance
  const now = Date.now();
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
  const recentLogs = logs.filter(l => l.timestamp > thirtyDaysAgo);

  if (recentLogs.length === 0) {
    return "Not enough data to analyze. Track some usage first!";
  }

  // Prepare data summary for the model
  const totalPouches = recentLogs.length;
  const totalNicotine = recentLogs.reduce((acc, curr) => acc + curr.nicotineAmount, 0);
  
  // Group by hour to find peak times
  const hourCounts: Record<number, number> = {};
  recentLogs.forEach(log => {
    const hour = new Date(log.timestamp).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  
  const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "unknown";

  const prompt = `
    Analyze the following nicotine consumption data for a user tracking their "snus" (pouch) usage.
    
    User Settings:
    - Daily Goal: ${settings.dailyGoal} pouches
    - Standard Nicotine per pouch: ${settings.nicotinePerPouch}mg

    Recent Data (Last 30 Days):
    - Total Pouches Consumed: ${totalPouches}
    - Total Nicotine Consumed: ${totalNicotine.toFixed(1)}mg
    - Peak Consumption Hour (0-23): ${peakHour}:00
    - Average Daily Consumption: ${(totalPouches / 30).toFixed(1)} pouches

    Task:
    Provide a concise, friendly, and motivational analysis. 
    1. Identify if they are meeting their goal.
    2. Point out their peak consumption time and suggest a distraction strategy.
    3. Calculate roughly how much money they might save if they cut down by 20% (Assume cost is ${settings.currencySymbol}${settings.costPerUnit} per pouch).
    
    Keep the tone supportive but factual. Keep it under 150 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Could not generate analysis at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't connect to the AI coach right now. Please check your internet connection.";
  }
};