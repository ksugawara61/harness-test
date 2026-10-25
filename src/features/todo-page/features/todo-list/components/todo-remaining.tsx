type Props = {
  count: number;
};

export const TodoRemaining = ({ count }: Props) => (
  <p className="todo-list__remaining">残り {count} 件</p>
);
