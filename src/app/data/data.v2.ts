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
    title: 'Passing of IPCR',
    message:
      'All employees of the Picto Office are reminded to submit their Individual Performance Commitment and Review (IPCR) forms before the deadline. Late submissions will not be accepted.',
    date: '2025-08-04',
    receiver: 'Everyone',
    pinned: true,
    reminder: 2,
  },
  {
    title: 'IDP Submission Deadline',
    message:
      'Please ensure your Individual Development Plan (IDP) is completed and submitted to HR by August 20th. Timely submission is required for compliance.',
    date: '2025-08-03',
    receiver: 'Everyone',
    pinned: false,
    reminder: 1,
  },
  {
    title: 'Project Update Required',
    message:
      'User 1, please send the weekly progress report for the Outreach Program before 3:00 PM today.',
    date: '2025-08-03',
    receiver: 'User 1',
    pinned: true,
    reminder: 2,
  },
  {
    title: 'Inventory Sheet Submission',
    message:
      'User 2, kindly update and submit the office supply inventory sheet by Monday morning.',
    date: '2025-08-05',
    receiver: 'User 2',
    pinned: false,
    reminder: 2,
  },
  {
    title: 'Leave Request Follow-up',
    message:
      'User 3, please confirm the dates of your approved leave and update the shared calendar accordingly.',
    date: '2025-08-03',
    receiver: 'User 3',
    pinned: false,
    reminder: 4,
  },
  {
    title: 'Design Draft Review',
    message:
      'User 4, the first draft of the new layout design must be ready for review by Friday afternoon.',
    date: '2025-08-09',
    receiver: 'User 4',
    pinned: true,
    reminder: 5,
  },
  {
    title: 'System Account Audit',
    message:
      'User 5, please verify all active accounts under your supervision and send the confirmation by August 15.',
    date: '2025-08-15',
    receiver: 'User 5',
    pinned: false,
    reminder: 11,
  },
  {
    title: 'Office Meeting Schedule',
    message:
      'There will be a mandatory Picto Office meeting on September 2nd at 10:00 AM. Attendance is required for all employees.',
    date: '2025-09-02',
    receiver: 'Everyone',
    pinned: true,
    reminder: 1,
  },
  {
    title: 'Training Session on New Policies',
    message:
      'A training session regarding the new office policies will be held on September 10th. All Picto Office employees must attend.',
    date: '2025-09-10',
    receiver: 'Everyone',
    pinned: false,
    reminder: 2,
  },
  {
    title: 'System Maintenance Notification',
    message:
      'Scheduled system maintenance will occur on September 15th. Please save your work and log out before 5:00 PM.',
    date: '2025-09-15',
    receiver: 'Everyone',
    pinned: false,
    reminder: 1,
  }
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

  updateAnnouncement(a: Announcements, $index: number) {
    this.announcements[$index] = a;
  }
}
