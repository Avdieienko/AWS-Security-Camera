<h1 align="center">AWS Security Camera</h1>
<p>
  <img src="https://img.shields.io/badge/AWS-IAM-DD344C?logo=amazoniam&logoColor=white&style=flat-square"/>
  <img src="https://img.shields.io/badge/AWS-S3-green?logo=amazons3&logoColor=white&style=flat-square"/>
  <img src="https://img.shields.io/badge/AWS-DynamoDB-blue?logo=amazondynamodb&style=flat-square"/>
  <img src="https://img.shields.io/badge/AWS-CloudFront-purple?logo=amazonwebservices&style=flat-square"/>
  <img src="https://img.shields.io/badge/AWS-CloudFormation-pink?logo=amazonwebservices&style=flat-square"/>
  <img src="https://img.shields.io/badge/AWS-boto3-orange?logo=amazonwebservices&style=flat-square"/>
  <img src="https://img.shields.io/badge/OpenCV-4.10.0.84-5C3EE8?logo=opencv&style=flat-square"/>
  <img src="https://img.shields.io/badge/Angular-v18-red?logo=angular&style=flat-square"/>
  <img src="https://img.shields.io/badge/Python-Flask-yellow?logo=flask&style=flat-square"/>
  <img src="https://img.shields.io/badge/IaC-YAML-red?logo=yaml&style=flat-square"/>
</p>
<p>
  This project implements a cloud-based security camera system using AWS services. The system allows users to monitor camera recordings via a web interface built with Angular and includes a Flask backend that interacts with AWS services. Additionally, it contains an IoT_Device_Manager submodule that manages the IoT device (a Raspberry Pi or similar) which records video, detects faces using OpenCV, and communicates with AWS.

The infrastructure is deployed using an AWS CloudFormation YAML file to automate the setup of necessary AWS services.
</p>

<h2>Features</h2>

- **Angular Web Interface**: A frontend website to access recorded footage.
- **Flask Backend**: Communication between the frontend and AWS services.
- **<a href="https://github.com/Avdieienko/IoT_Device_Manager">IoT_Device_Manager</a>**: Python and Bash scripts to manage IoT devices
  * Record video using a connected camera
  * Detect faces
  * Communicate with AWS to upload footage
- **AWS Infrastructure**: CloudFormation YAML file to provision all necessary AWS services

<h2>AWS Services Used</h2>

- **S3**: For storing video recordings
- **DynamoDB**: For storing registered IoT devices info
- **CloudFront**: Video streaming in Angular Web
- **CloudFormation**: Infrastracture as Code YAML template for fast infrastructure deployment

<h2>Setup Instructions</h2>

For IoT device setup refer to <a href="https://github.com/Avdieienko/IoT_Device_Manager">IoT_Device_Manager</a>.<br>

1. Deploy AWS Infrastructure using AWS CloudFormation service and cformation.yaml template
2. Set Up IoT device(RaspPi-4, RaspPi-5, Windows, MacOS, etc...) and generate RSA keys for cloudfront encryption using <a href="https://github.com/Avdieienko/IoT_Device_Manager">IoT_Device_Manager</a>
3. Run Flask Backend and add put private key called private.pem in the same folder as Flask
4. Retrieve access keys for app user, you will need it to login to your account in web
5. Run Angular Frontend
