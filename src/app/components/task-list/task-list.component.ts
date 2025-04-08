import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  displayedColumns: string[] = ['completed', 'title', 'dueDate', 'priority', 'category', 'actions'];
  dataSource = new MatTableDataSource<Task>([]);
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.dataSource.data = tasks;
    });
  }

  ngAfterViewInit(){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleTaskCompletion(id: number) {
    this.taskService.toggleTaskCompletion(id);
    this.snackBar.open('Task status updated', 'Close', {
      duration: 2000,
    });
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id);
    this.snackBar.open('Task deleted', 'Close', {
      duration: 2000,
    });
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }
}