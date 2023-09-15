const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 4000;

// Set up Multer for handling file uploads
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Serve uploaded images statically
app.use('/uploads', express.static('uploads'));

// Array to store uploaded images with descriptions
const uploadedImages = [];

// Handle image uploads and descriptions
app.post('/upload', upload.single('image'), (req, res) => {
  // Retrieve the image description from the request
  const imageDescription = req.body.description;

  // Get the filename of the uploaded image
  const filename = req.file.filename;

  // Store the uploaded image and its description
  const uploadedImage = { filename, description: imageDescription };
  uploadedImages.push(uploadedImage);

  // Respond with a success message
  const redirectDelay = 5000; // 5000 milliseconds (5 seconds)

  // Create the HTML response with the countdown timer
  const htmlResponse = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Upload Complete</title>
      <style>
        /* Add your CSS styles here */
        body {
          background-color: #f0f0f0;
          text-align: center;
        }
        p {
          font-size: 24px;
          color: green;
        }
      </style>
    </head>
    <body>
      <p>Image uploaded successfully. Redirecting in <span id="timer">${redirectDelay / 1000}</span> seconds.</p>
      <script>
        // Function to update the timer
        function updateTimer() {
          const timerElement = document.getElementById('timer');
          const remainingTime = parseInt(timerElement.textContent) - 1;
          timerElement.textContent = remainingTime;

          if (remainingTime <= 0) {
            // Redirect when the countdown reaches 0
            window.location.href = 'https://suprised-emotionex.onrender.com/#downside'; // Redirect to your original localhost
          }
        }

        // Initial call to start the timer
        setInterval(updateTimer, 1000); // Update the timer every second
      </script>
    </body>
    </html>
  `;

  // Respond with the HTML response
  res.send(htmlResponse);

});

// Serve a list of image filenames with descriptions as JSON
app.get('/images-with-descriptions', (req, res) => {
  // Respond with the array of uploaded images and their descriptions
  res.json(uploadedImages);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
