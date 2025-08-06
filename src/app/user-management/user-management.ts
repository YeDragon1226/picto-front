import {
  Component,
  effect,
  inject,
  OnDestroy,
  signal,
  WritableSignal,
} from '@angular/core';
import { Datav2 } from '../data/data.v2';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  styleUrls: ['./user-management.css'],
  standalone: true,
})
export class UserManagement implements OnDestroy {
  data = inject(Datav2);
  constructor() {
    effect(() => {
      if (this.showAddUser() == false) {
        this.editmode.set(false);
        this.employeeForm.reset();
        this.employeeForm.setValue({
          name: '',
          nickname: '',
          role: '',
          id: '',

        });
        this.permissionForm.reset();
        this.permissionForm.setValue({
          user_add: false,
          user_edit: false,
          user_delete: false,
          report_print: false,
          report_view: false,
          report_edit: false,
          reference_add: false,
          reference_edit: false,
          reference_delete: false,
          announcement_add: false,
          announcement_edit: false,
          announcement_delete: false,
        })
        this.formTitle.set('Add User');
      }
    });

    this.subscription.add(
      this.searchForm.valueChanges.subscribe((value) => {
        this.employees.set(this.data.employees);
        if (value.filter == 'All' && value.search == '') return;
        if (value.filter != 'All') {
          this.employees.set(
            this.employees().filter((u) => u.role == value.filter)
          );
        }
        if (value.search == '') return;
        this.employees.set(
          this.employees().filter((u) => {
            return (
              u.name
                .toLowerCase()
                .includes(
                  value.search == null ? '' : value.search.toLowerCase()
                ) ||
              u.nickname
                .toLowerCase()
                .includes(
                  value.search == null ? '' : value.search.toLowerCase()
                ) ||
              u.role
                .toLowerCase()
                .includes(
                  value.search == null ? '' : value.search.toLowerCase()
                )
            );
          })
        );
        console.log(this.employees());
      })
    );
  }
  formTitle = signal('Add User');
  editmode = signal(false);
  showAddUser = signal(false);
  employees = signal(this.data.employees);
  roles = signal(this.data.roles);
  private subscription = new Subscription();

  searchForm = new FormGroup({
    search: new FormControl(''),
    filter: new FormControl('All', {}),
  });

  employeeForm = new FormGroup({
    name: new FormControl('', Validators.required),
    nickname: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    id: new FormControl(''),
  });

  permissionForm = new FormGroup({
    user_add: new FormControl(false),
    user_edit: new FormControl(false),
    user_delete: new FormControl(false),
    report_print: new FormControl(false),
    report_view: new FormControl(false),
    report_edit: new FormControl(false),
    reference_add: new FormControl(false),
    reference_edit: new FormControl(false),
    reference_delete: new FormControl(false),
    announcement_add: new FormControl(false),
    announcement_edit: new FormControl(false),
    announcement_delete: new FormControl(false),
  });

  edit(user: any) {
    alert(`Edit ${user.name}`);
  }

  addEmployee() {
    if (this.editmode()) {
      this.editEmployee();
      return;
    }

    if (this.employeeForm.valid) {
      this.data.addEmployee(this.employeeForm, this.permissionForm);
      this.showAddUser.set(false);
    } else {
      alert('Invalid form, add missing valaues!');
    }
  }

  deleteEmployee(user: any) {
    this.data.deleteEmployee(user);
  }

  showEditForm(user: any) {
    this.formTitle.set('Edit User');
    this.editmode.set(true);
    this.showAddUser.set(true);
    const employee = this.employees().filter((u) => u.id == user);
    this.employeeForm.setValue({
      name: employee[0].name as string,
      nickname: employee[0].nickname as string,
      role: employee[0].role as string,
      id: employee[0].id?.toString() as string
    });

    for (let item in this.permissionForm.controls) {
      if (employee[0].permission?.includes(item)) {
        this.permissionForm.get(item)?.setValue(true);
      }
    }
  }

  onPermissionHeadClick(value: string) {
    let count = 0
    for (let item in this.permissionForm.controls) {
      if (item.toLowerCase().includes(value.toLowerCase())) {
        if (this.permissionForm.get(item)?.value) {
          count += 1
        }

        this.permissionForm.get(item)?.setValue(true);
      }
    }
    if (count == 3) {
    for (let item in this.permissionForm.controls) {
      if (item.toLowerCase().includes(value.toLowerCase())) {
        this.permissionForm.get(item)?.setValue(false);
      }
    }
    }
  }

  editEmployee() {
    if (this.employeeForm.valid) {
      this.data.editEmployee(this.employeeForm, this.permissionForm);
      this.showAddUser.set(false);
    } else {
      alert('Invalid form, add missing valaues!');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();

  }
}
