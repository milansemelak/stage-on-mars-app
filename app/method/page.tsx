"use client";

import { useState } from "react";
import Link from "next/link";

/* ── Types ── */
type Block = {
  title: string;
  body?: string;
  items?: { name: string; desc: string }[];
  table?: { headers: string[]; rows: string[][] };
};

type Section = {
  id: string;
  num: string;
  label: string;
  tagline: string;
  blocks: Block[];
};

/* ══════════════════════════════════════════════════════════
   FULL METHODOLOGY — from Stage on Mars Manual (14 pages)
   ══════════════════════════════════════════════════════════ */

const KEY_TERMS: { term: string; def: string }[] = [
  { term: "Mars", def: "We use Mars as a metaphor for something distant, abstract and unreachable. It is an imaginary tear in reality, a space where what cannot happen on Earth becomes possible. It is not about space travel. It is about the freedom to radically experiment." },
  { term: "Self-expression", def: "A foundational word. At Stage on Mars we do not act like actors. We express ourselves, authentically, guided by our own feelings and choices. Every expression is legitimate as long as it is true." },
  { term: "Systemic Play", def: "The method we use on Mars. It is the intuitive unfolding of a system made of living people, with the greatest possible freedom of expression. It combines principles of systemic constellations and theatrical improvisation." },
  { term: "Perspective", def: "The most common output of a Mars experience. The goal of a play is not a solution but an expansion of perspective. It allows us to see things differently, through collective creativity, movement and connection." },
  { term: "Constellations vs. Improvisation", def: "Systemic constellations form the foundation of the method, especially in assembling systems and roles. The system then unfolds intuitively. A play is therefore a constellation that transforms into improvised theatre." },
  { term: "Theatre vs. Stage", def: "Stage on Mars resembles theatre but has no audience. Nobody watches. Everyone plays. What matters is not the output but the process. The stage is a place for self-expression, not performance." },
  { term: "The Circle", def: "The circle is the way people sit around the stage, connected to one another and to the play. The circle is not just a physical arrangement but an energetic field. It creates a safe frame within which a play can emerge." },
  { term: "Systemic Play vs. Systemic Constellations", def: "Systemic Constellations look back. Systemic Play moves forward. Systemic Constellations explore the roots of a system — what happened, where it is disconnected, and why, with the intention to understand, release, and heal. Systemic Play starts with one question and plays out what could happen next, exploring possibilities, alternative realities, and potential directions. Sometimes the two intersect, but they begin from different places. Constellations require a full view of the system. Systemic Play needs one essential question." },
];

