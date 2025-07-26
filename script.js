
let dati = JSON.parse(localStorage.getItem('frasi_libri') || '[]');
let modificaIndice = -1;

const form = document.getElementById('form');
const lista = document.getElementById('lista');

form.onsubmit = e => {
  e.preventDefault();
  const record = {
    frase: form.frase.value,
    libro: form.libro.value,
    autore: form.autore.value,
    capitolo: form.capitolo.value,
    paragrafo: form.paragrafo.value,
    tags: form.tags.value,
    note: form.note.value,
    data: form.data.value,
    note: form.note.value,
    data: form.data.value
  };
  if (modificaIndice >= 0) {
    dati[modificaIndice] = record;
    modificaIndice = -1;
  } else {
    dati.push(record);
  }
  salva();
  form.reset();
};

function salva() {
  localStorage.setItem('frasi_libri', JSON.stringify(dati));
  mostra();
}

function mostra() {
  lista.innerHTML = '';
  document.getElementById("conteggio").textContent = `Risultati trovati: ${filtrati.length}`;
  const ff = id => document.getElementById(id).value.toLowerCase();
  const filtrati = dati.filter(f =>
    f.frase.toLowerCase().includes(ff('filtroFrase')) &&
    f.libro.toLowerCase().includes(ff('filtroLibro')) &&
    f.autore.toLowerCase().includes(ff('filtroAutore')) &&
    f.capitolo.toLowerCase().includes(ff('filtroCapitolo')) &&
    f.paragrafo.toLowerCase().includes(ff('filtroParagrafo')) &&
    f.tags.toLowerCase().includes(ff('filtroTags')) &&
    f.note.toLowerCase().includes(ff('filtroNote')) &&
    f.data.includes(document.getElementById("filtroData").value) &&
    f.note.toLowerCase().includes(ff('filtroNote')) &&
    f.data.includes(document.getElementById("filtroData").value)
  );
  filtrati.forEach((f, i) => {
    const div = document.createElement('div');
    div.className = 'quote';
    div.innerHTML = `
      <blockquote>“${f.frase}”</blockquote>
      <small>${f.autore}, <em>${f.libro}</em></small>
      <div class="tags">Capitolo: ${f.capitolo || '-'}, Paragrafo: ${f.paragrafo || '-'}</div>
      <div class="tags">Tag: ${f.tags}</div><div class="tags">Note: ${f.note || "-"}, Data: ${f.data || "-"}</div>
      <div class="tags">Note: ${f.note || "-"}, Data: ${f.data || "-"}</div>
      <div class="actions">
        <button onclick="modifica(${i})">Modifica</button>
        <button onclick="elimina(${i})">Elimina</button>
      </div>
    `;
    lista.appendChild(div);
  });
}

function modifica(i) {
  const f = dati[i];
  form.frase.value = f.frase;
  form.libro.value = f.libro;
  form.autore.value = f.autore;
  form.capitolo.value = f.capitolo;
  form.paragrafo.value = f.paragrafo;
  form.tags.value = f.tags;
  form.note.value = f.note || '';
  form.data.value = f.data || '';
  form.note.value = f.note || '';
  form.data.value = f.data || '';
  modificaIndice = i;
  window.scrollTo(0, 0);
}

function elimina(i) {
  if (confirm('Eliminare questa frase?')) {
    dati.splice(i, 1);
    salva();
  }
}

function esporta() {
  const ff = id => document.getElementById(id).value.toLowerCase();
  const filtrati = dati.filter(f =>
    f.frase.toLowerCase().includes(ff('filtroFrase')) &&
    f.libro.toLowerCase().includes(ff('filtroLibro')) &&
    f.autore.toLowerCase().includes(ff('filtroAutore')) &&
    f.capitolo.toLowerCase().includes(ff('filtroCapitolo')) &&
    f.paragrafo.toLowerCase().includes(ff('filtroParagrafo')) &&
    f.tags.toLowerCase().includes(ff('filtroTags')) &&
    f.note.toLowerCase().includes(ff('filtroNote')) &&
    f.data.includes(document.getElementById("filtroData").value) &&
    f.note.toLowerCase().includes(ff('filtroNote')) &&
    f.data.includes(document.getElementById("filtroData").value)
  );
  let csv = 'Frase,Libro,Autore,Capitolo,Paragrafo,Tag\n';
  filtrati.forEach(f => {
    csv += `"${f.frase.replace(/"/g, '""')}","${f.libro}","${f.autore}","${f.capitolo}","${f.paragrafo}","${f.tags}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'frasi_filtrate.csv';
  link.click();
}


mostra();

document.getElementById("filtroNote").oninput = mostra;
document.getElementById("filtroData").oninput = mostra;
