import { format, parseISO } from "date-fns";
import CallLog from "./CallLog";

interface CallsListProps {
  calls: any[];
}

export default function CallsList({ calls }: CallsListProps) {
  // Group calls by date
  const groupedCalls = calls.reduce(
    (groups: { [key: string]: any[] }, call) => {
      const date = format(parseISO(call.startedAt), "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(call);
      return groups;
    },
    {}
  );

  return (
    <div className="space-y-8">
      {Object.entries(groupedCalls).map(([date, dateCalls]) => (
        <div key={date}>
          <h3 className="text-lg font-semibold mb-4 text-white text-shadow-lg">
            {format(parseISO(date), "MMMM d, yyyy")}
          </h3>
          <div className="space-y-4">
            {dateCalls.map((call) => (
              <CallLog key={call.id} call={call} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
