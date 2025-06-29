export const formatTime = (range: string) => {
    const [start, end] = range.split('-');
    const formated = (time: string) => {
        const hours = parseInt(time.substring(0,2), 10);
        const minutes = parseInt(time.substring(2), 10);

        const ampm = hours >= 12 ? 'pm' : 'am';
        const displayHours = hours % 12 === 0 ? 12 : hours % 12;
        const displayMinutes = minutes === 0 ? '' : `:${minutes.toString().padStart(2, '0')}`;

        return `${displayHours}${displayMinutes} ${ampm}`;
    };
    return `${formated(start)} - ${formated(end)}`;
}