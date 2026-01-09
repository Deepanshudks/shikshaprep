import * as fs from 'fs';
import mongoose, { Types } from 'mongoose';

const pdfParse = require('pdf-parse');

export async function processPDF(
  testId: Types.ObjectId,
  filePath: string,
): Promise<void> {
  console.log(`📄 Starting PDF processing for test ${testId}`);

  try {
    if (!fs.existsSync(filePath)) {
      throw new Error('PDF file not found');
    }

    const buffer = fs.readFileSync(filePath);

    // ✅ NOW THIS WORKS
    const pdfData = await pdfParse(buffer);
    const text: string = pdfData.text;

    if (!text || !text.trim()) {
      throw new Error('No text found in PDF');
    }

    const questions = generateQuestionsFromText(text);

    const MockTestModel = mongoose.model('MockTest');

    await MockTestModel.findByIdAndUpdate(testId, {
      status: 'completed',
      questions,
      processingError: null,
    });

    console.log(`✅ PDF processing completed for test ${testId}`);
  } catch (error) {
    console.error(`❌ PDF processing failed for test ${testId}`, error);

    const MockTestModel = mongoose.model('MockTest');

    await MockTestModel.findByIdAndUpdate(testId, {
      status: 'failed',
      processingError: error.message || 'PDF processing failed',
    });
  }
}

function generateQuestionsFromText(text: string) {
  const sentences = text
    .split('.')
    .map((s) => s.trim())
    .filter((s) => s.length > 20)
    .slice(0, 10);

  return sentences.map((sentence, index) => ({
    question: `Question ${index + 1}: ${sentence}?`,
    options: [],
    correctAnswer: '',
    type: 'short-answer',
    explanation: '',
  }));
}
