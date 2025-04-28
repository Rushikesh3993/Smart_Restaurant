import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-bg-lightGreen to-emerald-900 flex items-center justify-center z-50">
      <div className="bg-white/10 p-8 rounded-lg shadow-lg backdrop-blur-sm">
        <Loader className="animate-spin w-16 h-16 text-white" />
        <p className="text-white mt-4 text-center">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;