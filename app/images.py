import falcon
import base64
import json
import time
import re
from typing import Tuple


def parse(data: str) -> Tuple[str, bytes]:
    if not data or len(data) < 5 or data[:5] != 'data:':
        raise ValueError('data must be started with "data:"')

    rest = data[5:]
    try:
        split = rest.index(',')
    except ValueError as e:
        if 'substring not found' in str(e):
            raise ValueError('data must have a delimiter ","')
        else:
            raise e
    mediatype = rest[:split]
    is_base64 = re.search(r';base64$', mediatype)
    if is_base64:
        mediatype = mediatype[:-6]

    contents = rest[split + 1:]
    if is_base64:
        contents = base64.urlsafe_b64decode(contents)
    return mediatype, contents


class Images(object):
    """

    """
    ALLOWED_EXT = ['jpg', 'jpeg', 'png']

    def __init__(self, infer_fn):
        self.infer_fn = infer_fn

    def on_get(self, req: falcon.Request, res: falcon.Response) -> None:
        """

        :param req:
        :param res:
        :return:
        """
        doc = {
            'message': 'hoge'
        }

        res.body = json.dumps(doc, ensure_ascii=False)
        res.status = falcon.HTTP_200

    def on_post(self, req: falcon.Request, res: falcon.Response) -> None:
        img = str(req.get_param('img', required=True))
        mediatype, imgbytes = parse(img)

        started = time.time()
        result = self.infer_fn(imgbytes)
        elapsed = time.time() - started

        body = {
            'result': result,
            'infer_secs': elapsed
        }
        res.status = falcon.HTTP_200
        res.body = json.dumps(body, ensure_ascii=False)
