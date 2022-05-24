from dotenv import load_dotenv
from kafka import KafkaConsumer, KafkaProducer
from json import loads, dumps
import threading
import os
from flask import Flask, jsonify
from dotenv import load_dotenv
from werkzeug.exceptions import HTTPException
from werkzeug.exceptions import default_exceptions
import redis

load_dotenv()

KAFKA_LIKE_CONSUMER = os.environ.get("KAFKA_LIKE_CONSUMER")
KAFKA_GROUP = os.environ.get("KAFKA_GROUP")
KAFKA_BOOTSTRAP_SERVERS = os.environ.get("KAFKA_BOOTSTRAP_SERVERS").split(',')

REDIS_HOST = os.environ.get("REDIS_HOST")
REDIS_PORT = os.environ.get("REDIS_PORT")

app = Flask(__name__)

like_consumer = KafkaConsumer(
    KAFKA_LIKE_CONSUMER,
    bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
    group_id=KAFKA_GROUP,
    enable_auto_commit=False,
    value_deserializer=lambda m: loads(m.decode('utf-8'))
)

match_producer = KafkaProducer(
    bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
    value_serializer=lambda x: dumps(x).encode('utf-8')
)

redis_store = redis.StrictRedis(
    host=REDIS_HOST,
    port=REDIS_PORT,
)

def register_kafka_listener(consumer, listener):
    def poll():
        consumer.poll(timeout_ms=6000)
        for msg in consumer:
            listener(msg)
    t = threading.Thread(target=poll)
    t.start()

def kafka_like_listener(data):
    liker = str(data.value['liker'])
    likee = str(data.value['likee'])
    add_to_checked_user_store(liker, likee)
    if 'isDislike' in data.value and str(data.value['isDislike']) == '1':
        print('no likey')
    else: 
        other_like_key = likee + '+' + liker
        other_like = redis_store.get(other_like_key)
        if other_like:
            print('match')
            match_event = {
                'user1': liker,
                'user2': likee
            }
            match_producer.send('user_matches', value=match_event)
        else:
            print('not matched yet')
            like_key = liker + '+' + likee
            redis_store.set(like_key, 1)

def add_to_checked_user_store(liker, likee):
    redis_store.lpush(liker, likee)
    redis_store.ltrim(liker, 0, 100)

@app.route('/', methods = ["GET"])
def index():
	return jsonify({"health": "good"})	

@app.errorhandler(Exception)
def handle_error(e):
    traceback.print_tb(e.__traceback__)
    code = 500
    if isinstance(e, HTTPException):
        code = e.code
    return jsonify(error=str(e)), code

if __name__ == '__main__':
    register_kafka_listener(like_consumer, kafka_like_listener)
    for ex in default_exceptions:
	    app.register_error_handler(ex, handle_error)
    app.run(debug=True, use_debugger=True)
