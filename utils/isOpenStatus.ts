export type OpenStatus = "OPEN" | "CLOSING_SOON" | "OPENING_SOON" | "CLOSED";

export const getOpenStatus = (openingHours: { [key: string]: string[] | string }): OpenStatus => {
    const now = new Date();

    const dayMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayKey = dayMap[now.getDay()];

    const todayHours = openingHours[todayKey];

    if (todayHours === "24 Hours") {
        return "OPEN";
    }  

    if (todayHours === "Closed") {
        return "CLOSED";
    }

    if (!todayHours || !Array.isArray(todayHours) || todayHours.length === 0) {
        return "CLOSED";
    }

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (const slot of todayHours) {
        const [start, end] = slot.split('-');
        const startHours = parseInt(start.slice(0, 2), 10);
        const startMinutes = parseInt(start.slice(2), 10);
        const endHours = parseInt(end.slice(0, 2), 10);
        const endMinutes = parseInt(end.slice(2), 10);

        const startTotalMinutes = startHours * 60 + startMinutes;
        const endTotalMinutes = endHours * 60 + endMinutes;

        if (
            currentMinutes >= startTotalMinutes - 60 &&
            currentMinutes < startTotalMinutes
        ) {
            return "OPENING_SOON";
        }

        if (
            currentMinutes >= startTotalMinutes &&
            currentMinutes <= endTotalMinutes
        ) {
            if (currentMinutes >= endTotalMinutes - 60) {
                return "CLOSING_SOON";
            }
            return "OPEN";
        }

        if (endTotalMinutes <= startTotalMinutes) {
            if (
                currentMinutes >= startTotalMinutes - 60 &&
                currentMinutes < startTotalMinutes
            ) {
                return "OPENING_SOON";
            }

            if (currentMinutes >= startTotalMinutes || currentMinutes <= endTotalMinutes) {
                if (currentMinutes >= (endTotalMinutes <= currentMinutes ? endTotalMinutes - 60 : 0)) {
                    return "CLOSING_SOON";
                }
                return "OPEN";
            }
        }
    }

    return "CLOSED";
};