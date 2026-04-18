package noteroot

import (
	"fmt"
	"log"
	"mime/multipart"
	"regexp"

	"github.com/RishiBuilds/NoteRoot/internal/core/assets"
	"github.com/RishiBuilds/NoteRoot/internal/core/auth"
	"github.com/RishiBuilds/NoteRoot/internal/core/shared/errors"
	"github.com/RishiBuilds/NoteRoot/internal/core/tree"
)

type NoteRoot struct {
	tree       *tree.TreeService
	slug       *tree.SlugService
	auth       *auth.AuthService
	user       *auth.UserService
	asset      *assets.AssetService
	storageDir string
}

// Email-RegEx (Basic-Check, nicht RFC-konform, aber gut genug)
var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)
var defaultAdminPassword = "admin"

func NewNoteRoot(storageDir string, adminPassword string, jwtSecret string) (*NoteRoot, error) {
	// Initialize the user store
	store, err := auth.NewUserStore(storageDir)
	if err != nil {
		return nil, err
	}

	if adminPassword == "" {
		adminPassword = defaultAdminPassword
	}

	// Initialize the user service
	userService := auth.NewUserService(store)
	if err := userService.InitDefaultAdmin(adminPassword); err != nil {
		return nil, err
	}

	// Initialize the auth service
	authService := auth.NewAuthService(userService, jwtSecret)

	// Initialize the tree service
	treeService := tree.NewTreeService(storageDir)
	if err := treeService.LoadTree(); err != nil {
		return nil, err
	}

	slugService := tree.NewSlugService()

	assetService := assets.NewAssetService(storageDir, slugService)

	// Initialize the NoteRoot service
	nr := &NoteRoot{
		tree:       treeService,
		slug:       slugService,
		user:       userService,
		auth:       authService,
		asset:      assetService,
		storageDir: storageDir,
	}

	// Ensure the welcome page exists
	if err := nr.EnsureWelcomePage(); err != nil {
		return nil, err
	}

	return nr, nil
}

func (nr *NoteRoot) EnsureWelcomePage() error {
	_, err := nr.tree.GetPage("root")
	if err == nil {
		return nil
	}

	if len(nr.tree.GetTree().Children) > 0 {
		return nil
	}

	p, err := nr.CreatePage(nil, "Welcome to NoteRoot", "welcome-to-noteroot")
	if err != nil {
		return err
	}

	// Set the content of the welcome page
	content := `This is your personal, lightweight Markdown wiki.  
You can write, edit, and structure pages – all in a simple tree layout.

---

## Features

- **Live Markdown editor** with preview
- **Tree-based navigation**
- **Per-page assets** like images and files
- **No database** – just clean files
- **Single Go binary** – easy to run

---

## Tips

- Click the + button to create new pages or folders
- Double-click an asset to insert it into the editor
- Use Markdown for formatting, like:

` + "```" + `md
- Lists
- **Bold**
` + "- `Inline code` \n```\n\n" + "Enjoy writing!"

	if _, err := nr.UpdatePage(p.ID, p.Title, p.Slug, content); err != nil {
		return err
	}

	return nil
}

func (nr *NoteRoot) GetTree() *tree.PageNode {
	return nr.tree.GetTree()
}

func (nr *NoteRoot) CreatePage(parentID *string, title string, slug string) (*tree.Page, error) {
	ve := errors.NewValidationErrors()

	if title == "" {
		ve.Add("title", "Title must not be empty")
	}

	if err := nr.slug.IsValidSlug(slug); err != nil {
		ve.Add("slug", err.Error())
	}

	if ve.HasErrors() {
		return nil, ve
	}

	// Check if the parentID exists
	if parentID != nil && *parentID != "" {
		var err error
		_, err = nr.tree.FindPageByID(nr.tree.GetTree().Children, *parentID)
		if err != nil {
			return nil, err
		}
	}

	id, err := nr.tree.CreatePage(parentID, title, slug)
	if err != nil {
		return nil, err
	}

	return nr.tree.GetPage(*id)
}

func (nr *NoteRoot) UpdatePage(id, title, slug, content string) (*tree.Page, error) {
	err := nr.tree.UpdatePage(id, title, slug, content)
	if err != nil {
		return nil, err
	}

	return nr.tree.GetPage(id)
}

func (nr *NoteRoot) DeletePage(id string, recursive bool) error {
	page, err := nr.tree.GetPage(id)
	if err != nil {
		return err
	}

	if err := nr.tree.DeletePage(id, recursive); err != nil {
		return err
	}

	if err := nr.asset.DeleteAllAssetsForPage(page.PageNode); err != nil {
		log.Printf("warning: could not delete assets for page %s: %v", page.ID, err)
	}

	return nil
}

func (nr *NoteRoot) MovePage(id, parentID string) error {
	return nr.tree.MovePage(id, parentID)
}

func (nr *NoteRoot) SortPages(parentID string, orderedIDs []string) error {
	return nr.tree.SortPages(parentID, orderedIDs)
}

func (nr *NoteRoot) GetPage(id string) (*tree.Page, error) {
	return nr.tree.GetPage(id)
}

func (nr *NoteRoot) FindByPath(route string) (*tree.Page, error) {
	return nr.tree.FindPageByRoutePath(nr.tree.GetTree().Children, route)
}

