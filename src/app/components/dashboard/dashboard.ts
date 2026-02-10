import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApi } from '../../services/admin-api';
import { Router } from '@angular/router';
import { Shop } from '../../models/shop';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  employees: Employee[] = [];
  shops: Shop[] = [];

  constructor(private api: AdminApi, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (!localStorage.getItem('loggedIn')) {
      this.router.navigate(['/']);
      return;
    }
    this.loadData();
  }

  loadData(): void {
    // Employees
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

    // Shops
    this.api.getShops().subscribe({
      next: (data) => {
        console.log('Shops raw data from server:', data);
        // If field names are snake_case, map them here (temporary fix)
        this.shops = data.map((item: any) => ({
          id: item.id,
          shopName: item.shop_name || item.shopName,
          category: item.category,
          floorNumber: item.floor_number || item.floorNumber,
          ownerName: item.owner_name || item.ownerName,
          status: item.status
        }));
        console.log('this.shops after mapping:', this.shops);

        // Sort
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
}