function speak(text) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(voice => voice.name.includes("Google US English")) || voices[0];
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
  console.log("Speaking:", text);
}
window.speechSynthesis.onvoiceschanged = () => {
};
const buttons = document.querySelectorAll(".button");
buttons.forEach(button => {
  button.addEventListener("click", () => {
    const texttosay = button.innerText;
    speak(texttosay);
  });
});
