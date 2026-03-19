# Use node 20-alpine as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on 
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
