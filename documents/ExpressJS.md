## 1. What is Server?

Server란 컴퓨터다. 인터넷에 연결된 컴퓨터💻.

**소프트웨어적 서버 => 인터넷에 연결된 덩어리의 코드**

종합해서 Server란 접속을 받고 접속을 기다리는 Something이다.

<br>

## 2. What is ExpressJS?

**NodeJS 프레임워크**(몇 줄 코드 입력으로 서버를 만들 수 있다.)

#### 프레임워크란? 👨‍🏫

이미 완성되어있는 형태로서 원하는걸 더 빨리 만들 수 있게하는 장치, 이미 많은 코드로 작성되어있어 우리가 가져다 쓸 수 있는 장치

안정적이고 완성도가 높아 버전업이 많지 않다.

<br>

## 3. What is npm?

**Node Package Manager**의 줄임말로 번거로움을 해결해주는 일종의 **패키지모음** 

예를 들어, 만일 Express.JS 버전을 다운받아서 그 파일을 내 코드에 적용시켜 서버를 만들었다고 하자. 그랬을때, 만약 Express 버전이 업그레이드 됐다면 우리는 이걸 다시 다운받아서 내 코드에 다시 적용시키는 번거로움을 겪어야한다. 이런 번거로움을 덜어주는 것이 바로 **npm**이다. 

(Node.js관련 패키지가 모두 모여있는 Node.js 패키지 총 집합이라 생각하면 됨.)

Node.js를 다운받을 때, 자동으로 npm도 다운로드된다.

**npm을 실행할 때는 반드시 package.json 파일이 있는 폴더에서 명령을 내려야 한다.**

만일 그 파일이 없는 곳에서 실행하면,  package.json 파일을 읽어오지 못해 그 폴더에 다시 package.json 파일을 생성한다.

### npm 설치 코드

```shell
PS C:\Users\user\Desktop\Project\wetube> ls
PS C:\Users\user\Desktop\Project\wetube> node .\index.js
Hi!
PS C:\Users\user\Desktop\Project\wetube> npm -v
6.4.1
PS C:\Users\user\Desktop\Project\wetube> npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help json` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (wetube)
version: (1.0.0)
description: Cloning Youtube with Vanilla and NodeJS
entry point: (index.js)
test command:
git repository:
keywords:
author: Park Choong Ho
license: (ISC)
About to write to C:\Users\user\Desktop\Project\wetube\package.json:

{
  "name": "wetube",
  "version": "1.0.0",
  "description": "Cloning Youtube with Vanilla and NodeJS",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Park Choong Ho",
  "license": "ISC"
}


Is this OK? (yes) y
=> 여기까지 진행하면 package.json 파일이 생성된다. 파일 안에는 위 JSON 파일이 담겨 있다. 여기서 
"scripts": {
	"test": "echo \"Error: no test specified\" && exit 1"
}
이 부분은 지우던데 이유가 멀까?
==========================================
PS C:\Users\user\Desktop\Project\wetube> npm install express
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN wetube@1.0.0 No repository field.

