import { getUserData } from '../common/cognito-controller';

export interface GetUserResModel {
  statusCode: number;
  message: string;
}

export const getUser = async (): Promise<GetUserResModel> => {
  console.info('getUserメソッド呼び出し');
  const res = await getUserData();
  console.info('getUserメソッド終了');
  if (res) {
    return {
      statusCode: 200,
      message: '',
    };
  } else {
    return {
      statusCode: 400,
      message: 'getUser failed',
    };
  }
};
