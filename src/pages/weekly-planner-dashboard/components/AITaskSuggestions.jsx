import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { generateTaskSuggestions } from '../../../lib/openai';

const AITaskSuggestions = ({ onTaskCreate, day, timeSlot }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateSuggestions = async () => {
    if (!prompt?.trim()) return;

    setLoading(true);
    try {
      const result = await generateTaskSuggestions(prompt, day, timeSlot);
      setSuggestions(result?.tasks || []);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      // Fallback suggestions
      setSuggestions([
        { title: 'Work on project', description: 'Continue with current project tasks' },
        { title: 'Review emails', description: 'Check and respond to important emails' },
        { title: 'Team meeting', description: 'Attend scheduled team meeting' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = (suggestion) => {
    const newTask = {
      id: Date.now(),
      title: suggestion?.title,
      description: suggestion?.description,
      day,
      timeSlot,
      completed: false,
      createdAt: new Date()?.toISOString()
    };
    onTaskCreate(newTask);
    setIsOpen(false);
    setPrompt('');
    setSuggestions([]);
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        iconName="Sparkles"
        iconPosition="left"
        className="mt-2"
      >
        AI Suggestions
      </Button>
    );
  }

  return (
    <div className="mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon name="Sparkles" size={16} className="text-blue-600" />
          <h3 className="font-medium text-gray-900">AI Task Suggestions</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Icon name="X" size={16} className="text-gray-500" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex space-x-2">
          <Input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e?.target?.value)}
            placeholder={`What would you like to do ${day} ${timeSlot?.toLowerCase()}?`}
            className="flex-1"
            onKeyPress={(e) => e?.key === 'Enter' && handleGenerateSuggestions()}
          />
          <Button
            onClick={handleGenerateSuggestions}
            disabled={loading || !prompt?.trim()}
            iconName={loading ? "Loader2" : "Send"}
            iconPosition="left"
            size="sm"
            className={loading ? "animate-spin" : ""}
          >
            {loading ? 'Generating...' : 'Generate'}
          </Button>
        </div>

        {suggestions?.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Suggested tasks:</p>
            {suggestions?.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => handleCreateTask(suggestion)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{suggestion?.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{suggestion?.description}</p>
                  </div>
                  <Icon name="Plus" size={16} className="text-blue-600 mt-1 flex-shrink-0 ml-2" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AITaskSuggestions;