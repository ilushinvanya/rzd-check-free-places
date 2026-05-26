export interface TicketRID {
  RID: number;
  result: 'RID';
}

export interface TicketInfo {
  result: 'OK';
  data: {
    result: 'OK';
    passengerResponseData: {
      ticketNumber: string;
      date: string;
      time: string;
    };
    ticketResponseData: {
      stdep: string;
      starr: string;
      train: string;
      vag: string;
      cartype: string;
      klobsl: string;
    };
  };
}

export interface Station {
  expressCode: string;
  name: string;
}

export interface Train {
  OriginCode: '2004001';
  DestinationCode: '2006004';
  OriginTimeZoneDifference: 0;
  DestinationTimeZoneDifference: 0;
  Cars: Car[];
  TrainInfo: {
    TrainNumber: '723Р';
    TrainNumberToGetRoute: '723Р';
    DisplayTrainNumber: '723Р';
    TrainDescription: 'СКРСТ';
    TrainName: 'ЛАСТОЧКА';
    TrainNameEn: 'ЛАСТОЧКА';
    TransportType: 'Train';
    OriginName: 'Санкт-Петербург-Главный (Московский вокзал)';
    InitialStationName: 'Санкт-Петербург-Главный';
    OriginStationCode: '2004001';
    OriginStationInfo: {
      StationName: 'Санкт-Петербург-Главный';
      StationCode: '2004001';
      CnsiCode: '428';
      RegionName: 'Санкт-Петербург';
      IsoCode: 'RU-SPE';
    };
    InitialTrainStationInfo: {
      StationName: 'Санкт-Петербург-Главный';
      StationCode: '2004001';
      CnsiCode: '428';
      RegionName: 'Санкт-Петербург';
      IsoCode: 'RU-SPE';
    };
    InitialTrainStationCode: '2004001';
    InitialTrainStationCnsiCode: '428';
    DestinationName: 'Москва Октябрьская (Ленинградский вокзал)';
    FinalStationName: 'Москва Октябрьская';
    DestinationStationCode: '2006004';
    DestinationStationInfo: {
      StationName: 'Москва Октябрьская';
      StationCode: '2006004';
      CnsiCode: '1108';
      RegionName: 'Москва';
      IsoCode: 'RU-MOW';
    };
    FinalTrainStationInfo: {
      StationName: 'Москва Октябрьская';
      StationCode: '2006004';
      CnsiCode: '1108';
      RegionName: 'Москва';
      IsoCode: 'RU-MOW';
    };
    FinalTrainStationCode: '2006004';
    FinalTrainStationCnsiCode: '1108';
    DestinationNames: ['МОСКВА ОКТ'];
    FinalStationNames: ['МОСКВА ОКТ'];
    DepartureDateTime: '2026-06-18T05:35:00';
    LocalDepartureDateTime: '2026-06-18T05:35:00';
    ArrivalDateTime: '2026-06-18T11:13:00';
    LocalArrivalDateTime: '2026-06-18T11:13:00';
    ArrivalDateTimes: ['2026-06-18T11:13:00'];
    LocalArrivalDateTimes: ['2026-06-18T11:13:00'];
    DepartureDateFromFormingStation: '2026-06-18T00:00:00';
    DepartureStopTime: 0;
    ArrivalStopTime: 0;
    TripDuration: 338.0;
    TripDistance: 650;
    IsSuburban: false;
    IsComponent: false;
    CarServices: ['Meal'];
    IsSaleForbidden: false;
    IsTicketPrintRequiredForBoarding: false;
    BookingSystem: 'Express3';
    IsVrStorageSystem: false;
    PlacesStorageType: 'Russia';
    BoardingSystemTypes: ['PassengerBoardingControl'];
    TrainBrandCode: '2012';
    TrainClassNames: ['HighSpeedTrain'];
  };
}

export interface Car {
  DestinationStationCode: '2006004';
  CarType: 'Sedentary';
  RailwayCarSchemeId: 541;
  CarSubType: '45С';
  CarTypeName: 'СИД';
  CarSchemeName: '45С';
  CarNumber: '01';
  ServiceClass: '1С';
  ServiceClassNameRu: 'Бизнес класс';
  ServiceClassNameEn: 'Business';
  InternationalServiceClass: '';
  CarDescription: 'У1';
  ServiceClassTranscript: 'Кресла с регулируемым основанием, откидной или приоконный столик, возможность зарядки мобильных устройств и ноутбуков. Расстояние между креслами увеличено.';
  FreePlaces: string;
  PlaceQuantity: 4;
  IsTwoStorey: false;
  PetTransportationShortDescription: null;
  PetTransportationFullDescription: null;
  MinPrice: 5825.8;
  MaxPrice: 5825.8;
  ServiceCost: 1665.3;
  PlaceReservationType: 'Usual';
  Carrier: 'ДОСС';
  CarrierDisplayName: 'ДОСС';
  HasGenderCabins: false;
  TrainNumber: '723Р';
  ArrivalDateTime: '2026-06-18T11:13:00';
  LocalArrivalDateTime: '2026-06-18T11:13:00';
  HasNoInterchange: false;
  HasPlaceNumeration: true;
  IsBeddingSelectionPossible: false;
  HasElectronicRegistration: true;
  HasDynamicPricing: false;
  HasPlacesNearBabies: false;
  HasPlacesNearPlayground: false;
  HasPlacesNearPets: false;
  HasNonRefundableTariff: false;
  OnlyNonRefundableTariff: false;
  IsAdditionalPassengerAllowed: false;
  IsChildTariffTypeAllowed: true;
  CarPlaceType: 'NearTableBackward';
  CarPlaceCode: '0';
  CarPlaceNameRu: 'У стола, против хода';
  CarPlaceNameEn: 'Table seat, backward';
  AllowedTariffs: [];
  IsSaleForbidden: false;
  AvailabilityIndication: 'Available';
  IsThreeHoursReservationAvailable: false;
  Road: 'РЖД/ОКТ';
  InfoRequestSchema: 'StandardIncludingInvalids';
  PassengerSpecifyingRules: 'Standard';
  IsMealOptionPossible: true;
  IsAdditionalMealOptionPossible: false;
  IsOnRequestMealOptionPossible: false;
  MealSalesOpenedTill: '2026-06-17T00:00:00';
  IsTransitDocumentRequired: false;
  IsInterstate: false;
  ClientFeeCalculation: null;
  AgentFeeCalculation: null;
  IsBranded: false;
  IsBuffet: false;
  TripDirection: 'Internal';
  IsFromUkrainianCalcCenter: false;
  IsForDisabledPersons: false;
  IsSpecialSaleMode: false;
  BoardingSystemType: 'PassengerBoardingControl';
  IsTourPackageAvailable: false;
  ArePlacesForBusinessTravelBooking: false;
  IsCarTransportationCoach: false;
  CarNumeration: 'FromHead';
  IsGroupTransportaionAvailable: true;
  IsAutoBookingAvailable: true;
  TrainNumberFromFormingStation: '723РА';
  PlacesWithConditionalRefundableTariffQuantity: 0;
  HasPlacesWithChild: false;
  HasPlacesForLargeFamily: false;
  CarPlaceName: 'У стола, против хода';
  HasFssBenefit: false;
  ServiceClassName: 'Бизнес класс';
}
