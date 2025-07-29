import {Component,Signal,WritableSignal,computed,signal,OnInit,} from '@angular/core';
import { Meetings } from './meetings.interface';
import { DateTime, Info, Interval } from 'luxon';
import { CommonModule } from '@angular/common';
import { Data } from '../data/data';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css'],
  imports: [CommonModule],
  standalone: true,
})
export class Calendar implements OnInit {
  data = new Data();

  private cleanMeetings: Meetings = this.data.getCleanMeetings();

  meetings: WritableSignal<Meetings> = signal(this.cleanMeetings);

  private today: WritableSignal<DateTime> = signal(DateTime.local());

  firstDayOfActiveMonth: WritableSignal<DateTime> = signal(
    DateTime.local().startOf('month') );

  activeDay: WritableSignal<DateTime | null> = signal(null);

  weekDays: Signal<string[]> = computed(() => Info.weekdays('short'));

  daysOfMonth: Signal<DateTime[]> = computed(() => {
    const firstDay = this.firstDayOfActiveMonth();
    return Interval.fromDateTimes(
      firstDay.startOf('week'),
      firstDay.endOf('month').endOf('week')
    )
      .splitBy({ day: 1 })
      .map((d) => {
        if (d.start === null) {
          throw new Error('Wrong dates');
        }
        return d.start;
      });
  });

  footer = signal(false);

  DATE_MED = DateTime.DATE_MED;

  activeDayMeetings: Signal<string[]> = computed(() => {
    const activeDay = this.activeDay();
    if (activeDay === null) {
      return [];
    }
    const activeDayISO = activeDay.toISODate();

    if (!activeDayISO) {
      return [];
    }

    const meetings = this.meetings()[activeDayISO] ?? [];
    console.log(`Meetings for ${activeDayISO}:`, meetings);
    return meetings;
  });

  ngOnInit() {
    console.log('Calendar initialized');
    console.log('Available meetings:', this.meetings());
  }

  goToPreviousMonth(): void {
    this.firstDayOfActiveMonth.set(
    this.firstDayOfActiveMonth().minus({ month: 1 })
    );
  }

  goToNextMonth(): void {
    this.firstDayOfActiveMonth.set(
    this.firstDayOfActiveMonth().plus({ month: 1 })
    );
  }

  goToToday(): void {
    const today = DateTime.local();
    this.today.set(today);
    this.firstDayOfActiveMonth.set(today.startOf('month'));
    this.activeDay.set(today);
  }

  onDayClick(day: DateTime): void {
    this.activeDay.set(day);
    this.footer.set(true);
  }

  refreshMeetings(): void {
    this.meetings.set(new Data().getCleanMeetings());
  }

  getMeetingsForDay(day: DateTime): string[] {
  const date = day.toISODate();
  if (!date) return [];

  const allMeetings = this.meetings()[date] || [];
  return allMeetings.filter((text) => !this.data.isCompleted(date, text));
  }

  hasMeetings(day: DateTime): boolean {
  return this.getMeetingsForDay(day).length > 0;
  }

  isHoliday(day: DateTime): boolean {
    const key = day.toFormat('MM-dd');
    return !!this.data.holiday[key];
  }

  getHolidayName(day: DateTime): string | null {
    const key = day.toFormat('MM-dd');
    return this.data.holiday[key]?.[0] || null;
  }
}
