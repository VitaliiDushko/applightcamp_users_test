# applightcamp_users_test

Application Architecture

The application is structured into three layers:

	1.	PostgreSQL Database: All data is stored and persisted in this database instance.
	2.	NestJS REST API: Handles all API requests from the Angular frontend application.
	3.	Angular Application: Built with Angular Material, this is the client-side of the application that communicates with the backend API.

Running Unit Tests

To run unit tests for the backend and frontend, use the following commands in their respective directories:

For Backend (NestJS)

Run this command in the backend directory to execute the unit tests:

npm run test

Running the Application in Demo/Production Mode

To run the application in demo or production mode, follow these steps:

	1.	Ensure that Port 4000 is Available:
Make sure port 4000 is free on your local machine before proceeding.
	2.	Run the Docker Commands:
Run the following command in the downloaded project directory to set up the entire stack using Docker and Docker Compose:

docker-compose build --no-cache
docker-compose up  

This command will:

	•	Start the PostgreSQL database.
	•	Launch the NestJS API backend.
	•	Serve the Angular frontend on http://localhost:4000.

After the services have been started, the application will be accessible at:

http://localhost:4000

Make sure to stop any other services running on port 4000 before launching the application.


