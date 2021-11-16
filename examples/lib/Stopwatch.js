module.exports = class Stopwatch {
    constructor() {
        this.time = Date.now();
    }

    next() {
        let time = Date.now();
        let delta = time - this.time;
        this.time = time;
        console.log(`Completed with interval ${delta}`);
    }
}