+ express@4.17.0
added 50 packages from 37 contributors and audited 126 packages in 18.158s
found 0 vulnerabilities
=> 여기까지하면 package-lock.json 파일이 생성된다.(package.json파일과는 다른 파일이다.) 그리고 node_modules라는 이름의 폴더가 생성된다. 그리고 package.json 파일에 "dependencies"라는 키 값과 그에 대해 {"express":"^4.16.4"}라는 값이 할당된 코드가 추가된다.
==========================================
```

**Tip**: 만약 누군가와 해당 프로젝트를 가지고 협업을 한다면, package-lock.json 파일과 node_modules라는 폴더까지 모두 다 줄 필요는 없다. 왜냐하면 상대방에게 package.json 파일만 건네면 상대방이 `npm install` 명령어를 통해 설치할 수 있기 때문이다. package.json 파일의 `"dependencies"` 키값에 할당된 값들을 확인해 해당 프로젝트에 필요한 프레임워크나 라이브러리를 알아서 설치해준다.

`npm init`을 하면 `package.json` 파일이 생성되고 `npm install express`를 하면 `node_modules` 폴더와 `package-lock.json` 파일이 생성된다. 

### .gitignore

node_modules에 설치된 파일들을 보면 정말 많은 파일들이 존재한다. GIthub에 이 프로젝트를 업로드한다고 치면 이 파일들이 업로드 되면 너무 무거워지고 실질적으로 내가 적은 프로젝트 코드들이 아니므로 업로드에 제외하는 것이 좋은데 이럴때 필요한 것이 바로 **.gitignore** 파일이다.

(nodeJS gitignore이라 검색하면 ignore이 권장되는 파일 목록을 가지고 있는 .gitignore 파일이 있다. 여기서 코드를 긁어서 node 프로젝트에 활용하면 굉장히 유용하다.) 여기에 더해 **package-lock.json** 파일도 포함시켜주면 좋다. 왜냐하면 package-lock.json 파일은 package security 관련 파일이기에 실질적인 프로젝트 파일이 아니기 때문이다.

### require, listen

require 명령어는 node module을 가져올 때 쓰는 명령어이다.

```javascript
const express = require('express'); 
// express module을 가져와 express 변수에 할당한다. 우선은 express라는 폴더를 현재 위치에 있는 파일들에서 찾고 거기서 못 찾으면 그 다음 node_modules 폴더에서 찾는다. (이거는 node_modules 폴더에서 가져온 것)
const app = express(); 
// app 변수에 express를 실행한 후 담은 것.
app.listen(3000); 
// express 서버가 포트번호 3000번을 통해 오는 요청을 listen 한다.
```

### package.json scripts

package.json 파일에 scripts 키값에 명령어를 축약해서 내릴 수 있게끔 명령어를 저장할 수 있다.

```javascript
{
    "scripts": {
        "start": "node index.js"
    }
} 
// 이렇게 하면 "npm start"만 console에 입력해도 "node indexx.js"가 입력되는 것과 같은 결과가 된다. 
```

### Basic Server

index.js 생성

```javascript
const express = require('express');
const app = express();

const PORT = 3000;

function handleListening() {
  console.log(`Listening on: http://localhost:${PORT}`);
}

app.listen(PORT, handleListening); 
// PORT 3000번을 듣는 작업을(Listening) 완료하면 handleListening을 콜백함수로 불러라.
```

<br>

## 4. Handling Routes with Express

### 1. GET

브라우저에 url을 입력하면 브라우저가 GET method를 실행한다. 이러한 방식으로 브라우저는 웹페이지를 읽어온다. `GET request`는 그에 상응하는 `GET response`가 있어야 한다.  그래야만 request가 종료된다. (GET method로는 정보를 전달할 수 없다.) 

### 2. POST

브라우저가 POST라는 method를 통해 웹사이트에 정보를 전달하는 것이라 이해하면 됨. 

예를 들어, 웹사이트에 로그인을 할 시에 POST를 통하게 된다.

=>  이것이 http가 작동하는 방식!!

### req, res object

`req object`는 서버에서 어떤 요청이 들어왔는지 (예를 들어, 누가 URL에 들어오겠다는 요청을 했거나 아니면 웹페이지에 데이터를 보내는등)를 알고 싶으면 활용하는 객체이다. `res object`는 그에 대한 응답에 활용할 수 있는 객체. 

<br>

## 5. What is Babel?

### Babel

Babel은 자바스크립트 컴파일러로 최신의 자바스크립트를 예전 자바스크립트로 변환시켜준다. Babel Node란 NodeJS에서 Babel을 사용하는 것이다.

```powershell
PS C:\Users\user\Desktop\Project\wetube> npm install @babel/node
PS C:\Users\user\Desktop\revieWetube> npm install @babel/preset-env
```

Babel을 설치하고 .babelrc 파일을 만든 후, 밑에 코드를 추가한다. (.babelrc는 babel을 설정하는 파일이다. preset-env는 최신이긴 하지만 실험적인 수준은 아닌 babel을 의미한다.)

```json
{
    "presets": ["@babel/preset-env"]
}
```

이렇게 설정한 후에는 **package.json** 파일에서 `"scripts"` 키 값에 설정한 명령어 `"start":"node index.js"`를 `"start":"babel-node index.js"` 로 바꿀 수 있다. 바꾼 코드의 의미는 babel이 최신의 코드를 예전의 표준 코드로 바꾸고 그 다음 node가 이를 실행한다는 의미.

```javascript
"scripts": {
    "start": "babel-node index.js"
}
```

```javascript
const express = require('express');

function handleProfile(req, res) {

    res.send("You are beautiful");
}
```

이렇게 설정하고 나면 위 코드를 아래와 같은 최신 코드로 변경할 수 있다.(babel이 최신 자바스크립트 코드를 예전의 표준 자바스크립트 코드로 바꿔주기 때문이다.)

```javascript
import express from "express";

