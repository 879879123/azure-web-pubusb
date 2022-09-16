import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { ConnectionBarComponent } from './components/connection-bar/connection-bar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GroupBarComponent } from './components/group-bar/group-bar.component';
import { PublishMessageBarComponent } from './components/publish-message-bar/publish-message-bar.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMenuModule } from '@angular/material/menu';
import { MessageListComponent } from './components/message-list/message-list.component';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    WebviewDirective,
    ConnectionBarComponent,
    GroupBarComponent,
    PublishMessageBarComponent,
    MessageListComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatCardModule,
    FlexLayoutModule,
    MatMenuModule,
  ],
  exports: [
    TranslateModule,
    WebviewDirective,
    FormsModule,
    ConnectionBarComponent,
    GroupBarComponent,
    PublishMessageBarComponent,
    MessageListComponent,
  ],
})
export class SharedModule {}
