import fetch from 'node-fetch';
import { HttpsProxyAgent } from "https-proxy-agent";
import { DATA_SOURCE } from '../context/data-source/index.js';
import * as capterra from './capterra.js';
import { CATEGORIES } from '../context/data-source/capterra-categories.js';
import { MAPPER_CAPTERRA } from '../context/data-source/capterra.js';
import { PAGE_THRESHOLD } from '../constants/index.js';

const fetchHTMLPageWithFreshProxy = async (targetUrl, pageIndex) => {
    try {
        let url = targetUrl;
        if (pageIndex) {
            url += '&page=' + pageIndex;
        }
        console.log(">>>> fetchHTMLPageWithFreshProxy", url);
        const agent = new HttpsProxyAgent(`<SECRET_CREDENTIALS>`);
        const response = await fetch(url, { agent });
        const html = await response.text();
        return html;
    } catch (error) {
        return error;
    }
}

const lowerBound = async (targetUrl, l, r, targetDate) => {
    let ans = -1;
    let left = l;
    let right = r;
    const target = new Date(targetDate);

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const html = await fetchHTMLPageWithFreshProxy(targetUrl, mid);
        const [latestDate, oldestDate] = await capterra.getDateRange(html);
        // const latestDate = new Date(intervals[mid][0]);
        // const oldestDate = new Date(intervals[mid][1]);
        if (!latestDate || !oldestDate) return -1;

        if (latestDate < target) {
            right = mid - 1;
        } else if (oldestDate > target) {
            ans = mid;
            left = mid + 1;
        } else if (latestDate === target) {
            ans = mid;
            right = mid - 1;
        } else {
            ans = mid;
            break;
        }
    }

    return ans === -1 ? 1 : ans;
}

const upperBound = async (targetUrl, l, r, targetDate) => {
    let ans = -1;
    let left = l;
    let right = r;
    const target = new Date(targetDate).getTime();

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const html = await fetchHTMLPageWithFreshProxy(targetUrl, mid);
        const [latestDate, oldestDate] = await capterra.getDateRange(html);
        // const latestDate = new Date(intervals[mid][0]);
        // const oldestDate = new Date(intervals[mid][1]);
        if (!latestDate || !oldestDate) return -1;

        if (oldestDate > target) {
            left = mid + 1;
        } else if (latestDate < target) {
            ans = mid;
            right = mid - 1;
        } else if (oldestDate === target) {
            ans = mid;
            left = mid + 1;
        } else {
            ans = mid;
            break;
        }
    }

    return ans === -1 ? right : ans;
}

export const scrapeReviews = async (name, source, startDate, endDate) => {
    // Ignore the certificate
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

    const targetUrl = DATA_SOURCE[source][name];
    console.log(">>>> 1", targetUrl);
    try {
        const firstPageHtml = await fetchHTMLPageWithFreshProxy(targetUrl);
        // console.log(">>>> 2");
        const [first, last] = capterra.getPages(firstPageHtml);
        console.log(">>>> 3 totalPages", first, last);

        let start = first, end = last;
        if (last - first > PAGE_THRESHOLD) {
            const bounds = await Promise.all([
                lowerBound(targetUrl, first, last, endDate),
                upperBound(targetUrl, first, last, startDate)
            ]);
            if (bounds.length === 2) {
                start = bounds[0];
                end = bounds[1];
            }
        }

        console.log(">>>> 4 bounds", start, end);
        let i = start;
        if (start === 1) {
            i++
        };
        const promises = []
        while (i <= end) {
            promises.push(fetchHTMLPageWithFreshProxy(targetUrl, i))
            i++;
        }
        const allPages = await Promise.all(promises);
        if (start === 1) {
            allPages.unshift(firstPageHtml);
        };
        console.log(">>>> 5", allPages?.length);
        const response = [];
        for (const html of allPages) {
            const arr = capterra.processCapterraReviews(html, startDate, endDate);
            console.log(">>>> 6", arr?.length);
            if (Array.isArray(arr)) {
                const filteredArr = arr.filter(d => {
                    const dt = new Date(d.date)
                    return dt < endDate && dt > startDate;
                })
                response.push(...filteredArr);
            }
        }
        return response;
    } catch (error) {
        throw error;
    }
}

export const getProductListing = async (category) => {
    const url = CATEGORIES[category];
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

    try {
        const html = await fetchHTMLPageWithFreshProxy(url);
        const [first, last] = capterra.getPages(html);
        const promises = []
        let i = 2;
        while (i <= last) {
            promises.push(fetchHTMLPageWithFreshProxy(url, i))
            i++;
        }
        const allPages = await Promise.all(promises);
        allPages.unshift(html);
        const response = {};
        for (const html of allPages) {
            const mp = capterra.processCapterraCategory(html);
            for (let [k, v] of mp) {
                if (!MAPPER_CAPTERRA[k]) {
                    response[k] = v;
                }
            }
        }
        return response;
    } catch (error) {
        throw error;
    }
}
