package api

import (
	"net/http"

	"github.com/RishiBuilds/NoteRoot/internal/noteroot"
	"github.com/gin-gonic/gin"
)

func SortPagesHandler(w *noteroot.NoteRoot) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var req struct {
			OrderedIds []string `json:"orderedIDs"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		if err := w.SortPages(id, req.OrderedIds); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to sort pages"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Pages sorted successfully"})
	}
}
