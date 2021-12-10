package main

import (
	"fmt"
	"io/ioutil"
	"strconv"
	"strings"
)

func main() {
	// Read data
	file, _ := ioutil.ReadFile("../data.txt")
	var numbers []string = strings.Split(string(file), "\n")

	// Count number of times preceding number is bigger
	count := 0
	for i := 1; i < len(numbers); i++ {
		n1, _ := strconv.ParseInt(numbers[i], 10, 0)
		n2, _ := strconv.ParseInt(numbers[i-1], 10, 0)
		if n1 > n2 {
			count++
		}
	}

	// Output answer
	fmt.Println("Count:", count)
}
