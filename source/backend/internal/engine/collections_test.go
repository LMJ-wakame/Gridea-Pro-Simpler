package engine

import (
	"gridea-pro/backend/internal/template"
	"testing"
)

func TestRelatedSharedTagsAndSingleFallback(t *testing.T) {
	mk := func(name string, tags ...string) template.PostView {
		p := template.PostView{FileName: name, Title: name, Link: "/post/" + name, Published: true}
		for _, tag := range tags {
			p.Tags = append(p.Tags, template.TagView{Slug: tag})
		}
		return p
	}
	current := mk("current", "a", "b")
	current.NextPost = &template.SimplePostView{FileName: "next", Title: "next"}
	hidden := mk("hidden", "a", "b")
	hidden.HideInList = true
	draft := mk("draft", "a", "b")
	draft.Published = false
	candidates := []template.PostView{current, mk("one", "a"), mk("two", "b", "a"), mk("unrelated"), hidden, draft}
	got := relatedPosts(current, candidates)
	if len(got) != 3 || got[0].FileName != "two" || got[1].FileName != "one" || got[2].FileName != "next" {
		t.Fatalf("unexpected related: %+v", got)
	}
	current.NextPost = &template.SimplePostView{FileName: "one"}
	if got := relatedPosts(current, candidates); len(got) != 2 {
		t.Fatalf("duplicate fallback: %+v", got)
	}
	if got := relatedPosts(mk("empty"), candidates); len(got) != 0 {
		t.Fatalf("unrelated posts included: %+v", got)
	}
}

func TestCollectionsIndependentAndSafe(t *testing.T) {
	posts := []template.PostView{
		{Collection: "../合集", Published: true, Categories: []template.CategoryView{{Name: "Original category"}}},
		{Collection: "../合集", Published: true},
		{Collection: "Other", Published: false},
		{Collection: "Hidden", Published: true, HideInList: true},
		{Collection: "", Published: true},
	}
	got := buildCollections(posts, "internal")
	if len(got) != 1 || got[0].Count != 2 || len(got[0].Slug) != 16 {
		t.Fatalf("invalid collections: %+v", got)
	}
	if posts[0].Categories[0].Name != "Original category" {
		t.Fatal("categories changed")
	}
	if got[0].Slug != buildCollections(posts[:1], "internal")[0].Slug {
		t.Fatal("unstable collection URL")
	}
}

func TestCollectionSlugURLsAreReadableAndUnique(t *testing.T) {
	posts := []template.PostView{
		{Collection: "A collection", Published: true},
		{Collection: "A collection!", Published: true},
		{Collection: "A-collection", Published: true},
		{Collection: "中文合集", Published: true},
	}
	got := buildCollections(posts, "slug")
	if got[0].Slug != "a-collection" || got[1].Slug != "a-collection-2" || got[2].Slug != "a-collection-3" || got[3].Slug == "" {
		t.Fatalf("unexpected slug collection URLs: %+v", got)
	}
}

func TestCollectionNextPostTakesFirstRelatedSlot(t *testing.T) {
	mk := func(name, collection string, tags ...string) template.PostView {
		p := template.PostView{FileName: name, Title: name, Link: "/post/" + name, Collection: collection, Published: true}
		for _, tag := range tags {
			p.Tags = append(p.Tags, template.TagView{Slug: tag})
		}
		return p
	}
	current := mk("current", "Reading list", "a")
	candidates := []template.PostView{current, mk("collection-next", "Reading list"), mk("tag-match", "", "a"), mk("later-collection", "Reading list", "a")}
	got := relatedPosts(current, candidates)
	if len(got) != 3 || got[0].FileName != "collection-next" || got[1].FileName != "tag-match" || got[2].FileName != "later-collection" {
		t.Fatalf("collection next should be first: %+v", got)
	}
}
