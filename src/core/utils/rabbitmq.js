import amqp from "amqplib";
import { config } from "../config/env.js";
import { logger } from "../loggers/logger.js";
import { ReservationConsumer } from "../../reservation/consumers/reservation.consumer.js";

const retryInterval = 3000;

export class RabbitMQManager {
  constructor() {
    this.channel = null;
    this.connection = null;
    this.queue = "reservationQueue";
    this.url = config.rabbitmq.url ? config.rabbitmq.url : "amqp://localhost";
    this.isConnected = false;
  }

  async connect() {
    try {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();

      await this.channel.assertQueue(this.queue, { durable: true });

      this.isConnected = true;

      logger.info("RabbitMQ connected and queue created.");
    } catch (error) {
      this.isConnected = false;
      logger.error("error connecting to RabbitMQ", error);
      throw new Error("error connecting to RabbitMQ", error);
    }
  }

  async publishToQueue(message) {
    if (!this.channel || !this.queue) {
      throw new Error("RabbitMQ channel not initialized.");
    }

    this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    logger.info("Message published to RabbitMQ queue.", message);
  }

  async consumeFromQueue(callback) {
    if (!this.channel || !this.queue) {
      throw new Error("RabbitMQ channel not initialized.");
    }

    this.channel.consume(
      this.queue,
      async (message) => {
        if (message) {
          const content = JSON.parse(message.content.toString());
          try {
            await callback(content);
            this.channel.ack(message);
          } catch (error) {
            logger.error("Error processing message from RabbitMQ", error);
          }
        }
      },
      {
        noAck: false,
      }
    );
  }

  async close() {
    try {
      await this.channel.close();
      await this.connection.close();
      logger.info("RabbitMQ connection closed.");
      this.isConnected = false;
    } catch (error) {
      logger.error("Error closing RabbitMQ connection", error);
      throw new Error("Error closing RabbitMQ connection", error);
    }
  }

  retryRabbitMQ() {
    setTimeout(async () => {
      if (this.isConnected) {
        return;
      }
      try {
        await this.connect();
        logger.info("Reconnected to RabbitMQ successfully.");
        await ReservationConsumer.startConsuming();
      } catch (error) {
        logger.error("Error reconnecting to RabbitMQ", error);
        this.retryRabbitMQ();
      }
    }, retryInterval);
  }
}

export const rabbitMQManager = new RabbitMQManager();
