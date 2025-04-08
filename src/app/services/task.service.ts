import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [
    {
      id: 1,
      title: 'Complete project documentation',
      description: 'Finish writing the technical documentation for the Major Project',
      dueDate: new Date('2025-04-15'),
      priority: 'high',
      completed: false,
      category: 'Work'
    },
    {
      id: 2,
      title: 'Buy groceries',
      description: 'Get milk, eggs, bread, and vegetables',
      dueDate: new Date('2025-04-08'),
      priority: 'medium',
      completed: false,
      category: 'Personal'
    },
    {
      id: 3, 
      title: 'Schedule team meeting',
      description: 'schedule the meeting ,by today evening',
      dueDate: new Date('2025-04-10'),
      priority: 'medium',
      completed: true,
      category: 'Work'
    }
  ];

  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks);
  
  constructor() {}

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  getTaskById(id: number): Observable<Task | undefined> {
    const task = this.tasks.find(t => t.id === id);
    return of(task);
  }

  addTask(task: Omit<Task, 'id'>): void {
    const newId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1;
    const newTask = { ...task, id: newId };
    this.tasks = [...this.tasks, newTask];
    this.tasksSubject.next(this.tasks);
  }

  updateTask(updatedTask: Task): void {
    this.tasks = this.tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    this.tasksSubject.next(this.tasks);
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.tasksSubject.next(this.tasks);
  }

  toggleTaskCompletion(id: number): void {
    this.tasks = this.tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    this.tasksSubject.next(this.tasks);
  }

  getTasksByCategory(): { category: string, count: number }[]{
    const categories = this.tasks.reduce((acc, task) => {
      const category = task.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories).map(([category, count]) => ({ category, count }));
  }

  getTasksByPriority(): { priority: string, count: number }[] {
    const priorities = this.tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(priorities).map(([priority, count]) => ({ priority, count }));
  }

  getCompletionStats(): { completed: number, pending: number } {
    const completed = this.tasks.filter(task => task.completed).length;
    return {
      completed,
      pending: this.tasks.length - completed
    };
  }
}
