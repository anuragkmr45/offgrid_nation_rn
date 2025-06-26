// src/utils/TabEventEmitter.ts
import mitt, { Emitter } from 'mitt'

type Events = {
  HOME_DOUBLE_TAP: void
  PREMIUM_DOUBLE_TAP: void
}

export const TabEventEmitter: Emitter<Events> = mitt<Events>()
export const TAB_EVENTS = {
  HOME_DOUBLE_TAP: 'HOME_DOUBLE_TAP',
  PREMIUM_DOUBLE_TAP: 'PREMIUM_DOUBLE_TAP',
} as const
