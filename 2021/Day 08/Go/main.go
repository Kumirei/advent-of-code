package main

import (
	"advent-of-code/2021/goutils"
	"fmt"
	"math"
	"sort"
	"strings"
)

type Task struct {
	numbers [][]string
	values  [][]string
}

func main() {
	part1(getData("08", false))
	part2(getData("08", false))
}

func part1(data Task) {
	count := 0
	for _, values := range data.values {
		for _, value := range values {
			chars := len(value)
			if (chars >= 2 && chars <= 4) || chars == 7 {
				count++
			}
		}
	}
	fmt.Println("Part 1 Count:", count)
}

func part2(data Task) {
	numbers := map[string]int{"abcefg": 0, "cf": 1, "acdeg": 2, "acdfg": 3, "bcdf": 4, "abdfg": 5, "abdefg": 6, "acf": 7, "abcdefg": 8, "abcdfg": 9}

	values := []int{}
	for i := range data.numbers {
		charCounts := make(map[string]int, 7)
		byLength := map[int]string{}
		for j := range data.numbers[i] {
			byLength[len(data.numbers[i][j])] = data.numbers[i][j]
			for _, char := range data.numbers[i][j] {
				charCounts[string(char)]++
			}
		}
		byCount := map[int]string{}
		for char, count := range charCounts {
			byCount[count] = char
		}

		key := map[string]string{}
		key["b"] = byCount[6]
		key["e"] = byCount[4]
		key["f"] = byCount[9]
		key["c"] = strings.Replace(byLength[2], key["f"], "", -1)
		key["a"] = strings.Replace(byLength[3], key["c"], "", -1)
		key["a"] = strings.Replace(key["a"], key["f"], "", -1)
		key["d"] = strings.Replace(byLength[4], key["c"], "", -1)
		key["d"] = strings.Replace(key["d"], key["f"], "", -1)
		key["d"] = strings.Replace(key["d"], key["b"], "", -1)
		key["g"] = strings.Replace("abcdefg", key["a"], "", -1)
		key["g"] = strings.Replace(key["g"], key["a"], "", -1)
		key["g"] = strings.Replace(key["g"], key["b"], "", -1)
		key["g"] = strings.Replace(key["g"], key["c"], "", -1)
		key["g"] = strings.Replace(key["g"], key["d"], "", -1)
		key["g"] = strings.Replace(key["g"], key["e"], "", -1)
		key["g"] = strings.Replace(key["g"], key["f"], "", -1)

		translation := map[string]string{}
		for k, val := range key {
			translation[val] = k
		}

		sum := 0
		numCount := len(data.values[i])
		for j, value := range data.values[i] {
			// Translate
			str := ""
			for _, char := range value {
				str += translation[string(char)]
			}

			// Convert to number
			s := strings.Split(str, "")
			sort.Strings(s)
			str = strings.Join(s, "")
			val := numbers[str]
			sum += val * int(math.Pow(10, float64(numCount-j-1)))
		}
		values = append(values, sum)
	}
	sum := goutils.ArraySum(values)
	fmt.Println("Part 2 Sum:", sum)
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
	numbers := make([][]string, 0)
	values := make([][]string, 0)
	for _, s := range data {
		parts := strings.Split(s, " | ")
		numbers = append(numbers, strings.Split(parts[0], " "))
		values = append(values, strings.Split(parts[1], " "))
	}

	// Return task
	return Task{numbers, values}
}
