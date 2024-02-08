import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthDTO } from './dto/auth.dto';
import { UserInterfaces } from 'src/user/interfaces/user.interface';
import { UserService } from 'src/user/user.service';
import bcrypt = require('bcryptjs');

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
  ) { }

  async validateUser(username: string, pass: string): Promise<UserInterfaces | undefined> {
    try {
        const userData = await this.usersService.validateUser(username);

        if (username && (await userData.comparePassword(pass))) {
            return userData.toResponseObject(false, true);
        }

        return null;
    } catch (error) {
        throw new HttpException(`auth.user.validate: ${error.message}`, HttpStatus.UNAUTHORIZED);
    }
  }

  async login(data: AuthDTO, lang: string = ''): Promise<UserInterfaces> {
    try {
        const userData = await this.usersService.validateUser(data.username);

        if (userData || (this.comparePassword(data.password, userData.password))) {

            delete userData.password;

            return userData.toResponseObject();
        }
        return null;
    } catch (error) {
        throw new HttpException(`auth.login: ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  private comparePassword(attempt: string, password: string) {
    return bcrypt.compare(attempt, password);
  }
}