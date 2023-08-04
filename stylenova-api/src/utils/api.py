# notes
'''
This file is for creating a requests session so you can securely load in your api key.
We then create a session and add the api key to the header.
Depending on the API you are using, you might need to modify the value `x-api-key`.
'''

# package imports
import os
import requests
import openai
import json

# local imports
from .helpers import upload_dataset_image, get_file_extension, check_generation_status, extract_description, extract_keywords, STYLE_LOCATIONS
from .settings import OPENAI_API_KEY, LEONARDOAI_API_KEY, AMAZON_API_KEY


# openai key settings
openai.api_key = OPENAI_API_KEY


def get_chatgpt_response(gender, age, style, languge="English", height=None, weight=None, bodyType=None, season=None):
    height_str = f"The person's height is {height}." if height else ""
    weight_str = f"The person's weight is {weight}." if weight else ""
    bodyType_str = f"The person's Body Type is {bodyType}. The generated Keywords should reflect this feature of the person's body." if bodyType else ""
    season_str = f"The outfit season is {season}. The generated Keywords should be related to this season's outfits." if bodyType else ""
    german_keywords_prompt = f"Then the keywords should be in german language, beginning with 'Keywords2:'." if languge == 'German' else ""

    prompt = f'''Create an outfit recommendation for a {gender} person, aged {age}, with a preference for {style} style.
    {height_str} {weight_str}
    {bodyType_str} {season_str}
    The description should be appropriate, respectful, and avoid any sensitive or
    potentially offensive content. Please provide a description of the outfit for
    a full-body image generation through Leonardo.ai, the description must have
    information about the person from head to toe, but limit the description to
    a maximum of 500 characters. Start the description with 'Description:'.
    Following that, provide a comma-separated list of clothing items and accessories
    for searching on Amazon, the keywords must describe the items the person is
    wearing, the keywords should only be realted to a {gender} and limit the keywords to 7 only, 
    all the keywords should be in english, beginning with 'Keywords:'. {german_keywords_prompt}'''

    try:
        response = openai.Completion.create(
            engine='text-davinci-003',
            prompt=prompt,
            max_tokens=250,
        )
        if len(response.choices) > 0:
            response_text = response.choices[0].text.strip()
        else:
            response_text = ''

        try:
            description = extract_description(response_text)
        except Exception as e:
            # Handle exception from extract_description()
            print(f"Error in extracting description: {e}")
            description = ""

        try:
            keywords, german_keywords = extract_keywords(response_text)
        except Exception as e:
            # Handle exception from extract_keywords()
            print(f"Error in extracting keywords: {e}")
            keywords = []
            german_keywords = []

    except openai.OpenAIError as e:
        # Handle OpenAI API specific errors
        print(f"OpenAI API Error: {e}")
        description = ""
        keywords = []

    return description, keywords, german_keywords, prompt


def get_leonardo_response(image_url, description):
    try:
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": f"Bearer {LEONARDOAI_API_KEY}"
        }
        # Generate the response
        pre_generation_url = "https://cloud.leonardo.ai/api/rest/v1/generations"
        # negative_prompt = """close-up, two heads, two faces, plastic, deformed, blurry, bad anatomy,
        # bad eyes, crossed eyes, disfigured face, badly drawn, mutation, mutated, ((extra limb)),
        # ugly, badly drawn hands, missing limb, fuzzy, floating limbs, disconnected limbs,
        # malformed hands, fuzzy, fuzzy, long neck, long body, ((((hands and fingers mutated)))), (((out of frame))),
        # blender, doll, cropped, low resolution, close up, poorly drawn face, double voiceover, two heads,
        # blurry, ugly, disfigured, too many fingers, warped, repetitive, black and white, grainy,
        # extra limbs, bad anatomy, high pass filter, airbrush, portrait, zoom, soft light,
        # smooth skin, close up, deformed, extra limbs, extra fingers,
        # mutated hands, bad anatomy, bad proportions, blind, bad eyes, ugly eyes, dead eyes, blur, vignetting, out of shot,
        # out of focus, gaussian, close-up, monochrome, grainy,
        # loud, text, lettering, watermark, logo, oversaturation, oversaturation, over shadow, bra"""
        generation_payload = {
            "prompt": description,
            # "negative_prompt": negative_prompt,
            "modelId": "b820ea11-02bf-4652-97ae-9ac0cc00593d",
            "width": 1024,
            "height": 1024,
            "num_images": 1,
            "promptMagic": True
        }
        if image_url:
            file_extension = get_file_extension(image_url)

            # First, upload the init image
            url = "https://cloud.leonardo.ai/api/rest/v1/init-image"
            payload = {"extension": file_extension}

            response = requests.post(
                url, json=payload, headers=headers)
            response.raise_for_status()
            init_image_id = response.json()['uploadInitImage']['id']
            response = upload_dataset_image(image_url, response)
            # set additional parameters
            generation_payload['init_image_id'] = init_image_id
            generation_payload['init_strength'] = 0.55

        response = requests.post(
            pre_generation_url, json=generation_payload, headers=headers)
        response.raise_for_status()

        generation_id = response.json()['sdGenerationJob']['generationId']
        generation_url = f"https://cloud.leonardo.ai/api/rest/v1/generations/{generation_id}"

        generated_image_url = check_generation_status(generation_url, headers)
        generated_image_url = generated_image_url[0]['url']
        return generated_image_url

    except requests.exceptions.RequestException as e:
        print("RequestException:", str(e))
    except KeyError as e:
        print("KeyError:", str(e))
    except Exception as e:
        print("An error occurred:", str(e))

    return None


# set up the request parameters
def get_amazon_api_search_response(keyword, amazon_domain):
    params = {
        'api_key': AMAZON_API_KEY,
        'type': 'search',
        'search_term': keyword,
        'amazon_domain': f'amazon{amazon_domain}',
        'sort_by': 'featured',
        'page': 1,
        'exclude_sponsored': True
    }
    try:
        # Make the HTTP GET request to ASIN Data API
        api_result = requests.get(
            'https://api.asindataapi.com/request', params)
        # Save only the first three results
        search_results = api_result.json()['search_results'][:3]
    except (KeyError, IndexError):
        search_results = []
    return search_results
