package engine

import (
	"encoding/json"
	"fmt"
	"gridea-pro/backend/internal/template"
	"os"
	"path/filepath"
	"time"
	_ "time/tzdata"
)

func (s *Engine) renderLikesConfig(buildDir string, data *template.TemplateData) error {
	if data.Site.CustomConfig["likesEnabled"] != true {
		return nil
	}
	endpoint, _ := data.Site.CustomConfig["likesEndpoint"].(string)
	if endpoint != "" && endpoint != "/.netlify/functions/gridea-likes" {
		return nil
	}
	timezone, _ := data.Site.CustomConfig["likesTimezone"].(string)
	if timezone == "" {
		timezone = "Asia/Shanghai"
	}
	if _, err := time.LoadLocation(timezone); err != nil {
		return fmt.Errorf("invalid like reset timezone: %w", err)
	}
	ids := []string{}
	for _, post := range data.Posts {
		if post.Published {
			id := post.ID
			if id == "" {
				id = post.FileName
			}
			ids = append(ids, id)
		}
	}
	body, err := json.Marshal(map[string]any{"posts": ids, "timezone": timezone})
	if err != nil {
		return err
	}
	dir := filepath.Join(buildDir, "api")
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}
	return s.manifest.WriteFile(filepath.Join(dir, "likes-config.json"), body, 0644)
}