func (nr *NoteRoot) SuggestSlug(parentID string, title string) (string, error) {
	// if no parentID is set or it's the root page
	// We don't need to look for a page id
	if parentID == "" || parentID == "root" {
		return nr.slug.GenerateUniqueSlug(nr.tree.GetTree(), title), nil
	}

	parent, err := nr.tree.FindPageByID(nr.tree.GetTree().Children, parentID)
	if err != nil {
		return "", fmt.Errorf("parent not found: %w", err)
	}

	return nr.slug.GenerateUniqueSlug(parent, title), nil
}

func (nr *NoteRoot) Login(identifier, password string) (*auth.AuthToken, error) {
	return nr.auth.Login(identifier, password)
}

func (nr *NoteRoot) RefreshToken(token string) (*auth.AuthToken, error) {
	return nr.auth.RefreshToken(token)
}

func (nr *NoteRoot) CreateUser(username, email, password, role string) (*auth.PublicUser, error) {
	ve := errors.NewValidationErrors()
	if username == "" {
		ve.Add("username", "Username must not be empty")
	}
	if email == "" {
		ve.Add("email", "Email must not be empty")
	} else if !emailRegex.MatchString(email) {
		ve.Add("email", "Email is not valid")
	}
	if password == "" {
		ve.Add("password", "Password must not be empty")
	} else if len(password) < 8 {
		ve.Add("password", "Password must be at least 8 characters long")
	}
	if !auth.IsValidRole(role) {
		ve.Add("role", "Invalid role")
	}

	if ve.HasErrors() {
		return nil, ve
	}

	user, err := nr.user.CreateUser(username, email, password, role)
	if err != nil {
		return nil, err
	}

	return user.ToPublicUser(), nil
}

func (nr *NoteRoot) UpdateUser(id, username, email, password, role string) (*auth.PublicUser, error) {

	ve := errors.NewValidationErrors()
	if username == "" {
		ve.Add("username", "Username must not be empty")
	}
	if email == "" {
		ve.Add("email", "Email must not be empty")
	} else if !emailRegex.MatchString(email) {
		ve.Add("email", "Email is not valid")
	}
	if !auth.IsValidRole(role) {
		ve.Add("role", "Invalid role")
	}

	if ve.HasErrors() {
		return nil, ve
	}

	user, err := nr.user.UpdateUser(id, username, email, password, role)
	if err != nil {
		return nil, err
	}

	return user.ToPublicUser(), nil
}

func (nr *NoteRoot) ChangeOwnPassword(id, oldPassword, newPassword string) error {
	ve := errors.NewValidationErrors()
	if newPassword == "" {
		ve.Add("newPassword", "New password must not be empty")
	} else if len(newPassword) < 8 {
		ve.Add("newPassword", "New password must be at least 8 characters long")
	}

	_, err := nr.GetUserService().DoesIDAndPasswordMatch(id, oldPassword)
	if err != nil {
		ve.Add("oldPassword", "Old password is incorrect")
	}

	if ve.HasErrors() {
		return ve
	}

	return nr.user.ChangeOwnPassword(id, oldPassword, newPassword)
}

func (nr *NoteRoot) DeleteUser(id string) error {
	return nr.user.DeleteUser(id)
}

func (nr *NoteRoot) UpdatePassword(id, password string) error {
	return nr.user.UpdatePassword(id, password)
}

func (nr *NoteRoot) GetUsers() ([]*auth.PublicUser, error) {
	users, err := nr.user.GetUsers()
	if err != nil {
		return nil, err
	}

	publicUsers := make([]*auth.PublicUser, len(users))
	for i, user := range users {
		publicUsers[i] = user.ToPublicUser()
	}

	return publicUsers, nil
}

func (nr *NoteRoot) GetUserByID(id string) (*auth.PublicUser, error) {
	user, err := nr.user.GetUserByID(id)
	if err != nil {
		return nil, err
	}

	return user.ToPublicUser(), nil
}

func (nr *NoteRoot) ResetAdminUserPassword() (*auth.User, error) {
	adminUser, err := nr.user.ResetAdminUserPassword()
	if err != nil {
		return nil, err
	}

	return adminUser, nil
}

func (nr *NoteRoot) UploadAsset(pageID string, file multipart.File, filename string) (string, error) {
	page, err := nr.tree.FindPageByID(nr.tree.GetTree().Children, pageID)
	if err != nil {
		return "", err
	}
	return nr.asset.SaveAssetForPage(page, file, filename)
}

func (nr *NoteRoot) ListAssets(pageID string) ([]string, error) {
	page, err := nr.tree.FindPageByID(nr.tree.GetTree().Children, pageID)
	if err != nil {
		return nil, err
	}
	return nr.asset.ListAssetsForPage(page)
}

func (nr *NoteRoot) DeleteAsset(pageID string, filename string) error {
	page, err := nr.tree.FindPageByID(nr.tree.GetTree().Children, pageID)
	if err != nil {
		return err
	}
	return nr.asset.DeleteAsset(page, filename)
}

func (nr *NoteRoot) GetUserService() *auth.UserService {
	return nr.user
}

func (nr *NoteRoot) GetAuthService() *auth.AuthService {
	return nr.auth
}

func (nr *NoteRoot) GetAssetService() *assets.AssetService {
	return nr.asset
}

func (nr *NoteRoot) GetStorageDir() string {
	return nr.storageDir
}

func (nr *NoteRoot) Close() error {
	return nr.user.Close()
}

