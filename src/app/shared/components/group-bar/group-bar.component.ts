import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { Group } from '../../../home/home.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-group-bar',
  templateUrl: './group-bar.component.html',
  styleUrls: ['./group-bar.component.scss'],
})
export class GroupBarComponent implements OnInit, OnChanges {
  @Input() groups: Group[];
  @Input() isConnected: boolean;
  @Output() joinGroup = new EventEmitter<any>();
  @Output() leaveGroup = new EventEmitter<any>();

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {
    // console.log('group-bar-component ngOnChange::');
    console.log(this.groups);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.joinGroup.emit({ groupName: value });
    }

    // clear the input value
    event.chipInput!.clear();
  }

  remove(group): void {
    const index = this.groups.findIndex(
      (value: Group) => value.groupName === group.groupName
    );

    if (index >= 0) {
      this.leaveGroup.emit({ groupName: this.groups[index]['groupName'] });
    }
  }
}
