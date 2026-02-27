import { Card, CardContent } from './ui/card';

const StatsCard = ({ label, value, icon: Icon, description }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {label}
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
              {value}
            </p>
            {description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {description}
              </p>
            )}
          </div>
          <div className="ml-4 p-3 bg-cyan-50 dark:bg-cyan-950 rounded-lg">
            <Icon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
