# PCCycle | Eco-Friendly PC Parts Recycling Marketplace

PCCycle is a modern, responsive, and efficient computer parts recycling marketplace. It is designed to facilitate the collection of decommissioned corporate IT hardware, refurbish components for resale, and route 100% of profits to digital literacy and global aid charities. 

The website is engineered to run **100% statically on GitHub Pages**, utilizing a **hybrid storage engine** that syncs with a **Supabase Cloud Database** when configured, and falls back gracefully to local browser sandbox storage (`localStorage`) when offline.

---

## Key Features

- 💻 **Refurbished Parts Shop**: Tech-themed design system featuring search filters, spec listings, category selectors, and individual component diagnostics.
- 🏢 **Corporate Partner Portal**: Bulk donation logistics submission and a customized sustainability tracker displaying carbon offset metrics, landfill weight diverted, and funds raised.
- 🛡️ **Admin Control Console**: Live financial charts detailing charity allocations, an approvals inbox for corporate leads, a product catalog manager, and a user feedback logging system.
- 🛒 **Simulated Checkout Drawer**: Seamless e-commerce cart operations and order confirmations with strict static-export validation.
- 🌍 **Environmental Awareness widgets**: Tickers and impact badges outlining carbon offset conversions for recycled CPU/GPU/RAM components.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Static HTML Export mode)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (PostCSS compile pipeline)
- **Icons**: Lucide React
- **Database**: Supabase JS SDK (PostgreSQL cloud hosting) with local storage fallbacks
- **CI/CD**: GitHub Actions

---

## Getting Started

### 1. Prerequisites
Make sure you have Node.js installed on your machine. You can verify this by running:
```bash
node -v
npm -v
```

### 2. Local Configuration
1. Clone the repository and navigate to the project root directory.
2. Duplicate the `.env.local.example` file and rename it to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
3. Fill in your Supabase project credentials in the newly created `.env.local` file:
   ```text
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```
   *(If these variables are left empty or placeholder, the site will automatically run in local storage fallback mode).*

### 3. Run the Development Server
To launch the site locally:
```bash
# On Windows PowerShell:
$env:PATH += ";C:\Program Files\nodejs" # (If Node is not in session path)
npm.cmd run dev

# On Bash/Zsh:
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the local site.

---

## Database Schema Configuration (Supabase)

If you have a Supabase project and want to link the cloud database:
1. Open the [supabase/schema.sql](supabase/schema.sql) file.
2. Go to your **Supabase Dashboard** > **SQL Editor**.
3. Create a **New Query**, paste the contents of `schema.sql`, and click **Run**.
4. This creates the necessary database tables (`charities`, `inventory`, `donations`, `orders`, `order_items`, `messages`) and seeds initial records.

---

## Deploying to GitHub Pages

This project is configured to build and deploy automatically to your repository's GitHub Pages domain via GitHub Actions upon pushes to the `main` branch.

### Step 1: Point Pages to GitHub Actions
1. Go to your GitHub repository Settings.
2. Click **Pages** on the left sidebar.
3. Under **Build and deployment** -> **Source**, select **GitHub Actions** from the dropdown menu.

### Step 2: Set Build-Time Secrets
In order for your deployed site to reach your Supabase instance, you must configure secrets in your GitHub repository:
1. Go to **Settings** > **Secrets and variables** > **Actions**.
2. Click **New repository secret** and add:
   * `NEXT_PUBLIC_SUPABASE_URL` (Set to your Supabase project URL)
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Set to your Supabase public anon key)

The deployment workflow in [.github/workflows/deploy.yml](.github/workflows/deploy.yml) will bundle these variables into the static export upon every push!
