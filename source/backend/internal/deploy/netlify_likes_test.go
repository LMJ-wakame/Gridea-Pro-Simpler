package deploy

import (
	"archive/zip"
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
)

func TestLikeFunctionPackagedAndUploadedWithDeploy(t *testing.T) {
	dir := t.TempDir()
	os.MkdirAll(filepath.Join(dir, "api"), 0755)
	os.WriteFile(filepath.Join(dir, "api", "likes-config.json"), []byte(`{"posts":["test"],"timezone":"Asia/Shanghai"}`), 0644)
	functions, err := prepareLikesFunction(dir)
	if err != nil {
		t.Fatal(err)
	}
	if len(functions) != 1 || len(functions[0].digest) != 64 {
		t.Fatal("missing function SHA256")
	}
	archive, err := zip.NewReader(bytes.NewReader(functions[0].body), int64(len(functions[0].body)))
	if err != nil {
		t.Fatal(err)
	}
	if len(archive.File) != 2 {
		t.Fatal("function archive must include handler and configuration")
	}
	uploaded := false
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Authorization") != "Bearer test-token" {
			t.Error("missing auth")
		}
		if r.Method == http.MethodPost {
			var payload struct {
				Functions map[string]string `json:"functions"`
			}
			json.NewDecoder(r.Body).Decode(&payload)
			if payload.Functions["gridea-likes"] != functions[0].digest {
				t.Error("wrong function manifest")
			}
			json.NewEncoder(w).Encode(map[string]any{"id": "test-deploy", "required": []string{}, "required_functions": []string{functions[0].digest}})
		} else {
			if r.URL.Path != "/deploys/test-deploy/functions/gridea-likes" || r.URL.Query().Get("runtime") != "js" {
				t.Error("wrong function upload endpoint")
			}
			uploaded = true
			w.WriteHeader(200)
		}
	}))
	defer server.Close()
	previous := netlifyAPIBase
	netlifyAPIBase = server.URL
	defer func() { netlifyAPIBase = previous }()
	_, _, err = NewNetlifyProvider("").createDeploy(context.Background(), "site", map[string]string{}, "test-token", functions...)
	if err != nil {
		t.Fatal(err)
	}
	if !uploaded {
		t.Fatal("required function not uploaded")
	}
}
