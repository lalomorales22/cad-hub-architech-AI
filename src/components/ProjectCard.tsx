
interface ProjectCardProps {
  title: string;
  description: string;
}

export const ProjectCard = ({ title, description }: ProjectCardProps) => {
  return (
    <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
      <h3 className="text-white text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
      
      <div className="mt-3 flex items-center justify-between">
        <div className="flex space-x-2">
          <span className="px-2 py-1 bg-cyan-600/20 text-cyan-400 text-xs rounded">
            Residential
          </span>
          <span className="px-2 py-1 bg-gray-600/20 text-gray-400 text-xs rounded">
            Modern
          </span>
        </div>
        
        <div className="text-gray-400 text-xs">
          Last modified: 2 hours ago
        </div>
      </div>
    </div>
  );
};
