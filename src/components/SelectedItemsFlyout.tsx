import { useSelectedItemsStore } from "../store/selectedItemsStore";
import { downloadProductsCsv } from "../utils/csv";

function SelectedItemsFlyout() {
  const selectedItems = useSelectedItemsStore((state) => state.selectedItems);
  const clearSelectedItems = useSelectedItemsStore(
    (state) => state.clearSelectedItems,
  );

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <aside className="sticky bottom-0 z-20 border-t border-slate-200 bg-white px-4 py-4 shadow-[0_-4px_12px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium text-slate-900 dark:text-slate-100">
          Selected items: {selectedItems.length}
        </p>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            type="button"
            onClick={clearSelectedItems}>
            Unselect all
          </button>

          <button
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            type="button"
            onClick={() => downloadProductsCsv(selectedItems)}>
            Download
          </button>
        </div>
      </div>
    </aside>
  );
}

export default SelectedItemsFlyout;
