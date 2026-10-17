// navecita.js
// Define el "molde" (constructor) de la nave: sus datos y cómo se dibuja.
// La imagen del biplano está dibujada de lado y mirando hacia la IZQUIERDA.

function Navecita(rutaNave, rutaFlama, ancho) {
  this.x = 0;
  this.y = 0;
  this.vx = 0;              // velocidad en X
  this.vy = 0;              // velocidad en Y
  this.rotation = 0;        // inclinación en radianes (nariz arriba / abajo)
  this.direccion = 1;       // 1 = mira a la derecha, -1 = mira a la izquierda
  this.empuje = 0;          // 0 a 1, qué tanto está acelerando
  this.showFlame = false;   // true = se dibuja la flama (si hay imagen de flama)
  this.ancho = ancho || 120; // ancho con el que se dibuja en el canvas

  // Las imágenes se cargan UNA sola vez aquí, no en cada frame
  this.imgNave = this.cargarImagen(rutaNave);
  this.imgFlama = this.cargarImagen(rutaFlama);
}

Navecita.prototype.cargarImagen = function (ruta) {
  if (!ruta) return null;
  var img = new Image();
  img.listo = false;
  img.onload = function () { img.listo = true; };
  img.src = ruta;
  return img;
};

// Tamaño real con el que se ve la nave (sirve para los límites del canvas)
Navecita.prototype.medidas = function () {
  if (this.imgNave && this.imgNave.listo) {
    return { ancho: this.ancho, alto: this.ancho * (this.imgNave.height / this.imgNave.width) };
  }
  return { ancho: 52, alto: 48 }; // medidas de la nave provisional
};

Navecita.prototype.draw = function (context, t) {
  var m = this.medidas();

  context.save();
  context.translate(this.x, this.y);
  context.rotate(this.rotation);

  if (this.imgNave && this.imgNave.listo) {
    // La imagen original mira a la izquierda: se voltea si va hacia la derecha
    if (this.direccion === 1) context.scale(-1, 1);
    context.drawImage(this.imgNave, -m.ancho / 2, -m.alto / 2, m.ancho, m.alto);

    if (this.showFlame && this.imgFlama && this.imgFlama.listo) {
      context.drawImage(this.imgFlama, -m.ancho / 2, -m.alto / 2, m.ancho, m.alto);
    }
  } else {
    // Sin imagen: nave provisional dibujada con código (mira a la derecha)
    if (this.direccion === -1) context.scale(-1, 1);
    this.dibujarProvisional(context, t || 0);
  }

  context.restore();
};

Navecita.prototype.dibujarProvisional = function (ctx, t) {
  // Llama del propulsor
  if (this.showFlame) {
    var largo = 10 + this.empuje * 22 + Math.random() * 5;
    var llama = ctx.createLinearGradient(-14, 0, -14 - largo, 0);
    llama.addColorStop(0, "rgba(255,240,160,0.95)");
    llama.addColorStop(0.5, "rgba(255,140,40,0.7)");
    llama.addColorStop(1, "rgba(255,60,0,0)");
    ctx.fillStyle = llama;
    ctx.beginPath();
    ctx.moveTo(-12, -6);
    ctx.lineTo(-14 - largo, 0);
    ctx.lineTo(-12, 6);
    ctx.closePath();
    ctx.fill();
  }

  // Alas
  ctx.fillStyle = "#2b5d8a";
  ctx.strokeStyle = "#9bd8ff";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(6, -4);
  ctx.lineTo(-14, -24);
  ctx.lineTo(-10, -4);
  ctx.closePath();
  ctx.moveTo(6, 4);
  ctx.lineTo(-14, 24);
  ctx.lineTo(-10, 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Cuerpo
  var cuerpo = ctx.createLinearGradient(0, -10, 0, 10);
  cuerpo.addColorStop(0, "#e8f4ff");
  cuerpo.addColorStop(1, "#6f8fb0");
  ctx.fillStyle = cuerpo;
  ctx.beginPath();
  ctx.moveTo(26, 0);
  ctx.quadraticCurveTo(10, -11, -14, -7);
  ctx.lineTo(-14, 7);
  ctx.quadraticCurveTo(10, 11, 26, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Cabina
  ctx.fillStyle = "rgba(80,220,255,0.9)";
  ctx.beginPath();
  ctx.ellipse(8, 0, 7, 3.5, 0, 0, 6.283);
  ctx.fill();
};
