package main

import (
	"advent-of-code/2021/goutils"
	"fmt"
	"strconv"
	"strings"
)

type Coordinate struct {
	x int
	y int
}

type Line struct {
	start Coordinate
	end   Coordinate
}

type Task struct {
	lines []Line
}

func main() {
	data := getData("05", false)
	part1(data)
	part2(data)
}

func part1(data Task) {
	traces := map[Coordinate]int{}
	drawLines(traces, data.lines, false)

	// Count values greater than 2
	count := 0
	for _, val := range traces {
		if val > 1 {
			count++
		}
	}
	fmt.Println("Part 1 Count:", count)
}

func part2(data Task) {
	traces := map[Coordinate]int{}
	drawLines(traces, data.lines, true)

	// Count values greater than 2
	count := 0
	for _, val := range traces {
		if val > 1 {
			count++
		}
	}
	fmt.Println("Part 2 Count:", count)
}

func drawLines(canvas map[Coordinate]int, lines []Line, includeDiagonals bool) {
	for _, line := range lines {
		if !includeDiagonals && !(line.start.x == line.end.x || line.start.y == line.end.y) {
			continue // Skip diagonal lines
		}
		dx := goutils.Sign(line.end.x - line.start.x)
		dy := goutils.Sign(line.end.y - line.start.y)
		for x, y := line.start.x, line.start.y; x != line.end.x+dx || y != line.end.y+dy; x, y = x+dx, y+dy {
			if _, ok := canvas[Coordinate{x, y}]; !ok {
				canvas[Coordinate{x, y}] = 0
			}
			canvas[Coordinate{x, y}]++
			if x == line.end.x {
				dx = 0
			}
			if y == line.end.y {
				dy = 0
			}
		}
	}

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
	lines := make([]Line, 0, len(data))
	for _, str := range data {
		coords := strings.Split(str, " -> ")
		startCoord := strings.Split(coords[0], ",")
		x0, _ := strconv.Atoi(startCoord[0])
		y0, _ := strconv.Atoi(startCoord[1])
		endCoord := strings.Split(coords[1], ",")
		x1, _ := strconv.Atoi(endCoord[0])
		y1, _ := strconv.Atoi(endCoord[1])
		start := Coordinate{x0, y0}
		end := Coordinate{x1, y1}
		lines = append(lines, Line{start, end})
	}

	// Return
	task := Task{lines}
	return task
}
