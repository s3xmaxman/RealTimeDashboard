import { AuthBindings } from "@refinedev/core";

import { API_URL, dataProvider } from "./data";

// デモ目的で、またアプリのテストを容易にするため、次の認証情報を使用できます
export const authCredentials = {
  email: "michael.scott@dundermifflin.com",
  password: "demodemo",
};
export const authProvider: AuthBindings = {
  login: async ({ email }) => {
    try {
      // ログインミューテーションを呼び出す
      // dataProvider.customはGraphQL APIへのカスタムリクエストを作成するために使用されます
      // これはdataProviderを呼び出し、fetchWrapper関数を経由します
      const { data } = await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email },
          // ユーザーが存在するかどうかを確認し、存在する場合はaccessTokenを返すためにemailを渡す
          rawQuery: `
            mutation Login($email: String!) {
              login(loginInput: { email: $email }) {
                accessToken
              }
            }
          `,
        },
      });

      // accessTokenをlocalStorageに保存する
      localStorage.setItem("access_token", data.login.accessToken);

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (e) {
      const error = e as Error;

      return {
        success: false,
        error: {
          message: "message" in error ? error.message : "ログインに失敗しました",
          name: "name" in error ? error.name : "無効なメールアドレスまたはパスワード",
        },
      };
    }
  },

  // ログアウトのために単純にlocalStorageからaccessTokenを削除する
  logout: async () => {
    localStorage.removeItem("access_token");

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  onError: async (error) => {
    // エラーが認証エラーかどうかを確認する
    // もし認証エラーなら、logoutをtrueに設定する
    if (error.statusCode === "UNAUTHENTICATED") {
      return {
        logout: true,
        ...error,
      };
    }

    return { error };
  },

  check: async () => {
    try {
      // ユーザーのアイデンティティを取得する
      // これはユーザーが認証されているかどうかを知るためです
      await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          rawQuery: `
            query Me {
              me {
                name
              }
            }
          `,
        },
      });

      // ユーザーが認証されていれば、ホームページにリダイレクトする
      return {
        authenticated: true,
        redirectTo: "/",
      };
    } catch (error) {
      // 他のエラーについては、ログインページにリダイレクトする
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }
  },

  // ユーザー情報を取得する
  getIdentity: async () => {
    const accessToken = localStorage.getItem("access_token");

    try {
      // GraphQL APIを呼び出してユーザー情報を取得する
      // me:anyを使用しています。これは、GraphQL APIがまだmeクエリの型を持っていないためです。
      // 後でいくつかのクエリとミューテーションを追加し、これをcodegenによって生成されるUserに変更します。
      const { data } = await dataProvider.custom<{ me: any }>({
        url: API_URL,
        method: "post",
        headers: accessToken
          ? {
              // accessTokenをAuthorizationヘッダーに送信する
              Authorization: `Bearer ${accessToken}`,
            }
          : {},
        meta: {
          // ユーザー情報（名前、メール、など）を取得する
          rawQuery: `
            query Me {
              me {
                id
                name
                email
                phone
                jobTitle
                timezone
                avatarUrl
              }
            }
          `,
        },
      });

      return data.me;
    } catch (error) {
      return undefined;
    }
  },
};
