import React, { useState } from 'react';

interface Props {
  initialCount: number;
  projectId: string;
}

const InterestButton: React.FC<Props> = ({ initialCount, projectId }) => {
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/increment-interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update interest count.');
      }

      const data = await response.json();
      setCount(data.count);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
      >
        <span className="text-2xl mr-3">👀</span>
        {isLoading ? '...' : 'I noticed this!'}
      </button>
      <p className="text-sm text-gray-400">
        This has been noticed by <span className="font-bold text-white">{count}</span> {count === 1 ? 'person' : 'people'}.
      </p>
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default InterestButton;
