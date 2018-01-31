import falcon
from falcon_multipart.middleware import MultipartMiddleware
from .images import Images
from .ssd import inference

api = application = falcon.API(middleware=[MultipartMiddleware()])
api.add_route('/images', Images(infer_fn=inference))