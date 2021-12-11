package main

import (
	"advent-of-code/2021/goutils"
	"fmt"
	"strconv"
)

func main() {
	data := getInput("01", false)

	// Get results
	answer1 := part1(data)
	answer2 := part2(data)

	// Output
	fmt.Println("Part1:", answer1)
	fmt.Println("Part2:", answer2)
}

func part1(data []int) (count int) {
	for i := range data {
		if i == 0 {
			continue
		}
		if data[i] > data[i-1] {
			count++
		}

	}
	return
}

func part2(data []int) (count int) {
	for i := range data {
		if i < 3 {
			continue
		}
		if data[i] > data[i-3] {
			count++
		}

	}
	return
}

func getInput(day string, sample bool) []int {
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
	numbers := make([]int, len(data))
	for i := range data {
		num, err := strconv.Atoi(data[i])
		if err != nil {
			panic(err)
		}

		numbers[i] = num
	}
	return numbers
}
