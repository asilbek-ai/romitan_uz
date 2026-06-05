export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-3 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
        <p className="text-sm font-medium text-primary">Yuklanmoqda...</p>
      </div>
    </div>
  );
}