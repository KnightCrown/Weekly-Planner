import { startOfWeek, format, addDays } from 'date-fns';

/**
 * Gets the Monday date of the current week
 * @returns {Date} Monday of the current week
 */
export function getCurrentWeekMonday() {
  const now = new Date();
  return startOfWeek(now, { weekStartsOn: 1 }); // 1 = Monday
}

/**
 * Gets the date for a specific day of the current week
 * @param {string} dayName - Name of the day (Monday, Tuesday, etc.)
 * @returns {Date} Date for the specified day
 */
export function getCurrentWeekDate(dayName) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayIndex = days?.indexOf(dayName);
  
  if (dayIndex === -1) {
    throw new Error(`Invalid day name: ${dayName}`);
  }
  
  const monday = getCurrentWeekMonday();
  return addDays(monday, dayIndex);
}

/**
 * Formats a date for display in the weekly planner
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatPlannerDate(date) {
  return format(date, 'MMM d');
}

/**
 * Gets all dates for the current week
 * @returns {Object} Object with day names as keys and dates as values
 */
export function getCurrentWeekDates() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dates = {};
  
  days?.forEach(day => {
    dates[day] = getCurrentWeekDate(day);
  });
  
  return dates;
}