FROM node:22-bullseye-slim

# Set the working directory in the container
WORKDIR /app

# Copy dependency manifests
COPY package.json yarn.lock /app/

# Set the environment variable to skip Puppeteer download
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Install the package manager and dependencies exactly as locked
RUN corepack enable && yarn install --frozen-lockfile

# Copy the current directory contents into the container at /app
COPY ./ /app/

# Expose port 5173 to access the server
EXPOSE 5173

# Command to run the application
CMD ["yarn", "dev", "--host", "0.0.0.0"]
