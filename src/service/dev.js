import fs from 'fs';

export const writeFile = async (html, filePath) => {
    fs.writeFile(filePath, html, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return err;
        }
        console.log(`HTML page saved to ${filePath}`);
    });
}


export const readFile = async (file) => {
    const buffer = fs.readFileSync(file);
    return buffer.toString('utf8');
}