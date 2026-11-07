// Informations legales affichees sur la page Impressum / Mentions legales.
// A COMPLETER avant la mise en ligne : rue, code postal, ville, et le regime de TVA.

export const LEGAL = {
  name: 'Christelle Datouo',
  street: 'Erbacher Straße 10', // ex. 'Musterstraße 1'
  zip: '68305', // ex. '68159'
  city: 'Mannheim', // ex. 'Mannheim'
  country: 'Deutschland',
  email: 'contact@childpause.online',
  phone: '', // optionnel, voir la note dans la conversation
  // 'kleinunternehmer' (§ 19 UStG), 'ustid' (numero de TVA) ou '' (rien a afficher)
  vatMode: '',
    vatId: '',
  wIdNr: 'DE463721666-00001',
};

export function legalIsComplete() {
  return Boolean(LEGAL.name && LEGAL.street && LEGAL.zip && LEGAL.city && LEGAL.email);
}
