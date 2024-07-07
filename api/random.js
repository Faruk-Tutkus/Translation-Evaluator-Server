import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import {
  GoogleGenerativeAI,
} from "@google/generative-ai"
dotenv.config()
const app = express()
const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model_random = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
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
  const { level, topic, originalLanguage } = req.body;
  const prompt = `write a random at ${level} level sentence about ${topic} in ${originalLanguage}, just one sentence without translation`

  const result = await model_random.generateContent(prompt, generationConfig);
  const response = result.response.text();
  console.log(response);
  return res.json({ 
    response,
  });
}
