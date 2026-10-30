/**
 * CASE: UNKNOWN — Case #001: The Missing Necklace
 * Canonical Case Data, Fictional Mystery Lore, Suspects, Evidence, Locations, and Timeline.
 */

export const initialCaseData = {
  id: "001",
  title: "THE MISSING NECKLACE",
  tagline: "Every clue tells a story. Every story hides a truth.",
  status: "ACTIVE INVESTIGATION",
  location: "Blackwood Residence",
  incidentTime: "11:45 PM",
  missingItem: "The Blackwood Heirloom Sapphire Necklace",
  estimatedValue: "$1,250,000",
  briefing: "During an exclusive private gathering at the historic Blackwood estate, the priceless heirloom sapphire necklace was stolen from its reinforced glass display pedestal in the Living Room. At 11:15 PM, the estate suffered a total security and electrical blackout lasting precisely 17 minutes. Three individuals were inside the residence at the time of the blackout. Detective intervention was requested immediately following the discovery of shattered glass at 11:45 PM.",
  knownFacts: [
    "The necklace was securely locked inside the living room display case at 10:45 PM.",
    "A 17-minute security failure commenced at 11:15 PM and was restored at 11:32 PM.",
    "The municipal electrical grid reported zero external outages during the incident window.",
    "The display case lock was picked or bypassed prior to the display glass being shattered.",
    "Three primary persons of interest were inside the perimeter: Ethan Blackwood, Clara Morgan, and Daniel Reed."
  ],
  instructions: [
    "Search all four active sectors (Living Room, Balcony, Security Room, Guest Room) to recover hidden clues.",
    "Examine recovered evidence and conduct detailed forensic analysis in the Evidence Room.",
    "Interrogate all three suspects to test their alibis against the chronological timeline.",
    "Map cross-references and connect suspect motives on the Investigation Board.",
    "Once sufficient evidence is secured, file your formal deduction."
  ],
  initialObjective: "Search the 4 primary estate sectors to locate physical clues, then interrogate the suspects.",

  // Solution definition for Case #001
  solution: {
    culpritId: "S-03",
    culpritName: "Daniel Reed",
    keyEvidenceId: "E-03", // Security Log
    secondaryEvidenceId: "E-01", // Broken Watch
    summary: "Daniel Reed exploited his position as Security Officer to stage an artificial 17-minute blackout from the central console at 11:15 PM. Having bypassed the alarm battery, he picked the showcase lock, stole the sapphire necklace, and shattered the glass outwards to simulate an external burglar before restoring power at 11:32 PM. He staged the broken watch from an earlier altercation with Ethan and counted on Clara's balcony visit to divert suspicion.",
    motive: "Daniel had accumulated severe gambling arrears and had insider knowledge of the security failsafes. He disabled the generator deliberately to commit the theft unseen."
  },

  investigatedLocations: [],

  evidenceList: [
    {
      id: "E-01",
      name: "Broken Watch",
      type: "Physical Evidence",
      category: "Physical",
      location: "Living Room",
      status: "Undiscovered",
      discovered: false,
      inspected: false,
      analyzed: false,
      discoveryTime: null,
      description: "A luxury gold-rimmed wristwatch with a cracked crystal stopped precisely at 11:18 PM. Found tucked near the living room hearth.",
      analysisDetails: "Forensic examination reveals micro-scratches consistent with stone balustrade masonry, not shattered display glass. Traces of textile fibers on the strap clasp match security uniform nylon. The watch stopped due to impact at 11:18 PM during an altercation.",
      relatedSuspectId: "S-01" // Ethan Blackwood
    },
    {
      id: "E-02",
      name: "Torn Fabric",
      type: "Physical Evidence",
      category: "Physical",
      location: "Balcony",
      status: "Undiscovered",
      discovered: false,
      inspected: false,
      analyzed: false,
      discoveryTime: null,
      description: "A dark shred of fine silk weave caught on the exterior balcony railing overlooking the gardens.",
      analysisDetails: "Fiber spectrometry confirms 100% mulberry silk dyed in midnight navy. The tear corresponds to an ornamental fringe caught on garden rose briars, consistent with outdoor wind gusts rather than a hurried climbing escape.",
      relatedSuspectId: "S-02" // Clara Morgan
    },
    {
      id: "E-03",
      name: "Security Log",
      type: "Digital Evidence",
      category: "Digital",
      location: "Security Room",
      status: "Undiscovered",
      discovered: false,
      inspected: false,
      analyzed: false,
      discoveryTime: null,
      description: "Surveillance console audit trail showing an anomalous 17-minute blackout window (11:15 PM to 11:32 PM).",
      analysisDetails: "Terminal log entry #B-849 reveals the blackout was executed via manual keycode override directly from the internal Security Console. The municipal power grid experienced zero dips. The emergency generator was disabled deliberately at the terminal switch.",
      relatedSuspectId: "S-03" // Daniel Reed
    },
    {
      id: "E-04",
      name: "Silver Key",
      type: "Physical Evidence",
      category: "Physical",
      location: "Guest Room",
      status: "Undiscovered",
      discovered: false,
      inspected: false,
      analyzed: false,
      discoveryTime: null,
      description: "An antique silver key bearing the Blackwood crest discovered concealed beneath the guest room desk blotter.",
      analysisDetails: "Tumbler measurements reveal this key operates the 19th-century oak archive cabinet in the family study, NOT the modern high-security showcase pedestal in the living room.",
      relatedSuspectId: "S-01" // Ethan Blackwood
    }
  ],

  suspectsList: [
    {
      id: "S-01",
      name: "Ethan Blackwood",
      role: "Family Member",
      description: "A close family member who was present during the private gathering.",
      status: "Not Questioned",
      questionedCount: 0,
      alibi: "Claims he was in the corridor and private library looking for estate documents when the lights went black.",
      motive: "Under extreme financial pressure from creditors; stands to inherit substantial family assets if debts are cleared.",
      lastSeen: "11:10 PM - Near Auxiliary Hallway",
      notes: "Admitted to hiding the silver antique key to keep ancestral heirlooms from debt collectors. Vehemently denies touching the necklace.",
      relatedEvidenceIds: ["E-01", "E-04"],
      questions: [
        {
          id: "Q-S01-1",
          question: "Where were you at 11:15 PM when the security system went offline?",
          answer: "I was near the guest wing corridor. I had heard heavy, purposeful footsteps heading toward the security office. Before I could check who it was, every light in the wing flickered and died.",
          unlockLead: "Ethan confirms hearing someone enter the security sector immediately prior to the blackout."
        },
        {
          id: "Q-S01-2",
          question: "We recovered a damaged watch stopped at 11:18 PM. Does this belong to you?",
          answer: "Yes... that is my watch. But listen: at around 11:10 PM, I caught Daniel Reed lurking around the auxiliary power junction. We exchanged heated words, he shoved me, and my watch smashed against the stone balustrade. He told me to 'mind my own business or suffer the consequences'.",
          unlockLead: "Ethan's watch was broken during a physical confrontation with Daniel Reed at 11:10 PM, not during the theft!"
        },
        {
          id: "Q-S01-3",
          question: "What was your purpose for hiding an antique silver key in the guest room?",
          answer: "That key belongs to my late father's study archives. With creditors circling, I hid the key so private family documents wouldn't be seized. It has nothing to do with the living room display case!",
          unlockLead: "Forensic test confirms the silver key only opens the study archive, clearing it from the display pedestal."
        }
      ]
    },
    {
      id: "S-02",
      name: "Clara Morgan",
      role: "Guest",
      description: "A guest who arrived shortly before the security system went offline.",
      status: "Not Questioned",
      questionedCount: 0,
      alibi: "Stepped out onto the west balcony for fresh air just before 11:00 PM due to stifling heat in the gallery.",
      motive: "Has brokered discreet private antiquities sales for European collectors in the past.",
      lastSeen: "11:00 PM - West Balcony",
      notes: "Claims the torn fabric was a simple accident when the wind blew her shawl against the balcony rose bushes.",
      relatedEvidenceIds: ["E-02"],
      questions: [
        {
          id: "Q-S02-1",
          question: "Why did you visit the balcony alone at 11:00 PM in the cold rain?",
          answer: "The gallery was suffocating with family arguments over mortgages and auction estimates. I stepped outside for fresh air. The wind caught my silk wrap, and it snagged on the iron trellis. That is the entire secret behind your scrap of cloth.",
          unlockLead: "Clara admits the torn fabric on the balcony belongs to her evening wrap."
        },
        {
          id: "Q-S02-2",
          question: "Did you observe anything unusual while out on the terrace?",
          answer: "Actually, yes. Looking down toward the lower service courtyard, I noticed a flashlight sweeping the breaker room windows. Daniel Reed was inside, adjusting switches with a toolbox open.",
          unlockLead: "Eyewitness places Daniel Reed inside the breaker room manipulating switches prior to the blackout."
        },
        {
          id: "Q-S02-3",
          question: "Can anyone substantiate your exact whereabouts between 11:15 PM and 11:32 PM?",
          answer: "I was on an encrypted voice call with my gallery partner in Zurich from 11:12 PM until 11:30 PM. I was sitting on the foyer sofa the entire time. My carrier billing records will corroborate every minute.",
          unlockLead: "Clara's phone log corroborates an active phone call during the 17-minute blackout window."
        }
      ]
    },
    {
      id: "S-03",
      name: "Daniel Reed",
      role: "Security Officer",
      description: "Responsible for monitoring the residence security system that night.",
      status: "Not Questioned",
      questionedCount: 0,
      alibi: "Claims he was conducting outer perimeter rounds and that municipal power surges brought down the system.",
      motive: "Under crushing offshore debt; possessed master security clearance and terminal override access.",
      lastSeen: "11:30 PM - Security Hub Console",
      notes: "Attempted to blame the municipal electric grid for the blackout, which city logs contradict completely.",
      relatedEvidenceIds: ["E-01", "E-03"],
      questions: [
        {
          id: "Q-S03-1",
          question: "Why did the security system experience an unrecorded 17-minute outage at 11:15 PM?",
          answer: "The municipal grid had a brownout. High winds in the county triggered a breaker trip. It took the backup generator 17 minutes to kick over. Standard emergency reboot protocol.",
          unlockLead: "Daniel claims an external municipal power surge caused the blackout."
        },
        {
          id: "Q-S03-2",
          question: "The power company confirmed zero grid interruptions. The log shows a manual keycode override from your console.",
          answer: "Look... things happen during storms. The system misfired! I was out on the terrace grounds checking perimeter gates. Anyone could have slipped into the console room while my back was turned!",
          unlockLead: "Daniel contradicts himself when confronted with municipal records proving manual console override."
        },
        {
          id: "Q-S03-3",
          question: "Ethan Blackwood testified that you physically shoved him at 11:10 PM near the breaker switch.",
          answer: "Ethan is a broke aristocrat grasping at straws! He's trying to frame the working security guard to protect his inheritance! Check his luggage, not mine!",
          unlockLead: "Daniel becomes visibly hostile and refuses to account for his confrontation with Ethan near the breaker room."
        }
      ]
    }
  ],

  locationsList: [
    {
      id: "L-01",
      name: "Living Room",
      type: "Primary Crime Scene",
      shortDescription: "The central exhibition hall where the glass pedestal was shattered.",
      description: "The primary scene where the gathering was held. Shattered glass surrounds the empty showcase pedestal near the fireplace.",
      clueId: "E-01"
    },
    {
      id: "L-02",
      name: "Balcony",
      type: "Exterior Access Point",
      shortDescription: "Rain-swept terrace overlooking the gardens with an unlatched gate.",
      description: "Overlooks the west gardens. The wrought-iron balustrade door was left unlatched in the storm, suggesting an escape route.",
      clueId: "E-02"
    },
    {
      id: "L-03",
      name: "Security Room",
      type: "Surveillance Hub",
      shortDescription: "Central security console where video footage suffered a 17-minute blackout.",
      description: "House monitoring station. Digital video recorders show continuous feeds except for a crucial 17-minute blackout window.",
      clueId: "E-03"
    },
    {
      id: "L-04",
      name: "Guest Room",
      type: "Guest Wing",
      shortDescription: "Private upstairs guest suite with signs of hurried rummaging.",
      description: "A private upstairs chamber allocated to visiting guests during the gala. Desk drawers and floorboards show signs of disturbance.",
      clueId: "E-04"
    }
  ],

  timelineList: [
    {
      id: "T-01",
      time: "10:30 PM",
      title: "Guests Arrive",
      event: "Guests Arrive",
      type: "Guest Activity",
      status: "Corroborated",
      location: "Main Foyer & Gatehouse",
      description: "Guests arrive at Blackwood Residence for a private gathering.",
      fullDescription: "Invited attendees arrive at Blackwood Residence for an exclusive private evening gathering. Front gate and foyer logs show guests entering in formal attire.",
      isSuspicious: false,
      suspicionLevel: null,
      suspicionNote: null,
      witness: "Host Staff & Gatehouse Log",
      investigativeLead: "Arrival log corresponds with the host's RSVP list. No unrecognized vehicles entered at this time.",
      notes: "Initial guest arrivals recorded without incident. All attendees greeted in the foyer."
    },
    {
      id: "T-02",
      time: "10:45 PM",
      title: "Necklace Last Seen",
      event: "Necklace Last Seen",
      type: "Display Check",
      status: "Corroborated",
      location: "Living Room Showcase",
      description: "The necklace is reportedly seen in the living room.",
      fullDescription: "The heirloom sapphire necklace is reportedly seen secured inside the illuminated display case in the central living room. Multiple guests gather to observe the centerpiece.",
      isSuspicious: false,
      suspicionLevel: null,
      suspicionNote: null,
      witness: "Ethan Blackwood & Gathering Guests",
      investigativeLead: "Showcase sensor and display lock verified locked during this viewing window.",
      notes: "Necklace was verified intact under spotlight. Display pedestal lock was fully engaged."
    },
    {
      id: "T-03",
      time: "11:00 PM",
      title: "Balcony Visit",
      event: "Balcony Visit",
      type: "Witness Movement",
      status: "Under Review",
      location: "West Balcony Terrace",
      description: "Clara Morgan visits the balcony.",
      fullDescription: "Clara Morgan steps out toward the west balcony terrace overlooking the rain-swept grounds. The balcony exterior door was later discovered unlatched.",
      isSuspicious: true,
      suspicionLevel: "amber",
      suspicionNote: "Unusual departure from main gathering immediately prior to the blackout. Exterior gate unlatched; dark fabric fibers recovered nearby.",
      witness: "Corridor Guests & Service Staff",
      investigativeLead: "Torn dark fabric recovered from balcony balustrade. Requires comparison with attendee evening wear.",
      notes: "Clara Morgan claims she went outside for fresh air. Does not prove guilt, but timeline placement warrants priority inquiry."
    },
    {
      id: "T-04",
      time: "11:15 PM",
      title: "Security System Goes Offline",
      event: "Security System Goes Offline",
      type: "Security Malfunction",
      status: "System Flagged",
      location: "Security Hub & Breaker Room",
      description: "The security system goes offline.",
      fullDescription: "Electronic security feeds and magnetic door latches abruptly power down across the estate. A 17-minute surveillance blackout commences with no emergency generator takeover.",
      isSuspicious: true,
      suspicionLevel: "red",
      suspicionNote: "External municipal power grid reported zero surges. Manual breaker bypass strongly suspected; primary authorizer on duty is Daniel Reed.",
      witness: "Daniel Reed (Security Officer)",
      investigativeLead: "Breaker switch shows manual manipulation marks. Backup battery cables were intentionally loosened.",
      notes: "Daniel Reed claims he was checking outer perimeter gates during the outage. 17-minute gap is the primary window of opportunity."
    },
    {
      id: "T-05",
      time: "11:32 PM",
      title: "Security System Restored",
      event: "Security System Restored",
      type: "System Log",
      status: "Verified Log",
      location: "Security Hub",
      description: "The security system comes back online.",
      fullDescription: "Emergency auxiliary circuits switch back online after a 17-minute blackout window. Surveillance cameras resume live capture and internal monitoring reboots.",
      isSuspicious: false,
      suspicionLevel: null,
      suspicionNote: null,
      witness: "Daniel Reed & System Console",
      investigativeLead: "Surveillance console logs confirmed timestamp: 11:32:18 PM. Exactly 17 minutes of lost recorded footage.",
      notes: "Surveillance reboot successful. Footage before 11:15 PM and after 11:32 PM preserved for detective examination."
    },
    {
      id: "T-06",
      time: "11:45 PM",
      title: "Necklace Reported Missing",
      event: "Necklace Reported Missing",
      type: "Incident Report",
      status: "Active Lead",
      location: "Living Room Showcase",
      description: "The missing necklace is reported.",
      fullDescription: "Attendees discover the display glass shattered on the living room floor and the sapphire necklace missing. Immediate lockdown declared across the residence.",
      isSuspicious: true,
      suspicionLevel: "amber",
      suspicionNote: "Pedestal lock mechanism was picked prior to glass shattering, suggesting staged force or diversionary noise.",
      witness: "Ethan Blackwood & Gathering Attendees",
      investigativeLead: "Shattered glass pattern radiates outward in part, suggesting tampering before breakage. Residence perimeter sealed.",
      notes: "Detective called to scene. Case #001 officially opened. Initial case timeline established."
    }
  ],

  notesList: [
    {
      id: "N-01",
      time: "11:50 PM",
      category: "Forensics",
      title: "Display Case Tampering",
      content: "The lock on the glass case was picked before the glass was shattered. Suggests the perpetrator had time, lockpicks, or a bypass key."
    },
    {
      id: "N-02",
      time: "12:05 AM",
      category: "Interrogation",
      title: "Security Gap Contradiction",
      content: "Daniel Reed claims the power outage was a municipal storm surge, but the local grid operator verified zero interruptions."
    },
    {
      id: "N-03",
      time: "12:15 AM",
      category: "Clue Link",
      title: "Torn Fabric Fiber Match",
      content: "The dark fabric from the balcony matches Clara Morgan's silk wrap, but she claims it was torn on the rose briars while on a phone call."
    }
  ],

  // Initial connections for the Investigation Board
  initialConnections: [
    {
      id: "C-01",
      fromId: "E-01",
      fromTitle: "Broken Watch",
      toId: "S-01",
      toTitle: "Ethan Blackwood",
      notes: "Watch belongs to Ethan; stopped at 11:18 during confrontation."
    }
  ]
};

// Backwards compatibility alias
export const caseData = initialCaseData;
