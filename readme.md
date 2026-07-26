Village Milk Co-op — Register Dashboard

A dashboard for tracking daily milk collection, payments, and member statements for a village milk co-operative, with a simple built-in assistant that answers questions in plain language.
# Project Demo video 
https://drive.google.com/file/d/1jOwV-TQVcCZgcYep4tsXqk-lN3TpdfES/view?usp=sharing
 
Built for SIH 2026 · PDKVCET CSE PDKV · Practical Assessment.

Problem Statement

Village milk collection centres record daily entries on paper, making it hard to search past records, track who has been paid, and flag members whose payments are often delayed. This project gives the collection centre operator a single screen to search, filter, and review records, plus a chat assistant so they don't have to read a dense table to get a quick answer.

How to Run
Download or clone this repository.
Make sure all three files are in the same folder:
index.html
style.css
script.js
Open index.html directly in any modern browser (Chrome, Edge, Firefox).
No server, build step, or install is required — it runs entirely in the browser using generated sample data.
Field Reference

Each collection record has the following fields:

Field	Meaning	Possible Values
entry_id	Unique ID for one collection entry	E001–E100
member_id	ID of the member who delivered the milk	M001–M012, or an unmatched ID (e.g. M099) for orphaned records
member_name	Name of the member	One of 12 sample names, or blank if the member record is missing/unknown
date	Date of collection	Any date within 2024
session	Collection session	Morning or Evening
quantity_litres	Litres of milk delivered	A positive number (1–9 L), or blank if not recorded
fat_pct	Fat percentage of the milk	A number between 3–6.5%, or blank if not recorded
rate	Rate paid per litre, based on fat %	A calculated number, or blank if fat % is missing
amount	Total amount owed for the entry	quantity_litres × rate, or blank if either input is missing
payment_status	Whether payment was made on time	On-Time or Delayed
risk	Whether the entry looks like it needs attention	Low Risk or High Risk
Deliberate "awkward" test cases included in the data
Missing values: some entries have no fat_pct or no quantity_litres, which cascade into a missing rate and amount (shown as "N/A" on screen).
Similar names: two different members, "Raman S." (M004) and "Ramanan S." (M005), test that search and the assistant don't confuse them.
Orphaned record: entry E098 references member_id: M099, which does not exist in the member list. It appears in the records table but is not clickable and is excluded from member totals.
How Derived Figures Are Calculated
rate — derived from fat_pct: 28 + (fat_pct − 3.5) × 3, rounded to 2 decimals.
amount — quantity_litres × rate, rounded to 2 decimals.
Total Litres (stat card) — sum of quantity_litres across all records where it isn't missing.
Total Amount (stat card) — sum of amount across all records where it isn't missing.
Active Members (stat card) — count of unique member_ids that have at least one record with a known member name (the orphaned record is excluded).
On-Time % (member profile) — (on-time entries ÷ total entries for that member) × 100, rounded to the nearest whole number.
risk — currently a rule-based score (not yet a trained model — see "Not Yet Finished" below): +2 if fat % missing, +2 if quantity missing, +1 if quantity < 3 L, +0.5 if session is Evening. A total score ≥ 2 is labelled "High Risk."
Features
Main dashboard — stat cards (total litres, total amount, active members, high-risk count), a searchable/filterable records table, and a grid of all members.
Live search & filters — the table updates as you type, with dropdown filters for session, payment status, and risk. A count bar always shows how many records match, so filtering never looks like data has disappeared.
Member profile view — click any record or member tile to see that member's full collection history and payment summary.
Assistant (chat widget) — answers plain-language questions about:
total milk delivered by a member
balance/amount owed to a member
a member's payment status (on-time vs delayed count)
overall count of delayed payments Input is normalised (trimmed, lowercased, punctuation stripped) before matching to a supported question type.
Loading & empty states — the table shows a loading message briefly on load, and a clear "no records match" message when a search/filter returns nothing.
What Is Not Yet Finished

This submission currently covers Tasks 1, 2, and 4 of the assessment. The following are still outstanding:

Prediction model (Task 3): The risk field is currently calculated with fixed if-statement rules, not a trained classifier. A real model (e.g. logistic regression or decision tree) trained on historical data, with a train/test split and fixed random seed, still needs to be built and connected in place of the current rule-based logic.
Full integration testing (Task 5): End-to-end testing — verifying the model's output at the point of decision, checking a low-confidence prediction doesn't force an answer, testing the assistant as two different members, confirming out-of-scope questions get an "I don't know" response, and hand-verifying one calculated figure — has not yet been carried out or documented.
Field documentation was only added in this README, not shown anywhere in the running app itself.
Tech Stack
HTML, CSS, and vanilla JavaScript only — no frameworks or build tools.
Sample data is generated in-browser on page load (see script.js), so no backend or database is required to run or test this version.
File Structure
├── index.html   # page structure (dashboard, profile view, chat widget)
├── style.css    # all styling
├── script.js    # sample data generation + all app logic
└── README.md