---
name: design-email
description: >-
  Design and implement transactional and marketing email templates. Detects
  email framework (React Email, MJML, or plain HTML), mail provider (Resend,
  SendGrid, Postmark, AWS SES, Nodemailer), and delivery setup (SPF/DKIM/DMARC).
  Builds mobile-first templates with dark mode support, 600px max-width, inline
  styles for client compatibility, and accessible alt text. Reviews copy for
  natural, conversational tone — no jargon, no passive voice, no corporate
  formality. Checks deliverability config. Tests rendering across major email
  clients. Generic across any stack. Use when asked to "build an email
  template", "transactional email", "welcome email", "password reset email",
  "email design", "React Email", "MJML", "dark mode email", "deliverability",
  "SPF DKIM", "email copy review", or "why is my email in spam".
license: MIT
---

# design-email — Email Templates That Actually Get Read

**Email is the one channel users check before they check your app.** A
well-crafted transactional email — clear, warm, fast-loading, and readable on
any device — builds trust. A corporate, jargon-heavy, broken email erodes it.
This skill handles the full stack: design, copy, deliverability.

---

## Phase 0: Detect the stack

```
package.json        → @react-email/*, mjml, nodemailer, @sendgrid/mail,
                      resend, @aws-sdk/client-ses, postmark
emails/             → existing React Email templates
src/emails/         → email template directory
.env.*              → RESEND_API_KEY, SENDGRID_API_KEY, etc. (reference by name only)
```

| Detected framework | Approach |
|--------------------|----------|
| React Email (`@react-email/components`) | JSX components, preview server, multi-client export |
| MJML | XML-like syntax, battle-tested cross-client output |
| None | Implement React Email (current best practice) |

---

## Phase 1: Audit existing templates

If templates already exist, walk through each one and check:

**Copy quality**:
- Does it sound like a person sent it, or a system?
- Is the subject line specific? ("Your order is on its way" not "Order notification")
- Is the first sentence the most important one (preview text matters)?
- Does it tell the reader exactly what to do and what happens next?
- Is it free of business jargon, technical terms, and passive voice?

**Design**:
- Single-column layout? (Most reliable across clients)
- Max-width 600px? (Standard email width)
- All styles inline? (Gmail strips `<style>` tags)
- Images have `alt` text? (Many clients block images by default)
- Dark mode support? (`@media (prefers-color-scheme: dark)` + inline fallbacks)
- Mobile: tap targets ≥ 44px, font size ≥ 14px

**Deliverability**:
- SPF record configured for the sending domain?
- DKIM signing enabled at the provider?
- DMARC policy set?
- "From" address uses the app domain, not a personal Gmail?

---

## Phase 2: Research best practices

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "transactional email design best practices 2026 React Email",
  "limit": 3,
  "sources": [{ "type": "web" }]
})
```

Fetch React Email docs if using it:
```json
CallMcpTool(server: "plugin-context7-plugin-context7", toolName: "resolve-library-id", arguments: {
  "libraryName": "react-email"
})
```

---

## Phase 3: Copy principles

Apply these to every email before looking at design:

| Principle | How |
|-----------|-----|
| Lead with the most important thing | First line = the key action or news. Not "Hi, we wanted to let you know that…" |
| Subject line = specific, honest | "Your password reset link" not "Important account information" |
| One email, one action | Every email should have exactly one thing it wants the reader to do |
| Write to a person, not an account | "You" not "the user". "We" not "the system". |
| Tell them what happens next | "Click the button below to confirm. The link expires in 24 hours." |
| No jargon | "Your account" not "your profile entity". "Sign in" not "authenticate". |
| Active voice | "We've sent you a link" not "A link has been sent to you" |
| Short paragraphs | 1–2 sentences max. White space is your friend in email. |
| Plain text fallback | Every HTML email should have a plain text version |

### Common email types — copy templates

**Welcome email:**
```
Subject: Welcome to [App Name], [First Name] 👋
Preview: Here's how to get started in 2 minutes.

Hi [First Name],

You're in. [App Name] helps you [core value in 1 sentence].

Here's the first thing to do: [single CTA — most valuable first action].

[Primary Button: Get started]

If you have any questions, just reply to this email.

— [Name], [App Name]
```

**Password reset:**
```
Subject: Reset your [App Name] password
Preview: Your link expires in 1 hour.

Hi [First Name],

Someone requested a password reset for your [App Name] account.
If that was you, click the button below. If not, you can ignore this email.

[Primary Button: Reset my password]

This link expires in 1 hour. After that, you'll need to request a new one.
```

**Billing confirmation:**
```
Subject: Your payment of [amount] was successful
Preview: Next billing date: [date].

Hi [First Name],

Your payment of [amount] for [Plan Name] went through.

Amount: [amount]
Date: [date]
Next billing date: [date]

[Button: View your invoice]

Questions about your bill? Reply here and we'll sort it out.
```

---

## Phase 4: Build the template (React Email)

Install if not present:
```bash
npm install react-email @react-email/components
```

Base template structure:
```tsx
// emails/welcome.tsx
import {
  Body, Button, Container, Head, Heading, Hr, Html,
  Link, Preview, Section, Text, Img,
} from '@react-email/components';

interface WelcomeEmailProps {
  firstName: string;
  ctaUrl: string;
}

