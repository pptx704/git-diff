# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that the app will run on (change this to your app's port)
EXPOSE 3000

# Define the command to run your application
ENTRYPOINT [ "node", "controller/repositoryMetaController.js" ]
