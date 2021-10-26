import { selectProc, testDbModel } from '../common/aurora-controller';

export interface AuroraModel {
  statusCode: number;
  message: string;
  data?: testDbModel;
}

export const getAurora = async (): Promise<AuroraModel> => {
  console.info('getAuroraメソッド呼び出し');
  const res = await selectProc();
  console.info('getAuroraメソッド終了');
  if (res) {
    return {
      statusCode: 200,
      message: 'success!!',
      data: res,
    };
  } else {
    return {
      statusCode: 500,
      message: 'getAurora failed',
    };
  }
};
