# Webpack

Webpack은 modlue bundler로써 많은 파일들을 webpack에게 주면, webpack은 그 파일들을 호환되는 static 파일들로 변환해서 준다.

(쉽게 말해, 최신 코드들, Sass나 ES6등과 같은 코드들을 브라우저가 알아들을 수 있는 css나 js로 변환시켜주는 것이라 생각하면 된다.)

```powershell
PS C:\Users\user\Desktop\Project\wetube> npm install webpack webpack-cli
```

webpack-cli는 터미널에서 webpack을 사용할 수 있게 해주는 것이다.

설치 후, webpack.config.js 라는 파일을 생성해준다. 생성위치는 프로젝트 폴더 바로 안쪽. 

그리고 package.json 파일을 scripts 부분을 아래와 같이 변경한다.

```javascript
"scripts": {
    "dev:server": "nodemon --exec babel-node init.js --delay 2",
    "dev:assets": "webpack"
}
```

webpack은 자동적으로 webpack.config.js라는 파일을 찾는다. 이 파일 이름을 바꾸면 webpack은 바뀐 이름을 모르기 때문에 위 scripts 부분에 바뀐 이름을 전달해야한다.

기본적으로 webpack은 **expoted configuratoin object**를 찾는다. config 파일 안에서 명심할 것은, server 코드와 연관시키지 않는다는 점이다. (webpack.config.js안에 들어갈 코드는 100% client code) webpack.config.js 파일에서는 babel을 사용할 수 없어, 예전 자바스크립트 코드로 작성해야 한다.

webpack은 크게 2가지로 구분되는데, 하나는 **entry**이고, 다른 하나는 **output**이다. entry는 파일이 어디에서 왔는가? 이고 output은 이것을 어디에 넣을 것인가? 이다.

assets 폴더를 생성한다. 생성위치는 webpack.config.js 처럼 프로젝트 폴더 바로 안쪽. 그리고 assets 폴더안에다가 js라는 폴더와 assets라는 폴더를 만든다. 그리고 js 폴더에는 main.js, scss 폴더에는 styles.scss라는 파일을 생성한다.

그리고 Node.js에서는 파일과 디렉토리 경로를 absolute하게 만들어주는 방법이 존재한다. (다시 말해, 컴퓨터나 서버에서의 전체 경로를 갖게되는 것이다.) path라는 것을 통해 가능하고 이 패키지는 Node.js에 기본으로 설치되어 있는 패키지다. **__dirname** 현재 프로젝트 디렉토리 이름인데, 어디서든 접근 가능한, Node.js 전역변수이다.

webpack.config.js

```javascript
const path = require("path");

const ENTRY_FILE = path.resolve(__dirname, "assets", "js", "main.js");
const OUTPUT_DIR = path.join(__dirname, "static");

const config = {
  entry: ENTRY_FILE,
  output: {
    path: OUTPUT_DIR,
    filename: "[name].js"
  }
};

module.exports = config;
```

webpack.config.js 파일에 위와 같이 입력하고 console에 webpack을 실행하면 아래와 같이 console에 찍힌다.

```powershell
> wetube@1.0.0 dev:assets C:\Users\user\Desktop\Project\wetube
> webpack

Hash: d9d0475e856b2051f9d4
Version: webpack 4.39.3
Time: 421ms
Built at: 2019-09-07 12:32:05
 1 asset
Entrypoint main = main.js
[0] ./assets/js/main.js 31 bytes {0} [built]
[1] ./assets/scss/styles.scss 270 bytes {0} [built] [failed] [1 error]

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/

ERROR in ./assets/scss/styles.scss 1:5
Module parse failed: Unexpected token (1:5)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
> body {
|   background-color: red;
| }
 @ ./assets/js/main.js 1:0-29
```

webpack에는 특정 파일형식을 이렇게 처리하라는 내용을 입력해야 파일을 처리할 수 있다. (여기서는 scss, ES6등을 어떻게 처리하라고 알려주어야 한다.) 또 webpack에는 mode라는 것이 존재하는데 webpack의 환경을 결정하는 것이다. 전에 mongoose설정에서 .env 파일을 활용하는 것과 비슷한 것이라 생각하면 된다. webpack mode에는 크게 development와 production이 있다. 이 프로젝트에서는 scripts에 직접 이를 설정하고 그 다음에 이를 활용할 수 있도록 코드를 작성한다.

```javascript
"scripts": {
    "dev:server": "nodemon --exec babel-node init.js --delay 2",
    "dev:assets": "webpack --mode development",
    "bulid:assets": "webpack --mode production"
  }
```

그 다음 webpack을 실행하면 console에 이렇게 나온다.

