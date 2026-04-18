package api

import (
	"net/http"

	"github.com/RishiBuilds/NoteRoot/internal/noteroot"
	"github.com/gin-gonic/gin"
)

func ListAssetsHandler(w *noteroot.NoteRoot) gin.HandlerFunc {
	return func(c *gin.Context) {
		pageID := c.Param("id")

		assets, err := w.ListAssets(pageID)
		if err != nil {
			respondWithError(c, err)
			return
		}

		c.JSON(http.StatusOK, gin.H{"files": assets})
	}
}
