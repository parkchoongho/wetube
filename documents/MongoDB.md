## 1. MongoDB &  Mongoose

**실제 데이터베이스와 연동하기 전에 가짜 데이터베이스를 만들어서 적용시켜보는 것은 좋은 방법이다.**

### MongoDB

많은 데이터베이스들이 존재하는데, 크게 SQL과 NoSQL로 구분된다. 

MongoDB는 NoSQL 기반이며 더 적은 규칙과 절차로 작업이 가능한 데이터베이스이다. 

(예를 들어, 실시간 채팅을 만드는데 있어 MongoDB는 적합한 DataBase라 할 수 있다.)

MongfoDB를 설치한 후에는 MongoDB를 JavaScript와 연결하는데 이를 위해서는 Adapter가 필요하다. 이것을 실행해주는 Adapter가 바로 Mongoose이다.

### Mongoose

Mongoose는 MongoDB 기반 ODM (Object Data Mapping) NodeJS 전용라이브러리이다. ODM은 데이터베이스와 객체지향 프로그래밍 언어 사이에 호환되지 않는 데이터를 변환해주는 프로그래밍 기법이다. 다시 말해, MongoDB 데이터를 JavaScript 객체로 사용할 수 있게 도와주는 라이브러리 입니다. 

```powershell
PS C:\Users\user\Desktop\revieWetube> npm install mongoose
```

MongoDB와 Mongoose를 설치한 후, db.js에 있는 가짜 데이터베이스를 지우고 MongoDB와 연결한다.

### Dotenv

웹 개발을 하다보면 **포트, DB 관련 정보** 같이 웹에 전역적으로 필요한 정보들이 존재한다. NodeJS에서는 dotenv 패키지를 활용해 환경 변수 파일을 외부에 생성하고 관리할 수 있다. Github에 프로젝트를 올릴 때에도 DB 계정정보와 같은 내용들은 올려서는 안되는데, 이럴 때 외부 파일에 코드를 작성하고 .gitignore을 활용해 그 코드를 제외시키고 프로젝트를 관리할 수 있다.

```powershell
PS C:\Users\user\Desktop\revieWetube> npm install dotenv
```

dotenv는 어떤부분을 숨기고 싶을 때 사용한다. (예를 들어, Open Source 프로젝트를 하고 있을 때, 데이터베이스를 숨기고 싶은 경우.)

**dotenv 설정**

1. 프로젝트 폴더 밑에 `.env` 파일 생성

```
MONGO_URL="mongodb://localhost:27017/wetube"
PORT=3000
```

2. `db.js`에 아래와 같이 코드 입력

```javascript
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useFindAndModify: false
});

const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = err => console.log(`❌ Error on DB Connection: ${err}`);

db.once("open", handleOpen);
db.on("error", handleError);
```

`dotenv.config()` 를 사용하면 자동으로 `.env` 파일안에 있는 정보를 불러와 사용할 수 있다. 그리고 찾은 모든 정보들을 process.env.key에 저장한다. key가 `.env` 파일안에 변수명이 된다.

3. init.js`에도 코드 입력

```javascript
import "./db";
import app from "./app";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

const handleListening = () =>
  console.log(`✅ Listening on port: http://localhost:${PORT}`);

app.listen(PORT, handleListening);
```

4. 이후,  `.gitignore` 파일에 .env를 파일을 추가. (.gitignore 파일을 생성하면 .env 파일이 이미 추가되어있음. 혹시 없다면 .env 파일을 추가하여 github에서 .env파일을 확인할 수 없게 한다.)

위 작업을 통해 내 데이터베이스 URL을 숨길 수 있다.

### Model 생성

MongoDB의 장점은 document를 줄여준다는 것이다. document의 대표적인 예는 JSON 파일이 있다. MongoDB에 Model이 어떻게 구성되는지 알려주어야 한다.

참고문헌: https://sjh836.tistory.com/98

models라는 폴더를 생성하고 그 밑에 Video.js(Model 파일임을 알기 위해 첫 글자를 대문자로 한다.) 파일을 생성한다.

```javascript
import mongoose from "mongoose";
// model은 document 이름이자 실제 data이고 schema는 형태를 의미한다.

