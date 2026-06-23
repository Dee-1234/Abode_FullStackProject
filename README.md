# Abode - AI-Enhanced Reddit Clone
Abode is a full-stack, discussion-based social media application inspired by Reddit. It features user-created communities (Rooms), rich text posting, a nested commenting structure, real-time voting mechanics, and robust security.
# Features
# Backend Capabilities
1.	Secure Authentication: Stateless user authentication driven by Spring Security and JWT (JSON Web Tokens).
2.	Community Management: Dynamic APIs to create, list, and manage custom sub-communities (Rooms).
3.	Interactive Content Engine: Robust endpoints supporting post generation, listing by community, and nested commenting systems.
4.	Smart Voting System: One-vote-per-user enforcement architecture tracking upvotes and downvotes dynamically.
# Frontend Experience
1.	Modern Interface: Responsive, clean layout engineered with Next.js and Tailwind CSS.
2.	State & Auth Persistence: Secure client-side handling of JWT tokens to persist user sessions and gate protected actions (posting, voting, commenting).
# Tech Stack
    Layer               	      Technology
    Frontend             	 Next.js, React, Tailwind CSS, Axios
    Backend              	 Java, Spring Boot, Spring Security, Spring Data JPA
    Database	               PostgreSQL
    Build Tools          	 Maven, npm/yarn
# Architecture & Database Design
    The system maps relationship dependencies cleanly to prevent recursive structural loops during payload delivery:
    [ User ] 1 --------- * [ Post ] * --------- 1 [ Room ]
       1                      1
       |                      |
       *                      *
   [ Vote ]               [ Comment ]
# Getting Started
# Prerequisites
1.	Java 17 or higher
2. Node.js v18.x or higher
3. 	PostgreSQL database instance running locally or on the cloud
# Backend Setup (Spring Boot)
1.	Navigate to the backend directory:
Bash
cd Abode
2.	Configure your environment variables or update src/main/resources/application.properties:
# Properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/abode
   spring.datasource.username=your_postgres_user
   spring.datasource.password=your_postgres_password
   spring.jpa.hibernate.ddl-auto=update
3.	Build and run the server:
Bash
mvn clean install
Bash
   mvn spring-boot:run
The backend will boot up on http://localhost:8080
# Frontend Setup (Next.js)
1.	Navigate to the frontend directory:
Bash
cd frontend
2.	Install dependencies:
Bash
npm install
3.	Create a .env.local file in the root directory and map the API gateway base URL:
Code snippet
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
4.	Launch the local development server:
Bash
   npm run dev
Open http://localhost:3000 to view the application in your browser.
# Key API Endpoints

      Method	   Endpoint	                     Access	             Description
      POST	     /api/auth/signup	             Public              Register a new user account  
      POST	     /api/auth/login                 Public	             Authenticate user and receive JWT
      GET	     /api/rooms	                     Public	             Fetch all existing sub-communities
      POST	     /api/rooms	                   Protected	         Create a new community
      GET	     /api/posts	                     Public              Retrieve a feed of all posts
      POST	     /api/posts	                   Protected             Publish a post to a specific community
      POST	     /api/votes	                   Protected	         Cast an upvote or downvote
      POST	     /api/comments	               Protected	         Post a comment under an existing thread

Screen Shots
https://github.com/Dee-1234/Abode_FullStackProject/tree/main/ScreenShots
