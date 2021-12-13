package goutils

import (
	"math"
)

func Sign(v int) int {
	return -(BoolToInt(math.Signbit(float64(v)))*2 - 1)
}
