import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CaloriesPage } from './calories.page';

describe('CaloriesPage', () => {
  let component: CaloriesPage;
  let fixture: ComponentFixture<CaloriesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaloriesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CaloriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
