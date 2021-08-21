import Amplify, { 
    Auth, 
    // Storage 
} from 'aws-amplify';
import jwt, { JwtHeader, SigningKeyCallback } from "jsonwebtoken";
import jwksClient from "jwks-rsa";

// Amplifyの設定
Amplify.configure({
  Auth: {
    // リージョン
    region: process.env.REGION,
    // ユーザプールのID
    userPoolId: process.env.AWS_COGNITO_POOL_ID,
    // アプリクライアントID
    userPoolWebClientId: process.env.AWS_COGNITO_CLIENT_ID,
    // Storage: 'sessionStorage'
  },
});

const client = jwksClient({
    jwksUri: "https://cognito-idp." + process.env.REGION + ".amazonaws.com/" + process.env.AWS_COGNITO_POOL_ID + "/.well-known/jwks.json",
});

const getKey = (header: JwtHeader, callback: SigningKeyCallback) => {
    if (!header.kid) throw new Error("not found kid!");
    client.getSigningKey(header.kid, function (err, key) {
        if (err) throw err;
        callback(null, key.getPublicKey());
    });
}

// Cognitoから取得したJWTをデコードする
const jwtVerify = (token: string) => {
    jwt.verify(token, getKey, function (err, decoded) {
        if (err) throw err;
        console.log(decoded);
    });
}

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
    try {
        const result = await Auth.signUp({
            username: item.email,
            password: item.password,
            attributes: {
                email: item.email,
                'custom:firstName': item.firstName,
                'custom:lastName': item.lastName,
                'custom:role': item.role
            },
        });
        console.info(result);
        console.info('SignUp終了');
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
  password: string
): Promise<UserModel | undefined> => {
    console.info('signIn開始');
    let resData: UserModel | undefined;
    try {
        const user = await Auth.signIn(userName, password);
        console.info(user);
        console.info('SignIn終了');
        resData = {
            firstName: 'firstName',
            lastName: 'lastName',
            email: 'email',
            password: 'password',
            role: 'role'
        };
        jwtVerify(user.signInUserSession.idToken.jwtToken);
        // if (!user.signInUserSession) {
        //     this.setState({ user, showConfirmation: true })
        // } else {
        //     updateCurrentUser(user)
        //     history.push('/profile')
        // }
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
export const signOut = async (): Promise<boolean> => {
    console.info('signOut開始');
    let resFlg = false;
    try {
        await Auth.signOut();
        console.info('signOut終了');
        return true;
    } catch (err) {
        console.info('catchに入った');
        console.error(err);
        return false;
    }
}

/**
 * ログイン中のユーザー情報が取れる？
 */
export const getUserData = async (): Promise<boolean> => {
    try {
        // const user = await Auth.currentAuthenticatedUser();
        const user = await Auth.currentUserInfo();
        const user2 = await Auth.currentUserPoolUser();
        const user3 = await Auth.currentSession();
        const user4 = await Auth.userSession(user2);
        console.info('現在ログインしているユーザー情報？');
        console.info('currentUserInfo: ');
        console.info(user);
        console.info('currentUserPoolUser: ');
        console.info(user2);
        console.info('currentSession: ');
        console.info(user3);
        console.info('userSession: ');
        console.info(user4);
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