const VideoSchema = new mongoose.Schema({
  fileUrl: {
  // 영상 파일 자체를 Database에 저장하면 너무 무거워지므로 Url을 참조하는 방식을 사용. 영상의 주소를 저장.
    type: String,
    required: "File URL is required" 
    // fileUrl 값이 없으면 이 "File URL is required"를 값으로 취한다.
  },
  title: {
    type: String,
    required: "Title is required"
  },
  description: String, 
  // configuration이 필요하면 (다른 옵션을 줘야하면 object로 생성 예를 들어, required나 default 값을 추가적으로 주는 것) 위 처럼 객체로 작성하고 필요 없으면 이렇게 한줄로 작성. 
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const model = mongoose.model("Video", VideoSchema);
// 위에서 작성한 Schema를 통해 Model 작성
export default model;
// 여기까지 작성하면 Database와 연결은 되어있지만 거기에 model이 있다는 것은 DB가 인지 못하는 상태.
```

mongoose documentation schema section에서 모든 option을 확인가능하다.

위 코드를 완성한 후 init.js에 아래 코드를 추가해 Database가 model이 있다는 것을 인지할 수 있게한다.

```javascript
import "./models/Video";
```

### Data Relationship

Data간의 관계를 설정하는 것은 매우 중요한 작업이다. (예를 들어, Video에 Comment를 달때, Comment Model과 Video Model을 어떻게 연관시킬 것인가)

=> 크게 2가지 방법이 있다.

1. Comment 모델은 그대로 두고 Video 모델에 해당 비디오에 소속되어 있는 Comment ID가 담긴 array를 추가하는 방법.

```javascript
import mongoose from "mongoose";
// model은 document 이름이자 실제 data이고 schema는 형태를 의미한다.

const VideoSchema = new mongoose.Schema({
  fileUrl: {
    // 영상 파일 자체를 Database에 저장하면 너무 무거워지므로 Url을 참조하는 방식을 사용. 영상의 주소를 저장.
    type: String,
    required: "File URL is required" // fileUrl 값이 없으면 이 "File URL is required"를 값으로 취한다.
  },
  title: {
    type: String,
    required: "Title is required"
  },
  description: String,
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }]
});

// 위에서 작성한 Schema를 통해 Model 작성

const model = mongoose.model("Video", VideoSchema);
export default model;
// 여기까지 작성하면 Database와 연결은 되어있지만 거기에 model이 있다는 것은 DB가 인지 못하는 상태.
```

2. Commet 모델에 해당 Video에 아이디를 주는 방법.

```javascript
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: "Text is required"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video"
  }
});

const model = mongoose.model("Comment", commentSchema);

export default model;
```

둘다 각각에 연결된 모델 객체의 ID만을 저장한다. (수업에서는 첫 번째 방법을 사용)

### 컨트롤러에 연결하기

컨트롤러에 모델을 연결하기 위해 아래의 코드 videoController 파일에 추가

```javascript
import Video from "../models/Video" 
// 모델을 연결한 것이지, Database의 요소를 연결한 것 아니다. (요소를 받는 통로이지, 요소 자체가 아니다.)=> 꼭 기억할것. 중요한 개념
```

### Async

JavaScript는 어떤 명령이 다 끝날때 까지 기다리게 끔 프로그래밍 되어 있지않다. 

=> JavaScript는 한번에 여러가지일을 handling할 수 있게끔 만들어져 있다.

```javascript
export const home = (req, res) => {
  const videoList = Video.find({});
  res.render("home", { pageTitle: "Home", videoList });
};
```

위 코드에서 비디오를 찾으면서 동시에 home 파일을 찾아서 rendering한다. 따라서 자바스크립트가 video를 다 찾은 다음에 화면을 렌더링하게끔 코드를 변경해야 하는데, 이 때 사용하는 것이 async 키워드이다.

```javascript
export const home = async (req, res) => {
    const videoList = await Video.find({}); 
    // 이렇게 하면 Database에 있는 모든 비디오를 가지고 온다.
    res.render("home", { pageTitle: "Home", videoList });
};
// 자바스크립트에세 이건 다 기다리고 다음 작업을 수행해야돼! 라고 알리는 것과 같다.await은 다음 과정이 끝날때 까지 잠시 기다려달라는 의미.(await 키워드는 반드시 async 함수 안에서만 사용할 수 있다.) 
```

await은 성공적으로 작업이 종료되는 것이 아니라, 끝나면 (에러가 발생해도 그 작업은 종료) 다음 작업을 실행하는 것. 따라서 async는 발생하는 에러를 handling해주지 않는다. 에러를 handling하기 위해서는 try catch 구문을 활용하여 코드를 작성한다.

```javascript
export const home = async (req, res) => {
    try {
        const videoList = await Video.find({});
        res.render("home", { pageTitle: "Home", videoList });
    } catch (error) {
        console.log(error);
        res.render("home", { pageTitle: "Home", videoList: [] });
    }
};

// try는 정상적으로 작동할 때, 만약에 실패하면 catch (error가 throw되면 이를 catch하겠다!)안을 실행하게끔 해서 error을 handling한다. 이렇게 코드를 짜면 에러가 발생해도 home 화면을 rendering 해서 유저에게 보여줄 수 있다.(NodeJS가 작동을 멈추지 않는다.)
```

### 파일 업로드

먼저 비디오를 업로드할 때, 비디오말고 다른 형식의 파일들은 업로드할 수 없도록 작업한다.

```jade
extends layouts/main

block content
    .form-container
        form(action=`/videos${routes.upload}`, method="post", enctype="multipart/form-data")
            label(for="file") Video File
            input(type="file", id="file", name="videoFile", required=true, accept="video/*")
            input(type="text", placeholder="Title", name="title", required=true)
            textarea(placeholder="Description", name="description", required=true)
            input(type="submit", value="Upload Video")
