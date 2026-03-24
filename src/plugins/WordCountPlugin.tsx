
import { useEditor } from '../hooks/useEditor';
import type { PluginInstance } from '../registry/PluginRegistry';
import { BarChart } from 'lucide-react';

const WordCountWidget = () => {
  const { activeStoryContent } = useEditor();
  
  // More reliable word counting for HTML content
  const calculateMetrics = (html: string) => {
    // 1. Convert all tags to spaces to ensure words stay separate
    // 2. Clear out multiple spaces and entities
    const cleanText = html
      .replace(/<br\s*\/?>/gi, ' ') // Handle all <br> variants
      .replace(/<\/p>|<\/div>|<\/h[1-6]>/gi, ' ') // Handle common block ends
      .replace(/<[^>]*>/g, ' ') // Catch-all for other tags
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
      
    const wordCount = cleanText ? cleanText.split(' ').length : 0;
    const charCount = cleanText.length;
    
    return { wordCount, charCount };
  };

  const { wordCount, charCount } = calculateMetrics(activeStoryContent || '');
  const words = wordCount;
  const chars = charCount;

  const formatReadTime = (wordCount: number) => {
    if (wordCount === 0) return '0m';
    const wpm = 225; // Standard for silent reading
    const totalMinutes = wordCount / wpm;
    
    if (totalMinutes < 1) {
      const seconds = Math.max(1, Math.round(totalMinutes * 60));
      return `${seconds}s`;
    }
    
    const minutes = Math.floor(totalMinutes);
    const seconds = Math.round((totalMinutes - minutes) * 60);
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
  };

  const readTimeFormatted = formatReadTime(words);

  return (
    <div className="plugin-widget">
      <div className="plugin-header">
        <BarChart size={16} />
        <h3>Story Metrics</h3>
      </div>
      <div className="plugin-body stats-grid">
        <div className="stat-item">
          <span className="stat-value" style={{ color: 'var(--accent-blue)' }}>{words.toLocaleString()}</span>
          <span className="stat-label">Words</span>
        </div>
        <div className="stat-item">
          <span className="stat-value" style={{ color: 'var(--accent-blue)' }}>{chars.toLocaleString()}</span>
          <span className="stat-label">Chars</span>
        </div>
        <div className="stat-item">
          <span className="stat-value" style={{ color: 'var(--accent-blue)' }}>{readTimeFormatted}</span>
          <span className="stat-label">Read Time</span>
        </div>
      </div>
    </div>
  );
};

export const WordCountPlugin: PluginInstance = {
  meta: {
    id: 'word-count',
    name: 'Word Count',
    description: 'Displays current document statistics.',
    defaultEnabled: true,
  },
  render: () => <WordCountWidget />
};
