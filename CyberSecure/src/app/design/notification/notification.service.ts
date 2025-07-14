import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Notification } from './notification'
import { Subject } from 'rxjs'
import { NotificationType } from './notification-type.enum'

@Injectable()
export class NotificationService {
  public currentNotification?: Notification
  private notif = new Subject<Notification>()

  constructor() {
    this.notif.subscribe(notification => this.currentNotification = notification)
  }

  getAlert(): Observable<Notification> {
    return this.notif.asObservable()
  }

  success(message: string, attr?: any) {
    this.alert(NotificationType.SUCCESS, message, attr)
  }

  error(message: string, attr?: any) {
    this.alert(NotificationType.ERROR, message, attr)
  }

  info(message: string, attr?: any) {
    this.alert(NotificationType.INFO, message, attr)
  }

  warn(message: string, attr?: any) {
    this.alert(NotificationType.WARNING, message, attr)
  }

  alert(type: NotificationType, message: string, attr?: any) {
    this.notif.next(<Notification>{type: type, message: message, attr: attr})

    setTimeout(() => {
      this.clear()
    }, 5000)
  }

  clear() {
    this.notif.next({ type: null, message: '', attr: null } as unknown as Notification)
  }
}
