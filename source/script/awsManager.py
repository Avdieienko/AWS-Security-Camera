import boto3
import json
import boto3.session
from botocore.exceptions import ClientError, NoCredentialsError


def configure_aws_user():
  """ Configures AWS account based on config.json file, located in the same folder.

  Returns:
      AWS-Session: Session for a camera user
  """
  config = {}

  try:
    with open("config.json") as config_json:
        config = json.load(config_json)
  except Exception as e:
    print(f"Error loading config: {e}")
    return None

  session = boto3.Session(
    aws_access_key_id=config["access_key_id"],
    aws_secret_access_key=config["secret_access_key"],
    region_name=config["region"],
    aws_session_token=None ,
  )

  return session

def assume_role(console, session_name, role_tags):
  sts_client = console.client("sts")
  id = sts_client.get_caller_identity()["Account"]
  try:
    response = sts_client.assume_role(
      RoleArn=f"arn:aws:iam::{id}:role/IoTDeviceWriteVideo",
      RoleSessionName=session_name,
      Tags = [{'Key': key, 'Value': value} for key, value in role_tags.items()],
      DurationSeconds=1200,
    )
  except ClientError as e:
    print(f"Error assuming role: {e}")
    return None

  return response['Credentials']

def upload_to_s3_with_temporary_credentials(file_name, bucket, object_name, temp_creds):
  """Upload a file to an S3 bucket with tags using temporary credentials."""
  s3_client = boto3.client(
    's3',
    aws_access_key_id=temp_creds['AccessKeyId'],
    aws_secret_access_key=temp_creds['SecretAccessKey'],
    aws_session_token=temp_creds['SessionToken']
  )

  # Convert tags dictionary to the required format

  try:
    # Upload the file with tags
    s3_client.upload_file(
        file_name, 
        bucket, 
        object_name
    )
    print(f"File {file_name} uploaded to {bucket}/{object_name}")
    return True
  except FileNotFoundError:
    print("The file was not found")
    return False
  except NoCredentialsError:
    print("Credentials not available")
    return False
  except ClientError as e:
    print(f"Error uploading file: {e}")
    return False
