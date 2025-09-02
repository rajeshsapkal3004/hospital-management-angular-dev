export class DateUtil {
  static formatDate(dateString: string | undefined | null, fallback: string = 'Not available'): string {
    if (!dateString) {
      return fallback;
    }
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  static formatTime(timeString: string | undefined | null, fallback: string = 'Not available'): string {
    if (!timeString) {
      return fallback;
    }
    
    try {
      const time = new Date(`1970-01-01T${timeString}`);
      if (isNaN(time.getTime())) {
        return 'Invalid time';
      }
      
      return time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid time';
    }
  }

  static formatDateTime(dateTimeString: string | undefined | null, fallback: string = 'Not available'): string {
    if (!dateTimeString) {
      return fallback;
    }
    
    const date = new Date(dateTimeString);
    
    if (isNaN(date.getTime())) {
      return 'Invalid date/time';
    }
    
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  static isValidDate(dateString: string | undefined | null): boolean {
    if (!dateString) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
}
