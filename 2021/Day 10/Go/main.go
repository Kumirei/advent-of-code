package main

import (
	"advent-of-code/2021/goutils"
	"fmt"
	"sort"

	"github.com/emirpasic/gods/sets/hashset"
)

type Task struct {
	s []string
}

func main() {
	part1(getData("10", false))
	part2(getData("10", false))
}

func part1(data Task) {
	open := hashset.New('(', '{', '[', '<')
	close := map[rune]rune{')': '(', '}': '{', ']': '[', '>': '<'}
	scores := map[rune]int{')': 3, '}': 1197, ']': 57, '>': 25137}
	illegals := []rune{}
	heap := []rune{}
	for _, line := range data.s {
		for _, char := range line {
			if open.Contains(char) {
				heap = append(heap, char)
			} else if heap[len(heap)-1] == close[char] {
				heap = heap[:len(heap)-1]
			} else {
				illegals = append(illegals, char)
				break
			}
		}
	}
	score := 0
	for _, r := range illegals {
		score += scores[r]
	}
	fmt.Println("Part 1 Score:", score)
}

func part2(data Task) {
	open := hashset.New('(', '{', '[', '<')
	close := map[rune]rune{')': '(', '}': '{', ']': '[', '>': '<'}
	scores := map[rune]int{'(': 1, '[': 2, '{': 3, '<': 4}
	lineScores := []int{}
	for _, line := range data.s {
		heap := []rune{}
		legal := true
		for _, char := range line {
			if open.Contains(char) {
				heap = append(heap, char)
			} else if heap[len(heap)-1] == close[char] {
				heap = heap[:len(heap)-1]
			} else {
				legal = false
				break
			}
		}
		if !legal {
			continue
		}
		// Legal line
		// Find closing sequence score
		score := 0
		for len(heap) > 0 {
			score = score*5 + scores[heap[len(heap)-1]]
			heap = heap[:len(heap)-1]
		}
		lineScores = append(lineScores, score)
	}
	// Calculate points
	sort.Slice(lineScores, func(i, j int) bool {
		return lineScores[i] > lineScores[j]
	})
	score := lineScores[len(lineScores)/2]
	fmt.Println("Part 2 score:", score)
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

	// Return task
	return Task{data}
}
