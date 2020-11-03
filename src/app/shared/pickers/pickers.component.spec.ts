import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PickersComponent } from './pickers.component';

describe('PickersComponent', () => {
  let component: PickersComponent;
  let fixture: ComponentFixture<PickersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickersComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PickersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
