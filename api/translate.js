import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai"
dotenv.config()
const PORT = process.env.PORT || 3000;
const app = express()
const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model_score = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction: "give a percentage score, like a native, for how accurately it translates the given original sentence.",
});

const generationConfig = {
  temperature: 1.5,
  topP: 0.95,
  topK: 50,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};
app.use(cors());
app.use(bodyParser.json());

export default async function handler(req, res) {
    const { originalText, translatedText, originalLanguage, translatedLanguage } = req.body
    const chatSession = model_score.startChat({
        generationConfig,
        history: [
            {
            role: "user",
            parts: [
                {text: `Original (${originalLanguage}) : ${originalText}, Translated (${translatedLanguage}) : ${translatedText}`},
            ],
            },
        ],
    });
    const result = await chatSession.sendMessage(`explain percentage score in ${translatedLanguage} language, and give the correct translation`);
    const response = result.response.text()
    console.log(originalLanguage, translatedLanguage)
    console.log(response)
    return res.json({ response })
}
