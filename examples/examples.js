const throttler = require('../lib/Throttle.js');
const delay = require('../lib/functions/delay.js');
const Stopwatch = require('./lib/Stopwatch.js');
const output = require('./lib/output.js');

(async () => {

    let stopwatch = new Stopwatch();                // Just for timekeeping in the demo

    let throttle = new throttler.Throttle({
        normalRateLimit: 5 * 60 * 60,               // 5 per second = 5 * 60 * 60 per hour
        normalRateWindow: 1000 * 60 * 60,           // 1000ms * 60 * 60 is one hour
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Demo #1.1
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    output.showSection('Demo #1.1 Synchronised batch');
    output.writeParagraph('If we use await throttle.next() our main program is automatically halted for the amount of time needed to throttle the requests.');
    output.writeParagraph('At 5 requests per second the average wait time between events should be 200ms. throttle.next() automatically calculates the required wait time to compensate for time already consumed by the main program or system overhead.');

    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();

    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();

    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Demo #1.2
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    output.showSection('Demo #1.2 Synchronised batch with main program delays');
    output.writeParagraph('If the main program requires more time, to execute then await throttle.next() will return quicker to maintain the requested rate.');

    process.stdout.write('Submitted...'); await delay(50); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await delay(50); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await delay(50); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await delay(50); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await delay(50); await throttle.next(); stopwatch.next();

    process.stdout.write('Submitted...'); await delay(50); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await delay(50); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await delay(50); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await delay(50); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await delay(50); await throttle.next(); stopwatch.next();

    process.stdout.write('Submitted...'); await delay(50); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await delay(50); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await delay(50); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await delay(50); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await delay(50); await throttle.next(); stopwatch.next();

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Demo #2.1
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    output.showSection('Demo #2.1 Unsynchronised batch');
    output.writeParagraph('throttle.next().then() still throttles the completion of the promises but the main program can do other work in the meantime.')
    output.writeParagraph('Note that in this case all the submissions come before the completions.');

    console.log('Submitted'); throttle.next().then(() => stopwatch.next());
    console.log('Submitted'); throttle.next().then(() => stopwatch.next());
    console.log('Submitted'); throttle.next().then(() => stopwatch.next());
    console.log('Submitted'); throttle.next().then(() => stopwatch.next());
    console.log('Submitted'); throttle.next().then(() => stopwatch.next());

    console.log('Submitted'); throttle.next().then(() => stopwatch.next());
    console.log('Submitted'); throttle.next().then(() => stopwatch.next());
    console.log('Submitted'); throttle.next().then(() => stopwatch.next());
    console.log('Submitted'); throttle.next().then(() => stopwatch.next());
    console.log('Submitted'); throttle.next().then(() => stopwatch.next());

    console.log('Submitted'); throttle.next().then(() => stopwatch.next());
    console.log('Submitted'); throttle.next().then(() => stopwatch.next());
    console.log('Submitted'); throttle.next().then(() => stopwatch.next());
    console.log('Submitted'); throttle.next().then(() => stopwatch.next());
    console.log('Submitted'); throttle.next().then(() => stopwatch.next());

    await delay(3 * 1000); // Demo 2.1 takes 3 seconds to complete (3 * 5 events) and we'll wait for that.

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Demo #2.2
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    output.showSection('Demo #2.2 Catch up burst');
    output.writeParagraph('If between events the main program consumes so much time that the event rate drops below the throttle rate then subsequent events are bursted until rates are equal.');
    output.writeParagraph('We will wait three seconds to simulate main program delay. The throttle rate is 5 events per second, or 15 events in 3 seconds. A delay of 3 seconds thus creates room for a burst of 15 events.')

    await delay(3 * 1000); // We'll wait three seconds

    process.stdout.write('Submitted...First one to burst...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();

    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();

    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...Burst complete: Last one to burst...'); await throttle.next(); stopwatch.next();

    process.stdout.write('Submitted...Burst complete: First one at regular rate...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();

    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();
    process.stdout.write('Submitted...'); await throttle.next(); stopwatch.next();

})();
