exports.handler = async function(event, context) {
  const apiKey = process.env.SWISE_API_KEY;
  const endpoint = "https://swise.center/api";

  try {
    const response = await fetch(endpoint, {
      method: event.httpMethod,
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: event.body
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
