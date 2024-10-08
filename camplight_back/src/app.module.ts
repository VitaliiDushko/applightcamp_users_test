import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './modules/users/users/entities/user.entity';
import { UsersModule } from './modules/users/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Vitalia1507',
      database: 'camplight',
      synchronize: true, // Enable this for automatic schema sync (development only)
      retryAttempts: 50, // Number of retry attempts if connection fails
      retryDelay: 3000, // Delay between retries (in milliseconds)
      // Enable verbose logging
      logging: ['query', 'error', 'schema', 'warn', 'info', 'log'],
      entities: [UserEntity],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
