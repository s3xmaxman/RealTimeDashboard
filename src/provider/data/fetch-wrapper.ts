import { GraphQLFormattedError } from "graphql";

// エラー型を定義

type Error = {
    message: string; // エラーメッセージ
    statusCode: string; // ステータスコード
}



const customFetch = async (url: string, options: RequestInit) => {
    // アクセストークンを取得
    const accessToken = localStorage.getItem("access_token");

    // ヘッダーを取得
    const headers = options.headers as Record<string, string>;

    // フェッチを実行
    return await fetch(url, {
        ...options,
        headers: {
            ...headers,
            Authorization: headers?.Authorization || `Bearer ${accessToken}`, // 認証情報をヘッダーに追加
            "Content-Type": "application/json", // コンテンツタイプをJSONに設定
            "Apollo-Require-Preflight": "true", // Apolloのプリフライト要求を有効に
        }
    })
};

// GraphQLエラーを取得する関数
const getGraphQLErrors = (body: Record<"errors", GraphQLFormattedError[] | undefined>): Error | null => {
    // ボディが存在しない場合、不明なエラーを返す
    if(!body){
        return {
            message: "Unknown error",
            statusCode: "INTERNAL_SERVER_ERROR",
        }
    }

    // エラーが存在する場合、エラー情報を返す
    if("errors" in body){
        const errors = body?.errors;

        // エラーメッセージを結合
        const messages = errors?.map((error) => error.message).join("");
        // エラーコードを取得
        const code = errors?.[0]?.extensions?.code;

        return {
            message: messages || JSON.stringify(errors), // エラーメッセージ
            statusCode: code || 500,
        }
    }

    // エラーが存在しない場合、nullを返す
    return null;
};


// フェッチラッパー関数
export const fetchWrapper = async (url: string, options: RequestInit) => {
    // カスタムフェッチを実行
    const response = await customFetch(url, options);

    // レスポンスをクロー���
    const responseClone = response.clone();

    // レスポンスボディをJSONとして取得
    const body = await responseClone.json();

    // エラーを取得
    const error = getGraphQLErrors(body);

    // エラーが存在する場合、エラーをスロー
    if(error){
        throw error;
    }

    // レスポンスを返す
    return response;
}
