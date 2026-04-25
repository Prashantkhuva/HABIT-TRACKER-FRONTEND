import BooleanCard from "./BooleanCard";
import StreakCard from "./StreakCard";
import QuantityCard from "./QuantityCard";

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

  if (habit.type === "quantity") {
    return <QuantityCard habit={habit} index={index} />;
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
