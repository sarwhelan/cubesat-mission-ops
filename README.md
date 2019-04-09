### CubeSat Mission Operations Portal
Phase 1 of the mission operations web portal to be used for communication with a miniature satellite being launched by Western University's CPSX and Nunavut Arctic College in 2022. Learn more about the project [here](https://cpsx.uwo.ca/research/cpsx_projects/cubesat_project.html). 

### Running the portal locally
1. Clone the `cubesat-mission-ops` repository onto your local machine and navigate into it.
2. Install `Nodejs`. This also installs `npm`.
3. Navigate to `/frontend` and install `Angular 7` with `npm`:
```npm install -g @angular/cli```
4. Run `npm install` to install all dependencies in the frontend directory.
5. Navigate to `/backend/cubesat-appserver` and place the `.env` file in this directory.
6. In the same directory as the step above, install `Express`:
```npm install express```
7. In the same directory as step 4, install `nodemon`, which automatically restarts your server when it detects new changes:
```npm install nodemon```
8. Run `npm install` in the same directory as step 4 to install all dependencies in the backend directory.
9. Login to the AWS Console with the username and password provided to the CubeSat team.
10. Navigate to RDS.
11. Select “Databases” on the left.
12. Select “cubesatdb-2” in the Databases table.
13. Scroll down to “Security group rules”.
14. Select the first listing of type “EC2 Security Group - Inbound”.
15. Scroll down and select the “Inbound” for this security group.
16. Click “Edit”.
17. Click “Add Rule” and select Type: “MySQL/Aurora”, Protocol: TCP, Port Range: 3306, Source: My IP, and Description: yourName-Location.
18. Click “Save”.
19. Download MySQLWorkbench to your machine.
20. Add a new MySQL connection.
21. Specify the connection name (an identifier that you can reference it by). Within the AWS console, navigate to RDS > Databses > cubesatdb-2. Under Connectivity & Security you can see the endpoint and port. These correspond to the hostname and port in the MySQL connection setup. Specify the username and password and then connect.
22. Install Postman to your machine for testing HTTP requests.
23. Now you’re ready to go! You should have two terminal windows open. In the first, navigate to `/frontend/mission-ops` and type `ng serve`. In the second, navigate to `/backend/cubesat-appserver` and type `nodemon server.js`. Navigate to `localhost:4200` in your browser and enjoy.