```powershell
> wetube@1.0.0 dev:assets C:\Users\user\Desktop\Project\wetube
> webpack --mode development

Hash: dad3b599a2bd94febbb0
Version: webpack 4.39.3
Time: 578ms
Built at: 2019-09-07 12:59:39
  Asset      Size  Chunks             Chunk Names
main.js  4.76 KiB    main  [emitted]  main
Entrypoint main = main.js
[./assets/js/main.js] 31 bytes {main} [built]
[./assets/scss/styles.scss] 270 bytes {main} [built] [failed] [1 error]

ERROR in ./assets/scss/styles.scss 1:5
Module parse failed: Unexpected token (1:5)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
> body {
|   background-color: red;
| }
 @ ./assets/js/main.js 1:0-29
```

여전히 scss를 webpack이 이해하지 못하고 있다. 이를 해결하기 위해 webpack에 module을 만났을 때, 몇가지 규칙을 따르도록 설정한다. (확장자가 scss인 파일을 만나면 특정 loader를 실행하라. loader는 webpack에게 파일을 처리하는 방법을 알려주는 역할을 한다.)

지금 처리해야 할 것은 먼저 scss 파일을 css 파일로 바꾸고 그 css 파일에 해당하는 텍스트 전체를 가지고와 그 텍스트를 추출한 후 css파일로 저장해야한다. `test: /\.(scss)$/` 은 .scss 확장자 파일을 찾으하는 코드다. 그 다음 `extract-text-webpack-plugin` 을 설치한다.

```powershell
PS C:\Users\user\Desktop\Project\wetube> npm install extract-text-webpack-plugin@next
```

`@`는 프로그램의 특정 버전을 설치할 때 사용한다. 설치하고 webpack.config.js에서 활용한다. 

```javascript
const path = require("path");
const ExtractCSS = require("extract-text-webpack-plugin");

const ENTRY_FILE = path.resolve(__dirname, "assets", "js", "main.js");
const OUTPUT_DIR = path.join(__dirname, "static");

const config = {
  entry: ENTRY_FILE,
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: ExtractCSS.extract([
          {
            loader: "css-loader"
          },
          {
            loader: "postcss-loader"
          },
          {
            loader: "sass-loader"
          }
        ])
      }
    ]
  },
  output: {
    path: OUTPUT_DIR,
    filename: "[name].js"
  }
};

module.exports = config;
```

.scss로 끝나는 module, 파일을 만나면 ExtractCSS를 활용하라고 설정해 놓았다.

webpack에서는 loader을 사용할 때, 끝에서부터 시작해서 처음으로 진행한다. 위 코드에서는 

sass-loader => postcss-loader => css-loader 순으로 진행되는 것이다.

sass-loader는 Sass 혹은 Scss 파일을 받아서 일반 CSS 파일로 변형해준다. postcss-loader는 CSS를 받아서 우리가 설정해준 plugin을 바탕으로 CSS를 변환한다. (예를 들어, IE와의 호환 등등) 그 다음 호환이 해결된 CSS를 가지고 css-loader를 이용하면 webpack이 CSS를 이해할 수 있게된다. 그 뒤에 ExtractCSS가 그 CSS 코드를 추출하는 작업을 한다.

위와 같이 코드를 작성하고 webpack을 실행하면 아래와 같이 console에 나타난다.

```powershell
PS C:\Users\user\Desktop\Project\wetube> npm run dev:assets

> wetube@1.0.0 dev:assets C:\Users\user\Desktop\Project\wetube
> webpack --mode development

Hash: 1465d26e57b2eeabf192
Version: webpack 4.39.3
Time: 201ms
Built at: 2019-09-07 14:33:40
  Asset      Size  Chunks             Chunk Names
main.js  4.03 KiB    main  [emitted]  main
Entrypoint main = main.js
[./assets/js/main.js] 31 bytes {main} [built]

ERROR in ./assets/js/main.js
Module not found: Error: Can't resolve 'css-loader' in 'C:\Users\user\Desktop\Project\wetube'
 @ ./assets/js/main.js 1:0-29
```

css-loader, postcss-loader, sass-loader를 설치한다. 그 다음 postcss-loader에서 사용할 Plugin인 autoprefixer를 설치한다.

```powershell
PS C:\Users\user\Desktop\Project\wetube> npm install autoprefixer
```

그리고 이를 postcss-loader에 적용한다.

```javascript
const path = require("path");
const autoprefixer = require("autoprefixer");
const ExtractCSS = require("extract-text-webpack-plugin");

const ENTRY_FILE = path.resolve(__dirname, "assets", "js", "main.js");
const OUTPUT_DIR = path.join(__dirname, "static");

const config = {
  entry: ENTRY_FILE,
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: ExtractCSS.extract([
          {
            loader: "css-loader"
          },
          {
            loader: "postcss-loader",
            options: {
              plugin() {
                return [autoprefixer({ browsers: "cover 99.5%" })];
              }
            }
          },
          {
            loader: "sass-loader"
          }
        ])
      }
    ]
  },
  output: {
    path: OUTPUT_DIR,
    filename: "[name].js"
  }
};

module.exports = config;
```

