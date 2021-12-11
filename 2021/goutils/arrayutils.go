package goutils

import "math"

func ArraySum(arr []int) (sum int) {
	for _, v := range arr {
		sum += v
	}
	return
}

func ArrayMax(arr []int) int {
	max := math.MinInt32
	for _, v := range arr {
		if v > max {
			max = v
		}
	}
	return max
}
