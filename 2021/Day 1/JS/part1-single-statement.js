const fs = require('fs')
const path = require('path')

// Read data
const file = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf8')
var c = file // c stands four count
    .split('\n')
    .map((n, i, arr) => (c = i < 1 ? 1 : n > arr[i - 1] ? c + 1 : c))
    .at(-1)
console.log(c)

// Based on Gorbit99's solution
c = file.split('\n').filter((n, i, arr) => i > 0 && arr[i - 1] < n).length + 1
console.log(c)
