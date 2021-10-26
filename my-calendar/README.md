# my-calendar-backend

## アプリ開発準備手順（記録用）

- GitHub 上で当リポジトリ`my-calendar-backend`を作成
- リポジトリを落としてくる
  - `git clone git@github.com:s-udaka/my-calendar-backend.git`
- アプリケーションを作成する
  - `cd my-calendar-backend`
  - `mkdir my-calendar`
  - `cd my-calendar`
  - `yarn init -y`
- Typescript と express をインストール
  - `yarn add --dev typescript`
  - `yarn add --dev @types/node`
  - `yarn add --dev ts-node`
  - `npx tsc --init`
  - `yarn add express`
  - `yarn add --dev @types/express`
- Webpack でバンドルする準備
  - `mkdir src`
  - `mkdir dist`
  - `yarn add --dev nodemon`
  - tsconfig の設定
- Lint の設定
  - `yarn add --dev eslint eslint-config-prettier eslint-plugin-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier`
  - `touch .eslintrc`
  - .eslintrc に設定を記載
- 動作確認
  - `touch src/index.ts`
  - index.ts に処理を記載
  - `touch nodemon.json`
  - nodemon.json に nodemono の設定を記載
  - package.json に以下コマンドを追加
    - `"dev": "nodemon -L"`
  - `yarn dev`で実行し、ブラウザから localhost で hello world が出れば OK
- Webpack 環境設定
  - `yarn add --dev webpack webpack-cli webpack-merge webpack-node-externals ts-loader`
  - `mkdir webpack`
  - `touch webpack/base.config.js`← 共通して使う webpack の設定ファイル
  - `touch webpack/dev.config.js`←development モードで使う設定ファイル
  - `touch webpack/prod.config.js`←production モードで使う設定ファイル
  - webpack の設定ファイルに設定内容を記載
  - package.json の script に以下を追記
    ```
    "build": "webpack --config ./webpack/prod.config.js",
    "start": "yarn build && node dist/main.js",
    "build-local": "webpack --config ./webpack/dev.config.js",
    "start-local": "yarn build-local && node dist/main.js"
    ```
  - `yarn start-local`を実行し、動作確認
- .env ファイルを作成し、git 管理から外す
- ルーティング周りの実装
  - `yarn add body-parser`⇦ 非推奨って出たからいらないかも
- AWS Cognito を使用した認証周りの実装
  - `yarn add aws-amplify`
  - `yarn add dotenv`
  - `yarn add jsonwebtoken jwks-rsa`
  - `yarn add --dev @types/jsonwebtoken`
- フロント側の Cognito 実装方法を使用してしまったため、`aws-sdk`を使った方法に変更した
  - `aws-amplify`を使った Cognito 認証方法を削除
    - `yarn remove aws-amplify`を実行
  - `yarn add aws-sdk`を実行
  - 記事を参考に aws-sdk を使った Cognito 認証を実装
  - IAM ユーザーに`AmazonCognitoPowerUser`のポリシーをアタッチした
    - aws-sdk から Cognito を操作するため
- redis を使用したセッション管理を実装
  - `yarn add express-session cookie-parser redis connect-redis`
  - `yarn add --dev @types/cookie-parser @types/express-session @types/redis @types/connect-redis`
  - express-session の SessionData の型定義を拡張しないといけなかった
    - `https://www.fixes.pub/program/546851.html`
- AWS Aurora と接続する
  - `yarn add pg`
  - `yarn add --dev @types/pg`

## 参考にした記事

- Typescript の express をインストールするのに参考にした
  - `https://qiita.com/zaburo/items/69726cc42ef774990279`
- Webpack の設定で参考にした
  - `https://qiita.com/isihigameKoudai/items/4b790b5b2256dec27d1f`
  - `https://qiita.com/ryokkkke/items/390647a7c26933940470`
- リンターの設定で参考にした
  - `https://qiita.com/yuma-ito-bd/items/cca7490fd7e300bbf169`
  - `https://zenn.dev/ryusou/articles/nodejs-prettier-eslint2021`
- Cognito を使用した認証・セッション管理について参考にした
  - `https://qiita.com/nyandora/items/2d93a6a5eb17751e502b`
- REST CLIENT の使用について参考にした
  - `https://qiita.com/toshi0607/items/c4440d3fbfa72eac840c`
- サーバーサイドでの Cognito 認証周りの実装について参考にした
  - `https://symfoware.blog.fc2.com/blog-entry-2495.html`
- express と redis によるセッション管理の実装で参考にした
  - `https://www.wakuwakubank.com/posts/738-nodejs-express-session/`
  - `https://qiita.com/theFirstPenguin/items/177ca0d09c02b0a16c9e`
- Aurora(postgres)との接続について
  - `https://qiita.com/honda28/items/30151aeba8217d46e9bf`
  - `https://qiita.com/yusuke-ka/items/448843020c0406363ba5`
