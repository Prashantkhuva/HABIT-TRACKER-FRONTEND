import BooleanCard from "./BooleanCard";
import StreakCard from "./StreakCard";

export default function HabitCard({
  habit,
  index,
  onComplete,
  completing,
  isDone,
}) {
  if (habit.type === "streak") {
    return (
      <StreakCard
        habit={habit}
        index={index}
        onComplete={onComplete}
        completing={completing}
        isDone={isDone}
      />
    );
  }


  return (
    <BooleanCard
      habit={habit}
      index={index}
      onComplete={onComplete}
      completing={completing}
      isDone={isDone}
    />
  );
}
