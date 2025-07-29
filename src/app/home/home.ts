import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DateTime } from 'luxon';

interface Announcement {
  title: string;
  message: string;
  date: string;
  category: string;
  pinned: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  announcements: Announcement[] = [
    {
      title: 'System Update',
      message: 'Scheduled maintenance at 10 PM. The system will be unavailable for about 2 hours. Please save your work and log off before that time to avoid any data loss.',
      date: '2025-07-29',
      category: 'Update',
      pinned: false
    },
    {
      title: 'New Feature',
      message: 'Task pinning is now available. You can pin important announcements so they appear at the top.',
      date: '2025-07-29',
      category: 'General',
      pinned: true
    },
    {
      title: 'New Feature',
      message: 'Task pinning is now available. You can pin important announcements so they appear at the top.',
      date: '2025-07-30',
      category: 'General',
      pinned: true
    }
  ];

  newDate: string = '';
  showNewForm = false;
  newTitle = '';
  newMessage = '';
  newCategory = '';
  isPinned = false;
  searchTerm = '';
  selectedCategory = '';

  get today(): string {
    return DateTime.now().toFormat('MMMM dd, yyyy');
  }

  get filteredAnnouncements(): Announcement[] {
    const todayDate = DateTime.now().toISODate();

    return this.announcements
      .filter(a =>
        a.date === todayDate &&
        (!this.selectedCategory || a.category === this.selectedCategory) &&
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
  if (!this.newTitle || !this.newMessage || !this.newCategory || !this.newDate) return;

  const newAnn = {
    title: this.newTitle,
    message: this.newMessage,
    category: this.newCategory,
    pinned: this.isPinned,
    date: this.newDate
  };

  this.announcements.unshift(newAnn);
  this.newTitle = '';
  this.newMessage = '';
  this.newCategory = '';
  this.newDate = '';
  this.isPinned = false;
  this.showNewForm = false;
  }

}
