package main

import (
	"advent-of-code/2021/goutils"
	"fmt"
	"strconv"
)

type Coord struct {
	x, y int
}

type Task struct {
	octos map[Coord]int
}

func main() {
	part1(getData("11", false))
	part2(getData("11", false))
}

func part1(data Task) {
	octo := data.octos
	flashes := 0
	for i := 0; i < 100; i++ {
		// Increment all
		for key := range octo {
			octo[key]++
		}
		// Flash the ones that need flashing
		for key := range octo {
			if octo[key] > 9 {
				flashes += flash(octo, key)
			}
		}
	}
	fmt.Println("Part 1 Flashes:", flashes)
}

func part2(data Task) {
	octo := data.octos
	flashes, steps := 0, 0
	target := len(octo)
	for flashes != target {
		// Increment all
		for key := range octo {
			octo[key]++
		}
		// Flash the ones that need flashing
		for key := range octo {
			if octo[key] > 9 {
				flashes = flash(octo, key)
			}
		}
		steps++
	}
	fmt.Println("Part 2 Steps:", steps)
}

func flash(octo map[Coord]int, coord Coord) int {
	ds := []Coord{{-1, -1}, {0, -1}, {1, -1}, {-1, 0}, {1, 0}, {-1, 1}, {0, 1}, {1, 1}}
	flashes := 1
	octo[coord] = 0
	for _, d := range ds {
		key := Coord{coord.x + d.x, coord.y + d.y}
		if octo[key] == 0 {
			continue
		}
		octo[key]++
		if octo[key] > 9 {
			flashes += flash(octo, key)
		}
	}
	return flashes
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
	octos := map[Coord]int{}
	for y, line := range data {
		for x, char := range line {
			val, _ := strconv.Atoi(string(char))
			octos[Coord{x, y}] = val
		}
	}

	// Return task
	return Task{octos}
}
