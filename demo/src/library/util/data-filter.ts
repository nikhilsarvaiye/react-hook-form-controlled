export const filterBySearchText = (
    data: any[],
    searchText: string,
    minLength = 1,
    caseSensitive = false,
    filterColumns?: string[],
) => {
    if (
        !data ||
        !data.length ||
        !searchText ||
        searchText.length <= minLength
    ) {
        return data;
    }

    const _filterColumns = filterColumns || [];

    const results = [] as any[];
    data.forEach((x, index) => {
        if (isMatch(x, searchText, caseSensitive, _filterColumns, true)) {
            results.push(x);
        }
    });

    data.forEach((x) => {
        if (
            results.indexOf(x) === -1 &&
            isMatch(x, searchText, caseSensitive, _filterColumns)
        ) {
            results.push(x);
        }
    });

    return results;
};

const isMatch = (
    x: any,
    searchText: string,
    caseSensitive: boolean,
    filterColumns: string[],
    exact = false,
) => {
    searchText = !caseSensitive
        ? searchText.toString().toLowerCase()
        : searchText.toString();
    if (typeof x === 'string') {
        const value = !caseSensitive
            ? x.toString().toLowerCase()
            : x.toString();
        if (exact) {
            return value === searchText ? true : false;
        } else if (x.indexOf(searchText) !== -1) {
            return true;
        }
    } else {
        for (const key in x) {
            if (
                filterColumns.length > 0 &&
                !filterColumns.find((y) => y === key)
            ) {
                continue;
            }
            let value = x[key];
            if (value !== undefined && value !== null) {
                value = !caseSensitive
                    ? value.toString().toLowerCase()
                    : value.toString();
                if (exact) {
                    if (value === searchText) {
                        return true;
                    }
                } else if (value.indexOf(searchText) !== -1) {
                    return true;
                }
            }
        }
    }
    return false;
};

export const findIndexBySearchText = (
    data: any[],
    searchText: string,
    minLength = 1,
    caseSensitive = false,
) => {
    const items = filterBySearchText(
        data,
        searchText,
        minLength,
        caseSensitive,
    );
    return items.length ? items.indexOf(items[0]) : -1;
};
