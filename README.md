# TravelMate – AI-Powered Group Trip Planner
TravelMate is a collaborative web application designed to simplify the process of planning group trips. It empowers users to co-create the perfect vacation by leveraging AI to generate personalized itinerary suggestions based on everyone's input. Groups can then vote on their favorite plan, ensuring a democratic and enjoyable planning experience for all.

Live Demo: (coming soon)

## ✨ Key Features
- Collaborative Trip Creation: Easily create a new trip and invite friends to join via a unique link.

- AI Itinerary Generation: Each member submits a prompt describing their ideal vacation. Our backend uses a powerful AI model (like Google's Gemini & OpenAI) to generate multiple, distinct itinerary options.

- Democratic Voting System: All trip members can view the AI-generated itineraries and vote for their favorite one in real-time.

- Interactive Map View: Visualize your destination and potential points of interest using an integrated Mapbox map.

- Real-Time Updates: Built on Google Firestore, all trip details, messages, and votes are updated in real-time for a seamless collaborative experience.

- Secure Authentication: Quick and secure user sign-in using Firebase Authentication with Google Sign-In.

## 🛠️ Technology Stack
This project is built with a modern, full-stack JavaScript architecture.
<table>
  <theader>
    <td><b>Component</b></td>
    <td><b>Technology</b></td>
  </theader>
  <tbody>
    <tr>
      <td><b>Frontend</b></td>
      <td>React, Redux Toolkit, Tailwind CSS</td>
    </tr>
    <tr>
      <td><b>Backend</b></td>
      <td>Node.js, Express.js</td>
    </tr>
    <tr>
      <td><b>Database</b></td>
      <td>Google Firestore</td>
    </tr>
    <tr>
      <td><b>Authentication</b></td>
      <td>Firebase Authentication</td>
    </tr>
    <tr>
      <td><b>Maps & Geocoding</b></td>
      <td>Mapbox API</td>
    </tr>
    <tr>
      <td><b>AI Services</td>
      <td>Google Gemini, OpenAI</td>
    </tr>
  </tbody>
</table>


## 🚀 Getting Started
Follow these instructioncs to get a copy of the project up and running on your local machine for development and testing purposes.

<b>Prerequisites</b>
- <a href="https://nodejs.org/en/" target="_blank">Node.js (v18.x or later).</a>
- `npm` package manager.
- A <b>Firebase</b> project with <b>Authentication (Google Sign-In enabled)</b> and <b>Firestore</b> activated.
- A <b>Mapbox</b> account and a public access token.

<b>Installation & Setup</b>
1. <b>Clone the Repository</b>

    ```
    git clone https://github.com/mshah972/Travel-Mate.git
    cd travel-mate
    ```

2. <b>Backend Setup</b>
    - Navigate to the `backend` directory.
    - Install dependencies:

       ```
       npm install
       ```
    - Create a `serviceAccountKey.json` file in the backend root from your Firebase project setting (<b>Settings > Service accounts > Generate new private key</b>).
    - Create a `.env` file in the backend root and add your Mapbox token:

      ```
      MAPBOX_ACCESS_TOKEN=pk.your_mapbox-access_token
      ```
    - Start the backend server:

      ```
      npm start
      ```
    - The server will run on `http://localhost:----`.

3. <b>Frontend Setup</b>
    - Navigate to the `frontend` directory.
    - In your React app's Firebase configuration file, replace the placeholder configuration with your actual Firbase project's web app config (<b>Settings > General > Your apps > Web app</b>).
    - Start the frontend development server:

      ```
      npm run dev
      ```
    - The application will be available at `http://localhost:----`.


## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are <b>greatly appreciated</b>.

Please refer to the project's contributing guidelines for more details - (Coming Soon).

## 📄 License
This project is distributed under the <i>MIT License</i>. See <a href="https://github.com/mshah972/Travel-Mate?tab=MIT-1-ov-file#" target="_blank">`LICENSE`</a> for more information.
          
