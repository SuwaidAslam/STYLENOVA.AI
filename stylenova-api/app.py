# notes
'''
This file is for housing the main dash application.
This is where we define the various css items to fetch as well as the layout of our application.
'''

# package imports
from flask import Flask
import os
from flask import Flask, request, redirect
from flask_cors import CORS

# local imports
from src.utils.settings import APP_HOST, APP_PORT, DATABASE_URI
from src.utils.database import db
from src.routes.routes import routes
import threading


# create the extension
app = Flask(__name__)
app.register_blueprint(routes)
cors = CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "https://stylenova-ai.herokuapp.com"]}})
app.config['CORS_HEADERS'] = 'Content-Type'


# configure the SQLite database, relative to the app instance folder
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['TIMEOUT'] = 120


@app.before_request
def before_request():
    if not request.is_secure:
        url = request.url
        if url.startswith('http://'):
            url = url.replace('http://', 'https://', 1)
        elif not url.startswith('https://'):
            url = f"https://{url}"
        code = 301
        return redirect(url, code=code)

with app.app_context():
    db.init_app(app)
    db.create_all()


if __name__ == "__main__":
    app.run(
        host=APP_HOST,
        port=APP_PORT,
        debug=False,
        threaded=True,
    )
