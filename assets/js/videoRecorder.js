const recorderContainer = document.getElementById("jsRecordContainer");
const recordBtn = document.getElementById("jsRecordBtn");
const videoPreview = document.getElementById("jsVideoPreview");

let streamObject;
let videoRecorder;

const handleVideoData = event => {
  console.log(event.data);
};

const stopRecording = () => {
  videoRecorder.stop();
  recordBtn.removeEventListener("click", stopRecording);
  recordBtn.addEventListener("click", getVideo);
  recordBtn.innerHTML = "Start Recording";
};

const startRecording = () => {
  videoRecorder = new MediaRecorder(streamObject);
  videoRecorder.start();
  videoRecorder.addEventListener("dataavailable", handleVideoData);
  // 데이터는 레코딩이 다 끝나야 가질 수 있음 왜냐하면 MediaRecorder가 파일 전체를 한번에 저장하기 때문이다.
  // 따라서 videoRecorder.start안에 1000이라는 인수를 넣어 1초마다 정보를 가지고 올 수 있게 한다.
  // 작은 패킷 및 데이터를 가져가고 싶을 때 이러한 방법을 사용하면 된다. (비디오의 일부분을 record하고 싶을 때)
  recordBtn.addEventListener("click", stopRecording);
};

const getVideo = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { width: 1280, height: 720 }
    });
    videoPreview.srcObject = stream;
    videoPreview.muted = true;
    videoPreview.play();
    recordBtn.innerHTML = "Stop Recording";
    streamObject = stream;
    startRecording();
  } catch (error) {
    recordBtn.innerHTML = "😥 Can't Record";
  } finally {
    recordBtn.removeEventListener("click", getVideo);
  }
};

function init() {
  recordBtn.addEventListener("click", getVideo);
}

if (recorderContainer) {
  init();
}
