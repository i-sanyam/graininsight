import os

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