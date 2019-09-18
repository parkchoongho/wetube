# Custom Video Player

### Starting the Video Player

VideoPlayer를 Custom하게 만드는 작업

mixins에 videoPlayer.pug 작성

```jade
mixin videoPlayer(video = {})
    .videoPlayer
        video(src=`/${video.src}`)
        .videoPlayer__controls
            .videoPlayer__column
                span
                    i.fas.fa-volume-up
                span
                    |00:00 / 10:00
            .videoPlayer__column
                span
                    i.fas.fa-play
            .videoPlayer__column
                span
                    i.fas.fa-expand
```

videoDetail. pug에 videoPlayer.pug 추가

```jade
extends layouts/main
include mixins/videoPlayer

block content
    .video-detail__container
        +videoPlayer({
            src: video.fileUrl
        })
        .video__info
            if loggedUser && video.creator.id === loggedUser.id
                a(href=routes.editVideo(video.id))
                    button Edit video
            h5.video__title=video.title
            p.video__description=video.description
            if video.views === 1
                span.video__views 1 view
            else 
                span.video__views #{video.views} views
            .video__author
                |Uploaded By 
                a(href=routes.userDetail(video.creator.id))=video.creator.name
        .video__comments
            if video.comments.length === 1
                span.video__comment-number 1 comment
            else
                span.video__comment-number #{video.comments.length} comments
```

### 기능 동작 작업

기능이 동작하도록하는 작업을 assets/js/videoPlayer.js에 한다.

자바스크립트 파일은 모든 페이지에 로드 되므로 특정 페이지에서만 작동되고 다른페이지에서는 오류를 부를 수 있다. 따라서 이를 Handling할 코드가 반드시 필요하다.

```javascript
const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayButton");

function handlePlayClick() {
    if (videoPlayer.paused) {
        videoPlayer.play();
    } else {
        videoPlayer.pause();
    }
}

function init() {
    playBtn.addEventListener("click", handlePlayClick);
}

if (videoContainer) {
    init();
}
```

videoPlayer를 init함수 안에 안쓰고 바깥에 쓴 이유는 다른 함수에서도 사용하기 위함이다.

Mozilla MDN에서 Video Tag에 어떤 요소들을 가져다 쓸 수 있는지 확인할 것.

https://developer.mozilla.org/ko/docs/Web/API/HTMLMediaElement

### Mute/Unmute 동작 작업

```javascript
const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayButton");
const volumeBtn = document.getElementById("jsVolumeBtn");

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
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        videoPlayer.muted = true;
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

function init() {
    playBtn.addEventListener("click", handlePlayClick);
    volumeBtn.addEventListener("click", handleVolumeClick);
}

if (videoContainer) {
    init();
}
```

### FullScreen 동작 작업

FullScreen 동작은 위처럼 단순히 값을 받아와 전체화면으로 만들 수 없다. 따라서 전체화면으로 만든 후, EventListener를 바꾸는 작업을 한다. (원래화면으로 만드는 기능)

https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullScreen

vendor prefix란, 이 함수들은 안된다는 의미이다. (문서 참조)

vendor prefix: webkit => 앞에 webkit을 붙여야 그 브라우저에서 사용가능하다는 의미.

=> requestFullScreen()이 아직 구글 크롬에서 지원하지 않으므로, webkit이라는 구글 크롬이 제공하는 엔진을 사용한다. webkitRequestFullScreen()

```javascript
const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayButton");
const volumeBtn = document.getElementById("jsVolumeBtn");
const fullScrnBtn = document.getElementById("jsFullScreen");

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
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        videoPlayer.muted = true;
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

function exitFullScreen() {
    fullScrnBtn.innerHTML = '<i class="fas fa-expand"></i>';
    fullScrnBtn.addEventListener("click", goFullScreen);
    document.webkitExitFullscreen();
}

function goFullScreen() {
    videoContainer.webkitRequestFullscreen();
    fullScrnBtn.innerHTML = '<i class="fas fa-compress"></i>';
    fullScrnBtn.removeEventListener("click", goFullScreen);
    fullScrnBtn.addEventListener("click", exitFullScreen);
}

function init() {
    playBtn.addEventListener("click", handlePlayClick);
    volumeBtn.addEventListener("click", handleVolumeClick);
    fullScrnBtn.addEventListener("click", goFullScreen);
}

if (videoContainer) {
    init();
}
```

### 영상 시간 처리 작업

영상 시간은 기본적으로 우리가 편하게 보는 형태의 문자열로 전환해야 한다. videoPlayer.duration으로 값을 받아와서 문자열로 return하는 함수를 만들고 이를 각각의 document 객체에 뿌리는 작업을 수행한다.

videoPlayer.js 수정

```javascript
const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayButton");
const volumeBtn = document.getElementById("jsVolumeBtn");
const fullScrnBtn = document.getElementById("jsFullScreen");
const currentTime = document.getElementById("jsCurrentTime");
const totalTime = document.getElementById("jsTotalTime");

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
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        videoPlayer.muted = true;
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

function exitFullScreen() {
    fullScrnBtn.innerHTML = '<i class="fas fa-expand"></i>';
    fullScrnBtn.addEventListener("click", goFullScreen);
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullScreen) {
        document.webkitExitFullScreen();
    } else if (document.msExitFullScreen) {
        document.msExitFullScreen();
    }
}

function goFullScreen() {
    if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
    } else if (videoContainer.mozRequestFullScreen) {
        videoContainer.mozRequestFullScreen();
    } else if (videoContainer.webkitRequestFullScreen) {
        videoContainer.webkitRequestFullScreen();
    } else if (videoContainer.msRequestFullScreen) {
        videoContainer.msRequestFullScreen();
    }

    fullScrnBtn.innerHTML = '<i class="fas fa-compress"></i>';
    fullScrnBtn.removeEventListener("click", goFullScreen);
    fullScrnBtn.addEventListener("click", exitFullScreen);
}

const formatDate = seconds => {
    const secondsNumber = parseInt(seconds, 10);
    let hours = Math.floor(secondsNumber / 3600);
    let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
    let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

    if (hours < 10) {
        hours = `0${hours}`;
    }
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    if (totalSeconds < 10) {
        totalSeconds = `0${totalSeconds}`;
    }
    return `${hours}:${minutes}:${totalSeconds}`;
};

function getCurrentTime() {
    currentTime.innerHTML = formatDate(videoPlayer.currentTime);
}

function setTotalTime() {
    totalTime.innerHTML = formatDate(videoPlayer.duration);
    setInterval(getCurrentTime, 1000);
}

function init() {
    playBtn.addEventListener("click", handlePlayClick);
    volumeBtn.addEventListener("click", handleVolumeClick);
    fullScrnBtn.addEventListener("click", goFullScreen);
    videoPlayer.addEventListener("loadedmetadata", setTotalTime);
}

if (videoContainer) {
    init();
}
```

videoPlayer.pug 수정

```jade
mixin videoPlayer(video = {})
    .videoPlayer#jsVideoPlayer
        video(src=`/${video.src}`)
        .videoPlayer__controls
            .videoPlayer__column
                span#jsVolumeBtn
                    i.fas.fa-volume-up
                span
                    span#jsCurrentTime 00:00:00
                    |/ 
                    span#jsTotalTime  00:00:00
            .videoPlayer__column
                span#jsPlayButton
                    i.fas.fa-play
            .videoPlayer__column
                span#jsFullScreen
                    i.fas.fa-expand
```

