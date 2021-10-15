const AWS = require('aws-sdk');
// const crypto = require('crypto');
import jwt, { JwtHeader, SigningKeyCallback } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const cognito = new AWS.CognitoIdentityServiceProvider({
  // accessKeyId: process.env.AWS_ACCESS_KEY,
  // secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.REGION,
});

// // Amplifyの設定
// Amplify.configure({
//   Auth: {
//     // リージョン
//     region: process.env.REGION,
//     // ユーザプールのID
//     userPoolId: process.env.AWS_COGNITO_POOL_ID,
//     // アプリクライアントID
//     userPoolWebClientId: process.env.AWS_COGNITO_CLIENT_ID,
//     // Storage: 'sessionStorage'
//   },
// });

const client = jwksClient({
  jwksUri:
    'https://cognito-idp.' +
    process.env.REGION +
    '.amazonaws.com/' +
    process.env.AWS_COGNITO_POOL_ID +
    '/.well-known/jwks.json',
});

const getKey = (header: JwtHeader, callback: SigningKeyCallback) => {
  if (!header.kid) throw new Error('not found kid!');
  client.getSigningKey(header.kid, function (err, key) {
    if (err) throw err;
    callback(null, key.getPublicKey());
  });
};

// Cognitoから取得したJWTをデコードする
const jwtVerify = (token: string) => {
  jwt.verify(token, getKey, function (err, decoded) {
    if (err) throw err;
    console.log(decoded);
  });
};

export interface SignUpInputModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

/**
 * AWS Cognitoのユーザープールに新規ユーザーを登録する
 * @param item - 登録するユーザーの情報
 * @returns ユーザー登録処理結果 {boolean}
 */
export const signUp = async (item: SignUpInputModel): Promise<boolean> => {
  console.info('SignUp開始');
  const params = {
    UserPoolId: process.env.AWS_COGNITO_POOL_ID, // required
    Username: item.email, // required (ログインユーザー名)
    ForceAliasCreation: true,
    MessageAction: 'SUPPRESS',
    UserAttributes: [
      {
        Name: 'email',
        Value: item.email, // 属性のメールアドレスを指定
      },
      {
        Name: 'custom:firstName',
        Value: item.firstName,
      },
      {
        Name: 'custom:lastName',
        Value: item.lastName,
      },
      {
        Name: 'custom:role',
        Value: item.role,
      },
    ],
  };
  try {
    // この時点では、アカウントのステータスは「FORCE_CHANGE_PASSWORD」
    const result = await cognito.adminCreateUser(params).promise();
    console.info(JSON.stringify(result, null, 4));
    console.info('SignUp終了');
    // これでアカウントのステータスが「CONFIRMED」となる
    const res = await setInitUserPassword(item.email, item.password);
    if (res) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.info('catchに入った');
    console.error(err);
    return false;
  }
};

/**
 * ユーザー作成直後にパスワードの設定をすることでユーザーの作成が完了する
 * @param username - ユーザー名（メアド）
 * @param password - パスワード
 * @returns 初期パスワード設定結果 {boolean}
 */
const setInitUserPassword = async (
  username: String,
  password: String,
): Promise<boolean> => {
  console.info('初期パスワード設定開始');
  const params = {
    UserPoolId: process.env.AWS_COGNITO_POOL_ID, // required
    Username: username, // required
    Password: password, // required
    Permanent: true,
  };
  try {
    const result = await cognito.adminSetUserPassword(params).promise();
    console.info(JSON.stringify(result, null, 4));
    console.info('初期パスワード設定終了');
    return true;
  } catch (err) {
    console.info('catchに入った');
    console.error(err);
    return false;
  }
};

// /**
//  * 認証コード検証
//  * @param userName - SignUp時に登楼したユーザーネーム
//  * @param code - メールで届いた確認コード
//  * @returns 認証コード検証結果 {boolean}
//  */
// export const confirmSignUp = async (
//   userName: string,
//   code: string
// ): Promise<boolean> => {
//   console.info('confirmSignUp開始');
//   try {
//     const res = await Auth.confirmSignUp(userName, code);
//     console.info(res);
//     console.info('confirmSignUp終了');
//     return true;
//   } catch (err) {
//     console.info('catchに入った');
//     console.error(err);
//     return false;
//   }
// };

