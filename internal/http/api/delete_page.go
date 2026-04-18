package api

import (
	"net/http"

	"github.com/RishiBuilds/NoteRoot/internal/noteroot"
	"github.com/gin-gonic/gin"
)

func DeletePageHandler(w *noteroot.NoteRoot) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		recursive := c.DefaultQuery("recursive", "false") == "true"

		if id == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "id is required"})
			return
		}

		if err := w.DeletePage(id, recursive); err != nil {
			respondWithError(c, err)
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Page deleted"})
	}
}
