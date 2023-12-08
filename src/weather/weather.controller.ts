import { Controller, Get, Param } from '@nestjs/common';
import { WeatherService } from './weather.service';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";


@ApiTags('weather')
@Controller()
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get(':city')
  @ApiOperation({ summary: 'Get current weather by city' })
  @ApiResponse({ status: 200, description: 'Weather information' })
  @ApiResponse({ status: 500, description: 'Unable weather data' })
  async getCurrentWeather(@Param('city') city: string) {
    try {
      const apiToken = 'WEATHER_API_KEY' // не регестрировался и не получал ключ

      const weatherData = await this.weatherService.getCurrentWeather(apiToken, city);
      return weatherData;
    } catch (error) {
      throw new Error('Unable to fetch weather data');
    }
  }
}
