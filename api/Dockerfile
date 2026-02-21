FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Copy Maven wrapper and project metadata first for better layer caching.
COPY .mvn .mvn
COPY mvnw mvnw
COPY pom.xml pom.xml

RUN chmod +x mvnw
RUN ./mvnw -q -DskipTests dependency:go-offline

COPY src src
RUN ./mvnw -q -DskipTests clean package

FROM eclipse-temurin:21-jre AS runtime
WORKDIR /app

ENV DB_URL=jdbc:postgresql://postgres:5432/warehouse_db
ENV DB_USERNAME=postgres
ENV DB_PASSWORD=root

COPY --from=build /app/target/warehouse-api-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
