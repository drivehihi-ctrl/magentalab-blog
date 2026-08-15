import { ImagePipelineError } from './types';

export const ANSIM_BASE_PROMPT = "A brown dachshund wearing round-rimmed glasses and holding a small gold magnifying glass looks as if he is wearing a white lab coat. He is a researcher, and his name is Ansim.";

export function validateImagePrompt(prompt: string, ansimRequired: boolean) {
  if (ansimRequired) {
    if (!prompt.includes(ANSIM_BASE_PROMPT)) {
      throw new ImagePipelineError('IMAGE_PROMPT_ANSIM_REQUIRED', `ansim_required is true, but the canonical Ansim prompt is missing.`);
    }
  }

  const dangerKeywords = [
    'dosage',
    'mg', 'ml', 'pill', 'syringe',
    'insulin',
    'vomiting',
    'lethal', 'safe dose',
    'surgery', 'incision', 'blood',
    'wound', 'gore',
    'treatment'
  ];
  
  const lowerPrompt = prompt.toLowerCase();
  for (const keyword of dangerKeywords) {
    // Basic guard
    if (lowerPrompt.includes(keyword)) {
      // we could implement regex boundary matching, but for Phase 1 basic includes is fine
      // wait, 'treatment' might be too broad. Let's make it a bit safer.
      const match = new RegExp(`\\b${keyword}\\b`, 'i').test(prompt);
      if (match) {
         throw new ImagePipelineError('IMAGE_PROMPT_DANGEROUS_CONTENT', `Prompt contains potentially dangerous medical/graphic content: ${keyword}`);
      }
    }
  }
}

export function validateAltText(altText: string) {
  if (!altText || altText.trim().length === 0) {
    throw new ImagePipelineError('IMAGE_ALT_EMPTY', 'ALT text cannot be empty');
  }
  
  if (altText.length > 200) {
    throw new ImagePipelineError('IMAGE_ALT_TOO_LONG', 'ALT text exceeds maximum length of 200 characters');
  }
  
  const htmlTagPattern = /<[^>]*>/;
  const scriptPattern = /javascript:|http:\/\/|https:\/\//i;
  
  if (htmlTagPattern.test(altText) || scriptPattern.test(altText)) {
    throw new ImagePipelineError('IMAGE_ALT_INVALID_FORMAT', 'ALT text contains HTML tags or URLs');
  }
}
