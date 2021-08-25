import express from 'express';
const router = express.Router();
import { loginController, signUpController, getUserController, logoutController } from '../controller/controller';

// ------ ルーティングのログ出力など共通処理 ------ //
router.all('/*', (req: express.Request, res: express.Response, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// -------- 認証チェックが不要なルーティング設定 ここから -------- //

// ログイン
router.post('/login', (req: express.Request, res: express.Response) => {
  loginController(req)
    .then((data) => {
      res.status(data.statusCode).json(data.userData);
    })
    .catch(() => {
      res.status(500).json();
    });
});

// ログアウト
router.delete('/logout', (req: express.Request, res: express.Response) => {
  logoutController(req)
    .then((data) => {
      res.status(data.statusCode).json(data.message);
    })
    .catch(() => {
      res.status(500).json();
    });
});

// ユーザー作成
router.post('/user', (req: express.Request, res: express.Response) => {
  signUpController(req)
    .then((data) => {
      res.status(data.statusCode).json(data.message);
    })
    .catch(() => {
      res.status(500).json();
    });
});

// ログイン中ユーザー確認
router.get('/user/:userId', (req: express.Request, res: express.Response) => {
  // console.debug(req);
  getUserController(req)
    .then((data) => {
      res.status(data.statusCode).json(data.message);
    })
    .catch(() => {
      res.status(500).json();
    });
});

// -------- 認証チェックが不要なルーティング設定 ここまで -------- //

// ------------------ 認証チェック ------------------ //
router.use((req: express.Request, res: express.Response, next) => {
  // if (apisAccessibleWithoutLogin.test(req.url)) {
  //   // ログイン不要でアクセスできるAPIへのアクセスは認証チェックしない
  //   next();
  //   return;
  // }
  // ログイン済みかどうかチェック
  // const { session } = req;
  // const authenticated = session && session.authenticated;
  const authenticated = true;
  if (authenticated) {
    // ログイン済みならOK
    next();
    return;
  }
  // ----- 以下は未ログインの場合 ----- //
  // // GET以外のアクセス及びAPIアクセスの禁止
  // if (req.method !== 'GET' || /\/api\/.*/.test(req.url)) {
  //   // 401を返して終了
  //   // ui/index.jsのエラーハンドリングで処理される
  //   next({ status: 401 });
  //   return;
  // }
  // // APIアクセスでないGETアクセスは、すべてログインページを返す
  // res.redirect('/login');
});

// -------- 認証チェックが必要なルーティング設定 -------- //

router.get(
  '/calendar/:userId',
  (req: express.Request, res: express.Response) => {
    const data = {
      message: 'get calendar success: ' + req.params.userId,
    };
    res.json(data);
  },
);

// // 「/user/{ID}」にマッチする場合の処理
// router.get("/:id", (req, res) => {
//   const data = {
//     "id": req.params.id
//   }
//   res.json(data);
// });

module.exports = router;
