import React, { useState } from 'react';

export const URLShortener: React.FC = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShorten = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      const randomId = Math.random().toString(36).substring(2, 8);
      setShortUrl(`https://trfk.io/${randomId}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6">URL Shortener & Tracker</h2>
      <form onSubmit={handleShorten} className="space-y-4">
        <div>
          <label className="block text-gray-400 text-sm mb-2">Enter your long URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/your-long-url"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            required
          />
        </div>
        <button type="submit" className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all">
          Shorten & Track
        </button>
      </form>
      {shortUrl && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-gray-400 text-sm mb-2">Your shortened URL:</p>
          <div className="flex items-center gap-2">
            <input type="text" value={shortUrl} readOnly className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white" />
            <button onClick={handleCopy} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors">
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
