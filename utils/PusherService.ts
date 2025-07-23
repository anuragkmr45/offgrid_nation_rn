// src/utils/PusherService.ts
import Pusher from "pusher-js";
import { PUSHER_CLUSTER, PUSHER_KEY } from "./env";

export class PusherService {
  private static instance: PusherService;
  private pusher?: Pusher;

  private constructor() { }

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

  unsubscribeChannel(name: string) {
    if (!this.pusher) return;
    this.pusher.unsubscribe(name);
  }

  disconnect() {
    this.pusher?.disconnect();
    this.pusher = undefined;
  }
}
