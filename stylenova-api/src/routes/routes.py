# package imports
import datetime
from flask import jsonify, request, Blueprint
from flask_cors import cross_origin
from requests.exceptions import HTTPError
import json


# local imports
from ..utils.helpers import allowed_file, parse_image, get_country_from_ip, get_languages_dict, get_client_ip, STYLE_LOCATIONS
from ..utils.api import get_chatgpt_response, get_leonardo_response, get_amazon_api_search_response
from ..utils.database import insert_data, insert_product, get_latest_outfits, insert_subscriber, get_products, get_record


routes = Blueprint('routes', __name__, url_prefix='/api')


@routes.route('/', methods=['GET', 'POST'])
def home():
    if (request.method == 'GET'):
        data = "hello world"
        return jsonify({'data': data})


@routes.route('/get_chatgpt_response', methods=['POST'])
@cross_origin()
def get_gpt_response():
    ip_address = get_client_ip(request)
    country = get_country_from_ip(ip_address)
    if country == "Germany":
        language = "German"
    else:
        language = "English"

    gender = request.form['gender']
    age = request.form['age']
    style = request.form['style']
    height = request.form['height']
    weight = request.form['weight']
    bodyType = request.form['body_type']
    season = request.form['season']

    # Check if all required data is present
    if None in (gender, age, style):
        return jsonify({'error': 'Missing required data'}), 400

    # Get description and keywords using ChatGPT
    description, keywords, german_keywords, prompt = get_chatgpt_response(
        gender, age, style, language, height, weight, bodyType, season)
    
    location = STYLE_LOCATIONS.get(style, "cityscape")
    description = f"""full body portrait, head to toes standing of a short {age}-year-old {gender} stands in a {location}, fashion magazine photograph, {', '.join(keywords)}
    """
    # Prepare data dictionary
    data = {
        'description': description,
        'keywords': ', '.join(keywords),
        'german_keywords': '',
        'prompt': prompt,
    }
    if german_keywords is not None:
        data['german_keywords'] = ', '.join(german_keywords)
    # Return the ChatGPT response
    return jsonify(data)


@routes.route('/get_leonardo_response', methods=['POST'])
@cross_origin()
def get_leonardo_image():
    # check if they exist in the request
    image_file = None
    file_saved_url = None
    if 'image' in request.files:
        image_file = request.files['image']
        # Parse contents and save file URL
        file_saved_url = parse_image(image_file.read(), image_file.filename)

    description = request.form['description']

    # Check if all required data is present
    if not description:
        return jsonify({'error': 'Missing required data'}), 400
    try:
        # Get generated image URL using Leonardo
        generated_image_url = get_leonardo_response(
            file_saved_url, description)
    except HTTPError as e:
        print("HTTP error occurred:", str(e))
    except Exception as e:
        print("Error occurred during generation:", str(e))

    # Prepare data dictionary
    data = {
        'input_image_url': file_saved_url,
        'generated_image_url': generated_image_url,
    }
    # Return the Leonardo response
    return jsonify(data)


@routes.route('/submit_image_details', methods=['POST'])
@cross_origin()
def submit_details():
    input_image_url = request.form['input_image_url']
    height = request.form['height']
    weight = request.form['weight']
    style = request.form['style']
    gender = request.form['gender']
    age = request.form['age']
    description = request.form['description']
    keywords = request.form['keywords']
    generated_image_url = request.form['generated_image_url']
    prompt = request.form['prompt']

    # Check if all required data is present
    if None in (style, gender, age, description, keywords, generated_image_url):
        return jsonify({'error': 'Missing required data'}), 400

    ip_address = get_client_ip(request)
    country = get_country_from_ip(ip_address)
    # Prepare data dictionary
    data = {
        'input_style': style,
        'input_gender': gender,
        'input_age': age,
        'input_image_url': input_image_url,
        'description': description,
        'keywords': keywords,
        'generated_image_url': generated_image_url,
        'ip_address': ip_address,
        'country': country,
        'prompt': prompt
    }
    # Insert data into the database
    record_id = insert_data(data)
    data['id'] = record_id

    # Return the response
    return jsonify({
        "record_id": record_id,
    })


@routes.route('/get_products', methods=['POST'])
@cross_origin()
def get_api_products():
    ip_address = get_client_ip(request)
    country = get_country_from_ip(ip_address)
    if country == "Germany":
        amazon_domain = ".de"
    else:
        amazon_domain = ".com"
    # Get variables from frontend client
    data = request.get_json()
    keyword = data['keyword']

    # Get search results from Amazon API
    search_result = get_amazon_api_search_response(keyword, amazon_domain)
    products = []
    for product in search_result:
        product = {
            'product_name': product.get("title", ""),
            'product_image_url': product.get("image", ""),
            'product_price': product.get("price", {}).get(
                "raw", ""),
            'product_url': product.get("link", "") + "&tag=stylenova-21",
        }
        products.append(product)

    # Return the search results as JSON response
    return jsonify(products)


@routes.route('/save_products', methods=['POST'])
@cross_origin()
def save_products():
    # Get variables from frontend client
    data = request.get_json()
    products = data['products']
    record_id = data['id']

    # Insert products into the database
    for product in products:
        product['record_id'] = record_id
        insert_product(product)

    # Return success response
    return jsonify({'message': 'Products saved successfully'})


@routes.route('/get_outfits', methods=['GET'])
@cross_origin()
def get_outfits():
    # Get the latest 5 outfits from the database
    outfit_limit = 5
    outfits = get_latest_outfits(outfit_limit)
    # Return the outfits as JSON response
    return jsonify(outfits)

# create a route to insert newslatter email


@routes.route('/subscribe_newsletter', methods=['POST'])
@cross_origin()
def subscribe_newsletter():
    # Get variables from frontend client
    data = request.get_json()
    name = data['name']
    email = data['email']
    ip_address = get_client_ip(request)
    country = get_country_from_ip(ip_address)
    # Insert subscriber into the database
    insert_subscriber(name, email, country)
    # Return success response
    return jsonify({'message': 'Subscribed successfully'})


@routes.route('/language/<language>', methods=['GET'])
@cross_origin()
def translate_page(language):
    language_list = get_languages_dict()
    if (language not in language_list):
        language = "en_GB"
    return language_list[language]


@routes.route('/get_country', methods=['GET'])
@cross_origin()
def get_countryCode():
    ip_address = get_client_ip(request)
    country = get_country_from_ip(ip_address)
    # language_list = get_languages_code()
    if country == "Germany":
        countryCode = "de_DE"
    else:
        countryCode = "en_GB"
    return jsonify({'countryCode': countryCode})

# get products given outfit id from databse


@routes.route('/products/<int:outfit_id>', methods=['GET'])
@cross_origin()
def get_outfit_products(outfit_id):
    products = get_products(outfit_id)
    if products:
        product_list = [product.to_dict() for product in products]
        return jsonify({'products': product_list})
    else:
        return jsonify({'error': 'Outfit not found'}), 404


@routes.route('/outfit/<int:outfit_id>', methods=['GET'])
@cross_origin()
def get_outfit_by_Id(outfit_id):
    outfit = get_record(outfit_id)
    if outfit:
        return jsonify(outfit.to_dict())
    else:
        return jsonify({'error': 'Outfit not found'}), 404
