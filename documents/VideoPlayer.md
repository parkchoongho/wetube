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

