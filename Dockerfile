# Use Node.js 22 official image
FROM node:22

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port (adjust if your app uses a different port)
EXPOSE 8100

# Start the application
CMD ["npm", "start"]
