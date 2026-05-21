import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';
import { APP_CONFIG } from '../app-config.token';
import { SnakeStateMessage } from '../models/snake-state-message';
import { colorForConnectionId } from './remote-snake-color';

@Injectable({ providedIn: 'root' })
export class RealtimeService {
  private readonly config = inject(APP_CONFIG);
  private readonly destroyRef = inject(DestroyRef);

  private readonly connection: HubConnection;

  readonly remoteSnakes = signal<Map<string, SnakeStateMessage>>(new Map());

  /**
   * Stable HSL colour per remote connection id, derived deterministically from
   * the id itself. Recomputed only when the set of connection ids changes.
   */
  readonly remoteColors = computed<Map<string, string>>(() => {
    const map = new Map<string, string>();
    for (const id of this.remoteSnakes().keys()) {
      map.set(id, colorForConnectionId(id));
    }
    return map;
  });

  constructor() {
    this.connection = new HubConnectionBuilder()
      .withUrl(`${this.config.apiUrl}/hubs/snake`)
      .withAutomaticReconnect()
      .build();

    this.connection.on('SnakeState', (message: SnakeStateMessage) => {
      this.remoteSnakes.update((map) => {
        const next = new Map(map);
        next.set(message.connectionId, message);
        return next;
      });
    });

    this.connection.on('PlayerLeft', (connectionId: string) => {
      this.remoteSnakes.update((map) => {
        const next = new Map(map);
        next.delete(connectionId);
        return next;
      });
    });

    this.connection.start().catch((err) => {
      console.warn('[RealtimeService] Could not connect to hub — running in single-player mode.', err);
    });

    this.destroyRef.onDestroy(() => {
      this.connection.stop().catch(() => {});
    });
  }

  publishState(state: SnakeStateMessage): void {
    if (this.connection.state !== HubConnectionState.Connected) return;
    this.connection.invoke('PublishState', state).catch(() => {});
  }
}
