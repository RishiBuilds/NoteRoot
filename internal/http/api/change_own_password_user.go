package api

import (
	"net/http"

	"github.com/RishiBuilds/NoteRoot/internal/core/auth"
	"github.com/RishiBuilds/NoteRoot/internal/noteroot"
	"github.com/gin-gonic/gin"
)

func ChangeOwnPasswordUserHandler(wikiInstance *noteroot.NoteRoot) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			OldPassword string `json:"old_password" binding:"required"`
			NewPassword string `json:"new_password" binding:"required"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
			return
		}
		// Get the user from the context
		userValue, exists := c.Get("user")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
			return
		}
		user, ok := userValue.(*auth.User)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user"})
			return
		}
		err := wikiInstance.ChangeOwnPassword(user.ID, req.OldPassword, req.NewPassword)
		if err != nil {
			respondWithError(c, err)
			return
		}

		c.Status(http.StatusNoContent)
	}
}
