export const TRACKING_EVENTS = {
  LANDING_VIEW: 'landing_view',
  LANDING_CTA_CLICKED: 'landing_cta_clicked',
  SITUATION_SELECTED: 'situation_selected',
  INTERVENTION_VIEWED: 'intervention_viewed',
  NEXT_SITUATION_CLICKED: 'next_situation_clicked',
  PAYWALL_VIEWED: 'paywall_viewed',
  PAYWALL_CTA_CLICKED: 'paywall_cta_clicked',
  PAYWALL_DISMISSED: 'paywall_dismissed',
  SURVEY_RESPONSE: 'survey_response',
};

export function trackEvent(eventName, data = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      timestamp: new Date().toISOString(),
      ...data,
    });
  }
  console.log(`[TRACK] ${eventName}`, data);
}