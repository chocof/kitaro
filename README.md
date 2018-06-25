# Kitaro

Kitaro provides RPC functionality by using tj's [axon](https://github.com/tj/axon).
Kitaro can be used to easily develop microservices that interract with each other.

_(Still in development, more features coming soon)_

## Getting Started
Install the module with: `grunt build`

```javascript
const { Kitaro }  = require('kitaro');
const kitaro = new Kitaro("myKitaro", 3226);
```

THe above function will create a new kitaro. To connect with it
from another process, machine, universe use

```javascript
const { RemoteKitaro }  = require('kitaro');
const remote = new RemoteKitaro("127.0.0.1", 3226);
```

One can add functions to their kitaro
```javascript
kitaro.addFunction('myFunction', () => true,);
kitaro.addFunction('negate', b => -b,);
kitaro.addFunction('sum3', (a, b, c) => a + b + c,);
```

These functions can be used by a remote kitaro
```javascript
const remote.connect()
  .then(listOfFunctions => {
    console.log(listOfFunctions)
    /*
    * [ { label: 'myFunction', returns: 'function' },
    * { label: 'negate', returns: 'function' },
    * { label: 'sum3', returns: 'function' } ]
    */
  })
  .then(async () => {
    console.log(await remote.exec.myFunction())
    // true
    console.log(await remote.exec.negate(3))
    // -3
    console.log(await remote.exec.sum3(1,2,3))
    // 6
  })

```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_

## License
Copyright (c) 2018 chocof
Licensed under the MIT license.
