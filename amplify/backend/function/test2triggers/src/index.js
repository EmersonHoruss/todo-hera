/* Amplify Params - DO NOT EDIT
	API_USERS_GRAPHQLAPIENDPOINTOUTPUT
	API_USERS_GRAPHQLAPIIDOUTPUT
	API_USERS_GRAPHQLAPIKEYOUTPUT
	API_USERS_TODOTABLE_ARN
	API_USERS_TODOTABLE_NAME
	API_USERS_USERTABLE_ARN
	API_USERS_USERTABLE_NAME
	ENV
	FUNCTION_USERS_NAME
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  for (const record of event.Records) {
    console.log("record event id", record.eventID);
    console.log("record event name", record.eventName);
    console.log("DynamoDB Record: %j", record.dynamodb);
    console.log("record", record);
  }
  return Promise.resolve("Successfully processed DynamoDB record");
};
