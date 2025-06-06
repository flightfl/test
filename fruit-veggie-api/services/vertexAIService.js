// vertexAIService.js is used in vertexAIRoutes.js

const { VertexAI } = require('@google-cloud/vertexai');
const dotenv = require('dotenv');

dotenv.config();

class VertexAIService {
  constructor() {
    this.projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    this.location = 'us-central1';
    
    if (!this.projectId) {
      console.warn('Google Cloud Project ID not found. AI features will be disabled.');
      return;
    }

    this.vertexAI = new VertexAI({
      project: this.projectId,
      location: this.location,
    });

    this.model = this.vertexAI.getGenerativeModel({
      model: 'gemini-2.0-flash-lite-001',
    });
  }

  async generateHealthInsights(produceName, nutritionData) {
    if (!this.projectId || !this.model) {
      throw new Error('Google Cloud not configured');
    }

    try {
      const prompt = `Generate 3 interesting and educational health facts about ${produceName}. 
      Here is the nutrition data: Calories: ${nutritionData.calories}, Protein: ${nutritionData.protein}g, Carbs: ${nutritionData.carbs}g, Fat: ${nutritionData.fat}g, Fiber: ${nutritionData.fiber}g.
      
      Make the facts:
      - Easy to understand for English language learners
      - Factual and health-focused  
      - Each fact should be 1-2 sentences
      - Focus on benefits and interesting properties
      
      Return exactly 3 facts, each on a new line, numbered 1., 2., 3.`;

      const result = await this.model.generateContent(prompt);
      
      // Debug: let's see what we actually get
      console.log('Debug - Full result:', JSON.stringify(result, null, 2));
      
      // Try different ways to extract text
      let text = '';
      if (result.response) {
        if (typeof result.response.text === 'function') {
          text = result.response.text();
        } else if (result.response.candidates && result.response.candidates.length > 0) {
          const candidate = result.response.candidates[0];
          if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
            text = candidate.content.parts[0].text;
          }
        } else if (result.response.text) {
          text = result.response.text;
        }
      }
      
      console.log('Debug - Extracted text:', text);
      
      if (!text) {
        throw new Error('No text content found in response');
      }
      
      return this.parseHealthFacts(text, produceName);
    } catch (error) {
      console.error(`Error generating health insights for ${produceName}:`, error);
      return [
        `${produceName} is a nutritious food that provides essential vitamins and minerals.`,
        `Including ${produceName} in your diet can contribute to overall health and wellness.`,
        `${produceName} contains valuable nutrients that support body functions.`
      ];
    }
  }

  async translateProduceName(produceName) {
    if (!this.projectId || !this.model) {
      throw new Error('Google Cloud not configured');
    }

    try {
      const prompt = `Translate the English word "${produceName}" to these languages and return ONLY a valid JSON object:
      
      {"spanish": "translation", "french": "translation", "chinese": "translation", "japanese": "translation"}
      
      Just return the JSON, no other text.`;

      const result = await this.model.generateContent(prompt);
      
      // Use the same response handling as above
      let text = '';
      if (result.response) {
        if (typeof result.response.text === 'function') {
          text = result.response.text();
        } else if (result.response.candidates && result.response.candidates.length > 0) {
          const candidate = result.response.candidates[0];
          if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
            text = candidate.content.parts[0].text;
          }
        } else if (result.response.text) {
          text = result.response.text;
        }
      }
      
      if (!text) {
        throw new Error('No text content found in response');
      }
      
      return this.parseTranslations(text);
    } catch (error) {
      console.error(`Error translating ${produceName}:`, error);
      return {};
    }
  }

  parseHealthFacts(content, produceName) {
    try {
      const lines = content.split('\n').filter(line => line.trim());
      const facts = [];
      
      for (const line of lines) {
        if (line.match(/^\d+\./)) {
          const fact = line.replace(/^\d+\.\s*/, '').trim();
          if (fact.length > 10) {
            facts.push(fact);
          }
        }
      }
      
      return facts.length >= 3 ? facts.slice(0, 3) : [
        `${produceName} is a nutritious food that provides essential vitamins and minerals.`,
        `Including ${produceName} in your diet can contribute to overall health and wellness.`,
        `${produceName} contains valuable nutrients that support body functions.`
      ];
    } catch (error) {
      console.error('Error parsing health facts:', error);
      return [`${produceName} provides valuable nutrition for a healthy diet.`];
    }
  }

  parseTranslations(content) {
    try {
      const cleanContent = content
        .replace(/```json|```/g, '')
        .replace(/^\s*|\s*$/g, '')
        .trim();
      
      return JSON.parse(cleanContent);
    } catch (error) {
      console.error('Error parsing translations:', error);
      return {};
    }
  }

  isAvailable() {
    return !!(this.projectId && this.model);
  }
}

module.exports = new VertexAIService();

// Below is an example of the Vertex AI response:
// Input tokens: 138 tokens (for the health insights prompt)
// Output tokens: 113 tokens (for the AI response)
// Total: 251 tokens per health insight request

// Cost Per Request:
// Input: 138 tokens × $0.075/1M = $0.0000104
// Output: 113 tokens × $0.30/1M = $0.0000339
// Total per request: ~$0.000044

/*
Debug - Full result: {
  "response": {
    "candidates": [
      {
        "content": {
          "role": "model",
          "parts": [
            {
              "text": "Here are three facts about potatoes:\n\n1.  Potatoes have a lot of fiber, which helps your body digest food and keeps you feeling full longer. This can be helpful if you are trying to eat less food overall.\n2.  Potatoes contain protein, which is important for building and repairing your body's cells, muscles, and tissues. One medium potato has more protein than some other common vegetables!\n3.  The carbohydrates in potatoes give you energy, making them a good food to eat before exercising or when you need to be active.\n"
            }
          ]
        },
        "finishReason": "STOP",
        "avgLogprobs": -0.5140262367451085,
        "index": 0
      }
    ],
    "usageMetadata": {
      "promptTokenCount": 138,
      "candidatesTokenCount": 113,
      "totalTokenCount": 251,
      "trafficType": "ON_DEMAND",
      "promptTokensDetails": [
        {
          "modality": "TEXT",
          "tokenCount": 138
        }
      ],
      "candidatesTokensDetails": [
        {
          "modality": "TEXT",
          "tokenCount": 113
        }
      ]
    },
    "modelVersion": "gemini-2.0-flash-lite-001",
    "createTime": "2025-05-27T22:12:25.188390Z",
    "responseId": "yTg2aOa_C-nBmecPy_2DsAQ"
  }
}
  */