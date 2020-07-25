# pydrive2 is an actively maintained fork
from pydrive2.drive import GoogleDrive
from pydrive2.auth import GoogleAuth, ServiceAccountCredentials

gauth = GoogleAuth()
# drive is nice for sanity checking, but should use drive.file for the Real Thing
# https://developers.google.com/drive/api/v3/about-auth
scope = ['https://www.googleapis.com/auth/drive']
gauth.credentials = ServiceAccountCredentials.from_json_keyfile_name('google-credentials.json', scope)
drive = GoogleDrive(gauth)

for file_list in drive.ListFile({'maxResults': 10}):
    print('Received {} files from Files.list()'.format(len(file_list))) # <= 10
    for file1 in file_list:
        print('title: {}, id: {}, mime: {}'.format(file1['title'], file1['id'], file1['mimeType']))
