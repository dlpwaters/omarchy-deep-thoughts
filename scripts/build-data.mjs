#!/usr/bin/env node

import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));

// These are original lines written for this plugin. The research sources in
// research-sources.json describe broad comic traits only; no quotations or
// Reddit submissions are copied into this corpus.
const handcrafted = [
  ["technology", "My phone has facial recognition, but I still have to introduce it to my charger three times."],
  ["technology", "The cloud is just somebody else's computer wearing a weather costume."],
  ["technology", "Every loading bar is a tiny documentary about optimism."],
  ["technology", "Airplane mode is a vacation setting for a device that never bought a ticket."],
  ["technology", "A forgotten password is your past self leaving you a locked diary."],
  ["technology", "Autocorrect is confidence without context."],
  ["technology", "The spinning beach ball is a computer's way of staring thoughtfully out a window."],
  ["technology", "A screenshot is a receipt for something the internet will later deny."],
  ["technology", "Wi-Fi passwords are modern campfire stories: everyone whispers them and nobody remembers the ending."],
  ["technology", "A software update is a note from the future saying your buttons have moved."],
  ["technology", "The mute button is the most honest participant in a video meeting."],
  ["technology", "A QR code is a tiny maze that rewards your phone for not solving it."],
  ["technology", "Two-factor authentication is a scavenger hunt where the prize is your own account."],
  ["technology", "The recycle bin is where files go to think about what they did."],
  ["technology", "A notification marked urgent has usually been waiting all day to sell you socks."],
  ["home", "The junk drawer is a retirement community for objects that still believe they are useful."],
  ["home", "A fitted sheet is fabric that has chosen a side in an argument you were not having."],
  ["home", "The chair with clothes on it is a closet going through a casual phase."],
  ["home", "A smoke detector can sleep through silence for years and still wake up angry about toast."],
  ["home", "Every house has one light switch that controls trust."],
  ["home", "The fridge light has seen more midnight decisions than most therapists."],
  ["home", "A doormat is a tiny rug whose entire personality is boundaries."],
  ["home", "The remote control is always exactly where nobody put it."],
  ["home", "A laundry basket is a countdown clock with handles."],
  ["home", "Dust is the house slowly filing paperwork about itself."],
  ["home", "The hallway is a room whose only ambition is elsewhere."],
  ["home", "A spare key is a secret your house tells the flowerpot."],
  ["home", "Curtains are windows deciding how social they feel."],
  ["home", "A squeaky floorboard is the house subscribing to notifications."],
  ["home", "The freezer is a time capsule where peas become archaeological evidence."],
  ["food", "Toast is bread that has seen things."],
  ["food", "A sandwich is a meal with built-in privacy."],
  ["food", "Soup is a drink that brought furniture."],
  ["food", "Cereal is breakfast soup with better public relations."],
  ["food", "Popcorn is corn applauding itself."],
  ["food", "A smoothie is a salad that deleted its search history."],
  ["food", "Leftovers are food asking for a second interview."],
  ["food", "A snack is a meal that refuses to fill out the paperwork."],
  ["food", "The last slice of pizza is a social experiment with cheese."],
  ["food", "Coffee does not solve problems; it gives them office hours."],
  ["food", "A recipe's prep time is a fictional genre."],
  ["food", "Ice cubes are water wearing hard hats."],
  ["food", "A grape is a raisin before the plot twist."],
  ["food", "Ketchup is a tomato's attempt to become a condiment influencer."],
  ["food", "A bag of chips is mostly an air sample with a crunchy appendix."],
  ["work", "A meeting agenda is a list of places the conversation will not visit."],
  ["work", "Reply all is a fire alarm people pull with their thumbs."],
  ["work", "A deadline is a date that learned how to stand behind you."],
  ["work", "The office printer feeds on confidence and legal-size paper."],
  ["work", "An empty spreadsheet is graph paper with career anxiety."],
  ["work", "A performance review is astrology with bullet points."],
  ["work", "The phrase quick question has never measured time."],
  ["work", "A business-casual shirt is a tie that negotiated remote work."],
  ["work", "The break room is where lunches exchange rumors about their owners."],
  ["work", "A calendar invite is a tiny fence built around the future."],
  ["work", "An org chart is a family tree that charges by the hour."],
  ["work", "A status update is a progress report written by the obstacle."],
  ["work", "The word synergy is three meetings wearing one trench coat."],
  ["work", "Inbox zero is a beach vacation for people who bring a rake."],
  ["work", "A name badge is a very small billboard for a person standing directly behind it."],
  ["language", "The word abbreviation is taking its time on purpose."],
  ["language", "Silent letters are spelling's unpaid interns."],
  ["language", "A typo is a word arriving before it gets dressed."],
  ["language", "Quotation marks are tiny tongs for handling somebody else's sentence."],
  ["language", "A question mark is a sentence scratching its head."],
  ["language", "Parentheses are where sentences keep their indoor thoughts."],
  ["language", "A thesaurus is a dictionary wearing several disguises."],
  ["language", "The word queue is one letter followed by four people waiting politely."],
  ["language", "An ellipsis is a sentence leaving through the back door..."],
  ["language", "A nickname is a name that loosened its tie."],
  ["language", "Fine can mean acceptable, attractive, or the beginning of an argument."],
  ["language", "We call it spelling because alphabet assembly sounded too honest."],
  ["language", "A comma is a speed bump built for thoughts."],
  ["language", "Sarcasm is honesty wearing a fake mustache."],
  ["language", "Small print is language trying not to be recognized."],
  ["time", "Tomorrow is today wearing unopened packaging."],
  ["time", "Monday is a weekly software license agreement."],
  ["time", "A minute in the microwave and a minute on a treadmill are different currencies."],
  ["time", "The weekend is a free trial with aggressive expiration settings."],
  ["time", "A birthday is your odometer sending a push notification."],
  ["time", "The present becomes the past without even asking for a signature."],
  ["time", "An alarm clock is a daily betrayal you schedule yourself."],
  ["time", "Five more minutes is the official currency of waking up."],
  ["time", "A calendar is a cage made entirely of future plans."],
  ["time", "Midnight is yesterday and tomorrow sharing a doorway."],
  ["time", "A leap year is the calendar finding change in the couch."],
  ["time", "Waiting makes every clock become a podcast about seconds."],
  ["time", "Nostalgia is memory applying a flattering filter."],
  ["time", "The snooze button turns consequences into a subscription."],
  ["time", "Being early is waiting with better branding."],
  ["body", "A yawn is your face opening a loading screen."],
  ["body", "Goosebumps are your skin trying to become Braille."],
  ["body", "Hiccups are the body checking whether the microphone is on."],
  ["body", "A sneeze is your face briefly accepting all permissions."],
  ["body", "Sleep is the body's airplane mode, except the dreams keep sending notifications."],
  ["body", "Your stomach has never read a clock but remains extremely opinionated about lunch."],
  ["body", "A headache is your brain filing a noise complaint against itself."],
  ["body", "Blinking is the smallest possible intermission."],
  ["body", "A scar is the skin keeping meeting minutes."],
  ["body", "Your knees remember every staircase you pretended was fine."],
  ["body", "A deep breath is the body's refresh button with no progress bar."],
  ["body", "Dreams are free movies made by a studio that lost the script."],
  ["body", "An itch is a notification with no app icon."],
  ["body", "A pulse is your body tapping its foot through the entire meeting."],
  ["body", "Stretching is the body unfolding its receipt."],
  ["animals", "Pigeons walk like they are late to a meeting they scheduled."],
  ["animals", "Cats treat gravity as a suggestion until a glass is near an edge."],
  ["animals", "Dogs think every closed door is a clerical error."],
  ["animals", "A goldfish lives in a studio apartment with panoramic walls."],
  ["animals", "Squirrels are tiny survivalists who forgot where the supplies are."],
  ["animals", "A snail is a moving company with one employee."],
  ["animals", "Owls look like they just remembered something you did."],
  ["animals", "Ducks are boats that can leave the lake whenever the plot requires it."],
  ["animals", "A spider web is a pop-up ad for flies."],
  ["animals", "Crows always look like the meeting should have been an email."],
  ["animals", "A turtle is a rock with long-term goals."],
  ["animals", "Ants invented traffic before roads and still refuse to use lanes."],
  ["animals", "A moth is a tiny astronomer with dangerously local ambitions."],
  ["animals", "Giraffes are proof nature occasionally drags the resize handle."],
  ["animals", "A crab is a spider that chose a beach lifestyle."],
  ["existence", "A queue is a temporary society founded on suspicion."],
  ["existence", "A mirror is a window that refuses to discuss the outside."],
  ["existence", "An elevator is a room that changes its mind about the floor."],
  ["existence", "A receipt is a tiny autobiography written by your wallet."],
  ["existence", "A doorway is a wall admitting it may have overreacted."],
  ["existence", "A shadow is proof light keeps notes."],
  ["existence", "A map is the world agreeing to fit in your pocket."],
  ["existence", "A handshake is a two-person loading animation."],
  ["existence", "A coincidence is probability trying to get your attention."],
  ["existence", "A souvenir is an object hired to remember a place for you."],
  ["existence", "An escalator is stairs admitting the original design was too much work."],
  ["existence", "A revolving door is architecture asking you to reconsider."],
  ["existence", "An umbrella is a portable roof with trust issues."],
  ["existence", "A pocket is a room your clothes rent to your hands."],
  ["existence", "A waiting room is a lobby where time has been placed on hold."],
];

