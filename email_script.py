import os
from datetime import datetime

import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors
import smtplib, ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from pymongo import MongoClient
import pandas as pd

from content import *

id2category = {
    '1': '&nbsp;Film &amp; &nbsp;Animation',
    '2': '&nbsp;Cars &amp; &nbsp;Vehicles',
    '10': '&nbsp;Music',
    '15': '&nbsp;Pets &amp; &nbsp;Animals',
    '17': '&nbsp;Sport',
    '19': '&nbsp;Travel &amp; &nbsp;Events', # no
    '20': '&nbsp;Gaming',
    '22': '&nbsp;People &amp; &nbsp;Blogs', # no
    '23': '&nbsp;Comedy',
    '24': '&nbsp;Entertainment',
    '25': '&nbsp;News &amp; &nbsp;Politics', # no
    '26': '&nbsp;How-to &amp; &nbsp;Style',
    '27': '&nbsp;Education', # no
    '28': '&nbsp;Science &amp; &nbsp;Technology',
    '29': '&nbsp;Non-profits &amp; &nbsp;Activism' # no
}
category2id = {
    "Education": 27,
    "Film & animation": 1,
    "Gaming": 20,
    "News & Politics": 25,
    "People & Blogs": 22,
    "Entertainment": 24,
    "Animals": 15,
    "How-to & Style": 26,
    "Nonprofits & Activism": 29,
    "Sports": 17,
    "Family": 37,
    "Comedy": 23,
    "Music": 10,
    "Science & Technology": 28,
    "Travel & Events": 19,
}
record_flie = "record.txt"
status_file = "status_tracking.csv"
developer_key = "AIzaSyCN1EJLDPW5EnkJCWgLN1AYN5MxK7IPedc"
sender_email = "ycelia29@outlook.com"
password = "celia0329"
sender_server_host = 'smtp-mail.outlook.com'
sender_server_port = 587
maximum_description = 250



def read_participant_info():
    client = MongoClient("mongodb://localhost/recommodation")
    db = client.recommodation
    users = db.users

    dirname = os.getcwd() + "/DATA"
    if not os.path.exists(dirname):
        os.makedirs(dirname)
    participant_list = []
    with open(dirname + "/user.info", "w+") as f:
        for i, user in enumerate(users.find()):
            participant = dict()
            participant['id'] = i
            participant['group'] = i % 2
            participant['email'] = user["email"]
            participant['name'] = user["preferredName"]
            participant['history'] = [str(category2id[mem]) for mem in user['memories']]
            participant['intent'] = [str(category2id[intent]) for intent in user['intentions']]
            participant['recommended'] = []
            participant_list.append(participant)
    print(participant_list)
    return participant_list


def get_popular_videos(category_id):
    print(id2category.get(category_id))
    api_service_name = "youtube"
    api_version = "v3"
    youtube = googleapiclient.discovery.build(api_service_name, api_version, developerKey=developer_key)
    request = youtube.videos().list(
        part="snippet",
        chart="mostPopular",
        regionCode="US",
        videoCategoryId=category_id,
        maxResults="5"  # changed later
    )
    response = request.execute()
    videos = response['items']
    video_info_list = []
    for video in videos:
        snippet = video['snippet']
        info = dict()

        info['title'] = snippet['title']
        info['description'] = snippet['description'].replace('\n', ' ')[:maximum_description]
        info['thumbnails_url'] = snippet['thumbnails']['standard']['url']
        info['id'] = video['id']
        print(info['id'])
        info['video_url'] = 'https://www.youtube.com/watch?v={}'.format(video['id'])

        def date_format(raw):
            tz = datetime.strptime(raw, "%Y-%m-%dT%H:%M:%S.%fZ")
            return tz.strftime("%b %d, %Y")

        info['pub_time'] = date_format(snippet['publishedAt'])
        info['channel_name'] = snippet['channelTitle']
        info['channel_url'] = 'https://www.youtube.com/channel/{}'.format(snippet['channelId'])
        info['category'] = id2category.get(category_id)
        video_info_list.append(info)
    return video_info_list, bool(video_info_list)


def get_html(video_info_list):
    # TODO: template, item with video_info_list
    header_str = header_html.format(participant_name='Celia')
    item_strs = []
    for v in video_info_list:
        item_str = item_html.format(category=v['category'], title=v['title'], video_url=v['video_url'],
                                    thumbnails_url=v['thumbnails_url'], description=v['description'],
                                    channel_name=v['channel_name'], channel_url=v['channel_url'],
                                    pub_time=v['pub_time'])
        item_strs.append(item_str)
    html = header_str + "".join(item_strs) + footer_html
    return html


def send_email(participant, html):
    message = MIMEMultipart()
    message['From'] = sender_email
    message['To'] = participant['email']
    message['Subject'] = "REC Study: video recommendations for {}".format(participant['name'])
    message.attach(MIMEText(html, "html"))

    with smtplib.SMTP(host=sender_server_host, port=sender_server_port) as server:
        server.starttls()
        server.login(sender_email, password)
        server.send_message(message)


def read_records(participant_list):
    try:
        with open(record_flie, 'r') as f:
            lines = [line.strip() for line in f]
    except FileNotFoundError:
        return participant_list

    records=dict()
    for line in lines:
        id, record = line.split(',')
        record = record.slipt(':')
        records[id] = record
    for p in participant_list:
        p['recommended'] = records.get(p['id'], [])
    return participant_list


def add_records(participant_list, sending_status):
    # update list of recommended videos
    with open(record_flie, 'w+') as f:
        for p in participant_list:
            f.write("{},{}\n".format(['id'], ":".join(p['recommended'])))

    # update sending status



def main():
    participant_list = read_participant_info()
    participant_list = read_records(participant_list)
    for p in participant_list:
        rec_video_list = []
        if p['group'] == 0:
            categories = p['history']
        else:
            categories = p['intent']

        for category_id in categories:
            category_video_list, get_success = get_popular_videos(category_id)
            for v in category_video_list:
                print(v['id'])
                print(p['recommended'])
                if v['id'] not in p['recommended']:
                    rec_video_list.append(v)
                    p['recommended'].append(v['id'])
                    break
        html = get_html(rec_video_list)
        send_email(participant=p, html=html)
    add_records(participant_list, {})


if __name__ == "__main__":
    main()
