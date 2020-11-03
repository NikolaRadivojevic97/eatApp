import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecepiesPage } from './recepies.page';

describe('RecepiesPage', () => {
  let component: RecepiesPage;
  let fixture: ComponentFixture<RecepiesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecepiesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecepiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
