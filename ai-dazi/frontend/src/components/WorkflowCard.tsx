import Link from "next/link";
import { Play, Clock, Users, ArrowRight } from "lucide-react";

interface WorkflowCardProps {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  author: {
    name: string;
    avatar?: string;
  };
  duration: string;
  stepCount: number;
  viewCount: number;
  tools: string[];
}

export default function WorkflowCard({
  id,
  title,
  description,
  coverImage,
  author,
  duration,
  stepCount,
  viewCount,
  tools,
}: WorkflowCardProps) {
  return (
    <div className="group rounded-xl border border-gray-200 bg-white overflow-hidden transition-all hover:shadow-lg hover:border-blue-200">
      {/* Cover Image */}
      <div className="relative h-40 bg-gradient-to-br from-blue-500 to-purple-600">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Play className="h-12 w-12 text-white/50" />
          </div>
        )}
        
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
          <Clock className="h-3 w-3" />
          {duration}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{description}</p>

        {/* Tools Used */}
        <div className="mt-3 flex flex-wrap gap-1">
          {tools.slice(0, 3).map((tool) => (
            <span
              key={tool}
              className="rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-600"
            >
              {tool}
            </span>
          ))}
          {tools.length > 3 && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              +{tools.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-xs font-medium text-white">
              {author.name.charAt(0)}
            </div>
            <span className="text-xs text-gray-600">{author.name}</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {viewCount >= 1000 ? `${(viewCount / 1000).toFixed(1)}k` : viewCount}
            </span>
            <span>{stepCount}步</span>
          </div>
        </div>

        {/* Action */}
        <Link
          href={`/workflows/${id}`}
          className="mt-4 flex items-center justify-center gap-1 rounded-lg bg-gray-50 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          查看工作流
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
