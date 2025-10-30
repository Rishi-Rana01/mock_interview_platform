# API: POST /api/vapi/generate

This document describes the recommended request/response schema and example usage for an AI generation endpoint (vapi). The repository currently uses the VAPI web SDK (`lib/vapi.sdk.ts`) and the `Agent` component to start client-side workflows. If you prefer a server-side endpoint, use the schema and examples below.

Note: the project does not include a `api/vapi/generate/route.ts` server file by default. This doc shows a suggested contract and a minimal example implementation for Next.js App Router.

## Purpose

- Provide a secure server-side API that can start or proxy AI generation workflows, accept transcripts or generation requests, and return structured results.

## Security

- Keep the server VAPI key secret and do NOT expose it to clients. Use `VAPI_API_KEY` (server env) or a provider secret. Client-facing tokens (if any) should use `NEXT_PUBLIC_` prefix and are considered public.

## Request

POST /api/vapi/generate

Headers:
- Content-Type: application/json

Body (JSON):

```json
{
  "mode": "generate",           // or "feedback"
  "prompt": "optional prompt", // optional free-text prompt
  "interviewId": "string",     // optional id to tie output to an interview
  "userId": "string",          // optional: user id for context
  "questions": ["q1","q2"]   // optional: questions array (used for generate)
}
```

Fields explained:
- mode — "generate" for creating an interview session, "feedback" for generating a feedback summary from a transcript.
- prompt — free-text prompt to send to the AI if you want ad-hoc generation.
- interviewId / userId — IDs used to persist or link the generated output to your database.
- questions — optional array of questions to feed into an interview workflow.

## Response

Success (HTTP 200):

```json
{
  "success": true,
  "data": {
    "text": "Generated text or feedback",
    "workflowId": "optional-workflow-id",
    "meta": {
      "durationMs": 1234
    }
  }
}
```

Error (e.g., 400 / 500):

```json
{
  "success": false,
  "error": "Description of the error"
}
```

## Example: client-side fetch

```js
const res = await fetch('/api/vapi/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ mode: 'feedback', interviewId: 'abc', userId: 'u1' })
});
const json = await res.json();
if (json.success) {
  console.log(json.data.text);
}
```

## Minimal Next.js App Router route example

Place this file at `app/api/vapi/generate/route.ts` (server-only). This example sketches how to read the request and call a hypothetical server SDK. Adapt to your provider's SDK.

```ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mode, prompt, interviewId, userId, questions } = body;

    // Example: call a server-side VAPI or AI client (pseudo-code)
    // const result = await serverVapi.generate({ mode, prompt, questions });

    // For now, return a stubbed response
    return NextResponse.json({
      success: true,
      data: {
        text: 'This is a placeholder response from /api/vapi/generate',
        workflowId: 'workflow-123',
      }
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
```

## Suggested persistence flow

- When mode === 'feedback': accept a transcript payload and persist it (e.g., to Firestore) before calling the AI to generate feedback. Store the generated feedback in a `feedback` collection and return its id to the client.
- When mode === 'generate': create a new interview record, call the AI workflow (server or client), and return the interview id and any initial prompts or generated questions.

## Example request/response for feedback

Request body:

```json
{
  "mode": "feedback",
  "interviewId": "interview-123",
  "userId": "user-1",
  "transcript": [
    { "role": "user", "content": "Answer 1" },
    { "role": "assistant", "content": "Question 1" }
  ]
}
```

Response (success):

```json
{
  "success": true,
  "data": {
    "text": "Good pacing, clarify your assumptions, ...",
    "feedbackId": "fb_abc123"
  }
}
```

## Notes & next steps

- If you want me to implement the server route now I can: I will create `app/api/vapi/generate/route.ts` that uses `VAPI_API_KEY` (server env) and Firestore (if you want persistence). Tell me if you'd like that implemented and which behavior you want by default (generate vs feedback).
- If your app relies on the client-side `vapi` SDK (see `lib/vapi.sdk.ts`), keep `NEXT_PUBLIC_VAPI_WEB_TOKEN` and `NEXT_PUBLIC_VAPI_WORKFLOW_ID` set.