export interface UserModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

/**
 * ログイン
 * @param userName - 登録したユーザーネーム
 * @param password - 登録したパスワード
 * @returns ログインしたユーザー情報 {UserModel | undefined}
 */
export const signIn = async (
  userName: string,
  password: string,
): Promise<UserModel | undefined> => {
  console.info('signIn開始');
  // SECRET_HASHは、ユーザー名とクライアントIDを結合し、ハッシュ化したものを設定
  const params = {
    UserPoolId: process.env.AWS_COGNITO_POOL_ID, // required
    ClientId: process.env.AWS_COGNITO_CLIENT_ID, // required
    AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
    AuthParameters: {
      USERNAME: userName,
      PASSWORD: password,
      // SECRET_HASH: crypto.createHmac('sha256', process.env.AWS_COGNITO_CLIENT_ID).update('symfoware' + process.env.AWS_COGNITO_CLIENT_ID).digest('base64')
    },
  };
  let resData: UserModel | undefined;
  try {
    const user = await cognito.adminInitiateAuth(params).promise();
    console.info(JSON.stringify(user, null, 4));
    // console.info(JSON.stringify(user.AuthenticationResult.IdToken, null, 4));
    console.info('SignIn終了');
    resData = {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      password: 'password',
      role: 'role',
    };
    // jwtVerify(user.AuthenticationResult.IdToken);
    return resData;
  } catch (err) {
    console.info('catchに入った');
    console.error('error signing in...: ', err);
    return undefined;
  }
};

/**
 * ログアウト
 * @returns ログアウト結果 {boolean}
 */
export const signOut = async (userId: String): Promise<boolean> => {
  console.info('signOut開始');
  const params = {
    UserPoolId: process.env.AWS_COGNITO_POOL_ID, // required
    Username: userId,
  };
  // let resFlg = false;
  try {
    // await Auth.signOut({ global: true });
    const result = await cognito.adminUserGlobalSignOut(params).promise();
    console.info(JSON.stringify(result, null, 4));
    console.info('signOut終了');
    return true;
  } catch (err) {
    console.info('catchに入った');
    console.error(err);
    return false;
  }
};

/**
 * ログイン中のユーザー情報が取れる？
 */
export const getUserData = async (userId: String): Promise<boolean> => {
  console.info('getUserData開始');
  try {
    const params = {
      UserPoolId: process.env.AWS_COGNITO_POOL_ID, // required
      Username: userId, // required
    };
    const user = await cognito.adminGetUser(params).promise();
    console.info(JSON.stringify(user, null, 4));
    console.info('getUserData終了');
    return true;
  } catch (err) {
    console.info('catchに入った');
    console.error(err);
    return false;
  }
};

// const cognitoClient = () => {
//     return new CognitoUserPool({
//         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//         UserPoolId: process.env.REACT_APP_AWS_COGNITO_POOL_ID!,
//         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//         ClientId: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID!,
//     });
// };

// /**
//  * ユーザーテーブルに新規ユーザーを登録する
//  * @param args - 登録するユーザーの情報
//  * @returns ユーザー登録処理結果 {boolean}
//  */
//  export const addUser = async (item: SignUpInputModel): Promise<boolean> => {
//     const attributeList = [
//         new CognitoUserAttribute({
//           Name: "email",
//           Value: item.email,
//         }),
//     ];
//     console.info('SignUp開始');
//     try {
//       const cc = cognitoClient();
//       cc.signUp(item.email, item.password, attributeList, [],
//         (err) => {
//             if (err) {
//                 console.error(err);
//                 return false;
//             }
//         });
//         console.info('SignUp終了');
//         return true;
//     } catch (err) {
//         console.info('catchに入った');
//         console.error(err);
//         return false;
//     }
//   };