const SECTIONS: Section[] = [
  {
    id: "vision",
    num: "01",
    label: "Vision, Values & The Rule",
    tagline: "What we believe, how we hold space, and the one rule that governs everything.",
    blocks: [
      {
        title: "Vision",
        body: "We believe in a world where every human has unlimited potential. On Mars, that world already exists. Here, reality is not something fixed, but something you can play with. Through systemic play, we turn it into a space where you can try what wouldn't be possible elsewhere. In play, you see more, feel more, and allow more. And that's where new paths forward begin to emerge. What happens in play, you take back into reality.",
      },
      {
        title: "Values",
        body: "Freedom and responsibility hold our space in balance. Freedom means the ability to create and experiment without limits, with courage, playfulness and authenticity. Responsibility means that whatever each of us brings into the field shapes the outcome for everyone. In collective imagination the power of the individual multiplies, because every contribution influences the direction of the play, the depth of the experience and what we carry back to Earth.",
      },
      {
        title: "The Rule",
        body: "What happens and what does not happen, we create together. Everyone is the author of their own experience and the co-author of everyone else's. Choosing to ask a question or stay silent, stepping into the play or simply holding it with your gaze, exiting or overlooking. In collective imagination every voice carries weight and every step changes the shape of the play.",
      },
      {
        title: "How we talk about Stage on Mars",
        body: "We speak simply and professionally. We are not esoteric, and we are not another personal development course. We share the language of experiential change and collective imagination. This is a group experiment that shifts team dynamics, reveals new possibilities and helps people make better decisions. We use terms like experiential people development, experiential consulting and experiential decision-making, because they describe exactly what we do. We create a space where something new, meaningful and atypical can happen, and it still makes sense.",
      },
    ],
  },
  {
    id: "pillars",
    num: "02",
    label: "The Three Pillars",
    tagline: "People, Space, and Method — the foundation of every Mars experience.",
    blocks: [
      {
        title: "Overview",
        body: "Stage on Mars rests on three fundamental pillars: people, space and method. The first pillar is the people who create the experience — their energy, questions, insights and unique circumstances make every experience unprecedented. The second pillar is the space, the stage on Mars, a conceptual tear in reality where it is possible to experiment, create plays and search for new answers. The third pillar is the method of the Systemic Play, which gives raw human creativity a clear framework.",
      },
      {
        title: "Team roles",
        items: [
          { name: "Pilot (Guide)", desc: "The key element of every play on Mars. A member of the Stage on Mars team who has mastered the method in full depth and practice. Their role is to lead participants through the entire process, from initial attunement through the creation of the space to the integration of the experience. The Pilot explores the rules, holds boundaries and ensures a safe and creative frame. They know how to read the field, sense tensions in the system and direct attention to where a new image might appear. They are not a moderator, coach or therapist. They are an explorer of space and process. Every flight to Mars has one Pilot." },
          { name: "Navigator (Assistant)", desc: "Supports the Pilot throughout the entire play. Responsible for the technical, organizational and logistical flow of the experience. They prepare the space, track time, manage materials and ensure everything runs according to plan. When needed they communicate with participants and step in during technical or dynamic shifts." },
          { name: "Cast of Mars", desc: "Selected members of the Stage on Mars community brought in as needed for individual plays. Their role is to enrich the experience as active players — stepping into roles, embodying perspectives, creating scenes and helping to unfold the system. They do not lead the process but through their presence, perception and creativity they add depth. They are a support to the space, a sensitive mirror and a catalyst for change." },
        ],
      },
      {
        title: "Participant roles",
        items: [
          { name: "Client", desc: "Anyone who asks a question. By doing so they become the centre of the play and everyone else works for their experience. Their role is to bring a question, choose a Playmaker and together with them create the basic structure of the play. After the play the Client has the right to share their perspectives first. Their courage to ask a question opens the way for everyone." },
          { name: "Playmaker (Director)", desc: "Any participant who takes on the task of designing and leading the play that grows from the Client's question. Responsible for setting the play in motion — the beginning and end, the selection of players and the definition of the Client's role. The Playmaker creates the frame in which the play unfolds and watches over its development so that it leads to a meaningful experience." },
          { name: "Players", desc: "Everyone who joins the play once the Client has chosen the Playmaker. Being a player means accepting the offered role and expressing it in your own way. A player does not perform a role according to a script but brings themselves, their own view and perception into it. They are part of the system being explored and through their presence they help the Client see what they cannot see alone." },
          { name: "Captain", desc: "Leads the expedition when it involves the collective search of a team, company or community. They set the main intent of the entire play — a meta-question to which the other participants add their own questions. Everyone works toward the shared goal. The Captain may welcome participants, name important moments and make decisions that move the experience forward." },
        ],
      },
      {
        title: "The Space — Stage on Mars",
        body: "The space functions as a conceptual tear in reality where ordinary rules cease to apply. People can be anyone, ask any question and create new possibilities together. It has a ritual dimension: each time we consciously mark it out and connect it with the people who enter it. And it is a dimension of exposure: it invites every participant to their own breakthroughs. On stage, in the light, in play.",
      },
      {
        title: "Size, shape & marking",
        items: [
          { name: "Size", desc: "Recommended minimum is 5 by 4 metres, or a diameter of 5 metres for a circle, for groups of up to 20 people." },
          { name: "Shape", desc: "The circle is the most ritual, though square or rectangular works well. What matters is that the space allows movement, contact and a clear boundary." },
          { name: "Marking", desc: "Standard format is a stage outlined with orange gaffer tape. Another option is an orange LED strip for a strong visual frame. The stage should be clearly marked and the lines ideally closed." },
          { name: "Physical presence", desc: "It is significantly easier for participants to relate to the stage when it is physically present and ideally raised at least 30 centimetres above the ground. This signals the transition to another plane and helps people intuitively feel they are entering a different world." },
        ],
      },
      {
        title: "Supporting elements",
        items: [
          { name: "Projection", desc: "Stage format projectors for the opening intro and for displaying participants' questions." },
          { name: "Lighting", desc: "White and coloured, depending on the needs and atmosphere of each play." },
          { name: "Sound", desc: "Soundscape using music from Spotify or live music when available." },
          { name: "The Circle", desc: "People must be directly connected to the stage — no comfortable distance of a spectator. For circular stages, work in a circle directly around the space. For rectangular stages, seat people in a semicircle." },
          { name: "The Stick and the Bell", desc: "The Stick is a talking stick: whoever holds it may speak. The Pilot uses it when explaining, the Client when asking, the Playmaker when directing. The Bell signals start and end of plays and breaks." },
        ],
      },
    ],
  },
  {
    id: "question",
    num: "03",
    label: "The Question",
    tagline: "The currency of Stage on Mars. Without a question, we do not play.",
    blocks: [
      {
        title: "The meaning of the question",
        body: "It does not matter what the question is. What matters is that the participant asks it. It is the first step into the play, active participation, a conscious yes. The question opens the space and defines what is important to the person at that moment.",
      },
      {
        title: "How to submit a question",
        items: [
          { name: "Digital", desc: "Through a specially prepared landing page where the participant registers and their question is displayed anonymously on the site." },
          { name: "Physical", desc: "Submitted on-site if the experience is designed that way." },
          { name: "The Question Triangle", desc: "A standalone exercise where we lead participants through the process of asking questions from three angles and then collect them for use in the play." },
        ],
      },
      {
        title: "The Question Triangle (Hra na Otazky)",
        body: "An experiential way of working with a client's question, inspiring them to turn it around from three possible angles. Experience shows that the best plays come from personal questions. We use the Question Triangle for this exercise.",
        items: [
          { name: "Question about It", desc: "The external element — a project, a market, a product, a situation outside of yourself." },
          { name: "Question about Us", desc: "The collective element — a team, a relationship, a dynamic between people." },
          { name: "Question about Me", desc: "The individual element — a personal challenge, a feeling, an internal conflict." },
        ],
      },
      {
        title: "Asking the question",
        body: "The participant asks their question by stepping onto the stage and speaking it into the space. They may briefly add context, but their expression should always close with a clearly formulated question. By doing this they become the Client and the rest of the crew begins working for their experience.",
      },
      {
        title: "Meaning and quality",
        body: "The meaning and quality of the question belong exclusively to the Client. The Client is not required to explain, justify or answer follow-up questions about it. They have the right to rephrase their question. Their only task is to clearly speak it at the end, whatever it may be.",
      },
      {
        title: "Question selection mechanisms",
        body: "At every experience we usually have more questions than we can process. There are three basic approaches to sorting them.",
        items: [
          { name: "Rule of Courage", desc: "The person who asks the first question earns the right to choose the next one, and after each play the player chooses which question goes next." },
          { name: "Rule of Play", desc: "The Pilot turns the sorting of questions into a play that takes context into account and through which the questions naturally sort and prioritize themselves." },
          { name: "Rule of the Captain", desc: "The Captain steps into the selection of questions based on what is important for the direction of the expedition and the overall intent." },
        ],
      },
      {
        title: "Production of the question",
        body: "We support the centrality of questions through production — by displaying them and working with them in the space. All questions are published on the landing page and projected during the experience, creating a visual menu to choose from. When more clarity is needed, the questions are printed and each participant receives them on paper.",
      },
    ],
  },
  {
    id: "play",
    num: "04",
    label: "The Play",
    tagline: "Turning the question into lived experience.",
    blocks: [
      {
        title: "Dramaturgy of the space",
        body: "There are two chairs on stage. The Client who asked their question sits on one. Next to them is an empty chair: a potential Playmaker sits on the chair with their proposal, which they offer to the Client. The Client holds the Stick throughout.",
      },
      {
        title: "How a play is created",
        body: "It is important to keep Playmakers toward simplicity and structure. The foundation and most important element of any play is the characters that people will embody. The Playmaker names the characters and may present what we call an Image — a simple situation or scene in which the action will unfold — and may also set its dynamic. The final task is to assign the Client a role: whether they will watch from outside or become an active part of the play.",
      },
      {
        title: "Play proposals and choosing a Playmaker",
        body: "Each Client may receive a maximum of five proposals. The Client decides the final number and does not have to wait for all five. Playmakers stand in a line behind the Client, each approaching and speaking up from behind. The Client may briefly ask them to repeat their proposal before making the final choice. In the end they must choose one Playmaker and hand them the Stick.",
      },
      {
        title: "Casting players",
        body: "At this point we have the Client and the Playmaker. Together they assemble the play. The Playmaker briefly repeats the idea and may ask the Pilot for support. Then comes the nomination of characters. The ideal scenario is when the Playmaker names the characters and calls the Client to choose who fills them. If the Client consciously does not want to decide, the Playmaker makes the selection. All chosen players stand on stage until the entire cast is assembled. At the end everyone repeats their role, the Playmaker recaps the action, and together with the Navigator they go over the options for music and lighting. Before the play begins, everyone leaves the stage.",
      },
      {
        title: "Starting the play",
        body: "The Playmaker starts the play with the bell and sends players onto the stage to express their characters. Players may but do not have to follow the Playmaker's brief literally. The moment they step on stage they embody their roles in their own way.",
      },
      {
        title: "Self-expression",
        body: "A foundational word on Mars. We have players, not actors. We do not perform. We express roles according to our own feeling, intuition and connection. We play for ourselves and for the play itself.",
      },
      {
        title: "During the play",
        body: "During the play the Playmaker may add players or pull them out. Players must respond to this direction. Any other instructions they may improve on or ignore entirely. The Playmaker may ask players what they need and interactively add characters. The same applies to the audiovisual production, which follows the play and responds to its development.",
      },
      {
        title: "Ending the play",
        body: "The Playmaker ends the play according to their own perception and feeling. They end it with the bell. The play closes with applause and a conscious detachment of the players from the stage and from their roles.",
      },
      {
        title: "Sample play",
        body: "Image: a forest full of trees. Characters: every player is a tree carrying one word for the Client. Client's role: you walk among the trees, which cannot speak. One by one you send them away from the stage until only one remains. That last one finally tells you its word.",
      },
    ],
  },
  {
    id: "perspective",
    num: "05",
    label: "Perspective",
    tagline: "The output. Not solutions — new ways of seeing.",
    blocks: [
      {
        title: "Exchange of perspectives",
        body: "After every play there is an exchange of perspectives on stage. Anyone may step onto the stage and say what they saw, felt and caught in the play. It is a space for sharing viewpoints that help expand the meaning and enrich the experience of the Client and the whole group.",
      },
      {
        title: "Order",
        body: "The right to share first belongs to the Client, followed by the Playmaker, and then anyone who wants to speak. If things become chaotic or unclear the Pilot steps in and moderates the sharing.",
      },
      {
        title: "Form of expression",
        body: "This format is designed to create a space for creative and cultivated discussion in the style of a Greek forum. Participants speak to the whole, to the theme, and share personal viewpoints and perspectives. They do not share life advice or suggestions for improvement. The goal is to offer a viewpoint, not a solution. Whoever is sharing holds the Stick.",
      },
      {
        title: "Giving answers",
        body: "On Mars the process matters most, not ready-made solutions. However, if it is important for the Client or Captain to leave with a concrete answer, they may ask for one. The experience can be set up from the start to lead toward an answer. What matters is that even the answer comes through the play, not outside it. And its form can be just as surprising as the journey.",
      },
      {
        title: "Letter from Mars",
        body: "At most experiences we use the Letter from Mars as a closing perspective. We invite participants to write a letter, a thought, a viewpoint or a message they would like to send to someone on Earth. They place the letter in an envelope and it may remain anonymous. Each participant takes one letter at random when they leave. It is opened only at home or after leaving the space. It is a quiet moment of sharing that continues even after the play has ended.",
      },
    ],
  },
  {
    id: "dramaturgy",
    num: "06",
    label: "Dramaturgy",
    tagline: "The flow of the experience. Intro, Play blocks, Break, Outro.",
    blocks: [
      {
        title: "Preparing the space",
        body: "The stage is prepared and clean. Chairs are arranged around the stage. Questions are available either physically or displayed in the space. All brand elements — logo, neons, stickers — are set up according to the needs and type of experience.",
      },
      {
        title: "Arrival of participants",
        body: "The Pilot and navigators welcome everyone arriving and share basic practical information. Participants put away their belongings, ideally including phones and laptops. Before the start the Navigator rings the bell as a signal for everyone to take their seat.",
      },
      {
        title: "Intro",
        body: "The Pilot stands on stage, welcomes the participants and passes the Stick among them. Each person introduces themselves by name and may share a feeling or an expectation. The Stick returns to the Pilot, who gives a brief opening address, explains the basic principles of the method, presents the time frame and invites the group to begin working with questions.",
      },
      {
        title: "Break",
        body: "During the break it is good to leave the Mars space for a while, ideally to step outside for some fresh air.",
      },
      {
        title: "Outro",
        body: "After the last play the Pilot closes the play block with the Bell. Then they pass the Stick again for closing reflections and feelings about the overall experience.",
      },
      {
        title: "Rules of Mars",
        items: [
          { name: "Freedom", desc: "This experience gives you complete freedom of expression. It is essentially a tear in reality. You can create anything, show and express yourself however you feel. Nobody here will judge you." },
          { name: "Responsibility", desc: "Freedom and responsibility go hand in hand. Your boundaries are your own and they apply. You do not have to accept any proposal, role or direction that does not resonate with you. You can say no. You can change your mind at any time." },
          { name: "Alcohol", desc: "No alcoholic or other mind-altering substances are permitted during the experience. To get high, all you need to do is dive into the play." },
          { name: "Dress Code", desc: "Dress comfortable, so you can move and play freely. If you show up in a pink dinosaur costume (it has happened), we will be thrilled." },
          { name: "Play for the Play", desc: "This is not a performance. There is no audience. You are doing this only for yourself. You can be silent, sing opera, dance, recite, mumble or just speak like a normal person. Play for the play itself." },
          { name: "Truth", desc: "A lot happens on Mars. Emotions, ideas, insights. But what does not happen here is a single universal truth. We do not come here to agree. We come here to explore. And when we leave, everyone takes their own truth with them." },
          { name: "Confidentiality", desc: "What happens on Mars stays on Mars. Trust is essential. Everything we create, share and experience here stays in this space. This is a space of respect, safety and openness." },
        ],
      },
    ],
  },
  {
    id: "configurations",
    num: "07",
    label: "Configurations",
    tagline: "How sessions are shaped by intent. The method honours the point of choice.",
    blocks: [
      {
        title: "Overview",
        body: "The Stage on Mars method is experiential. It honours the point of choice — meaning participants can choose what they want at every moment. In its basic form it is a space where everyone plays with everyone and each person searches for their own answers. When a more focused intent is needed, we configure the Systemic Play accordingly.",
      },
      {
        title: "Questions",
        items: [
          { name: "Default", desc: "All participants bring questions." },
          { name: "Single", desc: "Only one person asks — for example the Captain — and the others serve as Playmakers or players." },
          { name: "Shared", desc: "The question is global for the entire group." },
        ],
      },
      {
        title: "Playmakers",
        items: [
          { name: "Default", desc: "Anyone can become a Playmaker." },
          { name: "Assigned", desc: "One specific person or a set number of Playmakers assigned in advance." },
          { name: "Alternative", desc: "No Playmaker — a different mechanic is used (cards, AI-generated inputs, or pre-prepared scenarios)." },
        ],
      },
      {
        title: "Perspectives",
        items: [
          { name: "Default", desc: "All participants share perspectives." },
          { name: "Expert", desc: "A person with expertise in the topic is invited to provide perspective." },
          { name: "Silence", desc: "Nobody shares perspectives — silence, integration, reflection without words." },
        ],
      },
    ],
  },
  {
    id: "plays",
    num: "08",
    label: "Example Plays",
    tagline: "Starting points, not scripts. Let yourself be guided by the question.",
    blocks: [
      {
        title: "How plays are born",
        body: "Plays on Mars are born simply and intuitively. Let yourself be guided by the question and follow the first image that comes to mind. Name it. Propose characters and their actions. Do not forget to assign the Client a role: observer, part of the action, or driving force of change. Every Playmaker can create their own play, exactly as they feel it.",
      },
      {
        title: "Individual plays",
        items: [
          { name: "Museum of Silence", desc: "A gallery full of statues. Every player is a statue carrying one posture or emotion. The Client walks among them in silence, may touch one to change its posture, and stays with the one that speaks to them most." },
          { name: "River Flow", desc: "A moving river. Players represent the current, each with their own movement, rhythm and energy. The Client enters, moves among them, feels how they touch them. Decides where to stop, who to stand in the way of, or whether to let themselves be carried." },
          { name: "Border Crossing", desc: "An invisible border between two worlds. Players represent different qualities — order, chaos, trust, solitude. The Client pauses through their presence. Nobody speaks, nobody moves. The Client stops where they feel resistance or attraction. They may try to cross the border or choose to stay." },
          { name: "Field of Possibilities", desc: "An open space with motionless bodies. Players lie, stand or sit, motionless. The Client enters and moves them according to inner feeling. Nobody resists. At the end they look at the image they created and interpret it for themselves." },
          { name: "Train Station", desc: "A station full of waiting trains. Every player is an alternative version of the Client who took a different path in life. The Client enters and has only a short time to talk with each version. They can ask what they experienced. At the end they choose one to go forward with." },
        ],
      },
      {
        title: "Business plays",
        items: [
          { name: "Annual Meeting", desc: "A meeting room without a table. Every player is a part of the organisation — sales, HR, fear, vision, chaos, the customer. The Client sits in the middle and watches what the individual voices say or leave unsaid. May ask one of them what they would say if they were allowed to." },
          { name: "Market of Ideas", desc: "A street full of stalls. Players are merchants selling solutions for the direction of a brand or company. The Client holds an envelope with their question, walks among the stalls, listens to the offers and at the end reveals who they would give the contract to." },
          { name: "Internal Audit", desc: "A quiet office with partitions. Every player is an inner voice of the Client evaluating direction — success, distrust, potential, exhaustion. The Client walks through the departments in silence, senses what is alive and what is dead. In the end they decide what to close and what to restructure." },
          { name: "Year 2030", desc: "A future version of the company. Every player is a part of the future ecosystem — a new market, a new type of leader, artificial intelligence, a new generation of customers. The Client is today's leader who must step into the future and decide what should become real and what will remain an illusion." },
          { name: "Boss in the Mirror", desc: "A simple room with one table. Players are different versions of the leader this company could have had — the inspirer, the micromanager, the authentic, the burnt-out boss, the blind strategist. The Client looks at each version and decides which one to be in the next chapter." },
        ],
      },
    ],
  },
  {
    id: "guide-protocol",
    num: "09",
    label: "Pilot Protocol",
    tagline: "Concrete tools for when the play is breaking. A decision tree, not mantras.",
    blocks: [
      {
        title: "A. The play has no tension",
        body: "If the play has been running for more than three minutes without movement, energy or change, the Pilot first diagnoses the cause. Is the problem in the image, in the players, or in the Client?",
        items: [
          { name: "Narrowing", desc: "The Pilot asks the Playmaker to reduce the number of players to two. Fewer people means greater exposure and greater tension." },
          { name: "Provocation", desc: "The Pilot invites one player to do something the others do not expect. Not a specific action but an impulse: 'Do something you would never normally do.'" },
          { name: "Stopping", desc: "The Pilot stops the play, turns to the Client and asks: 'What is missing here?' The Client names the missing element and it is added. The play continues." },
        ],
      },
      {
        title: "B. A participant breaks down emotionally",
        body: "The Pilot first distinguishes whether this is processing (healthy, functional, part of the process) or decompensation (loss of contact, overwhelm, inability to communicate).",
        items: [
          { name: "If processing", desc: "Do not touch, do not hug, do not comment. The Pilot stays close and holds the space with silence. Once it passes they offer a word: 'Do you want to say something, or is the silence alright?'" },
          { name: "If decompensation", desc: "The Pilot gently leads the participant off the stage. Physically: they stand, they walk out together. The Navigator takes over the group. The Pilot with the participant outside: 'You are here. Breathe. You do not have to do anything.' Return only if the participant wants to. No persuasion." },
        ],
      },
      {
        title: "C. The Playmaker freezes",
        items: [
          { name: "Cannot think of a proposal", desc: "The Pilot asks: 'When you heard the question, what was the first thing you saw?' The answer is the play. Even if it is simple. Especially if it is simple." },
          { name: "Proposed but cannot start", desc: "The Pilot offers: 'Tell the players where to stand. Leave the rest to them.'" },
          { name: "Lost control during the play", desc: "The Pilot steps in beside the Playmaker and quietly asks: 'Do you want to end it, or do you want to change something?' They give back the choice, not a solution." },
        ],
      },
      {
        title: "D. The group loses energy",
        body: "The Pilot diagnoses whether this is fatigue (physiological) or resistance (psychological).",
        items: [
          { name: "If fatigue", desc: "Break. No discussion. The body takes priority." },
          { name: "If resistance", desc: "The Pilot names it out loud: 'I sense the energy has dropped. What is going on?' They do not wait for an answer — just opening the space. If nobody responds, they change the format: pass the Stick with a single question — 'What would you need right now?' If that does not work either, the Pilot shortens the programme. Fewer plays with greater depth is better than more plays without energy." },
        ],
      },
      {
        title: "E. The play turns into conflict",
        body: "The Pilot distinguishes whether this is conflict within the play (part of the system, functional) or personal conflict (two people working out their own issues).",
        items: [
          { name: "If within the play", desc: "Leave it. This is systemic work. Tension is information. The Pilot watches whether the conflict is serving the Client." },
          { name: "If personal", desc: "The Pilot stops the play: 'I am pausing for a moment. This is important, but it is not this play. Let us return to the Client's question.' After the play they offer space to process, but off stage." },
        ],
      },
    ],
  },
  {
    id: "filters",
    num: "10",
    label: "Three Filters for the Playmaker",
    tagline: "A calibration tool. Thirty seconds in the Playmaker's head before proposing.",
    blocks: [
      {
        title: "Filter 1: Where is the tension?",
        body: "Every question has hidden tension inside it — something pulling in two directions. The Playmaker looks for this tension and builds the play around it. Example: the question 'Should I change my career?' The tension is between safety and the unknown. The play does not need eight characters. It needs two forces and the Client between them.",
        items: [
          { name: "Prompt", desc: "'What are the two worlds the Client is standing between?' If the Playmaker cannot name them, the play will be flat." },
        ],
      },
      {
        title: "Filter 2: What should the Client not know in advance?",
        body: "A good play contains a moment of surprise — something the Client did not expect. If the Client can predict the entire course, they will not gain a new perspective.",
        items: [
          { name: "Prompt", desc: "'Is there anything in my proposal that might surprise the Client?' If not, add one unpredictable element: a character the Client does not expect, a dynamic that reverses, or a rule that changes during the play." },
          { name: "Example", desc: "For a question about team leadership the Playmaker adds the character 'the one who left' — a person no longer on the team but still shaping its dynamic. The Client did not expect them but recognises them immediately." },
        ],
      },
      {
        title: "Filter 3: What should the Client experience, not understand?",
        body: "This is the most important filter. It separates the Systemic Play from brainstorming.",
        items: [
          { name: "Bad proposal", desc: "'Your people will stand here and tell you what they think about your question.' That is a discussion, not a play." },
          { name: "Good proposal", desc: "'Your people will stand here, each holding one thing you do not want to let go of. You have to take it from them or let them walk away.' That is an experience." },
          { name: "Prompt", desc: "'When the play ends, what will the Client feel?' If the answer is 'they will have more information,' the proposal is not good enough. If the answer is 'they will stand differently toward their question,' it works." },
        ],
      },
      {
        title: "Quick test before a proposal",
        items: [
          { name: "1", desc: "The tension in the question is between _______ and _______." },
          { name: "2", desc: "The Client will not expect _______." },
          { name: "3", desc: "After the play the Client will feel _______." },
        ],
      },
    ],
  },
  {
    id: "compass",
    num: "11",
    label: "The Compass",
    tagline: "A real-time tool for the Pilot. Where is the play right now?",
    blocks: [
      {
        title: "Two axes",
        items: [
          { name: "Vertical: Depth", desc: "At the top is Surface — the play is fun, creative, players are enjoying themselves, but nothing is being revealed. At the bottom is System — the play is showing something that was hidden. Relationships, forces, dynamics the Client could not see." },
          { name: "Horizontal: Source", desc: "On the left is Head — the players are playing what they think they should play. Constructing, inventing, planning. On the right is Body — the players are playing what they feel. Not planning. Reacting. Moving on impulse." },
        ],
      },
      {
        title: "Four quadrants",
        items: [
          { name: "Surface + Head = Performance", desc: "The players are showing off. It looks good but it is empty. An audience would applaud, but the Client feels nothing new. Move: the Pilot slows things down. 'Stop. Close your eyes. What do you feel right now?' A reset from head to body." },
          { name: "Surface + Body = Catharsis", desc: "Emotional, powerful, but undirected. The players are feeling deeply, but the play is not pointing toward the Client's question. Move: the Pilot returns attention to the Client. 'Client, what of what you are seeing belongs to your question?'" },
          { name: "System + Head = Analysis", desc: "The play is showing dynamics, but intellectually. The players are explaining instead of experiencing. Move: the Pilot removes words. 'Now without speech. Just movement.' Or: 'Express it in one gesture.'" },
          { name: "System + Body = Systemic Play", desc: "This is the goal. The play reveals hidden dynamics and the players are experiencing them in the body, not the head. The Client sees something new and feels it at the same time. The room is quiet, but not empty. Something has shifted. Move: do nothing. Hold the space. This is the moment Mars exists for." },
        ],
      },
      {
        title: "One diagnostic criterion",
        body: "Is the play surprising the Client, or confirming what they already know? If confirming — the play is on the surface. An element needs to be added that disrupts the pattern. If surprising — the play is approaching the system. Let it work.",
      },
      {
        title: "Practical use",
        body: "During the play the Pilot asks themselves two questions every two to three minutes: 1) Where are we on the compass? (Identifies the quadrant.) 2) Is that where I want to be? (Decides whether to intervene.) If the answer to the second question is no, they have a specific move for that quadrant.",
      },
    ],
  },
];

