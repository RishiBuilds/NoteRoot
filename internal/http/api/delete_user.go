package api

import (
	"net/http"

	"github.com/RishiBuilds/NoteRoot/internal/noteroot"
	"github.com/gin-gonic/gin"
)

func DeleteUserHandler(wikiInstance *noteroot.NoteRoot) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if err := wikiInstance.DeleteUser(id); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.Status(http.StatusNoContent)
	}
}
