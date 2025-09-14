// This Netlify Function fetches and parses image URLs from a Google Photos album.
// The method is based on a blog post that uses a regular expression to extract
// the URLs directly from the HTML content of the album page.

// The main handler for the Netlify Function.
exports.handler = async (event) => {
  // Extract the album URL from the query string parameters of the request.
  const { albumUrl } = event.queryStringParameters;

  // Validate that the albumUrl parameter was provided.
  if (!albumUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing albumUrl query parameter.' }),
    };
  }

  try {
    // Use the native `fetch` API to get the HTML content of the album URL.
    const response = await fetch(albumUrl);

    // Check if the request was successful.
    if (!response.ok) {
      throw new Error(`Failed to fetch album content with status: ${response.status}`);
    }

    // Read the response body as plain text.
    const htmlContent = await response.text();

    // The regular expression to find image URLs that start with "https://lh3.googleusercontent.com/pw/".
    // This is a refined regex that looks for URLs within a specific pattern.
    const regex = /"(https:\/\/lh3\.googleusercontent\.com\/pw\/[a-zA-Z0-9\-_]*)"/g;
    
    // An array to store all found URLs.
    let imageUrls = [];
    
    // A Set to store unique URLs and avoid duplicates.
    const uniqueUrls = new Set();
    
    let match;
    // Loop through all matches found by the regex in the HTML content.
    while ((match = regex.exec(htmlContent)) !== null) {
      // The captured group (the part in parentheses) is the URL itself.
      const url = match[1];
      
      // Add the found URL to the Set to ensure uniqueness.
      if (url) {
        uniqueUrls.add(url);
      }
    }
    
    // Convert the Set back to an array to be returned.
    imageUrls = Array.from(uniqueUrls);

    // If no images are found, return a 404 status code with an error message.
    if (imageUrls.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'No images found. Please ensure the album is public and the URL is correct.' }),
      };
    }

    // If successful, return the fetched URLs as a JSON response.
    return {
      statusCode: 200,
      body: JSON.stringify(imageUrls),
    };

  } catch (error) {
    // Log any errors for debugging in the Netlify function logs.
    console.error('Error fetching image URLs:', error);

    // Return a 500 status code for internal server errors.
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch image URLs.', details: error.message }),
    };
  }
};
