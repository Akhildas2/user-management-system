import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebbarComponent } from './sidebbar.component';

describe('SidebbarComponent', () => {
  let component: SidebbarComponent;
  let fixture: ComponentFixture<SidebbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
