import falcon
from falcon_multipart.middleware import MultipartMiddleware
from falcon_cors import CORS
from .images import Images
from .ssd import inference

cors = CORS(allow_all_origins=True, allow_all_methods=True, allow_all_headers=True)
api = application = falcon.API(middleware=[cors.middleware, MultipartMiddleware()])
api.add_route('/images', Images(infer_fn=inference))