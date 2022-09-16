import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishMessageBarComponent } from './publish-message-bar.component';

describe('PublishMessageBarComponent', () => {
  let component: PublishMessageBarComponent;
  let fixture: ComponentFixture<PublishMessageBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublishMessageBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublishMessageBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
