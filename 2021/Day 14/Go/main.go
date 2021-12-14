package main

import (
	"advent-of-code/2021/goutils"
	"fmt"
	"math"
	"strings"
)

type Polymer map[string]int64
type Task struct {
	sequence string
	rules    map[string]string
}

func main() {
	data := getData("14", false)
	part1(data)
	part2(data)
}

func part1(data Task) {
	pairs := initPairs(data.sequence)
	pairs = polymerizer(pairs, data.rules, 10)
	counts := countCharacters(pairs, data.sequence)
	ans := diffMaxMin(counts)
	fmt.Println("Part 1:", ans)
}

func part2(data Task) {
	pairs := initPairs(data.sequence)
	pairs = polymerizer(pairs, data.rules, 40)
	counts := countCharacters(pairs, data.sequence)
	ans := diffMaxMin(counts)
	fmt.Println("Part 2:", ans)
}

func diffMaxMin(counts Polymer) int64 {
	var min int64 = math.MaxInt64
	var max int64 = math.MinInt64
	for _, val := range counts {
		if val < min {
			min = val
		}
		if val > max {
			max = val
		}
	}
	return max - min
}

func countCharacters(polymer Polymer, sequence string) Polymer {
	charCount := make(Polymer)
	for key, count := range polymer {
		charCount[string(key[0])] += count // Only count fist character because pairs overlap
	}
	charCount[sequence[len(sequence)-1:]]++ // Add last character as it was not counted
	return charCount
}

func polymerizer(polymer Polymer, rules map[string]string, steps int) Polymer {
	for i := 0; i < steps; i++ {
		polymer = polymerize(polymer, rules)
	}
	return polymer
}

func polymerize(polymer Polymer, rules map[string]string) Polymer {
	newPolymer := make(Polymer)
	for key, val := range polymer {
		char := rules[key]
		a := string(key[0]) + char
		b := char + string(key[1])
		newPolymer[a] += val
		newPolymer[b] += val
	}
	return newPolymer
}

func initPairs(sequence string) Polymer {
	pairs := make(Polymer)
	for i := 1; i < len(sequence); i++ {
		pair := string(sequence[i-1]) + string(sequence[i])
		pairs[pair]++
	}
	return pairs
}

func getData(day string, sample bool) Task {
	// Read data
	dataSource := "data.txt"
	if sample {
		dataSource = "sample.txt"
	}
	data, err := goutils.ReadFileToString(fmt.Sprintf("2021/Day %v/%v", day, dataSource))
	if err != nil {
		panic(err)
	}

	// Convert to proper format
	rules := map[string]string{}
	for _, line := range data[2:] {
		vals := strings.Split(line, " -> ")
		rules[vals[0]] = vals[1]
	}

	// return task
	task := Task{sequence: data[0], rules: rules}
	return task
}
