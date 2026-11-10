// Email history from the Figma frame "Organisation detail" (Pipedrive New, node 1:3486). Only Peter Mertes has history so far.
export interface EmailEntry {
  id: string;
  subject: string;
  meta: string;
  preview: string;
  people: string;
  organisation: string;
  attachments: boolean;
}

export const historyByOrganisation: Record<string, EmailEntry[]> = {
  'peter-mertes': [
    { id: 'e1', subject: 'Re: Peter Mertes - GDSN data transfer kJ / kcal #14512', meta: 'October 14, 2026 (26 days ago) · Maximilian Eul → oliver.nuebel@scc-on.de +3', preview: 'Hello Mr. Nübel, we have since been able to implement this change, and it will go live shortly. I will gladly let you know again then. …', people: 'Maximilian Eul (+3)', organisation: 'Euvino Gmbh (+1)', attachments: true },
    { id: 'e2', subject: 'Re: Peter Mertes - GDSN data transfer kJ / kcal #14512', meta: 'October 8, 2026 (1 month ago) · Maximilian Eul → oliver.nuebel@scc-on.de +3', preview: 'Hello Mr. Nübel, I will coordinate with my colleagues on how and when we can best implement this, and will let you know as soon as I …', people: 'Maximilian Eul (+3)', organisation: 'Euvino Gmbh (+1)', attachments: true },
    { id: 'e3', subject: 'Re: Fwd: Grape variety validation error', meta: 'September 3, 2026 (2 months ago) · Hinrichs → Beate Schmitt +1', preview: 'Hello Ms. Schmitt, the grape variety list has indeed changed again for no apparent reason. The grape variety that was only added to the list last year …', people: 'Hinrichs (+2)', organisation: 'Peter Mertes KG We... (+1)', attachments: true },
    { id: 'e4', subject: 'Re: Fwd: Grape variety validation error', meta: 'September 2, 2026 (2 months ago) · Hinrichs → Beate Schmitt +1', preview: 'Dear Ms. Schmitt, the error message does not come from us but from the GDSN system. I am afraid that the list of accepted grape varieties there …', people: 'Hinrichs (+2)', organisation: 'Peter Mertes KG We... (+1)', attachments: true },
    { id: 'e5', subject: 'Re: Grape variety validation error', meta: 'September 2, 2026 (2 months ago) · Johannes Finze → Beate Schmitt', preview: 'Hello Ms. Schmitt, the GDSN data pool has probably adjusted the grape variety list again. We will look into it and fix it as quickly as possible. I …', people: 'Johannes Finze (+1)', organisation: 'Euvino Gmbh (+1)', attachments: false },
    { id: 'e6', subject: 'Grape variety validation error', meta: 'September 2, 2026 (2 months ago) · Beate Schmitt → Johannes Finze', preview: 'Dear Mr. Finze, we have a validation error in the Euvino system. Could you please forward the issue internally in your company to the appropriate …', people: 'Beate Schmitt (+1)', organisation: 'Peter Mertes KG We... (+1)', attachments: false },
    { id: 'e7', subject: 'Peter Mertes - Implementation of various GDSN topics', meta: 'August 31, 2026 (2 months ago) · oliver.nuebel@scc-on.de → Johannes Finze +3', preview: 'Hello Mr. Finze, I spoke with the colleagues at Peter Mertes. We can hold off on implementing the following topics until Mr. …', people: 'Johannes Finze (+3)', organisation: 'Euvino Gmbh (+1)', attachments: false },
    { id: 'e8', subject: 'Peter Mertes - GDSN data transfer kJ / kcal', meta: 'August 24, 2026 (2 months ago) · oliver.nuebel@scc-on.de → Maximilian Eul +3', preview: 'Hello Mr. Eul-Weiß, we have found another problem in the GDSN transfer. When transferring nutritional values for calories in kJ and kcal …', people: 'Maximilian Eul (+3)', organisation: 'Euvino Gmbh (+1)', attachments: false },
    { id: 'e9', subject: 'Re: Re: Peter Mertes - GDSN attributes M256 and M552', meta: 'March 19, 2026 (7 months ago) · Maximilian Eul → oliver.nuebel@scc-on.de +1', preview: 'Hello Mr. Nübel, hello Ms. Schmitt, we can only implement the requested GDSN feature (field M256, marketing message of the item) with an estimated total …', people: 'Maximilian Eul (+1)', organisation: 'Euvino Gmbh (+1)', attachments: true },
  ],
};
