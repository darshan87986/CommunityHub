const MONGODB_DATA_API_URL = 'https://data.mongodb-api.com/app/<Your_App_ID>/endpoint/data/v1/action';
const API_KEY = 'your_api_key';

export const createEvent = async (eventData) => {
  const response = await fetch(`${MONGODB_DATA_API_URL}/insertOne`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': API_KEY,
    },
    body: JSON.stringify({
      dataSource: 'your_cluster',
      database: 'your_db',
      collection: 'events',
      document: eventData
    })
  });
  return response.json();
};