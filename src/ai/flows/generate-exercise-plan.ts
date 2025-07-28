'use server';

/**
 * @fileOverview Generates a personalized exercise plan based on user input.
 *
 * - generateExercisePlan - A function that generates an exercise plan.
 * - GenerateExercisePlanInput - The input type for the generateExercisePlan function.
 * - GenerateExercisePlanOutput - The return type for the generateExercisePlan function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const GenerateExercisePlanInputSchema = z.object({
  fullName: z.string().describe('The full name of the user.'),
  age: z.number().int().positive().describe('The age of the user in years.'),
  gender: z.enum(['male', 'female', 'other']).describe('The gender of the user.'),
  activityLevel: z
    .enum(['sedentary', 'light', 'moderate', 'intense'])
    .describe('The activity level of the user.'),
  painDescription: z.string().describe("A description of the user's pain."),
});

export type GenerateExercisePlanInput = z.infer<typeof GenerateExercisePlanInputSchema>;

const GenerateExercisePlanOutputSchema = z.object({
  reasonForPain: z.string().describe("A possible reason for the user's pain. This should be a concise, explanatory sentence."),
  recommendedExercises: z.array(
    z.object({
      name: z.string().describe('The name of the exercise (e.g., "Cat-Cow Stretch").'),
      instructions: z.string().describe('Brief, clear instructions for performing the exercise. Should be 1-2 sentences.'),
      sets: z.number().int().min(1).describe('Number of sets for this exercise (e.g., 3).'),
      reps: z.number().int().min(1).describe('Number of repetitions for this exercise (e.g., 10).'),
      duration: z.string().optional().describe('Duration of the hold or exercise, if applicable (e.g., "30 seconds").'),
    })
  ).describe('A list of 3 to 5 recommended exercises with instructions.'),
  weeklyPlan: z.array(
    z.object({
      day: z.string().describe('Day of the week (e.g., "Monday", "Tuesday").'),
      exercises: z.array(z.string()).describe('List of exercise names to be performed on that day.'),
    })
  ).describe('A basic 5-day weekly exercise plan using the recommended exercises.'),
});

export type GenerateExercisePlanOutput = z.infer<typeof GenerateExercisePlanOutputSchema>;

export async function generateExercisePlan(
  input: GenerateExercisePlanInput
): Promise<GenerateExercisePlanOutput> {
  return generateExercisePlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExercisePlanPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: GenerateExercisePlanInputSchema},
  output: {schema: GenerateExercisePlanOutputSchema},
  prompt: `You are a world-class physical therapist AI creating a personalized exercise plan.
  
  Your response MUST be a valid JSON object that adheres to the provided output schema. Do not add any extra text or formatting.

  Based on the user's information, you will provide:
  1. A likely reason for their pain in the 'reasonForPain' field.
  2. A list of exactly 4 recommended exercises in the 'recommendedExercises' array. For each exercise, provide a name, instructions, sets, reps, and an optional duration.
  3. A 5-day weekly plan in the 'weeklyPlan' array, assigning exercises from your recommendations to each day.

  User Information:
  - Full Name: {{{fullName}}}
  - Age: {{{age}}}
  - Gender: {{{gender}}}
  - Activity Level: {{{activityLevel}}}
  - Pain Description: {{{painDescription}}}`,
});

const generateExercisePlanFlow = ai.defineFlow(
  {
    name: 'generateExercisePlanFlow',
    inputSchema: GenerateExercisePlanInputSchema,
    outputSchema: GenerateExercisePlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('The AI model did not return a valid plan. The response was empty.');
    }
    return output;
  }
);
