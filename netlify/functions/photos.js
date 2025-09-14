// netlify/functions/photos.js
const GooglePhotosAlbum = require("google-photos-album-image-url-fetch");

const ALBUM_LINK = "https://photos.app.goo.gl/TBdqFucP8dKTDR2n9"; // <-- replace with your album

exports.handler = async function (event, context) {
  try {
    // Fetch all image URLs from the Google Photos album
    const photos = await GooglePhotosAlbum.fetchImageUrls(ALBUM_LINK);

    // Return JSON response
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // allow browser requests
      },
      body: JSON.stringify(photos),
    };
  } catch (err) {
    console.error("Error fetching album:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch album", details: err.message }),
    };
  }
};
