// amplify/custom/ec2-stack.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Backend } from '@aws-amplify/backend';

// Define the properties for our custom stack
type EC2StackProps = {
  // We can pass in resources from our main backend, like the storage bucket
};

// Define the custom stack
export class EC2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Create a Virtual Private Cloud (VPC) for our resources to live in.
    // This creates a secure, isolated network in your AWS account.
    const vpc = new ec2.Vpc(this, 'AppVPC', {
      maxAzs: 2, // Use 2 Availability Zones for high availability
    });

    // 2. Create an Application Load Balancer to distribute traffic.
    const alb = new elbv2.ApplicationLoadBalancer(this, 'AppALB', {
      vpc,
      internetFacing: true, // This makes the load balancer accessible from the internet
    });
    // Add a listener to accept HTTP traffic on port 80
    const listener = alb.addListener('HttpListener', { port: 80 });

    // 3. Define an Auto Scaling Group for our EC2 instances.
    const asg = new autoscaling.AutoScalingGroup(this, 'AppASG', {
      vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO
      ),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      minCapacity: 1, // Always have at least 1 instance running
      maxCapacity: 3, // Scale up to a maximum of 3 instances
    });

    // 4. Add a "User Data" script to install a web server on each new instance.
    // This script runs automatically when an instance boots up.
    asg.addUserData(
      'yum update -y',
      'yum install -y httpd', // Install Apache web server
      'systemctl start httpd',
      'systemctl enable httpd',
      'echo "<h1>Hello from EC2!</h1>" > /var/www/html/index.html' // Create a simple webpage
    );

    // 5. Set up a Scaling Policy for the Auto Scaling Group.
    // This will automatically add/remove instances based on CPU load.
    asg.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 50, // Add a new instance when CPU is over 50%
    });

    // 6. Connect the Load Balancer to the Auto Scaling Group.
    listener.addTargets('ASGTarget', {
      port: 80,
      targets: [asg],
    });

    // Output the public DNS name of the load balancer so we can access it
    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: alb.loadBalancerDnsName,
    });
  }
}