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
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoElement = document.getElementById('webcam');
        videoElement.srcObject = stream;
        console.log("Camera started successfully!");
        videoElement.style.transform = "scaleX(-1)";
    } catch (error) {
        console.error("Error accessing camera:", error);
        alert("Could not access camera. Please check permissions and ensure DroidCam is running.");
    }
}
window.addEventListener('load', startCamera);
