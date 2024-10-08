import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return a health check timestamp', () => {
      const date = new Date();
      const isoString = date.toISOString().slice(0, 16);
      expect(appController.checkHealth()).toEqual({ timestamp: isoString });
    });
  });
});
