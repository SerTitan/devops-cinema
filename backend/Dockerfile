FROM --platform=linux/arm64 maven:3.9-eclipse-temurin-23-alpine as BUILDER
ARG VERSION=0.0.1-SNAPSHOT
WORKDIR /opt/build/cinemaback
COPY pom.xml /opt/build/cinemaback/
COPY src /opt/build/cinemaback/src/
RUN mvn -f /opt/build/cinemaback/pom.xml clean package -B -DskipTests


FROM eclipse-temurin:23-jdk-alpine
WORKDIR /opt/app/cinemaback
COPY --from=BUILDER /opt/build/cinemaback/target/*.jar /opt/app/cinemaback/cinemaback.jar

ENV SERVER_PORT=8080

EXPOSE ${SERVER_PORT} 8081

ENTRYPOINT ["java","-jar", "/opt/app/cinemaback/cinemaback.jar"]