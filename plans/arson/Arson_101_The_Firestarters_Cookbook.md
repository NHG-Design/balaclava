# Arson 101: The Firestarter's Cookbook

*An extensive manual to mastering the Arson crime in Torn RPG.*

---

## Introduction

Arson is quite simple. You get a job, break into the target property, carefully place various accelerants, then light them up in a fiery blaze. The goal is fulfilling the client’s requests (which usually boil down to *“just raze it entirely”*) by starting a fire and tinkering with it over a small window of time. 

The crime is very reactive, so make sure you have at least 2-3 minutes of spare time and enough nerve to clear a job come hell or high water (it is recommended to have **40+ Nerve** until you know what you’re doing).

![Arson Interface Placeholder](The arson interface with all the important components)

---

## The Actions

There are seven main actions a player can perform during arson. Below is a brief rundown:

* **INQUIRE:** Presents the lore for the target. Costs **0 Nerve** and serves to preserve a target (see *The Jobs* section).
* **BREACH:** Access the target property. Costs **3 Nerve** and may fail occasionally.
* **PLANT EVIDENCE:** Prompted only by specific job requirements. Costs **5 Nerve** and requires a miscellaneous item.
* **PLACE:** Add starter fuels before ignition. Must be done at least once before igniting. Costs **5 Nerve** per attempt and can be done repeatedly.
* **IGNITE:** Starts the fire, increasing intensity and momentum based on the starters placed. Costs **5 Nerve** and may fail depending on the accelerants placed and their quantities.
* **STOKE:** Adds fuel to an active fire. Costs **5 Nerve**; its failure rate varies depending on the accelerant used.
* **DAMPEN:** Smothers the fire, reducing intensity and momentum. Costs **5 Nerve**; failure rate varies depending on the dampener used.
* **COLLECT:** If the job is successful, allows you to collect your reward. Costs **2 Nerve**.

---

## Destruction

The main purpose of arson is causing damage to properties. The amount of damage caused is represented by the **destruction gauge**, showing a visual breakdown of the property increasingly damaged alongside a red bar indicating progress up to 100% destruction.

![Destruction Gauge Progress](The destruction gauge progressing after ignition. Source: CloudJumper)

### Destruction Mechanics
* **Rate of Increase:** Destruction increases at a variable rate defined by the fire’s current average intensity across all areas and the target’s flammability rating.
* **The Intensity Cap:** Destruction will only increase until it meets the intensity level. At that point, more fuel must be added to increase intensity further before destruction can catch up.
* **Thermite Boost:** The destruction rate increases as intensity rises up to a cap based on the target's flammability. To break past this cap, **Thermite** must be used as a starter or while stoking.
* **Success Thresholds:** Unless a job states otherwise, any amount of destruction counts as a successful clear, though final payouts scale directly with the final destruction percentage achieved.

---

## The Jobs

![Job Components Diagram](The components of a job, enumerated)

A job is composed of six unique components:
1. A location
2. A story
3. The current status of first responders
4. The destruction caused
5. The job’s specific requirements
6. The number of areas

### Generation and Time-Gating
Each day at **00:00 TCT (New Day)**, a new batch of jobs is generated. These jobs are completely synchronized across all players, meaning everyone receives the same pool. However, certain jobs are gated by your crime skill level; lower-skill players will see fewer available jobs. 

Jobs not interacted with will time out at the end of the day. Because no new jobs spawn until the next day once the daily batch is cleared, Arson is highly time-gated.

### Preserving Jobs
You can **"preserve"** jobs by interacting with them at least once (even simply inquiring about them works). This prevents them from despawning when the day ends, carrying them over to the next day. 

> ⚠️ **BEWARE:** While preserved jobs do not prevent new ones from spawning, if a duplicate of that exact job spawns in the new batch, it will be blocked entirely. Always clear your preserved jobs as soon as possible.

---

## Location Metrics: Flammability & Rurality

Hundreds of different jobs exist, differentiated by their location and narrative flavor. A job's location strictly determines its **Flammability**, **Rurality**, and **Number of Areas**.

