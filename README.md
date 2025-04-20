# Appointment Backend Service

Este es un servicio de backend sin servidor para gestionar agendamientos de citas médicas, implementado con Node.js, AWS Lambda y Serverless Framework. Soporta integración con distintos países mediante colas SQS y arquitectura basada en eventos.

---

## Tecnologías usadas

- **Node.js + TypeScript**
- **AWS Lambda**
- **API Gateway**
- **DynamoDB** (registro principal)
- **RDS MySQL** (per país: PE, CL)
- **SNS + SQS** (distribución de eventos)
- **EventBridge** (eventos de sistema)
- **Jest** (pruebas)
- **Serverless Framework**

---

## Arquitectura

![Appointment Backend Architecture](./docs/architecture.png)

### Flujo General:
1. El cliente realiza un POST `/appointments`.
2. API Gateway dispara una Lambda (`createAppointment`).
3. La cita se guarda en **DynamoDB**.
4. Se publica un evento en **SNS** con `countryISO`.
5. SNS enruta a distintas colas **SQS** (`sqs_pe`, `sqs_cl`).
6. Lambdas workers procesan cada cola, insertan en **RDS** regional.
7. Se emite evento final a **EventBridge** para notificar el cambio de estado.
8. Otra Lambda (`updateStatus`) actualiza el estado en DynamoDB.

---

## Estructura del proyecto

```
appointment-backend/
- src/
  - domain/
    - entities/Appointment.ts
  - interfaces/
    - http/validators/appointmentValidator.ts
    - lambdas/
      - createAppointment.ts
      - getAppointments.ts
      - appointment_pe.ts
      - appointment_cl.ts
      - updateStatus.ts
  - infrastructure/
    - db/dynamoRepository.ts
    - events/eventBridgePublisher.ts
    - messaging/snsPublisher.ts
  - tests/
    - createAppointment.test.ts
- .env
- .env.example
- serverless.yml
- serverless.env.yml
- README.md

```

---

## Variables de entorno

### `.env.example`

```env
APPOINTMENTS_TABLE=Appointments
SNS_TOPIC_ARN=arn:aws:sns:us-east-1:123456789012:AppointmentTopic
EVENT_BUS_NAME=appointment-bus

MYSQL_PE_HOST=your-mysql-pe-host
MYSQL_PE_USER=user
MYSQL_PE_PASSWORD=password
MYSQL_PE_DB=appointment_pe

MYSQL_CL_HOST=your-mysql-cl-host
MYSQL_CL_USER=user
MYSQL_CL_PASSWORD=password
MYSQL_CL_DB=appointment_cl
```

### `serverless.env.yml`

```yaml
default:
  APPOINTMENTS_TABLE: Appointments
  SNS_TOPIC_ARN: arn:aws:sns:us-east-1:123456789012:AppointmentTopic
  EVENT_BUS_NAME: appointment-bus
```

---

## Endpoints

- `POST /appointments` — crea una cita
- `GET /appointments/{insuredId}` — lista citas por asegurado

---

## Scripts

```bash
npm install
npm run test
npm run deploy
```

---

## Pruebas

- Tests con Jest.
- Mock de AWS SDK.
- Validación de entradas.
- Validación de respuestas.

---

## Deploy

1. Configura credenciales AWS (`npx serverless config credentials`).
2. Crea recursos:

```bash
npm install -g serverless
serverless deploy
```
---

## Documentación de la API de Citas

Este proyecto proporciona una API para gestionar citas médicas. Puedes acceder a la documentación interactiva de la API en el siguiente enlace:

- **Obtener Documentación de la API:**
  - **Método:** `GET`
  - **URL:** `/docs`