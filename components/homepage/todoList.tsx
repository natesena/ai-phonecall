import { todos } from "./todos";

export default function Home() {
  const todoList = todos.split("\n").filter((line) => line.trim());

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Project TODOs</h2>
      <ul className="space-y-2">
        {todoList.map((todo, index) => (
          <li key={index}>{todo}</li>
        ))}
      </ul>
    </div>
  );
}
