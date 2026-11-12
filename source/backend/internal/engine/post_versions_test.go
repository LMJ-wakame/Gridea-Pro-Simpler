package engine

import (
	"gridea-pro/backend/internal/domain"
	"strings"
	"testing"
)

func TestVersionLinksAndMarkdown(t *testing.T) {
	p := domain.Post{FileName: "hello", Title: "Original", Content: "Original text", Versions: []domain.PostVersion{
		{Language: "en", Title: "English", Content: "# Heading\n\nMath \\(x+1\\)"},
		{Language: "ja", Content: "  "},
	}}
	b := newTestBuilder()
	view := b.ConvertPost(p, domain.ThemeConfig{PostPath: "articles"}, nil)
	if len(view.Versions) != 2 || view.Versions[1].Link != "/articles/hello/versions/en/" {
		t.Fatalf("bad links: %#v", view.Versions)
	}
	translated := p
	translated.Content = p.Versions[0].Content
	v := b.ConvertPost(translated, domain.ThemeConfig{}, nil)
	if !strings.Contains(string(v.Content), "<h1") || !strings.Contains(string(v.Content), `class="katex`) {
		t.Fatalf("markdown/math failed: %s", v.Content)
	}
	if !strings.Contains(string(view.Content), "Original text") {
		t.Fatal("original overwritten")
	}
}
