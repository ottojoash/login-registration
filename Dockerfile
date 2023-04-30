# Use an official Node.js runtime as a parent image
FROM node:14 AS build

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .


# Build the application
RUN npm run build

# Serve the application using a simple HTTP server
FROM node:14-alpine
WORKDIR /app
COPY --from=build /app/dist/first-angular /app
RUN npm install -g http-server
CMD ["http-server", "-p", "4200", "-c-1", "."]  
# HTTP server using the http-server package, with the -p 4200 option to specify the port and the -c-1 option to disable caching.

