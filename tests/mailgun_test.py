# practice the python mailgun API, since it seems we'll be able to swing
# a python server via heroku
# pip install requests python-dotenv
import requests
import os
# in the "real" thing, these will already be available in the env (and 
# we won't have the .env file anyway)
from dotenv import load_dotenv

load_dotenv(verbose=True)
DOMAIN = os.getenv('MAILGUN_DOMAIN')
KEY = os.getenv('MAILGUN_KEY')
print(DOMAIN)
v = requests.post(f'https://api.mailgun.net/v3/{DOMAIN}/messages',
                  auth=('api', KEY),
                  data={'from': f"Alex 'Mailgun' Forrence <mailgun@{DOMAIN}>",
                        'to': ['aforrence@gmail.com'],
                        'subject': 'This is for [prolific]',
                        'text': 'not sure how to get proper tags, but this will allow sorting.',
                        'o:tag': ['mailgun', 'prolific']},
                  #files=[('attachment', ('test-data.zip', open('test-data.zip', 'rb').read()))],
                  )
print(v) # response 200 is successful
