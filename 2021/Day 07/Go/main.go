package main

import (
	"advent-of-code/2021/goutils"
	"fmt"
	"math"
	"strconv"
	"strings"
)

type Task struct {
	positions []int
}

func main() {
	part1(getData("07", false))
	part2(getData("07", false))
}

func part1(data Task) {
	fuel := math.MaxInt
	for i := range data.positions {
		newFuel := 0
		for _, pos := range data.positions {
			newFuel += int(math.Abs(float64(pos - i)))
		}
		if newFuel > fuel {
			break
		}
		fuel = newFuel
	}
	fmt.Println("Min fuel consumption:", fuel)
}

func part2(data Task) {
	target1 := int(math.Floor(float64(sumArr(data.positions)) / float64(len(data.positions))))
	target2 := target1 + 1
	fuel1 := 0
	fuel2 := 0
	for _, pos := range data.positions {
		abs1 := math.Abs(float64(pos - target1))
		abs2 := math.Abs(float64(pos - target2))
		fuel1 += int(abs1) * (int(abs1) + 1) / 2
		fuel2 += int(abs2) * (int(abs2) + 1) / 2
	}
	min := int(math.Min(float64(fuel1), float64(fuel2)))
	fmt.Println("Min fuel consumption:", min)
}

func sumArr(arr []int) int {
	sum := 0
	for _, val := range arr {
		sum += val
	}
	return sum
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
	strPos := strings.Split(data[0], ",")
	positions := make([]int, 0)
	for _, val := range strPos {
		num, _ := strconv.Atoi(val)
		positions = append(positions, num)
	}

	// Return task
	return Task{positions: positions}
}
