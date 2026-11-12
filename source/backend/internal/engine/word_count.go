package engine

import (
	"gridea-pro/backend/internal/utils"
	"unicode"
)

// Count visible CJK characters individually and other letter/number runs as words.
func visibleWordCount(markdown string) int {
	text := stripHTMLForSearch(utils.ToHTMLUnsafe(markdown))
	count := 0
	inWord := false
	for _, r := range text {
		if unicode.In(r, unicode.Han, unicode.Hiragana, unicode.Katakana, unicode.Hangul) {
			count++
			inWord = false
			continue
		}
		if unicode.IsLetter(r) || unicode.IsNumber(r) {
			if !inWord {
				count++
			}
			inWord = true
		} else if r != '\'' && r != '’' {
			inWord = false
		}
	}
	return count
}
