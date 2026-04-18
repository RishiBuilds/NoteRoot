package api

import "github.com/RishiBuilds/NoteRoot/internal/core/tree"

type Page struct {
	*tree.PageNode
	Content string `json:"content"`
	Path    string `json:"path"`
}
