import { Module } from '@nestjs/common';
import {HttpModule} from "@nestjs/axios";
import {WeatherController} from "./weather.controller";
import {WeatherService} from "./weather.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {WeatherEntity} from "./entities/weather.entity";
import {ConfigModule} from "@nestjs/config";
import {AuthService} from "../auth/auth.service";
import {AuthModule} from "../auth/auth.module";
import {
  JwtService
} from "@nestjs/jwt";

@Module({
  imports: [
      HttpModule,
    AuthModule,
    TypeOrmModule.forFeature([
      WeatherEntity,
    ]),
  ConfigModule
  ],
  controllers: [WeatherController],
  providers: [WeatherService, AuthService, JwtService],
})
export class WeatherModule {}
