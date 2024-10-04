// import amqplib from "amqplib";

// const queue = "reservation_queue";

// export class ReservationProducer {

//     static async sendReservation(reservation) {

//         try {

//             const conn = await amqplib.connect("amqp://localhost");

//             const channel = await conn.createChannel();

//             await channel.assertQueue(queue, { durable: true });

//             channel.sendToQueue(queue, Buffer.from(JSON.stringify(reservation)), { persistent: true });

//         } catch (error) {

//         }
//     }
// }
