package main

import (
	"advent-of-code/2021/goutils"
	"fmt"
	"strconv"
	"strings"
)

type Command struct {
	direction string
	distance  int
}

func main() {
	data := getInput("02", false)

	// Get results
	answer1 := part1(data)
	answer2 := part2(data)

	// Output
	fmt.Println("Part1:", answer1)
	fmt.Println("Part2:", answer2)
}

func part1(data []Command) int {
	x, y := 0, 0
	for i := range data {
		command := data[i]
		if command.direction == "forward" {
			x += command.distance
		} else if command.direction == "up" {
			y -= command.distance

		} else {
			y += command.distance
		}
	}
	return x * y
}

func part2(data []Command) int {
	x, y, aim := 0, 0, 0
	for i := range data {
		command := data[i]
		if command.direction == "forward" {
			x += command.distance
			y += command.distance * aim
		} else if command.direction == "up" {
			aim -= command.distance

		} else {
			aim += command.distance
		}
	}
	return x * y
}

func getInput(day string, sample bool) []Command {
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
	commands := make([]Command, len(data))
	for i := range data {
		command := strings.Split(data[i], " ")
		distance, err := strconv.Atoi(command[1])
		if err != nil {
			panic(err)
		}
		commands[i] = Command{direction: command[0], distance: distance}
	}
	return commands
}
