import express from 'express';
import { login, LoginResModel } from '../api/login';
import { userCreate, SignUpResModel } from '../api/userCreate';
import { getUser } from '../api/users';

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

export const signUpController = async (
  req: express.Request,
): Promise<SignUpResModel> => {
  const data = await userCreate(req.body);
  return data;
}

export const getUserController = async (): Promise<SignUpResModel> => {
  const data = await getUser();
  return data;
}
