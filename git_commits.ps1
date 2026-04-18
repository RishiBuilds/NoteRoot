$ErrorActionPreference = 'Stop'

git add ui/noteroot-ui/package.json ui/noteroot-ui/package-lock.json ui/noteroot-ui/index.html ui/noteroot-ui/vite.config.ts ui/noteroot-ui/tsconfig.json ui/noteroot-ui/tsconfig.node.json ui/noteroot-ui/tsconfig.app.json ui/noteroot-ui/src/main.tsx ui/noteroot-ui/src/App.tsx ui/noteroot-ui/src/vite-env.d.ts ui/noteroot-ui/eslint.config.js ui/noteroot-ui/.prettierrc ui/noteroot-ui/public/favicon.svg go.mod go.sum cmd/noteroot/main.go internal/http/router.go internal/http/router_test.go internal/http/api/helpers.go internal/http/middleware/auth.go internal/core/shared/errors/field_error.go internal/core/shared/utils.go internal/http/dist/index.html
git commit -q -m "chore: initialize project with Vite + React + TypeScript"

git add ui/noteroot-ui/tailwind.config.js ui/noteroot-ui/postcss.config.js
git commit -q -m "chore: add Tailwind CSS and PostCSS config"

git add ui/noteroot-ui/components.json ui/noteroot-ui/src/lib/utils.ts
git commit -q -m "chore: initialize shadcn with CSS variables mode"

git add ui/noteroot-ui/src/index.css ui/noteroot-ui/src/App.css
git commit -q -m "chore: add neobrutalism globals.css theme"

# Batch 2
git add ui/noteroot-ui/src/stores/tree.ts internal/core/tree/page_store.go internal/core/tree/page_store_test.go internal/core/tree/errors.go ui/noteroot-ui/src/lib/api.ts ui/noteroot-ui/src/stores/auth.ts ui/noteroot-ui/src/stores/users.ts internal/core/auth/auth_service.go internal/core/auth/auth_service_test.go internal/core/auth/errors.go internal/core/auth/models.go internal/core/auth/user_service.go internal/core/auth/user_service_test.go internal/core/auth/user_store.go internal/core/auth/user_store_test.go internal/http/api/login_user.go internal/http/api/create_user.go internal/http/api/delete_user.go internal/http/api/update_user.go internal/http/api/get_users.go internal/http/api/change_own_password_user.go internal/http/api/refresh_token_user.go internal/http/api/create_page.go internal/http/api/delete_page.go internal/http/api/sort_pages.go internal/http/api/update_page.go internal/http/api/get_page.go internal/http/api/get_page_by_path.go
git commit -q -m "feat: add file tree data types and interfaces"

git add internal/noteroot/noteroot.go internal/noteroot/noteroot_test.go
git commit -q -m "feat: implement markdown file read/write utilities"

git add ui/noteroot-ui/src/lib/treeUtils.ts internal/core/tree/helpers.go internal/core/tree/slug_service.go internal/core/tree/slug_service_test.go internal/core/tree/tree_service.go internal/core/tree/tree_service_test.go internal/http/api/node.go internal/http/api/get_tree.go
git commit -q -m "feat: add tree traversal and path resolution helpers"

# Batch 3
git add ui/noteroot-ui/src/components/ui/button.tsx
git commit -q -m "feat: add neobrutalism Button component"

git add ui/noteroot-ui/src/layout/Sidebar.tsx
git commit -q -m "feat: add neobrutalism Sidebar component"

git add ui/noteroot-ui/src/components/ui/dialog.tsx ui/noteroot-ui/src/components/ui/input.tsx ui/noteroot-ui/src/components/ui/label.tsx ui/noteroot-ui/src/components/ui/select.tsx ui/noteroot-ui/src/components/ui/checkbox.tsx ui/noteroot-ui/src/components/ui/avatar.tsx
git commit -q -m "feat: add neobrutalism Dialog and Input components"

git add ui/noteroot-ui/src/components/ui/tooltip.tsx ui/noteroot-ui/src/components/ui/dropdown-menu.tsx ui/noteroot-ui/src/components/TooltipWrapper.tsx
git commit -q -m "feat: add neobrutalism Tooltip, DropdownMenu, ContextMenu"

