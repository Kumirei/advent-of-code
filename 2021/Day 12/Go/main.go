package main

import (
	"advent-of-code/2021/goutils"
	"fmt"
	"strings"
	"time"
)

type Set map[int]struct{}

type Graph struct {
	edges    map[int]Set
	names    map[int]string
	nums     map[string]int
	bigCaves Set
}

func main() {
	data := getData("12", false)
	graph := createGraph(data)
	part1(&graph)
	part2(&graph)
}

func part1(graph *Graph) {
	t := time.Now()
	paths := startBFS(graph, true)
	fmt.Println("Part1 Paths:", paths)
	fmt.Println("Part1 Time:", time.Now().Sub(t))
}

func part2(graph *Graph) {
	t := time.Now()
	paths := startBFS(graph, false)
	fmt.Println("Part2 Paths:", paths)
	fmt.Println("Part2 Time:", time.Now().Sub(t))
}

func startBFS(graph *Graph, visitTwice bool) int {
	visited := make(map[int]int)
	path := []int{graph.nums["start"]}
	paths := 0
	bfs(graph, graph.nums["start"], graph.nums["end"], visited, path, &paths, visitTwice)
	return paths
}

func bfs(graph *Graph, node, endNode int, visited map[int]int, path []int, paths *int, visitedTwice bool) {
	// If we reached the end, return
	if node == endNode {
		*paths++
		return
	}

	// Mark node as visited
	visited[node]++
	if maxVisits(graph, node, visitedTwice) == 2 && visited[node] == 2 {
		visitedTwice = true
	}

	// Go deeper
	for nextNode := range graph.edges[node] {
		// If the node has already been visited, skip it
		if !canVisit(graph, nextNode, visited, visitedTwice) {
			continue
		}
		// Traverse the node
		path = append(path, nextNode)
		bfs(graph, nextNode, endNode, visited, path, paths, visitedTwice)
		path = path[:len(path)-1]
	}

	// Unmark node as visited
	visited[node]--
}

func canVisit(graph *Graph, node int, visited map[int]int, visitedTwice bool) bool {
	max := maxVisits(graph, node, visitedTwice)
	if max == -1 || visited[node] < max {
		return true
	}
	return false
}

func maxVisits(graph *Graph, node int, visitedTwice bool) int {
	if _, ok := graph.bigCaves[node]; ok {
		return -1
	}
	if visitedTwice {
		return 1
	}
	return 2
}

func createGraph(data [][]string) Graph {
	graph := Graph{edges: make(map[int]Set), names: make(map[int]string), nums: make(map[string]int), bigCaves: make(Set)}
	for i, line := range data {
		// Initialize nodes if needed
		if _, ok := graph.nums[line[0]]; !ok {
			initNode(graph, line[0], i+1)
		}
		if _, ok := graph.nums[line[1]]; !ok {
			initNode(graph, line[1], -i)
		}
		// Add edges
		if line[1] != "start" && line[0] != "end" {
			graph.edges[graph.nums[line[0]]][graph.nums[line[1]]] = struct{}{}
		}
		if line[0] != "start" && line[1] != "end" {
			graph.edges[graph.nums[line[1]]][graph.nums[line[0]]] = struct{}{}
		}
	}
	return graph
}

func initNode(graph Graph, name string, id int) {
	graph.nums[name] = id
	graph.names[id] = name
	graph.edges[id] = make(map[int]struct{})
	if strings.ToUpper(name) == name {
		graph.bigCaves[id] = struct{}{}
	}
}

func getData(day string, sample bool) [][]string {
	// Read data
	dataSource := "data.txt"
	if sample {
		dataSource = "sample1.txt"
	}
	data, err := goutils.ReadFileToString(fmt.Sprintf("2021/Day %v/%v", day, dataSource))
	if err != nil {
		panic(err)
	}

	// Convert to proper format
	input := make([][]string, len(data))
	for i := range data {
		input[i] = strings.Split(data[i], "-")
	}

	return input
}
