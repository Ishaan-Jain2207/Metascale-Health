const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * ClinicalInsightService — For Detailed Clinical Assessment Generation
 */
class ClinicalInsightService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);
      this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    } else {
      console.warn('⚠️ GEMINI_API_KEY not found in .env. Clinical insights will be disabled.');
    }
  }

  async explainScreening(type, data, result) {
    if (!this.model) {
      throw new Error('Clinical Analysis service is currently unavailable.');
    }

    const prompt = `
      You are a clinical assistant for Metascale Health. Provide a professional medical review based on the following screening result from an Indian patient.
      
      SCREENING TYPE: ${type.toUpperCase()}
      PREDICTED RISK: ${result.riskBand}
      INTERPRETATION: ${result.interpretation}
      
      PATIENT DATA (JSON):
      ${JSON.stringify(data, null, 2)}
      
      INSTRUCTIONS:
      1. Explain the clinical reasoning for this risk level based on the clinical biomarkers/lifestyle indicators provided.
      2. Suggest 3 priority areas for the patient to discuss with their doctor.
      3. Keep the tone clinical, empathetic, and objective. 
      4. Use professional clinical language (e.g., 'Metabolic indicators', 'Etiology', 'Clinical prognosis').
      5. Output in concise markdown.
      6. Start with: "Based on the clinical assessment of your biomarkers..."
      7. Remove the word "promptly".
    `.trim();

    try {
      const gResult = await this.model.generateContent(prompt);
      const response = await gResult.response;
      return response.text();
    } catch (err) {
      console.error('Gemini API Error:', err);
      throw new Error('Failed to generate clinical insights. Please try again later.');
    }
  }
}

module.exports = new ClinicalInsightService();
