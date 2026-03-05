import BIWidgets from "./BIWidgets";

export default function BIWorkspace({ data }) {
  return (
    <div className="space-y-6">
      <BIWidgets data={data} />
    </div>
  );
}