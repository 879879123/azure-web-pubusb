import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent implements OnInit, OnChanges {
  @Input() logs;
  datas: Array<any> = [];
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.logs.subscribe((log) => {
      this.datas.push(log);
    });

    // this.logs.subscribe(res => console.log(res));
    // this.logs
    //   .pipe(
    //     map((log: any) => {
    //       console.log(log);
    //       switch (log?.type) {
    //         case 'system':
    //           // const {
    //           //   type,
    //           //   event,
    //           //   message
    //           // } = log || {} as SystemLog;
    //           console.log(
    //             `type: ${log.type} event: ${log.event} userId: ${log.userId} connectionId ${log.connectionId}`
    //           );
    //           return;
    //         case 'message':
    //           // const {
    //           //   type,
    //           //   group,
    //           //   fromUserId,
    //           //   from,
    //           //   dataType ,
    //           //   data
    //           // } = log || {} as MessageLog;
    //           console.log(
    //             `type: ${log.type} group: ${log.group} fromUserId: ${log.fromUserId} from ${log.from} dataType ${log.dataType} data ${log.data}`
    //           );
    //           return;
    //         case 'ack':
    //           console.log(
    //             `type: ${log.type} ackId: ${log.ackId} success: ${log.success} error: ${log?.error?.name} message: ${log?.error?.message}`
    //           );
    //           return;
    //       }
    //     })
    //   )
    //   .subscribe();
  }
}
