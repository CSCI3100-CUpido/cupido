import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfessionBoardComponent } from './confession-board.component';

describe('ConfessionBoardComponent', () => {
  let component: ConfessionBoardComponent;
  let fixture: ComponentFixture<ConfessionBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfessionBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfessionBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
