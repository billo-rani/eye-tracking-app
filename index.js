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
const calibrationPoints = [
    { x: 0.1, y: 0.1, label: "TL" },
    { x: 0.9, y: 0.1, label: "TR" },
    { x: 0.5, y: 0.5, label: "C" },
    { x: 0.1, y: 0.9, label: "BL" },
    { x: 0.9, y: 0.9, label: "BR" }
];
let currentCalibrationIndex = 0;
let savedCalibrationData = null;
const calPanel = document.getElementById('calibration-panel');
const calDotsContainer = document.getElementById('calibration-dots');
const startCalBtn = document.getElementById('start-calibration');
const saveCalBtn = document.getElementById('save-calibration');
function createCalibrationDots() {
    calDotsContainer.innerHTML = '';
    calibrationPoints.forEach((point, index) => {
        const dot = document.createElement('div');
        dot.classList.add('cal-dot');
        dot.style.left = (point.x * 100) + '%';
        dot.style.top = (point.y * 100) + '%';
        dot.dataset.index = index;
        calDotsContainer.appendChild(dot);
    });
}
startCalBtn.addEventListener('click', () => {
    calPanel.classList.add('active');
    startCalBtn.style.display = 'none';
    saveCalBtn.style.display = 'none';
    currentCalibrationIndex = 0;
    createCalibrationDots();
    highlightNextDot();
    alert("Calibration Started! Look at the RED dot and blink when it turns GREEN.");
});
function highlightNextDot() {
    if (currentCalibrationIndex >= calibrationPoints.length) {
        finishCalibration();
        return;
    }
    document.querySelectorAll('.cal-dot').forEach(d => d.classList.remove('active'));
    const dots = document.querySelectorAll('.cal-dot');
    if (dots[currentCalibrationIndex]) {
        dots[currentCalibrationIndex].classList.add('active');
        console.log(`Look at dot ${currentCalibrationIndex + 1} of ${calibrationPoints.length}`);
    }
}
function finishCalibration() {
    calPanel.classList.remove('active');
    startCalBtn.style.display = 'inline-block';
    startCalBtn.innerText = "Re-Calibrate";
    alert("Calibration Complete! You can now use the app.");
}
function checkGazeOnDot(gazeX, gazeY) {
    if (currentCalibrationIndex >= calibrationPoints.length) return;
    const target = calibrationPoints[currentCalibrationIndex];
    const distance = Math.sqrt(Math.pow(gazeX - target.x, 2) + Math.pow(gazeY - target.y, 2));
    if (distance < 0.15) {
        console.log("Looking at target!");
        setTimeout(() => {
            currentCalibrationIndex++;
            highlightNextDot();
        }, 1000);
    }
}
calDotsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('cal-dot') && calPanel.classList.contains('active')) {
        const index = parseInt(e.target.dataset.index);
        if (index === currentCalibrationIndex) {
            currentCalibrationIndex++;
            highlightNextDot();
        }
    }
});