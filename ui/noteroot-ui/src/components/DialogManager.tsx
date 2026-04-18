import { useDialogsStore } from '@/stores/dialogs'
import AddPageDialog from '@/features/page/AddPageDialog'
import DeletePageDialog from '@/features/page/DeletePageDialog'
import EditPageMetadataDialog from '@/features/page/EditPageMetadataDialog'
import MovePageDialog from '@/features/page/MovePageDialog'
import SortPagesDialog from '@/features/page/SortPagesDialog'
import UserFormDialog from '@/features/users/UserFormDialog'
import ChangeOwnPasswordDialog from '@/features/users/ChangeOwnPasswordDialog'
import ChangePasswordDialog from '@/features/users/ChangePasswordDialog'

export function DialogManger() {
  const { dialogType, dialogProps, closeDialog } = useDialogsStore()

  if (!dialogType) return null

  switch (dialogType) {
    case 'add':
      return (
        <AddPageDialog
          parentId={dialogProps?.parentId}
          onClose={closeDialog}
        />
      )
    case 'delete':
      return (
        <DeletePageDialog
          pageId={dialogProps?.pageId}
          pageTitle={dialogProps?.pageTitle}
          hasChildren={dialogProps?.hasChildren}
          onClose={closeDialog}
        />
      )
    case 'editMeta':
      return (
        <EditPageMetadataDialog
          pageId={dialogProps?.pageId}
          currentTitle={dialogProps?.currentTitle}
          currentSlug={dialogProps?.currentSlug}
          onClose={closeDialog}
        />
      )
    case 'move':
      return (
        <MovePageDialog
          pageId={dialogProps?.pageId}
          onClose={closeDialog}
        />
      )
    case 'sort':
      return (
        <SortPagesDialog
          parent={dialogProps?.parent}
          onClose={closeDialog}
        />
      )
    case 'userForm':
      return (
        <UserFormDialog
          user={dialogProps?.user}
          onClose={closeDialog}
        />
      )
    case 'changeOwnPassword':
      return <ChangeOwnPasswordDialog onClose={closeDialog} />
    case 'changePassword':
      return (
        <ChangePasswordDialog
          userId={dialogProps?.userId}
          username={dialogProps?.username}
          onClose={closeDialog}
        />
      )
    default:
      return null
  }
}
