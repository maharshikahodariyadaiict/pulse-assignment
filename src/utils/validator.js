import { REGEX_MMDDYYYY } from "../constants/index.js";
import { DATA_SOURCE } from "../context/data-source/index.js";

export const validateName = (name, source) => {
    if (!name) return "name is mandatory parameter";
    if (!source) return "source is mandatory parameter";

    const mapper = DATA_SOURCE[source];
    if (!mapper) return "source not found!"
    if (!mapper[name]) return "name not found on given source website";

    return "";
}

export const validateDate = (startDate, endDate) => {
    // Expected Date Format DD/MM/YYYY
    if (!REGEX_MMDDYYYY.test(startDate) || !REGEX_MMDDYYYY.test(endDate)) {
        return "Provide date in proper format. (Proper Format: MM/DD/YYYY";
    }

    const startDt = new Date(startDate);
    const endDt = new Date(endDate);

    if (endDt < startDt) {
        return "endDate must be larger than startDate!!";
    }
    if (endDt > new Date()) {
        return "endDate can not exceed today's date!!";
    }

    return "";
}