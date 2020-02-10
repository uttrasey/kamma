const AWS = require("aws-sdk");
const uuid = require("uuid");
const mailgun = require("mailgun-js");

const DDB = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const mg = mailgun({
  apiKey: process.env.MAILGUN_APIKEY,
  domain: process.env.MAILGUN_DOMAIN
});

const createPutParams = (yourName, theirName, theirEmail) => ({
  TableName: "shares",
  Item: {
    id: { S: uuid.v4() },
    sharedBy: { S: yourName },
    sharedTo: { S: theirName },
    sharedToEmail: { S: theirEmail }
  }
});

const createEmail = (yourName, theirName, theirEmail) => ({
  from:
    "Mailgun Sandbox <postmaster@sandbox4fbf1f97eb344a2b8c4496a015799797.mailgun.org>",
  to: theirEmail,
  subject: `${yourName} has shared something cool with you`,
  text: `Hi ${theirName}, ${yourName} really wanted you to see this...`
});

/**
 * This is missing data validation and more hardened error handling etc 5XX, 4XX... for now assumes happy path
 */
const handler = async event => {
  const { yourName, theirName, theirEmail } = JSON.parse(event.body);

  const params = createPutParams(yourName, theirName, theirEmail);

  try {
    await DDB.putItem(params).promise();
  }
  catch (e) {
    console.log(`Could not write to Dynamo ${e}`);
  }
  

  const emailDetails = createEmail(yourName, theirName, theirEmail);

  // share email
  try {
    await mg.messages().send(emailDetails);
  } catch (e) {
    console.log(`Could not send email ${e}`);
  }

  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify({
      id: params.Item.id,
      yourName,
      theirName,
      theirEmail
    })
  };
};

module.exports = { handler };
