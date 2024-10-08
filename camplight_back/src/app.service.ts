import { Injectable } from '@nestjs/common';
import { HealthCheck } from './dtos/health-check.dto';

@Injectable()
export class AppService {
  getHealthCheckObject() {
    const date = new Date();
    const isoString = date.toISOString().slice(0, 16);
    return new HealthCheck(isoString);
  }
}
