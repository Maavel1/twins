export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[120] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-gray-950">{toast.title}</div>
          {toast.text && <div className="mt-1 text-xs leading-relaxed text-gray-500">{toast.text}</div>}
        </div>
        <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-xs font-semibold text-gray-400 hover:bg-gray-50 hover:text-gray-700">
          OK
        </button>
      </div>
    </div>
  );
}
