
import { redisClient } from "./redisClient.js";

class RedisWaitingList {
  constructor() {
    this.prefix = "waiting_list:";
  }

  async add(eventId, userId) {
    const key = this.prefix + eventId;
    const createdAt = Date.now();

    await redisClient.zAdd(key, { score: createdAt, value: userId });
  }

  async getFirstInWaitingList(eventId) {
    const key = this.prefix + eventId;

    const result = await redisClient.zRange(key, 0, 0);
    return result.length > 0 ? result[0] : null;
  }

  async removeFirstInWaitingList(eventId) {
    const key = this.prefix + eventId;


    const firstUser = await this.getFirstInWaitingList(eventId);
    if (firstUser) {
      await redisClient.zRem(key, firstUser);
    }
  }


  async clearWaitingList(eventId) {
    const key = this.prefix + eventId;
    await redisClient.del(key);
  }
}

export const redisWaitingList = new RedisWaitingList();
