// amplify/custom/iam-stack.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class IAMStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Create an IAM Group for developers.
    const developersGroup = new iam.Group(this, 'DevelopersGroup', {
      groupName: 'AppDevelopers',
    });

    // 2. Create a new IAM User.
    // In a real project, you would manage the password securely, e.g., via AWS Secrets Manager.
    const newUser = new iam.User(this, 'NewDeveloperUser', {
      userName: 'new-app-developer',
    });

    // 3. Add the new user to the developers group.
    developersGroup.addUser(newUser);

    // 4. Define an IAM Policy using a JSON object.
    // This policy grants read-only access to all S3 buckets.
    const s3ReadOnlyPolicy = new iam.Policy(this, 'S3ReadOnlyPolicy', {
      document: iam.PolicyDocument.fromJson({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Action: ['s3:Get*', 's3:List*'],
            Resource: '*',
          },
        ],
      }),
    });

    // 5. Attach the new policy to the developers group.
    // Now, any user in this group (including 'new-app-developer') will have these permissions.
    developersGroup.attachInlinePolicy(s3ReadOnlyPolicy);

    // Output the group name for confirmation
    new cdk.CfnOutput(this, 'DeveloperGroupName', {
      value: developersGroup.groupName,
    });
  }
}