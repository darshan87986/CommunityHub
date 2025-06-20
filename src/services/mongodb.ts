const MONGODB_API_URL = import.meta.env.VITE_MONGODB_API_URL;
const API_KEY = import.meta.env.VITE_MONGODB_API_KEY;

export const createEvent = async (eventData: any) => {
  try {
    const response = await fetch(`${MONGODB_API_URL}/insertOne`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY,
      },
      body: JSON.stringify({
        dataSource: 'Cluster0',
        database: 'events_db',
        collection: 'events',
        document: eventData
      })
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    console.error('MongoDB Error:', error);
    throw error;
  }
};