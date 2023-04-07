# add your create-obituary function here
import boto3
import time
import requests
import hashlib
import json
from io import BytesIO

ssm = boto3.client("ssm", "ca-central-1")
polly = boto3.client("polly", "ca-central-1")
dynamodb = boto3.resource("dynamodb")
table=dynamodb.Table("obituary-table-30157640")

def get_cloudinary():
    response = ssm.get_parameters(
        Names=["Cloudinary"],WithDecryption=True
    )
    for parameter in response["Parameters"]:
        return parameter["Value"]

def get_chatGPT():
    response = ssm.get_parameters(
        Names=["ChatGPT"],WithDecryption=True
    )
    for parameter in response["Parameters"]:
        return parameter["Value"]

def get_cloudinary_secret():
    response = ssm.get_parameters(
        Names=["CloudSecret"],WithDecryption=True
    )
    for parameter in response["Parameters"]:
        return parameter["Value"]

#https://api.cloudinary.com/v1_1/dokbawvgq/image/upload
def create_handler(event, context):
    body = json.loads(event["body"].replace('\'', '"'))

    
    prompt="write an obituary about a fictional character named {} who was born on {} and died on {}.".format(body["Name"], body["Birth"], body["Death"])
    
    #ChatGPT
    GPT_api_key = "Bearer "+str(get_chatGPT())
    url = "https://api.openai.com/v1/completions"
    headers = {"Content-Type": "application/json", "Authorization": "Bearer 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"}
    data = {"model": "text-davinci-003", "prompt": prompt, "max_tokens":600}
    
    GPTresponse = requests.post(url, headers=headers, json=data)
    Obituary= GPTresponse.json()["choices"][0]["text"]
    
    #Polly
    response=polly.synthesize_speech(OutputFormat="mp3",Text=Obituary,VoiceId="Amy")

    
    #Cloudinary
    timeStamp = str(time.time())
    signature = "timestamp=" + timeStamp + str(get_cloudinary_secret())
    api_key = get_cloudinary()
    signature = signature.encode()
    signature = hashlib.sha1(signature)
    signature = signature.hexdigest()
    Cloudpayload = {"api_key": api_key, "timestamp": timeStamp,"signature": signature}
    files = {'file': response["AudioStream"]}
    CloudResponse = requests.post("https://api.cloudinary.com/v1_1/dokbawvgq/auto/upload", data=Cloudpayload, files=files)
    
    PollyURL = CloudResponse.json()["secure_url"]
    Items={"Name": body["Name"], "ImageURL": body["ImageURL"], "PollyURL": PollyURL, "Death":body["Death"], "Birth":body["Birth"], "Obituary":Obituary}
    response = table.put_item(Item=Items)
    
    return response
    
    