function obtenerDatosCandidatos() {
  const candidatos = document.querySelectorAll(".candidato");
  let totalVotos = 0;
  let datos = [];

  candidatos.forEach((c) => {
    const nombre = c.dataset.nombre;
    const partido = c.dataset.partido;
    const img = c.dataset.img;
    const votos = parseInt(c.querySelector(".voto").value) || 0;
    totalVotos += votos;
    datos.push({ nombre, partido, img, votos });
  });

  datos.sort((a, b) => b.votos - a.votos);
  return { datos, totalVotos };
}

function calcularResultados() {
  const mesa = document.getElementById("mesa").value;
  const fiscal = document.getElementById("fiscal").value;
  const resultadosDiv = document.getElementById("resultados");
  resultadosDiv.innerHTML = "";

  const { datos, totalVotos } = obtenerDatosCandidatos();

  datos.forEach((candidato) => {
    const porcentaje = totalVotos > 0 ? ((candidato.votos / totalVotos) * 100).toFixed(1) : "0.0";
    const bloque = document.createElement("div");
    bloque.className = "bloque-resultado";
    bloque.innerHTML = `
      <img src="${candidato.img}" alt="${candidato.nombre}" class="foto-candidato" />
      <p><strong>${candidato.nombre}</strong> (${candidato.partido})</p>
      <p>Votos: ${candidato.votos}</p>
      <p>Porcentaje: ${porcentaje}%</p>
    `;
    resultadosDiv.appendChild(bloque);
  });

  document.getElementById("acciones").style.display = "block";
}

function generarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const mesa = document.getElementById("mesa").value;
  const fiscal = document.getElementById("fiscal").value;
  const { datos, totalVotos } = obtenerDatosCandidatos();

  doc.setFontSize(16);
  doc.text("Cierre de Mesa - Castelli", 20, 20);
  doc.setFontSize(12);
  doc.text(`Mesa: ${mesa}`, 20, 30);
  doc.text(`Fiscal: ${fiscal}`, 20, 37);
  doc.text("Con orgullo y transparencia, Castelli cierra su jornada democrática.", 20, 45);

  let y = 55;
  let pendientes = datos.length;

  datos.forEach((candidato) => {
    const porcentaje = totalVotos > 0 ? ((candidato.votos / totalVotos) * 100).toFixed(1) : "0.0";
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = candidato.img;

    img.onload = () => {
      doc.addImage(img, "JPEG", 20, y, 30, 30);
      doc.text(`${candidato.nombre} (${candidato.partido})`, 55, y + 10);
      doc.text(`Votos: ${candidato.votos}`, 55, y + 17);
      doc.text(`%: ${porcentaje}%`, 55, y + 24);
      y += 40;
      pendientes--;
      if (pendientes === 0) doc.save(`Cierre_Mesa_${mesa}.pdf`);
    };

    img.onerror = () => {
      doc.text(`${candidato.nombre} (${candidato.partido})`, 20, y + 10);
      doc.text(`Votos: ${candidato.votos}`, 20, y + 17);
      doc.text(`%: ${porcentaje}%`, 20, y + 24);
      y += 40;
      pendientes--;
      if (pendientes === 0) doc.save(`Cierre_Mesa_${mesa}.pdf`);
    };
  });
}

function enviarWhatsApp() {
  const mesa = document.getElementById("mesa").value;
  const fiscal = document.getElementById("fiscal").value;
  const { datos, totalVotos } = obtenerDatosCandidatos();

  let mensaje = `Cierre de Mesa\nMesa: ${mesa}\nFiscal: ${fiscal}\n`;

  datos.forEach((candidato) => {
    const porcentaje = totalVotos > 0 ? ((candidato.votos / totalVotos) * 100).toFixed(1) : "0.0";
    mensaje += `${candidato.nombre} (${candidato.partido}): ${candidato.votos} votos (${porcentaje}%)\n`;
  });

  const url = `https://wa.me/5491168650195?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}
