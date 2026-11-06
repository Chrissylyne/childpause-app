import React, { useState } from 'react';
import { useTranslations } from '../i18n/useTranslations'
import Paywall from '../components/Paywall';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage = () => {
  const t = useTranslations();
  const { language } = useLanguage();
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [selectedSituation, setSelectedSituation] = useState(null);
  const [viewedCount, setViewedCount] = useState(0);
  const [viewedSituationIds, setViewedSituationIds] = useState(new Set());

  const situations = [
    {
      id: 'screens',
      emoji: '📱',
      free: true,
      fr: {
        title: 'IL/ELLE REFUSE D\'ARRÊTER LES ÉCRANS',
        subtitle: '« Juste 5 minutes de plus ! »',
        content: {
          dis: '« J\'entends que tu veux continuer. On arrête les écrans maintenant. »',
          fais: 'Éteindre l\'écran soi-même, calmement. Proposer l\'alternative tout de suite (goûter, parc, jeu).',
          evite: 'Les négociations (« OK, encore 5 min »). Les menaces (« Si tu l\'éteins pas, t\'es puni »).',
          siContinue: '« Je vois que c\'est difficile. Je vais ranger l\'écran. On va faire ça ensemble. »',
          objectif: 'Passer de la confrontation à l\'action concrète en 30 secondes.',
          pourquoi: 'L\'enfant teste les limites. Tu affirmes la limite sans débattre. L\'alternative aide à rediriger son attention.'
        }
      },
      de: {
        title: 'MEIN KIND WILL DEN BILDSCHIRM NICHT AUSSCHALTEN',
        subtitle: '« Noch fünf Minuten! »',
        content: {
          dis: '« Ich sehe, dass dir das schwerfällt. Jetzt ist Schluss. »',
          fais: 'Den Bildschirm selbst ausschalten. Sofort eine Alternative anbieten (Snack, Spielplatz, Spiel).',
          evite: 'Verhandlungen (« Okay, noch fünf Minuten »). Drohungen (« Wenn nicht, Strafe »).',
          siContinue: '« Das ist hart. Ich mache das jetzt. Komm mit. »',
          objectif: 'Von Konfrontation zu konkreter Aktion in 30 Sekunden.',
          pourquoi: 'Das Kind testet Grenzen. Du setzt die Grenze klar, ohne zu diskutieren. Die Alternative lenkt die Aufmerksamkeit um.'
        }
      },
      image: '📱'
    },
    {
      id: 'meltdown',
      emoji: '😡',
      free: true,
      fr: {
        title: 'IL/ELLE PIQUE UNE GROSSE CRISE',
        subtitle: '« C\'est pas juste! Je te déteste! »',
        content: {
          dis: '« Tu es fâché, je comprends. Je suis là. »',
          fais: 'Respirer (pour toi). Rester proche, physiquement calme. Pas de explication pendant la crise.',
          evite: 'Crier, négocier, essayer de convaincre, répéter les raisons. Ça amplifie la crise.',
          siContinue: 'Rester à côté en silence. Main douce sur l\'épaule si l\'enfant accepte.',
          objectif: 'Passer de la tempête émotionnelle au calme progressif (5-10 min).',
          pourquoi: 'L\'enfant a besoin de ta présence calme, pas de tes explications. Quand il se calme, alors tu peux parler.'
        }
      },
      de: {
        title: 'MEIN KIND HAT EINEN GROSSEN WUTANFALL',
        subtitle: '« Das ist unfair! Ich hasse dich! »',
        content: {
          dis: '« Du bist sehr wütend. Ich bin hier. »',
          fais: 'Selbst ruhig atmen. Dich in die Nähe des Kindes begeben. Keine Erklärungen während des Ausbruchs.',
          evite: 'Schreien, verhandeln, versuchen zu überzeugen, Gründe wiederholen. Das verschärft es.',
          siContinue: 'Dabei bleiben, schweigen. Sanfte Hand auf Schulter, wenn das Kind das erlaubt.',
          objectif: 'Von emotionalem Sturm zu schrittweiser Beruhigung (5-10 Min).',
          pourquoi: 'Das Kind braucht deine ruhige Gegenwart, nicht deine Erklärungen. Wenn es sich beruhigt, kannst du reden.'
        }
      },
      image: '😡'
    },
    {
      id: 'sleep',
      emoji: '🌙',
      free: true,
      fr: {
        title: 'IL/ELLE REFUSE D\'ALLER AU LIT',
        subtitle: '« Je ne suis pas fatigué! »',
        content: {
          dis: '« Je sais que tu n\'as pas l\'impression d\'être fatigué. C\'est l\'heure d\'aller au lit quand même. »',
          fais: 'Routine claire (bain, histoire, lumière éteinte). Pas de nagociation, pas de « 5 minutes de plus ».',
          evite: 'Briser la routine en cédant. Écrans après 18h. Caféine en fin d\'après-midi.',
          siContinue: '« Je comprends que c\'est dur. Demain on en reparle. Ce soir, c\'est dodo. » Fermeté bienveillante.',
          objectif: 'Établir une routine que l\'enfant attend, pas redoute.',
          pourquoi: 'Les routines régulières régulent le cortisol. L\'enfant peut dire « j\'ai pas sommeil » mais son corps a besoin du repos.'
        }
      },
      de: {
        title: 'MEIN KIND WILL NICHT INS BETT',
        subtitle: '« Ich bin nicht müde! »',
        content: {
          dis: '« Ich weiß, du fühlst dich nicht müde. Trotzdem ist jetzt Schlafenszeit. »',
          fais: 'Klare Routine (Baden, Geschichte, Licht aus). Keine Verhandlung, keine « noch fünf Minuten ».',
          evite: 'Routine brechen, indem du nachgibst. Bildschirm nach 18 Uhr. Koffein am Nachmittag.',
          siContinue: '« Ich verstehe, dass das hart ist. Morgen reden wir drüber. Heute Nacht ist Schlaf. » Klare, liebevolle Grenze.',
          objectif: 'Eine Routine etablieren, auf die sich das Kind freut, nicht vor der es Angst hat.',
          pourquoi: 'Regelmäßige Routinen regulieren Cortisol. Das Kind kann sagen « ich bin nicht müde », aber sein Körper braucht den Schlaf.'
        }
      },
      image: '🌙'
    },
    {
      id: 'transition',
      emoji: '🚪',
      free: false,
      fr: {
        title: 'IL/ELLE REFUSE DE PARTIR (PARC, MAGASIN)',
        subtitle: '« Non! Je veux rester! »',
        content: {
          dis: '« Je sais que c\'est difficile de partir. On part maintenant. On en reparlera demain. »',
          fais: 'Annoncer 5 min avant (« On part dans 5 min »). Proposer qu\'il aide (« Tu peux ranger les jouets? »).',
          evite: 'L\'ultimatum dramatique. Le prix gagné en cédant (« OK, une minute de plus »).',
          siContinue: 'Le porter ou le prendre par la main. Actions, pas mots. Ton calme, pas punition.',
          objectif: 'Transition sans crise. L\'enfant sait que les limites ne négocient pas.',
          pourquoi: 'L\'anticipation réduit la frustration. Les actions claires (tu l\'aides) diminuent la résistance.'
        }
      },
      de: {
        title: 'MEIN KIND WILL DEN SPIELPLATZ NICHT VERLASSEN',
        subtitle: '« Nein! Ich will noch bleiben! »',
        content: {
          dis: '« Ich sehe, dass du noch spielen möchtest. Wir müssen jetzt gehen. Das besprechen wir morgen. »',
          fais: '5 Min vorher ankündigen (« Wir gehen in 5 Minuten »). Biete Hilfe an (« Kannst du deine Sachen tragen? »).',
          evite: 'Dramatische Ultimaten. Mit Nachgeben verhandeln (« Okay, eine Minute noch »).',
          siContinue: 'Tragen oder an der Hand nehmen. Handlung, nicht Worte. Ruhiger Ton, keine Strafe.',
          objectif: 'Transition ohne Krise. Das Kind weiß: Grenzen sind nicht verhandelbar.',
          pourquoi: 'Vorankündigung reduziert Frustration. Klare Handlungen (du hilfst) verringern Widerstand.'
        }
      },
      image: '🚪'
    },
    {
      id: 'hitting',
      emoji: '👊',
      free: false,
      fr: {
        title: 'IL/ELLE FRAPPE, MORD, TAPE',
        subtitle: '« Je t\'ai pas demandé d\'intervenir! »',
        content: {
          dis: '« Je comprends que tu es en colère. Frapper, c\'est pas acceptable. »',
          fais: 'Arrêter le comportement (attraper la main doucement). Mettre de l\'espace entre vous. Rester calme.',
          evite: 'Frapper en retour. Crier « méchant enfant ». Faire la morale pendant qu\'il est énervé.',
          siContinue: '« Ou tu fais une pause, ou je dois t\'aider à te calmer (la chambre). »',
          objectif: 'Arrêter le comportement physique. Lui apprendre à nommer la colère sans frapper.',
          pourquoi: 'L\'enfant frappe quand les émotions le débordent. Ton calme lui montre comment faire. La pause redonne du contrôle.'
        }
      },
      de: {
        title: 'MEIN KIND SCHLÄGT, BEISST, TRITT',
        subtitle: '« Du bringst mich zum Ausrasten! »',
        content: {
          dis: '« Ich sehe, dass du sehr wütend bist. Hauen ist nicht okay. »',
          fais: 'Verhalten stoppen (Hand sanft fassen). Platz zwischen euch schaffen. Selbst ruhig bleiben.',
          evite: 'Zurückschlagen. Schreien « du bist böse ». Moralpredigt, während das Kind wütend ist.',
          siContinue: '« Entweder Ruhe, oder ich muss dir helfen, dich zu beruhigen (Zimmer). »',
          objectif: 'Physisches Verhalten stoppen. Dem Kind beibringen, Wut zu benennen, statt zu zuhauen.',
          pourquoi: 'Das Kind schlägt, wenn Gefühle überfordern. Deine Ruhe zeigt ihm, wie es geht. Pause gibt Kontrolle zurück.'
        }
      },
      image: '👊'
    },
    {
      id: 'homework',
      emoji: '📚',
      free: false,
      fr: {
        title: 'FAIRE LES DEVOIRS',
        subtitle: '« C\'est trop difficile ! Je n\'y arriverai jamais ! »',
        content: {
          dis: '« Je vois que c\'est difficile. On le fait ensemble. Pas de pression. »',
          fais: 'Table dégagée (pas d\'écran). Découper en petites étapes. Féliciter l\'effort, pas juste le résultat.',
          evite: 'Faire les devoirs à sa place. Les punitions si c\'est mal. Les longs commentaires « pourquoi tu comprends pas ».',
          siContinue: '« Je vois que c\'est dur aujourd\'hui. On fait une pause de cinq minutes, puis on reprend la première petite étape. »',
          objectif: 'L\'enfant fait les devoirs sans catastrophiser. Il apprend qu\'essayer compte plus que réussir.',
          pourquoi: 'La rentrée est stressante pour tout le monde. Une routine claire et une présence bienveillante réduisent l\'anxiété. L\'effort compte plus que la perfection.'
        }
      },
      de: {
        title: 'HAUSAUFGABEN MACHEN',
        subtitle: '« Das ist zu schwer! Ich kann das nicht! »',
        content: {
          dis: '« Ich sehe, dass das schwer ist. Wir machen das zusammen. Keine Sorge. »',
          fais: 'Klarer Tisch (kein Bildschirm). In kleine Schritte aufteilen. Die Anstrengung loben, nicht nur das Ergebnis.',
          evite: 'Die Aufgaben machen. Strafen bei Fehlern. Lange Monologe « warum verstehst du das nicht ».',
          siContinue: '« Wenn du weitermachst, kontaktiere ich den Lehrer. »',
          objectif: 'Das Kind macht Hausaufgaben ohne Katastrophendenken. Es lernt: Versuchen ist besser als perfekt sein.',
          pourquoi: 'Schulstart = Stress für alle. Klare Routine + liebevolle Präsenz reduziert Angst. Die Anstrengung zählt mehr als Perfektion.'
        }
      },
      image: '📚'
    }
  ];

  const handleSituationClick = (situation) => {
    setSelectedSituation(situation);
    setCurrentScreen('intervention');
    
    if (!viewedSituationIds.has(situation.id)) {
      setViewedSituationIds(prev => new Set([...prev, situation.id]));
      const newCount = viewedCount + 1;
      setViewedCount(newCount);
      
      if (newCount >= 2) {
        setTimeout(() => {
          setCurrentScreen(prev => (prev === 'intervention' ? 'paywall' : prev));
        }, 3000);
      }
    }
  };

  const handleBackToSituations = () => {
    setSelectedSituation(null);
    setCurrentScreen('situations');
  };

  const handleNextSituation = () => {
    setSelectedSituation(null);
    setCurrentScreen('situations');
  };

  const handlePaywallClosed = () => {
    setCurrentScreen('situations');
  };

  if (currentScreen === 'landing') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, hsl(240, 20%, 95%) 0%, hsl(260, 15%, 90%) 100%)',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: 'hsl(240, 30%, 20%)',
              margin: '0 0 12px 0',
              lineHeight: '1.2'
            }}>
              {language === 'fr' ? 'Qu\'est-ce que je dis maintenant ?' : 'Was soll ich jetzt sagen?'}
            </h1>
            <p style={{
              fontSize: '15px',
              color: 'hsl(240, 20%, 40%)',
              margin: '0',
              lineHeight: '1.5'
            }}>
              {language === 'fr' 
                ? 'Ton enfant crie, refuse, pleure ou pique une crise ? Trouve la bonne réponse en 10 secondes, sans paniquer, sans culpabiliser.'
                : 'Dein Kind schreit, verweigert, weint? Finde die richtige Reaktion in 10 Sekunden, ohne Schuldgefühle, ohne Angst zu scheitern.'
              }
            </p>
          </div>

          <button
            onClick={() => setCurrentScreen('situations')}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              background: 'hsl(280, 70%, 55%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '32px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'hsl(280, 70%, 48%)'}
            onMouseLeave={(e) => e.target.style.background = 'hsl(280, 70%, 55%)'}
          >
            {language === 'fr' ? 'Je ne sais pas quoi dire' : 'Ich weiß nicht, was ich sagen soll'}
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {[
              { 
                label: language === 'fr' ? 'La phrase juste' : 'Der richtige Satz',
                desc: language === 'fr' 
                  ? 'Concrète, naturelle, que tu peux dire tout de suite.'
                  : 'Konkret, natürlich, den du sofort sagen kannst.'
              },
              { 
                label: language === 'fr' ? 'Ce que tu fais après' : 'Was du dann tust',
                desc: language === 'fr'
                  ? 'L\'action qui accompagne la parole.'
                  : 'Die Handlung, die zum Satz passt.'
              },
              { 
                label: language === 'fr' ? 'L\'erreur à ne pas faire' : 'Der häufige Fehler',
                desc: language === 'fr'
                  ? 'Les pièges qui aggravent les choses.'
                  : 'Die Reaktionen, die es schlimmer machen.'
              }
            ].map((item, idx) => (
              <div key={idx} style={{
                background: 'white',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'hsl(280, 70%, 55%)',
                  marginBottom: '4px'
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: 'hsl(240, 20%, 40%)',
                  lineHeight: '1.4'
                }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '32px',
            textAlign: 'center',
            fontSize: '13px',
            color: 'hsl(240, 20%, 50%)',
            lineHeight: '1.5'
          }}>
            {language === 'fr'
              ? 'Pas besoin de lire 50 articles. Choisis la situation et la réponse vient.'
              : 'Keine langen Artikel nötig. Situation wählen, Antwort bekommen. Fertig.'
            }
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'situations') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'hsl(240, 20%, 97%)',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: 'hsl(240, 30%, 20%)',
              margin: '0 0 8px 0'
            }}>
              {language === 'fr' ? 'Qu\'est-ce qui se passe là, maintenant ?' : 'Was passiert gerade bei dir?'}
            </h2>
            <p style={{
              fontSize: '14px',
              color: 'hsl(240, 20%, 40%)',
              margin: '0'
            }}>
              {language === 'fr' ? 'Trouve ta situation et la réponse arrive.' : 'Wähle deine Situation. Die Antwort folgt sofort.'}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {situations.map(situation => (
              <button
                key={situation.id}
                onClick={() => handleSituationClick(situation)}
                style={{
                  background: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  transform: 'translateY(0)',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                  {situation.emoji}
                </div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: 'hsl(240, 30%, 20%)',
                  margin: '0 0 8px 0',
                  lineHeight: '1.2'
                }}>
                  {language === 'fr' ? situation.fr.title : situation.de.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'hsl(240, 20%, 50%)',
                  margin: '0',
                  lineHeight: '1.3'
                }}>
                  {language === 'fr' ? situation.fr.subtitle : situation.de.subtitle}
                </p>
                {!situation.free && (
                  <div style={{
                    marginTop: '12px',
                    fontSize: '12px',
                    color: 'hsl(280, 70%, 55%)',
                    fontWeight: '600'
                  }}>
                    🔒 {language === 'fr' ? 'Premium' : 'Premium'}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'intervention' && selectedSituation) {
    const content = language === 'fr' ? selectedSituation.fr.content : selectedSituation.de.content;
    const sections = [
      { label: language === 'fr' ? '🗣️ TU DIS' : '🗣️ DU SAGST', key: 'dis' },
      { label: language === 'fr' ? '👉 TU FAIS' : '👉 DU TUTS DANN', key: 'fais' },
      { label: language === 'fr' ? '🚫 ÉVITE' : '🚫 NICHT MACHEN', key: 'evite' },
      { label: language === 'fr' ? '🔥 S\'IL CONTINUE' : '🔥 WENN ES WEITERGEHT', key: 'siContinue' },
      { label: language === 'fr' ? '⏱️ TON OBJECTIF' : '⏱️ DEIN ZIEL', key: 'objectif' },
      { label: language === 'fr' ? '💭 POURQUOI ÇA MARCHE' : '💭 WARUM DAS FUNKTIONIERT', key: 'pourquoi' }
    ];

    return (
      <div style={{
        minHeight: '100vh',
        background: 'hsl(240, 20%, 97%)',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <button
            onClick={handleBackToSituations}
            style={{
              background: 'white',
              border: 'none',
              padding: '12px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              color: 'hsl(240, 30%, 20%)',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            ← {language === 'fr' ? 'Retour' : 'Zurück'}
          </button>

          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: 'hsl(240, 30%, 20%)',
            margin: '0 0 8px 0',
            lineHeight: '1.2'
          }}>
            {language === 'fr' ? selectedSituation.fr.title : selectedSituation.de.title}
          </h2>
          <p style={{
            fontSize: '14px',
            color: 'hsl(240, 20%, 50%)',
            margin: '0 0 24px 0'
          }}>
            {language === 'fr' ? selectedSituation.fr.subtitle : selectedSituation.de.subtitle}
          </p>

          {sections.map((section, idx) => (
            <div key={idx} style={{
              background: 'white',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}>
              <div style={{
                fontSize: '13px',
                fontWeight: '700',
                color: 'hsl(280, 70%, 55%)',
                marginBottom: '8px'
              }}>
                {section.label}
              </div>
              <div style={{
                fontSize: '14px',
                color: 'hsl(240, 20%, 30%)',
                lineHeight: '1.5'
              }}>
                {content[section.key]}
              </div>
            </div>
          ))}

          <button
            onClick={handleNextSituation}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              background: 'hsl(280, 70%, 55%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '24px'
            }}
            onMouseEnter={(e) => e.target.style.background = 'hsl(280, 70%, 48%)'}
            onMouseLeave={(e) => e.target.style.background = 'hsl(280, 70%, 55%)'}
          >
            {language === 'fr' ? 'Autre situation' : 'Nächste Situation'}
          </button>
        </div>
      </div>
    );
  }

if (currentScreen === 'paywall') {
  return (
    <Paywall language={language} onClose={handlePaywallClosed} />
  );
}

  return null;
};

export default HomePage;
