import { signUp, SignUpInputModel } from '../common/cognito-controller';

export interface SignUpResModel {
  statusCode: number;
  message: string;
  // userData?: UserModel;
}

/**
 * IDとパスワードによるログイン処理
 * @param userId - ユーザーID（メールアドレス）
 * @param password - パスワード
 * @returns ログイン結果とユーザー情報
 */
export const userCreate = async (reqBody: any): Promise<SignUpResModel> => {
  const item: SignUpInputModel = {
    firstName: reqBody.firstName,
    lastName: reqBody.lastName,
    email: reqBody.email,
    password: reqBody.password,
    role: reqBody.role
  }
  console.info('signUpメソッド呼び出し');
  const res = await signUp(item);
  console.info('signUpメソッド終了');
  if (res) {
    return {
      statusCode: 200,
      message: '',
    };
  } else {
    return {
      statusCode: 400,
      message: 'signUp failed: ' + item.email,
    };
  }
};
