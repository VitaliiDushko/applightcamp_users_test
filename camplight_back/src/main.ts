import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseExceptionFilter } from './exception-filters/database-exception-filter';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Define CORS options
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:4200', // Allow requests from Angular app
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Allow cookies if needed
  };
  // Enable CORS with specified options
  app.enableCors(corsOptions); // Apply the global exception filter

  app.useGlobalFilters(new DatabaseExceptionFilter());
  await app.listen(3000);
}
bootstrap();