```

accept 속성을 활용하면 특정 형태의 파일만 업로드 하게끔 제한할 수 있다.

그 다음 postUpload Controller를 확인해보자.

```javascript
export const postUpload = (req, res) => {
  console.log(req.body);
  const {
    body: { file, title, description }
  } = req;
  // TO DO: Upload and Save Video
  res.redirect(routes.videoDetail(324393));
};
```

여기서 `console.log` 를 활용해 데이터를 콘솔에 찍어보면 file 자체를 받아오는 것을 확인할 수 있다.

파일을 업로드하고 그 파일이 아닌, 파일의 위치를 데이터에 저장해야 한다. (파일 자체를 저장하면 데이터베이스가 너무 무거워지기 때문이다.) 따라서 파일을 업로드하고 파일 경로(URL)를 반환하는 MiddleWare가 필요하다. 이 MiddleWare를 **multer**라고 한다. 

```jade
extends layouts/main

block content
    .form-container
        form(action=`/videos${routes.upload}`, method="post", enctype="multipart/form-data")
            label(for="file") Video File
            input(type="file", id="file", name="videoFile", required=true, accept="video/*")
            input(type="text", placeholder="Title", name="title", required=true)
            textarea(placeholder="Description", name="description", required=true)
            input(type="submit", value="Upload Video")
```

위 코드 처럼 전체 form에 `enctype = "multipart/form-data"`를 추가해야한다. (파일을 내보내는 것이기 때문에 form의 encoding 형식이 달라야 한다.)

multer를 설치하고 middlewares.js 파일에서 multer를 import해 코드를 작성한다.

```powershell
PS C:\Users\user\Desktop\Project\wetube> npm install multer
```

```javascript
import multer from "multer";
import routes from "./routes";

const multerVideo = multer({ dest: "videoList/" });

export const localsMiddleWare = (req, res, next) => {
  res.locals.siteName = "WeTube";
  res.locals.routes = routes;
  res.locals.user = {
    isAuthenticated: true,
    id: 1
  };
  next();
};

export const uploadVideo = multerVideo.single("videoFile");

// single은 오직 하나의 파일만 업로드 할 수 있다는 것을 의미힌다. single()안에는 html에서 넘어온 input중에서 원하는 input의 name 속성 값을 담으면 된다.
```

그 뒤, videoRouter.js 파일에서 upload url post 요청 url에 해당 MiddleWare를 추가한다.

```javascript
import { uploadVideo } from "../middlewares";
videoRouter.post(routes.upload, uploadVideo, postUpload);
```

파일을 업로드하면 server에 있는 folder(videoList 폴더)에 업로드되고 그 다음, postUpload function은 해당 file의 url에 접근한다. 이제 postUpload Controller로 가는 req 값에 file이 들어가 있다. req.file.path 값에 해당 파일의 url이 담겨있다.

```javascript
export const postUpload = async (req, res) => {
    const {
        body: { title, description },
        file: { path } // file을 찍어보면 file.path에 위치 값이 찍혀서 나온다.
    } = req;
    const newVideo = await Video.create({
        fileUrl: path,
        title,
        description
    });
    res.redirect(routes.videoDetail(newVideo.id));
};
```

여기까지 완료하면 비디오를 업로드하고 이를 클라이언트 상에서 확인할 수 있다. 그런데 비디오를 재생시킬 수 없는 오류가 발생한다. 왜냐하면 link가 제대로 들어가지 않기 때문이다.

localMiddlewares.js 파일을 보자.

```javascript
import multer from "multer";
import routes from "./routes";

const multerVideo = multer({ dest: "uploads/videoList" });

export const localMiddleware = (req, res, next) => {
  res.locals.siteName = "Wetube";
  res.locals.routes = routes;
  res.locals.user = {
    isAuthenticated: true,
    id: 1
  };
  next();
};

export const uploadMulter = multerVideo.single("videoFile");
```

`{ dest: "upload/videoList" }` 라고 되어있는데, `/upload/videoList` 로 적지 않게 조심해야한다. 만약, `/upload/videoList` 로 적었다면 해당 컴퓨터의 roor에 upload폴더를 생성하고 그안에 videoList폴더를 만들고 그 안에 파일들을 저장하기 때문이다. 하지만 여전히 비디오는 보이지 않는다. `/uploads` 에 해당하는 url을 routing하지 않기 때문이다. 따라서 그 url과 파일 사이를 연결해주는 작업이 필요하다.

오류 핸들링: app.js에서 다음과 같은 코드를 추가

```javascript
app.use("/uploads", express.static());
// directory에서 파일을 보내주는 미들웨어, 하지만 이렇게 user에 해당하는 파일을 내 server에 저장하는 것은 좋은 방법이 아니다. 왜냐하면 수천명이 웹사이트를 사용한다고 할 때, 이 사용자들의 파일을 모두 server에 저장할 경우 파일이 의도치 않게 삭제되면 어떻게 할 것인가? 따라서 user가 생성한 파일들은 server와 분리되어야한다. html, css 같은 파일들은 static하게 서버에 저장해도 되지만, 유저가 생성하는 파일들을 서버에 저장하는 것은 좋지 못한 방법이다.
```

<br>