/* eslint-disable @typescript-eslint/no-var-requires */
import express from 'express';
const app = express();

// import cookieParser from 'cookie-parser';

import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';

const RedisStore = connectRedis(session);
const redisClient = redis.createClient();

// app.use(cookieParser());
app.use(
  session({
    // name: 'qid',
    secret: 'secret_key', // Secret Keyで暗号化し、改ざんを防ぐ
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({
      client: redisClient,
      disableTouch: true,
    }),
    // store: new RedisStore({
    //   host: 'localhost',
    //   port: 6379,
    //   prefix: 'sid:',
    // }),
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 30,
      sameSite: 'lax', // csrf
      // secure: __prod__, // cookie only works in https
    },
  }),
);

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
    res.header('Access-Control-Allow-Origin', process.env.FRONT_HOST);
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
  },
);

// 全てのメソッドのミドルウェアメソッドが必要な場合
app.use('/', function (req: express.Request, res, next: express.NextFunction) {
  console.log('req.session.id: ' + req.session.id);
  // res.send('Any request')
  next();
});

// ------ ルーティング ------ //
app.use('/', require('./router/router.ts'));

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
    url: req.url,
    message: 'Not Found',
  };
  res.json(data);
});

app.listen(4000, () => {
  console.log('Start on port 4000.');
});

export default app;
