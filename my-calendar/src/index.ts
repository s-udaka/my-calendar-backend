import express from "express";
// import * as bodyParser from "body-parser";
const app: express.Express = express();
const router = express.Router();
app.use(express.json());
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

//CROS対応（というか完全無防備：本番環境ではだめ絶対）
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header("Access-Control-Allow-Origin", process.env.FRONT_HOST);
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
  }
);

// 全てのメソッドのミドルウェアメソッドが必要な場合
// app.all('/', function (req, res) {
//   res.send('Any request')
//   next()
// })

// ------ ルーティング ------ //
app.use("/", require("./router/router.ts"));

// router.get("/", (req: express.Request, res: express.Response) => {
//   res.send("hello world");
// });

// router.get("/test", (req: express.Request, res: express.Response) => {
//   res.send("hello test");
// });

// app.use("/", router);

// -------------------------------------------------
//  以下、何のルーティングにもマッチしないorエラー
// -------------------------------------------------

// いずれのルーティングにもマッチしない(==NOT FOUND)
app.use((req, res) => {
  res.status(404);
  const data = {
    "url": req.url,
    "message": 'Not Found'
  }
  res.json(data);
});

app.listen(4000, () => {
  console.log("Start on port 4000.");
});

export default app;
