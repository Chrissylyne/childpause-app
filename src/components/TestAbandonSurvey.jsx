import React, { useState } from 'react';

export default function AbandonSurvey({ onSubmit }) {
  const [selected, setSelected] = useState(null);

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
    maxWidth: '450px',
    width: '90%',
    boxShadow: '0 20px 25px rgba(0,0,0,0.1)',
  };

  const titleStyle = {
    fontSize: '1.1rem',
    fontWeight: '700',
    marginBottom: '1rem',
    color: 'hsl(var(--foreground))',
  };

  const subtitleStyle = {
    fontSize: '0.9rem',
    color: 'hsl(var(--foreground) / 0.6)',
    marginBottom: '1.5rem',
  };

  const optionsStyle = {
    display: 'grid',
    gap: '0.75rem',
    marginBottom: '1rem',
  };

  const optionStyle = (isSelected) => ({
    padding: '0.75rem 1rem',
    border: isSelected ? '2px solid hsl(var(--primary))' : '1px solid hsl(var(--border))',
    borderRadius: '0.5rem',
    backgroundColor: isSelected ? 'hsl(var(--primary) / 0.1)' : 'transparent',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '0.9rem',
    color: 'hsl(var(--foreground))',
  });

  const submitStyle = {
    width: '100%',
    backgroundColor: 'hsl(var(--primary))',
    color: 'white',
    padding: '0.75rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    opacity: selected ? 1 : 0.5,
    pointerEvents: selected ? 'auto' : 'none',
  };

  const reasons = [
    '💬 Je peux demander ça à ChatGPT',
    '💶 C\'est trop cher pour maintenant',
    '🤔 Je ne suis pas encore convaincu(e)',
    '⏳ Je reviendrai plus tard',
    'Autre',
  ];

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3 style={titleStyle}>Qu'est-ce qui t'a fait hésiter ?</h3>
        <p style={subtitleStyle}>Ton feedback nous aide vraiment.</p>

        <div style={optionsStyle}>
          {reasons.map((reason) => (
            <button
              key={reason}
              style={optionStyle(selected === reason)}
              onClick={() => setSelected(reason)}
            >
              {reason}
            </button>
          ))}
        </div>

        <button 
          style={submitStyle} 
          onClick={() => onSubmit(selected)} 
          disabled={!selected}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}