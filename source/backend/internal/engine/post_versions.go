package engine

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"gridea-pro/backend/internal/domain"
	"gridea-pro/backend/internal/template"
)

func versionLinks(post domain.Post, originalURL string) []template.PostVersionLink {
	links := []template.PostVersionLink{{Language: "", Label: "Original", Link: originalURL}}
	labels := map[string]string{"en": "English", "zh": "中文", "ja": "日本語", "ko": "한국어", "fr": "Français", "de": "Deutsch", "es": "Español", "pt": "Português", "ru": "Русский", "it": "Italiano", "zh-Hant": "繁體中文"}
	for _, v := range post.Versions {
		if strings.TrimSpace(v.Content) == "" {
			continue
		}
		label := labels[v.Language]
		if label == "" {
			label = v.Language
		}
		links = append(links, template.PostVersionLink{Language: v.Language, Label: label, Link: originalURL + "versions/" + v.Language + "/"})
	}
	if len(links) == 1 {
		return nil
	}
	return links
}

func (r *PageRenderer) renderPostVersions(ctx context.Context, postDir, templateName string, post domain.Post, original *template.TemplateData) error {
	for _, version := range post.Versions {
		if err := ctx.Err(); err != nil {
			return err
		}
		if strings.TrimSpace(version.Content) == "" {
			continue
		}
		translated := post
		translated.Content = version.Content
		translated.Abstract = ""
		if strings.TrimSpace(version.Title) != "" {
			translated.Title = version.Title
		}
		data := *original
		data.Post = r.dataBuilder.ConvertPost(translated, domain.ThemeConfig{PostPath: original.ThemeConfig.PostPath, TagPath: original.ThemeConfig.TagPath, DateFormat: original.ThemeConfig.DateFormat}, nil)
		data.Post.Language = version.Language
		data.Post.Versions = original.Post.Versions
		data.Post.Link = original.Post.Link + "versions/" + version.Language + "/"
		data.Post.RelatedPosts = original.Post.RelatedPosts
		data.Post.NextPost = original.Post.NextPost
		data.Post.PrevPost = original.Post.PrevPost
		data.SiteTitle = data.Post.Title + " | " + original.ThemeConfig.SiteName
		html, err := r.renderer.Render(templateName, &data)
		if err != nil {
			return fmt.Errorf("render version %s: %w", version.Language, err)
		}
		html = r.postProcess(html, "post", data.Post.Link, &data.Post)
		dir := filepath.Join(postDir, "versions", version.Language)
		if err := os.MkdirAll(dir, 0755); err != nil {
			return err
		}
		if err := r.manifest.WriteFile(filepath.Join(dir, FileIndexHTML), []byte(html), 0644); err != nil {
			return err
		}
	}
	return nil
}
