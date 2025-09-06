import React, { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

const TipModal: React.FC<Props> = ({ isOpen, onClose, projectId }) => {
  const presetAmounts = [1, 3, 5];
  const [selectedAmount, setSelectedAmount] = useState<number>(presetAmounts[1]);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when modal opens
    if (isOpen) {
      setSelectedAmount(presetAmounts[1]);
      setCustomAmount('');
      setIsLoading(false);
      setIsSuccess(false);
      setError(null);
    }
  }, [isOpen]);

  const handlePay = async () => {
    setIsLoading(true);
    setError(null);
    const amountToPay = customAmount ? parseFloat(customAmount) : selectedAmount;

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, amount: amountToPay }),
      });

      if (!response.ok) throw new Error('Payment initiation failed.');

      // In a real app, you'd use the clientSecret from the response
      // to confirm the payment with Stripe Elements.
      // const { clientSecret } = await response.json();

      // For now, we just show a success message.
      setIsSuccess(true);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-gray-900 rounded-xl p-8 w-full max-w-md border border-gray-700" onClick={e => e.stopPropagation()}>
        {isSuccess ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Thank You!</h2>
            <p className="text-gray-400 mb-6">Your support is greatly appreciated. Note: This is a demo and no payment was processed.</p>
            <button onClick={onClose} className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Support this Idea</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-white">&times;</button>
            </div>

            <p className="text-gray-400 mb-6">Select or enter an amount to tip this project.</p>

            <div className="flex justify-center gap-4 mb-6">
              {presetAmounts.map(amount => (
                <button
                  key={amount}
                  onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                  className={`px-6 py-3 rounded-lg transition-colors text-lg font-bold ${selectedAmount === amount && !customAmount ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  ${amount}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <input
                type="number"
                placeholder="Or enter a custom amount"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(0); }}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handlePay}
              disabled={isLoading}
              className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : `Tip $${customAmount || selectedAmount}`}
            </button>
            {error && <p className="text-sm text-red-500 mt-4 text-center">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default TipModal;
