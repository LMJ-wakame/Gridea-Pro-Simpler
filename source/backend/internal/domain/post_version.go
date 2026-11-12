package domain

import (
	"fmt"
	"regexp"
	"strings"
)

// PostVersion stores author-written Markdown separately from the original body.
type PostVersion struct {
	Language string `json:"language" yaml:"language"`
	Title    string `json:"title" yaml:"title"`
	Content  string `json:"content" yaml:"content"`
}

var languageCode = regexp.MustCompile(`^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$`)

func ValidatePostVersions(versions []PostVersion) error {
	seen := map[string]bool{}
	for _, version := range versions {
		key := strings.ToLower(version.Language)
		if !languageCode.MatchString(version.Language) {
			return fmt.Errorf("invalid version language: %q", version.Language)
		}
		if seen[key] {
			return fmt.Errorf("duplicate version language: %s", version.Language)
		}
		seen[key] = true
	}
	return nil
}
