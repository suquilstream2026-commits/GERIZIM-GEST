
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Always initialize GoogleGenAI inside the functions if using Veo/Pro to ensure latest key is used.
// For basic tasks, we can use the default.

export async function getDailySpiritualContent() {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Gere um versículo bíblico do dia em português, seguido de uma breve reflexão cristã inspiradora de 2 parágrafos adequada para a Igreja IESA.",
      config: {
        temperature: 0.7,
      },
    });

    return response.text || "Não foi possível carregar a reflexão no momento.";
  } catch (error) {
    console.error("Error fetching spiritual content:", error);
    return "Versículo: Filipenses 4:13 - 'Tudo posso naquele que me fortalece.'\n\nReflexão: Deus nos capacita para enfrentarmos os desafios diários com fé e perseverança.";
  }
}

export async function getChurchNewsSearch() {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Quais são as notícias mais recentes sobre a Igreja Evangélica Sinodal de Angola (IESA) e atividades religiosas em Angola em 2024/2025? Forneça um resumo curto de 3 pontos.",
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const urls = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => chunk.web?.uri).filter(Boolean) || [];
    return {
      text: response.text,
      sources: [...new Set(urls)] as string[]
    };
  } catch (error) {
    console.error("Search error:", error);
    return { text: "Não foi possível carregar notícias externas no momento.", sources: [] };
  }
}

export async function editImagePrompt(base64Image: string, prompt: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Image.split(',')[1] || base64Image, mimeType: 'image/png' } },
        { text: prompt },
      ],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Não foi possível editar a imagem.");
}

export async function generateLogo(prompt: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `Design a professional logo: ${prompt}. It must be minimalist, vector style, flat design, white background, high resolution. Incorporate a stylized cross and administrative elements like a shield or clean geometric lines. Colors: Crimson Red and Navy Blue.` },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Não foi possível gerar o logótipo.");
}

export async function animateWithVeo(base64Image: string, prompt: string, aspectRatio: '16:9' | '9:16' = '16:9') {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt || 'Animate this photo with subtle movement',
    image: {
      imageBytes: base64Image.split(',')[1] || base64Image,
      mimeType: 'image/png',
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
