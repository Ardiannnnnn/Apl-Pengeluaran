export type DateFilterMode = 'today' | 'yesterday' | 'custom';

// Helper function to check if two dates are the same day
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

// Enhanced date formatting
export const formatDate = (date: Date): string => {
  const now = new Date();
  const expenseDate = new Date(date);
  
  if (isSameDay(expenseDate, now)) return "Today";
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(expenseDate, yesterday)) return "Yesterday";
  
  const diffTime = now.getTime() - expenseDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 7) return `${diffDays} days ago`;
  
  return expenseDate.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'short' 
  });
};

// Format target date for display
export const formatTargetDate = (
  dateFilterMode: DateFilterMode,
  selectedDate: Date
): string => {
  const today = new Date();
  
  switch (dateFilterMode) {
    case 'today':
      return 'Today';
    case 'yesterday':
      return 'Yesterday';
    case 'custom':
      if (isSameDay(selectedDate, today)) return 'Today';
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (isSameDay(selectedDate, yesterday)) return 'Yesterday';
      
      return selectedDate.toLocaleDateString('id-ID', { 
        weekday: 'short',
        day: 'numeric', 
        month: 'short' 
      });
    default:
      return 'Today';
  }
};

// Get target date based on filter mode
export const getTargetDate = (
  dateFilterMode: DateFilterMode,
  selectedDate: Date
): Date => {
  const today = new Date();
  switch (dateFilterMode) {
    case 'today':
      return today;
    case 'yesterday':
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday;
    case 'custom':
      return selectedDate;
    default:
      return today;
  }
};

// Setup midnight auto-reset
export const setupMidnightReset = (
  onMidnight: () => void
): (() => void) => {
  const checkMidnight = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // Next midnight
    
    const timeToMidnight = midnight.getTime() - now.getTime();
    
    console.log(`⏰ Time to midnight: ${Math.round(timeToMidnight / 1000 / 60)} minutes`);
    
    const timeoutId = setTimeout(() => {
      console.log('🌅 Midnight reached! Resetting today data...');
      onMidnight();
      checkMidnight(); // Schedule next midnight check
    }, timeToMidnight);

    return () => clearTimeout(timeoutId);
  };

  return checkMidnight();
};