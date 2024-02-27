# Nombre del proyecto: comuna-backend

## Instalación
1. Clona este repositorio.
2. Ejecuta el siguiente comando para instalar las dependencias:
```bash
npm install
```

## Uso
### Modo de Desarrollo
Ejecuta el siguiente comando para iniciar la aplicación en modo de desarrollo:
```bash
npm run start:dev
```
Estoy ejecutará la api que responderá en el link: localhost:3000/

## Dependencias
### Dependencias de Desarrollo
- @types/cors 2.8.14
- @types/express 4.17.17
- @types/jest 29.5.12
- @types/jsonwebtoken 9.0.3
- @types/node 20.6.0
- @types/supertest 6.0.2
- @types/swagger-jsdoc 6.0.4
- @types/swagger-ui-express 4.1.6
- jest 29.7.0
- supertest 6.3.4
- ts-jest 29.1.2
- tsc-watch 6.0.4
- typescript 5.2.2

### Dependencias de Producción
- bcrypt-ts 4.0.1
- cors 2.8.5
- dotenv 16.3.1
- express 4.18.2
- express-validator 7.0.1
- jsonwebtoken 9.0.2
- mongodb 6.1.0
- mongoose 8.0.0
- mongoose-paginate-v2 1.8.0
- swagger-jsdoc 6.2.8
- swagger-ui-express 5.0.0

## Rutas
Una vez iniciada la API, podrás encontrar la documentación detallada en http://localhost:3000/api/docs/
## Person path: /api/person
- path GET | POST {dni, firstName, lastName, (phone), email, birthdate, password}
- path/:id GET | PUT {dni, firstName, lastName, (phone), email, birthdate, password} | PATCH {dni, firstName, lastName, (phone), email, birthdate, password} | DELETE

## Evento path: /api/evento
- path GET | POST {description, image, fechaHoraIni, fechaHoraFin}
- path/:id GET | PUT {description, image, fechaHoraIni, fechaHoraFin} | PATCH {description, image, fechaHoraIni, fechaHoraFin} | DELETE

## Competitor path: /api/competitor
- path GET | POST {person, competition}
- path/:id GET | PUT {competitor, competition} | PATCH {competitor, competition} | DELETE

## Competition Type path: /api/competition-type
- path GET | POST {description, rules}
- path/:id GET | PUT {description, rules} | PATCH {description, rules} | DELETE

## Competition path: /api/competition
- path GET | POST {description, competitionType, evento, fechaHoraIni, fechaHoraFinEstimada, premios, costoInscripcion}
- path/:id GET | PUT {description, competitionType, evento, fechaHoraIni, fechaHoraFinEstimada, premios, costoInscripcion} | PATCH {description, competitionType, evento, fechaHoraIni, fechaHoraFinEstimada, premios, costoInscripcion} | DELETE

## Auth path: /api/auth
- path/user/login POST {username, password}
- path/admin/login POST {username, password}

## Admin path: /api/admin
- path GET | POST {username, password}
- path GET | PUT {username, password} | PATCH {username, password} | DELETE
