package api

import (
	"net/http"

	"github.com/RishiBuilds/NoteRoot/internal/noteroot"
	"github.com/gin-gonic/gin"
)

func GetTreeHandler(w *noteroot.NoteRoot) gin.HandlerFunc {
	return func(c *gin.Context) {
		tree := w.GetTree()
		c.JSON(http.StatusOK, ToAPINode(tree, ""))
	}
}
