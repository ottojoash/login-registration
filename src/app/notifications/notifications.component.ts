// src/app/notifications/notifications.component.ts
import { Component, OnInit } from '@angular/core';
import { NotificationsService } from './notifications.service'; // Adjust the path as necessary

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];

  constructor(private notificationsService: NotificationsService) { }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationsService.getNotifications().subscribe(
      (data: any[]) => {
        this.notifications = data;
      },
      error => {
        console.error('Error fetching notifications', error);
      }
    );
  }
}
