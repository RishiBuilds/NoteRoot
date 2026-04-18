package main

import (
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/RishiBuilds/NoteRoot/internal/http"
	"github.com/RishiBuilds/NoteRoot/internal/noteroot"
)

func printUsage() {
	fmt.Println(`NoteRoot - Tree-based markdown documentation 🌳

	Usage:
	noteroot [--docs <DIR>] [--port <PORT>] [--host <HOST>] [--admin-password <PASSWORD>]
	noteroot reset-admin-password
	noteroot --help

	Options:
	--docs             Path to your Markdown directories (default: ./docs)
	--port             Port to run the server on (default: 8080)
	--host             Host interface to bind to (default: 0.0.0.0)
	--admin-password   Initial admin password (used only if no admin exists)
	--jwt-secret       Secret for signing auth tokens (JWT) (required for auth)

	Environment variables:
	NOTEROOT_DOCS
	NOTEROOT_PORT
	NOTEROOT_HOST
	NOTEROOT_ADMIN_PASSWORD
	NOTEROOT_JWT_SECRET
	`)
}

func main() {

	// Flags
	docsFlag := flag.String("docs", "", "path to your Markdown directories")
	portFlag := flag.String("port", "", "port to run the server on")
	hostFlag := flag.String("host", "", "host interface to bind to")
	adminPasswordFlag := flag.String("admin-password", "", "initial admin password")
	jwtSecretFlag := flag.String("jwt-secret", "", "JWT secret for authentication")
	flag.Parse()

	// Get config with environment fallbacks
	docsDir := getOrFallback(*docsFlag, "NOTEROOT_DOCS", "./docs")
	port := getOrFallback(*portFlag, "NOTEROOT_PORT", "8080")
	host := getOrFallback(*hostFlag, "NOTEROOT_HOST", "0.0.0.0")
	adminPassword := getOrFallback(*adminPasswordFlag, "NOTEROOT_ADMIN_PASSWORD", "admin")
	jwtSecret := getOrFallback(*jwtSecretFlag, "NOTEROOT_JWT_SECRET", "")

	// Check if docs directory exists
	if _, err := os.Stat(docsDir); os.IsNotExist(err) {
		if err := os.MkdirAll(docsDir, 0755); err != nil {
			log.Fatalf("Failed to create docs directory: %v", err)
		}
	}

	args := flag.Args()
	if len(args) > 0 {
		switch args[0] {
		case "reset-admin-password":
			// Note: No JWT secret needed for this command
			nr, err := noteroot.NewNoteRoot(docsDir, adminPassword, "")
			if err != nil {
				log.Fatalf("Failed to initialize NoteRoot: %v", err)
			}
			defer nr.Close()
			user, err := nr.ResetAdminUserPassword()
			if err != nil {
				log.Fatalf("Password reset failed: %v", err)
			}

			fmt.Println("Admin password reset successfully.")
			fmt.Printf("New password for user %s: %s\n", user.Username, user.Password)
			return
		case "--help", "-h", "help":
			printUsage()
			return
		default:
			fmt.Printf("Unknown command: %s\n\n", args[0])
			printUsage()
			return
		}
	}

	if jwtSecret == "" {
		log.Println("WARNING: JWT secret is empty. Authentication might be disabled or insecure.")
		log.Println("To resolve, set it using --jwt-secret or NOTEROOT_JWT_SECRET environment variable.")
	}

	// Initialize the core NoteRoot engine
	nr, err := noteroot.NewNoteRoot(docsDir, adminPassword, jwtSecret)
	if err != nil {
		log.Fatalf("Failed to initialize NoteRoot: %v", err)
	}
	defer nr.Close()

	router := http.NewRouter(nr)

	// Start server
	addr := fmt.Sprintf("%s:%s", host, port)
	fmt.Printf("🌳 NoteRoot started. Listening on http://%s\n", addr)
	fmt.Printf("📂 Serving documentation from: %s\n", docsDir)

	if err := router.Run(addr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func getOrFallback(flagVal, envVar, def string) string {
	if flagVal != "" {
		return flagVal
	}
	if env := os.Getenv(envVar); env != "" {
		return env
	}
	return def
}
