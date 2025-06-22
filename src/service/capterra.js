import * as cheerio from 'cheerio';
import { convertToHyphenatedLowercase, trimStringWithNewLines } from "../utils/converter.js";

export const getPages = (html) => {
    const $ = cheerio.load(html);

    const pages = $('.pagination > .page-item');
    if (pages?.length <= 1) {
        return [1, 1];
    }
    else if (pages.length < 5) {
        return [1, pages.length]
    } else {
        const lastPage = pages.get(pages.length - 2);
        const lastPageIdx = $(lastPage).text();
        const value = parseInt(trimStringWithNewLines(lastPageIdx))
        return [1, value]
    }
}



export const getDateRange = async (html) => {
    const $ = cheerio.load(html);
    const context = $('script[type=application/ld+json]')?.text();
    const parsedContext = JSON.parse(context || "{}");
    const reviews = parsedContext?.["@graph"]?.[0]?.[0]?.["review"]

    if (reviews?.length > 0) {
        const latestDate = new Date(reviews?.[0]?.datePublished).getTime()
        const oldestDate = new Date(reviews?.[reviews.length - 1]?.datePublished).getTime()
        return [latestDate, oldestDate];
    }

    return []
}

export const processCapterraReviews = (html) => {
    const $ = cheerio.load(html);

    const context = $('script[type=application/ld+json]').text();
    const parsedContext = JSON.parse(context || "{}");
    const reviews = parsedContext?.["@graph"]?.[0]?.[0]?.["review"]
    const response = reviews?.map((each) => {
        return {
            name: each?.author?.name,
            date: each?.datePublished,
            reviewRating: each?.reviewRating?.ratingValue,
            title: "",
            description: []
        }
    });
    $('.i18n-translation_container.review-card').each((index, element) => {
        response[index].title = trimStringWithNewLines($(element).find('h3').text());
        const description = [];
        $(element).find("p").each((_idx, paraElem) => {
            description.push(trimStringWithNewLines($(paraElem).text()));
        })
        response[index].description.push(...description);
    });
    return response;
}

export const processCapterraCategory = (html) => {
    const $ = cheerio.load(html);
    const mp = new Map();
    $('.product-card').each((index, element) => {
        const key = convertToHyphenatedLowercase($(element).find('h2 a.event').text());
        const link = $(element).find('.logo-container').attr('href');
        const value = `https://www.capterra.in/reviews/${link?.split("/")?.slice(2)?.join("/")}?sort=most_recent`
        mp.set(trimStringWithNewLines(key), value);
    });
    return mp;
}
