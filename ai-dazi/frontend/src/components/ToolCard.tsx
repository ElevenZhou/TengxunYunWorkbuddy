import Link from "next/link";
import { Star, ExternalLink, Heart } from "lucide-react";

interface ToolCardProps {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  category: string;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  tags?: string[];
}

export default function ToolCard({
  id,
  name,
  description,
  logoUrl,
  category,
  rating,
  reviewCount,
  isFeatured = false,
  tags = [],
}: ToolCardProps) {
  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-lg hover:border-blue-200">
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute -top-2 -right-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-2 py-0.5 text-xs font-medium text-white">
          精选
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-purple-100">
          {logoUrl ? (
            <img src={logoUrl} alt={name} className="h-8 w-8 object-contain" />
          ) : (
            <span className="text-lg font-bold text-blue-600">
              {name.charAt(0)}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
            <button className="text-gray-400 hover:text-red-500 transition-colors">
              <Heart className="h-4 w-4" />
            </button>
          </div>
          
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{description}</p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                {category}
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium text-gray-700">
                  {rating.toFixed(1)}
                </span>
                <span className="text-xs text-gray-400">({reviewCount})</span>
              </div>
            </div>
            
            <Link
              href={`/tools/${id}`}
              className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              详情
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
