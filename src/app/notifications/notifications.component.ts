import { Component } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  notifications = [
    { title: 'System Update', message: 'A new update is available for download.', date: '2024-07-31' },
    { title: 'Maintenance', message: 'Scheduled maintenance on 2024-08-01 from 01:00 to 03:00 UTC.', date: '2024-07-30' },
    { title: 'New Feature', message: 'We have added a new feature to improve your experience.', date: '2024-07-29' }
  ];
}
