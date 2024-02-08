import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';

@Injectable()
export class AuthGaurd implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        if (!request.headers.authorization) {
            return false;
        }

        request.user = await this.validateToken(request.headers.authorization);

        return true;
    }

  async validateToken(auth: string) {

    if (auth.split(' ')[0] !== 'Bearer') { // Bearer token
        throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }

    const token = auth.split(' ')[1];

    try {
        // PUBLIC key
        const publicKEY = fs.readFileSync(`${process.env.APP_PUBLIC_KEY}`, 'utf8');

        const decode = await jwt.verify(token, publicKEY, {
            issuer: `${process.env.APP_ISSUER}`,
            subject: `${process.env.APP_SUBJECT}`,
            audience: `${process.env.APP_AUDIENCE}`,
            algorithms: ["RS256"]
        });

        return decode;
    } catch (error) {
        const message = 'Token error:' + (error.message || error.name);
        throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}