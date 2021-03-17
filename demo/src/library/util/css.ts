export const getHtmlDocumentFontSize = () => {
    const screenWidth = window.screen.width;
    if (screenWidth < 1299) {
        return '8px';
    } else if (screenWidth < 1599) {
        return '10px';
    } else if (screenWidth < 1900) {
        return '11px';
    }
    return '13px';
    // const htmlElement = document.getElementsByName('html');
    // return getComputedStyle(htmlElement).fontSize;
};

export const parseNumberFromCssValue = (value: string): number => {
    if (!value) {
        return value as any;
    }
    return parseFloat(value.toString().replace(/[^0-9]/g, ''));
};

export const emToPxValue = (value: string) => {
    if (!value) {
        return value;
    }
    const fontSize = getHtmlDocumentFontSize();
    if (!fontSize) {
        throw new Error('Failed to get Html Document Font Size');
    }
    return parseNumberFromCssValue(value) * parseNumberFromCssValue(fontSize);
};
