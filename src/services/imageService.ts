import { GoogleGenAI } from "@google/genai";

export async function generateHeroImage() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: 'A professional 3D isometric render of a minimalist architectural model of a modern, multi-story modular house, positioned in the lower-left. The house is constructed from smooth, light beige concrete modules with distinct warm wooden slat accents and panels. The key lighting effect is dramatic and volumetric: strong, visible shafts of warm, golden light spill outward from every window, illuminating the scene. The background is a clean, split-tone surface with a sharp diagonal division running from top-right to bottom-left. The upper-right section is a deep, muted sage green (#5A7668), and the lower-left section is a lighter grayish-mint green (#B5CCBE), with the house resting on the lighter section. The entire composition is clean, with soft, realistic shadows, and absolutely no text, logos, buttons, or UI elements present. The perspective is precise isometric.',
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Error generating hero image:", error);
  }
  return null;
}
