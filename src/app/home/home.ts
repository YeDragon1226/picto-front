import {
  Component,
  inject,
  Renderer2,
  signal,
} from '@angular/core';
import { CommonModule} from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DateTime } from 'luxon';
import { Announcements } from '../interface/announcements';
import { Datav2 } from '../data/data.v2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  data = inject(Datav2);
  renderer = inject(Renderer2);

  announcements = signal(this.data.announcements);
    private subscriptions = new Subscription();

  showNewForm = false;
  selectedCategory = '';
  searchTerm = '';
  showSelect = false;
  showReminderForm = false;
  showIncomingForm = false;
  showOutgoingForm = false;

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

  reminderFilterForm = new FormGroup({
    search: new FormControl<string | null>(''),
    filter: new FormControl<string | null>('All'),
  });

  incomingForm = new FormGroup({
    control: new FormControl('123-256-789'),
    type: new FormControl(''),
    ref: new FormControl(''),
    from: new FormControl(''),
    title: new FormControl(''),
    recipient: new FormControl(''),
    status: new FormControl(''),
    folder: new FormControl(''),
  });

  outgoingForm = new FormGroup({
    control: new FormControl('987-654-321'),
    title: new FormControl(''),
    recipient: new FormControl(''),
    status: new FormControl(''),
    folder: new FormControl(''),
  });

  added_employees: String[] = [];

  employees = signal(this.data.employees);
  reminders = signal(this.data.announcements);

  constructor() {
    const sub1 = this.announceForm.get('employee')?.valueChanges.subscribe((value) => {
      this.employees.set(this.data.employees);
      const iterator = this.added_employees.values();

      for (const iterate of iterator) {
        if (iterate == 'Everyone') {
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

    const sub2 = this.reminderFilterForm.valueChanges.subscribe((value) => {
      this.reminders.set(this.data.announcements);
      if (value.filter == 'All' && value.search == '') return;
      if (value.filter != 'All') {
        this.reminders.set(
          this.reminders().filter((e) =>
            e.receiver
              .toLowerCase()
              .includes(value.filter == null ? '' : value.filter.toLowerCase())
          )
        );
      }
      if (value.search == '') return;
      this.reminders.set(
        this.reminders().filter(
          (e) =>
            e.title
              .toLowerCase()
              .includes(
                value.search == null ? '' : value.search.toLowerCase()
              ) ||
            e.message
              .toLowerCase()
              .includes(
                value.search == null ? '' : value.search.toLowerCase()
              ) ||
            e.date
              .toLowerCase()
              .includes(
                value.search == null ? '' : value.search.toLowerCase()
              ) ||
            e.receiver
              .toLowerCase()
              .includes(value.search == null ? '' : value.search.toLowerCase())
        )
      );
    });

    this.subscriptions.add(sub1);
    this.subscriptions.add(sub2);
  }

  employeesv2: String[] = this.data.employees.map((x) => x.nickname);

  onMemberClick(event: String) {
    this.added_employees.push(event);
    this.announceForm.get('employee')?.setValue('');
  }

  onAddedMemberClick(event: String) {
    this.added_employees.splice(this.added_employees.indexOf(event), 1);
    this.announceForm.get('employee')?.setValue('');
  }

  onEveryoneClick() {
    this.added_employees = ['Everyone'];
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
            a.message.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            a.date.toLowerCase().includes(this.searchTerm.toLowerCase()))
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
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
  }

  computedReminder(event: string, index: number) {
    const date = DateTime.fromISO(event);
    return date
      .minus({ days: this.announcements()[index].reminder })
      .toISODate();
  }

  onInputFocus() {
    this.showSelect = true;
  }

  makeReminderNumber() {
    let num = 0;

    if (this.reminderForm.get('reminder')?.value == null) {
      num = 0;
    } else {
      num = this.reminderForm.get('reminder')?.value as number;
    }
    return num;
  }

  saveReminder(a: Announcements, $index: number) {
    a.reminder = this.makeReminderNumber();
    this.reminderForm.get('reminder')?.setValue(0);

    this.data.updateAnnouncement(a, $index);
    this.announcements.set(this.data.announcements);
  }

  onSubmit() {
    this.announceForm
      .get('employee')
      ?.setValue(this.added_employees.join(', '));
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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }
}
