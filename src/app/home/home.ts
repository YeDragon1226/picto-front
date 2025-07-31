import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, } from '@angular/forms';
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

  data = inject(Datav2)
  announcements = signal(this.data.announcements)
  employees = signal(this.data.employees)

  employee = new FormControl('')

  newDate: string = '';
  newTitle = '';
  newMessage = '';
  newCategory = '';
  isPinned = false;
  reminder = 0

  showNewForm = false;
  selectedCategory = '';
  searchTerm = '';
  showSelect = false;

  today = Date()

  autocomplete = new FormControl('');


  constructor() {

  }

  showFocus() {
    console.log('showFocus')
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

}
