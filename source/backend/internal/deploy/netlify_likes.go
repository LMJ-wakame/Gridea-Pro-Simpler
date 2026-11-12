package deploy

import (
	"archive/zip"
	"bytes"
	"context"
	"crypto/sha256"
	_ "embed"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
)

//go:embed likes/gridea-likes.js
var netlifyLikesCode []byte

type netlifyFunction struct {
	name   string
	digest string
	body   []byte
}

func prepareLikesFunction(outputDir string) ([]netlifyFunction, error) {
	config, err := os.ReadFile(filepath.Join(outputDir, "api", "likes-config.json"))
	if os.IsNotExist(err) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	if !json.Valid(config) {
		return nil, fmt.Errorf("invalid generated likes configuration")
	}
	var buffer bytes.Buffer
	archive := zip.NewWriter(&buffer)
	for _, file := range []struct {
		name string
		data []byte
	}{{"gridea-likes.js", netlifyLikesCode}, {"config.json", config}} {
		entry, err := archive.Create(file.name)
		if err != nil {
			return nil, err
		}
		if _, err = entry.Write(file.data); err != nil {
			return nil, err
		}
	}
	if err := archive.Close(); err != nil {
		return nil, err
	}
	body := buffer.Bytes()
	return []netlifyFunction{{name: "gridea-likes", digest: fmt.Sprintf("%x", sha256.Sum256(body)), body: body}}, nil
}

func (p *NetlifyProvider) uploadFunction(ctx context.Context, deployID, token string, function netlifyFunction) error {
	endpoint := fmt.Sprintf("%s/deploys/%s/functions/%s?runtime=js", netlifyAPIBase, deployID, function.name)
	request := func() (*http.Request, error) {
		req, err := http.NewRequestWithContext(ctx, http.MethodPut, endpoint, bytes.NewReader(function.body))
		if err != nil {
			return nil, err
		}
		req.Header.Set("Authorization", "Bearer "+token)
		req.Header.Set("Content-Type", "application/octet-stream")
		return req, nil
	}
	response, err := DoHTTPWithRetry(ctx, p.client, request, HTTPRetryPolicy{MaxAttempts: 3}, nil)
	if err != nil {
		return err
	}
	defer response.Body.Close()
	if response.StatusCode < 200 || response.StatusCode >= 300 {
		body, _ := io.ReadAll(response.Body)
		return fmt.Errorf("upload like function HTTP %d: %s", response.StatusCode, body)
	}
	return nil
}
