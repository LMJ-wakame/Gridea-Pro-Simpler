// Render an existing blog without launching the desktop UI or migrating its source files.
package main

import (
	"context"
	"fmt"
	"gridea-pro/backend/internal/engine"
	"gridea-pro/backend/internal/repository"
	"os"
	"path/filepath"
)

func main() {
	if len(os.Args) != 2 {
		fmt.Fprintln(os.Stderr, "Usage: render-site <blog-directory>")
		os.Exit(2)
	}
	dir, err := filepath.Abs(os.Args[1])
	if err != nil {
		panic(err)
	}
	e := engine.New(dir, repository.NewPostRepository(dir, nil), repository.NewThemeRepository(dir), repository.NewSettingRepository(dir))
	e.SetMenuRepo(repository.NewMenuRepository(dir))
	e.SetCommentRepo(repository.NewCommentRepository(dir))
	e.SetLinkRepo(repository.NewLinkRepository(dir))
	e.SetTagRepo(repository.NewTagRepository(dir))
	e.SetMemoRepo(repository.NewMemoRepository(dir))
	e.SetCategoryRepo(repository.NewCategoryRepository(dir))
	e.SetSeoSettingRepo(repository.NewSeoSettingRepository(dir))
	e.SetCdnSettingRepo(repository.NewCdnSettingRepository(dir))
	e.SetPwaSettingRepo(repository.NewPwaSettingRepository(dir))
	if err := e.RenderAll(context.Background()); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
