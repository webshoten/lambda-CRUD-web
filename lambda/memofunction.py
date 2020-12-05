import json
import boto3
from boto3.dynamodb.conditions import Key
dynamoDB = boto3.resource('dynamodb')
webmemotable = dynamoDB.Table('webmemo')
webmemosequencetable = dynamoDB.Table('webmemo-sequence')

def getAll():
    try:
        return webmemotable.scan()['Items']
    except Exception as e:
        return -1


def getFromParttitionKey(partkey):
    try:
        partition_key = {"memoid": partkey}
        return webmemotable.get_item(Key=partition_key)
    except Exception as e:
        return -1

def countup(sequence_key):
        response = webmemosequencetable.update_item(
            Key= {
                'sequenceid': sequence_key
                },
            UpdateExpression="ADD #name :increment",
            ExpressionAttributeNames={
                '#name':'counter'
                },
            ExpressionAttributeValues={
                ":increment": int(1)
                },
            ReturnValues="UPDATED_NEW"
        )
        return response['Attributes']['counter']

def addOne(insert_item):
    try:
        insert_item['memoid'] = str(countup('webmemo'))
        webmemotable.put_item(
         Item = insert_item
         )
        return  1
    except Exception as e:
        return -1

def deleteOne(memoid):
    try:
        webmemotable.delete_item(
            Key={
                'memoid': memoid
            }
        )
        return  1
    except Exception as e:
        return -1
        
def updateOne(item):
    try:
        webmemotable.update_item(
        Key={
         "memoid": item["memoid"]
        },
        UpdateExpression="SET #dt = :date, detail = :detail, sortindex = :sortindex, userid = :userid",
        ExpressionAttributeNames={
		'#dt': 'date'
	    },
        ExpressionAttributeValues={
        ":date": item["date"],
        ":detail":  item["detail"],
        ":sortindex":  item["sortindex"],
        ":userid":  item["userid"]
        }
        )
        return  1
    except Exception as e:
        return  -1
        


def lambda_handler(event, context):
    # TODO implement

    if event['method']=='GET': 
        if event['body']['memoid'] == "":
            return {
             'statusCode': 200,
             "headers": {
             "Content-Type": 'application/json',
             "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
             "Access-Control-Allow-Methods": "GET",
             "Access-Control-Allow-Origin": "*"
              },
             'body': getAll() 
               }
        else :
            return {
             'statusCode': 200,
             "headers": {
             "Content-Type": 'application/json',
             "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
             "Access-Control-Allow-Methods": "GET",
             "Access-Control-Allow-Origin": "*"
              },
             'body': getFromParttitionKey(event['body']['memoid'])['Item']
               }
             
    elif event['method']=='DELETE':
        return {
             'statusCode': 200,
             "headers": {
             "Content-Type": 'application/json',
             "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
             "Access-Control-Allow-Methods": "DELETE",
             "Access-Control-Allow-Origin": "*"
              },
             'body':str(deleteOne(event['body']['memoid']))
               }
    elif event['method']=='PUT':
        return {
             'statusCode': 200,
             "headers": {
             "Content-Type": 'application/json',
             "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
             "Access-Control-Allow-Methods": "PUT",
             "Access-Control-Allow-Origin": "*"
              },
             'body':updateOne(event['body'])
               }
    elif event['method']=='POST':
        return {
             'statusCode': 200,
             "headers": {
             "Content-Type": 'application/json',
             "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
             "Access-Control-Allow-Methods": "POST",
             "Access-Control-Allow-Origin": "*"
              },
             'body':addOne(event['body'])
               }