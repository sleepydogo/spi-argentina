import redis
import json

class RedisHandler:
    def __init__(self, host='localhost', port=6379, db=0):
        # Inicializa la conexión a Redis
        try:
            self.redisObject = redis.Redis(host=host, port=port, db=db)
            self.redisObject.ping()  # Verifica la conexión
            print("Connected to Redis")
        except redis.ConnectionError as e:
            print(f"Failed to connect to Redis: {e}")
            self.redisObject = None

    def saveObject(self, key, obj, ttl=600):
        # Guarda un objeto en Redis con un TTL
        if self.redisObject:
            try:
                obj_json = json.dumps(obj)
                self.redisObject.set(key, obj_json, ex=ttl)  # ex establece el TTL en segundos
                print(f"Object saved with key: {key} and TTL of {ttl} seconds")
            except Exception as e:
                print(f"Error saving object to Redis: {e}")
        else:
            print("Redis connection is not established.")

    def getObject(self, key):
        # Obtiene un objeto de Redis
        if self.redisObject:
            try:
                obj_json = self.redisObject.get(key)
                if obj_json:
                    obj = json.loads(obj_json)
                    print(f"Object retrieved with key: {key}")
                    return obj
                else:
                    print(f"No object found with key: {key}")
                    return None
            except Exception as e:
                print(f"Error retrieving object from Redis: {e}")
                return None
        else:
            print("Redis connection is not established.")
            return None

    def deleteObject(self, key):
        # Elimina un objeto de Redis
        if self.redisObject:
            try:
                result = self.redisObject.delete(key)
                if result:
                    print(f"Object deleted with key: {key}")
                else:
                    print(f"No object found with key: {key}")
            except Exception as e:
                print(f"Error deleting object from Redis: {e}")
        else:
            print("Redis connection is not established.")


class RedisHandlerDrivers:
    def __init__(self, host='localhost', port=6379, db=0):
        # Conectar a Redis
        self.redis = redis.StrictRedis(host=host, port=port, db=db, decode_responses=True)
    
    def save_driver(self, driver_id, lat, lon):
        # Agregar la ubicación del conductor en Redis
        self.redis.set(driver_id, json.dumps([lat, lon]))
    
    def get_driver_location(self, driver_id):
        # Obtener la ubicación del conductor desde Redis
        location = self.redis.get(driver_id)
        print(location)
        if location:
            return json.loads(location)
        return None
    
    def get_all_drivers(self):
        # Obtener todas las ubicaciones de los conductores desde Redis
        drivers = []
        for key in self.redis.keys():
            drivers.append([key, self.redis.get(key)])
        return drivers
    
    def remove_driver(self, driver_id):
        # Eliminar la ubicación del conductor de Redis
        self.redis.delete(driver_id)


redsDrivers = RedisHandlerDrivers()
redisHandler = RedisHandler()