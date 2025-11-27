import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

import { AppModule } from "./app.module";

import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const configService = new ConfigService();

  const PORT = configService.get("SERVER_PORT") || 4000;

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: [configService.get("FRONTEND_DOMAIN"), "http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });
  app.setGlobalPrefix("api");
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: 400,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("VReal Soft Test Task API")
    .setDescription("API documentation for file storage system")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth",
    )
    .addCookieAuth("accessToken", {
      type: "apiKey",
      in: "cookie",
      name: "accessToken",
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(PORT);
}
bootstrap();
