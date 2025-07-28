// Summarize the reason for pain based on user input and context.
'use server';

/**
 * @fileOverview An AI agent to summarize possible reasons for pain.
 *
 * - summarizePainReason - A function that handles the summarization of possible pain reasons.
 * - SummarizePainReasonInput - The input type for the summarizePainReason function.
 * - SummarizePainReasonOutput - The return type for the summarizePainReason function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePainReasonInputSchema = z.object({
  age: z.number().describe('The age of the user.'),
  gender: z.string().describe('The gender of the user.'),
  activityLevel: z.string().describe('The activity level of the user (Sedentary, Light, Moderate, Intense).'),
  painDescription: z.string().describe('The description of the pain provided by the user.'),
});
export type SummarizePainReasonInput = z.infer<typeof SummarizePainReasonInputSchema>;

const SummarizePainReasonOutputSchema = z.object({
  reason: z.string().describe('A possible reason for the pain based on the description and context.'),
});
export type SummarizePainReasonOutput = z.infer<typeof SummarizePainReasonOutputSchema>;

export async function summarizePainReason(input: SummarizePainReasonInput): Promise<SummarizePainReasonOutput> {
  return summarizePainReasonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePainReasonPrompt',
  input: {schema: SummarizePainReasonInputSchema},
  output: {schema: SummarizePainReasonOutputSchema},
  prompt: `You are an AI assistant specializing in providing possible reasons for pain based on user descriptions and context.

  Given the following information, provide a possible reason for the pain. Consider the user's age, gender, activity level, and pain description.

  Age: {{{age}}}
  Gender: {{{gender}}}
  Activity Level: {{{activityLevel}}}
  Pain Description: {{{painDescription}}}

  Reason:`,
});

const summarizePainReasonFlow = ai.defineFlow(
  {
    name: 'summarizePainReasonFlow',
    inputSchema: SummarizePainReasonInputSchema,
    outputSchema: SummarizePainReasonOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
