# Stage 1: Build the app using Gradle
FROM gradle:8.5-jdk17 AS builder
WORKDIR /app

# Copy everything and build
COPY . .
RUN gradle build -x test

# Stage 2: Run the app
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy the built JAR from stage 1
COPY --from=builder /app/build/libs/*.jar app.jar

# Expose the port your app uses
EXPOSE 8080

# Start the app
ENTRYPOINT ["java", "-jar", "app.jar"]
