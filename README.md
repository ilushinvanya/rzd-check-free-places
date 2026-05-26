## Описание
Сервис визуализирует рассадку в вагоне по номеру билета. Посмотрите на схему РЖД, чтобы оценить занятость соседних мест: спланируйте, стоит ли брать с собой беруши или вы — счастливчик, которому досталось почти пустое купе.

Сервис дублирует функционал официального сайта РЖД.

Свободные места можно увидеть и на сайте РЖД, для этого необходимо найти поезд по точкам отправления и прибытия, 
выбрать класс обслуживания и затем найти вагон. В этом сервисе достаточно ввести номер билет и дату отправления.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
