import axios from 'axios';

export const parseTransactionIntent = async (text, history = "", lastParsed = null) => {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });

  const prompt = `
    You are the credU Smart Financial Assistant. 
    Analyze the user's voice transcript and extract one or more transactions.
    
    SYSTEM CONTEXT:
    - Today: ${dateStr} (${dayName})
    - User History (for categorizing): ${history}
    - Last Parsed Transaction (for corrections): ${lastParsed ? JSON.stringify(lastParsed) : 'None'}
    
    CAPABILITIES:
    1. MULTI-ENTRY: If user says "200 for food and 100 for taxi", extract BOTH.
    2. CORRECTIONS: If user says "no make it 300" or "change amount to 50", update the 'Last Parsed Transaction' instead of creating a new one.
    3. SMART DEFAULTS: merchant, category (Food, Transport, Shopping, Bills, Entertainment, Health, Education, Salary, Investment, Other), type (income/expense), date.
    
    VOICE FEEDBACK:
    Generate a short, friendly confirmation sentence for Speech Synthesis.
    Examples: "Added 2 transactions," "Updated amount to 300," "Added 500 for groceries."

    Return ONLY raw JSON:
    {
      "transactions": [
        {
          "action": "create" | "update" | "delete",
          "amount": number,
          "merchant": string | null,
          "category": string,
          "type": "income" | "expense",
          "date": "YYYY-MM-DD",
          "summary": string
        }
      ],
      "voiceResponse": string,
      "isCorrection": boolean
    }

    Text: "${text}"
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
                  merchant: { type: "STRING", nullable: true },
                  category: { type: "STRING" },
                  type: { type: "STRING" },
                  date: { type: "STRING" },
                  summary: { type: "STRING" }
                },
                required: ["action", "amount", "category", "type", "date", "summary"]
              }
            },
            voiceResponse: { type: "STRING" },
            isCorrection: { type: "BOOLEAN" }
          },
          required: ["transactions", "voiceResponse", "isCorrection"]
        }
      }
    })

    const resultText = response.data.candidates[0].content.parts[0].text
    const parsed = JSON.parse(resultText)
    
    return {
      transactions: parsed.transactions || [],
      voiceResponse: parsed.voiceResponse || "I've processed your request.",
      isCorrection: parsed.isCorrection || false
    }

  } catch (error) {
    console.error("Gemini v2 Error:", error)
    throw new Error(error.message || "I had trouble processing that.")
  }
}
