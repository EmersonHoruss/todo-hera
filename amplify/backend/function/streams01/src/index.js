exports.handler = async (event) => {
  console.log("📥 DynamoDB Stream Event Received");

  for (const record of event.Records) {
    const action = record.eventName; // INSERT, MODIFY, REMOVE
    const newImage = record.dynamodb?.NewImage;
    const oldImage = record.dynamodb?.OldImage;

    if (action === "INSERT") {
      const user = formatItem(newImage);
      console.log("✅ Created User:");
      console.log(user);
    } else if (action === "MODIFY") {
      const before = formatItem(oldImage);
      const after = formatItem(newImage);
      console.log("✏️ Updated User:");
      console.log("Before:", before);
      console.log("After :", after);
    } else if (action === "REMOVE") {
      const user = formatItem(oldImage);
      console.log("🗑️ Deleted User:");
      console.log(user);
    } else {
      console.log("❓ Unknown operation:", action);
    }
  }
};

// Converts DynamoDB item format to plain JS object
function formatItem(dynamoItem) {
  const result = {};
  for (const key in dynamoItem) {
    const dataType = Object.keys(dynamoItem[key])[0]; // e.g., 'S', 'N'
    result[key] = dynamoItem[key][dataType];
  }
  return result;
}
