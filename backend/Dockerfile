# Use official OpenJDK image with bash
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy gradle wrapper and build files
COPY gradlew .
COPY gradle gradle

# Copy source code
COPY src src
COPY build.gradle settings.gradle ./

# Give executable permission to gradlew
RUN chmod +x ./gradlew

# Build the app inside the container
RUN ./gradlew build --no-daemon

# Run the app using the built jar
CMD ["java", "-jar", "build/libs/backend-0.0.1-SNAPSHOT.jar"]
