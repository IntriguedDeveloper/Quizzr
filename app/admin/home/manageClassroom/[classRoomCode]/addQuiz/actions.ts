"use server";

import Groq from "groq-sdk";
import pdfParse from "pdf-parse";
import { QuestionConstructType } from "../_types/quizTypes";

export const mcqExtraction = async (
  pdfFile: File
): Promise<{
  content: QuestionConstructType[] | null;
  error: string | null;
}> => {
  try {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const data = await pdfParse(buffer);
    console.log("Extracted Text:", data.text);

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Send text to AI to extract MCQs
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Extract only multiple-choice questions (MCQs) from the following text. 
          Strictly format the output with only the MCQs and their respective options, following this format:
          
          1. Question text?
             A. Option 1
             B. Option 2
             C. Option 3
             D. Option 4
          2. Question text?
             A. Option 1
             B. Option 2
             C. Option 3
             D. Option 4
             
          Do not include any explanations, introductions, or additional text. Only return the MCQs.
          
          The text:
          ${data.text}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const aiResponse = completion.choices[0]?.message?.content || "";
    console.log("AI Response:", aiResponse);

    // Regex to extract MCQs from AI response
    const mcqRegex =
      /(\d+)\.\s*(.+?)\n\s*A\.\s*(.+?)\n\s*B\.\s*(.+?)\n\s*C\.\s*(.+?)\n\s*D\.\s*(.+?)(?:\n|$)/g;

    const questionsArray: QuestionConstructType[] = [];
    let match;
    let counter = 1;
    while ((match = mcqRegex.exec(aiResponse)) !== null) {
      questionsArray.push({
        QuestionTitle: match[2].trim(),
        AnswerChoices: [
          { choiceIndex: 1, choiceContent: match[3].trim() },
          { choiceIndex: 2, choiceContent: match[4].trim() },
          { choiceIndex: 3, choiceContent: match[5].trim() },
          { choiceIndex: 4, choiceContent: match[6].trim() },
        ],
        CorrectOptionIndex: 1, // Default to 1 (user can modify later)
        QuestionIndex: counter,
        SelectedIndex: undefined, // Initially undefined
      });
      counter++;
    }
    console.log(questionsArray);

    console.log("Extracted MCQs:", questionsArray);
    return { error: "", content: questionsArray }; // Send extracted MCQs to frontend
  } catch (error: any) {
    return { error: error, content: null };
  }
};
