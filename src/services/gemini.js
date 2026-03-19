import axios from 'axios'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`

export const parseTransactionIntent = async (text) => {
  const prompt = `
    Analyze the following text and extract transaction details for a fintech app.
    Return ONLY a raw JSON object with:
    - action: "create" | "update" | "delete"
    - amount: number (if applicable)
    - category: string (one of: shopping, food, transport, bills, entertainment, income, other)
    - type: "income" | "expense"
    - note: string (original text or extracted note)
    - target: string (for "update" or "delete", which transaction the user is referring to, e.g., "coffee")

    Text: "${text}"
  `

  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [{ parts: [{ text: prompt }] }]
    })

    const resultText = response.data.candidates[0].content.parts[0].text
    
    // Improved JSON extraction
    const jsonMatch = resultText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error("No JSON found in model response:", resultText)
      throw new Error("AI response format was invalid. Please try again.")
    }
    
    try {
      return JSON.parse(jsonMatch[0])
    } catch (e) {
      console.error("JSON Parse Error:", e, "on text:", jsonMatch[0])
      throw new Error("Failed to process AI response. Please try again.")
    }
  } catch (error) {
    const errorMsg = error.response?.data?.error?.message || error.message
    console.error("Gemini API Error details:", errorMsg)
    throw new Error(errorMsg)
  }
}
