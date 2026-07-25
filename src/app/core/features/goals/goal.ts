import { Component, inject } from '@angular/core';
import { GoalsService } from './goal.service';

@Component({
  selector: 'app-goal',
  imports: [],
  templateUrl: './goal.html',
  styleUrl: './goal.css',
})
export class Goal {
  private goalService = inject(GoalsService);
}
