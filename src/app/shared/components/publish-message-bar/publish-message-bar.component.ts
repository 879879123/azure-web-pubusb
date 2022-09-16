import { Output } from '@angular/core';
import { Input } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { OnChanges } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Group } from '../../../home/home.component';
import * as _ from 'lodash';
import { ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-publish-message-bar',
  templateUrl: './publish-message-bar.component.html',
  styleUrls: ['./publish-message-bar.component.scss'],
})
export class PublishMessageBarComponent implements OnInit, OnChanges {
  @ViewChild('groupInput') groupInput: ElementRef<HTMLInputElement>;
  @Input() groups: Group[];
  @Input() isConnected: boolean;
  @Output() publishMessage = new EventEmitter<any>();
  form: FormGroup;
  selected: FormArray;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      message: ['', Validators.required],
      selected: new FormArray([]),
    });
  }

  ngOnInit(): void {}

  ngOnChanges() {
    this.selected = this.form.get('selected') as FormArray;
    if (this.selected.length) {
      this.selected.clear();
    }

    // for (let i = 0; i <= this.groups.length; i++) {
    //   if (this.groups[i]?.status) {
    //     this.selected.push(
    //       new FormGroup({
    //         ackId: new FormControl(this.groups[i].ackId),
    //         groupName: new FormControl(this.groups[i].groupName),
    //         status: new FormControl(this.groups[i].status),
    //       })
    //     );
    //   }
    // }
   
    console.table(this.form.getRawValue());
  }

  onSubmit(form) {
    const { message, selected } = form.getRawValue();
    if (message && selected.length > 0) {
      this.publishMessage.emit({ message, selected });
      this.form.get('message').reset();
    }
  }

  remove(group): void {
    const index = (this.form.get('selected') as FormArray)
      .getRawValue()
      .findIndex((value: Group) => value.groupName === group.groupName);
    console.log(index);
    if (index >= 0) {
      (this.form.get('selected') as FormArray).removeAt(index);
    }
  }

  selectedGroup(event: MatAutocompleteSelectedEvent) {
    if (event.option.viewValue) {
      const data = _.find(this.groups, { groupName: event.option.viewValue });
      const duplicate = (this.form.get('selected') as FormArray)
        .getRawValue()
        .findIndex(
          (value: Group) => value.groupName === event.option.viewValue
        );
      if (data && duplicate <= -1) {
        (this.form.get('selected') as FormArray).push(
          new FormGroup({
            ackId: new FormControl(data.ackId),
            groupName: new FormControl(data.groupName),
            status: new FormControl(data.status),
          })
        );
        this.groupInput.nativeElement.value = '';
      } else {
        this.groupInput.nativeElement.value = '';
      }
    }
  }
}