const VALUES = ["Freedom", "Responsibility", "Humor", "Humility", "Truthfulness"];

/* Sections grouped by category */
const FOUNDATION_SECTIONS = SECTIONS.filter((s) => ["vision", "pillars"].includes(s.id));
const CORE_SECTIONS = SECTIONS.filter((s) => ["question", "play", "perspective"].includes(s.id));
const ADVANCED_SECTIONS = SECTIONS.filter((s) => ["dramaturgy", "configurations", "plays", "guide-protocol", "filters", "compass"].includes(s.id));

/* ══════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════ */

/* Reusable accordion section renderer */
function SectionCard({ section, isOpen, onToggle, elevated }: { section: Section; isOpen: boolean; onToggle: () => void; elevated?: boolean }) {
  return (
    <div className={`rounded-2xl overflow-hidden shadow-sm ${elevated ? "bg-black text-white border border-white/[0.06]" : "bg-white border border-black/[0.06]"}`}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 sm:gap-4 px-5 sm:px-8 py-5 sm:py-6 text-left transition-colors ${elevated ? "hover:bg-white/[0.03]" : "hover:bg-black/[0.01]"}`}
      >
        <span className={`text-[11px] font-mono font-bold shrink-0 ${elevated ? "text-mars" : "text-mars/40"}`}>{section.num}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-[16px] sm:text-[20px] font-bold tracking-[-0.02em] ${elevated ? "text-white" : "text-black"}`}>{section.label}</p>
          <p className={`text-[12px] sm:text-[13px] mt-0.5 truncate ${elevated ? "text-white/40" : "text-black/40"}`}>{section.tagline}</p>
        </div>
        <svg
          className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${elevated ? "text-white/20" : "text-black/20"}`}
          fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-5 sm:px-8 pb-6 sm:pb-8 pt-0">
          <div className={`border-t pt-5 space-y-6 ${elevated ? "border-white/[0.08]" : "border-black/[0.06]"}`}>
            {section.blocks.map((block, bi) => (
              <div key={bi}>
                <p className={`text-[14px] font-semibold mb-2 ${elevated ? "text-white/90" : "text-black"}`}>{block.title}</p>

                {block.body && (
                  <p className={`text-[13px] sm:text-[14px] leading-[1.65] mb-3 ${elevated ? "text-white/55" : "text-black/55"}`}>{block.body}</p>
                )}

                {block.items && (
                  <div className="space-y-3 mt-1">
                    {block.items.map((item, ii) => (
                      <div key={ii} className="flex items-start gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${elevated ? "bg-mars/20" : "bg-mars/[0.08]"}`}>
                          <span className="text-mars text-[10px] font-bold">{ii + 1}</span>
                        </span>
                        <div className="flex-1">
                          <p className={`text-[13px] font-semibold ${elevated ? "text-white/80" : "text-black/80"}`}>{item.name}</p>
                          <p className={`text-[13px] leading-[1.6] mt-0.5 ${elevated ? "text-white/40" : "text-black/45"}`}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {block.table && (
                  <div className={`overflow-x-auto mt-2 rounded-xl border ${elevated ? "border-white/[0.08]" : "border-black/[0.06]"}`}>
                    <table className="w-full text-[13px]">
                      <thead>
                        <tr className={elevated ? "bg-white/[0.03]" : "bg-black/[0.02]"}>
                          {block.table.headers.map((h, hi) => (
                            <th key={hi} className={`text-left font-semibold py-3 px-4 border-b ${elevated ? "text-mars/70 border-white/[0.08]" : "text-black/60 border-black/[0.06]"}`}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.table.rows.map((row, ri) => (
                          <tr key={ri} className={`border-b last:border-b-0 ${elevated ? "border-white/[0.04]" : "border-black/[0.03]"}`}>
                            {row.map((cell, ci) => (
                              <td key={ci} className={`py-3 px-4 ${ci === 0 ? (elevated ? "text-white/70 font-medium" : "text-black/70 font-medium") : (elevated ? "text-white/40" : "text-black/45")}`}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MethodPage() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showTerms, setShowTerms] = useState(false);

  function toggleSection(id: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* ── Fixed nav ── */}
      <nav className="sticky top-0 z-50 bg-[#fafafa]/80 backdrop-blur-md border-b border-black/[0.04]">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/link">
            <img src="/logo.png" alt="Stage On Mars" className="h-6 sm:h-7 w-auto opacity-40 hover:opacity-80 transition-opacity" />
          </Link>
          <a
            href="mailto:play@stageonmars.com"
            className="text-[11px] font-semibold text-black/30 hover:text-mars uppercase tracking-[0.1em] transition-colors"
          >
            Contact
          </a>
        </div>
      </nav>

      {/* ══════════════════════════════════════
         HERO — dark, full-width, immersive
         ══════════════════════════════════════ */}
      <header className="bg-black">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-14 sm:pt-24 pb-12 sm:pb-20">
          <div className="flex items-start justify-between mb-8 sm:mb-10 gap-4">
            <div className="min-w-0">
              <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold mb-3 sm:mb-4">The Method</p>
              <h1 className="text-white text-[38px] sm:text-[72px] font-bold tracking-[-0.045em] leading-[0.95]">
                Systemic
                <br />
                Play
              </h1>
              <p className="font-mercure italic text-mars/70 text-[16px] sm:text-[22px] mt-2">
                by Stage on Mars
              </p>
            </div>
            <img src="/picto.png" alt="" className="w-14 h-14 sm:w-24 sm:h-24 mt-2 shrink-0" />
          </div>
          <p className="text-white/50 text-[14px] sm:text-[17px] leading-[1.65] max-w-lg">
            A collective, experiential search for new perspectives on questions
            through the unpredictable unfolding of a theme with the help of the
            creativity of real people. Combining systemic constellations with
            theatrical improvisation.
          </p>
          <p className="text-white/20 text-[11px] sm:text-[12px] mt-4">
            Milan Semelak — Vision, Method and Experience
          </p>
        </div>
      </header>

      {/* ══════════════════════════════════════
         FORMULA — the equation, visual centerpiece
         ══════════════════════════════════════ */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 -mt-7">
        <div className="bg-white rounded-2xl shadow-lg border border-black/[0.06] px-5 sm:px-8 py-6 sm:py-8">
          <p className="font-mercure italic text-center text-[22px] sm:text-[38px] leading-[1.15] text-black">
            <span className="text-mars">Question</span>
            <span className="text-black/15 mx-1.5 sm:mx-3">&times;</span>
            <span className="text-mars">Play</span>
            <span className="text-black/15 mx-1.5 sm:mx-3">=</span>
            <span className="text-black">Perspective</span>
          </p>
          <p className="text-center text-black/30 text-[12px] mt-2 font-medium">The core equation of Systemic Play</p>
        </div>
      </div>

      {/* ══════════════════════════════════════
         SECTIONS
         ══════════════════════════════════════ */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">

        {/* ── Foundation — Key Terms, Vision, Pillars ── */}
        <div className="mb-4">
          <p className="text-black/25 text-[10px] uppercase tracking-[0.2em] font-bold mb-4">Foundation</p>
        </div>

        {/* Key Terms */}
        <div className="mb-3 sm:mb-4">
          <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden shadow-sm">
            <button
              onClick={() => setShowTerms(!showTerms)}
              className="w-full flex items-center gap-3 sm:gap-4 px-5 sm:px-8 py-5 text-left hover:bg-black/[0.01] transition-colors"
            >
              <span className="text-mars/40 text-[11px] font-mono font-bold shrink-0">00</span>
              <div className="flex-1 min-w-0">
                <p className="text-black text-[17px] sm:text-[20px] font-bold tracking-[-0.02em]">Key Terms</p>
                <p className="text-black/40 text-[13px] mt-0.5 truncate">The language of Mars. Eight foundational concepts.</p>
              </div>
              <svg className={`w-5 h-5 text-black/20 shrink-0 transition-transform duration-200 ${showTerms ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {showTerms && (
              <div className="px-5 sm:px-8 pb-6 sm:pb-8">
                <div className="border-t border-black/[0.06] pt-5 space-y-4">
                  {KEY_TERMS.map((t, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-mars/[0.08] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-mars text-[10px] font-bold">{i + 1}</span>
                      </span>
                      <div className="min-w-0">
                        <p className="text-black/80 text-[13px] font-semibold">{t.term}</p>
                        <p className="text-black/45 text-[13px] leading-[1.6] mt-0.5">{t.def}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 mb-14 sm:mb-16">
          {FOUNDATION_SECTIONS.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              isOpen={expandedSections.has(section.id)}
              onToggle={() => toggleSection(section.id)}
            />
          ))}
        </div>

        {/* ── Core Method — Question, Play, Perspective (elevated black cards) ── */}
        <div className="mb-4">
          <p className="text-black/25 text-[10px] uppercase tracking-[0.2em] font-bold mb-4">The Core</p>
        </div>

        <div className="space-y-3 sm:space-y-4 mb-14 sm:mb-16">
          {CORE_SECTIONS.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              isOpen={expandedSections.has(section.id)}
              onToggle={() => toggleSection(section.id)}
              elevated
            />
          ))}
        </div>

        {/* ── Practice & Tools — Dramaturgy, Configs, Plays, Protocol, Filters, Compass ── */}
        <div className="mb-4">
          <p className="text-black/25 text-[10px] uppercase tracking-[0.2em] font-bold mb-4">Practice & Tools</p>
        </div>

        <div className="space-y-3 sm:space-y-4 mb-14 sm:mb-16">
          {ADVANCED_SECTIONS.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              isOpen={expandedSections.has(section.id)}
              onToggle={() => toggleSection(section.id)}
            />
          ))}
        </div>
      </main>

      {/* ── Values ── */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-10">
        <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-2 py-6">
          {VALUES.map((value, i) => (
            <span key={value} className="flex items-center gap-4">
              <span className="text-black/30 text-[11px] font-bold uppercase tracking-[0.15em]">{value}</span>
              {i < VALUES.length - 1 && <span className="w-1 h-1 rounded-full bg-mars/30" />}
            </span>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-black rounded-2xl px-6 sm:px-10 py-10 sm:py-12 text-center">
          <img src="/picto.png" alt="" className="w-10 h-10 mx-auto mb-5 opacity-30" />
          <p className="font-mercure italic text-white/50 text-[16px] sm:text-[18px] leading-[1.5] mb-6 max-w-sm mx-auto">
            Stage on Mars is not something you read.
            <br />
            It is something you play.
          </p>
          <a
            href="mailto:play@stageonmars.com"
            className="inline-block px-10 py-4 rounded-xl bg-mars text-white font-bold text-[14px] uppercase tracking-[0.12em] hover:bg-mars-light active:scale-[0.98] transition-all"
          >
            Get in touch
          </a>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="max-w-2xl mx-auto px-4 sm:px-6 pb-10 flex flex-col items-center gap-3">
        <img src="/logo.png" alt="Stage on Mars" className="h-5 opacity-15" />
        <a href="mailto:play@stageonmars.com" className="text-black/25 text-[11px] hover:text-black/50 transition-colors">
          play@stageonmars.com
        </a>
      </footer>
    </div>
  );
}
