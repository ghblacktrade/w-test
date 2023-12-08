import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import {AuthModel} from "./entities/authModel.entity";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {jwtConfig} from "../configs/jwt.config";
import {
  PassportModule
} from "@nestjs/passport";
import {
  JwtStrategy
} from "./strategy/jwt.strategy";

@Module({
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([
      AuthModel,
    ]),
      ConfigModule,
      JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: jwtConfig
      }),
      PassportModule
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, TypeOrmModule.forFeature([AuthModel]), JwtStrategy],
})
export class AuthModule {}
