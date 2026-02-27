import { Construction } from 'lucide-react';

const ComingSoon = ({ title, description }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-md p-8">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500 to-orange-500 flex items-center justify-center">
          <Construction size={40} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">
          {title || 'Coming Soon'}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {description || 'This feature is currently under development and will be available soon.'}
        </p>
        <div className="flex gap-2 justify-center">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse delay-75"></div>
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
