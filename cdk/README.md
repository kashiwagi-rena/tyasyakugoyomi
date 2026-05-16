# tyasyakugoyomi CDK

AWS CDK スタック。Cognito ユーザープールに Google を ID プロバイダーとして設定する。

## 事前準備

1. Google Cloud Console で OAuth 2.0 クライアント ID を作成し、`クライアント ID` と
   `クライアントシークレット` を控える。
2. リダイレクト URI は後述の `GoogleRedirectUri` 出力値を登録する（初回はドメイン確定後に追記）。

## デプロイ

```bash
cd cdk
npm install
npx cdk bootstrap        # 初回のみ
npx cdk deploy \
  -c googleClientId=<Google クライアント ID> \
  -c googleClientSecret=<Google クライアントシークレット> \
  -c cognitoDomainPrefix=tyasyakugoyomi-auth \
  -c callbackUrls=http://localhost:5173/ \
  -c logoutUrls=http://localhost:5173/login
```

デプロイ後、出力 `GoogleRedirectUri`
(`https://<domain>.auth.<region>.amazoncognito.com/oauth2/idpresponse`) を
Google OAuth クライアントの「承認済みのリダイレクト URI」に登録する。

## フロントエンドへの連携

デプロイ出力を `vite-project/.env` に設定する（`vite-project/.env.example` 参照）。

| CDK 出力           | .env キー                          |
| ------------------ | ---------------------------------- |
| `UserPoolId`       | `VITE_COGNITO_USER_POOL_ID`        |
| `UserPoolClientId` | `VITE_COGNITO_USER_POOL_CLIENT_ID` |
| `CognitoDomain`    | `VITE_COGNITO_DOMAIN`              |

## 削除

```bash
npx cdk destroy
```