export function WelcomeEmail({ firstName, ctaUrl }: WelcomeEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Welcome to AppName — here's how to get started.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Img src="https://yourdomain.com/logo.png" width="48" height="48" alt="AppName" />
          <Heading style={h1}>Welcome, {firstName}</Heading>
          <Text style={text}>
            You're in. AppName helps you [core value in one sentence].
          </Text>
          <Text style={text}>
            Here's the first thing to do:
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href={ctaUrl}>
              Get started
            </Button>
          </Section>
          <Text style={text}>
            If you have any questions, just reply to this email.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            AppName · 123 Street · City · {' '}
            <Link href="{{{UNSUBSCRIBE_URL}}}">Unsubscribe</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = { backgroundColor: '#f6f9fc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' };
const container = { backgroundColor: '#ffffff', margin: '40px auto', padding: '40px', maxWidth: '600px', borderRadius: '8px' };
const h1 = { fontSize: '24px', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px' };
const text = { fontSize: '16px', lineHeight: '1.6', color: '#444', marginBottom: '16px' };
const btnContainer = { textAlign: 'center' as const, marginBottom: '24px' };
const button = { backgroundColor: '#6366f1', borderRadius: '6px', color: '#fff', fontSize: '16px', fontWeight: '600', padding: '12px 28px', textDecoration: 'none', display: 'inline-block' };
const hr = { borderColor: '#e5e7eb', marginTop: '32px', marginBottom: '32px' };
const footer = { fontSize: '12px', color: '#9ca3af', textAlign: 'center' as const };
```

### Dark mode support

```tsx
// In <Head>:
<style>{`
  @media (prefers-color-scheme: dark) {
    .email-body { background-color: #1a1a1a !important; }
    .email-container { background-color: #2d2d2d !important; }
    .email-text { color: #e5e7eb !important; }
    .email-heading { color: #f9fafb !important; }
  }
`}</style>
// Add className to Body, Container, Text, Heading components to match
```

---

## Phase 5: Send via provider

### Resend (recommended for new projects)

```typescript
import { Resend } from 'resend';
import { WelcomeEmail } from '../emails/welcome';
import { render } from '@react-email/render';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'AppName <hello@yourdomain.com>',
  to: user.email,
  subject: `Welcome to AppName, ${user.firstName}`,
  react: <WelcomeEmail firstName={user.firstName} ctaUrl={ctaUrl} />,
});
```

### Add a Supabase Edge Function trigger (if using Supabase)

```typescript
// supabase/functions/send-welcome-email/index.ts
import { serve } from 'https://deno.land/std/http/server.ts';
import { Resend } from 'npm:resend';

serve(async (req) => {
  const { record } = await req.json(); // from a database webhook
  const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
  await resend.emails.send({
    from: 'AppName <hello@yourdomain.com>',
    to: record.email,
    subject: `Welcome to AppName!`,
    html: '...', // rendered HTML
  });
  return new Response('OK');
});
```

Deploy:
```bash
supabase functions deploy send-welcome-email --no-verify-jwt
```

---

## Phase 6: Deliverability checks

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "email deliverability SPF DKIM DMARC setup 2026",
  "limit": 3,
  "sources": [{ "type": "web" }]
})
```

Checklist:
- [ ] SPF record: `TXT @ "v=spf1 include:_spf.resend.com ~all"` (adjust for your provider)
- [ ] DKIM: enabled in the email provider dashboard, DNS record added
- [ ] DMARC: `TXT _dmarc "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"`
- [ ] From address uses your domain (not `noreply@gmail.com`)
- [ ] Reply-To set if replies should go somewhere useful
- [ ] List-Unsubscribe header included for bulk/marketing emails
- [ ] No ALL-CAPS words in subject line
- [ ] No spam trigger words: "FREE", "URGENT", "ACT NOW", "GUARANTEED"
- [ ] Plain text version matches the HTML version

---

## Phase 7: Preview and test

Start the React Email preview server:
```bash
npx email dev --dir emails --port 3001
```

Then check with Playwright:
```
browser_navigate → http://localhost:3001
browser_snapshot → verify each template renders
browser_resize → 375×812 (mobile) — check font size, tap targets
browser_take_screenshot → capture for review
```

For cross-client testing, use Litmus or Email on Acid. Key clients to test:
- Gmail (web + Android + iOS)
- Apple Mail (macOS + iOS)
- Outlook (Windows — most restrictive CSS support)
- Samsung Mail

---

## Email templates checklist

```
Design:
- [ ] Max-width 600px
- [ ] Single column
- [ ] All styles inline (no <style> blocks except dark mode)
- [ ] Images have alt text
- [ ] Buttons ≥ 44px tall, large enough to tap
- [ ] Font size ≥ 14px on body text
- [ ] Dark mode tested

Copy:
- [ ] Subject line is specific and honest
- [ ] Preview text set and meaningful
- [ ] First sentence is the most important thing
- [ ] Exactly one primary action
- [ ] Copy sounds like a person wrote it
- [ ] No jargon or passive voice
- [ ] Plain text version exists

Deliverability:
- [ ] SPF configured
- [ ] DKIM configured
- [ ] DMARC configured
- [ ] From address on app domain
- [ ] Unsubscribe link in bulk/marketing emails
```
