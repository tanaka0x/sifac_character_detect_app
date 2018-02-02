import os
import io
from typing import Any, Dict, List
import numpy as np
import tensorflow as tf
from PIL import Image
from keras.backend.tensorflow_backend import set_session
from keras.preprocessing import image
from keras.applications.imagenet_utils import preprocess_input
from ssd.ssd import SSD300
from ssd.ssd_utils import BBoxUtility

np.set_printoptions(suppress=True)

config = tf.ConfigProto(
    device_count={'GPU': 0}
)
sess = tf.Session(config=config)
set_session(sess)

voc_classes = [
    "honoka",
    "eli",
    "kotori",
    "umi",
    "rin",
    "maki",
    "hanayo",
    "nico",
    "nozomi"
]

NUM_CLASSES = len(voc_classes) + 1
input_shape=(300, 300, 3)
model = SSD300(input_shape, num_classes=NUM_CLASSES)
weight_file = './checkpoints/weights.31-1.40.hdf5'
model.load_weights(weight_file, by_name=True)
bbox_util = BBoxUtility(NUM_CLASSES)
# sess.graph.finalize()


def _adjust_inference(result, img_shape, threshold=0.7):
    # Parse the outputs.
    det_label = result[:, 0]
    det_conf = result[:, 1]
    det_xmin = result[:, 2]
    det_ymin = result[:, 3]
    det_xmax = result[:, 4]
    det_ymax = result[:, 5]

    # Get detections with confidence higher than 0.6.
    top_indices = [i for i, conf in enumerate(det_conf) if conf >= threshold]

    top_conf = det_conf[top_indices]
    top_label_indices = det_label[top_indices].tolist()
    top_xmin = det_xmin[top_indices]
    top_ymin = det_ymin[top_indices]
    top_xmax = det_xmax[top_indices]
    top_ymax = det_ymax[top_indices]

    adjusted = []
    for i in range(top_conf.shape[0]):
        xmin = int(round(top_xmin[i] * img_shape[1]))
        ymin = int(round(top_ymin[i] * img_shape[0]))
        xmax = int(round(top_xmax[i] * img_shape[1]))
        ymax = int(round(top_ymax[i] * img_shape[0]))
        score = top_conf[i]
        label = int(top_label_indices[i])
        label_name = voc_classes[label - 1]
        adjusted.append({
            'xmin': xmin, 'ymin': ymin,
            'xmax': xmax, 'ymax': ymax,
            'score': score, 'label': label_name,
            'label_id': label
        })
    return adjusted


def inference(bytes_from_req: bytes) -> List[Dict[str, Any]]:
    bytesio = io.BytesIO(bytes_from_req)
    img = Image.open(bytesio)
    if img.mode != 'RGB':
        img = img.convert('RGB')
    original_shape = image.img_to_array(img).shape

    resized = img.resize(input_shape[:2])
    img_array = image.img_to_array(resized)

    inputs = preprocess_input(np.array([img_array]))
    preds = model.predict(inputs, batch_size=1)
    results = bbox_util.detection_out(preds)

    return _adjust_inference(results[0], img_shape=original_shape, threshold=0.6)

