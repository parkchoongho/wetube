# API&Ajax

### Ajax 란?

Ajax는 soap(simple object access protocol - XML 베이스의 프로토콜)이 아닌 Asynchronouse JavaScript and XML (비 동기 JS, XML 통신) 이다.

페이지를 어디로 넘기는 것이 아니라, 데이터만을 가져와 화면을 구성하는 방식

=> 이게 Ajax 방식

여기서는 View 숫자를 counting하는데 사용한다. 

### View 숫자 Counting

따라서 화면을 렌더링하지 않고 로직을 구성하기 위해 URL과 Controller를 활용해 http status code로 응답한다.

여기서 routes.js를 수정한다.

routes.js 수정

```javascript
// Global
const HOME = "/";
const JOIN = "/join";
const LOGIN = "/login";
const LOGOUT = "/logout";
const SEARCH = "/search";

// Users
const USERS = "/users";
const USER_DETAIL = "/:id";
const EDIT_PROFILE = "/edit-profile";
const CHANGE_PASSWORD = "/change-password";
const ME = "/me";

// Videos
const VIDEOS = "/videos";
const UPLOAD = "/upload";
const VIDEO_DETAIL = "/:id";
const EDIT_VIDEO = "/:id/edit";
const DELETE_VIDEO = "/:id/delete";

// Github
const GITHUB = "/auth/github";
const GITHUB_CALLBACK = "/auth/github/callback";

// API
const API = "/api";
const REGISTER_VIEW = "/:id/view";

const routes = {
    home: HOME,
    join: JOIN,
    login: LOGIN,
    logout: LOGOUT,
    search: SEARCH,
    users: USERS,
    userDetail: id => {
        if (id) {
            return `/users/${id}`;
        }
        return USER_DETAIL;
    },

    editProfile: EDIT_PROFILE,
    changePassword: CHANGE_PASSWORD,
    videos: VIDEOS,
    upload: UPLOAD,
    videoDetail: id => {
        if (id) {
            return `/videos/${id}`;
        }
        return VIDEO_DETAIL;
    },
    editVideo: id => {
        if (id) {
            return `/videos/${id}/edit`;
        }
        return EDIT_VIDEO;
    },
    deleteVideo: id => {
        if (id) {
            return `/videos/${id}/delete`;
        }
        return DELETE_VIDEO;
    },
    github: GITHUB,
    githubCallback: GITHUB_CALLBACK,
    me: ME,
    api: API,
    registerView: REGISTER_VIEW
};

export default routes;
```

여기서 API는 단순히 서버와 통신을 하기위한 URL이다. (유저가 접근할 수 있는 URL이 아니다.) 유저는 이 URL을 찾을 수도 없고 어떤 것도 렌더할 수 없다. 

router 폴더에 apiRouter를 생성하고 이를 app.js에 추가해준다.

```javascript
import express from "express";
import routes from "../routes";
import { postRegisterView } from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.get(routes.registerView, postRegisterView);

export default apiRouter;
```

그리고 videoController에 postRegisterView라는 함수를 생성한다.

```javascript
export const postRegisterView = async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const video = await Video.findById(id);
        video.views += 1;
        video.save();
        res.status(200);
    } catch (error) {
        res.status(400);
    } finally {
        res.end();
    }
};
```

=> 이렇게 backend단에서 그 URL로 접근하면 데이터베이스에 접근해 비디오 view가 1 증가하게끔 한다.

이렇게 API는 database로 다른 서비스와 통신하기 위해 만들어진 것이다. (View를 렌더링하지 않는다)

Backend단은 이정도로 완성되며, 이제 Frontend를 살펴보자.

### Axios 설치

axios는 HTTP요청을 handling할 수 있게 바꿔주는 라이브러리다. 메뉴얼대로 하지 않는 다른 방법을 제공한다. (메뉴얼대로 하는 방법에는 fetch가 있다.) axios는 status code에 좀 더 접근할 수 있게 해주고 요청이 어떻게 가는지를 볼 수 있다.

설치

```powershell
PS C:\Users\user\Desktop\Project\wetube> npm i axios
```

우선 viewRegister에는 fetch를 사용하고 댓글 등록에 Ajax를 사용하자.

비디오가 끝나면 View가 1이 올라가는 것을 만들고 싶기에 VideoPlayer.js를 수정한다.

VideoPlayer.js 수정

registerView 함수를 추가하고 영상이 끝나면 이 함수를 불러오게끔 코드를 수정한다.

```javascript
const registerView = () => {
    const videoId = window.location.href.split("/videos/")[1];
    fetch(`/api/${videoId}/view`, {
        method: "POST"
    });
};

// window.location.href는 현재 내가 있는 url을 반환한다. 지금 현재 필요한것은 비디오 id이므로 split함수를 이용해 string을 분할하고 내가 필요한 id 부분만 배열 index로 접근해 가지고 온다.

function handleEnded() {
    registerView();
    videoPlayer.currentTime = 0;
    playBtn.innerHTML = '<i class="fas fa-undo-alt"></i>';
}
```

postRequest를 하는 이유는 database를 변경하는 요청이기 때문이다. (database를 변경할 필요가 없으면 getRequest이고 변경사항이 있으면 postRequest이다.)

apiRouter.js도 get요청을 post로 바꾼다.

```javascript
import express from "express";
import routes from "../routes";
import { postRegisterView } from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post(routes.registerView, postRegisterView);

export default apiRouter;
```

