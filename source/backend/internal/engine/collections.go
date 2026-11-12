package engine

import (
	"context"
	"crypto/sha256"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"gridea-pro/backend/internal/template"
	"gridea-pro/backend/internal/utils"
)

// collectionURLMode controls the public collection address. "internal" is the
// stable default; "slug" makes a readable URL from the collection name.
func buildCollections(posts []template.PostView, collectionURLMode string) []template.CollectionView {
	result := []template.CollectionView{}
	indexes := map[string]int{}
	usedSlugs := map[string]struct{}{}
	for _, p := range posts {
		name := strings.TrimSpace(p.Collection)
		if name == "" || p.HideInList || !p.Published {
			continue
		}
		idx, ok := indexes[name]
		if !ok {
			idx = len(result)
			indexes[name] = idx
			slug := collectionPathPart(name, collectionURLMode, usedSlugs)
			usedSlugs[slug] = struct{}{}
			result = append(result, template.CollectionView{Name: name, Slug: slug, Link: "/collection/" + slug + "/", Posts: []template.PostView{}})
		}
		result[idx].Posts = append(result[idx].Posts, p)
		result[idx].Count++
	}
	sort.SliceStable(result, func(i, j int) bool { return result[i].Name < result[j].Name })
	return result
}

func collectionPathPart(name, mode string, used map[string]struct{}) string {
	if mode != "slug" {
		return fmt.Sprintf("%x", sha256.Sum256([]byte(name)))[:16]
	}

	base := utils.SlugifyName(name)
	if base == "" {
		base = "collection"
	}
	for suffix := 1; ; suffix++ {
		candidate := base
		if suffix > 1 {
			candidate = fmt.Sprintf("%s-%d", base, suffix)
		}
		if _, exists := used[candidate]; !exists {
			return candidate
		}
	}
}

func (r *PageRenderer) RenderCollections(ctx context.Context, buildDir string, data *template.TemplateData) error {
	if data.Site.CustomConfig["collectionsEnabled"] != true {
		return nil
	}
	page := *data
	mode, _ := data.Site.CustomConfig["collectionURLFormat"].(string)
	page.Collections = buildCollections(data.Posts, mode)
	page.SiteTitle = "Collections | " + data.ThemeConfig.SiteName
	if err := ctx.Err(); err != nil {
		return err
	}
	html, err := r.renderer.Render("collections", &page)
	if err != nil {
		return fmt.Errorf("render collections: %w", err)
	}
	dir := filepath.Join(buildDir, "collections")
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}
	if err := r.manifest.WriteFile(filepath.Join(dir, FileIndexHTML), []byte(r.postProcess(html, "collections", "/collections/", nil)), 0644); err != nil {
		return err
	}
	for _, collection := range page.Collections {
		detail := page
		detail.Collection = collection
		detail.SiteTitle = collection.Name + " | " + data.ThemeConfig.SiteName
		dir := filepath.Join(buildDir, "collection", collection.Slug)
		if err := r.renderPaginated(ctx, paginatedRenderConfig{templateName: "collection", baseURL: collection.Link, firstPageDir: dir, pageBaseDir: dir, pageSize: pageSize(data.ThemeConfig.PostPageSize, 10), items: collection.Posts, baseData: &detail}); err != nil {
			return err
		}
	}
	return nil
}

func relatedPosts(post template.PostView, candidates []template.PostView) []template.SimplePostView {
	type ranked struct {
		post  template.PostView
		score int
	}
	tags := map[string]bool{}
	for _, tag := range post.Tags {
		tags[tag.Slug] = true
	}
	matches := []ranked{}
	for _, candidate := range candidates {
		if candidate.FileName == post.FileName || candidate.HideInList || !candidate.Published {
			continue
		}
		seen := map[string]bool{}
		score := 0
		for _, tag := range candidate.Tags {
			if tags[tag.Slug] && !seen[tag.Slug] {
				score++
				seen[tag.Slug] = true
			}
		}
		if score > 0 {
			matches = append(matches, ranked{candidate, score})
		}
	}
	sort.SliceStable(matches, func(i, j int) bool {
		if matches[i].score != matches[j].score {
			return matches[i].score > matches[j].score
		}
		return matches[i].post.Date.After(matches[j].post.Date)
	})
	result := []template.SimplePostView{}
	// A collection is an explicit reading sequence. Its next visible post takes
	// the first related slot; ordinary posts retain the original global fallback.
	if collection := strings.TrimSpace(post.Collection); collection != "" {
		foundCurrent := false
		for _, candidate := range candidates {
			if candidate.FileName == post.FileName {
				foundCurrent = true
				continue
			}
			if foundCurrent && strings.TrimSpace(candidate.Collection) == collection && !candidate.HideInList && candidate.Published {
				result = append(result, template.SimplePostView{Title: candidate.Title, Link: candidate.Link, FileName: candidate.FileName})
				break
			}
		}
	}
	for _, match := range matches {
		if len(result) == 3 {
			break
		}
		p := match.post
		duplicate := false
		for _, existing := range result {
			if existing.FileName == p.FileName {
				duplicate = true
				break
			}
		}
		if duplicate {
			continue
		}
		result = append(result, template.SimplePostView{Title: p.Title, Link: p.Link, FileName: p.FileName})
	}
	if strings.TrimSpace(post.Collection) == "" && len(result) < 3 && post.NextPost != nil {
		duplicate := false
		for _, p := range result {
			if p.FileName == post.NextPost.FileName {
				duplicate = true
			}
		}
		if !duplicate {
			result = append(result, *post.NextPost)
		}
	}
	return result
}
