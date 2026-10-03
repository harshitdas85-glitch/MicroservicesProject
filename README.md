Microservices Task Management System

A backend microservices-based task management system built using Node.js, PostgreSQL, Kafka, and an API Gateway.

The project is designed to demonstrate communication between independent services, event-driven architecture, database-per-service design, and asynchronous processing using Kafka.

Architecture

The system consists of multiple microservices, with each service responsible for a specific domain.

Services

API Gateway

Acts as the single entry point for client requests.

Routes requests to the appropriate microservice.

Handles common gateway-level concerns such as authentication and request forwarding.

Task Service

Responsible for creating, updating, retrieving, and managing tasks.

Maintains its own PostgreSQL database.

Publishes task-related events to Kafka.

Task Attachment Service

Handles attachments associated with tasks.

Responsible for storing and managing task attachment metadata.

Uses its own PostgreSQL database.

Workflow Service

Handles workflow/history information related to tasks.

Consumes task events from Kafka.

Stores workflow events in its own PostgreSQL database.

Kafka

Acts as the event/message broker between services.

Allows services to communicate asynchronously through events.

The workflow service consumes events produced by other services.

Database Architecture

The project follows a database-per-service approach.

There are 4 separate PostgreSQL databases, with each database belonging to a specific service/domain.

                    ┌──────────────────┐
                    │    API Gateway   │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
       ┌────────────┐ ┌──────────────┐ ┌──────────────┐
       │ Task       │ │ Attachments  │ │  Workflows   │
       │ Service    │ │ Service      │ │  Service     │
       └─────┬──────┘ └──────┬───────┘ └──────┬───────┘
             │               │                │
             ▼               ▼                ▼
         PostgreSQL      PostgreSQL       PostgreSQL
             │
             │
             ▼
          ┌───────┐
          │ Kafka │
          └───┬───┘
              │
              ▼
       Kafka Consumer
              │
              ▼
       Workflow Service
              │
              ▼
        Workflow DB


The fourth database can be used by the remaining service/domain in the project.

Each service owns its data and communicates with other services through APIs or asynchronous events rather than directly accessing another service's database.

Kafka Event Flow

The system uses Kafka for event-driven communication.

For example, when a task-related event occurs:

Client
  │
  ▼
API Gateway
  │
  ▼
Task Service
  │
  │  Task event
  ▼
Kafka
  │
  │  Consumer reads event
  ▼
Workflow Consumer
  │
  ▼
Workflow Service
  │
  ▼
Workflow PostgreSQL DB


The consumer listens to Kafka topics and processes incoming events.

After receiving an event, the consumer passes it to the workflow service, which persists the event in the workflow database.

This provides an asynchronous flow where the service producing the event does not need to directly call the workflow service.

Event-Driven Architecture


Technology Stack

Node.js

TypeScript

PostgreSQL

Apache Kafka

KafkaJS

Express / Fastify

API Gateway

Docker / Docker Compose

Database Design



License

This project is intended for learning and demonstrating microservices architecture, event-driven systems, Kafka, and PostgreSQL.