### Flammability
Flammability dictates the rate at which intensity and momentum scale upon ignition and stoking, as well as the maximum destruction speed cap.

| Flammability Rating | Intensity/Momentum Factor | Maximum Destruction Rate | Burndown Time |
| :---: | :---: | :---: | :---: |
| **1x** | 1.0 | 0.4% per second | 250 seconds |
| **2x** | 1.5 | 0.8% per second | 125 seconds |
| **3x** | 2.0 | 1.2% per second | 83 seconds |
| **4x** | 2.5 | 1.6% per second | 63 seconds |
| **5x** | 3.0 | 2.0% per second | 50 seconds |

*Intuition Check:* Wooden, older structures possess higher flammability than industrial concrete or steel buildings.

### Rurality
Rurality dictates how long it takes for the fire to be reported, and how long first responders take to arrive once dispatched (**Response Time**).

| Rurality Level | Response Time (Seconds) |
| :---: | :---: |
| **1** | 30 |
| **2** | 60 |
| **3** | 120 |
| **4** | 240 |
| **5** | 480 |

*Intuition Check:* Populated business centers or city districts have low rurality (faster response), while remote or industrial areas have high rurality (slower response).

---

## Areas

![Area Priority and Sizes](Different area sizes and their priority order / enumeration)

Larger properties are divided into multiple **areas**, represented visually by flame indicators to the side of the UI.
* Each area tracks its own intensity, momentum, and destruction independently. 
* To achieve 100% total destruction, **all areas** must reach maximum intensity and stay there long enough for destruction to catch up.
* Most accelerants apply primarily to the **main area** (left-centermost). Heat, intensity, and momentum bleed over into secondary and ternary areas depending on the accelerant's **spread factor**. Gaseous fuels have the highest spread; solid fuels have the lowest.
* Accelerants deployed as *starters* receive a flat **+25% boost** to their spread.

---

## Job Requirements

While many jobs have no constraints, others demand strict parameters. Failing any single condition fails the job entirely, forfeiting the reward.

| Icon | Requirement | Details / Strategy |
| :---: | :--- | :--- |
| 🛡️ | **Insurance Claim** | Keep suspicion low. Use Oxygen, Saltpetre, and Kerosene. Use Methane to actively remove suspicion. |
| 🔥 | **Total Destruction** | Destruction must hit exactly 100%. |
| 📈 | **Minimum Damage** | Damage must clear the specified X% (hitting exactly X% is successful). |
| 📉 | **Maximum Damage** | Damage must remain *below* or equal to X% (do not exceed). |
| 📊 | **Damage Range** | Destruction must land strictly between X% and Y% (inclusive). |
| 🔍 | **Plant Evidence** | Require a miscellaneous item to be placed via the specialized action beforehand. |
| 🧪 | **Specific Accelerant** | Using unauthorized types fails the job (e.g., if "Gaseous Only", use only Oxygen, Methane, Hydrogen). Igniters/dampeners are always exempt. |
| 🍂 | **Accidental Cause** | Keep suspicion low using accidental-friendly items like Oxygen or Saltpetre. |
| 🚨 | **Highly Suspicious** | Opposite of accidental; maximize suspicion. High-impact fuels like Gasoline and Magnesium are recommended. |
| 👁️ | **High Visibility** | Maximize visibility. Utilize Magnesium and Diesel to build a massive glare. |

*Note: Jobs feature a flavor narrative "motive", but it has no known mechanical impact.*

---

## The Fire Mechanics

The underlying core of Arson consists of balancing two primary statistics (**Intensity** and **Momentum**) alongside two situational metrics (**Suspicion** and **Visibility**).

### 1. Intensity
Intensity reflects how fiercely the fire burns and how much space it occupies. High intensity increases the rate of destruction but causes emergency dispatchers to speed up, while increasing accidental risk when stoking or dampening.
* **Decay:** Intensity increases linearly based on current momentum. When momentum hits zero, intensity naturally decays at a fixed rate of **0.2 units per second**.
* **Visual Presentation:** Represented by the background color of the flames—moving from yellow (lowest) up to red (maximum intensity). 
* **Warning:** Avoid stoking or dampening a fire when the flame background is bright red, as it highly inflates critical failure rates.
* Area overflow works at a maximum cap of 100 per area. Gaseous items and Molotovs are vital for dragging stubborn secondary areas to max.

