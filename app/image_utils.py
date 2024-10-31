import base64
import cv2
import os
from io import BytesIO

def validate_image_size(image_file, max_size_kb):
    """
    Check the size of the uploaded image.

    :param image_file: The uploaded image file.
    :param max_size_kb: The maximum allowed size in kilobytes.
    :return: A boolean indicating
             true: if the image size is valid
             false: if the image size is invalid.
    """
    image_file.seek(0, os.SEEK_END)  # Move the cursor to the end of the file
    image_size = image_file.tell()  # Get the current position of the cursor, which is the size of the file
    if image_size > max_size_kb * 1024:  # Convert KB to bytes
        return False
    image_file.seek(0, os.SEEK_SET)  # Move the cursor back to the start of the file
    return True

def convert_image_to_base64(image_file, image_format = '.jpg'):
    """
    Convert an image_file with image_format to base64 format.

    :param image_format: The format of the image file.
    :param image_file: The image file to convert.
    :return: The base64 string for the image file.
    """
    _, buffer = cv2.imencode(image_format, image_file)
    image_bytes = BytesIO(buffer)
    image_base64 = base64.b64encode(image_bytes.getvalue()).decode('utf-8')
    return image_base64