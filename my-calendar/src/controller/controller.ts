import express from 'express';
import { login, LoginResModel } from '../api/login';
import { userCreate, SignUpResModel } from '../api/userCreate';
import { getUser, GetUserResModel } from '../api/users';
import { logout, LogoutResModel } from '../api/logout';

/**
 * ログイン処理
 * @param req - リクエストデータ
 * @returns 認証結果情報
 */
export const loginController = async (
  req: express.Request,
): Promise<LoginResModel> => {
  const data = await login(req.body.userId, req.body.password);
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
}

export const getUserController = async (): Promise<GetUserResModel> => {
  const data = await getUser();
  return data;
}

/**
 * ログアウト処理
 * @returns ログアウト結果
 */
 export const logoutController = async (): Promise<LogoutResModel> => {
  const res = await logout();
  return res;
};