### 2. Momentum
Momentum represents unburned fuel pooling on the property. It is consumed linearly according to the target's flammability, and only increases when stoking.
* **Fuel Types:** Liquid fuels grant the highest momentum, followed by solids, while gaseous fuels provide the least.
* **Visual Presentation:** Indicated by the speed and turbulence of flame movement. 
* **Warning:** Always let excessive momentum burn off before adding more fuel. Stoking while momentum is high causes severe accidents (e.g., catching yourself in an ignition puddle).

### 3. Suspicion
Suspicion dictates how obvious the arson attempt is. All accelerants increase suspicion except **Methane**, which actively reduces it.
* **Limits:** Limits scale with location size. Bigger properties feature a more lenient suspicion ceiling. For standard *Insurance Claims*, expect a baseline limit equal to **3 × Number of Areas**.

![Suspicion Chart Placeholder](Suspicion increase by material used)

### 4. Visibility
Visibility determines how quickly the public reports the blaze. High visibility forces firefighters to deploy faster (affecting dispatch delay, not response time).
* **Modifiers:** Only Diesel, Magnesium Shavings, and the Flamethrower increase visibility. There is no existing method to lower visibility once raised.

---

## Firestarting: Starters & Ignition

The initial preparation phase requires placing starter materials before striking the match.

### Starters Overview
There are 9 available accelerants. While descriptions list custom safety ratings, these change significantly when applied as starters. Starter placement boosts item spread by **+25%**, which is perfect for multi-area locations.

* **Liquid Starters (Gasoline, Diesel):** Lowest risk profile. Spreads momentum evenly across all zones. Best configuration: deploy an amount equal to `(Number of Areas + 1)`, capped at a maximum of 5 to avoid spiking crit failure rates. Diesel natively suppresses ignition crit chances.
* **Solid Starters (Magnesium, Thermite):** Exceptional for tight locations (3 areas or fewer) when paired with liquids to exploit intensity spillover. Avoid running solids completely solo or paired with gases, as it triggers critical failures. Do not use more than one solid unless offset by Diesel. Very unsafe on Size 1 targets, highly stable on Sizes 4-5.
* **Gaseous Starters (Oxygen, Methane, Hydrogen):** High natural spread makes the starter bonus redundant. Deploying 2 yields intermediate global intensity; deploying 3 grants total max intensity across all areas, though crit chances rise. Always place Methane last to wipe accumulated suspicion. Avoid mixing with solids; they couple well only with Diesel.

*Rule of Thumb: Do not exceed 5 total combined starters.*

### Ignition Methods
Once fuel is placed, select your tool of choice:
1. **The Lighter:** Baseline utility tool. Critical failure rates scale strictly with the quantity of fuels pre-placed.
2. **The Molotov Cocktail (Unlocked at CS 30):** Operates on a fixed base critical failure rate independent of fuel quantity. Yields lower initial intensity, which is ideal for maximum damage caps.
3. **The Flamethrower (Unlocked at CS 80):** High risk, high reward. Injects massive baseline intensity and momentum equivalent to an entire extra Gasoline application.

---

## Fire Management: Stoking & Dampening

### Stoking
Stoking feeds an ongoing fire. Accelerants safe as starters can turn lethal when added to an active blaze.

![Accelerant Impact Matrix Placeholder](The following illustration depicts each of the 9 accelerants and their impact on intensity and momentum, as well as other useful information.)