const handleProfile = (req, res) => res.send("You are beautiful");
//위 코드와 이 코드는 결국 같은 코드이다.
```

그런데 npm start를 하면 에러가 발생한다. 

```powershell
Error: Cannot find module '@babel/core'
```

이 에러를 보면 @bael/core 파일을 설치해주면 된다. (=> 에러를 보고 이를 해결하는 것도 프로그래머의 자격중 하나!)

```powershell
PS C:\Users\user\Desktop\revieWetube> npm install @babel/core
```

<br>

## 6. ES6

​	ES6은 가장 최근 형태의 자바스크립트이며 몇가지 특징을 가진다.	

### 1) Arrow Function	

```javascript
function handleListening (){
	return true;
}
```

이 코드를

```javascript
const handleListening = () => true;
```

이렇게 표현할 수 있고 밑에 형식을 Arrow Function이라 칭한다.

Arrow Function에는 Implicit Return(암시적 리턴)이라는 것이 있다. 만일 대괄호를 적는다면 암시적 성격을 잃게 되며 그 때는 return을 적어야 한다.

```javascript
const handleListening = () => {
    return true;
}
```

### 2) Module

ES6에는 Module이 존재해서 코드를 공유할  수 있다. 다른 파일에 있는 코드를 가져다가 쓸 수 있다.

```javascript
export default app;
```

=> 이 말은 만일 다른 파일에서 이 파일을 부른다면 app object를 준다는 말이다.

이러면 같은 폴더에 위치한 파일에서는 이렇게 불러올 수 있다.

```javascript
import app from "./app";
```

만약에 default로 export하지 않았다면 

```javascript
import { app } from "./app";
```

### Default로 Export한 것과 아닌것의 차이점은 무엇일까?

`language/ES6` 폴더에 있는 ES6 파일 참고할 것.

### 3) 쿼리에서 정보를 가져오는 방식

```javascript
const searchingBy = req.query.term;
```

이 코드를 ES6에서는

```javascript
const { query: { term:serchingBy } } = req;
```

이렇게 바꿀 수 있다.

### 이게 더좋은 이유는?

```javascript
const{abc , def} = Object;

classic) 
var abc = Object.abc;
var def  =Object.def;
```

이렇게 새로운 변수를 추가할 때 입력할 코드가 확 줄어들어서?(확실하지는 않음)

<br>

## 7. Dependency

package.json 파일을 보면 "dependencies" 키값이 존재한다. (package.json에서 각 키 값을 entry라 한다.)

```json
{
  "name": "wetube",
  "version": "1.0.0",
  "description": "Cloning Youtube with Vanilla and NodeJS",
  "author": "Park Choong Ho",
  "license": "ISC",
  "dependencies": {
    "@babel/core": "^7.4.5",
    "@babel/node": "^7.4.5",
    "@babel/preset-env": "^7.4.5",
    "express": "^4.17.0"
  },
  "scripts": {
    "start": "babel-node index.js"
  }
}
```

### dependency란 프로젝트가 실행될 때 필요한 것을 일컫는다.

만약에 dependency에 포함되지 않는 (프로젝트를 실행하는데 필요한게 아닌)  것을 설치하고 싶다면 뒤에 -D를 추가하면 된다. 

```powershell
PS C:\Users\user\Desktop\Project\wetube> npm install nodemon -D
```

이렇게 입력하고 나면 package.json 파일에 이러한 것이 추가 된다.

```javascript
{
  "devDependencies": {
    "nodemon": "^1.19.0"
  }
}
```

 devDependencies의 의미는 이것은 개발자에게 필요한 것이지, 프로젝트에 필요한 것이 아니라는 의미이다.

그전까지는 새로 작성한 코드를 서버에 반영하려면 서버를 끄고 다시 실행시켰어야 했는데, nodemon은 서버를 죽이지않고 내 코드의 변경사항을 반영할 수 있게 해준다. (내 코드를 저장하면 변경사항을 파악해 이를 반영한 서버를 다시 실행한다.)

그리고 package.json의 scripts 부분을 고쳐준다.

```javascript
"scripts": {
    "start": "nodemon --exec babel-node index.js"
}
```

<br>

## 8. MiddleWare

처리가 끝날때까지 연결되어 있는 함수.

#### 연결이 동작하는 방식

시작은 브라우저에서 웹사이트에 접속하려 하면 연결이 동작하기 시작.

웹사이트에 접속하면  그에 해당하는 JS파일을 실행하고 route가 존재하는지 살핀다. 그리고 그 route에 존재하는 함수를 실행하고 그 함수에 적혀있는 코드를 실행하는 구조.

=> But, 응답은 쉽게 이루어지지 않는다. 중간 연결자가 존재. (더 자세히는 유저와 응답사이에 존재)

이걸 **MiddleWare**라 칭한다. 따라서 MiddleWare를 기준으로 계층을 형성할 수 있다. (이 사이트에 로그인 하는 유저의 상태를 확인한다거나 권한을 확인하는 등등에 활용)

**Express에서의 모든함수는 MiddleWare가 될 수 있다.**

```javascript
const betweenHome = () => console.log("I'm between!");

