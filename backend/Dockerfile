FROM maven:3.8.3-openjdk-17-slim as BUILDER
ARG VERSION=0.0.1-SNAPSHOT
WORKDIR /opt/build/cinemaback
COPY pom.xml /opt/build/cinemaback/
COPY src /opt/build/cinemaback/src/
RUN mvn -f /opt/build/cinemaback/pom.xml clean package -B -DskipTests


FROM openjdk:17-alpine
WORKDIR /opt/app/cinemaback
COPY --from=BUILDER /opt/build/cinemaback/target/*.jar /opt/app/cinemaback/cinemaback.jar

ENV SERVER_PORT=8080

EXPOSE ${SERVER_PORT} 8081

ENTRYPOINT ["java","-jar", "/opt/app/cinemaback/cinemaback.jar"]