package main

import (
	"advent-of-code/2021/goutils"
	"fmt"
	"sort"
	"strconv"

	"github.com/emirpasic/gods/sets/hashset"
)

type Coord struct {
	x, y int
}

type Task struct {
	vals map[Coord]int
}

func main() {
	part1(getData("09", false))
	part2(getData("09", false))
}

func part1(data Task) {
	lows := []int{}
	for coord, val := range data.vals {
		if val2, ok := data.vals[Coord{coord.x - 1, coord.y}]; ok && val >= val2 {
			continue
		}
		if val2, ok := data.vals[Coord{coord.x + 1, coord.y}]; ok && val >= val2 {
			continue
		}
		if val2, ok := data.vals[Coord{coord.x, coord.y - 1}]; ok && val >= val2 {
			continue
		}
		if val2, ok := data.vals[Coord{coord.x, coord.y + 1}]; ok && val >= val2 {
			continue
		}
		lows = append(lows, val+1)
	}
	fmt.Println("Part 1 Risk:", goutils.ArraySum(lows))
}

func part2(data Task) {
	basinSizes := []int{}
	for coord, val := range data.vals {
		if val2, ok := data.vals[Coord{coord.x - 1, coord.y}]; ok && val >= val2 {
			continue
		}
		if val2, ok := data.vals[Coord{coord.x + 1, coord.y}]; ok && val >= val2 {
			continue
		}
		if val2, ok := data.vals[Coord{coord.x, coord.y - 1}]; ok && val >= val2 {
			continue
		}
		if val2, ok := data.vals[Coord{coord.x, coord.y + 1}]; ok && val >= val2 {
			continue
		}
		basinSizes = append(basinSizes, fillBasin(data.vals, coord, hashset.New()))
	}
	sort.Slice(basinSizes, func(i, j int) bool {
		return basinSizes[i] > basinSizes[j]
	})
	max3product := goutils.ArrayProd(basinSizes[:3])
	fmt.Println("Product of largest basins:", max3product)
}

func fillBasin(vals map[Coord]int, coord Coord, basin *hashset.Set) int {
	if val, ok := vals[coord]; !ok || basin.Contains(coord) || val == 9 {
		return 0
	}
	basin.Add(coord)
	result := 1 + fillBasin(vals, Coord{coord.x - 1, coord.y}, basin)
	result += fillBasin(vals, Coord{coord.x + 1, coord.y}, basin)
	result += fillBasin(vals, Coord{coord.x, coord.y - 1}, basin)
	result += fillBasin(vals, Coord{coord.x, coord.y + 1}, basin)
	return result
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
	values := map[Coord]int{}
	for y, line := range data {
		for x, digit := range line {
			val, _ := strconv.Atoi(string(digit))
			values[Coord{x, y}] = val
		}
	}

	// Return task
	return Task{values}
}
