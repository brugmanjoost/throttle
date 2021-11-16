# throttle
Throttle is a nodejs module used to throttle events. You can typically use it to prevent overloading external services. Throttle makes sure your code puts on the breaks in time. There are no external dependencies.

1. [Installation](#install)
2. [Usage](#usage)<br />
2.1 [Synchronised usage](#usagesync)<br />
2.2 [Async usage](#usageasync)<br />
2.3 [Automatic catch up bursts](#usagecatchup)<br />
2.3 [Excess bursts](#usageexcess)<br />

<a name="install"></a>
## 1. Installation
```
$ npm install @brugmanjoost/throttle
```
<a name="usage"></a>
## 2. Usage
You provide a **normalRateLimit** which is the number of events that may occur in a given window and you provide **normalRateWindow** which is the duration of that window. Throttle will make sure you don't exceed that limit.

<a name="usagesync"></a>
### 2.1 Synchronised usage
You'll likely use throttle in a larger context like a loop to process data but barebones this is how you use it:

```
let throttle = new throttler.Throttle({
    normalRateLimit: 5 * 60 * 60,               // 5 per second = 5 * 60 * 60 per hour
    normalRateWindow: 1000 * 60 * 60,           // 1000ms * 60 * 60 is one hour
});

let t = Date.now();
await throttle.next(); console.log(Date.now() - t); // Approx t+0ms
await throttle.next(); console.log(Date.now() - t); // Approx t+200ms
await throttle.next(); console.log(Date.now() - t); // Approx t+400ms
await throttle.next(); console.log(Date.now() - t); // Approx t+600ms
await throttle.next(); console.log(Date.now() - t); // Approx t+800ms
console.log('Done', Date.now() - t);                // Approx t+800ms, shown in console last
```

<a name="usageasync"></a>
### 2.2 Async usage
If you don't use await, then throttle.next() will return immediately and the main program continues but the promises will still complete at the same rate:

```
let t = Date.now();
throttle.next().then(() => console.log(Date.now() - t)); // Approx t+0ms
throttle.next().then(() => console.log(Date.now() - t)); // Approx t+200ms
throttle.next().then(() => console.log(Date.now() - t)); // Approx t+400ms
throttle.next().then(() => console.log(Date.now() - t)); // Approx t+600ms
throttle.next().then(() => console.log(Date.now() - t)); // Approx t+800ms
console.log('Done', Date.now() - t);                     // Approx t+0ms, shown in console first
```

<a name="usagecatchup"></a>
### 2.3 Automatic catch up bursts
If your main program has some delay, e.g. fetching data, since sending the first request, then throttle will use that time to schedule the next events in burst mode to 'catch up' to the normal rate of the throttle. 

```
let t = Date.now();
await throttle.next(); console.log(Date.now() - t);     // Approx t+0ms
await throttle.next(); console.log(Date.now() - t);     // Approx t+200ms
await throttle.next(); console.log(Date.now() - t);     // Approx t+400ms
await throttle.next(); console.log(Date.now() - t);     // Approx t+600ms
await throttle.next(); console.log(Date.now() - t);     // Approx t+800ms

setTimeout(async () => {                                // Main program does something that takes 1 second.
    console.log('Staring burst', Date.now() - t);       // Approx t+18000ms
    await throttle.next(); console.log(Date.now() - t); // Approx t+18000ms
    await throttle.next(); console.log(Date.now() - t); // Approx t+18000ms
    await throttle.next(); console.log(Date.now() - t); // Approx t+18000ms
    await throttle.next(); console.log(Date.now() - t); // Approx t+18000ms
    await throttle.next(); console.log(Date.now() - t); // Approx t+18000ms

    console.log('Burst completed', Date.now() - t);     // Approx t+20000ms
    await throttle.next(); console.log(Date.now() - t); // Approx t+20000ms
    await throttle.next(); console.log(Date.now() - t); // Approx t+2200ms
    await throttle.next(); console.log(Date.now() - t); // Approx t+24000ms
    await throttle.next(); console.log(Date.now() - t); // Approx t+26000ms
    await throttle.next(); console.log(Date.now() - t); // Approx t+28000ms

}, 1000);
```
Room for catch up bursts is calculated based on the past events that occurred in the past window. E.g. with a rate of 3600 events over 1 hour if you generate a single event in the first second and no further events, then in the last second of that hour throttle will have accumulated room for 3599 catch up burst events yet to complete within the last second of the window. As this may exceed expectations of the service you are using it is often usefull to recalculate the rate to a smaller fraction of window that is specified by the external service.  

<a name="usageexcess"></a>
### 2.4 Excess bursts
Many services allow for brief periods of excess bursts beyond the normal service rate. In many cases your provider may consider catch up bursts as excess bursts. Please check the conditions of the service you are using.

Another aspect of excess burst is that they can usually be initiated right away.To implement that would mean that the first number of calls to next() (e.g. 10, 50, 100) would return immediately as an excess burst only to be followed by delays imposed by the normal rate. To implement this throttle would have to do more examination on the timeline of events and this is currently not implemented.
