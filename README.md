Padel Pals — simple web app for creating padel games & RSVPs
This is a very small Next.js + Supabase app you can deploy with no coding.

What it does
Create a game (title, venue, date & time, players needed)
Share a link (WhatsApp button included)
Friends RSVP (Yes/Maybe/No) — live updates
See how many slots are left
1) Create a Supabase project (5 minutes)
Go to https://supabase.com → Start your project (free tier is fine).
In the project, open SQL → New query and paste everything from supabase_schema.sql → Run.
Turn on Realtime for the rsvps table: Database → Replication → enable on rsvps.
In Project Settings → API, copy your Project URL and the anon public key.
2) Put your keys in Vercel (or locally) (2 minutes)
Create a file named .env.local in the project root and paste:

NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
3A) Deploy to Vercel (recommended, no coding) (5–10 minutes)
Create a free account at https://vercel.com.
Push this folder to a fresh GitHub repo (GitHub → New → Create → Upload files → drag & drop everything → Commit).
In Vercel, click Add New… → Project → import your repo.
When asked for Environment Variables, add:
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
Click Deploy. Your site URL appears in a minute.
3B) Run on your computer (optional)
You need Node.js 18+. Then:

npm install
npm run dev
Open http://localhost:3000

Tips
Timezone: the UI shows your local time; if your group spans countries, you can add timezone support later.
Anti-spam: for public links, consider adding hCaptcha later.
Styling: edit globals.css to change colors (I can brand it for you in grey & gold).
