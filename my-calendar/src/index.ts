import express from "express";
// import * as bodyParser from "body-parser";
const app: express.Express = express();
const router = express.Router();
app.use(express.json());
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));

//CROS対応（というか完全無防備：本番環境ではだめ絶対）
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
  }
);

app.use("/user", require("./router/user.ts"));

router.get("/", (req: express.Request, res: express.Response) => {
  res.send("hello world");
});

router.get("/test", (req: express.Request, res: express.Response) => {
  res.send("hello test");
});

app.use("/", router);

app.listen(4000, () => {
  console.log("Start on port 4000.");
});

export default app;
