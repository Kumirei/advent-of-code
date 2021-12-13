package main

import (
	"advent-of-code/2021/goutils"
	"fmt"
	"strconv"
	"strings"
)

type Dot struct {
	x int
	y int
}
type Paper struct {
	dots map[Dot]struct{}
}

type Fold struct {
	axis  string
	index int
}
type Task struct {
	paper Paper
	folds []Fold
}

func main() {
	data := getData("13", false)
	part1(data)
	data = getData("13", false)
	part2(data)

}

func part1(data Task) {
	// Fold paper once
	fold(data.paper, data.folds[0:1])
	// Count dots
	count := 0
	for range data.paper.dots {
		count++
	}
	fmt.Println("Part 1 count:", count)
}

func part2(data Task) {
	// Fold paper
	fold(data.paper, data.folds)
	// Print dots
	xmax, ymax := 0, 0
	for dot := range data.paper.dots {
		if dot.x > xmax {
			xmax = dot.x
		}
		if dot.y > ymax {
			ymax = dot.y
		}
	}
	fmt.Println("Part 2 Letters:")
	for y := 0; y <= ymax; y++ {
		for x := 0; x <= xmax; x++ {
			cell := " "
			if _, ok := data.paper.dots[Dot{x, y}]; ok {
				cell = "#"
			}
			fmt.Print(cell)
		}
		fmt.Print("\n")
	}
}

func fold(paper Paper, folds []Fold) {
	for _, fold := range folds {
		var toDelete []Dot
		for dot := range paper.dots {
			if fold.axis == "y" && dot.y > fold.index {
				paper.dots[Dot{dot.x, 2*fold.index - dot.y}] = struct{}{} // Mirror dot
				toDelete = append(toDelete, dot)                          // Delete dot
			} else if fold.axis == "x" && dot.x > fold.index {
				paper.dots[Dot{2*fold.index - dot.x, dot.y}] = struct{}{} // Mirror dot
				toDelete = append(toDelete, dot)                          // Delete dot
			}
		}
		for _, dot := range toDelete {
			delete(paper.dots, dot)
		}
	}
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
	paper := Paper{dots: map[Dot]struct{}{}}
	var folds []Fold
	for i := range data {
		line := data[i]
		if len(line) == 0 {
			continue
		}
		if line[0] == 'f' {
			f := strings.Split(strings.Split(line, "fold along ")[1], "=")
			index, _ := strconv.Atoi(f[1])
			fold := Fold{axis: f[0], index: index}
			folds = append(folds, fold)
		} else {
			coord := strings.Split(line, ",")
			x, _ := strconv.Atoi(coord[0])
			y, _ := strconv.Atoi(coord[1])
			dot := Dot{x: x, y: y}
			paper.dots[dot] = struct{}{}
		}
	}

	// return task
	task := Task{paper: paper, folds: folds}
	return task
}
