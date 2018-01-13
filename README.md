# enqueue

Wrapper around AWS's node.js SDK for SQS

## Usage

```
const enqueue = require('kchoo-enqueue');

asyncFunction(params).
  then(enqueue('queue-for-function-success', 'Function successed and returned:')).
  catch(enqueue('queue-for-function-failure'));
```
