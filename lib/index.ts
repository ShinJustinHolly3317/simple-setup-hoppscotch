import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as codedeploy from 'aws-cdk-lib/aws-codedeploy';
import * as iam from 'aws-cdk-lib/aws-iam';
import { aws_codecommit } from 'aws-cdk-lib';

export class HoppScotchCicdInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an S3 bucket to store the pipeline artifacts
    const artifactBucket = new s3.Bucket(this, 'ArtifactBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Create a VPC
    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
    });

    // Create an EC2 instance
    const instance = new ec2.Instance(this, 'Instance', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
    });

    // Add user data to install CodeDeploy agent, Docker, and Docker Compose
    instance.addUserData(
      `#!/bin/bash
       yum update -y
       yum install -y ruby
       yum install -y wget
       cd /home/ec2-user
       wget https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/latest/install
       chmod +x ./install
       ./install auto
       service codedeploy-agent start
       
       # Install Docker
       yum install -y docker
       service docker start
       usermod -aG docker ec2-user

       # Install Docker Compose
       curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
       chmod +x /usr/local/bin/docker-compose
      `
    );

    // Install CodeDeploy agent on the
    // Grant the EC2 instance permissions to download from S3
    artifactBucket.grantRead(instance.role);

    // Create a CodeDeploy application
    const application = new codedeploy.ServerApplication(this, 'CodeDeployApplication', {
      applicationName: 'hoppscotchCicd',
    });

    // Create a CodeDeploy deployment group
    const deploymentGroup = new codedeploy.ServerDeploymentGroup(this, 'DeploymentGroup', {
      application,
      deploymentGroupName: 'hoppscotchCicdDeploymentGroup',
      ec2InstanceTags: new codedeploy.InstanceTagSet({
        Name: ['hoppscotchTargetEc2'], // Replace with your EC2 instance tag name
      }),
      installAgent: true,
      deploymentConfig: codedeploy.ServerDeploymentConfig.ALL_AT_ONCE,
    });

    // Create a CodePipeline
    const sourceOutput = new codepipeline.Artifact();
    const buildOutput = new codepipeline.Artifact();

    new codepipeline.Pipeline(this, 'Pipeline', {
      pipelineName: 'hoppscotchCicdPipeline',
      artifactBucket,
      stages: [
        {
          stageName: 'Source',
          actions: [
            new codepipeline_actions.CodeCommitSourceAction({
              actionName: 'hoppscotchCodecommitSource',
              output: sourceOutput,
              repository: aws_codecommit.Repository.fromRepositoryName(this, 'hoppscotchRepo', 'test-justin-hoppscotch')
            }),
          ],
        },
        {
          stageName: 'Deploy',
          actions: [
            new codepipeline_actions.CodeDeployServerDeployAction({
              actionName: 'CodeDeploy',
              deploymentGroup,
              input: sourceOutput,
            }),
          ],
        },
      ],
    });
  }
}