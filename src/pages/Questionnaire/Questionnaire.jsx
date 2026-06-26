import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Target,
  Utensils,
  Heart,
  Flame,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';

const steps = [
  {
    id: 'goal',
    title: '您的目标是什么？',
    subtitle: '选择您的健身目标',
    icon: Target,
    options: [
      { id: 'lose_weight', label: '减脂', desc: '减少体脂，塑造身材', icon: Flame },
      { id: 'maintain', label: '维持', desc: '保持当前体重', icon: Heart },
      { id: 'gain_muscle', label: '增肌', desc: '增加肌肉含量', icon: Target },
    ],
  },
  {
    id: 'taste',
    title: '您的口味偏好？',
    subtitle: '可多选',
    icon: Utensils,
    options: [
      { id: 'light', label: '清淡', desc: '少油少盐' },
      { id: 'spicy', label: '辛辣', desc: '喜欢辣味' },
      { id: 'sweet', label: '甜食', desc: '偶尔想吃甜的' },
      { id: 'salty', label: '咸香', desc: '喜欢重口味' },
      { id: 'sour', label: '酸爽', desc: '喜欢酸味' },
      { id: 'balanced', label: '均衡', desc: '不挑食' },
    ],
  },
  {
    id: 'restrictions',
    title: '饮食禁忌？',
    subtitle: '选择您的情况',
    icon: Heart,
    options: [
      { id: 'none', label: '无禁忌', desc: '什么都吃' },
      { id: 'vegetarian', label: '素食', desc: '不吃肉' },
      { id: 'vegan', label: '全素', desc: '不吃任何动物制品' },
      { id: 'allergy_seafood', label: '海鲜过敏', desc: '不能吃海鲜' },
      { id: 'allergy_lactose', label: '乳糖不耐', desc: '不能喝牛奶' },
      { id: 'allergy_nuts', label: '坚果过敏', desc: '不能吃坚果' },
    ],
  },
];

export default function Questionnaire() {
  const navigate = useNavigate();
  const { completeQuestionnaire } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({
    goal: null,
    taste: [],
    restrictions: [],
  });

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const canProceed = () => {
    if (step.id === 'goal') return selections.goal !== null;
    if (step.id === 'taste') return selections.taste.length > 0;
    if (step.id === 'restrictions') return selections.restrictions.length > 0;
    return false;
  };

  const handleSelect = (optionId) => {
    const newSelections = { ...selections };

    if (step.id === 'goal') {
      newSelections.goal = optionId;
    } else if (step.id === 'taste' || step.id === 'restrictions') {
      const index = newSelections[step.id].indexOf(optionId);
      if (index >= 0) {
        newSelections[step.id] = newSelections[step.id].filter((id) => id !== optionId);
      } else {
        newSelections[step.id] = [...newSelections[step.id], optionId];
      }
    }

    setSelections(newSelections);
  };

  const handleNext = () => {
    if (isLastStep) {
      completeQuestionnaire(selections);
      navigate('/');
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
          )}
          <div className="flex-1 flex justify-center gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-8 h-1.5 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="w-10" />
        </div>
        <p className="text-sm text-gray-400 text-center">
          {currentStep + 1} / {steps.length}
        </p>
      </header>

      {/* Content */}
      <div className="flex-1 px-5">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-primary-50 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <step.icon size={32} className="text-primary-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{step.title}</h1>
          <p className="text-gray-400 mt-2">{step.subtitle}</p>
        </motion.div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          {step.options.map((option) => {
            const isSelected =
              step.id === 'goal'
                ? selections.goal === option.id
                : selections[step.id]?.includes(option.id);

            return (
              <motion.button
                key={option.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(option.id)}
                className={`p-4 rounded-2xl text-left transition-all border-2 ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-100 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`font-semibold ${isSelected ? 'text-primary-600' : 'text-gray-800'}`}>
                      {option.label}
                    </h3>
                    {option.desc && (
                      <p className="text-xs text-gray-400 mt-0.5">{option.desc}</p>
                    )}
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-8">
        <motion.button
          onClick={handleNext}
          disabled={!canProceed()}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 ${
            canProceed()
              ? 'bg-gradient-to-r from-primary-500 to-primary-400 text-white shadow-gradient'
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          {isLastStep ? '完成设置' : '下一步'}
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </div>
  );
}
