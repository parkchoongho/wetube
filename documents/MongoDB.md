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