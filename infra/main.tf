terraform {
  required_providers {
    aws = {
      version = ">= 4.0.0"
      source  = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region = "ca-central-1"
}

resource "aws_iam_role" "lambda_exec" {
  name               = "iam-for-lambda-obituary"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}


# two lambda functions w/ function url
# one dynamodb table
# roles and policies as needed
# step functions (if you're going for the bonus marks)

resource "aws_iam_role_policy_attachment" "lambda_exec_policy" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda_exec.name
}
resource "aws_iam_role_policy_attachment" "lambda_polly" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonPollyFullAccess"
  role       = aws_iam_role.lambda_exec.name
}
resource "aws_iam_role_policy_attachment" "lambda_dynamodb" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
  role       = aws_iam_role.lambda_exec.name
}
resource "aws_iam_role_policy_attachment" "lambda_SSM" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMFullAccess"
  role       = aws_iam_role.lambda_exec.name
}
data "archive_file" "zip_the_create_code" {
type        = "zip"
source_dir  = "../functions/create-obituary"
output_path = "../functions/create-obituary/create.zip"
}

resource "aws_lambda_function" "terraform_create_lambda_func" {
filename                       = "../functions/create-obituary/create.zip"
function_name                  = "create_obituary_handler-30139604"
role                           = aws_iam_role.lambda_exec.arn
handler                        = "create_obituary.create_handler"
runtime                        = "python3.8"
timeout = 30
}
resource "aws_lambda_function_url" "url_create" {
  function_name      = aws_lambda_function.terraform_create_lambda_func.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = [ "POST"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

data "archive_file" "zip_the_get_code" {
type        = "zip"
source_dir  = "../functions/get-obituaries"
output_path = "../functions/get-obituaries/get.zip"
}

resource "aws_lambda_function" "terraform_get_lambda_func" {
filename                       = "../functions/get-obituaries/get.zip"
function_name                  = "get_obituary_handler-30139604"
role                           = aws_iam_role.lambda_exec.arn
handler                        = "get_obituaries.get_handler"
runtime                        = "python3.8"
timeout = 30
}
resource "aws_lambda_function_url" "url_get" {
  function_name      = aws_lambda_function.terraform_get_lambda_func.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

resource "aws_dynamodb_table" "obituary-table" {
  name = "obituary-table-30157640"
  billing_mode = "PROVISIONED"
  read_capacity= "30"
  write_capacity= "30"
  attribute {
    name = "Name"
    type = "S"
  }
  attribute {
    name = "PollyURL"
    type = "S"
  }
  hash_key = "Name"
  range_key = "PollyURL"
}

output "dynamodb_name" {
  value = aws_dynamodb_table.obituary-table
}

output "lambda_url_get" {
  value = aws_lambda_function_url.url_get.function_url
}
output "lambda_url_create" {
  value = aws_lambda_function_url.url_create.function_url
}