import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-connection-bar',
  templateUrl: './connection-bar.component.html',
  styleUrls: ['./connection-bar.component.scss'],
})
export class ConnectionBarComponent implements OnInit {
  @Input() isConnected: boolean = false;
  @Output() connectionData = new EventEmitter<any>();
  @Output() isDisconnect = new EventEmitter<any>();
  form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      connectionString: ['', Validators.required],
      hubname: ['arcs', Validators.required],
    });
  }

  ngOnInit(): void {

  }


  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const { connectionString, hubname } = this.form.getRawValue();
    this.connectionData.emit({ connectionString, hubname });
  }

  onDisconnect() {
    this.isDisconnect.emit(true);
  }
}
