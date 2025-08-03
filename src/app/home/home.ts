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
import { endWith } from 'rxjs';

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

  showNewForm = false;
  selectedCategory = '';
  searchTerm = '';
  showSelect = false;
  showReminderForm = false;

  today = Date();

  announceForm = new FormGroup({
    title: new FormControl(''),
    employee: new FormControl(''),
    message: new FormControl(''),
    date: new FormControl(''),
    reminder: new FormControl<number | null>(0),
    pinned: new FormControl(false),
  });

   reminderForm = new FormGroup({
    reminder: new FormControl<number | null>(0),
  });




  added_employees: String[] = [];

  employees = signal(this.data.employees);
  constructor() {
    this.announceForm.get('employee')?.valueChanges.subscribe((value) => {
      this.employees.set(this.data.employees);
      const iterator = this.added_employees.values();

      for (const iterate of iterator) {
        if (iterate == 'everyone') {
          continue;
        }

        this.employees.set(
          this.employees().filter(
            (e) =>
              !e.nickname
                .toLowerCase()
                .includes(iterate == null ? '' : iterate.toLowerCase())
          )
        );
      }
      if (value == '') return;
      this.employees.set(
        this.employees().filter((e) =>
          e.nickname
            .toLowerCase()
            .includes(value == null ? '' : value.toLowerCase())
        )
      );
    });
  }

  onMemberClick(event: String) {
    this.added_employees.push(event);
    this.announceForm.get('employee')?.setValue('');
  }

  onAddedMemberClick(event: String) {
    this.added_employees.splice(this.added_employees.indexOf(event), 1);
    this.announceForm.get('employee')?.setValue('');
  }

  onEveryoneClick() {
    this.added_employees = ['everyone'];
    this.announceForm.get('employee')?.setValue('');
  }

  onError(form: String) {
    this.announceForm.get('reminder')?.setValue(0);
  }

  get filteredAnnouncements(): Announcements[] {
    const todayDate = DateTime.now().toISODate();

    return this.announcements()
      .filter(
        (a) =>
          a.date === todayDate &&
          (!this.searchTerm ||
            a.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            a.message.toLowerCase().includes(this.searchTerm.toLowerCase())||
          a.date.toLowerCase().includes(this.searchTerm.toLowerCase())
          )
      )
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }

  get filteredReminders(): Announcements[] {
    const todayDate = DateTime.now();

    return this.announcements()
      .filter(
        (a) =>
          a.date === todayDate.plus({ days: a.reminder }).toISODate() &&
          (!this.searchTerm ||
            a.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            a.message.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          a.date.toLowerCase().includes(this.searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }

  computedReminder(event: string, index: number) {
    const date = DateTime.fromISO(event);
    return date.minus({ days: this.announcements()[index].reminder }).toISODate();
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

  makeReminderNumber() {

    let num = 0

    if (this.reminderForm.get('reminder')?.value == null) {
      num = 0
    } else {
      num = this.reminderForm.get('reminder')?.value as number
    }
    return num
  }

  saveReminder(a: Announcements, $index: number) {
    a.reminder = this.makeReminderNumber()
    this.reminderForm.get('reminder')?.setValue(0);

    this.data.updateAnnouncement(a, $index);
    this.announcements.set(this.data.announcements);
  }

  onSubmit() {
    this.announceForm.get('employee')?.setValue(this.added_employees.join(', '));
    this.data.addAnnouncement(this.announceForm);
    this.showSelect = false;
    this.employees.set(this.data.employees);
    this.announceForm.reset();
    this.added_employees = [];
    this.showNewForm = false;
    this.announcements.set(this.data.announcements);
  }

  sanitizeReceiver(receiver: string): string {
    return receiver.toLowerCase().replace(/\s+/g, '-');
  }

}
