
import { useState } from "react";
import "./App.css";

const WEBHOOK_URL =
  "https://khushboo1206.app.n8n.cloud/webhook/profilesync-upload";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cv, setCv] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    setResult(null);

    if (!cv) {
      setMessage("Please upload your CV.");
      setMessageType("error");
      return;
    }

    if (cv.type !== "application/pdf") {
      setMessage("Please upload a PDF file.");
      setMessageType("error");
      return;
    }

    if (cv.size > 5 * 1024 * 1024) {
      setMessage("Your CV must be smaller than 5 MB.");
      setMessageType("error");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("email", email.trim());
    formData.append("cv", cv, cv.name);

    try {
      setLoading(true);
      setMessage("Analyzing your CV and LinkedIn profile...");
      setMessageType("info");

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        body: formData,
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}.`);
      }

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          "n8n returned no JSON results. Check the Respond to Webhook node."
        );
      }

      // Support either a single result object or an array.
      const output = Array.isArray(data) ? data[0] : data;

      if (!output || !("field_match_score" in output)) {
        console.error("Unexpected n8n response:", data);
        throw new Error(
          "Comparison results were not found in the n8n response."
        );
      }

      setResult(output);
      setMessage("Profile comparison completed successfully!");
      setMessageType("success");

      setName("");
      setEmail("");
      setCv(null);

      const fileInput = document.getElementById("cv");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("ProfileSync request failed:", error);
      setMessage(
        error.message ||
          "Could not connect to n8n. Check your webhook and workflow."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <nav className="navbar">
        <a className="brand" href="/">
          <span className="brand-icon">P</span>
          ProfileSync<span className="brand-ai"> AI</span>
        </a>
        <span className="nav-label">AI Resume Verification</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">
          <span className="status-dot"></span>
          SMARTER PROFILE VERIFICATION
        </div>

        <h1>
          Your experience.
          <br />
          <span>Verified with AI.</span>
        </h1>

        <p className="hero-text">
          Upload your resume to extract your professional information
          and compare it with available LinkedIn profile data.
        </p>

        <div className="content-grid">
          <div className="info-panel">
            <div className="panel-top">
              <span className="panel-icon">✦</span>
              <span>WHAT HAPPENS NEXT</span>
            </div>

            <div className="feature">
              <span className="feature-number">01</span>
              <div>
                <h3>Resume parsing</h3>
                <p>
                  Extract your LinkedIn URL, skills, education and
                  work experience from your CV.
                </p>
              </div>
            </div>

            <div className="feature">
              <span className="feature-number">02</span>
              <div>
                <h3>Profile comparison</h3>
                <p>
                  Compare resume details with profile data obtained
                  through an authorized source.
                </p>
              </div>
            </div>

            <div className="feature">
              <span className="feature-number">03</span>
              <div>
                <h3>Structured results</h3>
                <p>
                  Organize extracted information and flag discrepancies
                  for review.
                </p>
              </div>
            </div>

            <div className="privacy-note">
              <span>🔒</span>
              <p>
                Your CV should be handled securely and processed only
                for the stated purpose.
              </p>
            </div>
          </div>

          <div className="form-card">
            <div className="form-heading">
              <div>
                <h2>Submit your profile</h2>
                <p>Enter your details and upload your CV.</p>
              </div>
              <span className="step-badge">STEP 01</span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="cv">Upload your CV</label>

                <label className="upload-area" htmlFor="cv">
                  <span className="upload-icon">↑</span>

                  <strong>
                    {cv ? cv.name : "Click to upload your CV"}
                  </strong>

                  <span>
                    {cv
                      ? `${(cv.size / (1024 * 1024)).toFixed(2)} MB`
                      : "PDF format · Maximum 5 MB"}
                  </span>

                  <input
                    id="cv"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => {
                      setCv(e.target.files?.[0] || null);
                      setMessage("");
                      setMessageType("");
                    }}
                    required
                  />
                </label>
              </div>

              <button
                className="submit-button"
                type="submit"
                disabled={loading}
              >
                {loading ? "Analyzing profile..." : "Continue to verification"}
                {!loading && <span>→</span>}
              </button>

              {message && (
                <p
                  className="form-message"
                  role="status"
                  style={{
                    color:
                      messageType === "error"
                        ? "#fca5a5"
                        : messageType === "success"
                          ? "#86efac"
                          : "#d9ccff",
                  }}
                >
                  {message}
                </p>
              )}

              <p className="terms">
                By submitting, you confirm that you are authorized to
                share this information for the stated purpose.
              </p>
            </form>
          </div>

          {result && (
            <section className="form-card results-card">
              <div className="form-heading">
                <div>
                  <h2>Comparison Results</h2>
                  <p>CV and LinkedIn profile comparison</p>
                </div>
                <span className="step-badge">COMPLETED</span>
              </div>

              <div className="score">
                <span>Field match score</span>
                <strong>
                  {result.field_match_score == null
                    ? "N/A"
                    : `${result.field_match_score}%`}
                </strong>
              </div>

              <p>
                <strong>Candidate:</strong>{" "}
                {result.candidate_name || "Not available"}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {result.candidate_email || "Not available"}
              </p>

              <p>
                <strong>LinkedIn:</strong>{" "}
                {result.linkedin_url ? (
                  <a
                    href={result.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View profile ↗
                  </a>
                ) : (
                  "Not available"
                )}
              </p>

              <p>
                <strong>Headline:</strong>{" "}
                {result.linkedin_headline || "Not available"}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {[result.linkedin_city, result.linkedin_country]
                  .filter(Boolean)
                  .join(", ") || "Not available"}
              </p>

              <h3>Field comparison</h3>

              {result.field_comparison?.length ? (
                result.field_comparison.map((item, index) => (
                  <div
                    className="comparison-row"
                    key={`${item.field}-${index}`}
                  >
                    <strong>{item.field}</strong>
                    <span>CV: {item.cv || "Not available"}</span>
                    <span>
                      LinkedIn:{" "}
                      {item.linkedin || "Not available"}
                    </span>
                    <span className={`status ${item.status || "unavailable"}`}>
                      {item.status || "unavailable"}
                    </span>
                  </div>
                ))
              ) : (
                <p>No field comparison data available.</p>
              )}

              <h3>Matched skills</h3>

              {result.skills_comparison_available ? (
                result.matched_skills?.length ? (
                  <div className="skills-list">
                    {result.matched_skills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                ) : (
                  <p>No exact skill matches found.</p>
                )
              ) : (
                <p>
                  LinkedIn skills were not available, so skill matching
                  could not be completed.
                </p>
              )}

              <h3>CV skills not matched</h3>

              {result.skills_comparison_available ? (
                result.cv_skills?.filter(
                  (skill) => !result.matched_skills?.includes(skill)
                ).length ? (
                  <ul>
                    {result.cv_skills
                      .filter(
                        (skill) =>
                          !result.matched_skills?.includes(skill)
                      )
                      .map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                  </ul>
                ) : (
                  <p>All compared CV skills matched.</p>
                )
              ) : (
                <p>
                  Unable to compare skills without LinkedIn skill data.
                </p>
              )}

              <p className="disclaimer">
                This score measures consistency across available fields.
                It does not prove identity or verify the accuracy of either
                source.
              </p>
            </section>
          )}
        </div>
      </section>

      <footer>
        <span>© 2026 ProfileSync AI</span>
        <span>Resume intelligence, made simpler.</span>
      </footer>
    </main>
  );
}

export default App;
