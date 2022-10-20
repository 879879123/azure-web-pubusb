import { Injectable } from '@angular/core';

import { Subject, Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketConnectionService {
  constructor() {}
  ws: any;
  subject: Subject<MessageEvent>;
  connected$ = new Subject<any>();

  public connect(url?): Subject<MessageEvent> {
    if (url) {
      this.subject = this._create(url);
      this.connected$.next(true);
    }
    return this.subject;
  }

  public connected(): Observable<any> {
    return this.connected$.asObservable();
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }

  private _create(url): Subject<MessageEvent> {
    this.ws = new WebSocket(url, 'json.webpubsub.azure.v1');

    let observable = new Observable((obs: Observer<MessageEvent>) => {
      this.ws.onmessage = obs.next.bind(obs);
      this.ws.onerror = obs.error.bind(obs);
      this.ws.onclose = obs.complete.bind(obs);
      return this.ws.close.bind(this.ws);
    });

    let observer = {
      next: (data: Object) => {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify(data));
        }
      },
    };
    return Subject.create(observer, observable);
  }
}
