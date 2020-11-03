import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyRecepiesPage } from './my-recepies.page';

describe('MyRecepiesPage', () => {
  let component: MyRecepiesPage;
  let fixture: ComponentFixture<MyRecepiesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyRecepiesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyRecepiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
