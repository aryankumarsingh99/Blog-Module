 Blog Website – Setup Instructions & Tech Stack

 Tech Stack

 Frontend
 React** (with Hooks)
 Tailwind CSS** (for styling)
 React Router DOM** (for routing)
 Fetch API** (for HTTP requests)

  Backend (Server)
 Node.js**
 Express.js**
 MongoDB** (with Mongoose)
 Multer** (for file uploads)
 bcrypt** (for password hashing)
 jsonwebtoken** (for authentication)

---

Setup Instructions

1. Clone the Repository

```sh
git clone <your-repo-url>
cd Blog-Website
```

---

2. Server Setup

```sh
cd server
npm install
npm run start
```

Create a `.env` file in the `server` folder with your MongoDB URI and JWT secret:
  ```
  MONGODB_URI=mongodb://localhost:27017/blogdb
  JWT_SECRET=your_jwt_secret
  PORT=5000
  ```
- Start the server:
  ```sh
  npm start
  ```
  The server will run on [http://localhost:5000](http://localhost:5000).

---
 3. Frontend Setup

```sh



cd ../fronted
npm install
npm run dev
```

- Start the React development server:
  ```sh
  npm start
  ```
  The frontend will run on [http://localhost:3000](http://localhost:3000).


4. Usage

- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Sign up, log in, create blogs, upload images, and manage your profile.

---

5. Notes

- Make sure MongoDB is running locally or update the `MONGODB_URI` in your `.env` file.
- Uploaded images are stored in the `uploads` directory on the server.
- Adjust CORS settings in the server if accessing from a different frontend port.

 
 