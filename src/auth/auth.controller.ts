import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AuthDto} from "./dto/create-auth.dto";
import {LoginDto} from "./dto/create-login.dto";
import {
  ApiOperation,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 200, description: 'User registered' })
  @ApiResponse({ status: 400, description: 'User already registered' })
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const oldUser = await this.authService.findUser(dto.login)
    if (oldUser) {
      throw new Error('This user has ready registered')
    }
    return this.authService.createUser(dto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @ApiOperation({ summary: 'Login and generate access token' })
  @ApiResponse({ status: 200, description: 'Access token generated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  @Post('login')
  async login(@Body() {login, password}: LoginDto) {
    const {email} = await this.authService.validateUser(login, password)
    return this.authService.login(email)
  }
}
