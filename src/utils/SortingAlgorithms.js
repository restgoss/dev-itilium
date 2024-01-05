export const sortByDate = (array) => {
    return array.sort((a, b) => a.date - b.date ? 1 : -1);
};
