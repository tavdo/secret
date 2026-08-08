import { Modal } from './Modal.jsx';

export function DeleteConfirmModal({
  open,
  onClose,
  title,
  message,
  confirmLabel = 'წაშლა',
  onConfirm,
  danger = true,
}) {
  return (
    <Modal open={open} title={title} subtitle={message} onClose={onClose}>
      <div className="flex flex-wrap gap-3 justify-end">
        <button
          type="button"
          className="rounded-xl border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.2em] text-zinc-300 hover:bg-white/[0.04]"
          onClick={onClose}
        >
          გაუქმება
        </button>
        <button
          type="button"
          className={`rounded-xl px-5 py-2 text-xs uppercase tracking-[0.2em] ${
            danger
              ? 'bg-gradient-to-br from-rose-600 to-rose-800 text-white border border-rose-400/40'
              : 'bg-amber-500/90 text-black border border-amber-300'
          }`}
          onClick={async () => {
            await onConfirm?.();
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
