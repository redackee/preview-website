// Voice Feedback Gimmick JS

document.addEventListener('DOMContentLoaded', function() {
  // Vosk WASM integration scaffolding
  let voskReady = false;
  let voskRecognizer = null;

  // Load Vosk WASM model (instructions: place model files in assets/wasm/)
  async function loadVosk() {
    if (window.Vosk) {
      const modelPath = '/assets/wasm/vosk-model-small-en-us-0.15';
      voskRecognizer = new window.Vosk.Recognizer({modelPath});
      await voskRecognizer.init();
      voskReady = true;
    } else {
      console.warn('Vosk WASM not loaded. Please include Vosk WASM JS and model files.');
    }
  }
  // Attempt to load Vosk on page load
  loadVosk();
  const avatar = document.getElementById('voice-feedback-avatar');
  const micImg = document.getElementById('mic-avatar-img');
  let recording = false;
  let recordTimeout;
  let mediaRecorder;
  let audioChunks = [];

  // Create feedback modal
  const feedbackModal = document.createElement('div');
  feedbackModal.id = 'voice-feedback-modal';
  feedbackModal.style.display = 'none';
  feedbackModal.style.position = 'fixed';
  feedbackModal.style.left = '50%';
  feedbackModal.style.top = '50%';
  feedbackModal.style.transform = 'translate(-50%, -50%)';
  feedbackModal.style.background = '#fff';
  feedbackModal.style.borderRadius = '16px';
  feedbackModal.style.boxShadow = '0 4px 24px rgba(44,204,64,0.15)';
  feedbackModal.style.padding = '32px';
  feedbackModal.style.zIndex = '9999';
  feedbackModal.innerHTML = '<h3>Thank you for your feedback!</h3><div id="transcribed-text"></div><button id="close-modal">Close</button>';
  document.body.appendChild(feedbackModal);
  feedbackModal.querySelector('#close-modal').onclick = function() {
    feedbackModal.style.display = 'none';
  };

  // Play action prompt on hover
  avatar.addEventListener('mouseenter', function() {
    fetch('/FUTURE/feedback_prompts/action_prompt.txt')
      .then(r => r.text())
      .then(text => speakPrompt(text));
    avatar.classList.add('hover');
  });
  avatar.addEventListener('mouseleave', function() {
    avatar.classList.remove('hover');
  });

  // Activate recording on click or long press
  avatar.addEventListener('mousedown', function() {
    recordTimeout = setTimeout(() => startRecording(), 1000);
  });
  avatar.addEventListener('mouseup', function() {
    clearTimeout(recordTimeout);
    if (!recording) return;
    stopRecording();
  });
  avatar.addEventListener('click', function() {
    startRecording();
  });

  function speakPrompt(text) {
    if ('speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utter);
    }
  }

  function startRecording() {
    if (recording) return;
    recording = true;
    avatar.classList.add('active');
    fetch('/FUTURE/feedback_prompts/request_prompt.txt')
      .then(r => r.text())
      .then(text => speakPrompt(text));
    // Integrate MediaRecorder API
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        mediaRecorder.ondataavailable = e => {
          audioChunks.push(e.data);
        };
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          if (voskReady && voskRecognizer) {
            transcribeAudio(audioBlob);
          } else {
            showFeedbackModal('Your voice note has been recorded. Transcription coming soon.');
          }
        };
        mediaRecorder.start();
        setTimeout(() => {
          if (recording) stopRecording();
        }, 60000);
      }).catch(err => {
        showFeedbackModal('Microphone access denied or unavailable.');
      });
    } else {
      showFeedbackModal('Audio recording not supported in this browser.');
    }
  }

  function stopRecording() {
    if (!recording) return;
    recording = false;
    avatar.classList.remove('active');
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    // Feedback modal will be shown by mediaRecorder.onstop
  }

  function showFeedbackModal(text) {
    feedbackModal.style.display = 'block';
    feedbackModal.querySelector('#transcribed-text').textContent = text;
  }

  // Transcribe audio using Vosk WASM
  async function transcribeAudio(audioBlob) {
    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const result = await voskRecognizer.recognize(arrayBuffer);
      showFeedbackModal(result.text ? `Transcribed: ${result.text}` : 'No speech detected.');
    } catch (err) {
      showFeedbackModal('Transcription failed.');
      console.error(err);
    }
  }
  }
});
