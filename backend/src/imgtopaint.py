from PIL import Image, ImageFilter
from io import BytesIO
import numpy as np
from sklearn.cluster import KMeans


def shrink_img(img: Image.Image, max_size: int = 600) -> Image.Image:
    """Makes an image smaller"""
    width, height = img.size

    # Don't do anything if the image is already small enough
    if max(width, height) <= max_size:
        return img

    scale = max_size / max(width, height)
    new_size = (int(width * scale), int(height * scale))
    img = img.resize(new_size, Image.LANCZOS)
    print(f"Image resized to {new_size}")
    return img


def get_centers(pixels, k = 20) -> np.ndarray:
    """Gets the color cluster centers of an image"""
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)

    # Fit the model
    kmeans.fit(pixels)

    # Extract cluster centers
    cluster_centers = kmeans.cluster_centers_.astype(int)
    centers = np.array(list(map(tuple, cluster_centers)))

    print(f"Cluster centers: {centers}")
    return centers


def replace_colors(pixels, centers, height, width) -> np.ndarray:
    """Replaces the colors of an image with the closest cluster center"""
    # Reshape pixels to a 2D array of HSV values
    pixels_reshaped = pixels.reshape(-1, 3)

    # Compute Euclidean distance to each center
    distances = np.linalg.norm(pixels_reshaped[:, None] - centers, axis=2)

    # Find the index of the closest center for each pixel
    closest_indices = np.argmin(distances, axis=1)

    # Replace pixels with closest center colors
    new_pixels = centers[closest_indices].reshape(height, width, 3)

    print(f"Pixels replaced with closest cluster centers")
    return new_pixels


def get_neighbors(x, y, h, w):
    """FOR replace_small_area: Returns 4-connected neighbors of (x, y)"""
    neighbors = []
    for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
        nx, ny = x + dx, y + dy
        if 0 <= nx < h and 0 <= ny < w:
            neighbors.append((nx, ny))
    return neighbors


def flood_fill(image, visited, x, y):
    """FOR replace_small_area: Performs flood fill and returns the area pixels and its border pixels"""
    h, w, _ = image.shape
    stack = [(x, y)]
    area_pixels = []
    border_pixels = set()
    color = image[x, y].tolist()

    while stack:
        cx, cy = stack.pop()
        if visited[cx, cy]:
            continue
        visited[cx, cy] = True
        area_pixels.append((cx, cy))

        for nx, ny in get_neighbors(cx, cy, h, w):
            if visited[nx, ny]:
                border_pixels.add((nx, ny))  # Border detected
            elif np.all(image[nx, ny] == color):  # Same color, expand flood fill
                stack.append((nx, ny))
            else:
                border_pixels.add((nx, ny))  # Edge detected

    return area_pixels, list(border_pixels)


def replace_small_areas(image, min_size=50):
    """Replaces small areas with the average color of their border pixels"""
    h, w, _ = image.shape
    visited = np.zeros((h, w), dtype=bool)

    for x in range(h):
        for y in range(w):
            if not visited[x, y]:
                area_pixels, border_pixels = flood_fill(image, visited, x, y)

                if len(area_pixels) < min_size:
                    # Compute the most frequent border color
                    if border_pixels:
                        border_colors = [tuple(image[px, py]) for px, py in border_pixels]
                        most_common_color = max(set(border_colors), key=border_colors.count)
                    else:
                        most_common_color = (0, 0, 0)  # Fallback if no border pixels found

                    # Replace small area with the average color
                    for px, py in area_pixels:
                        image[px, py] = most_common_color

    print(f"Small areas replaced with border colors")
    return image


def image_to_paint_by_numbers(img: BytesIO, k = 20, m = 50) -> Image.Image:
    """Converts an image to a paint-by-numbers image"""
    img = Image.open(img)

    # Make the image smaller
    img = shrink_img(img)

    # Convert the image to HSV for better color comparison
    img = img.convert("HSV")

    # Get width and height
    width, height = img.size

    # Get pixels
    pixels = np.array([img.getpixel((x, y)) for y in range(height) for x in range(width)])

    # Get cluster centers
    centers = get_centers(pixels, k=k)

    # Replace colors with closest cluster center
    new_pixels = replace_colors(pixels, centers, height, width)

    # Replace small areas with the average color of their border pixels
    # DO THIS TWICE BC BETTER EFFECT
    new_pixels = replace_small_areas(new_pixels, min_size=m)
    new_pixels = replace_small_areas(new_pixels, min_size=m)
    
    # Convert array back to an image and save/show it
    new_img = Image.fromarray(np.uint8(new_pixels), mode="HSV").convert("RGB")

    # Resize to double the size
    scaled_image = new_img.resize((width * 4, height * 4), Image.NEAREST)

    print(f"Image converted to paint-by-numbers DONE!")
    return scaled_image


if __name__ == "__main__":
    temp_img = Image.open("test/test.jpeg")
    img_io = BytesIO()
    temp_img.save(img_io, format="PNG")

    # Convert image to paint-by-numbers
    img = image_to_paint_by_numbers(img_io)
    img.save("test/output.png")