app.get("/", betweenHome, handleHome);
```

위처럼 코드를 작성하고 브라우저에 주소를 입력하면 계속 로딩되는 상태에서 다음으로 넘어가지 않는다.

**Expreess에서 route를 포함한 모든 connection을 다루는 것들은 req, res, next를 가지고 있다.** 

```javascript
const handleHome = (req, res) => res.send(`Hi, here is your home!`);
// handleHome은 next가 없는 이유는 handleHome이 마지막 함수이기 때문이다.
const betweenHome = (req, res, next) => {
    console.log("Between!");
    next();
};

app.get("/", betweenHome, handleHome);
```

위처럼 바꿔주면 다시 handleHome함수를 실행한다.

만일 모든 route에 대하여 Middleware을 실행하고 싶다면 이렇게 입력하면 된다.

```javascript
app.use(betweenHome);

app.get("/", handleHome);

app.get("/profile", handleProfile);
```

이렇게 코드를 짜면 "/", "/profile" route 모두 betweenHome함수를 MiddleWare로 사용한다. (이렇게 코드를 짜는 걸 전역적이라한다.)

=> 만일 app.use(betweenHome) 이 코드를 profile route 뒤에 두면 2개 route 모두에서 betweenHome MiddleWare가 실행이 안된다. 코드는 위에서 부터 아래로 실행되므로 순서를 항상 염두에 두고 있자.

### Morgan 

Logging에 도움을 주는 MiddleWare

Logging은 기본적으로 무슨일이 언제 일어났는지 기록하는 것.

```powershell
PS C:\Users\user\Desktop\revieWetube> npm install morgan
```

```javascript
import morgan from "morgan";
app.use(morgan("tiny"));// 이렇게 사용 가능. "tiny"를 대신해 다른 옵션들이 들어갈 수있다. 여기서는 dev를 사용 dev는 tiny에 색깔을 조금 더 입힌 것이다.
```

console에 이런 값을 찍어준다.

```powershell
GET / 304 - - 6.134 ms
GET /profile 304 - - 0.954 ms
# morgan MiddleWare를 통해 우리는 어떤 요청이고 어디에 접속하려고 하고 Status Code까지 알 수 있다.
```

### Helmet

NodeJS의 보안에 도움을 주는 MiddleWare이다.

```powershell
PS C:\Users\user\Desktop\revieWetube> npm install helmet
```

```javascript
import helmet from "helmet";
app.use(helmet()); 
// 왜 여기에서는 helmet()을 사용할까? 
// app.use(betweenHome)과의 차이점?
```

위 코드를 추가해주면 된다. (Morgan에서 Helmet으로 바뀐것 빼고 코드가 똑같다.)

### Cookie Parser, Body Parser

Cookie와 Body를 다룰 수 있게 도와주는 MiddleWare.

**Body Parser**

사용자가 웹사이트로 전달하는 정보를 검사하는 미들웨어

html body로부터 정보를 받을 수 있게 해주는 미들웨어

누군가 form을 채워 넣고 나에게 전송한다면 그 form은 서버에 의해서 받아져야한다. (서버를 거쳐야 한다는 뜻 같다.)

ex) 만약 아이디와 비밀번호를 입력했다면 특정 형태로 변환 후 서버에게 전송된다.

만약 form을 받았다면 그 데이터는 request object가 가지고 있다. 또 서버에서 request object에 접근할 수 있어야 한다. 

=> Body Parser에는 많은 옵션이 존재. 

```javascript
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
/* 이것은 서버에 넘어오는 파일중 json 데이터와 form 형식에서 오는 데이터를 서버가 이해하기 위해 작성하는 코드이다. */
```

이것에 있어 필요한 것이 Body Parser

**Cookie Parser**

Cookie에 유저정보를 저장하고 Session을 다루기 위해서 사용.

사용 방식은 둘 다 Helmet MiddleWare와 똑같다.

**cf) MiddleWare제어를 통해 통신을 끊을 수 있다. => 기억하고 있을 것.**

```javascript
const middleware = (req, res, next) => {
    res.send("What the hell?");
}

