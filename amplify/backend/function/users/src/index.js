const https = require("https");

const SENDBIRD_API_TOKEN = process.env.SENDBIRD_API_TOKEN;
const SENDBIRD_APP_ID = process.env.SENDBIRD_APP_ID;
const SENDBIRD_HOST = `api-${SENDBIRD_APP_ID}.sendbird.com`;

exports.handler = async (event) => {
  console.log("📥 DynamoDB Stream Event Received");

  for (const record of event.Records) {
    const action = record.eventName;
    const newImage = record.dynamodb?.NewImage;
    const oldImage = record.dynamodb?.OldImage;

    const newUser = newImage ? formatItem(newImage) : null;
    const oldUser = oldImage ? formatItem(oldImage) : null;

    console.log("*********** new user ***********");
    console.log(newUser);
    console.log("*********** old user ***********");
    console.log(oldUser);

    try {
      if (action === "INSERT") {
        console.log("✅ Creating Sendbird user:", newUser);
        await sendToSendbird("POST", "/v3/users", {
          user_id: newUser.id,
          nickname: newUser.name,
          profile_url: "",
          metadata: {
            phone: newUser.phone,
            age: String(newUser.age ?? ""),
            address: newUser.address ?? "",
          },
        });
      } else if (action === "MODIFY") {
        console.log("✏️ Updating Sendbird user:", newUser);
        await sendToSendbird("PUT", `/v3/users/${newUser.id}`, {
          nickname: newUser.name,
        });
        await sendToSendbird("PUT", `/v3/users/${newUser.id}/metadata`, {
          phone: newUser.phone,
          age: String(newUser.age ?? ""),
          address: newUser.address ?? "",
        });
      } else if (action === "REMOVE") {
        console.log("🗑️ Deleting Sendbird user:", oldUser?.id);
        await sendToSendbird("DELETE", `/v3/users/${oldUser.id}`);
      } else {
        console.log("❓ Unknown action:", action);
      }
    } catch (err) {
      console.error(`❌ Failed ${action} for user`, err);
    }
  }
};

// Convert DynamoDB stream format to plain object
function formatItem(dynamoItem) {
  const result = {};
  for (const key in dynamoItem) {
    const type = Object.keys(dynamoItem[key])[0];
    result[key] = dynamoItem[key][type];
  }
  return result;
}

// Send HTTPS request to Sendbird
function sendToSendbird(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : "";
    const options = {
      hostname: SENDBIRD_HOST,
      path: path,
      method: method,
      headers: {
        "Api-Token": SENDBIRD_API_TOKEN,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let response = "";
      res.on("data", (chunk) => (response += chunk));
      res.on("end", () => {
        console.log(`📡 Sendbird ${method} response:`, response);
        resolve();
      });
    });

    req.on("error", (e) => {
      console.error("❌ Sendbird API error:", e);
      reject(e);
    });

    if (data) req.write(data);
    req.end();
  });
}
