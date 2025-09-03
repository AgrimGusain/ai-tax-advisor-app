  import * as s3 from 'aws-cdk-lib/aws-s3';
  import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
  import { IBucket } from 'aws-cdk-lib/aws-s3';
  import { IFunction } from 'aws-cdk-lib/aws-lambda';

  export type S3TriggerStackProps = {
    bucket: IBucket;
    lambdaFunction: IFunction;
  };

  export function addS3Trigger(props: S3TriggerStackProps) {
    props.bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(props.lambdaFunction),
      { prefix: 'private/' }
    );
  }
