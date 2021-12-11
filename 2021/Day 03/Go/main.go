package main

import (
	"advent-of-code/2021/goutils"
	"fmt"
	"math"
	"strconv"
)

func main() {
	data := getInput("03", true)
	// fmt.Println(data)

	// Get results
	answer1 := part1(data)
	answer2 := part2(data)

	// Output
	fmt.Println("Part1:", answer1)
	fmt.Println("Part2:", answer2)
}

func part1(data [][]int) int {
	mostCommon := mostCommonBits(data)
	gamma := binToDec(mostCommon)
	epsilon := int(math.Pow(2.0, float64(len(mostCommon)))) - 1 - gamma

	return gamma * epsilon
}

func part2(data [][]int) int {
	gamma := getRating(data, func(val, common int) bool {
		return val == common

	})
	epsilon := getRating(data, func(val, common int) bool {
		return val != common

	})

	return gamma * epsilon
}

func getRating(data [][]int, comp func(int, int) bool) int {
	// Copy data
	bytes := make([][]int, len(data))
	for i, l := range data {
		nl := make([]int, len(data[0]))
		copy(nl, l)
		bytes[i] = nl
	}

	// Get rating
	for i := range bytes {
		mostCommon := mostCommonBits(bytes)
		// Filter bytes
		sliceIndex := 0
		for _, val := range bytes {
			if comp(val[i], mostCommon[i]) {
				bytes[sliceIndex] = val
				sliceIndex++
			}
		}
		bytes = bytes[:sliceIndex]
		// Stop?
		if len(bytes) == 1 {
			break
		}
	}
	return binToDec(bytes[0])
}

func binToDec(bin []int) (sum int) {
	for i, v := range bin {
		sum += v * int(math.Pow(2*float64(v), float64(len(bin)-1-i)))
	}
	return
}

func mostCommonBits(bits [][]int) []int {
	mostCommon := make([]int, len(bits[0]))
	for _, line := range bits {
		for i, v := range line {
			incr := 1
			if v == 0 {
				incr = -1
			}
			mostCommon[i] += incr
		}
	}
	for i, v := range mostCommon {
		if v >= 0 {
			mostCommon[i] = 1
		} else {
			mostCommon[i] = 0
		}
	}
	return mostCommon
}

func getInput(day string, sample bool) [][]int {
	// Read data
	dataSource := "data.txt"
	if sample {
		dataSource = "test-" + dataSource
	}
	data, err := goutils.ReadFileToString(fmt.Sprintf("2021/Day %v/%v", day, dataSource))
	if err != nil {
		panic(err)
	}

	// Convert to proper format
	input := make([][]int, len(data))
	for i, dataLine := range data {
		inputLine := make([]int, len(data[0]))
		for j, bit := range dataLine {
			n, err := strconv.Atoi(string(bit))
			if err != nil {
				panic(err)
			}
			inputLine[j] = n

		}
		input[i] = inputLine
	}
	return input
}
