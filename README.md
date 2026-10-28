ProfileSync AI
ProfileSync AI compares information extracted from a resume with publicly available LinkedIn profile data and generates a field-by-field consistency score.
Features
- Resume upload: Upload a resume PDF through the web interface.
- AI-powered extraction: Uses an n8n workflow and an OpenAI model to extract candidate details from the resume.
- LinkedIn data retrieval: Calls an Apify LinkedIn profile scraper through the workflow.
- Field-by-field comparison: Compares name, location, skills, projects, experience, education, and certifications.
- Match scoring: Calculates a weighted consistency score and reports which fields match, partially match, mismatch, or are unavailable.
- Database storage: Saves verification results to a Supabase PostgreSQL table for later review.
Tech Stack
Layer	Technologies
Frontend	React, Vite, JavaScript, CSS
Workflow automation	n8n Cloud
AI extraction	OpenAI model through n8n
LinkedIn data retrieval	Apify (harvestapi/linkedin-profile-scraper)
Database	Supabase PostgreSQL
Version control	Git, GitHub


Workflow
1. The user uploads a resume PDF in the frontend.
2. The frontend sends the file to the n8n webhook.
3. n8n extracts the resume text and uses an AI model to structure the candidate information.
4. The workflow requests LinkedIn profile data through Apify.
5. A JavaScript Code node compares the resume and LinkedIn fields and calculates a weighted score.
6. The workflow returns the comparison result to the frontend.
7. A Postgres node stores the verification result in Supabase.
Fields Compared
Field	Weight
Name	10%
Location	10%
Skills	25%
Projects	20%
Experience	15%
Education	10%
Certifications	10%
Total	100%


The score is a text-similarity-based consistency indicator, not proof that a candidate's information is true. Missing fields may affect score coverage, and results should be reviewed by a person.
Getting Started
Prerequisites
- Node.js and npm
- An n8n Cloud account
- An Apify account and access to the selected LinkedIn scraper
- A Supabase project
- An OpenAI API credential configured in n8n
1. Clone the repository
git clone https://github.com/Khushboo1206/ProfileSync-AI.git
cd ProfileSync-AI
2. Install frontend dependencies
Run this in the directory containing the frontend's package.json:
npm install
3. Configure the n8n workflow
Create or configure the workflow with this general sequence:
Webhook
  → Extract from File
  → Message a model
  → Code in JavaScript (parse resume data)
  → HTTP Request (Apify)
  → Code (compare fields and calculate score)
  → Respond to Webhook
Configure the necessary credentials in n8n's credential manager. Do not commit API keys, access tokens, or database passwords to GitHub.

Set the frontend's webhook URL to your own active n8n production webhook URL. The workflow must be active/published and configured to respond through the Respond to Webhook node.
4. Configure Supabase
Create a Supabase project and a resume_verifications table containing columns for candidate details, resume/LinkedIn data, comparison fields, scores, review status, and creation time.

Configure the workflow's Postgres node with your Supabase PostgreSQL connection. Store credentials in n8n credentials, not in source code.
5. Run the frontend
From the frontend directory:
npm run dev
Open the local URL printed by Vite, usually:
http://localhost:5173
Exact commands and environment variables may differ depending on the project's folder structure and frontend configuration.

Repository Structure
Update this section to match the actual folders in your repository.
ProfileSync-AI/
├── src/                 # React application source (if using this structure)
├── public/              # Static assets (if present)
├── .gitignore
├── package.json
└── README.md
Security Notes
- Never commit .env, .env.local, API keys, access tokens, or database passwords.
- Keep Supabase database credentials and Apify/OpenAI credentials in n8n's credential store or environment variables.
- Only collect and process profile data you are authorized to use, and handle resume data responsibly.
- Review the repository history for accidentally committed secrets before making the repository public. Removing a secret from the latest version does not remove it from earlier commits; rotate any exposed credentials.
Current Limitations
- Comparison quality depends on the fields returned by resume extraction and the LinkedIn scraper.
- Similarity-based matching can produce false positives or miss equivalent wording.
- LinkedIn data availability and scraper behavior may change.
- This should be treated as a decision-support tool, not an automated hiring decision system.
Future Improvements
- Verification history page
- Detailed matched/mismatched field visualization
- Better semantic matching for skills and experience
- More robust error handling and retry logic
- Automated tests and CI checks
- Exportable verification reports
Author
Khushboo Nimje

GitHub: Khushboo1206
Built with React, n8n, AI extraction, Apify, and Supabase.


#Screenshots
React Dashboard to upload cv and its results 
<img width="1534" height="774" alt="image" src="https://github.com/user-attachments/assets/02d19eb2-9432-45a5-b8a9-3033e2298523" />
<img width="1362" height="617" alt="image" src="https://github.com/user-attachments/assets/694e70ff-b686-47c4-8354-bc50f6079af7" />

n8n workflow
<img width="1213" height="634" alt="image" src="https://github.com/user-attachments/assets/c435d20f-3273-4432-8c1c-d2edd4afe066" />
<img width="1233" height="637" alt="image" src="https://github.com/user-attachments/assets/964a1071-ffdd-4c79-a1da-46ff2822fd4a" />

postgres supabase db
<img width="1242" height="426" alt="image" src="https://github.com/user-attachments/assets/bd61b46a-a78e-494e-ba5f-1be4f28fb6f4" />



