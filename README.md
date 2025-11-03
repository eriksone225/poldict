# Poldict - A Firebase Studio Project

This is a Next.js application created in Firebase Studio. It's a prediction market platform where users can create "votables" (predictions), vote on them, and earn points based on the outcomes.

## Tech Stack

- **Framework:** Next.js with App Router
- **UI:** React, Tailwind CSS, ShadCN UI
- **Database:** Cloud Firestore
- **Authentication:** Firebase Authentication
- **AI/Generative:** Genkit

---

## Running Locally

To run this project on your local machine, follow these steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Step 1: Install Dependencies

First, open a terminal or command prompt in the project's root directory and install all the necessary packages:

```bash
npm install
```

### Step 2: Set Up Firebase Admin Credentials

The backend part of your app that runs on the server (e.g., during Server-Side Rendering in Next.js) uses the Firebase Admin SDK to securely verify user sessions. To do this locally, you need to provide a "Service Account Key".

1.  **Navigate to your Firebase Project:**
    Go to the [Firebase Console](https://console.firebase.google.com/) and select your project: `studio-8633392163-f981d`.

2.  **Generate a Service Account Key:**
    - Click the gear icon next to "Project Overview" in the top-left sidebar and select **Project settings**.
    - Go to the **Service accounts** tab.
    - Click the **Generate new private key** button. A JSON file will be downloaded to your computer.

3.  **Set the Environment Variable:**
    - Rename the downloaded JSON file to `firebase-service-account.json`.
    - Place this file in the **root directory** of your project (the same level as `package.json`).
    - The project is already configured to automatically detect this file for local development.

    ***Important:*** This file contains sensitive credentials. It's already listed in the `.gitignore` file to prevent you from accidentally committing it to a public repository.

### Step 3: Run the Development Server

Now you're ready to start the app. Run the following command in your terminal:

```bash
npm run dev
```

This will start the Next.js development server, typically on `http://localhost:9002`. You can now open this URL in your web browser to see your app running!
