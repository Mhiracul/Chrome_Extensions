const customCSS = `
  /* Add your CSS styles here */
  button.stop-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .stop-dot {
    width: 12px;
    height: 12px;
    background-color: red;
    border-radius: 50%;
  }
`;

// Create a style element and add your CSS rule
const styleElement = document.createElement("style");
styleElement.textContent = customCSS;

// Append the style element to the document's head
document.head.appendChild(styleElement);

console.log("Hi, I have been injected whoopie!!!");

var recordingBar = null;
let stopButton = null;
let pauseButton = null;
let cameraToggle = null;
let audioToggle = null;
let isPaused = false;

function createRecordingBar() {
  recordingBar = document.createElement("div");
  recordingBar.textContent = "Recording in progress...";
  recordingBar.style.position = "fixed";
  recordingBar.style.bottom = "0";
  recordingBar.style.left = "0";
  recordingBar.style.borderRadius = "20px";
  recordingBar.style.border = "2px solid #ccc";
  recordingBar.style.backgroundColor = "black"; // Customize the styling
  recordingBar.style.color = "white";
  recordingBar.style.padding = "30px";
  recordingBar.style.zIndex = "9999"; // Ensure it's above other content
  recordingBar.id = "recordingBar"; // Add an ID to easily remove it later
  document.body.appendChild(recordingBar);

  stopButton = document.createElement("button");
  stopButton.className = "stop-button"; // Apply the CSS class
  stopButton.innerHTML = '<div class="stop-dot"></div>';
  stopButton.style.marginLeft = "10px";
  stopButton.style.color = "white";
  stopButton.addEventListener("click", stopRecording);
  recordingBar.appendChild(stopButton);
  pauseButton = document.createElement("button");
  updatePauseButtonIcon();

  pauseButton.style.marginLeft = "10px";
  pauseButton.addEventListener("click", togglePauseRecording);
  recordingBar.appendChild(pauseButton);

  // Create a camera toggle inside the recording bar
  cameraToggle = document.createElement("button");
  cameraToggle.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 9.23V2h18v20H3v-7.23l-2-2zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4-10h-2v2h2V6zm-4 0H8v2h4V6z" fill="white"/></svg>';
  cameraToggle.style.marginLeft = "10px";
  cameraToggle.addEventListener("click", toggleCamera);
  recordingBar.appendChild(cameraToggle);

  // Create an audio toggle inside the recording bar
  audioToggle = document.createElement("button");
  audioToggle.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 9v6h4l5 5V4L10 9H6z" fill="white"/></svg>';
  audioToggle.style.marginLeft = "10px";
  audioToggle.addEventListener("click", toggleAudio);
  recordingBar.appendChild(audioToggle);
}

function removeRecordingBar() {
  if (recordingBar) {
    recordingBar.parentElement.removeChild(recordingBar);
    recordingBar = null;
  }
}

function stopRecording() {
  if (recorder) {
    recorder.stop();
    removeRecordingBar();
  }
}

function togglePauseRecording() {
  if (recorder) {
    if (recorder.state === "recording") {
      recorder.pause();
      isPaused = true;
    } else if (recorder.state === "paused") {
      recorder.resume();
      isPaused = false;
    }
    updatePauseButtonIcon();
  }
}

function updatePauseButtonIcon() {
  if (isPaused) {
    pauseButton.innerHTML = '<img src="framee.svg" width="20" height="20" />';
  } else {
    pauseButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 5h2v14H6zm10 0h2v14h-2z" fill="white" /></svg>';
  }
}

function toggleCamera() {
  // Implement camera toggle logic here
}

function toggleAudio() {
  // Implement audio toggle logic here
}
var recorder = null;
function onAccessApproved(stream) {
  recorder = new MediaRecorder(stream);

  recorder.start();
  createRecordingBar();
  recorder.onstop = function () {
    stream.getTracks().forEach(function (track) {
      if (track.readyState === "live") {
        track.stop();
      }
    });
    removeRecordingBar();
  };

  recorder.ondataavailable = function (event) {
    let recordedBlob = event.data;

    let formData = new FormData();
    formData.append("video", recordedBlob, "screen-recording.webm");

    fetch("http://localhost:3000/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Video uploaded:", data.message);

        // Redirect to the next page with the video URL as a query parameter
        window.location.href = `/next-page?videoURL=${encodeURIComponent(
          data.videoURL
        )}`;
      })
      .catch((error) => {
        console.error("Error uploading video:", error);
      });

    let url = URL.createObjectURL(recordedBlob);

    let a = document.createElement("a");

    a.style.display = "none";
    a.href = url;
    a.download = "screen-recording.webm";

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "request_recording") {
    console.log("requesting recording");

    sendResponse(`processed: ${message.action}`);

    navigator.mediaDevices
      .getDisplayMedia({
        audio: true,
        video: {
          width: 9999999999,
          height: 9999999999,
        },
      })
      .then((stream) => {
        onAccessApproved(stream);
      });
  }

  if (message.action === "stopvideo") {
    console.log("stopping video");
    sendResponse(`processed: ${message.action}`);
    if (!recorder) return console.log("no recorder");

    recorder.stop();
  }
});