/**
 * Handles closing a dialog via cancel button or backdrop click.
 */
export function handleCloseDialog(dialog, cancelId, customCallback) {
  // Close dialog on close btn click
  dialog.querySelector(cancelId).addEventListener("click", () => {
    dialog.close();
  });
  // Close dialog on backdrop click
  dialog.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
      e.stopPropagation();
      const dialogBox = e.target.getBoundingClientRect();
      if (
        dialogBox.left > e.clientX ||
        dialogBox.right < e.clientX ||
        dialogBox.top > e.clientY ||
        dialogBox.bottom < e.clientY
      ) {
        dialog.close();
      }
    }
  });

  customCallback?.();

  return dialog;
}
