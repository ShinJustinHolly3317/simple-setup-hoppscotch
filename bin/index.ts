import * as cdk from 'aws-cdk-lib';
import { HoppScotchCicdInfraStack } from '../lib';

const app = new cdk.App();
new HoppScotchCicdInfraStack(app, 'HoppScotchCicdInfraStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});