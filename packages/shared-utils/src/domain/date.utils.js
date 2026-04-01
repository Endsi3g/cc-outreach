"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.daysFromNow = daysFromNow;
exports.timeSince = timeSince;
/** Return an ISO date string for N days from now. */
function daysFromNow(n) {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString();
}
/** Human-readable "since" label (e.g. "il y a 3 jours"). */
function timeSince(date) {
    const diff = Date.now() - new Date(date).getTime();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60)
        return `il y a ${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60)
        return `il y a ${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24)
        return `il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `il y a ${days}j`;
}
//# sourceMappingURL=date.utils.js.map