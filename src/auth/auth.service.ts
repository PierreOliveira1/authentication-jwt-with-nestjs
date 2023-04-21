import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(user: SignUpDto): Promise<{ token: string }> {
    const userAlreadyExists = await this.userModel.findOne({
      email: user.email,
    });

    if (userAlreadyExists) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const createdUser = await this.userModel.create(user);

    if (!createdUser) {
      throw new HttpException(
        'User could not be created',
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = this.jwtService.sign({ id: createdUser._id });

    return { token };
  }

  async signIn(user: SignInDto): Promise<{ token: string }> {
    const foundUser = await this.userModel.findOne({ email: user.email });

    if (!foundUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      user.password,
      foundUser.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ id: foundUser._id });

    return { token };
  }
}
