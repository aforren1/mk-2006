Result hosted here: https://mk-2006.herokuapp.com/

Assumes some comfort with git/github, and that some recent version of Python 3 is installed.

Heroku for hosting, Mailgun for post-task email, and Google Drive for data upload.

## Heroku/repository setup

1. Make an account at heroku.com.
2. Install the Heroku CLI (https://devcenter.heroku.com/articles/heroku-cli)
3. After restarting terminal, `heroku login`
4. Change to this directory, and `git init` + `heroku create <name>`, where name is whatever you want to call it
    - Note the URL (e.g. 'https://mk-2006.herokuapp.com/')
    - `git init` allows adding heroku remote
5. Make github repository (public or private, shouldn't matter)
6. Add remote (e.g. `git remote add origin https://github.com/aforren1/mab-online.git`)

For intermediate things, just push to origin; for deploying, push to heroku (i.e. `git push heroku master`).
Once we get the website running, can open the right webpage with `heroku open`.

## Heroku Part 2: servers 'n' stuff
 - "requirements.txt" is useful for specifying Python server dependencies, and is automatically run when pushed to Heroku.
 - "runtime.txt" signals that we're using a Python server, and also the version of Python (3.8 in this case)
 - "Procfile" is the command run by Heroku to launch the server (`server:app` refers to "server.py" and "app" within that?)
 - To run the server locally, either run `heroku local` (if on Unix?) or `python server.py` (on Windows)
 - TODO: use `heroku config:set` to set secrets
 - `heroku logs --tail` to check logs


## Mailgun setup

1. Sign up at mailgun.com (free, and don't bother with card yet)
2. (TODO: recheck) On the dashboard, click on "sending->overview".
3. Add a few authorized recipients (whoever you want to get notifications) on the right-hand side. Make sure to check those emails for the "approve?" sanity check
4. Under the "How would you like to send your emails from sandbox...?", select API and any of the languages. Copy the API key and end of the URL (from "sandbox" on) to a file in the base called `.env`. **ADD THIS TO YOUR .gitignore**, as anyone with these keys would be able to send emails via your mailgun account!

The `.env` file would look something like:

```
MAILGUN_KEY=xxxxxxxxxx
MAILGUN_DOMAIN=sandboxxxxxxx.mailgun.org
```

If you do happen to commit these to a public repository, do make sure to regenerate the `MAILGUN_KEY` under the "API keys" menu.

5. Sanity check with `mailgun_test.py` (subbing out the right email recipients). Requires the `requests` and `python-dotenv` packages.

## Google Drive Setup

We'll also set up automatic uploads to a preordained Google Drive folder.

1. Go to console.cloud.google.com. Make sure you're under the right Google Account (e.g. for Yale, you can use your EliApps account)!
2. In left menu, APIs & Services -> Library
3. Search for "Google Drive API", select & enable
4. Under the Google Drive API section (should auto-forward?), select Credentials
5. At top, select "Create Credentials" -> Help Me Choose
6. Make sure "Which API..." is Google Drive API. Change "Where will you be calling the API from?" to "Web server", "What data..." to "Application Data", and "Are you planning to use..." to "No, I'm not using them". Click the "What credentials do I need?", which should give you a form for signing up a service account. 
7. Set name to whatever you want. Role should be Project -> Editor (as far as I can tell). Make sure "Key type" is JSON, and hit continue.
8. Save the file to your project directory (and rename? I call mine "google-credentials.json"), and **ADD TO YOUR .gitignore**.
9. Copy the "client email" from the credentials file, and make a new google drive folder (drive.google.com). Right-click the folder + share with that email. This will allow the service worker to write files.
10. Sanity check with the code in `google_test_read.py` and `google_test_write.py`. `pip install PyDrive2` first, then run "_read.py" first to get the shared folder ID (should see a listing like `title: mab-online, id: 1tl0X6_v51QK979hr7KFFdS94KkGNOxmD, mime: application/vnd.google-apps.folder`). Alternatively, get the folder ID by clicking on that folder in drive.google.com, and copying the end of the URL (e.g. whatever follows `https://drive.google.com/drive/u/x/folders/`).
11. Plug that ID into "_write.py", then run. The shared folder ID doesn't need to be secret, but you can copy it to .env or elsewhere, if you want to avoid hardcoding. In the server code, we'll use the `drive.file` scope (smallest necessary scope).
12. Verify manually by checking the folder at drive.google.com, and/or run `google_test_read.py` again.


