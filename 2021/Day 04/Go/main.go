package main

import (
	"advent-of-code/2021/goutils"
	"fmt"
	"math"
	"regexp"
	"strconv"
	"strings"
)

type Card struct {
	rows [5][5]int
	win  int
}

type Bingo struct {
	calls []int
	cards []Card
}

func main() {
	data := getInput("04", false)
	mapToCallIndex(data)
	getEarliestWins(data.cards)

	// Get results
	answer1 := part1(data)
	answer2 := part2(data)

	// Output
	fmt.Println("Part1:", answer1)
	fmt.Println("Part2:", answer2)
}

func part1(data Bingo) int {
	// Find earliest win
	winner := Card{win: math.MaxInt32}
	for _, card := range data.cards {
		if card.win < winner.win {
			winner = card
		}
	}

	// Get score
	score := calculateScore(data, winner)

	return score
}

func part2(data Bingo) int {
	// Find last win
	loser := Card{win: math.MinInt32}
	for _, card := range data.cards {
		if card.win > loser.win {
			loser = card
		}
	}

	// Get score
	score := calculateScore(data, loser)

	return score
}

func calculateScore(data Bingo, card Card) int {
	score := 0
	for _, row := range card.rows {
		for _, val := range row {
			if val > card.win {
				score += data.calls[val]
			}
		}
	}
	return score * data.calls[card.win]
}

func getEarliestWins(cards []Card) {
	for i := range cards {
		cards[i].win = earliestWin(cards[i])
	}
}

func earliestWin(card Card) int {
	win := math.MaxInt32
	for i, row := range card.rows {
		// Get row max index
		rowMax := math.MinInt32
		for _, v := range row {
			if v > rowMax {
				rowMax = v
			}
		}
		if rowMax < win {
			win = rowMax
		}
		// Get column max index
		colMax := math.MinInt32
		for j := range row {
			if card.rows[j][i] > colMax {
				colMax = card.rows[j][i]
			}
		}
		if colMax < win {
			win = colMax
		}

	}
	return win
}

func mapToCallIndex(data Bingo) {
	// Map calls to index
	indices := make(map[int]int)
	for i, val := range data.calls {
		indices[val] = i
	}

	// Apply to cards
	for i, card := range data.cards {
		for j, row := range card.rows {
			for k, val := range row {
				data.cards[i].rows[j][k] = indices[val]
			}
		}
	}
}

func getInput(day string, sample bool) Bingo {
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
	input := Bingo{}
	// Get calls
	for _, v := range strings.Split(data[0], ",") {
		n, err := strconv.Atoi(v)
		if err != nil {
			panic(err)
		}
		input.calls = append(input.calls, n)
	}
	// Get cards
	data = data[2:]
	for i := 0; i < len(data); i += 6 {
		input.cards = append(input.cards, newCard(data[i:i+5]))
	}
	return input
}

func newCard(data []string) Card {
	spacesRegex := regexp.MustCompile(`\s+`)
	card := Card{}
	for i, val := range data {
		line := strings.Split(strings.TrimSpace(spacesRegex.ReplaceAllString(val, " ")), " ")
		for j, v := range line {
			num, err := strconv.Atoi(v)
			if err != nil {
				panic(err)
			}
			card.rows[i][j] = num
		}

	}
	return card

}
