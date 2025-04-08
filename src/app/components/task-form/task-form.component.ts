import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  isEditMode = false;
  taskId: number | null = null;
  pageTitle = 'Add New Task';
  
  priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  categories = [
    'Work',
    'Personal',
    'Study',
    'Health',
    'Finance',
    'Home',
    'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.taskId = +params['id'];
        this.pageTitle = 'Edit Task';
        this.loadTaskData(this.taskId);
      }
    });
  }

  initForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      dueDate: [new Date(), Validators.required],
      priority: ['medium', Validators.required],
      category: [''],
      completed: [false]
    });
  }

  loadTaskData(id: number): void {
    this.taskService.getTaskById(id).subscribe(task => {
      if (task) {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          dueDate: new Date(task.dueDate),
          priority: task.priority,
          category: task.category || '',
          completed: task.completed
        });
      } else {
        this.snackBar.open('Task not found', 'Close', { duration: 3000 });
        this.router.navigate(['/tasks']);
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.markFormGroupTouched(this.taskForm);
      return;
    }

    const formData = this.taskForm.value;
    
    if (this.isEditMode && this.taskId) {
      const updatedTask: Task = {
        ...formData,
        id: this.taskId
      };
      this.taskService.updateTask(updatedTask);
      this.snackBar.open('Task updated successfully', 'Close', { duration: 2000 });
    } else {
      this.taskService.addTask(formData);
      this.snackBar.open('Task added successfully', 'Close', { duration: 2000 });
    }
    
    this.router.navigate(['/tasks']);
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  resetForm(): void {
    this.taskForm.reset({
      priority: 'medium',
      completed: false,
      dueDate: new Date()
    });
  }

  // Date validation helper method
  isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }
}
