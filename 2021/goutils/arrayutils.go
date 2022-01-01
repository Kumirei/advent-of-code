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

func ArrayProd(arr []int) int {
	prod := 1
	for _, v := range arr {
		prod *= v
	}
	return prod
}

func Pop(arr *[]int) int {
	last := (*arr)[len((*arr))-1]
	*arr = (*arr)[:len(*arr)-1]
	return last
}

func PopFirst(arr *[]int, keepLength bool) int {
	first := (*arr)[0]
	copy(*arr, (*arr)[1:])
	if !keepLength {
		*arr = (*arr)[:len(*arr)-1]
	}
	return first
}
