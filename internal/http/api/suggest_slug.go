package api

import (
	"net/http"

	"github.com/RishiBuilds/NoteRoot/internal/noteroot"
	"github.com/gin-gonic/gin"
)

func SuggestSlugHandler(w *noteroot.NoteRoot) gin.HandlerFunc {
	return func(c *gin.Context) {
		parentID := c.Query("parentID")
		title := c.Query("title")

		if title == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "title query param is required"})
			return
		}

		slug, err := w.SuggestSlug(parentID, title)
		if err != nil {
			respondWithError(c, err)
			return
		}

		c.JSON(http.StatusOK, gin.H{"slug": slug})
	}
}
