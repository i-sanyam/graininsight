import cv2
import numpy as np

PIXELS_PER_MILLIMETER = 1.111
MIN_GRAIN_SIZE = 5
MAX_GRAIN_SIZE = 200

def analyze_grains(image_path):
    # Load the raw image
    raw_image = cv2.imread(image_path)
    height, width = raw_image.shape[:2]

    # Convert the image to grayscale
    gray = cv2.cvtColor(raw_image, cv2.COLOR_BGR2GRAY)

    # Apply Gaussian blur to reduce noise
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Apply Canny edge detection
    edges = cv2.Canny(blurred, 50, 150)

    # Perform a dilation + erosion to close gaps in edges
    kernel = np.ones((3, 3), np.uint8)
    dilated_edges = cv2.dilate(edges, kernel, iterations=1)
    eroded_edges = cv2.erode(dilated_edges, kernel, iterations=1)

    # Compute the distance transform
    dist_transform = cv2.distanceTransform(eroded_edges, cv2.DIST_L2, 5)

    # Normalize the distance image for display
    dist_transform = cv2.normalize(dist_transform, None, 0, 1.0, cv2.NORM_MINMAX)

    # Threshold to obtain the peaks (Sure foreground)
    _, sure_fg = cv2.threshold(dist_transform, 0.3 * dist_transform.max(), 255, 0)
    sure_fg = np.uint8(sure_fg)

    # Use dilated edges to create sure background
    sure_bg = cv2.dilate(sure_fg, kernel, iterations=3)

    # Subtract the foreground from the background
    unknown = cv2.subtract(sure_bg, sure_fg)

    # Marker labelling
    _, markers = cv2.connectedComponents(sure_fg)

    # Add one to all labels so that sure background is not 0, but 1
    markers = markers + 1

    # Mark the unknown region with zero
    markers[unknown == 255] = 0

    # Apply watershed algorithm
    markers = cv2.watershed(raw_image, markers)

    # Mark boundaries where the watershed segmented the objects
    raw_image[markers == -1] = [255, 0, 0]

    # Find contours of the grains
    contours, _ = cv2.findContours(sure_fg, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Create a copy of the image to draw contours and numbers
    output_image_adaptive = raw_image.copy()

    # Initialize list to store the length of each grain
    adaptive_grain_lengths = []
    adaptive_grain_areas = []
    kernel_id = 0
    kernel_data = []


    # Loop through each contour to calculate the length and draw on the image
    for i, contour in enumerate(contours):
        # Fit a bounding rectangle around the contour
        x, y, w, h = cv2.boundingRect(contour)
        grain_length = max(w, h) / PIXELS_PER_MILLIMETER
        grain_area = cv2.contourArea(contour) / (PIXELS_PER_MILLIMETER ** 2)  # Convert area to square millimeters

        # Check if the contour is touching the boundary of the image
        if np.any(contour[:, 0, 0] <= 0) or np.any(contour[:, 0, 0] >= width - 1) or \
           np.any(contour[:, 0, 1] <= 0) or np.any(contour[:, 0, 1] >= height - 1):
            continue

        # Exclude noise by ensuring the grain length is within reasonable bounds
        if (grain_length > MIN_GRAIN_SIZE) & (grain_length < MAX_GRAIN_SIZE):  # Set a minimum size to filter out noise
            adaptive_grain_lengths.append(grain_length)
            adaptive_grain_areas.append(grain_area)
            kernel_id += 1
            # Draw the contour and tag the grain with a number
            cv2.drawContours(output_image_adaptive, [contour], -1, (0, 255, 0), 2)
            cv2.putText(output_image_adaptive, str(kernel_id), (x, y - 5), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            # Append kernel data
            kernel_data.append({
                "kernel_id": kernel_id,
                "grain_length": grain_length,
                "grain_area": grain_area
            })
                

    # Convert the grain lengths to a numpy array for statistical analysis
    adaptive_grain_lengths = np.array(adaptive_grain_lengths)
    adaptive_grain_areas = np.array(adaptive_grain_areas)

    # Calculate statistics
    adaptive_count = len(adaptive_grain_lengths)
    adaptive_avg_length = np.mean(adaptive_grain_lengths)
    adaptive_max_length = np.max(adaptive_grain_lengths)
    adaptive_min_length = np.min(adaptive_grain_lengths)
    adaptive_std_dev = np.std(adaptive_grain_lengths)
    adaptive_avg_area = np.mean(adaptive_grain_areas)

    return output_image_adaptive, {
        "count": adaptive_count,
        "average_length": adaptive_avg_length,
        "max_length": adaptive_max_length,
        "min_length": adaptive_min_length,
        "std_dev": adaptive_std_dev,
        "average_area": adaptive_avg_area,
        "min_area": np.min(adaptive_grain_areas),
        "max_area": np.max(adaptive_grain_areas),
        "kernel_data": kernel_data
    }