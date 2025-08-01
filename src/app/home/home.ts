import {
  Component,
  computed,
  effect,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DateTime } from 'luxon';
import { Announcements } from '../interface/announcements';
import { Employee } from '../interface/employee';
import { Datav2 } from '../data/data.v2';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  data = inject(Datav2);
  announcements = signal(this.data.announcements);

  employee = new FormControl('');

  newDate: string = '';
  newTitle = '';
  newMessage = '';
  newCategory = '';
  isPinned = false;
  reminder = 0;

  showNewForm = false;
  selectedCategory = '';
  searchTerm = '';
  showSelect = false;

  today = Date();

  announceForm = new FormGroup({
    title: new FormControl(''),
    employee: new FormControl(''),
    message: new FormControl(''),
    date: new FormControl(new Date()),
    reminder: new FormControl(0),
    pinned: new FormControl(false),
  });

  employees = signal(this.data.employees);
constructor() {
  this.announceForm.get('employee')?.valueChanges.subscribe((value) => {
    this.employees.set(this.data.employees);
    if (value == '') return
    this.employees.set(this.employees().filter((e)=> e.nickname.toLowerCase().includes(value == null ? '' : value.toLowerCase())))
  })
}

  showFocus() {
    this.showSelect = true;
  }

  hideFocus() {
    this.showSelect = false;
  }

  get filteredAnnouncements(): Announcements[] {
    const todayDate = DateTime.now().toISODate();

    return this.announcements()
      .filter(
        (a) =>
          a.date === todayDate &&
          (!this.selectedCategory || a.receiver === this.selectedCategory) &&
          (!this.searchTerm ||
            a.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            a.message.toLowerCase().includes(this.searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }

  addAnnouncement() {
    if (
      !this.newTitle ||
      !this.newMessage ||
      !this.newCategory ||
      !this.newDate
    )
      return;

    const newAnn = {
      title: this.newTitle,
      message: this.newMessage,
      receiver: this.newCategory,
      pinned: this.isPinned,
      date: this.newDate,
      reminder: this.reminder,
    };

    this.announcements().unshift(newAnn);
    this.newTitle = '';
    this.newMessage = '';
    this.newCategory = '';
    this.newDate = '';
    this.isPinned = false;
    this.showNewForm = false;
    this.reminder = 0;
  }

  imageInPreview: string | ArrayBuffer | null = null;

  onImageInSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.imageInPreview = reader.result);
      reader.readAsDataURL(file);
    }
  }

  imageOutPreview: string | ArrayBuffer | null = null;

  onImageOutSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.imageOutPreview = reader.result);
      reader.readAsDataURL(file);
    }
  }
}
