package main

import (
	"advent-of-code/2021/goutils"
	"fmt"
	"strconv"
	"strings"
)

type Task struct {
	fishes []int
}

func main() {
	part1(getData("06", false), 80)
	part2(getData("06", false), 256)
}

func part1(data Task, steps int) {
	for i := 0; i < steps; i++ {
		data.fishes[8] = goutils.PopFirst(&data.fishes, true)
		data.fishes[6] += data.fishes[8]
	}
	var sum int = 0
	for _, val := range data.fishes {
		sum += val
	}
	fmt.Println("Fishes after", steps, "iterations:", sum)
}

func part2(data Task, steps int) {
	part1(data, steps)
}

func getData(day string, sample bool) Task {
	// Read data
	dataSource := "data.txt"
	if sample {
		dataSource = "test-data.txt"
	}
	data, err := goutils.ReadFileToString(fmt.Sprintf("2021/Day %v/%v", day, dataSource))
	if err != nil {
		panic(err)
	}

	// Convert to proper format
	fishes := strings.Split(data[0], ",")
	ages := make([]int, 9)
	for _, num := range fishes {
		age, _ := strconv.Atoi(num)
		ages[age]++
	}

	// Return task
	return Task{fishes: ages}
}
