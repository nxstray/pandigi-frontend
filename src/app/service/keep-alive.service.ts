import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, interval, switchMap, catchError, of, retry, timeout } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KeepAliveService implements OnDestroy {

  private readonly PING_URL = `${environment.apiUrl}/public/content/pages/LANDING`;
  private readonly INTERVAL_MS = 4 * 60 * 1000;
  private readonly REQUEST_TIMEOUT_MS = 15_000;

  private intervalSub: Subscription | null = null;
  private isRunning = false;

  constructor(private http: HttpClient) {}

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    this.doPing().subscribe();

    this.intervalSub = interval(this.INTERVAL_MS)
      .pipe(switchMap(() => this.doPing()))
      .subscribe();
  }

  stop(): void {
    this.intervalSub?.unsubscribe();
    this.intervalSub = null;
    this.isRunning = false;
  }

  private doPing() {
    return this.http.get(this.PING_URL).pipe(
      timeout(this.REQUEST_TIMEOUT_MS),
      retry({ count: 2, delay: 5000 }),
      catchError((err) => {
        console.warn('[KeepAlive] Backend belum merespons:', err.message);
        return of(null);
      })
    );
  }

  ngOnDestroy(): void {
    this.stop();
  }
}