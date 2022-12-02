const fs = require('fs')

console.log(
    'Most Cals:',
    fs
        .readFileSync('input1.txt', 'utf8')
        .split('\n\n')
        .map((s) =>
            s
                .split('\n')
                .filter((v) => v)
                .reduce((sum, b) => sum + parseInt(b), 0),
        )
        .reduce((max, n) => Math.max(max, n), 0),
)

console.log(
    'Total top 3:',
    fs
        .readFileSync('input1.txt', 'utf8')
        .split('\n\n')
        .map((s) =>
            s
                .split('\n')
                .filter((v) => v)
                .reduce((sum, n) => sum + parseInt(n), 0),
        )
        .sort((a, b) => b - a)
        .slice(0, 3)
        .reduce((sum, n) => sum + n, 0),
)
