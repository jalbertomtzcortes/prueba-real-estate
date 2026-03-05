import SlideView from "./SlideView";

export default function ConsultantWorkspace({ data }) {
  return (
    <div className="space-y-6">
      <SlideView
        title={`Análisis Ejecutivo - ${data.city}`}
        growth={data.growth}
        average={data.average}
        history={data.history}
      />
    </div>
  );
}