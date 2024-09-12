import json
from flask import Flask, request, jsonify, current_app as app
from flask_cors import CORS, cross_origin
import boto3
import datetime
from botocore.exceptions import ClientError
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding
from botocore.signers import CloudFrontSigner

app = Flask(__name__)
CORS(app)

@app.route("/login", methods=["POST"])
# @cross_origin()
def login():
    id = request.json["id"]
    key = request.json["key"]

    session = boto3.Session(
      aws_access_key_id=id,
      aws_secret_access_key=key,
      region_name="eu-west-2",
      aws_session_token=None ,
    )


    sts_client = session.client("sts")
    try:
      identity = sts_client.get_caller_identity()
      id = identity["Account"]
      response = sts_client.assume_role(
        RoleArn=f"arn:aws:iam::{id}:role/SecurityCameraAppGetVideo",
        RoleSessionName="test",
        DurationSeconds=1200,
      )
    except ClientError as e:
      return jsonify(f'{e.response["Error"]["Code"]}: {e.response["Error"]["Message"]}'), 500

    credentials = response['Credentials']

    s3_client = boto3.client(
      's3',
      aws_access_key_id=credentials['AccessKeyId'],
      aws_secret_access_key=credentials['SecretAccessKey'],
      aws_session_token=credentials['SessionToken']
    )

    # Loop over all buckets and get one with tag 'id' equal to 'security_camera_bucket'
    buckets = s3_client.list_buckets()
    bucket_name = None
    for bucket in buckets['Buckets']:
      try:
        bucket_tags = s3_client.get_bucket_tagging(Bucket=bucket['Name'])
      except Exception as e:
        print(f"Bucket {bucket['Name']} has no tags.Continue...")
        continue
      for tag in bucket_tags['TagSet']:
        if tag['Key'] == 'id' and tag['Value'] == 'security_camera_bucket':
          bucket_name = bucket['Name']
          break

    if not bucket_name:
      return jsonify("No required S3 bucket was found."), 500

    files_list = []
    continuation_token = None

    while True:
      if continuation_token:
        s3_response = s3_client.list_objects_v2(
            Bucket=bucket_name,
            ContinuationToken=continuation_token
        )
      else:
        s3_response = s3_client.list_objects_v2(Bucket=bucket_name)

        if 'Contents' in s3_response:
          for obj in s3_response['Contents']:
            file = {"datetime":obj['Key'][0:-4]}
            key = obj['Key']

            try:
              tag_response = s3_client.get_object_tagging(Bucket=bucket_name, Key=key)
              tags = tag_response['TagSet']

              if tags:
                for tag in tags:
                  if tag['Key'] == 'deviceID':
                    file[tag['Key']] = tag['Value']
              files_list.append(file)
            except Exception:
              return jsonify("Error getting tags"), 500

          # Check if there are more files to list
          if s3_response.get('IsTruncated'):  # True if there are more pages
            continuation_token = s3_response['NextContinuationToken']
          else:
            break

    files = {}

    for item in files_list:
      device_id = item["deviceID"]
      date = item["datetime"][:10]  # Extract the date part (first 10 characters)

      if device_id not in files:
          files[device_id] = {}

      if date not in files[device_id]:
          files[device_id][date] = []

      files[device_id][date].append(item["datetime"])

    # Now 'files' will be in the desired format

    devices = {}
    try:
      db_client = boto3.client(
        'dynamodb',
        aws_access_key_id=credentials['AccessKeyId'],
        aws_secret_access_key=credentials['SecretAccessKey'],
        aws_session_token=credentials['SessionToken'],
        region_name=session.region_name
      )

      table_names = []
      for table in db_client.list_tables()['TableNames']:
        table_names.append(table)

      for tableName in table_names:
        table_arn = db_client.describe_table(TableName=tableName)['Table']['TableArn']

        # List the tags of the table
        tags_response = db_client.list_tags_of_resource(ResourceArn=table_arn)
        tags = tags_response["Tags"]
        for tag in tags:
          if tag['Key'] == 'id' and tag['Value'] == 'security_camera_db_table':
            items = db_client.scan(
              TableName=tableName
            )["Items"]
            for item in items:
              devices[item["deviceID"]["S"]] = {
                "deviceName":item["deviceName"]["S"],
                "deviceType":item["deviceType"]["S"],
                "cameraType":item["cameraType"]["S"]
              }
            break
      if not devices:
        return jsonify("No required tablen found"), 500
    except Exception as e:
      return jsonify(f"Error getting devices: {e}"), 500


    cloudfront_client = boto3.client(
      'cloudfront',
      aws_access_key_id=credentials['AccessKeyId'],
      aws_secret_access_key=credentials['SecretAccessKey'],
      aws_session_token=credentials['SessionToken']
    )

    distribution_domain = None

    distributions = cloudfront_client.list_distributions()
    if distributions["DistributionList"]["Quantity"] > 0:
      for distribution in distributions["DistributionList"]["Items"]:
        distribution_tags = cloudfront_client.list_tags_for_resource(
            Resource=distribution["ARN"]
        )
      for item in distribution_tags["Tags"]["Items"]:
        if item["Key"] == "id" and item["Value"] == "security_camera_distribution":
          distribution_domain = distribution["DomainName"]
          break
    else:
      return jsonify("No CloudFront distributions detected."), 500

    if not distribution_domain:
      return jsonify("No CloudFront distribution with the required tags found."), 500

    return jsonify({"recordings":files, "devices":devices, "distribution":distribution_domain}), 200

@app.route("/sign", methods=["POST"])
def sign_url():
  distribution = request.json["distribution"]
  key = request.json["key"]

  def rsa_signer(message):
    with open('private.pem', 'rb') as key_file:
        private_key = serialization.load_pem_private_key(
          key_file.read(),
          password=None,
          backend=default_backend()
        )
    return private_key.sign(message, padding.PKCS1v15(), hashes.SHA1())

  key_id = ""

  with open("config.json", "r") as file:
    data = json.load(file)
    key_id = data["key-pair-id"]

  expire_date = datetime.datetime.now() + datetime.timedelta(hours=1)

  cloudfront_signer = CloudFrontSigner(key_id, rsa_signer)

  url = f"https://{distribution}/{key}.mp4"

  signed_url = cloudfront_signer.generate_presigned_url(
    url, date_less_than=expire_date)

  return jsonify({"url":signed_url}), 200

if __name__ == "__main__":
    app.run()