app.get("/", middleware, handleHome);
```

이렇게 사용 가능

<br>

## 9. Router

Route의 복잡함을 쪼개는데 활용되는 것. 

=> 많은 Route들이 담겨있는 파일이 Router다.

app.js

```javascript
import express from "express"; 
//import express
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { userRouter } from "./router"; 
// router 파일에서 export한 userRouter만 import하겠다.

const app = express(); 
// call express

const handleHome = (req, res) => res.send("Hello from home");

const handleProfile = (req, res) => res.send("You are on my profile.");
/*
const betweenHome = (req, res, next) => {
    console.log("Between!");
    next();
};

app.use(betweenHome);
*/

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(helmet());
app.use(morgan("dev"));

app.get("/", handleHome);

app.get("/profile", handleProfile);

app.use("/user", userRouter); 
// use의 의미: 누군가 /user 경로로 접근하면 userRouter를 전체를 사용하겠다는 뜻.

export default app;
```

router.js 

```javascript
import express from "express";

export const userRouter = express.Router(); 
//이 user Router 변수를 export한다.

userRouter.get("/", (req, res) => res.send("user index")) 
userRouter.get("/edit", (req, res) => res.send("user edit"))
userRouter.get("/password", (req, res) => res.send("user password"))
// => app.js 코드를 보면 /user에 들어오면 userRouter를 사용한다. 바로 위 세줄의 코드는 따라서 /user 일 경우, res.send("user index")를 실행한다는 뜻이고 user/edit이면 res.send("user edit"), user/password는 res.send("user password")를 실행한다는 의미이다. 여기 설정되어 있는 Callback 함수가 Controller의 일종.
```

```javascript
import express from "express";

export const userRouter = express.Router(); 
//이 user Router 변수를 export한다.

userRouter.get("/", (req, res) => res.send("user index")) 
userRouter.get("/edit", (req, res) => res.send("user edit"))
userRouter.get("/password", (req, res) => res.send("user password"))
// => app.js 코드를 보면 /user에 들어오면 userRouter를 사용한다. 바로 위 세줄의 코드는 따라서 /user 일 경우, res.send("user index")를 실행한다는 뜻이고 user/edit이면 res.send("user edit"), user/password는 res.send("user password")를 실행한다는 의미이다. 여기 설정되어 있는 Callback 함수가 Controller의 일종.
```

<br>

## 10. What is MVC Pattern?

### 1) M Model

=> Data

### 2) V View

=> How does the data look

### 3) C Control

=> Function that looks for the data, 어떤 일이 발생할지에 대한 일종의 로직

**대개 프로젝트에 존재하는 각 Model마다 Controller를 생성한다.**

### Router

```javascript
const VIDEO_DETAIL = "/:id";
const EDIT_VIDEO = "/:id/edit";
const DELETE_VIDEO = "/:id/delete";
```

Router가 똑똑해서 이렇게 url을 설정하면 id가 변하는 값임을 알아챈다.

Router와 Controller를 헷갈리지말자! (Router는 URL일 뿐!! 로직이 아니다.)

<br>

## 11. Pug

**Pug**는 Express에서 View를 다루는 방식 중 하나이다. (일종의 View 엔진이다.) HTML과 CSS로만 작업할 경우, 반복되는 일을 너무 많이 하게돼 좋지않다. 단순작업을 하는 대신 pug를 사용하면 논리적으로 View를 관리할 수 있다.

### app.set(name, value)

.set함수는 application을 설정하는 함수이다.

```javascript
app.set("view engine", "pug"); 
// 이 application의 view engine을 pug로 하겠다.
```

html 파일을 저장해야 하는 폴더의 기본 값은 프로젝트 작업 폴더 + "/views" 이다.

**컨트롤러에 설정되어있는 send를 render로 바꿔준 후에 pug파일을 연결하면 된다.** view-engine을 pug로 설정해놓았기 때문에 render함수가 자동으로 views 폴더에서 home.pug을 찾는다.

```javascript
export const home = (req, res) => res.render("home");
export const search = (req, res) => res.send("Search");
// home과 search는 video에 관한 것이기에 videoController 파일에 입력했다.

export const videos = (req, res) => res.send("Videos");
export const upload = (req, res) => res.send("Upload");
export const videoDetail = (req, res) => res.send("Video Detail");
export const editVideo = (req, res) => res.send("Edit Video");
export const deleteVideo = (req, res) => res.send("Delete Video");
```

### Layouts with Pug

HTML과  CSS는 프로그래밍 언어가 아니기 때문에 논리적이 작업을 하기가 상대적으로 힘들다. 반복되는 부분을 복사 붙혀넣기 해서 사용해야만 했다. 그런데 Pug를 사용하면 좀 더 쉽게 View 파일들을 관리할 수 있다. views 폴더에 layouts 폴더를 생성하고 그 밑에 main.pug 파일을 만든다.

main.pug

```jade
doctype html
html
    head
        title Wetube
    body
        main
            block content
        footer
            span &copy; Wetube
