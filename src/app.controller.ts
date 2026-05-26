import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('check')
  async check(@Body() body: { date: string; ticketNumber: string }) {
    const { date, ticketNumber } = body;
    if (!date || !ticketNumber) {
      throw new HttpException(
        'date and ticketNumber are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.appService.checkFreePlaces(date, ticketNumber);
  }
}
