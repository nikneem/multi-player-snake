import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Playfield } from './playfield';

describe('Playfield', () => {
  let component: Playfield;
  let fixture: ComponentFixture<Playfield>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Playfield],
    }).compileComponents();

    fixture = TestBed.createComponent(Playfield);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
