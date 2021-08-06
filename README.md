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

## 参考にした記事

- Typescript の express をインストールするのに参考にした
  - `https://qiita.com/zaburo/items/69726cc42ef774990279`
- Webpack の設定で参考にした
  - `https://qiita.com/isihigameKoudai/items/4b790b5b2256dec27d1f`
  - `https://qiita.com/ryokkkke/items/390647a7c26933940470`
