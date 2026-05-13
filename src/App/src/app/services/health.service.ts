import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '../app-config.token';

@Injectable({ providedIn: 'root' })
export class HealthService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  check() {
    return this.http.get(`${this.config.apiUrl}/health`);
  }
}
