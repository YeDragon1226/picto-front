import { Injectable } from '@angular/core';
import { Meetings } from '../calendar/meetings.interface';
import { Announcements } from '../interface/announcements';
import { Employee } from '../interface/employee';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class Datav2 {
  announcements: Announcements[] = [
    {
      title: 'System Update',
      message:
        'Scheduled maintenance at 10 PM. The system will be unavailable for about 2 hours. Please save your work and log off before that time to avoid any data loss.',
      date: '2025-07-31',
      receiver: 'Everyone',
      pinned: false,
      reminder: 1,
    },
    {
      title: 'New2 Feature',
      message:
        'Task pinning is now available. You can pin important announcements so they appear at the top.',
      date: '2025-07-31',
      receiver: 'Everyone',
      pinned: true,
      reminder: 2,
    },
    {
      title: 'New Feature',
      message:
        'Task pinning is now available. You can pin important announcements so they appear at the top.',
      date: '2025-08-01',
      receiver: 'Everyone',
      pinned: true,
      reminder: 3,
    },
    {
      title: 'New Feature',
      message:
        'Task pinning is now available. You can pin important announcements so they appear at the top.',
      date: '2025-08-01',
      receiver: 'Everyone',
      pinned: false,
      reminder: 2,
    },
    {
      title: 'New Feature',
      message:
        'Task pinning is now available. You can pin important announcements so they appear at the top.',
      date: '2025-08-02',
      receiver: 'Everyone',
      pinned: true,
      reminder: 1,
    },
    {
      title: 'New Feature',
      message:
        'Task pinning is now available. You can pin important announcements so they appear at the top.',
      date: '2025-08-02',
      receiver: 'Everyone',
      pinned: true,
      reminder: 0,
    },
    {
      title: 'New Feature',
      message:
        'Task pinning is now available. You can pin important announcements so they appear at the top.',
      date: '2025-08-02',
      receiver: 'Everyone',
      pinned: true,
      reminder: 1,
    },
    {
      title: 'New Feature',
      message:
        'Task pinning is now available. You can pin important announcements so they appear at the top.',
      date: '2025-08-02',
      receiver: 'Everyone',
      pinned: true,
      reminder: 2,
    },
  ];

  employees: Employee[] = [
    {
      name: 'Employee 1',
      role: 'OFFICER',
      nickname: 'User 1',
    },
    {
      name: 'Employee 2',
      role: 'Operator',
      nickname: 'User 2',
    },
    {
      name: 'Employee 3',
      role: 'Aide',
      nickname: 'User 3',
    },
    {
      name: 'Employee 4',
      role: 'Aide',
      nickname: 'User 4',
    },
    {
      name: 'Employee 5',
      role: 'DevOps Engineer',
      nickname: 'User 5',
    },
  ];

  addAnnouncement(announcement: FormGroup) {
    this.announcements.push({
      title: announcement.get('title')?.value,
      message: announcement.get('message')?.value,
      date: announcement.get('date')?.value,
      receiver: announcement.get('employee')?.value,
      pinned: announcement.get('pinned')?.value,
      reminder: announcement.get('reminder')?.value,
    });
    console.log(this.announcements);
  }
}
