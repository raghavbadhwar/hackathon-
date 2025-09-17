import React, { useState, useEffect, useRef } from 'react';
import type { ProductListing, ChatMessage } from '../types';
import { createCopilotChatSession } from '../services/geminiService';
import type { Chat } from '@google/genai';
import { KalaMitraIcon } from './Icon';

interface BuyerCopilotProps {
  productListing: ProductListing | null;
  isWidget?: boolean;
}

export const BuyerCopilot: React.FC<BuyerCopilotProps> = ({ productListing, isWidget = false }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (productListing) {
      const chatSession = createCopilotChatSession(productListing);
      setChat(chatSession);
      setHistory([
        { role: 'model', text: `Hello! I'm your assistant for the "${productListing.title}". How can I help you?` }
      ]);
      setError(null);
    }
  }, [productListing]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading || !chat) return;

    const userMessage: ChatMessage = { role: 'user', text: userInput };
    setHistory(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await chat.sendMessage({ message: userInput });
      const modelMessage: ChatMessage = { role: 'model', text: response.text };
      setHistory(prev => [...prev, modelMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Sorry, I couldn't get a response. ${errorMessage}`);
      setHistory(prev => prev.slice(0, -1)); // Remove user message on error
    } finally {
      setIsLoading(false);
    }
  };

  if (!productListing) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-[#0E5A6A]">Buyer Copilot</h2>
        <p className="mt-4 text-slate-600">
          Please create a product listing first using the "Listing Creator" tab.
        </p>
      </div>
    );
  }
  
  const containerClasses = isWidget 
  ? "w-full mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col" 
  : "max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col";
  const containerStyle = isWidget 
    ? { height: '50vh', minHeight: '400px' } 
    : { height: '70vh' };

  return (
    <>
      {!isWidget && (
        <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0E5A6A]">Buyer Copilot</h1>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              Test the buyer experience. Ask questions about the product you just created.
            </p>
        </div>
      )}
      <div className={containerClasses} style={containerStyle}>
        {isWidget && (
          <div className="bg-[#EA580C] text-white font-semibold p-3 text-center rounded-t-2xl flex-shrink-0">
            Product Assistant
          </div>
        )}
        <div className="flex-grow p-4 md:p-6 space-y-4 overflow-y-auto">
          {history.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && <KalaMitraIcon className="w-8 h-8 flex-shrink-0" />}
              <div
                className={`max-w-md p-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-[#EA580C] text-white rounded-br-none'
                    : 'bg-[#EA580C]/10 text-[#0E5A6A] rounded-bl-none'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
           {isLoading && (
            <div className="flex items-end gap-2">
              <KalaMitraIcon className="w-8 h-8 flex-shrink-0" />
              <div className="max-w-sm p-3 rounded-2xl bg-[#EA580C]/10 text-[#0E5A6A] rounded-bl-none">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#EA580C] rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-[#EA580C] rounded-full animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-[#EA580C] rounded-full animate-pulse [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="p-4 border-t border-slate-200 bg-white rounded-b-2xl flex-shrink-0">
          {error && <p className="text-red-600 text-sm text-center mb-2">{error}</p>}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-grow p-3 border border-slate-300 rounded-full focus:ring-2 focus:ring-[#EA580C] focus:border-[#EA580C] transition shadow-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !userInput.trim()}
              className="bg-[#EA580C] text-white font-bold p-3 rounded-full hover:bg-[#c2410c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EA580C] disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};