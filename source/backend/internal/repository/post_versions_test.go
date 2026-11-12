package repository

import (
	"context"
	"gridea-pro/backend/internal/domain"
	"reflect"
	"testing"
)

func TestVersionsRoundTrip(t *testing.T) {
	dir := t.TempDir()
	ctx := context.Background()
	repo := NewPostRepository(dir, nil)
	p := &domain.Post{Title: "原文", FileName: "versions-test", Content: "# 原文\n\n不要改变正文。", Versions: []domain.PostVersion{
		{Language: "en", Title: "English: title", Content: "# English\n\n---\n\nMath: \\(x+1\\)\n\n![caption](/image.png)\n"},
		{Language: "ja", Title: "日本語", Content: "# 日本語\n本文"},
	}}
	if err := repo.Create(ctx, p); err != nil {
		t.Fatal(err)
	}
	reopened := NewPostRepository(dir, nil)
	got, err := reopened.GetByFileName(ctx, p.FileName)
	if err != nil {
		t.Fatal(err)
	}
	if got.Content != p.Content || !reflect.DeepEqual(got.Versions, p.Versions) {
		t.Fatalf("lost content: %#v", got)
	}
	got.Versions = nil
	if err := reopened.Update(ctx, got); err != nil {
		t.Fatal(err)
	}
	reloaded, err := NewPostRepository(dir, nil).GetByFileName(ctx, p.FileName)
	if err != nil {
		t.Fatal(err)
	}
	if len(reloaded.Versions) != 0 || reloaded.Content != p.Content {
		t.Fatal("removing versions changed original or retained versions")
	}
}
