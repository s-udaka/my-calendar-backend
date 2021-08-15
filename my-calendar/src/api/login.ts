import { signIn, UserModel } from '../common/cognito-controller';

export interface LoginResModel {
  statusCode: number;
  message: string;
  userData?: UserModel;
}

/**
 * IDとパスワードによるログイン処理
 * @param userId - ユーザーID（メールアドレス）
 * @param password - パスワード
 * @returns ログイン結果とユーザー情報
 */
export const login = async (
  userId: string,
  password: string,
): Promise<LoginResModel> => {
  console.info('signInメソッド呼び出し');
  const res = await signIn(userId, password);
  console.info('signInメソッド終了');
  if (res) {
    return {
      statusCode: 200,
      message: '',
      userData: res,
    };
  } else {
    return {
      statusCode: 400,
      message: 'login failed: ' + userId,
    };
  }
};
