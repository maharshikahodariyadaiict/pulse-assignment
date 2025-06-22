import { CATEGORIES } from '../context/data-source/capterra-categories.js';
import * as service from '../service/reviews.js';
import { convertToHyphenatedLowercase } from '../utils/converter.js';
import { validateDate, validateName } from '../utils/validator.js';

export const getReviews = async (req, res) => {
    const start = new Date().getTime();
    // Extract Input Data
    const { name, startDate, endDate, source } = req.query;
    // Convert data to proper format
    const parsedName = convertToHyphenatedLowercase(name?.trim()?.toLowerCase());
    const parsedSource = source?.trim()?.toLowerCase()

    // Validate Input Data
    const nameValidation = validateName(parsedName, parsedSource);
    const dateValidation = validateDate(startDate, endDate);
    if (nameValidation || dateValidation) {
        const error = [nameValidation, dateValidation].filter(r => r);
        res.status(400).send({ error });
    }

    // Start Scraping
    try {
        const startDt = new Date(startDate).getTime();
        const endDt = new Date(endDate).getTime();
        const data = await service.scrapeReviews(parsedName, parsedSource, startDt, endDt);
        const end = new Date().getTime();
        const delta = Math.round((end - start) / 1000);
        res.send({
            time: `${Math.floor(delta / 60)} minutes, ${(delta) % 60} seconds`,
            data,
        });
    } catch (error) {
        res.status(500).send({ error });
    }
}

export const getProductListing = async (req, res) => {
    const start = new Date().getTime();
    const { category } = req.query;
    if (!category) res.status(400).send("Category not found in params");
    const parsedCategory = convertToHyphenatedLowercase(category);
    if (!CATEGORIES[parsedCategory]) res.status(400).send("Category does not exist!");
    try {
        const data = await service.getProductListing(parsedCategory);
        const end = new Date().getTime();
        const delta = Math.round((end - start) / 1000);
        res.send({
            time: `${Math.floor(delta / 60)} minutes, ${(delta) % 60} seconds`,
            data,
        });
    } catch (error) {
        res.status(500).send({ error });
    }
}
