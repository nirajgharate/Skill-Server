import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import Worker from "../models/Worker.js";
import Booking from "../models/booking.model.js";
import Service from "../models/service.model.js";
import User from "../models/User.js";
import { vectorStore } from "../utils/vectorStore.js";

// In-memory conversation state store mapped by userId
const sessionStore = new Map();

/**
 * State Structure:
 * {
 *   step: "diagnose" | "select_worker" | "collect_slot" | "payment" | "completed",
 *   history: Array<{role: string, content: string}>,
 *   diagnosedProblem: string,
 *   selectedCategory: string,
 *   selectedWorker: object,
 *   bookingDate: string,
 *   bookingTime: string,
 *   extraTools: string,
 *   upiId: string,
 *   address: string
 * }
 */

// Helper to get or initialize session
export function getOrCreateSession(userId) {
  if (!sessionStore.has(userId)) {
    sessionStore.set(userId, {
      step: "diagnose",
      history: [],
      diagnosedProblem: "",
      selectedCategory: "",
      selectedWorker: null,
      bookingDate: "",
      bookingTime: "",
      extraTools: "",
      upiId: "",
      address: "",
    });
  }
  return sessionStore.get(userId);
}

// Reset session
export function resetSession(userId) {
  sessionStore.delete(userId);
  return getOrCreateSession(userId);
}

// Generate unified embeddings/chunks index for workers
export async function syncWorkerIndex() {
  try {
    const workers = await Worker.find({});
    vectorStore.clear();

    const docs = workers.map((w) => {
      const text = `Worker Name: ${w.name}. Profession: ${w.profession}. Skills: ${w.skills.join(", ")}. Experience: ${w.experienceYears} years. Rating: ${w.rating}. Address: ${w.serviceArea}. Bio: ${w.bio}`;
      return {
        id: w._id.toString(),
        text,
        metadata: {
          id: w._id.toString(),
          name: w.name,
          profession: w.profession,
          rating: w.rating,
          phone: w.phone,
          location: w.location,
          hourlyRate: w.hourlyRate || 399,
        },
      };
    });

    await vectorStore.addDocuments(docs);
    console.log(`Synced ${docs.length} workers to RAG Index.`);
    return docs.length;
  } catch (err) {
    console.error("Failed to sync worker index:", err);
    return 0;
  }
}

// Fail-safe wrapper to invoke LLM (Gemini with Groq fallback)
async function callLLM(systemPrompt, userPrompt, history = []) {
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map((h) => ({ role: h.role === "user" ? "user" : "assistant", content: h.content })),
    { role: "user", content: userPrompt },
  ];

  // Try Gemini
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" },
      });

      // Format history in Gemini style
      const chatHistory = history.map((h) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.content }],
      }));

      const chat = model.startChat({
        history: chatHistory,
        systemInstruction: systemPrompt,
      });

      const response = await chat.sendMessage(userPrompt);
      const text = response.response.text();
      return JSON.parse(text);
    } catch (err) {
      console.warn("Gemini execution failed, falling back to Groq:", err.message);
    }
  }

  // Try Groq fallback
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    try {
      const groq = new Groq({ apiKey: groqKey });
      const completion = await groq.chat.completions.create({
        messages: messages.map((m) => ({
          role: m.role,
          content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
        })),
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
      });
      const text = completion.choices[0]?.message?.content;
      return JSON.parse(text);
    } catch (err) {
      console.warn("Groq execution failed:", err.message);
    }
  }

  // Fallback Rule-Based Output if no API keys are available
  return generateOfflineFallback(userPrompt, systemPrompt);
}

// Fallback rule-based JSON response builder
function generateOfflineFallback(userPrompt, systemPrompt) {
  const queryClean = userPrompt.toLowerCase();
  let text = "My satellite uplink is slightly desynchronized, Sir. However, I am active and ready. Could you kindly describe the specific home issue you are facing so I can coordinate repairs?";
  let extractedCategory = "";

  if (queryClean.includes("electr") || queryClean.includes("wire") || queryClean.includes("power") || queryClean.includes("fan") || queryClean.includes("light")) {
    text = "Ah, electrical anomalies detected, Sir. I highly advise letting a certified electrician handle this to prevent any hazards. Shall I schedule our top rated technician for you?";
    extractedCategory = "electrician";
  } else if (queryClean.includes("pipe") || queryClean.includes("leak") || queryClean.includes("plumb") || queryClean.includes("basin") || queryClean.includes("tap")) {
    text = "Plumbing complications, Sir. Water leakages can be quite troublesome. Let me dispatch a vetted plumber immediately to secure your lines.";
    extractedCategory = "plumber";
  } else if (queryClean.includes("clean") || queryClean.includes("dust") || queryClean.includes("wash")) {
    text = "Dust and debris detected, Sir. A clean environment brings peace of mind. I'll arrange our deep cleaning crew to restore order to your quarters.";
    extractedCategory = "cleaner";
  } else if (queryClean.includes("wood") || queryClean.includes("door") || queryClean.includes("table") || queryClean.includes("furniture")) {
    text = "Woodwork issues, Sir. A carpenter will restore the structure of your furniture and doors in no time. Let me match you with our expert.";
    extractedCategory = "carpenter";
  }

  return {
    reply: text,
    extractedCategory,
    diagnosedProblem: "Local diagnostics: " + userPrompt,
    selectedWorkerId: null,
    bookingDetails: null,
  };
}

