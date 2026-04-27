export default function HabitActions({
  onDelete,
  onPause,
  onResume,
  onArchive,
}) {
  return (
    <div className="flex gap-3 mt-6">
      <button onClick={onDelete}>Delete</button>
      <button onClick={onPause}>Pause</button>
      <button onClick={onResume}>Resume</button>
      <button onClick={onArchive}>Archive</button>
    </div>
  );
}
