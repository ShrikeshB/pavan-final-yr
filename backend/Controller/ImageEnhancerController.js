// import fs from "fs";
// import axios from "axios";
// import FormData from "form-data"; // <-- you forgot this

// const enhanceHandler = async (req, res) => {
//   console.log("processing...");

//   if (!req.file) {
//     return res.status(400).json({ error: "Image file is required" });
//   }

//   const form = new FormData();
//   form.append("upscale_factor", "2");
//   form.append("format", "JPG");
//   form.append("mode", "sync");
//   form.append("image", fs.createReadStream(req.file.path)); // Read from uploaded file
//   console.log(req.file.path);
//   console.log(process.env.API_URL);
//   console.log(process.env.API_KEY);
  
//   try {
//     const response = await axios.post(process.env.API_URL, form, {
//       headers: {
//         ...form.getHeaders(),
//         "X-Picsart-API-Key": process.env.API_KEY,
//       },
//     });


    

//     // delete temp file safely
//     fs.unlink(req.file.path, (err) => {
//       if (err) console.error("Error deleting file:", err);
//     });

//     const upscaledImageUrl = response.data?.data?.url || response.data; // adjust to actual API response

//     if (!upscaledImageUrl) {
//       return res
//         .status(500)
//         .json({ error: "No upscaled image returned from Picsart" });
//     }

//     res.json({ upscaledImage: upscaledImageUrl });
//   } catch (error) {
//     // delete temp file safely even on error
//     fs.unlink(req.file.path, (err) => {
//       if (err) console.error("Error deleting file:", err);
//     });

//     console.error("Picsart API error:", error.response?.data || error.message);
//     res.status(500).json({ error: "Failed to upscale image" });
//   }
// };

// export { enhanceHandler }; // use ES module export consistently


import fs from "fs";
import axios from "axios";
import FormData from "form-data"; // needed for FormData

const enhanceHandler = async (req, res) => {
  console.log("processing...");

  if (!req.file) {
    return res.status(400).json({ error: "Image file is required" });
  }

  // build the multipart body
  const form = new FormData();
  form.append("upscale_factor", "2");
  form.append("format", "JPG");
  form.append("image", fs.createReadStream(req.file.path)); // attach uploaded file

  try {
    // call Picsart enhance API
    const response = await axios.post(
      "https://api.picsart.io/tools/1.0/upscale/enhance",
      form,
      {
        headers: {
          ...form.getHeaders(),
          "X-Picsart-API-Key": process.env.API_KEY, // or hardcode your key here
        },
      }
    );
    console.log(process.env.API_KEY);
    
    // delete local temp file safely
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting file:", err);
    });

    // extract URL (adjust according to actual response)
    const upscaledImageUrl = response.data?.data?.url || response.data;
    console.log(upscaledImageUrl);
    
    if (!upscaledImageUrl) {
      return res
        .status(500)
        .json({ error: "No upscaled image returned from Picsart" });
    }

    res.json({ upscaledImage: upscaledImageUrl });
  } catch (error) {
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting file:", err);
    });
    console.log(error.message);
    
    console.error("Picsart API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to upscale image" });
  }
};

export { enhanceHandler };
