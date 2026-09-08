import React, { useState } from 'react';

export default function PaywallSurvey({ onSubmit }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 60,
  };

  const modalStyle = {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 20px 25px rgba(0,0,0,0.1)',
  };

  const titleStyle = {
    fontSize: '1.3rem',
    fontWeight: '700',
    marginBottom: '1rem',
    color: 'hsl(var(--foreground))',
  };

  const subtitleStyle = {
    fontSize: '0.95rem',
    color: 'hsl(var(--foreground) / 0.7)',
    marginBottom: '1.5rem',
  };

  const optionsStyle = {
    display: 'grid',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  };

  const optionStyle = (isSelected) => ({
    padding: '1rem',
    border: isSelected ? '2px solid hsl(var(--primary))' : '1px solid hsl(var(--border))',
    borderRadius: '0.5rem',
    backgroundColor: isSelected ? 'hsl(var(--primary) / 0.1)' : 'transparent',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left',
    fontSize: '0.95rem',
    color: 'hsl(var(--foreground))',
  });

  const submitStyle = {
    width: '100%',
    backgroundColor: 'hsl(var(--primary))',
    color: 'white',
    padding: '0.75rem 1rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    opacity: selectedAnswer ? 1 : 0.5,
    pointerEvents: selectedAnswer ? 'auto' : 'none',
  };

  const answers = [
    'Plus de situations',
    'Adapté à l\'âge de mon enfant',
    'Plusieurs réponses selon la situation',
    'Conseils sur quoi faire, pas seulement quoi dire',
    'Disponible FR + DE',
  ];

  const handleSubmit = () => {
    if (selectedAnswer) {
      onSubmit(selectedAnswer);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3 style={titleStyle}>Qu'est-ce qui t'a donné envie de débloquer ChildPause ?</h3>
        <p style={subtitleStyle}>(Ta réponse nous aide vraiment)</p>

        <div style={optionsStyle}>
          {answers.map((answer) => (
            <button
              key={answer}
              style={optionStyle(selectedAnswer === answer)}
              onClick={() => setSelectedAnswer(answer)}
            >
              {answer}
            </button>
          ))}
        </div>

        <button style={submitStyle} onClick={handleSubmit} onMouseEnter={(e) => e.target.style.opacity = '0.9'} onMouseLeave={(e) => e.target.style.opacity = '1'}>
          Envoyer
        </button>
      </div>
    </div>
  );
}