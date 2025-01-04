import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    constructor(private snackBar: MatSnackBar) { }

    showNotification(message: string, type: NotificationType = 'info'): void {
        const config = {
            duration: type === 'error' ? 5000 : 3000, // Adjusted default duration
            horizontalPosition: 'right' as const,
            verticalPosition: 'top' as const,
            panelClass: [`${type}-snackbar`] // This applies the custom class
        };

        this.snackBar.open(message, 'Close', config); 
    }
}
