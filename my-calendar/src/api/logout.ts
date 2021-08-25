import { signOut } from '../common/cognito-controller';

export interface LogoutResModel {
  statusCode: number;
  message: string;
}

/**
 * ログアウト処理（ローカルストレージに保存されている情報を削除する）
 * @returns ログアウト結果
 */
export const logout = async (reqBody: any): Promise<LogoutResModel> => {
  console.info('logoutメソッド呼び出し');
  console.info(reqBody);
  const res = await signOut(reqBody.userId);
  console.info('logoutメソッド終了');
  if (res) {
    return {
      statusCode: 200,
      message: 'Logout Success',
    }
  } else {
    return {
      statusCode: 400,
      message: 'logout failed',
    }
  }
};
