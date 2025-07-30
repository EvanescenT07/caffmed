from PIL import Image
import numpy as np
import io

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def load_upload_image(image_bytes):
    try:
        image = Image.open(io.BytesIO(image_bytes))
        image = image.resize((244,244))
        image_array = image.convert('RGB')
        image_array = np.array(image_array) / 255.0  # Normalize the image
        return image_array
    except Exception as e:
        return f"Error processing image: {str(e)}"
        
def suspicious_input(image_bytes):
    try:
        image = Image.open(io.BytesIO(image_bytes))
        if image.mode not in ['RGB', 'L']:
            return True
        if image.size[0] < 200 or image.size[1] < 200:
            return True
        return False
    except Exception as e:
        return True