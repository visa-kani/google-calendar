export const Loader = () => {
  return (
    <div className="flex justify-center items-center mt-8 text-purple-600">
      <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full mr-3"></div>
      <span className="text-lg">Loading Pokemon...</span>
    </div>
  );
};
