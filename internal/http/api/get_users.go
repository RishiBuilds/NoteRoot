package api

import (
	"net/http"

	"github.com/RishiBuilds/NoteRoot/internal/noteroot"
	"github.com/gin-gonic/gin"
)

func GetUsersHandler(wikiInstance *noteroot.NoteRoot) gin.HandlerFunc {
	return func(c *gin.Context) {
		users, err := wikiInstance.GetUsers()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load users"})
			return
		}

		c.JSON(http.StatusOK, users)
	}
}
