import express from 'express';
import { login, LoginResModel } from '../api/login';
import { userCreate, SignUpResModel } from '../api/userCreate';
import { getUser, GetUserResModel } from '../api/users';
import { logout, LogoutResModel } from '../api/logout';
import { getAurora, AuroraModel } from '../api/auroraTest';

/**
 * ログイン処理
 * @param req - リクエストデータ
 * @returns 認証結果情報
 */
export const loginController = async (
  req: express.Request,
): Promise<LoginResModel> => {
  const data = await login(req.body.userId, req.body.password);
  // req.session.
  if (data.userData) {
    // ログイン成功時にsessionに値をセット
    // このタイミングでredisにも登録される
    req.session.userId = data.userData?.email;
  }
  return data;
};

/**
 * 新規ユーザー生成処理
 * @param req - リクエストデータ
 * @returns ユーザー情報
 */
export const signUpController = async (
  req: express.Request,
): Promise<SignUpResModel> => {
  const data = await userCreate(req.body);
  return data;
};

export const getUserController = async (
  req: express.Request,
): Promise<GetUserResModel> => {
  const data = await getUser(req.params.userId);
  return data;
};

/**
 * ログアウト処理
 * @returns ログアウト結果
 */
export const logoutController = async (
  req: express.Request,
): Promise<LogoutResModel> => {
  const res = await logout(req.body.userId);
  // session情報を破棄、redisからも削除される
  req.session.destroy((err) => {
    console.log(err);
  });
  return res;
};

/**
 * Auroraテスト
 * @returns Auroraデータ
 */
export const auroraController = async (): Promise<AuroraModel> => {
  const data = await getAurora();
  return data;
};
