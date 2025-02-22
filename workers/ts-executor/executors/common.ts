// Description: This file contains the common functions used by the executors.

// Function to execute an HTTP request
export async function executeHttpRequest(config: any): Promise<any> {
  try {
    const response = await fetch(config.url, {
      method: config.method,
      headers: config.headers,
      body: config.data,
    });
    const body = await response.text();
    return {
      status: response.status,
      headers: response.headers,
      data: body,
    };
  } catch (error) {
    throw error;
  }
}
