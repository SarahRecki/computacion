const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const colors = [
  "rgb(22, 52, 64)", "rgb(57, 64, 57)", "rgb(191, 128, 11)", "rgb(166, 95, 8)",
  "rgb(166, 39, 10)", "rgb(8, 66, 89)", "rgb(57, 64, 57)", "rgb(166, 114, 18)",
  "rgb(166, 95, 8)", "rgb(166, 39, 10)", "rgb(28, 37, 38)", "rgb(140, 82, 11)",
  "rgb(166, 39, 10)", "rgb(140, 35, 11)", "rgb(166, 114, 18)", "rgb(89, 72, 39)",
  "rgb(140, 35, 11)"
];

const imagePaths = {
  capa1: ["img/cuadrado1.png", "img/cuadrado2.png", "img/cuadrado3.png", "img/triangulo1.png"],
  capa2: ["img/triangulo1.png", "img/triangulo2.png", "img/triangulo3.png", "img/cuadrado1.png", "img/cuadrado2.png", "img/cuadrado3.png"],
  capa3: ["img/triangulo1.png", "img/triangulo2.png", "img/triangulo3.png", "img/cuadrado1.png"]
};

const imageObjects = { capa1: [], capa2: [], capa3: [] };

// Cargar imágenes
Object.entries(imagePaths).forEach(([type, paths]) => {
  paths.forEach((path) => {
    const img = new Image();
    img.src = path;
    imageObjects[type].push(img);
  });
});

// Capas
const layer1 = [];
const layer2 = [];
const layer3 = [];

let layer1Drawn = false;
let layer2Drawn = false;
let layer3Drawn = false;

// Crear visual
function createVisual({ shape, x, y, size, angle, alpha }) {
  const images = imageObjects[shape];
  const image = images[Math.floor(Math.random() * images.length)];

  return {
    x,
    y,
    size,
    angle,
    alpha,
    image,
    tintColor: colors[Math.floor(Math.random() * colors.length)]
  };
}

// Dibuja con tinte
function drawTintedImage(image, x, y, size, angle, tintColor, alpha = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.globalAlpha = alpha;
  ctx.drawImage(image, -size / 2, -size / 2, size, size);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = tintColor;
  ctx.fillRect(-size / 2, -size / 2, size, size);
  ctx.globalCompositeOperation = "source-over";
  ctx.restore();
}

// Dibujo principal
function drawAllLayers() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  [...layer1, ...layer2, ...layer3].forEach((v) => {
    drawTintedImage(v.image, v.x, v.y, v.size, v.angle, v.tintColor, v.alpha);
  });

  requestAnimationFrame(drawAllLayers);
}
drawAllLayers();

// Evento de teclado
document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();

  if (key === 'a' && !layer1Drawn) {
    layer1.length = 0;

    const coordsLayer1 = [
      { x: 0, y: 1000, shape: "capa1" },
      { x: 200, y: 600, shape: "capa1" },
      { x: 700, y: 300, shape: "capa1" },
      { x: 1000, y: 300, shape: "capa1" },
      { x: 1300, y: 300, shape: "capa1" }
    ];

    coordsLayer1.forEach((pos) => {
      const size = 800;

      layer1.push(createVisual({
        shape: pos.shape,
        x: pos.x,
        y: pos.y,
        size,
        angle: 0,
        alpha: 0.9
      }));
    });

    layer1Drawn = true;
  }

  if (key === 'b' && !layer2Drawn) {
    layer2.length = 0;

    for (let i = 0; i < 15; i++) {
      layer2.push(createVisual({
        shape: "capa2",
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 150 + Math.random() * 80,
        angle: Math.PI / 4,
        alpha: 0.95
      }));
    }

    layer2Drawn = true;
  }

  if (key === 'c' && !layer3Drawn) {
    layer3.length = 0;

    for (let i = 0; i < 12; i++) {
      layer3.push(createVisual({
        shape: "capa3",
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 200 + Math.random() * 100,
        angle: Math.random() * Math.PI * 2,
        alpha: 1
      }));
    }

    layer3Drawn = true;
  }
});
