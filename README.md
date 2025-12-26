
#  MSMS - Mentor-based Student Management System

![Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-orange)

**MSMS** is a comprehensive platform designed for mentors to professionally manage students preparing for the university entrance exam (YKS). The system digitizes the coaching process and includes a unique **AI-powered book analysis engine** that predicts book popularity based on sales data.

##  About the Project

This platform bridges the gap between mentors and students through data-driven tracking. It operates on a **Service-Oriented Architecture (SOA)**, integrating multiple technologies (Node.js, Python/ML, gRPC) to provide a seamless experience.

###  Core Feature: AI Book Analysis Module
The system utilizes a Machine Learning regression model to help students make informed decisions about study materials.
* **The Logic:** The model analyzes technical attributes of a book to predict its **sales volume**.
* **The Goal:** Predicted sales figures serve as a proxy for "popularity." This helps students prioritize resources that are widely used and trusted by the community, optimizing their study time.

##  Tech Stack

The project is built using a modern stack and microservice-like communication patterns.

| Area | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, Context API |
| **Backend** | Node.js, Express.js, JWT Auth |
| **Database** | SQL (PostgreSQL), Raw SQL/Sequelize |
| **AI / ML** | Python, Scikit-Learn, Pandas, gRPC (Protobuf) |
| **Identity** | Mock SOAP Web Service (WSDL) |
| **Communication** | REST API, gRPC, SOAP |

##  Architecture & Directory Structure

The system consists of four main distinct components:

1.  **`backend/`**: The main application server. It handles client requests, manages the database, and communicates with the AI service via `gRPC`.
2.  **`frontend/client/`**: The React-based user interface for Mentors, Students, and Admins.
3.  **`external-services/PythonMLEngine/`**: A Python-based gRPC server that hosts the ML model for book sales predictions.
4.  **`external-services/MockIdentityProvider/`**: A SOAP service simulating a government ID (TC Identity) verification system.

##  Key Features

###  Mentor Panel
* **Student Management:** Add students, verify identities via SOAP, and manage profiles.
* **Academic Tracking:** Input trial exam results and visualize progress charts.
* **Scheduling:** Organize meetings and study sessions (Calendar integration).
* **Task System:** Assign specific tasks to students and track completion status.

###  Student Panel
* **Performance Analytics:** View exam results and personal growth graphs.
* **AI Book Assistant:** Query books to see popularity predictions and AI-driven insights.
* **My Schedule:** Track weekly lessons and mentor meetings.

##  Installation & Setup

Follow these steps to run the project locally.

### 1. Database Setup
Initialize the database using the scripts found in the `backend/database/` folder.
* Run `create-db.js` or the relevant `.sql` script to create tables.
* Run `seed-db.js` to populate the database with initial dummy data.

### 2. Backend (Node.js) Setup
```bash
cd backend
npm install
# Ensure you configure your .env file with DB credentials
node server.js

```

### 3. AI Engine (Python) Setup

For the book recommendation feature to work, the gRPC server must be running:

```bash
cd external-services/PythonMLEngine
pip install -r requirements.txt
python grpc_server.py

```

### 4. Mock Identity Provider (Optional)

To simulate the ID verification service:

```bash
cd external-services/MockIdentityProvider
npm install
node server.js

```

### 5. Frontend (React) Setup

```bash
cd frontend/client
npm install
npm run dev

```

##  AI Model Training

The model training process is documented in `external-services/BookSalesPrediction`. The system uses a `Gradient Boosting Regressor` model trained on the `Kitapyurdu` dataset (located in `datasetVersions`), which yielded the highest accuracy metrics among tested algorithms.

##  Documentation

For detailed technical documentation, please refer to the `docs/` folder:

* **SRS:** Software Requirement Specification
* **DDD:** Database Design Document
* **Architecture:** SOA Diagrams and Data Flow


**License:** MIT

```

```
