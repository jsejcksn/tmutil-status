# tmutil-status
Get macOS Time Machine status as a JS object


## About

In macOS, the terminal command

```
tmutil status
```

will display the current status of Time Machine in the [NextSTEP property list dictionary format](https://en.wikipedia.org/wiki/Property_list#NeXTSTEP). (See also: [Time Machine progress from the command line](https://apple.stackexchange.com/questions/162464/time-machine-progress-from-the-command-line).)

This package provides that information as a JavaScript object.


## Install

```
npm install tmutil-status
```


## Use


### ESM import

```js
import tmutilStatus from 'tmutil-status';
```

### CommonJS import

```js
const tmutilStatus = require('tmutil-status/commonjs');
```

### Promise use

```js
// async/await
(async () => {
  try {
    const data = await tmutilStatus();
    console.log(data);
  }
  catch (err) {
    console.error(err);
  }
})();

// chaining
tmutilStatus()
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

### Callback use

```js
tmutilStatus((err, data) => {
  if (err) console.error(err);
  else console.log(data);
});
```
