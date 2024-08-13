function toIST(utcDate) {
    // Parse the UTC date string into a Date object
    const date = new Date(utcDate);

    // Convert UTC date to IST by adding 5.5 hours (19800000 milliseconds)
    const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);

    // Format IST date as a string in ISO format
    return istDate.toISOString().replace("Z", "+05:30");
}

module.exports = { toIST };
