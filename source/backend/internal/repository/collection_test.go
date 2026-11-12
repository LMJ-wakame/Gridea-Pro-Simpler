package repository

import (
	"context"
	"gridea-pro/backend/internal/domain"
	"strings"
	"testing"
)

func TestCollectionRoundTripPreservesContent(t *testing.T) {
	ctx := context.Background()
	dir := t.TempDir()
	repo := NewPostRepository(dir, nil)
	original := domain.Post{Title: "原文", FileName: "example", Collection: "A collection", Content: "Original 正文\n\n```go\nhello()\n```\n", Categories: []string{"Original category"}, Tags: []string{"Original tag"}}
	if err := repo.Create(ctx, &original); err != nil {
		t.Fatal(err)
	}
	repo = NewPostRepository(dir, nil)
	post, err := repo.GetByFileName(ctx, "example")
	if err != nil {
		t.Fatal(err)
	}
	if post.Collection != "A collection" || post.Content != strings.TrimSpace(original.Content) || post.Categories[0] != original.Categories[0] || post.Tags[0] != original.Tags[0] {
		t.Fatalf("round trip changed data: %+v", post)
	}
	post.Collection = ""
	if err := repo.Update(ctx, post); err != nil {
		t.Fatal(err)
	}
	reloaded, err := NewPostRepository(dir, nil).GetByFileName(ctx, "example")
	if err != nil {
		t.Fatal(err)
	}
	if reloaded.Collection != "" || reloaded.Content != post.Content {
		t.Fatal("clearing collection changed content")
	}
}
