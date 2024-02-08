import { HttpException, HttpStatus, createParamDecorator } from '@nestjs/common';
import CryptoJS = require('crypto-js');

export const User = createParamDecorator((data, req) => {
    try {
        const userData = req.args[0].user;
        const bytes = CryptoJS.AES.decrypt(userData.payload, process.env.APP_SECRET);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedData);
    } catch (error) {
        throw new HttpException(`decorator.user: ${error.message}`, HttpStatus.BAD_REQUEST);
    }
});