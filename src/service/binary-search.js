function lowerBound(intervals, targetDate) {
    let ans = -1;
    let left = 0;
    let right = intervals.length - 1;
    const target = new Date(targetDate);

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const latestDate = new Date(intervals[mid][0]);
        const oldestDate = new Date(intervals[mid][1]);

        console.log(left, mid, right, intervals[mid][0], intervals[mid][1])
        if (latestDate.getTime() < target.getTime()) {
            right = mid - 1;
        } else if (oldestDate.getTime() > target.getTime()) {
            ans = mid;
            left = mid + 1;
        } else if (latestDate.getTime() === target.getTime()) {
            ans = mid;
            right = mid - 1;
        } else {
            ans = mid;
            break;
        }
    }

    return ans === -1 ? 0 : ans;
}

// Binary Search for Upper Bound (endDate > targetDate)
function upperBound(intervals, targetDate) {
    let ans = -1;
    let left = 0;
    let right = intervals.length - 1;
    const target = new Date(targetDate);

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const latestDate = new Date(intervals[mid][0]);
        const oldestDate = new Date(intervals[mid][1]);

        console.log(left, mid, right, intervals[mid][0], intervals[mid][1])
        if (oldestDate.getTime() > target.getTime()) {
            left = mid + 1;
        } else if (latestDate.getTime() < target.getTime()) {
            ans = mid;
            right = mid - 1;
        } else if (oldestDate.getTime() === target.getTime()) {
            ans = mid;
            left = mid + 1;
        } else {
            ans = mid;
            break;
        }
    }

    return ans === -1 ? intervals.length - 1 : ans;
}

// Sample intervals (in MM/DD/YYYY format)
const intervals = [
    ["09/18/2023", "09/02/2023"], // 0
    ["09/01/2023", "08/16/2023"], // 1
    ["08/15/2023", "07/25/2023"], // 2
    ["07/25/2023", "06/30/2023"], // 3
    ["06/30/2023", "06/01/2023"], // 4
    ["06/01/2023", "05/11/2023"], // 5
    ["05/10/2023", "04/21/2023"], // 6
    ["04/20/2023", "04/06/2023"], // 7
];

// Example Target Date for testing
const targetDate = '06/26/2023';

// Find the Lower Bound and Upper Bound for the target date
const lower = lowerBound(intervals, targetDate);
const upper = upperBound(intervals, targetDate);

console.log("Lower Bound Interval:", lower);
console.log("Upper Bound Interval:", upper);