이렇게 작성한 후, webpack을 실행하면 아래와 같은 오류가 발생한다.

```powershell
PS C:\Users\user\Desktop\Project\wetube> npm run dev:assets

> wetube@1.0.0 dev:assets C:\Users\user\Desktop\Project\wetube
> webpack --mode development

Hash: d8ea78794ffa30b5bc04
Version: webpack 4.39.3
Time: 320ms
Built at: 2019-09-07 16:51:39
  Asset      Size  Chunks             Chunk Names
main.js  4.92 KiB    main  [emitted]  main
Entrypoint main = main.js
[./assets/js/main.js] 31 bytes {main} [built]
[./assets/scss/styles.scss] 411 bytes {main} [built] [failed] [1 error]

ERROR in ./assets/scss/styles.scss
Module build failed (from ./node_modules/extract-text-webpack-plugin/dist/loader.js):
Error: "extract-text-webpack-plugin" loader is used without the corresponding plugin, refer to https://github.com/webpack/extract-text-webpack-plugin for the usage example
    at Object.pitch (C:\Users\user\Desktop\Project\wetube\node_modules\extract-text-webpack-plugin\dist\loader.js:59:11)
```

extract-text-webpack-plugin에 맞는 plugin이 없다고 나오므로 그에 맞는 설정을 해주어야 한다.

```javascript
const path = require("path");
const autoprefixer = require("autoprefixer");
const ExtractCSS = require("extract-text-webpack-plugin");

const ENTRY_FILE = path.resolve(__dirname, "assets", "js", "main.js");
const OUTPUT_DIR = path.join(__dirname, "static");

const config = {
  entry: ENTRY_FILE,
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: ExtractCSS.extract([
          {
            loader: "css-loader"
          },
          {
            loader: "postcss-loader",
            options: {
              plugin() {
                return [autoprefixer({ browsers: "cover 99.5%" })];
              }
            }
          },
          {
            loader: "sass-loader"
          }
        ])
      }
    ]
  },
  output: {
    path: OUTPUT_DIR,
    filename: "[name].js"
  }
};

module.exports = config;
```

이렇게 하고 webpack을 실행하면 아래와 같은 에러 발생

```powershell
PS C:\Users\user\Desktop\Project\wetube> npm run dev:assets

> wetube@1.0.0 dev:assets C:\Users\user\Desktop\Project\wetube
> webpack --mode development

Hash: 8e8a3f8886c3585f489b
Version: webpack 4.39.3
Time: 1251ms
Built at: 2019-09-07 16:56:35
  Asset      Size  Chunks             Chunk Names
main.js  6.56 KiB    main  [emitted]  main
Entrypoint main = main.js
[./assets/js/main.js] 31 bytes {main} [built]
[./assets/scss/styles.scss] 1.85 KiB [built] [failed] [1 error]

ERROR in ./assets/scss/styles.scss
Module build failed (from ./node_modules/extract-text-webpack-plugin/dist/loader.js):
ModuleBuildError: Module build failed (from ./node_modules/sass-loader/dist/cjs.js):
Error: Cannot find module 'node-sass'
```

node-sass 모듈을 찾을 수 없다고 하니 이를 설치한다.

```powershell
PS C:\Users\user\Desktop\Project\wetube> npm install node-sass
```

설치 후, webpack을 작동하면 static 폴더에 styles.css 파일이 생성된다.

그 다음은, js 파일과 관련된 webpack을 설정하자.

```javascript
const path = require("path");
const autoprefixer = require("autoprefixer");
const ExtractCSS = require("extract-text-webpack-plugin");

const ENTRY_FILE = path.resolve(__dirname, "assets", "js", "main.js");
const OUTPUT_DIR = path.join(__dirname, "static");

const config = {
  entry: ["@babel/polyfill", ENTRY_FILE],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      },

      {
        test: /\.(scss)$/,
        use: ExtractCSS.extract([
          {
            loader: "css-loader"
          },
          {
            loader: "postcss-loader",
            options: {
              plugins() {
                return [autoprefixer({ browserlist: "cover 99.5%" })];
              }
            }
          },
          {
            loader: "sass-loader"
          }
        ])
      }
    ]
  },
  output: {
    path: OUTPUT_DIR,
    filename: "[name].js"
  },
  plugins: [new ExtractCSS("styles.css")]
};

module.exports = config;
```

css와 같은 방식으로 작업하면 된다. rules에 객체 형태로 추가한다. ES6 파일을 webpack이 이해할 수 있게 babel-loader를 설치하고 이를 loader로 설정해준다. 

```powershell
PS C:\Users\user\Desktop\Project\wetube> npm install babel-loader
```

그리고 브라우저를 실행하면 regenerator-runtime 오류가 발생하는데 이를 해결하기 위해 @babel/polyfill을 설치하고 webpack config entry에 위에 코드처럼 설정해준다.

```powershell
PS C:\Users\user\Desktop\Project\wetube> npm install @babel/polyfill
```

