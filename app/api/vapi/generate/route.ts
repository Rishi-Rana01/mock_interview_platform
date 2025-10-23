import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { getRandomInterviewCover } from '@/lib/utils';
import { db } from '@/firebase/admin';

// 1. Define a schema for the incoming request body using Zod for validation.
const InterviewRequestSchema = z.object({
  role: z.string().min(1, 'Role is required.'),
  level: z.string().min(1, 'Level is required.'),
  techstack: z.string(), // Can be an empty string
  type: z.enum(['technical', 'behavioral', 'behavioural', 'balanced','mixed']),
  amount: z.coerce.number().int().positive('Amount must be a positive number.'),
  userid: z.string().min(1, 'User ID is required.'),
});

// 2. Define a schema for the expected AI output.
const InterviewQuestionsSchema = z.object({
  questions: z.array(z.string()).describe('An array of interview questions.'),
});

// 3. Move prompt creation into its own clean function.
function createInterviewPrompt({ role, level, techstack, type, amount }: z.infer<typeof InterviewRequestSchema>) {
  return `
    You are an expert interview question writer. Your goal is to create high-quality, targeted interview questions.

    **Instructions:**
    1.  **Role:** ${role}
    2.  **Experience Level:** ${level}
    3.  **Tech Stack:** ${techstack || 'General concepts relevant to the role'}
    4.  **Focus:** ${type}
    5.  **Number of Questions:** Generate exactly ${amount} questions.

    **Question Requirements:**
    - Match difficulty to the experience level (e.g., Senior questions should cover architecture, scalability, and leadership).
    - Ground technical questions in the specified tech stack.
    - Balance the question types based on the focus (~80/20 for technical/behavioral, 50/50 for balanced).
    - Ensure each question is open-ended, practical, and covers a single topic.
    - Keep questions clear, direct, and under 25 words.
    - Format for a voice assistant: use only letters, numbers, spaces, commas, periods, and question marks. Avoid all special characters, lists, or code formatting inside the question text itself.

    Your final output must be only the JSON object defined by the tool.
  `;
}

// Main POST handler
export async function POST(request: Request) {
  try {
    // A. Validate the incoming request body.
    const body = await request.json();
    const validation = InterviewRequestSchema.safeParse(body);

    if (!validation.success) {
      return Response.json({ success: false, error: validation.error.flatten() }, { status: 400 });
    }
    const { role, level, techstack, type, amount, userid } = validation.data;

    // B. Generate questions using generateObject for structured, predictable output.
    const { object: data } = await generateObject({
      model: google('gemini-2.5-flash'), // Using a newer, more reliable model for JSON mode
      schema: InterviewQuestionsSchema,
      prompt: createInterviewPrompt({ role, level, techstack, type, amount, userid }),
    });

    const parsedQuestions = data.questions;

    // C. Create the interview object for the database.
    const interview = {
      role,
      type,
      level,
      techstack: techstack ? techstack.split(',').map(t => t.trim()) : [],
      questions: parsedQuestions,
      userId: userid,
      finalized: true, // Assuming this is always true on creation
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    // D. Save to the database.
    await db.collection('interviews').add(interview);

    return Response.json({ success: true, data: interview }, { status: 200 });

  } catch (error) {
    console.error('Error in POST /api/interview:', error);
    
    // Provide a more specific error message if possible
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return Response.json({ success: false, error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}

// You can keep this GET handler as is.
export async function GET() {
    return Response.json({ success: true, data: 'Thanks for using VAPI! GET is operational.' }, { status: 200 });
}