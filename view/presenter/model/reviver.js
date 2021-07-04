export default function (key, value) {
    let reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
    if (typeof value === 'string') {
        let a = reISO.exec(value);
        if (a)
            return new Date(value);
    }
    return value;
    // Code from https://weblog.west-wind.com/posts/2014/jan/06/javascript-json-date-parsing-and-real-dates
}