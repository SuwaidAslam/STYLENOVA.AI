# package imports
import os
from dotenv import load_dotenv

cwd = os.getcwd()
dotenv_path = os.path.join(cwd, 'src', os.getenv('ENVIRONMENT_FILE', '.env'))
load_dotenv(dotenv_path=dotenv_path, override=True)

APP_HOST = os.environ.get('HOST')
APP_PORT = int(os.environ.get('PORT', 5000))
DEV_TOOLS_PROPS_CHECK = bool(os.environ.get('DEV_TOOLS_PROPS_CHECK'))
API_KEY = os.environ.get('API_KEY', None)
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', None)
LEONARDOAI_API_KEY = os.environ.get('LEONARDOAI_API_KEY', None)
CLOUDINARY_CLOUD_NAME = os.environ.get('CLOUDINARY_CLOUD_NAME', None)
CLOUDINARY_API_KEY = os.environ.get('CLOUDINARY_API_KEY', None)
CLOUDINARY_API_SECRET = os.environ.get('CLOUDINARY_API_SECRET', None)
AMAZON_API_KEY = os.environ.get('AMAZON_API_KEY', None)
DATABASE_URI = os.environ.get('DATABASE_URI', None)

