import { Component, OnInit } from '@angular/core';
import { WebPubSubServiceClient } from '@azure/web-pubsub';
import { map, Subject, tap, of, BehaviorSubject, catchError } from 'rxjs';
import { WebsocketConnectionService } from '../shared/services/websocket-connection.service';
import * as _ from 'lodash';
import * as moment from 'moment';

export interface Group {
  ackId: number;
  groupName: string;
  status: undefined | boolean;
}

export interface MessageLog {
  // message // ack // system
  type: string;
  group: string;
  fromUserId?: string;
  from: string;
  dataType?: string;
  data?: string;
}

export interface SystemLog {
  type: string;
  event: string;
  message?: string;
}

export interface AckLog {
  type: string;
  ackId: number;
  success: boolean;
  error: {
    name: 'Forbidden' | 'Internal' | 'ServerError' | 'Duplicate';
    message: string;
  };
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  connection: Subject<any>;
  messages: Subject<any>;
  ackId: number = 0;
  isConnected: boolean = false;
  group: Array<Group> = [];
  logs = new BehaviorSubject(null);
  requests = [];
  constructor(private _websocketConnectionService: WebsocketConnectionService) {
    this._websocketConnectionService.connected$.subscribe((status: boolean) => {
      if (status) {
        this.isConnected = true;
      } else {
        this.isConnected = false;
      }
    });
  }

  ngOnInit(): void {}

  async isConnectPubSub(data) {
    const { connectionString, hubname } = data;
    if (connectionString.length > 0 && hubname.length > 0) {
      const client = new WebPubSubServiceClient(connectionString, hubname);
      let clientData = await client.getClientAccessToken({
        roles: ['webpubsub.sendToGroup', 'webpubsub.joinLeaveGroup'],
      });
      this.logs.next({
        ...this.logs.getValue(),
        message: `[${moment().toISOString()}] Client WebSocket opened.`,
      });
      this.messages = <Subject<any>>(
        this._websocketConnectionService.connect(clientData.url).pipe(
          map((response) => {
            return response.data;
          })
        )
      );

      this.messages
        .pipe(
          map((res) => JSON.parse(res)),
          tap((res) => {
            console.log(`-------------websocket response---------------`);
            console.log(res);
            console.log(`-------------websocket response---------------`);
            if (res?.type === 'system') {
              if (res.event === 'connected') {
                const { connectionId } = res;
                this._websocketConnectionService.connected$.next(true);
                this.logs.next({
                  ...this.logs.getValue(),
                  message: `[${moment().toISOString()}] ConnectionID: ${connectionId} connected.`,
                });
              } else if (res.event === 'disconnected') {
                this._websocketConnectionService.connected$.next(false);
                this.logs.next({
                  ...this.logs.getValue(),
                  message: `[${moment().toISOString()}] webSocket disconnected ${
                    res?.message ? res.message : ''
                  }`,
                });
              }
            }

            if (res?.type === 'message') {
              const { from, group, data } = res;
              console.log(data);
              try {
                const json = JSON.parse(data);
                this.logs.next({
                  ...this.logs.getValue(),
                  message: `[${moment().toISOString()}] [From ${from}] ${group}: `,
                  json,
                });
              } catch (e) {
                const text = data;
                this.logs.next({
                  ...this.logs.getValue(),
                  message: `[${moment().toISOString()}] [From ${from}] ${group}: ${text}`,
                });
              }
            }

            if (res?.type === 'ack') {
              const { ackId, success } = res;
              const index = _.findIndex(this.group, { ackId: ackId });

              if (index >= 0) {
                this.group[index]['status'] = success;
              }

              const requestIndex = _.findIndex(this.requests, { ackId: ackId });

              if (requestIndex >= 0) {
                const { type } = this.requests[requestIndex];
                if (type === 'joinGroup') {
                  const { group, ackId } = this.requests[requestIndex];
                  this.logs.next({
                    ...this.logs.getValue(),
                    message: `[${moment().toISOString()}] Joining group ${group}(ackId=${ackId}) succeeded.`,
                  });
                }
                if (type === 'leaveGroup') {
                  const { group, ackId } = this.requests[requestIndex];
                  this.logs.next({
                    ...this.logs.getValue(),
                    message: `[${moment().toISOString()}] Leave group ${group}(ackId=${ackId}) succeeded.`,
                  });
                }

                this.requests.splice(requestIndex, 1);
              }
            }
          })
        )
        // @ts-ignore
        .subscribe(
          (result?: any) => {},
          (error?: any) => {
            console.table(error);
          }
        );
    }
  }

  joinGroup(group) {
    if (group && this.isConnected) {
      const { groupName } = group;
      const ackId = this.ackId++;

      this.leaveGroup(group);

      this.group = [
        ...this.group,
        { ackId: ackId, groupName: groupName, status: undefined },
      ];
      console.table({
        type: 'joinGroup',
        group: groupName,
        ackId: ackId,
        noEcho: false,
      });

      this.logs.next({
        ...this.logs.getValue(),
        message: `[${moment().toISOString()}] Joining group ${groupName}(ackId=${ackId}) requested.`,
      });

      // store request ackId
      this.requests.push({
        type: 'joinGroup',
        group: groupName,
        ackId: ackId,
        noEcho: false,
      });

      this.messages.next({
        type: 'joinGroup',
        group: groupName,
        ackId: ackId,
        noEcho: false,
      });
    }
  }

  leaveGroup(group) {
    if (group && this.isConnected) {
      const { groupName } = group;
      if (_.find(this.group, { groupName: groupName })) {
        const tmp = _.remove(this.group, { groupName: groupName });
        if (tmp) {
          // delete the group data and send leaveGroup message to pubsub when the group is duplicate
          const { groupName, ackId } = tmp[0];
          // const ackId = this.ackId++;
          console.table({ type: 'leaveGroup', group: groupName, ackId: ackId });
          this.requests.push({
            type: 'leaveGroup',
            group: groupName,
            ackId: ackId,
          });
          this.messages.next({
            type: 'leaveGroup',
            group: groupName,
            ackId: ackId,
          });
          this.logs.next({
            ...this.logs.getValue(),
            message: `[${moment().toISOString()}] Leave group ${groupName}(ackId=${ackId}) requested.`,
          });
        }
      }
    }
  }

  publishMessage({ message, selected }) {
    if (this.isConnected && message.length > 0 && selected.length > 0) {
      console.log(message);
      for (let i = 0; i < selected.length; i++) {
        let ackId = this.ackId++;
        const { groupName, status } = selected[i];
        if (status) {
          // this.logs.next({
          //   message: `sending message to group ${groupName}(ackId=${ackId}) requested`,
          // });
          // this.requests.push({
          //   type: 'sendToGroup',
          //   group: groupName,
          //   data: message,
          //   ackId: ackId,
          // });
          this.messages.next({
            type: 'sendToGroup',
            group: groupName,
            data: message,
            ackId: ackId,
          });
        }
      }
    }
  }

  isDisconnect(event) {
    if (event) {
      of(this._websocketConnectionService.disconnect())
        .pipe(
          tap(() => {
            this._websocketConnectionService.connected$.next(false);
            this.group = [];
            this.logs.next({
              ...this.logs.getValue(),
              message: `[${moment().toISOString()}] webSocket closed`,
            });
          })
        )
        .subscribe();
    }
  }
}
