exports.handler = async (event) => {
  console.log('📥 DynamoDB Stream Event Received');

  for (const record of event.Records) {
    const action = record.eventName; // INSERT, MODIFY, REMOVE
    const newImage = record.dynamodb?.NewImage;
    const oldImage = record.dynamodb?.OldImage;

    if (action === 'INSERT') {
      console.log('✅ Created Todo:');
      console.log(formatItem(newImage));
    } else if (action === 'MODIFY') {
      console.log('✏️ Updated Todo:');
      console.log('Before:', formatItem(oldImage));
      console.log('After :', formatItem(newImage));
    } else if (action === 'REMOVE') {
      console.log('🗑️ Deleted Todo:');
      console.log(formatItem(oldImage));
    } else {
      console.log('❓ Unknown operation:', action);
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