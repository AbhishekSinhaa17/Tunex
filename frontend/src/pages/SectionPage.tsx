import { useParams } from "react-router-dom";

const SectionPage = () => {
  const { section } = useParams();

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold capitalize">{section}</h1>
      <p className="text-zinc-400 mt-2">All songs from this section</p>
    </div>
  );
};

export default SectionPage;