# Migrate AI Coach to new @google/genai SDK

## Goal Description

Replace the usage of the legacy `@google/generative-ai` SDK with the new `@google/genai` SDK across the project, focusing on the AI Coach API route and test script. This resolves the runtime error `genAI.getGenerativeModel is not a function` and ensures the AI Coach responds correctly.

## User Review Required

> [!IMPORTANT] 
> Confirm if you want to fully migrate to the new SDK and remove the old `@google/generative-ai` dependency. If you prefer to keep the legacy SDK for other parts of the project, we can retain it alongside the new one.

## Open Questions

> [!WARNING] 
> - Should we completely uninstall `@google/generative-ai` after migration?
> - Do you need any additional configuration (e.g., custom generation settings) for the new SDK?

## Proposed Changes

---
### Dependency Updates

#### [MODIFY] [package.json](file:///C:/Users/AZ/Documents/ISI%20project/dourous-net/package.json)
- Replace `@google/generative-ai` with `@google/genai` (add if not present) and run npm install.

---
### Test Script

#### [MODIFY] [scripts/test-gemini.js](file:///C:/Users/AZ/Documents/ISI%20project/dourous-net/scripts/test-gemini.js)
- Update import to `import { GoogleGenAI } from '@google/genai';`
- Adjust usage: create `const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });`
- Use `await ai.models.generateContent({ model: 'gemini-1.5-pro', contents: 'Hello, Gemini!' });`
- Log the response text.

---
### AI Coach API Route

#### [MODIFY] [src/app/api/ai-coach/route.ts](file:///C:/Users/AZ/Documents/ISI%20project/dourous-net/src/app/api/ai-coach/route.ts)
- Update import to `import { GoogleGenAI } from '@google/genai';`
- Initialize client with `const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });`
- Replace `genAI.getGenerativeModel` usage with `ai.models.generateContent` call wrapped in a chat session if needed. Since the new SDK does not have `startChat`, we can construct a simple request:
  ```javascript
  const result = await ai.models.generateContent({
    model: 'gemini-1.5-pro',
    systemInstruction: systemPrompt,
    contents: [{ role: 'user', parts: [{ text: message }] }],
    // Optionally include prior chat history via `messages` field if supported
  });
  const reply = result.text;
  ```
- Remove `model.startChat` logic and adapt history handling to the new SDK's format (if needed).
- Adjust error handling accordingly.

---
### Cleanup

- Optionally run `npm uninstall @google/generative-ai` if no longer needed.
- Update any other files that import the old SDK.

## Verification Plan

### Automated Tests
- Run `node scripts/test-gemini.js` and ensure it logs a successful response.
- Start the Next.js dev server (`npm run dev`) and send a POST request to `/api/ai-coach` with a sample payload; verify the JSON reply contains a `reply` field with generated text.

### Manual Verification
- Open the web UI, trigger the AI Coach feature, and confirm it returns coherent answers without the generic error message.

---
