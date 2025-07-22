import {
  Component,
  Inject,
  PLATFORM_ID,
  OnInit,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Data } from '../data/data';

interface Task {
  date: string;
  text: string;
  department?: string;
  status?: string;
  done: boolean;
}

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './review.html',
  styleUrls: ['./review.css'],
})
export class Review implements OnInit {
  searchTerm = '';
  newCategory = '';
  showNewForm = false;
  allTasks: Task[] = [];

  newTask: Task = {
    date: '',
    text: '',
    department: '',
    status: 'Pending',
    done: false,
  };

  private data: Data;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.data = new Data();
    if (this.isBrowser) {
      this.loadTasks();
    }
  }

  ngOnInit(): void {}

  loadTasks(): void {
    const meetings = this.data.defaultMeetings;

    this.allTasks = [];

    for (const [date, texts] of Object.entries(meetings)) {
      if (Array.isArray(texts)) {
        for (const text of texts) {
          const done = this.data.isCompleted(date, text);
          this.allTasks.push({
            date,
            text,
            department: 'General',
            status: done ? 'Completed' : 'Pending',
            done,
          });
        }
      }
    }
  }

  get filteredTasks(): Task[] {
    const term = this.searchTerm.toLowerCase();
    const category = this.newCategory;

    return this.allTasks.filter((task) => {
      const matchesSearch =
        task.text.toLowerCase().includes(term) ||
        task.department?.toLowerCase().includes(term) ||
        task.status?.toLowerCase().includes(term) ||
        task.date.includes(term);

      const matchesCategory = category ? task.status === category : true;

      return matchesSearch && matchesCategory;
    });
  }

  addNewTask(): void {
    const { date, text, department, status } = this.newTask;
    if (date.trim() && text.trim() && department?.trim() && status?.trim()) {
      this.allTasks.unshift({ ...this.newTask });
      this.resetNewTask();
      this.showNewForm = false;
    }
  }

  autoSave(): void {
    console.log('Auto-saved:', this.allTasks);
  }

  private resetNewTask(): void {
    this.newTask = {
      date: '',
      text: '',
      department: '',
      status: 'Pending',
      done: false,
    };
  }
}
