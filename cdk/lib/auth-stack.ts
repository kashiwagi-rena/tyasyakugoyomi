import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';

/**
 * Cognito User Pool with Google as a federated identity provider.
 *
 * Required deploy-time context values:
 *   -c googleClientId=<Google OAuth client ID>
 *   -c googleClientSecret=<Google OAuth client secret>
 *
 * Optional context values:
 *   -c cognitoDomainPrefix=<hosted UI domain prefix>   (default: tyasyakugoyomi-auth)
 *   -c callbackUrls=<comma separated>                  (default: http://localhost:5173/)
 *   -c logoutUrls=<comma separated>                    (default: http://localhost:5173/login)
 */
export class AuthStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const googleClientId = this.node.tryGetContext('googleClientId') as string | undefined;
    const googleClientSecret = this.node.tryGetContext('googleClientSecret') as string | undefined;

    if (!googleClientId || !googleClientSecret) {
      throw new Error(
        'googleClientId and googleClientSecret context values are required. ' +
          'Deploy with: cdk deploy -c googleClientId=... -c googleClientSecret=...',
      );
    }

    const domainPrefix =
      (this.node.tryGetContext('cognitoDomainPrefix') as string | undefined) ??
      'tyasyakugoyomi-auth';
    const callbackUrls = splitUrls(
      this.node.tryGetContext('callbackUrls') as string | undefined,
      'http://localhost:5173/',
    );
    const logoutUrls = splitUrls(
      this.node.tryGetContext('logoutUrls') as string | undefined,
      'http://localhost:5173/login',
    );

    const userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: 'tyasyakugoyomi-user-pool',
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      standardAttributes: {
        email: { required: true, mutable: true },
        fullname: { required: false, mutable: true },
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const googleProvider = new cognito.UserPoolIdentityProviderGoogle(this, 'GoogleProvider', {
      userPool,
      clientId: googleClientId,
      clientSecretValue: cdk.SecretValue.unsafePlainText(googleClientSecret),
      scopes: ['openid', 'email', 'profile'],
      attributeMapping: {
        email: cognito.ProviderAttribute.GOOGLE_EMAIL,
        fullname: cognito.ProviderAttribute.GOOGLE_NAME,
      },
    });

    const userPoolDomain = userPool.addDomain('UserPoolDomain', {
      cognitoDomain: { domainPrefix },
    });

    const userPoolClient = userPool.addClient('WebClient', {
      userPoolClientName: 'tyasyakugoyomi-web-client',
      generateSecret: false,
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.COGNITO,
        cognito.UserPoolClientIdentityProvider.GOOGLE,
      ],
      oAuth: {
        flows: { authorizationCodeGrant: true },
        scopes: [
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.PROFILE,
        ],
        callbackUrls,
        logoutUrls,
      },
    });
    // The client must be created after the Google provider so it can reference it.
    userPoolClient.node.addDependency(googleProvider);

    const hostedUiDomain = `${userPoolDomain.domainName}.auth.${this.region}.amazoncognito.com`;

    new cdk.CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new cdk.CfnOutput(this, 'UserPoolClientId', { value: userPoolClient.userPoolClientId });
    new cdk.CfnOutput(this, 'CognitoDomain', { value: hostedUiDomain });
    new cdk.CfnOutput(this, 'Region', { value: this.region });
    new cdk.CfnOutput(this, 'GoogleRedirectUri', {
      value: `https://${hostedUiDomain}/oauth2/idpresponse`,
      description: 'Add this to the Authorized redirect URIs of the Google OAuth client',
    });
  }
}

function splitUrls(value: string | undefined, fallback: string): string[] {
  return (value ?? fallback)
    .split(',')
    .map((url) => url.trim())
    .filter((url) => url.length > 0);
}
