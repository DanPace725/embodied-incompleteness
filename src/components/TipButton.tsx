import React, { useState } from 'react';
import TipModal from './TipModal';

interface Props {
  projectId: string;
}

const TipButton: React.FC<Props> = ({ projectId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
      >
        <span className="text-xl mr-3">💰</span>
        Tip this Idea
      </button>

      <TipModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={projectId}
      />
    </>
  );
};

export default TipButton;
