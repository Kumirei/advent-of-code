const fs = require('fs')
const path = require('path')

// Read data
const file = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf8')

// Count times the number increased
const c = file.split('\n').filter((v, i, a) => +a[i - 3] < v).length

// Output answer
console.log('Count larger:', c)