const groups = [
  {
    category: "technology",
    subjects: [
      "A group chat", "Autocorrect", "Cloud storage", "A CAPTCHA", "A smart watch",
      "The Wi-Fi router", "A password reset", "A video call", "The spam folder",
      "A browser tab", "A charging cable", "A voice assistant", "A software update",
      "A loading spinner", "A push notification"
    ],
    predicates: [
      "is convenience assigning you homework.",
      "is a tiny bureaucracy powered by electricity.",
      "proves machines can be needy without having feelings.",
      "is modern life asking whether you are still paying attention.",
      "is a shortcut that brought its own paperwork.",
      "is progress wearing a customer-service headset.",
      "is what happens when a button develops terms and conditions.",
      "is the future politely requesting another password."
    ]
  },
  {
    category: "home",
    subjects: [
      "The junk drawer", "A fitted sheet", "The fridge light", "A laundry basket",
      "The spare room", "A smoke detector", "The kitchen sponge", "A squeaky hinge",
      "The thermostat", "A couch cushion", "The hallway closet", "A bedside lamp",
      "The shower curtain", "A tangled extension cord", "The mystery light switch"
    ],
    predicates: [
      "is where organization goes to become folklore.",
      "quietly remembers every shortcut you took.",
      "is a small domestic system held together by optimism.",
      "has been waiting all day to make one specific situation stranger.",
      "is furniture's version of an unsolved case.",
      "is the house keeping a private joke from you.",
      "proves every home needs at least one ceremonial inconvenience.",
      "is architecture experimenting with passive aggression."
    ]
  },
  {
    category: "food",
    subjects: [
      "A breakfast burrito", "Cold pizza", "A cup of coffee", "The last cookie",
      "A bag of chips", "A frozen dinner", "A suspicious leftover", "A smoothie",
      "A vending-machine sandwich", "A bowl of cereal", "A takeout menu", "A granola bar",
      "An avocado", "A microwave meal", "A birthday cake"
    ],
    predicates: [
      "is hunger hiring a marketing department.",
      "is a meal that skipped the planning meeting.",
      "proves convenience has its own cuisine.",
      "is an edible deadline with packaging.",
      "is nutrition wearing a novelty hat.",
      "is a snack pretending the situation is under control.",
      "is what happens when appetite gets purchasing authority.",
      "is a tiny celebration with cleanup instructions."
    ]
  },
  {
    category: "work",
    subjects: [
      "A status meeting", "A calendar invite", "The office printer", "A quarterly goal",
      "A reply-all email", "A performance review", "A shared spreadsheet", "A quick question",
      "The break room", "A project dashboard", "A name badge", "A Monday stand-up",
      "An expense report", "A corporate retreat", "An automatic reply"
    ],
    predicates: [
      "is anxiety formatted as a business process.",
      "is a calendar event wearing a fake mustache.",
      "proves paperwork can reproduce without supervision.",
      "is several adults borrowing one sense of urgency.",
      "is productivity posing for a stock photo.",
      "is a small obstacle wearing professional shoes.",
      "is work pausing briefly to explain that it is working.",
      "is the future being divided into thirty-minute rectangles."
    ]
  },
  {
    category: "language",
    subjects: [
      "A typo", "A question mark", "An ellipsis", "A nickname", "A silent letter",
      "A footnote", "A comma", "A parenthesis", "A slogan", "A disclaimer",
      "An abbreviation", "A metaphor", "A caption", "A thesaurus", "Small print"
    ],
    predicates: [
      "is language leaving a fingerprint.",
      "is a sentence briefly losing confidence.",
      "proves words enjoy hiding extra instructions.",
      "is grammar making a side comment to itself.",
      "is an idea trying on a smaller jacket.",
      "is punctuation doing emotional labor.",
      "is meaning taking the scenic route.",
      "is a thought arriving with its own legal department."
    ]
  },
  {
    category: "time",
    subjects: [
      "Monday morning", "The weekend", "A deadline", "Five more minutes", "Midnight",
      "A birthday", "Daylight saving time", "A lunch break", "A leap year", "Tomorrow",
      "A countdown", "A long weekend", "The snooze button", "An awkward pause", "A waiting list"
    ],
    predicates: [
      "is time sending a strongly worded reminder.",
      "is the calendar experimenting with suspense.",
      "proves clocks measure emotion by accident.",
      "is the future arriving with inconvenient confidence.",
      "is a tiny negotiation nobody remembers winning.",
      "is time putting one foot in the doorway.",
      "is the present wearing an expiration date.",
      "is a schedule discovering dramatic tension."
    ]
  },
  {
    category: "body",
    subjects: [
      "A yawn", "A sneeze", "A hiccup", "Goosebumps", "A headache", "An itch",
      "A deep breath", "A blink", "A stomach growl", "A stiff knee", "A dream",
      "A pulse", "A stretch", "A nervous laugh", "A forgotten train of thought"
    ],
    predicates: [
      "is the body opening a support ticket.",
      "is biology briefly using the announcement system.",
      "proves your organs have a group chat without you.",
      "is the body refreshing a page you cannot see.",
      "is a physical notification with no settings menu.",
      "is your nervous system improvising.",
      "is the body adding punctuation to the day.",
      "is your skeleton forwarding a memo."
    ]
  },
  {
    category: "animals",
    subjects: [
      "A pigeon", "A cat", "A dog", "A squirrel", "A duck", "A moth", "A snail",
      "A crow", "A goldfish", "A spider", "A raccoon", "A turtle", "A seagull",
      "A goat", "A housefly"
    ],
    predicates: [
      "looks like nature testing a side project.",
      "is an animal operating under a very specific misunderstanding.",
      "proves evolution occasionally keeps the funny draft.",
      "moves like it has somewhere important to be but no address.",
      "is wildlife wearing a tiny personal agenda.",
      "acts like the neighborhood has elected it informally.",
      "is a small creature with suspiciously strong opinions.",
      "looks prepared to explain a rule nobody else knows."
    ]
  },
  {
    category: "existence",
    subjects: [
      "A queue", "A mirror", "An elevator", "A receipt", "A doorway", "A shadow",
      "A map", "A handshake", "A coincidence", "A souvenir", "An escalator",
      "A revolving door", "An umbrella", "A pocket", "A waiting room"
    ],
    predicates: [
      "is ordinary life briefly admitting how strange it is.",
      "is a social agreement nobody remembers signing.",
      "proves reality has a sense of administrative humor.",
      "is an object performing one job with unnecessary symbolism.",
      "is the universe leaving a sticky note on your afternoon.",
      "is a practical solution with philosophical side effects.",
      "is civilization balancing on one oddly specific idea.",
      "is daily life wearing its surrealism inside out."
    ]
  }
];