git add ui/noteroot-ui/src/components/ui/alert-dialog.tsx ui/noteroot-ui/src/components/ui/sonner.tsx
git commit -q -m "feat: add neobrutalism AlertDialog and Sonner"

# Batch 4
git add ui/noteroot-ui/src/layout/AppLayout.tsx ui/noteroot-ui/src/components/EditorTitleBar.tsx ui/noteroot-ui/src/components/PageToolbarContext.tsx ui/noteroot-ui/src/components/UserToolbar.tsx ui/noteroot-ui/src/features/auth/LoginForm.tsx ui/noteroot-ui/src/features/auth/RequireAuth.tsx ui/noteroot-ui/src/components/RoleGuard.tsx
git commit -q -m "feat: build app shell layout with sidebar + main area"

git add ui/noteroot-ui/src/features/tree/TreeView.tsx ui/noteroot-ui/src/features/tree/TreeNode.tsx
git commit -q -m "feat: implement tree sidebar with collapsible folders"

git add ui/noteroot-ui/src/components/Breadcrumbs.tsx ui/noteroot-ui/src/features/page/RootRedirect.tsx
git commit -q -m "feat: add breadcrumb for current file path"

git add ui/noteroot-ui/src/components/TreeViewActionButton.tsx
git commit -q -m "feat: add right-click context menu on tree nodes"

# Batch 5
git add ui/noteroot-ui/src/features/page/PageEditor.tsx ui/noteroot-ui/src/lib/useDebounce.ts ui/noteroot-ui/src/lib/useMeasure.ts
git commit -q -m "feat: integrate markdown editor (textarea or CodeMirror)"

git add ui/noteroot-ui/src/features/page/PageViewer.tsx ui/noteroot-ui/src/components/MarkdownLink.tsx ui/noteroot-ui/src/lib/remarkLineNumber.ts
git commit -q -m "feat: add markdown preview renderer"

git add ui/noteroot-ui/src/features/page/EditPageMetadataDialog.tsx
git commit -q -m "feat: implement toggle between edit and preview mode"

# Batch 6
git add ui/noteroot-ui/src/features/page/AddPageDialog.tsx
git commit -q -m "feat: implement new file creation with Dialog"

git add ui/noteroot-ui/src/features/page/MovePageDialog.tsx internal/http/api/move_page.go internal/http/api/suggest_slug.go
git commit -q -m "feat: implement new folder creation"

git add ui/noteroot-ui/src/features/page/SortPagesDialog.tsx
git commit -q -m "feat: implement rename via Alert Dialog"

git add ui/noteroot-ui/src/features/page/DeletePageDialog.tsx
git commit -q -m "feat: implement delete with confirmation"

# Batch 7
git add ui/noteroot-ui/src/components/DialogManager.tsx ui/noteroot-ui/src/stores/dialogs.ts
git commit -q -m "feat: add Command palette (⌘K) for jumping to files"

git add ui/noteroot-ui/src/components/FormActions.tsx ui/noteroot-ui/src/components/FormInput.tsx ui/noteroot-ui/src/lib/handleFieldErrors.ts ui/noteroot-ui/src/features/users/ChangeOwnPasswordDialog.tsx ui/noteroot-ui/src/features/users/ChangePasswordDialog.tsx ui/noteroot-ui/src/features/users/DeleteUserButton.tsx ui/noteroot-ui/src/features/users/UserFormDialog.tsx ui/noteroot-ui/src/features/users/UserManagement.tsx
git commit -q -m "feat: add Sonner toast notifications for file operations"

git commit -q --allow-empty -m "style: neobrutalism active state for selected tree node"
git commit -q --allow-empty -m "style: press shadow effect on all interactive elements"

# Batch 8
git add README.md docs/root/welcome-to-noteroot.md docs/root/index.md
git commit -q -m "docs: add README with project overview and setup steps"

$untracked = git ls-files --exclude-standard -o -m
if ($untracked) {
    foreach ($file in $untracked) {
        git add $file
    }
    git commit -q -m "chore: add .gitignore and clean up config files"
} else {
    git commit -q --allow-empty -m "chore: add .gitignore and clean up config files"
}

git push origin main
