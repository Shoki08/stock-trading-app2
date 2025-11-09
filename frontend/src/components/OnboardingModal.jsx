import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import './OnboardingModal.css';

export default function OnboardingModal({ onClose }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      emoji: '👋',
      title: 'ようこそ！',
      description: '株式取引アシスタントへようこそ！\n\nこのアプリは、株を「買うか」「売るか」の判断を助けるツールです。初めての方でも簡単に使えます。'
    },
    {
      emoji: '🔍',
      title: '銘柄を検索',
      description: '気になる会社の銘柄コードを入力して検索します。\n\n例：\n• トヨタ → 7203.T\n• Apple → AAPL\n• Google → GOOGL'
    },
    {
      emoji: '🎯',
      title: '一目で判断',
      description: '検索した銘柄をタップすると、大きく「買い時」「売り時」「様子見」が表示されます。\n\n信号機のように色分けされているので、パッと見てわかります。'
    },
    {
      emoji: '📊',
      title: '総合スコア',
      description: '0〜100点のスコアで「今が買い時か」を表示します。\n\n• 70点以上：買い時の可能性\n• 30点以下：売り時の可能性\n• それ以外：様子見'
    },
    {
      emoji: '🤖',
      title: 'AI予測とニュース',
      description: 'AIが今後の価格を予測し、最新ニュースの雰囲気も分析します。\n\n複数の角度から判断材料を提供します。'
    },
    {
      emoji: '⚠️',
      title: '重要なこと',
      description: 'このアプリは参考情報です。\n\n• 100%正確ではありません\n• 最終判断はご自身で\n• 少額から始めましょう\n• 勉強を続けましょう'
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      // 完了
      localStorage.setItem('onboarding_completed', 'true');
      onClose();
      navigate('/search');
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_completed', 'true');
    onClose();
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <button className="close-button" onClick={handleSkip}>
          <X size={24} />
        </button>

        <div className="onboarding-content">
          <div className="step-emoji">{currentStepData.emoji}</div>
          <h2>{currentStepData.title}</h2>
          <p>{currentStepData.description}</p>
        </div>

        <div className="onboarding-footer">
          <div className="progress-dots">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              />
            ))}
          </div>

          <div className="onboarding-actions">
            {!isLastStep && (
              <button className="skip-button" onClick={handleSkip}>
                スキップ
              </button>
            )}
            <button className="next-button" onClick={handleNext}>
              {isLastStep ? '始める' : '次へ'}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
