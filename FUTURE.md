# 20250804: Voice Feedback Gimmick: Implementation Plan

## Goal

Add a microphone icon to your site. When pressed, it:

- Prompts the user for app ideas or feedback.
- Records their voice.
- Converts speech to text (in-browser if possible).
- Displays the transcribed text.

## Model Choice

- **For in-browser:**  
  Use [Vosk browser WASM model](https://github.com/alphacep/vosk-browser) (lightweight, runs locally, supports English and more).
- **For server-side (optional, more accurate):**  
  Use [Whisper-tiny](https://huggingface.co/openai/whisper-tiny) via Hugging Face Inference API or your own backend.

## Implementation Steps

### A. UI/UX

- Add a microphone icon button to your site (e.g., in the navbar or as a floating action button).
- On click:
  - Show a prompt: “Tell us your app idea or feedback!”
  - Start recording audio using the Web Audio API or MediaRecorder API.
  - Show a “Stop” button and a visual indicator (e.g., pulsing icon).

### B. Audio Capture

- Use JavaScript’s `navigator.mediaDevices.getUserMedia` to access the microphone.
- Record audio until the user stops.

### C. Speech-to-Text

- **Option 1: In-browser (recommended for privacy and speed)**
  - Integrate Vosk’s WASM model (see [Vosk browser demo](https://github.com/alphacep/vosk-browser)).
  - Load the model on demand to save bandwidth.
  - Process the recorded audio and output the transcript.
- **Option 2: Server-side (if you want higher accuracy or more languages)**
  - Send the audio blob to a backend endpoint.
  - Use Hugging Face’s Whisper-tiny or Distil-Whisper model for transcription.
  - Return the text to the browser.

### D. Output

- Display the transcribed text in a modal or on the page.
- Optionally, allow the user to edit and submit the feedback.

### E. Privacy

- Clearly inform users that their voice is processed locally (if using WASM) or sent to a server (if using Whisper API).

## Example Libraries & References

- [Vosk browser demo](https://github.com/alphacep/vosk-browser)
- [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [Hugging Face Whisper-tiny](https://huggingface.co/openai/whisper-tiny)
- [Coqui STT WASM](https://github.com/coqui-ai/STT)
