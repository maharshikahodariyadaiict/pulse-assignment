export const convertToHyphenatedLowercase = (name) => {
    return name?.toLowerCase()?.replace(/\s+/g, '-')?.replace(/[^a-z0-9-]/g, '');
}

export const trimStringWithNewLines = (str) => {
    return str?.replace(/\s+/g, ' ')?.trim()?.replace(/^\(/, '')?.replace(/\)$/, '');
}
