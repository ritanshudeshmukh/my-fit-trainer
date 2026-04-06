# 💪 My Fit Trainer — Alexa Skill

**My Fit Trainer** is a voice-powered fitness tracking assistant built as an [Amazon Alexa Skill](https://developer.amazon.com/en-US/alexa/alexa-skills-kit). It lets users start, pause, resume, and end workouts entirely hands-free, while tracking workout duration and calories burnt in real time.

> Built as a project for the *Introduction to Mobile Computing* course (Master's program).

---

## 🗣️ How to Use

Invoke the skill on any Alexa-enabled device:

```
"Alexa, Open My Fit Trainer"
```

### Supported Voice Commands

| Action | Example Phrase |
|---|---|
| Launch skill | *"Alexa, open My Fit Trainer"* |
| Start a workout | *"Start a new [workout type] workout"* |
| Pause workout | *"Pause my workout"* |
| Resume workout | *"Resume my workout"* |
| End workout | *"End my workout"* |

---

## ✨ Features

- 🎙️ **Hands-free workout tracking** — fully voice-controlled via Alexa
- ⏱️ **Duration tracking** — records how long each workout session lasts
- 🔥 **Calorie estimation** — calculates calories burnt based on workout data
- ⏸️ **Pause & Resume** — flexible session control without losing progress
- 🌍 **Multi-region deployment** — available in North America, Europe, and Asia Pacific

---

## 🏗️ Architecture

```
my-fit-trainer/
│
├── interactionModels/
│   └── custom/             # Alexa interaction model (intents, slots, utterances)
├── lambda/
│   └── index.js            # AWS Lambda skill backend (Node.js)
├── assets/
│   └── images/             # Skill icons (small + large)
└── skill.json              # Alexa skill manifest
```

The skill follows the standard Alexa-hosted architecture:

- **Interaction Model** — defines intents (StartWorkout, PauseWorkout, ResumeWorkout, StopWorkout) and slot types for exercise names
- **AWS Lambda** — Node.js handler processes Alexa requests, manages session state, and computes workout stats
- **Dialog Management** — uses `AMAZON.Conversations` for natural multi-turn dialogue

---

## 🚀 Deployment

### Prerequisites

- [Node.js](https://nodejs.org/) (v12 or later)
- [ASK CLI](https://developer.amazon.com/en-US/docs/alexa/smapi/quick-start-alexa-skills-kit-command-line-interface.html) (Alexa Skills Kit CLI)
- An [Amazon Developer](https://developer.amazon.com/) account
- An [AWS](https://aws.amazon.com/) account with Lambda access

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/ritanshudeshmukh/my-fit-trainer.git
   cd my-fit-trainer
   ```

2. **Install dependencies**
   ```bash
   cd lambda
   npm install
   ```

3. **Configure ASK CLI**
   ```bash
   ask configure
   ```

4. **Deploy the skill**
   ```bash
   ask deploy
   ```

   This deploys the interaction model and Lambda function across all configured regions (NA, EU, FE).

### Lambda Regions

| Region Code | AWS Region |
|---|---|
| NA (North America) | `us-east-1` |
| EU (Europe) | `eu-west-1` |
| FE (Far East) | `us-west-2` |

---

## 🧪 Testing

You can test the skill in the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask) simulator or on a physical Alexa device linked to your developer account.

**Quick test flow:**
1. Say *"Alexa, open My Fit Trainer"*
2. Start a workout with a supported exercise type
3. Pause, resume, and end the workout
4. Ask for your session summary

---

## 🔧 Dependencies

- Node.js
- [ask-sdk-core](https://www.npmjs.com/package/ask-sdk-core) — Alexa Skills Kit SDK for Node.js
- AWS Lambda

---

## 📄 License

This project is open source. Feel free to fork, explore, and build on it.
