// src/utils/PusherService.ts
import Constants from "expo-constants";
import Pusher from "pusher-js";

const { PUSHER_KEY, PUSHER_CLUSTER } = (Constants.expoConfig?.extra ?? {}) as {
  PUSHER_KEY: string;
  PUSHER_CLUSTER: string;
};

export class PusherService {
  private static instance: PusherService;
  private pusher?: Pusher;

  private constructor() {}

  static getInstance() {
    if (!PusherService.instance) {
      PusherService.instance = new PusherService();
    }
    return PusherService.instance;
  }

  init() {
    if (this.pusher) return; // already connected

    this.pusher = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      forceTLS: true,
    });
  }

  subscribeChannel(name: string) {
    if (!this.pusher) this.init();
    return this.pusher!.subscribe(name);
  }

  disconnect() {
    this.pusher?.disconnect();
    this.pusher = undefined;
  }
}
