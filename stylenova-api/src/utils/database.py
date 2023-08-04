from flask_sqlalchemy import SQLAlchemy
from datetime import datetime



# initialize the app with the extension
db = SQLAlchemy()

# outfits schema
class Records(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    input_style = db.Column(db.Text)
    input_gender = db.Column(db.Text)
    input_age = db.Column(db.Integer)
    input_image_url = db.Column(db.Text)
    description = db.Column(db.Text)
    keywords = db.Column(db.Text)
    generated_image_url = db.Column(db.Text)
    ip_address = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    country = db.Column(db.Text)
    prompt = db.Column(db.Text)
    
    def to_dict(self):
        return {
            'id': self.id,
            'input_style': self.input_style,
            'input_gender': self.input_gender,
            'input_age': self.input_age,
            'input_image_url': self.input_image_url,
            'description': self.description,
            'keywords': self.keywords,
            'generated_image_url': self.generated_image_url,
            'ip_address': self.ip_address,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'country': self.country,
            'prompt': self.prompt
        }

# products schema
class Products(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    record_id = db.Column(db.Integer, db.ForeignKey('records.id'))
    product_name = db.Column(db.Text)
    product_image_url = db.Column(db.Text)
    product_price = db.Column(db.Text)
    product_url = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id,
            'record_id': self.record_id,
            'product_name': self.product_name,
            'product_image_url': self.product_image_url,
            'product_price': self.product_price,
            'product_url': self.product_url
        }


class NewsletterSubscribers(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.Text)
    email = db.Column(db.Text)
    country = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    
def insert_data(data):
    # Create a new instance of the Record model with the data
    record = Records(
        input_style=data['input_style'],
        input_gender=data['input_gender'],
        input_age=data['input_age'],
        input_image_url=data['input_image_url'],
        description=data['description'],
        keywords=data['keywords'],
        generated_image_url=data['generated_image_url'],
        ip_address=data['ip_address'],
        country=data['country'],
        prompt=data['prompt']
    )
    # Add the record to the session
    db.session.add(record)

    # Commit the session to persist the changes to the database
    db.session.commit()
    print('Data inserted successfully.')
    return record.id

def insert_product(data):
    # Create a new instance of the Record model with the data
    product = Products(
        record_id=data['record_id'],
        product_name=data['product_name'],
        product_image_url=data['product_image_url'],
        product_price=data['product_price'],
        product_url=data['product_url']
    )
    # Add the record to the session
    db.session.add(product)

    # Commit the session to persist the changes to the database
    db.session.commit()
    print('Product inserted successfully.')

def get_latest_outfits(limit=3):
    # get only the latest three records
    records = Records.query.order_by(Records.created_at.desc()).limit(limit).all()
        # Iterate over the records and extract the necessary data for the outfits
    outfits = []
    for record in records:
        outfit = {
            'generated_image_url': record.generated_image_url,
        }
        outfits.append(outfit)
    return outfits

def insert_subscriber(name, email, country):
    # Create a new instance of the Record model with the data
    subscriber = NewsletterSubscribers(
        name=name,
        email=email,
        country=country
    )
    # Add the record to the session
    db.session.add(subscriber)

    # Commit the session to persist the changes to the database
    db.session.commit()
    print('Subscriber inserted successfully.')

# create a function to get all the products given the record id
def get_products(record_id):
    products = Products.query.filter_by(record_id=record_id).all()
    return products

# get a partucular record given the id
def get_record(record_id):
    record = Records.query.filter_by(id=record_id).first()
    return record

          
