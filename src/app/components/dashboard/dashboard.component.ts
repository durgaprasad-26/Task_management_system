import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  completionStats: { completed: number, pending: number } = { completed: 0, pending: 0 };
  categoryStats: { category: string, count: number }[] = [];
  priorityStats: { priority: string, count: number }[] = [];
  upcomingTasks: Task[] = [];

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.completionStats = this.taskService.getCompletionStats();
      this.categoryStats = this.taskService.getTasksByCategory();
      this.priorityStats = this.taskService.getTasksByPriority();
      this.upcomingTasks = this.getUpcomingTasks();
    });
  }

  getUpcomingTasks(): Task[] {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    return this.tasks
      .filter(task => !task.completed && new Date(task.dueDate) <= nextWeek)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'warn';
      case 'medium': return 'accent';
      case 'low': return 'primary';
      default: return '';
    }
  }

  getCompletionPercentage(): number {
    if (this.tasks.length === 0) return 0;
    return Math.round((this.completionStats.completed / this.tasks.length) * 100);
  }
}
