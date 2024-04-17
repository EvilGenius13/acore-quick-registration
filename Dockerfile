# Stage 1: Build Stage
FROM oven/bun as builder

# Set up working directory in the builder stage
WORKDIR /usr/src/app

# Copy package files and lock file
COPY package*.json bun.lockb ./

# Install dependencies with Bun
RUN bun install

# Copy the rest of your application code into the builder stage
COPY . .

# Stage 2: Runtime Stage
FROM oven/bun

# Set up working directory in the final image
WORKDIR /usr/src/app

# Copy built artifacts from the builder stage
COPY --from=builder /usr/src/app .

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["bun", "run", "dev"]
