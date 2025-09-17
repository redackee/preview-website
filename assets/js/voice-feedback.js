// Voice Feedback Gimmick JS

document.addEventListener('DOMContentLoaded', function() {
  const avatar = document.getElementById('voice-feedback-avatar');
  const micImg = document.getElementById('mic-avatar-img');
  let recording = false;
  let recordTimeout;

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
    // TODO: Integrate MediaRecorder/Web Audio API here
    // Limit to 1 minute
    setTimeout(stopRecording, 60000);
  }

  function stopRecording() {
    if (!recording) return;
    recording = false;
    avatar.classList.remove('active');
    // TODO: Handle recorded audio, transcription, and feedback modal
  }
});
