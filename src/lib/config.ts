export const CONFIG = {
  ownerEmail: "rakibulislam0061@gmail.com",
  ownerPass: "FineAnswer2026",
  googleClientId: "",
  formEndpoint: "",
  contactEmail: "hello@example.com",

  deadline: { label: "January intake — document cut-off", date: "2026-10-15T23:59:00+06:00" },

  boardLines: [
    "STUDY ABROAD EXECUTIVE",
    "IRELAND + UK STUDENT ROUTE",
    "COUNSELLOR TRAINING",
    "VISA FILE COMPLIANCE",
    "BUILDING FINEANSWER",
  ],

  marquee: [
    "University shortlisting", "CAS & offer strategy", "Financial documentation",
    "Credibility interview prep", "Counsellor training", "Refusal case review",
    "Agency SOP design", "Partner university relations",
  ],

  work: [
    { n: "01", t: "Student placement", d: "End to end, from shortlist to visa decision. Ireland and the UK, undergraduate and taught masters.",
      pts: ["Course & university fit", "Offer and CAS strategy", "Funds and document file"] },
    { n: "02", t: "Visa file compliance", d: "The unglamorous part that decides the outcome. Built around UKVI and INIS thresholds, not around hope.",
      pts: ["Maintenance funds evidence", "28-day rule audit", "Refusal risk review"] },
    { n: "03", t: "Counsellor training", d: "Turning a room of salespeople into a room of counsellors who can read a regulation and say no.",
      pts: ["Operating guidelines", "Cost calculators", "Client-facing scripts"] },
    { n: "04", t: "Agency advisory", d: "For owners who want a small agency to run like a serious one. Process, ethics, and the paperwork behind both.",
      pts: ["SOP and audit trail", "Partner onboarding", "Pricing transparency"] },
  ],

  stats: [
    { n: "10+", l: "Years in counselling rooms" },
    { n: "2", l: "Markets: Ireland & the UK" },
    { n: "90%", l: "Files approved (placeholder)" },
    { n: "24h", l: "Reply time on enquiries" },
  ],

  stories: [
    { r: "Dhaka → Dublin", t: "A refusal, reversed", s: "Refused once for maintenance funds. Rebuilt the file from the bank statement up.",
      b: "The first application failed on one line: the funds had not sat still for the required period. Nobody had told the family that the clock matters more than the amount.\n\nWe restarted the money trail three months early, documented every transfer with a written source, and rewrote the statement of purpose around the actual course, not a template.\n\nApproved on the second attempt. The lesson was not about paperwork skill. It was about starting early enough to have paperwork at all.",
      m: "Second application approved · 11 weeks" },
    { r: "Dhaka → Manchester", t: "The student I turned away", s: "He had the money and the offer. He did not have the grades the course actually required.",
      b: "He came in with a conditional offer and a family ready to pay. On paper, a straightforward file.\n\nThe condition on that offer was never going to be met, and filing anyway would have cost the family a visa fee, a refusal on record, and a year.\n\nI told him no, in the first meeting, and mapped a foundation route instead. He is in the UK now, one year later than he wanted and with a clean immigration history.",
      m: "No file submitted · referred to foundation route" },
    { r: "Agency, Dhaka", t: "Twelve counsellors, one standard", s: "Rebuilt an agency's UK desk around written rules instead of individual instinct.",
      b: "Every counsellor was quoting different living-cost figures, because every counsellor had a different idea of where the number came from.\n\nWe separated the two things that had been blurred together for years: the UKVI legal threshold, which is fixed and non-negotiable, and the actual cost of living, which is an estimate and must be labelled as one.\n\nOne document, both figures, London and outside-London, in taka and pounds. Enquiry-to-file conversion went up because families stopped feeling sold to.",
      m: "12 counsellors trained · one source of truth" },
    { r: "Dhaka → Dublin", t: "Interview nerves, not weak English", s: "A credibility interview almost lost on delivery rather than substance.",
      b: "Her English was fine. Her answers were memorised, which is the fastest way to sound untruthful to an officer who has heard the same script all morning.\n\nWe threw away the script and worked on one thing: being able to explain, in her own words, why this course and why this country.\n\nShe passed. The prep took four sessions and none of it was grammar.",
      m: "Credibility interview passed · 4 sessions" },
  ],

  quotes: [
    { q: "He told my parents the truth about my grades before he told them the price. That is why we stayed.", n: "Student, Dublin", r: "Placed 2024 (placeholder)" },
    { q: "The first counsellor I have met who reads the guidance himself instead of repeating what he heard.", n: "Partner university officer", r: "Ireland (placeholder)" },
    { q: "Our team stopped guessing. The cost sheets he built are now the only ones we use.", n: "Agency owner, Dhaka", r: "UK desk (placeholder)" },
  ],

  seedPosts: [
    { id: "seed-1", t: "The 28-day rule is not a suggestion", tag: "UK · Visa",
      b: "Most refusals I review are not caused by a lack of money. They are caused by money that arrived too recently.\n\nFunds must be held for a full 28 consecutive days, and the closing balance must never dip below the required amount on any of those days. Not on average. On every single day.\n\nIf you are reading this and your intake is three months away, today is the day to freeze the account. Not the week before filing.",
      img: "", d: "2026-08-02" },
    { id: "seed-2", t: "What a credibility interview is actually testing", tag: "Notes",
      b: "It is not an English test. It is a consistency test.\n\nThe officer already has your file. They know your course, your fees, and your funding. What they are checking is whether the person in front of them recognises their own application.\n\nMemorise nothing. Understand everything. If you cannot explain why this course and not the cheaper one down the road, that is the gap to close before you file.",
      img: "", d: "2026-07-21" },
  ],
};

export const STAMPS = [
  { l: "Arrived", how: "You opened the page. That one was free.", go: "#top" },
  { l: "The work", how: "Scroll to The work and read the four cards.", go: "#work" },
  { l: "A story", how: "Open any case study and read it.", go: "#stories" },
  { l: "Voices", how: "Reach the Voices section.", go: "#voices" },
  { l: "Journal", how: "Open a journal entry.", go: "#journal" },
  { l: "Signal", how: "React to a post, or leave a comment.", go: "#journal" },
];

// fresh visit: stamp 0 free, rest uncollected
export const initialGot = [1, 0, 0, 0, 0, 0];

export function fdate(d: string | Date) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
