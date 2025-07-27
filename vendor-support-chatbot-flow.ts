'use server';
/**
 * @fileOverview An AI chatbot flow that provides support to vendors, answering questions
 * related to raw material sourcing, orders, and suppliers.
 *
 * - vendorSupportChatbot - A function that handles the chatbot interaction.
 * - VendorSupportChatbotInput - The input type for the vendorSupportChatbot function.
 * - VendorSupportChatbotOutput - The return type for the vendorSupportChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VendorSupportChatbotInputSchema = z.object({
  query: z.string().describe('The vendor query to the chatbot.'),
  language: z.string().describe('The language that the chatbot should respond in.'),
});
export type VendorSupportChatbotInput = z.infer<typeof VendorSupportChatbotInputSchema>;

const VendorSupportChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the vendor query.'),
});
export type VendorSupportChatbotOutput = z.infer<typeof VendorSupportChatbotOutputSchema>;

export async function vendorSupportChatbot(input: VendorSupportChatbotInput): Promise<VendorSupportChatbotOutput> {
  return vendorSupportChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'vendorSupportChatbotPrompt',
  input: {schema: VendorSupportChatbotInputSchema},
  output: {schema: VendorSupportChatbotOutputSchema},
  prompt: `You are StreetLink, a helpful assistant for Indian street food vendors. Your goal is to answer questions about raw material sourcing, orders, and suppliers. Respond concisely and always in {{language}} language. If asked about prices, indicate they are dynamic and depend on suppliers. If asked for specific supplier details, advise the user to use the app's search features. Use your knowledge and respond to the following query: {{{query}}}`,
});

const vendorSupportChatbotFlow = ai.defineFlow(
  {
    name: 'vendorSupportChatbotFlow',
    inputSchema: VendorSupportChatbotInputSchema,
    outputSchema: VendorSupportChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      response: output!.response,
    };
  }
);
