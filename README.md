# OCTsense

OCTsense is a **web platform (SPA)** for the **automated analysis of OCT (Optical Coherence Tomography) images** using **artificial intelligence**.
It is designed for **ophthalmologists** who need support diagnosing ocular diseases such as **C, AMD (Age-Related Macular Degeneration)**, macular edema, and others — **without depending on image experts**.

OCTsense is a **web platform (SPA)** for the **automated analysis of OCT (Optical Coherence Tomography) images** using artificial intelligence.
It is designed for ophthalmologists or patients who need support diagnosing ocular conditions, specifically detecting:
Choroidal Neovascularization (CNV), Diabetic Macular Edema (DME), Drusen lesions (DRUSEN), and identifying Healthy retinal tissue — without depending on image experts.

---

## 🚀 Technologies Used

| Area     | Technology                              |
| :------- | :-------------------------------------- |
| Frontend | React.js (SPA) with Vite                |
| Backend  | Django + Django REST Framework (Python) |
| AI Model | TensorFlow 2.x, Keras, OpenCV           |
| Database | PostgreSQL                              |

---

## 🧹 Main Functional Modules

- **User and authentication management:**  
  Registration for ophthalmologists and admins, credential validation, password recovery, role control.

- **Landing Page:**  
  Interactive welcome screen with guides and access to main features.

- **AI-driven image analysis:**  
  Pretrained TensorFlow models process images to generate preliminary diagnostic predictions.

- **Results and reports:**  
  View analysis results, generate medical reports in PDF, download/store reports, and compare historical images.

---

# ⚙️ Setup Guide

Follow these steps to install and run the project locally:

## 1. Clone the repository

```bash
git clone https://your-repository-url.git
cd your-repository-folder
```

---

## 2. Backend (Django + PostgreSQL)

The backend code for OCTsense is located in a separate repository. You can find it here:

**Backend Repository:** [OCTsense Backend](https://your-backend-repository-link)

Follow the instructions in that repository to set up and run the backend server locally.

---

## 3. Frontend (React + Vite)

### a. Environment Variables

Create a `.env` file in the frontend folder:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/
```

---

### b. Run Frontend with Docker

```bash
docker-compose up --build
```

Frontend will be available at:

```
http://localhost:3000
```

---

# 📈 Quick Commands Summary

| Task                   | Command                                          |
| :--------------------- | :----------------------------------------------- |
| Build and run backend  | Refer to backend repository instructions         |
| Build and run frontend | `docker-compose up --build` (in frontend folder) |
| Access backend API     | http://127.0.0.1:8000/api/                       |
| Access frontend app    | http://localhost:3000                            |

---

# ✨ Extra Notes

- AI models are managed separately inside the backend (`oct/predict/` endpoint).
- Make sure ports **8000 (backend)** and **3000 (frontend)** are open.
- For production, it's recommended to serve the frontend using **Nginx** (already set up).

---

# 💬 License

This project is licensed under the GPL-3.0 license.

---

# 📬 Contact

For questions, contributions, or collaboration inquiries:  
**Gustavo Parra | parrat-ga@javeriana.edu.co**

---
