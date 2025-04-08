import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  task: Task | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadTask(id);
    });
  }

  loadTask(id: number): void {
    this.taskService.getTaskById(id).subscribe(task => {
      if (task) {
        this.task = task;
      } else {
        this.snackBar.open('Task not found', 'Close', { duration: 3000 });
        this.router.navigate(['/tasks']);
      }
    });
  }

  toggleTaskCompletion(): void {
    if (this.task) {
      this.taskService.toggleTaskCompletion(this.task.id);
      this.task = { ...this.task, completed: !this.task.completed };
      this.snackBar.open('Task status updated', 'Close', { duration: 2000 });
    }
  }

  deleteTask(): void {
    if (this.task) {
      this.taskService.deleteTask(this.task.id);
      this.snackBar.open('Task deleted', 'Close', { duration: 2000 });
      this.router.navigate(['/tasks']);
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'warn';
      case 'medium': return 'accent';
      case 'low': return 'primary';
      default: return '';
    }
  }
}