const records = [];
const seen = new Set();

function add(category, text, kind) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (seen.has(normalized)) return;
  seen.add(normalized);
  records.push({
    id: `deep-thought-${String(records.length + 1).padStart(4, "0")}`,
    creator: "Omarchy Deep Thoughts",
    title: category.replace(/(^|-)\w/g, value => value.toUpperCase()),
    category,
    kind,
    text: normalized,
    work: "Original Deep Thoughts Collection",
    source_url: "https://github.com/dlpwaters/omarchy-deep-thoughts"
  });
}

for (const [category, text] of handcrafted) add(category, text, "handcrafted");
for (const group of groups) {
  for (const subject of group.subjects) {
    for (const predicate of group.predicates) {
      add(group.category, `${subject} ${predicate}`, "combinatorial-absurdism");
    }
  }
}

const expectedMinimum = 1000;
if (records.length < expectedMinimum) {
  throw new Error(`Expected at least ${expectedMinimum} unique thoughts, received ${records.length}.`);
}
if (records.some(record => record.text.length > 360)) {
  throw new Error("At least one thought exceeds the 360-character panel limit.");
}

const countsByCategory = records.reduce((counts, record) => {
  counts[record.category] = (counts[record.category] || 0) + 1;
  return counts;
}, {});

const collection = {
  schema_version: "2.0.0",
  title: "Deep Thoughts",
  description: "Original modern deadpan, absurd, and shower-thought-style observations.",
  license: "CC0-1.0",
  generated_at: new Date().toISOString(),
  generation_notes: "Original writing and deterministic comic recombination; no third-party jokes or posts are reproduced.",
  record_count: records.length,
  counts_by_category: countsByCategory,
  records
};

await writeFile(join(repositoryRoot, "thoughts.json"), `${JSON.stringify(collection, null, 2)}\n`);
process.stdout.write(`Wrote ${records.length} original modern thoughts.\n`);
