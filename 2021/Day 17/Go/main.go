package main

import (
	"advent-of-code/2021/goutils"
	"fmt"
	"math"
	"strconv"
	"strings"
	"time"
)

type Coord struct {
	x float64
	y float64
}

type Task struct {
	max Coord
	min Coord
}

func main() {
	data := getData("17", false)
	// part1(data)
	part2(data)
}

func part1(task Task) float64 {
	defer timeFunc("Execution")()
	var i float64 = 0
	var height float64
	for {
		height = 0.5 * i * (i - 1)
		mostSteps := 0.5 * (1 + math.Sqrt(8*height-8*task.min.y+1))
		if mostSteps == i+1 {
			break
		}
		i++
	}
	fmt.Println("Highest possible shot:", height)
	return height
}

func part2(task Task) {
	defer timeFunc("Execution")()
	// Get max y velocity
	maxHeight := part1(task)
	maxStartYvel := math.Ceil(1/2 + math.Sqrt(1/4+2*maxHeight) - 1)
	count := 0
	found := map[Coord]struct{}{}
	// Start searching for solutions in x
	startXvel := math.Ceil(0.5*(1+math.Sqrt(1+8*task.min.x)) - 1)
	for x0 := startXvel; x0 <= task.max.x; x0++ {
		t := math.Ceil(0.5*(1+2*x0) - math.Sqrt(math.Pow((0.5*(1+2*x0)), 2)-2*task.min.x))
		dx := x0 - t
		x := x0*t - 0.5*t*(t-1)
		for dx >= 0 && x <= task.max.x {
			// x in bounds, find solutions in y
			if x <= task.max.x && x >= task.min.x {
				for y0 := maxStartYvel; y0 >= task.min.y; y0-- {
					y := y0*t - 0.5*t*(t-1)
					if !(y <= task.max.y && y >= task.min.y) && dx == 0 {
						// Search higher steps
						maxStep := 0.5 + y0 + math.Sqrt(0.25*math.Pow((1+2*y0), 2)-2*task.min.y)
						for t2 := t; t2 <= maxStep; t2++ {
							y = y0*t2 - 0.5*t2*(t2-1)
							if y <= task.max.y && y >= task.min.y {
								break
							}
						}
					}
					if _, ok := found[Coord{x0, y0}]; !ok && y >= task.min.y && y <= task.max.y {
						count++
						found[Coord{x0, y0}] = struct{}{}
					}
				}
			}
			x += dx
			dx -= 1
			t++
		}
	}
	fmt.Println("Possible trajectories:", count)

}

func timeFunc(what string) func() {
	start := time.Now()
	return func() {
		fmt.Printf("%s took %v\n", what, time.Since(start))
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
	parts := strings.Split(data[0], ",")
	for i, val := range parts {
		parts[i] = strings.Split(val, "=")[1]
	}
	x := strings.Split(parts[0], "..")
	y := strings.Split(parts[1], "..")
	xmin, _ := strconv.Atoi(x[0])
	xmax, _ := strconv.Atoi(x[1])
	ymin, _ := strconv.Atoi(y[0])
	ymax, _ := strconv.Atoi(y[1])
	// return task
	task := Task{min: Coord{x: float64(xmin), y: float64(ymin)}, max: Coord{x: float64(xmax), y: float64(ymax)}}
	return task
}
