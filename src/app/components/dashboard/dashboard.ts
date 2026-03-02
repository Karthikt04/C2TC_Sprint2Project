import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApi } from '../../services/admin-api';
import { Router } from '@angular/router';
import { Shop } from '../../models/shop';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  employees: Employee[] = [];
  shops: Shop[] = [];

  showEmployeeForm = false;
  isEditMode = false;
  currentEmployee: Employee = { name: '', designation: '', salary: 0 };
  shopIdTemp?: number;


  constructor(private api: AdminApi, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (!localStorage.getItem('loggedIn')) {
      this.router.navigate(['/']);
      return;
    }
    this.loadData();
  }

  loadData(): void {
   
    this.api.getEmployees().subscribe({
      next: (data) => {
        console.log('Employees raw data from server:', data);
        this.employees = data;
        console.log('this.employees after assignment:', this.employees);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Employees fetch failed:', err);
        this.handleError(err);
      }
    });


    this.api.getShops().subscribe({
      next: (data) => {
        console.log('Shops raw data from server:', data);

        this.shops = data.map((item: any) => ({
          id: item.id,
          shopName: item.shop_name || item.shopName,
          category: item.category,
          floorNumber: item.floor_number || item.floorNumber,
          ownerName: item.owner_name || item.ownerName,
          status: item.status
        }));
        console.log('this.shops after mapping:', this.shops);


        this.shops.sort((a, b) => a.floorNumber - b.floorNumber);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Shops fetch failed:', err);
        this.handleError(err);
      }
    });
  }

  handleError(err: any): void {
    if (err.status === 401) {
      localStorage.removeItem('loggedIn');
      this.router.navigate(['/']);
    }
  }

  approve(id: number): void {
    this.api.approveShop(id).subscribe(() => this.loadData());
  }

  reject(id: number): void {
    this.api.rejectShop(id).subscribe(() => this.loadData());
  }

  logout(): void {
    this.api.logout().subscribe();
    localStorage.removeItem('loggedIn');
    this.router.navigate(['/']);
  }

  openAddForm() {
    this.isEditMode = false;
    this.currentEmployee = { name: '', designation: '', salary: 0 };
    this.shopIdTemp = undefined;
    this.showEmployeeForm = true;
    setTimeout(() => document.getElementById('name')?.focus(), 100);
  }

  openEditForm(emp: Employee) {
    this.isEditMode = true;
    this.currentEmployee = { ...emp };
    this.shopIdTemp = emp.shop?.id;
    this.showEmployeeForm = true;
    setTimeout(() => document.getElementById('name')?.focus(), 100);
  }

  cancelForm() {
    this.showEmployeeForm = false;
    this.currentEmployee = { name: '', designation: '', salary: 0 };
    this.shopIdTemp = undefined;
  }

  saveEmployee() {
    const payload: any = {
      name: this.currentEmployee.name,
      designation: this.currentEmployee.designation,
      salary: this.currentEmployee.salary
    };

    if (this.shopIdTemp) {
      payload.shop = { id: this.shopIdTemp };
    }

    if (this.isEditMode && this.currentEmployee.id) {
      this.api.updateEmployee(this.currentEmployee.id, payload).subscribe({
        next: () => {
          this.loadData();
          this.cancelForm();
        },
        error: (err) => console.error('Update failed', err)
      });
    } else {
      this.api.addEmployee(payload).subscribe({
        next: () => {
          this.loadData();
          this.cancelForm();
        },
        error: (err) => console.error('Add failed', err)
      });
    }
  }

  deleteEmployee(id?: number) {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this employee?')) return;

    this.api.deleteEmployee(id).subscribe({
      next: () => this.loadData(),
      error: (err) => console.error('Delete failed', err)
    });
  }

}