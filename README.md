# Audio Tutor - Tarini Gupta
## DALI Lab Application - 25X

### Project Description
AudioTutor is a web application that converts user inputted text or PDFs into mp3 audio files and an additional summary of the inputted text. This program is designed for learners, busy professionals, or anyone who prefers listening over reading. Users can upload a PDF or type text, generate an MP3 audio file, receive a summary, download the audio, and even print the summary directly from the browser.  

### Demo Video
https://youtu.be/ffeOilfKAXM

### Local Setup Instructions
1. Clone Repository
2. Navigate into the project directory (`audiotutor`)
3. Run `npm install`
4. Add to .env.local file
    GEMINI_API_TOKEN (You can get a Gemini API key by creating a project in Google AI Studio and enabling the Gemini API)
5. Add `googleservicekey.json` file + add to .gitignore
    (Download googleservicekey.json from Google Cloud Console after creating a service account with Text-to-Speech API access)
6. Run `npm run dev`

### Learning Journey

##### Inspiration
As students we are always busy; whether it be with clubs, class work, or just hanging out with friends, we try to optimize every part of our day. With the rise and efficiency of AI recently, we often end up leaving our "unwanted" tasks for ChatGPT or Copilot to do for us. If I had to pick one thing that I use ChatGPT for, its to summarize my readings. Sometimes I feel like reading a 30-40 page article or handout is a waste of time when I can just ask ChatGPT to give me a summary and main points I can speak to in class. This gives me more time to focus on other things or even go to the gym, workout, etc. With audiotutor, my main goal was to bring back the importance of completing the day-to-day assignments to really get the most out of the classwork. We are spending so much time and money at such a priveleged school, and not absorbing all the knowledge being presented to us would be a waste. Audiotutor's almost podcast style dictation of the text allows you to listen to your readings while walking to class, working out at the gym, cleaning your room, etc. Additionally, the summary provided at the end will drive home the main points of your reading, in case you missed anything while listening to it. 

##### New Technologies
Before building AudioTutor, I had never worked with APIs, so a big part of this project involved learning how to integrate them effectively. I taught myself by reading documentation and watching tutorials on YouTube, gradually becoming comfortable with authentication, endpoints, and handling responses. I chose Next.js App Router because it provided a unified framework for both the frontend and backend API handling, making it easier to keep everything in one project. For converting text to audio, I used the Google Text-to-Speech API, which offered reliable, high-quality synthesis and supported multiple voices and formats. To create concise summaries, I integrated the Gemini API, which allowed me to generate tailored summaries directly from user input. Finally, I used pdfjs-dist for client-side PDF text extraction, which eliminated the need for additional backend processing and made the app more lightweight and responsive.

##### Challenges
One of the first challenges I faced was simply getting started with the project. I had never used the Next.js framework before, and I had to learn how to retrieve data from APIs and work with environment variables securely. This initial phase was overwhelming, but it taught me how to navigate new technologies by relying on documentation, tutorials, and trial and error. It also showed me the value of persistence—working through problems I had no prior experience with instead of giving up.

A more technical challenge came later when I tried converting a PDF directly into an audio file. Initially, I attempted to send the PDF content straight into the Text-to-Speech API, but quickly discovered that the API required plain text input. This shortcut not only caused the audio conversion to fail, but it also led to many of the generated summary PDFs being misformatted. The root issue was skipping the crucial step of properly extracting text from the PDF before passing it to other processes.

To fix this, I restructured the workflow to first extract clean text from the PDF using pdfjs-dist, then pass that text into the Gemini API for summarization, and finally into the Google Text-to-Speech API for MP3 generation. Through this process, I learned the importance of mapping exactly what I was doing and ensuring that my code followed a clear, structured workflow. This approach not only fixed the problem but also made future debugging and feature additions much smoother.

### Next Steps
In the future, I would want to improve the program's capability to compress larger pdfs into audio files or potentially break the pdfs down into separate strings, make separate mp3 files, stitch them all together, and then export that as a singular mp3 file. Additionally, I would allow users to create folders to group readings by class, project, or whatever they wish. I also want to add a feature where users can speed up the outputted mp3 file (1.5x, 2x). As the website gained more users, I would also potentially add a "library" feature with popular books or online sources that people uploaded would be stored. This way, you would not have to upload a pdf for a very long book or texts that don't necessarily have readily available pdf formats. 
