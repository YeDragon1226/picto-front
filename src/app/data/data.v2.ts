import { Injectable } from '@angular/core';
import { Meetings } from '../calendar/meetings.interface';
import { Announcements } from '../interface/announcements';
import { Employee } from '../interface/employee';

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
      receiver: 'Update',
      pinned: false,
      reminder: 0,
    },
    {
      title: 'New Feature',
      message:
        'Task pinning is now available. You can pin important announcements so they appear at the top.',
      date: '2025-07-31',
      receiver: 'General',
      pinned: true,
      reminder: 0,
    },
    {
      title: 'New Feature',
      message:
        'Task pinning is now available. You can pin important announcements so they appear at the top.',
      date: '2025-08-01',
      receiver: 'General',
      pinned: true,
      reminder: 0,
    },
    {
      title: 'New Feature',
      message:
        'Task pinning is now available. You can pin important announcements so they appear at the top.',
      date: '2025-08-01',
      receiver: 'General',
      pinned: true,
      reminder: 0,
    },
    {
      title: 'New Feature',
      message:
        'Task pinning is now available. You can pin important announcements so they appear at the top.',
      date: '2025-08-02',
      receiver: 'General',
      pinned: true,
      reminder: 0,
    },
    {
      title: 'New Feature',
      message:
        'Task pinning is now available. You can pin important announcements so they appear at the top.',
      date: '2025-08-02',
      receiver: 'General',
      pinned: true,
      reminder: 0,
    },
    {
      title: 'New Feature',
      message:
        'Task pinning is now available. You can pin important announcements so they appear at the top.',
      date: '2025-08-02',
      receiver: 'General',
      pinned: true,
      reminder: 0,
    },
    {
      title: 'New Feature',
      message:
        'Task pinning is now available. You can pin important announcements so they appear at the top.',
      date: '2025-08-02',
      receiver: 'General',
      pinned: true,
      reminder: 0,
    },
  ];

  employees: Employee[] = [
    {
      name: 'Leney C. Laygo',
      role: 'OFFICER',
      nickname: 'Leney',
    },
    {
      name: 'Aline I. Babista',
      role: 'Operator',
      nickname: 'Aline',
    },
    {
      name: 'Dennis B. Bordarais',
      role: 'Aide',
      nickname: 'Dennis',
    },
    {
      name: 'Dionisio M. Ayapana',
      role: 'Aide',
      nickname: 'Dio',
    },
    {
      name: 'Randel R. Borbon',
      role: 'DevOps Engineer',
      nickname: 'Mike',
    },
  ];
}
