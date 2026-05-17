import * as cdk from 'aws-cdk-lib/core';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ユーザープール：ログインユーザーを管理する箱
    const userPool = new cognito.UserPool(this, 'TyasyakugoyomiUserPool', {
      userPoolName: 'tyasyakugoyomi-user-pool',
      selfSignUpEnabled: false, // Googleログインのみ許可（メール直接登録不可）
      signInAliases: { email: true },
      removalPolicy: cdk.RemovalPolicy.DESTROY, // 開発中は削除しやすくしておく
    });

    // GoogleをIDプロバイダーとして登録
    const googleProvider = new cognito.UserPoolIdentityProviderGoogle(
      this,
      'GoogleProvider',
      {
        userPool,
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecretValue: cdk.SecretValue.unsafePlainText(
          process.env.GOOGLE_CLIENT_SECRET!
        ),
        // Googleから取得するユーザー情報
        scopes: ['email', 'profile', 'openid'],
        attributeMapping: {
          email: cognito.ProviderAttribute.GOOGLE_EMAIL,
          givenName: cognito.ProviderAttribute.GOOGLE_GIVEN_NAME,
          familyName: cognito.ProviderAttribute.GOOGLE_FAMILY_NAME,
        },
      }
    );

    // ReactアプリがCognitoと通信するための窓口
    const userPoolClient = new cognito.UserPoolClient(
      this,
      'TyasyakugoyomiClient',
      {
        userPool,
        userPoolClientName: 'tyasyakugoyomi-client',
        supportedIdentityProviders: [
          cognito.UserPoolClientIdentityProvider.GOOGLE,
        ],
        oAuth: {
          flows: { authorizationCodeGrant: true },
          // CognitoはOIDC標準スコープのみ対応。カレンダーは別途Google OAuthで取得する
          scopes: [
            cognito.OAuthScope.EMAIL,
            cognito.OAuthScope.OPENID,
            cognito.OAuthScope.PROFILE,
          ],
          callbackUrls: ['http://localhost:5173/callback'],
          logoutUrls: ['http://localhost:5173/'],
        },
      }
    );

    // GoogleProviderが作られてからClientを作る（依存関係）
    userPoolClient.node.addDependency(googleProvider);

    // CognitoのホストされたログインページのURL
    const domain = userPool.addDomain('TyasyakugoyomiDomain', {
      cognitoDomain: {
        domainPrefix: 'tyasyakugoyomi',
      },
    });

    // デプロイ後に確認できるよう出力
    new cdk.CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
    });
    new cdk.CfnOutput(this, 'CognitoDomain', {
      value: domain.domainName,
    });
  }
}
