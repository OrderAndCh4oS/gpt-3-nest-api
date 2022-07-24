import os
from flask import Flask, jsonify, request, _app_ctx_stack

import numpy as np
import openai
import pandas as pd
from dotenv import load_dotenv
from openai.embeddings_utils import (
    get_embedding,
    distances_from_embeddings,
    indices_of_nearest_neighbors_from_distances,
    cosine_similarity
)
from functools import wraps
import requests
from jose import jwt

app = Flask(__name__)

load_dotenv()

openai.api_key = os.getenv('OPEN_AI_API_KEY')
auth0_issuer_url = os.getenv('AUTH0_ISSUER_URL')
auth0_audience = os.getenv('AUTH0_AUDIENCE')

df = pd.read_csv('wine_tasting_notes_embeddings__curie_combined.csv')
df['curie_similarity'] = df.curie_similarity.apply(eval).apply(np.array)
df['curie_search'] = df.curie_search.apply(eval).apply(np.array)

def search_reviews(df, query, n=3):
    embedding = get_embedding(query, engine='text-search-curie-query-001')
    df['similarities'] = df.curie_search.apply(lambda x: cosine_similarity(x, embedding))
    res = df.sort_values('similarities', ascending=False).head(n)
    return res['0'].to_list()


def recommendations_from_strings(df, query, n=3):
    embedding = get_embedding(query, engine='text-similarity-curie-001')
    distances = distances_from_embeddings(embedding, df.curie_similarity, distance_metric="cosine")
    indices_of_nearest_neighbors = indices_of_nearest_neighbors_from_distances(distances)
    result = []
    for i in indices_of_nearest_neighbors[:n]:
        result.append(df['0'][i])

    return result

def get_recommendations(query):
    search = search_reviews(df, query, n=3)
    recommend = recommendations_from_strings(df, query, n=3)

    return {"search": search, "recommend": recommend}

class AuthError(Exception):
    def __init__(self, error, code):
        self.error = error
        self.code = code
        super().__init__('Authorization Error')

@app.errorhandler(AuthError)
def handle_auth_error(e):
    return jsonify(e.error), e.code

# More info at Auth0 guide: https://auth0.com/blog/developing-restful-apis-with-python-and-flask/
def get_token_auth_header():
    """Obtains the access token from the Authorization Header
    """
    auth = request.headers.get("Authorization", None)

    if not auth:
        raise AuthError({
            "code": "authorization_header_missing",
            "description": "Authorization header is expected"
        }, 401)

    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise AuthError({
            "code": "invalid_header",
            "description": "Authorization header must start with Bearer"
        }, 401)
    elif len(parts) == 1:
        raise AuthError({
            "code": "invalid_header",
            "description": "Token not found"
        }, 401)
    elif len(parts) > 2:
        raise AuthError({
            "code": "invalid_header",
            "description": "Authorization header must be Bearer token"
        }, 401)

    token = parts[1]

    return token

def requires_auth(f):
    """Determines if the access token is valid
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_auth_header()
        jwks_response = requests.get(auth0_issuer_url+".well-known/jwks.json")
        jwks = jwks_response.json()
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
        if rsa_key:
            try:
                payload = jwt.decode(
                    token,
                    rsa_key,
                    algorithms=['RS256'],
                    audience=auth0_audience,
                    issuer=auth0_issuer_url
                )
            except jwt.ExpiredSignatureError:
                raise AuthError({
                    "code": "token_expired",
                    "description": "token is expired"
                }, 401)
            except jwt.JWTClaimsError:
                raise AuthError({
                    "code": "invalid_claims",
                    "description": "incorrect claims, please check the audience and issuer"
                }, 401)
            except Exception:
                raise AuthError({
                    "code": "invalid_header",
                    "description": "Unable to parse authentication token."
                }, 400)

            _app_ctx_stack.top.current_user = payload

            return f(*args, **kwargs)

        raise AuthError({
            "code": "invalid_header",
            "description": "Unable to find appropriate key"
        }, 400)

    return decorated

@app.route('/')
def home():
    return jsonify({'status': 'api working'}), 200

# Todo: set up cors
@app.route('/recommend-wines', methods=['POST'])
# @cross_origin(headers=['Content-Type', 'Authorization'])
@requires_auth
def recommend_wines():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        json = request.json
        if('query' not in json):
            return jsonify({'error': 'Missing query parameter'}), 400
        recommendations = get_recommendations(json['query'])
        return jsonify(recommendations), 200
    else:
        return jsonify({'error': '415 Unsupported Media Type'}), 415

if __name__ == '__main__':
    #define the localhost ip and the port that is going to be used
    # in some future article, we are going to use an env variable instead a hardcoded port 
    app.run(host='0.0.0.0', port=os.getenv('PORT'))
