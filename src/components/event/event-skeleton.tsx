import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EventSkeleton() {
  return (
    <Card className="flex flex-col h-[500px] animate-pulse">
      <div className="w-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden" style={{ height: 240 }}>
        <div className="w-2/3 h-32 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
      <div className="flex-1 flex flex-col">
        <CardHeader>
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2" />
          <div className="flex space-x-2 mb-2">
            <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-4 w-10 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between">
          <div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-full" />
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-5/6" />
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-2/3" />
            <div className="flex space-x-2 mb-4">
              <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-3 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="flex space-x-2">
              <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
