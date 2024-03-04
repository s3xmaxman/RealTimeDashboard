import type { IGraphQLConfig } from "graphql-config";

const config: IGraphQLConfig = {
  // Refineによって提供されるGraphQLスキーマを定義します
  schema: "https://api.crm.refine.dev/graphql",
  extensions: {
    // codegenは、GraphQLスキーマからTypeScriptの型を生成するプラグインです
    // https://the-guild.dev/graphql/codegen
    codegen: {
      // hooksは、特定のイベントの後に実行されるコマンドです
      hooks: {
        afterOneFileWrite: ["eslint --fix", "prettier --write"],
      },
      // GraphQLスキーマからTypeScriptの型を生成します
      generates: {
        // 生成された型の出力パスを指定します
        "src/graphql/schema.types.ts": {
          // TypeScriptプラグインを使用します
          plugins: ["typescript"],
          // TypeScriptプラグインの設定を設定します
          // これは、生成された型がどのように見えるかを定義します
          config: {
            skipTypename: true, // skipTypenameは、生成された型から__typenameを削除するために使用されます
            enumsAsTypes: true, // enumsAsTypesは、enumの代わりに型としてenumを生成するために使用されます
            // scalarsは、スカラ（つまり、DateTime、JSONなど）がどのように生成されるかを定義するために使用されます
            // スカラはリストではなく、フィールドを持たない型です。つまり、それはプリミティブ型です
            scalars: {
              // DateTimeは、日付と時刻を表すために使用されるスカラ型です
              DateTime: {
                input: "string",
                output: "string",
                format: "date-time",
              },
            },
          },
        },
        // GraphQL操作からTypeScriptの型を生成します
        // GraphQL操作は、私たちがGraphQL APIと通信するためにコードに書くクエリ、ミューテーション、およびサブスクリプションです
        "src/graphql/types.ts": {
          // presetは、GraphQL操作からTypeScriptの型を生成するために使用されるプラグインです
          // import-typesは、schema.types.tsまたは他のファイルから型をインポートすることを提案します
          // これは、型の重複を避けるために使用されます
          // https://the-guild.dev/graphql/codegen/plugins/presets/import-types-preset
          preset: "import-types",
          // documentsは、GraphQL操作を含むファイルのパスを定義するために使用されます
          documents: ["src/**/*.{ts,tsx}"],
          // pluginsは、GraphQL操作からTypeScriptの型を生成するために使用されるプラグインを定義するために使用されます
          plugins: ["typescript-operations"],
          config: {
            skipTypename: true,
            enumsAsTypes: true,
            // 生成された型が事前に解決されるべきかどうかを決定します
            // preResolveTypesがfalseに設定されている場合、コードジェネレータは型を事前に解決しようとしません
            // 代わりに、より一般的な型が生成され、実際の型は実行時に解決されます
            preResolveTypes: false,
            // useTypeImportsは、importの代わりにimport typeを使用して型をインポートするために使用されます
            useTypeImports: true,
          },
          // presetConfigは、presetの設定を定義するために使用されます
          presetConfig: {
            typesPath: "./schema.types",
          },
        },
      },
    },
  },
};

export default config;
