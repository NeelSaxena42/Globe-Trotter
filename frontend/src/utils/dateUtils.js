import { format } from 'date-fns';

/**
 * Formats a date string or object to 'dd/mm/yyyy' format.
 * @param {string|Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
export const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return format(d, 'dd/MM/yyyy');
};
