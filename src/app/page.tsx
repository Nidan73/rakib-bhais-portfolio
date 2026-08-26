import SplitFlapBoard from "@/components/SplitFlapBoard";
import Marquee from "@/components/Marquee";
import DhakaClock from "@/components/DhakaClock";
import Countdown from "@/components/Countdown";
import Quotes from "@/components/Quotes";
import { CONFIG, STAMPS, initialGot, fdate } from "@/lib/config";

function StampRows() {
  const nextI = initialGot.findIndex((g) => !g);
  return (
    <>
      {STAMPS.map((s, i) => (
        <button key={i} className={"prow" + (initialGot[i] ? " done" : "") + (i === nextI ? " next" : "")} data-goto={s.go}>
          <span className="pmark">{initialGot[i] ? "✓" : i + 1}</span>
          <span><b>{s.l}</b><span>{s.how}</span></span>
          <span className="go">{initialGot[i] ? "Stamped" : i === nextI ? "Do this →" : "Go →"}</span>
        </button>
      ))}
    </>
  );
}

export default function Page() {
  const nGot = initialGot.filter(Boolean).length;
  const nx = STAMPS[initialGot.findIndex((x) => !x)];
  const lockMsg = nGot < 6
    ? `${6 - nGot} stamp${6 - nGot > 1 ? "s" : ""} to go — next: ${nx.how.toLowerCase()}`
    : "Unlocked. The brief is yours to keep.";

  return (
    <>
      {/* HEADER */}
      <header className="hdr">
        <div className="hdr-in">
          <a href="#top" className="brand"><i></i>RAKIB</a>
          <nav className="nav" id="nav" aria-label="Sections">
            <a href="#work">Work</a>
            <a href="#stories">Stories</a>
            <a href="#voices">Voices</a>
            <a href="#journal">Journal</a>
            <a href="#brief">The Brief</a>
            <a href="#contact">Contact</a>
          </nav>
          <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
            <button className="pass" id="passBtn" title="Your boarding pass — click to see how to fill it">
              <span className="mono pass-lbl">Pass</span><span className="mono pass-n" id="passN">{nGot}/6</span>
              <span className="pass-bar"><i id="passFill" style={{ width: `${nGot / 6 * 100}%` }}></i></span>
            </button>
            <button className="menu-btn" id="menuBtn" aria-label="Open menu">Menu</button>
          </div>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="wrap">
            <div className="hero-top mono">
              <span>Dhaka, Bangladesh &nbsp;·&nbsp; GMT+6</span>
              <DhakaClock />
              <span>Open to partnerships &amp; advisory</span>
            </div>
            <h1>MD. RAKIB</h1>
            <div className="hero-sub mono">
              <span>Study abroad executive</span>
              <span>·</span>
              <span>Ireland &amp; UK student route</span>
              <span>·</span>
              <span>Counsellor training</span>
            </div>

            <SplitFlapBoard />
            <p className="sr">Currently working on: student placement to Ireland and the UK, counsellor training, and compliance systems.</p>

            <div className="hero-grid">
              <div>
                <p className="lede">I move Bangladeshi students through the part of the process where most of them get stuck — <strong>the file, the funds, and the interview.</strong> Ten years inside counselling rooms in Dhaka, now building the systems that let a small agency run to the same standard as a big one.</p>
                <p className="lede" style={{ color: "var(--ink-2)", fontSize: "1rem" }}>Currently: study abroad operations at FineAnswer, expanding into the UK Student Route, and writing openly about what actually gets a visa approved.</p>
                <div className="hero-cta">
                  <a href="#contact" className="btn">Start a conversation <span className="arw">→</span></a>
                  <a href="#work" className="btn ghost">See the work <span className="arw">↓</span></a>
                </div>
              </div>
              <Countdown />
            </div>
          </div>
        </section>

        <Marquee />

        {/* WORK */}
        <section className="sec" id="work">
          <div className="wrap">
            <div className="sec-head rise">
              <div>
                <div className="eyebrow mono">What I actually do</div>
                <h2>The work</h2>
              </div>
              <p style={{ maxWidth: "38ch", color: "var(--ink-2)", margin: 0 }}>Four things. If your problem is not one of these four, I will tell you and point you elsewhere.</p>
            </div>
            <div className="work-grid rise" id="workGrid">
              {CONFIG.work.map((w) => (
                <article className="wcard" key={w.n}>
                  <div className="idx mono">{w.n}</div>
                  <h3>{w.t}</h3>
                  <p>{w.d}</p>
                  <ul>{w.pts.map((p) => <li key={p}>{p}</li>)}</ul>
                </article>
              ))}
            </div>
            <div className="stats rise" id="statsRow">
              {CONFIG.stats.map((s) => (
                <div className="stat" key={s.l}><b>{s.n}</b><span className="mono">{s.l}</span></div>
              ))}
            </div>
            <p className="mono" style={{ color: "var(--ink-3)", marginTop: ".9rem" }}>
              Figures are placeholders — replace with numbers you can prove.
            </p>
          </div>
        </section>

        <hr className="rule"></hr>

        {/* STORIES */}
        <section className="sec" id="stories">
          <div className="wrap">
            <div className="sec-head rise">
              <div>
                <div className="eyebrow mono">Cases, not testimonials</div>
                <h2>Stories</h2>
              </div>
              <button className="lnk" id="allStories">See all stories <span className="arw">→</span></button>
            </div>
            <div className="stories rise" id="storyGrid">
              {CONFIG.stories.slice(0, 3).map((s, i) => (
                <button className="story" data-story={i} key={i}>
                  <span className="route mono">{s.r}</span>
                  <h3>{s.t}</h3>
                  <p>{s.s}</p>
                  <span className="more mono">Read the case →</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* VOICES */}
        <section className="sec voices" id="voices">
          <div className="wrap">
            <div className="eyebrow mono rise">In their words</div>
            <h2 className="rise" style={{ fontSize: "clamp(2.4rem,7vw,4.5rem)", marginBottom: "2rem" }}>Voices</h2>
            <Quotes />
          </div>
        </section>

        {/* JOURNAL */}
        <section className="sec" id="journal">
          <div className="wrap">
            <div className="sec-head rise">
              <div>
                <div className="eyebrow mono">Posted by me · commented by you</div>
                <h2>Journal</h2>
              </div>
              <div style={{ display: "flex", gap: ".6rem", alignItems: "center", flexWrap: "wrap" }}>
                <button className="btn sm admin-only" id="newPost">Write a post <span className="arw">+</span></button>
                <button className="lnk" id="adminBtn">Sign in to post <span className="arw">→</span></button>
              </div>
            </div>
            <div className="feed rise" id="feed">
              {CONFIG.seedPosts.map((p) => (
                <article className="post" data-id={p.id} key={p.id}>
                  {p.img ? <img className="post-img" src={p.img} alt=""></img> : ""}
                  <div className="post-body">
                    <div className="mono" style={{ color: "var(--ink-3)" }}>{p.tag || "Note"} · {fdate(p.d)}</div>
                    <h3>{p.t}</h3>
                    <p className="post-ex">{p.b}</p>
                    <div className="post-foot">
                      <button className="react js-like" data-id={p.id}><span className="hrt">○</span> 0</button>
                      <button className="react js-open-post" data-id={p.id}>✎ 0</button>
                      <button className="lnk js-open-post" data-id={p.id} style={{ marginLeft: "auto", fontSize: ".68rem" }}>Read <span className="arw">→</span></button>
                      <button className="react admin-only js-edit" data-id={p.id}>Edit</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <hr className="rule"></hr>

        {/* BRIEF */}
        <section className="sec" id="brief">
          <div className="wrap">
            <div className="sec-head rise">
              <div>
                <div className="eyebrow mono">Collect six stamps to open</div>
                <h2>The brief</h2>
              </div>
            </div>
            <div className="brief rise locked" id="briefWrap">
              <div className="brief-l">
                <h3 style={{ fontSize: "1.9rem", marginBottom: ".6rem" }}>Your boarding pass</h3>
                <p style={{ color: "var(--ink-2)" }}>Six stamps opens a one-page brief you can save or print. Each row below tells you exactly how to earn it — the red one is your next step.</p>
                <div className="plist" id="stampGrid"><StampRows /></div>
                <p className="lockmsg" id="lockMsg">{lockMsg}</p>
              </div>
              <div className="brief-r">
                <div className="brief-dl" id="briefDoc">
                  <div className="eyebrow mono">One page · updated monthly</div>
                  <h3 style={{ fontSize: "1.7rem", marginBottom: ".7rem" }}>Working principles</h3>
                  <ol style={{ paddingLeft: "1.1rem", margin: "0 0 1.2rem", color: "var(--ink-2)", fontSize: ".97rem" }}>
                    <li style={{ marginBottom: ".5rem" }}>No file goes out that I would not sign my own name to.</li>
                    <li style={{ marginBottom: ".5rem" }}>Eligibility is checked before money changes hands, never after.</li>
                    <li style={{ marginBottom: ".5rem" }}>If a student is not fundable, they hear it in the first meeting.</li>
                    <li>Every quoted cost separates the legal threshold from the estimate.</li>
                  </ol>
                  <button className="btn" id="printBrief">Save as PDF <span className="arw">↓</span></button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="sec" id="contact">
          <div className="wrap">
            <div className="sec-head rise">
              <div>
                <div className="eyebrow mono">Reply within one working day</div>
                <h2>Start a conversation</h2>
              </div>
              <p style={{ maxWidth: "36ch", color: "var(--ink-2)", margin: 0 }}>Tell me where you are in the process. Vague messages get vague answers.</p>
            </div>
            <form className="form rise" id="contactForm" noValidate>
              <div className="field"><label htmlFor="f-name">Your name</label>
                <input id="f-name" name="name" autoComplete="name" placeholder="Full name"></input><span className="err" data-for="f-name"></span></div>
              <div className="field"><label htmlFor="f-email">Email</label>
                <input id="f-email" name="email" type="email" autoComplete="email" placeholder="you@email.com"></input><span className="err" data-for="f-email"></span></div>
              <div className="field"><label htmlFor="f-topic">What is this about</label>
                <select id="f-topic" name="topic" defaultValue="">
                  <option value="">Choose one</option>
                  <option>Studying in Ireland</option>
                  <option>Studying in the UK</option>
                  <option>Counsellor or agency training</option>
                  <option>Partnership / representation</option>
                  <option>Speaking or media</option>
                  <option>Something else</option>
                </select><span className="err" data-for="f-topic"></span></div>
              <div className="field"><label htmlFor="f-stage">Where you are now</label>
                <select id="f-stage" name="stage" defaultValue="">
                  <option value="">Choose one</option>
                  <option>Just exploring (start here if this is all new)</option>
                  <option>Check if I qualify (if you want your profile assessed)</option>
                  <option>Shortlisting universities (I have a few in mind)</option>
                  <option>Offer in hand (I need help with the visa file)</option>
                  <option>Preparing funds and documents (the 28-day stage)</option>
                  <option>Previously refused (I need the file reviewed)</option>
                </select>
                <p className="hint">Not sure? Pick <b>Just exploring</b> — nobody is expected to know the answer yet.</p>
                <span className="err" data-for="f-stage"></span></div>
              <div className="field full"><label htmlFor="f-msg">Your question</label>
                <textarea id="f-msg" name="message" placeholder="The more specific, the more useful my answer."></textarea>
                <span className="err" data-for="f-msg"></span></div>
              <div className="field full" style={{ flexDirection: "row", alignItems: "center", gap: ".9rem", flexWrap: "wrap" }}>
                <button className="btn" type="submit" id="sendBtn">Send message <span className="arw">→</span></button>
                <span className="mono" style={{ color: "var(--ink-3)" }}>Or WhatsApp: <a href="https://wa.me/8801XXXXXXXXX" style={{ color: "var(--ink)" }}>+880 1XXX-XXXXXX</a></span>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="ft">
        <div className="wrap">
          <h3>Let&rsquo;s get the file right.</h3>
          <div className="ft-grid">
            <div><div className="mono" style={{ color: "var(--amber)", marginBottom: ".6rem" }}>Go to</div>
              <div style={{ display: "grid", gap: ".35rem" }}><a href="#work">The work</a><a href="#stories">Stories</a><a href="#journal">Journal</a><a href="#brief">The brief</a></div></div>
            <div><div className="mono" style={{ color: "var(--amber)", marginBottom: ".6rem" }}>Elsewhere</div>
              <div style={{ display: "grid", gap: ".35rem" }}>
                <a href="#" target="_blank" rel="noopener">LinkedIn</a>
                <a href="https://fineanswer.net" target="_blank" rel="noopener">FineAnswer</a>
                <a href="#" target="_blank" rel="noopener">Facebook</a></div></div>
            <div><div className="mono" style={{ color: "var(--amber)", marginBottom: ".6rem" }}>Reach me</div>
              <div style={{ display: "grid", gap: ".35rem" }}>
                <a href="mailto:hello@example.com">hello@example.com</a>
                <a href="tel:+8801XXXXXXXXX">+880 1XXX-XXXXXX</a>
                <span>Dhaka, Bangladesh</span></div></div>
          </div>
          <div className="ft-btm mono">
            <span>© <span id="yr">{new Date().getFullYear()}</span> Rakib. All rights reserved.</span>
            <button className="lnk" id="adminBtn2" style={{ color: "rgba(255,255,255,.6)", backgroundImage: "none" }}>Owner sign-in</button>
          </div>
        </div>
      </footer>

      {/* OVERLAYS */}
      <div className="ov" id="ovMenu"><div className="ov-bg" data-close></div>
        <div className="panel"><div className="ov-hd"><span className="mono">Navigate</span><button className="x" data-close>✕</button></div>
          <div className="ov-bd"><nav className="mnav">
            <a href="#work" data-close>Work <span>01</span></a>
            <a href="#stories" data-close>Stories <span>02</span></a>
            <a href="#voices" data-close>Voices <span>03</span></a>
            <a href="#journal" data-close>Journal <span>04</span></a>
            <a href="#brief" data-close>The Brief <span>05</span></a>
            <a href="#contact" data-close>Contact <span>06</span></a>
          </nav></div></div></div>

      <div className="ov" id="ovStories"><div className="ov-bg" data-close></div>
        <div className="panel"><div className="ov-hd"><span className="mono">All stories</span><button className="x" data-close>✕</button></div>
          <div className="ov-bd" id="allStoryList">
            {CONFIG.stories.map((s, i) => (
              <div style={{ marginBottom: "1rem" }} key={i}>
                <button className="story" data-story={i}>
                  <span className="route mono">{s.r}</span>
                  <h3>{s.t}</h3>
                  <p>{s.s}</p>
                  <span className="more mono">Read the case →</span>
                </button>
              </div>
            ))}
          </div></div></div>

      <div className="ov" id="ovStory"><div className="ov-bg" data-close></div>
        <div className="panel"><div className="ov-hd"><span className="mono" id="storyHdLabel">Case</span><button className="x" data-close>✕</button></div>
          <div className="ov-bd" id="storyBody"></div></div></div>

      <div className="ov" id="ovPost"><div className="ov-bg" data-close></div>
        <div className="panel"><div className="ov-hd"><span className="mono">Journal entry</span><button className="x" data-close>✕</button></div>
          <div className="ov-bd" id="postBody"></div></div></div>

      <div className="ov" id="ovCompose"><div className="ov-bg" data-close></div>
        <div className="panel"><div className="ov-hd"><span className="mono" id="composeTitle">New post</span><button className="x" data-close>✕</button></div>
          <div className="ov-bd">
            <div className="field" style={{ marginBottom: ".9rem" }}><label htmlFor="c-title">Title</label>
              <input id="c-title" placeholder="What is this post about?"></input></div>
            <div className="field" style={{ marginBottom: ".9rem" }}><label htmlFor="c-tag">Tag</label>
              <input id="c-tag" placeholder="Ireland · UK · Visa · Notes"></input></div>
            <div className="field" style={{ marginBottom: ".9rem" }}><label htmlFor="c-body">Post</label>
              <textarea id="c-body" style={{ minHeight: "220px" }} placeholder="Write it plainly. Blank lines make new paragraphs."></textarea></div>
            <label className="drop" id="drop" htmlFor="c-file">Drop a photo here, or click to choose
              <input id="c-file" type="file" accept="image/*" className="sr"></input></label>
            <img className="thumb" id="thumb" alt="" hidden></img>
            <div style={{ display: "flex", gap: ".6rem", marginTop: "1.2rem", flexWrap: "wrap" }}>
              <button className="btn" id="publishBtn">Publish <span className="arw">→</span></button>
              <button className="btn ghost" id="delPostBtn" hidden>Delete post</button>
              <button className="btn ghost" data-close>Cancel</button>
            </div>
          </div></div></div>

      <div className="ov" id="ovLogin"><div className="ov-bg" data-close></div>
        <div className="modal"><div className="ov-hd"><span className="mono">Owner sign-in</span><button className="x" data-close>✕</button></div>
          <div className="ov-bd">
            <p style={{ color: "var(--ink-2)", fontSize: ".96rem" }}>Only the owner account can post. Signing in with Google is the safer of the two doors — your password never touches this site.</p>
            <div id="gWrap"><div id="gBtn" style={{ display: "flex", justifyContent: "center", minHeight: "44px" }}></div></div>
            <div className="divider">or sign in with email</div>
            <div className="field"><label htmlFor="oe">Email</label>
              <input id="oe" type="email" autoComplete="username" placeholder="you@gmail.com"></input></div>
            <div className="field" style={{ marginTop: ".7rem" }}><label htmlFor="pw">Site password</label>
              <input id="pw" type="password" autoComplete="current-password" placeholder="••••••••"></input>
              <p className="hint"><b>This is your site password, not your Google password.</b> Set it in CONFIG. Never type a Google password into any site other than google.com.</p>
              <span className="err" id="pwErr"></span></div>
            <div id="pwWarn">
              {CONFIG.ownerPass === "FineAnswer2026" && (
                <p className="mono" style={{ color: "var(--stamp)", margin: ".9rem 0 0", lineHeight: 1.5 }}>
                  Default password still active — change ownerPass in CONFIG before this site goes live.</p>
              )}
            </div>
            <div style={{ display: "flex", gap: ".6rem", marginTop: "1rem", flexWrap: "wrap" }}>
              <button className="btn" id="loginGo">Sign in <span className="arw">→</span></button>
              <button className="btn ghost" id="logoutGo" hidden>Sign out</button>
            </div>
          </div></div></div>

      <div className="ov" id="ovPass"><div className="ov-bg" data-close></div>
        <div className="modal"><div className="ov-hd"><span className="mono">Your boarding pass</span><button className="x" data-close>✕</button></div>
          <div className="ov-bd">
            <p style={{ color: "var(--ink-2)", marginBottom: ".2rem" }}>Read the page, collect six stamps, and the one-page brief unlocks. Tap any row to jump straight there.</p>
            <div className="plist" id="passList"><StampRows /></div>
            <button className="btn ghost" id="passToBrief">Go to the brief <span className="arw">→</span></button>
          </div></div></div>

      <div className="toast" id="toast"></div>
    </>
  );
}
