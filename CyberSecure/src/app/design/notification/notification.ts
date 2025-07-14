import { NotificationType } from './notification-type.enum'

export class Notification {
  type!: NotificationType
  message!: string
  attr: any
}
