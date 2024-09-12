<h1 align="center">AWS Security Camera</h1>
<p>
  This project implements a cloud-based security camera system using AWS services. The system allows users to monitor camera recordings via a web interface built with Angular and includes a Flask backend that interacts with AWS services. Additionally, it contains an IoT_Device_Manager submodule that manages the IoT device (a Raspberry Pi or similar) which records video, detects faces using OpenCV, and communicates with AWS.

The infrastructure is deployed using an AWS CloudFormation YAML file to automate the setup of necessary AWS services such as S3, Lambda, IoT Core, and more.
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
<h2>Setup Instructions</h2>
