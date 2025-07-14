import { Component, OnInit } from '@angular/core'
import { Notification } from './notification'
import { NotificationService } from './notification.service'
import { NotificationType } from './notification-type.enum'

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})

export class NotificationComponent implements OnInit {

  public notifications: Notification[] = []

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.getAlert().subscribe((notif) => {
      if (notif) {
        this.notifications.push(notif);

        // Supprimer la notification après 5 secondes
        setTimeout(() => {
          this.removeAlert(notif);
        }, 3000);
      }
    });
  }

  removeAlert(notif: Notification) {
    notif.attr = 'hidden'; // Ajouter une classe CSS pour la transition
    setTimeout(() => {
      this.notifications = this.notifications.filter((x) => x !== notif);
    }, 500); // Correspond au temps de la transition CSS
  }
  iconClass(notification: Notification): string {
    switch (notification.type) {
      case NotificationType.SUCCESS:
        return 'fas fa-check-circle';
      case NotificationType.ERROR:
        return 'fas fa-times-circle';
      case NotificationType.INFO:
        return 'fas fa-info-circle';
      case NotificationType.WARNING:
        return 'fas fa-exclamation-circle';
      default:
        return '';
    }
  }


  cssClass(notif: Notification) {
    if (!notif) {
      return;
    }

    switch (notif.type) {
      case NotificationType.SUCCESS:
        return 'message message--success'
      case NotificationType.ERROR:
        return 'message message--error'
      case NotificationType.INFO:
        return 'message message--success'
      case NotificationType.WARNING:
        return 'message message--error'
    }
  }

  cssClassIcon(alert: Notification) {
    if (!alert) {
      return;
    }

    switch (alert.type) {
      case NotificationType.SUCCESS:
        return 'icon--success'
      case NotificationType.ERROR:
        return 'icon--error'
      case NotificationType.INFO:
        return 'icon--success'
      case NotificationType.WARNING:
        return 'icon--error'
    }
  }


}
