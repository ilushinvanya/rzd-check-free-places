import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Train, Car, Station, TicketInfo, TicketRID } from './types';
import axiosInstance from './axiosInstance';

@Injectable()
export class AppService {
  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async checkFreePlaces(
    date: string,
    ticketNumber: string,
  ): Promise<{ freePlaces: string[][]; svg: string; ticket: any }> {
    // Step 1: POST to get RID
    const rid = await this.getRid(date, ticketNumber);

    // Step 2: POST with rid to get ticket data

    await this.delay(1000);
    const ticketData = await this.getTicketData(date, ticketNumber, rid);

    const { stdep, starr, train, vag, dateoper, timeoper } = ticketData;

    // Step 3: Get expressCode for departure and arrive stations (parallel)
    const [departureStation, arriveStation] = await Promise.all([
      this.getStation(stdep),
      this.getStation(starr),
    ]);

    // Step 4: Get car pricing to find free places and scheme id
    const departureDateTime = this.buildDepartureDateTime(dateoper, timeoper);
    const cars = await this.getCarPricing(
      departureStation.code,
      arriveStation.code,
      departureDateTime,
      train,
    );

    // Step 5: Filter cars by wagon number, collect FreePlaces
    const matchingCars = cars.filter((car: Car) => car.CarNumber === vag);
    const freePlaces: string[][] = matchingCars.map((car: Car) =>
      car.FreePlaces.split(',')
        .map((p: string) => p.trim())
        .filter(Boolean),
    );

    // Step 6: Get SVG scheme (use RailwayCarSchemeId from first matching car)
    let svg = '';
    if (matchingCars.length > 0) {
      const schemeId = matchingCars[0].RailwayCarSchemeId;
      svg = await this.getCarSchemeSvg(schemeId);
    }

    const ticket = {
      stdep: departureStation.name,
      starr: arriveStation.name,
      train,
      vag,
      dateoper,
      timeoper,
    };

    return { freePlaces, svg, ticket };
  }

  private async getRid(date: string, ticketNumber: string): Promise<number> {
    try {
      const res: TicketRID = await axiosInstance(
        'https://www.rzd.ru/legitimacy/status/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          data: { date, ticketNumber },
        },
      );

      if (!res.RID) {
        throw new HttpException('No RID in response', HttpStatus.BAD_GATEWAY);
      }
      return res.RID;
    } catch (e: any) {
      throw new HttpException(
        `RZD status error: ${JSON.stringify(e)}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  private async getTicketData(date: string, ticketNumber: string, rid: number) {
    try {
      const res: TicketInfo = await axiosInstance(
        `https://www.rzd.ru/legitimacy/status/?rid=${rid}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          data: {
            date,
            ticketNumber,
          },
        },
      );
      if (res.result !== 'OK' || !res.data) {
        throw new Error('Не пришли данные о билете');
      }
      const ticket = res.data.ticketResponseData;
      const passenger = res.data.passengerResponseData;
      return {
        stdep: ticket.stdep,
        starr: ticket.starr,
        train: ticket.train,
        vag: ticket.vag,
        dateoper: passenger.date,
        timeoper: passenger.time,
      };
    } catch (e) {
      const error = e instanceof Error ? e.message : JSON.stringify(e);
      throw new HttpException(
        `Ошибка ответа от РЖД: ${error}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  private async getStation(
    stationName: string,
  ): Promise<{ code: string; name: string }> {
    const url = new URL('https://ticket.rzd.ru/api/v1/suggests');
    url.searchParams.set('Query', stationName);
    url.searchParams.set('TransportType', 'rail');
    url.searchParams.set('GroupResults', 'false');
    url.searchParams.set('RailwaySortPriority', 'true');
    url.searchParams.set('SynonymOn', '1');
    url.searchParams.set('Language', 'ru');

    try {
      const res: Station[] = await axiosInstance(url.toString());

      if (!Array.isArray(res) || res.length === 0) {
        throw new HttpException(
          `Station not found: "${stationName}"`,
          HttpStatus.BAD_GATEWAY,
        );
      }
      return { code: res[0].expressCode, name: res[0].name };
    } catch (e: any) {
      throw new HttpException(
        `Station suggest error for "${stationName}": ${JSON.stringify(e)}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  private async getCarPricing(
    originCode: string,
    destinationCode: string,
    departureDate: string,
    trainNumber: string,
  ): Promise<Car[]> {
    try {
      const res: Train = await axiosInstance(
        'https://ticket.rzd.ru/apib2b/p/Railway/V1/Search/CarPricing?service_provider=B2B_RZD&isBonusPurchase=false',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          data: {
            OriginCode: originCode,
            DestinationCode: destinationCode,
            DepartureDate: departureDate,
            TrainNumber: trainNumber,
            SpecialPlacesDemand: 'StandardPlacesAndForDisabledPersons',
            OnlyFpkBranded: false,
            HasPlacesForLargeFamily: false,
            CarIssuingType: 'Passenger',
          },
        },
      );
      if (!res.Cars) {
        throw new HttpException(
          'No Cars in car pricing response',
          HttpStatus.BAD_GATEWAY,
        );
      }
      return res.Cars;
    } catch (e: any) {
      throw new HttpException(
        `Car pricing error: ${JSON.stringify(e)}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  private async getCarSchemeSvg(schemeId: number): Promise<string> {
    try {
      const res: string = await axiosInstance(
        `https://ticket.rzd.ru/api/v1/carscheme/image/${schemeId}/ForwardPcFirstStorey`,
      );
      return res;
    } catch {
      return '';
    }
  }

  // "2025-05-23" + "19:24" → "2025-05-23T19:24:00"
  private buildDepartureDateTime(date: string, time: string): string {
    return `${date}T${time}:00`;
  }
}
