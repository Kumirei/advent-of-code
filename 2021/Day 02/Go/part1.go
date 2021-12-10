package main

import (
	"fmt"
	"io/ioutil"
	"strings"
)

func main() {
	// Read data
	file, _ := ioutil.ReadFile("../data.txt")
	var numbers []string = strings.Split(string(file), "\n")

	// Count number of times preceding number is bigger
	// Output answer
	fmt.Println("Count:", numbers)
}
