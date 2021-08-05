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
- Typescriptとexpressをインストール
  - `yarn add --dev typescript`
  - `yarn add --dev @types/node`
  - `yarn add --dev ts-node`
  - `npx tsc --init`
  - `yarn add express`
  - `yarn add --dev @types/express`
- Webpackでバンドルする準備
  - `mkdir src`
  - `mkdir dist`
  - `yarn add --dev nodemon`
  - tsconfigの設定
- Lintの設定
  - `yarn add --dev eslint eslint-config-prettier eslint-plugin-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier`
  - `touch .eslintrc`
  - .eslintrcに設定を記載
- 動作確認
  - `touch src/index.ts`
  - index.tsに処理を記載
  - `touch nodemon.json`
  - nodemon.jsonにnodemonoの設定を記載
  - package.jsonに以下コマンドを追加
    - `"dev": "nodemon -L"`
  - `yarn dev`で実行し、ブラウザからlocalhostでhello worldが出ればOK
- Webpack環境設定
  - `yarn add --dev webpack webpack-cli webpack-merge webpack-node-externals ts-loader`
  - `mkdir webpack`
  - `touch webpack/base.config.js`←共通して使うwebpackの設定ファイル
  - `touch webpack/dev.config.js`←developmentモードで使う設定ファイル
  - `touch webpack/prod.config.js`←productionモードで使う設定ファイル
  - webpackの設定ファイルに設定内容を記載
  - package.jsonのscriptに以下を追記
    ```
    "build": "webpack --config ./webpack/prod.config.js",
    "start": "yarn build && node dist/main.js",
    "build-local": "webpack --config ./webpack/dev.config.js",
    "start-local": "yarn build-local && node dist/main.js"
    ```
  - `yarn start-local`を実行し、動作確認

## 参考にした記事

- Typescriptのexpressをインストールするのに参考にした
  - `https://qiita.com/zaburo/items/69726cc42ef774990279`
- Webpackの設定で参考にした
  - `https://qiita.com/isihigameKoudai/items/4b790b5b2256dec27d1f`
  - `https://qiita.com/ryokkkke/items/390647a7c26933940470`
