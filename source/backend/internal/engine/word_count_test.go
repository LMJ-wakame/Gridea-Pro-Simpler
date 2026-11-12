package engine

import "testing"

func TestVisibleWordCount(t *testing.T) {
	if got := visibleWordCount("# 中文 **hello world**\n\n[链接](https://example.com/ignored) ![alt](image.png)"); got != 6 {
		t.Fatalf("got %d visible words, want 6", got)
	}
}
