import { GameEvent, GameEventType } from '../types';

type EventHandler = (event: GameEvent) => void;

class EventBus {
  private handlers: Map<GameEventType, EventHandler[]> = new Map();

  on(type: GameEventType, handler: EventHandler): () => void {
    const existing = this.handlers.get(type) || [];
    existing.push(handler);
    this.handlers.set(type, existing);

    // Return unsubscribe function
    return () => {
      const list = this.handlers.get(type) || [];
      const idx = list.indexOf(handler);
      if (idx >= 0) list.splice(idx, 1);
    };
  }

  emit(type: GameEventType, payload: Record<string, unknown> = {}): void {
    const event: GameEvent = {
      type,
      payload,
      timestamp: Date.now(),
    };

    const handlers = this.handlers.get(type) || [];
    for (const handler of handlers) {
      try {
        handler(event);
      } catch (e) {
        console.warn(`EventBus handler error for ${type}:`, e);
      }
    }
  }

  off(type: GameEventType): void {
    this.handlers.delete(type);
  }

  clear(): void {
    this.handlers.clear();
  }
}

export const eventBus = new EventBus();
