KIMBERLY & WALTER — WEDDING WEBSITE
====================================

This folder is your whole website. There is nothing to install and no
technical setup — it is just a few plain files that any web browser can open.

  index.html     The main page (all the ENGLISH words for it live here)
  contact.html   The “Have a question?” page — emails you what guests write
  i18n.js        The Japanese, Traditional Chinese and Korean translations
  styles.css     Colours, fonts and layout
  script.js      Makes the RSVP and contact forms work
  gate.js        Invitation lock screen (change INVITE_CODE at the top)
  images/        Your photos
  README.txt     This file


1. HOW TO LOOK AT THE SITE
--------------------------
Double-click "index.html". It opens in your web browser (Safari, Chrome, …)
exactly as guests will see it. The first screen asks for the invitation
code (see section 5). The bottom of the page and the Questions link in
the menu open contact.html. Nothing is online yet — it is only on your Mac.


2. HOW TO CHANGE THE WORDS
--------------------------
Right-click "index.html" > Open With > TextEdit (or any text editor).
Find the text you want to change, change it, save, then reload the browser.

Tips:
 - Anything inside [square brackets] is a PLACEHOLDER we could not find on
   your Notion page. Search the file for "[" to find them all. Current ones:
     [Time and location to be announced]   (welcome dinner & brunch, x2)
     [Ceremony and reception times to be announced]
     [Dress code to be announced ...]
     [Hotel recommendations to be announced]
     [RSVP deadline to be announced]
     [Registry / gift information to be announced]
   When you replace a placeholder, also delete  class="placeholder"  from
   that line so it stops showing in italic with the green bar.
 - Only change text that sits BETWEEN > and <. Leave the angle-bracket
   tags (like <p> and </p>) alone.
 - To swap a photo, drop a new picture into the "images" folder and give it
   the same name as the one it replaces (hero.jpg, couple.jpg, venue.jpg,
   nagoya-castle.jpg, food-1.jpg, food-2.jpg).
 - To change the accent colour or fonts, open styles.css — everything is set
   at the very top under ":root".

LANGUAGES. The bar at the top lets guests view the whole site in English,
日本語, 繁體中文 or 한국어 (English is shown first; the browser remembers a
guest's choice). To edit a translation, open "i18n.js" in TextEdit. Each
language has its own block (ja = Japanese, zh = Traditional Chinese,
ko = Korean) with lines like:
     "faq.q1": "服装の指定はありますか？",
Change only the text after the colon, keep the quotes and the comma, save,
reload. To find the right line, look in index.html for the matching
data-i18n="faq.q1" on the English text you want to change. The [bracketed]
placeholders exist in every language too — search i18n.js for "[" when you
fill them in. The English text itself is edited in index.html as before.


3. HOW RSVPs AND QUESTIONS REACH YOU
--------------------------------------------------------------------
The site has no server of its own. When a guest submits the RSVP (or a
question), FormSubmit emails the details to kimkimchinv@gmail.com.
Subjects look like:

  Wedding RSVP: Jane Doe — Joyfully accepts
  Question about Kim & Walter's wedding — Jane Doe

ONE-TIME SETUP (first real test):
  a) Open the site, send yourself a test RSVP.
  b) Check kimkimchinv@gmail.com for an activation email from FormSubmit
     and click the confirmation link once.
  c) After that, every RSVP and question lands in that inbox as a table.

RECORDING RESPONSES (private RSVP repository):
  Folder:  Wedding Prep / Wedding RSVP
  Online:  https://github.com/walter-kim/wedding-rsvp
  Linked from the RSVP section (“RSVP response log”).

  When an RSVP email arrives:
  1. Open the Wedding RSVP folder (or the link above).
  2. In Terminal, run:  python3 add_response.py
  3. Answer the prompts — it updates responses.csv, writes a file under
     responses/, and refreshes SUMMARY.md (yes/no counts and headcount).

  You can also open responses.csv in Excel / Numbers / Google Sheets.

The guest “email us” fallback still works if the online form ever fails.


4. HOW TO PUT IT ONLINE
-----------------------
Pick ONE of these. Both are free.

OPTION A — Netlify Drop (easiest, ~1 minute)
  1. Go to https://app.netlify.com/drop
  2. Drag the entire "Wedding Website" folder onto the page.
  3. It gives you a live address like  https://sparkly-name-123.netlify.app
     Create a free account to keep the site up and to rename it (Site
     settings > Change site name), e.g.  kimandwalter.netlify.app
  4. To update the site later: edit your files, then drag the folder onto
     the "Deploys" page of your site again.

OPTION B — GitHub Pages
  1. Make a free account at https://github.com and create a new repository
     named, for example, "wedding".
  2. Click "uploading an existing file" and drag in everything inside the
     "Wedding Website" folder (index.html, styles.css, script.js, README.txt
     and the images folder). Commit.
  3. In the repository go to Settings > Pages, choose "Deploy from a branch",
     branch "main", folder "/ (root)", Save.
  4. After a minute the site is live at
        https://YOUR-USERNAME.github.io/wedding/

Using your own domain name (like kimandwalter.com)? Both services let you
connect one under their "Domain" settings; buy the name from any registrar.


5. INVITATION CODE  (do this before you share the link)
-------------------------------------------------------
The site opens with a lock screen. Guests type a short shared word to get in.

The invitation code is already set to:

        var INVITE_CODE = "goldengate";

Print that word on the invitations (one word, no space). Guests may type it
in any capitalisation — GoldenGate and GOLDENGATE both work.

To change it later, open "gate.js" and edit the word between the quotes, then
save.

This is NOT strong security. It is only enough to keep the site invitation-
only for ordinary guests. Anyone determined can still open gate.js and read
the code. That is expected.

After you publish on Netlify and want a real password in front of the whole
site, turn on Netlify Site Protection / password (a Pro feature) or Basic
Auth in the Netlify site settings. That sits on the server and is stronger
than this lock screen.


6. GUEST GUIDE LINK
-------------------
The "Guest Guide" section links out to your existing Notion guide
(the full version with Japanese, Chinese and Korean translations):
https://bramble-store-ddd.notion.site/Wedding-Guest-Guide-Nagoya-Japan-3895a707829c809189a5e019589a6e0e
If you move or rename that Notion page, update the link in index.html.


7. WHERE THE CONTENT CAME FROM
------------------------------
Everything that is not in [square brackets] was copied from your public
Notion "Save the Date" form and the linked Guest Guide on 4 October 2026:
names, date, city, the venue (Hyakkarou 百花籠) and its description, the
address and directions, the welcome-dinner / brunch dates, the Nagoya tips,
the food section, the RSVP questions and the photos.
