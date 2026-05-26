первый post запрос уходит на
https://www.rzd.ru/legitimacy/status/
с данными которые вводят вручную из UI
``` json
{
    date: "24.05.2025"
    ticketNumber: "73600491644661"
}
```

В ответе возвращается:
``` json
{
    RID: number;
    result: 'RID';
}
```

Затем сразу делается запрос на
https://www.rzd.ru/legitimacy/status/?rid=10006073273
где rid берется из прошлого запроса свойство RID
и в body повторяются данные из первого запроса
``` json
{ 
    date: "24.05.2025"
    ticketNumber: "73600491644661"
}
```
в ответ приходит json объект
``` json
{
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
```
из этого ответа нужно сохранить:
``` js
const departure = data.ticketResponseData.stdep
const arrive = data.ticketResponseData.starr
const train = data.ticketResponseData.train
const vag = data.ticketResponseData.vag
const date = data.passengerResponseData.date
const time = data.passengerResponseData.time
```

Следом делается Следующий запрос, для того чтобы из значений из stdep и starr получить код станции, для этого
надо сделать два GET запроса в

https://ticket.rzd.ru/api/v1/suggests?Query=%D0%A1%D0%90%D0%9D%D0%9A%D0%A2-%D0%9F%D0%95%D0%A2%D0%95%D0%A0%D0%91%D0%A3%D0%A0%D0%93-%D0%93%D0%9B%D0%90%D0%92%D0%9D.&TransportType=rail&GroupResults=false&RailwaySortPriority=true&SynonymOn=1&Language=ru

где Query это значения из departure и arrive, остальные параметры оставить как есть.

в ответ вернется массив
``` json
[
    {
        "nodeId": "5a8bfc81340c7407a08ecfaf",
        "cityId": "5a3244bc340c7441a0a556ca",
        "expressCode": "2004001",
        "name": "Санкт-Петербург-Главный (Московский вокзал)",
        "nodeType": "station",
        "transportType": "train",
        "region": "Санкт-Петербург, Российская Федерация",
        "regionIso": "RU-SPE",
        "countryIso": "RU",
        "suburbanCode": "428",
        "foreignCode": "2004001",
        "hasAeroExpress": false
    }
]
```
Нужно взять первый элемент и из него сохранить expressCode.
Этих запросов сделать два, для departure и arrive.

Затем делаем запрос в:
https://ticket.rzd.ru/apib2b/p/Railway/V1/Search/CarPricing?service_provider=B2B_RZD&isBonusPurchase=false
с body:
``` json
{
    "OriginCode":"2004001", // сюда подставить expressCode departure
    "DestinationCode":"2006004", // сюда подставить expressCode arrive
    "DepartureDate":"2026-06-18T05:35:00", // сюда date и time предваритель преобразовав в нужный формат
    "TrainNumber":"723Р", // сюда train
    "SpecialPlacesDemand":"StandardPlacesAndForDisabledPersons",
    "OnlyFpkBranded":false,
    "HasPlacesForLargeFamily":false,
    "CarIssuingType":"Passenger"
}
```

ответ:
``` json
{
    "OriginCode": "2004001",
    "DestinationCode": "2006004",
    "OriginTimeZoneDifference": 0,
    "DestinationTimeZoneDifference": 0,
    "Cars": [
        {
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
    ],
    "RoutePolicy": "Internal",
    "TrainInfo": {
        "TrainNumber": "723Р",
        "TrainNumberToGetRoute": "723Р",
        "DisplayTrainNumber": "723Р",
        "TrainDescription": "СКРСТ",
        "TrainName": "ЛАСТОЧКА",
        "TrainNameEn": "ЛАСТОЧКА",
        "TransportType": "Train",
        "OriginName": "Санкт-Петербург-Главный (Московский вокзал)",
        "InitialStationName": "Санкт-Петербург-Главный",
        "OriginStationCode": "2004001",
        "OriginStationInfo": {
            "StationName": "Санкт-Петербург-Главный",
            "StationCode": "2004001",
            "CnsiCode": "428",
            "RegionName": "Санкт-Петербург",
            "IsoCode": "RU-SPE"
        },
        "InitialTrainStationInfo": {
            "StationName": "Санкт-Петербург-Главный",
            "StationCode": "2004001",
            "CnsiCode": "428",
            "RegionName": "Санкт-Петербург",
            "IsoCode": "RU-SPE"
        },
        "InitialTrainStationCode": "2004001",
        "InitialTrainStationCnsiCode": "428",
        "DestinationName": "Москва Октябрьская (Ленинградский вокзал)",
        "FinalStationName": "Москва Октябрьская",
        "DestinationStationCode": "2006004",
        "DestinationStationInfo": {
            "StationName": "Москва Октябрьская",
            "StationCode": "2006004",
            "CnsiCode": "1108",
            "RegionName": "Москва",
            "IsoCode": "RU-MOW"
        },
        "FinalTrainStationInfo": {
            "StationName": "Москва Октябрьская",
            "StationCode": "2006004",
            "CnsiCode": "1108",
            "RegionName": "Москва",
            "IsoCode": "RU-MOW"
        },
        "FinalTrainStationCode": "2006004",
        "FinalTrainStationCnsiCode": "1108",
        "DestinationNames": [
            "МОСКВА ОКТ"
        ],
        "FinalStationNames": [
            "МОСКВА ОКТ"
        ],
        "DepartureDateTime": "2026-06-18T05:35:00",
        "LocalDepartureDateTime": "2026-06-18T05:35:00",
        "ArrivalDateTime": "2026-06-18T11:13:00",
        "LocalArrivalDateTime": "2026-06-18T11:13:00",
        "ArrivalDateTimes": [
            "2026-06-18T11:13:00"
        ],
        "LocalArrivalDateTimes": [
            "2026-06-18T11:13:00"
        ],
        "DepartureDateFromFormingStation": "2026-06-18T00:00:00",
        "DepartureStopTime": 0,
        "ArrivalStopTime": 0,
        "TripDuration": 338.0,
        "TripDistance": 650,
        "IsSuburban": false,
        "IsComponent": false,
        "CarServices": [
            "Meal"
        ],
        "IsSaleForbidden": false,
        "IsTicketPrintRequiredForBoarding": false,
        "BookingSystem": "Express3",
        "IsVrStorageSystem": false,
        "PlacesStorageType": "Russia",
        "BoardingSystemTypes": [
            "PassengerBoardingControl"
        ],
        "TrainBrandCode": "2012",
        "TrainClassNames": [
            "HighSpeedTrain"
        ]
    },
    "IsFromUkrain": false,
    "ClientFeeCalculation": null,
    "AgentFeeCalculation": null,
    "BookingSystem": "Express3",
    "CarTariffPrices": null,
    "OriginRetrievalDate": "2026-05-20T17:39:20"
}
```

из него находим все элементы из массива "Cars" у которых "CarNumber" равняется "vag" и сохраняем "FreePlaces" из
каждого массива в массив массивов

А также находим поле "RailwayCarSchemeId" у тех у которых "CarNumber" равняется "vag"
Они должны совпадать, так как это схема вагона
И делаем GET запрос в https://ticket.rzd.ru/api/v1/carscheme/image/537/ForwardPcFirstStorey
где /image/{RailwayCarSchemeId}/ForwardPcFirstStorey
В ответ получаем svg картинку.


Входные данные:
date - выбор дня в календаре
ticketNumber - поле ввода номера билета

Выходные данные:
svg картинка
и массив FreePlaces