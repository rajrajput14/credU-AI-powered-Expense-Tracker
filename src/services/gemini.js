import axios from 'axios';

export const parseTransactionIntent = async (text, history = "", lastParsed = null) => {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;
  
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });

  const prompt = `
    You are the "WhisperFlow" Smart Financial Engine for credU. 
    Your task is to parse a raw voice transcript into structured financial data.

    TRANSCRIPT PROCESSING RULES:
    1. CLEAN: Remove filler words like "um", "uh", "like", "basically", "actually", "matlab", "toh", "literally", "you know".
    2. NORMALIZE: Convert verbal numbers into integers ("to hundred" -> 200, "four ninety nine" -> 499).
    3. HINGLISH SUPPORT: Handle Hindi/English mix. 
       - "kal 300 kharcha kiya petrol pe" -> amount: 300, category: "Fuel", date: "yesterday".
       - "do sau rupay khana khaaya" -> amount: 200, category: "Food".
    4. MULTI-ENTRY: Parse multiple entries if present. "Spent 500 on groceries and gave 1000 to mom".
    5. CORRECTIONS: If transcript indicates a correction of the 'Last Parsed Transaction' (e.g. "no make it 300"), update it.
    6. SMART CATEGORIES: (Food, Transport, Shopping, Bills, Entertainment, Health, Education, Salary, Investment, Fuel, Subscription, Travel, Other).

    SYSTEM CONTEXT:
    - Today: ${dateStr} (${dayName})
    - User Transactional Context: ${history}
    - Last Parsed Transaction: ${lastParsed ? JSON.stringify(lastParsed) : 'None'}
    
    RETURN FORMAT (JSON ONLY):
    {
      "transactions": [
        {
          "action": "create" | "update",
          "amount": number,
          "category": string,
          "type": "income" | "expense",
          "date": "YYYY-MM-DD",
          "merchant": string | null,
          "summary": string,
          "notes": string | null
        }
      ],
      "confidence": number (0 to 1),
      "voiceResponse": string (friendly one-liner summary),
      "isCorrection": boolean
    }

    Raw Transcript: "${text}"
  `

  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            transactions: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  action: { type: "STRING" },
                  amount: { type: "NUMBER" },
                  category: { type: "STRING" },
                  type: { type: "STRING" },
                  date: { type: "STRING" },
                  merchant: { type: "STRING", nullable: true },
                  summary: { type: "STRING" },
                  notes: { type: "STRING", nullable: true }
                },
                required: ["action", "amount", "category", "type", "date", "summary"]
              }
            },
            confidence: { type: "NUMBER" },
            voiceResponse: { type: "STRING" },
            isCorrection: { type: "BOOLEAN" }
          },
          required: ["transactions", "confidence", "voiceResponse", "isCorrection"]
        }
      }
    })

    const resultText = response.data.candidates[0].content.parts[0].text
    const parsed = JSON.parse(resultText)
    
    return {
      transactions: parsed.transactions || [],
      confidence: parsed.confidence || 0.5,
      voiceResponse: parsed.voiceResponse || "I've processed your request.",
      isCorrection: parsed.isCorrection || false
    }

  } catch (error) {
    console.error("WhisperFlow Engine Error:", error)
    throw new Error(error.message || "I had trouble processing that.")
  }
}
