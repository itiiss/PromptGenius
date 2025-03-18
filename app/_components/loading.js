export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative inline-flex">
        {/* 最外层圆环 */}
        <div className="w-16 h-16 rounded-full border-4 border-blue-100 dark:border-blue-900/30 animate-pulse">
        </div>
        
        {/* 旋转的圆弧 */}
        <div className="absolute top-0 left-0 w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-t-blue-500 dark:border-t-blue-400 animate-spin">
          </div>
        </div>
        
        {/* 内层圆环 */}
        <div className="absolute top-2 left-2 w-12 h-12 rounded-full border-4 border-blue-200 dark:border-blue-800 animate-pulse delay-150">
        </div>
        
        {/* 内层旋转的点 */}
        <div className="absolute top-2 left-2 w-12 h-12 animate-spin-fast" style={{ animationDirection: 'reverse' }}>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full">
          </div>
        </div>
        
        {/* 中心点 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse delay-300">
        </div>
      </div>
    </div>
  );
} 