/**
 * Main chat handler implementing conversational agent states.
 */
export async function processAgentMessage(userId, userMessage) {
  const session = getOrCreateSession(userId);

  // Sync index on first message if empty
  if (vectorStore.documents.length === 0) {
    await syncWorkerIndex();
  }

  // Retrieve RAG context if applicable
  let ragContext = "";
  if (session.step === "diagnose" || session.step === "select_worker") {
    const searchResults = await vectorStore.similaritySearch(userMessage, 4);
    if (searchResults.length > 0) {
      ragContext = "\n[RAG Context: Nearest Verified Workers Available]\n" +
        searchResults.map((r, i) => `${i+1}. ${r.text}`).join("\n");
    }
  }

  const systemPrompt = `You are JARVIS, a loyal, highly intelligent, and witty AI butler (similar to Tony Stark's assistant). Your tone is extremely respectful, warm, and soulful. You must refer to the user as "Sir" or "Ma'am". Always output helpful advice, diagnose their problem logically, and coordinate booking details with absolute precision.
Current State Step: "${session.step}"
User Stored Profile location context: Delhi.

Your response MUST be a JSON object with this exact structure:
{
  "reply": "Jarvis-style soulful message text explaining next steps, advice, or answers",
  "nextStep": "diagnose" | "select_worker" | "collect_slot" | "payment" | "completed",
  "diagnosedProblem": "extracted problem context if diagnosed",
  "extractedCategory": "electrician" | "plumber" | "carpenter" | "cleaner" | "painter",
  "selectedWorkerId": "worker ID if user picks one",
  "bookingDetails": {
     "date": "YYYY-MM-DD",
     "time": "HH:MM",
     "extraTools": "yes/no/specific list",
     "upiId": "user payment UPI handle if collected"
  }
}

Instructions based on Current State Step:
1. "diagnose": Greet user warmly, analyze the problem, suggest a helpful solution, and extract the category (electrician, plumber, etc.). Present nearby RAG workers to choose from.
2. "select_worker": Ask the user to choose one of the nearby workers.
3. "collect_slot": Ask the user for their preferred date and time slot, and if any extra tools are required.
4. "payment": Summarize the booking details (worker, date, time), state the hourly/visit charge, ask for their UPI handle to verify.
5. "completed": Summarize the booking completion details.

${ragContext}
Ensure your output is strictly valid JSON.`;

  const responseJson = await callLLM(systemPrompt, userMessage, session.history);

  // Update session state based on LLM analysis
  session.step = responseJson.nextStep || session.step;
  if (responseJson.diagnosedProblem) session.diagnosedProblem = responseJson.diagnosedProblem;
  if (responseJson.extractedCategory) session.selectedCategory = responseJson.extractedCategory;
  if (responseJson.selectedWorkerId) {
    const worker = await Worker.findById(responseJson.selectedWorkerId);
    if (worker) session.selectedWorker = worker;
  }
  if (responseJson.bookingDetails) {
    const details = responseJson.bookingDetails;
    if (details.date) session.bookingDate = details.date;
    if (details.time) session.bookingTime = details.time;
    if (details.extraTools) session.extraTools = details.extraTools;
    if (details.upiId) session.upiId = details.upiId;
  }

  // Push messages to history
  session.history.push({ role: "user", content: userMessage });
  session.history.push({ role: "assistant", content: responseJson.reply });

  // If the agent indicates we should complete the booking, execute in DB
  let dbBooking = null;
  if (session.step === "completed" || responseJson.nextStep === "completed") {
    try {
      const userProfile = await User.findById(userId);
      const worker = session.selectedWorker || await Worker.findOne({ profession: session.selectedCategory });

      if (worker && userProfile) {
        dbBooking = await Booking.create({
          userId: userProfile._id,
          workerId: worker._id,
          serviceName: worker.profession.charAt(0).toUpperCase() + worker.profession.slice(1) + " Service",
          amount: worker.hourlyRate || 399,
          status: "confirmed",
          paymentMethod: "upi",
          date: session.bookingDate ? new Date(`${session.bookingDate}T${session.bookingTime || "12:00"}`) : new Date(),
          address: userProfile.address || "Delhi Area",
          notes: JSON.stringify({
            problemDesc: session.diagnosedProblem,
            requirements: session.extraTools ? [session.extraTools] : [],
            time: session.bookingTime,
            upiId: session.upiId,
          }),
        });

        // Append success context to LLM reply
        responseJson.reply += `\n\n🎉 **Booking Confirmed!**\n- **Service:** ${dbBooking.serviceName}\n- **Worker:** ${worker.name}\n- **Booking ID:** #${dbBooking._id.toString().substring(0, 8)}\n- **Scheduled:** ${session.bookingDate} at ${session.bookingTime}`;
        
        // Reset session state
        resetSession(userId);
      }
    } catch (err) {
      console.error("Agent booking execution error:", err);
      responseJson.reply += "\n\n(Note: I encountered an error while saving this booking to the database, but all details have been captured.)";
    }
  }

  return {
    reply: responseJson.reply,
    step: session.step,
    booking: dbBooking,
  };
}
