#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import os
import numpy as np
import json

from google.appengine.ext import blobstore
from google.appengine.ext import ndb
from google.appengine.ext.webapp import blobstore_handlers

import webapp2
import jinja2
import string
import urllib2

from collections import Counter
exclude = set(string.punctuation)

import wave
import contextlib
# from hodclient import *

# from google.appengine.ext import db

params = {}

def getParams(transcribed, d):
    s = ''.join(ch for ch in transcribed if ch not in exclude)
    parts = s.split()

    fld = []
    val = []

    for word in parts:
        if len(word) < 15:
            val.append(len(word))

    c = Counter(parts)
    for k, v in c.iteritems():
        fld.append( {"text":k, "size":(v*20)} )

    res = {
        'WC':len(parts),
        'WPM':(len(parts)*60) / d,
        'Vocab':len(set(parts)),
        'values':val,
        'fl': fld,
        'text': transcribed
    }
    return res

def getDuration(f):
    frames = f.getnframes()
    rate = f.getframerate()
    duration = frames / float(rate)
    return(duration)

template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(loader=jinja2.FileSystemLoader(template_dir),
                               extensions=['jinja2.ext.autoescape'],
                               autoescape=True)

class BaseHandler(webapp2.RequestHandler):
    def render(self, template_page, **template_values):
        template = jinja_env.get_template(template_page)
        self.response.write(template.render(template_values))


class MainHandler(BaseHandler):
    """
    Primary page = loads with default no information
    """
    def get(self):
        upload_url = blobstore.create_upload_url('/audio')
        tv = {
            'upload_url': upload_url
        }
        self.render('index.html', **tv)

class PHandler(BaseHandler):
    """
    Primary page = loads with default no information
    """
    def get(self):
        upload_url = blobstore.create_upload_url('/audio')
        tv = {
            'params': json.dumps(params),
            'upload_url': upload_url
        }
        print 'AAA'
        print tv
        print 'BBB'
        global params
        params = {}
        self.render('index.html', **tv)

class AudioHandler(BaseHandler,blobstore_handlers.BlobstoreUploadHandler):
    """
    Ajax handler to convert audio and get wordcloud
    """
    def post(self):
        # upload_files = self.get_uploads('audio_file')
        # upload_files = self.get_uploads('audio_file')
        # transcribed = jennyCode(upload_files)
        # d = getDuration(upload_files)

        transcribed = self.request.get('typed')
        d=5
        
        global params
        params = getParams(transcribed, d)

        self.redirect('/ph') 
        # self.response.out.write(json.dumps(params))

app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/audio', AudioHandler),
    ('/.*', PHandler)
], debug=True)
