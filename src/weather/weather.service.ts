import { Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import {WeatherEntity} from "./entities/weather.entity";
import {HttpService} from "@nestjs/axios";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('weather')
@Injectable()
export class WeatherService {
  constructor(
      private httpService: HttpService,
      @InjectRepository(WeatherEntity)
      private readonly weatherLogRepository: Repository<WeatherEntity>,
      private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Get current weather by city' })
  @ApiResponse({ status: 200, description: 'Current information' })
  @ApiResponse({ status: 403, description: 'Invalid token' })
  @ApiResponse({ status: 500, description: 'Unable weather data' })
  async getCurrentWeather(apiToken: string, city: string, language: string = 'ru'): Promise<any> {
    const isTokenValid = this.authService.validateToken(apiToken)
    if (!isTokenValid) {
      throw new Error('Invalid token')
    }

    try {
      const response = await this.httpService
          .get(`https://api.weatherapi.com/v1/current.json?key=${apiToken}&q=${city}&lang=${language}`)
          .toPromise()

      const logEntry = new WeatherEntity();
      logEntry.action_time = Math.floor(Date.now() / 1000);
      logEntry.request_result = response.status

      if (response.status === 200) {
        logEntry.temp_c = response.data.current.temp_c
      }

      await this.weatherLogRepository.save(logEntry)

      return response.data;
    } catch (error) {
      throw new Error('Unable to fetch weather data')
    }
  }
}
