from flask import Flask, request, send_file
from flask_cors import CORS
from io import BytesIO
from src.imgtopaint import image_to_paint_by_numbers

app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return "Hello, World!"


@app.route("/generate", methods=["POST"])
def generate():
    # Get parameters from the request
    img = request.files["image"]
    k = int(request.form.get("k", 20))
    m = int(request.form.get("m", 50))

    # Convert the image to a paint-by-numbers image
    paint_by_numbers = image_to_paint_by_numbers(img, k, m)

    # Save the image to a BytesIO object
    img_io = BytesIO()
    paint_by_numbers.save(img_io, format="PNG")
    img_io.seek(0)

    # Return the image
    return send_file(img_io, mimetype="image/png")


if __name__ == '__main__':
    app.run(debug=True)
