import { Injectable } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {compare, genSaltSync, hash,} from 'bcryptjs';
import {AuthModel} from "./entities/authModel.entity";
import {AuthDto} from "./dto/create-auth.dto";
import {JwtService} from "@nestjs/jwt";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";

@ApiTags('auth')
@Injectable()
export class AuthService {
  constructor(
      @InjectRepository(AuthModel) private authModel: Repository<AuthModel>,
      private readonly jwtService: JwtService
  ) {}
// не выношу юсера в отдельный сервис, так как в рамках теста пусть будет тут

  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 200, description: 'User registered' })
  async createUser(dto: AuthDto) {
    const salt = genSaltSync(10)

    if (dto.password.length < 6) {
      throw new Error('Password must be at least 6 characters, WRITE AGAIN');
    }

    if (!/[\.,!_]/.test(dto.password)) {
      throw new Error('Password must contain one of the following characters: . , ! _, WRITE AGAIN');
    }

    const newUser = this.authModel.create({
      email: dto.login,
      passwordHash:await hash(dto.password, salt),
      fio: dto.fio
    })
    return this.authModel.save(newUser)
  }

  @ApiOperation({ summary: 'Find user by email' })
  @ApiResponse({ status: 200, description: 'User description' })
  async findUser(email: string) {
    return this.authModel.findOne({where: {email}})
  }

  @ApiOperation({ summary: 'Validate user' })
  @ApiResponse({ status: 200, description: 'Validation ok' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  async validateUser(email: string, password: string): Promise<Pick<AuthModel, 'email'>> {
    const user = await this.findUser(email)
    if(!user) {
      //кидаю такие ошибки, пока не заморачиваюс с эксепшенами
      throw new Error('User not found')
    }
    const isCorrectPassword = await compare(password, user.passwordHash)
    if (!isCorrectPassword) {
      throw new Error('Password is BAD, SON')
    }
    return {email: user.email}
  }

  @ApiOperation({ summary: 'Login generate access token' })
  @ApiResponse({ status: 200, description: 'Access token generated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  async login(email: string) {
    const payload = { email }
    return {
      access_token: await this.jwtService.signAsync(payload)
    }
  }

  @ApiOperation({ summary: 'Validate JWT token' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Valid' })
  @ApiResponse({ status: 401, description: 'Invalid' })
  async validateToken(token: string): Promise<Pick<AuthModel, 'email'> | null> {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      const { email } = decoded as { email: string };
      return { email };
    } catch (error) {
      return null;
    }
  }
}
