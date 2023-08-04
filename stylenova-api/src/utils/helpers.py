import base64
import json
import requests
import os
import time
import cloudinary
import cloudinary.uploader
import cloudinary.api
from flask import request
from retrying import retry
import glob

# local imports
from .settings import CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET


# cloudinary key settings
cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET,
)
# Define allowed file extensions for images
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# style locations
STYLE_LOCATIONS = {
    'Casual': 'Cozy city café',
    'Business Casual': 'Modern office building',
    'Formal': 'Elegant banquet hall',
    'Athleisure': 'Vibrant local gym',
    'Streetwear': 'Urban graffiti wall',
    'Bohemian': 'Sunny music festival',
    'Vintage': 'Retro café',
    'Preppy': 'University campus',
    'Punk': 'Rock concert',
    'Minimalist': 'Clean, white gallery space',
    'Hipster': 'Trendy, indie bookstore',
    'Festival': 'Colorful, music festival'
}


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def upload_image_to_cloudinary(base64_decoded_image):
    # Convert the decoded image to base64 again
    base64_string = base64.b64encode(base64_decoded_image).decode('utf-8')
    upload_result = cloudinary.uploader.upload(
        "data:image/png;base64," + base64_string, unique_filename=True, overwrite=False)
    return upload_result['secure_url']


def parse_image(image, filename):

    # Upload the image to Cloudinary
    uploaded_url = upload_image_to_cloudinary(image)

    return uploaded_url


def upload_dataset_image(image_url: str, response: requests.models.Response) -> requests.models.Response:
    """ 
    Upload an image file to a Leonardo.ai dataset via a presigned URL.

    :image_file_path: Path to an image file to upload
    :response: Response to a request to the datasets/{datasetId}/upload endpoint
    """

    fields = json.loads(response.json()['uploadInitImage']['fields'])
    url = response.json()['uploadInitImage']['url']

    files = {'file': requests.get(image_url).content}

    return requests.post(url, data=fields, files=files)


def get_file_extension(file_path):
    _, file_extension = os.path.splitext(file_path)
    return file_extension[1:]


@retry(stop_max_attempt_number=8, wait_exponential_multiplier=500)
def check_generation_status(url, headers):
    response = requests.get(url, headers=headers)
    response.raise_for_status()

    response_data = response.json()
    status = response_data.get("generations_by_pk", {}).get("status")

    if status == "COMPLETE":
        print("Generation completed successfully")
        generated_images = response_data.get(
            "generations_by_pk", {}).get("generated_images", [])
        return generated_images
    elif status == "PENDING":
        print("Generation in progress. Waiting...")
        raise Exception("Generation still in progress.")
    else:
        raise Exception("Generation failed with status:", status)


# These methods extracts the description and keywords from the response text
# returned by the server. It is used by the process_response function to
# extract the description and keywords from the response text.

def extract_description(response_text):
    description_start_index = response_text.find(
        "Description:") + len("Description:")
    description_end_index = response_text.find("Keywords:")
    description = response_text[description_start_index:description_end_index].strip(
    )
    return description


def extract_keywords(response_text):
    keywords_start_index = response_text.find("Keywords:") + len("Keywords:")
    germen_keywords_start_index = response_text.find("Keywords2:")
    
    keywords = response_text[keywords_start_index:].strip()
    keywords_list = [keyword.strip() for keyword in keywords.split(",")]

    if germen_keywords_start_index != -1:
        keywords = response_text[keywords_start_index:germen_keywords_start_index].strip()
        keywords_list = [keyword.strip() for keyword in keywords.split(",")]

        germen_keywords_start_index += len("Keywords2:")
        keywords2 = response_text[germen_keywords_start_index:].strip()
        keywords_list2 = [keyword.strip() for keyword in keywords2.split(",")]
        return keywords_list, keywords_list2
    else:
        return keywords_list, None


def get_client_ip(request) -> str:
    ip_address = request.headers.get('X-Forwarded-For')
    if ip_address is None:
        ip_address = request.remote_addr
    return ip_address


def get_country_from_ip(ip_address):
    response = requests.get(f'https://ipapi.co/{ip_address}/json/').json()
    # location_data = {
    #     "ip": ip_address,
    #     "city": response.get("city"),
    #     "region": response.get("region"),
    #     "country":
    # }
    return response.get("country_name")


# def get_language_from_ip(ip_address):
#     response = requests.get(f'https://ipapi.co/{ip_address}/json/').json()
#     return response.get("languages")


def get_languages_dict():
    cwd = os.getcwd()
    language_folder_path = os.path.join(cwd, 'src', 'language')
    language_list = glob.glob(f"{language_folder_path}/*.json")
    languages = {}
    for file_path in language_list:
        with open(file_path, 'r', encoding='utf8') as file:
            lang_code = os.path.splitext(os.path.basename(file_path))[0]
            languages[lang_code] = json.loads(file.read())
    return languages

# def get_languages_code():
#     language_list = get_languages_dict()
#     separated_keys = [key.split('_')[0] for key in language_list.keys()]
#     return separated_keys
