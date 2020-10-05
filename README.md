# package-name

[![Build Status](https://travis-ci.com/bloq/web3-parse-receipt-events.svg?branch=master)](https://travis-ci.com/bloq/web3-parse-receipt-events)
[![Code Style](https://img.shields.io/badge/code%20style-bloq-0063a6.svg)](https://github.com/bloq/eslint-config-bloq)

Parse [Web3](https://github.com/ethereum/web3.js) receipt events from specific contracts.

When using `web3.eth.sendTransaction` or when calling a contract method with
`contract.methods.someFunction().send()`, not all the evnents are parsed in the
returned receipt.
In the first case, none are and in the second, only the events from the called
contract are parsed.
So when other events from i.e. contracts called internally by `someFunction()`, 
those have to be parsed manually.

This library helps doing so by taking the original receipt and the contract ABI,
address whose events are to be parsed.

Note: The provided receipt is mutated but keeping full compatibility with the Web3 receipt format as defined in Contract#_executeMethod and Contract#_decodeEventABI functions.

## Installation

```shell
npm install web3-parse-receipt-events
```

## Usage

```js
const package = require('web3-parse-receipt-events')
const Web3 = require('web3')

const web3 = new Web3()
web3.eth.getTransactionReceipt(hash)
  .then(receipt => parseReceiptEvents(contractAbi, contractAddress, receipt))
  .then(console.log)
// Will print a receipt and events from the specfied contract properly parsed.
```

## API

<a name="parseReceiptEvents"></a>

### parseReceiptEvents(abi, address, receipt) ⇒ <code>TransactionReceipt</code>
Parse receipt events of the given contract.

Web3 only parses the events of the contract that is returning the receipt. If
there are additional events logged by other contracts that were called during
the execution of the transaction, those will not be parsed automatically. For
those cases, additional parsing effort is required.

**Returns**: <code>TransactionReceipt</code> - The patched receipt.  

| Param | Type | Description |
| --- | --- | --- |
| abi | <code>Array.&lt;AbiItem&gt;</code> | The ABI of the contract. |
| address | <code>string</code> | The address of the contract. |
| receipt | <code>TransactionReceipt</code> | The receipt to parse. |


## License

MIT
