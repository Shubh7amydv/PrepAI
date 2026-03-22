# 🚀 AI-Powered Interview Preparation Platform

An intelligent full-stack web application that helps users prepare for interviews by analyzing their **resume, job description, and self-reflection**. The system leverages **AI (Gemini API)** to generate personalized insights, interview questions, and a structured preparation plan.

---

## 📌 Features

* 🧠 **AI-Generated Technical Questions**
  Get role-specific technical questions based on your resume and job description.

* 💬 **Behavioral Questions**
  Personalized behavioral interview questions tailored to your experience.

* 📊 **ATS / Match Score**
  Evaluate how well your resume matches the job description.

* 📉 **Skill Gap Analysis**
  Identify missing skills required for your target role.

* 🗺️ **Preparation Roadmap**
  Receive a structured plan to improve and crack your interview.

* 📝 **Self-Reflection Input**
  Incorporate personal insights to improve AI recommendations.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS (if used)
* Axios

### Backend

* Node.js
* Express.js

### AI Integration

* Gemini API (Google Generative AI)

### Others

* REST APIs
* JSON-based data handling

---

## 🧩 How It Works

1. User inputs:

   * Resume
   * Job Description
   * Self-Reflection

2. Backend processes the data and sends it to Gemini API

3. AI returns:

   * Technical Questions
   * Behavioral Questions
   * Skill Gaps
   * ATS Score
   * Preparation Plan

4. Results are displayed in a structured UI

---

## 📂 Project Structure

```
├── Frontend/        
├── Backend/       
├── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=5000
GEMINI_API_KEY=your_api_key_here
```

Run backend:

```bash
npm start
```

---

### 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🔐 Environment Variables

| Variable       | Description           |
| -------------- | --------------------- |
| GEMINI_API_KEY | Google Gemini API Key |
| PORT           | Backend server port   |

---

## 📸 Screenshots

*Add screenshots of your UI here (recommended for better presentation)*

---

## 🎯 Use Cases

* Students preparing for placements
* Job seekers targeting specific roles
* Developers improving interview readiness

---

## 🚧 Future Improvements

* Resume parser (PDF/Doc upload)
* User authentication & history tracking
* Mock interview simulation (real-time)
* Voice-based interview practice
* Advanced ATS scoring system

---


## 🙌 Acknowledgements

* Google Gemini API
* Open-source community

---