* **Base Intensity:** Shown as the raw modification value applied exclusively to the main area before factoring flammability or specialized bonuses. (Starters have -20% intensity and +25% spread compared to stoking metrics).
* **Spread:** Quantifies how much intensity bleeds into secondary zones.
* **Special Items for Multi-Area Stoking:**
  * *Lighter:* Gives a minute +2.5% intensity, perfect for precise micro-adjustments.
  * *Molotov Cocktail:* Adds +17.5% intensity and momentum directly to whichever area currently has the lowest intensity (capped at the main area's current metrics).
  * *Flamethrower:* Disperses massive intensity randomly across all fields. Highly volatile; deploy only when the fire is fresh and small.

### Dampening
Dampening scales back fires to meet precise target ranges or smother a blaze completely.
* **The Blanket:** Free utility (not consumed), but extremely hazardous. Drops global intensity by 25%. Expect a 20% critical failure rate (1 in 5 attempts) at low skill levels, scaling down as Crime Skill grows.
* **Sand (Unlocked at CS 60):** Reliable intermediate option.
* **The Fire Extinguisher (Unlocked at CS 90):** Matches Sand's performance profile but carries a far safer operational baseline.

*Note on Negative Momentum:* All dampeners impart negative momentum. Once active momentum clears, intensity decays at an accelerated exponential rate, allowing you to bypass waiting for responders if you are in a rush.

---

## First Responders

![First Responders Progression](Animation showing first responders en route at different progress levels)

First responders act as the definitive time limit for your crime.
* **Dispatch:** Driven by rurality and accelerated by visibility. Once active, the central siren icon blinks progressively faster.
* **Response Levels:** The alert scales through five tiers represented by light beams around the siren (advancing every 20% mark of total response time). High tiers severely increase jail risk for stoking or dampening actions.
* **Arrival:** Once firefighters arrive, all actions are frozen. Natural intensity decay spikes from **0.2/sec to 1.0/sec**.
* **Magnesium Mitigation:** Stoking with **Magnesium Shavings** halves firefighter decay rates, stacking multiplicatively. Combining high momentum with multiple Magnesium stacks allows the fire to burn at maximum destruction values long after containment begins.

---

## Rewards and Payout Calculation

Upon natural extinction or firefighting containment, your final status is evaluated. Fulfilling all conditions opens up the **Collect** action (**2 Nerve**). Payout scales linearly with destruction achieved:
* **No Damage Cap:** Payout = `Base Reward × Destruction %`.
* **Maximum Damage Jobs:** Linearly proportional up to the threshold. If the limit is 25% and you hit 22%, you receive 88% of the maximum yield.
* **Minimum Damage, Damage Range, & Total Destruction Jobs:** Pay out 100% of the maximum reward as long as the conditions are satisfied.

*Note: A final ±10% random variance is applied globally to all payouts.*

---

## Points of Interest

### Crime Skill (CS) Gain Matrix

To optimize daily skill growth, prioritize actions based on their base multipliers:

| Action | CS Gain Factor | CS Per Nerve Spent |
| :--- | :---: | :---: |
| **Breach** | 100% | 33.33% |
| **Place** | 133% | 26.60% |
| **Ignite** | 300% | 60.00% |
| **Stoke** | 200% | 40.00% |
| **Dampen** | 200% | 40.00% |
| **Collect** | 600% | 300.00% |

#### Diminishing Returns Table
Repeatedly spamming the same action on a single target induces severe penalty decay to prevent grinding:

| # of Actions | Placing | Stoking | Dampening |
| :---: | :---: | :---: | :---: |
| **1** | 133% | 200% | 200% |
| **2** | 99.8% | 150.0% | 150.0% |
| **3** | 74.8% | 112.5% | 112.5% |
| **4** | 56.1% | 84.4% | 84.4% |
| **5** | 42.1% | 63.3% | 63.3% |
| **6** | 31.6% | 47.5% | 47.5% |

*Strategy:* Limit the same action type to **a maximum of 3 times** per target. 

*Self-Hospitalization Tip:* Diminishing returns also reduce CS losses from critical failures. To safely self-hosp with minimal skill penalty, repeatedly stoke with low-intensity fuels to max out the fire, then throw volatile items like Gasoline to trigger an intentional explosion.

---

## Strategy Paths

### 1. The Efficient Path (Low Nerve, Slow Progression)
Optimized for players conserving nerve for other crimes or avoiding expensive booster usage.
* **Setup:** Start heavy. Deploy `(1 Gasoline or Diesel per Area) + 1 Solid`. For maximum efficiency, use exactly one accelerant.
* **Execution:** Minimize your interaction footprint. Only stoke if required. For Insurance Claims, finish with a Methane stoke to wipe suspicion. For small targets requiring total destruction, a late Saltpetre stoke will suffice; for larger targets, use Diesel, Oxygen, or Molotovs.
* **Goal:** Focus on reaching the **Collect** phase using the fewest actions possible, exploiting the massive 600% collection multiplier. Skip complex requirements (High Suspicion, Specific Fuels) to maintain baseline optimization.

### 2. The Fast Path (High Nerve, Accelerated Progression)
Optimized for rapid skill grinding; requires extensive nerve resources (e.g., Pub job status or heavy alcohol usage).
* **Setup:** Minimal starters—a single canister of liquid fuel. 
* **Execution:** Maximize action counts. Target 3–6 stokes and dampens per target to maximize returns before heavy diminishing rates hit.
* **Multi-Area Trick:** On Size 2+ locations, ignite and wait 5 seconds for momentum to fade, then immediately dampen to put out *only* the secondary zone. Repeat this cycle across zones without touching the main area. Then stoke with a liquid (ideally Diesel) and repeat. Dampening low-intensity secondary zones has an incredibly low critical failure rate compared to the main area.
* **Warning:** On Size 1 targets, **never dampen** (lethal crit risk). Micro-adjust using low-intensity items or the Lighter instead.

---

## Unique Missions & Progression Unlocks

Unlike other crimes, Arson features **16 unique jobs** tied directly to milestone progression. They are guaranteed rewards upon successful completion and will continue to cycle back daily if failed.

### Contact Unlocks
| Contact | CS Unlock | Unique Target Job | Strategy Advice |
| :--- | :---: | :--- | :--- |
| **Chase Swindlehurst** | 1 | Shack - *Cut to the Chase* | Easy. Deploy a few canisters of Gasoline and ignite. |
| **Marvelous Mudenda** | 5 | Bordello - *Hell Fire* | Basic configuration. Deploy 3-4 Gasoline canisters. |
| **Denise David** | 48 | Bookies - *Improving the Odds* | Open with Diesel + Magnesium. Continuously stoke with Diesel. |
| **Ethan McChad** | 50 | Clock Tower - *Cooking Time* | Follow identical strategy to Denise David. |

### Material Unlocks
| Accelerant | CS Unlock | Unique Target Job | Strategy Advice |
| :--- | :---: | :--- | :--- |
| **Oxygen** | 5 | Dental Surgery - *A Bitter Taste* | Run heavy Gasoline lines. |
| **Saltpetre** | 10 | Barn - *The Bolted Horse* | Requires vast amounts of Oxygen for both starting and stoking. |
| **Diesel** | 15 | Gas Station - *Blown to High Heaven* | High difficulty. Start with Oxygen and immediately dampen within 1 second. |
| **Magnesium** | 20 | Firework Store - *Sky High Prices* | Gasoline + Saltpetre opener. Stoke with Saltpetre. Requires a Glitter Bomb. |
| **Methane** | 25 | Restroom - *Shit Happens* | Un-failable. Proceed normally. |
| **Molotov Cocktail** | 30 | Recording Studio - *Roast Beef* | 4 Diesel (dampen near end) OR 1 Gasoline followed by immediate dual Oxygen stokes. |
| **Kerosene** | 40 | Aircraft Hangar - *Plane and Simple* | Open with Diesel/Methane mix, follow through with Oxygen stoking. |
| **Thermite** | 50 | Foundry - *Hot Under the Collar* | Low flammability but exceptionally high rurality. Take your time. |
| **Sand** | 60 | Raceway - *Finish Line* | Low Kerosene + 1 Saltpetre starter. Stoke with a tank of Methane. |
| **Hydrogen** | 70 | Homeless Camp - *Bummed Out* | Triple Kerosene opener, stoke with Methane 1-2 times near completion. |
| **Flamethrower** | 80 | Pest Control Hub - *Bugging Me* | Massive Oxygen requirements. Start with 2-3, stoke near the end repeatedly for total destruction. |
| **Fire Extinguisher** | Unknown | Undetermined | *Information currently restricted.* |
