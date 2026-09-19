FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN sh mvnw -DskipTests package

EXPOSE 8080

CMD ["sh", "-c", "java -jar target/*.jar"]
