const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayBtn");
const volumeBtn = document.getElementById("jsVolumeBtn");
const screenBtn = document.getElementById("jsScreenBtn");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const videoDragVolume = document.getElementById("jsVolume");

const postRegisterView = () => {
  const videoId = window.location.href.split("/videos/")[1];
  fetch(`/api/${videoId}/view`, {
    method: "POST"
  });
};

function handlePlayClick() {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    videoPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
}

function handleVolumeClick() {
  if (videoPlayer.muted) {
    videoPlayer.muted = false;
    videoDragVolume.value = videoPlayer.volume;
    volumeBtn.innerHTML = `<i class="fas fa-volume-up"></i>`;
  } else {
    videoDragVolume.value = 0;
    videoPlayer.muted = true;
    volumeBtn.innerHTML = `<i class="fas fa-volume-mute"></i>`;
  }
}

function outFullScreen() {
  document.exitFullscreen();
  screenBtn.innerHTML = '<i class="fas fa-expand"></i>';
  screenBtn.removeEventListener("click", outFullScreen);
  screenBtn.addEventListener("click", goFullScreen);
}

function goFullScreen() {
  videoContainer.requestFullscreen();
  screenBtn.innerHTML = '<i class="fas fa-compress"></i>';
  screenBtn.removeEventListener("click", goFullScreen);
  screenBtn.addEventListener("click", outFullScreen);
}

const formatDate = time => {
  const secondsNumber = parseInt(time, 10);
  const hours = Math.floor(secondsNumber / 3600);
  const minutes = Math.floor((secondsNumber - hours * 3600) / 60);
  const seconds = secondsNumber - (hours * 3600 + minutes * 60);

  return `${hours < 10 ? `0${hours}` : `${hours}`}:${
    minutes < 10 ? `0${minutes}` : `${minutes}`
  }:${seconds < 10 ? `0${seconds}` : `${seconds}`} `;
};

function getCurrentTime() {
  const currentTimeString = formatDate(videoPlayer.currentTime);
  currentTime.innerHTML = currentTimeString;
}

function setTotalTime() {
  const totalTimeString = formatDate(videoPlayer.duration);
  totalTime.innerHTML = totalTimeString;
  setInterval(getCurrentTime, 1000);
}

function handleEnded() {
  postRegisterView();
  videoPlayer.currentTime = 0;
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function volumeDrag(event) {
  // console.log(event.target.value);
  const {
    target: { value }
  } = event;
  videoPlayer.volume = value;
  if (videoPlayer.volume >= 0.7) {
    volumeBtn.innerHTML = `<i class="fas fa-volume-up"></i>`;
  } else if (videoPlayer.volume >= 0.3) {
    volumeBtn.innerHTML = `<i class="fas fa-volume-down"></i>`;
  } else if (videoPlayer.volume > 0) {
    volumeBtn.innerHTML = `<i class="fas fa-volume-off"></i>`;
  } else {
    volumeBtn.innerHTML = `<i class="fas fa-volume-mute"></i>`;
  }
}

function init() {
  videoPlayer.volume = 0.5;
  playBtn.addEventListener("click", handlePlayClick);
  volumeBtn.addEventListener("click", handleVolumeClick);
  screenBtn.addEventListener("click", goFullScreen);
  videoPlayer.addEventListener("loadedmetadata", setTotalTime);
  videoPlayer.addEventListener("ended", handleEnded);
  videoDragVolume.addEventListener("input", volumeDrag);
}

if (videoContainer) {
  init();
}
