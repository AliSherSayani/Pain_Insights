'use server';

import {
  generateExercisePlan,
  GenerateExercisePlanInput,
} from '@/ai/flows/generate-exercise-plan';
import { z } from 'zod';

const GenerateExercisePlanInputSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name is required.' }),
  age: z.coerce
    .number({ invalid_type_error: 'Age must be a number.' })
    .min(1, { message: 'Age is required.' })
    .max(120, { message: 'Please enter a valid age.' }),
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Please select a gender.' }),
  }),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'intense'], {
    errorMap: () => ({ message: 'Please select an activity level.' }),
  }),
  painDescription: z
    .string()
    .min(10, { message: 'Please describe your pain in at least 10 characters.' }),
});

export async function generatePlanAction(input: GenerateExercisePlanInput) {
  const validatedInput = GenerateExercisePlanInputSchema.safeParse(input);

  if (!validatedInput.success) {
    throw new Error(
      validatedInput.error.errors.map((e) => e.message).join(' ')
    );
  }

  try {
    const plan = await generateExercisePlan(validatedInput.data);
    return plan;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      `Failed to generate exercise plan. The AI service may be temporarily unavailable or encountered an issue. Full error: ${error.message}`
    );
  }
}
