import Button from "../Button";

export default function HabitActions({
  onDelete,
  onPause,
  onResume,
  onArchive,
}) {
  return (
    <div className="flex gap-3 mt-6 flex-wrap">
      <Button variant="ghost" color="red" onClick={onDelete}>Delete</Button>
      <Button variant="ghost" color="gray" onClick={onPause}>Pause</Button>
      <Button variant="ghost" color="green" onClick={onResume}>Resume</Button>
      <Button variant="ghost" color="default" onClick={onArchive}>Archive</Button>
    </div>
  );
}