```

탭안쪽에 있는 코드는, 그 내부에 있는 코드임을 의미한다. `block` 에 다른 파일에서 내용을 집어 넣을 수 있다. 나머지 부분은 같고 이 main부분이 변경되어 각각의 화면 View에 적용된다. (block에는 이름을 붙힐 수 있는데 여기서는 content라고 하자.)

다른 view 파일에서 main.pug를 가져오기 위해서는 **extension**을 해야한다. extension이란, 이 레이아웃에서 확장하겠다는 의미다. 다시 말해, 이 레이아웃을 사용하고 거기에 추가적인 것을 더하겠다는 뜻. 

home.pug

```jade
extends layouts/main
	
block content
	p Hello
```

`extends layouts/main` 은 main.pug를 그대로 가져오겠다는 의미이고 `block content` 는 block 부분을 `p Hello`로 채우겠다는 의미다.

### Partials

Pug는 document를 부분으로 나누어 레고 조립하듯이 사용할 수 있다.

footer.pug

```jade
footer.footer
    .footer__icon
        i.fab.fa-youtube
    span.footer__text &copy; #{new Date().getFullYear()} Wetube
```

footer document를 만들고 이걸 다른 document 에서 사용가능하다. javascript를 pug에서 사용하고 싶으면 #{}안에 자바스크립트 코드를 작성하면 된다.

main.pug

```jade
doctype html
html
    head
        link(rel="stylesheet", href="https://use.fontawesome.com/releases/v5.5.0/css/all.css", integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU", crossorigin="anonymous")
        title Wetube
    body
        header
            h1 Wetube
        main
            block content
        include ../partials/footer
```

`include` 를 활용해 footer를 불러와서 적용할 수 있다.

pug안에서 JavaScript코드를 사용할 때는 #{} 안에 코드를 작성하면 된다. 

footer.pug

```jade
footer.footer
    .footer__icon
        i.fab.fa-youtube
    span.footer__text Wetube #{new Date().getFullYear()} &copy; 
```

### One Single Source of Truth

한곳에서만 정보를 보관. 코드를 더 좋게 만드는 원칙중 하나. 이 방식으로 코드를 짠다면 버그를 최소화 할 수 있다.

### Controller에 있는 정보를 Pug에 추가하는 방법

전역적으로(글로벌) 사용할 변수 추가방법 

local 변수를 global 변수로 사용할 수 있도록 만들어 주는 것.

MiddleWare을 만들고 res.locals를 활용한다.

```javascript
import routes from "./routes";

export const localsMiddleWare = (req, res, next) => {
    res.locals.siteName = "WeTube";
    res.locals.routes = routes;
    next();
};
```

`next()` 는 middleware의 특징 처럼 다음 함수로 넘기겠다는 의미이다. locals는 로컬 변수 응답을 포함하는 객체다. (다양한 변수를 설정할 수 있다.) res.locals로 시작하는 2줄 코드를 통해 routes와 siteName을 모든 템플릿에서 사용할 수 있다.

```jade
doctype html
html
    head
        link(rel="stylesheet", href="https://use.fontawesome.com/releases/v5.5.0/css/all.css", integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU", crossorigin="anonymous")
        title #{siteName} <!-- 위 코드 덕분에 이렇게 -->
    body
        include ../partials/header
        main
            block content
        include ../partials/footer
```

 siteName을 템플릿에서 사용하는 모습이다.

### 템플릿마다 할당되는 변수를 다르게 설정하는 방법

특정 템플릿에서만 변수에 접근 가능하게 할 수 있다.

```javascript
export const home = (req, res) => res.render("home");
```

render 함수의 첫 번째 인자는 템플릿이고 두 번째 인자는 추가할 정보가 담긴 객체이다.

```javascript
export const home = (req, res) => res.render("home", { pageTitle: "Home" });
```

이렇게 전달할 수 있다. 전달하고 싶은 것은 무엇이든 전달할 수 있다.

### Routes에서 주의할 사항

userRouter.js

```javascript
import express from "express";
import routes from "../routes";
import { users, userDetail, editProfile, changePassword } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get(routes.users, users);
userRouter.get(routes.userDetail, userDetail);
userRouter.get(routes.editProfile, editProfile);
userRouter.get(routes.changePassword, changePassword);

export default userRouter;
```

/edit-profile url에 접근할 때,  이를 userDetail의 url인 /:id:로 인식할 수 있다. 그 이유는 router에서 userDetail이 editProfile보다 먼저 선언되어 있었기 때문이다. 브라우저가 /edit-profile을 /:id:로 인식하지 않게 하려면 router에서 userDetail을 가장 마지막에 선언해주면 된다.

### BEM

CSS 방법론으로 html 요소에  클래스나 id를 설정할 때 특정한 규칙에 따라 설정하는 것을 말한다.

```jade
<!-- join.pug -->
extends layouts/main

block content
    .form-container
        form(action=routes.join method="post")
            input(type="text", name="name" placeholder="Full Name")
            input(type="email" name="email" placeholder="Email")
            input(type="password" name="password" placeholder="Password")
            input(type="password", name="veriPassword", placeholder="Verify Password")
            input(type="submit" value="Join Now")
        include partials/socialLogin
```

```jade
<!-- login.pug -->
extends layouts/main

block content
    .form-container
        form(action=routes.login method="post")
            input(type="email", name="email", placeholder="Email")
            input(type="password", name="password", placeholder="Password")
            input(type="submit", value="Login")
        include partials/socialLogin
```

```jade
<!-- socialLogin.pug -->
.social-login
    button.social-login--github
        span
            i.fab.fa-github
        |Continue with Github
    button.social-login--facebook
        span
            i.fab.fa-facebook
        |Continue with Facebook
```

Continue with Github로 치면 Continue를 Tag로 인식한다. 그래서 앞에 |를 붙여 Continue with Github를 Text로 인식하게끔 만들어준다. (Pug 기능)

이 링크 참조

- [https://medium.com/witinweb/css-%EB%B0%A9%EB%B2%95%EB%A1%A0-1-bem-block-element-modifier-1c03034e65a1](https://medium.com/witinweb/css-방법론-1-bem-block-element-modifier-1c03034e65a1)

<br>

## 12. Controller

### Search Controller

컨트롤러가 **query**에 접근하기 위해서는 method가 get이어야 하는데, 그 이유는 **get method**가 url에 query 정보를 추가해주기 때문이다.

header.pug에 input 폼을 추가한다.

```jade
header.header
    .header__column
        a(href=routes.home)
            i.fab.fa-youtube
    .header__column
        form(action=routes.search, method="get")
            input(type="text", placeholder= "Search By Term", name="term")
    .header__column
        ul  
            li
                a(href=routes.join) Join
            li
                a(href=routes.login) Log In
```

name을 설정해야 url에 표시가 된다. 

search.pug도 들어온 input값을 반영할 수 있도록 수정한다. 그러면 이제 controller에서 이를 활용하여 작업을 할 수 있다.

search.pug

```jade
extends layouts/main

block content
    .search__header 
        h3 Searching By #{searchingBy}
```

searchController.js

```javascript
export const search = (req, res) => {
  //const searchingBy = req.query.term;
  const {
    query: { term: searchingBy }
  } = req;
  res.render("search", { pageTitle: "Search", searchingBy });
};
```

### Home Controller

가짜 데이터베이스를 생성하고 이를 Home화면에 적용하는 코드.

1. db.js를 작성

```javascript
export const videoList = [
  {
    id: 324393,
    title: "Video awesome",
    description: "This is something I love",
    views: 24,
    videoFile: "https://archive.org/details/BigBuckBunny_124",
    creator: {
      id: 121212,
      name: "Nicolas",
      email: "nico@las.com"
    }
  },
  {
    id: 1212121,
    title: "Video super",
    description: "This is something I love",
    views: 24,
    videoFile: "https://archive.org/details/BigBuckBunny_124",
    creator: {
      id: 121212,
      name: "Nicolas",
      email: "nico@las.com"
    }
  },
  {
    id: 55555,
    title: "Video nice",
    description: "This is something I love",
    views: 24,
    videoFile: "https://archive.org/details/BigBuckBunny_124",
    creator: {
      id: 121212,
      name: "Nicolas",
      email: "nico@las.com"
    }
  },
  {
    id: 11111,
    title: "Video perfect",
    description: "This is something I love",
    views: 24,
    videoFile: "https://archive.org/details/BigBuckBunny_124",
    creator: {
      id: 121212,
      name: "Nicolas",
      email: "nico@las.com"
    }
  }
];
```

2. videoController.js에서 db.js로부터 videoList를 받아와 home 화면  렌더링할 때 videosList 보내기

```javascript
import { videoList } from "../db";

export const home = (req, res) => {
  res.render("home", { pageTitle: "Home", videoList });
};
```

3. home.pug에서 받아온 videoList를 받아와 화면에 뿌리기

```jade
extends layouts/main

block content
    .videos
        each item in videoList <!--이 each 코드 기억하고 있기-->
            h1= item.title
            p= item.description
```

### Mixins

웹사이트에서 계속되어 반복되는 코드를 복사/붙혀넣기 하지 않고, 재활용하는 방법을 **`mixin`**이라한다. **`mixin`**은 pug 함수의 일종이다. 

```jade
mixin videoBlock(video = {})
    .videoBlock
        video.videoBlock__thumbnail(src=video.videoFile, controls=true)
        h4.videoBlock__title= video.title
        h6.videoBlock__views= video.views
<!--이 코드의 의미는 mixin에 인자가 입력되면, 그 객체의 이름을 video라한다.-->
```

home.pug도 이에 맞게 수정한다.

```html
extends layouts/main
include mixins/videoBlock

block content
    .videos
        each item in videoList
            +videoBlock({
                videoFile: item.videoFile,
                title: item.title,
                views: item.views 
            })
<!-- 각각 다른 정보를 기지지만 같은 구조를 가진 데이터를 표시화기 위해 코드를 캡슐화 시킴. mixin을 사용하는 가장 큰 이유(다른 정보, 같은 구조) -->
```

### 로그인 상태에 따라 header.pug 화면 바꾸기

```html
header.header
    .header__column
        a(href=routes.home)
            i.fab.fa-youtube
    .header__column
        form(action=routes.search, method="get")
            input(type="text", placeholder= "Search By Term....", name="term")
    .header__column
        ul 
            if !user.isAuthenticated
                li
                    a(href=routes.join) Join
                li
                    a(href=routes.login) Log In
            else 
                li
                    a(href=routes.upload) Upload
                li
                    a(href=routes.userDetail(user.id)) Profile
                li
                    a(href=routes.logout) Log Out
```

user라는 가짜 데이터를 집어넣고 동작하는지를 본다. (데이터는 Middleware에서 locals로 넣는다.)

```javascript
import routes from "./routes";

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "Wetube";
    res.locals.routes = routes;
    res.locals.user = {
        isAuthenticated: true,
        id: 1
    };
    next();
};
```

이렇게 하면 `isAuthenticated` 값을 바꿈으로서 header 파일을 제어할 수 있다. (실제 데이터를 통해 로그인 되었을때는 true이고 아니면 false를 전달.) 그 다음 id 데이터를 통해 user 정보화면 나타낼 수 있다.

```javascript
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
        } else {
            return USER_DETAIL;
        }
    },
    editProfile: EDIT_PROFILE,
    changePassword: CHANGE_PASSWORD,
    videos: VIDEOS,
    upload: UPLOAD,
    videoDetail: id => {
        if (id) {
            return `/videos/${id}`;
        } else {
            return VIDEO_DETAIL;
        }
    },
    editVideo: EDIT_VIDEO,
    deleteVideo: DELETE_VIDEO
};
```

 `routes.js` 파일에서 routes 값을 id인자에 따라 변하는 함수를 줌으로써 id에 따라 User 화면이 바뀌는 것을 구현. (Video도 마찬가지)

```javascript
import express from "express";
import routes from "../routes";
import {
    users,
    userDetail,
    editProfile,
    changePassword
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get(routes.users, users);
userRouter.get(routes.editProfile, editProfile);
userRouter.get(routes.changePassword, changePassword);
userRouter.get(routes.userDetail(), userDetail);

export default userRouter;
```

`routes.userDetail`을 `routes.userDetail()`로 바꿔준다. (함수로 바꾸었기 때문에.) 

<br>

## 13. 통신 상태

### Status Code

상태 코드란, 인터넷이 어떻게 상호작용하는지 표시하는 것을  의미한다.

많은 상태코그가 존재하고 브라우저는 이를 인식할 수 있다.

https://developer.mozilla.org/ko/docs/Web/HTTP/Status

**위 링크 참조**

```javascript
// userController 코드
export const postJoin = (req, res) => {
  // console.log(req.body);
  const {
    body: { name, email, password, veriPassword }
  } = req;

  if (password !== veriPassword) {
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    //Todo: Register user
    //Todo: Log user in
    res.redirect(routes.home);
  }
};
//이렇게 error status를 담아서 에러를 전달하는 방법이 있다.
```

