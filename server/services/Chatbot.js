require("dotenv").config();
const CREDENTIALS = require("../DialogflowCredentials.json");
const dialogflow = require("@google-cloud/dialogflow");

const CONFIGURATION = {
  credentials: {
    private_key: CREDENTIALS.private_key,
    client_email: CREDENTIALS.client_email,
  },
};

const sessionClient = new dialogflow.SessionsClient(CONFIGURATION);

const detectIntent = async (languageCode, queryText, sessionId) => {
  let sessionPath = sessionClient.projectAgentSessionPath(
    CREDENTIALS.project_id,
    sessionId
  );

  // The text query request.
  let request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: queryText,
        // The language used by the client (en-US)
        languageCode: languageCode,
      },
    },
  };
  const response = await sessionClient.detectIntent(request);
  const message = response[0].queryResult.fulfillmentText;
  const parameters = response[0].queryResult.parameters.fields;

  return {
    message,
    parameters,
    author: "chatbot",
  };
};

module.exports = { detectIntent };
